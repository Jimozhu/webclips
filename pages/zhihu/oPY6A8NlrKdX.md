---
title: 在采购之前如何评估服务器的性能够不够，主要是CPU？
date: 2024-10-04T15:30:53.721Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/68568916/answer/267470118
---
在谈[服务器选型](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%80%89%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLmnI3liqHlmajpgInlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.EYBfaPSmx9Hgzdmc4C2PCsoVMyDykd2-2ohbrbfyvh8\&zhida_source=entity)之前，必须知道最常用 x86 服务器几大组件： CPU、内存、硬盘、[IO 卡](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=IO%E5%8D%A1\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiJJT-WNoSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjc4Njk5ODkyLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.RLKdiwVf5Pc7P8d55d9y64tuLI1zjx0KH-jULutqcus\&zhida_source=entity)、RAID 卡。其中最核心的部件：CPU、内存、硬盘，下面就聊聊这几个部件的选型。

> &#x20;**怎么衡量服务器整机性能？**&#x20;

比如一台 IBM 2 路[x86 服务器](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=2\&q=x86%E6%9C%8D%E5%8A%A1%E5%99%A8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiJ4ODbmnI3liqHlmagiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.3q9PAHR_TWCh7yAHK5GupNmVt_E7P0y57y8gVWt2Emo\&zhida_source=entity)，一台 Oracle 2 路 x86 服务器，怎么去量化评估他们谁性能更强。

其实服务器整机 是有量化测试体系的，就是 TpmC 值。 比较他们谁的 TpmC 值更大，谁性能就更强。TpmC 值查询网址：[http://www.tpc.org](https://link.zhihu.com/?target=http%3A//www.tpc.org)

![](https://picx.zhimg.com/50/v2-65b2377d1645932b52d92881f4370bf7_720w.jpg?source=2c26e567)

> **TpmC=TASK \* S \* F / (T \* C)**\
> TASK：每分钟业务交易量\
> S：复杂程度比例\
> 范围 1\~30（取值越大，说明系统越复杂）\
> F：业务发展冗余\
> T：峰值交易时间\
> C：CPU 处理余量

> &#x20;**案例：已经某业务，计算需要怎样性能的服务器。** \
> 每秒 2000 次业务访问量，即每秒 120000 次访问，峰值交易时间为 1 分钟，检索查询的[经验系数](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E7%BB%8F%E9%AA%8C%E7%B3%BB%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLnu4_pqozns7vmlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.AfvH2S-y5kwwLZ-77UV6oYV4W5Z0qK22vF_Ev0nMcZI\&zhida_source=entity)取 7.5，那么在 5 年内数据库服务器的 TPC-C 值估算：

TpC=TASK \* S \* F / (T \* C)

\=（2000\*60） \* 7.5 \* （1+30%）^5 / \[ 1\* （1-0.5）]

\=1670818

即需要一台 tpmC 值不小于 1670818 的服务器。

> [应用服务器](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLlupTnlKjmnI3liqHlmagiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.nPiGBM-NcJN6Sg8YLB0k4AFpvihESAYdGC61JThY34Y\&zhida_source=entity)的 TPC = 数据库服务器 TPC\*50%（一般）\
> 应用服务器的 TPC = 数据库服务器 TPC\*70%（涉及大量计算的，如社保、税务）

![](https://pica.zhimg.com/50/v2-558b6fdd1348e62f7d1d6e4fe45e53dc_720w.jpg?source=2c26e567)

某设计院给出的参考值

> **服务器 CPU 性能衡量**

1 颗 E7 CPU 和 2 颗 E5 CPU，谁处理性能更强？ 通过 SPEC 值衡量，如何得知 SPEC 值（查询网址 忘了，自行百度即可，主流 CPU 能查到，但也有滞后性）

如 2 颗 E5620 和 2 颗 E5645 怎么量化比较性能。直接看下表，应该能算出来吧。一个表示整数运算能力，一个表示[浮点运算](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E6%B5%AE%E7%82%B9%E8%BF%90%E7%AE%97\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLmta7ngrnov5DnrpciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ._tPfot6whdkUdYpiEM5r3f8PfvEUg6m38fVzP-NQc2Q\&zhida_source=entity)能力。

![](https://picx.zhimg.com/50/v2-2ced4a298fdc8d8b64dab991abbeefe6_720w.jpg?source=2c26e567)

> **服务器内存 / 硬盘配置**

可以直接找软件开发商，他会直接告诉你需要多少内存和硬盘才能支撑起这个应用，如下就是一个应用的硬件需求表。

![](https://pic1.zhimg.com/50/v2-61e84945d47dede0db5e3c544d04b5d1_720w.jpg?source=2c26e567)

**数据库内存计算案例**

某[检索系统](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E6%A3%80%E7%B4%A2%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLmo4DntKLns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.R3HoZvHm9Y4WRxIqvoMqKOiWCQOgweOxVKrdA15DTfE\&zhida_source=entity)数据库的 SGA 运行需要 50G，连接数 2000。通常情况下操作系统占用 500MB 内存，[数据库管理系统](https://zhida.zhihu.com/search?content_id=78699892\&content_type=Answer\&match_order=1\&q=%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLmlbDmja7lupPnrqHnkIbns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3ODY5OTg5MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Z9WS5lKpL5wqToVt1g8dFUbv_i-xPPKBHAh13xyaEZM\&zhida_source=entity)约占用 256MB，内存利用率不大于 70%，计算公式如下：

内存总量 = 操作系统 + 数据库管理系统 + 数据库 SGA 运行 + 连接数 \* 3M

\=(512M/0.7+256M/0.7+2000\*3M)/1024+50G=59.45G

从而得出需要至少 64G 内存（一般 16 的倍数）。\
\
\
码字这么多，感觉还是比较抽象，更详细可以参考视频讲解

**[云计算数据中心系列 【服务器篇】 视频课程（硬件精讲 + 项目实战）](https://link.zhihu.com/?target=http%3A//edu.51cto.com/course/11467.html)**
