---
title: Golang垃圾回收 屏障技术
date: 2024-10-04T15:30:37.553Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/74853110
---
> 作者：镜萱

垃圾回收 (Garbage Collection，简称 GC) 是编程语言中提供的自动的内存管理机制，自动释放不需要的对象，让出存储器资源，无需程序员手动执行。

Golang 中的垃圾回收主要应用三色标记法，GC 过程和其他用户 goroutine 可并发运行，但需要一定时间的 STW (stop the world)，STW 的过程中，CPU 不执行用户代码，全部用于垃圾回收，这个过程的影响很大，Golang 进行了多次的迭代优化来解决这个问题。

* 1.3 以前的版本使用标记 - 清扫的方式，整个过程都需要 STW。
* 1.3 版本分离了标记和清扫的操作，标记过程 STW，清扫过程并发执行。
* 1.5 版本在标记过程中使用三色标记法。回收过程主要有四个阶段，其中，标记和清扫都并发执行的，但标记阶段的前后需要 STW 一定时间来做 GC 的准备工作和栈的 re-scan。

![](https://pic3.zhimg.com/v2-ed600e255367b30af1c489131357eadc_b.jpg)

1. 1. Sweep Termination: 收集根对象，清扫上一轮未清扫完的 span，启用写屏障和辅助 GC，辅助 GC 是将一定量的标记和清扫工作交给用户 goroutine 来执行，写屏障在后面会详细说明。
   2. Mark: 扫描所有根对象和根对象可以到达的对象，并标记它们
   3. Mark Termination: 完成标记工作，重新扫描部分根对象 (要求 STW)，关闭写屏障和辅助 GC
   4. Sweep: 按标记结果清扫对象

* 1.8 版本引入了混合写屏障机制（hybrid write barrier），避免了对栈 re-scan 的过程，极大的减少了 STW 的时间。

### 标记 - 清扫算法

标记 - 清扫算法是一种追踪式的垃圾回收算法，并不会在对象死亡后立即将其清除掉，而是在一定条件下触发，统一校验系统中的存活对象，进行回收工作。在 Golang 中，有以下几种情况可触发：

* gcTriggerAlways: 强制触发 GC
* gcTriggerHeap: 当前分配的内存达到一定阈值时触发，这个阈值在每次 GC 过后都会根据堆内存的增长情况和 CPU 占用率来调整
* gcTriggerTime: 当一定时间没有执行过 GC 就触发 GC（2 分钟）
* gcTriggerCycle: runtime.GC () 调用

标记 - 清扫分为两个部分，标记和清扫，标记过程会遍历所有对象，查找出死亡对象。我们可以使用指针的可达性可确认对象的存活，也就是说，如果存在一条从根出发的指针链最终可指向某个对象，就认为这个对象是存活的。这样，未能证明存活的对象就可以标记为死亡了。

> 根：是一个有限的指针集合，程序可不经过其他对象直接访问这些指针，堆中的对象被加载时，需要先加载根中的指针。在 Go 中，一般为 goroutine 自己的栈空间和全局栈空间。

标记结束后，再次进行遍历，清除掉确认死亡的对象。

![动图封面](https://picx.zhimg.com/v2-18defbd05ce6696c1355dc7de069de1d_b.jpg)

### 三色标记法

将标记 - 清扫法使用三色抽象的方式来描述，可以方便我们理解回收器的正确性。

回收器通过将对象图划分为三种状态来指示其扫描过程。黑色对象为该对象及其后代已处理且该对象确认存活的，灰色对象为已经扫描到但未处理完成或者还需要再次处理的，白色对象为尚未扫描到或已经死亡的。

![动图封面](https://pic4.zhimg.com/v2-5fe8ea45e2518ca19cfeb31558160fb1_b.jpg)

如图所示，回收器从根出发，扫描到可达对象后标记其为灰色，放入灰色队列，在扫描灰色对象引用的对象，将他们标记为灰色，自身标记为黑色。扫描全部结束后，剩余未被扫描到的对象留在白色队列中，表示已死亡。

标记过程需的要 STW，因为对象引用关系如果在标记阶段做了修改，会影响标记结果的正确性。例如下图，灰色对象 B 中包含指向白色对象 C 的指针 e，对象 C 尚未被扫描，此时，如有其他程序，将 e 指针从 B 对象中删除，并将指向对象 C 的新指针 f 插入到黑色对象 A 中，由于对象 A 早已完成扫描，对象 C 就会一直保持白色状态直到被回收。

![](https://pic1.zhimg.com/v2-be47f647bc1521f1d6c2d7a886560abc_b.jpg)

可以看出，一个白色对象被黑色对象引用，是注定无法通过这个黑色对象来保证自身存活的，与此同时，如果所有能到达它的灰色对象与它之间的可达关系全部遭到破坏，那么这个白色对象必然会被视为垃圾清除掉。 故当上述两个条件同时满足时，就会出现对象丢失的问题。

如果这个白色对象下游还引用了其他对象，并且这条路径是指向下游对象的唯一路径，那么他们也是必死无疑的。

为了防止这种现象的发生，最简单的方式就是 STW，直接禁止掉其他用户程序对对象引用关系的干扰，但是 STW 的过程有明显的资源浪费，对所有的用户程序都有很大影响，如何能在保证对象不丢失的情况下合理的尽可能的提高 GC 效率，减少 STW 时间呢？

在 Golang 中使用并发的垃圾回收，也就是多个赋值器与回收器并发执行，与此同时，应用屏障技术来保证回收器的正确性。其原理主要就是破坏上述两个条件之一。

### 屏障技术

当回收器满足下面两种情况之一时，即可保证不会出现对象丢失问题。

弱三色不变式：所有被黑色对象引用的白色对象都处于灰色保护状态（直接或间接从灰色对象可达）。 强三色不变式：不存在黑色对象到白色对象的指针。

强三色不变式很好理解，强制性的不允许黑色对象引用白色对象即可。而弱三色不变式中，黑色对象可以引用白色对象，但是这个白色对象仍然存在其他灰色对象对它的引用，或者可达它的链路上游存在灰色对象。

三色抽象除了可以用于描述对象的状态的，还可用来描述赋值器的状态，如果一个赋值器已经被回收器扫描完成，则认为它是黑色的赋值器，如果尚未扫描过或者还需要重新扫描，则认为它是灰色的赋值器。

在强三色不变式中，黑色赋值器只存在到黑色对象或灰色对象的指针，因为此时所有黑色对象到白色对象的引用都是被禁止的。 在弱三色不变式中，黑色赋值器允许存在到白色对象的指针，但这个白色对象是被保护的。

上述这些可以通过屏障技术来保证。

### 插入屏障

插入屏障拦截将白色指针插入黑色对象的操作，标记其对应对象为灰色状态，这样就不存在黑色对象引用白色对象的情况了，满足强三色不变式，如上图例中，在插入指针 f 时将 C 对象标记为灰色。Go1.5 版本使用的 Dijkstra 写屏障就是这个原理，伪代码如下：

```text
writePointer(slot, ptr):
    shade(ptr)
    *slot = ptr
```

在 Golang 中，对栈上指针的写入添加写屏障的成本很高，所以 Go 选择仅对堆上的指针插入增加写屏障，这样就会出现在扫描结束后，栈上仍存在引用白色对象的情况，这时的栈是灰色的，不满足三色不变式，所以需要对栈进行重新扫描使其变黑，完成剩余对象的标记，这个过程需要 STW。这期间会将所有 goroutine 挂起，当有大量应用程序时，时间可能会达到 10～100ms。

### 删除屏障

删除屏障也是拦截写操作的，但是是通过保护灰色对象到白色对象的路径不会断来实现的。如上图例中，在删除指针 e 时将对象 C 标记为灰色，这样 C 下游的所有白色对象，即使会被黑色对象引用，最终也还是会被扫描标记的，满足了弱三色不变式。这种方式的回收精度低，一个对象即使被删除了最后一个指向它的指针也依旧可以活过这一轮，在下一轮 GC 中被清理掉。Yuasa 屏障伪代码如下：

```text
writePointer(slot, ptr):
    if (isGery(slot) || isWhite(slot))
        shade(*slot)
    *slot = ptr
```

在这种实现方式中，回收器悲观的认为所有被删除的对象都可能会被黑色对象引用。

### 混合写屏障

插入屏障和删除屏障各有优缺点，Dijkstra 的插入写屏障在标记开始时无需 STW，可直接开始，并发进行，但结束时需要 STW 来重新扫描栈，标记栈上引用的白色对象的存活；Yuasa 的删除写屏障则需要在 GC 开始时 STW 扫描堆栈来记录初始快照，这个过程会保护开始时刻的所有存活对象，但结束时无需 STW。Go1.8 版本引入的混合写屏障结合了 Yuasa 的删除写屏障和 Dijkstra 的插入写屏障，结合了两者的优点，伪代码如下：

```text
writePointer(slot, ptr):
    shade(*slot)
    if current stack is grey:
        shade(ptr)
    *slot = ptr
```

这里使用了两个 shade 操作，shade (\*slot) 是删除写屏障的变形，例如，一个堆上的灰色对象 B，引用白色对象 C，在 GC 并发运行的过程中，如果栈已扫描置黑，而赋值器将指向 C 的唯一指针从 B 中删除，并让栈上其他对象引用它，这时，写屏障会在删除指向白色对象 C 的指针的时候就将 C 对象置灰，就可以保护下来了，且它下游的所有对象都处于被保护状态。 如果对象 B 在栈上，引用堆上的白色对象 C，将其引用关系删除，且新增一个黑色对象到对象 C 的引用，那么就需要通过 shade (ptr) 来保护了，在指针插入黑色对象时会触发对对象 C 的置灰操作。如果栈已经被扫描过了，那么栈上引用的对象都是灰色或受灰色保护的白色对象了，所以就没有必要再进行这步操作。

Golang 中的混合写屏障满足的是变形的弱三色不变式，同样允许黑色对象引用白色对象，白色对象处于灰色保护状态，但是只由堆上的灰色对象保护。由于结合了 Yuasa 的删除写屏障和 Dijkstra 的插入写屏障的优点，只需要在开始时并发扫描各个 goroutine 的栈，使其变黑并一直保持，这个过程不需要 STW，而标记结束后，因为栈在扫描后始终是黑色的，也无需再进行 re-scan 操作了，减少了 STW 的时间。
