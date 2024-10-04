---
title: 网易云音乐的歌单推荐算法是怎样的？
date: 2024-10-04T15:31:10.493Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/26743347/answer/34714804
---
这里我想给大家介绍另外一种[推荐系统](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLmjqjojZDns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.w2qmQY5W13IN7emRbzRAUhcj9agp0vIsIBxVvtfUjWw\&zhida_source=entity)，这种算法叫做潜在因子（Latent Factor）算法。这种算法是在 NetFlix（没错，就是用大数据捧火《[纸牌屋](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E7%BA%B8%E7%89%8C%E5%B1%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLnurjniYzlsYsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.dMawbOKP_TRV0iiJAcmczdvafjHU68JS4XJn8gnzMUc\&zhida_source=entity)》的那家公司）的推荐[算法竞赛](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLnrpfms5Xnq57otZsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.2LS-0AJSYnaN5qLdf2MOZSNwUfV5mNfGUnKrC_UbGEY\&zhida_source=entity)中获奖的算法，最早被应用于电影推荐中。这种算法在实际应用中比现在排名第一的

[@邰原朗](//www.zhihu.com/people/296727f65ac7121dce72e2424edbd552)

所介绍的算法误差（RMSE）会小不少，效率更高。我下面仅利用基础的矩阵知识来介绍下这种算法。

这种算法的思想是这样：每个用户（**user**）都有自己的偏好，比如 A 喜欢带有**小清新的**、**吉他伴奏的**、**王菲**等元素（**latent factor**），如果一首歌（**item**）带有这些元素，那么就将这首歌推荐给该用户，也就是用元素去连接用户和音乐。每个人对不同的元素偏好不同，而每首歌包含的元素也不一样。我们希望能找到这样两个矩阵：

一，**用户 - 潜在因子矩阵 Q**，表示不同的用户对于不用元素的偏好程度，1 代表很喜欢，0 代表不喜欢。比如下面这样：

![](https://pic1.zhimg.com/50/6b9686e909e3e14fda19782426b1b88e_720w.jpg?source=2c26e567)

二，**潜在因子 - 音乐矩阵 P**，表示每种音乐含有各种元素的成分，比如下表中，音乐 A 是一个偏小清新的音乐，含有小清新这个 Latent Factor 的成分是 0.9，重口味的成分是 0.1，优雅的成分是 0.2……

![](https://picx.zhimg.com/50/b37d2aea4a35d3f45e8f25fd121c4e52_720w.jpg?source=2c26e567)

利用这两个矩阵，我们能得出张三对音乐 A 的喜欢程度是：张三对**小清新**的偏好 \* 音乐 A 含有**小清新**的成分 + 对**重口味**的偏好 \* 音乐 A 含有**重口味**的成分 + 对**优雅**的偏好 \* 音乐 A 含有**优雅**的成分 +……

![](https://picx.zhimg.com/50/7a37d920fff8d307c6494ef03ca249e8_720w.jpg?source=2c26e567)

![](https://pica.zhimg.com/50/5cddc0bb594d8469625ea5e2b8bd3e47_720w.jpg?source=2c26e567)

即：0.6\*0.9+0.8\*0.1+0.1\*0.2+0.1\*0.4+0.7\*0=0.69

每个用户对每首歌都这样计算可以得到不同用户对不同歌曲的评分矩阵\tilde{R} 。（注，这里的破浪线表示的是估计的评分，接下来我们还会用到不带波浪线的 R 表示实际的评分）：

![](https://picx.zhimg.com/50/0206a3b5a16ed64e2711e534dfb9bc4e_720w.jpg?source=2c26e567)

因此我们队张三推荐四首歌中得分最高的 B，对李四推荐得分最高的 C，王五推荐 B。

如果用矩阵表示即为：

\tilde{R} =QP^{T}\
\


下面问题来了，**这个[潜在因子](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=4\&q=%E6%BD%9C%E5%9C%A8%E5%9B%A0%E5%AD%90\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLmvZzlnKjlm6DlrZAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6NCwiemRfdG9rZW4iOm51bGx9.CJjA7JeM5-Vn1Ss7druZ6vU6VBCEz05D36ewjhcp5-A\&zhida_source=entity)（latent factor）** **是怎么得到的呢？**&#x20;

由于面对海量的让用户自己给音乐分类并告诉我们自己的偏好系数显然是不现实的，事实上我们能获得的数据只有用户行为数据。我们沿用

[@邰原朗](//www.zhihu.com/people/296727f65ac7121dce72e2424edbd552)

的量化标准：单曲循环 = 5, 分享 = 4, 收藏 = 3, 主动播放 = 2 , 听完 = 1, 跳过 =-2 , 拉黑 =-5，在分析时能获得的实际评分矩阵**R**，也就是输入矩阵大概是这个样子：

![](https://picx.zhimg.com/50/1a783eefd2beaa432faf2e20163ea835_720w.jpg?source=2c26e567)

事实上这是个非常非常稀疏的矩阵，因为大部分用户只听过全部音乐中很少一部分。如何利用这个矩阵去找潜在因子呢？这里主要应用到的是矩阵的 UV 分解。也就是将上面的评分[矩阵分解](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLnn6npmLXliIbop6MiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.LpL5EBI5M1RbUPIlRBPFpnjX5ZxRDf09NqcxdY09rCU\&zhida_source=entity)为两个低维度的矩阵，用 Q 和 P 两个矩阵的乘积去估计实际的评分矩阵，而且我们希望估计的评分矩阵

\tilde{R}

![](https://picx.zhimg.com/50/59b28d6c857ece645400e43cb8a08a6c_720w.jpg?source=2c26e567)

\


和实际的[评分矩阵](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=6\&q=%E8%AF%84%E5%88%86%E7%9F%A9%E9%98%B5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLor4TliIbnn6npmLUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6NiwiemRfdG9rZW4iOm51bGx9.Lpn-B1Vh434GO3qjbuJKt8nNoaQU09CE92ZH-OUrA80\&zhida_source=entity)不要相差太多，也就是求解下面的目标函数：

min\_{P,Q} \Sigma (r\_{ui}-q\_{i}p\_{u}^{T})^2

这里涉及到[最优化理论](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E6%9C%80%E4%BC%98%E5%8C%96%E7%90%86%E8%AE%BA\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLmnIDkvJjljJbnkIborroiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.5vLFkUimHKLphyBnVf6foV7pYgMRfkXBJvrdptfSsB4\&zhida_source=entity)，在实际应用中，往往还要在后面加上 2 范数的罚项，然后利用[梯度下降法](https://zhida.zhihu.com/search?content_id=9273791\&content_type=Answer\&match_order=1\&q=%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjYsInEiOiLmoq_luqbkuIvpmY3ms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo5MjczNzkxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.d5AaIfQqbBkFnzldYxn4d0XScGNHVduu2UryJPkN_dw\&zhida_source=entity)就可以求得这**P,Q**两个矩阵的估计值。这里我们就不展开说了。例如我们上面给出的那个例子可以分解成为这样两个矩阵：

![](https://pica.zhimg.com/50/56d1d0861468cc5216d5abe403cb9371_720w.jpg?source=2c26e567)

这两个矩阵相乘就可以得到估计的得分矩阵：

![](https://picx.zhimg.com/50/c3e70bdd45d67b49d81e4bd2112741f5_720w.jpg?source=2c26e567)

将用户已经听过的音乐剔除后，选择分数最高音乐的推荐给用户即可（红体字）。

在这个例子里面用户 7 和用户 8 有强的相似性：

![](https://pic1.zhimg.com/50/78188eafd238f32321d4ae42eba2063d_720w.jpg?source=2c26e567)

从推荐的结果来看，正好推荐的是对方评分较高的音乐：

![](https://picx.zhimg.com/50/ae603dd2c6626c43b32b19d4f01f42fc_720w.jpg?source=2c26e567)
