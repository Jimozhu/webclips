---
title: 『高频因子掘金』—开盘收盘成交量占比因子
date: 2024-10-04T15:14:56.939Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/25349208
---
## **策略思想**

去年社区五道口歌姬写了一篇关于集合竞价成交占比因子，前几天看到微信公众号量化投资与机器学习的一篇文章，这篇文章构造了开盘收盘成交占比因子。两者有一定的相似之处，所以写了一篇再探高频因子的文章。其实构造这个因子的思想与集合竞价成交因子是类似的，背后具体的逻辑可以关注公众号看看该文章，本文就不在细说了。

\


## **因子计算**

参考了[高频因子初探 - 集合竞价成交占比因子](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58131804228e5b43f45c2104)，[追踪聪明钱 - A 股市场交易的微观结构初探](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/578f04e0228e5b3b9b5f1ab7)这两篇文章。按照作者的说法，开盘收盘成交量占比因子的计算方式为：

![](https://picx.zhimg.com/v2-4b344ff447172ef9104b185cacd58ea7_b.png)

\


其中 Volm 表示上午 9：30 到 10：00 该股票的成交量，Vola 表示下午 14：30 到 15：00 的成交量，Vol 表示该支股票一天的总成交量。原作者不同的是，在此基础上对因子取了 20 天的移动平均。

\


## **数据准备**

这部分因子数据的计算，为了防止意外情况，造成数据丢失，因子计算的过程中，每添加一条记录，就保存为 csv 文件。

![](https://pic4.zhimg.com/v2-a74511b359d962c89e899a6ea28c945f_b.png)

## **合成因子截面特征**

![](https://pic1.zhimg.com/v2-be944dc45ebfe8f44012b57ed091bb34_b.png)

由上图可以看到，开盘收盘成交量占比因子的值分布与集合竞价成交占比因子非常像，并不是很稳定，在股灾期间 (2015.6 & 2015.8 & 2016.1) 呈现出强烈地上升趋势。\


![](https://pica.zhimg.com/v2-66f4e61a965a6b466c926bc6d682c4a6_b.png)

\


从市值分布来看，大体上看这个分布，恰好与集合竞价成交占比因子相反，不存在小市值现象。

\


## &#x20;**因子回测、** **结果及分析**

本文在全 A 股上回测从 2011 年年初至 2017 年 2 月出回测该因子的表现情况，这里我们采用的组合构建方式为选取前十分位等权构建，每日调仓，回测结果和日度胜率分析如下：

![](https://picx.zhimg.com/v2-0b16cbf67906cf2f410e21bb490d1159_b.png)

![](https://pic3.zhimg.com/v2-8f201fa52af57e453ead13bf9870475a_b.png)

为了更好地展示开盘收盘成交占比因子的选股能力，我们对由该因子五分位数的每个分位数区间对应的股票进行回测，为了减少时间，这里从 2013 年开始回测，其他参数与之前基本一致。

![](https://pic4.zhimg.com/v2-820a802942d7010e77adb6fa33b25ec9_b.png)

上图显示出，因子选股不同五分位构建等权组合，在 uqer 进行真实回测的净值曲线；显示出因子很强的选股能力，不同五分位组合净值曲线随时间推移逐渐散开。\


![](https://picx.zhimg.com/v2-33f45a7930f79a4cb64bd9a0d4efa1b1_b.png)

\


其他文章推荐：

[优矿日报](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58aa6191c990c30056b94846) 每日推送 **大盘点位预测、两融、沪港通、资金流以及龙虎榜**等信息。

[股社区 - 绩优 + 低估值股票筛选](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58a3ef0e94cad30056110286)

[按行业和因子选股的小工具](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58aaba1df1973300517ae041)

[PB 市净率因子研究](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58aafdc3c990c30054b9470a)

[CAPM 上手](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/58a7ce25c990c30059b946da)

原文链接：[高频因子再探 —— 开盘收盘成交量占比因子](https://link.zhihu.com/?target=https%3A//uqer.io/community/share/589d9a35c1e3cc00537fd197)

优矿专业版除了已有的 400 + 因子库、归因、并行计算及风险模型，即将推出深度学习框架。

欢迎感兴趣的矿友试用：[https://uqer.io/pro/](https://link.zhihu.com/?target=https%3A//uqer.io/pro/)
