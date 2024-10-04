---
title: 阿里巴巴公司根据截图查到泄露信息的具体员工的技术是什么？
date: 2024-10-04T15:30:54.530Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/50735753/answer/122593277
---
本文通过一个的实验，简要介绍**频域**手段添加**数字盲水印**的方法，并进一步验证其**抗攻击性**。在上述实验的基础上，总结躲避数字盲水印的方法。（**多图预警**）

本文分为五个部分，第一部分综述；第二部分频域数字盲水印制作原理介绍；第三部分盲水印攻击性实验；第四部分总结；第五部分附录（源代码）。

**一、综述**

本文提供的一种实现 “阿里通过**肉眼无法识别**的标识码追踪员工” 的技术手段。通过看其他答主的分析，阿里可能还没用到频域加水印的技术。

相对于空域方法，频域加盲水印的方法**隐匿性更强，抵抗攻击能力更强**。这类算法解水印困难，你不知道水印加在那个频段，而且受到攻击往往**会破坏图像原本内容**。本文简要科普通过频域手段添加数字盲水印。对于 web，可以添加一个背景图片，来追踪截图者。

所谓**盲水印**，是指人**感知不到**的水印，包括**看不到**或**听不见**（没错，数字盲水印也能够用于音频）。其主要应用于音像作品、数字图书等，目的是，在**不破坏**原始作品的情况下，实现**版权**的防护与追踪。

添加数字盲水印的方法简单可分为空域方法和频域方法，这两种方法添加了**冗余信息**，但在编码和压缩情况不变的情况下，**不会使原始图像大小产生变化**（原来是 10MB 添加盲水印之后还是 10MB）。

空域是指空间域，我们日常所见的图像就是空域。空域添加数字水印的方法是在空间域直接对图像操作（之所以说的这么绕，是因为不仅仅原图是空域，原图的差分等等也是空域），比如将水印直接叠加在图像上。

我们常说一个音有多高，这个音高是指频率；同样， **图像灰度变化强烈的情况，** 也可以视为**图像的频率**。频域添加数字水印的方法，是指通过**某种变换手段**（傅里叶变换，[离散余弦变换](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E7%A6%BB%E6%95%A3%E4%BD%99%E5%BC%A6%E5%8F%98%E6%8D%A2\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLnprvmlaPkvZnlvKblj5jmjaIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.HLnyoScklsC2THEn_DhJxM8zl-uFYB82K4ZgX-cYue0\&zhida_source=entity)，小波变换等）将图像变换到 **频域（小波域）** ，在频域对图像添加水印，再通过**逆变换**，将图像转换为空间域。相对于空域手段，**频域手段隐匿性更强，抗攻击性更高**。

所谓对水印的攻击，是指破坏水印，包括 **涂抹，剪切，放缩，旋转，压缩，加噪，滤波等。** 数字盲水印不仅仅要敏捷性高（不被人抓到），也要防御性强（抗打）。就像 Dota 的敏捷英雄往往是脆皮，**数字盲水印的隐匿性和鲁棒性****是互斥的**。（鲁棒性是抗攻击性的学术名字）

**二、频域制作[数字盲水印](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=9\&q=%E6%95%B0%E5%AD%97%E7%9B%B2%E6%B0%B4%E5%8D%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLmlbDlrZfnm7LmsLTljbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjksInpkX3Rva2VuIjpudWxsfQ.NDcafXG9gnIFgL0SDMWPUnPSpAiuFsBjqTBpOl4Zgh8\&zhida_source=entity)的方法**

信号是有频率的，一个信号可以看做是无数个不同阶的正弦信号的的叠加。

F(\omega)=\int\_{-\infty }^{+\infty } f(t)e^{-i\omega t}dt

上式为傅里叶变换公式，f(t)是指时域信号（对于信号我们说时域，因为是与时间有关的，而图像我们往往说空域，与空间有关），\omega 是指频率。想要对傅里叶变换有深入了解的同学，建议看一下《[信号与系统](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E4%BF%A1%E5%8F%B7%E4%B8%8E%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLkv6Hlj7fkuI7ns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.N34vc-FsO_XXAjIR4CHfKoCZfozX1O5PObe9VPOqoKQ\&zhida_source=entity)》或者《数字信号处理》的教材，里面系统介绍了傅里叶变换、快速傅里叶变换、拉普拉斯变换、[z 变换](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=z%E5%8F%98%E6%8D%A2\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiJ65Y-Y5o2iIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6NDQ1MzEyODIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.4bR-4izlSi28rhtYOPtxqhVjs2v05ZRtBCPaIXcRhoo\&zhida_source=entity)等。

