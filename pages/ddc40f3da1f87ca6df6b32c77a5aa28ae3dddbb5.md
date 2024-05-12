---
title: "银行贷款的年化利率是怎样算出来的"
date: 2023-08-01 18:38:36
categories: [other]
tags: []
origin_url: https://www.zhihu.com/question/58301871
---
**银行往往不会直接告诉你真实的利率。**

30万，月费率0.5%，分60期，等本等息，实际年利率是多少？

**是月费率0.5%\*12=6%？**

不是的。

**实际年化利率为10.85%！**

我是数据控+强迫症，必须给你掰扯清楚：

**信用贷的实际年化利率到底怎么算？**

**首先，说下费率与利率的区别：**

*   **费率**：始终按**所有本金**计费，所欠本金减少，利息不变，即每期产生费用相同。

场景：一般用于银行大额分期贷款、信用卡分期。

<img src="https://pic1.zhimg.com/50/v2-13147f9e6196f58fc772ae7377cd5d5e\_720w.jpg?source=1940ef5c" data-caption="" data-size="normal" data-rawwidth="856" data-rawheight="410" data-original-token="v2-1dbe7698cb702b4cabd804d8e15153bd" data-default-watermark-src="https://pica.zhimg.com/50/v2-3d02adeb97bbda14d02516c9fdad394b\_720w.jpg?source=1940ef5c" class="origin\_image zh-lightbox-thumb" width="856" data-original="https://picx.zhimg.com/v2-13147f9e6196f58fc772ae7377cd5d5e\_r.jpg?source=1940ef5c"/\>

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/145b5420.jpe)

*   **利率**：按**剩余本金**计算利息，利息随所欠本金减少而下降，即每期偿还利息不同。

场景：一般用于房贷按揭、抵押贷。

<img src="https://picx.zhimg.com/50/v2-5ceee651955a13e8ad2068f8369231e8\_720w.jpg?source=1940ef5c" data-caption="" data-size="normal" data-rawwidth="872" data-rawheight="418" data-original-token="v2-9a70456be54ef24d4e12451c416f72c8" data-default-watermark-src="https://picx.zhimg.com/50/v2-8a58d1932bdb6615ee17c6e90d90276b\_720w.jpg?source=1940ef5c" class="origin\_image zh-lightbox-thumb" width="872" data-original="https://pica.zhimg.com/v2-5ceee651955a13e8ad2068f8369231e8\_r.jpg?source=1940ef5c"/\>

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/644f6638.jpe)

**30W，月费率0.5%，60期。每月的本金就是5000元，每月的利息是1500。**

**即使是最后一期，剩余本金5000，也要还利息1500，那么最后一期，实际年化高达1500/5000\*12=360%！！！**

那么，费率如何换算成利率呢?

**1.费率换算成年化利率，可以通过IRR(内部收益率)公式换算。**

把这些数据输入到excel中，使用IRR函数来计算，得出最终的**年化利率是10.85%**：

<img src="https://picx.zhimg.com/50/v2-b786d075fd6defce781077c366723683\_720w.jpg?source=1940ef5c" data-caption="" data-size="normal" data-rawwidth="991" data-rawheight="457" data-original-token="v2-aa25ffecf1611e21b20555102dbbd7a7" data-default-watermark-src="https://picx.zhimg.com/50/v2-6a02ae387fdcd5555501c67467e47fe8\_720w.jpg?source=1940ef5c" class="origin\_image zh-lightbox-thumb" width="991" data-original="https://picx.zhimg.com/v2-b786d075fd6defce781077c366723683\_r.jpg?source=1940ef5c"/\>

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/02621c07.jpe)

以上计算，虽然简单，但应该有人学废的了，可以休息思考下，点赞收藏好，有空慢慢看。

  
**2.除了用专业的IRR计算，还有个更简单的算法，就是月费率\*12\*1.85**

按题主的情况，**年化利率就是0.5%\*12\*1.85=11.1%**≈10.85%，大差不差，不纠细节可以这样直接计算。
    