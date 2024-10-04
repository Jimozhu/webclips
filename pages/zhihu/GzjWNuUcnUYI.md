---
title: Go 的垃圾回收机制在实践中有哪些需要注意的地方？
date: 2024-10-04T15:31:10.454Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/21615032/answer/18781477
---
\============= 2014 年 7 月 7 日，补充 =============

之前回答问题的时候 Go 还处在 1.1 版本，到了 1.2 和 1.3，Go 的 GC 跟踪命令和 GC 内部实现已经有一些变化，并且根据评论中的反馈，这边一并做补充说明。

Go 1.2 之后的 GC 跟踪环境变量已经改为 GODEBUG="gctrace=1"，具体参数说明可以参考 runtime 包的文档。

Go 1.3 对 GC 做了优化，回收机制也改变了，从我的实验观测来看，用做内存存储时候产生的持久性的大量对象，一样是明显拖慢 GC 暂停时间的，但是函数内创建的局部对象一旦没被引用，是会被立即回收的，可以用 runtime.SetFinalizer () 观测到这个现象，我利用这个现象在 v8.go 项目做了一个 engine 实例销毁的[单元测试](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLljZXlhYPmtYvor5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.fQ30bDrzfmCVsyjzW-Z5i3JalYVqtmqYK1ppIfnNN0I\&zhida_source=entity)。

这里需要提醒大家，在平时开发或学习的时候 gc 是透明的，好像不存在一样，gc 只在影响到业务的时候才会让人想起来有这样一个东西存在。

gc 什么时候才会影响到业务呢？举个例子，比如业务需求是延迟不得大于 100ms，当 gc 暂停超过 100ms 时，就明显影响到业务了。

而这篇回答针对的是 gc 影响的业务时的问题排查和优化方案，以及出问题前的提前自检。

请不要因为这篇帖子就误以为 gc 是很恐怖的。

接着补充一下我对技术分享的看法，有读者反馈一些描述比较容易误导新手，这当然不是我想看到的，技术分享本是好意，如果误导了新人就不好了。

为避免误会，这里说明一下，这个帖子的问题是 “Go 的[垃圾回收机制](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLlnoPlnL7lm57mlLbmnLrliLYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.TH-AIqIni3GV8MhzjTRiPCKdb_EIwbh4fsrElGHduMQ\&zhida_source=entity)在实践中有哪些需要注意的地方？”，所以你正在阅读的这个答案是针对 Go 语言回答的，其中的一些经验和思路可以用在其他语言，但肯定是不能照搬的。

另外，语言表达的东西总是不那么严谨的，不同人可能产生不同理解，特别是对感受的描述，比如 “多”、“少”、“大”、“小”、“长”、“短，这种没给出具体数值的描述，不同人可能有不同的理解，所以参考价值比较低。

所以，对于分享的内容中，比较模糊，比较难以界定，没给出具体数据的部分，希望能抛砖引玉，大家也来实验一下，补充更多数据。对于已经给定数据的部分，也希望大家不要看一下就过了，最好也能实验一下证明数据给的是对的，自己也才有直观感受，万一数据给错了，也才能通过众人之力修订正确。

我尽量在分享时提供方法，而不是纯感受或纯数据，希望可以众人拾柴火焰高，让后来者可以有更高的一个起点，不需要重新填坑，最后整个技术社区的水平能一起提升。

\============= 原文 =============

不想看长篇大论的，这里先给个结论，go 的 gc 还不完善但也不算不靠谱，关键看怎么用，尽量不要创建大量对象，也尽量不要频繁创建对象，这个道理其实在所有带 gc 的编程语言也都通用。

想知道如何提前预防和解决问题的，请耐心看下去。

先介绍下我的情况，我们团队的项目《仙侠道》在 7 月 15 号第一次接受玩家测试，这个项目的服务端完全用 Go 语言开发的，游戏数据都放在内存中由 go 管理。

在上线测试后我对程序做了很多[调优工作](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E8%B0%83%E4%BC%98%E5%B7%A5%E4%BD%9C\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLosIPkvJjlt6XkvZwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.nqo0nnudWlWG9nCCPUWQuN0XAinFZRKUcpJIXeq_rbo\&zhida_source=entity)，最初是稳定性优先，所以先解决的是[内存泄漏](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLlhoXlrZjms4TmvI8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.zPKTY_e2B2UlLK2Q2NltttD_Rr9SNpFxSCFYvz1-My0\&zhida_source=entity)问题，主要靠 memprof 来定位问题，接着是进一步提高性能，主要靠 cpuprof 和自己做的一些统计信息来定位问题。

调优性能的过程中我从 cpuprof 的结果发现发现 gc 的 scanblock 调用占用的 cpu 竟然有 40% 多，于是我开始搞各种对象重用和尽量避免不必要的对象创建，效果显著，CPU 占用降到了 10% 多。

但我还是挺不甘心的，想继续优化看看。网上找资料时看到 GOGCTRACE 这个[环境变量](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=2\&q=%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLnjq_looPlj5jph48iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MiwiemRfdG9rZW4iOm51bGx9.1otfj6YpsIdXPq7pt5l6TGtP6k8hgxRaB0vUVzC49hQ\&zhida_source=entity)可以开启 gc 调试信息的打印，于是我就在内网测试服开启了，每当 go 执行 gc 时就会打印一行信息，内容是 gc 执行时间和回收前后的对象数量变化。

