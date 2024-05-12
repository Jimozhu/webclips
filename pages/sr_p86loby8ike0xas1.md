---
title: "120个数据分析指标与术语"
date: 2022-07-23T11:01:19+08:00
draft: false
categories: [dev]
tags: [dev, web]
---
> 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/V2JMC3ora81pPrYvjjOoKg)

数据分析总是离不开各种指标和术语，最近我花了一周整理了共 120 个数据分析指标与术语：用户数据指标、行为数据指标、业务数据指标、数据分析术语、统计学常用语、数据报告常用术语。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/c6075608.png)

## 用户数据指标

**IP、UV、PV、VV**

IP（Internet Protocol）：独立 IP 数。

UV（Unique Visitor）：独立访问客数。

PV（Page View）：页面浏览量/阅读量。

VV（Visit View）：访问次数。

> 注：在对视频产品的数据分析中，VV(Video View)是播放类指标，是指在一个统计周期内，视频被打开的次数之和。

**DAU**(Daily Active User)：日活跃用户数

**MAU**(Monthly Active users)：月活跃用户数

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/83aece6d.png)

**DNU**(Day New User)：日新增用户。

**活跃留存率**：指某日新增用户在其后 N 日仍启动该 APP 的用户数，占所选日期新增用户数的比例。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/77933c51.png)

**TGI**（Target Group Index)：目标群体指数。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/f377e4a5.png)

TGI 指数高于 100，代表该类用户该特征比例高于整体水平，即具有更高的相关倾向或偏好；小于 100，则说明该类用户相关倾向较弱；等于 100 表示在平均水平。

TGI 指数常用于用户画像的评判中，它可以清晰地反映不同群体某一特征的关联程度，并进行直观的比较，挖掘更多潜在的用户价值。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/dbf8acd6.png)

## 行为数据指标

之前我曾经总结过[用户行为分析的 5 类指标](https://mp.weixin.qq.com/s?__biz=MzU5Nzg5ODQ3NQ==&mid=2247519961&idx=2&sn=1ae01914226203c3354b99f728d8c208&chksm=fe4eab5dc939224b1f07849b125aa8625be0c23682edff27c1a070a85236f79f680b484d6b3e&token=170624943&lang=zh_CN&scene=21#wechat_redirect)，这里的行为数据指标便直接引用前文[1]。

用户访问类的指标有 13 个：**PV、UV、DV、日新增用户数、获客成本、用户访问时长、人均页面访问量、人均浏览页数、平均访问页面、访问来源、平均停留时间、跳出率、搜索访问次数占比**。（其中 PV、UV、日新增用户数前文已介绍，其余指标具体含义如下图所示。）

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/3a6f7f4d.png)△ 点击查看大图

用户转化类指标共有 15 个：**最近购买间隔、购买频率、购买商品种类、平均每次消费额、单次最高消费额、日应用下载量、一次会话用户数、用户会话次数、漏斗转化—第一步进入次数、漏斗转化—中间步进入次数（漏斗中）、进漏斗转化—进入率（漏斗中）、漏斗转化—进入次数（漏斗中）、漏斗转化—进入率（漏斗中）、漏斗转化—退出次数、漏斗转化—退出率**，这些指标具体含义如下图所示。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/6d0de1a1.png)△ 点击查看大图

用户留存类指标共有 15 个：**用户留存率、渠道留存率、次日留存率、退出率、活跃度、活动参与率、活跃交易用户数、DAU、MAU、用户回访率、用户流失率、功能使用率、GMV、复购率、退货率**，这些指标具体含义如下图所示。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/b7464389.png)△ 点击查看大图

用户社交类指标共有 8 个：**好友数量、帖子数量、看帖数量、回复数量、分享数量、点赞数量、转发数量、评论数量**，这些指标具体含义如下图所示。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/be67630d.png)△ 点击查看大图

## 业务数据指标

互联网线上推广渠道总体上可以分为 5 种类型：原生广告类社交媒体、普通社交媒体、搜索引擎、软件商店和换量联盟。

渠道投放相关的数据指标有：**曝光量、CPM、CPC、CPA 和 ROI**，这 5 个指标的具体含义如下图所示。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/8ef1e481.png)△ 点击查看大图

此外，还有指标 **ARPU** 与 **ARRPU**，这二者分别的含义为：

ARPU（Average Revenue Per User）：每用户平均收入。

ARRPU（Average Revenue Per Paying User）：每付费用户平均收益。

