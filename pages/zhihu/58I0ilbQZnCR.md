---
title: 一种新型的网格交易法则
date: 2024-10-04T15:14:57.200Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/26030622
---
本文作者： chengye

原文链接：[研讨室 | DigQuant 专业量化研究社区](https://link.zhihu.com/?target=http%3A//www.digquant.com.cn/forum.php%3Fmod%3Dviewthread%26tid%3D38%26extra%3D)

\


**1. 趋势型网格交易法则**

本文提出的此种趋势型网格交易法则是一种集成了出场规则的资金管理手段，可以配合各种入场条件，如：双均线入场、通道突破入场等等。

趋势型网格交易法则的规则：

（1）将资金分为 10 份

（2）达到入场条件（做多或做空），使用一份资金入场

（3）以做多为例：设置中线（等于入场价），按着一定规则（如：止损线 = 0.9 \* 入场价）浮动止盈线和止损线，一般来说，（浮动止盈线 - 中线）=1.1\*（中线 - 止损线）

（4）当后续的股价触发止损线，所有资金平仓出局

（5）当后续股价触到浮动止盈线，将中线上移到浮动止盈线，同时根据此时的中线计算新的止损线和浮动止盈线，与此同时，加码一份资金

（6）重复（5），直到达到条件（4），平所有仓位

![](https://pic2.zhimg.com/v2-b57a3639be95a86b3f3c561b568ea4ff_b.png)

\
\


一图胜千言！途中红色箭头表示买入，绿色箭头表示卖出，白色线是中线，红色线是浮动止盈线，绿色线是止损线。中线、浮动止盈线和止损线随着股价的波动动态地调整。

这种资金管理方式、或者说出场规则，在震荡市的时候损失很少，一般只有 10%\~20% 的仓位，但在牛市的时候（有趋势），仓位会慢慢放大，跟随趋势获得更高的收益！

**2. 在 IF 股指期货上的测试**

回测标的：IF888 5 min 数据

策略规则：

共 10 份资金

入场：以前一日收盘价上下 0.5\*ATR 为上下轨，突破上轨做多一份资金，突破下轨做空一份资金

加码与出场规则：采用趋势型网格交易法则（具体规则如第 1 部分所示）

回测效果：震荡市基本不亏钱，趋势市（不论多空）资金曲线都快速上涨

由 Auto-Trader 提供回测报告：

![](https://pica.zhimg.com/v2-57c3801d7a569b94dde6c37f78fade72_b.png)

\
\


**3. 总结**

本文提出了一种趋势型的网格交易法则，着眼于资金管理和出场规则，可以配合不同的入场规则。此种交易法则输入趋势型交易策略，在趋势市可以抓住趋势，加大仓位获得高收益，在震荡市减小仓位，控制亏损。
