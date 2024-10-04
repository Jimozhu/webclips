---
title: 有哪些「神奇」的数据获取方式？
date: 2024-10-04T15:30:37.700Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/32164316/answer/257865469
---
大数据时代，用数据做出理性分析显然更为有力。做数据分析前，能够找到合适的的数据源是一件非常重要的事情，获取数据的方式有很多种，不必局限。下面将从公开的数据集、爬虫、[数据采集工具](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLmlbDmja7ph4fpm4blt6XlhbciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.0cNwnVboeXuYfxJK7H0BMQBOsMGbUdfXlYOnIK7Yj08\&zhida_source=entity)、付费 API 等等介绍。给大家推荐一些能够用得上的数据获取方式，后续也会不断补充、更新。

## **一、公开数据库**

**1. 常用数据公开网站**

[UCI](https://link.zhihu.com/?target=http%3A//archive.ics.uci.edu/ml/datasets.html)：经典的机器学习、[数据挖掘](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E6%95%B0%E6%8D%AE%E6%8C%96%E6%8E%98\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLmlbDmja7mjJbmjpgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.-tWH31Fkd6qn1bSDhb9sQkW_K5E1ZiwaDYfwn5XOyLg\&zhida_source=entity)数据集，包含分类、聚类、回归等问题下的多个数据集。很经典也比较古老，但依然活跃在科研学者的视线中。

![](https://picx.zhimg.com/50/v2-5f1b98414f7123b60d2f523014bed3e1_720w.jpg?source=2c26e567)

[国家数据](https://link.zhihu.com/?target=http%3A//data.stats.gov.cn/index.htm)：数据来源中华人民共和国国家统计局，包含了我国经济民生等多个方面的数据，并且在月度、季度、年度都有覆盖，全面又权威。

![](https://picx.zhimg.com/50/v2-d91c584daed5e8d47071a33471251a54_720w.jpg?source=2c26e567)

[CEIC](https://link.zhihu.com/?target=http%3A//www.ceicdata.com/zh-hans)：最完整的一套超过 128 个国家的经济数据，能够[精确查找](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%B2%BE%E7%A1%AE%E6%9F%A5%E6%89%BE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnsr7noa7mn6Xmib4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Swz0TJWjf6ow8c6Mf9jziHtgMMrhjCxsrQinlOkLdkM\&zhida_source=entity)GDP、CPI、进口、出口、外资直接投资、零售、销售以及国际利率等深度数据。其中的 “中国[经济数据库](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%BB%8F%E6%B5%8E%E6%95%B0%E6%8D%AE%E5%BA%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnu4_mtY7mlbDmja7lupMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.d3RUyLDcpK4ty66suJBmvVaxWhRYHdpQdn82cQO0tLg\&zhida_source=entity)” 收编了 300,000 多条[时间序列数据](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E6%97%B6%E9%97%B4%E5%BA%8F%E5%88%97%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLml7bpl7Tluo_liJfmlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.yjPqWi2cXsfZrWR3Z_68Ym-8JjOK1VYqA3vzxwZluWQ\&zhida_source=entity)，数据内容涵盖宏观经济数据、行业经济数据和地区经济数据。

![](https://picx.zhimg.com/50/v2-a6e5237a79011a033f25aa5492ff9de3_720w.jpg?source=2c26e567)

[万得](https://link.zhihu.com/?target=http%3A//www.wind.com.cn/)：简要介绍：被誉为中国的 Bloomberg，在金融业有着全面的数据覆盖，金融数据的类目更新非常快，据说很受国内的商业分析者和投资人的亲睐。

![](https://pica.zhimg.com/50/v2-f61d3a32166fb66d94c7b05e98615077_720w.jpg?source=2c26e567)

[搜数网](https://link.zhihu.com/?target=http%3A//www.soshoo.com/index.do)：已加载到搜数网站的统计资料达到 7,874 本，涵盖 1,761,009 张统计表格和 364,580,479 个统计数据，汇集了中国资讯行自 92 年以来收集的所有统计和调查数据，并提供多样化的搜索功能。

![](https://picx.zhimg.com/50/v2-644be1de083d136c72223f81d504ace1_720w.jpg?source=2c26e567)

[中国统计信息网](https://link.zhihu.com/?target=http%3A//www.tjcn.org/)：[国家统计局](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=2\&q=%E5%9B%BD%E5%AE%B6%E7%BB%9F%E8%AE%A1%E5%B1%80\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLlm73lrrbnu5_orqHlsYAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.x-ZF1TG9cRLAKa4lobgUHOoVcWAZZvlJ2DN2Q8OgjmI\&zhida_source=entity)的官方网站，汇集了海量的全国各级政府各年度的国民经济和社会发展统计信息，建立了以统计公报为主，统计年鉴、阶段发展数据、[统计分析](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%BB%9F%E8%AE%A1%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnu5_orqHliIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.MQ5yYbftGARc11FcyxrQPprn_7O12NbFp6_aDCkkc_E\&zhida_source=entity)、经济新闻、主要统计指标排行等。

![](https://pic1.zhimg.com/50/v2-5cfb2278d4811ae58c6890af538c1924_720w.jpg?source=2c26e567)

[亚马逊](https://link.zhihu.com/?target=http%3A//aws.amazon.com/cn/datasets/%3Fnc1%3Dh_ls)：来自亚马逊的跨科学云数据平台，包含化学、生物、经济等多个领域的数据集。

![](https://picx.zhimg.com/50/v2-f3ae4532919fc410e44b268c711c2180_720w.jpg?source=2c26e567)

[figshare](https://link.zhihu.com/?target=https%3A//figshare.com/)：研究成果共享平台，在这里可以找到来自世界的大牛们的研究成果分享，获取其中的研究数据。

![](https://pica.zhimg.com/50/v2-ba6b3a25af192aaccfd1da68d27161c2_720w.jpg?source=2c26e567)

[github](https://link.zhihu.com/?target=https%3A//figshare.com/)：一个非常全面的数据获取渠道，包含各个细分领域的数据库资源，自然科学和社会科学的覆盖都很全面，适合做研究和数据分析的人员。

![](https://pic1.zhimg.com/50/v2-2a81b2941cec4d505213cd3790897258_720w.jpg?source=2c26e567)

**2. 政府[开放数据](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E5%BC%80%E6%94%BE%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLlvIDmlL7mlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.chxfKg50B2B6zyz8yEBsEBbkUIi9HDjtseNCAJihCv4\&zhida_source=entity)**

[北京市政务数据资源网](https://link.zhihu.com/?target=http%3A//www.bjdata.gov.cn/index.htm)：包含竞技、交通、医疗、天气等数据。

[深圳市政府数据开放平台](https://link.zhihu.com/?target=http%3A//opendata.sz.gov.cn/)：交通、文娱、就业、基础设施等数据。

[上海市政务数据服务网](https://link.zhihu.com/?target=http%3A//www.datashanghai.gov.cn/)：覆盖经济建设、文化科技、信用服务、交通出行等 12 个重点领域数据。

[贵州省政府数据开放平台](https://link.zhihu.com/?target=http%3A//www.gzdata.gov.cn/)：贵州省在政务数据开放方面做的确实不错。

[Data.gov](https://link.zhihu.com/?target=https%3A//www.data.gov/)：美国政府开放数据，包含气候、教育、[能源金融](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E8%83%BD%E6%BA%90%E9%87%91%E8%9E%8D\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLog73mupDph5Hono0iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.GG6EVX2C7tVndVkDtBMxhVObOmwevuAkSG0MnZC7vVk\&zhida_source=entity)等各领域数据。

**3. 数据竞赛网站**

竞赛的数据集通常干净且科研究性非常高。

[DataCastle](https://link.zhihu.com/?target=http%3A//www.pkbigdata.com/common/cmptIndex.html)：专业的[数据科学](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E6%95%B0%E6%8D%AE%E7%A7%91%E5%AD%A6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLmlbDmja7np5HlraYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.2C6w1OJwgpfVjKI9zpdDDUwFNAqVDS3pjkDIUUESA4Q\&zhida_source=entity)竞赛平台。

[Kaggle](https://link.zhihu.com/?target=https%3A//www.kaggle.com/)：全球最大的数据竞赛平台。

[天池](https://link.zhihu.com/?target=https%3A//tianchi.aliyun.com/)：阿里旗下数据科学竞赛平台。

[Datafountain](https://link.zhihu.com/?target=http%3A//www.datafountain.cn/%23/)：CCF 制定大数据竞赛平台。

## **二、利用爬虫可以获得有价值数据**

这里给出了一些网站平台，我们可以使用爬虫爬取网站上的数据，某些网站上也给出获取数据的 API 接口，但需要付费。

**1.[财经数据](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E8%B4%A2%E7%BB%8F%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLotKLnu4_mlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.8LJ3ukb6DJ_KKU-9i8SXYeWf3_abMhO6HZLgsZiGeNg\&zhida_source=entity)**

（1）[新浪财经](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/seacryfly/articles/stock.html)：免费提供接口，这篇博客教授了如何在新浪财经上获取获取历史和实时股票数据。

（2）[东方财富网](https://link.zhihu.com/?target=http%3A//data.eastmoney.com/xuangu/%23Yz1beWxubDAxKDF8MC4wNSld)：可以查看财务指标或者根据财务指标选股。

（3）[中财网](https://link.zhihu.com/?target=http%3A//data.cfi.cn/cfidata.aspx)：提供各类财经数据。

（4）[黄金头条](https://link.zhihu.com/?target=https%3A//goldtoutiao.com/)：各种财经资讯。

（5）[StockQ](https://link.zhihu.com/?target=http%3A//stockq.cn/)：国际股市指数行情。

（6）[Quandl](https://link.zhihu.com/?target=https%3A//www.quandl.com/)：金融数据界的[维基百科](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnu7Tln7rnmb7np5EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.i4aGynUtp-90kUthcbTt6cl1okxVPr9TDZaRobFKor0\&zhida_source=entity)。

（7）[Investing](https://link.zhihu.com/?target=https%3A//www.investing.com/)：投资数据。

（8）[整合的 96 个股票 API 合集](https://link.zhihu.com/?target=https%3A//www.programmableweb.com/news/96-stocks-apis-bloomberg-nasdaq-and-etrade/2013/05/22)。

（9）[Market Data Feed and API](https://link.zhihu.com/?target=http%3A//www.xignite.com/)：提供大量数据，付费，有试用期。

**2. 网贷数据**

（1）[网贷之家](https://link.zhihu.com/?target=http%3A//shuju.wdzj.com/)：包含各大网贷平台不同时间段的放贷数据。

（2）[零壹数据](https://link.zhihu.com/?target=http%3A//data.01caijing.com/p2p/report/index.html)：各大平台的放贷数据。

（4）[网贷天眼](https://link.zhihu.com/?target=http%3A//www.p2peye.com/shuju/)：网贷平台、行业数据。

（5）[76676 互联网金融门户](https://link.zhihu.com/?target=http%3A//www.76676.com/html/product/listhome/)：网贷、P2P、理财等互金数据。

**3. 公司年报**

（1）[巨潮资讯](https://link.zhihu.com/?target=http%3A//www.cninfo.com.cn/cninfo-new/index)：各种股市咨询，公司股票、财务信息。

（2）[SEC.gov](https://link.zhihu.com/?target=https%3A//www.sec.gov/page/tmsectionlanding)：美国证券交易数据

（3）[HKEx news 披露易](https://link.zhihu.com/?target=http%3A//www.hkexnews.hk/listedco/listconews/advancedsearch/search_active_main_c.aspx)：年度业绩报告和年报。

**4. 创投数据**

（1）[36 氪](https://link.zhihu.com/?target=http%3A//36kr.com/)：最新的投资资讯。

（2）[投资潮](https://link.zhihu.com/?target=http%3A//www.investide.cn/)：投资资讯、上市公司信息。

（3）[IT 桔子](https://link.zhihu.com/?target=https%3A//www.itjuzi.com/investevents/)：各种创投数据。

**5. 社交平台**

（1）[新浪微博](https://link.zhihu.com/?target=http%3A//weibo.com/)：评论、舆情数据，社交关系数据。

（2）[Twitter](https://link.zhihu.com/?target=http%3A//www.twitter.com/)：舆情数据，社交关系数据。

（3）[知乎](https://www.zhihu.com/)：优质问答、用户数据。

（4）[微信公众号](https://link.zhihu.com/?target=http%3A//weixin.qq.com/)：公众号运营数据。

（5）[百度贴吧](https://link.zhihu.com/?target=https%3A//tieba.baidu.com/index.html)：舆情数据

（6）[Tumblr](https://link.zhihu.com/?target=http%3A//mashable.com/category/tumblr/)：各种福利图片、视频。

**6. 就业招聘**

（1）[拉勾](https://link.zhihu.com/?target=https%3A//www.lagou.com/)：互联网行业人才需求数据。

（2）[中华英才网](https://link.zhihu.com/?target=http%3A//campus.chinahr.com/)：招聘信息数据。

（3）[智联招聘](https://link.zhihu.com/?target=http%3A//ts.zhaopin.com/jump/index_new.html%3Fsid%3D121113803%26site%3Dpzzhubiaoti1)：招聘信息数据。

（4）[猎聘网](https://link.zhihu.com/?target=https%3A//www.liepin.com/%3Fmscid%3Ds_00_pz1)：高端职位招聘数据。

**7. 餐饮食品**

（1）[美团外卖](https://link.zhihu.com/?target=http%3A//waimai.meituan.com/)：区域商家、销量、评论数据。

（2）[百度外卖](https://link.zhihu.com/?target=http%3A//waimai.baidu.com/waimai%3Fqt%3Dfind)：区域商家、销量、评论数据。

（3）[饿了么](https://link.zhihu.com/?target=https%3A//www.ele.me/home/)：区域商家、销量、评论数据。

（4）[大众点评](https://link.zhihu.com/?target=https%3A//www.dianping.com/)：点评、舆情数据。

**8. 交通旅游**

（1）[12306](https://link.zhihu.com/?target=http%3A//www.12306.cn/mormhweb/)：铁路运行数据。

（2）[携程](https://link.zhihu.com/?target=http%3A//www.ctrip.com/)：景点、路线、机票、酒店等数据。

（3）[去哪儿](https://link.zhihu.com/?target=https%3A//www.qunar.com/)：景点、路线、机票、酒店等数据。

（4）[途牛](https://link.zhihu.com/?target=http%3A//www.tuniu.com/)：景点、路线、机票、酒店等数据。

（5）[猫途鹰](https://link.zhihu.com/?target=https%3A//www.tripadvisor.cn/)：世界各地旅游景点数据，来自全球旅行者的真实点评。

类似的还有同程、[驴妈妈](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E9%A9%B4%E5%A6%88%E5%A6%88\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLpqbTlpojlpogiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.VaNtQc6kqV_EKeFML9EcVH40fmDm6fjkQ3LOc0uKF54\&zhida_source=entity)、途家等

**9. 电商平台**

（1）[亚马逊](https://link.zhihu.com/?target=https%3A//www.amazon.cn/)：商品、销量、折扣、点评等数据

（2）[淘宝](https://link.zhihu.com/?target=https%3A//www.taobao.com/)：商品、销量、折扣、点评等数据

（3）[天猫](https://link.zhihu.com/?target=https%3A//www.tmall.com/)：商品、销量、折扣、点评等数据

（4）[京东](https://link.zhihu.com/?target=https%3A//www.jd.com/)：3C 产品为主的商品信息、销量、折扣、点评等数据

（5）[当当](https://link.zhihu.com/?target=http%3A//www.dangdang.com/)：图书信息、销量、点评数据。

类似的唯品会、聚美优品、1 号店等。

**10. 影音数据**

（1）[豆瓣电影](https://link.zhihu.com/?target=https%3A//movie.douban.com/)：国内最受欢迎的电影信息、评分、评论数据。

（2）[时光网](https://link.zhihu.com/?target=http%3A//www.mtime.com/)：最全的影视资料库，评分、影评数据。

（3）[猫眼电影专业版](https://link.zhihu.com/?target=https%3A//piaofang.maoyan.com/dashboard)：实时票房数据，电影票房排行。

（4）[网易云音乐](https://link.zhihu.com/?target=http%3A//music.163.com/)：音乐歌单、歌手信息、音乐评论数据。

**11. 房屋信息**

（1）[58 同城房产](https://link.zhihu.com/?target=http%3A//cd.58.com/house.shtml%3Ffrom%3Dpc_topbar_link_house)：二手房数据。

（2）[安居客](https://link.zhihu.com/?target=https%3A//chengdu.anjuke.com/%3Fpi%3DPZ-baidu-pc-all-biaoti)：新房和二手房数据。

（3）[Q 房网](https://link.zhihu.com/?target=http%3A//qfang.com/)：新房信息、销售数据。

（4）[房天下](https://link.zhihu.com/?target=http%3A//www1.fang.com/)：新房、二手房、租房数据。

（5）[小猪短租](https://link.zhihu.com/?target=http%3A//www.xiaozhu.com/)：短租房源数据。

**12. 购车租车**

（1）[网易汽车](https://link.zhihu.com/?target=http%3A//auto.163.com/)：汽车资讯、[汽车数据](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E6%B1%BD%E8%BD%A6%E6%95%B0%E6%8D%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLmsb3ovabmlbDmja4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.8qXXjvIl8MZBYDqpzcoIJ5-SEtMQ-kLGIz8KZYULaro\&zhida_source=entity)。

（2）[人人车](https://link.zhihu.com/?target=https%3A//www.renrenche.com/)：二手车信息、交易数据。

（3）[中国汽车工业协会](https://link.zhihu.com/?target=http%3A//www.caam.org.cn/data/)：汽车制造商产量、销量数据。

**13. 新媒体数据**

[新榜](https://link.zhihu.com/?target=http%3A//www.newrank.cn/)：新媒体平台运营数据。

[清博大数据](https://link.zhihu.com/?target=http%3A//www.gsdata.cn/)：微信公众号运营榜单及舆情数据。

[微问数据](https://link.zhihu.com/?target=http%3A//wewen.io/)：一个针对微信的数据网站。

[知微传播分析](https://link.zhihu.com/?target=http%3A//www.weiboreach.com/)：微博传播数据。

**14. 分类信息**

（1）[58 同城](https://link.zhihu.com/?target=http%3A//cd.58.com/)：丰富的同城分类信息。

（2）[赶集网](https://link.zhihu.com/?target=http%3A//cd.ganji.com/)：丰富的同城分类信息。

如果你是小白，想通过爬虫获得有价值的数据，推荐我们的体系课程 ——[Python 爬虫：入门 + 进阶](https://link.zhihu.com/?target=https%3A//www.dcxueyuan.com/%3Fslxydc%3D87b0cc%23/classDetail/classIntroduce/17)

## **三、数据交易平台**

由于现在数据的需求很大，也催生了很多做数据交易的平台，当然，出去付费购买的数据，在这些平台，也有很多免费的数据可以获取。

[优易数据](https://link.zhihu.com/?target=http%3A//www.youedata.com/)：由国家信息中心发起，拥有国家级信息资源的数据平台，国内领先的数据交易平台。平台有 B2B、B2C 两种交易模式，包含政务、社会、社交、教育、消费、交通、能源、金融、健康等多个领域的数据资源。

![](https://picx.zhimg.com/50/v2-a13995e80f6781a528df908cae5ebc91_720w.jpg?source=2c26e567)

[数据堂](https://link.zhihu.com/?target=http%3A//www.datatang.com/)：专注于互联网综合数据交易，提供数据交易、处理和数据 API 服务，包含语音识别、医疗健康、交通地理、电子商务、社交网络、图像识别等方面的数据。

![](https://picx.zhimg.com/50/v2-58e77fdfb728952372b9d03348812dd5_720w.jpg?source=2c26e567)

## **四、[网络指数](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%BD%91%E7%BB%9C%E6%8C%87%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnvZHnu5zmjIfmlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.l7EN79XLFbDbERVABijyZ-D3DCts70_2yc7brL1JG-M\&zhida_source=entity)**

[百度指数](https://link.zhihu.com/?target=http%3A//index.baidu.com/)：指数查询平台，可以根据指数的变化查看某个主题在各个时间段受关注的情况，进行[趋势分析](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E8%B6%8B%E5%8A%BF%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLotovlir_liIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.oS6TTvcDyDno8Pz9PdagPOcHOG-r2a6pixQEVy-fWxk\&zhida_source=entity)、舆情预测有很好的指导作用。除了关注趋势之外，还有[需求分析](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E9%9C%80%E6%B1%82%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLpnIDmsYLliIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.SVqEkwN8bRP3vkCywLju9DDO0OsdXaQpiPIpcvKqJrg\&zhida_source=entity)、人群画像等精准分析的工具，对于市场调研来说具有很好的参考意义。同样的另外两个搜索引擎搜狗、360 也有类似的产品，都可以作为参考。

![](https://pic1.zhimg.com/50/v2-0881fb08a82b4ba8e69f422dd2f2548d_720w.jpg?source=2c26e567)

[阿里指数](https://link.zhihu.com/?target=https%3A//alizs.taobao.com/)：国内权威的商品交易分析工具，可以按地域、按行业查看商品搜索和交易数据，基于淘宝、天猫和 1688 平台的交易数据基本能够看出国内商品交易的概况，对于趋势分析、行业观察意义不小。

![](https://pic1.zhimg.com/50/v2-d86915bcb4eb3ed0e61f91a1d0db9548_720w.jpg?source=2c26e567)

[友盟指数](https://link.zhihu.com/?target=http%3A//www.umeng.com/)：友盟在移动互联网应用数据统计和分析具有较为全面的统计和分析，对于研究移动端产品、做市场调研、[用户行为分析](https://zhida.zhihu.com/search?content_id=76953613\&content_type=Answer\&match_order=1\&q=%E7%94%A8%E6%88%B7%E8%A1%8C%E4%B8%BA%E5%88%86%E6%9E%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzQsInEiOiLnlKjmiLfooYzkuLrliIbmnpAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3Njk1MzYxMywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.iXaSsgsmsMRvVvrJ8l0nwTYO_UJP1rGiFrDmsDPMRkQ\&zhida_source=entity)很有帮助。除了友盟指数，友盟的互联网报告同样是了解互联网趋势的优秀读物。

![](https://picx.zhimg.com/50/v2-3be656118816d546e60dc025450e994a_720w.jpg?source=2c26e567)

[爱奇艺指数](https://link.zhihu.com/?target=http%3A//index.iqiyi.com/)：爱奇艺指数是专门针对视频的播放行为、趋势的分析平台，对于互联网视频的播放有着全面的统计和分析，涉及到播放趋势、播放设备、用户画像、地域分布、等多个方面。由于爱奇艺庞大的用户基数，该指数基本可以说明实际情况。

![](https://pic1.zhimg.com/50/v2-daad7b0de8e388666b3178ea5fdfadeb_720w.jpg?source=2c26e567)

[微指数](https://link.zhihu.com/?target=http%3A//data.weibo.com/index)：微指数是新浪微博的数据分析工具，微指数通过关键词的热议度，以及行业 / 类别的平均影响力，来反映微博舆情或账号的发展走势。分为热词指数和影响力指数两大模块，此外，还可以查看热议人群及各类账号的地域分布情况。

![](https://picx.zhimg.com/50/v2-9c31099217326fe1d8a2e8d50cf242aa_720w.jpg?source=2c26e567)

除了以上指数外，还有[谷歌趋势](https://link.zhihu.com/?target=http%3A//www.google.com/trends/explore%23cmpt%3Dq%26tz%3DEtc%252FGMT-8)、[搜狗指数](https://link.zhihu.com/?target=http%3A//zhishu.sogou.com/)、[360 趋势](https://link.zhihu.com/?target=https%3A//trends.so.com/%3Fsrc%3Dindex.haosou.com%23index)、[艾漫指数](https://link.zhihu.com/?target=http%3A//www.imzs.com/%23/home)等等。

## 五、网络采集器

网络采集器是通过软件的形式实现简单快捷地采集网络上分散的内容，具有很好的内容收集作用，而且不需要技术成本，被很多用户作为初级的采集工具。

[造数](https://link.zhihu.com/?target=http%3A//www.zaoshu.io/)：新一代智能云爬虫。爬虫工具中最快的，比其他同类产品快 9 倍。拥有千万 IP，可以轻松发起无数请求，数据保存在云端，安全方便、简单快捷。

![](https://pica.zhimg.com/50/v2-20aeb402d1356c57b2150658b8185bd4_720w.jpg?source=2c26e567)

[火车采集器](https://link.zhihu.com/?target=http%3A//www.locoy.com/)：一款专业的互联网数据抓取、处理、分析，挖掘软件，可以灵活迅速地抓取网页上散乱分布的数据信息。

[八爪鱼](https://link.zhihu.com/?target=http%3A//www.bazhuayu.com/)：简单实用的采集器，功能齐全，操作简单，不用写规则。特有的云采集，关机也可以在云服务器上运行采集任务。

——————————

关注公众号（datacastle2016），获取更多数据分析干货。
