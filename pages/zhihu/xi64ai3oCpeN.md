---
title: 首席质量因子 - Gross Profitability
date: 2024-10-04T15:14:40.613Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/27035653
---
> 分享，帮助你我他。\
> 感谢原文作者：小兵哥（聚宽社区昵称）

首先要感谢 @我爱长颈鹿咕咕 分享的文章 [质量因子选股策略～（感觉挺特别的 “质量” 因子）](https://link.zhihu.com/?target=https%3A//www.joinquant.com/post/6228%3Ff%3Dzhzl%26m%3D27035653)

帖子引用了论文 [QualityInvesting - Robert Novy-Marx](https://link.zhihu.com/?target=http%3A//www.docin.com/p-1377549507.html) 。拜读后，发现大牛已经把历史上知名的质量因子，都详细测试并且做了比较。

其中论文推荐的最佳质量因子是：Gross Profitability，详见论文：\
[The Other Side of Value: The Gross Profitability Premium](https://link.zhihu.com/?target=http%3A//rnm.simon.rochester.edu/research/OSoV.pdf)

对个人而言，Gross Profitability 最突出的优点是：\
1、其收益可以媲美价值因子；\
2、其和价值策略的相关性是 -0.58，刚好和价值策略可以配对使用，天生的对冲、轮动，平滑曲线。

算法也比较简单：\
gross profits ratio = (revenues minus cost of goods sold, REVT - COGS) scaled by assets (AT)

用大白话讲，就是：（收入 - 成本）/ 资产（是 assets，不是股东权益 equity）。\
考虑了毛利率、资本杠杆和周转率。用来寻找高毛利、低财务杠杆、高周转率的好公司。\
具体实现见回测，看着那稳定的超额收益，幸福满满。

再次感谢 @我爱长颈鹿咕咕 分享的论文，又找到了一个好的因子。感谢。

实现分 7 步，前 5 步是常规做法：\
1、选取市值最大的 80% 股票；\
2、选取市盈率最小的 40% 股票（剔除负值）；\
3、选取市净率最小的 40% 股票（剔除负值）；\
4、选取市收率小于 2.5 的股票；\
5、取 1-4 的交集；\
6、按照 GP\_ratio 从大到小排序\
7、剔除 ST、停牌、涨停板股票后买入。

![](https://pic3.zhimg.com/v2-d4ed1e47d74e057678b7b1619470fd6a_b.png)

到 JoinQuant 查看**策略源码**，并与作者交流讨论：[首席质量因子 - Gross Profitability](https://link.zhihu.com/?target=https%3A//www.joinquant.com/post/6585%3Ff%3Dzhzl%26m%3D27035653)
