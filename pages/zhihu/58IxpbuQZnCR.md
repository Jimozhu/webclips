---
title: NUMA与UEFI
date: 2024-10-04T15:31:10.170Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/26078552
---
无论我们愿意或者知晓，云服务已经无所不在，打车、订票、玩游戏、逛淘宝等等便利都离不开它。云服务依托于强劲的服务器集群，强劲的市场需求使其对服务器性能要求的不断提高。服务器早以从 SMP（对称多处理器）体系进化到了 NUMA（Non-Uniform Memory Access Architecture）体系。本文从 NUMA 的历史、原理和与 UEFI 固件的关系来深入了解它。

## **NUMA 的历史**

Intel 的联合创始人摩尔在 1965 年就发现了摩尔定律，即集成电路每英寸晶体管数目每过 18 个月增加一倍。从那以后芯片产业仿佛被施加了魔咒，从此在增加晶体管数目的不归路上一路狂奔至今，于此同时主频也不断提高，整体效能在 2004 年之前年增长率达到 52%，如下图：

![](https://picx.zhimg.com/v2-3ba4312aca19659c71633fc5d2ecb519_b.jpg)

在 1999 年计算机主频超过 1G 大关后，芯片厂商们继续向着更高的目标前进，10GHz 似乎并不遥远。励志故事在 2004 年戛然而止，Intel 和 AMD 在主频战争中先后碰上了散热问题。超长的流水线、巨大的散热片和高达百瓦的功耗为频率战划下了句号，芯片厂商决定另辟蹊径：从攀高峰变成摊大饼。摩尔定律继续发挥作用，越来越多的内核被加入到了 CPU 中，从此年增长率降为了 22%，而 Intel 也从此不再提起频率，而改为每瓦性能了。这个改变极大的影响了软件的性能优化的考量，从此单核性能优先渐渐让位于多核性能协调。而落后的 FSB（前端总线）架构极大的影响了系统性能的发挥，多核常常争抢总线资源用以访问在北桥上的内存，造成很大的延迟。在服务器芯片领域，由于多个 CPU 共享 FSB，情况尤为严重。

需求带来了变革，AMD 和 Intel 先后将内存控制器移入 CPU 内部，CPU 之间用芯片互联总线连接，分别起名 Hyper Transport 和 QPI。我们的主题 NUMA 也在这里粉墨登场了。

根据 CPU 访问内存中地址所需时间和距离，我们可以将 CPU 和内存结构分为 SMP（Symmetric Multi-Processor，也称之为一致内存访问 UMA）、NUMA（Non-Uniform Memory Access Architecture，非一致性内存访问）和 MPP (Massive Parallel Processing，不在本文范围内)。如图：

![](https://pic2.zhimg.com/v2-297955de826e36183869efe780f1c219_b.jpg)

右边的 UMA 方式即是传统的通过 FSP 访问北桥的内存方式，各个 CPU 和所有的内存的访问延迟是一致的。而左边的 NUMA 图中，CPU0 访问 memory1/2 的延迟小于访问 memory3/4，毕竟 QPI 和 CPU1 的二传手角色是要消耗时间的。我们这里可以将 CPU0 和 memory1/2 作为一个节点（Node），而 CPU1 和 memory3/4 构成 Node2。一个更复杂点的 4 个 node 的 4 路服务器如下图：

![](https://pic2.zhimg.com/v2-506fffc69a8ea8f8803519ea37398689_b.jpg)

NUMA 将 CPU 和相近的内存配对组成节点 (node)，在每个 NUMA 节点里，CPU 都有本地内存，访问距离短（也叫亲缘性好），性能也相对好。固件将收集到的 Node 信息报告给操作系统，由其在分配任务和内存时就近分配，选择亲缘性好的匹配，从而提高性能。微软从 WindowsNT 开始就已经支持 NUMA，不过是为了 IBM 服务器，随着 X86 服务器越来越主流，Window2008 server 已经加入了对 NUMA 的支持。Linux 在服务器平台上的表现也越来越成熟，Linux 内核对 NUMA 架构的支持越来越完善，特别是从 2.5 开始，Linux 在调度器、存储管理、用户级 API 等方面进行了大量的 NUMA 优化工作，目前这部分工作还在不断地改进。对虚拟机来说 NUMA 也十分重要，从 Windows Server2012 开始，Hyper-V 虚机可以映射虚拟的 NUMA 拓扑，在虚机配置了较多内存的时候，使用 NUMA 拓扑映射能保证分配给虚机的 CPU 只访问本地的内存，从而达到提升性能。Hyper-V 为虚机提供虚拟 NUMA 节点，虚拟 NUMA 的拓扑结构及原理与物理机的 NUMA 拓扑及结构一致，虚拟 CPU 和虚机内存组合成虚拟 NUMA 节点，每个虚机的虚拟 NUMA 节点都映射到相关的物理 CPU 上。

## **UEFI 与 NUMA**

固件在 NUMA 的生态链中扮演了至关重要的地位，只有固件才能知道具体平台上 CPU 和内存的亲缘关系。UEFI 固件通过 ACPI 报告给 OS NUMA 的组成结构，其中最重要的是 SRAT（System Resource Affinity Table）和 SLIT（System Locality Information Table）表。

**A．SRAT**

SRAT 中包含两个结构：

Processor Local APIC/SAPIC Affinity Structure：每个逻辑 processor 在 Proximity Domain 所处的位置。每个逻辑 processor 都有不同的 Local APIC ID，所以 Processor 用 Local APIC ID 表示。

Memory Affinity Structure：记录内存的信息，即每块内存都从属于哪个 Proximity Domain。

有了这个表 OSPM 就可以描绘出一个 CPU 和内存的关系图，包括有几个 node，每个 node 里面有那些逻辑 processor 和内存。

**B． SLIT**

SLIT 表则记录了各个结点之间的距离。

通过这两个表，OS 可以在内存中建立整体 processor 和内存的亲缘关系图和距离表，作为任务调度和内存分配的依据。

详细信息可以查看 ACPI spec 6.1 的第 17 章节。

## **后记**

我们可以在 linux 下查看我们的 NUMA 使用情况：

第一种方法使用 numactl 查看：

```text
numactl --hardware
available: 2 nodes (0-1) 
node 0 size: 12091 MB 
node 0 free: 988 MB   
node 1 size: 12120 MB
node 1 free: 1206 MB
```

第二种方法是通过 sysfs 查看，这种方式可以查看到更多的信息。

欢迎大家关注本专栏和用微信扫描下方二维码加入微信公众号 "UEFIBlog"，在那里有最新的文章。同时欢迎大家给本专栏和公众号投稿！

![](https://pica.zhimg.com/v2-45479ebdd2351fcdcfb0771bd06fff3a_b.jpg)

用微信扫描二维码加入 UEFIBlog 公众号
