---
title: 特想了解量化，量化究竟是怎么样的呢？能不能具体描述？另外，量化技能需要掌握什么？
date: 2024-10-04T15:15:04.972Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //www.zhihu.com/question/33420591/answer/56449914
---
私以为，量化包含的领域很广。我试着尽可能列举量化在现代金融的应用，并尽可能真实。

按大类来分，个人认为至少可以分为 4 类：1) Q-measure Quant, 2) 风险计量，3) 量化投资策略研发和 4) 高频交易。

1\) Q-measure Quant. 主要为各种奇异衍生品的定价提供支持，2008 年金融危机之前在美国（乃至全球）市场上非常牛逼的一群人。各种奇异衍生品的标的包括但不仅限于利率、权益、信用、货币和商品。这类 Quant 主要为 Trading desk 提供定价支持和风控模型。其主要基于[风险中性定价](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E9%A3%8E%E9%99%A9%E4%B8%AD%E6%80%A7%E5%AE%9A%E4%BB%B7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLpo47pmankuK3mgKflrprku7ciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.EgfOlK2Eddkar_M5uP0vJUljDrt3HmbBAipo2ps4Pjo\&zhida_source=entity)(risk neutral pricing) 假设，利用各种理论和数值方法例如 PDE, Monte Carlo simulations 等建模。2008 年金融危机之后，随着全球复杂衍生品市场的萎缩和监管的加强，这类 Quant 的需求急剧减少。 因为这类 Quant 所需的数学能力极高，在美国主要招名校的数学和物理类 PhD. 中国市场上的衍生品在渐渐变多，2015 年 2 月场内期权（上证 50ETF 期权）终于挂牌，预计今年还将相继有以沪深 300、中证 500（中金所）及创业板 ETF（深交所）等各种标的的场内期权上市，这些标准衍生品的陆续上市都为国内复杂衍生品提供了对冲手段，未来复杂衍生品的发展大有可为。 我自己只是金融工程小硕，只学了一些随机过程和数值方法的皮毛，只能对一些简单标的（权益类）、简单结构（Bull Spreads, 鲨鱼鳍之类）的衍生品的进行定价，对波动率的学习也是[浅尝辄止](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E6%B5%85%E5%B0%9D%E8%BE%84%E6%AD%A2\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLmtYXlsJ3ovoTmraIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.jzkpkI-8CUOm9ixmwW5B0UtjEObQf6jPyC4Kl9iBKwM\&zhida_source=entity)。目测国内到目前为止衍生品人才的需求（相比其他几类量化人才）不是很大，衍生品人才的供给就更少了，真心想走这条路最好出国读金融数学 PhD.

2\) 风险计量。风险按大类可以分为市场风险、信用风险和操作风险等等，这几类风险特征迥异。 市场风险就是二级市场的投资带来的风险，所以市场风险的计量需要对前台交易的各种头寸的风险特征和定价方法（如果有交易复杂衍生品的话）有深入的了解，所需技能和前台投资部门比较相似。我自己在某 Top 10 券商自营部门工作，跟我们部门对接的风险管理部门的哥们水平挺高的，显然是金工出身，不过他们的工作显然比我们投资部门要轻松不少…… 走这条路建议金工背景 + 考 FRM（这是底配了），不过，说老实话，所有的金融机构招风险管理的人都比较少…… 信用风险是商业银行的主要风险，主要工作是建立模型预测 PD 啦，EAD 和 LGD 也有模型不过可以玩的花样不多 —— 如果各位稍微学过一点金融风险管理、学过[巴塞尔协议](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E5%B7%B4%E5%A1%9E%E5%B0%94%E5%8D%8F%E8%AE%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlt7TloZ7lsJTljY_orq4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.zWHQBJ4QYrpCI6s-BU9tXn0sxJOMlUVpmRTg2i28ak8\&zhida_source=entity)的，应该都记得 PD\*EAD\*LGD 是什么意思吧！另外高级一点就是自建风险资本模型来代替巴塞尔协议指定的模型，以达到为银行节约资本计提的目的。我自己没在商业银行工作过，不知他们怎么招聘的…… 操作风险就不说了，因为案例各不相同，其实挺难量化的。

