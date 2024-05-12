---
title: "什么是 P = NP 问题？"
date: 2022-08-03T14:27:11+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [www.cxyxiaowu.com](https://www.cxyxiaowu.com/9424.html)

## 1 前言

今天和大家一起了解个高能知识点：**P=NP 问题**。

看到这里我们可能是一头雾水，不由得发问：

- P 问题是什么？
- NP 问题又是什么？
- P=NP 又是什么意思？
- 研究并解决 P=NP 问题的意义是什么？

这四个问题也是我们由表及里去理解 P=NP 问题的重要切入点，通过本文你将了解到包括但不限于以下内容：

- 千禧年世纪难题
- P 类问题和 NP 类问题特征定义
- P=NP 的研究和 NPC 问题
- 解决 P=NP 问题的大方向

## 2 千禧年世纪难题

时间镜头拉回 2000 年数学界出现了一个里程碑事件：千禧年大奖难题

> 千禧年大奖难题 Millennium Prize Problems 是七个由美国克雷数学研究所 Clay Mathematics Institute 于 2000 年 5 月 24 日公布的数学难题。根据克雷数学研究所订定的规则，所有难题的解答必须发表在数学期刊上，并经过各方验证，只要通过两年验证期，每解破一题的解答者，会颁发奖金 100 万美元。
>
> 这些难题是呼应 1900 年德国数学家大卫 · 希尔伯特在巴黎提出的 23 个历史性数学难题，经过一百年，许多难题已获得解答。而千禧年大奖难题的破解，极有可能为密码学以及航天、通讯等领域带来突破性进展。

大概意思就是 2000 年 5 月美国的一个私人非盈利机构出了 7 个意义重大的问题，解答任何 1 道会得到 100w 美元奖金，说到钱忽然精神起来了，不妨看下这 7 个多金的题目：

- P/NP 问题（P versus NP）
- 霍奇猜想（The Hodge Conjecture）
- 庞加莱猜想（The Poincaré Conjecture）
- 黎曼猜想（The Riemann Hypothesis）
- 杨 - 米尔斯存在性与质量间隙（Yang-Mills Existence and Mass Gap）
- 纳维 - 斯托克斯存在性与光滑性（Navier-Stokes existence and smoothness)
- 贝赫和斯维讷通 - 戴尔猜想（The Birch and Swinnerton-Dyer Conjecture）

黎曼猜想去年闹得沸沸扬扬，相信都有所耳闻，不过黎曼猜想是研究素数分布规律的问题，相比之下 P=NP 问题和计算机领域的关系更为密切，所以 P=NP 问题被认为是理论计算机和数学领域的综合问题，该问题的研究成果将对计算机领域和现实生活带来巨大的影响。

如克雷数学研究所的约定只要证明或者证伪 P=NP 问题即可赢取 100w 美元奖金，其实相比 P=NP 问题的证明或证否的影响和意义，100w 奖金只是皇冠上的一粒尘埃而已。

前面铺垫了一些卖了个关子，快马加鞭一起先来看下 P 和 NP，**到底是个怎样的问题**？

## 3 P 类和 NP 类问题特征

我在克雷数学研究所官网找到了关于 P 和 NP 问题 的简单说明：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/45915fda.jpe)

简单意译一下：

> 假设你正在为 400 名大学生组织住宿，但是空间有限只有 100 名学生能在宿舍里找到位置。更复杂的是还给了你一份不相容学生的名单，并要求在你的最终选择中不要出现这份名单中的任何一对。
>
> 这是计算机科学家称之为 NP 问题的一个例子，因为很容易检查一个同事提出的一百个学生的给定选择是否令人满意，然而从头开始生成这样一个列表的任务似乎太难了以至于完全不切实际。
>
> 事实上从 400 名申请者中选择 100 名学生的方法总数比已知宇宙中的原子数量还要多！这类其答案可以被快速检查，但是通过任何直接的程序需要不可接受长度的时间来解决，比如 300 年或者更多…
>
> 斯蒂芬 · 库克和列昂尼德 · 莱文在 1971 年独立地提出了 P(即容易找到) 和 NP(即容易检查) 问题。

P 和 NP 问题是斯蒂芬 · 库克和列昂尼德 · 莱文在 1971 年提出的，从上文的描述中大概知道了 P 问题和 NP 问题的主要特征：

