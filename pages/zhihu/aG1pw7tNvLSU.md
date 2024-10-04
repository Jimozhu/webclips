---
title: 债券属性「久期」的本质是什么？
date: 2024-10-04T15:27:04.727Z
categories:
  - zhihu
tags:
  - zhihu
  - 我的收藏
origin_url: //www.zhihu.com/question/21860362/answer/968993638
---
**一言不合就上公式**

无论是学习什么知识，当然首先一点就是要搞清楚它的基本概念。那么久期是做什么的呢？定义说啦，它是用来衡量利率风险（Interest Risk）哒，那么咋衡量呢？Duang～公式来了：

![](https://pic1.zhimg.com/50/v2-606b9a997bb019bd68ea0a36a57b905c_720w.jpg?source=2c26e567)

我们知道，市场利率会影响债券价格，并且这个影响天然是负向的，就是你涨我就跌，你跌我就涨呗。所以公式前面那个负号呢，就是为了能保证久期得出来**永远都是正数**——OK，理解！那分母呢，就是利率的变动喽；可是看到分子很多同学就头大了：你说你搞个比值我还是能动动脑接受的，结果上下还长得不一样！上头那个鬼，是个啥？

好吧，这，是个变化率。也就是说，久期这个公式的分子没有直接使用债券价格的变动而是采用了债券价格的变化率，将价格本身的单位（比如软妹币啦、美刀啦等等）经过这么一除统统变没…… 那这么一通骚操作是为了啥？

![动图封面](https://pica.zhimg.com/50/v2-6e238dcea1ce2f8ba195566365fd8073_720w.jpg?source=2c26e567)

答案来了：这是因为分母是利率变动，单位是百分比，所以要将分子单位也搞成百分比，才能实现分子、分母的量纲一致，上下整齐划一，得到的结果 ——“久期” 同志，才更单纯、精准啊。

说白了，它就是这么衡量利率变动对债券价格的影响滴：当利率变动 1% 时，债券价格变动多少个百分比（而不是多少钱噻）。如果债券价格的变动幅度非常大，那就说明这只债券的利率风险非常大。

&#x20;**Duration 这个名儿到底是肿么取滴？**&#x20;

你说上公式就上公式吧，你起个名字咋跟定义的公式完全不搭嘎呢？

久期，久期，英文名 Duration，明明是个时间概念，可由以上定义哪只眼睛能看到有时间单位了？

其实啊，久期这个概念的提出不是刚开始就这样的。它最早是由[麦考林](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E9%BA%A6%E8%80%83%E6%9E%97\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLpuqbogIPmnpciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.ot7XRA9djMUg2dyhDRlVVdXJcM1_f_CUMVpp3CjlXtk\&zhida_source=entity)提出，被称作麦考林久期（Macaulay Duration）。当时这个久期呢，**是用来衡量平均还款期的，即得到每一期现金流所需时间的加权平均**—— 这可就是个纯粹的时间概念了。

下面咱们来具体看看，喏，上公式

![](https://pica.zhimg.com/50/v2-72868af6012937cc0816d4c1498f7bc8_720w.jpg?source=2c26e567)

同学们，先别急着眼晕，来仔细瞅瞅：既然是个加权平均的概念，就要有权重；这里每一期时间 t 的权重，就是每一期现金流的现值

![](https://pic1.zhimg.com/50/v2-9d80d97f62417405d6f409daa1f80c6a_720w.jpg?source=2c26e567)

对整个[债券现值](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E5%80%BA%E5%88%B8%E7%8E%B0%E5%80%BC\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLlgLrliLjnjrDlgLwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.WtpWMoZtCbUL7Tm2Ts2udL9pBKS5JHR19q90Ynhj83M\&zhida_source=entity)

![](https://picx.zhimg.com/50/v2-3a494f7c0d86338315c7d495d5a3317a_720w.jpg?source=2c26e567)

的占比。

比如借款人在第一年、第二年末分别偿还 100 元，折现率是 10%，则麦考林久期就等于 1.48 年。

![](https://picx.zhimg.com/50/v2-b0a6eff7fae356737eb18d011f12740f_720w.jpg?source=2c26e567)

这个意思就是说，表面上看借款人是用了两年时间偿还了这笔钱，但因为是分期付款，每一期都有现金流，最后纳入[货币的时间价值](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E8%B4%A7%E5%B8%81%E7%9A%84%E6%97%B6%E9%97%B4%E4%BB%B7%E5%80%BC\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLotKfluIHnmoTml7bpl7Tku7flgLwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.APxzA49g6662I81NelvkZpET9uJnyLo_eY0ai0pE6KY\&zhida_source=entity)、从现值角度来看，借款人还款的加权平均时间是 1.48 年。

&#x20;**Duration 你家是不是亲戚有点多？**&#x20;

现在为止，咱们说了久期的定义式以及久期的起源式，可是！这还没完…… 以下还有至少两个长得差不多的家庭成员要强势加入：

&#x20;**修正久期（Modified Duration）**&#x20;

久期原本的意思是期限（麦考林久期），而现代定义的久期可以用来衡量利率风险，那利率风险又是如何与期限挂钩的呢？下面再来上公式（555……）的简单变形来看看它们之间的渊源。

我们知道债券价格等于各期现金流的现值，比如一个三年期的债券价格等于

![](https://picx.zhimg.com/50/v2-1e61b635465f86ed1e107cb6b9536adc_720w.jpg?source=2c26e567)

当当当当！看到没，等式左边就是定义式，等式右边就是麦考林久期除以 (1+y)，那么这样得出的久期就叫修正久期（Modified Duration）。它是可以通过麦考林久期得出的。

这里需要强调一点，y 并不是代表年化的收益率，而是指一期的收益率。一期可以是一年也可以是半年或者季度。

&#x20;**有效久期（Effective Duration）**&#x20;

对于每期现金流及到期期限都确定的普通债券我们可以使用修正久期，但对于那些含权债券就不能简单套用修正久期来衡量利率风险啦。因为[含权债券](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=2\&q=%E5%90%AB%E6%9D%83%E5%80%BA%E5%88%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLlkKvmnYPlgLrliLgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoyLCJ6ZF90b2tlbiI6bnVsbH0.hUMYRcVErbvWCuVs3QfJN9Mw7laRI5XrF8DAQRugoBQ\&zhida_source=entity)的到期日、现金流会受到所含[期权](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E6%9C%9F%E6%9D%83\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLmnJ_mnYMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.beM8PKr2_bWf7CB8eX_TwUN7uzFfINEDAxLFCGmqIyo\&zhida_source=entity)的影响。

以 callable bond（[可赎回债券](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E5%8F%AF%E8%B5%8E%E5%9B%9E%E5%80%BA%E5%88%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLlj6_otY7lm57lgLrliLgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.kRHVkO_e6Y364pX_SO2nwWLHwJWXw4gDwkNyeUk9eBk\&zhida_source=entity)）为例，当市场利率低于[债券票面利率](https://zhida.zhihu.com/search?content_id=206245152\&content_type=Answer\&match_order=1\&q=%E5%80%BA%E5%88%B8%E7%A5%A8%E9%9D%A2%E5%88%A9%E7%8E%87\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg0MTcsInEiOiLlgLrliLjnpajpnaLliKnnjociLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMDYyNDUxNTIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.FMq3eMiy_b6quh5c28SUgdS4KVms6cK5FOY7swWiJuY\&zhida_source=entity)时，债券的发行人通常会提前赎回该债权并以更低的利率重新进行融资，实际到期日也就不等于债券约定的到期日。此时，callable bond 的久期就不能用修正久期简单计算，必须考虑提前赎回的情况。

为了解决**衡量含权债券利率风险**的问题，就又搞出了一个有效久期（Effective Duration）

![](https://pica.zhimg.com/50/v2-e509039bfcafbe0d9f02ae096d3f7b2a_720w.jpg?source=2c26e567)

怎么样，有木有被大大小小的公式和概念吓倒？不怕不怕，毕竟万事开头难嘛，要在学习伊始就保持敬畏之心。
