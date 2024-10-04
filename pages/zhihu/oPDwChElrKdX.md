---
title: 多核时代与并行算法
date: 2024-10-04T15:30:37.005Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/89863627
---
随着计算机技术的发展，毫无疑问现代计算机的处理速度和计算能力也越来越强。然而细心的同学们可能早已注意到，从 2005 年起，单核的 CPU 性能就没有显著的提升了（见下图）。究其原因，是人们发现单纯的提高单核 CPU 的性能无论从潜力上还是功耗上都是不合算的。随着 [Intel 的 NetBurst 架构退出江湖](https://www.zhihu.com/question/27106281/answer/137624368)，处理器彻底进入了多核时代，从最初的双核一路飙升到现在的动辄上百核的 CPU，性能的提升不以里计。同时一系列针对特殊计算的 accelerator 的出现，并行硬件的发展现在正是百花齐放。多年以前要用许多台电脑才能并行处理的 “大数据” 问题，现在大多都可以用一台多核电脑解决了。

![](https://pic4.zhimg.com/v2-181a0c025fbb9a35fd5286a9b667c497_b.jpg)

图 1，来源：“The free lunch is over” by Sutter 2010

然而一方面是硬件的日新月异，另一方面对于如何高效而正确的使用这些硬件进行并行算法的设计和实现却一直是长久存在的问题。对于串行算法，所有科班出身的计算机人都应该再熟悉不过了，毕竟算法和数据结构是所有低年级本科生的必修课。然而当我们试图并行这些再熟悉不过的算法的时候，事情却往往并没有这么简单。就拿一个非常简单的排序问题举例，在串行的背景下我们学过很多种特点不同的算法，大多数伪代码只要几行到十几行。然而直接并行这些算法却很难得到令人满意的加速比。很多时候，“学习并行编程” 只是学习使用了 OpenMP/MPI/CUDA 等并行工具，而仅仅这样并不能保证写出真正 scalable 的并行算法。从另一个角度来讲，并行编程的臭名昭著之处在于，运行结果常常是难以预测的也难以控制的。比如这个著名的笑话：

> 如果你有一个问题，就用并行解决它。这你样就有个两问题了。

这给 debug 也带来了额外的难度（如果你还想看关于并行编程的笑话，[这里](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/aww/comments/2oagj8/multithreaded_programming_theory_and_practice/)和[这里](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/wgD4n35pVZhQdXuIewuB1w)还有两个，所有笑话均为转载）。但是随着我们对并行算法研究的加深和理论的完善，我们相信，写并行算法应该和写串行算法一样容易（回顾计算机的历史，你会发现传统串行算法编程也是经历了几十年理论和系统的发展才像今天一样简单的）。

就拿快排举例。快排本身使用的分治方法是非常适合于并行的。当我们使用一个 pivot 将数组分为左右两部分之后，两边就可以同时进行排序。然而这么简单就能得到一个高效的快排算法吗？考虑将数组里的数分成左右两边的过程（partition），如果我们依然使用传统串行算法的经典的 partition 算法，也就是基于两个或者三个指针对应的元素的比较和交换，这一过程是非常串行的（快排的高效也是有赖于这个串行扫描中的访存 pattern）。如果仅仅第一步的 partition 就使用了 O (n) 的操作，即便后续的分支过程的代价都忽略不计，核数再多，运行时间也不可能快于第一步的 partition 的开销。因此如果只是了解掌握了使用并行工具，但是局限在 “并行” 现有的串行快排中，是很难写出高效的并行排序算法的。至于如何并行快排其实并不困难，我在 17 年在清华暑期课程中讲过，有兴趣的同学可以参考课件（[链接](https://link.zhihu.com/?target=http%3A//15418.courses.cs.cmu.edu/tsinghua2017/lecture/perfanalysis)）。或者我们的后续文章里：

[](https://zhuanlan.zhihu.com/p/93279731)

也有介绍。同时这个算法的实现也非常简单，在整个算法中都不存在两个核同时对一个元素进行操作。换句话说，算法虽然并行（parallel），利用了多核进行计算，但是不会需要并发（concurrency），这使得算法的效果变得 predictable，也不难 debug。

事实上许多并行算法和快排一样，本质上并不复杂，但需要的只是摒弃我们对于传统算法的理解而做到使用并行的思维去思考问题，也就是我们称之为 Parallel Thinking 。当然其实在并行的大背景下，快排也并不是最有效率的排序算法和实现，还有同样很简单但是性能更好的算法 \[1] 。这些算法并不复杂，只是需要理解的方式和普通的串行算法有很大的不同。反过来看，Parallel Thinking 的新角度也会给串行算法的设计带来新的启发。“写并行算法和串行算法一样容易” 这件事看起来有些天马行空，但却是在实践中被证明是可行的。**比较前卫的学校，比如 CMU，早在很多年前就已经在算法入门课（本科二年级）直接教授本科生[并行算法](https://link.zhihu.com/?target=https%3A//www.cs.cmu.edu/~15210/)而不再局限于串行算法了 —— 因为串行算法就是并行算法在一个核上跑嘛！**相信这也会成为未来世界上所有学校的大趋势。这也同时意味着，我们需要以新的视角去理解，思考和设计算法。

就如同 5-60 年代计算机的兴起带来了 7-80 年代（串行）算法研究的黄金时期，随着近十几年来并行硬件的普及，并行算法的研究也开始了新的篇章。虽然早先的甚至上世纪的研究已经得到了很多的结果，现在还有更多的问题的面纱有待我们去揭开。相信就像 7-80 年代设计的算法一样，这些新的并行算法也会出现在下一代计算机学生的教科书中。下面举几个我们近期研究的例子，希望大家能对于并行算法和 Parallel Thinking 有一个大致的了解。

## 平衡二叉搜索树（Balanced BSTs）

平衡二叉搜索树是一种非常基础的数据结构，用于动态维护任何有序的集合。常见的一些实现包括 AVL 树，红黑树，weight-balanced tree（BB \[α] trees，加权平衡树），treap 等等。很多更加高级的数据结构，比如 interval tree，segment tree，range tree，以及很多其他几何问题、甚至许多类型的数据库，都可以通过增广（augment）BST 的方式进行实现 \[2]。

我们都知道经典的 BST 是通过插入 / 删除（insert/delete）进行维护的。然而在并行的背景下，这种抽象方式是**低效**的。举例而言，如果同时向树中插入多个节点，如何保证正确性呢？我们当然可以通过使用加锁或者一些原子操作（ComareAndSwap 等），但是很多时候这会造成严重的阻塞，以及许多核处于等待状态。倘若有 100 + 核同时进行这些操作，考虑 memory consistency 和为了维持平衡要进行的旋转，会出现许多冲突，甚至还有可能出现**核越多，速度越慢**的现象。因此基于插入 / 删除的 BST 抽象在并行的前提下是不可取的。

为此我们提出了一种基于 join 操作的树结构 \[3]。join 这个函数是说，给定两棵树 T1 和 T2，以及一个结点 k，返回一个合法的平衡树 T = \[T1, k, T2]，它等价于用 k 连接 T1 和 T2，但是要求输出树满足平衡条件。显然对于 BST 来说，这个算法只有在 k 大于 T1 里所有数，并小于 T2 里所有数时才有意义。当这个 join 算法可以被正确地实现时，我们就可以把许多树上的算法并行。总体的思路依然是利用分治法。对于一棵树，我们并行地递归地处理左子树和右子树，并把它们用树根 join 起来。许多时候，操作后的左右子树不再平衡，但是正如上面所说，join 会处理平衡问题。通过抽象出 join 这个元操作，并行别的算法的思路就变得简洁。

![](https://pic2.zhimg.com/v2-9883eb170d738017dca9e8e55d379a4d_b.jpg)

图 2：join 两棵树 TL、TR 和 k。

很有趣的一点是，抽象出 join 之后，别的平衡树算法们就不再需要进行任何旋转操作来进行重平衡 —— 这些事情都通过调用 join 实现了。换言之，AVL 树，红黑树，等等，这些不同平衡树的操作（插入，删除，合并，取交，等等）都可以用同一个算法，只要它们各自有一个好用的 join 算法就行了。拿一个插入操作举例：

```text
insert(T, k) {
  if (T==null) return new_node(k);
  if (T’s root == k) return;
  if (T’s root < k) return join(insert(T.left, k), T.root, T.right);
  if (T’s root > k) return join(T.left, T.root, insert(T.right, k));
}
```

这个插入算法不需要知道 T 到底是一棵 AVL 还是红黑树。只要 join 正确，它就正确。从效率上来讲，它对于常见的平衡树来讲时间复杂度依然是 O (log n) 的，当然，这是一个简单的串行算法。许多并行算法也是同理。比如如果想并行地插一个数组的元素们进一棵树里要怎么做呢？写起来其实大概只需要十行的伪代码：

```text
MultiInsert(T, A, n) {
   A' = parallel_sort(A, n); 
   return MultiInsertSorted(T, A', n);
}
MultiInsertSorted(T, A, n) {
  if (|T|==0 || n==0) return;
  x = binary_searching(A, T.root);
  b = (A[x]==T.root); //b is a bit (0 or 1) indicating if A[x] is already in T.
  in parallel:
    L = MultiInsertSorted(T.left, A, x);
    R = MultiInsertSorted(T.right, A+x+b, n-x-b);
  return join(L, T.root, R);
}
```

上面的 parallel\_sort 可以用任何已有的并行排序算法，比如上述所说的快排（实际中我们用得更多的是 sample sort）。如上所述，这个算法是把插入转化成向左右子树插入的两个可并行的子问题，并用 join 最后将它们合并的。这个并行的 MultiInsert 算法即便要进行排序和二分搜索等额外操作，依然比现有的并发树结构（concurrent trees）同时使用 p 个核调用插入算法高效几到十几倍 \[4]。它的高效性很大程度上是因为它保证了算法过程中没有冲突（conflict）—— 分治法保证了任何时候任何结点最多只有一个核在操作。

如上所述，这个算法也是是对于多种平衡树都成立的。曾经对于每种不同平衡树，哪怕只是插入删除操作我们都要记忆不同的算法，但当我们用并行的眼光看问题的时候，我们竟然发现算法设计变得更加简单了。

基于这样一个高效而简单的并行树结构 P-tree (parallel tree)，我们可以对一些有趣的理论问题提出新的算法，降低已有算法的复杂度（尤其是并行复杂度），或者把已有的算法变得更加简洁。比如一些计算几何问题，有序集合的操作问题，甚至排序问题，也可以解决许多现实中的应用问题，比如数据库，索引搜索，事物内存（transactional memory），等等。

![](https://picx.zhimg.com/v2-94faeeda2d6665c8360e16f4f6e7d0b7_b.jpg)

图 3：基于 P-tree 的实现和已有算法的比较，红色为 P-tree。左图为 Range tree 的实现，即使串行效率也比现有的计算几何库快。并行后的 P-tree 算法有超过 100 倍的性能提升。中图是和现有的并发树的比较。右图是基于 P-tree 实现的数据库，比起现有的 HyPer 和 MemSQL 效率有很大提升。

## NVRAMs 和 Write-Efficient Algorithms

长久困扰计算机界的一大问题就是**处理器的性能增长是远远大于内存大小和带宽的增长**的。还举 2005 年到今天的例子，处理器从单核增长到了上百核，而且还有各种新单核技术的加成。然而内存从 DDR2 到 DDR4 的带宽和容量增长都非常有限。固然新的高性能计算机通常可以通过装很多很多的内存条在短时间内在一定程度上解决问题，但是长此以往肯定不是办法。尤其是 DRAM 技术遇到瓶颈几乎无法大幅度提升性能、且能耗散热已经是很大的问题的前提下。这也对并行算法本身提出了挑战：即便有了高效的共享内存（shared-memory）并行算法，如果内存不够大，解决问题的规模就非常有限；同时随着核数的增加，每个核分到的内存反而在减小。

然而我们人类站在地球之巅不是没有道理的，遇到问题就一定会找到解决方案。在今年 4 月推出的 Intel® Optane™ DC Persistent Memory 就是基于完全不同技术的新内存解决方式，为了以示区分我们通常称之为 NVRAM。新技术非常的震撼，初代产品就能达到最大 512GB per DIMM，只要 12 块就可以在一台机器上达到 6TB 的内存，远远超过现有的 DRAM 技术。同时新硬件在技术上有很强的的扩展性，在可以遇见的未来容量增长都有非常大的潜力。可以说 NVRAM 的出现对于多核并行和广义的计算和数据存储的帮助是非常决定性的。

![](https://pic3.zhimg.com/v2-838bf698ad80366303827b797dc575f0_b.jpg)

图 4：Intel® Optane™ DC Persistent Memory

既然是新的技术，那就必然有一些新的 feature。一个 feature 是新硬件的 persistency，也就是说掉电后内容不会丢失，因此用新硬件就完全不需要之前的复杂的数据容错机制（fault tolerance）。当然这不是本文的重点，这里就不展开了。另一个 feature 是 NVRAM 的读写的非对称性。在新硬件上，读带宽是不错的，但是写带宽则相差数倍。同时这个差距可以认为在短期不会有所改善，因为这是由于新硬件的技术原因造成的。

![](https://picx.zhimg.com/v2-57fcb952dcc5bd157246fe453b21da53_b.jpg)

图 4。左图：新 NVRAM 的读写带宽比较。右图：物质的晶体态和无定形态，可以感受到两者电阻差别会很大。

简而言之，NVRAM 通过**物质的状态**来存储信息。特定物质可以在晶体和无定形体切换，而不同的相的电阻有明显的区别，可以用来存储信息。对于读只要加电压测试电阻即可，但是写则需要融化然后通过降温控制。因此写的开销相较于读会大很多。

因此，如果在计算中使用 NVRAM，那么**如果算法中的写操作很多则效率就会很差**。这类新的体系结构的改变会对于算法研究提出了全新的要求。举例而言，在早期使用磁带时随机访问很慢，因此在 1970 年 B-tree 就被提出以减小随机访存次数。而当 DRAM 技术普及和后期且 cacheline 大小仅有 64byte 的情况下，上文提到的二叉搜索树（BST）则会减小总的 memory footprint 进而达到更好的效果。在并行的要求下，则我们需要新的 P-tree 来处理数据。同理当 NVRAM 出现后，我们需要新的算法以减少写的次数来提高算法的效率。

早在 2014 年我们就和 Intel 合作开始进行这类算法的研究，我们称之为 write-efficient algorithms。我们需要解决的第一个问题就是，如何设计计算模型将读写不对称性加入复杂度分析中。本科算法课我们通常使用 time complexity 分析算法，虽然简单但是非常不精确。有很多更加精确的计算模型可以将 I/O、并行和其它方面的影响加入分析中，得到性能更优的算法。同理对于 NVRAM，我们设计了一系列新模型可以将操作数、I/O、caching 和并行等因素，以及**额外的写代价**考虑在内。在此基础上，我们设计了新的基础的算法比如排序以及各种序列操作，以及关于图、几何和 DP 等算法。这些算法不仅能在新的模型中得到理论的提升，在实际测试中也与理论的预期值吻合。

还是拿排序算法举例，复杂度为 O (n log n) 的快排和归并排序都需要对内存进行 O (n log n) 次写（归并排序要进行 log n 次合并操作，每次要操作整个数组的 n 个数，快排的 partition 同样是大致 O (log n) 次，每次操作所有 n 个数）。反而是复杂度 O (n^2) 的选择排序只需要写 O (n) 次内存（每次找到对应的数往内存写一次）。那能不能有 O (n log n) 复杂度的排序算法只需要写 O (n) 次的呢？其实已有的算法里就有这样的例子。感兴趣的同学可以参考课件（[链接](https://link.zhihu.com/?target=https%3A//www.cs.cmu.edu/afs/cs/project/pscico-guyb/realworld/www/slidesS18/we-algo.ppsm)），在这里本文提到的。

对于这一类算法有兴趣的同学可以参考 \[5]。排序当然只是一个最简单的例子，同时在上文的例子中我们也没有考虑并行、I/O 等问题。对于很多其它的算法，我们也需要重新设计以获得更好的性能。下图给了一个新的最短路算法的实际测试的内存读写次数的加权和，在多数情况下效果要好于经典算法。在最新的工作中我们给出了基于 NVRAM 写优化的图算法库，有兴趣的同学可以参考相关论文 \[6]，甚至可以下载程序测试（如果大家能 access 这类新硬件的话 ）。

![](https://pica.zhimg.com/v2-0b61f465d0391e730d9aac4fcb9f9f40_b.jpg)

图 5：新的最短路算法的加权读写代价。红色为新算法。ω 为写比读的代价倍数。

## 其它有趣的问题

上文给出了两个关于现代的算法研究的例子，实际上我们还有很多其它有趣的工作。理论上讲，其它一些我们做过的算法还有并行的增量三角剖分（Delaunay triangulation），并行强连通分支（strongly connected components），以及一个非常简单的并行最短路算法等等，这些都是并行算法中长时间未能很好解决的问题。实现方面，上述三角剖分和强连通分支的算法已经在我们维护的并行算法库中，性能要好于之前所有的算法。我们既设计和实现最快的经典算法如排序、半排序（semisort）、随机排列（random permutation），也包括并行其它领域和实际问题中的算法，比如数据库索引（database indexing），垃圾回收（garbage collection）机制，各种聚类算法等等。

希望上述的内容能对于大家了解新的算法设计和并行计算中的挑战有所帮助。对于有兴趣的同学们，我们欢迎大家加入加州大学河滨分校（University of California - Riverside）计算机系算法和并行计算的实验室，一起设计不仅有理论价值且有实际应用的高效算法。

## 关于 UC Riverside

UC Riverside 坐落于温暖的加州，在洛杉矶市市郊、距离中心约一小时车程的 Riverside。计算机系排名在 US News 排名 61，不过 US News 排名是基于印象的打分。在根据科研水平的排名 CS Ranking 中，近五年数据总体排名在 30-35 名之间（[链接](https://link.zhihu.com/?target=http%3A//csrankings.org/%23/fromyear/2014/toyear/2019/index%3Fall)，排名实时浮动），其中高性能计算方向排名高居第 4（[链接](https://link.zhihu.com/?target=http%3A//csrankings.org/%23/fromyear/2014/toyear/2019/index%3Fhpc)）。系里有很多优势研究方向，除了高性能计算，还有计算生物学，计算机安全，计算机系统，数据库和数据挖掘，等等。也欢迎对别的研究方向有兴趣的同学们申请！

博士研究生在校第一年会获得 Fellowship，在此之后由研究导师提供的科研岗位（RA）或者系内助教（TA）获得学费和生活费。UC Riverside 地处加州，相对于许多学校对于实习和就业等有非常大的**地理优势**。此外 UCR 计算机系有许多优秀的华人老师和学生，Riverside 和洛杉矶附近有**非常好吃的中餐**（知道你们在申请的时候会关注这个！）。Riverside 生活成本不算太高，但是因为邻近洛杉矶可以享受到各种方便的娱乐活动（演唱会等等），娱乐设施（各种主题公园，国家公园，好莱坞），机场（国内主要城市均有直飞、只要八至十个小时且机票通常非常便宜），中超等等。同时洛杉矶的各种运动队近年表现很出色，对于体育感兴趣的同学一定不会失望。

计算机系官网：[https://www1.cs.ucr.edu/](https://link.zhihu.com/?target=https%3A//www1.cs.ucr.edu/)

Ph.D. 项目简介：[https://www1.cs.ucr.edu/graduate/programs/computer-science-phd](https://link.zhihu.com/?target=https%3A//www1.cs.ucr.edu/graduate/programs/computer-science-phd)

教授们的列表：[https://www1.cs.ucr.edu/people/faculty](https://link.zhihu.com/?target=https%3A//www1.cs.ucr.edu/people/faculty)

招生链接：[https://graduate.ucr.edu/admissions](https://link.zhihu.com/?target=https%3A//graduate.ucr.edu/admissions)

## 关于我们

Yan Gu（顾研）2012 年毕业于清华计算机系，同年进入卡内基梅隆大学（Carnegie Mellon University，CMU）攻读博士学位。2018 年，顾研从 CMU 取得博士学位毕业，并开始在 MIT 进行了一年的博士后工作。他有多年的信息学竞赛和 ACM ICPC 经历和经验，并且曾经在计算机图形学，计算机理论，并行算法等多个研究方向都有成果和论文发表。

Yihan Sun（孙艺瀚）2014 年毕业于清华计算机系，并进入卡内基梅隆大学（Carnegie Mellon University，CMU）攻读博士学位。她在 2019 年从 CMU 取得博士学位毕业并进入 UC Riverside 成为助理教授。她曾在数据挖掘，计算生物学，计算机理论，并行算法，数据库等多个研究方向都有成果和论文发表。

我们即将同时进入 UC Riverside 计算机系，并希望和有兴趣的同学们一起组建起算法和并行计算实验室。

## 如何联系我们

有兴趣的同学们可以先看一下我们的主页：

顾研：[http://people.csail.mit.edu/guyan/](https://link.zhihu.com/?target=http%3A//people.csail.mit.edu/guyan/)

孙艺瀚：[https://www.cs.cmu.edu/\~yihans/](https://link.zhihu.com/?target=https%3A//www.cs.cmu.edu/~yihans/)

如果有兴趣申请，可以直接给我们发邮件（邮箱地址见主页）。请附上你的 CV，和任何你觉得对你申请有帮助的资料。这里是申请链接：[https://graduate.ucr.edu/admissions](https://link.zhihu.com/?target=https%3A//graduate.ucr.edu/admissions)

&#x20;**我们希望能招到对算法和并行计算方面有兴趣，有能力的博士生们。我们希望学生可以有一定的算法基础（有过参加竞赛的经历会很有帮助）和编程基础，有 CS 的本科背景或上过相关本科课程，此外如果有科研经历也会优先考虑哦。**&#x20;

（本文欢迎转载，但请注明出处）

本系列其它文章：

[](https://zhuanlan.zhihu.com/p/90172780)

[](https://zhuanlan.zhihu.com/p/91089093)

[](https://zhuanlan.zhihu.com/p/93279731)

参考文献

\[1] Guy Blelloch, Phillip Gibbons, and Harsha Vardhan Simhadri. Low-depth cache-oblivious algorithms. In ACM Symposium on Parallelism in Algorithms and Architectures (SPAA), 2010.

\[2] Thomas Cormen, Charles Leiserson, Ronald Rivest, and Clifford Stein. Introduction to Algorithms (3rd edition). MIT Press, 2009.

\[3] Guy Blelloch, Daniel Ferizovic, and Yihan Sun. Just join for parallel ordered sets. ACM Symposium on Parallelism in Algorithms and Architectures (SPAA), 2016.

\[4] Yihan Sun, Guy E Blelloch, Wan Shen Lim, and Andrew Pavlo. On Supporting Efficient Snapshot Isolation for Hybrid Workloads with Multi-Versioned Indexes, Proceedings of the VLDB Endowment (PVLDB), 2019.

\[5] Yan Gu. Write-Efficient Algorithms. PhD Thesis, Carnegie Mellon University, 2018.

\[6] [Laxman Dhulipala](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/d/Dhulipala%3ALaxman), [Charles McGuffey](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/m/McGuffey%3ACharles), [Hongbo Kang](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/k/Kang%3AHongbo), Yan Gu, [Guy E. Blelloch](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/b/Blelloch%3AGuy_E%3D), [Phillip B. Gibbons](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/g/Gibbons%3APhillip_B%3D), [Julian Shun](https://link.zhihu.com/?target=https%3A//dblp.org/pers/hd/s/Shun%3AJulian). Semi-Asymmetric Parallel Graph Algorithms for NVRAMs. arXiv:[1910.12310](https://link.zhihu.com/?target=https%3A//dblp.org/db/journals/corr/corr1910.html%23abs-1910-12310), 2019.
