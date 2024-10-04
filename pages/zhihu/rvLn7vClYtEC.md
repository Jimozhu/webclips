---
title: 国内期货程序化交易都有哪些入门材料可以学习？
date: 2024-10-04T15:13:50.676Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //www.zhihu.com/question/19787200/answer/22508637
---
以下全部为本人实习时的笔记，大段引用已注明出处并推荐网站与阅读材料，其余均为业内公共知识，恕不一一注明出处。

\======================================================================

经

[@丁澤宇](//www.zhihu.com/people/42589cdf44927f17ff159b69a4cb8788)

指正。也许对 “笔记” 的理解有偏差，所以把笔记的来源出处全部注明一下。其他细节有的是实习公司的内参，并非个人整理，如有相同请评论。如需当时的测试底稿与笔记详情，欢迎私信联系查阅。

[程序化交易的优点与缺点](https://link.zhihu.com/?target=http%3A//futures.hexun.com/2012-08-21/144975498.html)

[全球 10 大 顶尖模型 集合（有源码）](https://link.zhihu.com/?target=http%3A//bbs.tb18.net/forum.php%3Fmod%3Dviewthread%26tid%3D22501%26page%3D1)

[\[交易系统\] Dual Thrust](https://link.zhihu.com/?target=http%3A//www.weistock.com/bbs/dispbbs.asp%3Fboardid%3D10%26id%3D7524)

[金字塔 Dual Thrust 交易系统源码](https://link.zhihu.com/?target=http%3A//www.cxh99.com/2012/11/09/8883.shtml)

[国外知名期货投资策略 Dual Thrust 介绍及效果测试.pdf](https://link.zhihu.com/?target=http%3A//ishare.iask.sina.com.cn/download/explain.php%3Ffileid%3D25513329)

使用的学习网站在最后。

\======================================================================

[程序化交易系统](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E7%A8%8B%E5%BA%8F%E5%8C%96%E4%BA%A4%E6%98%93%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLnqIvluo_ljJbkuqTmmJPns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.s5wkFJNflQdXXh2R7NUZJiUC9tF--4PCaHaQZ8YCuxE\&zhida_source=entity)是指将设计人员交易策略的逻辑与参数在电脑程序运算后，并将交易策略系统化。说白了也就是把一些固定的交易策略通过写程序固定下来，进行重复智能化操作就好，所以重要的还是交易策略，程序本身如虎添翼而已。

\


> &#x20;**程序化交易的优点在于：**&#x20;
>
> 1、避免了人为的主观性
>
> 避免人为主观性既是程序化交易的优点也是程序化交易的缺点，在进行期货交易时，正是人的主观判断得以利润的攫取，有一部分非常优秀的炒单手在期货市场的交易中获得了巨大的利润，他们的主观性是程序化交易所不能替代的。但是，更多的投资者的主观性可以说在期货市场的交易中是不合理的，该进场的时候退却，该离场的时候却是犹豫。采用程序化交易可以避免这些思想也就是避免绝大多数人在期货交易中不恰当的主观性。程序化交易最后获得的利润会低于优秀炒单手的利润，却会大大高于普通投资者的收益。
>
> \
>
>
> 2、极大的分散了投资风险
>
> 期货市场的交易很大程度上是博取概率事件的胜率，没有人能保证每笔交易的盈利。因此，这就需要我们分散我们的交易，同时对多个品种交易，同时采用不同的交易策略对一个品种的交易。这些如果通过人工来完成必将耗费大量的人力，且无法避免一些人性的弱点。采用程序化交易可以完美完成上述策略，达到最大限度的风险分散。

**国际程序化交易系统情况**

> 据美国权威交易系统评选杂志《Futures Truth Magazine》2011 年 10 月发布的交易系统排名，NatGator、Catscan、DCS II 等模型的业绩在过去一年进入了前十名榜单，前三名模型年收益率均在 200% 以上。
>
> Delphi II Aggressive、Trend Finder Tiger、TSL\_CEL\_NG\_1.1 等模型 进入了发布超过 18 个月的交易系统业绩排名榜单，前十名模型的年收益率介于 74.6%-170.5% 之间。
>
> 表 1：前十大交易系统排名（过去 1 年）\
> 排名 交易系统名称 年收益率 %\
> 1 NatGator 237.80%\
> 2 Catscan 222.10%\
> 3 DCS II 215.90%\
> 4 Strategic 173.50%\
> 5 Sidewinder 169.90%\
> 6 ATS 6400 169.00%\
> 7 Aberration 167.90%\
> 8 Waverider 166.30%\
> 9 Moving Average 164.40%\
> 10 Reversal 162.60%\
> 注：收益截至 2011 年 7 月 31 日，收益率计算基于 3 倍保证金。
>
> \
>
>
> 表 2：前十大交易系统排名（自系统发布以来）\
> 排名 交易系统名称 年收益率 %\
> 1 Delphi II Agressive 170.50%\
> 2 Trend Finder Tiger 162.50%\
> 3 TSL\_CEL\_NG\_1.1 161.90%\
> 4 Natural Gas Offense 157.60%\
> 5 Trend Finder Lion 2 141.90%\
> 6 Auto Core Duo 90.10%\
> 7 Propero ES 81.80%\
> 8 Dual Thrust 81.70%\
> 9 TSL\_SP\_1.0Z 76.90%\
> 10 Trend Weaver 74.60%\
> 日，收益率计算基于 3 倍保证金。\
> 注：交易系统必须发布 18 个月以上，收益截至 2011 年 7 月 31 日。\
> \
> 由于这些交易系统一般都被用于商品、外汇、农产品、股指等多个市场，因此杂志还专门对[标准普尔 500 指数](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E6%A0%87%E5%87%86%E6%99%AE%E5%B0%94500%E6%8C%87%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLmoIflh4bmma7lsJQ1MDDmjIfmlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.AgchgCl88oU-2pQ8zFgYoS0ua6PsvCA8HP6-27fKHFA\&zhida_source=entity)的交易系统进行了排名。
>
> FT Classic、TSL\_SP\_1.0Z、TSL\_CEL\_SP1 等模型进入了前十名榜单，前十大模型的年收益率介于 36.3%-107.3% 之间。
>
> \
>
>
> 表 3：前十大 S\&P 交易系统排名\
> 排名 交易系统名称 年收益率 %
>
> 1 FT Classic 107.30%\
> 3 TSL\_CEL\_SP1 74.50%\
> 2 TSL\_SP\_1.0Z 76.90%\
> 4 Keystone 54.10%\
> 5 Impetus SP 50.50%\
> 6 Big Blue 2 49.60%\
> 7 Strategic 500 45.50%\
> 8 STC SP Daytrader 42.00%\
> 9 R-Breaker 37.10%
>
> 10 C Daybreaker 36.30%\
> 注：排名基于系统发布以来业绩，收益截至 2011 年 7 月 31 日，收益率计算基于 3 倍保证金。

\


&#x20;**尽管国外市场上的交易系统举不胜举，但对于成熟的交易策略，开发者一般不愿公开，投资者也较难深入了解诸多交易策略的原理。**&#x20;

\


拿鼎鼎大名的**Dual Thrust 策略**举个例子吧，Dual Thrust 系统是 Michael Chalek 在 80 年代开发的 Dual Thrust。在[自动化交易](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BA%A4%E6%98%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLoh6rliqjljJbkuqTmmJMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.pm9XBJucbGbFFNGqNHuqVtLRjX_iQmpchtdapjRjS44\&zhida_source=entity)排名中，目前为止，仍然排名第二左右。下表是我自己按 5 分钟周期跑回测的结果，效果非常好：

![](https://picx.zhimg.com/50/61b917d0c6778126699d66be4c2c5b77_720w.jpg?source=2c26e567)

这是上表成绩最好的[沪铜指数](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E6%B2%AA%E9%93%9C%E6%8C%87%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLmsqrpk5zmjIfmlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.z9pAmq6o1F_VSg7LFOEtPjIL-oYlKAnOfWuGhKfXPcA\&zhida_source=entity)的成绩走势图：

![](https://pic1.zhimg.com/50/6f7e1ef808dd75a0472b500e3e50873a_720w.jpg?source=2c26e567)

通过几个关键数据的对比发现，该模型对于多品种还是有一定的普适性，模型中的参数也采用默认，未针对个别产品进行优化，虽然选出的四个产品都达到了正收益，但由于品种的差异性，区别还是较大。

我们可以看下它的源代码，并不复杂：

> ```text
> Inputs: K1(.5),K2(.5),Mday(1),Nday(1);
> Vars: BuyRange(0), SellRange(0);
> Vars: BuyTrig(0),SellTrig(0);
> Vars: HH(0),LL(0),HC(0),LC(0);
>
> If CurrentBar > 1 Then Begin
> HH = Highest(High,Mday);
> HC = Highest(Close,Mday);
> LL = Lowest(Low,Mday);
> LC = Lowest(Close,Mday);
>
> If (HH - LC) >= (HC - LL) Then Begin
> SellRange = HH - LC;
> End Else Begin
> SellRange = HC - LL;
> End;
>
> HH = Highest(High,Nday);
> HC = Highest(Close,Nday);
> LL = Lowest(Low,Nday);
> LC = Lowest(Close,Nday);
>
> If (HH - LC) >= (HC - LL) Then Begin
> BuyRange = HH - LC;
> End Else Begin
> BuyRange = HC - LL;
> End;
>
> BuyTrig = K1*BuyRange;
> SellTrig = K2*SellRange;
>
> If MarketPosition = 0 Then Begin
> Buy at Open of next bar + BuyTrig Stop;
> Sell at Open of next bar - SellTrig Stop;
> End;
>
> If MarketPosition = -1 Then Begin
> Buy at Open of next bar + Buytrig Stop;
> End;
>
> If MarketPosition = 1 Then Begin
> Sell at Open of next bar - SellTrig Stop;
> End;
>
> End;
> ```

短短几十行而已，难度并不大，但其背后的交易策略却是很厉害。

它的逻辑原型是较为常见的[日内交易策略](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E6%97%A5%E5%86%85%E4%BA%A4%E6%98%93%E7%AD%96%E7%95%A5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLml6XlhoXkuqTmmJPnrZbnlaUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.tzuw3frwoKb5eAIkKFmbNowIMUWveJYkBITQUR04oB8\&zhida_source=entity)之一开盘区间突破策略，以今日开盘价加减一定比例的昨日振幅，确定上下轨。日内突破上轨时平空做多，突破下轨时平多做空。

**开盘区间突破策略基本原理**

> 1\. 在今天的收盘，计算两个值：最高价－收盘价，和收盘价－最低价。然后取这两个值较大的那个，乘以 k 值 0.7。把结果称为触发值。
>
> 2\. 在明天的开盘，记录开盘价，然后在价格超过（开盘＋触发值）时马上买入，或者价格低于（开盘－触发值）时马上卖空。
>
> 3\. 没有明确止损。这个系统是反转系统，也就是说，如果在价格超过（开盘＋触发值）时手头有一口空单，则买入两口。同理，如果在价格低于（开盘－触发值）时手上有一口多单，则卖出两口。

![](https://pica.zhimg.com/50/b607c27293ed2a917493b69761e288c9_720w.jpg?source=2c26e567)

&#x20;**Dual Thrust 在开盘区间突破策略上进行了相关改进：**&#x20;

> 1、在范围（range）的设置上，引入前 N 日的四个价位，使得一定时期内的范围相对稳定，可以适用于日间的趋势跟踪；
>
> 2、Dual Thrust 对于多头和空头的触发条件，考虑了非对称的幅度，做多和做空参考的 Range 可以选择不同的周期数，也可以通过参数 K1 和 K2 来确定。当 K1 时，多头相对容易被触发，当 K1>K2 时，空头相对容易被触发。
>
> \
>
>
> 因此，在使用该策略时，一方面可以参考历史数据测试的最优参数，另一方面，则可以根据自己对后势的判断，或从其他大周期的技术指标入手，阶段性地动态调整 K1 和 K2 的值。

\


就是一个典型的观望、等待信号、进场、套利、离场的套路，却效果卓著。

\


&#x20;**因此对于学习程序化，一是对编程语言和工具的掌握，这个和所有的码农进阶之路一样，练是硬道理，技术要求与你的策略复杂程度成正相关。二就是对交易策略的领会，赚钱本身是体力活，赚钱的逻辑才是脑力活。**&#x20;

\
\


推荐一个网站

[程序化交易网 程序化久久（CXH99） 程序化交易模型 股票公式指标 期货公式指标 代编写公式指标](https://link.zhihu.com/?target=http%3A//www.cxh99.com/)

，在这个网站上可以找到题主需要的大部分入门材料。

其中有几篇文章适合先读一下，以前保存下来的，原网站不知是否依然保留，但均为上述网站原创，在这里一并注明。

> **日内交易模型的设计思路**
>
> 【入市设计】\
> 系统模型入市的设计思路，事实上应与投资者的交易风格喜好、交易时间框架密切相关，可以分别是趋势跟踪、震荡交易、套利交易等，近年来甚至也出现了基于基本面分析数据的[量化模型](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E9%87%8F%E5%8C%96%E6%A8%A1%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLph4_ljJbmqKHlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.HxVJYe9_lB1icGyDwfu2H-g7sm93c1kQ47N24UHPJC8\&zhida_source=entity)，以及带有人工智能性质的神经网络、[遗传算法](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E9%81%97%E4%BC%A0%E7%AE%97%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLpgZfkvKDnrpfms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.kTCt7Io71cXRNbJW9wt3Vs5pjc0bl1PNpbhpjGn7620\&zhida_source=entity)等具备自学习、自适应市场能力的高级交易系统模型。不过，最简单、最实用、最适合普通投资者的交易系统入市设计思路仍然是趋势跟踪，而趋势跟踪的实质就是追涨杀跌或者美其名曰：顺势而为。突破，是趋势跟踪系统设计中最为简洁实用的设计思路，具体应用设计思路可能包括：
>
> ⒈通道突破。最著名的此类程式设计代表作为：[海龟交易法则](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E6%B5%B7%E9%BE%9F%E4%BA%A4%E6%98%93%E6%B3%95%E5%88%99\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLmtbfpvp_kuqTmmJPms5XliJkiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.FbQejH1ZbhVF5IqdSEU3ZxKj-nUeskcyPZc18iYO4PQ\&zhida_source=entity)与四周规则。其入市信号触发设计为：价格突破最近 N 根 K 线的高低点。长期来看，这种设计思路虽然简单，但永远也不会失效或显得过时。事实上，越简单的反而越有效。
>
> ⒉ 均线突破。该设计思路的代表作品有：[克罗均线](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E5%85%8B%E7%BD%97%E5%9D%87%E7%BA%BF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLlhYvnvZflnYfnur8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.6-1h4JexHkSr0od4JKJ8nJfIUYaDN7vcjiHYfs153Eg\&zhida_source=entity)，它由 4、9、18 等三条均线组成；鳄鱼组线，它由 5、8、13 等三条移中平均线组成；[自适应均线](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E8%87%AA%E9%80%82%E5%BA%94%E5%9D%87%E7%BA%BF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLoh6rpgILlupTlnYfnur8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.VfGVDDAXlt5FfPJheMbNNsL0_rkztLqsp09_M1XKI-w\&zhida_source=entity)，它由[考夫曼](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E8%80%83%E5%A4%AB%E6%9B%BC\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLogIPlpKvmm7wiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.aenhWiFyIR2UGtKg8_XD67YHudOapMzosSkrdQA9UDI\&zhida_source=entity)博士提出，以市场效率生成[弹性浮动](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E5%BC%B9%E6%80%A7%E6%B5%AE%E5%8A%A8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLlvLnmgKfmta7liqgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.bVBM07EDs_nx8a7gaLFAj62Lsxmzs4SoYXB3ojSkMY4\&zhida_source=entity)参数，以均线拐头为信号触发。
>
> ⒊ 指标突破。常见的技术分析指标，如 MACD、KDJ、RSI、BOLL、SAR、WR、ADX 等，均可独立构成一个简单的趋势跟踪系统，当然，是使用系统默认参数，还是使用优化参数；是使用其常规用法，还是使用创新用法，可能存在仁者见仁、智者见智的分歧。
>
> \
>
>
> ⒋ 形态突破。形态突破，包括 K 线形态组合突破、[经典技术分析](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E7%BB%8F%E5%85%B8%E6%8A%80%E6%9C%AF%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLnu4_lhbjmioDmnK_liIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.iiQOZJ8dnCLEXwtrBeKNrz-FcSXDgCvUBPNUPpkwrGc\&zhida_source=entity)形态突破等，K 线形态组合的突破，以[酒田战法](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E9%85%92%E7%94%B0%E6%88%98%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLphZLnlLDmiJjms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.ON4QxIbUdRfiNPtYw4pO9N3SxygnSHILknGvy9SjlXg\&zhida_source=entity)为最经典，著名的[红三兵](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E7%BA%A2%E4%B8%89%E5%85%B5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLnuqLkuInlhbUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.gOsxwmYm3Pzkd5RLAbXhWRDZS1wWPKUOuzyyickeNIc\&zhida_source=entity)、黑三兵、[希望之星](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E5%B8%8C%E6%9C%9B%E4%B9%8B%E6%98%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLluIzmnJvkuYvmmJ8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.XzdIr6avtVcvwNbTn4DAynbvzg7FpbuXVQQcIPnsJJ0\&zhida_source=entity)等经典 K 线形态均源于此，共分为酒田战法 70 型。至于经典的双顶、双底、趋势线突破、横盘突破、头肩顶底、[三角形态](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E4%B8%89%E8%A7%92%E5%BD%A2%E6%80%81\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLkuInop5LlvaLmgIEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.KgWeH6IcRYn0Twj_tC_JM84ONtI-v_2wMhFPiR3gAmY\&zhida_source=entity)、楔形、旗形、钻石型、圆弧顶底等技术形态，因普通的模型编写语言较难精确描述而存在一定的设计使用障碍，需要使用转向函数及图形模糊识别技术来克服。
>
> ⒌ 波动性突破。波动性可以定义为：最高价与最低价、当根 K 线的最高价与昨收盘、当根 K 线的最低价与昨收盘，这三组价格差额的最大者即该品种的波动性值，波动性既可以进行横向比较品种间的波动性水平，也可以用于纵向判断价格波动的异常，并作为入市信号的触发器。
>
> \
>
>
> ⒍ 时间价格突破。在趋势行情的必经之路，守株待兔，是我们进行突破系统设计的基本思路。而时间、价格突破，从速度、幅度的两维视角预约了趋势行情，堪称突破系统设计的典范。基本设计思路为价格在 N 时间范围内、上涨或下跌了 N 个点位。进一步拓展思路后，还可以引入周间日、日间时的概念，细化不同时间段的突破标准，以便更好地适应品种个性，此外，还可以时间、价格过滤器的方法来实现对趋势行情的确认，以减少价格盘整阶段的[假突破](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E5%81%87%E7%AA%81%E7%A0%B4\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLlgYfnqoHnoLQiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.vf1icBPYduTCf4gMW2eZ-8W2eFTF4iB_2cJHu2r7Ils\&zhida_source=entity)现象。
>
> 【离市设计】\
> ⒈ 止损。止损，是交易系统模型设计中一个不可或缺的元素，资金止损、技术止损，是两种主要的考虑方案，采用两者孰低的方案可能更为科学。一方面，你要确保每笔交易不冒过大的风险，另一方面，你要背靠一个关键的压力、支撑技术位置，采用反向交易信号作为自动止损的依据，则是持续在市的交易系统模型的一个常用止损方法。
>
> ⒉止盈。虽然固定点位的止盈、止损，也是系统设计中可以采用的方法，但我们更倾向于兼顾利润保护和放大功能的跟踪止盈或 SAR 抛物线止盈模式，随着利润的扩大，而不断抬高甚至收紧止盈目标位置，可以在一定程度上起到利润最大化的设计目标。
>
> ⒊ 时间清仓。以时间为因素考虑离场，无论是作为一种辅助离场方法，还是作为一种独立的出市方法，都是一个不错的思路。比如三根 K 线过后，如果既没有达到止盈位、也没有触及止损位，就主动离场。
>
> \
>
>
> **绩效指标的迷失**
>
> 1、总获利金额 (Net Profit)：
>
> 有没有合理考虑成本？从每笔交易纪录中，推算成本金额，是否合理包含交易税，手续费与滑价损失。另外，换约必然产生的成本，有无考虑？
>
> \
>
>
> 有没有考虑合理执行达标率？讯号产生到实际交易执行成功，之间的滑价，是否合理估计，这包含交易执行的准备时间充不充分，交易单的方式合不合理？
>
> \
>
>
> 多久的交易期间？系统总是有表现好的时后，与表现不好的时候。如果交易期间太短（低于５年），可能只是把表现比较好的一面呈现出来，不具整体代表性。
>
> \
>
>
> 多大的风险代价？如果最大的连续亏损过大（占之前净值高点比例过大），这样的获利报酬的代价是不是可以被接受，如果无法接受，那这样的报酬是无法真正实现的。因为在持续亏损下，早就放弃执行这样的系统，或者，获利之后，又容易回吐殆尽。
>
> \
>
>
> 2、报酬率：
>
> 报酬率期间长度（用多少时间来计算报酬率的分子：盈亏金额）。是年报酬率？还是月报酬率？时间长短不同，累积的报酬率自然不同。
>
> \
>
>
> 取样的期间长度（总交易期间）。是单年的报酬率？还是多年的平均报酬率？与多久的交易期间观念相同。
>
> \
>
>
> 报酬率的基准金额为何（报酬率分母）。起始账户资金为何？资金管理模式为何？有一种报酬率，称为最小账户资金报酬率（ROA）。是用过去最大连续亏损金额（MDD），加上[原始保证金](https://zhida.zhihu.com/search?content_id=4206846\&content_type=Answer\&match_order=1\&q=%E5%8E%9F%E5%A7%8B%E4%BF%9D%E8%AF%81%E9%87%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2MTksInEiOiLljp_lp4vkv53or4Hph5EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0MjA2ODQ2LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.m2ynD0F0CKm4OLszCxcL7ZFrhFUDinC6w73oY_JEG7U\&zhida_source=entity)来当报酬率的分母。这是最大风险下的报酬率。
>
> \
>
>
> 多大的风险代价？若以 ROA 代表报酬率，是必须承受将近百分百的账户亏损风险，才能得到这样的报酬率，并不切实际。每个人的风险承受能力不同，但 100% 的风险承受并不是正常合理的假设。单口系统不易表现出合理的风险报酬率，但可以约略从净值曲线与一些风险报酬进阶指标看出。适当的资金管理多口数系统，可以合理表现报酬率。
>
> \
>
>
> 3、交易频率：
>
> 频率太低，交易次数少，不具代表性。取样期间内应该超过３６笔交易。
>
> 频率太高，交易次数多，执行的精神成本过高。因人而异，每日不超过３笔交易为宜。
>
> \
>
>
> 4、实际绩效与模拟绩效：
>
> 模拟绩效
>
> 一般系统绩效多是以历史数据来仿真的，必须了解系统仿真的原理与假设。因为Ｋ线资料只有４个统计值（开盘价 / 最高价 / 最低价 / 收盘价），所以，必须有所谓的Ｋ线假设（Bar Assumptions），来模拟行情在Ｋ线中的走势，当Ｋ线的时间架构越大（如日线，周线）时，误差就会越大。在 TradeStation 中，即使时间架构是日线，仍然可以用分线，甚至是实际每笔交易纪录，这种用更细微的时间单位（Resolution），来仿真过去交易与绩效，误差就大为减少了。当然，前提是历史的数据必须是存在与正确的。
>
> \
>
>
> 有些仿真程序与 TradeStation 一样，都有所谓的收盘进场讯号，这本来在实际执行交易上，逻辑是行不通的。之前，最后一盘为 5 分钟集中撮合，可以在这 5 分钟内，以市价单来进出场，可以让收盘进场的讯号适用，现在期交所已经取消最后５分钟的集中撮合。另外，有些程序系统参考收盘价，来决定是否收盘进出场，这在仿真程序可以做到，但在实务上，却是无法执行的，也造成了模拟绩效的误谬。
>
> \
>
>
> 实际绩效
>
> 有些人会把实际账户的交易绩效，以交易报告书公布出来。除非是长时间的详细交易纪录，否则，都无法证实是系统完全执行下的结果。
>
> \
>
>
> 有的系统绩效时好时坏，若只能比对短时间，系统与实际账户的绩效，比较难证明系统与实际账户的一致性。
>
> \
>
>
> 如果只是公布账户资金的变动，而没有实际的交易纪录，报酬率也可能是虚胖的。比如，股指多手数系统，可以设定 10% 的总资金风险，来控制交易手数。这时，只要把 10%\~20% 的资金放在保证金账户就可以了，单以保证金账户来看，报酬率与实际总资金报酬率，多了 5 到 10 倍。