**P 问题 (easy to find)**

> all problems solvable, deterministically, in polynomial time
> 译：多项式时间内可解决的问题 (当然在多项式时间是可验证的)

**NP 问题 (esay to check)**

> non-deterministic Polynomial time
> 译：非确定性多项式时间可解决的问题

举几个例子来加深印象：

**计算 1-1000 的连续整数之和**：这个问题就比较简单，无论是编程还是使用高斯求和公式都可以在有限可接受的时间内完成，这种算是 P 类问题。

**计算地球上所有原子个数之和**：这个问题就很困难甚至无解，但是现在有个答案是 300 个，显然是错的，所以很容易验证但不容易求解，这种算 NP 类问题。

看到这里我们 get 了一个**非常重要的概念 (\*\***敲黑板划重点\***\*)**：P 类问题是可以在多项式时间内解决并验证的一类问题，NP 类问题是可以多项式时间验证但是不确定能否在多项式时间内解决的一类问题。

等等！让我捋一捋，前面一直说 **多项式时间** ，那**么到底啥样的时间是多项式时间呢？**

## 4 多项式时间

其实多项式时间的概念我们还是很熟悉的，在做算法题或者日常工作时我们都会说，这个解法的时间复杂度是 O(n^2) 性能不是很好，那个解法的时间复杂度是 O(nlogn)(注: 计算机中的 log 一般指底数 = 2) 还可以。

这里的大 O 就是时间复杂度的表示法，看到这里仿佛清晰一些了，不过还是看下多项式表达：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/2ec4ea16.png)

多项式的概念我们在小学初中的时候就开始接触了，对于计算机来说有更特别的含义，我们都知道算法时间复杂度的大 O 表示法，取表达式中的最高次其他项忽略，因为随着输入规模的增大最高次的影响最大，对计算机来说可以做这样的近似处理，比如上面的多项式表达式可以理解为 O(n^k) 的复杂度。

这个世界并不是只有多项式时间这么简单，我们还知道有指数函数形如 2^n 这个计算量已经非常可怕，更不要说 n^n 和 n! 这种问题了。

对于计算机而言，它不知道问题难不难，对它而言就是拆解成非常多的步骤去执行，去衡量计算机认为难或者不难或许可以从其执行时间来看，在排除代码实现差异来说，执行时间越长的问题通常都会比较难。

我们通常将多项式时间看作是计算机解决问题的分水岭，因为超过多项式时间之后时间消耗上就不太好接受了。

直观感受一下，随着不同输入规模下，多项式时间和非多项式时间的时间消耗曲线差异吧：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/42b49e1e.png)

**图片来自网络：复杂度对比**

看到这里恍然大悟，多项式时间内可解决的意义所在。

回过头看看 NP 问题是 non-deterministic Polynomial time，也就是 NP 问题能否在多项式时间内解决存在不确定性。

也就是说很多 NP 类问题如果无法在多项式时间内解决，那么于我们当前的计算能力而言是几乎无解的，量子计算机目前还处于初级阶段，或许若干年后这些问题对于量子计算机而言是可以接受的…

或许你会问像超级计算机这种能行吗？我们从时间增长曲线来看，问题规模扩大一点点，我们需要的算力就是更大倍数的增加，这样堆砌机器不是好办法，我们最好寄托于其他解决思路。

看到这里聪明的读者会不由感叹：要是把 NP 问题转化到多项式时间内解决，那将是多么的进步啊！如果你已经开始有这个想法了，那也就开始深入 P=NP 的腹地了，我们继续前进~

等等！我们一直在提 NP 类问题，听着这列问题还挺有意义并且很难，能不能举几个现实的 NP 问题的例子呢？这个问题很好呀！我们来看看现实中的 NP 问题吧。

## 5 现实中的 NP 类问题

其实现实中的 NP 类问题非常多，并且很多都有非常重要的意义，举几个大家耳熟能详的例子，比如旅行商问题 (又称旅行推销员问题)。

先来看下旅行商问题 TSP 的定义：

