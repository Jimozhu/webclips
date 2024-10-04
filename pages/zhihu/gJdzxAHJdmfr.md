---
title: 股价变动的分解公式：估值 + 经济状况 + 企业盈利水平
date: 2024-10-04T15:14:07.747Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/36784145
---
前段时间在 WSJ 的专栏里看到一个股价变动的分解图示觉得很有意思。如下图：

![](https://pic2.zhimg.com/v2-8f6906250d49d26f97bf6f1c3034a341_b.jpg)

S\&P 500 指数的变动，按照贡献：灰色部分为预估市盈率，黄色部分为企业收入，绿色部分为企业预估净利润率

如上图，可以把 S\&P 500 指数自 09 开始的增长按照贡献拆解成三个部分的变化：

1. 预估市盈率的变化
2. 企业收入的变化
3. 企业预估净利润率的变化

其中预估市盈率主要反映了市场对于股票的估值水平。而企业收入与经济体的整体状况关系最大。相较于净利润，企业收入可以被会计操控和企业资本结构所影响的可能性较小，本身也更平滑，一篮子有代表性的企业的收入水平变化能够反映整个经济体的增长。而企业的净利润率则体现了企业的盈利水平，受信贷周期和供求关系的影响较大，也是大部分投资者最关心的企业基本面指标。按照这个理解，也可以把上述的拆解直观理解成：

\text {股价变化}\\% = 估值水平 \\% + 经济增长 \\% + 企业盈利水平 \\%

要得到上述的变化只需要对下面的恒等式进行变换：

\overbrace {P\_t}^{\text {股价}} = \underbrace {\frac {P\_t}{E\_{t+1}}}\_{\text {预估市盈率} } \overbrace {\times R\_t}^{\text {企业盈利}} \times \underbrace {\frac {E\_{t+1}}{R\_t}}\_{\text {预估净利润率}}

对上述公式两边取 \log 即得到：

\log P\_t = \log{ \frac{P\_t}{E\_{t+1}}} + \log R\_t + \log \frac{E\_{t+1}}{R\_t}

由于 log {P\_t} \approx \Delta P\_t / P\_t ，对其他各项进行同样的逼近即可以得到股价的变动率 \Delta P\_t / P\_t 可以拆解为：

\Delta P\_t \\% = \Delta\left(\frac{P\_t}{E\_{t+1}}\right) \\% + \Delta R\_t \\% + \Delta \left( \frac{E\_{t+1}}{R\_t} \right)\\%

这个分解公式可以对各类股票指数或是某个产业的股票进行分解。直观上更能反映出股价变化的内生原因。如上图中可以看出 S\&P 500 的增长主要来自于股票估值水平和企业盈利水平的上升，经济体本身的增长的贡献并不大。这对于某些投资者来说是风险信号。因为估值水平可以很快变化，而企业盈利水平可以受到多方面的操控 —— 比如说，企业在量化宽松期间进行了大幅度的企业杠杆操作。这些都是潜在的风险。反过来说，如果股价的下跌主要是由于估值水平引起的，那么对于有些投资者而言，则可以视为买入信号。

相较于仅仅通过市盈率 (PE) 来衡量股票市场的变动是否合理，上述的拆解同时考虑了经济体的基本面和企业的基本面的变化。虽然三者经常一起联动，但是估值水平主要反映了投资者的心理，不理性的因素更大。

原文链接：

[After Nine Years, How Long Can This Bull Live?](https://link.zhihu.com/?target=https%3A//www.wsj.com/articles/after-nine-years-how-long-can-this-bull-live-1520534063)