3\) [量化投资](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=2\&q=%E9%87%8F%E5%8C%96%E6%8A%95%E8%B5%84\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLph4_ljJbmipXotYQiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.wlArge4gJZykugJerP3gR6FLEZU3j2CsxO2cktRm-rs\&zhida_source=entity)策略研发。毫无疑问这是目前我国市场上需求最旺盛的一类[量化金融](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E9%87%8F%E5%8C%96%E9%87%91%E8%9E%8D\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLph4_ljJbph5Hono0iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.ZdFnlAZJb3lbVQLkOry2okcXOaDXT3xMydlAQrxQSGU\&zhida_source=entity)工作，甚至不少人会直接把 “量化” 一词等同于此，所以我就多写一点咯。注意以下的分类彼此可能没有绝对的界限，也就是说可能会有交叉、重合的地方。 3.1 Alpha 策略 —— 顾名思义就是寻找股票市场上的 Alpha（超额收益）。一大批机构投资者，包括公募基金（旗下的指数增强基金或纯[量化基金](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E9%87%8F%E5%8C%96%E5%9F%BA%E9%87%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLph4_ljJbln7rph5EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.tNmnZAltWybIPqeS-sCbTFgcqaqJJEpI1Yvp_6iYESs\&zhida_source=entity)）、券商自营和很多私募基金都把大量精力投注在这类策略上。这类策略一般是做多一篮子有超额收益的股票，同时做空[股指期货](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E8%82%A1%E6%8C%87%E6%9C%9F%E8%B4%A7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLogqHmjIfmnJ_otKciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.x4-7Q2WLG93E_gYkNP_f7otbCN-2ounswlF5C70CCyM\&zhida_source=entity)，两者之差带来绝对收益 —— 即无论牛市还是熊市，这类策略都可以带来稳定的收益。因为中国股市（除了创业板之外）在 2010\~2013 年的漫漫熊途，所以很多投资者青睐这类策略。 因为市场上的 Alpha 策略和 “多因子策略” 是近义词。我就拿多因子来举例好了，因子至少可以划分为：规模（大盘 vs 小盘）、市场（例如动量或流动性）、成长、估值、盈利能力、经营能力等这么多维度。当然这些维度未必是彼此垂直的，可能是线性相关的。*Fama-French 的三因子模型（beta、规模、估值）或 Cahart 的[四因子模型](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E5%9B%9B%E5%9B%A0%E5%AD%90%E6%A8%A1%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlm5vlm6DlrZDmqKHlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.YHUPbueEsoQGvYb4FBnLftQB2uQiVDFLZYFEbINEEKk\&zhida_source=entity)（加入了动量）是这类模型的学术基石。* 国内的卖方研报中讨论[多因子模型](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E5%A4%9A%E5%9B%A0%E5%AD%90%E6%A8%A1%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlpJrlm6DlrZDmqKHlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.0-TugGUMx8gdjl3PEhxRBK3WHIweLbFrxKf9oY66WHo\&zhida_source=entity)的可谓数不胜数，要入门的话，看研报很快嘿。 做这类研究嘛，不需要太高深的数学或编程技能，Matlab 会用 cell 就可以上手开搞了。不过对于会计知识要有起码的掌握，财报都看不懂怎么搞多因子你说是不！ 3.2 事件驱动策略 —— 例如基于重组、并购、分红送转、[定向增发](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E5%AE%9A%E5%90%91%E5%A2%9E%E5%8F%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlrprlkJHlop7lj5EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.jxadycEx183YxxpiGOGt8srnXLu376BxtR5CkngtKLw\&zhida_source=entity)、大股东增持、业绩预告，甚至投资者调研之类的对股价会产生重大影响的事件构建投资策略。对于数据库提供了充足数据的，往往是市场上人尽皆知的，所以很难带来超额收益，或是一个新闻刚出股价就涨停了，你想买也买不进去。因此，探索新的事件类型是超额收益的来源 —— 因此需要掌握网页爬虫 /[文本挖掘](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E6%96%87%E6%9C%AC%E6%8C%96%E6%8E%98\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLmlofmnKzmjJbmjpgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.7vLqCea2DfVyvS7jSYCGBY-jONikLrhZOtwsFI82JPk\&zhida_source=entity)的能力。 3.3 大数据选股 —— 目前最火的 “[新闻大数据](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E6%96%B0%E9%97%BB%E5%A4%A7%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLmlrDpl7vlpKfmlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.LN5mqxGButEGmy8kIEXnalxEHtAYmsHicIa6hLorPso\&zhida_source=entity)选股”、“舆情选股” 或 “冷门股选股”，乃至最近[阿里巴巴](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLpmL_ph4zlt7Tlt7QiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.hWdhGInptB1NuTODfIXpIrmBxeS3w0CvmvaxG-rKTc4\&zhida_source=entity)推出的淘金 100 指数（电商大数据），回测数据都很牛逼，不过因为样本外历史都很短，以后牛不牛还不知道。考虑到大数据数据库搭建的困难性，目前一般金融机构是与各互联网公司合作，由互联网公司搭建大数据的数据库（类似 Wind），并提供接口给金融机构使用，金融机构能开发出什么策略，既取决于数据源的独特性、也要看金融机构自己策略开发的水平。

