---
title: 可转债投资手册（三）--可转债估值与交易
date: 2024-10-04T15:14:07.253Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/31300823
---
&#x20;**可转债具有债性与股性，对于投资者来讲，它本身是债券与看涨期权的结合体。** 那么它的估值就分两部分，一部分是对于其债券部分的估值，我们称之为 “纯债价值”，另一部分是对其期权部分的估值。

但是可转债除了有转股权之外，一般还具有赎回权，回售权和向下修正条款，因此一个完整的可转债价值公式理论上应该是这样的：

&#x20;**可转债价值 = 纯债价值 + 转股看涨期权价值 + 回售看跌期权价值 - 赎回看涨期权价值 + 向下修正选择期权价值。**&#x20;

可转债与股价的关系

![](https://picx.zhimg.com/v2-bd111dd52ad796e06371ae5086694f6d_b.jpg)

了解了以上估值基本原理，我们就可以通过 B-S 模型对可转债进行理论估值，现在市面上计算可转债的程序也大体都如下所示（下面是 wind 自带的可转债定价模型），只要输入相关参数就会出计算结果。因此可转债的纯债价值与期权价值的估值不再赘述。（如果你真对这个估值公式要深究到底，可以后台留言，我把资料发给你）

![](https://pic4.zhimg.com/v2-4b581302b6f9ab94ec59c48a493401d9_b.jpg)

如果你依照上述公式去交易可转债，恭喜你，你进阶到 “高级韭菜” 了。这是因为当前市场上无论那种定价模型都无法很好的刻画可转债的真实价值。 **当前模型基本上都依赖 “股价几何布朗运动、股价正态分布” 和 “期权可对冲复制” 这两大假设。** 而很不幸的是，这两个假设均存在问题，尤其是我国卖空机制还十分不健全。 **因此对于真正以获利为主要目的的交易者来讲，传统定价模型可以说一无用处！**&#x20;

那么我们如何来判断与交易可转债呢？

&#x20;**作为交易者来讲，盈利模式决定操作思路，而市场环境决定盈利模式。**&#x20;

当前市场环境是什么呢？

> \-- 可转债估值普遍偏高；\
> \-- 由于缺乏个股做空对冲机制，抢权配售风险巨大，套利无法进行。\
> \-- 靠网上打新参与配售连塞牙缝多不够

&#x20;**那么，作为 A 股市场交易者来讲，留下的盈利模式只有一种：正股上涨驱动转债价格上涨，因此买入可转债的唯一理由就是预期它内嵌的期权价值将大幅上涨，而期权价值的大幅上涨需要正股价格的驱动。**&#x20;

&#x20;**这样的盈利模式决定了对正股的方向判断起决定性作用！**&#x20;

那既然这样，我们直接去炒股票不就完了？还听你在这瞎掰？！

作为一个可转债交易者，与股票交易者看待股票最大的不同在于我们应当看到可转债发行人促进转股的能力、意愿的重要性。因此，我认为， **决定可转债价格的关键因素是发行人想不想转股，能不能转股的问题。**&#x20;

促进转股的能力与意愿：

转债发行人基本上都有很强的促转股意愿，都希望可转债早早转股，实现最终 “债主变股东” 的目的，解释见前文*[可转债投资手册（一）-- 四大条款及估值基础](https://link.zhihu.com/?target=http%3A//mp.weixin.qq.com/s%3F__biz%3DMzA5MzUxNzc0Ng%3D%3D%26mid%3D2650421104%26idx%3D1%26sn%3Df9ccc19e3a9cd26e37208e1a3cbe2e67%26chksm%3D885235adbf25bcbb8985fe67fce7612a751a3b6b93163bd6400db7b65f536096c14fd45650bf%26scene%3D21%23wechat_redirect)*（点击查看）。 **而促进转股主要看发行人实力。这样来看，好股票就是好转债。**&#x20;

另外，还有一部分发行人能力不够，但是转股意志坚定，那就通过转股价修正等促进转债转股，这一点正股并不具备，这样就出现了 “差公司、好转债”。

同时，剩余期限不长的转债发行人促转股的迫切性也日益加强，费了那么大力气发了债，不能眼看着大好机会溜走，这时 “没有机会创造机会也要上”！也往往容易产生 “差公司，好转债”。

做个总结：

1. 作为交易者来讲，首先要搞清楚的是可转债的低价，这是你做投资的安全边际，这个可用债券的估值公式来计算。
2. 通过研究公司基本面判断发行人实力，好公司就是好转债。
3. 通过研读可转债的四大要素判断发行人的转债意愿的强度，强度越高，可转债越好。具体见前文*[可转债投资手册（二）-- 可转债读心术](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s%3F__biz%3DMzA5MzUxNzc0Ng%3D%3D%26mid%3D2650421112%26idx%3D1%26sn%3Ddef2f2a036e2f5b04b6de962c3475595%26chksm%3D885235a5bf25bcb346d46e2b13c1c7db0adac239e2ed56cc94720371d288e5e51499ed51ec0c%26scene%3D21%23wechat_redirect)*（点击查看）
4. 可转债的剩余期限，期限越短，转债愿望越强，同时正股的波动率如果在此时增大，则就越是好转债！
5. 从绝对价位上看，145 元甚至 140 元以上，面临赎回压力的转债就已经进入逢高兑现阶段，此时你应该做的就是抛出，全部抛出！

以上这些是作为一个 A 股可转债交易者所考虑的要点，也是评估一支可转债价值的要素，有些可以量化，有些无法量化，交易本该如此。【end】
