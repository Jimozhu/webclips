---
title: 能否对卷积神经网络工作原理做一个直观的解释？
date: 2024-10-04T15:30:54.230Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/39022858/answer/194996805
---
该文是**[卷积神经网络 -- 介绍](https://zhuanlan.zhihu.com/p/27642620)**，并假设你理解前馈神经网络。

如果不是，强烈建议你读完**[如何简单形象又有趣地讲解神经网络是什么？](https://www.zhihu.com/question/22553761/answer/126474394)** 后再来读该篇。

## 目录

* 视觉感知
* * 画面识别是什么
  * 识别结果取决于什么
  图像表达
* * 画面识别的输入
  * 画面不变形
  前馈神经网络做画面识别的不足
* 卷积神经网络做画面识别
* * 局部连接
  * 空间共享
  * 输出空间表达
  * Depth 维的处理
  * Zero padding
  * 形状、概念抓取
  * 多 filters
  * 非线性
  * 输出尺寸控制
  * 矩阵乘法执行卷积
  * Max pooling
  * [全连接层](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=1\&q=%E5%85%A8%E8%BF%9E%E6%8E%A5%E5%B1%82\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLlhajov57mjqXlsYIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.vvfrLEBNjCcsxgUbVCFV68uZMm-gsVregk_IUXfYBXk\&zhida_source=entity)
  * 结构发展
  画面不变性的满足
  * 平移不变性
  * 旋转和视角不变性
  * 尺寸不变性
  * Inception 的理解
  * 1x1[卷积核](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=1\&q=%E5%8D%B7%E7%A7%AF%E6%A0%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLljbfnp6_moLgiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.9iL8lYh11qYMhayVzyaSQER4JdrKQuqJyq4TrXavPtw\&zhida_source=entity)理解
  * 跳层连接 ResNet

## 视觉感知

&#x20;*一、画面识别是什么任务？*&#x20;

学习知识的第一步就是**明确任务**，清楚该知识的输入输出。卷积神经网络最初是服务于画面识别的，所以我们先来看看画面识别的实质是什么。

先观看几组动物与人类视觉的差异对比图。

1\. 苍蝇的视觉和人的视觉的差异

![](https://pic1.zhimg.com/50/v2-55069445ed54ce163b76c611ba26b639_720w.jpg?source=2c26e567)

![](https://pica.zhimg.com/50/v2-4a0ea7ba42166b62bc4f42e8b150815d_720w.jpg?source=2c26e567)

2\. 蛇的视觉和人的视觉的差异

![](https://picx.zhimg.com/50/v2-a4d35c245931f264ed9a0716fdf20685_720w.jpg?source=2c26e567)

![](https://picx.zhimg.com/50/v2-3da84b5b80ba7a0d779284566f80be93_720w.jpg?source=2c26e567)

（更多对比图请参考[链接](https://link.zhihu.com/?target=http%3A//chuansong.me/n/2656056)）

通过上面的两组对比图可以知道，即便是相同的图片经过不同的视觉系统，也会得到不同的感知。

这里引出一条知识：生物所看到的景象并非世界的原貌，而是长期进化出来的**适合自己生存环境的一种感知方式**。 蛇的猎物一般是夜间行动，所以它就进化出了一种可以在夜间也能很好观察的感知系统，感热。

任何视觉系统都是将图像反光与脑中所看到的概念进行关联。

![](https://pic1.zhimg.com/50/v2-2c82abd20c4e7c40f7f13f035b924b0b_720w.jpg?source=2c26e567)

所以画面识别实际上并非识别这个东西客观上是什么，而是寻找人类的视觉关联方式，并再次应用。 如果我们不是人类，而是蛇类，那么画面识别所寻找的 就和现在的不一样。

> **画面识别实际上是寻找（学习）人类的视觉关联方式 ，并再次应用**。

&#x20;*二、图片被识别成什么取决于哪些因素？*&#x20;

下面用两张图片来体会识别结果取决于哪些因素。

1\. 老妇与少女

![](https://picx.zhimg.com/50/v2-c902a9e33b0322051a5f9165e9439247_720w.jpg?source=2c26e567)

请观察上面这张图片，你看到的是老妇还是少女？ 以不同的方式去观察这张图片会得出不同的答案。 图片可以观察成有大鼻子、大眼睛的老妇。也可以被观察成少女，但这时老妇的嘴会被识别成少女脖子上的项链，而老妇的眼睛则被识别为少女的耳朵。

2\. 海豚与男女

![](https://picx.zhimg.com/50/v2-7e5bc60a9e9bd0b597e4b650fecc439e_720w.jpg?source=2c26e567)

上面这张图片如果是成人观察，多半看到的会是一对亲热的男女。倘若儿童看到这张图片，看到的则会是一群海豚（男女的轮廓是由海豚构造出的）。所以，识别结果受年龄，文化等因素的影响，换句话说：

> &#x20;**图片被识别成什么不仅仅取决于图片本身，还取决于图片是如何被观察的。**&#x20;

## 图像表达

我们知道了 “画面识别是从大量的(x,y)数据中寻找人类的视觉关联方式 ，并再次应用。 其x- 是输入，表示所看到的东西y- 输出，表示该东西是什么。

在自然界中，x是物体的反光，那么在计算机中，图像又是如何被表达和存储的呢？

![动图封面](https://pica.zhimg.com/50/v2-d2859e5c486ed704492ab80079e99535_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=https%3A//medium.com/%40ageitgey/machine-learning-is-fun-part-3-deep-learning-and-convolutional-neural-networks-f40359318721)]

图像在计算机中是一堆按顺序排列的数字，数值为 0 到 255。0 表示最暗，255 表示最亮。 你可以把这堆数字用一个长长的向量来表示，也就是[tensorflow 的 mnist 教程](https://link.zhihu.com/?target=https%3A//www.tensorflow.org/get_started/mnist/beginners)中 784 维向量的表示方式。 然而这样会失去平面结构的信息，为保留该结构信息，通常选择矩阵的表示方式：28x28 的矩阵。

上图是只有黑白颜色的灰度图，而更普遍的图片表达方式是 RGB 颜色模型，即红（Red）、绿（Green）、蓝（Blue）三原色的色光以不同的比例相加，以产生多种多样的色光。

这样，RGB 颜色模型中，单个矩阵就扩展成了有序排列的三个矩阵，也可以用三维张量去理解，其中的每一个矩阵又叫这个图片的一个 channel。

在电脑中，一张图片是数字构成的 “长方体”。可用 宽 width, 高 height, 深 depth 来描述，如图。

![](https://picx.zhimg.com/50/v2-0d24890b2e0d73f4ce4ad17ebfb2d0c4_720w.jpg?source=2c26e567)

> 画面识别的输入x是 shape 为 (width, height, depth) 的三维张量。

接下来要考虑的就是该如何处理这样的 “数字长方体”。

## 画面不变性

在决定如何处理 “数字长方体” 之前，需要清楚所建立的网络拥有什么样的特点。 我们知道一个物体不管在画面左侧还是右侧，都会被识别为同一物体，这一特点就是不变性（invariance），如下图所示。

![](https://pic1.zhimg.com/50/v2-b9aed3dd68b9818561faa7d8ed24ea5a_720w.jpg?source=2c26e567)

我们希望所建立的网络可以尽可能的满足这些不变性特点。

为了理解卷积神经网络对这些不变性特点的贡献，我们将用不具备这些不变性特点的前馈神经网络来进行比较。

## 图片识别 -- 前馈神经网络

方便起见，我们用 depth 只有 1 的灰度图来举例。 想要完成的任务是：在宽长为 4x4 的图片中识别是否有下图所示的 “横折”。 图中，黄色圆点表示值为 0 的像素，深色圆点表示值为 1 的像素。 我们知道不管这个横折在图片中的什么位置，都会被认为是相同的横折。

![](https://picx.zhimg.com/50/v2-18c11c6f485e9f1bbc9a50eb3d248439_720w.jpg?source=2c26e567)

若训练前馈神经网络来完成该任务，那么表达图像的三维张量将会被摊平成一个向量，作为网络的输入，即 (width, height, depth) 为 (4, 4, 1) 的图片会被展成维度为 16 的向量作为网络的输入层。再经过几层不同节点个数的隐藏层，最终输出两个节点，分别表示 “有横折的概率” 和 “没有横折的概率”，如下图所示。

![](https://pic1.zhimg.com/50/v2-2b411af47b1cad7b727bb676c847ce59_720w.jpg?source=2c26e567)

下面我们用数字（16 进制）对图片中的每一个像素点（pixel）进行编号。 当使用右侧那种物体位于中间的训练数据来训练网络时，网络就只会对编号为 5,6,9,a 的节点的权重进行调节。 若让该网络识别位于右下角的 “横折” 时，则无法识别。

![](https://pica.zhimg.com/50/v2-ce9919e4930c1f29241afec0538b2605_720w.jpg?source=2c26e567)

解决办法是用大量物体位于不同位置的数据训练，同时增加网络的隐藏层个数从而扩大网络学习这些变体的能力。

然而这样做十分不效率，因为我们知道在左侧的 “横折” 也好，还是在右侧的 “横折” 也罢，大家都是 “横折”。 为什么相同的东西在位置变了之后要重新学习？有没有什么方法可以将中间所学到的规律也运用在其他的位置？ 换句话说，也就是**让不同位置用相同的权重**。

## 图片识别 -- 卷积神经网络

卷积神经网络就是让权重在不同位置共享的神经网络。

## 局部连接

在卷积神经网络中，我们先选择一个局部区域，用这个局部区域去扫描整张图片。 局部区域所圈起来的所有节点会被连接到下一层的一个节点上。

为了更好的和[前馈神经网络](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=6\&q=%E5%89%8D%E9%A6%88%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLliY3ppojnpZ7nu4_nvZHnu5wiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjYsInpkX3Rva2VuIjpudWxsfQ.6dQVEv56kbDLq1MzBjeAz0jRaRMK2o8mWuPvljLlB48\&zhida_source=entity)做比较，我将这些以矩阵排列的节点展成了向量。 下图展示了被红色方框所圈中编号为 0,1,4,5 的节点是如何通过w\_1,w\_2,w\_3,w\_4连接到下一层的节点 0 上的。

![](https://picx.zhimg.com/50/v2-e877b9099b1139c1a34b0bf66bf92aa4_720w.jpg?source=2c26e567)

这个带有连接强弱的红色方框就叫做 **filter** 或 **kernel** 或 **feature detector**。 而 filter 的范围叫做**filter size**，这里所展示的是 2x2 的 filter size。

\left\[ \begin{matrix} w\_1\&w\_2\\\ w\_3\&w\_4\\\ \end{matrix} \right] (1)

第二层的节点 0 的数值就是局部区域的线性组合，即被圈中节点的数值乘以对应的权重后相加。 用x表示输入值，y表示输出值，用图中标注数字表示角标，则下面列出了两种计算编号为 0 的输出值y\_0的表达式。

注：在局部区域的线性组合后，也会和前馈神经网络一样，加上一个偏移量b\_0 。

\begin{split} y\_0 &= x\_0\*w\_1 + x\_1\*w\_2+ x\_4\*w\_3+ x\_5\*w\_4+b\_0\\\y\_0 &= \left\[ \begin{matrix} w\_1\&w\_2& w\_3\&w\_4 \end{matrix} \right] \cdot \left\[ \begin{matrix} x\_0\\\ x\_1\\\ x\_4\\\ x\_5\\\ \end{matrix} \right]+b\_0 \end{split} (2)

## 空间共享

当 filter 扫到其他位置计算输出节点y\_i 时，w\_1,w\_2,w\_3,w\_4，**包括**b\_0是共用的。

下面这张动态图展示了当 filter 扫过不同区域时，节点的链接方式。 动态图的最后一帧则显示了所有连接。 可以注意到，每个输出节点并非像前馈神经网络中那样与全部的输入节点连接，而是部分连接。 这也就是为什么大家也叫前馈神经网络（feedforward neural network）为 fully-connected neural network。 图中显示的是一步一步的移动 filter 来扫描全图，一次移动多少叫做 stride。

![动图封面](https://picx.zhimg.com/50/v2-4fd0400ccebc8adb2dffe24aac163e70_720w.jpg?source=2c26e567)

> **空间共享也就是卷积神经网络所引入的[先验知识](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=1\&q=%E5%85%88%E9%AA%8C%E7%9F%A5%E8%AF%86\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLlhYjpqoznn6Xor4YiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.KSaI9w08jePVKHcxHnSZifXvMJ8bE21ca0iMzxEmTb0\&zhida_source=entity)。**

## 输出表达

如先前在图像表达中提到的，图片不用向量去表示是为了保留图片平面结构的信息。 同样的，卷积后的输出若用上图的排列方式则丢失了平面结构信息。 所以我们依然用矩阵的方式排列它们，就得到了下图所展示的连接。

![](https://picx.zhimg.com/50/v2-e1691956fd1beb5d7a637924a1a73d91_720w.jpg?source=2c26e567)

这也就是你们在网上所看到的下面这张图。在看这张图的时候请结合上图的连接一起理解，即输入（绿色）的每九个节点连接到输出（粉红色）的一个节点上的。

![动图封面](https://picx.zhimg.com/50/v2-7fce29335f9b43bce1b373daa40cccba_720w.jpg?source=2c26e567)

经过一个 feature detector 计算后得到的粉红色区域也叫做一个 “**Convolved Feature**” 或 “**Activation Map**” 或 “**Feature Map**”。

## Depth 维的处理

现在我们已经知道了[depth 维度](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=1\&q=depth%E7%BB%B4%E5%BA%A6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiJkZXB0aOe7tOW6piIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjY1NTI1MTgyLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.4jp6XMBNx8mKWQiCa4UUtCVFujn11GL17VC301tcmsc\&zhida_source=entity)只有 1 的灰度图是如何处理的。 但前文提过，图片的普遍表达方式是下图这样有 3 个 channels 的 RGB[颜色模型](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=3\&q=%E9%A2%9C%E8%89%B2%E6%A8%A1%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLpopzoibLmqKHlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.E-ua912YGQaUz4F-Vhpay_YclRkZ6Aw9j5Q0_KUrS-E\&zhida_source=entity)。 当 depth 为复数的时候，每个 feature detector 是如何卷积的？

![](https://picx.zhimg.com/50/v2-0d24890b2e0d73f4ce4ad17ebfb2d0c4_720w.jpg?source=2c26e567)

**现象**：2x2 所表达的 filter size 中，一个 2 表示 width 维上的局部连接数，另一个 2 表示 height 维上的局部连接数，并却没有 depth 维上的局部连接数，是因为 depth 维上并非局部，而是全部连接的。

在 2D 卷积中，filter 在张量的 width 维，height 维上是局部连接，在 depth 维上是贯串全部 channels 的。

**类比**：想象在切蛋糕的时候，不管这个蛋糕有多少层，通常大家都会一刀切到底，但是在长和宽这两个维上是局部切割。

下面这张图展示了，在 depth 为复数时，filter 是如何连接输入节点到输出节点的。 图中红、绿、蓝颜色的节点表示 3 个 channels。 黄色节点表示一个 feature detector 卷积后得到的 Feature Map。 其中被透明黑框圈中的 12 个节点会被连接到黄黑色的节点上。

* 在输入 depth 为 1 时：被 filter size 为 2x2 所圈中的 4 个输入节点连接到 1 个输出节点上。
* 在输入 depth 为 3 时：被 filter size 为 2x2，但是贯串 3 个 channels 后，所圈中的 12 个输入节点连接到 1 个输出节点上。
* 在输入 depth 为n时：2x2xn个输入节点连接到 1 个输出节点上。

![](https://picx.zhimg.com/50/v2-23db15ec3f783bbb5cf811711e46dbba_720w.jpg?source=2c26e567)

(可从[vectary](https://link.zhihu.com/?target=https%3A//www.vectary.com/u/yjango/cnn)在 3D 编辑下查看)

**注意**：三个 channels 的权重并不共享。 即当深度变为 3 后，权重也跟着扩增到了三组，如式子 (3) 所示，不同 channels 用的是自己的权重。 式子中增加的角标 r,g,b 分别表示 red channel, green channel, blue channel 的权重。

\left\[ \begin{matrix} w\_{r1}\&w\_{r2}\\\ w\_{r3}\&w\_{r4}\\\ \end{matrix} \right], \left\[ \begin{matrix} w\_{g1}\&w\_{g2}\\\ w\_{g3}\&w\_{g4}\\\ \end{matrix} \right], \left\[ \begin{matrix} w\_{b1}\&w\_{b2}\\\ w\_{b3}\&w\_{b4}\\\ \end{matrix} \right] (3)

计算例子：用x\_{r0}表示 red channel 的编号为 0 的输入节点，x\_{g5}表示 green channel 编号为 5 个输入节点。x\_{b1}表示 blue channel。如式子 (4) 所表达，这时的一个输出节点实际上是 12 个输入节点的线性组合。

\begin{split} y\_0 &= x\_{r0}\*w\_{r1} + x\_{r1}\*w\_{r2}+ x\_{r4}\*w\_{r3}+ x\_{r5}\*w\_{r4}+ x\_{g0}\*w\_{g1} + x\_{g1}\*w\_{g2}+ x\_{g4}\*w\_{g3}+ x\_{g5}\*w\_{g4}+ x\_{b0}\*w\_{b1} + x\_{b1}\*w\_{b2}+ x\_{b4}\*w\_{b3}+ x\_{b5}\*w\_{b4}+b\_0\\\y\_0 &= \left\[ \begin{matrix} w\_{r1}\&w\_{r2}& w\_{r3}\&w\_{r4} \end{matrix} \right] \cdot \left\[ \begin{matrix} x\_{r0}\\\ x\_{r1}\\\ x\_{r4}\\\ x\_{r5}\\\ \end{matrix} \right] +\left\[ \begin{matrix} w\_{g1}\&w\_{g2}& w\_{g3}\&w\_{g4} \end{matrix} \right] \cdot \left\[ \begin{matrix} x\_{g0}\\\ x\_{g1}\\\ x\_{g4}\\\ x\_{g5}\\\ \end{matrix} \right]+\left\[ \begin{matrix} w\_{b1}\&w\_{b2}& w\_{b3}\&w\_{b4} \end{matrix} \right] \cdot \left\[ \begin{matrix} x\_{b0}\\\ x\_{b1}\\\ x\_{b4}\\\ x\_{b5}\\\ \end{matrix} \right]+b\_0\end{split}(4)

当 filter 扫到其他位置计算输出节点y\_i时，那 12 个权重在不同位置是共用的，如下面的动态图所展示。 透明黑框圈中的 12 个节点会连接到被白色边框选中的黄色节点上。

![动图封面](https://picx.zhimg.com/50/v2-0bc83b72ef50099b70a10cc3ab528f62_720w.jpg?source=2c26e567)

> &#x20;**每个 filter 会在 width 维，height 维上，以局部连接和空间共享，并贯串整个 depth 维的方式得到一个 Feature Map。**&#x20;

## Zero padding

细心的读者应该早就注意到了，4x4 的图片被 2x2 的 filter 卷积后变成了 3x3 的图片，每次卷积后都会小一圈的话，经过若干层后岂不是变的越来越小？ Zero padding 就可以在这时帮助控制 Feature Map 的输出尺寸，同时避免了边缘信息被一步步舍弃的问题。

例如：下面 4x4 的图片在边缘 Zero padding 一圈后，再用 3x3 的[filter 卷积](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=2\&q=filter%E5%8D%B7%E7%A7%AF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiJmaWx0ZXLljbfnp68iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.kHPN-xkZIoT9ebUazjR6A_ACZGNWqExQjBKJGrFw1pE\&zhida_source=entity)后，得到的 Feature Map 尺寸依然是 4x4 不变。

![](https://picx.zhimg.com/50/v2-c1010eb5dcf032ea95eab495a45f9b31_720w.jpg?source=2c26e567)

通常大家都想要在卷积时保持图片的原始尺寸。 选择 3x3 的 filter 和 1 的 zero padding，或 5x5 的 filter 和 2 的 zero padding 可以保持图片的原始尺寸。 这也是为什么大家多选择 3x3 和 5x5 的 filter 的原因。 另一个原因是 3x3 的 filter 考虑到了像素与其距离为 1 以内的所有其他像素的关系，而[5x5](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=3\&q=5x5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiI1eDUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.mLEDz9jDkyYEFlanwniFPhQzNS97BAdr7Z4NiFPQnjQ\&zhida_source=entity)则是考虑像素与其距离为 2 以内的所有其他像素的关系。

**尺寸**：Feature Map 的尺寸等于 (input\_size + 2 \* padding\_size − filter\_size)/stride+1。

**注意**：上面的式子是计算 width 或 height 一维的。padding\_size 也表示的是单边补零的个数。例如 (4+2-3)/1+1 = 4，保持原尺寸。

不用去背这个式子。其中 (input\_size + 2 \* padding\_size) 是经过 Zero padding 扩充后真正要卷积的尺寸。 减去 filter\_size 后表示可以滑动的范围。 再除以可以一次滑动（stride）多少后得到滑动了多少次，也就意味着得到了多少个输出节点。 再加上第一个不需要滑动也存在的输出节点后就是最后的尺寸。

## 形状、概念抓取

知道了每个 filter 在做什么之后，我们再来思考这样的一个 filter 会抓取到什么样的信息。

我们知道不同的形状都可由细小的 “零件” 组合而成的。比如下图中，用 2x2 的范围所形成的 16 种形状可以组合成格式各样的 “更大” 形状。

卷积的每个 filter 可以探测特定的形状。又由于 Feature Map 保持了抓取后的空间结构。若将探测到细小图形的 Feature Map 作为新的输入再次卷积后，则可以由此探测到 “更大” 的形状概念。 比如下图的第一个 “大” 形状可由 2,3,4,5 基础形状拼成。第二个可由 2,4,5,6 组成。第三个可由 6,1 组成。

![](https://pica.zhimg.com/50/v2-f53f6ac43abd2555cfbbba6ea7fdc0e4_720w.jpg?source=2c26e567)

除了基础形状之外，颜色、对比度等概念对画面的识别结果也有影响。卷积层也会根据需要去探测特定的概念。

可以从下面这张图中感受到不同数值的 filters 所卷积过后的 Feature Map 可以探测边缘，棱角，模糊，突出等概念。

![](https://pica.zhimg.com/50/v2-644d108587a6ce7fa471ede5d2e11e98_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=https%3A//ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/)]

如我们先前所提，图片被识别成什么不仅仅取决于图片本身，还取决于图片是如何被观察的。

而 filter 内的权重矩阵 W 是网络根据数据学习得到的，也就是说，我们让神经网络自己学习以什么样的方式去观察图片。

拿老妇与少女的那幅图片举例，当标签是少女时，卷积网络就会学习抓取可以成少女的形状、概念。 当标签是老妇时，卷积网络就会学习抓取可以成老妇的形状、概念。

下图展现了在人脸识别中经过层层的卷积后，所能够探测的形状、概念也变得越来越抽象和复杂。

![](https://picx.zhimg.com/50/v2-c78b8d059715bb5f42c93716a98d5a69_720w.jpg?source=2c26e567)

> &#x20;**卷积神经网络会尽可能寻找最能解释训练数据的抓取方式。**&#x20;

## 多 filters

每个 filter 可以抓取探测特定的形状的存在。 假如我们要探测下图的长方框形状时，可以用 4 个 filters 去探测 4 个基础 “零件”。

![](https://pic1.zhimg.com/50/v2-6df64fccc9a8e2f696626f85233acb3c_720w.jpg?source=2c26e567)

![](https://picx.zhimg.com/50/v2-65461a21a909eca2e190c54db59a2c8f_720w.jpg?source=2c26e567)

因此我们自然而然的会选择用多个不同的 filters 对同一个图片进行多次抓取。 如下图（动态图过大，如果显示不出，请看到该[链接](https://link.zhihu.com/?target=https%3A//ujwlkarn.files.wordpress.com/2016/08/giphy.gif)观看），同一个图片，经过两个（红色、绿色）不同的 filters 扫描过后可得到不同特点的 Feature Maps。 每增加一个[filter](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=34\&q=filter\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiJmaWx0ZXIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjM0LCJ6ZF90b2tlbiI6bnVsbH0.1oJDCXxdOMBcT6-1t6yc5bROfm2hq7TiLmn_2BqZa00\&zhida_source=entity)，就意味着你想让网络多抓取一个特征。

![动图封面](https://pic1.zhimg.com/50/v2-c7f1ea1d42820b4de30bd548c3986ecd_720w.jpg?source=2c26e567) [![](https://pic1.zhimg.com/50/v2-c7f1ea1d42820b4de30bd548c3986ecd_720w.jpg?source=2c26e567)](https://vdn6.vzuu.com/SD/7ac8f060-23a6-11eb-97a9-ea686b80b9c8.mp4?pkey=AAXOh29OEorvebjcPMkDfaZaRieFQuCHa3VRbB5JCAUYiMS8fNFnaX5Iw70Vq5Xetu0b_GK4vofAQCwjDFIwbmxE\&bu=078babd7\&c=avc.0.0\&expiration=1728063052\&f=mp4\&pu=078babd7\&v=ks6)

\[[from](https://link.zhihu.com/?target=https%3A//ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/)]

这样卷积层的输出也不再是 depth 为 1 的一个平面，而是和输入一样是 depth 为复数的长方体。

如下图所示，当我们增加一个 filter（紫色表示）后，就又可以得到一个 Feature Map。 将不同 filters 所卷积得到的 Feature Maps 按顺序堆叠后，就得到了一个卷积层的最终输出。

![](https://pic1.zhimg.com/50/v2-d11e1d2f2c41b6df713573f8155bc324_720w.jpg?source=2c26e567)

> &#x20;**卷积层的输入是长方体，输出也是长方体。**&#x20;

这样卷积后输出的长方体可以作为新的输入送入另一个卷积层中处理。

## 加入非线性

和前馈神经网络一样，经过线性组合和偏移后，会加入非线性增强模型的拟合能力。

将卷积所得的 Feature Map 经过 ReLU 变换（elementwise）后所得到的 output 就如下图所展示。

![](https://picx.zhimg.com/50/v2-54a469b2873542e75abf2bc5d8fcaa1a_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=http%3A//mlss.tuebingen.mpg.de/2015/slides/fergus/Fergus_1.pdf)]

## 输出长方体

现在我们知道了一个卷积层的输出也是一个长方体。 那么这个输出长方体的 (width, height, depth) 由哪些因素决定和控制。

这里直接用[CS231n](https://link.zhihu.com/?target=http%3A//cs231n.github.io/convolutional-networks/)的 Summary：

![](https://pic1.zhimg.com/50/v2-a9983c3cee935b68c73965bc1abe268c_720w.jpg?source=2c26e567)

计算例子：请体会[CS231n](https://link.zhihu.com/?target=http%3A//cs231n.github.io/convolutional-networks/)的 Convolution Demo 部分的演示。

## 矩阵乘法执行卷积

如果按常规以扫描的方式一步步计算局部节点和 filter 的权重的点乘，则不能高效的利用 GPU 的并行能力。 所以更普遍的方法是用两个大矩阵的乘法来一次性囊括所有计算。

因为卷积层的每个输出节点都是由若干个输入节点的线性组合所计算。 因为输出的节点个数是W\_2 \times H\_2\times D\_2，所以就有W\_2 \times H\_2\times D\_2个线性组合。

读过我写的[线性代数教程](https://link.zhihu.com/?target=https%3A//yjango.gitbooks.io/superorganism/content/xian_xing_dai_shu.html)的读者请回忆，矩阵乘矩阵的意义可以理解为批量的线性组合按顺序排列。 其中一个矩阵所表示的信息是多组权重，另一个矩阵所表示的信息是需要进行组合的向量。 大家习惯性的把组成成分放在矩阵乘法的右边，而把权重放在矩阵乘法的左边。 所以这个大型矩阵乘法可以用W\_{row}\cdot X\_{col}表示，其中W\_{row}和X\_{col}都是矩阵。

![](https://picx.zhimg.com/50/v2-11a4d56793af815eb2b4585d64aec178_720w.jpg?source=2c26e567)

卷积的每个输出是由局部的输入节点和对应的 filter 权重展成向量后所计算的，如式子 (2)。 那么W\_{row}中的每一行则是每个 filter 的权重，有F\cdot F \cdot D\_1个； 而X\_{col}的每一列是所有需要进行组合的节点（上面的动态图中被黑色透明框圈中的节点），也有F\cdot F \cdot D\_1个。 X\_{col}的列的个数则表示每个 filter 要滑动多少次才可以把整个图片扫描完，有W\_2\cdot H\_2次。 因为我们有多个 filters，W\_{row}的行的个数则是 filter 的个数K。

最后我们得到：

W\_{row} \in R^{K \times F\cdot F \cdot D\_1}

X\_{col} \in R^{F\cdot F \cdot D\_1 \times W\_2\cdot H\_2}

W\_{row}\cdot X\_{col} \in R^{K \times W\_2\cdot H\_2}

当然矩阵乘法后需要将W\_{row}\cdot X\_{col}整理成形状为W\_2 \times H\_2\times D\_2的[三维张量](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=4\&q=%E4%B8%89%E7%BB%B4%E5%BC%A0%E9%87%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLkuInnu7TlvKDph48iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjQsInpkX3Rva2VuIjpudWxsfQ.YhHlNpUP-C4hZ__2y17STLCqKPkNd3XbuN6Mf36VjOw\&zhida_source=entity)以供后续处理（如再送入另一个卷积层）。 X\_{col}则也需要逐步的局部滑动图片，最后堆叠构成用于计算[矩阵乘法](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=7\&q=%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLnn6npmLXkuZjms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjcsInpkX3Rva2VuIjpudWxsfQ.Hk-LcQunWjA_JtjpakfxcIk5Thbqh5gTJAoluNnTLaw\&zhida_source=entity)的形式。

## Max pooling

在卷积后还会有一个 pooling 的操作，尽管有其他的比如 average pooling 等，这里只提 max pooling。

max pooling 的操作如下图所示：整个图片被不重叠的分割成若干个同样大小的小块（pooling size）。每个小块内只取最大的数字，再舍弃其他节点后，保持原有的平面结构得出 output。

![](https://pic1.zhimg.com/50/v2-1a4b2a3795d8f073e921d766e70ce6ec_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=http%3A//cs231n.github.io/convolutional-networks/)]

max pooling 在不同的 depth 上是分开执行的，且不需要参数控制。 那么问题就 max pooling 有什么作用？部分信息被舍弃后难道没有影响吗？

![](https://picx.zhimg.com/50/v2-cd717414dcf32dac4df73c00f1e7c6c3_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=http%3A//cs231n.github.io/convolutional-networks/)]

Max pooling 的主要功能是 downsampling，却不会损坏识别结果。 这意味着卷积后的 Feature Map 中有对于识别物体不必要的冗余信息。 那么我们就反过来思考，这些 “冗余” 信息是如何产生的。

直觉上，我们为了探测到某个特定形状的存在，用一个 filter 对整个图片进行逐步扫描。但只有出现了该特定形状的区域所卷积获得的输出才是真正有用的，用该 filter 卷积其他区域得出的数值就可能对该形状是否存在的判定影响较小。 比如下图中，我们还是考虑探测 “横折” 这个形状。 卷积后得到 3x3 的 Feature Map 中，真正有用的就是数字为 3 的那个节点，其余数值对于这个任务而言都是无关的。 所以用 3x3 的 Max pooling 后，并没有对 “横折” 的探测产生影响。 试想在这里例子中如果不使用 Max pooling，而让网络自己去学习。 网络也会去学习与[Max pooling](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=6\&q=Max+pooling\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiJNYXggcG9vbGluZyIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjY1NTI1MTgyLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6NiwiemRfdG9rZW4iOm51bGx9.SaxcqsaP1kDf0HCIe2SY-X23-3SSPvbeFmU2vghYekw\&zhida_source=entity)近似效果的权重。因为是近似效果，增加了更多的 parameters 的代价，却还不如直接进行 Max pooling。

![](https://pic1.zhimg.com/50/v2-8e9d7ec0662e903e475bd93a64067554_720w.jpg?source=2c26e567)

Max pooling 还有类似 “选择句” 的功能。假如有两个节点，其中第一个节点会在某些输入情况下最大，那么网络就只在这个节点上流通信息；而另一些输入又会让第二个节点的值最大，那么网络就转而走这个节点的分支。

但是 Max pooling 也有不好的地方。因为并非所有的抓取都像上图的极端例子。有些周边信息对某个概念是否存在的判定也有影响。 并且 Max pooling 是对所有的 Feature Maps 进行等价的操作。就好比用相同网孔的渔网打鱼，一定会有漏网之鱼。

## 全连接层

当抓取到足以用来识别图片的特征后，接下来的就是如何进行分类。 全连接层（也叫前馈层）就可以用来将最后的输出映射到[线性可分的空间](https://link.zhihu.com/?target=https%3A//yjango.gitbooks.io/superorganism/content/ren_gong_shen_jing_wang_luo.html)。 通常卷积网络的最后会将末端得到的长方体平摊 (flatten) 成一个长长的向量，并送入全连接层配合输出层进行分类。

卷积神经网络大致就是 covolutional layer, pooling layer, ReLu layer, fully-connected layer 的组合，例如下图所示的结构。

![](https://picx.zhimg.com/50/v2-cf87890eb8f2358f23a1ac78eb764257_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=https%3A//ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/)]

这里也体现了深层神经网络或 deep learning 之所以称 deep 的一个原因：模型将特征抓取层和分类层合在了一起。 负责特征抓取的卷积层主要是用来学习 “如何观察”。

下图简述了机器学习的发展，从最初的人工定义特征再放入分类器的方法，到让机器自己学习特征，再到如今尽量减少人为干涉的 deep learning。

![](https://picx.zhimg.com/50/v2-60e7c1e89c5aed5b828cbb24fc1e5a80_720w.jpg?source=2c26e567)

\[[from](https://link.zhihu.com/?target=http%3A//www.deeplearningbook.org/contents/intro.html)]

## 结构发展

以上介绍了卷积神经网络的基本概念。 以下是几个比较有名的卷积神经网络结构，详细的请看[CS231n](https://link.zhihu.com/?target=http%3A//cs231n.github.io/convolutional-networks/)。

* **LeNet**：第一个成功的卷积神经网络应用
* **AlexNet**：类似 LeNet，但更深更大。使用了层叠的卷积层来抓取特征（通常是一个卷积层马上一个 max pooling 层）
* **ZF Net**：增加了中间卷积层的尺寸，让第一层的 stride 和 filter size 更小。
* **GoogLeNet**：减少 parameters 数量，最后一层用 max pooling 层代替了全连接层，更重要的是[Inception-v4](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/1602.07261)模块的使用。
* **VGGNet**：只使用 3x3 卷积层和 2x2 pooling 层从头到尾堆叠。
* **ResNet**：引入了跨层连接和 batch normalization。
* **DenseNet**：将跨层连接从头进行到尾。

总结一下：这些结构的发展趋势有：

* 使用 small filter size 的卷积层和 pooling
* 去掉 parameters 过多的全连接层
* Inception（稍后会对其中的细节进行说明）
* 跳层连接

## 不变性的满足

接下来会谈谈我个人的，对于画面不变性是如何被卷积神经网络满足的想法。 同时结合不变性，对上面提到的结构发展的重要变动进行直觉上的解读。

需要明白的是为什么加入不变性可以提高网络表现。 并不是因为我们用了更炫酷的处理方式，而是加入了先验知识，无需从零开始用数据学习，节省了训练所需数据量。 思考表现提高的原因一定要从训练所需要的数据量切入。 提出满足新的不变性特点的神经网络是计算机视觉的一个主要研究方向。

## 平移不变性

可以说卷积神经网络最初引入局部连接和空间共享，就是为了满足平移不变性。

![](https://picx.zhimg.com/50/v2-1aac56212d5d143a006d569318e3ee8b_720w.jpg?source=2c26e567)

因为空间共享，在不同位置的同一形状就可以被等价识别，所以不需要对每个位置都进行学习。

![](https://pica.zhimg.com/50/v2-18c11c6f485e9f1bbc9a50eb3d248439_720w.jpg?source=2c26e567)

## 旋转和视角不变性

个人觉得卷积神经网络克服这一不变性的主要手段还是靠大量的数据。 并没有明确加入 “旋转和视角不变性” 的先验特性。

![](https://picx.zhimg.com/50/v2-0ce892f8b247f2b48a76cc57cbcba41d_720w.jpg?source=2c26e567)

[Deformable Convolutional Networks](https://link.zhihu.com/?target=https%3A//arxiv.org/abs/1703.06211)似乎是对此变性进行了进行增强。

## 尺寸不变性

与平移不变性不同，最初的[卷积网络](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=4\&q=%E5%8D%B7%E7%A7%AF%E7%BD%91%E7%BB%9C\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLljbfnp6_nvZHnu5wiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjQsInpkX3Rva2VuIjpudWxsfQ.j-iVRqGzre2I_P8DQwJHrnkWi5KIyP8d-oh2Ij0a5m0\&zhida_source=entity)并没有明确照顾尺寸不变性这一特点。

我们知道 filter 的 size 是事先选择的，而不同的尺寸所寻找的形状（概念）范围不同。

从直观上思考，如果选择小范围，再一步步通过组合，仍然是可以得到大范围的形状。 如 3x3 尺寸的形状都是可以由 2x2 形状的图形组合而成。所以形状的尺寸不变性对卷积神经网络而言并不算问题。 这恐怕 ZF Net 让第一层的 stride 和 filter size 更小，VGGNet 将所有 filter size 都设置成 3x3 仍可以得到优秀结果的一个原因。

但是，除了形状之外，很多概念的抓取通常需要考虑一个像素与周边更多像素之间的关系后得出。 也就是说 5x5 的 filter 也是有它的优点。 同时，小尺寸的堆叠需要很多个 filters 来共同完成，如果需要抓取的形状恰巧在 5x5 的范围，那么 5x5 会比 3x3 来的更有效率。 所以一次性使用多个不同[filter size](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=10\&q=filter+size\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiJmaWx0ZXIgc2l6ZSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjY1NTI1MTgyLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MTAsInpkX3Rva2VuIjpudWxsfQ.vdPVm541O1TxN7hp7t3BMD-Snns4gV6yMRV5T-ZRfdo\&zhida_source=entity)来抓取多个范围不同的概念是一种顺理成章的想法，而这个也就是 Inception。 可以说 Inception 是为了尺寸不变性而引入的一个先验知识。

## Inception

下图是 Inception 的结构，尽管也有不同的版本，但是其动机都是一样的：消除尺寸对于识别结果的影响，一次性使用多个不同 filter size 来抓取多个范围不同的概念，并让网络自己选择需要的特征。

你也一定注意到了蓝色的 1x1 卷积，撇开它，先看左边的这个结构。

输入（可以是被卷积完的长方体输出作为该层的输入）进来后，通常我们可以选择直接使用像素信息 (1x1 卷积) 传递到下一层，可以选择 3x3 卷积，可以选择 5x5 卷积，还可以选择 max pooling 的方式 downsample 刚被卷积后的 feature maps。 但在实际的网络设计中，究竟该如何选择需要大量的实验和经验的。 Inception 就不用我们来选择，而是将 4 个选项给神经网络，让网络自己去选择最合适的解决方案。

接下来我们再看右边的这个结构，多了很多蓝色的 1x1 卷积。 这些 1x1 卷积的作用是为了让网络根据需要能够更灵活的控制数据的 depth 的。

![](https://pic1.zhimg.com/50/v2-9692631d087622f1b34c80055f13fac5_720w.jpg?source=2c26e567)

## 1x1 卷积核

如果卷积的输出输入都只是一个平面，那么 1x1 卷积核并没有什么意义，它是完全不考虑像素与周边其他像素关系。 但卷积的输出输入是长方体，所以 1x1 卷积实际上是对每个像素点，在不同的 channels 上进行线性组合（信息整合），且保留了图片的原有平面结构，调控 depth，从而完成升维或降维的功能。

如下图所示，如果选择 2 个 filters 的 1x1 卷积层，那么数据就从原本的 depth 3 降到了 2。若用 4 个 filters，则起到了升维的作用。

这就是为什么上面 Inception 的 4 个选择中都混合一个 1x1 卷积，如右侧所展示的那样。 其中，绿色的 1x1 卷积本身就 1x1 卷积，所以不需要再用另一个 1x1 卷积。 而 max pooling 用来去掉卷积得到的 Feature Map 中的冗余信息，所以出现在 1x1 卷积之前，紧随刚被卷积后的 feature maps。（由于没做过实验，不清楚调换顺序会有什么影响。）

![](https://pic1.zhimg.com/50/v2-59429b22ac90930c502736b33db0d8e0_720w.jpg?source=2c26e567)

## [跳层连接](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=3\&q=%E8%B7%B3%E5%B1%82%E8%BF%9E%E6%8E%A5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLot7PlsYLov57mjqUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.o2IXFXonXlF0ClRt8hPTWxoH_S50bH8DVh7VAyN1Hgw\&zhida_source=entity)

前馈神经网络也好，卷积神经网络也好，都是一层一层逐步变换的，不允许跳层组合。 但现实中是否有跳层组合的现象？

比如说我们在判断一个人的时候，很多时候我们并不是观察它的全部，或者给你的图片本身就是残缺的。 这时我们会靠单个五官，外加这个人的着装，再加他的身形来综合判断这个人，如下图所示。 这样，即便图片本身是残缺的也可以很好的判断它是什么。 这和前馈神经网络的先验知识不同，它允许不同层级之间的因素进行信息交互、综合判断。

残差网络就是拥有这种特点的神经网络。大家喜欢用 identity mappings 去解释为什么[残差网络](https://zhida.zhihu.com/search?content_id=65525182\&content_type=Answer\&match_order=2\&q=%E6%AE%8B%E5%B7%AE%E7%BD%91%E7%BB%9C\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTEsInEiOiLmrovlt67nvZHnu5wiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2NTUyNTE4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.ff5w-vcR_CdYDBQ03LFB6220ILuZhwUFMpo3DjAY9-Y\&zhida_source=entity)更优秀。 这里我只是提供了一个以先验知识的角度去理解的方式。 需要注意的是每一层并不会像我这里所展示的那样，会形成明确的五官层。 只是有这样的组合趋势，实际无法保证神经网络到底学到了什么内容。

![](https://pica.zhimg.com/50/v2-40fb6ab7bf89ce43af1c52e673da65eb_720w.jpg?source=2c26e567)

用下图举一个更易思考的例子。 图形 1,2,3,4,5,6 是第一层卷积层抓取到的概念。 图形 7,8,9 是第二层卷积层抓取到的概念。 图形 7,8,9 是由 1,2,3,4,5,6 的基础上组合而成的。

但当我们想要探测的图形 10 并不是单纯的靠图形 7,8,9 组成，而是第一个卷积层的图形 6 和第二个卷积层的 8,9 组成的话，不允许跨层连接的卷积网络不得不用更多的 filter 来保持第一层已经抓取到的图形信息。并且每次传递到下一层都需要学习那个用于保留前一层图形概念的 filter 的权重。 当层数变深后，会越来越难以保持，还需要 max pooling 将冗余信息去掉。

一个合理的做法就是直接将上一层所抓取的概念也跳层传递给下下一层，不用让其每次都重新学习。 就好比在编程时构建了不同规模的 functions。 每个 function 我们都是保留，而不是重新再写一遍。提高了重用性。

同时，因为 ResNet 使用了跳层连接的方式。也不需要 max pooling 对保留低层信息时所产生的冗余信息进行去除。

![](https://picx.zhimg.com/50/v2-87fc4b7449d751c59977c3a368ae6f7e_720w.jpg?source=2c26e567)

Inception 中的第一个 1x1 的卷积通道也有类似的作用，但是 1x1 的卷积仍有权重需要学习。 并且 Inception 所使用的结合方式是 concatenate 的合并成一个更大的向量的方式，而 ResNet 的结合方式是 sum。 两个结合方式各有优点。 concatenate 当需要用不同的维度去组合成新观念的时候更有益。 而 sum 则更适用于并存的判断。比如既有油头发，又有胖身躯，同时穿着常年不洗的牛仔裤，三个不同层面的概念并存时，该人会被判定为程序员的情况。 又比如双向 LSTM 中正向和逆向序列抓取的结合常用相加的方式结合。在语音识别中，这表示既可以正向抓取某种特征，又可以反向抓取另一种特征。当两种特征同时存在时才会被识别成某个特定声音。

在下图的 ResNet 中，前一层的输入会跳过部分卷积层，将底层信息传递到高层。

![](https://picx.zhimg.com/50/v2-d3fd09f011583932b832ea64f78233af_720w.jpg?source=2c26e567)

在下图的 DenseNet 中，底层信息会被传递到所有的后续高层。

![](https://picx.zhimg.com/50/v2-0bebba2947e5e968a93e6def0ae5d00c_720w.jpg?source=2c26e567)

## 后续

随着时间推移，各个 ResNet,GoogLeNet 等框架也都在原有的基础上进行了发展和改进。 但基本都是上文描述的概念的组合使用加上其他的 tricks。

如下图所展示的，加入跳层连接的 Inception-ResNet。

![](https://picx.zhimg.com/50/v2-389496d1436895dfe43199a0f54c35ca_720w.jpg?source=2c26e567)

但对我而言，

> &#x20;**真正重要的是这些技巧对于各种不变性的满足。**&#x20;
