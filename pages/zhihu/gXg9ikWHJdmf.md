---
title: 期货程序化很容易得到一个看似收益率惊人的公式，己包含手续费、滑点等因素，是不是可以认定公式是有效的？
date: 2024-10-04T15:14:40.439Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //www.zhihu.com/question/27172735/answer/204931821
---
来点干货。期货程序化确实很容易得到收益率惊人的策略，如下所示：

![](https://pic1.zhimg.com/50/v2-f3d2ca97987bc9f74fb6a13c17fff586_720w.jpg?source=2c26e567)

以为找到了圣杯，可以赢取白富美、走上人生巅峰了，不要高兴地太早，大部分这样的策略都是有问题的。楼上朋友说的很对，只有实盘的曲线才是唯一的依据，单凭这样的回测曲线是拿不到投资人的钱的。下面说说回测中可能遇到的坑：

* **交易费用**

策略虽然一般会默认手续费，但是这个交易费用和真实情况是一样的吗？会不会低估？随着交易次数的增多，交易费用失之毫厘，策略结果可能差之千里。

* **偷价漏价**

一般的回测机制为[事件驱动机制](https://zhida.zhihu.com/search?content_id=67331346\&content_type=Answer\&match_order=1\&q=%E4%BA%8B%E4%BB%B6%E9%A9%B1%E5%8A%A8%E6%9C%BA%E5%88%B6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzAsInEiOiLkuovku7bpqbHliqjmnLrliLYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NzMzMTM0NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.aMkuhtdefMWyTGwJoaao3BPfWZS3StWnVX63MIl-seU\&zhida_source=entity)。用当根 K 线的高开低收来确定交易信号。举个例子，如果以最高价突破 20 日最高形成开多信号，却用开盘价实际成交，这样就扩大了收益，策略曲线可能非常漂亮，但实际上是偷价漏价了。

* **[未来函数](https://zhida.zhihu.com/search?content_id=67331346\&content_type=Answer\&match_order=1\&q=%E6%9C%AA%E6%9D%A5%E5%87%BD%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc2NzAsInEiOiLmnKrmnaXlh73mlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NzMzMTM0NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.HFNjfQcgEeavs6_1KcqIG6sxBSmikKde6urX3EXfTgI\&zhida_source=entity)**

未来函数就是回测的时间点运用到了未来的数据信息。曾经开发了一个期货策略，效果就是一根直线，当时内心深处确实不相信这样的效果，但总是找不到原因，大概纠结了几天都没有进展，迟迟不敢实盘。后来发现，在计算信号的时候，用到了平台默认的 持股收益的指标，而该指标其实是使用当日收盘价的数据计算出来的，因此在盘中使用该指标就会使用到未来信息，犯了未来函数的大忌。幸亏找到了关键，一测试效果大打折扣，如果实盘的话不知道又要多交多少学费。

* **幸存者偏差**

策略开发也是一门数据科学，不知道这个问题的可以搜索 “二战飞机” 的例子帮助理解。

* **小样本**

既然是从历史数据中总结规律，小样本肯定是没有什么说服力的。

个人如果搭建量化交易平台的话，一定要注意回测中的这些问题。如果觉得麻烦，可以关注 **[BigQuant - 人工智能量化投资平台](https://link.zhihu.com/?target=https%3A//bigquant.com/%3Futm_source%3Dzhihu%26utm_medium%3Dzhihu_answer%26utm_campaign%3D170728_204931821_zhihu_answer)** , 平台已经将这些坑填满了。 还有想要交流的，欢迎私信！
