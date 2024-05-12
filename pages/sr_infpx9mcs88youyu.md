---
title: "NAND Flash 基础知识简介"
date: 2022-07-29T18:07:09+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [blog.coderhuo.tech](http://blog.coderhuo.tech/2020/07/18/flash_basics/)

NAND Flash 是一种非易失存储介质（掉电后数据不会丢失），常见的 U 盘、TF 卡 / SD 卡，以及大部分 SSD（固态硬盘）都是由它组成的。 本文主要介绍其组成及工作原理。

为了表述方便，后面所说的 Flash 仅指 NAND Flash。

Flash 的基本组成单元是浮栅晶体管，其状态可以用来指示二进制的 0 或 1。写操作就是往晶体管中注入电子，使之充电；擦除操作则是把晶体管中的电子排出，使之放电。由于这是个模拟系统，晶体管并不存在绝对的空和满状态，其中的电子数目可以处于空和满之间的任一个状态。

由此可见，可以根据晶体管中电子的数目来指示二进制的 0 和 1。比如在 **SLC**（Single Level Cell）中，晶体管中电子数目小于 50% 的时候代表 1，大于 50% 的时候代表 0。

SLC 是对电子数目做的一阶量化，所以一个晶体管可以代表两个状态：0 和 1。如果我们对晶体管中的电子数目做二阶量化，一个晶体管就可以代表四个状态：少于 25% 代表 00，25% ~ 50% 代表 01，50% ~ 75% 代表 10、大于 75% 代表 11。这就是 **MCL**(Multi Level Cell) 的做法。

当然我们还可以对晶体管中的电子数目做三阶量化，一个晶体管就可以代表八个状态：000、001、010、011、100、101、110、111。这是 **TLC**(Three Level Cell) 的做法。

也就是说，量化等级越高，一个晶体管可以表示的状态越多，存储密度就越大，同等数量的存储单元组成的存储介质，存储容量也越大。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/e21ff370.jpe)

如上图所示，可以把晶体管比作水桶，晶体管内的电子比作水：

- 由于 SLC 只有两个状态，只需要保证电子数目多于一半或少于一半即可，所以注入 / 排放电子的过程比较简单，执行起来很快；对于 MLC，有四个状态，对注入 / 排放电子的精度要求就比较高，执行起来就没那么快了；对于 TLC，有八个状态，对注入 / 排放电子的精度要求更高，执行的就更慢了。另外，写入的数据也会影响效率，比如对于 MLC，写入代表满状态的 00 和代表空状态的 11，效率要高于 01 和 10（清空一杯水和倒满一杯水肯定比倒 1/4,、1/2 杯水简单，当然这个影响在业务层看来可能比较小）。
- 另一方面，如果水桶发生损坏，比如在上半部分产生了一个缺口（擦除操作会导致介质磨损，最终导致电子泄露），对于 SLC 可能没影响，可以正常使用，对于 MLC 和 TLC 可能由于无法区分多个状态，就无法使用了。NAND Flash 的寿命在很大程度上受所用存储单元类型影响，单个晶体管中存放的状态越多，容错性越差，寿命越短。

**不同组成单元对 Flash 性能和寿命的影响**

从上面的原理可以看出，SLC、MLC、TLC 的性能和寿命是递减的，存储密度是递增的。 下面是一组具体的数据：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/196e6b68.jpe)

从上图可以看出：

- 随着每个单元代表的比特数增加，读、写、擦除耗时也在增加
- 无论是 SLC 还是 MCL、TLC，擦除耗时（ms 数量级）都远高于读写耗时 (us 数量级)
- SLC 的擦写次数远大于 MLC、TLC，也就是说寿命长。
- SLC 每个晶体管只能代表一个比特，从存储密度看，是最低的，TLC 存储密度最高，MLC 次之。

总的来看，SLC 的性能、寿命、稳定性是优于 MLC 的，当然价格也更贵，MCL 次之，TLC 最次。

## Flash 的结构

Flash 中存在下面几个基本概念：package、die、plane、block、page(page 对应于普通硬盘 HDD 中的 sector，即常说的扇区)。 下面是一个示意图，我们由大到小拆解下：

- **package** 是存储芯片，即拆解固态硬盘或者 SD 卡后看到的 NAND Flash 颗粒。
- 每个 package 包含一个或多个 **die**。die 是可以独立执行命令并上报状态的最小单元。
- 每个 die 包含一个或多个 **plane**(通常是 1 个或 2 个)。不同的 plane 间可以并发操作，不过有一些限制。
- 每个 plane 包含多 **block\*，block 是最小擦除单元**。
- 每个 block 包含多个 **page， page 是最小的读写单元**。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/8790fb91.png)