我惊奇的发现一次 gc 要 20 多毫秒，我们服务器请求处理时间平均才 33 微秒，差了一个量级别呢。

于是我开始关心起 gc 执行时间这个数值，它到底是一个恒定值呢？还是更数据多少有关呢？

我带着疑问在外网玩家测试的服务器也开启了 gc 追踪，结果更让我冒冷汗了，gc 执行时间竟然达到 300 多毫秒。go 的 gc 是固定每两分钟执行一次，每次执行都是暂停整个程序的，300 多毫秒应该足以导致可感受到的响应延迟。

所以缩短 gc 执行时间就变得非常必要。从哪里入手呢？首先，可以推断 gc 执行时间跟数据量是相关的，内网数据少外网数据多。其次，gc 追踪信息把对象数量当成重点数据来输出，估计扫描是按对象扫描的，所以对象多扫描时间长，对象少扫描时间短。

于是我便开始着手降低对象数量，一开始我尝试用 cgo 来解决问题，由 c 申请和释放内存，这部分 c 创建的对象就不会被 gc 扫描了。

但是实践下来发现 cgo 会导致原有的内存数据操作出些诡异问题，例如一个对象明明初始化了，但还是读到非预期的数据。另外还会引起 go 运行时报申请内存死锁的错误，我反复读了 go 申请内存的代码，跟我直接用 c 的[malloc](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=malloc\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiJtYWxsb2MiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.w0DM6WeUHHFjDO3P4LMG_zkOXcRj9WAK_JQneKPMMcw\&zhida_source=entity)完全都没关联，实在是很诡异。

我只好暂时放弃 cgo 的方案，另外想了个法子。一个玩家有很多数据，如果把非活跃玩家的数据序列化成一个字节数组，就等于把多个对象压缩成了一个，这样就可以大量减少对象数量。

我按这个思路用快速改了一版代码，放到外网实际测试，对象数量从几百万降至几十万，gc 扫描时间降至二十几微秒。

效果不错，但是要用[玩家数据](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E7%8E%A9%E5%AE%B6%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLnjqnlrrbmlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.MFuHok7cN0qigvRHu_Opw7CDB07rLusXki3KN-4Ej6E\&zhida_source=entity)时要反序列化，这个消耗太大，还需要再想办法。

于是我索性把内存数据都改为结构体和切片存放，之前用的是对象和[单向链表](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E5%8D%95%E5%90%91%E9%93%BE%E8%A1%A8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLljZXlkJHpk77ooagiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.K2Gi27J7GV-JfVmihH1IBCT9cOfR_Di5H0dW3zPuvRY\&zhida_source=entity)，所以一条数据就会有一个对象对应，改为结构体和结构体切片，就等于把多个对象数据缩减下来。

结果如预期的一样，内存多消耗了一些，但是对象数量少了一个量级。

其实项目之初我就担心过这样的情况，那时候到处问人，对象多了会不会增加 gc 负担，导致 gc 时间过长，结果没得到答案。

现在我填过这个坑了，可以确定的说，会。大家就不要再往这个坑跳了。

如果 go 的 gc 聪明一点，把老对象和新对象区别处理，至少在我这个应用场景可以减少不必要的扫描，如果 gc 可以异步进行不暂停程序，我才不在乎那几百毫秒的执行时间呢。

但是也不能完全怪 go 不完善，如果一开始我早点知道用 GOGCTRACE 来观测，就可以比较早点发现问题从而比较根本的解决问题。但是既然用了，项目也上了，没办法大改，只能[见招拆招](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E8%A7%81%E6%8B%9B%E6%8B%86%E6%8B%9B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLop4Hmi5vmi4bmi5siLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.v3nFNPnW0d74Eu4G0dIxw4ItZOYKbMLAQKf4zeuB-lw\&zhida_source=entity)了。

总结以下几点给打算用 go 开发项目或已经在用 go 开发项目的朋友：

1、尽早的用 memprof、cpuprof、GCTRACE 来观察程序。

2、关注请求处理时间，特别是开发新功能的时候，有助于发现设计上的问题。

3、尽量避免频繁创建对象 (\&abc {}、new (abc {})、make ())，在频繁调用的地方可以做对象重用。

4、尽量不要用 go 管理大量对象，[内存数据库](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E5%86%85%E5%AD%98%E6%95%B0%E6%8D%AE%E5%BA%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLlhoXlrZjmlbDmja7lupMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.GenmoOxtu76LOnXqflz-TTT8mfA6AcRC6D1pJHANF2w\&zhida_source=entity)可以完全用 c 实现好通过 cgo 来调用。

手机回复打字好累，先写到这里，后面再来补充案例的数据。

数据补充：

图 1，7 月 22 日的一次 cpuprof 观测，采样 3000 多次调用，数据显示 scanblock 吃了 43.3% 的 cpu。

