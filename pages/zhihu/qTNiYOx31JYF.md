---
title: JD Quant50篇干货合集，揭开量化交易之谜
date: 2024-10-04T15:14:56.901Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/26569924
---
阅读原文：[http://club.jr.jd.com/quant/topic/1176040](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1271848)

京东金融官方资讯 QQ 群：456448095 有什么想咨询的都可以来询问我们哦

本文梳理了目前常见的量化策略，并给出了一些入门的读物供大家学习参考。

目前量化策略主要包括多因子策略、统计套利、机器学习等，本文列出了这几类策略的框架，并列出了部分代表方法。

![](https://pic3.zhimg.com/v2-3ff5511e046d7010fd4e399235efb516_b.jpg)

\
\


*文章摘要*

*l 几类常见的量化策略框架图*

*l 多因子模型及典型案例*

*l 统计套利及其展开*

*l 机器学习*

*l 其他方法，如文本挖掘、舆情及各类数学分析方法*

*l 手把手教学系列*

*l 延伸阅读，量化入门及经典策略*

\
\


**l 几类常见的量化策略框架图**

\


量化选股，就是通过量化思想及配套的计算机程序化来实现选股（如何选择好的股票）和择时（如何在合适的时间进行合适的调仓），从而完成量化投资组合策略的构建。

\


![](https://pica.zhimg.com/v2-f179254376a2e7ff2b001ae0663b2f60_b.png)

\
\


**l 多因子模型及典型案例**

\


多因子模型包括了技术指标模型和财务指标模型，它的优点是思路直接清晰、数据便于获得。

多因子模型主要用在股票上。建立多因子模型大致有如下步骤：

1、因子测试。将股票池中的个股按因子值大小进行分组，计算每个组合在一段时间内的收益情况，这样可以识别因子是否有效。为了防止该因子和一些已知的因子存在较强的相关性，有时需要将收益率对已知变量做回归，然后对残差进行分组测试。

2、分配因子权重。按照不同目的，存在不同的因子加权方法。比如为了最大化超额收益，可以采取因子 IC 法。如若为了最大化夏普率，可以计算各因子的收益率和协方差矩阵，然后采用优化的方法求解权重。

因子不仅限于财务因子、技术因子，也可以包括情绪、舆情等。

\


**1、技术指标模型偏向于择时**

\


如 MACD、KDJ、布林带等 [http://club.jr.jd.com/quant/topic/1091145](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1091145)

\


技术指标模型可谓是广受喜爱的选股方式，除了上文提到的技术指标模型外，还有以下经典

\


上升三角形[http://club.jr.jd.com/quant/topic/867675](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/867675)

均线应用[https://club.jr.jd.com/quant/topic/778188](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/778188)

RSI [http://club.jr.jd.com/quant/topic/1098218](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1098218)

KDJ[http://club.jr.jd.com/quant/topic/981160](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/981160)

多方炮[http://club.jr.jd.com/quant/topic/881252](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/881252)

SMA[http://club.jr.jd.com/quant/topic/839442](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/839442)

IDE [http://club.jr.jd.com/quant/topic/1091094](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1091094)

\


**2、财务指标模型偏向于选股**

如市值、ROA、EPS 等

其中可利用的因子有价值因子 (PB，PE 等)、市场因子 (涨幅，换手率等)、基本面因子 (资产负债率，流动比率等) 以及成长因子 (净利润增长率，主营利润增长率等)

通过单因子测试和多因子测试完成因子的选择和策略构建。

\


单因子测试[http://club.jr.jd.com/quant/topic/1154691](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1154691)

多因子测试[http://club.jr.jd.com/quant/topic/1154669](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1154669)

比较常见的策略有

\


Fama-French 三因子策略[http://club.jr.jd.com/quant/topic/982124](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/982124)

特异性风险因子模型[http://club.jr.jd.com/quant/topic/942689](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/942689)

多因子选股：[https://club.jr.jd.com/quant/topic/878463](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/878463)

\
\
\


**l 统计套利及其展开**

\


套利策略包括结合基本面的套利策略和纯粹的统计套利。结合基本面的套利策略多出现在期货市场中。股票和期权市场多是统计套利，这种统计套利依据历史的统计规律，由于历史规律不一定适用于未来，因此这种套利并不是无风险的。

统计套路主要是在对历史数据进行统计分析的基础上，估计相关变量的概率分布，并结合基本面数据进行分析以指导套利交易，与传统单边投资方式相比，统计套利多空双向持仓在处理大资金方面可以**有效规避一部分风险**。

\


下文用例子浅显地解释了何为统计套利，可以作为入门读物；

统计套利介绍[http://club.jr.jd.com/quant/topic/1130716](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1130716)

\


综合套利模型和因子模型进行分析对比；

资本资产定价模型简介 - 多因子寻找 Alpha & 统计套利[http://club.jr.jd.com/quant/topic/935852](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/935852)

\


配对交易的介绍与实现

统计套利之配对交易[http://club.jr.jd.com/quant/topic/787798](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/787798)

\
\


**l 机器学习**

\


机器学习主要目的在于发现规律或重现规律，近来被广泛应用于各个行业。

\


入门读物，对机器学习的概念、在量化投资中的应用及利弊进行了介绍

量化投资如何应用到机器学习[http://club.jr.jd.com/quant/topic/905698](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/905698)

\


机器学习的 python 简单实现。

python 机器学习入门[http://club.jr.jd.com/quant/topic/1088568](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1088568)

\


决策树算法作为数据挖掘其中一种判定数据所属类别的算法，数学模型简单，编程有程序包，极易上手，适合大家研究使用。

决策树算法[https://club.jr.jd.com/quant/topic/841642](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/841642)

决策树算法（续）[https://club.jr.jd.com/quant/topic/841923](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/841923)

\


深度学习可以实现对高频市场行情数据进行挖掘并获得对未来股票价格走势有预测能力的模式。

深度学习[http://club.jr.jd.com/quant/topic/1130718](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1130718)

\
\


**l ** **其他方法，** **如文本挖掘、舆情及各类数学分析方法**

\


除了上述三类方法，还有文本挖掘方法和其他数学方法可以应用到量化投资当中。

**1、文本挖掘**作为数据挖掘的一个分支，挖掘对象通常是非结构化的文本数据，文本挖掘应用于量化投资是一个比较新的思想。

对文本挖掘在量化投资中的实现进行了介绍

文本挖掘之数据爬虫[https://club.jr.jd.com/quant/topic/871691](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/871691)

文本挖掘如何应用于量化投资[https://club.jr.jd.com/quant/topic/843393](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/843393)

\


**2、舆情分析**

在文本挖掘基础上将文本情感分析计算情感得分的思路用于选股上面。

利用舆情情感得分进行量化选股[https://club.jr.jd.com/quant/topic/856753](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/856753)

\


**3、数学方法**

另外，各类数学方法也是不断地被尝试应用于量化策略的构造上，当然想要应用这类方法还是需要一定的数学基础。

隐马尔科夫模型（HMM）[http://club.jr.jd.com/quant/topic/948850](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/948850)

非负矩阵分解[http://club.jr.jd.com/quant/topic/953653](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/953653)

\


总之，从最早的技术因子、财务因子选股到最新的深度学习、文本挖掘，量化投资方法层出不穷。当然，方法是一回事，具体的策略构建又是另外一回事。正所谓 “黑猫白猫能抓到耗子就是好猫”，只要这种方法构建的策略能够充分挖掘市场信息，取得良好的收益和较低的波动，策略就是好的策略，方法就是有效的方法。

\
\


**l 手把手教学系列**

\


手把手教你使用 python 在京东量化平台完成简单策略回测 [http://club.jr.jd.com/quant/topic/963245](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/963245)

手把手教你写一个胜率较高的策略 -“买入连续下跌的股票”[http://club.jr.jd.com/quant/topic/1100358](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1100358)

手把手教你写 “法玛三因子” 策略[http://club.jr.jd.com/quant/topic/982124](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/982124)

手把手教你写一年 80% 收益的成长股策略 (一)[http://club.jr.jd.com/quant/topic/930606](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/930606)

手把手教你写一年 80% 收益的成长股策略 (二)[http://club.jr.jd.com/quant/topic/930857](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/930857)

高卖低买赚 Spread 策略分享：[http://club.jr.jd.com/quant/topic/921694](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/921694)

如何控制回撤：[http://club.jr.jd.com/quant/topic/913308](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/913308)

控制回撤的第二种方法 -- 依据持仓总资金：[http://club.jr.jd.com/quant/topic/914524](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/914524)

依据最大回撤择时策略：[http://club.jr.jd.com/quant/topic/940473](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/940473)

一个简单的买卖止盈止损分时买卖框架：[http://club.jr.jd.com/quant/topic/939467](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/939467)

选择涨停股的技巧有哪些：[https://club.jr.jd.com/quant/topic/774972](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/774972)

小工具函数 —— 查询涨跌停：[http://club.jr.jd.com/quant/topic/930708](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/930708)

\
\


**l 延伸阅读，量化入门及经典策略**

\


**量化入门**

3 分钟快速了解京东量化怎么玩[https://club.jr.jd.com/quant/topic/897351](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/897351)

入门量化交易需要哪些能力 [https://club.jr.jd.com/quant/topic/963308](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/963308)

理工科专业转行量化分析投资，需要怎么做？[http://club.jr.jd.com/quant/topic/981173](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/981173)

量化交易领域最重要的十本书：[https://club.jr.jd.com/quant/topic/963246](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/963246)

业内大牛教你量化投资怎么做[https://club.jr.jd.com/quant/topic/961854](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/961854)

量化投资未来及国内的发展[http://club.jr.jd.com/quant/topic/1130725](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1130725)

\


**经典策略**

羊驼策略初步研究一：[https://club.jr.jd.com/quant/topic/854721](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/854721)

摩根斯坦利旗下基金的择时指标介绍：[https://club.jr.jd.com/quant/topic/854923](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/854923)

基于隐式马尔可夫模型的市场择时简介：[https://club.jr.jd.com/quant/topic/883453](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/883453)

成长股内在价值策略分享：[https://club.jr.jd.com/quant/topic/902319](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/902319)

小市值策略：[https://club.jr.jd.com/quant/topic/894215](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/894215)

股价增长率与营业利润率之比选股策略 (修改 X2 版)：[https://club.jr.jd.com/quant/topic/860683](https://link.zhihu.com/?target=https%3A//club.jr.jd.com/quant/topic/860683)

最后欢迎各位朋友来[京东量化平台](https://link.zhihu.com/?target=http%3A//quant.jd.com/)讨论自己的量化心得，开发出好的量化策略！

阅读原文：[http://club.jr.jd.com/quant/topic/1176040](https://link.zhihu.com/?target=http%3A//club.jr.jd.com/quant/topic/1271848)
