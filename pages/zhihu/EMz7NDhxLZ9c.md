---
title: 听说你还不会计算年化收益率
date: 2024-10-04T15:14:40.341Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/31727760
---
常见的银行理财年化收益率在 4.5% 左右，也就是说，10000 元存 1 年，收益 10000×4.5%=450 元。

但是还有很多实际问题不像银行理财项目这么简单，那就可能需要用到下面一些计算方法了，我们可以借助 excel 来完成计算。

1、未来值 FV 函数

问：小汉每个月定投 1000 元到汉师推荐的低估基金，收益率按 15% 计算，那么 3 年后小汉能拿到多少本息呢？

因为是每个月投资，把利率和时间都改成以月为单位。由于是投出 1000，所以第三行是 - 1000，表示支出 1000 元，pv 表示本金，刚开始投的时候本金为 0，所以第四行填 0。

&#x20;**公式 = FV (15%/12,36,-1000,0,0)，最终拿到的本息是 45115 元。** 而不是正常计算方法，1000×36×（1+15%）=41400 元。

![](https://pic2.zhimg.com/v2-009574bf23e38e8784ebe3ee0cdcd7e9_b.jpg)

2、现值 PV 函数

问：小汉刚毕业，他的目标是 5 年后攒够 15 万当作买房首付，现在有年化收益率 10% 理财，那小汉现在要拿出多少钱进行投资才能实现目标呢？

年化收益率 10%，时间 5 年，根据计算， **现在得拿出 9.3 万用于购买 10% 理财，并且坚持 5 年投资。**&#x20;

![](https://pic4.zhimg.com/v2-f211e2fc25d2967ff2e805c2c059239d_b.jpg)

3、内部收益率 IRR

问：小汉上个月 1 号刷信用卡 1 万元，分 12 期还，信用卡费率 0.6%，手续费 10000×0.6%×12=720 元，每期还款（10000+720）/12=893.3 元。实际分期还款年利率是多少呢？

![](https://pica.zhimg.com/v2-b98d5425ca0667ea8d548bd38d18892a_b.jpg)

&#x20;**把每期利率 ×12×100%，即为年利率 = 13%。** 所以别看借贷日利息低，算一算就能吓死你。

老铁走之前点一下赞，你们的支持是我原创干货文章的源源动力！

&#x20;**公众号：投资门内汉，分享开源节流理财干货。**&#x20;