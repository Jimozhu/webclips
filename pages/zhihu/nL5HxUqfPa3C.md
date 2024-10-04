---
title: NUMA架构下的内存访问延迟区别！
date: 2024-10-04T15:30:36.666Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/90624389
---
现在的服务器物理机 CPU 一般都是多个 CPU，核数也是十几甚至几十核。内存几十 GB 甚至是上百 G，也是由许多条组成的。那么我这里思考一下，这么多的 CPU 和内存它们之间是怎么互相连接的？同一个 CPU 核访问不同的内存条延时一样吗？

在[《内存随机访问也比顺序慢，带你深入理解内存 IO 过程》](https://zhuanlan.zhihu.com/p/86513504)中我们了解了内存访问时芯片内部的执行过程，在[《实际测试内存在顺序 IO 和随机 IO 时的访问延时差异》](https://zhuanlan.zhihu.com/p/87827480)中我们又进行了实际的代码测试。不过这两文中我们都把精力聚焦在内存内部机制，而回避了上面的问题，那就是 CPU 和内存的连接方式，也就是总线架构。

## 回顾 CPU 与内存的简单连接：FSB 时代

我们先来回顾下在历史上 CPU、内存数量比较少的年代里的总线方案 - FSB。FSB 的全称是 Front Side Bus，因此也叫前端总线。CPU 通过 FSB 总线连接到北桥芯片，然后再连接到内存。内存控制器是集成在北桥里的，Cpu 和内存之间的通信全部都要通过这一条 FSB 总线来进行。

![](https://pic1.zhimg.com/v2-c2176155b7a09009d8ac0a43bd471a5a_b.jpg)

图 1 FSB 总线架构

在这个年代里，当时提高计算机系统整体性能的方式就是不断地提高 CPU、FSB 总线、内存条的数据传输频率。

## 如今多 CPU 多内存条复杂互联：NUMA 时代

当 CPU 的主频提升到了 3GHz 每秒以后，硬件制造商们发现单个 CPU 的已经到了物理极限了。所以就改变了性能改进的方法，改成为向多核、甚至是多 CPU 的方向来发展。在这种情况下，如果仍然采用 FSB 总线，会导致所有的 CPU 和内存通信都经过总线，这样总线就成为了瓶颈，无法充分发挥多核的优势与性能。所以 CPU 制造商们把内存控制器从北桥搬到了 CPU 内部，这样 CPU 便可以直接和自己的内存进行通信了。那么，如果 CPU 想要访问不和自己直连的内存条怎么办呢？所以就诞生了新的总线类型，它就叫 QPI 总线。

![](https://pica.zhimg.com/v2-3f1230e90320d06aa47d6b3cf4f3f8ce_b.jpg)

图 2 QPI 总线架构

图 2 中 CPU1 如果想要访问内存 3 的话，就需要经过 QPS 总线才可以。

## 动手查看 Linux 下 NUMA 架构

我们先通过 dmidecode 命令查看一下内存插槽，单条大小等信息。大家可以试着在 linux 上执行以下该命令。输出结果很长，大家可以有空仔细研究。我这里不全部介绍，这里只挑选一些和内存相关的：

```text
# dmidecode|grep -P -A5 "Memory\s+Device"|grep Size  
        Size: 8192 MB  
        Size: 8192 MB  
        Size: No Module Installed  
        Size: 8192 MB  
        Size: No Module Installed  
        Size: 8192 MB  
        Size: 8192 MB  
        Size: 8192 MB  
        Size: No Module Installed  
        Size: 8192 MB  
        Size: No Module Installed  
        Size: 8192 MB
```

可以看出，我当前使用的机器上共有 16 个内存插槽，共插了 8 条 8G 的内存。所以总共是 64GB。如我们前面所述，在 NUMA 架构里，每一个物理 CPU 都有不同的内存组，通过`numactl`命令可以查看这个分组情况。

```text
# numactl --hardware
available: 2 nodes (0-1)
node 0 cpus: 0 1 2 3 4 5 12 13 14 15 16 17
node 0 size: 32756 MB
node 0 free: 19642 MB
node 1 cpus: 6 7 8 9 10 11 18 19 20 21 22 23
node 1 size: 32768 MB
node 1 free: 18652 MB
node distances:
node   0   1
  0:  10  21
  1:  21  10
```

通过上述命令可以看到，每一组 CPU 核分配了 32GB（4 条）的内存。 `node distance`是一个二维矩阵，描述 node 访问所有内存条的延时情况。 `node 0`里的 CPU 访问`node 0`里的内存相对距离是`10`, 因为这时访问的内存都是和该 CPU 直连的。而`node 0`如果想访问`node 1`节点下的内存的话，就需要走 QPI 总线了，这时该相对距离就变成了`21`。

&#x20;**所以、在 NUMA 架构下，CPU 访问自己同一个 node 里的内存要比其它内存要快！**&#x20;

## 动手测试 NUMA 架构内存延迟差异

`numactl`命令有`--cpubind`和`--membind`的选项，通过它们我们可以指定我们要用的 node 节点。还沿用[《实际测试内存在顺序 IO 和随机 IO 时的访问延时差异》](https://zhuanlan.zhihu.com/p/87827480)里的测试代码

**1、让内存和 CPU 处于同一个 node**

提示：手机下查看需要往右拖动

```text
# numactl --cpubind=0 --membind=0 ./main
Delay  (ns)
        2k      8k      32k     128k    512k    2m      8m      32m     128m
s1      1.28    1.28    1.26    1.25    1.26    1.26    1.28    1.43    1.43
s32     1.27    1.26    1.32    1.78    2.67    2.73    3.27    9.95    10.37
s64     1.28    1.26    1.26    1.82    2.43    2.48    3.15    8.82    8.92
andom   2.40    2.40    2.40    2.40    4.80    4.80    19.20   28.80   52.80
```

**2、让内存和 CPU 处于不同 node**

提示：手机下查看需要往右拖动

```text
# numactl --cpubind=0 --membind=1 ./main
Delay  (ns)
        2k      8k      32k     128k    512k    2m      8m      32m     128m
s1      1.29    1.28    1.26    1.26    1.26    1.26    1.31    1.62    1.63
s32     1.29    1.26    1.33    1.77    2.80    2.92    3.95    13.69   13.77
s64     1.30    1.27    1.26    1.82    2.47    2.48    3.96    12.93   12.90
andom   2.40    2.40    2.40    2.40    4.80    4.80    19.20   31.20   52.80
```

## 结论

通过上面的各个小节我们可以看到，现代的服务器里，CPU 和内存条都有多个，它们之前目前主要采用的是复杂的 NUMA 架构进行互联，NUMA 把服务器里的 CPU 和内存分组划分成了不同的 node。从上述实验结果来看，拿 8M 数组，循环步长为 64 的 case 来说，同 node 耗时 3.15 纳秒，跨 node 为 3.96 纳秒。所以属于同一个 node 里的 CPU 和内存之间访问速度会比较快。而如果跨 node 的话，则需要经过 QPI 总线，总体来说，速度会略慢一些。​

**关注知乎专栏[《开发内功修炼》](https://zhuanlan.zhihu.com/c_1147478886047719424)或搜索微信公众号 kfngxl，收获更多知识！**
