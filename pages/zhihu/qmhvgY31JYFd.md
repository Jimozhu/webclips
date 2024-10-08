---
title: 可转债系列文章（六）可转债的计算公式
date: 2024-10-04T15:13:50.730Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/132455652
---
> 本系列文章献给亲爱的女朋友 ，感谢她一路以来的鼓励。如果不是她，这个系列的文章不知道要等到什么时候才会跟大家见面。\
> \
> 整个系列分为 10 个章节，从可转债初印象，到可转债打新实战，再到可转债的套利，都会涉及。如果认可，让你的男 / 女朋友一起学习可转债呀。

给你看一个图，和下面的截图不同的是，此图有正股价格，以图里的振德转债为例：

![](https://pic2.zhimg.com/v2-0ca623c1a12bc3af19935f2230578673_b.jpg)

* 可转债市价（A）：193.070，新债 100 元一张，随市场波动。
* 正股价格（B）：49.50，上市公司的股价，随市场波动。
* 转股价格（C）：20.040，需计算。根据正股价制定的一个价格，是债券转换成股票的依据，长时间不会变动。
* 转股后的价值（D）：247.010，需计算。
* 溢价率（E）：-21.84%，需计算。

***

## 基本指标

### 01 转股价值 D

计算公式：

```text
1 张可转债转股后的价值 = 100 / 转股价 * 正股价
```

D = \frac{100}{C} \times B

解释： \frac{100}{C} 表示 1 张可转债可换的股数，新债价格为 100 元，所以分子为 100，无论可转债价格如何变化，分子都是 100。

振德转债的转股价是 20.040，正股价为 49.50，所以转股价值为：

D = \frac{100}{20.040} \times 49.50=247.010

### 02 溢价率 E

计算公式：

```text
溢价率 = 可转债市价 / 转股价值 - 1
```

E = (\frac{A}{D} - 1 ) \times 100\\%

振德转债的可转债市价是 193.070 元，转股价值为 247.010，所以溢价率为：

E = (\frac{193.070}{247.010} - 1 ) \times 100\\%=-21.84\\%

***

## 新债指标 - 用于「抢权」

* 可转债上市当天的价格（F）
* 每股配售数 G
* 所需股票数量 H
* 安全垫 I

### 01 所需股票数量 H

【风险很高】投机做一天上市公司股东，就能获得优先配售，百分百中签，1 手可转债需要买多少股才够？

发行可转债之前，上市公司都会发布相应公告，包含了一条非常关键的信息：每股配售价格。

以盛屯矿业为例，每股配售为：1.033 元，理论上要配售 1 手，价值 1000 元，就需要 969 股。

以上是正常情况，以下是精确行为。

> 由于多数股东账户存在不足配售一手 / 张的零碎股，按照精确取整 (可配＞0.5 手 / 张) 对零碎股从大到小，再按申请配售的进行分配

说人话就是，有的人股票只有 800 股，700 股，都没有到 1000 股，那么这些人持有的股票就被称作零碎股。可转债的发行公告里也对这些零碎股的处理：从大到小排列，然后按照申请配售的循环分配，直到分配结束。

所以，「一手党」只需要买进理论股数的一半，就可以获得优先配售一手可转债的资格。

计算公式：

H = \frac{1000}{G} \times \frac{1}{2}

可以算得 H 为 484.5 股，由于 A 股的购买单位是 100 股（1 手），所有最起码要持有 500 股正股。

H = \frac{1000}{1.033} \times \frac{1}{2}=484.5\approx 500

注意：股票的 1 手是 100 股，可转债在沪市 1 手是相当于深市 10 张，所以可以说可转债 1 手等于 10 张，每张 100 元。

### 02 安全垫

抢权需要经受一天的股价波动风险（严格来说不止一天，应该是三周以上），因为我们申购可转债是 T 日；抢权提前一天，T-1 日买入上市公司的股票；T + 21 天左右可转债上市。

所以抢权存在着很大的不确定性。安全垫也只是基于目前公司的股价，做出的预测。抢权不适合普通人。

「安全垫」可以理解为可转债上市以后获得的收益，能够支撑上市公司一天的股价最大跌幅。如前文所说，实际卖出可转债还需要 3 周，所以安全垫并不安全。

计算公式：

I = \frac{(F-100)\times10}{H \times B} \times \frac{1}{2}

还是以盛屯矿业为例，假如上市以后可转债价格为 120 元，中一签能够获得 200 元利润。每股利润为 200/1000=0.2，T 日盛屯的股价是 4.79 元，那么安全垫为 0.2/4.79 = 4.17%。如果 T-1 日抢权了，T 日公司的股价跌幅小于 4.17%，即为抢权成功。

I = \frac{(120-100)\times10}{500 \times 49.50} \times \frac{1}{2}=4.17\\%

***

## 旧债指标 - 用于「玩旧」

「玩旧」有两种策略：

* 低价格、到期收益率高（风险较大）
* 低价格、溢价率低（双低策略，风险较小）

这个部分需要结合这个图，和上面那个图不同的是，多了「到期收益率」的计算公式。

![](https://pic4.zhimg.com/v2-3452bcb9822979b1ba652ef1b29da703_b.jpg)

### 到期收益率

到期收益率（Yield to Maturity, YTM）使债券上得到的所有回报的现值与债券当前价格相等的收益率。

说人话就是，未来本金加利息，拿到现在来比较，可不能比现在的价格还高啊，要不然等了几年没有赚不说，还亏了。

到期收益率有两个指标：

* 税前收益率（年化）
* 税后收益率（年化）

税前收益除去该缴纳的税（到期赎回价超过 100 元的部分要交 20% 的税），就是税后收益。

&#x20;**我们「玩旧」只需要关心税前收益率即可。**  计算这个收益率，首先假设存在一个年化收益率，可以让可转债增值，同时产生的利息也会增值，也就是复利。

有一个年化收益率，去算得未来能有多少利息很容易，用复利公式计算一下就可以了。反过来计算就有有点麻烦了。

如果要计算这个年化收益率，就把每一年末的现金流折现，结果等于当前的可转债价格，然后近似迭代计算。

**所以，整个过程其实就是在计算内部收益率，也就是刚刚回本的折现率**。

> 折现率 (discount rate) 是指将未来有限期预期收益折算成现值的比率。

PV = \frac{C}{(1 + r)^{t}}

> r = 折现率，\
> PV = 现值（present value），\
> C = 期末金额，\
> t = 投资期数

集思录网站上的税前 YTM 计算公式：

> 2.50/(1+x)^4.770 + 1.80/(1+x)^3.770 + 1.20/(1+x)^2.770 + 0.80/(1+x)^1.770 + 0.50/(1+x)^0.770 + 118.000/(1+x)^5.770 - 193.0700 = 0

整理以后，可以看到以下公式，其中的 x 就是我们想知道的。

![](https://picx.zhimg.com/v2-7c3a53133ee3d5253e817cd1deaca661_b.jpg)

0.5 是第一年的利息所得，实际所剩时间 t 对应 0.77 年；0.8 是第二年的利息所得，实际所剩时间 t 对应 1.77 年，以此类推... 最后一年是直接用赎回价格 118 直接计算。

我们都知道，用 excel 表计算稳定现金流的内部收益率，应该使用函数 IRR。而从上面的公式可以看到现金流是不稳定的，所以应该使用函数 XIRR。

> XIRR 反映一组现金流的内部收益率，这些现金流不一定定期发生。

最终计算得到 x = -7.42%，即到期收益率。

***

欢迎大家关注微信公众号：**kurryluo**

不仅有科研，还有创业经验、理财知识

个人网站：[http://www.kurryluo.com](https://link.zhihu.com/?target=http%3A//www.kurryluo.com/)

各个分享平台的 KurryLuo 都是在下。

用心学习，认真生活，努力工作！
