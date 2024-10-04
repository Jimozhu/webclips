---
title: Facebook 的温存储系统：f4
date: 2024-10-04T15:30:37.641Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/61552666
---
## **概览**

首先说下 BLOB 的意思， 英文全称是 *Binary Large OBjects*，可以理解为任意二进制格式的大对象；在 Facebook 的语境下，也就是用户在账户里上传的的图片，视频以及文档等数据，这些数据具有*一次创建，多次读取，不会修改，偶尔删除* 的特点。

之前简单翻译了 Facebook 的前驱之作 —— Haystack，随着业务量发展，数据量进一步增大，过去玩法又不转了，如果所有 BLOG 都用 Haystack 存，由于其三备份的实现，在这个量级下，性价比很低。但是完全用网络挂载 + 传统磁盘 + Unix-like（POSIX）文件系统等冷存储，读取跟不上。于是计算机科学中最常用的**分而治之**的思想登场了。

他们首先统计了 BLOBs 的访问频次与创建时间的关系，然后提出了随着时间推移 BLOB 访问出现的冷热分布概念（和长尾效应差不多）。并据此提出了热、温分开的访问策略：用 HayStack 当做热存储去应对那些频繁访问的流量，然后用 F4 去响应剩下的不那么频繁访问的 BLOB 流量，在此假设（F4 只存储那些基本不怎么变动，访问量相对不大的数据）前提下，可以大大简化 F4 的设计。当然有个专门的**路由层**于两者之上进行了屏蔽，并进行决策和路由。

对于 Haystack 来说，从其论文出来时，已经过去了七年（07\~14）。相对于当时，做了少许更新，比如说去掉了 Flag 位，在 *data file*，*Index file* 之外，增加了 *journal file*，专门用来记录被删除的 BLOB 条目。

对于 F4 来说，主要设计目的在于保证容错的前提下尽可能的减小***有效冗余倍数***（*effective-replication-factor*），以应对日益增长的***温数据*** 存取需求。此外更加模块化，可扩展性更好，即能以加机器方式平滑扩展应对数据的不断增长。

我总结一下，本论文主要高光点就是**温热分开，冗余编码，异地取或**。

