---
title: 文件系统实现
date: 2024-10-04T15:30:53.346Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/50873899
---
文件系统的存在允许程序存储，检索和操作数据。为了实现这一目的，文件系统需要保持一个内在的数据结构使得数据有组织，并且便于访问。

## **1、磁盘**

对于理解文件系统 / 数据库系统特别重要的是，磁盘被划分为磁盘块（或者称为块，或者像操作系统一样称为页），每块的大小通常是：4\~64KB。

存取（读或写）一个磁盘块一般需要三个步骤，每一步都存在相关的延迟：

* 磁盘控制器将磁头组合定位在磁盘块所在磁道的柱面上所需要的时间即**寻道时间**（seek time）
* 磁盘控制器等待访问块的第一个扇区旋转到磁头下，此时间称为**旋转延迟**（totational latency）
* 当磁盘控制器读取或者写数据时，数据所在的扇区和扇区间的空隙经过磁道，此时间称为**传输时间**（transfer time）

![](https://picx.zhimg.com/v2-f99e7fa44fb9876b5e6b7a7878d9e38d_b.jpg)

## **2、文件**

就像操作系统提取处理器的概念来建立**进程**的抽象，以及提取物理存储器的概念建立**进程（虚拟）地址空间**的抽象，我们引入了一个新的抽象 - **文件**来解决这个问题。进程（线程），地址空间和文件，这些概念都是操作系统中最重要的概念。

文件是进程创建的信息逻辑单元。一个磁盘一般包含几千甚至几百万个文件，每个文件是独立于其他文件的，唯一不同的是文件是对磁盘的建模，而非对 RAM 的建模。事实上，如果把文件看成一个地址空间，那么读者就能理解文件的本质了。

**2.1、文件结构**

文件可以有多种构造方式，下图列出了常见的三种：

![](https://pica.zhimg.com/v2-d3e4830b2af8dac233d461e9dc7d9c90_b.jpg)

* **图 4.2-a 无结构的字节序列**

把文件看成无结构的字节顺序给了操作系统最大的灵活性。用户程序可以向文件中加入任何内容，并且以任何方便的形式命名。操作系统不提供任何帮助，但也不会构成障碍。所有 UNIX 版本（包括 Linux 和 OS X）以及 Windows 都采用这种文件模型。

* **图 4.2-b 表示在该文件结构上的一种改进**

在这个模型中，**文件是具有固定长度的记录的序列**，每个记录都有其内部结构。把文件当作记录的的核心思想是：读操作返回一个记录，而写操作重新或者追加一个记录。（这是曾经大型计算机采用过的文件模式，现在已经很少有通用系统采用这种文件结构了）

* **图 4.2-c：树结构**

第三种文件结构如图 4-2c 所示。文件在这种结构中由一棵记录树组成，每个记录不必有相同的长度，记录的固定位置上有一个**键**字段，这棵树按照**“键”**进行升序排列，从而可以对特定 “键” 进行快速查找（例如：Mysql B + 树索引所采用的文件结构？）

**2.2、 文件类型**

很多操作系统都支持多种文件类型。如 UNIX 和 Windows 都有普通文件和目录。UNIX 中还有**字符特殊文件 (Character special file)**和**块特殊文件 (block special file)**，**普通文件 (regular file)**是包含用户信息的文件。

普通文件一般分为 ASCII 文件和二进制文件。

ASCII 文件由多行正文组成，以回车 / 换行等符号结束，ASCII 文件的最大优势是可以显示和打印，还可以用任何文本编辑器进行编辑。

二进制文件有一定的内部结构，使用该文件的程序才了解这种结构。

**2.3、文件访问**

早期操作系统只有一种文件访问方式： **顺序访问 (sequential access)。** 当存储介质是磁带的时候，顺序访问是很方便的。

当用磁盘来存储文件的时候，可以不按顺序地读取文件中的字节或记录，或者按照关键字而不是位置来访问记录。这种能够以任何次序读取其中字节或者记录的文件称为**随机访问文件 (random access file).**

**2.4、文件属性**

![](https://pic1.zhimg.com/v2-82e8f89c4fd8a9e781cfb1040de65004_b.jpg)

## **3、文件的实现**

**文件实现的关键问题是记录各个文件分别用到哪些磁盘块**

**3.1、连续分配**

最简单的分配方案就是把每个文件作为一连串数据块存储在磁盘上。所以，在块大小为 1KB 的磁盘上，50KB 的文件要分配 50 个连续的块。对于块大小为 2KB 的磁盘，将分配 25 个连续的块。

每个文件都从一个新的磁盘块开始，这样如果文件 A 实际只有 3.25 块大小，那么最后一块的结尾会浪费一下空降。

![](https://picx.zhimg.com/v2-e7b3af452eaf331b0c37a876d64ea4e5_b.jpg)

连续磁盘空间分配方案有两大优势：

* 实现简单，记录每个文件用到的磁盘块可以简化为两个数字：第一个磁盘块的地址和所有磁盘块的数量
* 读操作性能较好，因为在单个操作中就可以从磁盘上读出整个文件。只需要找到第一个磁盘块，之后不再需要 **寻道和旋转延迟。** 所以，数据可以以磁盘全带宽的速率输入。

但是，连续分配方案也有明显的不足之处：随着时间的退役，磁盘会变得零碎 (参考上图）。

该方案在 CD-ROM/DVD 中应用较为广泛，因为在这些文件系统的后续使用中，这些文件的内容不再发生改变。

**3.2、链表分配**

存储文件的第二种方法是为每个文件构建磁盘块链表，每个块的第一个字作为指向下一块的指针，块的其他部分存放数据。

![](https://pic1.zhimg.com/v2-f42c57ba3aa691ba69777ec492945f54_b.jpg)

与连续分配方案不同，这一方法会充分利用每个磁盘块，不会因为磁盘碎片而浪费空间。同样，在目录项中，只需要存在第一块的磁盘地址，文件的其他块就可以从这个首块地址中查到。

另一方面，在链表的分配方案中，尽管顺序读取文件非常方便，但是随机访问却相当缓慢。要获取块 N，操作系统每次都要从头开始并且要读取前面的 N-1 块。

而且，由于块首的指针占用了一些字节，使得每个磁盘块存储的字节数不是 2 的整数次幂。很多程序都是以 2 的整数次幂来读写磁盘块的，由于块首的指针占用了部分空间，所以要读取一个完整的块大小，就要从两个磁盘块中获得和拼接信息，这就因复制引发了额外的开销。

**3.3、采用内存中的表进行链表分配**

如果取出每个磁盘块中的指针字，把它们放在一个内存的表中，就可以解决上述链表的两个不足。

![](https://pic2.zhimg.com/v2-2c1d876df1a80919e7872572ea8fda35_b.jpg)

这样的话，内存中存在一个 **文件分配表（File Allocation Table， FAT） 。** 按这类方式组织，整个块都可以存储数据，虽然仍要顺着链表在文件中查找给定的偏移量，但是整个链都存放在内存中，不需要任何磁盘引用。

缺点在于：必须要把整个表都存放在内存中，对于 1TB 的硬盘和 1KB 的块来说，这个表需要有十亿项。每个项至少三字节的话，至少需要 3GB 的内存占用，显然 FAT 对于大磁盘不太合适。

**3.4、i 节点**

最后一种记录文件与磁盘块关系的方式是：给每个文件赋予一个叫 **i 节点（index node）** 的数据结构，其中列出了文件属性和文件块的磁盘地址。下图是一个简单的例子，给定**i 节点**，就有可能找到文件的所有块。

![](https://picx.zhimg.com/v2-059a6bfd28c7b91b2127c95074e8abc3_b.jpg)

相对于在内存中采用表的方式而言，这种机制具有很大优势，即只有在文件打开时，其 i 节点才在内存中。如果每个 i 节点占 n 个字节，最多 k 个文件同时打开，那么为了打开文件而保留 i 节点的数组占用的内存不过 kn 个字节。

这个数组通常比上节叙述的文件分配表（FAT）所占用的空间要小得多。i 节点的一个问题是，如果一个 i 节点只能存储一定数量的磁盘块地址，那么当一个文件所包含的磁盘块的数目超出了 i 节点的限制怎么办？

一个解决方案是：最后一个 “磁盘地址” 不指向数据块，而是指向下一个包含磁盘块地址的地址。更高级的解决方案是：可以有两个或多个包含磁盘块地址的块，或者指向其他存放地址的磁盘块。

## **4、Log-structured File System**

不断进步的科技给现有文件系统带来了新的麻烦，CPU 的运行速度越来越快，磁盘的容量越来越大，同时价格越来越便宜，内存容量以指数级增长，而没有得到发展的是磁盘的寻道时间（磁盘的速度并没有增快多少）。这些问题综合起来，便成为文件系统的一个瓶颈。

更为糟糕的情况是，在大多数文件系统中，写操作往往都是零碎的。一个 50us 的磁盘磁盘写操作通常需要 10ms 的寻道时间和 4ms 的旋转延迟时间，可见零碎的磁盘写操作是及其没有效率的。

为了看看这些零碎的写操作从何而来，考虑在 UNIX 文件系统上创建一个新文件。为了写这个文件，必须先写该文件目录的 i 节点、目录块、文件的 i 节点以及文件本身。而这些写操作都有可能被延迟，如果在写操作之前发生宕机，就可能在文件系统中造成严重的不一致性。正因为如此，i 节点的写操作一般都是立即（同步）完成的。

为此，Berkelery 设计了一种全新的文件系统，试图解决这个问题，即 **日志文件系统 (Log-structured File System, LFS)。** 该系统即使面对由一大堆零碎的写操作组成的任务，同样能够充分利用磁盘的带宽。其基本思想是将整个磁盘结构化为一个日志，每隔一段时间，或是有特殊需要时，被缓冲在内存中的所有未决的写操作都被放到一个单独的段中，作为日志末尾的一个邻接段接入磁盘。这个单独的段中可能包含 i 节点、目录块、数据块或者都有。每一段的开始都是该段的摘要，说明该段中包含哪些内容。如果所有的段平均在 1MB 左右，那么就几乎可以利用磁盘的全部带宽。

在 LFS 的设计中，同样存在着 i 节点，且具有和 UNIX 中一样的结构，但是 i 节点分散在整个日志中，而不是放在磁盘的某一个固定位置。尽管如此，当一个 i 节点被定位后，定位一个块就用通常的方式来完成。当然，由于这种设计，要在磁盘中找到一个 i 节点就变得比较困难了，因为 i 节点的地址不像 UNIX 中那样可以通过计算得到。

为了得到 i 节点，必须要维护一个由 i 节点索引编号组成的 i 节点图。在这个图中的编号 i 指向磁盘中的第 i 个 i 节点。这个图保存在磁盘上，但是也保存在高速缓存中。

总而言之，所有的写操作保存在内存中，然后周期性把所有已缓冲的写，然后周期性的把已缓存的写作为一个单独的段，在日志的末尾处写入磁盘（跟 Log-structured Merge Tree）。要打开一个文件，需要先从 i 节点图中找到该文件的 i 节点。一旦 i 节点定位之后就可以找到相应的块地址，所有的块都存放在段中，在日志的某个位置上。

如果磁盘空间无限大，那么前面的讨论就足够了。但是，磁盘的实际空间是有限的，这样最终日志将会占用整个磁盘，到那个时候将不能往日志中写入任何新的段。幸运的是，许多已有的段包含了很多不再需要的段。例如，如果一个文件被覆盖了，那么它的 i 节点就会指向新的块，但是旧的磁盘块仍然在先前写入的段中占据着空间。

为了这个问题，LFS 有一个清理线程，该清理线程周期性周期地扫描日志进行磁盘压缩。该线程首先读取日志中第一个段的摘要，检查有哪些 i 节点和文件。然后该线程查看当前 i 节点图，判断该 i 节点是否有效以及该文件块是否在使用中。如果没有使用，则该信息被丢弃。如果仍然使用，那么 i 节点和块被放入内存等待写入下一个段中。接着，原来的段被标记为空闲，以便日志可以用它写入新的数据。用这种方法，清理线程遍历日志，从后面移走旧的段，然后将有效的数据放入内存等待写入下一段中。由此，整个磁盘形成一个巨大的环形缓冲区，写线程将新的段写在前面，而清理线程则将旧的段从后面移走。

参考链接：

[https://book.douban.com/subject/27096665/​book.douban.com/subject/27096665/](https://link.zhihu.com/?target=https%3A//book.douban.com/subject/27096665/)
