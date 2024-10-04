---
title: 你知道哪些隐藏的财务数据造假细节？
date: 2024-10-04T15:14:40.645Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //www.zhihu.com/question/33540315/answer/172213735
---
有很多同学批评我说，这个法则在审计实操中效果很差，属于 “玄学”。小 Rain 哥你正经的不讲尽讲这种歪门邪道了。我觉得这里有必要给大家谈谈我对这个法则的认识。

首先，我的每个回答下面都摆着我多年和上市公司斗智斗勇的经验总结：[如何确定未上市企业的利润真实性？ - 知乎](https://www.zhihu.com/question/20365173/answer/162606322)，可是大家都不喜欢这种枯燥无味的说教，那个回答一个月的赞还没这个回答一天的赞多，我作为曾经的四大审计经理，我也很心塞你们知道吗？？？

其次，这个法则被用于 JE testing 其实我是有所保留的。正如我在评论区提到的，本福特法则由于存在偏离值随样本量的扩大而收敛的情况（统计误差的收敛和造假的误差被稀释），因而事实上是没有一个可以精确定义的阈值。因此，我觉得这个方法最好的应用不应该在 ToD 层面，而是在合伙人、经理讨论项目的承接和续约时予以考虑最有效（即未通过检验的项目不接，好吧我知道我在说梦话）。其实我个人觉得比较可行的折中方法是对于同一样本量的数据进行学习，得到对应样本数量下残差的期望波动率，再找出残差显著大于期望波动率的样本，认为其造假可能性较大。

第三，很多会计师、律师朋友批评这个法则即使发现有问题也无法找出问题在哪。这就涉及一个精确与统计的问题了。我在做会计师的时候也一直想要做到 100% 的精确，但进入投资领域以后我理解了一句话 “这个世界唯一能确定的就是不确定性”。因此从此以后我看问题永远都站在统计的角度看，而不追求绝对的证据或结果。事实上，各位想一下，审计的抽样检验不也是建立在统计的原理之上吗？（虽然我们总叫他[非统计抽样](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=1\&q=%E9%9D%9E%E7%BB%9F%E8%AE%A1%E6%8A%BD%E6%A0%B7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLpnZ7nu5_orqHmir3moLciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.KQcq5Hi_nGPyyOHfSrq88sgaoqZ4gRvCNEKAvWUJRG4\&zhida_source=entity)，为了减少 documentation 量，会计师什么都干的出来）。站在投资者的立场，我发现一个规律，它能帮我找到对应的样本，相关样本呈现出统计上显著的正（负）超额收益，因此我可以利用相关结果在大样本环境下为投资者取得回报，难道这不也是一种很快乐的事情吗？

\-------------------------------------------- 原答案的分割线 --------------------------------------------------------

我给大家介绍一种采用数理统计大样本的方式进行验证的假账测试的细节方法。这个方法最大的优点我认为是 **不需要你懂会计！**&#x20;

这个方法叫 Benford's law（本福特法则）。这是一个关于数值型数据概率分布的数学定理，最初的发现与金融、财务本来没有任何关系，主要应用于自然科学领域。

1935 年，美国的一位叫做本福特的物理学家在图书馆翻阅对数表时发现，对数表的头几页比后面的页更脏一些，这说明头几页在平时被更多的人翻阅。

本福特再进一步研究后发现，只要数据的样本足够多，数据中以 1 为开头的数字出现的频率并不是 1/9，而是 30.1%。而以 2 为首的数字出现的频率是 17.6%，往后出现频率依次减少，9 的出现频率最低，只有 4.6%。

本福特开始对其它数字进行调查，发现各种完全不相同的数据，比如人口、物理和化学常数、棒球[统计表](https://link.zhihu.com/?target=http%3A//baike.baidu.com/item/%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8/11036046)以及[斐波纳契](https://link.zhihu.com/?target=http%3A//baike.baidu.com/item/%25E6%2596%2590%25E6%25B3%25A2%25E7%25BA%25B3%25E5%25A5%2591)数列数字中，均有这个定律的身影。

\


数学家经过验证后得出的概率统计分布函数如下： 在 a 进位制中，以数 n 起头的数出现的机率为 **(loga(n + 1) − loga(n))。**&#x20;

在我们通常使用的十进制下首位数字的出现概率分布如下：

![](https://pic1.zhimg.com/50/v2-6d93184466f7732b677558444333ba95_720w.jpg?source=2c26e567)

也行有同学要问，为什么没有 0 开头的数据。事实上，任何数字如果缩小一位来看都是以 0 开头的，因此我们其实可以认为 0 开头的数字出现概率为 100%。

有外国人就这个现象给出了有一定参考意义的数学解释，有兴趣的同学可以看这里：[Benford\&amp;amp;amp;amp;amp;amp;amp;amp;amp;#x27;s Law -- from Wolfram MathWorld](https://link.zhihu.com/?target=http%3A//mathworld.wolfram.com/BenfordsLaw.html)

本福特定律不但适用于[个位数字](https://link.zhihu.com/?target=http%3A//baike.baidu.com/item/%25E4%25B8%25AA%25E4%25BD%258D%25E6%2595%25B0%25E5%25AD%2597)，连多位的数也可用。  **这使得金融界开始考虑本福特法则在财务数据中的应用。经过实证验证，公司的财务报表数据在大样本数据下也符合本福特法则。**&#x20;

我曾经读过的一本书中列举了迪士尼公司和爆出巨大会计丑闻的[安然公司](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=1\&q=%E5%AE%89%E7%84%B6%E5%85%AC%E5%8F%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLlronnhLblhazlj7giLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.9iV2bAiRdQwAjtHcpuj65SHftq8rla3mll9hyq5RUjE\&zhida_source=entity)之间根据历史所有财务数据通过本福特法则发现的差异，如下：

![](https://picx.zhimg.com/50/v2-66b380223940628b3d78dc4ceac24052_720w.jpg?source=2c26e567)

很明显，安然的财务数据与本福特法则的数据出现了比迪士尼更大的偏差，而且其偏差体现为小于 5 的数字偏少而大于 5 的数字偏多，这暗示了公司通过人工扭曲数据导致数据偏离了本福特法则应有的分布情况。

## 在我了解到这个神奇的本福特法则后，我第一反应就是想将其实验于我们 A 股市场中的上市公司，判断其是否适用，以及能否帮助我们探测出公司的财务造假。而且我的确这么做了。

我取用了大家公认的管理层诚信、业绩优良的两家好公司：贵州茅台、中国平安，取了其过去 10 年的利润表数据，对这些数据的首位数字分布进行了测试，并用差异的平方和作为累计征服差异的统计目标值。结果如下：

**[中国平安](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=2\&q=%E4%B8%AD%E5%9B%BD%E5%B9%B3%E5%AE%89\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLkuK3lm73lubPlrokiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.TVaH1wfOTFFDkz-hLiHo3ITD1CRz72paGBHpvhBmO-M\&zhida_source=entity)：**

![](https://picx.zhimg.com/50/v2-ebf0a1f232b5ba7e11e87b3b9d43cbc6_720w.jpg?source=2c26e567)

\


图表化分布情况：

![](https://pic1.zhimg.com/50/v2-50f3768212a369097db8278aca10252f_720w.jpg?source=2c26e567)

\


&#x20;**贵州茅台：**&#x20;

![](https://pic1.zhimg.com/50/v2-feb12030e1ec7ed519376806289dd979_720w.jpg?source=2c26e567)

图表化分布情况：

![](https://picx.zhimg.com/50/v2-1131b82ff39733f7fbde6f97809c43fa_720w.jpg?source=2c26e567)

\


**看来只要是数字就无法逃脱本福特定律的限定**，从 A 股的这两家公司 10 年的理论表来看，[本福特定律](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=3\&q=%E6%9C%AC%E7%A6%8F%E7%89%B9%E5%AE%9A%E5%BE%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLmnKznpo_nibnlrprlvosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.W6HZXI9S6X02ejdjXYFdTZIfa6_thvi16N5fK5tHE7c\&zhida_source=entity)显然十分适用。而且考虑到 10 年的利润表其实只有不到 300 个样本点，因此能够拟合到这个程度的报表可以说应该是会计质量比较优秀的公司了。

根据我后续的大量实证检测，**大部分 A 股公司与本福特定律的偏差额（差异平方和）在 0.1-0.8% 之间**，而平安和茅台都在这个范围的下限附近。从这里也可以看出，这两家公司的确是非常优秀，而且财务会计数据非常真实可靠。

\


那么在 A 股中，我们是否也可以利用本福特法则发现造假的公司呢？我们也来验证一下吧。

我们挑选出几家 A 股历史上臭名昭著的造假或嫌疑造假公司进行本福特定律的验证，分别是信威集团（柬埔寨电信业务造假被质疑）、獐子岛（扇贝游来游去）、[尔康制药](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=1\&q=%E5%B0%94%E5%BA%B7%E5%88%B6%E8%8D%AF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLlsJTlurfliLboja8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.MyQvh0PSwAen-sqtMoGnzr2bj30eOjqyP4LETp0vsXI\&zhida_source=entity)（证监会进驻调查涉嫌严重造假）、雅百特（已被证明利润表注水 70%，董事长公开撒谎）。结果如下：

&#x20;**信威集团：**&#x20;

![](https://pica.zhimg.com/50/v2-62a99526e7c9a9179449784fe93ddff8_720w.jpg?source=2c26e567)

\


**[獐子岛](https://zhida.zhihu.com/search?content_id=61382710\&content_type=Answer\&match_order=2\&q=%E7%8D%90%E5%AD%90%E5%B2%9B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzQsInEiOiLnjZDlrZDlspsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2MTM4MjcxMCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ._-dE2bdQRF_Btw6BHWzOWQIJWFXyDkyx6lWfz78_LZc\&zhida_source=entity):**

![](https://pic1.zhimg.com/50/v2-6b2ef6950b6bb4947c3c81009cf95a8b_720w.jpg?source=2c26e567)

\


&#x20;**尔康制药：**&#x20;

![](https://picx.zhimg.com/50/v2-b9ace50395e5bde4fd8d1f293c901f4d_720w.jpg?source=2c26e567)

\


**雅百特:**

![](https://picx.zhimg.com/50/v2-f1b30b489d34a2c798df93797ef79f41_720w.jpg?source=2c26e567)

\


可以看出，这些公司财务数据的分布和本福特定律期望分布之间存在较大的差异，与一般上市公司的差异呈现出明细的不同。尤其是某些数字和定律之间的差异甚至能超过 10%，这是非常明细的异常情况。

这从数学的角度说明了这些公司财务数据造假的情况基本属实。而且从这个角度来看，偏差的比例越大可能说明造假的程度越大。

\


但请注意，本福特法则不是万能的。当造假者本身知道本福特法则时，他们就可以通过操纵首位数字，使得自己在造假的同时不会被发现财务数据与本福特法则呈现重大差别。因此，我们在实务中使用本福特法则一般秉承如下的原则： **大幅度偏离本福特法则基本是骗子，而没有偏离本福特法则未必是好人，也有可能是高明的骗子。**&#x20;

但这也足够帮助我们在对公司进行评价时多一个考察的维度，以判断其业务的真实性。

\


Rain 的金融投资漫谈：

[如何确定未上市企业的利润真实性？ - 知乎](https://www.zhihu.com/question/20365173/answer/162606322)\
[如何阅读上市公司的年报？有哪些较好的方法？ - 知乎](https://www.zhihu.com/question/20163489/answer/160926126)\
[初入金融行业，如何进行实用行业研究与行业分析？ - 知乎](https://www.zhihu.com/question/30051013/answer/169087583)\
[PE （市盈率）是什么意思？ - 知乎](https://www.zhihu.com/question/20245733/answer/193139303)\


如果喜欢，请关注我的微信公众号：泛舟聊投资
