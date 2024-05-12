---
title: "数字盲水印"
date: 2022-09-09T09:54:27+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [阿里巴巴公司根据截图查到泄露信息的具体员工的技术是什么？](https://www.zhihu.com/question/50735753/answer/122593277)

本文通过一个的实验，简要介绍**频域**手段添加**数字盲水印**的方法，并进一步验证其**抗攻击性**。在上述实验的基础上，总结躲避数字盲水印的方法。（**多图预警**）

本文分为五个部分，第一部分综述；第二部分频域数字盲水印制作原理介绍；第三部分盲水印攻击性实验；第四部分总结；第五部分附录（源代码）。

## 一、综述

本文提供的一种实现“阿里通过**肉眼无法识别**的标识码追踪员工”的技术手段。通过看其他答主的分析，阿里可能还没用到频域加水印的技术。

相对于空域方法，频域加盲水印的方法**隐匿性更强，抵抗攻击能力更强**。这类算法解水印困难，你不知道水印加在那个频段，而且受到攻击往往**会破坏图像原本内容**。本文简要科普通过频域手段添加数字盲水印。对于 web，可以添加一个背景图片，来追踪截图者。

所谓**盲水印**，是指人**感知不到**的水印，包括**看不到**或**听不见**（没错，数字盲水印也能够用于音频）。其主要应用于音像作品、数字图书等，目的是，在**不破坏**原始作品的情况下，实现**版权**的防护与追踪。

添加数字盲水印的方法简单可分为空域方法和频域方法，这两种方法添加了**冗余信息**，但在编码和压缩情况不变的情况下，**不会使原始图像大小产生变化**（原来是 10MB 添加盲水印之后还是 10MB）。

空域是指空间域，我们日常所见的图像就是空域。空域添加数字水印的方法是在空间域直接对图像操作（之所以说的这么绕，是因为不仅仅原图是空域，原图的差分等等也是空域），比如将水印直接叠加在图像上。

我们常说一个音有多高，这个音高是指频率；同样，**图像灰度变化强烈的情况，**也可以视为**图像的频率**。频域添加数字水印的方法，是指通过**某种变换手段**（傅里叶变换，离散余弦变换，小波变换等）将图像变换到**频域（小波域）**，在频域对图像添加水印，再通过**逆变换**，将图像转换为空间域。相对于空域手段，**频域手段隐匿性更强，抗攻击性更高**。

所谓对水印的攻击，是指破坏水印，包括 **涂抹，剪切，放缩，旋转，压缩，加噪，滤波等。** 数字盲水印不仅仅要敏捷性高（不被人抓到），也要防御性强（抗打）。就像 Dota 的敏捷英雄往往是脆皮，**数字盲水印的隐匿性和鲁棒性是互斥的**。（鲁棒性是抗攻击性的学术名字）

## 二、频域制作数字盲水印的方法

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/fe73b29d.png)

简而言之，我们有方法将时域信号转换成为频域，同样， **我们也能将二维信号（图像）转换为频域。** 在上文中提到，**图像的频率是指图像灰度变换的强烈情况**。关于此方面更系统的知识，参见冈萨雷斯的《图像处理》。

下面以傅里叶变换为例，介绍通过频域给图像添加数字盲水印的方法。**注意，**因为图像是**离散信号**，我们实际用的是**离散傅里叶变换**，在本文采用的都是**二维快速傅里叶变换**，快速傅里叶变换与离散时间傅里叶变换等价，通过蝶型归并的手段，速度更快。下文中傅里叶变换均为二维快速傅里叶变换。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/351d2537.jpe)

上图为叠加数字盲水印的基本流程。编码的目的有二，一是对水印加密，二控制水印能量的分布。以下是叠加数字盲水印的实验。

这是原图像，尺寸 300\*240 （不要问我为什么不用 Lena，那是我前女友），

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/6389258d.jpe)