最后，关于广告渠道投放的常见 CPM、CPC、CPA 等指标，还包括以下 6 个指标。

**CTR**（click through rate）：点击率，是衡量广告效果非常重要的一个指标：内容被点击的次数/内容展现的次数。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/eac4ff37.png)

**CVR**(Click Value Rate)：转化率【衡量 CPA 广告效果的指标】

**CAC**(Customer Acquisition Cost)：获客成本【获取一个客户所花费的成本】

**CPR**(Cost Per Response)：每回应成本【以浏览者的每一个回应计费】

**ADPV**(Advertisement Page View)：载有广告的 pa-geview 流量

**ADimp**(ADimpression)：单个广告的展示次数

## 数据分析术语

**用户画像**简单来说，用户画像是根据用户的社会属性、生活习惯、消费行为等信息而抽象得出的一个标签化用户模型。勾画用户画像的核心在于给用户贴“标签”。（涉及的元素比如用户的姓名、年龄、收入、喜好、购物习惯等等）

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/d98906eb.jpe)

**海盗模型（AARRR）**获取用户（Acquisition）、提高活跃度（Activation）、提高留存率（Retention）、获取收入（Reve-nue)、自传播（Refer)，这个五个单词的缩写，分别对应用户生命周期中的 5 个重要环节。

**RARRA 模型**

AARRR 模型的核心在于获客，而在 RARRA 的模型下，专注用户的留存。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/3ca91546.jpe)

**OSM 模型**

OSM 模型（Object-Strategy-Measure）就是把宏大的目标拆解，[对应到部门内各个小组具体的、可落地、可度量的行为上，从保证执行计划没有偏离大方向]([http://www.woshipm.com/pd/4356866.html](http://www.woshipm.com/pd/4356866.html) 《OSM 模型，最接地气的业务分析框架》)。

**UJM 模型**

UJM 模型（User Journey Map，用户旅程地图）就是我们在设计一款产品的过程中，必须要去梳理的用户生命旅程。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/96c1d051.jpe)

**RFM**

根据客户的交易频次和交易额衡量客户的价值，对客户进行细分。RFM 是衡量客户价值的三个维度，分别为 R（Recency）交易间隔、F（Frequency）交易频度、M（Monetary）交易金额组成。

**ABTest**

AB 测试是为 APP 或 Web 的界面/流程制作两个（A/B）或多个（A/B/n）版本，在同一时间维度中，分别让组成成分相同/相似的访客群组（目标人群）随机的访问这些版本，收集各群组的用户体验数据和业务数据，最后分析、评估出最优版本，正式采用。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/349c5bc1.png)

**数据埋点**

数据埋点是一种常用的数据采集方法，是数据产品经理、数据运营以及数据分析师，基于业务需求或产品需求对用户在应用内产生行为的每一个事件对应的页面和位置植入相关代码，并通过采集工具上报统计数据，以便相关人员追踪用户行为和应用使用情况，推动产品优化或指导运营的一项工程[2]。

**用户生命周期价值**

LTV（life time value）也就是用户生命周期价值，是产品从用户获取到流失所得到的全部收益的总和。LTV 用于衡量用户对产品所产生的价值，是所有用户运营手段为了改善的终极指标，同时 LTV 也应该是所有运营手段的最终衡量指标。

**归因分析**

在数据时代，广告的投放效果评估往往会产生很多的问题。而归因分析（Attribution Analysis）要解决的问题就是广告效果的产生，其功劳应该如何合理的分配给哪些渠道[3]。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/86a4442d.png)

## 统计学常用语

**绝对数和相对数**

绝对数：是反应客观现象总体在一定时间、一定地点下的总规模、总水平的综合性指标，也是数据分析中常用的指标。比如年 GDP，总人口等等[4]。

相对数：是指两个有联系的指标计算而得出的数值，它是反应客观现象之间的数量联系紧密程度的综合指标。相对数一般以倍数、百分数等表示。相对数的计算公式：

相对数=比较值（比数）/基础值（基数）

**百分比和百分点**

百分比：是相对数中的一种，它表示一个数是另一个数的百分之几，也称为百分率或百分数。百分比的分母是 100，也就是用 1% 作为度量单位，因此便于比较。

百分点：是指不同时期以百分数的形式表示的相对指标的变动幅度，1% 等于 1 个百分点。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/d3b1a194.png)

**频数和频率**

频数：一个数据在整体中出现的次数。

频率：某一事件发生的次数与总的事件数之比。频率通常用比例或百分数表示。

**比例与比率**

