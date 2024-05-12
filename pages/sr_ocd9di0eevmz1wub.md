---
title: "[译] 编程语言内存模型"
date: 2021-07-25T12:33:53+08:00
draft: false
categories: [dev]
tags: [golang, dev]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [colobu.com](https://colobu.com/2021/07/11/Programming-Language-Memory-Models/)

> 这是 Russ Cox 的第二篇 Programming Language Memory Models。

这是 Russ Cox 的第二篇 [Programming Language Memory Models](https://research.swtch.com/plmm)。

如果你已经阅读了前一篇[硬件内存模型](https://colobu.com/2021/06/30/hwmm/#%E5%BC%B1%E6%8E%92%E5%BA%8F%E5%92%8C%E6%97%A0%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E7%9A%84%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%87%B4%E6%80%A7), 以及如果有 Java 内存模型或者 C++ 内存模型的经验，本文还好理解，如果你没有相关经验，可能阅读起来比较费劲，建议先阅读一下相关的材料。论文有些词句比较难以理解，本人才学疏浅，有翻译不当之处欢迎批评指正。

编程语言内存模型回答了并行程序可以依靠什么行为以便它们的线程之间可以共享内存的问题。例如，考虑下面这个类似 C 语言的程序，其中 x 和 done 都从零开始：

```
x = 1;                while(done == 0) {  }

done = 1;             print(x);
```

程序试图通过变量 x 从线程 1 向线程 2 发送一条消息 (x)，使用 done 作为信号，通知线程 2 消息已经准备好被接收。如果线程 1 和线程 2 都运行在自己的专用处理器上，并且都运行完成，那么这个程序是否保证能够按照预期完成并打印 1？编程语言内存模型回答了这个问题，以及其它类似问题。

Although each programming language differs in the details, a few general answers are true of essentially all modern multithreaded languages, including C, C++, Go, Java, JavaScript, Rust, and Swift:

尽管每种编程语言在细节上有所不同，但是一些通用答案基本上适用于所有现代多线程语言，包括 C、C++、Go、Java、JavaScript、Rust 和 Swift:

- 首先，如果 x 和 done 是普通变量，那么线程 2 的循环可能永远不会停止。一种常见的编译器优化是在变量首次使用时将其加载到寄存器中，然后尽可能长时间地重用该寄存器，以便将来访问该变量。如果线程 2 在线程 1 执行之前将 done 复制到一个寄存器中，它可能会在整个循环中一直使用该寄存器，永远不会注意到线程 1 后来修改了 done。
- 其次，即使线程 2 的循环会停止，也就是观察到 done == 1，它仍然可能打印 x 的值为 0。编译器通常会根据优化试探法甚至是生成代码时使用哈希表或其他中间数据结构的方式，对程序读写进行重新排序。线程 1 的编译代码可能在 done 赋值之后而不是之前写入 x，或者线程 2 的编译代码也可能在循环前读取 x。

既然这个程序有并发问题，那么问题是如何修复它。

现代语言以原子变量 (atomic variable) 或原子操作 (atomic operation) 的形式提供特殊能力，允许程序同步其线程。如果我们使用一个原子变量实现 done(或者用原子操作来操作它)，那么我们的程序保证会执行完成并打印 1。使用原子变量或者原子操作会产生很多效果：

- 线程 1 的编译代码必须确保对 x 的写入完成，并且在对 done 的写入可见之前对 x 的写入对其他线程可见。
- 线程 2 的编译代码必须在循环的每次迭代中 (重新) 读取 done。
- 线程 2 的编译代码必须在读取 done 之后才读取 x。
- 编译后的代码必须做任何必要的事情来禁用可能会重新引入这些问题的硬件优化

使 done 原子化的最终结果是程序按照我们想要的方式运行，成功地将 x 的值从线程 1 传递到线程 2。

在最初始的程序中，在编译器的代码重新排序之后，线程 1 可能会在线程 2 读取 x 的同时写 x。这是 data race 问题。在修改后的程序中，原子变量 done 用于同步对 x 的访问: 线程 1 现在不可能在线程 2 读取 x 的同时写入 x。这个程序没有数据竞争。一般来说，现代语言保证了无数据竞争的程序总是以顺序一致（sequentially consistent）的方式执行，就好像来自不同线程的操作被随意地但没有重新排序地转移到单个处理器上一样。这是硬件内存模型的 [DRF-SC 属性](https://colobu.com/2021/06/30/hwmm/#%E5%BC%B1%E6%8E%92%E5%BA%8F%E5%92%8C%E6%97%A0%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E7%9A%84%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%87%B4%E6%80%A7)，在编程语言环境中采用。

另外，这些原子变量或原子操作更恰当应该称之为 “同步原子”(synchronizing atomic)，在数据库的意义上，操作是原子的，允许同时进行读和写，就像以某种顺序按顺序运行一样: 当使用原子时，普通变量上的竞争不是竞争。但更重要的是，atomic 同步了程序的其余部分，提供了一种消除非原子数据竞争的方法。标准术语就是“atomic”，也就是这篇文章使用的属于。除非另有说明，请记住将“原子” 理解为“同步原子”。

编程语言内存模型规定了程序员和编译器所需的额外细节，作为他们之间的约定。上面谈到的通用特征基本上适用于所有现代语言，但直到最近，事情才收敛到一点: 在 21 世纪初，有明显更多的变种。即使在今天，各种语言在更多的排序问题上也有显著的差异，包括:

- 原子变量们本身的排序保证是什么？
- 变量是否既可以原子访问，有可以非原子访问？
- 除了原子之外是否还有其它同步机制？
- 是否存在不同步的原子操作？
- 有数据竞争的程序有什么保证？

在做了一些准备之后，这篇文章的剩余部分将探讨不同的语言如何回答这些相关的问题，以及它们解决这些问题之道。这篇文章介绍探索路上的许多错误初始设计，强调我们仍然在学习啥是有效的方案，啥是无效的方案

## 硬件、Litmus Tests、Happens Before 和 DRF-SC

在我们了解任何特定语言的细节之前，我们需要记住[硬件内存模型](https://colobu.com/2021/06/30/hwmm/)的简要经验总结。

> 不同的 CPU 体系架构允许不同数量的指令重新排序，因此在多个处理器上并行运行的代码可以根据体系架构的不同有不同的结果。黄金标准是[顺序一致性](https://colobu.com/2021/06/30/hwmm/#%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%87%B4%E6%80%A7)，即任何执行都必须表现得好像在不同处理器上执行的程序只是以某种顺序交替在单个处理器上执行。对于开发人员来说，这种模型更容易推理，但是今天没有重要的架构能够提供这种模型，因为提供较弱的并发保证能够足够的性能。

很难对不同的内存模型做出完全通用的比较。反过来我们可以关注特定的测试用例，称为 Litmus Test。如果两个内存模型通过 Litmus Test 有不同的行为，那么可以证明它们是不同的，并且通常可以帮助我们判断，至少对于那个测试用例，一个模型比另一个模型是弱还是强。例如，这是我们之前检查的程序的 Litmus Test:

```
Litmus Test: Message Passing

Can this program see r1 = 1, r2 = 0?

x = 1                 r1 = y

y = 1                 r2 = x

On sequentially consistent hardware: no.

On x86 (or other TSO): no.

On ARM/POWER: yes!

In any modern compiled language using ordinary variables: yes!
```

和前一篇文章一样，我们假设每个例子一开始所有共享变量都为零。rN 这个名字表示私有存储，如寄存器或函数变量；像 x 和 y 这样的名称是共享 (全局) 变量。我们问在执行结束时，寄存器的特定设置是否存在可能。在回答硬件的 litmus test 时，我们假设没有编译器对线程中发生的事情进行重新排序: 清单中的指令被直接翻译成汇编指令，交给处理器执行。

结果 r1 = 1，r2 = 0 代表原始程序的线程 2 完成了循环 (这里简化了循环，而是简单的使用 y 进行赋值)，但随后打印 0。这个结果在程序操作的任何顺序一致的交替执行中是不可能的。对于汇编语言版本，在 x86 上打印 0 是不可能的，尽管由于处理器本身的重新排序优化，在 ARM 和 POWER 等更宽松的架构上打印 0 是可能的。在现代语言中，编译期间可能发生的重新排序使得这种结果成为可能，不管底层硬件是什么。

正如我们前面提到的，今天的处理器不保证顺序一致性，而是保证一种称为 [“无数据竞争的顺序一致性” 或 DRF-DRF(有时也写成 SC-DRF)](https://colobu.com/2021/06/30/hwmm/#%E5%BC%B1%E6%8E%92%E5%BA%8F%E5%92%8C%E6%97%A0%E6%95%B0%E6%8D%AE%E7%AB%9E%E4%BA%89%E7%9A%84%E9%A1%BA%E5%BA%8F%E4%B8%80%E8%87%B4%E6%80%A7) 的属性。一个保证 DRF-SC 的系统必须提供被称为同步指令的特定指令，它提供了一种协调不同处理器 (相当于线程) 的方法。程序使用这些指令在一个处理器上运行的代码和另一个处理器上运行的代码之间创建一种 “happens before” 的关系。

例如，这里描述了一个程序在两个线程上的短暂执行；像以前一样，假设每个处理器都有自己的专用处理器:

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ocd9di0eevmz1wub/aaff16bb.png)

我们在之前的帖子里也看到了这个程序。线程 1 和线程 2 执行同步指令。在这个特定执行中，两条 S(a) 指令建立了从线程 1 到线程 2 的 happens-before 关系，因此线程 1 中的 W(x) 发生在线程 2 中的 R(x) 之前。

不同处理器上的两个事件，如果不是按照 happens-before 的顺序排序，可能会同时发生: 确切的顺序搞不清楚。我们说它们同时执行。数据竞争（data race）是指对一个变量的写操作与对同一变量的读操作或写操作同时执行。提供 DRF-SC 的处理器保证没有数据竞争的程序行为就像它们在一个顺序一致的架构上运行一样。这是在现代处理器上编写正确的多线程汇编程序的基本保证。

正如我们前面所看到的，DRF-SC 也是现代语言所采用的基本保证，使得用更高级别语言编写正确的多线程程序成为可能。

## 编译器和优化

我们已经提到过几次，编译器可能会在生成最终可执行代码的过程中对输入程序中的操作重新排序。让我们仔细看看这个声明和其他可能导致问题的优化。

人们普遍认为，编译器几乎可以任意地对普通的内存读写进行重新排序，前提是重新排序不能改变观察到的单线程代码执行的效果。例如，考虑这个程序:

```
w = 1

x = 2

r1 = y

r2 = z
```

由于 w、x、y 和 z 都是不同的变量，这四个语句可以以编译器认为最好的任何顺序执行。

如上所述，如此自由地重新排序读写的能力使得普通编译程序的保证至少和 ARM/POWER 宽松内存模型一样弱，因为编译程序无法通过消息传递的 litmus test。事实上，编译程序的保证更弱。

在上一篇硬件内存模型的文章中，我们将一致性（coherence）看作是 ARM/POWER 架构所能保证的一个例子:

```
Litmus Test: Coherence

Can this program see r1 = 1, r2 = 2, r3 = 2, r4 = 1?

(Can Thread 3 see x = 1 before x = 2 while Thread 4 sees the reverse?)

// Thread 1    // Thread 2    // Thread 3    // Thread 4

x = 1          x = 2          r1 = x         r3 = x

r2 = x         r4 = x

On sequentially consistent hardware: no.

On x86 (or other TSO): no.

On ARM/POWER: no.

In any modern compiled language using ordinary variables: yes!
```

所有现代硬件都保证一致性，这也可以看作是对单个存储单元的操作的顺序一致性。在这个程序中，一个写操作必须覆盖另一个，并且整个系统必须就哪个是哪个达成一致。事实证明，由于编译过程中程序的重新排序，现代语言甚至不能提供一致性。

假设编译器对线程 4 中的两次读取进行了重新排序，然后指令按照以下顺序交替运行:

```
// Thread 1    // Thread 2    // Thread 3    // Thread 4

                                             // (reordered)

(1) x = 1                     (2) r1 = x     (3) r4 = x

               (4) x = 2      (5) r2 = x     (6) r3 = x
```

结果 r1 = 1，r2 = 2，r3 = 2，r4 = 1 在汇编程序中是不可能的，但在高级语言中是可能的。从这个意义上说，编程语言内存模型都比最宽松的硬件内存模型都弱。

但是有一些保证。每个人都同意需要提供 DRF-SC，它不允许引入新的读或写的优化，即使这些优化在单线程代码中是有效的。

例如，考虑下面的代码:

```
if(c) {

	x++;

} else {

	... lots of code ...

}
```

有一个 if 语句，在 else 中有很多代码，在 if 主体中只有一个 x++。拥有更少的分支并彻底消除 if 体可能更快。如果我们编写代码有问题，我们可以在 if 之前运行了 x++, 然后在 else 中用 x-- 进行调整。也就是说，编译器可能会考虑将该代码重写为:

```
x++;

if(!c) {

	x--;

	... lots of code ...

}
```

这是安全的编译器优化吗？在单线程程序中，是的。在一个多线程程序中，当 c 为 false 时，x 与另一个线程共享，答案是否: 优化会在 x 上引入一个原始程序中没有的数据

这个例子来源于 Hans Boehm 2004 年的论文 [Threads Cannot Be Implemented As a Library](https://www.hpl.hp.com/techreports/2004/HPL-2004-209.pdf) 中的一个例子，它说明了语言不能对多线程执行的语义保持沉默。

编程语言内存模型试图精确回答这些问题，即哪些优化是允许的，哪些是不允许的。通过研究过去几十年来尝试编写这些模型的历史，我们可以了解哪些可行，哪些不可行，并了解事情的发展方向。

## 原始的 Java 内存模型 (1996)

Java 是第一个试图写下多线程程序保证的主流语言。它包括互斥体 (mutex)，并定义了它们隐含的内存排序要求。它还包括“volatile” 原子变量: volatile 变量的所有读和写都需要直接在主内存中按程序顺序执行，使得对 volatile 变量的操作以顺序一致的方式进行。最后，Java 制定了 (或者至少试图制定) 具有数据竞争的程序的行为。其中的一部分是为普通变量规定一种一致性的形式，我们将在下面详细讨论。不幸的是，在 Java 语言规范 (1996) 的第一版中，这种尝试至少有两个严重的缺陷。凭借后见之明和我们已经做好的准备，它们很容易解释。当时，它们远没有那么明显被发现。

### Atomic 需要同步

第一个缺陷是 volatile 原子变量是不同步的，所以它们无助于消除程序其余部分的竞争。我们在上面看到的消息传递程序的 Java 版本是:

```
int x;

volatile int done;

x = 1;                while(done == 0) {  }

done = 1;             print(x);
```

因为 done 被声明为 volatile，所以循环肯定会结束: 编译器不能将它缓存在寄存器中并导致无限循环。但是，程序不能保证打印 1。编译器没有被禁止重新排序对 x 和 done 的访问，也没有被要求禁止硬件做同样的事情。

因为 Java volatile 是非同步原子，所以您不能使用它们来构建新的同步原语。从这个意义上说，最初的 Java 内存模型太弱了。

### 一致性与编译器优化不兼容

初的 Java 内存模型也太强了: 强制一致性 —— 一旦线程读取了内存位置的新值，它就不能再读取旧值——不允许基本的编译器优化。前面我们讨论了重新排序读操作会如何破坏一致性，但是你可能会想，好吧，不要重新排序读操作。这里有一个更微妙的方法，可以通过另一个优化来打破一致性: 公共子表达式消除。考虑一下这个 Java 程序:

考虑一下这个 Java 程序:

```
int i = p.x;

int j = q.x;

int k = p.x;
```

在这个程序中，公共子表达式消除 (common subexpression elimination) 会注意到 p.x 被计算了两次，并将最后一行优化为 k = i。但是，如果 p 和 q 指向同一个对象，并且另一个线程在读入 I 和 j 之间向 p.x 写入，那么为 k 重用旧值 i 违反了一致性: 读入 i 看到了旧值，读入 j 看到了新值，但是读入 k 重用 i 会再次看到旧值。不能优化掉冗余读取会阻碍大多数编译器，使生成的代码变慢。

硬件比编译器更容易提供一致性，因为硬件可以应用动态优化: 它可以根据给定内存读写序列中涉及的确切地址来调整优化路径。相比之下，编译器只能应用静态优化: 无论涉及什么地址和值，它们都必须提前写出正确的指令序列。在这个例子中，编译器不能根据 p 和 q 是否碰巧指向同一个对象来轻易改变发生的事情，至少在没有为这两种可能性写出代码的情况下不能，这导致了大量的时间和空间开销。编译器对内存位置之间可能存在的别名不完全了解意味着：实际上要实现一致性就需要放弃基本的优化。

Bill Pugh 在他 1999 年的论文[修复 Java 内存模型](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.17.7914&rep=rep1&type=pdf)中指出了这个问题和其他问题.

## 新的 Java 内存模型 (2004)

由于这些问题，并且因为最初的 Java 内存模型甚至对于专家来说都很难理解，Pugh 和其他人开始努力为 Java 提供一个新的内存模型。该模型后来成为 JSR-133，并在 2004 年发布的 Java 5.0 中被采用。规范参考是 Jeremy Manson, Bill Pugh 和 Sarita Adve 的 [Java 内存模型 (2005)](http://rsim.cs.uiuc.edu/Pubs/popl05.pdf)，Jeremy Manson 的博士论文中有更多细节。新模型遵循 DRF-SC 方法: 保证无数据竞争的 Java 程序以顺序一致的方式执行。

### 同步原子和其它操作

正如我们前面看到的，要编写一个无数据竞争的程序，程序员需要同步操作，这些同步操作可以建立 happens-before 关系，以确保一个线程不会在另一个线程读取或写入非原子变量的同时写入该变量。在 Java 中，主要的同步操作有:

- 线程的创建发生在 (happen before) 它的第一个动作之前
- mutex m 的 unlock 发生在 m 的后续 lock 之前
- 写 volatile 变量 v 发生在后续读取 v 之前

“subsequent”(“后续”)` 是什么意思？Java 定义了所有锁、解锁和 volatile 变量访问的行为，就好像它们发生在一些顺序一致的中断中，给出了整个程序中所有这些操作的总顺序。“后续” 是指总顺序中的较晚执行。也就是说: 锁、解锁和 volatile 变量访问的总顺序定义了后续的含义，然后后续定义了特定执行创建了 happen before 关系，然后 happend before 关系定义了该特定执行是否有数据竞争。如果没有数据竞争，那么执行就会以顺序一致的方式进行。

事实上， volatile 访问必须表现得好像在某种总排序中一样，这意味着在[存储缓冲区 litmus test](https://research.swtch.com/hwmm#x86) 中，不能出现 r1 = 0 和 r2 = 0 的结果:

```
Litmus Test: Store Buffering

Can this program see r1 = 0, r2 = 0?

x = 1                 y = 1

r1 = y                r2 = x

On sequentially consistent hardware: no.

On x86 (or other TSO): yes!

On ARM/POWER: yes!

On Java using volatiles: no.
```

在 Java 中，对于 volatile 变量 x 和 y，读取和写入不能被重新排序: 一个写入必须排在第二位，第二个写入之后的读取必须看到第一个写入。如果我们没有顺序一致的要求——比如说，如果只要求 volatile 是一致的——两次读取可能会错过写入。

这里有一个重要但微妙的点: 所有同步操作的总顺序与 happen-before 关系是分开的。在程序中的每个锁、解锁或 volatile 变量访问之间，在一个方向或另一个方向上不存在 happen-before 关系: 从写入到观察写入的读取，您只获得了 happen-before 的关系。例如，不同互斥体的锁定和解锁之间没有 happen-before 关系。

### 有数据竞争的程序的语义

DRF-SC 只保证没有数据竞争的程序的顺序一致行为。新的 Java 内存模型和最初的一样，定义了有数据竞争的程序的行为，原因有很多:

- 支持 Java 的一般安全（security）和安全保障（safety guarantee）。
- 让程序员更容易发现错误。
- 使攻击者更难利用问题，因为由于数据竞争的原因可能造成的损失更有限。
- 让程序员更清楚他们的程序是做什么的。

新模型不再依赖于一致性，而是重新使用了 happens-before 关系 (已经用来决定程序是否有竞争) 来决定竞争读写的结果。

Java 的具体规则是，对于 word 大小或更小的变量，对变量 (或字段)x 的读取必须看到对 x 的某一次写入所存储的值。如果读取 r 观察到对 x 的写入 w，那么 r 不发生在 w 之前。这意味着 r 可以观察发生在 r 之前的所有写入，并且它可以观察与 r 竞争的写入。

使用 happens-before，结合同步原子 (volatile) 就可以建立新的 happen before 关系，是对原始 Java 内存模型的重大改进。它为程序员提供了更多有用的保证，并使大量重要的编译器优化得到了明确的允许。这个模型至今仍然是 Java 的内存模型。也就是说，这仍然是不完全正确的: 在试图定义竞争程序的语义时，使用 before-before 是有问题的。

### happen-before 不排除语无伦次 (incoherence)

定义程序语义的 “happen-before” 关系的第一个问题与一致性有关(有一次!).(以下例子摘自 Jaroslav Ševčík 和 David Aspinall 的论文[《论 Java 内存模型中程序转换的有效性》(2007 年)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.112.1790&rep=rep1&type=pdf))。)

这里有一个三线程的程序。让我们假设线程 1 和线程 2 已知在线程 3 开始之前完成。

```
lock(m1)              lock(m2)

x = 1                 x = 2

unlock(m1)            unlock(m2)

                                            lock(m1)

                                            lock(m2)

                                            r1 = x

                                            r2 = x

                                            unlock(m2)

                                            unlock(m1)
```

线程 1 在持有 mutex m1 时写入 x = 1。线程 2 在持有 mutex m2 时写入 x = 2。这些是不同的 mutex，所以两个写操作是竞争的。然而，只有线程 3 读取 x，并且它是在获取两个 mutex 后读取的。对 r1 的读取可以是读也可以是写: 两者都发生在它之前，并且都不会完全覆盖另一个。通过相同的参数，读入 r2 可以读或写。但是严格来说，Java 内存模型中没有任何东西说两次读取必须一致：从技术上讲，r1 和 r2 可以读取不同的 x 值。也就是说，这个程序可以以 r1 和 r2 持有不同的值结束。当然，没有真正的实现会产生不同的 r1 和 r2。互斥意味着这两次读取之间没有写操作发生。他们必须得到相同的值。但是内存模型允许不同读取值的事实表明，从某种技术角度来说，它并没有精确地描述真实的 Java 实现。

情况变得更糟。如果我们在两个读数之间再加一个指令，x = r1，会怎么样:

```
// Thread 1           // Thread 2           // Thread 3

lock(m1)              lock(m2)

x = 1                 x = 2

unlock(m1)            unlock(m2)

lock(m1)

lock(m2)

                                            r1 = x

                                            x = r1   // !?

                                            r2 = x

unlock(m2)

unlock(m1)
```

很明显，r2 = x 读数必须使用 x = r1 写的值，因此程序必须在 r1 和 r2 中获得相同的值。两个值 r1 和 r2 现在保证相等。

这两个程序之间的差异意味着我们在编译器方面有问题。看到 r1 = x 后跟着 x = r1 时编译器很可能想要删除第二个赋值，这 “显然” 是多余的。但这种 “优化” 将第二个程序 (r1 和 r2 的值必须相同) 变成了第一个程序(从技术上讲，r1 可能不同于 r2)。因此，根据 Java 内存模型，这种优化在技术上是无效的: 它改变了程序的含义。明确地说，这种优化不会改变在任何你能想象的真实 JVM 上执行的 Java 程序的意义。但不知何故，Java 内存模型不允许这样做，这表明还有更多需要说的。

有关这个例子和其他例子的更多信息，请参见 evík 和 Aspinall 的论文。

## 以前发生的事不排除无用性（acausality）

最后一个例子证明是个简单的问题。这里有一个更难的问题。考虑这个 litmus test，使用普通的 (非 volatile)Java 变量:

```
Litmus Test: Racy Out Of Thin Air Values

Can this program see r1 = 42, r2 = 42?

r1 = x                r2 = y

y = r1                x = r2

(Obviously not!)
```

这个程序中的所有变量都像往常一样从零开始，然后这个程序在一个线程中有效地运行 y = x，在另一个线程中运行 x = y。x 和 y 最终能变成 42 吗？在现实生活中，显然不能。但为什么不呢？内存模型并没有否定这个结果。

假设 “r1 = x” 的读数是 42。那么 “y = r1” 会将 42 写入 y，然后竞争 “r2 = y” 会读取 42，导致 “x = r2” 写入 42 到 x，且 write 与原始 “r1 = x” 竞争 (因此可被原始“r1 = x” 观察到)，看起来证明原始假设是正确的。在这个例子中，42 被称为无中生有的值，因为它看起来没有任何理由，但随后用循环逻辑证明了自己。如果内存在当前的 0 之前曾经持有 42，而硬件错误地推测它仍然是 42，会怎么样？这种猜测可能会成为一个自我实现的预言。(在 Spectre 和相关攻击显示出硬件是如何不断进步的之前，这个论点似乎更加牵强。即便如此，没有一种硬件是这样凭空创造值的。)

很明显，这个程序不能以 r1 和 r2 设置为 42 结束，但是 happens-before 本身并不能解释为什么不能这样做。这再次表明存在某种不完整性。新的 Java 内存模型花费了大量时间来解决这种不完整性，稍后将对此进行更详细的描述。

这个程序有一个竞争——x 和 y 的读取与其他线程中的写入竞争——所以我们可能会继续认为它是一个不正确的程序。但是这里有一个没有数据竞争的版本:

```
Litmus Test: Non-Racy Out Of Thin Air Values

Can this program see r1 = 42, r2 = 42?

// Thread 1           // Thread 2

r1 = x                r2 = y

if (r1 == 42)         if (r2 == 42)

    y = r1                x = r2

(Obviously not!)
```

由于 x 和 y 从零开始，任何顺序一致的执行都不执行写操作，所以这个程序没有写操作，所以没有竞争。不过，同样，仅 happen-before 并不排除这样的可能性，假设 r1 = x 看到竞争不是 write，然后根据这个假设，两个条件最终都为真，x 和 y 最终都是 42。这是另一种无中生有的价值，但这一次是在没有竞争的程序中。任何保证 DRF-SC 的模型都必须保证这个程序只在末尾看到全零，然而 happens-before 并没有解释为什么。

Java 内存模型花了很多我不想赘述的话来试图排除这些类型的假设。不幸的是，五年后，Sarita Adve and Hans Boehm 对这个内存模型有这样的评价:

> Prohibiting such causality violations in a way that does not also prohibit other desired optimizations turned out to be surprisingly difficult. … After many proposals and five years of spirited debate, the current model was approved as the best compromise. … Unfortunately, this model is very complex, was known to have some surprising behaviors, and has recently been shown to have a bug.
>
> 以一种不妨碍其他期望的优化的方式来禁止这种因果关系冲突，结果令人惊讶地难以实现。…… 经过许多提议和五年的激烈辩论，目前的模式被认为是最好的折衷方案。…… 不幸的是，这个模型非常复杂，已知有一些令人惊讶的缺点，最近被证明有一个错误。

(Adve 和 Boehm, [“Memory Models: A Case For Rethinking Parallel Languages and Hardware,”](https://cacm.acm.org/magazines/2010/8/96610-memory-models-a-case-for-rethinking-parallel-languages-and-hardware/fulltext) August 2010)

## C++11 内存模型 (2011)

让我们把 Java 放在一边，研究 C++。受 Java 新内存模型明显成功的启发，许多同样的人开始为 C++ 定义一个类似的内存模型，最终在 C++11 中采用。与 Java 相比，C++ 在两个重要方面有所不同。首先，C++ 对具有数据竞争的程序不做任何保证，这似乎消除了对 Java 模型复杂性的需求。其次，C++ 提供了三种原子性: 强同步 (“顺序一致”)、弱同步(“acquire/release”,、coherence-only) 和无同步 (“relaxed”，用于隐藏竞争)。“relaxed” 的原子性重新引入了 Java 关于定义什么是竞争程序的所有复杂性。结果是 C++ 模型比 Java 更复杂，但对程序员的帮助更小。

C++11 还定义了原子栅栏作为原子变量的替代，但是它们并不常用，我不打算讨论它们。

### DRF-SC 还是 着火 (Catch Fire）

与 Java 不同，C++ 没有给有竞争的程序任何保证。任何有竞争的程序都属于 [“未定义的行为”](https://blog.regehr.org/archives/213)。允许在程序执行的最初几微秒内进行竞争访问，从而在几小时或几天后导致任意的错误行为。这通常被称为 “DRF-SC 或着火”: 如果程序没有数据竞争，它以顺序一致的方式运行，如果有数据竞争，它可以做任何事情，包括着火。

关于 DRF-SC 或 Catch Fire 的论点的更详细的介绍，参见 Boehm，[“内存模型原理”(2007)](http://open-std.org/jtc1/sc22/wg21/docs/papers/2007/n2176.html#undefined) 和 Boehm 和 Adve，[“C++ 并发内存模型的基础”(2008)](https://www.hpl.hp.com/techreports/2008/HPL-2008-56.pdf)。

简而言之，这中情况有四个正当理由:

Briefly, there are four common justifications for this position:

- C 和 C++ 已经充斥着未定义的行为，这是编译器优化横行的语言小角落，用户最好不要迟疑。多一个未定义行为又有多大的坏处？
- 现有的编译器和库编写时没有考虑线程，以任意方式破坏了有竞争的程序。找到并修复所有的问题太难了，或者这个争论没有了，尽管还不清楚那些不固定的编译器和库是如何应对宽松的原子的。
- 真正知道自己在做什么并希望避免未定义行为的程序员可以使用 relaxed 的原子。
- 不定义竞争语义允许实现检测和诊断竞争并停止执行。

就我个人而言，最后一个理由是我认为唯一有说服力的，尽管我认为这个意思是说 “允许使用竞争检测器”，而不是说 “一个整数的竞争会使整个程序无效。”

这里有一个来自 “内存模型原理” 的例子，我认为它抓住了 C++ 方法的本质以及它的问题。考虑这个程序，它引用了一个全局变量 x。

```
unsigned i = x;

if (i < 2) {

	foo: ...

switch (i) {

case 0:

		...;

break;

case 1:

		...;

break;

	}

}
```

据称，C++ 编译器可能会将 i 保存在寄存器中，但如果标签 foo 处的代码很复杂，则需要重用这些寄存器。而不是转移 i 当前的值到栈上， 编译器可能会决定在到达 switch 语句时，再次从全局 x 加载 i。结果是，在 if 体中，i < 2 可能不再为真。如果编译器使用由 i 索引的表将开关编译成计算跳转，那么代码将从表的末尾索引并跳转到一个意外的地址，这可能非常糟糕。

从这个例子和其他类似的例子中，C++ 内存模型的作者得出结论，任何有竞争的访问都必须被允许对程序的未来执行造成无限的损害。我个人的结论是，在多线程程序中，编译器不应该认为它们可以通过重新执行初始化局部变量的内存读取来重新加载像 i 这样的局部变量。指望为单线程世界编写的现有 C++ 编译器找到并修复像这样的代码生成问题可能是不切实际的，但是在新的语言中，我认为我们应该有更高的目标。

### 题外话, C/C++ 的未定义行为

另外，C 和 C++ 坚持编译器对程序中的错误行为进行任意的行为的能力导致了真正荒谬的结果。例如，考虑这个程序，这是 2017 在推特上讨论的话题：

```
#include <cstdlib>

typedef int (*Function)();

static Function Do;

static int EraseAll() {

return system("rm -rf slash");

}

void NeverCalled() {

	Do = EraseAll;

}

int main() {

return Do();

}
```

如果你是一个像 Clang 这样的现代 C++ 编译器，你可能会想到这个程序如下：

- 很明显，main 函数中，Do 要么为空，要么为 EraseAll。
- 如果 Do 是 Erasell，那么 Do() 与 Erasell() 相同。
- 如果 Do 是 null, 那么 Do() 是未定义行为。我可以随意实现，包括作为 EraseAll() 无条件实现。
- 因此，我可以将间接调用 Do() 优化为直接调用 EraseAll()。
- 当我处理这里的时候，我可能直接内联 EraseAll。

最终结果是，Clang 将程序优化为:

```
int main() {

return system("rm -rf slash");

}
```

你必须承认: 前一个例子，局部变量 i 可能在 if (i < 2) 体的中途突然停止小于 2 的可能性似乎并不合适。

本质上，现代 C 和 C++ 编译器假设没有程序员敢尝试未定义的行为。一个程序员写一个有 bug 的程序？不可思议！

就像我说的，在新的语言中，我认为我们应该有更高的目标。

### Acquire/release atomic

C++ 采用了顺序一致的原子变量，很像 (新的)Java 的 volatile 变量 (与 C++ volatile 没有关系)。在我们的消息传递示例中，我们可以将 done 声明为

```
atomic<int> done;
```

然后像使用普通变量一样使用 done，就像在 Java 中一样。或者我们可以把一个普通的整型变量去掉。然后使用

```
atomic_store(&done, 1);
```

和：

```
while(atomic_load(&done) == 0) {  }
```

去访问它。

无论哪种方式，完成的操作都参与原子操作的顺序一致的总顺序，并同步程序的其余部分。

C++ 还添加了较弱的原子，可以使用 atomic_store_explicit 和 atomic_load_explicit 以及附加的 memory 排序参数来访问这些原子。使用 memory_order_seq_cst 使显式调用等效于上面较短的调用。

较弱的原子称为 acquire/release 原子，一个 release 如果被后来的 acquire 观察到，那么就创建了一个 happen-before 的关系 (从 release 到 acquire)。这个术语意在唤起 mutex:release 就像 unlock mutex，acquire 就像 lock 同一个 mutex。release 之前执行的写入必须对后续 acquire 之后执行的读取可见，就像 unlock mutex 之前执行的写入必须对后来 unlock mutex 之后执行的读取可见一样。

The terminology is meant to evoke mutexes: release is like unlocking a mutex, and acquire is like locking that same mutex. The writes executed before the release must be visible to reads executed after the subsequent acquire, just as writes executed before unlocking a mutex must be visible to reads executed after later locking that same mutex.

为了使用较弱的原子，我们可以将消息传递示例改为:

```
atomic_store(&done, 1, memory_order_release);
```

和

```
while(atomic_load(&done, memory_order_acquire) == 0) {  }
```

它仍然是正确的。但不是所有的程序都会这样

回想一下，顺序一致的原子要求程序中所有原子的行为与执行的一些全局交替执行 (全局顺序) 一致。acquire/release 原子不会。它们只需要对单个内存位置的操作进行顺序一致的交替执行。也就是说，它们只需要一致性。结果是，一个使用具有多个存储位置的 acquire/release 原子的程序可能会观察到无法用程序中所有 acquire/release 原子的顺序一致的交替来解释的执行，这可以说是违反了 DRF-SC！

为了说明不同之处，这里再举一个存储缓冲区的例子:

```
Litmus Test: Store Buffering

Can this program see r1 = 0, r2 = 0?

x = 1                 y = 1

r1 = y                r2 = x

On sequentially consistent hardware: no.

On x86 (or other TSO): yes!

On ARM/POWER: yes!

On Java (using volatiles): no.

On C++11 (sequentially consistent atomics): no.

On C++11 (acquire/release atomics): yes!
```

C++ 顺序一致的原子与 Java 的 volatile 相匹配。但是 acquire-release 原子在 x 的顺序和 y 的顺序之间没有强加任何关系。特别地，允许程序表现得好像 r1 = y 发生在 y = 1 之前，而同时 r2 = x 发生在 x = 1 之前，使得 r1 = 0，r2 = 0 与整个程序的顺序一致性相矛盾。为什么要引入这些较弱的获取 / 发布原子？可能是因为它们是 x86 上的普通内存操作。

请注意，对于观察特定写入的一组给定的特定读取，C++ 顺序一致原子和 C++ acquire/release 原子创建相同的 happen-before 关系。它们之间的区别在于，顺序一致的原子不允许观察特定写入的某些特定读取集，但 acuqire/release 原子允许这些特定读取集。一个这样的例子是导致存储缓冲测试出现 r1 = 0，r2 = 0 的结果。

acquire/release 原子在实践中不如提供顺序一致性的原子有用。这里有一个例子。假设我们有一个新的同步原语，一个具有通知和等待两种方法的一次性条件变量。为了简单起见，只有一个线程会调用 Notify，只有一个线程会调用 Wait。我们想安排 Notify 在另一个线程还没有等待的时候是无锁的。我们可以用一对原子整数来实现:

```
class Cond {

	atomic<int> done;

	atomic<int> waiting;

	...

};

void Cond::notify() {

	done = 1;

if (!waiting)

return;

}

void Cond::wait() {

	waiting = 1;

if(done)

return;

}
```

这段代码的重要部分是在检查 waiting 之前 notify 设置 done 为 1, 为 wait 在检查 done 之前设置 waiting 为 1, 因此并发调用 notify 和 wait 不会导致 notify 立即返回并等待休眠。但是使用 C++ acquire/release 原子，它们可以。而且它们可能只需要很少的几率发生，使得这种错误很难重现和诊断。(更糟糕的是，在像 64 位 ARM 这样的一些架构上，实现 acquire/release 原子的最佳方式是顺序一致的原子，因此您可能会编写在 64 位 ARM 上运行良好的代码，但在移植到其他系统时才发现它是不正确的。)

基于这种理解，“acquire/release”对于这些原子来说是一个不幸的名字，因为顺序一致的原子做同样的 acquire 和 release。不同之处在于顺序一致性的丧失。称这些为 “一致性” 原子可能更好。太迟了。

### Relaxed atomic

C++ 并没有仅仅停留在连贯的获取 / 发布原子上。它还引入了非同步原子，称为 relaxed 原子。这些原子根本没有同步效果——它们没有创建先发生的边——并且它们根本没有排序保证。事实上，宽松原子读 / 写和普通读 / 写没有区别，除了宽松原子上的竞争不被认为是竞争，不能着火。

C++ 没有停止与仅仅提供一致性的 acquire/release 原子。它还引入了非同步原子，称为 relaxed 原子 (memory_order_relaxed)。这些原子根本没有同步效果——它们没有创建 happens-before 关系——并且它们根本没有排序保证。事实上，relaxed 原子读 / 写和普通读 / 写没有区别，除了 relaxed 原子上的竞争不被认为是竞争，不能着火。

修改后的 Java 内存模型的大部分复杂性来自于定义具有数据竞争的程序的行为。如果 C++ 采用 DRF-SC 或 Catch Fire——实际上不允许有数据竞争的程序——意味着我们可以扔掉前面看到的所有奇怪的例子，那么 C++ 语言规范将比 Java 语言规范更简单，那就太好了。不幸运的是，包括 releaxed 的原子最终保留了所有这些关注，这意味着 C++11 规范最终并不比 Java 简单。

像 Java 的内存模型一样，C++11 的内存模型最终也是不正确的。考虑之前的无数据竞争计划:

```
Litmus Test: Non-Racy Out Of Thin Air Values

Can this program see r1 = 42, r2 = 42?

r1 = x                r2 = y

if (r1 == 42)         if (r2 == 42)

    y = r1                x = r2

(Obviously not!)

C++11 (ordinary variables): no.

C++11 (relaxed atomics): yes!
```

Viktor Vafeiadis 和其他人在他们的论文 [“Common Compiler Optimisations are Invalid in the C11 Memory Model and what we can do about it” (2015)](https://fzn.fr/readings/c11comp.pdf) 中表明，C++11 规范保证当 x 和 y 是普通变量时，该程序必须以 x 和 y 设置为零结束。但是如果 x 和 y 是 relaxed 的原子，那么，严格来说，C++11 规范不排除 r1 和 r2 最终都可能达到 42。(惊喜！)

详情见论文，但在较高的层次上，C++11 规范有一些正式规则，试图禁止无中生有的值，并结合了一些模糊的词语来阻止其他类型的有问题的值。这些正式的规则就是问题所在，因此 C++14 放弃了它们，只留下了模糊的词语。引用删除它们的基本原理，C++11 公式证明是 “既不充分的，因为它使人们基本上无法对内存顺序放松的程序进行推理，也严重有害，因为它可以说不允许在 ARM 和 POWER 等体系结构上对 memory_order_relaxed 的所有合理实现。”

综上所述，Java 试图正式排除所有不合法的执行，但失败了。然后，借助 Java 的后知后觉，C++11 试图正式地只排除一些不合法的执行，也失败了。C++14 然后说什么都不正式。这不是正确的方向。

事实上，Mark Batty 和其他人在 2015 年发表的一篇题为 [“编程语言并发语义的问题”](https://www.cl.cam.ac.uk/~jp622/the_problem_of_programming_language_concurrency_semantics.pdf) 的论文给出了这一发人深省的评估:

> Disturbingly, 40+ years after the first relaxed-memory hardware was introduced (the IBM 370/158MP), the field still does not have a credible proposal for the concurrency semantics of any general-purpose high-level language that includes high-performance shared-memory concurrency primitives.
>
> 令人不安的是，在引入第一个 relaxed 内存硬件 (IBM 370/158MP)40 多年后，该领域仍然没有一个可信的提案来描述任何包含高性能共享内存并发原语的通用高级语言的并发语义。

甚至定义弱有序硬件的语义 (忽略软件和编译器优化的复杂性) 也不太顺利。张思卓等人在 2018 年发表的一篇名为[《构建弱记忆模型》](https://arxiv.org/abs/1805.07886)的论文讲述了最近发生的一些事情:

> Sarkar et al. published an operational model for POWER in 2011, and Mador-Haim et al. published an axiomatic model that was proven to match the operational model in 2012. However, in 2014, Alglave et al. showed that the original operational model, as well as the corresponding axiomatic model, ruled out a newly observed behavior on POWER machines. For another instance, in 2016, Flur et al. gave an operational model for ARM, with no corresponding axiomatic model. One year later, ARM released a revision in their ISA manual explicitly forbidding behaviors allowed by Flur's model, and this resulted in another proposed ARM memory model. Clearly, formalizing weak memory models empirically is error-prone and challenging.
>
> Sarkar 等人在 2011 年公布了 POWER 的运行模型，Mador-Haim 等人在 2012 年公布了一个公理化模型，该模型被证明与运行模型相匹配。然而，在 2014 年，Alglave 等人表明，最初的操作模型以及相应的公理模型排除了在 POWER 机器上新观察到的行为。再比如，2016 年，Flur 等人给出了一个 ARM 的操作模型，没有对应的公理模型。一年后，ARM 在他们的 ISA 手册中发布了一个修订版，明确规定了 Flur 模型允许的行为，这导致了另一个提出的 ARM 内存模型。显然，根据经验形式化弱记忆模型是容易出错且具有挑战性的。

在过去的十年里，致力于定义和形式化所有这些的研究人员非常聪明、有才华和坚持不懈，我并不想通过指出结果中的不足来贬低他们的努力和成就。我从这些简单的结论中得出结论，这个指定线程程序的确切行为的问题，即使没有竞争，也是难以置信的微妙和困难。如今，即使是最优秀、最聪明的研究人员似乎也无法理解这一点。即使不是，编程语言定义在日常开发人员可以理解的情况下效果最好，而不需要花费十年时间研究并发程序的语义。

## C, Rust 和 Swift 的内存模型

C11 也采用了 C++11 内存模型，使其成为 C/C++11 内存模型。

2015 年的 [Rust 1.0.0](https://doc.rust-lang.org/std/sync/atomic/) 和 2020 年的 [Swift 5.3](https://github.com/apple/swift-evolution/blob/master/proposals/0282-atomics.md) 都整体采用了 C/C++ 内存模型，拥有 DRF-SC 或 Catch Fire 以及所有的原子类型和原子栅栏。

毫不奇怪，这两种语言都采用了 C/C++ 模型，因为它们建立在 C/C++ 编译器工具链 (LLVM) 上，并强调与 C/C++ 代码的紧密集成。

### 硬件题外话： 有效的顺序一致性 atomic

早期的多处理器体系结构有多种同步机制和内存模型，具有不同程度的可用性。在这种多样性中，不同同步抽象的效率取决于它们如何映射到架构所提供的内容。为了构造顺序一致的原子变量的抽象，有时唯一的选择是使用比严格必要的要多得多、贵得多的内存栅栏 barriers，特别是在 ARM 和 POWER 上。

随着 C、C++ 和 Java 都提供了这种顺序一致性同步原子的抽象，硬件设计者就应该让这种抽象变得高效。ARMv8 架构 (32 位和 64 位) 引入了 ldar 和 stlr load 和 store 指令，提供了直接的实现。在 2017 年的一次谈话中，赫伯 · 萨特声称，IBM 已经批准了他的说法，他们希望未来的 POWER 实现对顺序一致的原子也有某种更有效的支持，这让程序员 “更没有理由使用 relaxed 的原子。” 我不知道是否发生了这种情况，尽管在 2021 年，POWER 的相关性远不如 ARMv8。

这种融合的效果是顺序一致的原子现在被很好地理解，并且可以在所有主要的硬件平台上有效地实现，这使得它们成为编程语言内存模型的一个很好的目标。

## JavaScript 内存模型 (2017)

你可能会认为 JavaScript，一种众所周知的单线程语言，不需要担心内存模型，当代码在多个处理器上并行运行时会发生什么。我当然有。但是你和我都错了。

JavaScript 有 web workers，它允许在另一个线程中运行代码。按照最初的设想，工作人员只通过显式的消息复制与主 JavaScript 线程进行通信。没有共享的可写内存，就没有必要考虑像数据竞争这样的问题。然而，ECMAScript 2017 (ES2017) 增加了 SharedArrayBuffer 对象，它让主线程和工作线程共享一块可写内存。为什么要这样做？在提案的[早期草稿](https://github.com/tc39/ecmascript_sharedmem/blob/master/historical/Spec_JavaScriptSharedMemoryAtomicsandLocks.pdf)中，列出的第一个原因是将多线程 C++ 代码编译成 JavaScript。

当然，共享可写内存还需要定义同步的原子操作和内存模型。JavaScript 在三个重要方面偏离了 C++:

- 首先，它将原子操作限制在顺序一致的原子上。其他原子可以被编译成顺序一致的原子，可能会损失效率，但不会损失正确性，只有一种原子可以简化系统的其余部分。
- 第二，JavaScript 不采用 “DRF-SC 或着火。” 相反，像 Java 一样，它仔细定义了竞争访问的可能结果。其原理与 Java 非常相似，尤其是安全性。允许竞争 read 返回任何值允许 (可以说是鼓励) 实现返回不相关的数据，这可能会导致运行时[私有数据的泄漏](https://github.com/tc39/ecmascript_sharedmem/blob/master/DISCUSSION.md#races-leaking-private-data-at-run-time)。
- 第三，部分是因为 JavaScript 为竞争程序提供了语义，它定义了当原子和非原子操作在同一个内存位置使用时，以及当使用不同大小的访问访问同一个内存位置时会发生什么。

精确定义 racy 程序的行为会导致 relaxed 内存语义的复杂性，以及如何禁止无中生有的读取和类似情况。除了这些与其他地方基本相同的挑战之外，ES2017 定义还有两个有趣的错误，它们是由于与新的 ARMv8 原子指令的语义不匹配而引起的。这些例子改编自康拉德 · 瓦特等人 2020 年的论文 [“Repairing and Mechanising the JavaScript Relaxed Memory Model.”](https://www.cl.cam.ac.uk/~jp622/repairing_javascript.pdf)

正如我们在上一节中提到的，ARMv8 增加了 ldar 和 stlr 指令，提供顺序一致的原子加载和存储。这些是针对 C++ 的，它没有定义任何具有数据竞争的程序的行为。因此，毫不奇怪，这些指令在竞争程序中的行为与 ES2017 作者的期望不符，尤其是它不符合 ES2017 对竞争程序行为的要求。

```
Litmus Test: ES2017 racy reads on ARMv8

Can this program (using atomics) see r1 = 0, r2 = 1?

x = 1                 y = 1

r1 = y                x = 2 (non-atomic)

                      r2 = x

C++: yes (data race, can do anything at all).

Java: the program cannot be written.

ARMv8 using ldar/stlr: yes.

ES2017: no! (contradicting ARMv8)
```

在这个程序中，所有的读和写都是顺序一致的原子，除了 x = 2: 线程 1 使用原子存储写 x = 1，但是线程 2 使用非原子存储写 x = 2。在 C++ 中，这是一场数据竞争，所以所有的赌注都取消了。在 Java 中，这个程序是不能写的: x 必须要么声明为 volatile，要么不声明；它有时不能被原子访问。在 ES2017 中，内存模型不允许 r1 = 0，r2 = 1。如果 r1 = y 读取 0，线程 1 必须在线程 2 开始之前完成，在这种情况下，非原子 x = 2 似乎发生在 x = 1 之后并覆盖 x = 1，导致原子 r2 = x 读取 2。这个解释似乎完全合理，但这不是 ARMv8 处理器的工作方式。

事实证明，对于 ARMv8 指令的等效序列，对 x 的非原子写可以在对 y 的原子写之前重新排序，因此该程序实际上产生 r1 = 0，r2 = 1。这在 C++ 中不是问题，因为竞争意味着程序可以做任何事情，但对于 ES2017 来说，这是一个问题，它将竞争行为限制在一组不包括 r1 = 0、r2 = 1 的结果上

由于 ES2017 的明确目标是使用 ARMv8 指令来实现顺序一致的原子操作，Watt 等人报告说，他们建议的修复 (计划包含在标准的下一个修订版中) 将削弱竞争行为约束，足以允许这种结果。(当时我不清楚 “下一次修订” 是指 ES2020 还是 ES2021。)

Watt 等人提出的修改还包括对第二个 bug 的修复，第一个 bug 是由 Watt、Andreas Rossberg 和 Jean Pichon-pharabad 提出的，其中一个无数据竞争的程序没有按照 ES2017 规范给出顺序一致的语义。该程序由下式给出:

```
Litmus Test: ES2017 data-race-free program

Can this program (using atomics) see r1 = 1, r2 = 2?

// Thread 1           // Thread 2

x = 1                 x = 2

                      r1 = x

                      if (r1 == 1) {

                          r2 = x // non-atomic

                      }

On sequentially consistent hardware: no.

C++: I'm not enough of a C++ expert to say for sure.

Java: the program cannot be written.

ES2017: yes! (violating DRF-SC).
```

在这个程序中，所有的读和写都是顺序一致的原子，除了 r2 = x，标记为。这个程序是无数据竞争的: 非原子读取必须参与任何数据竞争，只有当 r1 = 1 时才执行，这证明线程 1 的 x = 1 发生在 r1 = x 之前，因此也发生在 r2 = x 之前。DRF-SC 意味着程序必须以顺序一致的方式执行，因此 r1 = 1，r2 = 2 是不可能的，但 ES2017 规范允许这样做。

因此，ES2017 程序行为规范同时太强 (它不允许 racy 程序的真实 ARMv8 行为) 和太弱(它允许无竞争程序的非顺序一致行为)。如前所述，这些错误已经改正。即便如此，这也再次提醒我们，精确地使用以前发生的事情来指定无数据竞争程序和活泼程序的语义是多么微妙，以及将语言内存模型与底层硬件内存模型相匹配是多么微妙。

令人鼓舞的是，至少到目前为止，除了顺序一致的原子之外，JavaScript 避免了添加任何其他原子，并抵制了 “DRF-SC 或着火” 结果是内存模型作为 C/C++ 编译目标是有效的，但更接近于 Java。

## 结论

看看 C、C++、Java、JavaScript、Rust 和 Swift，我们可以得出以下结论:

- 它们都提供顺序一致的同步原子，用于协调并行程序的非原子部分。
- 它们的目的都是确保程序使用适当的同步来避免数据竞争，就像以顺序一致的方式执行一样。
- Java 和 JavaScript 避免了引入弱 (acquire/release) 同步原子，这似乎是为 x86 量身定制的。
- 它们都为程序提供了一种方式来执行 “有意的” 数据竞争，而不会使程序的其余部分无效。在 C、C++、Rust 和 Swift 中，这种机制是 relaxed，非同步原子，一种特殊的内存访问形式。在 Java 和 JavaScript 中，这种机制就是普通的内存访问。
- 没有一种语言找到了正式禁止悖论的方法，比如无中生有的值，但是所有语言都非正式地禁止它们。

与此同时，处理器制造商似乎已经接受了顺序一致同步原子的抽象对于高效实现非常重要，并开始这样做：ARMv8 和 RISC-V 都提供了直接支持。

最后，真正大量的验证和形式分析工作已经进入了理解这些系统和精确陈述它们的行为。特别令人鼓舞的是，瓦特等人在 2020 年能够给出一个 JavaScript 重要子集的正式模型，并使用定理证明器来证明编译对 ARM、POWER、RISC-V 和 x86-TSO 的正确性。

在第一个 Java 内存模型问世 25 年后，经过许多人世纪的研究努力，我们可能开始能够形式化整个内存模型。也许，有一天，我们也会完全理解他们。

【本系列的下一篇文章，关于 Go 内存模型，计划在 7 月 12 日那一周发布。】

## 感谢

这一系列的帖子从我有幸在谷歌工作的一长串工程师的讨论和反馈中受益匪浅。我感谢他们。我对任何错误或不受欢迎的意见负全部责任。