简而言之，我们有方法将时域信号转换成为频域，同样， **我们也能将二维信号（图像）转换为频域。** 在上文中提到，**图像的频率是指图像灰度变换的强烈情况**。关于此方面更系统的知识，参见[冈萨雷斯](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E5%86%88%E8%90%A8%E9%9B%B7%E6%96%AF\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLlhojokKjpm7fmlq8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.gMSmzXOY70u24BfBvhCYw7Ga9qT1QreJPhuH6GmyjH4\&zhida_source=entity)的《图像处理》。

下面以傅里叶变换为例，介绍通过频域给图像添加数字盲水印的方法。 **注意，** 因为图像是**离散信号**，我们实际用的是**离散傅里叶变换**，在本文采用的都是**二维快速傅里叶变换**，快速傅里叶变换与离散时间傅里叶变换等价，通过蝶型归并的手段，速度更快。下文中傅里叶变换均为二维快速傅里叶变换。

![](https://picx.zhimg.com/50/0be43f107d18f57dd72bc214498f9a76_720w.jpg?source=2c26e567)

上图为叠加数字盲水印的基本流程。编码的目的有二，一是对水印加密，二控制水印能量的分布。以下是叠加数字盲水印的实验。

这是原图像，尺寸 300\*240 （不要问我为什么不用 Lena，那是我前女友），

![](https://picx.zhimg.com/50/b3a4081fc7b9bbb79ffb000ecedc88e0_720w.jpg?source=2c26e567)

之后进行傅里叶变换，下图变换后的频域图像，

![](https://picx.zhimg.com/50/8744d653930d09b603ec571422ceb8ea_720w.jpg?source=2c26e567)

这是我想加的水印，尺寸 200\*100，

![](https://picx.zhimg.com/50/63030836c8e16a6347a83069f5c995fc_720w.jpg?source=2c26e567)

这是我编码后的水印，编码方式采用[随机序列编码](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E9%9A%8F%E6%9C%BA%E5%BA%8F%E5%88%97%E7%BC%96%E7%A0%81\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLpmo_mnLrluo_liJfnvJbnoIEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.xrfgvfaMcgukrjOmNa3AEHbFht2gwzAbyJCQxJLU7g8\&zhida_source=entity)，通过编码，水印分布到随机分布到各个频率，并且对水印进行了加密，

![](https://pic1.zhimg.com/50/9762930aae4390a0ebb87198efa64332_720w.jpg?source=2c26e567)

将上图与原图的频谱叠加，可见图像的频谱已经发生了巨大的变化，

![](https://pic1.zhimg.com/50/85474adf7decaa08b250be0ded87d7e6_720w.jpg?source=2c26e567)

之后，将叠加水印的频谱进行傅里叶逆变换，得到叠加数字水印后的图像，

![](https://picx.zhimg.com/50/eb37e5719b7dbdc7c2f1fee82555a9d3_720w.jpg?source=2c26e567)

肉眼几乎看不出叠加水印后的图像与原图的差异，这样，数字盲水印已经叠加到图像中去。

实际上，我们是把水印以噪声的形式添加到原图像中。

下图是在空域上的加水印图与原图的残差（调整了对比度，不然残差调小看不见），

![](https://picx.zhimg.com/50/6bb2786fcadc1a7c340dd9dac6ff4df5_720w.jpg?source=2c26e567)

可以看出，实际上上述方法是通过频域添加冗余信息（像噪声一样）。这些噪声遍布全图，在空域上并不容易破坏。

最终，均方误差（MSE）为 0.0244

信噪比（PSNR）为 64.2dB

那么，为什么频谱发生了巨大的变化，而在空域却变化如此小呢？这是因为我们避开了图像的主要频率。下图是原图频谱竖过来的样子，其能量主要集中在低频。

![](https://pic1.zhimg.com/50/497b039be857a52ebdd060fe59da58ca_720w.jpg?source=2c26e567)

水印提取是水印叠加的[逆过程](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E9%80%86%E8%BF%87%E7%A8%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLpgIbov4fnqIsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.2elz2Opk8OpkQ1YhH-mqz9Dxa6CiiRLZLfoE6iiokiM\&zhida_source=entity)，

![](https://picx.zhimg.com/50/4f09483bfa5e0601aa77ed516bdf46fd_720w.jpg?source=2c26e567)

经提取后，我们得到如下水印， **问：为什么水印要对称呢？** 嘿嘿，大家想想看。

![](https://picx.zhimg.com/50/ae69d7c600f12d5c236bd0ebfea0a361_720w.jpg?source=2c26e567)

**三、攻击性实验**

本部分进行攻击性实验，来验证通过频域手段叠加数字盲水印的鲁棒性。

1\. 进行涂抹攻击，这是攻击后的图片：

![](https://pic1.zhimg.com/50/104994386bbf1e9b9cbea3eeb609264c_720w.jpg?source=2c26e567)

再进行水印提取：

![](https://picx.zhimg.com/50/d269c1532e70d6de7c2060c2e18563e9_720w.jpg?source=2c26e567)

2\. 进行剪切攻击，就是网上经常用的截图截取一部分的情况：

![](https://picx.zhimg.com/50/ad05d44a39b5a6af756d1c2aefc7ec1c_720w.jpg?source=2c26e567)

进行循环补全：

![](https://pica.zhimg.com/50/238231eb23a3b6589fec927bae928163_720w.jpg?source=2c26e567)

提取水印：

![](https://pic1.zhimg.com/50/cff34012b4b2005982bbd178a6d37c46_720w.jpg?source=2c26e567)

3\. 伸缩攻击（这个实验明码做的，水印能量较高，隐匿性不强）：

![](https://picx.zhimg.com/50/37aaa1b83edeafd61f039d7d788da0bf_720w.jpg?source=2c26e567)

提取水印（水印加的不好，混频挺严重的）：

![](https://picx.zhimg.com/50/201871f587c91c544b9a6f4abb7b50ee_720w.jpg?source=2c26e567)

4\. 旋转攻击（明码）：

![](https://picx.zhimg.com/50/5ac9538cd769228a3ee9a1010a70ac66_720w.jpg?source=2c26e567)

提取水印：

![](https://pic1.zhimg.com/50/350b0512cf32ee01f389c0ddee3a1b43_720w.jpg?source=2c26e567)

5.JPEG 压缩后（这个实验我好像是拿明码做的，能量主要加在了高频）：

![](https://picx.zhimg.com/50/7294860f10dd05dc07edf292f893f517_720w.jpg?source=2c26e567)

提取结果：

![](https://picx.zhimg.com/50/f0eedd3f2c5a64dfb12806d056d53afe_720w.jpg?source=2c26e567)

6.PS 4 像素马赛克 /[均值滤波](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E5%9D%87%E5%80%BC%E6%BB%A4%E6%B3%A2\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLlnYflgLzmu6Tms6IiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.aAUw2dWLYXLQnfVRUZ_nQkOEPdSScxzobGj3uFWJCaI\&zhida_source=entity)等，攻击后图像 (这是我女朋友吗？丑死了)：

![](https://pic1.zhimg.com/50/1bdc3e13d618c4bde517d39be1abfe14_720w.jpg?source=2c26e567)

提取水印后图像：

![](https://pic1.zhimg.com/50/78dae620d32d3e0509ff99b848ac88f2_720w.jpg?source=2c26e567)

7\. 截屏，

截屏后我手动抠出要测试的图像区域，并且抽样或者插值到原图尺寸：

![](https://pic1.zhimg.com/50/32dfb311269481bb13e8da232c3a167d_720w.jpg?source=2c26e567)

测试结果：

![](https://pic1.zhimg.com/50/7883b1811c59826caf96e9a0742c8f2f_720w.jpg?source=2c26e567)

8\. 亮度调节（明码）：

![](https://pica.zhimg.com/50/6164c4a16c0d536ae03b849e2f5f7cb0_720w.jpg?source=2c26e567)

水印提取：

![](https://picx.zhimg.com/50/1e059b20263653d450c496f53a74b371_720w.jpg?source=2c26e567)

9\. 色相调节（明码）：

![](https://picx.zhimg.com/50/185bc9841a1a4b3bb77857268d9f5c33_720w.jpg?source=2c26e567)

水印提取：

![](https://pic1.zhimg.com/50/932c47bc2fd83f6a48f08e6e10218155_720w.jpg?source=2c26e567)

10\. 饱和度调节（明码）：

![](https://pica.zhimg.com/50/008d382b9979b3728229639f9535e42b_720w.jpg?source=2c26e567)

水印：

![](https://pica.zhimg.com/50/ece7657225fb4522d54562e555cf4478_720w.jpg?source=2c26e567)

11\. 对比度（明码）：

![](https://picx.zhimg.com/50/d8885103e3a556f769344789b4feb654_720w.jpg?source=2c26e567)

水印：

![](https://picx.zhimg.com/50/655d4e3d3175c75b727ee0746eed1164_720w.jpg?source=2c26e567)

\


12\. 评论区用[waifu2x](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=waifu2x\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiJ3YWlmdTJ4IiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6NDQ1MzEyODIsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.LcV43JKlsvCFVeZ3jMR6L342sL3t-7LjU2kp9uUWLok\&zhida_source=entity)去噪后图片：

![](https://pic1.zhimg.com/50/bbe078c282f01ad5daf0c31d01375e47_720w.jpg?source=2c26e567)

解水印：

![](https://picx.zhimg.com/50/c7f4a130b5668fd9eaacd03dfdb89f9b_720w.jpg?source=2c26e567)

13\. 美图秀秀，我对我女票一键美颜，美白，磨皮，加腮红，加唇彩（有一种很羞耻的感觉，捂脸）：

![](https://picx.zhimg.com/50/d6bdb3a5d9bce0c6de409ce699129f54_720w.jpg?source=2c26e567)

提取水印：

![](https://picx.zhimg.com/50/c7f4a130b5668fd9eaacd03dfdb89f9b_720w.jpg?source=2c26e567)

14\. 对于背景纯色的图其实也是无所谓的

![](https://pic1.zhimg.com/50/a6edbc9a370dde28dc9e2f320a31ab50_720w.jpg?source=2c26e567)

能量系数为 10 时加水印图片：觉得太显噪就把能量系数调低，不过水印的隐秘性和鲁棒性是互斥的

![](https://pic1.zhimg.com/50/2f8d121e7d8174299c2a8eddc4dca05e_720w.jpg?source=2c26e567)

最终提取出的水印：

![](https://picx.zhimg.com/50/29c89dd9595d0605e0ba70e657a3f358_720w.jpg?source=2c26e567)

15\. 我用将 RGB>600 的像素设置成为 (0，255，0) 来模拟 PS 魔术手，

![](https://picx.zhimg.com/50/dd39d93e64b2ce44751e9358feb6d957_720w.jpg?source=2c26e567)

提取水印为：

![](https://pic1.zhimg.com/50/cfb84d767e7cc6c7f7ffc3b4928c14a1_720w.jpg?source=2c26e567)

16\. 屏摄，好吧，这个实验我做哭了

屏摄图：

![](https://picx.zhimg.com/50/d92a632dde3a1583db4163dcf4d53b0a_720w.jpg?source=2c26e567)

实验结果：

![](https://picx.zhimg.com/50/982aa30e34745873a6297a58213ebc6e_720w.jpg?source=2c26e567)

我把水印能量系数调整到 2000 都没有用。

屏摄之后与原图信噪比为 4dB 左右，我用多抽样滤波的方式试过，滤不掉屏摄引入的噪声。屏摄不仅引入了椒盐噪声，[乘性噪声](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E4%B9%98%E6%80%A7%E5%99%AA%E5%A3%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLkuZjmgKflmarlo7AiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.pES4D7tAJ9gWsM5wpkvA1_36qiquCCkjnjuQtHQoAP0\&zhida_source=entity)，还有有规律的雪花纹理（[摩尔纹](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=1\&q=%E6%91%A9%E5%B0%94%E7%BA%B9\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLmkanlsJTnurkiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.oSkNFqotvbCi-MKBMdiEqz1Xh-Nycy6XHUl5lrPukLg\&zhida_source=entity)）。

**四、总结**

基于频域的盲水印方法隐藏性强，[鲁棒性](https://zhida.zhihu.com/search?content_id=44531282\&content_type=Answer\&match_order=5\&q=%E9%B2%81%E6%A3%92%E6%80%A7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NTIsInEiOiLpsoHmo5LmgKciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo0NDUzMTI4MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjUsInpkX3Rva2VuIjpudWxsfQ.0qmOgOyITPSmE5uFNWMNBhKhlHTW1_PcjRZaVjWM0WI\&zhida_source=entity)高，能够抵御大部分攻击。但是，对于盲水印算法， **鲁棒性和隐匿性是互斥的。**&#x20;

本文方法**针对屏摄**不行，我多次实验没有成功，哪位大神可以做一下或者讨论讨论。还有二值化不行，这是我想当然的，觉得肯定不行所以没做实验。其他的我试了试，用给出的方法调整一下能量系数都可以。

我想大家最关心的是什么最安全，不会被追踪。

不涉及图像的都安全，比如拿笔记下来。

涉及图像的**屏摄最安全**，

截屏十分不安全。

\=====**彩蛋**====

![](https://pic1.zhimg.com/50/e043083a7f564fa9677d9a147ada4851_720w.jpg?source=2c26e567)

我在上图明码写入了信息。为了抵抗 jpg 压缩，我水印能量较高，并且因为没有编码，能量分布不均。图中规律性纹路，就是你懂的。嘿嘿，你懂的，解开看看吧。

\


[@杨一丁](//www.zhihu.com/people/58bf4ee9c1518503b1766f3b3366d6be)

在答案中给出了上图隐写的内容，（雾）。

**五、附录**

```matlab
%% 傅里叶变换加水印源代码
%% 运行环境 Matlab2010a 
clc;clear;close all;
alpha = 1;

%% read data
im = double(imread('gl1.jpg'))/255;
mark = double(imread('watermark.jpg'))/255;
figure, imshow(im),title('original image');
figure, imshow(mark),title('watermark');

%% encode mark
imsize = size(im);
%random
TH=zeros(imsize(1)*0.5,imsize(2),imsize(3));
TH1 = TH;
TH1(1:size(mark,1),1:size(mark,2),:) = mark;
M=randperm(0.5*imsize(1));
N=randperm(imsize(2));
save('encode.mat','M','N');
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        TH(i,j,:)=TH1(M(i),N(j),:);
    end
end
% symmetric
mark_ = zeros(imsize(1),imsize(2),imsize(3));
mark_(1:imsize(1)*0.5,1:imsize(2),:)=TH;
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        mark_(imsize(1)+1-i,imsize(2)+1-j,:)=TH(i,j,:);
    end
end
figure,imshow(mark_),title('encoded watermark');
%imwrite(mark_,'encoded watermark.jpg');

%% add watermark
FA=fft2(im);
figure,imshow(FA);title('spectrum of original image');
FB=FA+alpha*double(mark_);
figure,imshow(FB); title('spectrum of watermarked image');
FAO=ifft2(FB);
figure,imshow(FAO); title('watermarked image');
%imwrite(uint8(FAO),'watermarked image.jpg');
RI = FAO-double(im);
figure,imshow(uint8(RI)); title('residual');
%imwrite(uint8(RI),'residual.jpg');
xl = 1:imsize(2);
yl = 1:imsize(1);
[xx,yy] = meshgrid(xl,yl);
figure, plot3(xx,yy,FA(:,:,1).^2+FA(:,:,2).^2+FA(:,:,3).^2),title('spectrum of original image');
figure, plot3(xx,yy,FB(:,:,1).^2+FB(:,:,2).^2+FB(:,:,3).^2),title('spectrum of watermarked image');
figure, plot3(xx,yy,FB(:,:,1).^2+FB(:,:,2).^2+FB(:,:,3).^2-FA(:,:,1).^2+FA(:,:,2).^2+FA(:,:,3).^2),title('spectrum of watermark');

%% extract watermark
FA2=fft2(FAO);
G=(FA2-FA)/alpha;
GG=G;
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(M(i),N(j),:)=G(i,j,:);
    end
end
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(imsize(1)+1-i,imsize(2)+1-j,:)=GG(i,j,:);
    end
end
figure,imshow(GG);title('extracted watermark');
%imwrite(uint8(GG),'extracted watermark.jpg');

%% MSE and PSNR
C=double(im);
RC=double(FAO);
MSE=0; PSNR=0;
for i=1:imsize(1)
    for j=1:imsize(2)
        MSE=MSE+(C(i,j)-RC(i,j)).^2;
    end
end
MSE=MSE/360.^2;
PSNR=20*log10(255/sqrt(MSE));
MSE
PSNR

%% attack test
%% attack by smearing
%A = double(imread('gl1.jpg'));
%B = double(imread('attacked image.jpg'));
attack = 1-double(imread('attack.jpg'))/255;
figure,imshow(attack);
FAO_ = FAO;
for i=1:imsize(1)
    for j=1:imsize(2)
        if attack(i,j,1)+attack(i,j,2)+attack(i,j,3)>0.5
            FAO_(i,j,:) = attack(i,j,:);
        end
    end
end
figure,imshow(FAO_);
%extract watermark
FA2=fft2(FAO_);
G=(FA2-FA)*2;
GG=G;
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(M(i),N(j),:)=G(i,j,:);
    end
end
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(imsize(1)+1-i,imsize(2)+1-j,:)=GG(i,j,:);
    end
end
figure,imshow(GG);title('extracted watermark');

%% attack by cutting
s2 = 0.8;
FAO_ = FAO;
FAO_(:,s2*imsize(2)+1:imsize(2),:) = FAO_(:,1:int32((1-s2)*imsize(2)),:);
figure,imshow(FAO_);
%extract watermark
FA2=fft2(FAO_);
G=(FA2-FA)*2;
GG=G;
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(M(i),N(j),:)=G(i,j,:);
    end
end
for i=1:imsize(1)*0.5
    for j=1:imsize(2)
        GG(imsize(1)+1-i,imsize(2)+1-j,:)=GG(i,j,:);
    end
end
figure,imshow(GG);title('extracted watermark');


%% 小波变换加水印，解水印大家按照加的思路逆过来就好
clc;clear;close all;
%% read data
im = double(imread('gl1.jpg'))/255;
mark = double(imread('watermark.jpg'))/255;
figure, imshow(im),title('original image');
figure, imshow(mark),title('watermark');
%% RGB division
im=double(im); 
mark=double(mark); 
imr=im(:,:,1); 
markr=mark(:,:,1); 
img=im(:,:,2); 
markg=mark(:,:,2); 
imb=im(:,:,3); 
markb=mark(:,:,3); 
%% parameter
r=0.04; 
g = 0.04; 
b = 0.04;
%% wavelet tranform and add watermark
% for red
[Cwr,Swr]=wavedec2(markr,1,'haar'); 
[Cr,Sr]=wavedec2(imr,2,'haar'); 
% add watermark
Cr(1:size(Cwr,2)/16)=... 
Cr(1:size(Cwr,2)/16)+r*Cwr(1:size(Cwr,2)/16); 
k=0; 
while k<=size(Cr,2)/size(Cwr,2)-1 
Cr(1+size(Cr,2)/4+k*size(Cwr,2)/4:size(Cr,2)/4+... 
(k+1)*size(Cwr,2)/4)=Cr(1+size(Cr,2)/4+... 
k*size(Cwr,2)/4:size(Cr,2)/4+(k+1)*size(Cwr,2)/4)+... 
r*Cwr(1+size(Cwr,2)/4:size(Cwr,2)/2); 
Cr(1+size(Cr,2)/2+k*size(Cwr,2)/4:size(Cr,2)/2+... 
(k+1)*size(Cwr,2)/4)=Cr(1+size(Cr,2)/2+... 
k*size(Cwr,2)/4:size(Cr,2)/2+(k+1)*size(Cwr,2)/4)+... 
r*Cwr(1+size(Cwr,2)/2:3*size(Cwr,2)/4); 
Cr(1+3*size(Cwr,2)/4+k*size(Cwr,2)/4:3*size(Cwr,2)/4+... 
(k+1)*size(Cwr,2)/4)=Cr(1+3*size(Cr,2)/4+... 
k*size(Cwr,2)/4:3*size(Cr,2)/4+(k+1)*size(Cwr,2)/4)+... 
r*Cwr(1+3*size(Cwr,2)/4:size(Cwr,2)); 
k=k+1; 
end; 
Cr(1:size(Cwr,2)/4)=Cr(1:size(Cwr,2)/4)+r*Cwr(1:size(Cwr,2)/4); 

% for green
[Cwg,Swg]=WAVEDEC2(markg,1,'haar'); 
[Cg,Sg]=WAVEDEC2(img,2,'haar'); 
Cg(1:size(Cwg,2)/16)=... 
Cg(1:size(Cwg,2)/16)+g*Cwg(1:size(Cwg,2)/16); 
k=0; 
while k<=size(Cg,2)/size(Cwg,2)-1 
Cg(1+size(Cg,2)/4+k*size(Cwg,2)/4:size(Cg,2)/4+... 
(k+1)*size(Cwg,2)/4)=Cg(1+size(Cg,2)/4+... 
k*size(Cwg,2)/4:size(Cg,2)/4+(k+1)*size(Cwg,2)/4)+... 
g*Cwg(1+size(Cwg,2)/4:size(Cwg,2)/2); 
Cg(1+size(Cg,2)/2+k*size(Cwg,2)/4:size(Cg,2)/2+... 
(k+1)*size(Cwg,2)/4)=Cg(1+size(Cg,2)/2+... 
k*size(Cwg,2)/4:size(Cg,2)/2+(k+1)*size(Cwg,2)/4)+... 
g*Cwg(1+size(Cwg,2)/2:3*size(Cwg,2)/4); 
Cg(1+3*size(Cg,2)/4+k*size(Cwg,2)/4:3*size(Cg,2)/4+... 
(k+1)*size(Cwg,2)/4)=Cg(1+3*size(Cg,2)/4+... 
k*size(Cwg,2)/4:3*size(Cg,2)/4+(k+1)*size(Cwg,2)/4)+... 
g*Cwg(1+3*size(Cwg,2)/4:size(Cwg,2)); 
k=k+1; 
end; 
Cg(1:size(Cwg,2)/4)=Cg(1:size(Cwg,2)/4)+g*Cwg(1:size(Cwg,2)/4); 

% for blue
[Cwb,Swb]=WAVEDEC2(markb,1,'haar'); 
[Cb,Sb]=WAVEDEC2(imb,2,'haar'); 
Cb(1:size(Cwb,2)/16)+b*Cwb(1:size(Cwb,2)/16); 
k=0; 
while k<=size(Cb,2)/size(Cwb,2)-1 
Cb(1+size(Cb,2)/4+k*size(Cwb,2)/4:size(Cb,2)/4+... 
(k+1)*size(Cwb,2)/4)=Cb(1+size(Cb,2)/4+... 
k*size(Cwb,2)/4:size(Cb,2)/4+(k+1)*size(Cwb,2)/4)+... 
g*Cwb(1+size(Cwb,2)/4:size(Cwb,2)/2); 
Cb(1+size(Cb,2)/2+k*size(Cwb,2)/4:size(Cb,2)/2+... 
(k+1)*size(Cwb,2)/4)=Cb(1+size(Cb,2)/2+... 
k*size(Cwb,2)/4:size(Cb,2)/2+(k+1)*size(Cwb,2)/4)+... 
b*Cwb(1+size(Cwb,2)/2:3*size(Cwb,2)/4); 
Cb(1+3*size(Cb,2)/4+k*size(Cwb,2)/4:3*size(Cb,2)/4+... 
(k+1)*size(Cwb,2)/4)=Cb(1+3*size(Cb,2)/4+... 
k*size(Cwb,2)/4:3*size(Cb,2)/4+(k+1)*size(Cwb,2)/4)+... 
b*Cwb(1+3*size(Cwb,2)/4:size(Cwb,2)); 
k=k+1; 
end; 
Cb(1:size(Cwb,2)/4)=Cb(1:size(Cwb,2)/4)+b*Cwb(1:size(Cwb,2)/4); 
%% image reconstruction
imr=WAVEREC2(Cr,Sr,'haar'); 
img=WAVEREC2(Cg,Sg,'haar'); 
imb=WAVEREC2(Cb,Sb,'haar'); 
imsize=size(imr); 
FAO=zeros(imsize(1),imsize(2),3); 
for i=1:imsize(1); 
for j=1:imsize(2); 
FAO(i,j,1)=imr(i,j); 
FAO(i,j,2)=img(i,j); 
FAO(i,j,3)=imb(i,j); 
end 
end 
figure, imshow(FAO); title('watermarked image');
```
