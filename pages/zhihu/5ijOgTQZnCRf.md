---
title: 一种经过优化的ETF网格交易策略
date: 2024-10-04T15:13:50.746Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/340892634
---
在基金市场兜兜转转玩了四五年了，临近年底，最近也在反思这几年的得与失。有一个比较重要的问题相信很多人都能感同身受 —— 明明模拟盘跑的好好的，但是实际赚不到钱的大有人在。总结了一下，普通人在实际操作时往往会犯以下两个错误，要么是过于谨慎在指数快速拉升的时候只买了半仓（没错这说的就是我），要么就是中途忍受不了回撤，草率离场。归根结底，这都是由于策略和执行之间的断层所带来的损失。

近年来，有些大 V 说可以设置基金自动定投来打败市场，但是根据我的亲身经历，如果你有十万以上的初始资金，那么定投并不适合你 —— 定投策略在已投入部分的年化收益确实还不错，但是其他资金都是闲置的（尤其是在定投初期），如果要算整体的年化收益那可能就会惨不忍睹。对于没什么积蓄的上班族来说，定投可以帮助养成储蓄的习惯，顺便赚点零花钱，但是对于那些想靠资本市场进行财富稳定增值的人来说，需要寻找定投之外的好策略。

思来想去，觉得程序化交易才是唯一的破解之道。网格策略是比较适合程序化交易的，策略简单，稳定性强，在震荡行情中表现很好。之前我曾经有想过执行网格策略，但是每天盯盘真的太不现实了 —— 我相信大部分普通人都做不到 —— 所以也就搁置了这个想法。不过最近，我偶然发现很多券商都推出了网格交易的 API，比如华泰证券，华宝智投等等，都支持自动化下单（见下图），尝试了一个月之后感觉不错，就顺手写了个策略，并在聚宽上跑了一下回测。

![](https://pic2.zhimg.com/v2-1e12cdea7127adff8b897342cc027001_b.jpg)

传统的网格交易策略是下跌时补仓，上涨时收割利润，比如下跌 5% 的情况下买入 5000 份，上涨 5% 的时候再卖出 5000 份，循环往复。之前说过，这种策略比较适合反复震荡的行情，但同时也意味着很容易在单边上涨的行情中过早卖出，因此，在实际操作时往往需要增加一些 Trick。测试标的以及相应结果如下：

目标指数：券商 ETF，代码 512000（因为网格交易比较适合波动性高的指数）

策略回测时间：2016 年 12 月 1 日～2020 年 12 月 1 日

基准收益：不做任何操作的券商 ETF 指数（相当于一开始满仓买入并持仓不动）

如下图所示，本策略不仅在震荡阶段能够保持网格交易策略的优越性，而且在大涨的情况下也能够有较好的表现：

![](https://pic3.zhimg.com/v2-3fc44a4b0d39fb5f6dd5f58534ea0f94_b.jpg)

详细的参数设置如下：

总资金 10w，网格交易的初始底仓根据大盘指数来确定，指数越低，初始仓位可以适当加大。设置初始底仓的 Python 代码我贴在下面了，相信有过基础编程经验的人都能看懂。2016 年 12 月 1 日的大盘指数位于 3100～3300 区间内，所以回测的初始底仓是 5w，也就是总仓位的 1/2。

![](https://pic3.zhimg.com/v2-ec8b9cec5c4ebc435f09f7691a6dfeaa_b.jpg)

网格的大小（下面代码里的 bench\_buy 和 bench\_sell）是根据上一个交易日的大盘指数来调整的，其大致理念为：当指数在低位时，下跌网格比较小，上涨网格比较大，避免在行情单边拉升时过早卖出；反之，在指数处于高位时，上涨网格较小，下跌网格较大，以此减少下跌所带来的利润回撤。每个网格的买卖份额均为 15000 元。以上参数都是用于测试，具体的设置可能还有进一步的调整空间。

![](https://pic4.zhimg.com/v2-b0b3ed130fedc90a41eaf523b52f94e9_b.jpg)

看回测表现，这个策略可以在近四年获取 37.09% 的收益，超过了基准 11.65% 的三倍，不仅保留了网格交易算法在震荡行情中的优势，而且在两次大幅拉升的行情中也有不错的表现。

最重要的是，这个策略

不用盯盘！

不用盯盘！

不用盯盘！

真的是太适合我这种懒人了。

当然了，这个网格交易算法目前还只是初步测试，其参数还需要经历实盘的检验和优化，欢迎各位进一步交流 / 讨论 / 改进。