> 旅行推销员问题 Travelling salesman problem 是这样一个问题：给定一系列城市和每对城市之间的距离，求解访问每一座城市一次并回到起始城市的最短回路。它是组合优化中的一个 NP 难问题，在运筹学和理论计算机科学中非常重要。
>
> 最早的旅行商问题的数学规划是由 Dantzig（1959）等人提出，并且是在最优化领域中进行了深入研究。许多优化方法都用它作为一个测试基准。尽管问题在计算上很困难，但已经有了大量的启发式算法和精确方法来求解数量上万的实例，并且能将误差控制在 1% 内。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/6866e7db.png)

**图片来自网络：旅行商问题地图示意图**

我们都知道在城市规模比较小时比如 3 个 / 5 个 我们可以进行穷举来确定最优的路线，但是经过几次穷举我们发现穷举复杂度是 O(n!)。

啊呀！O(n!) 太大了，在 n=100 时，那么有多大呢？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/fe92ccd4.png)

啊呀！这么大，但是好像你还觉得不直观，那么来看看宇宙的原子数有多大吧：

> 知乎问题：为什么说宇宙原子总数差不多是 10 的 80 次方？[https://www.zhihu.com/question/63852727](https://www.zhihu.com/question/63852727)

这个数字是按照宇宙中星系数量、每个星系恒星数量、每个恒星质量等角度结合原子质量进行的估算，数量级上有一些误差，但是远小于 100 的阶乘，这里我们深深感受了指数级膨胀的威力。

所以当 TSP 问题的输入规模在 100 时，如果仍然进行穷举的话，计算量将无效大，天荒地老沧海桑田那种…

NP 问题不仅存在于运筹学，在医学领域的蛋白质折叠问题也属于 NP 问题，该问题对研究癌症、阿尔兹海默症、帕金森症等都有非常重大的现实意义。

所以对于 NP 类问题的现实影响意义我们不用质疑，充分认识到这类问题的研究价值所在是我们进步的源动力。

> **画外音**：清华大学 2016 年本科特等奖获得者 95 后陈立杰，无敌超神的传奇人物在特奖答辩时提到希望在自己有生之年看到 p=np 问题被解决，知乎上有答辩视频，超赞感兴趣可前往观看，所以 p=np 问题可以说是全世界最聪明的那拨人魂牵梦绕的问题了。

了解了 NP 类问题的现实意义之后，**看看全世界的学者都做了哪些研究，取得了哪些进展。**

## 6 大突破之 NPC 问题

从特征上看，我们可以知道 P 类问题属于 NP 问题，因为 P 类问题属于 NP 类问题中可在多项式时间验证并解决的问题，可以简单认为 P 类问题属于特例最基本简单的 NP 问题。

P 类问题是在我们目前能力范围内的，但是 NP 类问题要寻找最优解可能超越多项式时间，我们知道 P 类问题属于 NP 类问题。那么 NP 类问题是否可以归类为 P 类问题呢？

好了，截止到这里我们终于引出了 P=NP 问题在表达什么：**是否所有 NP 类问题都可以在多项式时间内解决并验证，也就是转化为 P 类问题**。

虽然目前 P=NP 问题还没有被证明或者证伪，但是经过多年的研究，学术界的一个方向性的共识是 P=NP 问题应该是不成立的，换句话说就是至少存在一个 NP 类问题是无法在多项式时间内解决的。

不由得问为什么会有这个不成立的倾向呢？因为很多学者做了很多研究之后，虽然没有解决问题，但是仍然取到了很大的进步提供了研究方向：NPC 问题的发现。

俗语有云：射人先射马 擒贼先擒王。没错，NPC 类就是 NP 类问题的王。

NPC 问题 Non-deterministic Polynomial complete problem 又称 NP 完全问题，NP 问题就是大量的 NP 问题经过归约化而发现的终极 bossNP 问题。

等等… **归约化**是嘛意思…

我在搜索了一些定义，感觉不是很好后来看到 **CMU** 的一个课件，虽然是英文的，但是表达的比较清晰一起看下 (**以下图片均来自下述链接**)：

> 【推荐】关于归约化的和 npc 问题的解释：[https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/npcomplete.pdf](https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/npcomplete.pdf)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/286b1431.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/5e4ebcb7.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/5f3448b5.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/fed93e05.png)

