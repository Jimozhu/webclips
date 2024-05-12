---
title: "[译] 更新 Go 内存模型"
date: 2021-07-25T12:35:53+08:00
draft: false
categories: [dev]
tags: [golang, dev]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [colobu.com](https://colobu.com/2021/07/13/Updating-the-Go-Memory-Model/)

> 这是 Russ Cox 的系列论文的第三篇，也是最后一篇: Updating the Go Memory Model。 文章对 官方的 Go 内存模型做了一些补充和思考。

这是 Russ Cox 的系列论文的第三篇，也是最后一篇: [Updating the Go Memory Model](https://research.swtch.com/gomm)。

文章对 官方的 Go 内存模型做了一些补充和思考。

当前的 Go 语言内存模型是在 2009 年编写的，从那以后略有更新。很明显，至少有一些细节我们应该添加到当前的内存这个内存模型中，其中包括对竞态检测器的明确认可，以及关于 sync/atomic 中的 API 是如何同步程序的清晰声明。

这篇文章重申了 Go 的总体哲学和当前的内存模型，然后概述了我认为我们应该对 Go 内存模型进行的相对较小的调整。假定你已经了解了前两篇文章 [“硬件内存模型”](https://colobu.com/2021/06/30/hwmm/) 和 [“编程语言内存模型”](https://colobu.com/2021/07/11/Programming-Language-Memory-Models/) 中的背景知识。

我已经开启了一个 [GitHub 讨论项目](https://golang.org/s/mm-discuss)来收集对反馈。根据这些反馈，我打算在本月晚些时候准备一份正式的 Go 提案。使用 GitHub 讨论本身就是一个实验，我还会继续尝试[找到一个合理的方法来扩大这些重要变化的讨论](https://research.swtch.com/proposals-discuss)。

## Go 设计哲学

Go 旨在成为构建实用、高效系统的编程环境。它的目标是为小型项目的轻量级开发语言，但也可以优雅地扩展到大型项目和大型工程团队。

Go 鼓励在高层次上处理并发，特别是通过通信。第一句 Go 箴言 ([Go proverb](https://go-proverbs.github.io/))就是 “不要通过共享内存来通信，而是通过通信共享内存。” 另一个流行的谚语是 “清晰胜于聪明。” 换句话说，Go 鼓励通过避免使用巧妙的代码来避免狡猾的 bug。

Go 的目标不仅仅是可以理解的程序，还包括可以理解的语言和可以理解的 package API。复杂或巧妙的语言特征或 API 与这一目标相矛盾。正如 Tony Hoare 在 1980 年[图灵奖演讲](https://www.cs.fsu.edu/~engelen/courses/COP4610/hoare.pdf)中所说:

> I conclude that there are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies and the other way is to make it so complicated that there are no obvious deficiencies.
>
> 我的结论是，构建软件设计有两种方法: 一种方法是简单实现，以至于明显没有缺陷；另一种方法是异常复杂，以至于没有明显缺陷。

第一种方法要困难得多。它需要同样的技巧、奉献、洞察力，甚至是灵感，就像发现构成复杂自然现象基础的简单物理定律一样。它还要求愿意接受受物理、逻辑和技术限制的目标，并在冲突的目标无法实现时接受妥协。

这与 Go 的设计 API 的理念非常吻合。我们通常在设计过程中花很长时间来确保一个应用编程接口是正确的，并努力将其简化为最基本、最有用的精华。

Go 作为一个有用的编程环境的另一方面是为最常见编程错误有定义明确的语义，这有助于理解和调试。这个想法并不新鲜。再次引用 Tony Hoare 的话，这是来自他 1972 年的 “软件质量” 检查单:

> As well as being very simple to use, a software program must be very difficult to misuse; it must be kind to programming errors, giving clear indication of their occurrence, and never becoming unpredictable in its effects.
>
> 一个软件程序不仅使用起来非常简单，而且很难被误用；它必须友好对待编程错误，给出它们发生的明确指示，并且其影响永远不会变得不可预测。

为有问题的程序定义良好的语义，这种常识并不像人们预期的那样普遍。在 C/C++ 中，未定义的行为已经演变成一种编译器作者的全权委托，以越来越有趣的方式将有轻微问题的程序转换成有大问题的程序。Go 不采用这种方法: 不存在 “未定义的行为”。特别是，像空指针取消引用、整数溢出和无意的无限循环这样的错误都在 Go 中定义了语义。

## 当前的 Go 内存模型

Go 的内存模型始于以下建议，符合 Go 的总体哲学:

- 修改由多个 goroutines 同时访问的数据的程序必须串行化这些访问。
- 为了实现串行访问, 需要使用 channel 操作或其他同步原语 (如 sync 和 sync/atomic 包中的原语) 来保护数据。
- 如果你必须阅读本文的其余部分才能理解你的程序的行为，那你太聪明了。
- 别自作聪明。

这仍然是个好建议。该建议也与其他语言对 DRF-SC 的鼓励使用一致: 同步以消除数据竞争，然后程序将表现得好像顺序一致，不需要理解内存模型的其余部分。

根据这个建议，Go 内存模型定义了一个传统的基于 happens-before 对读写竞争的定义。像在 Java 和 JavaScript 中一样，在 Go 中的读操作可以观察到任何更早但尚未被覆盖的写操作，或者任何竞争的写操作；仅安排一个这样的写入会强制产生指定的结果。

然后，内存模型继续定义同步操作，这些操作建立交替执行的 goroutine 的 happen-before 关系。操作尽管稀松平常，但是还是带有一些 Go 特有的风格:

- 如果 package **p** 引入了 package **q**, 那么 **q** 的 init 函数的执行完成一定 happen-before **p** 的所有 init 函数 (之前)
- **main.main** 函数一定 happen after 所有的 init 函数完成 (之后)
- go 语句创建一个 goroutine 一定 happen before goroutine 执行 (之前)
- 往一个 channel 中 send happen before 从这个 channel receive 这个数据完成 (之前)
- 一个 channel 的 close 一定 happen before 从这个 channel receive 到零值数据 (这里指因为 close 而返回的零值数据)
- 从一个 unbuffered channel 的 receive 一定 happen before 往这个 channel send 完成 (之前)
- 从容量为 C 的 channel receive 第 k 个数据一定 happen before 第 k+C 次 send 完成 (之前)
- 对于任意的 **sync.Mutex** 或者 **sync.RWMutex** 类型的变量 l 以及 n <m, 调用第 n 次 l.UnLock() 一定 happen before 第 m 次的 l.Lock() 返回 (之前)
- once.Do(f) 中的对 f 的单次调用一定 happen before 任意次的对 once.Do(f) 调用返回 (之前)

值得注意的是，这个列表忽略了 package sync 中新加的 API 以及 sync/atomic 的 API。

Go 内存模型规范以一些不正确同步的例子结束。它没有包含错误编译的例子。

## 对 Go 内存模型做的改变

2009 年，当我们着手编写 Go 的内存模型时，Java 内存模型进行了新的修订，C/C++11 内存模型正在定稿。一些人强烈鼓励我们采用 C/C++11 模型，并充分利用了其已经完成的所有工作。对我们来说这似乎很冒险。相反，我们决定采用一种更保守的方法来保证我们要做的，这一决定得到了随后十年详细描述 Java/C/C++ 内存模型中非常狡猾问题的论文的证实。是的，定义足够充分的内存模型来指导程序员和编译器作者是很重要的，但是完全正式地定义一个正确的内存模型似乎仍然超出了最有才华的研究人员的能力范围。Go 定义一个最小的需求就足够了。

下面这一部分列出了我认为我们应该做的调整。如前所述，我已经开启了一个 [GitHub 讨论项](https://golang.org/s/mm-discuss)来收集反馈。根据这些反馈，我计划在本月晚些时候准备一份正式的 Go 提案。

### 文档化 Go 的整体方法

“不要聪明” 的建议很重要，应该坚持下去，但我们也需要在深入研究 happen before 细节之前，对 Go 的整体方法更多的谈一谈。我看到过很多关于 Go 方法的不正确总结，比如宣称 Go 的模型是 C/C++ 的 “DRF-SC 或 Catch Fire”。 这种误会是可以理解的: Go 内存模型规范没有说它的方法是什么，而且它是如此之短 (材料又如此微妙)，以至于人们看到了他们期望看到的东西，而不是那里有什么或没有什么。

拟在 Go 内存模型规范中增加的文档大致如下:

> ## 概观
>
> Go 以与本语言其余部分几乎相同的方式处理其内存模型，旨在保持语义简单、可理解和有用。
>
> 数据竞争被定义为对存储器位置的写入与对同一位置的另一次读取或写入同时发生，除非所有访问都是由 sync/atomic package 提供的原子数据访问提供。如前所述，强烈建议程序员使用适当的同步来避免数据竞争。在没有数据竞争的情况下，Go 程序表现得好像所有的 gorouitine 都被多路复用到一个处理器上。这个属性有时被称为 DRF-SC: 无数据竞争的程序以顺序一致的方式执行。
>
> 其他编程语言通常采用两种方法之一来处理包含数据竞争的程序。第一，以 C 和 C++ 为例，带有数据竞争的程序是无效的: 编译器可能会以任意令人惊讶的方式中断它们。第二，以 Java 和 JavaScript 为例，具有数据竞争的程序定义了语义，通过限制竞争的可能影响，使程序更加可靠和易于调试。Go 的方法介于这两者之间。具有数据竞争的程序是无效的，因为语言实现可能会报告竞争并终止程序。但另一方面，具有数据竞争的程序定义了具有有限数量结果的语义，使得错误的程序更可靠，更容易调试。

这些文字应该阐明 Go 和其他语言有什么不同，纠正读者先前的任何期望。

在 “happen before” 一节的最后，我们还应该澄清某些竞争仍然会导致内存损坏。当前它以下面的句子结束：

> Reads and writes of values larger than a single machine word behave as multiple machine-word-sized operations in an unspecified order.

我们应该加上一点:

> 请注意，这意味着多 word 数据结构上的竞争可能导致单次写入产生不一致值。当值依赖于内部 (指针、长度) 或(指针、类型)pair 的一致性时，就像大多数 Go 实现中的接口、map、切片和字符串的情况一样，这种竞争又会导致内存损坏。

这将更清楚地说明保证对具有数据竞争的程序的限制。

### 文档化 sync 库的 happen before

自从 Go 内存模型发布以来，一些新的 API 已经被添加到 sync 包中。我们需要将它们添加到内存模型中 ([issue#7948](https://golang.org/issue/7948))。谢天谢地谢广坤，增加的内容看起来很简单。我相信它们应该如下：

- 对于 sync.Cond, **Broadcast** 和 **Signal** 一定 happen before 它解锁的 Wait 方法调用完成 (之前)
- 对于 sync.Map, Load, LoadAndDelete 和 LoadOrStore 都是读操作， Delete、LoadAndDelete 和 Store 都是写操作。LoadOrStore 当它的 loaded 返回 false 时是写操作。一个写操作 happen before 能观察到这个写操作的读操作 (之前)
- 对于 sync.Pool, 对 Put(x) 的调用一定 happen before Get 方法返回这个 x(之前)。同样的，返回 x 的 New 方法一定 happen before Get 方法返回这个 x(之前)
- 对于 sync.EWaitGroup, Done 方法的调用一定 happen before 它解锁的 Wait 方法调用返回 (之前)

这些 API 的用户需要知道保证，以便有效地使用它们。因此，虽然我们应该将这些文字保留在内存模型中以供介绍，但我们也应该将其包含在 package sync 的文档注释中。这也将有助于为第三方同步原语树立一个榜样，说明记录由 API 建立的顺序保证的重要性。

### 文档话 sync/atomic 的 happen before

Atomic operations are missing from the memory model. We need to add them (issue #5045). I believe we should say:

内存模型中缺少原子操作的保证。我们需要添加它们 ([issue #5045](https://golang.org/issue/5045))。我认为我们应该说:

> sync/atomic package 中的 API 统称为 “原子操作”，可用于同步各种 goroutine 执行。如果原子操作 A 的效果被原子操作 B 观察到，那么 A 发生在 B 之前 (happen before)。在一个程序中执行的所有原子操作表现得好像是以某种顺序一致的顺序执行的。

这是 Dmitri Vyukov 在 2013 年提出的建议，也是我在 2016 年非正式承诺的。它还与 Java 的 volatiles 和 C++ 的默认原子具有相同的语义。

就 C/C++ 而言，同步原子只有两种选择: 顺序一致或 acquire/release(Relaxed 原子不会创建 happen before，因此没有同步效果). 对这两者的决策归结为，第一，能够推理出多个位置上原子操作的相对顺序有多重要，第二，顺序一致的原子与 acquire/release 原子相比要多昂贵 (慢)。

首先要考虑的是，关于多个位置上原子操作的相对顺序的推理非常重要。在之前的一篇文章中，我举了一个使用两个原子变量实现的无锁快速路径的条件变量的[例子](https://research.swtch.com/plmm#cond)，这两个原子变量被使用 acuqire/release 原子打破了。这种模式反复出现。例如，sync.WaitGroup 曾经的实现使用了一对[原子 uint32 值](https://go.googlesource.com/go/+/ee6e1a3ff77a41eff5a606a5aa8c46bf8b571a13/src/pkg/sync/waitgroup.go#54)：wg.counter 和 wg.waiters。[Go 运行时中的信号量的实现](https://go.googlesource.com/go/+/cf148f3d468f4d0648e7fc6d2858d2afdc37f70d/src/runtime/sema.go#134)也依赖于两个独立的原子 word，即信号量值 \* addr 和相应的 waiter count root.nwait。还有更多。在缺乏顺序一致的语义的情况下 (也就是说，如果我们改为采用 acquire/release 语义)，人们仍然会像这样错误地编写代码；它会神秘地失败，而且只在特定的情况下。

根本的问题是，使用 acuqire/release 原子使无数据竞争的程序不会导致程序以顺序一致的方式运行，因为原子本身不会提供保证。也就是说，这样的程序不提供 DRF-SC。这使得这种程序很难推理，因此很难正确编写。

关于第二个考虑，正如在之前的文章中提到的，硬件设计人员开始为顺序一致的原子提供直接支持。例如，ARMv8 添加了 ldar 和 stlr 指令来实现顺序一致的原子，它们也是 acquire/release 原子的推荐实现。如果我们为 sync/atomic 采用 acquire/release 语义，那么写在 ARMv8 上的程序无论如何都会获得顺序一致性。这无疑会导致依赖更强顺序的程序意外地在更弱的平台上崩溃。，如果由于竞争窗口很小, acquire/release 和结果一致的原子之间的差异在实践中很难观察到，这甚至可能发生在单个架构上。

这两种考虑都强烈建议我们应该采用顺序一致的原子而不是 acquire/release 原子: 顺序一致的原子更有用，一些芯片已经完全缩小了这两个级别之间的差距。如果差距很大，想必其他人也会这么做。

同样的考虑，以及 Go 拥有小型、易于理解的 API 的总体哲学，所有这一切都反对将 acuqire/release 作为一套额外的并行 API 来提供。似乎最好只提供最容易理解的，最有用的，很难被误用的原子操作。

另一种可能性是提供原始屏障，而不是原子操作 (当然，C++ 两者都提供)。屏障的缺点是使期望变得不那么清晰，并且在某种程度上更加局限于特定的体系结构。Hans Boehm 文章 [“Why atomics have integrated ordering constraints”](http://www.hboehm.info/c++mm/ordering_integrated.html) 给出了提供原子而不是屏障的论点 (他使用术语栅栏 fence)。一般来说，原子比栅栏更容易理解，而且由于我们现在已经提供了原子操作，所以我们不能轻易移除它们。一个机制要比提供两个好。

### 可能的改变： 为 sync/atomic 提供类型化的 API

上面的定义说，当一个特定的内存块必须由多个线程同时访问而没有其他同步时，消除争用的唯一方法是让所有的访问都使用原子。仅仅让一些访问使用原子是不够的。例如，与原子读或写并发的非原子写仍然是 s 数据竞争，与非原子读或写并发的原子写也是数据竞争。

因此，一个特定的值是否应该用 atomic 访问是该值的属性，而不是特定的访问。正因为如此，大多数语言将这些信息放在类型系统中，比如 Java 的 volatile int 和 C++ 的 atomic。Go 当前的 API 没有，这意味着正确的使用需要仔细标注结构或全局变量的哪些字段预计只能使用原子 API 来访问。

> 译者按: uber 提供了类似的库 [uber-go/atomic](https://github.com/uber-go/atomic)。

为了提高程序的正确性，我开始认为 Go 应该定义一组类型化的原子值，类似于当前的原子值。值: Bool、Int、Uint、Int32、Uint32、Int64、Uint64 和 Uintptr。像 Value 一样，它们也有 CompareAndSwap、Load、Store 和 Swap 方法。例如:

```
type Int32 struct { v int32 }

func (i *Int32) Add(delta int32) int32 {

return AddInt32(&i.v, delta)

}

func (i *Int32) CompareAndSwap(old, new int32) (swapped bool) {

return CompareAndSwapInt32(&i.v, old, new)

}

func (i *Int32) Load() int32 {

return LoadInt32(&i.v)

}

func (i *Int32) Store(v int32) {

return StoreInt32(&i.v, v)

}

func (i *Int32) Swap(new int32) (old int32) {

return SwapInt32(&i.v, new)

}
```

我将 Bool 包括在列表中，因为我们在 Go 标准库中多次用原子整数构造了原子 Bool(在未暴露的 API 中)。显然是有需要的。

我们还可以利用即将到来的泛型支持，并为原子指针定义一个 API，该 API 是类型化的，并且在其 API 中没有包不安全:

```
type Pointer[T any] struct { v *T }

func (p *Pointer[T]) CompareAndSwap(old, new *T) (swapped bool) {

return CompareAndSwapPointer(... lots of unsafe ...)

}
```

(以此类推), 你可能会想到不能使用泛型定义一个类型吗？我没有看到一个干净的方法使用泛型来实现 atomic.Atomic[T]，避免我们引入 Bool、Int 等作为单独的类型。走走看吧。

### 可能的改变: 增加非同步的 atomic

所有其他现代编程语言都提供了一种方法来进行并发内存读写，这种方法不会使程序同步，但也不会使程序无效 (不会算作数据竞争)。C、C++、Rust 和 Swift 都有 relaxed 原子。Java 有 VarHandle 的“普通” 模式。JavaScript 对共享内存缓冲区 (唯一的共享内存) 有非原子的访问权限。Go 没有办法做到这一点。或许应该有，我不知道。

如果我们想添加非同步的原子读写，我们可以向类型化的原子添加 UnsyncAdd、UnsyncCompareAndSwap、UnsyncLoad、UnsyncStore 和 UnsyncSwap 方法。将它们命名为 “unsync” 避免了一些 “relaxed” 名称的问题。首先，有些人用 relaxed 作为相对的比较，如 “acquire/release 是比顺序一致性更宽松的内存顺序。” 你可以说这不是这个术语的恰当用法，但它确实发生了。其次，也是更重要的，这些操作的关键细节不是操作本身的内存排序，而是它们对程序其余部分的同步没有影响。对于不是内存模型专家的人来说，看到 UnsyncLoad 应该清楚没有同步，而 RelaxedLoad 可能不会。在人群中喵一眼 Unsync 也知道它是不安全的。

有了 API，真正的问题是到底要不要添加这些。对提供非同步原子的争论是，它确实对某些数据结构中快速路径的性能有影响。我的总体印象是，它在非 x86 架构上最重要，尽管我没有数据来支持这一点。不提供不同步的原子可以被认为是对那些架构的惩罚。

反对提供非同步原子的一个可能的争论是，在 x86 上，忽略了潜在的编译器重组的影响，非同步原子与 acquire/release 原子是无法区分的。因此，他们可能会被滥用来编写只适用于 x86 的代码。反驳的理由是，这样的花招不会通过 race 检测器，它实现的是实际的内存模型，而不是 x86 内存模型。

由于缺乏证据，我们没有理由添加这个 API。如果有人强烈认为我们应该添加它，那么证明这一点的方法是收集两方面的证据:(1)程序员需要编写的代码的普遍适用性，以及 (2) 使用非同步原子对广泛使用的系统产生的显著性能改进。(使用 Go 以外的语言的程序来显示这一点是很好的。)

### 文档化对编译器优化的禁止项

当前的内存模型最后给出了无效程序的例子。由于内存模型是程序员和编译器作者之间的契约，我们应该添加无效编译器优化的例子。例如，我们可以添加:

#### 不正确的编译

Go 内存模型和 Go 程序一样限制编译器优化。一些在单线程程序中有效的编译器优化在 Go 程序中是无效。特别是，编译器不能在无竞争程序中引入数据竞争。它不能允许单次读取观察到多个值。并且它不能允许一个写操作写入多个值。

Not introducing data races into race-free programs means not moving reads or writes out of conditional statements in which they appear. For example, a compiler must not invert the conditional in this program:

不在无竞争程序中引入数据竞争意味着不移动出现条件语句的读或写。例如，编译器不得反转该程序中的条件:

```
i := 0

if cond {

	i = *p

}
```

也就是说，编译器不能将程序重写为这个:

```
i := *p

if !cond {

	i = 0

}
```

如果 cond 为 false，另一个 goroutine 正在写 \* p，那么原始程序是无竞争的，但是重写的程序包含竞争。

不引入数据竞争也意味着不假设循环终止。例如，在这个程序中，编译器不能将对 _p 或_ q 访问移动到循环前面:

```
n := 0

for e := list; e != nil; e = e.next {

	n++

}

i := *p

*q = 1
```

如果列表指向循环列表，那么原始程序永远不会访问 _p 或_ q，但是重写的程序会。

不引入数据竞争也意味着不假设被调用的函数总是返回或者没有同步操作。例如，在这个程序中，编译器不能移动对 _p 或_ q 访问到函数调用之前:

```
f()

i := *p

*q = 1
```

如果调用从未返回，那么原始程序将不会再访问 _p 或_ q，但是重写的程序会。如果调用包含同步操作，那么原始程序可以建立 f 和 \_p/\_q 的 happen before 关系，但是重写的程序就破坏了这个关系。

不允许单次读取观察多个值, 意味着不从共享内存中重新加载局部变量。例如，在这个程序中，编译器不能扔掉 (spill)i, 并重新加载它:

```
i := *p

if i < 0 || i >= len(funcs) {

panic("invalid function index")

}

... complex code ...

funcs[i]()
```

如果复杂的代码需要许多寄存器，单线程程序的编译器可以在不保存副本的情况下丢弃 i，然后在 funcsi 之前重新加载 i = _p。Go 编译器不能，因为_ p 的值可能已经更改。(相反，编译器可能会将 i 移动到栈上)。

不允许一次写操作写入多个值也意味着不使用在写入之前将本地变量作为临时存储写入的内存。例如，编译器不得在此程序中使用 \* p 作为临时存储:

```
*p = i + *p/2
```

也就是说，它绝不能把程序改写成这样:

```
*p /= 2

*p += i
```

如果 i 和 _p 开始等于 2，则原始代码最终_ p = 3，但是一个竞争线程只能从 _p 读取 2 或 3。重写后的代码最终_ p = 1，然后 \* p = 3，这也允许竞争线程读取 1。

请注意，所有这些优化在 C/C++ 编译器中都是允许的: 与 C/C++ 编译器共享后端的 Go 编译器必须注意禁用对 Go 无效的优化。

这些分类和示例涵盖了最常见的 C/C++ 编译器优化，这些优化与为竞争数据访问定义的语义不兼容。他们明确规定 Go 和 C/C++ 有不同的要求。

## 结论

Go 在其内存模型中保守的方法很好地服务了我们，应该继续下去。然而，有一些早该做的更改，包括定义 sync 和 sync/package package 中新 API 的同步行为。特别是 atomic 的内存模型应该被文档化，其以提供顺序一致的行为，这种行为创建了与它们左右的非原子代码同步的 happen before 关系。这与所有其他现代系统语言提供的默认原子相匹配。

也许更新中最独特的部分是清楚地声明具有数据竞争的程序可能会被停止以报告竞争，但是在其他方面具有明确定义的语义。这约束了程序员和编译器，它优先考虑并发程序的可调试性和正确性，而不是编译器编写者的便利性。

## 感谢

这一系列的帖子从我有幸在谷歌工作的一长串工程师的讨论和反馈中受益匪浅。我感谢他们。我对任何错误或不受欢迎的意见负全部责任。
