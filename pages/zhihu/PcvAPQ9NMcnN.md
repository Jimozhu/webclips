---
title: 有哪些网站用爬虫爬取能得到很有价值的数据？
date: 2024-10-04T15:28:38.037Z
categories:
  - zhihu
tags:
  - zhihu
  - 什么
origin_url: //www.zhihu.com/question/36132174/answer/70798699
---
2015.11.14

更新神器：

1\. 下面提到的 Quandl 网站有一个他们自己的 Python 库，叫 Quandl，可惜也是收费的。

> pip install Quandl

2\.

[TuShare - 财经数据接口包](https://link.zhihu.com/?target=http%3A//tushare.org/fundamental.html%23id4)

国内好心人做的开源财经数据接口（觉得好的可以捐助一下）。这里几乎可以获取到 A 股的所有信息了，还包括一些经济数据。重点是他不仅免费，还提供了一个 Python 库 tushare。

> pip install tushare\
> \
> import tushare as ts

\


这样一来你便可以通过这个库方便地获取大量 A 股信息了。

\


—————————————— 以下为原答案 ——————————————

一大波数据来袭！

题主问了有什么网站，能用来做什么。我给出几个 API 网站吧，做 APP 用的可能比较多，不过也可以用在日常生活中。

\
\


**一、生活服务**

\
\


1\. 手机话费充值。

[手机话费充值数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/110)\


2\. 天气查询。

[天气查询数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/19)\


3\. 快递查询。

[快递查询服务数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/133)\


4\. 健康食谱。

[健康食谱数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/54)\


5\. 查医院。

[医院大全数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/43)\


6\. 水电煤缴费。

[水电煤缴费数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/114)\


7\. 电影大全。

[电影大全数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/29)\


8\. 谜语、歇后语、脑筋急转弯。

[猜一猜数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/86)\


9\. 音乐搜索。

[音乐搜索接口数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/140)\


10\. 健康知识。

[健康知识数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/44)\


11\. 百度糯米、团购等信息。

[糯米开放 api 数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/68)\


12\. 彩票开奖。

[彩票开奖查询数据服务](https://link.zhihu.com/?target=http%3A//www.apix.cn/services/show/121)\
\


以上接口都来自网站：

[APIX\_国内领先的云数据服务平台\_API 接口服务平台](https://link.zhihu.com/?target=http%3A//www.apix.cn/)\


细心 的人会发现，这些功能简直是遍地都是啊，支付宝、微信什么的一大堆，哪用那么麻烦！

是的，但我相信这些可能为一些不太了解相关信息的人提供了帮助。不过，虽然这些功能很多 APP 都有，如果自己有空闲时间又懂得编程，不喜欢别人的 UI 设计，自己做一做也是挺好玩的。比如：

生活枯燥了，把这些谜语歇后语等根据个人喜好定时推送到自己的手机，放松身心；

把一些健康小知识在空闲时间推送给自己，提醒自己；

……

国内类似的网站还有：

[API 数据接口\_开发者数据定制](https://link.zhihu.com/?target=https%3A//www.juhe.cn/)[API Store\_为开发者提供最全面的 API 服务](https://link.zhihu.com/?target=http%3A//apistore.baidu.com/)\
[API 数据接口\_免费数据调用 - 91 查 | 91cha.com](https://link.zhihu.com/?target=http%3A//www.91cha.com/)\
\


除此之外还有一些门户网站提供了一些 API 接口，比如豆瓣、新浪、百度等等。

\
\


**二、金融数据**

\


**1**. 股票

①新浪财经

最多人用的就是新浪财经了，因为它是免费的，并且使用起来也不难。以下是网上找的教程：

[获取历史和实时股票数据接口](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/seacryfly/articles/stock.html)\


②[东方财富](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLkuJzmlrnotKLlr4wiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.ZrlB7_usHc475__PsOc5zPFR983pVX1gqOzgIJZglXU\&zhida_source=entity)网

网站提供了大量信息，也是基本面投资者的好去处。可以查看财务指标或者根据财务指标选股（如[净资产收益率](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E5%87%80%E8%B5%84%E4%BA%A7%E6%94%B6%E7%9B%8A%E7%8E%87\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLlh4DotYTkuqfmlLbnm4rnjociLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.CPGhX8ORVtT7lqPQhqdXsCuxzJzGCRY2zB9A6ReRA30\&zhida_source=entity)）：

[选股器 \_ 数据中心](https://link.zhihu.com/?target=http%3A//data.eastmoney.com/xuangu/%23Yz1beWxubDAxKDF8MC4wNSldfHM9eWxubDAxKDF8MC4wNSl8c3Q9LTE%3D)

。这些都是很好的投资参考，当然还有其它功能有对应的 API，可以自己分析一下。

③中财网

[http://data.cfi.cn/cfidata.aspx](https://link.zhihu.com/?target=http%3A//data.cfi.cn/cfidata.aspx)

提供各种产品的数据

\


（国内很多功能类似网站，如和讯、网易财经、[雪球](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E9%9B%AA%E7%90%83\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLpm6rnkIMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.NTIpZ7Vdq3ZJCzrNX-ma7ckXwZoZQtgiTH-03APhx6U\&zhida_source=entity)等等，具体的我没有一一试验就不放上来了，各位可以自己去试试，下同。）

\


**2**.[大宗商品](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E5%A4%A7%E5%AE%97%E5%95%86%E5%93%81\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLlpKflrpfllYblk4EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.oCRRjSA5s2jq5GhqKp7epx15uMxwblEe-SqIo8iP-c0\&zhida_source=entity)

①

[黄金头条 —— 用资讯帮你赚钱！炒黄金，看黄金头条！黄金价格](https://link.zhihu.com/?target=http%3A//www.goldtoutiao.com/)

这里提供了各种大宗商品的行情，也可以分析获取。包括技术分析方面。

②当然还有外国网站：

[Investing.com](https://link.zhihu.com/?target=http%3A//www.investing.com/)\
\
\


**3**. 美股等综合类（其实新浪财经和东方财富等也算是国内综合的了，就不一一列举了）

①Wind 资讯。很多机构用的都是这里的数据，当然普通个人是拿不到的，不过如果你是财经院校的学生，他们会提供免费的数据。详见官网。

②

[Market Data Feed and API](https://link.zhihu.com/?target=http%3A//www.xignite.com/)\


外国网站，提供了大量数据，付费。有试用期。

③

[Quandl Financial and Economic Data](https://link.zhihu.com/?target=https%3A//www.quandl.com/)\


同上。部分免费。

④

[96 Stocks APIs: Bloomberg, NASDAQ and E\*TRADE](https://link.zhihu.com/?target=http%3A//www.programmableweb.com/news/96-stocks-apis-bloomberg-nasdaq-and-etrade/2013/05/22)\


外国网站整合的 96 个股票 API 合集，可以看看。

⑤雅虎财经

[http://www.finance.yahoo.com/](https://link.zhihu.com/?target=http%3A//www.finance.yahoo.com/)[https://hk.finance.yahoo.com/](https://link.zhihu.com/?target=https%3A//hk.finance.yahoo.com/)\


香港版

\
\


**三、其它**

\


撇去上面的 API 不说，如果单单爬取网页上的内容下来，那就太多可以爬的了。如：

**1**. 爬取网站上的图片。包括贴吧、知乎、Tumblr、轮子哥、XXX（你懂的）。

**2**. 爬取影评、[电影资讯](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E7%94%B5%E5%BD%B1%E8%B5%84%E8%AE%AF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLnlLXlvbHotYTorq8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.uXSEYF5xITs0cti35vxuZ2JQlLhoG_NwZge_omLwz5w\&zhida_source=entity)、图书等等。比如豆瓣电影。轻轻松松掌握好书好电影。

**3**. 爬取社交网络。比如新浪微博，Twitter。（Twitter 提供了 API，可以提交关键字等信息爬取搜索结果中的每一条内容。）爬完可以对整个社交网络群体做个分析，情绪、作息、区域……

**4**. 一些网站有你喜欢的文章或者帖子，但是他们没有 APP 或者是 APP 做得不友好，你可以直接爬取页面信息推送到手机上。

**5**. 做一个微信公众号。有了上面那么多数据，还怕公众号没东西？生活服务、选股器、[行情分析](https://zhida.zhihu.com/search?content_id=23740228\&content_type=Answer\&match_order=1\&q=%E8%A1%8C%E6%83%85%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MDgsInEiOiLooYzmg4XliIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyMzc0MDIyOCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.abqj9MZrFaTuVPTXLsSbsJOmyUqSeunGwqilKiDn54g\&zhida_source=entity)、文章推送等等等。

……

其它想到再更。