之后进行傅里叶变换，下图变换后的频域图像，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/577cbcea.jpe)

这是我想加的水印，尺寸 200\*100，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/3edf2890.jpe)

这是我编码后的水印，编码方式采用随机序列编码，通过编码，水印分布到随机分布到各个频率，并且对水印进行了加密，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/d02c0cef.jpe)

将上图与原图的频谱叠加，可见图像的频谱已经发生了巨大的变化，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/66d0a7c7.jpe)

之后，将叠加水印的频谱进行傅里叶逆变换，得到叠加数字水印后的图像，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/c3420283.jpe)

肉眼几乎看不出叠加水印后的图像与原图的差异，这样，数字盲水印已经叠加到图像中去。

实际上，我们是把水印以噪声的形式添加到原图像中。

下图是在空域上的加水印图与原图的残差（调整了对比度，不然残差调小看不见），

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/e5ecb1f8.jpe)

可以看出，实际上上述方法是通过频域添加冗余信息（像噪声一样）。这些噪声遍布全图，在空域上并不容易破坏。

最终，均方误差（MSE）为 0.0244

信噪比（PSNR）为 64.2dB

那么，为什么频谱发生了巨大的变化，而在空域却变化如此小呢？这是因为我们避开了图像的主要频率。下图是原图频谱竖过来的样子，其能量主要集中在低频。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/0f987ca2.jpe)

水印提取是水印叠加的逆过程，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/0dd5eeae.jpe)

经提取后，我们得到如下水印，**问：为什么水印要对称呢？**嘿嘿，大家想想看。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/e4a60a54.jpe)

## 三、攻击性实验

本部分进行攻击性实验，来验证通过频域手段叠加数字盲水印的鲁棒性。

1.进行涂抹攻击，这是攻击后的图片：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/a36f586a.jpe)

再进行水印提取：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/40a418c4.jpe)

2.进行剪切攻击，就是网上经常用的截图截取一部分的情况：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/83749ebe.jpe)

进行循环补全：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/3317f747.jpe)

提取水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/66b41110.jpe)

3.伸缩攻击（这个实验明码做的，水印能量较高，隐匿性不强）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/af38822e.jpe)

提取水印（水印加的不好，混频挺严重的）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/7a76e7db.jpe)

4.旋转攻击（明码）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/f148af7f.jpe)

提取水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/fbf60516.jpe)

5.JPEG 压缩后（这个实验我好像是拿明码做的，能量主要加在了高频）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/16334b03.jpe)

提取结果：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/d70c217f.jpe)

6.PS 4 像素马赛克/均值滤波等，攻击后图像\(这是我女朋友吗？丑死了\)：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/a42767bc.jpe)

提取水印后图像：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/7793f360.jpe)

7.截屏，

截屏后我手动抠出要测试的图像区域，并且抽样或者插值到原图尺寸：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/2670ef3c.jpe)

测试结果：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/cb2a6072.jpe)

8.亮度调节（明码）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/344c81e4.jpe)

水印提取：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/7c4871d8.jpe)

9.色相调节（明码）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/cb4bf5ba.jpe)

水印提取：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/8a046d70.jpe)

10.饱和度调节（明码）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/e358bd02.jpe)

水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/13c6bb93.jpe)

11.对比度（明码）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/578a6c8e.jpe)

水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/4f8f4f32.jpe)

12.评论区用 waifu2x 去噪后图片：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/96529449.jpe)

解水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/9768618c.jpe)

13.美图秀秀，我对我女票一键美颜，美白，磨皮，加腮红，加唇彩（有一种很羞耻的感觉，捂脸）：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/a1944d9d.jpe)

提取水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/790817be.jpe)

14.对于背景纯色的图其实也是无所谓的

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/e1b78a43.jpe)

能量系数为 10 时加水印图片：觉得太显噪就把能量系数调低，不过水印的隐秘性和鲁棒性是互斥的

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/1b404a2e.jpe)

