---
title: 浅谈分布式存储之SSD基本原理
date: 2024-10-04T15:30:36.640Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/102089411
---
### 前言

随着制造工艺的不断进步，SSD (Solid State Drive) 性能和容量不断突破，价格不断降低，迎来了快速的发展，目前已经是商用服务器、高性能存储服务中非常流行的存储介质。作为开发人员，需要了解 SSD 的基本原理，以便开发时能更好地发挥其优势，规避其劣势。本文章基于末尾所列参考文献整理而来。

### 目录

* [SSD 简介](https://zhuanlan.zhihu.com/write#chapter1)
* [闪存基础](https://zhuanlan.zhihu.com/write#chapter2)
* [存储原理](https://zhuanlan.zhihu.com/write#chapter3)
* [读写流程](https://zhuanlan.zhihu.com/write#chapter4)
* [GC 机制](https://zhuanlan.zhihu.com/write#chapter5)
* [Trim 机制](https://zhuanlan.zhihu.com/write#chapter6)
* [Bit-Error](https://zhuanlan.zhihu.com/write#chapter7)
* [Read-Disturb](https://zhuanlan.zhihu.com/write#chapter8)
* [Program-Disturb](https://zhuanlan.zhihu.com/write#chapter9)
* [Wear-Leveling](https://zhuanlan.zhihu.com/write#chapter10)
* [IO 抖动因素](https://zhuanlan.zhihu.com/write#chapter11)

### SSD 简介

SSD 诞生于上世纪 70 年代，最早的 SSD 使用 RAM 作为存储介质，但是 RAM 掉电后数据就会丢失，同时价格也特别贵。后来出现了基于闪存 (Flash) 的 SSD，Flash 掉电后数据不会丢失，因此 Flash-SSD 慢慢取代了 RAM-SSD，但是此时 HDD 已经占据了大部分的市场。到本世纪初，随着制造工艺的不断进步，SDD 迎来了长足的发展，同时 HDD 在工艺和技术上已经很难有突破性的进展，SSD 在性能和容量上还在不断突破，相信在不久的将来，SSD 在在线存储领域会取代 HDD，成为软件定义存储 (SDS) 的主流设备。

### 闪存基础

SSD 主要由 SSD 控制器，Flash 存储阵列，板上 DRAM (可选) 以及跟 HOST 接口 (SATA、SAS、PCIe 等) 组成。

Flash 的基本存储单元是`浮栅晶体管`，同时根据制造工艺分为`NOR`型和`NAND`型。`NAND`容量大，按照 Page 进行读写，适合进行数据存储，基本上存储使用的 SSD 的 Flash 都是`NAND`。

Flash 的工作原理和场效应管类似都是利用电压控制源极和漏极之间的通断来工作的。

`写操作`**是在控制极加正电压，使电子通过绝缘层进入浮栅极。因此写操作无法将电子从浮栅极吸出，所以覆盖写入前必须擦除**。

`擦除 (erase) 操作`**正好相反，是在衬底加正电压，把电子从浮栅极中吸出来**。

`读操作`**给控制栅加读取电压，判断漏极 - 源极之间是否处于导通状态，进而可以判断浮置栅有没有存储电荷，进而判断该存储单元是`1`还是`0`**。

图片引用自[https://www.ssdfans.com](https://link.zhihu.com/?target=https%3A//www.ssdfans.com/)

![](https://pic2.zhimg.com/v2-470c7f1f618192ea97a467a1e4575f67_b.jpg)

### 存储原理

如第二节 - 闪存基础，SSD 内部一般都是使用 NAND-Flash 作为存储介质，逻辑结构如下图：

![](https://pic2.zhimg.com/v2-513e5784e27c9de8ab76f75497b70861_b.jpg)

SSD 中一般有多个 NAND-Flash，每个 NAND-Flash 包含多个 Block，每个 Block 包含多个 Page。由于 NAND 的特性，存取都必须以 Page 为单位，即每次读写至少是一个 Page。通常地，每个 Page 的大小为 4K 或者 8K。NAND 的另一个特性是只能读写单个 Page，不能覆盖写某个 Page，如果要覆盖写，必须先要清空里面的内容，再写入。由于清空内容的电压较高，必须是以 Block 为单位，因此，没有空闲的 Page 时，必须要找到没有有效内容的 Block，先擦除再选择空闲的 Page 写入。理论上也是可以设计成为按字节擦除，但是 NAND 容量一般很大，按字节擦除效率低，速度慢，所以就设计为按 Block 擦除了。

SSD 中也会维护一个 mapping table，维护逻辑地址到物理地址的映射。每次读写时，可以通过逻辑地址直接查表计算出物理地址，与传统的机械磁盘相比，省去了寻道时间和旋转时间。

### 读写流程

从 NAND-Flash 的原理可以看出，其和 HDD 的主要区别为：

* **定位数据快**：HDD 需要经过寻道和旋转，才能定位到要读写的数据块，而 SSD 通过 mapping table 直接计算即可。
* **读取速度快**：HDD 的速度取决于旋转速度，而 SSD 只需要加电压读取数据，一般而言，要快于 HDD。

在**顺序读测试**中，由于定位数据只需要一次，定位之后，则是大批量的读取数据的过程，此时，HDD 和 SSD 的性能差距主要体现在读取速度上，HDD 能到 200M 左右，而普通 SSD 是其两倍。

在**随机读测试**中，由于每次读都要先定位数据，然后再读取，HDD 的定位数据的耗费时间很多，一般是几毫秒到十几毫秒，远远高于 SSD 的定位数据时间 (一般 0.1ms 左右)，因此，随机读写测试主要体现在两者定位数据的速度上，此时，SSD 的性能是要远远好于 HDD 的。

SSD 的写分为**新写入**和**覆盖写**两种，处理流程不同。

### 新写入

![](https://pic4.zhimg.com/v2-09181eef08a242c40989edaad646f3a5_b.jpg)

1. 找到一个空闲 Page。
2. 数据写入到空闲 Page。
3. 更新 mapping table。

### 覆盖写

![](https://pica.zhimg.com/v2-d92b64d1d290f8c132a6612c789c4e64_b.jpg)

1. SSD 不能覆盖写，因此先找到一个空闲页 H。
2. 读取 Page-G 中的数据到 SSD 内部的 buffer 中，把更新的字节更新到 buffer。
3. buffer 中的数据写入到 H。
4. 更新 mapping table 中 G 页，置为无效页。
5. 更新 mapping table 中 H 页，添加映射关系。

如果在覆盖写操作比较多的情况下，会产生较多的无效页，类似于磁盘碎片，此时需要 SSD 的 GC 机制来回收这部分空间了。

### GC 机制

在讨论 GC 机制之前，我们先了解一下`Over-Provisioning`是指 SSD 实际的存储空间比可写入的空间要大。比如一块 SSD 实际空间 128G，可用容量却只有 120G。为什么需要 Over-Provisioning 呢？请看如下例子：

![](https://pic4.zhimg.com/v2-94391272113f3736d8e126b45f887291_b.jpg)

如上图所示，假设系统中只有两个 Block，最终还剩下两个无效的 Page。此时要写入一个新 Page，根据 NAND 原理，必须要先对两个无效的 Page 擦除才能用于写入。而擦除的粒度是 Block，需要读取当前 Block 有效数据到新的 Block，如果此时没有额外的空间，便做不了擦除操作了，那么最终那两个无效的 Page 便不能得到利用。所以需要 SSD 提供额外空间即`Over-Provisioning`，保证 GC 的正常运行。

![](https://picx.zhimg.com/v2-588d4f3bb4c0f657de47664e54f58127_b.jpg)

GC 流程如下：

1. 从 Over-Provisoning 空间中，找到一个空闲的 Block-T。
2. 把 Block-0 的 ABCDEFH 和 Block-1 的 A 复制到空闲 Block-T。
3. 擦除 Block-0。
4. 把 Block-1 的 BCDEFH 复制到 Block-0，此时 Block0 就有两个空闲 Page。
5. 擦除 BLock-1。

SSD 的 GC 机制会带来两个问题：

* SSD 的寿命减少。NAND-Flash 中每个原件都有擦写次数限制，超过一定擦写次数后，就只能读取不能写入了。
* 写放大 (Write Amplification)。即内部真正写入的数据量大于用户请求写入的数据量。

如果频繁的在某些 Block 上做 GC，会使得这些元件比其他部分更快到达擦写次数限制。因此，需要损耗均衡控制 (Wear-Leveling) 算法，使得原件的擦写次数比较平均，进而延长 SSD 的寿命。

### Trim 机制

`Trim`指令也叫`Disable Delete Notify`(禁用删除通知)，是微软联合各大 SSD 厂商所开发的一项技术，属于 ATA8-ACS 规范的技术指令。

**Trim (Discard) 的出现主要是为了提高 GC 的效率以及减少写入放大的发生，最大作用是清空待删除的无效数据**。在 SSD 执行读、擦、写步骤的时候，预先把擦除的步骤先做了，这样才能发挥出 SSD 的性能，通常 SSD 掉速很大一部分原因就是待删除的无效数据太多，每次写入的时候主控都要先做清空处理，所以性能受到了限制。

在文件系统上删除某个文件时候，简单的在逻辑数据表内把存储要删除的数据的位置标记为可用而已，而并不是真正将磁盘上的数据给删除掉。使用机械硬盘的系统根本就不需要向存储设备发送任何有关文件删除的消息，系统可以随时把新数据直接覆盖到无用的数据上。固态硬盘只有当系统准备把新数据要写入那个位置的时候，固态硬盘才意识到原来这写数据已经被删除。而如果在这之前，SSD 执行了 GC 操作，那么 GC 会把这些实际上已经删除了的数据还当作是有效数据进行迁移写入到其他的 Block 中，这是没有必要的。

在没有 Trim 的情况下，SSD 无法事先知道那些被‘删除’的数据页已经是‘无效’的，必须到系统要求在相同的地方写入数据时才知道那些数据可以被擦除，这样就无法在最适当的时机做出最好的优化，既影响 GC 的效率 (间接影响性能)，又影响 SSD 的寿命。

Trim 和 Discard 的支持，不仅仅要 SSD 实现这个功能，而是整个数据链路中涉及到的文件系统、RAID 控制卡以及 SSD 都需要实现。要使用这个功能必须要在 mount 文件系统时，加上 discard 选项。如果自己管理 SSD 裸设备就需要通过`ioctl`函数`BLKDISCARD`命令来操作了。

```text
int block_device_discard(int fd, int64_t offset, int64_t len)
{
    uint64_t range[2] = {(uint64_t)offset, (uint64_t)len};
    return ioctl(fd, BLKDISCARD, range);
}
```

### Bit-Error

在分析 Bit-Error 之前，我们先回顾一下`闪存基础`章节的知识。Bit-Error 是磁盘的一种静默错误。造成 Nand-Error 的因素有：

* 电荷泄漏：长期不使用，会发生电荷泄漏，导致电压分布往左移，例如 00 漂移到 01,10 漂移到 11。
* 读干扰 (Read-Disturb)：读干扰小节会详细介绍。
* 写干扰 (Program-Disturb)：写干扰小节会详细介绍。

不同因素造成的错误类型也不同：

* Erase-Error：erase 操作未能将 cell 复位到 erase 状态时，称为 erase error。可能是制造问题，或者多次 P/E 引起的栅极氧化层缺陷所致。
* Program-Interference-Error：由 Program-Disturb 所导致的错误，会使电压分布偏移。
* Retention-Error：由电荷泄露引发的错误，会使电压分布偏移。
* Read-Error：由 Read-Disturb 所导致的错误，会使电压分布偏移。

retention 时间越长，flash 的浮栅极泄露的电子会越多，因而误码率越高，所以 NAND-Error 机制主要是为了减少 Retention-Error。

### Read-Disturb

读取 NAND 的某个 Page 时，Block 当中未被选取的 Page 控制极都会加一个正电压，以保证未被选中的 MOS 管是导通的。这样频繁的在一个 MOS 管控制极加正电压，就可能导致电子被吸进浮栅极，形成轻微的 Program，导致分布电压右移，产生 Bit-Error。注意 Read-Disturb 只影响同一 Block 中的其他 Page。

![](https://pica.zhimg.com/v2-580c270a158bf3bf5757ebf08b3180ee_b.jpg)

### Program-Disturb

erase 之后所有 bit 都为 1，写 1 不需要 program，写 0 才需要 program。如下图所示，绿色的 Cell 是写 0，它们需要 Program，红色的 cell 写 1，并不需要 Program。我们把绿色的 Cell 称为 Programmed Cells，红色的 Cell 称为 Stressed Cells。写某个 Page 的时候，会在其 WordLine 的控制极加一个正电压 (下图是 20V), 对于 Programmed Cells 所在的 String，它是接地的，对于不需要 Program Cell 所在的 String，则接一正电压（下图为 10V）。这样最终产生的后果是，Stressed Cell 也会被轻微 Program。与 Read Disturb 不同的是，Program Disturb 不但影响同一个 Block 当中的其它 Page，自身 Page 也受影响。相同的是，都是不期望的轻微 Program 导致比特翻转，都非永久性损伤，经擦除后，Block 还能再次使用。

![](https://pica.zhimg.com/v2-32c2151a733dcfd427ab220d09fc41f2_b.jpg)

### Wear-Leveling

可参考：[经典 Dual-pool 算法 - 高效 Wear Leveling](https://link.zhihu.com/?target=http%3A//www.ssdfans.com/blog/2018/12/30/%25e7%25bb%258f%25e5%2585%25b8dual-pool-%25e7%25ae%2597%25e6%25b3%2595-%25e9%25ab%2598%25e6%2595%2588wear-leveling/)

### IO 抖动因素

* **GC 机制**：会导致内部 IO，从而抢占用户的 IO，导致性能抖动，甚至下降。
* **Bit-Error**：对于读操作，如果 Bit-Error 控制在一定范围内，那么延迟可以控制在 100us 内。如果超过了 BCH 快速解码的范围，将花费大量时间解码，延迟将增加。
* **读写冲突**：当一个读请求和写请求落在了同一个 Block 或者 Page，会导致读延迟增加。针对这个问题，在存储系统设计过程中，需要将读写请求在空间上进行分离，从而避免读写请求在同一个 Block 上冲突。
* **读擦冲突**：当一个读请求和擦除请求落在了同一个 Block，那么读请求将会被擦除请求 block，NAND-Flash 的擦除操作基本上在 2ms 以上，导致读延迟增加。为了解决这个问题，有些 NAND-FLash 也引入了 Erase-Suspend 的功能，让读优先于擦除操作，从而降低延迟。

### 参考文献

* [你的 SSD 可以用 100 年，你造吗？](https://link.zhihu.com/?target=http%3A//www.ssdfans.com/blog/2017/08/03/%25e4%25bd%25a0%25e7%259a%2584ssd%25e5%258f%25af%25e4%25bb%25a5%25e7%2594%25a8100%25e5%25b9%25b4%25ef%25bc%258c%25e4%25bd%25a0%25e9%2580%25a0%25e5%2590%2597%25ef%25bc%259f/)
* [SSD 背后的秘密：SSD 基本工作原理](https://link.zhihu.com/?target=http%3A//www.ssdfans.com/blog/2017/08/03/ssd%25e8%2583%258c%25e5%2590%258e%25e7%259a%2584%25e7%25a7%2598%25e5%25af%2586%25ef%25bc%259assd%25e5%259f%25ba%25e6%259c%25ac%25e5%25b7%25a5%25e4%25bd%259c%25e5%258e%259f%25e7%2590%2586/)
* [程序员需要知道的 SSD 基本原理](https://link.zhihu.com/?target=http%3A//oserror.com/backend/ssd-principle/)
* [SSD 内部的 IO 抖动因素](https://link.zhihu.com/?target=https%3A//blog.51cto.com/alanwu/1876910)
* [闪存问题之 Read Disturb](https://link.zhihu.com/?target=https%3A//www.ssdfans.com/blog/2016/04/07/%25E9%2597%25AA%25E5%25AD%2598%25E9%2597%25AE%25E9%25A2%2598%25E4%25B9%258Bread-disturb/)
* [SSD Trim 详解](https://link.zhihu.com/?target=http%3A//www.ssdfans.com/blog/2016/07/10/ssd-trim-%25E8%25AF%25A6%25E8%25A7%25A3/)
* [NAND ERROR 机制解析](https://link.zhihu.com/?target=https%3A//www.ssdfans.com/blog/2017/10/01/nand-error%25e6%259c%25ba%25e5%2588%25b6%25e8%25a7%25a3%25e6%259e%2590/)

**作者：史明亚**

* [现在注册滴滴云，有机会可得 30 元无门槛滴滴出行券](https://link.zhihu.com/?target=https%3A//app.didiyun.com/%23/auth/signup%3Fchannel%3D14804)
* [新购云服务 1 月 5 折 3 月 4.5 折 6 月低至 4 折](https://link.zhihu.com/?target=https%3A//www.didiyun.com/%3Fchannel%3D14804)
* [滴滴云使者招募，推荐最高返佣 50%](https://link.zhihu.com/?target=https%3A//www.didiyun.com/envoy/e-index.html%3Fchannel%3D14844)

[滴滴云 - 为开发者而生​www.didiyun.com/?channel=14804![](https://picx.zhimg.com/v2-12a15ef8a2ddfb15eef6d732728bc1ef_ipico.jpg)](https://link.zhihu.com/?target=https%3A//www.didiyun.com/%3Fchannel%3D14804)

[滴滴云使者​www.didiyun.com/envoy/e-index.html?channel=14844![](https://picx.zhimg.com/v2-12a15ef8a2ddfb15eef6d732728bc1ef_ipico.jpg)](https://link.zhihu.com/?target=https%3A//www.didiyun.com/envoy/e-index.html%3Fchannel%3D14844)

编辑于 15:47
