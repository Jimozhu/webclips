---
title: 震惊！数字资产量化交易还可以有这种操作（2）-包含交易成本的三角套利策略
date: 2024-10-04T15:14:40.415Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/28179116
---
上篇给大家介绍了一下[三角套利的原理](https://link.zhihu.com/?target=https%3A//wequant.io/blog/triangular-arbitrage-1/)，发现大家的热情是如此高涨，都在喊着要代码和下半段。呐，我们 WeQuant 毕竟是以用户第一的产品，所以，加班加点把下半段赶出来，就问你们感动不感动！话不多说，开搞！

## 一、考虑交易成本情况下的策略调整

我们以第一个策略（正循环套利\_挣 CNY 策略为例）。

![](https://pic4.zhimg.com/v2-47a0f50306c569996caa74c5debeaaf5_b.png)

图：正循环套利（挣 CNY）策略示意图

我们设计的套利策略是被动套利策略，具体来讲，我们在 LTC/BTC，LTC/CNY，BTC/CNY 三个市场上都是作为 taker 去吃单。

在 LTC/BTC 市场上下买单，就必须使用该市场的卖一价格 (ltc\_btc\_sell1\_price) 加上一定的滑点 (ltc\_btc\_slippage，以百分比表示) 来作为买单价格，即：

```text
P3 = ltc_btc_sell1_price*(1+ltc_btc_slippage)
```

同理，在 BTC/CNY 市场下买单，就必须使用该市场的卖一价格（btc\_cny\_sell1\_price）加上一定的滑点（btc\_cny\_slippage，以百分比表示）来作为买单价格，即：

```text
P1= btc_cny_sell1_price*(1+btc_cny_slippage)
```

同理，可以推导出在 LTC/CNY 市场下卖单的价格如下：

```text
P2 = ltc_cny_buy1_price*(1-ltc_cny_slippage)
```

假设各个市场的费率情况如下（以百分比表示）：

```text
LTC/BTC: ltc_btc_fee
BTC/CNY: btc_cny_fee
LTC/CNY: ltc_cny_fee
```

在 LTC/BTC 市场净买入 1 个 LTC，实际上需要买入 1/(1-ltc\_btc\_fee) 个 LTC，其中的 ltc\_btc\_fee 比例部分，是被交易平台收走的手续费。买入 1/(1-ltc\_btc\_fee) 个 LTC 需要花费的 BTC 数量是:

```text
ltc_btc_sell_1_price*(1+ltc_btc_slippage)/(1-ltc_btc_fee)
```

在 LTC/CNY 市场，卖出 1 个 LTC，得到的 CNY 是:

```text
ltc_cny_buy_1_price*(1-ltc_cny_slippage)*(1-ltc_cny_fee)
```

在 BTC/CNY 市场，净买入

```text
ltc_btc_sell_1_price*(1+ltc_btc_slippage)/(1-ltc_btc_fee)
```

个 BTC，实际上需要买入

```text
ltc_btc_sell_1_price*(1+ltc_btc_slippage)/[(1-ltc_btc_fee)*(1-btc_cny_fee)]
```

个 BTC，其中 btc\_cny\_fee 比例部分，是被平台收走的手续费，而对应需要花费的 CNY 是：

```text
btc_cny_sell_1_price*(1+btc_cny_slippage)*ltc_btc_sell_1_price*(1+ltc_btc_slippage)/[(1-ltc_btc_fee)*(1-btc_cny_fee)]
```

套利的前提条件是：得到的 CNY > 花费的 CNY，即：

```text
ltc_cny_buy_1_price*(1-ltc_cny_slippage)*(1-ltc_cny_fee)
> btc_cny_sell_1_price*(1+btc_cny_slippage)*ltc_btc_sell_1_price*(1+ltc_btc_slippage)/[(1-ltc_btc_fee)*(1-btc_cny_fee)]
```

调整一下，对应的套利条件就是：

```text
ltc_cny_buy_1_price
>btc_cny_sell_1_price*ltc_btc_sell_1_price*(1+btc_cny_slippage)*(1+ltc_btc_slippage) /[(1-btc_cny_fee)*(1-ltc_btc_fee)*(1-ltc_cny_fee)*(1-ltc_cny_slippage)]
```

考虑到各市场费率都在千分之几的水平，做精度取舍后，该不等式可以进一步化简成：

```text
(ltc_cny_buy_1_price/btc_cny_sell_1_price-ltc_btc_sell_1_price)/ltc_btc_sell_1_price
>btc_cny_slippage+ltc_btc_slippage+ltc_cny_slippage+btc_cny_fee+ltc_cny_fee+ltc_btc_fee
```

基本意思就是： **只有当公允价和市场价的价差比例大于所有市场的费率总和再加上滑点总和时，做三角套利才是盈利的。**&#x20;

如果价差满足条件，交易数量上的计算规则如下：

先计算以下几个值：

1. LTC/BTC 卖方盘口吃单数量：ltc\_btc\_sell1\_quantity\*order\_ratio\_ltc\_btc，其中 ltc\_btc\_sell1\_quantity 代表 LTC/BTC 卖一档的数量，order\_ratio\_ltc\_btc 代表本策略在 LTC/BTC 盘口的吃单比例；
2. LTC/CNY 买方盘口吃单数量：ltc\_cny\_buy1\_quantity\*order\_ratio\_ltc\_cny，其中 order\_ratio\_ltc\_cny 代表本策略在 LTC/CNY 盘口的吃单比例；
3. LTC/BTC 账户中可以用来买 LTC 的 BTC 额度及可以置换的 LTC 个数：btc\_available - btc\_reserve，可以置换成 (btc\_available – btc\_reserve)/ltc\_btc\_sell1\_price 个 LTC。其中，btc\_available 表示该账户中可用的 BTC 数量，btc\_reserve 表示该账户中应该最少预留的 BTC 数量（这个数值由用户根据自己的风险偏好来设置，越高代表用户风险偏好越低）。
4. BTC/CNY 账户中可以用来买 BTC 的 CNY 额度及可以置换的 BTC 个数和对应的 LTC 个数：cny\_available - cny\_reserve, 可以置换成 (cny\_availablecny\_reserve)/btc\_cny\_sell1\_price 个 BTC，相当于 (cny\_available-cny\_reserve)/btc\_cny\_sell1\_price/ltc\_btc\_sell1\_price 个 LTC。其中：cny\_available 表示该账户中可用的人民币数量，cny\_reserve 表示该账户中应该最少预留的人民币数量（这个数值由用户根据自己的风险偏好来设置，越高代表用户风险偏好越低）。
5. LTC/CNY 账户中可以用来卖的 LTC 额度：ltc\_available – ltc\_reserve 其中，ltc\_available 表示该账户中可用的 LTC 数量，ltc\_reserve 表示该账户中应该最少预留的 LTC 数量（这个数值由用户根据自己的风险偏好来设置，越高代表用户风险偏好越低）。

拿到上面 5 个值之后，对它们取最小值，得到 LTC 的数量，作为 LTC/BTC 市场的下单数量。然后，根据 LTC/BTC 成交的数量，得到需要对冲的 LTC 数量和 BTC 数量，分别在 LTC/CNY 和 BTC/CNY 市场下对冲单，所有市场先下限价单进行对冲，超时之后补市价单，确保完全对冲。

对最小交易单位的处理规则如下：

如果欲下单的 LTC 数量小于最小 LTC 交易单位 (取 LTC/BTC 和 LTC/CNY 两个市场的最小 LTC 交易数量的最大值) 的某个倍数（比如 2 倍），则放弃本次套利；

如果欲下单的 LTC 数量对应的 BTC 数量 (LTC 数量乘上系数 ltc\_btc\_sell1\_price) 小于最小 BTC 交易单位（取 LTC/BTC 和 BTC/CNY 两个市场的最小 BTC 交易数量的最大值）的某个倍数（比如 2 倍），则放弃本次套利。

## 二、三角套利策略流程

## 初始化：

1. 在 BTC/CNY 市场放入如下资产：
   1. BTC：1 个 BTC, 最少预留 20% (btc\_reserve = 20%)
   2. CNY：2 万元，最少预留 20% (cny\_reserve = 20%)

1) 在 LTC/CNY 市场放入如下资产：
   1. LTC：100 个 LTC，最少预留 20% (ltc\_reserve = 20%)
   2. CNY：2 万元，最少预留 20% (cny\_reserve = 20%)

1. 在 LTC/BTC 市场放入如下资产：
   1. LTC：100 个 LTC，最少预留 20% (btc\_reserve = 20%)
   2. BTC：1 个 BTC，最少预留 20% (ltc\_reserve = 20%)

## 套利条件：

## 1. 如果

```text
(ltc_cny_buy_1_price/btc_cny_sell_1_price-ltc_btc_sell_1_price)/ltc_btc_sell_1_price
>btc_cny_slippage+ltc_btc_slippage+ltc_cny_slippage+btc_cny_fee+ltc_cny_fee+ltc_btc_fee
```

则进行正循环套利：

![](https://pic4.zhimg.com/v2-47a0f50306c569996caa74c5debeaaf5_b.png)

正循环套利的顺序如下：

先去 LTC/BTC 吃单买入 LTC，卖出 BTC，然后根据 LTC/BTC 的成交量，使用多线程，同时在 LTC/CNY 和 BTC/CNY 市场进行对冲。LTC/CNY 市场吃单卖出 LTC，BTC/CNY 市场吃单买入 BTC。

## 2. 如果

```text
(ltc_btc_buy_1_price-ltc_cny_sell_1_price/btc_cny_buy_1_price)/ltc_btc_buy_1_price
> btc_cny_slippage+ ltc_btc_slippage+ ltc_cny_slippage+btc_cny_fee+ltc_cny_fee+ltc_btc_fee
```

则进行逆循环套利：

![](https://pic1.zhimg.com/v2-f6a91af12abc7e635d321b51a147c0a4_b.png)

逆循环套利的顺序如下：

先去 LTC/BTC 吃单卖出 LTC，买入 BTC，然后根据 LTC/BTC 的成交量，使用多线程，同时在 LTC/CNY 和 BTC/CNY 市场进行对冲。LTC/CNY 市场吃单买入 LTC，BTC/CNY 市场吃单卖出 BTC。

如果不满足以上两个条件，则继续等待套利机会。

## 账户内划转条件：

BTC/CNY, LTC/CNY, LTC/BTC 各个市场的计价货币和基础货币的存量降到最少预留比例（比如 20%）或以下，触发账户内划转，划转的流程如下：

1. 撤销 LTC/BTC 市场中尚未成交的委托
2. 撤销 BTC/CNY 市场中尚未成交的委托，对委托未成交部分进行市价补单
3. 跟 2）并行，撤销 LTC/CNY 市场中尚未成交的委托，对委托未成交部分进行市价补单
4. 进行账户内划转，划转结果如下：

> *BTC/CNY 市场中的 BTC = LTC/BTC 市场中的 BTC*\
> *LTC/CNY 市场中的 LTC = LTC/BTC 市场中的 LTC*\
> &#x20;*BTC/CNY 市场中的 CNY = LTC/CNY 市场中的 CNY（这个目前是合并在一起的，暂时没问题，如果是 ETH，则需要保证 ETH 账户中的 CNY = BTC 账户中的 CNY）*&#x20;

## 三、策略监控和异常处理

我们先定义一个异常的处理方法，称为操作 1，具体如下：

## 操作名：操作 1

操作简介：停止 LTC/BTC 下单，完成 LTC/CNY 及 BTC/CNY 的对冲，发报警，停止程序。

操作流程：

1. 第一步：停止在 LTC/BTC 盘面下单，撤销该盘面未完全成交的委托单；
2. 第二步：对于 LTC/CNY 及 BTC/CNY 盘面的未完全成交的委托单，进行轮询等待，超时之后，撤销未成交的部分，并用市价单进行补单，保证完全对冲；
3. 第三步：发出相应的报警邮件
4. 停止策略

再定义一个异常处理方法，称为操作 2，具体如下：

## 操作名：操作 2

操作简介：停止 LTC/BTC 下单，完成 LTC/CNY 及 BTC/CNY 的对冲，发报警。

操作流程：

1. 第一步：停止在 LTC/BTC 盘面下单，撤销该盘面未完全成交的委托单；
2. 第二步：对于 LTC/CNY 及 BTC/CNY 盘面的未完全成交的委托单，进行轮询等待，超时之后，撤销未成交的部分，并用市价单进行补单，保证完全对冲；
3. 第三步：发出相应的报警邮件

再定义几个参数，如下：（注意：以下所有资产的总量包含可用部分和冻结部分，包括 LTC/BTC 市场、LTC/CNY 市场以及 BTC/CNY 市场）

> *CNY 净头寸 = 当前 CNY 总量 – 初始 CNY 总量*\
> *BTC 净头寸 = 当前 BTC 总量 – 初始 BTC 总量*\
> *LTC 净头寸 = 当前 LTC 总量 – 初始 LTC 总量*

> *策略的盈亏计算公式 = (当前 CNY 总量 – 初始 CNY 总量）+ （当前 BTC 总量 – 初始 BTC 总量）\* 当前 BTC/CNY 价格 + （当前 LTC 总量 – 初始 LTC 总量）\* 当前 LTC/CNY 价格*

> &#x20;*CNY 头寸偏度 = ABS (BTC/CNY 市场中的 CNY - LTC/CNY 市场中的 CNY)/(BTC/CNY 市场中的 CNY + LTC/CNY 市场中的 CNY)，因为 LTC 和 BTC 市场共享统一的 CNY，所以本策略暂时不存在 CNY 头寸偏度这个问题。*&#x20;

> *BTC 头寸偏度 = ABS (BTC/CNY 市场中的 BTC - LTC/BTC 市场中的 BTC)/( BTC/CNY 市场中的 BTC + LTC/BTC 市场中的 BTC)*

> *LTC 头寸偏度 = ABS (LTC/CNY 市场中的 LTC - LTC/BTC 市场中的 LTC)/( LTC/CNY 市场中的 LTC + LTC/BTC 市场中的 LTC)*

需要监控的指标和相应流程如下：

1. 当次盈亏监控：如果策略亏损超过一定额度，进行 “操作 1”，然后调查亏损原因，明确之后再手动重启策略。
2. 净头寸监控
   1. CNY 净头寸监控：如果 CNY 净头寸的绝对值超过一定额度，进行 “操作 1”，然后调查产生净头寸的原因，明确之后再手动重启策略。
   2. BTC 净头寸：如果 BTC 净头寸的绝对值超过一定额度，进行 “操作 1”，然后调查产生净头寸的原因，明确之后再手动重启策略。
   3. LTC 净头寸：如果 LTC 净头寸的绝对值超过一定额度，进行 “操作 1”，然后调查产生净头寸的原因，明确之后再手动重启策略。

1) 头寸偏度监控
   1. CNY 头寸偏度监控：因为 LTC 和 BTC 市场共享统一的 CNY，所以本策略不存在这个问题。
   2. BTC 头寸偏度监控：如果 BTC 头寸偏度超过一定幅度，进行 “操作 1”，然后进行手动头寸调整，使得头寸偏度为 0，之后再手动重启策略
   3. LTC 头寸偏度监控：如果 LTC 头寸偏度超过一定幅度，进行 “操作 1”，然后进行手动头寸调整，使得头寸偏度为 0，之后再手动重启策略

1. 未成交的对冲单数量监控：如果未成交的对冲单（LTC/CNY 市场未成交的委托单数量 + BTC/CNY 市场未成交的委托单数量之和）数量超过一定额度，进行 “操作 2”

## 四、需要注意的问题

1. LTC/BTC 市场的单子是整个套利循环的起点，在 LTC/BTC 市场中成交的单子，一定要到 LTC/CNY 和 BTC/CNY 市场同时进行对冲。LTC/CNY 和 BTC/CNY 市场的对冲单，先尝试以限价单挂出，不成交则逐渐修改价格至可以成交的价位，多次尝试之后（超时）如果仍有未成交部分，则以市价单补单，保证完全对冲。
2. 整个套利过程，为了简化价格转换运算，没有考虑 BTC/CNY 市场的盘口深度，所以在估计 BTC/CNY 的对冲成本（btc\_cny\_slippage）时，需要结合最近 BTC/CNY 盘口的深度情况进行调整。如果 BTC/CNY 盘口太薄，则建议设置一个比较大的对冲成本（btc\_cny\_slippage）。
3. 本文中所有的买一卖一价格，都是指进行了盘口深度合并之后的价格。盘口深度合并的规则是：
   1. LTC/BTC 市场，按照 0001 的价格进行合并（即一个价格档位对于的比特币为 0.0001 个，约 2 元）。买单向下合并，卖单向上合并。用数据表示如下：

合并前深度：

```text
(asks)

0.010413            12
0.010412            20
0.010312            33
0.010112            13

(bids)

0.010109            45
0.009812            22
0.009812            10
0.009712            2
0.009612            30
```

合并后深度：

```text
(asks)

0.0105		32
0.0104		33
0.0102		13

(bids)

0.0101		45
0.0098		32
0.0097		2
0.0096		30
```

所以本策略中的买一卖一的价格和数量，是已经包含了未合并之前好几档的深度。这样的合并规则，保证我们在计算套利机会的时候，是偏保守的。如果想做 ETH/BTC 交易，只需要将文中 LTC 替换为 ETH 即可～

怎么样，以上就是在有成本的情况下进行三角套利的全过程，是不是干货满满？别急，代码都给你准备好了！关注 “WeQuant 微宽量化” 公众号（微信号：WeQuant-Official），回复 “三角套利”，即可获得全套源码。或者加入 WeQuant 的用户 QQ 群 519538535 向管理员索要。赶紧燥起来吧！

（ **风险提示：币市有风险，一切投资请在个人风险承受范围内进行，** [WeQuant](https://link.zhihu.com/?target=https%3A//wequant.io)**提供的策略和代码仅供参考使用**）