*作者：青藤木鸟 *[Muniao's blog](https://link.zhihu.com/?target=https%3A//www.qtmuniao.com/)* 转载请注明出处*

## **数据量级**

到 2014 年，Facebook 大概有超 4000 亿张图片。

## **访问频度的热力图**

论文的结论是，*访问频度的热力图是存在的，创建时间是影响其变化关键因子，而且**温部数据**是持续增长的*。

论文的度量方法也很简单，就是追踪其网站上不同类型的 BLOB 数据的访问频次随着创建时间变化曲线，创建时间小于一天的数据的访问频次大概是创建时间一年的数据的 100 多倍。具体数据就不列了，可以去 paper 里看。

然后论文探讨了区分**热数据**和**温数据**的一个界限，通过对访问频次和删除频次随着创建时间的变化的分析，对于大部分 BLOG，得到了一个的大概值：一个月。但是有两个例外，一个是用户头像，一直是热数据；另外一个普通图片，使用三个月作为阈值。

热数据总是那些头部数据，相对来说增长较慢。但是历史数据，也就是**温数据**是随着时间推移而尾巴越来越长，这势必要求存储架构进行相应的调整。

## **存储系统总体架构**

设计原则是让每个组件尽可能简单、内聚并且高度契合其要承担的工作。这是从 UNIX 以来就一直在强调的一个原则。下图是总体架构图，包括创建（C1-C2，由 Haystack 负责），删除（D1-D2，大部分是 Haystack 负责，少部分是 f4 负责）和读取（R1-R4 由 Haystack 和 f4 共同负责）。

![](https://picx.zhimg.com/v2-d4fc3cffad440329dae73e6006764385_b.jpg)

如前述论文 Haystack 所述，我们将一批 BLOG 集结为**逻辑卷**，尽可能减少 meta 信息，从而减少 IO 次数。每个逻辑卷我们设计了 100G 左右的容量，在满之前是为 *未锁定* （*unlocked*） 的状态，一旦达到容量，就变为*锁定*（*locked*）状态，只允许读取和删除。

每个卷包含三个文件，一个数据文件，一个索引文件和一个备忘文件（journal file）。和 Haystack 论文提到的一样，数据文件就是记录 BLOG 本身和其元信息，索引文件就是内存中的查找结构的快照。备忘文件是新增的，它通过记录所有被删除的 BLOG 的记录来进行删除操作。而原 Haystack 论文中，删除文件是通过直接修改索引文件和数据文件来实现的。在**未锁定**阶段，三个文件均可读写，在**锁定**阶段，只有备忘文件可以读写，其他两个文件都会变成只读的。

### &#x20;**控制模块（Controller）**&#x20;

统筹整个系统，比如提供新的存储机器；维持一个未锁定卷（unlocked volumes ）的池子；确保所有逻辑卷有足够的物理卷来备份；根据需求适时创建物理卷；进行周期性的维护任务，比如说数据紧缩（compaction）和垃圾回收。

### &#x20;**路由层（Route Tier）**&#x20;

路由层负责 BLOB 存储系统向对外提供接口，它隐藏了系统底层的实现，使得可以方便添加如 f4 一样的子系统。所有的路由层的机器角色都是一样的，因为该层将所有状态（如逻辑卷到物理卷的映射）都存在了另外的数据库里（***将所有相关状态收集起来额外存储，使得剩下的部分无状态可以平滑扩展，这也是系统设计常用的原则***）。这使得路由层的可以不依赖其他模块来平滑扩展。

对于读取请求，路由模块会从 BLOB id 中解析出 逻辑卷 id，然后根据数据库中读出的映射关系来找到对应的所有物理卷信息。一般来说会从最近一个主机取数据，如果失败的话，会产生一个超时事件，去下一个物理卷所在的主机进行尝试。

对于创建请求，路由模块会选取一个有空闲空间的逻辑卷，然后将 BLOB 发送到该逻辑卷对应的所有物理卷进行写入（是并行发，还是链式发还是串行发？）如果遇到任何问题，就会中断写，并且已经写入的数据会被废弃，且户重新挑选一个可用逻辑卷，重复上述过程。（看起来像并行写，容错策略也超级粗暴）

对于删除请求，路由模块会将其发送到所有对应的物理卷（然后就快速返回），然后对应物理主机程序会**异步**的进行删除，遇到错误就一直重试，直到成功删除所有对应物理卷上的对应 BLOB。（倒也简单，但不知道实现的时候是会写入 journal file 后返回，还是只是在内存中标记下就返回。对应的数据文件上的 BLOB 肯定是在 compact 的时候才会删掉）。

路由层将实现细节隐藏，从而（对用户）无感知地构建温存储，当一个卷被从热存储移到温存储的时候，会在两者上同时存在一段时间，直到有效（逻辑卷到物理卷）的映射被更新后，客户端的请求将被无感知的地导向温存储。

### &#x20;**转换层（Transformer Tier）**&#x20;

转换层负责处理对检索到的 BLOB 数据的变换操作，比如图片的缩放和裁剪。在 Facebook 的老版本的系统中，这些计算密集型的操作会在存储节点上完成。

增加转换层可以解放存储节点，使其专注于提供存储服务。将计算任务分离出来也有利于将存储层和转换层进行独立的扩展。然后，它也可以让我们精确地控制存储节点的容量以恰好满足需求。更进一步，也可以使我们针对不同任务类型进行更优的硬件选型。比如说我们可以将存储节点设计为具有大量硬盘，但只有一个 CPU 和少量内存。

### &#x20;**缓存栈（Caching Stack）**&#x20;

一开始是为了处理热点 BLOB 数据的请求，缓解后端存储系统的压力。对于温存储来说，它也可以减小其请求压力。这里说的应该是 CDN 以及类似 akamai 内容分发商提供的缓存。

### &#x20;**Haystack 热存储（Hot Storage with Haystack）**&#x20;

Haystack 开始是被设计来尽可能的提高 IOPS 的，通过揽下所有创建请求，大部分的删除请求和高频读请求，使得温存储的设计可以大大简化。

如相关 paper 提到的，Haystack 通过合并 BLOB 和简化元信息使得 IOPS 大大提高。具体来说，包括将逻辑卷设计为集合了一批 BLOB 的单个文件，利用三个物理卷对同一个逻辑卷进行冗余备份等等。

读请求过来后，会在内存中拿到请求的 BLOB 的元信息，并且看其是否被删除，然后通过物理文件位置 + offset + size ，仅进行一次 IO 拿到对应 BLOB 数据。

当主机收到创建请求后，会同步的将 BLOB 数据追加到数据文件上，然后更新内存中的元信息并将更改写入索引文件和备忘文件中（备忘文件不是只记录删除操作吗？）。

当主机收到删除请求时，会更新索引文件和备忘文件。但是对应数据仍然存在于数据文件中，定期地我们会进行紧缩操作，才会真正的删除数据，并回收相应空间。

### &#x20;**容错（Fault tolerance）**&#x20;

Haystack 通过在一个数据中心的不同机架上各放一个副本，然后再不同数据中心再放一个副本的三副本策略获得了对硬盘，主机，机架甚至数据中心的容错能力。然后通过 RAID-6（1.2 倍冗余数据编码，能够小范围的纠正错误，可以读读纠错码之类的文章）进行额外的硬盘容错，更上一层保险。但是付出的代价是 3\*1.2 = 3.6 倍的有效冗余因子，这也是 Haystack 的局限之处，虽然最大化了 IOPS，但是在存储使用上却并不高效，造成了很多 BLOB 的数据冗余。

### &#x20;**暂存内容驱动（Expiry-Driven Content）**&#x20;

有些类型的 BLOB 具有一定的过期时间，比如说用户上传的视频，会从原始格式转化为我们的存储格式。在此之后原始视频需要删掉。我们会避免将此类具有过期时间的数据移动到 F4 上，从而让 Haystack 负责这些频繁的删除请求，并通过频繁紧缩来回收空间。

## **f4 设计**

设计目标是在容错的基础上尽可能高效。也就是在能够容忍硬盘错误、主机故障、机架问题甚至数据中心灾难的前提下，把实际冗余因子降一降。

### &#x20;**f4 概览（f4 Overview）**&#x20;

f4 是温数据存储架构的子系统。包含一系列 数据单元（cell），每个 cell 都在同一个数据中心（机房，datacenter）里。当前（2014）的 cell 包含 14 个机架，每个机架有 15 个主机，每个主机有三十块 4T 容量的硬盘。cell 负责存储逻辑卷，每个逻辑卷实际存储时，会将数据利用[里所码](https://link.zhihu.com/?target=https%3A//zh.wikipedia.org/wiki/%25E9%2587%258C%25E5%25BE%25B7-%25E6%2589%2580%25E7%25BD%2597%25E9%2597%25A8%25E7%25A0%2581)（Reed-Solomon coding，简称 RS，这是前面提到的 RAID-6 标准的重要成员）进行冗余编码，比如 RS (n, k) 就是每存 n 个比特，就要编入额外的 k 个比特，以此来容忍最多 k 个比特的出错。通过这种编码方式可以解决硬盘，主机和机架出错问题。

此外利用异或编码（XOR coding）来解决跨数据中心或者地理位置的出错问题。我们选取两个不同机房的对等数量 volume/stripe/block 结成对子，然后将每一对的异或值存在第三个机房。

### &#x20;**单个 f4 cell（Individual f4 Cell）**&#x20;

每个 f4 数据单元（cell） 只处理锁定的卷（Volume），也就是只用支持读取和删除操作。数据文件和索引文件都是只读的，Haystack 中的备忘文件在 f4 中是不存在的。我们用了另一种方式来达到 “删除” 的效用，将每个 BLOB 进行加密后存储，将用于加密的秘钥（key）存在一个外部数据库中。响应删除请求时，**只需要将 BLOB 对应的秘钥删掉就行**（有点绝，对用户提供了隐私保证，而且将删除操作的延时降到很低）。

索引文件占空间比较少，直接用了三副本存储来保证可靠性，可以省去编解码带来的额外复杂度。数据文件用 n=10, k = 4 的里所码进行编码。具体来说，将每个数据文件切分为 n 个连续的数据块（block），每个具有固定尺寸 b（最后一个块不满，而又写不进去一个新 BLOB 的情况下，在结尾补零，***类似这种打 padding 也是数据对齐常用的手法***）；对于每 n 个这样的块，生成 k 个同样尺寸的*奇偶校验块*（parity block），这样 n+k 个数据块构成一个逻辑上的 *条带*（stripe）。同一条带上的任意两个块互称为**兄弟块**（companion block）。正常读取时，可以直接从数据块中读（我猜是那 n 个块，不用额外进行计算还原，有待考证，还得看里所码原理以及具体实现）。如果某些块不可用了，就会在同一条带上任取 n 块，解码后还原；此外还有个性质，就是读取 n 个 block 上对应的 n 截数据（比如某个 BLOB），也可以进行解码（这两个性质都是编码决定的，类似于 n 元线性方程组，有 k 个冗余方程）。

![](https://pic1.zhimg.com/v2-6846569903bb76c6753c1b408596e3c4_b.jpg)

通常 b 为 1G，即每个数据块（Block）选取 1G 大小（这有个疑问，看起来每个 Block 仍在 Volume 中，而不是单独拿出来，那么定位一个物理 block 是不是就得通过 volume 文件打开句柄 + offset + length），选这么大有两方面的考虑，一个是尽量减小 BLOB 的跨块概率，以减少读取一个 BLOB 还得多次 IO 的频率；另一个是降低 block 所需要维护的总元信息数量。不选更大的是因为重建起来会付出更大代价（但为什么就是 1G 呢？）。

下图是架构图，接下来逐一介绍下各个模块。

![](https://picx.zhimg.com/v2-d4fc3cffad440329dae73e6006764385_b.jpg)

### &#x20;**名字节点（Name Node）**&#x20;

name node 维护了*数据块*、*奇偶校验块* 到实际存储这些块的存储节点（也就是下一节的存储节点）之间的映射；这些映射（利用标准技术？还说参考了 GFS，这没大看懂，留个坑回头读 GFS 填上）分配到存储节点中。名字节点使用主从备份策略进行容错。

### &#x20;**存储节点（Storage Nodes）**&#x20;

存储节点是 Cell 的主要组件，处理所有常规的读取和删除请求。对外暴露两个 API：Index API 负责提供 Volume 的有无检查和位置信息；File API 提供实际的数据访问。（*File API 与 Data API 的区别估计在于，前者是提供上层抽象 BLOB 的操作接口，而后者会暴露底层数据块 Block 的访问的接口*）

存储节点将 index file （包括 BLOB 到 volume 的映射，偏移量和长度）存在硬盘上，并且加载到自定义存储结构的内存中。此外还维持了 volume 偏移量到物理数据块的映射（由于一个 volume 被整齐的切成了好多 block， 因此定位一个数据块的逻辑位置，需要记下他的所在 volume+offset）。上述两个信息都被存在内存里，以避免硬盘 IO（似乎后面也有变化，index 也不小随着 ssd 更便宜，存 ssd 也可以）。；

由于每个 BLOB 都是加密过的，其秘钥放在额外的存储，通常是数据库中。通过删除其秘钥就可以达到事实上的 BLOB 的删除，这样就避免了数据紧缩（为什么可以不回收那些删除空间呢，毕竟对于文存储，删除量只有很小一部分，之前的温存储的假设就用在这里）；同时也省去了用备忘文件（journal file）来追踪删除信息。

下面说下读取流程。首先通过 Index API 来检查文件是否存在（R1 过程），然后将请求转到该 BLOB 所在的数据块所在的存储节点上。Data API 提供了对数据块和奇偶校验块（parity block）的访问。正常情况下的读请求会被导向合适的存储节点（R2 流程），然后直接从该 BLOB 所在块读取它（R3）。在失败的情况下，会通过 Data API 读取损坏模块中的所有 n+k 个兄弟模块中完好的 n 个块，送到回退节点（back-off node）进行重建。

在进行实际数据读取（无论是 R1-R3 的正常流程还是 R1，R4，R5 的出错回退流程）的同时，路由层（route tier）会并行的从外部数据库读取该 BLOB 对应的秘钥，然后在路由层进行解密操作，这是一个计算密集型任务，放在这里可以让数据层专注于存储，并且两层可以独立的扩展。

### &#x20;**回退节点（Backoff Nodes）**&#x20;

就是负责给出正常读取流程出错时的一种回退方案。

当 cell 中出现故障时，会有些块变得不可用，就需要从其兄弟块和奇偶校验块中进行在线恢复。回退模块都是 IO 稀疏而计算密集型节点，来处理这些计算密集型的在线恢复操作。

回退模块对外暴露 File API，以处理正常读取失败情况下的回退重试（R4）。在此时，读取请求已经被一个主卷服务器（primary volume-server， *不过这是个什么节点？* ）解析成了数据文件，偏移量和长度的元组，回退节点会向除损坏数据块之外的 n-1 个兄弟块和 k 个奇偶校验块中对应偏移量，读取对应长度的信息。只要收到 n 个回应（*估计是并行发？然后为了节省时间，收到任意 n 个回应就开始干活，进行差错纠正*？）

当然了，回了照顾读取延迟，每次进行在线回退读纠错的时候，都只恢复对应 BLOB 的数据而不是其所在的整个数据块 Block 的信息。整个数据块的恢复会交给重建节点（Rebuilder Nodes）离线的去做。

### &#x20;**重建节点（Rebuilder Nodes）**&#x20;

在民用物理机数目达到一定量级的情况下，硬盘和节点的故障是不可避免的。存储在损坏模块上的数据块就需要进行重建。重建节点是存储稀疏而计算密集型的，负责在后台默默地进行重建工作。每个重建节点通过探针（定期扫描其负责的范围内的数据？还是在每个数据节点上安装探针？）检测数据块错误，并且将其汇报到协调节点（Coordinator Nodes），然后通过取出同一条带（Stripe）上兄弟块和奇偶校验块中的没有损坏过的 n 块，对损坏节点进行重建（如果 n+k 中有其他模块坏了估计也一并重建吧）。这是一个很重的处理过程，并且会给存储节点带来极大的网络和 IO 负载。因此重建节点会对其吞吐量进行限流，以防对正常的用户请求造成不利影响。而统筹调度重建工作，以尽量减小数据丢失的风险，则是协调节点的工作。

### &#x20;**协调节点（Coordinator Nodes）**&#x20;

一个数据单元（cell）需要很多日常的运维任务，比如安排（大概就是确定一个重建顺序，并且在不同的重建节点间进行分配吧）损坏的数据块重建，调整当前的数据分布以尽可能减小数据的不可用概率。协调节点也是存储稀疏计算密集型的，用来执行数据单元范围的任务。

如之前提到的，一个数据条带上的不同数据块需要被分散放置于不同的数据容错区域内以最大化可靠性。然而，在经过故障，重建和替换后，肯定会有一些不符合上述原则的情况，比如两个同条带上的数据块被放在了同一个数据容错区域中。协调节点会运行一个平衡摆放位置的进程去检查一个数据单元中的数据块分布。和重建操作一样，也会给存储节点带来相当大的额外硬盘和网络负载，因此协调节点也会进行自我限流以减小对正常请求的影响。

## **地理备份**

单个 f4 的数据单元都存在一个数据中心中，因此难以抵御数据中心的故障。于是在开始的时候，我们将两份同样的数据单元放在不同的数据中心中，这样一个损坏仍然可以利用另一个对请求进行响应。这样将有效冗余因子从 Haystack 的 3.6 降低到了 2.8 。

![](https://picx.zhimg.com/v2-fc30ba6708e07a8dc81287b1f1bd5b6f_b.jpg)

考虑到数据中心级别的故障还是很稀少的，我们找到了一种可以进一步减小有效冗余因子的方案 —— 当然，也减小了吞吐率。不过，现在 XOR 方案可以将有效冗余因子进一步做到 2.1。

地理备份异或编码（XOR coding）方案通过将两个不同的卷（Volume，大小一样）做异或后的结果放在第三个数据中心的方式，提供了数据中心级别的容错。如图 9 一样，每个数据卷中的数据块和奇偶校验块被与等量的其他数据块或者奇偶校验块（称为*哥们块*，buddy block）被拿来做异或运算，得到其异或块（XOR block）。这些异或模块的索引也是简单的三备份存储。

一旦某个 datacenter 出现问题导致整个 volume 不可用，读取请求会被路由到一个叫做 geo-bakoff node ，然后会从两个 buddy node 和 XOR node 所在数据中心去取对应 BLOB 数据，进行损坏 BLOB 的重建。选择 XOR 编码，当然是简单又能满足需求。

负载因子的计算，(1.4 \* 3) / 2 = 2.1

## **简单总结**

基本思想大概就这些，剩下的不翻了。但是论文说的有点啰嗦，同一个点在不同地方说了好几遍，但同时一个模块有时又分散在不同模块中，不好连成一个整体，在这里，我简单总结一下。

一个数据单元（cell）存在一个数据中心中，包含 14 个机架。一个逻辑上的卷 （Volume），大约 100G，被分为 100 个 1G 的数据块（Block）；然后每 10 个数据块作为一组（Companion Block）进行数据冗余编码（RS 编码）后，产生 4 个新的奇偶校验块（Parity Block），这 14 个数据块 + 奇偶校验块称为一个条带（stripe），被分别放置在不同机架上以进行容错。其中哪些数据块属于一组的映射关系在名字节点（ Name Node） 中维持着。

在存储节点上，内存中需要维护两个映射作为 index 信息，一个是 BLOB id 到 volume，偏移量和大小的映射，一个是 volume 偏移量到 Block 实际物理位置的映射。当读请求失败的时候，读取请求连同一些元信息（比如所在数据块 id，以及在其上的偏移量）被导向回退节点（Backoff Node）。回退节点会根据 BLOB id 所在的 Block id 在 Name Node 拿到条带上其他数据块位置信息，以及偏移量，只对该 BLOB 的所有对等数据进行解码，还原出该 BLOB 后返回。

此外，协调节点（Coordinator Nodes）会根据探针的心跳信息，得到全局数据分布和状态信息。协调节点据此将损坏的模块交给重建节点（Rebuilder Nodes）进行数据重建；并且平衡、维持条带上的所有块被放在不同的数据容错阈。

最后，在两个不同数据中心的将所有数据块配对后，进行异或（XOR）操作，得到一个异或结果，放在第三个数据中心。这样，这三个数据中心的任何数据条带损坏到 RS 码都无法拯救的情况下（比如有四个以上机架出问题了），就可以通过其他两个数据中心数据进行 XOR 操作来抢救一下。

## **乱翻对照**

&#x20;**数据文件（data file）** ：存储一堆 BLOB 和其元信息的的文件

&#x20;**索引文件（index file）** ：记录 BLOB 在数据文件偏移量，长度和简单信息的文件，用来快速 seek 取出 BLOB。

&#x20;**备忘文件（journal file）** ：在 Haystack 中，用于记录所有的删除请求。

**有效备份因子，有效冗余倍数（effective-replica-factor**）：实际占用的物理空间和要存的逻辑数据大小之间的比值。

&#x20;**兄弟模块，伙伴模块（companion block）** ：用于编码的 n+k 个数据块中那 n 个模块的称呼。

&#x20;**奇偶校验块（parity block）** ：用于编码 n+k 个数据块中那 k 个模块的称呼

&#x20;**温存储（warm storage）** ：相对于热存储，指那些专门针对访问频次不怎么高的数据所构建的存储。

&#x20;**存储节点，存储机器（storage nodes，storage machines）** ：都是指的负责存储最终数据的的物理机。

&#x20;**紧缩（compact）** ：Haystack 中会定期地检查数据文件，将其复制一遍，但是略过所有重复和已经标记删除的数据，从而回收对应空间。

&#x20;**副本，备份（replica）** ：一种冗余策略，廉价通用型机器上免不了出错，为了留有后手进行恢复，最常用策略就是多存几份了，这几份同样的数据成为多副本或者多备份。

&#x20;**秘钥（encryption key）** ：用来给 BLOB 进行加密的键

&#x20;**回退模块（backoff node）** ：其实我觉得翻译成兜底模块也挺好哈哈，就是应对出错，取 n 个兄弟块来进行恢复的。

&#x20;**数据单元（cell）** ：由 14 个机架，每个机架上有 15 台机器组成的一个数据部署和回滚的的单元。

&#x20;**数据卷（volume）** ：分逻辑卷和物理卷，包含多个数据条带。

&#x20;**数据条带（stripe）** ：原始 n 个数据块和生成的 k 个奇偶校验块所组成的集合，称为条带。

&#x20;**数据块（block）** ：一般是 1G 左右，被分散在不同容错单元中。

![](https://pica.zhimg.com/v2-78bf9ca6f206cebe03476e5985b3e2de_b.jpg)

扫一扫关注我的公众号：分布式点滴

[![](https://picx.zhimg.com/v2-b007af479f32fa7fb14c5d40e4060244_720w.jpg?source=b555e01d)](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)

[广告](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)

[分布式系统经典书籍 - 数据密集型应用系统设计](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)

[京东](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)

[¥85.30](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)

[去购买​](https://union-click.jd.com/jdc?e=jdext-1203715122088366080-0\&p=AyIGZRtYFAcXBFIZWR0yEgRQGV0SARc3EUQDS10iXhBeGlcJDBkNXg9JHUlSSkkFSRwSBFAZXRIBFxgMXgdIMlkPJWQoQXBUZTd5QWdEd1RTEwd9YWILWStbHAIQD1QaWxIBIgdUGlsRBxEEUxprJQIXNwd1g6O0yqLkB4%2B%2FjcePwitaJQIWAV0dXBwDFw9UE1IlAhoDZc31gdeauIyr%2FsOovNLYq46cqca50ytrJQEiXABPElAeEgRUGV0VBhIEVhpSHAAVAFQSWgkDIgdUGlgVAhIEVhg1FGwSD1IZWBUKFQJSK1slAiJYEUYGJQATBlcZ)
