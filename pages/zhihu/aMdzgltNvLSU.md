---
title: 有什么适合 Go 语言初学者的 Starter Project？
date: 2024-10-04T15:31:10.434Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/33241133/answer/58138592
---
[funny/link · GitHub](https://link.zhihu.com/?target=https%3A//github.com/funny/link)

长连接网络层的脚手架，因为很简单，所以还算不上框架，就是用来快速搭建自己的网络层用的脚手架，里面的接口设计技巧和编程技巧可以参考下，如果深挖变更日志的话也可以看到这个库的重构过程，之前还有两版[内存池](https://zhida.zhihu.com/search?content_id=18663850\&content_type=Answer\&match_order=1\&q=%E5%86%85%E5%AD%98%E6%B1%A0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLlhoXlrZjmsaAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxODY2Mzg1MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.grtWBcqO0-hnZZTTPMSuPSg72sa5TuyPKjuHd8M4LvU\&zhida_source=entity)的实现，后来都删掉了。

[funny/binary · GitHub](https://link.zhihu.com/?target=https%3A//github.com/funny/binary)

专门用来做[二进制](https://zhida.zhihu.com/search?content_id=18663850\&content_type=Answer\&match_order=1\&q=%E4%BA%8C%E8%BF%9B%E5%88%B6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLkuozov5vliLYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxODY2Mzg1MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.FeXslViEY8s4vZ8ragNRQzH_2xrKDaOu01LRSlMB0hk\&zhida_source=entity)数据操作的库，可以用来做二进制文件解析或[通讯协议](https://zhida.zhihu.com/search?content_id=18663850\&content_type=Answer\&match_order=1\&q=%E9%80%9A%E8%AE%AF%E5%8D%8F%E8%AE%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLpgJrorq_ljY_orq4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxODY2Mzg1MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.lbEpc4nobARdchPFA03BigNvVCOlH-s6DFe16xpi-U4\&zhida_source=entity)解析，里面的一些接口设计技巧好编程技巧也可以参考一下，里面一些东西是从 link 包重构过程中分离出来的。

[idada/go-labs · GitHub](https://link.zhihu.com/?target=https%3A//github.com/idada/go-labs)

这些是我平时做的一些[试验代码](https://zhida.zhihu.com/search?content_id=18663850\&content_type=Answer\&match_order=1\&q=%E8%AF%95%E9%AA%8C%E4%BB%A3%E7%A0%81\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLor5Xpqozku6PnoIEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxODY2Mzg1MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.VjHUtDRposSNTzl96fgm2sMg7c7ZUDiVChxg5WYtgSA\&zhida_source=entity)，在开发过程中经常会因为一些细节问题影响设计上的判断，所以我会把这些细节问题拆分成一个个小的试验，通过试验数据确认性能或机制，有一些试验比较早了，可能因为 Go 运行时升级会有变化，所以比较有参考价值的大概是试验方式和拆分问题的思路。

有一些试验代码是即兴的，在

[The Go Playground](https://link.zhihu.com/?target=http%3A//play.golang.org)

上直接写直接试了，所以没有留档。

因为

[The Go Playground](https://link.zhihu.com/?target=http%3A//play.golang.org)

和 go test 这些工具让试验变得很便捷，所以我在学习 Go 的过程养成了做小实验的习惯，这个习惯也影响到我做其它的事情，我觉得[拆解问题](https://zhida.zhihu.com/search?content_id=18663850\&content_type=Answer\&match_order=1\&q=%E6%8B%86%E8%A7%A3%E9%97%AE%E9%A2%98\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjQsInEiOiLmi4bop6Ppl67popgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxODY2Mzg1MCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.B7DBLFwm09hzrJTwmS-9ZOHzV1WBRKUtXdJrd8hXYTo\&zhida_source=entity)做试验是很好的学习方式，推荐大家尝试。