课件里的解释还是很通俗的，其中注意一个词汇 Reductions，这个单词是 Reduce 的名词，reduce 是减少的意思，所以我们大致猜测到归约化的意思了。

归约化是解决复杂问题的一种思路工具，课件中展示了将问题 Y 归约化到问题 X 的过程，其中提到了多项式归约，如果我们找到了问题 X 的多项式时间解法，那么我们有理由相信问题 Y 同样可以找到多项式时间解法。

归约化具备传递性：问题 A 可归约为问题 B，问题 B 可归约为问题 C，那么问题 A 可归约为问题 C，正是基于这个特性我们才能把很多小的 NP 类问题串起来，最终出现 NPC 问题。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/e67534c1.png)

相比而言问题 X 比问题 Y 更难也更普遍，回到 NP 问题上来说，NP 问题的归约化就是去寻找一个终极 NP 问题，这个问题更普遍更难但是可以 cover 很多小范围的 NP 问题，这类终极 NP 问题就是 NP 完全问题。

课件中也给出了  NPC 问题的基本定义：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/d10bff79.png)

所以 NPC 问题是研究的重点，其实 TSP 问题就是一个 NPC 问题，这里简单翻译下课件给出 NPC 问题的两个基本特征定义：

- NPC 问题属于 NP 问题
- 对于所有 NP 问题都可以归约化到它

先注意下这个定义，后面会用到，因为还有一类更复杂的问题…

写到这里如果你还在看，那就值得给你点个赞，因为 P=NP 的话题相比具体的技术点更晦涩，笔者也是在 B 站在谷歌看了许多资料之后才稍微清晰一些的，所以没看懂没关系，多看几遍就好了。

**事情到这里就结束了吗？并没有…**

## 7 NP-Hard 问题

前面我知道了 NPC 问题，但是仍然有一部分特别的问题称为 NPH 问题。

NP-Hard 问题是满足 NPC 问题定义的第二条，但不满足第一条，也就是说所有 NP 问题可以归约化到 NPH 问题，但是 HP-Hard 问题不一定是 NP 问题，所以 NPH 问题比 NPC 问题更难。

NPH 问题比 NPC 问题难理解一些，看个回答：

> NP-Complete VS NP-Hard [https://stackoverflow.com/questions/20523578/np-complete-vs-np-hard](https://stackoverflow.com/questions/20523578/np-complete-vs-np-hard)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/9f256591.png)

**图片来自网络：NPH 问题的特征**

截止到这里，该说的基本上都说了，再回到最初的问题 P=NP 是否成立呢？如果成立或者不成立，问题的集合该是怎么样的呢？

维基百科给出了**在 P=NP 成立和不成立情况下的集合关系**，如图 (**敲黑板划重点**)：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_letybly168fxdpob/7cf0b3dc.png)

## 写在最后

本文也是笔者不熟悉但是还比较感兴趣的领域，最近一周花了一些时间去看这个话题，其中在 B 站的**妈咪说**和**遇见数学**的科普介绍很不错，在观看过程中也是反复看，但是对于其中细致的问题也捉襟见肘，因此文章可能存在问题，如果读者是这方面的大神可以直接私信我提出，我们一起看下。

最后还是想感叹几句吧，在写作过程中我不断想起大刘三体中的水滴，地球人枕戈待旦地准备迎接三体舰队，但是一个水滴就几乎让地球舰队全军覆没，水滴的神奇让我们感受到了渺小。

科幻还是未来，取决于现在，最后依然感谢各位读者的倾情阅读，完结。

## 巨人的肩膀

- [http://www.matrix67.com/blog/archives/105](http://www.matrix67.com/blog/archives/105)
- [https://www.zhihu.com/question/63852727](https://www.zhihu.com/question/63852727)
- [https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/npcomplete.pdf](https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/npcomplete.pdf)
- [https://www.tutorialspoint.com/design_and_analysis_of_algorithms/design_and_analysis_of_algorithms_np_hard_complete_classes.htm](https://www.tutorialspoint.com/design_and_analysis_of_algorithms/design_and_analysis_of_algorithms_np_hard_complete_classes.htm)
- [https://stackoverflow.com/questions/20523578/np-complete-vs-np-hard](https://stackoverflow.com/questions/20523578/np-complete-vs-np-hard)