这里我们需要重点关注的是：

- 读写的操作对象是 page，通常是 512 字节或者 2KB
- 擦除的对象是 block，通常包含 32 或 64 个 page（16KB 或 64KB）
- 每个 block 在写入前需要先擦除
- block 擦除前，需要保证本 block 上所有 page 中都不包含有效数据（如果有些 page 包含有效数据，需要先搬移到其他地方）

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/36f987da.jpe)

## Program/Erase Cycles

Flash 还有一个重要特性：**Flash 不支持更新操作**，严格说应该是不支持原址更新。 如果我们已经往某个 page 中写入了数据，想修改这个 page 中的内容，只能通过下面的方法：

1. 先把本 page 所属 block 的数据全部读出来，比如先读到内存 DRAM
2. 然后修改对应 page 的内容
3. 接下来擦除整个 block
4. 最后把修改后的 block 数据回写到 Flash

Flash 芯片上 block 的擦写次数是有限的，最大擦写次数称为 **PE Cycles**(Program erase cycles, 往 Flash 写入的过程又称为编程过程，即 program)。如果采用上面的方法进行原址更新，Flash 很容易就会被用坏的。一个折中的方法是：将新数据写到一个新的 page 中，并将原来的 page 标记为无效，如下图所示：

_说明：新的 page 和老的 page 可以位于同一个 block，也可以位于不同的 block，甚至位于不同的 die。_

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/caf29a07.jpe)

这样做会带来另外的问题：

1. 数据所在 page 变了，后续如何访问新的数据（谁来维护这个映射关系）
2. 无效的 page 什么时候回收（上面的做法只是延迟了擦除 block 的时间，但是空闲 page 迟早有用完的时候）
3. 如何选择新的 page，保证整个 flash 的擦写均衡（避免有的 block 擦除次数多，有的 block 擦除次数少）

接下来登场的 FTL 会解决上面的问题。需要注意的是，**擦除的耗时远大于读写耗时，相关逻辑处理不好的话会影响性能。**所以目前有很多 FTL 的优化算法。

关于 Flash 的原址更新补充如下说明：假设一个空白 page 是全 1，比如 1111 1111，对它的写操作只能把其中的某些位由 1 变为 0（第一次写可以把 1111 1111 改成 1111 0000，第二次可以继续把 1111 0000 改成 0011 0000，从这个角度看，page 可以执行多次写操作），而无法再把 0 变为 1（如果某个写操作涉及把 0 变为 1，那就无能为力了，只有整个 block 擦除后再写入了）。

## 逻辑地址映射

在 NAND Flash 出现前，逻辑地址映射 (Logical Block Mapping， 简称 LBA) 就存在了，它是为了对上层的文件系统屏蔽 Physical Block Address(PBA)的细节，让寻址更简单、灵活。

下面是逻辑地址和物理地址映射示意图：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/d553ddb9.jpe)

上图所示属于 **page-to-page 的映射，这种映射的缺点是 FTL 中维护大量的映射关系，好处是管理方便**（某个 page 更新时，不用关心新数据是否和原数据位于同一个 block，如下图所示）。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/621bc1ec.jpe)

实际一般使用 **block-to-block 的映射**（这种情况下，逻辑 page 和物理 page 的映射是固定的，比如逻辑的 page1 对应物理的 page1，逻辑的 page2 对应物理的 page2），如下图所示：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/c9cfcacb.jpe)

**block-to-block 的映射，好处是维护的映射关系较少，节省了存储空间，缺点是在数据更新的时候比较麻烦**，如下图所示：

1. 步骤 1 展示的是初始状态，FTL 的映射指向 Original block
2. 步骤 2 想要更新前两个 page 的数据：先将新数据写入新的的 block（注意：page 在 block 中的相对位置保持不变），原来 block 中对应的 page 被标记为无效
3. 步骤 3 把原来 block 中下面的两个 page 搬移到新的 block 中（注意：page 在 block 中的相对位置保持不变）
4. 步骤 4 更新 FTL 映射关系，指向新的 block，然后擦除原来的 block（具体什么时候擦除，由 Flash 内部的垃圾回收机制决定）

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/5cb9e25c.jpe)

block-to-block 方式的映射，在数据更新的时候产生了额外的数据拷贝，需要付出的代价较高。为了解决这个问题，FAST、BAST 等算法应运而生。

