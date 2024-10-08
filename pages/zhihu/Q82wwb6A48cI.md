---
title: 图解Go语言内存分配
date: 2024-10-04T15:30:37.783Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/59125443
---
Go 语言内置运行时（就是 runtime），抛弃了传统的内存分配方式，改为自主管理。这样可以自主地实现更好的内存使用模式，比如内存池、预分配等等。这样，不会每次内存分配都需要进行系统调用。

Golang 运行时的内存分配算法主要源自 Google 为 C 语言开发的`TCMalloc 算法`，全称`Thread-Caching Malloc`。核心思想就是把内存分为多级管理，从而降低锁的粒度。它将可用的堆内存采用二级分配的方式进行管理：每个线程都会自行维护一个独立的内存池，进行内存分配时优先从该内存池中分配，当内存池不足时才会向全局内存池申请，以避免不同线程对全局内存池的频繁竞争。

为了更好的阅读体验，手动贴上文章目录：

![](https://pic3.zhimg.com/v2-dff4bb802f357fd51add039f931a1060_b.jpg)

## 基础概念

Go 在程序启动的时候，会先向操作系统申请一块内存（注意这时还只是一段虚拟的地址空间，并不会真正地分配内存），切成小块后自己进行管理。

申请到的内存块被分配了三个区域，在 X64 上分别是 512MB，16GB，512GB 大小。

![](https://pic4.zhimg.com/v2-d5f5de4d6d22e67887ab4861ba5e721f_b.jpg)

`arena 区域`就是我们所谓的堆区，Go 动态分配的内存都是在这个区域，它把内存分割成`8KB`大小的页，一些页组合起来称为`mspan`。

`bitmap 区域`标识`arena`区域哪些地址保存了对象，并且用`4bit`标志位表示对象是否包含指针、`GC`标记信息。`bitmap`中一个`byte`大小的内存对应`arena`区域中 4 个指针大小（指针大小为 8B ）的内存，所以`bitmap`区域的大小是`512GB/(4*8B)=16GB`。

![](https://picx.zhimg.com/v2-49319a035182449d837b97772270c4c7_b.jpg)

![](https://pic3.zhimg.com/v2-88e126617a256999b7a99977be676784_b.jpg)

从上图其实还可以看到 bitmap 的高地址部分指向 arena 区域的低地址部分，也就是说 bitmap 的地址是由高地址向低地址增长的。

`spans 区域`存放`mspan`（也就是一些`arena`分割的页组合起来的内存管理基本单元，后文会再讲）的指针，每个指针对应一页，所以`spans`区域的大小就是`512GB/8KB*8B=512MB`。除以 8KB 是计算`arena`区域的页数，而最后乘以 8 是计算`spans`区域所有指针的大小。创建`mspan`的时候，按页填充对应的`spans`区域，在回收`object`时，根据地址很容易就能找到它所属的`mspan`。

## 内存管理单元

`mspan`：Go 中内存管理的基本单元，是由一片连续的`8KB`的页组成的大块内存。注意，这里的页和操作系统本身的页并不是一回事，它一般是操作系统页大小的几倍。一句话概括：`mspan`是一个包含起始地址、`mspan`规格、页的数量等内容的双端链表。

每个`mspan`按照它自身的属性`Size Class`的大小分割成若干个`object`，每个`object`可存储一个对象。并且会使用一个位图来标记其尚未使用的`object`。属性`Size Class`决定`object`大小，而`mspan`只会分配给和`object`尺寸大小接近的对象，当然，对象的大小要小于`object`大小。还有一个概念：`Span Class`，它和`Size Class`的含义差不多，

```c
Size_Class = Span_Class / 2
```

这是因为其实每个 `Size Class`有两个`mspan`，也就是有两个`Span Class`。其中一个分配给含有指针的对象，另一个分配给不含有指针的对象。这会给垃圾回收机制带来利好，之后的文章再谈。

如下图，`mspan`由一组连续的页组成，按照一定大小划分成`object`。

![](https://picx.zhimg.com/v2-38c31cf60d1514beb5be81d465ea36af_b.jpg)

Go1.9.2 里`mspan`的`Size Class`共有 67 种，每种`mspan`分割的 object 大小是 8\*2n 的倍数，这个是写死在代码里的：

```go
// path: /usr/local/go/src/runtime/sizeclasses.go

const _NumSizeClasses = 67

var class_to_size = [_NumSizeClasses]uint16{0, 8, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 352, 384, 416, 448, 480, 512, 576, 640, 704, 768, 896, 1024, 1152, 1280, 1408, 1536,1792, 2048, 2304, 2688, 3072, 3200, 3456, 4096, 4864, 5376, 6144, 6528, 6784, 6912, 8192, 9472, 9728, 10240, 10880, 12288, 13568, 14336, 16384, 18432, 19072, 20480, 21760, 24576, 27264, 28672, 32768}
```

根据`mspan`的`Size Class`可以得到它划分的`object`大小。 比如`Size Class`等于 3，`object`大小就是 32B。 32B 大小的 object 可以存储对象大小范围在 17B\~32B 的对象。而对于微小对象（小于 16B），分配器会将其进行合并，将几个对象分配到同一个`object`中。

数组里最大的数是 32768，也就是 32KB，超过此大小就是大对象了，它会被特别对待，这个稍后会再介绍。顺便提一句，类型`Size Class`为 0 表示大对象，它实际上直接由堆内存分配，而小对象都要通过`mspan`来分配。

对于 mspan 来说，它的`Size Class`会决定它所能分到的页数，这也是写死在代码里的：

```go
// path: /usr/local/go/src/runtime/sizeclasses.go

const _NumSizeClasses = 67

var class_to_allocnpages = [_NumSizeClasses]uint8{0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 3, 2, 3, 1, 3, 2, 3, 4, 5, 6, 1, 7, 6, 5, 4, 3, 5, 7, 2, 9, 7, 5, 8, 3, 10, 7, 4}
```

比如当我们要申请一个`object`大小为`32B`的`mspan`的时候，在 class\_to\_size 里对应的索引是 3，而索引 3 在`class_to_allocnpages`数组里对应的页数就是 1。

`mspan`结构体定义：

```text
//path: /usr/local/go/src/runtime/mheap.go

type mspan struct {
    // 链表前向指针，用于将 span 链接起来
    next *mspan 
    // 链表前向指针，用于将 span 链接起来
    prev *mspan 
    // 起始地址，也即所管理页的地址
    startAddr uintptr 
    // 管理的页数
    npages uintptr 
    // 块个数，表示有多少个块可供分配
    nelems uintptr 

    // 分配位图，每一位代表一个块是否已分配
    allocBits *gcBits 

    // 已分配块的个数
    allocCount uint16 
    //class 表中的 class ID，和 Size Classs 相关
    spanclass spanClass  

    //class 表中的对象大小，也即块大小
    elemsize uintptr 
}
```

我们将`mspan`放到更大的视角来看：

![](https://pic4.zhimg.com/v2-57c743a87c884c51a949d614208905a9_b.jpg)

上图可以看到有两个`S`指向了同一个`mspan`，因为这两个`S`指向的`P`是同属一个`mspan`的。所以，通过`arena`上的地址可以快速找到指向它的`S`，通过`S`就能找到`mspan`，回忆一下前面我们说的`mspan`区域的每个指针对应一页。

假设最左边第一个`mspan`的`Size Class`等于 10，根据前面的`class_to_size`数组，得出这个`msapn`分割的`object`大小是 144B，算出可分配的对象个数是`8KB/144B=56.89`个，取整 56 个，所以会有一些内存浪费掉了，Go 的源码里有所有`Size Class`的`mspan`浪费的内存的大小；再根据`class_to_allocnpages`数组，得到这个`mspan`只由 1 个`page`组成；假设这个`mspan`是分配给无指针对象的，那么`spanClass`等于 20。

`startAddr`直接指向`arena`区域的某个位置，表示这个`mspan`的起始地址，`allocBits`指向一个位图，每位代表一个块是否被分配了对象；`allocCount`则表示总共已分配的对象个数。

这样，左起第一个`mspan`的各个字段参数就如下图所示：

![](https://picx.zhimg.com/v2-b06849efaa2471671beb9ea2e1d3ec09_b.jpg)

## 内存管理组件

内存分配由内存分配器完成。分配器由 3 种组件构成：`mcache`, `mcentral`, `mheap`。

## mcache

`mcache`：每个工作线程都会绑定一个 mcache，本地缓存可用的`mspan`资源，这样就可以直接给 Goroutine 分配，因为不存在多个 Goroutine 竞争的情况，所以不会消耗锁资源。

`mcache`的结构体定义：

```go
//path: /usr/local/go/src/runtime/mcache.go

type mcache struct {
    alloc [numSpanClasses]*mspan
}

numSpanClasses = _NumSizeClasses << 1
```

`mcache`用`Span Classes`作为索引管理多个用于分配的`mspan`，它包含所有规格的`mspan`。它是`_NumSizeClasses`的 2 倍，也就是`67*2=134`，为什么有一个两倍的关系，前面我们提到过：为了加速之后内存回收的速度，数组里一半的`mspan`中分配的对象不包含指针，另一半则包含指针。

对于无指针对象的`mspan`在进行垃圾回收的时候无需进一步扫描它是否引用了其他活跃的对象。 后面的垃圾回收文章会再讲到，这次先到这里。

![](https://pic4.zhimg.com/v2-e6e061c4f9e1212b2bf32728dcb2aa17_b.jpg)

`mcache`在初始化的时候是没有任何`mspan`资源的，在使用过程中会动态地从`mcentral`申请，之后会缓存下来。当对象小于等于 32KB 大小时，使用`mcache`的相应规格的`mspan`进行分配。

## mcentral

`mcentral`：为所有`mcache`提供切分好的`mspan`资源。每个`central`保存一种特定大小的全局`mspan`列表，包括已分配出去的和未分配出去的。 每个`mcentral`对应一种`mspan`，而`mspan`的种类导致它分割的`object`大小不同。当工作线程的`mcache`中没有合适（也就是特定大小的）的`mspan`时就会从`mcentral`获取。

`mcentral`被所有的工作线程共同享有，存在多个 Goroutine 竞争的情况，因此会消耗锁资源。结构体定义：

```go
//path: /usr/local/go/src/runtime/mcentral.go

type mcentral struct {
    // 互斥锁
    lock mutex 
    // 规格
    sizeclass int32 
    // 尚有空闲 object 的 mspan 链表
    nonempty mSpanList 
    // 没有空闲 object 的 mspan 链表，或者是已被 mcache 取走的 msapn 链表
    empty mSpanList 
    // 已累计分配的对象个数
    nmalloc uint64 
}
```

![](https://picx.zhimg.com/v2-f35013240082c8a6c4423a86d3a69cc5_b.jpg)

`empty`表示这条链表里的`mspan`都被分配了`object`，或者是已经被`cache`取走了的`mspan`，这个`mspan`就被那个工作线程独占了。而`nonempty`则表示有空闲对象的`mspan`列表。每个`central`结构体都在`mheap`中维护。

简单说下`mcache`从`mcentral`获取和归还`mspan`的流程：

* 获取 加锁；从`nonempty`链表找到一个可用的`mspan`；并将其从`nonempty`链表删除；将取出的`mspan`加入到`empty`链表；将`mspan`返回给工作线程；解锁。
* 归还 加锁；将`mspan`从`empty`链表删除；将`mspan`加入到`nonempty`链表；解锁。

## mheap

`mheap`：代表 Go 程序持有的所有堆空间，Go 程序使用一个`mheap`的全局对象`_mheap`来管理堆内存。

当`mcentral`没有空闲的`mspan`时，会向`mheap`申请。而`mheap`没有资源时，会向操作系统申请新内存。`mheap`主要用于大对象的内存分配，以及管理未切割的`mspan`，用于给`mcentral`切割成小对象。

同时我们也看到，`mheap`中含有所有规格的`mcentral`，所以，当一个`mcache`从`mcentral`申请`mspan`时，只需要在独立的`mcentral`中使用锁，并不会影响申请其他规格的`mspan`。

`mheap`结构体定义：

```go
//path: /usr/local/go/src/runtime/mheap.go

type mheap struct {
    lock mutex
    //spans: 指向 mspans 区域，用于映射 mspan 和 page 的关系
    spans []*mspan 
    // 指向 bitmap 首地址，bitmap 是从高地址向低地址增长的
    bitmap uintptr 

    // 指示 arena 区首地址
    arena_start uintptr 
    // 指示 arena 区已使用地址位置
    arena_used  uintptr 
    // 指示 arena 区末地址
    arena_end   uintptr 

    central [67*2]struct {
        mcentral mcentral
        pad [sys.CacheLineSize - unsafe.Sizeof(mcentral{})%sys.CacheLineSize]byte
    }
}
```

![](https://pic2.zhimg.com/v2-0f51158704083f36561a15edc89d6f27_b.jpg)

上图我们看到，bitmap 和 arena\_start 指向了同一个地址，这是因为 bitmap 的地址是从高到低增长的，所以他们指向的内存位置相同。

## 分配流程

上一篇文章[《Golang 之变量去哪儿》](https://zhuanlan.zhihu.com/p/59125443/Golang%E4%B9%8B%E5%8F%98%E9%87%8F%E5%8E%BB%E5%93%AA%E5%84%BF%20-%20Stefno%20-%20%E5%8D%9A%E5%AE%A2%E5%9B%AD)中我们提到了，变量是在栈上分配还是在堆上分配，是由逃逸分析的结果决定的。通常情况下，编译器是倾向于将变量分配到栈上的，因为它的开销小，最极端的就是 "zero garbage"，所有的变量都会在栈上分配，这样就不会存在内存碎片，垃圾回收之类的东西。

Go 的内存分配器在分配对象时，根据对象的大小，分成三类：小对象（小于等于 16B）、一般对象（大于 16B，小于等于 32KB）、大对象（大于 32KB）。

大体上的分配流程：

* 32KB 的对象，直接从 mheap 上分配；
* <=16B 的对象使用 mcache 的 tiny 分配器分配；
* (16B,32KB] 的对象，首先计算对象的规格大小，然后使用 mcache 中相应规格大小的 mspan 分配；
* 如果 mcache 没有相应规格大小的 mspan，则向 mcentral 申请
* 如果 mcentral 没有相应规格大小的 mspan，则向 mheap 申请
* 如果 mheap 中也没有合适大小的 mspan，则向操作系统申请

## 总结

Go 语言的内存分配非常复杂，它的一个原则就是能复用的一定要复用。源码很难追，后面可能会再来一篇关于内存分配的源码阅读相关的文章。简单总结一下本文吧。

文章从一个比较粗的角度来看 Go 的内存分配，并没有深入细节。一般而言，了解它的原理，到这个程度也可以了。

* Go 在程序启动时，会向操作系统申请一大块内存，之后自行管理。
* Go 内存管理的基本单元是 mspan，它由若干个页组成，每种 mspan 可以分配特定大小的 object。
* mcache, mcentral, mheap 是 Go 内存管理的三大组件，层层递进。mcache 管理线程在本地缓存的 mspan；mcentral 管理全局的 mspan 供所有线程使用；mheap 管理 Go 的所有动态分配内存。
* 极小对象会分配在一个 object 中，以节省资源，使用 tiny 分配器分配内存；一般小对象通过 mspan 分配内存；大对象则直接由 mheap 分配内存。

## 参考资料

【简单易懂，非常清晰】[https://yq.aliyun.com/articles/652551](https://link.zhihu.com/?target=https%3A//yq.aliyun.com/articles/652551)

【内存分配器的初始化过程，分配流程图很详细】[https://www.jianshu.com/p/47691d870756](https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/47691d870756)

【全局的图】[https://swanspouse.github.io/2018/08/22/golang-memory-model/](https://link.zhihu.com/?target=https%3A//swanspouse.github.io/2018/08/22/golang-memory-model/)

【雨痕 Go1.5 源码阅读】[https://github.com/qyuhen/book](https://link.zhihu.com/?target=https%3A//github.com/qyuhen/book)

【图不错】[https://www.jianshu.com/p/47691d870756](https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/47691d870756)

【整体感】[https://juejin.im/post/59f2e19f5188253d6816d504](https://link.zhihu.com/?target=https%3A//juejin.im/post/59f2e19f5188253d6816d504)

【源码解读】[http://legendtkl.com/2017/04/02/golang-alloc/](https://link.zhihu.com/?target=http%3A//legendtkl.com/2017/04/02/golang-alloc/)

【重点推荐 深入到晶体管了 图很好】[https://www.linuxzen.com/go-memory-allocator-visual-guide.html](https://link.zhihu.com/?target=https%3A//www.linuxzen.com/go-memory-allocator-visual-guide.html)

【总体描述对象分配流程】[http://gocode.cc/project/4/article/103](https://link.zhihu.com/?target=http%3A//gocode.cc/project/4/article/103)

【实际 Linux 命令】[https://mikespook.com/2014/12/%E7%90%86%E8%A7%A3-go-%E8%AF%AD%E8%A8%80%E7%9A%84%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8/](https://link.zhihu.com/?target=https%3A//mikespook.com/2014/12/%25E7%2590%2586%25E8%25A7%25A3-go-%25E8%25AF%25AD%25E8%25A8%2580%25E7%259A%2584%25E5%2586%2585%25E5%25AD%2598%25E4%25BD%25BF%25E7%2594%25A8/)

【整体流程图 对象分配函数调用链路】[http://blog.newbmiao.com/2018/08/20/go-source-analysis-of-memory-alloc.html](https://link.zhihu.com/?target=http%3A//blog.newbmiao.com/2018/08/20/go-source-analysis-of-memory-alloc.html)

【源码讲解 非常细致】[https://www.cnblogs.com/zkweb/p/7880099.html](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/zkweb/p/7880099.html)

【源码阅读】<https://zhuanlan.zhihu.com/p/34930748>
