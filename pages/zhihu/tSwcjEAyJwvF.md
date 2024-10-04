---
title: 多因子小技巧整理
date: 2024-10-04T15:14:56.830Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/26671452
---
看知乎上很多矿友一直在讨论如何挑选因子、使用因子进行预测。

找了一下社区的相关帖子，做个整理。

## 1.[因子那么多，怎么用才有效？](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/579ae6f5228e5ba28e05fe03)（剔除多重共线性）

本文从因子的相关性入手，用不同因子组合、剔除高度相关因子后再进行降维处理，利用所得各风格信号预测股价走势。

将因子按照风格或经济学含义不同分为**收入因子、规模因子、技术因子**等组合；计算各组合内部因子的相关系数，在高度相关的因子中挑选代表因子留下，其余剔除，保证各组合中剩余因子相关性不高；采用主成分分析法，计算能够代表各因子组合的第一主成分；利用上一步计算所得的各个因子第一主成分预测股票价格走势。

![](https://pic3.zhimg.com/v2-904057453dcc6d8d85a3a823e69386cc_b.png)

![](https://pic3.zhimg.com/v2-f8aa9d6c46c94462b968927315de956a_b.png)

## 2.[多因子 — 我们来玩排列组合](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/57a890d0228e5b9b98a88f6c)（几因子组合才是最佳）

\


国信证券，选择了 23 个因子，通过穷举的方法组合构建了 23 个单因子模型、253 个双因子模型、347 个三因子模型、520 个四因子模型以及 300 个五因子模型，通过分析他们的历史表现，得出**因子边际效用递减**的结论。

本文依据该研报依据因子区分度与贡献度的概念，对列举的因子进行筛选，选出排名最前的 5 个因子。以选取的 5 个因子为例，进行排列组合，构建这些因子的单因子模型、双因子模型以及三因子模型，比较分析它们的回测情况。

\


* 因子贡献度的思路是将股票池中的股票按因子进行排名，分别选出排名靠前的 20% 和排名靠后的 20% 股票构成两个组合。两个组合的收益率相差越大，则说明该时点此因子的强度越高。

选出了，RSI、LCAP、PB、ROE、NetProfitGrowRate 这 5 个因子

1\. 单因子模型回测：

![](https://pic2.zhimg.com/v2-f963343701df0a80b9fe6b9ceb713bb5_b.png)

2\. 双因子模型回测：\


![](https://pic2.zhimg.com/v2-9dcdec1dc7959f6285d60287d4b5218f_b.png)

3\. 三因子模型回测\


![](https://pic3.zhimg.com/v2-390be65cc323380fa6b4cc9c0d3059b4_b.png)

\
**各因子模型横向比较**

![](https://pic2.zhimg.com/v2-a461a5e58b31eec97386c216c2b55cc3_b.png)

## 3.[工具\_因子筛选，因子高低频，因子贡献度](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58fc64674a34b00055f07899)（如何挑选适配期的预测因子）

\


优矿提供了大量因子，但怎么用这些因子才合适，在使用中哪些因子适用短期预测，那些适用长期，本文给出了一个解决方法**用相对高频的数据预测低频数据**。

如何区分因子属于长期因子还是短期因子

* 长期因子：随价格缓慢变动，所以变化更慢，平缓，理论上应该更低频率（长波）
* 短期因子：随价格迅速变动，所以变化更快，陡峭，理论上应该更高频率（短波）

\


如何区分长短波

总结下，有 3 点

1\. 方差，如果连续信号方差应该较小（实际还可能和波动幅度有关）

2\. 均值交叉点，曲线按照均值平移，均值为 0 轴，交点多少可以反映出频率大概情况。实际是因子做 diff 然后计算反转个数替代。

3\. 相关系数 （这里没做考虑）

\


**方差**

1\. 因子先做差分 diff

2\. 差分后因子在一定时间内的 “相对均值标准差 = 标准差 / 均值” 作为频率的衡量

3\. 如果频率高于价格 closeprice 对应的频率，就认为比基准更高频，可以使用

4\. 如果低于 closeprice 频率，认为因子属于长期因子，不适用短期预测

\


**交叉点法**

1\. 对因子做差分 diff（后面的因子都是指差分后的）

2\. 差分后因子相邻的两天，如果有正负变化，认为有一次交叉

3\. 统计周期内 closeprce 的正负变化次数为基准，差分后因子次数，如果因子高于 closeprice 基准则认为高频，可以采用。否则不用

\


第一种方法找出 76 个短期因子，第二种方法找出 95 个短期因子。

取交集后有 76 个因子，都是方差法得到的

\


\['CMO', 'PVT6', 'EMV6', 'TRIX5', 'DIZ', 'MA10RegressCoeff6', 'DIF', 'MTM', 'TEMA10', 'ACD20', 'MA10RegressCoeff12', 'KDJ\_D', 'BIAS20', 'BR', 'MTMMA', 'DEA', 'EMA12', 'ChandeSU', 'KDJ\_K', 'ARBR', 'PLRC6', 'TRIX10', 'SwingIndex', 'PVT', 'Elder', 'SRMI', 'VDIFF', 'BIAS60', 'APBMA', 'CCI5', 'CR20', 'RC24', 'PVI', 'OBV', 'DownRVI', 'DBCD', 'BearPower', 'CCI88', 'JDQS20', 'BIAS5', 'VDEA', 'AD', 'EMA26', 'TVSTD6', 'STM', 'ADTM', 'ACD6', 'KDJ\_J', 'Ulcer10', 'CCI20', 'TVSTD20', 'PLRC12', 'AR', 'BullPower', 'DIFF', 'AroonUp', 'ASI', 'BollDown', 'ROC6', 'CoppockCurve', 'ChaikinVolatility', 'TEMA5', 'BIAS10', 'ROC20', 'DDI', 'ADXR', 'EMV14', 'plusDI', 'ChaikinOscillator', 'Hurst', 'CCI10', 'KlingerOscillator', 'Aroon', 'TVMA6', 'RC12', 'NVI'])

简单的看几个

CMO：钱德动量摆动指标（Chande Momentum Osciliator），与其他动量指标摆动指标如相对强弱指标（RSI）和随机指标（KDJ）不同，钱德动量指标在计算公式的分子中采用上涨日和下跌日的数据。属于超买超卖型因子。

PVT6：因子 PVT 的 6 日均值。属于趋势型因子

EMV6：简易波动指标（Ease of Movement Value），EMV 将价格与成交量的变化结合成一个波动指标来反映股价或指数的变动状况，由于股价的变化和成交量的变化都可以引发该指标数值的变动，EMV 实际上也是一个量价合成指标。属于趋势型因子

**文中采用方差法做成一个工具**

给出希望的周期，输出适合此周期的因子列表（其实是比此周期高频因子）

注意：**由于方法返回的是频率高于 cycle 对应均线的频率，使用时可能 cycle=5 得到的结果中去掉 cycle=5*****3=15 的结果**。 *虽然严格来说高频信号会影响低频信号（昨日价格也会影响 20 日均线走势），但是力度很弱。

所以感觉比较合理的是 适合 5 日周期的因子*=getSuitFactor(cycle=5)-getSuitFactor(cycle=5*3)-getSuitFactor(cycle=int(5/3))

## 4.[测算近期的最强因子](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58eb1e45e4ebdb005367ccb8)（如题）

\


一个工具包，把各因子按照最高最低 1/10 排列，每 5 天进行一次调仓，来测算近一段时期的有效因子情况，按周、半月、一月、一季度、近半年、近一年分别排序。

\


![](https://pic2.zhimg.com/v2-219e60dae08021673ba0a65c019b6cb3_b.png)

\


![](https://pica.zhimg.com/v2-426c20706ecb294e3c3c28daa02ff3b8_b.png)

![](https://picx.zhimg.com/v2-283f1d0737bd33cc5b034739290d8773_b.png)

## 5.[利用 Quartz quick\_backtest 参数调优](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/583802b4228e5bb6228d5a95) （大批量测试因子）

演示如何利用 quick\_backtest 把大量的因子进行批量的测试

按照 IR 排序

![](https://picx.zhimg.com/v2-3146b0d978bae12014402a4ae9d156dd_b.png)

画出具体因子的对冲后累计收益图：\


![](https://pica.zhimg.com/v2-cd5b0484d381573d5a9acfc0b2b9d6b4_b.png)

## 6.[MultiFactors Alpha Model - 基于因子 IC 的多因子合成](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/57eca10d228e5b3663fac5a0) （多因子合成）

找到了因子，如何进行组合也是需要解决的问题。本文利用 [AlphaHorizon](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/57dfe5e4228e5b049afb9e57%3Fsource%3Dcommunity) 研究了几个常见因子，并初步尝试了多因子的组合（采用 QEPM 中的**最大化因子 IC\_IR**的优化方法）；进一步回测了多因子合成的选股因子。

因子数据均进行以下处理：

* winsorize，去极值

* neutralize，中性化，消除行业和风格因子等的影响
* standardize，标准化
* orthogonalize，残差正交化调整，因子间存在较强同质性时，使用施密特正交化方法对因子做正交化处理，用得到的正交化残差作为因子

\
\


使用多因子等权合成新因子，单纯做多因子最大的 20% 股票组合，年化收益率 32.0%，阿尔法 27.2%，信息比率达到 3.79；多头组合对冲中证 500 指数后年化收益 27.0%，最大回撤仅 5.8%；

**在使用 QEPM 中的最大化因子 IC\_IR 的优化方法组合多个因子后，能够明显提升因子选股的稳定性，信息比率达到 4.0，对冲指数后最大回撤仅 4.4%**；

原文链接：

[因子那么多，怎么用才有效？](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/579ae6f5228e5ba28e05fe03)[多因子 — 我们来玩排列组合](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/57a890d0228e5b9b98a88f6c)\
[工具\_因子筛选，因子高低频，因子贡献度](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58fc64674a34b00055f07899)\
[克隆！测算近期的最强因子](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58eb1e45e4ebdb005367ccb8)\
[利用 Quartz quick\_backtest 参数调优](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/583802b4228e5bb6228d5a95)\
[MultiFactors Alpha Model - 基于因子 IC 的多因子合成](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/57eca10d228e5b3663fac5a0)