我虽然在上文说对于 Alpha 策略，“Matlab 会用 cell 就可以上手开搞了”，但良好的编程能力才能保证策略的高效开发。毕竟，目前 A 股市场上有 2600 多只股票，随便再分几个因子维度的数据，数据量都是极大的。何谓良好的编程能力呢？我认为就是，利用你（运算和内存）有限的计算机性能、能快速处理和分析你想分析的数据并得到结论。如果处理高手只需要几分钟的数据集你需要好几个小时，那开发策略的效率显然很低，恩后果我就不细说了。 以上的例子都是中国 A 股市场的，但其实量化投资策略的开发并不局限于权益类市场，商品、货币、利率等显然也可以大量运用量化的投资方法。

4\) [高频交易](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=2\&q=%E9%AB%98%E9%A2%91%E4%BA%A4%E6%98%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLpq5jpopHkuqTmmJMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.dbg4k3W2GVTk1i6mCJs9cpT8pwl_RID_EFE1gmcSkFE\&zhida_source=entity)。高频交易至少可以包括做市 (market making) 和套利 (arbitrage) 两类。在美国市场上，做市是主流的 HFT 业务。 4.1 做市是指，在市场上提供流动性，也就是说任何交易者在市场上想买一样东西（例如股票、例如期权）做市商要保证能提供一个报价卖给他；任何人要卖一样东西，做市商要保证能提供一个报价买下来。也就是说，做市商是所有交易者的交易对手。 与美国股市不同，中国 A 股市场和期货市场都是没有做市商的，所有 A 股和国内期货的投资者的交易对手是其他投资者。 目前唯一有做市商的集中交易市场是[场内期权市场](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E5%9C%BA%E5%86%85%E6%9C%9F%E6%9D%83%E5%B8%82%E5%9C%BA\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlnLrlhoXmnJ_mnYPluILlnLoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.ExYDD6DtzJMEqq5KFHMtT8KN6FTLVhMvHcgBe_J1yCo\&zhida_source=entity)——2015 年 2 月上证 50ETF 期权在上交所挂牌，上证 50ETF 期权的做市商最早有 8 家券商。而对于这 8 家券商来说，[场内期权](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=4\&q=%E5%9C%BA%E5%86%85%E6%9C%9F%E6%9D%83\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLlnLrlhoXmnJ_mnYMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjQsInpkX3Rva2VuIjpudWxsfQ.rETO2hjapsOPqmMyUmMP9Y8y7u_og_48ViDXrVxa_f0\&zhida_source=entity)做市对他们的考验和挑战是极大的。以前，券商只需要投投资者提供来自交易所的行情即可，买卖的价格是市场所有投资者整体决定的；而当券商的角色变为做市商，券商就需要自己（通过计算）对期权给出报价，并高速地（自动化地）提供给全市场的投资者。这一过程完全是自动化交易，对做市券商的 IT 能力和衍生品定价能力要求极高。 而作为做市商，最大的难处是，必须保证市场的流动性。只要是[自动化交易](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=2\&q=%E8%87%AA%E5%8A%A8%E5%8C%96%E4%BA%A4%E6%98%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLoh6rliqjljJbkuqTmmJMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.KYhVWH2WYsf1WN67zIB-kA7zBnwckajsEoDHnmYS1uE\&zhida_source=entity)，就难免出 bug，对于一个普通的投资者来说，交易程序出了 bug 那就暂停交易、等 bug 修复了再交易即可；而期权做市商如果出了 bug、停止向市场提供报价，就会被交易所认为没有履行好做市商的义务，事情就不妙了…… 据这篇新闻（[上交所再次为期权做市商打分获 AA 评级仅剩国泰君安](https://link.zhihu.com/?target=http%3A//www.indexfunds.com.cn/html/news/35864.html)）——4 月中旬，上交所对广发证券、国泰君安、海通证券、华泰证券、[齐鲁证券](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=1\&q=%E9%BD%90%E9%B2%81%E8%AF%81%E5%88%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLpvZDpsoHor4HliLgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.muJ5nfitH0haUjqCiK77TfeXNGL-EGUGiBZMF4TN9ks\&zhida_source=entity)、招商证券、中信证券 7 家证券公司的评价结果均为 AA，东方证券的评价结果为 A。而到了 4 月 29 日，上交所公布对上证 50ETF 期权做市商在 3 月 26 日至 4 月 20 日期间的评价结果中，国泰君安仍获得 AA 评价，[华泰证券](https://zhida.zhihu.com/search?content_id=17987540\&content_type=Answer\&match_order=2\&q=%E5%8D%8E%E6%B3%B0%E8%AF%81%E5%88%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDMsInEiOiLljY7ms7Dor4HliLgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzk4NzU0MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.6r3_aAgqAmm5Wm8gGt7ePxH22-2KeO1xgPjvRr9rQsc\&zhida_source=entity)、齐鲁证券、招商证券 3 家证券公司的评价结果为 A，广发证券、海通证券、中信证券等 3 家证券公司的评价结果则为 C。 咳咳，期权做市业务目前据我所知还不挣钱，这里的 8 个玩家都是为未来做准备的大券商，都投入了大量心血（钱 + 人才）。未来会怎么样，还不知道，咱们等着瞧吧。 说了这么多废话，在我司的期权做市团队，清一色全是有扎实的计算机功底的人才，开发高频交易系统最重要的就是要快，所以丰富的 C++ 开发经验是必须的。

4.2 套利，就是找到两种相关性强或者本质相同的证券，如果两者的价格出现了偏离，那么买低卖高然后坐等两者的价格收敛从而获利。ETF 套利就是一个极好的例子。套利听起来很美，实际上竞争非常激烈，因为任何人都可以参与套利，而参与的人多了、套利机会就少了。当套利收入不足以支撑高频交易的研发维护成本的时候，就没人玩了。

国内做 ETF 套利目前比较有名的，是道冲投资（总部位于福州，够奇葩吧），以其道冲 1 号的净值为例（链接[道冲基金 - ETF 专家](https://link.zhihu.com/?target=http%3A//www.daochong.com.cn/article_3262.html)），2014 年 8 月 28 日成立时净值 0.994（我估计是先扣了 0.006 的管理费），到 2015 年 4 月 30 日净值已达 3.147…… 而且过程中几乎没有回撤，不得不说真强…… 不过其资金量数据看不到，推测这么高的收益资金量不是很大。