比例：是指在总体中各数据占总体的比重，通常反映总体的构成和比例，即部分与整体之间的关系。

比率：是样本(或总体)中各不同类别数据之间的比值，由于比率不是部分与整体之间的对比关系，因而比值可能大于 1。

**变量**

变量来源于数学，是计算机语言中能储存计算结果或能表示值抽象概念。变量可以通过变量名访问。

**连续变量**

在统计学中，变量按变量值是否连续可分为连续变量与离散变量两种。在一定区间内可以任意取值的变量叫连续变量，其数值是连续不断的，相邻两个数值可作无限分割，即可取无限个数值。如:年龄、体重等变量。

**离散变量**

离散变量的各变量值之间都是以整数断开的，如人数、工厂数、机器台数等，都只能按整数计算。离散变量的数值只能用计数的方法取得。

**定性变量**

又名分类变量：观测的个体只能归属于几种互不相容类别中的一种时，一般是用非数字来表达其类别，这样的观测数据称为定性变量。可以理解成可以分类别的变量，如学历、性别、婚否等。

**均值**

即平均值，平均数是表示一组数据集中趋势的量数，是指在一组数据中所有数据之和再除以这组数据的个数。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/88e3dab6.png)

**中位数**

对于有限的数集，可以通过把所有观察值高低排序后找出正中间的一个作为中位数。如果观察值有偶数个，通常取最中间的两个数值的平均数作为中位数。

**缺失值**

它指的是现有数据集中某个或某些属性的值是不完全的。

**异常值**

指一组测定值中与平均值的偏差超过两倍标准差的测定值，与平均值的偏差超过三倍标准差的测定值，称为高度异常的异常值。

**方差**

是衡量随机变量或一组数据时离散程度的度量。概率论中方差用来度量随机变量和其数学期望（即均值）之间的偏离程度。统计中的方差（样本方差）是每个样本值与全体样本值的平均数之差的平方值的平均数。在许多实际问题中，研究方差即偏离程度有着重要意义。方差是衡量源数据和期望值相差的度量值。

**标准差**

又常称均方差，是离均差平方的算术平均数的平方根，用 σ 表示。标准差是方差的算术平方根。标准差能反映一个数据集的离散程度。平均数相同的两组数据，标准差未必相同。

**皮尔森相关系数**

皮尔森相关系数是用来反映两个变量线性相关程度的统计量。相关系数用 r 表示，其中 n 为样本量，分别为两个变量的观测值和均值。r 描述的是两个变量间线性相关强弱的程度。r 的绝对值越大表明相关性越强。

## 数据报告常用术语

**倍数和番数**

倍数：用一个数据除以另一个数据获得，倍数一般用来表示上升、增长幅度，一般不表示减少幅度。

翻 n 番：指原来数量的 2 的 n 次方。

**同比和环比**

同比：指的是与历史同时期的数据相比较而获得的比值，反应事物发展的相对性。

环比：指与上一个统计时期的值进行对比获得的值，主要反映事物的逐期发展的情况。

![图片](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_p86loby8ike0xas1/d8bd64ee.png)

**增量**：增长的绝对量=现期量-基期量

**增速**：增长速度=（现期量-基期量）÷ 基期量

**增长率**：增量与基期量之比。

**增幅**：即增长的幅度，也可理解为增量。

**基期和现期**

基期：被用作参照物的时期称为基期，描述基期的量即为基期量。

现期：相对于基期的称为现期，描述现期的量即为现期量。

**YTD**:截止到今天为止今年的

**LY**:last year 去年

**YoY**——跟上年相比

**MAT**（moving annual total）：年度动态变化总值

**Q4/Q1**：4 季度/1 季度

**GDP**:国内生产总值

**GNH**（gross national happiness）：国民幸福指数

**GNP**:国民生产总值

### 参考资料

[1]

书籍: 《大数据用户行为分析画像实操指南》

[2]

通俗易懂的理解：什么是数据埋点？: [https://blog.csdn.net/qq_38128179/article/details/108746513](https://blog.csdn.net/qq_38128179/article/details/108746513)

[3]

4 个方面解析：归因分析模型: [http://www.woshipm.com/marketing/3839887.html](http://www.woshipm.com/marketing/3839887.html)

[4]

一次性总结：64 个数据分析常用术语！: [https://mp.weixin.qq.com/s/gVc1rTVYKtECSztau_I7RA](https://mp.weixin.qq.com/s/gVc1rTVYKtECSztau_I7RA)