最终提取出的水印：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/ff4a8d2a.jpe)

15.我用将 RGB>600 的像素设置成为\(0，255，0\)来模拟 PS 魔术手，

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/b88cc012.jpe)

提取水印为：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/d013a1fb.jpe)

16.屏摄，好吧，这个实验我做哭了

屏摄图：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/e1adb78b.jpe)

实验结果：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_fhubt9msm4r46ut/1bab7fdd.jpe)

我把水印能量系数调整到 2000 都没有用。

屏摄之后与原图信噪比为 4dB 左右，我用多抽样滤波的方式试过，滤不掉屏摄引入的噪声。屏摄不仅引入了椒盐噪声，乘性噪声，还有有规律的雪花纹理（摩尔纹）。

## 四、总结

基于频域的盲水印方法隐藏性强，鲁棒性高，能够抵御大部分攻击。但是，对于盲水印算法，**鲁棒性和隐匿性是互斥的。**

本文方法**针对屏摄**不行，我多次实验没有成功，哪位大神可以做一下或者讨论讨论。还有二值化不行，这是我想当然的，觉得肯定不行所以没做实验。其他的我试了试，用给出的方法调整一下能量系数都可以。

我想大家最关心的是什么最安全，不会被追踪。

不涉及图像的都安全，比如拿笔记下来。

涉及图像的**屏摄最安全**，

截屏十分不安全。

## 五、附录

```matlab
%%傅里叶变换加水印源代码
%% 运行环境Matlab2010a
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


%%小波变换加水印，解水印大家按照加的思路逆过来就好
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

---

首先，假如阿里有 4294967296 个人，也不过需要一个 int32 的信息量就可以判断。
然后，根据一些其他信息，可以精确到部门，这样甚至也不过是 256 人，那就变成了一个 byte。
在一张动辄上 mb 的图片里面，隐藏一个 int32 的信息量，不要太简单。最简单的一些做法，比如文字换行规则，比如要求一行满 20 字就强行换行表示 0，不是 20 字表示 1。这样只需要 32 行就可以记录一个 int32 的数据量。
甚至，我们可以以汉语词汇来表示。比如用“规则”和“规矩”作为 0 和 1。我们总能找到高频词汇，然后找一组同义词。甚至可以用“的得地”来表示编码。这样的措施甚至连拍摄屏幕都无法去掉。
毕竟 1MB 是 4byte 的几十万倍，在百万乱军中藏身一个小卒不被发现，真的是太容易。

---

上面的回答中，识别码都是页面叠加“隐形”图片。

我有一个新的思路，毕竟他们的内网是以文字为主的而不是图片。所以如果在网页文字显示上面做点手脚，比如行距、字间距、或者标点符号前后间距搞点错位，以此记录工号信息，就算是屏摄也可以抗。

---

第一，根据高票答案中，水印提取中需要原始图片来看，这不是盲数字水印，而是非盲数字水印。如果是盲数字水印，提取水印不能够使用没有加载过水印的原图。

盲水印的检测方法大概是这样，先把待检测图片变换到频域，水印图片也需要变换到频域，两者在频域进行相关运算，然后把运算结果和一个阈值进行比较确定图片中是否存在水印。

第二，如何通过水印检测不同员工。我们不可能给每一个员工分配同样的水印，不同员工图片中嵌入的水印应该尽可能差异大，这样才能保证我们在检测水印时不会造成误判。学术圈里面还把这个东西叫做数字指纹，digital fingerprinting，这东西十年前被马里兰大学一个实验室的老板和学生灌了好多篇论文，大老板还搞了个 IEEE Transactions on Information Forensics and Security，基础论文在此

[Anti-collusion Fingerprinting for Multimedia, IEEE TRANSACTIONS ON SIGNAL PROCESSING, VOL. 51, NO. 4, APRIL 2003](http://sig.umd.edu/publications/trappe_anticollusion_200304.pdf)

---
