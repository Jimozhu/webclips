---
title: 「数据会说谎」的真实例子有哪些？
date: 2024-10-04T15:28:38.312Z
categories:
  - zhihu
tags:
  - zhihu
  - 什么
origin_url: //www.zhihu.com/question/19578400/answer/24843398
---
截图说话 —— 哗众取宠的美国 Fox news 经常用的一些招数。

这些招数更多的是从视觉上给人一种 “错觉”。比如说，本来不大的差异，截掉 Y 轴的一部分，瞬间差异就会让看的人觉得 —— 差得这么多！！！

想象你明天要跟你的经理作报告，手里有一堆结果，但是显然这些结果对于之前的方法只有边际的增长 —— 好消息是，你几乎一定可以找到一个方法，在数据变化不大的时候却给人造成视觉的冲击。

例子：

1）在趋势图中，为了说明增长趋势多明显，把 Y 调成不从 0 开始。这样差距会看起来很大，增长很大，但是如果把 Y 轴从 0 开始看的话，会显得基本没有差距。

![](https://picx.zhimg.com/50/804a3f61cd10160443636cf5b1033961_720w.jpg?source=2c26e567)

差距够大吧！！！巨量增长啊！我们公司的财务情况这样的话，公司明年就得 IPO 啊！！

可惜 Y 从 0 开始的话，这图应该看起来的样子是：

![](https://pic1.zhimg.com/50/69fdd79bca903ec0cc63db2431672a62_720w.jpg?source=2c26e567)

p.s. 刚发现在用 Excel 画这图的时候，excel 都自动把 Y 轴的起始值调成比最小值多一点！这样看起来差距真是巨明显有没有！看来 M$ 真是很懂画图的真正需求啊：D

2\) 另外一个例子，作两两比较的时候把 Y 的值从高位开始，造成俩差距巨大的错觉

![](https://pic1.zhimg.com/50/abce2a42e8fbcd551b0f90b00692c261_720w.jpg?source=2c26e567)

看啊，右边比左边高了 4 倍不止！！！咦，等等，不是就 39.6% 跟 35% 的差别吗.... 这...

3\) 分数加起来不等于一，放大差距。

![](https://picx.zhimg.com/50/a300f5f64e7f9b2a7e8616e213d91ab2_720w.jpg?source=2c26e567)

图上的数据 normalize 一下的话那么[佩林](https://zhida.zhihu.com/search?content_id=5229887\&content_type=Answer\&match_order=1\&q=%E4%BD%A9%E6%9E%97\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MTYsInEiOiLkvanmnpciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1MjI5ODg3LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.v2iWbS5W2cRqMMRmZ_6AkxP_3sY3B2LQVkzfA55DfAc\&zhida_source=entity)是 36.2%，32.6%，31.0%，直观差距不大。但是在这个饼型图里瞬间变成了 10% 的差距！这个比较明显的话那看下面

这里

![](https://picx.zhimg.com/50/e8ca19409759b0f6d5cd76db1b020f58_720w.jpg?source=2c26e567)

一扫的话没发现这里百分数加起来不等于 1 了吧。

\


4\) 挑取 x 轴的数据以捏造趋势

![](https://pic1.zhimg.com/50/02839064fc6b4197a6fcffa3c15c6b0d_720w.jpg?source=2c26e567)

假设数据的波动性很大，比如说如下

10, 1, 20, 3, 30, 4, 50

看起来应该是

![](https://pica.zhimg.com/50/261400d3ccf4f5b262bec500681179d4_720w.jpg?source=2c26e567)

擦勒，公司的财务状况这么不稳定！！！怎么办！

\


没关系 —— 如果我只抽取奇数项的话（挑取 x 轴，虽然挑得好像是很有系统地 —— 奇数，但是你总能想到一个看着挑得[系统的方法](https://zhida.zhihu.com/search?content_id=5229887\&content_type=Answer\&match_order=1\&q=%E7%B3%BB%E7%BB%9F%E7%9A%84%E6%96%B9%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg1MTYsInEiOiLns7vnu5_nmoTmlrnms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1MjI5ODg3LCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.VaSs1grz4zopbgxj7CkiZjvuXUlDHPHsCYRK83qVdAQ\&zhida_source=entity)）

就会看着像

![](https://picx.zhimg.com/50/632537beed54170fb849db4b85f8f2a4_720w.jpg?source=2c26e567)

TMD 明年又可以上市了。。。

等等等等...

部分图片来源于

[http://simplystatistics.org/2012/11/26/the-statisticians-at-fox-news-use-classic-and-novel-graphical-techniques-to-lead-with-data/](https://link.zhihu.com/?target=http%3A//simplystatistics.org/2012/11/26/the-statisticians-at-fox-news-use-classic-and-novel-graphical-techniques-to-lead-with-data/)