![](https://picx.zhimg.com/50/a30f0c02571a98849af0ea51b94e262e_720w.jpg?source=2c26e567)

图 2，7 月 23 日，对修改后的程序做 cpuprof，采样 1 万多次调用，数据显示 cpu 占用降至 9.8%

![](https://pica.zhimg.com/50/3dbd1a8da915a97c857170889d8b5225_720w.jpg?source=2c26e567)

\
\


数据 1，外网服务器的第一次 gc trace 结果，数据显示 gc 执行时间有 400 多 ms，回收后对象数量 1659922 个：

```text
gc13(1): 308+92+1 ms , 156 -> 107 MB 3339834 -> 1659922 (12850245-11190323) objects, 0(0) handoff, 0(0) steal, 0/0/0 yields
```

数据 2，程序做了优化后的外网服务器 gc trace 结果，数据显示 gc 执行时间 30 多 ms，回收后对象数量 126097 个：

```text
gc14(6): 16+15+1 ms, 75 -> 37 MB 1409074 -> 126097 (10335326-10209229) objects, 45(1913) handoff, 34(4823) steal, 455/283/52 yields
```

\


示例 1，数据结构的重构过程：

最初的数据结构类似这样

```text
// 玩家数据表的集合
type tables struct {
        tableA *tableA
        tableB *tableB
        tableC *tableC
        //...... 此处省略一大堆表
}

// 每个玩家只会有一条 tableA 记录
type tableA struct {
        fieldA int
        fieldB string
}

// 每个玩家有多条 tableB 记录
type tableB struct {
        xxoo int
        ooxx int
        next *tableB  // 指向下一条记录
}

// 每个玩家只有一条 tableC 记录
type tableC struct {
        id int
        value int64
}
```

\


最初的设计会导致每个玩家有一个 tables 对象，每个 tables 对象里面有一堆类似 tableA 和 tableC 这样的一对一的数据，也有一堆类似 tableB 这样的一对多的数据。

假设有 1 万个玩家，每个玩家都有一条 tableA 和一条 tableC 的数据，又各有 10 条 tableB 的数据，那么将总的产生 1w (tables) + 1w (tableA) + 1w (tableC) + 10w (tableB) 的对象。

而实际项目中，表数量会有大几十，一对多和一对一的表参半，对象数量随玩家数量的增长倍数显而易见。

为什么一开始这样设计？

1、因为有的表可能没有记录，用对象的形式可以用 == nil 来判断是否有记录

2、一对多的表可以动态增加和删除记录，所以设计成链表

3、省内存，没数据就是没数据，有数据才有对象

改造后的设计：

```text
// 玩家数据表的集合
type tables struct {
        tableA tableA
        tableB [] tableB
        tableC tableC
        //...... 此处省略一大堆表
}

// 每个玩家只会有一条 tableA 记录
type tableA struct {
        _is_nil bool
        fieldA int
        fieldB string
}

// 每个玩家有多条 tableB 记录
type tableB struct {
        _is_nil bool
        xxoo int
        ooxx int
}

// 每个玩家只有一条 tableC 记录
type tableC struct {
        _is_nil bool
        id int
        value int64
} 
```

\


一对一表用结构体，一对多表用 slice，每个表都加一个\_is\_nil 的字段，用来表示当前的数据是否是有用的数据。

这样修改的结果就是，一万个玩家，产生的对象总量是 1w (tables) + 1w (\[] tablesB)，跟之前的设计差别很明显。

但是[slice](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=2\&q=slice\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiJzbGljZSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI2NzQ3NjAsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoyLCJ6ZF90b2tlbiI6bnVsbH0.GNCSUZaQHnqKL12c2VILyR-v4yw3MNhc0gevhlHWDfY\&zhida_source=entity)不会收缩，而结构体则是一开始就占了内存，所以修改后会导致内存消耗增大。

参考链接：

go 的 gc 代码，scanblock 等函数都在里面：

[http://golang.org/src/pkg/runtime/mgc0.c](https://link.zhihu.com/?target=http%3A//golang.org/src/pkg/runtime/mgc0.c%3Fh%3Druntime.gc)\


go 的 runtime 包文档有对 GOGCTRACE 等关键的几个环境变量做说明：

[http://golang.org/pkg/runtime/](https://link.zhihu.com/?target=http%3A//golang.org/pkg/runtime/)\


如何使用 cpuprof 和 memprof，请看《Profiling Go Programs》：

[http://blog.golang.org/profiling-go-programs](https://link.zhihu.com/?target=http%3A//blog.golang.org/profiling-go-programs)\


我做的一些小[试验代码](https://zhida.zhihu.com/search?content_id=2674760\&content_type=Answer\&match_order=1\&q=%E8%AF%95%E9%AA%8C%E4%BB%A3%E7%A0%81\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLor5Xpqozku6PnoIEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNjc0NzYwLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.aTcCYUjB1Qu50PBOtFDcivNYtmD6l06MoejaMN0BJQA\&zhida_source=entity)，优化都是基于这些试验的数据的，可以参考下：

[go-labs/src at master · idada/go-labs · GitHub](https://link.zhihu.com/?target=https%3A//github.com/realint/labs/tree/master/src)