可以看到，**无论是 page-to-page 的映射还是 block-to-block 的映射，虽然 Flash 内部的映射关系发生了变化，但是该变化对文件系统是透明的**，因为 FTL 的映射表对外并未发生变化。

## 磨损均衡

每个 block 的最大擦写次数 (P/E Cycles) 基本上是一样的，**磨损均衡（Wear Levelling）**的作用是保证所有 block 被擦写的次数基本相同。这就要求磨损均衡算法要把擦写操作均摊在所有的 block 上。

如果所有 block 上的数据都经常更新，磨损均衡算法执行起来问题不大。如果有些 block 上存在冷数据（写入之后就很少更改的数据），我们必须根据一定的策略强制搬移这些数据并擦写对应的 block，否则这些 block 就永远不会被擦除。当然这种操作会增加系统负载，同时也加大了整个系统的磨损（产生了不必要的擦写）。

实际上，磨损均衡算法越激进，系统的磨损越严重；但是如果磨损均衡算法太消极，会导致两极分化，部分 block 被擦除次数较多，部分 block 被擦除次数较少。

## 垃圾回收

接下来我们需要处理 page 的回收问题（Garbage Collection）。Flash 的擦除单元是 block，这决定了垃圾回收的最小单元也是 block。block 回收过程中，需要确保待擦除 block 上无有效数据；如果有的话，需要搬移到其他的 block（和磨损均衡一样，这也会增加额外的负担，实际应用中需要找到一个平衡点）。

**为什么需要垃圾回收**

我们假设一个简单的存储介质只包含 5 个 block，每个 block 包含 10 个 page。在初始化状态，所有的 page 都是空的，存储介质的可用空间是 100%。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/fbbe65db.jpe)

接下来写入一些数据（注意：写入的最小单元是 page）。从下图可以看出，有些 page 已经被占用了，并且由于磨损均衡算法的作用，他们被分散在不同的 block 上：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/b2dc8f28.jpe)

我们再继续写入一些数据，现在 50% 的空间被占用了，并且数据分散在各个 block 上（尽管在物理层面数据是分散在各个 block 的，FTL 对外展现的可能是连续的）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/0c2c17f9.jpe)

如果这时更新数据，FTL 会选择一个空的 page 写入新数据，然后把老的 page 标记为 stale 状态（黄色标记块），如下图所示:

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/a90a6c5e.jpe)

这时最左边的 block 包含 2 个 stale 状态的 page 和 4 个 used 状态的 page，为了回收 stale 状态的 page，必须先把 4 个 used 状态的 page 拷贝到其他的 block，然后再把最左边的 block 整个擦除掉。如果此时不执行该操作，继续写入新数据（或者更新现有数据），会耗尽所有 free 状态的 page，尽管此时还存在 stale 状态的 page，但是已经无法回收了（有效数据没法腾挪了），这时候整个存储介质会进入只读状态。

所以，Flash 的 FTL 层需要执行垃圾回收策略，释放 stale 状态的 page。

## 写放大因子

从上面的介绍我们了解到，磨损均衡和垃圾回收在一定程度上都会触发后台数据搬运。这些操作是在 Flash 内部进行的，外部通过任何方法都监控不到，外部唯一能感受到的就是性能受到影响，比如某次写很耗时。

这种现象叫做**写放大（Write Amplification）**，可以通过下面的公式衡量。该值越大说明效率越低，会对存储介质的性能和寿命造成不良影响：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/b6bdad85.jpe)

公式的分子是实际写入到 Flash 的数据量，分母是有效数据量。比如一次写入 5KB 数据，但是由于磨损均衡或者垃圾回收导致后台产生了数据搬运，实际写入数据量是 10KB，那么，写放大因子就是 2。

## 预留空间

一般情况下，存储介质的实际存储空间都大于标称空间 (一般多 7% 左右，具体依赖生产商)，多出来的存储空间被称为预留空间（Over-Provisioning），这部分空间用户是无法使用的。它可以被用来进行数据腾挪，保证垃圾回收、擦写均衡的正常进行，如果有坏块产生，还可以作为替补 block 顶上去（在一定程度上，让用户感知不到坏块的存在）。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_infpx9mcs88youyu/d1e49853.jpe)

1. [https://pdfs.semanticscholar.org/faf8/22b0712731a32a10988e4ee3b3602bec5dd9.pdf](https://pdfs.semanticscholar.org/faf8/22b0712731a32a10988e4ee3b3602bec5dd9.pdf)
2. [https://flashdba.com/storage-for-dbas/](https://flashdba.com/storage-for-dbas/)
