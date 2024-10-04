---
title: 大规模Go项目几乎必踏的几个坑 - Dragonboat为例
date: 2024-10-04T15:30:53.298Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/53284649
---
2 个月前开源了[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)这个 Go 实现的高性能多组 Raft 共识库，它的一大卖点是其高吞吐性能，在使用内存内的状态机的场景下，能在三组单插服务器上达到千万每秒的吞吐性能。

[lni/dragonboat​github.com/lni/dragonboat![](https://pic4.zhimg.com/v2-a7a606d3aea113f81e9adb44d59af5e7_ipico.jpg)](https://link.zhihu.com/?target=https%3A//github.com/lni/dragonboat)

作为个人用 Go 写的第一个较大的应用库，[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)的开发过程可谓踏坑无数，逐步才具备了目前的性能和可靠性。本文选取几个在各类 Go 项目中踏坑概率较高的具有普遍性的问题，以[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)踏坑详细过程为背景，具体分享。

**Channel 的实现没有黑科技**

虽然是最核心与基础的内建类型，chan 的实现却真的没有黑科技，它的性能很普通。

在[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)的旧版中，有大致入下的这样一段核心代码。它在有待处理的读写请求的时候，用以通知执行引擎。名为 workReadyCh 的 channel 系统中有很多个，执行引擎的每个 worker 一个，client 用它来提供待处理请求的信息 v。而考虑到该 channel 可能已满且等待的时候系统可能被关闭，一个全局唯一的用于表示系统已被要求关闭的 channel 会一起被 select，用以接收系统关闭的通知。

```go
select {
case <-closeCh:
  return
case workReadyCh<-v:
}
```

这大概是 Go 最常见的访问 channel 的 pattern 之一，实在太常见了！暂且不论千万每秒的写吞吐意味着每秒千万次的 channel 的写这一问题本身 ([前文](https://zhuanlan.zhihu.com/p/52620657)详细分析)，数万并发请求的 goroutine 通过数十个 OS thread 同时去 select 一个全局唯一的 closeCh 就已足够把高性能秒杀成了低性能蜗牛。

![](https://pic1.zhimg.com/v2-e007805ec1f1352959a5407f66ef9864_b.jpg)

不同场景下 chan、map、cgo 各操作的代价的了解决定性能上可以走多远

这种大量线程互相踩踏式的 select 访问一个 channel 所凸显的 chan 性能问题 Go 社群有[详细讨论](https://link.zhihu.com/?target=https%3A//github.com/golang/go/issues/20351)。该 Issue 讨论里贴出的 profiling 结果如下，很直观。但很遗憾，runtime 层面无解决方案，而[无锁 channel](https://link.zhihu.com/?target=https%3A//github.com/golang/go/issues/8899)的实现上虽然众人前赴后继，终无任何突破。现实中的 Go runtime 没有黑科技，它只提供性能很一般的 chan。

![](https://pic2.zhimg.com/v2-f1a25d398e7ab4de191c5e425b9e0089_b.png)

因为 contention，64 核机器上同样的操作单次耗时慢了 100 倍

为了绕开该坑，还是得从应用设计出发，把上述单一的 closeCh 分区做 sharding，根据不同的 Raft 组的组号，由不同的 chan 来负责做系统已关闭这一情况的通知。此改进立刻大幅度缓解了上述性能问题。

![](https://pic1.zhimg.com/v2-8bea6563711046984f39f33c18604d0a_b.jpg)

sharding 是最常用优化技巧

更进一步的优化，更能完全排除掉上述访问模式，这也是目前的实现方法，篇幅原因这里不展开。

**sync.RWMutex 随核心数升高其性能伸展性不佳**

下面是[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)老版本上抓的一段 cpu profiling 的结果，RWMutex 的 RLock 和 RUnlock 性能很差，用于保护这个 map 的 RWMutex 上的耗时比访问 map 本身高一个数量级。

```go
      20ms    618:func (nh *NodeHost) getCluster(clusterID uint64) (*node, bool) {
     3.85s    619:	nh.clusterMu.RLock()
     640ms    620:	v, ok := nh.clusterMu.clusters[clusterID]
     1.37s    621:	nh.clusterMu.RUnlock()
      10ms    622:	return v, ok
         .    623:}
```

这是因为在高核心数下，大量 RLock 和 RUnlock 请求会在锁的同一个内存位置并发的去做 atomic write。与上面 chan 的问题类似，还是高 contention。

RWMutex 的性能问题是一个困扰 Go 社区很久但至今没有在标准库层面上解决的问题 ([#17973](https://link.zhihu.com/?target=https%3A//github.com/golang/go/issues/17973))。有用户提出过一种称为[Big Reader 的变种](https://link.zhihu.com/?target=https%3A//github.com/jonhoo/drwmutex)，在牺牲写锁性能的前提下改善读锁的操作性能。但此时写锁的性能是崩跌的，以 Intel LGA3647 处理器高端双插服务器为例，Big Reader 锁在操作写锁的时候需要对 112 个 RWMutex 做 Lock/Unlock 操作，因此只适用于读写比极大的场景，不具备通用性。

在[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)中，所观察到的上述 RWMutex 问题，其本质在于在每次对某个 Raft 组做读写之前都需要反复去查询获取该指定的 Raft 节点。显然，无论锁的实现本身如何优化，或是改用 sync.Map 来替代上述需要锁保护的 map 的使用，试图去避免反复做此类无意义的重复查询，才是从根本上解决问题。本例中，Big Reader 变种是适用的，软件后期也改用了 sync.Map，但避免反复的 getCluster 操作则彻底避免锁操作，比如复用 getCluster 返回的结果，便饶开了锁的实现和用法是否高效这点。减少不必要操作，远比把此类多余的操作变得更高效来的直接有效。

**Cgo 远没那么烂**

前两年网上无脑 Go 黑的四大必选兵器肯定是：GC 性能、依赖管理、Cgo 性能和错误处理。GC 性能这两年已经在停顿方面吊打 Java，吞吐的改进也在积极进行中。Go 1.12 版 Module 的引入从官方工具层面关管住了依赖管理，而 Go 2 对错误处理也将有大改进。种种这些之外，Cgo 的性能依旧误解重重。

多吹无意义，先跑个分，看看 Cgo 究竟多慢：

![](https://picx.zhimg.com/v2-a078ecfebdfeb9adffbe971ccd801a87_b.png)

一次 Cgo 的代价接近于一次没有 cache 助攻的内存访问

调用一个简单的 C 实现的函数的开销是 60ns 级，和一次没有 cache 的对内存的访问一样。

这是什么概念呢？用个踩过的坑来说明吧。[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)早期版本对 RocksDB 的 WriteBatch 的 Put 操作是一次操作一个 Raft Log Entry，一秒该 Cgo 请求在多个 goroutine 上共并行操作数百万次。因为听信网上无脑黑对 Cgo 的评价，起初认为这显然是严重性能问题，于是优化归并后大幅度减少了 Cgo 调用次数。可结果发现这对延迟、吞吐的性能改进很小很小。事后再跑 profiler 去看旧的实现，发现旧版的 Cgo 开销起初便完全不主要。

Go 内建了很好的 benchmark 工具，一切性能的讨论都应该是基于客观有效的 benchmark 跑分结果，而不是诸如 “我认为”、“我感觉” 之类的无脑互蒙。

**Goroutine 泄漏与内存泄漏一样普遍**

Goroutine 的最大卖点是量大价廉使用方便，一个程序里轻松开启万把个 Goroutine 基本都不用考虑其本身的代价...... 一切似乎很美好，直到系统内类型众多的 Goroutine 开始泄漏。也许是因为 Goroutine 的特性，它在 Go 程序里的使用的频度密度远超线程在 Java/C++ 程序中情况，同时用户思维中 Goroutine 简单易用代价低的概念根深蒂固、与生俱来，无形中更容易放松对资源管理的考虑，因此更容易发生 Goroutine 泄漏情况。[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)的经验是 Goroutine 泄漏的概率不比内存泄漏少。

[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)从实现之初就开始使用 Goroutine 泄漏检查，具体的泄漏检查的实现是来自 CockroachDB 的[一小段代码](https://link.zhihu.com/?target=https%3A//github.com/lni/dragonboat/blob/master/internal/utils/leaktest/leak.go)。效果方面，这个小工具发现过 Dragonboat 及其依赖的第三方库里多个 goroutine 泄漏问题，而使用上，在各内建的测试中，只需一行便能完成调用得到结果，绝对是费效比完美。

![](https://picx.zhimg.com/v2-564f37c471f8259a5c1872d401908027_b.jpg)

实现上它也特别简单，就是前后两次分别抓 stacktrace，解析出进程里所有的 Goroutine ID 并对比是否测试运行结束后产生了多余的滞留在系统中的 Goroutine。官方虽然不倡导对 Goroutine ID 做任何操作，但此类仅在测试中仅针对 Goroutine 泄漏的特殊场景的使用，应该不拘泥于该约束，这就如同官方不怎么推荐用 sync/atomic 一个道理。

**总结**

基于[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)的几个具体例子，本文分享了几个常见的 Go 性能与使用问题。总结来说：

* 通过 sharding 分区减少 contention 是优化常用手段
* 做的再快也不可能比什么也不做更快，减少不必要操作比优化这个操作有效
* 多用 Go 内建的 benchmark 功能，数据为导向的做决策
* 官方提倡的东西肯定有他的道理，但在合适的情况下，需懂得如何无视某些官方的提倡

后续将再推出针对 Go 内存性能优化的文章，敬请期待。在阅读完此干货软文后，也请大家访问[Dragonboat](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)项目并点 star 支持：

[lni/dragonboat​github.com/lni/dragonboat![](https://pic4.zhimg.com/v2-a7a606d3aea113f81e9adb44d59af5e7_ipico.jpg)](https://link.zhihu.com/?target=http%3A//github.com/lni/dragonboat)
