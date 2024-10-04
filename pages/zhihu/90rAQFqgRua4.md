---
title: CPU 的工作原理是什么？
date: 2024-10-04T15:30:37.400Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/40571490/answer/746043817
---
文章比较长，不过我相信是值得花时间观看的，**一定能看到别处看不到的知识**，能对 CPU 有**更为深入**的**理解**。**第一部分**是补充背景知识的**综述部分**，我相信就算是外行耐下心来看也是可以读懂的；文章的第二部分深度会有增加，下面为第二部分的目录，有基础知识的建议直接跳到后面去阅读。

* 1，为什么 MOSFET 是 逻辑电路的最基本单元，为什么电路最基本的逻辑是‘非’，以及为什么逻辑是 “与非’ ‘或非’而不是 ‘ 与’ ‘或‘
* 2，把‘电子’ 装进盒子里的各种储存单元：register（俗称寄存器，L0 cache），cache（SRAM），DRAM（俗称内存）， & Flash Drive （俗称‘闪存’）
* 3，TDP，主频，超频及其相关

欢迎大家指正错误！我会及时改正的。

如果大家还有感兴趣的话题在下方留言即可，答主一定会认真回复的， 谢谢支持！！！

***

## 1 大致感受一下 CPU 是什么

* 家用电脑里的 Intel ， AMD 处理器
* 手机里，高通的骁龙处理器，三星的 Exynos，华为的 麒麟，千元机的 MTK；苹果的 A 12。
* 商用电脑 Intel 至强（在文中这个不展开）

![](https://picx.zhimg.com/50/v2-9fc3229dbd6c317a096a3223fb13b7e7_720w.jpg?source=2c26e567)

Major parts of a CPU

上图中，你可以看到，CPU 里有**两部分**：

* 一部分叫做** Control Unit**，负责控制。比如计数器，指令寄存，等等。
* 一部分叫做** Logic Unit**，负责运算。比如加法器，累加器，等等。有些也会把 ‘ 数据总线’ 归于逻辑运算单元里。
* 其实 CPU 里还有存储单元等其他单元，比如 L1，L2，L3 Cache 等等。

输入设备就是 鼠标，键盘，触控板，触摸屏等， 用户通过这些东西对电脑进行输入指令，CPU 识别指令后进行运算，进行输出，一般输出给了屏幕。 在这里举一个例子：用户通过触摸屏，对手机进行操作，比如说点击播放音乐，CPU 接收到指令后，命令 DAC 解码，扬声器接收到音频信号进行播放，屏幕显示歌词。

CPU 就类似于一个管理者，他不去做 ‘苦力’ 活，让更专业的人去做更专业的事。这样就能最大程度上的提高了 整个系统的效率。CPU 虽然叫做 中央处理器，所以它**不仅仅是处理**，而是对一些更基本的处理器进行**控制**：

‘苦力活‘指的是 CPU 并没有驱动大电流的能力，比如安装好‘驱动软件‘之后，CPU 就可以和显示屏上的处理器就行沟通，显示屏上的处理器再来控制显示屏的‘驱动电路’ （Driver），驱动电路驱动显示屏显示图案。在工业上，苦力活用 PLC[\[1\]](#ref_1)来控制。一般的，PLC 会受到更上层 CPU 的控制。

更为专业的工作指的是：比如图形处理会交给 GPU [\[2\]](#ref_2)来做；音频的解码交给‘声卡’ [\[3\]](#ref_3)AD/DA； 更为高级的音频处理，比如说‘降噪耳机’ 就需要一种叫做 DSP[\[4\]](#ref_4)进行处理；在为复杂一些的处理，比如说苹果笔记本上的触摸板会有一个专门识别触摸的芯片，叫 单片机[\[5\]](#ref_5)。新的 MAC PRO 加入了 FPGA [\[6\]](#ref_6)视频剪辑卡，可以做到 3 条 8K 视频同时剪辑。

（1.1 版本补充内容，等有空后会后续补充）

computer architecture 计算机的架构[\[7\]](#ref_7)（ISA）是一个非常宽泛的概念：

* Instruction set architecture 指令集架构（ISA）[\[8\]](#ref_8)（精简指令集，复杂指令集）
* microarchitecture 微架构 [\[9\]](#ref_9)（ 比如 L123 cache）

## 2 CPU 的命名 --- 通俗易懂，商业目的

最简单的例子就是苹果的 A（APPLE） 系列处理器，手机上用的就是 A10，A12；iPad 上用的就是 A12X[\[10\]](#ref_10)；手表上用的就是 S（Syetem in Package SiP）等等[\[11\]](#ref_11)

Intel 的稍微复杂一点，看下图[\[12\]](#ref_12)：

![](https://picx.zhimg.com/50/v2-3858151d68688041932e4c220b323d46_720w.jpg?source=2c26e567)

文中大量引用了 Intel core i9-9900K 的原因不是因为我收了因特尔的钱，而是由于它的相关信息比较全，比较容易拿过来讲解。

* Brand -- 商标
* Brand modifier， 产品型号，比如 i3, i5, i7, i9
* Gen Indicator, 产品代，比如 2019 年是第九代产品，2020 年初就会更新第十代产品。这个代不仅代表了它的制程工艺，也代表了它的架构
* SKU， 这个如果是小白就直接理解为越大越好。比如我可以负责任的告诉你，9980XE[\[13\]](#ref_13)，性能上是要比 9900K 要好很多的
* Suffix，后缀，这里一般都是标明 芯片是否能够超频，电压是标压还是低压

## 3 CPU 的外形，接口，封装[\[14\]](#ref_14)

## 3.1 封装

整个芯片其实非常非常小，我们外界能看到的产品是对他进行封装好之后的效果，封装当然是主要为了保护芯片，但还有一个很重要的作用就是为了更好的和外界进行沟通（交换信息）。随着封装技术的发展，芯片引脚的密度越来越大，芯片集成程度越来越高。我放几张图，让大家看一下科技的进步把：

最经典的封装方法：Dual in-line package，DIP（双列直插封装）[\[15\]](#ref_15)，学过数电的都接触过这种封装的芯片，这种芯片一般都是 少引脚的。

![](https://picx.zhimg.com/50/v2-1b6fe844f3eb0dabb9303e2a40255e5f_720w.jpg?source=2c26e567)

Dual in-line package，这也是早期的芯片封装方式

芯片引脚插入电路，和这种封装配套的技术叫做：“Through-hole technology“[\[16\]](#ref_16)当然这个电路穿孔技术在集成电路里还有另一层意思，比如 3D NAND RAM 里面的穿层技术（这个讲到 Flash 的时候会讲）

DIP 封装是不能满足芯片引脚数目的提高的，此时就有了密度更大的封装方式。PC CPU 里，目前最为复杂的封装方法就是这样的：i9-9900K FCLGA-1151 (LGA) 封装方法[\[17\]](#ref_17)，每一个金黄色的点，都是 CPU 和外界进行联系的方式，每一个引脚的功能和使用方法可以查 data sheet 。

![](https://picx.zhimg.com/50/v2-842a70b0488e21545316cf2cd12f1c34_720w.jpg?source=2c26e567)

Intel core i9-9900K FCLGA-1151 (LGA)

随着系统的设计复杂，之前的封装结构已经不能满足了，于是就有了更为复杂的封装结构：System on a chip，SoC[\[18\]](#ref_18)，Soc 我会在下一小节的 芯片结构里面用 A12X [\[10\]](#ref_10)作为解释。追求更高电路密度的方法就是 Package on package ‘叠电路’[\[19\]](#ref_19)，但是由于散热问题反而效果并不特别好，举例就是 iPhone X 的双层电路板结构[\[20\]](#ref_20)。而目前追求电路复杂程度的极致，叫做 System in package， SiP[\[21\]](#ref_21)，把整块电路版想办法做到一起，比如 Apple watch 4 的 S4 芯片[\[22\]](#ref_22)。

![](https://pic1.zhimg.com/50/v2-c4355ebf32635c0f1b127fd296aa0edc_720w.jpg?source=2c26e567)

S4 来源 ifixit

## 3.2 总线 ----CPU 与外部沟通

想要理解 CPU 是怎么和外界进行沟通的，我们可以查看相对应的 CHIPSET ---Z390[\[23\]](#ref_23)来大概感受一下：

![](https://picx.zhimg.com/50/v2-526ac0b26ba8389e7c925f75053b4fad_720w.jpg?source=2c26e567)

* 看图右上角，CPU 与 DDR4 是直接相连
* 图左上角，一共 16 条 PCIe，可以分给 SSD 也可以分给显卡（一般这里分给显卡，SSD 接在 Chipset 分出来的 24 条 PCIe）
* 左上往下看，3 个 DP 口（有一个很有趣的小知识，请问一共有多少条 PCIe 3.0 的线，以及为什么苹果 15 MBP 能分出来四个雷点三？？）
* DMI 3.0 总线，接 Chipset，之后进行细分，比如直接与 Optane 存储相连，== 不一一解释了。

额外小知识：雷电接口是怎么回事？戳这里[\[24\]](#ref_24)雷点三接口的全速半速是怎么回事？[\[25\]](#ref_25)

* Double Port (DP) uses a PCIe 3.0 ×4 link to provide two Thunderbolt 3 ports (DSL6540, JHL6540, JHL7540)
* Single Port (SP) uses a PCIe 3.0 ×4 link to provide one Thunderbolt 3 port (DSL6340, JHL6340, JHL7340)
* Low Power (LP) uses a PCIe 3.0 ×2 link to provide one Thunderbolt 3 port (JHL6240).

## 4 computer architecture 系统架构 -----（坑太大先不填了）

4.1 架构到底是什么？[\[26\]](#ref_26)复杂指令集（CISC) 和精简指令集（RISC）是什么？[\[27\]](#ref_27)

4.2 ARM（RISC）省电么？[\[28\]](#ref_28)[\[29\]](#ref_29)

4.3 性能差别大么？[\[30\]](#ref_30)

4.4 谁是未来？[\[31\]](#ref_31)（强烈推荐看 RIO 的回答）

## 5 芯片结构

设计芯片时会考虑到芯片的用途，根据用途而设计芯片。比如为了自动驾驶，那么肯定我们需要更多的神经网络处理 NPU，CPU 选取 Cortex-A72[\[32\]](#ref_32)[\[33\]](#ref_33)。下面我举几个例子，来感受一下内部结构的区别。

## 5.1 ：X86，Intel Coffee Lake[\[34\]](#ref_34)[\[35\]](#ref_35)

这个芯片，就是非常单纯的，性能至上的芯片。

![](https://pica.zhimg.com/50/v2-d84d2fadcd8ccf09f0edb1c6eb3de34d_720w.jpg?source=2c26e567)

Intel core i9-9900K

如果拿放大镜去看，就可以看到 CPU 内部长这个样子，当然图中的颜色都是为了方便大家看清楚是干啥的专门上色的哈。从图中可以看到，芯片中间紫色部分是 8 个 CPU 核心（俗称 8 核 i9），8 个核心 share 红色的 L3 cache；左边蓝色的是‘核显’ Intel® UHD Graphics 630，System Agent 是负责和外部进行沟通的。为了更方便的理解每一部分是做什么的，请看下面两张图：

![](https://pic1.zhimg.com/50/v2-ca9c55399a66cf4c05f7c1ab0014b540_720w.jpg?source=2c26e567)

![](https://pica.zhimg.com/50/v2-24b248615a2d5a23e4d6da6eb1a45431_720w.jpg?source=2c26e567)

注：图中是一个 6 核心的展示图

每一个‘core‘内部结构我就不展示了，感兴趣戳这里[\[36\]](#ref_36)。

## 5.2 ARM，A12X bionic[\[37\]](#ref_37)[\[38\]](#ref_38)[\[39\]](#ref_39)

目前手机市场最强核心 apple A12X，架构 ARMv8.3 (ARM)， 制程工艺 7nm，这个芯片就是上文所提到的‘**高度集成**’其他功能的芯片。

![](https://picx.zhimg.com/50/v2-cd2cdfa5df0450f638efa9ec4f15ba3d_720w.jpg?source=2c26e567)

在 3.1 章节封装部分，我说 A12X 是 SoC 封装，在这里我就详细的解释一下：看下图，如果你把这张 A12 X 的图 和 9900K 的图进行对比你会发现：图中右侧，系统一共 8 核 CPU（4 大 Vortex，4 小 tempest）；[神经网络处理器](https://zhida.zhihu.com/search?content_id=165713917\&content_type=Answer\&match_order=1\&q=%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C%E5%A4%84%E7%90%86%E5%99%A8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzAsInEiOiLnpZ7nu4_nvZHnu5zlpITnkIblmagiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNjU3MTM5MTcsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.lNY1P4Uv49YEb5EJEOZdfUIzfUi3xnF2XcBcCIUpDdw\&zhida_source=entity) NPU 在芯片中间；左上角系统 GPU ==，可以看到，系统左侧右下角，集成了很多很多‘CPU’之外的芯片，比如 ISP image signal Processor，景深 Depth Engine 等 ，详情戳引用。[\[39\]](#ref_39)

![](https://pica.zhimg.com/50/v2-3782a8060f77e426561727257bcf8d36_720w.jpg?source=2c26e567)

为了对比方便，我把 9900K 的图拿过来，可以看到，9900K 并没有上图中下面那么多其他的核心。

![](https://picx.zhimg.com/50/v2-912d48ff95aef873c6a53d51c0085d15_720w.jpg?source=2c26e567)

## 5.3 **FSD Chip（[特斯拉自动驾驶](https://zhida.zhihu.com/search?content_id=165713917\&content_type=Answer\&match_order=1\&q=%E7%89%B9%E6%96%AF%E6%8B%89%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzAsInEiOiLnibnmlq_mi4noh6rliqjpqb7pqbYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNjU3MTM5MTcsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.5ogdW186uWVRCfc4OyXdgw2fb2dJENm3Of9VEMfb4h8\&zhida_source=entity)芯片）**[\[40\]](#ref_40)

![](https://pica.zhimg.com/50/v2-efda2af98bdb5a16b0cfde6e8a703121_720w.jpg?source=2c26e567)

这个芯片，自动驾驶芯片，看一下内部结构就知道，2 个大大的 NPU 占据了系统的绝大部分空间，主要就是在算神经网络。

## 6 芯片生产

## 6.1 生产工艺 Lithography

> Lithography refers to the semiconductor technology used to manufacture an integrated circuit, and is reported in nanometer(nm), indicative of the size of features built on the semiconductor.

当系统架构，结构确定好了之后，就可以进行生产了。虽然我在这里写的，让你感觉可能是设计和生产是独立的两个过程，但其实不是，在芯片设计的第一个环节，打开芯片设计软件，建立工程的起始，就要选择生产的工艺。在芯片设计之初，我们要选择一个最小尺寸（举个例子），比如 2\lambda = 22 nm ，那么其他所有器件的尺寸都要是这个数的整数倍（一般是偶数倍），比如们宽度是 2\lambda ，比如导线宽度 4\lambda这样。

而人们常说的 7nm 工艺指的就是这个2\lambda ，对应在具体的电路图上：

![](https://pica.zhimg.com/50/v2-8b6fbe47aa31b80955e3cbb37036c4f8_720w.jpg?source=2c26e567)

如果是 25nm 工艺之前。横截面，L 就是我们所说的制程工艺距离。——Behind the nanoscale process is the true and false: Intel invincible technology failed?

![](https://pic1.zhimg.com/50/v2-005fef438b22856c053219a83cd8367c_720w.jpg?source=2c26e567)

22 nm 后 finFET

**22nm 之前**，门是一个 2 维的门，之后为了更高的效率，需要用 3 维 的门，Intel 对这个称之为‘FinFET’。这里有个视频，Intel 官方讲解 Tri-gate 的具体原理，一看就懂了：[Intel 22nm 3D-Tri-Gate-Transistoren](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3Dv2gDMj42sIM)[\[41\]](#ref_41)，这里还有个文章解释：[先进工艺 22nm FDSOI 和 FinFET 简介](https://zhuanlan.zhihu.com/p/54292579)[\[42\]](#ref_42)

再往后，14nm 以下，还没有一种统一的方案，各个厂商走的方案都不一样（详情可以戳这里），不过可以上两张图[\[43\]](#ref_43)[\[44\]](#ref_44)来感受一下：

![](https://picx.zhimg.com/50/v2-72f62819688136c25d767c0ac0919c43_720w.jpg?source=2c26e567)

![](https://picx.zhimg.com/50/v2-24586b5eecbaf401388c65ba380441bf_720w.jpg?source=2c26e567)

## 6.2 工艺具体参数

我相信所有人听到的对于 CPU 最多的描述就是 xx nm 工艺，比如今年最新的就是三星 / TSMC 的 7nm 工艺制成的的 CPU ，因特尔卡在了 10nm 止步不前，但是没有人告诉你，这是由于不同厂商对这个距离的定义不一样所造成的一个**巨大误会**，不过实在是太专业了，就不具体解释了，简单记住一件事就好** Intel 10nm 等于 TSMC 7nm**）[\[45\]](#ref_45)[\[46\]](#ref_46)

![](https://pic1.zhimg.com/50/v2-de72a346c5326d0bcb845d3b6ac4c2ad_720w.jpg?source=2c26e567)

这张图是 10nm 工艺的三家对比，我们可以看出，Intel 的多项指标都是好于 TSMC 与 Samsung 的

![](https://picx.zhimg.com/50/v2-359b6463cf455ef450d3d5c903bf6c86_720w.jpg?source=2c26e567)

我们看指标，号称 7nm 的 TSMC 和 Samsung 和 10nm 的 Intel 的指标几乎是差不多的。

为了方便大家理解，放上一张渲染图吧[\[47\]](#ref_47)：

![](https://picx.zhimg.com/50/v2-221d4f47d9d9c1e15a5d9d33272260c9_720w.jpg?source=2c26e567)

WikiChip’s Transistor Diagram (simplified)

## 6.3 光刻印刷

现在最先进的光刻机用的光是‘极紫光 EUV’ （波长 小于 紫光（193nm）），其实光刻印刷是一件非常神奇一的事情，在我看来最迷人的是这两件：

* 光印原理与流程，电路是怎么一层层的印刷上去的
* 光刻机怎么用波长这么大的光波刻蚀仅仅 7nm 的沟壑的。

把沙子提纯成高精度的 SI die，然后把它切成非常薄的片 wafer，光刻机就一层层的刻，下面我贴一张一个最简单的 Pmos 为底的 CMOS 刻蚀过程[\[48\]](#ref_48) ：

![](https://picx.zhimg.com/50/v2-fd97bc34b072a905292fdc6e239dca1e_720w.jpg?source=2c26e567)

Simplified process of fabrication of a CMOS inverter on p-type substrate in semiconductor microfabrication.

整张 wafer 刻完后长这个样子：

![](https://picx.zhimg.com/50/v2-6dfbf6f303e2cc2d9c141cfa221bee9e_720w.jpg?source=2c26e567)

Coffee Lake silicon wafer with 8th generation core 6-core processor dies.（注，图上的颜色不是开玩笑加上去的，wafer 刻完之后真的是五彩斑斓的，由于微观结构反光）

之后芯片被切下来，然后封装，就成了我们市面上所见到的芯片了。更详细的过程可以点击这里：[\[49\]](#ref_49)[\[50\]](#ref_50)[\[51\]](#ref_51)

电路印刷，不是拿个刷子刷上去这么简单，每一层电路，每一层电路要刷 N 遍，都需要很多 mask，而每一个 mask 都非常之贵。现在电路电路越来越复杂，电路从最早的 2 面印刷（正反面），到现在的 7 层 10 层，导致设计与制造的难度与成本随之上升了。（在这里的层是内部结构，不是说苹果 iPhone X 所用的双层电路板，这是两个概念）

## 6.4 下脚料与成本

看到这里，你会很自然地想到，从圆形的 silicon wafer 上切正方形（长方形），那么边角肯定是且不出来的。对，没错，你放大看上面的图就会知道，几乎是 wafer 边上一圈全都是废了的。而且这个问题会随着我们需要生产的芯片的面积增大而更严重（里面芯片面积大了，边边废的更多）

所以**不是说生产芯片的厂商不想生产更大的芯片，而是说成本会急剧上升**，现在这么做是不经济实惠的。

![](https://picx.zhimg.com/50/v2-4e80f6650870dd8c2b0db7a3c4d6c37a_720w.jpg?source=2c26e567)

Wafermap showing fully patterned dies, and partially patterned dies which don\&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;#39;t fully lie within the wafer.

为什么不能生产长方形的 wafer？非要生产圆形的？ 硅提纯的整个流程（Czochralski process）[\[52\]](#ref_52)就是会产生圆形的 SI 晶体，把它切成片就是 wafer。

![](https://pic1.zhimg.com/50/v2-c2cc0d0127d50ab834cd4ffd3e67eb7b_720w.jpg?source=2c26e567)

Crystal of Czochralski grown silicon.

OK。。。肯定你想到了，如果 wafer 直径越大，那么其实有效利用的面积相对增大了，现在的 wafer 主流是 300mm，厚度是 775um[\[53\]](#ref_53)。你是不是觉得非常小？为啥不生产更大直径的 wafer？？原因是由于用 Czochralski process 来生产 SI 晶体，直径越大，难度越高，成本已经不是线性增长，而是指数级增长。

![](https://picx.zhimg.com/50/v2-32be055cb66a48f6d7c946236515337a_720w.jpg?source=2c26e567)

Czochralski process

那有没有更好的生产 Si 晶体的方法呢？目前还没有，其他的方法反而成本更高。

芯片产业虽然是最高科技，但是它本质还是‘产业’是以盈利为目的的。芯片制造与设计要考虑的非常重的一部分就是如何减少成本，而上面的晶元的问题只是冰山一角，真正的 cost 的大头根本不是晶元，生产过程中一个 mask 就要 millions $ 来计算，所有外行觉得买个光刻机再加一个设计团队不就能生产芯片了？？

真的并不是，它就算花重金做出来，它没有‘经济利益’，是个赔本赚吆喝的过程。

## 6.5 芯片的‘体质’ Process variation[\[54\]](#ref_54) 以及市场细分

OK，6.4 提到了芯片生产商其实是以经济利益为驱动的，但是芯片生产不是生产‘时尚快消品’，不是说要生产出来不同的型号，不同主频，不同缓存的 CPU 来进行‘市场细分’，以剥削消费者。事实上，芯片都是生产出来之后，根据体质的好坏再进行分类包装的。比如：

* 生产一个 6 核 i7，发现坏了一个核心，这时候就直接屏蔽掉两个核心变成 4 核 i7 卖；
* 目的是生产 16MiB 的 L3 cache，但是坏了 2M，那么就在屏蔽一点，按 12Mib 来卖；
* 设计主频是 2.6GHz 的，由于‘体质‘不好，达不到 2.6 的 就按 2.4 卖，再不好的就按 2.2 来卖。

更详细的请戳这里：[同型号同款 CPU 为什么会有「体质」之分？](https://www.zhihu.com/question/24622588)[\[55\]](#ref_55)

我还想补充一下：“wafer 边缘的芯片更容易体质不好，中心的体质会相对好的比例多一些”，这个是有争议性的。[\[56\]](#ref_56)[\[57\]](#ref_57)不过有一件事就是现代芯片设计过程，考虑到了大量的可能会出现偏差的过程，在设计过程中尽量的避免了。

除了上述市场细分之外，苹果和 Intel 有深度合作的排他协议，能拿到最上乘品质的芯片，其他厂商再分中上乘的品质芯片，最后散装的一般都是最差的。mac 里的 CPU 是没有散装卖的，虽然很多人会说苹果特供芯片就是普通芯片贴牌，其实准确的说是专门质检过的。

## 7 CPU 的历史以及未来发展方向

1946 年，人类历史上第一台由电子管组成的电脑 ENIAC [\[58\]](#ref_58)，但是你们肯定听说过它占地多么大，需要多么大的电能；现代电路的发展其实是从 1947 年 bell 实验室发明的第一个晶体管开始算起[\[59\]](#ref_59)，更准确的说是 1960 年的场效应管 FET[\[60\]](#ref_60)。

> 场效应管就是第六章里提到的最基本单元，但由于半导体物理实在是复杂，我并不想多去阐述具体运作原理，大家简单记得电路里最基本的东西就这个：

![](https://picx.zhimg.com/50/v2-e02e34f9438a85afcf160b30d3be00e6_720w.jpg?source=2c26e567)

所有的 FET 都有栅极（gate）、漏极（drain）、源极（source）三个端；除了結型場效應管外，所有的 FET 也有第四端，被称为体（body）、基（base）、块体（bulk）或衬底（substrate）

有了 FET，有了 Si 芯片，有了光印刷，集成电路突飞猛进发展，摩尔这时候站出来说的摩尔定律就是在这个背景下提出的。

然而到奔腾四[\[61\]](#ref_61)后，CPU 的主频上限已经被卡住了。原因是‘现代’集成电路的能效比其实超级低，**大概 1%**，就是说大部分供电都会转化成热量散失掉了，只有 1% 的能量变成了我们运算用的。当我第一次接触各种‘漏电流’的时候，我都对这个世界充满了绝望，what？整个芯片所有地方都在漏，没有不漏的。。。

由于能效比这么低，造成的结果就是 CPU 非常的热，为了不让他烧坏， **CPU 有非常夸张的散热方式，一个大风扇的风冷，或者液冷（水冷）** 。如果用液冷给他降温，奔腾四就能超频到 5GHz ；但是根本不经济实惠，所以从此集成电路在追求更高的**能效比**。但绝对不是简简单单的追求能效比，还有诸多考虑的问题。

至于未来的问题，强烈推荐阅读 矽说 的这三篇文章，以及相关问题讨论，在此我就不费口舌了：

* [李一雷：摩尔定律何去何从之一：摩尔定律从哪里来？摩尔定律到极限了吗？](https://zhuanlan.zhihu.com/p/21262505)
* [李一雷：摩尔定律何去何从之二：More Moore or More Than Moore?](https://zhuanlan.zhihu.com/p/21262704)
* [李一雷：摩尔定律何去何从之三：Beyond CMOS](https://zhuanlan.zhihu.com/p/21262830)
* [CPU 的摩尔定律是不是因为 10 纳米的限制已经失效了？10 纳米之后怎么办？](https://www.zhihu.com/question/26446061)

***

Ok，上面第一部分就是个综述，下面的内容会更加细节以及深度，正文部分：我觉得大部分领域相关的回答有一个通病就是他们并没有深入的思考芯片里的逻辑和它的物理结构之间的关系，也就是一个非常‘浮于表面’的回答，知其然，不知其所以然。

## 1 为什么 MOSFET 是 逻辑电路的最基本单元，为什么电路最基本的逻辑是‘非’，以及为什么逻辑是 “与非’ ‘或非’而不是 ‘ 与’ ‘或‘，我在[这篇文章](https://zhuanlan.zhihu.com/p/34974464)[\[62\]](#ref_62)中解释了一部分，就搬运过来了。

**metal–oxide–semiconductor field-effect transistor** 是最最最基本的结构，根据掺‘杂’不同，分为 PMOS\&NMOS，一个 PMOS + 一个 NMOS 组成了 CMOS[\[63\]](#ref_63)，而现代处理器的最基本运算单元就是这个 CMOS，看下图。

![](https://pica.zhimg.com/50/v2-30944159909269247ef504e60732e327_720w.jpg?source=2c26e567)

电路最基本逻辑结构 CMOS ---‘非门’，非逻辑

如果横过来看：

![](https://pica.zhimg.com/50/v2-e8bbd2c221dfcd3439d62e587c8e596a_720w.jpg?source=2c26e567)

OK，之前我们是用一个 1 P + 一个 N 组成的一个 CMOS，我们稍加改变，让电路稍微复杂一点点，由两个 P 两个 N ，就会形成 “与非门”，“或非门”，NOR， NAND。下图是逻辑结构，如果你感兴趣，可以看看 N Pmos 的原理，以及为什么它们能形成这两个逻辑。

![](https://picx.zhimg.com/50/v2-28a113cedd20e5c495adbace727b8e8c_720w.jpg?source=2c26e567)

于是，‘**与’逻辑门的结构 就是一个 ‘与非’+ ‘非‘，组合起来得到**；同理，‘或’逻辑，就是‘或非’+‘非‘。同理，其它更复杂的逻辑运算都是通过最基本的 CMOS 组合起来得到的，比如：

![](https://picx.zhimg.com/50/v2-d4b53aff7514d2ca61949f2b6afab59c_720w.jpg?source=2c26e567)

半加器，half ader

![](https://pic1.zhimg.com/50/v2-018835064eec3f781e4b3a49a7ef9af2_720w.jpg?source=2c26e567)

全加器，adder，ALU

![](https://picx.zhimg.com/50/v2-0f7a3299bf472ed817c33ff275e2e738_720w.jpg?source=2c26e567)

多路选择器，MUX，

![](https://pica.zhimg.com/50/v2-b98454553799a0bdbea71d91cd6ad13e_720w.jpg?source=2c26e567)

简单版 CPU

更复杂的结构我就不贴出来了，你感兴趣的话是可以查查相关的资料，但有一件事你要明白，这些复杂的功能，都是由最简单的 CMOS 组成的，而由于结构决定了最基本的逻辑单元是 非。

我说的肯定是不全的，这里有一个推荐阅读：[HTG Explains: How Does a CPU Actually Work?](https://link.zhihu.com/?target=https%3A//www.howtogeek.com/367931/htg-explains-how-does-a-cpu-actually-work/)，加了更多的最基本的单元，BUS，Memory，Clock， Stepper 等介绍。

## 2 把‘电子’ 装进盒子里的各种储存单元：register（俗称寄存器，L0 cache），cache（SRAM），DRAM（俗称内存）， & Flash Drive （俗称‘闪存’）

这一小节里的所有储存单元的基本原理都是，用一个容器来储存电荷，我们规定有足够多的电荷的时候，就为逻辑 1，没有足够多的时候，就为逻辑 0.

## 2.0 Computer Memory Hierarchy[\[64\]](#ref_64)

![](https://picx.zhimg.com/50/v2-e99f7840b6ea44dbec698530f3c621ba_720w.jpg?source=2c26e567)

这张图老了 L3 cache 没有加上，不过不影响主要理解，

上面这张图解释了，和 CPU 关联的相关储存单元，CPU 先从 L0 搜寻有没有存在这里，没有就去 L1 搜，在没有就去 L2 搜，搜到后就送回运算单元。如果你对这部分有更深的兴趣，原图戳这里：[\[36\]](#ref_36)

![](https://picx.zhimg.com/50/v2-bb693df7e18528cd556d44ffb4fef0e9_720w.jpg?source=2c26e567)

intel - Skylake

右边 L2 cache ，出去接 L3 cache（意思是所有外面的信息都会在 L2 停留），Front end 和 Memory [subsystem](https://zhida.zhihu.com/search?content_id=165713917\&content_type=Answer\&match_order=1\&q=subsystem\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzAsInEiOiJzdWJzeXN0ZW0iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNjU3MTM5MTcsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.UA2EiQpFFga-sqsS-1G8JmRBB0dRbKcApqgeMQCsOTA\&zhida_source=entity) 各有一个 32KiB 的 L1 cache，那些 Buffer 就是一些寄存器。 回忆之前第一部分的一张图[\[36\]](#ref_36)，CPU 的结构：

![](https://pic1.zhimg.com/50/v2-3174daa17a414049924989ca2f0557f0_720w.jpg?source=2c26e567)

8 核 share 一个大 L3 cache，所以 L3 cache 的作用就是一个 CPU 内，多核心协同工作。

## 2.1 Dynamic random-access memory，DRAM

寄存器懒得讲了，感兴趣自己看[维基百科](https://zhida.zhihu.com/search?content_id=165713917\&content_type=Answer\&match_order=1\&q=%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzAsInEiOiLnu7Tln7rnmb7np5EiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNjU3MTM5MTcsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.HnSYiqASIKXleVjmIPGpbjvGygg_GJSjwwrSKU5zz7k\&zhida_source=entity)[\[65\]](#ref_65)吧，DRAM 在结构上是所有存储单元里最简单的[\[66\]](#ref_66)：

![](https://picx.zhimg.com/50/v2-5d21aa69cbb375330a32b8e6aedc1a58_720w.jpg?source=2c26e567)

红色地方就是我标注的一个 memory cell，由一个 NMOS 接电容接地组成

看上面红色标记的部分，一个内存的基本单元是 由一个 NMOS 接电容接地组成的；看到这里有电路基础的人肯定能看出来，当门极通电时，NMOS 导通，如果供电，那么就会对电容进行充电；而电容接地了，电容的电不断的在散失。能坚持看到这里的人肯定知道 内存是在不断的‘刷新‘（一般来说，64 ms[\[66\]](#ref_66)），来维持电的稳定的，所以我们称之为 dynamic-RAM。

当电容里有足够多电荷时，就会有电压；电荷慢慢丢失，那么就会变成 0. （一般不会出现让它慢慢丢失的情况，都是不断的刷新给他加新的电进去）

## 2.2 L123 cache， SRAM[\[67\]](#ref_67)

SRAM 保存电压 / 电荷的方式十分巧妙，用四个三极管来控制‘保存’一个电荷。同样是一个 bit， Dram 只需要一个 NMOS + 一个电容，而这个 SRAM 就需要 6 个三极管。高昂的制作成本，换取的是稳定性与速度。而这种 SRAM 只有 CPU 内部才有，外面也不会有，也买不到。

（ok，那为什么这样的结构会更快呢？答案戳这里[\[68\]](#ref_68)）

![](https://pic1.zhimg.com/50/v2-56845a2aacfadcccc328c15431c36a9b_720w.jpg?source=2c26e567)

标准 6 个 transistor 组成的 6T SRAM

> A typical SRAM cell is made up of six[MOSFETs](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/MOSFET). Each[bit](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Bit)in an SRAM is stored on four[transistors](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Transistor)(M1, M2, M3, M4) that form two cross-coupled inverters.

## 2.3 Flash Drive

2.3.1 flash drive 的命名[\[69\]](#ref_69)：

> the name "flash" was suggested by Masuoka's colleague, Shōji Ariizumi, because the erasure process of the memory contents reminded him of the flash of a camera.

2.3.2 Floating gate

Flash 的最基本单元和之前的 MOS 类似，但是多了一个 floating gate，在电路图中多了一个横线（下图中框框中的 mos）来表示。float gate 的目的就是存放电荷（电子）。

![](https://pic1.zhimg.com/50/v2-78567c52fed4a27b4e77deb6f8a4b3cc_720w.jpg?source=2c26e567)

NAND Flash

![](https://picx.zhimg.com/50/v2-de0c2a83d7b352ff7541596500e70cb2_720w.jpg?source=2c26e567)

单纯拿过来一个放大了看，中间门极和衬底中间多了一个 float gate。

Float gate 里存的是电子，有电压就认为是逻辑 1，没有就是逻辑 0 。（SLC 状态下）

float gate 和衬底之间只有非常薄薄的一层隔绝层（隔离层就是下图中灰色的部分）。每次写入和读取都会对隔绝层有损害，日积月累，隔绝层就会坏，这时候内存就坏了。

![](https://pica.zhimg.com/50/v2-4ee59d329db07c990cbca24390c18008_720w.jpg?source=2c26e567)

2.3.3 NAND/NOR Flash 都是 Toshiba 发明的，但是 Nor 死了（其实还是有的，但是并不普及），下图就是原因：

![](https://picx.zhimg.com/50/v2-b099a8afc5329103a9e1d189752be9ad_720w.jpg?source=2c26e567)

NAND 容量密度更大

2.3.4 2D 到 3D NAND[\[70\]](#ref_70)[\[71\]](#ref_71)（三星称之为 vertical， VNAND）

简单解释一下吧，之前的储存模式是一层，之后就跟叠积木，建摩天大楼一样盖高层。[\[72\]](#ref_72)

![](https://picx.zhimg.com/50/v2-16131d755b12b9d7efaa38863e026ada_720w.jpg?source=2c26e567)

建议观看 Intel 官方介绍视频：[英特尔 ® 3D NAND 技术如何推动存储发展 - 英特尔 ® 官网](https://link.zhihu.com/?target=https%3A//www.intel.cn/content/www/cn/zh/architecture-and-technology/3d-nand-technology.html)[\[70\]](#ref_70)

叠出来效果是这样子的：

![](https://picx.zhimg.com/50/v2-975bb1358d7fd9d7fc0d52adce11eb26_720w.jpg?source=2c26e567)

Toshiba takes 3D-NAND to 96-layers, 4 bits per cell

目前来说叠到了 intel 660P，64 层 3D QLC[\[73\]](#ref_73)，三星 970 EVO PLUS，96 层 V-MLC[\[74\]](#ref_74)[\[75\]](#ref_75)

2.3.5, SLC --- MLC---TLC----QLC

![](https://picx.zhimg.com/50/v2-35e3258c6d1a3055c53ec2b230fb5944_720w.jpg?source=2c26e567)

Micron QLC

以前，一个 memory cell 里有电压我们就认为是逻辑 1，没电压就认为是逻辑 0；科学家们发现这样虽然稳定，但是不经济实惠。于是我们把同一个 memory cell 根据电压水平的不同来确定不同的逻辑水平，MLC 就能有 2bit ，TLC 3bit，QLC 4bit 这样。

在此我就不扯到底好不好了，感兴趣戳这里看知乎讨论[\[76\]](#ref_76)[\[77\]](#ref_77)，反正事实上把：没人跟钱过不去。大部分人（我说的绝大部分人就是这篇文章都看不进去的那些，根本不可能在 5 年之内把 QLC 写死，谢谢，就算死了，Intel 5 年质保。同样的，这篇文章都看不懂的人，一年能几次把 flash 的 cache 给写完，从而把速度掉下去？）来说，又快又便宜就是好事啊。

推荐看这篇测评：[https://www.youtube.com/watch?v=OffzVc7ZB-o](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3DOffzVc7ZB-o)

2.3.6 ' 电子危机‘

如果给爱因斯坦说，我们打算做一个容器，装电子，大概就装几十个吧，爱因斯坦会直接怀疑人生的。。。

你是学物理的，知道电子有小，想把电子装进一个容易有多么不容易。而目前夸张到，每 100mv 只是由 15 个电子 来区分。（真的太不稳定了，不过还好，我们依旧可以通过 DRAM 的刷新方法来给 Flash 供电，省的存错了）

![](https://picx.zhimg.com/50/v2-c93832f932915ba6926dc28641b41b4f_720w.jpg?source=2c26e567)

https\://twitter.com/alt\_kia/status/1046448638199644160

2.3.7 SATA [\[78\]](#ref_78)OR PCIe[\[79\]](#ref_79) NVMe [\[80\]](#ref_80)，以及 M.2[\[81\]](#ref_81)(可简单理解为尺寸）

最新几年的 CPU 及其 chipset，比如 Z370，虽然还提供 SATA，但几乎可以忽略，PCIe 占据了几乎全部总线（除了 DMI）的范式。

2.3.8 推荐阅读：

[纳米技术走到尽头？固态硬盘闪存如何跳出即将终结的摩尔定律](https://link.zhihu.com/?target=http%3A//www.sohu.com/a/311471171_615464)[\[82\]](#ref_82)

## 3 TDP，主频，以及超频

3.1 TDP [\[83\]](#ref_83)[\[84\]](#ref_84)

> Thermal Design Power (TDP) represents the average power, in watts, the processor dissipates when operating at Base Frequency with all cores active under an Intel-defined, high-complexity workload. Refer to Datasheet for thermal solution requirements.

i9-9900K 的 TDP=95W，但是官网是不提供具体损耗的，想知道细节只有前两个方法：1，查 datasheet（这个需要问 intel 要，而且普通人看不懂）；2，做测试[\[85\]](#ref_85)，发现极限瞬时功率已经到 204W ；3，功率计算器，比如 MSI 提供的[\[86\]](#ref_86)（TDP）。

而其实现在的芯片都在追求能耗比，即 更小的功率有更好的效率。

3.2 瞬时超频的 Turbo boost [\[87\]](#ref_87)

对于普通用户（非游戏玩家，非专业用户）来说，workload 并不是稳定的，大部分 workload 都是非常平稳（低的），在打开软件的瞬间才大。所以瞬时超频就能非常‘聪明’的解决这个问题。

3.3 低压处理器

**比如**超级本上，我们就限定  **功率 TDP = 15W 的基础上，CPU 运行速度越快越好！**&#x20;

芯片里的功耗，最大的功耗就是‘**漏**’掉了，如果你深入研究会发现，几乎所有地方都在漏，没有不漏的，生产工艺 / 设计工艺里，有很大一部分都在研究如何减少‘漏电‘的情况。不过先抛开怎么减少的漏电，我们先直观的感受一下 CPU 的功耗是什么[\[88\]](#ref_88)：

P\_{dym} = CV^{2}f ，*C *is capacitance, *f *is frequency, and *V *is voltage。

这个公式特别好理解， **CPU 的功耗和 电路运行的速度成正比，和电路运行的电压的平方成正比。** 所以想要减少 CPU 的功率，就要想办法降低这三个值。

非常的巧：如果我们把 门做小， 电容 C 会随之变小（电路设计里，怎么制作大 C 是个非常大的问题）； f 我们想保持不变，减少电压 V 就是最好的办法。 **这就是你所见到的那些‘超级本’ 用的 “低压处理器 “的原因。**&#x20;

如果你还感兴趣，可以继续看这个问题：[为什么计算机芯片大都采用低电压大电流的供电方案？](https://www.zhihu.com/question/303037255/answer/558630384)[\[89\]](#ref_89)

3.4 为什么低电压就很难高功率，为什么超频需要高电压？

有人告诉你说，**调高电压，就能超频**，但是没有告诉你为什么；在 1.2 章节里提到了，我们希望功率低，但频率高，那么唯一可行的办法就是降低 C 以及 降低 V。

你可能会想，V 为什么不能降低？**加载到门极上的电压低而运行在高频率（不断的开关）的的时候，CPU 会出错**。如果想要‘感性的认识’而不是直接拿过来公式给你展示出来的话就是：‘我们把电压类比成关门的时候用的力气，高电压就好像是用力关门，关门会关的很紧，而低电压的时候（门级电压不够高），关门关不紧，这个时候就会让**电子泄露**，导致** 0/1 混乱**。 **（当然实际上，门级电压是怎么影响运行速度的不是这么计算的，在这里是为了让人更好理解。）**&#x20;

同样的，我们高电压的时候，CPU 就更不容易出错，就可以在更高的速率上运行。这也就是俗称的‘体质’，我借用一下别人的图[\[55\]](#ref_55)来让你更好的理解一下：

![](https://pic1.zhimg.com/50/v2-d7ea58dc5baf6bb3b4f85db1b07cfb09_720w.jpg?source=2c26e567)

横坐标是 CPU 运行的频率，纵坐标是 CPU 运行电压，绿色表示 CPU 正常工作，红色表示 CPU 出现错误。从图上可以看清楚，为了保证 CPU 处于正常工作状态下更高的频率，就需要更高的电压。

所有些人说‘调高电压就会超频’ 是把**因果弄反**，不是说我们调高了电压 CPU 就会更高的主频，而是说， **想维持 CPU 正常工作的前提下，更高的主频需要更高的电压。**&#x20;

***

## 后记：

希望能对看到文章的人有所帮助，如有不懂可以留言即可，我会补充细节进行解释的。

欢迎留言，指正错误，或者提供相关资料。答主还有好多想要分享给大家的有空一定会更新内容的（optane，PCIe 4.0；Zen2 ）。

谢谢！！！！

## 参考

1. [^](#ref_1_0)可编程逻辑控制器 [https://zh.wikipedia.org/wiki/ 可编程逻辑控制器](https://zh.wikipedia.org/wiki/可编程逻辑控制器)
2. [^](#ref_2_0)GPU <https://zh.wikipedia.org/wiki/%E5%9C%96%E5%BD%A2%E8%99%95%E7%90%86%E5%99%A8>
3. [^](#ref_3_0)声卡 <https://zh.wikipedia.org/wiki/%E5%A3%B0%E5%8D%A1>
4. [^](#ref_4_0)數位訊號處理器 [https://zh.wikipedia.org/wiki/ 數位訊號處理器](https://zh.wikipedia.org/wiki/數位訊號處理器)
5. [^](#ref_5_0)单片机 [https://zh.wikipedia.org/wiki/ 单片机](https://zh.wikipedia.org/wiki/单片机)
6. [^](#ref_6_0)现场可编程逻辑门阵列 [https://zh.wikipedia.org/wiki/ 现场可编程逻辑门阵列](https://zh.wikipedia.org/wiki/现场可编程逻辑门阵列)
7. [^](#ref_7_0)计算机架构 <https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E7%BB%93%E6%9E%84>
8. [^](#ref_8_0)指令集架构 <https://zh.wikipedia.org/wiki/%E6%8C%87%E4%BB%A4%E9%9B%86%E6%9E%B6%E6%A7%8B>
9. [^](#ref_9_0)微架构 <https://zh.wikipedia.org/wiki/%E5%BE%AE%E6%9E%B6%E6%A7%8B>
10. ^[a](#ref_10_0)[b](#ref_10_1)Apple-designed\_processors <https://en.wikipedia.org/wiki/Apple-designed_processors>
11. [^](#ref_11_0)Apple\_S3 <https://en.wikipedia.org/wiki/Apple_S3>
12. [^](#ref_12_0)INTEL® CORE™ i9-9900K PROCESSOR <https://www.intel.com/content/www/us/en/products/processors/core/i9-processors/i9-9900k.html>
13. [^](#ref_13_0)i9-9980xe <https://www.intel.com/content/www/us/en/products/processors/core/x-series/i9-9980xe.html>
14. [^](#ref_14_0)/Integrated\_circuit\_packaging <https://en.wikipedia.org/wiki/Integrated_circuit_packaging>
15. [^](#ref_15_0)Dual\_in-line\_package <https://en.wikipedia.org/wiki/Dual_in-line_package>
16. [^](#ref_16_0)Through-hole\_technology <https://en.wikipedia.org/wiki/Through-hole_technology>
17. [^](#ref_17_0)lga-1151 <https://en.wikichip.org/wiki/intel/packages/lga-1151>
18. [^](#ref_18_0)System\_on\_a\_chip <https://en.wikipedia.org/wiki/System_on_a_chip>
19. [^](#ref_19_0)Package\_on\_package <https://en.wikipedia.org/wiki/Package_on_package>
20. [^](#ref_20_0)高难度 iPhone X 双层封装主板，现有简单高效的维修方案 <https://zhuanlan.zhihu.com/p/42923962>
21. [^](#ref_21_0)System\_in\_package <https://en.wikipedia.org/wiki/System_in_package>
22. [^](#ref_22_0)pple+Watch+Series+4 [https://zh.ifixit.com/Guide/Apple+Watch+Series+4++ 拆解 / 113044](https://zh.ifixit.com/Guide/Apple+Watch+Series+4++拆解/113044)
23. [^](#ref_23_0)z390 <https://www.intel.cn/content/www/cn/zh/products/chipsets/desktop-chipsets/z390.html>
24. [^](#ref_24_0)thunderbolt-technology-brief <https://www.intel.com/content/dam/doc/technology-brief/thunderbolt-technology-brief.pdf>
25. [^](#ref_25_0)全新 MacbookPro 的 4 个 Thunderbolt3 接口是共享 40Gps 带宽还是 40Gps 独立带宽？ <https://www.zhihu.com/question/52203896>
26. [^](#ref_26_0)分不清 ARM 和 X86 架构，别跟我说你懂 CPU！ <https://zhuanlan.zhihu.com/p/21266987>
27. [^](#ref_27_0)精简指令集和复杂指令集的区别 <https://blog.csdn.net/kai8wei/article/details/51030569>
28. [^](#ref_28_0)请问 X86 与 ARM 的功耗控制有什么区别？ <https://www.zhihu.com/question/267873770>
29. [^](#ref_29_0)X86 CPU 相对 ARM 来说更加费电吗？ <https://zhuanlan.zhihu.com/p/54108883>
30. [^](#ref_30_0)X86 和 ARM 架构的处理器能效差异为什么会这么大？ <https://www.zhihu.com/question/20148756/answer/16648522>
31. [^](#ref_31_0)未来是属于 ARM 为代表的精简指令集还是 x86 为代表的复杂指令集？ <https://www.zhihu.com/question/20783321/answer/16167505>
32. [^](#ref_32_0)fsd\_chip <https://en.wikichip.org/wiki/tesla_(car_company)/fsd_chip>
33. [^](#ref_33_0)cortex-a72 <https://en.wikichip.org/wiki/arm_holdings/microarchitectures/cortex-a72>
34. [^](#ref_34_0)coffee\_lake <https://en.wikichip.org/wiki/intel/microarchitectures/coffee_lake#Die>
35. [^](#ref_35_0)i9-9900k <https://www.intel.com/content/www/us/en/products/processors/core/i9-processors/i9-9900k.html>
36. ^[a](#ref_36_0)[b](#ref_36_1)[c](#ref_36_2)coffee\_lake <https://en.wikichip.org/wiki/intel/microarchitectures/coffee_lake#Die>
37. [^](#ref_37_0)apple-a12-bionic <https://www.engadget.com/2018/09/12/apple-a12-bionic-7-nanometer-chip/>
38. [^](#ref_38_0)Apple\_A12X <https://en.wikipedia.org/wiki/Apple_A12X>
39. ^[a](#ref_39_0)[b](#ref_39_1)A12X Bionic <https://en.wikichip.org/wiki/apple/ax/a12x>
40. [^](#ref_40_0)fsd\_chip <https://en.wikichip.org/wiki/tesla_(car_company)/fsd_chip>
41. [^](#ref_41_0)Intel 22nm 3D-Tri-Gate-Transistoren <https://www.youtube.com/watch?v=v2gDMj42sIM>
42. [^](#ref_42_0)先进工艺 22nm FDSOI 和 FinFET 简介 <https://zhuanlan.zhihu.com/p/54292579>
43. [^](#ref_43_0)WikiChip——Moore‘s Law <https://en.wikichip.org/wiki/WikiChip>
44. [^](#ref_44_0)7nm, 5nm, 3nm: The new materials and transistors that will take us to the limits of Moore’s law <https://www.extremetech.com/computing/162376-7nm-5nm-3nm-the-new-materials-and-transistors-that-will-take-us-to-the-limits-of-moores-law>
45. [^](#ref_45_0)7\_nanometer <https://en.wikipedia.org/wiki/7_nanometer>
46. [^](#ref_46_0)10\_nm\_lithography\_process <https://en.wikichip.org/wiki/10_nm_lithography_process>
47. [^](#ref_47_0)A Look at Intel’s 10nm Std Cell as TechInsights Reports on the i3-8121U, finds Ruthenium <https://fuse.wikichip.org/news/1371/a-look-at-intels-10nm-std-cell-as-techinsights-reports-on-the-i3-8121u-finds-ruthenium/>
48. [^](#ref_48_0)CMOS <https://en.wikipedia.org/wiki/CMOS>
49. [^](#ref_49_0)什么是光刻技术，为什么对芯片制造至关重要？ <https://www.zhihu.com/question/327660899/answer/703996262>
50. [^](#ref_50_0)世界首台分辨力最高紫外超分辨光刻装备宣布研制成功意味着什么？对国内芯片行业有何影响？ <https://www.zhihu.com/question/304075151/answer/542280916>
51. [^](#ref_51_0)芯片产业中的光刻机是怎么雕刻出远远小于自己波长的线宽的？ <https://www.zhihu.com/question/274399745/answer/376283009>
52. [^](#ref_52_0)Czochralski process <https://en.wikipedia.org/wiki/Czochralski_process>
53. [^](#ref_53_0)wafer sizes <https://en.wikipedia.org/wiki/Wafer_(electronics)>
54. [^](#ref_54_0)Process\_variation <https://en.wikipedia.org/wiki/Process_variation_(semiconductor)>
55. ^[a](#ref_55_0)[b](#ref_55_1)同型号同款 CPU 为什么会有「体质」之分？ <https://www.zhihu.com/question/24622588>
56. [^](#ref_56_0)越靠近晶圆圆心，切割出来的 CPU 体质（质量）更好吗？ <https://www.zhihu.com/question/57046428>
57. [^](#ref_57_0)Semiconductor devices face many hazards before and after manufacturing that can cause them to fail prematurely. <https://semiengineering.com/why-chips-die/>
58. [^](#ref_58_0)ENIAC [https://zh.wikipedia.org/wiki/ 電子數值積分計算機](https://zh.wikipedia.org/wiki/電子數值積分計算機)
59. [^](#ref_59_0)晶体管 [https://zh.wikipedia.org/wiki/ 晶体管](https://zh.wikipedia.org/wiki/晶体管)
60. [^](#ref_60_0)场效应管 [https://zh.wikipedia.org/wiki/ 场效应管](https://zh.wikipedia.org/wiki/场效应管)
61. [^](#ref_61_0)List\_of\_CPU\_power\_dissipation\_figures <https://en.wikipedia.org/wiki/List_of_CPU_power_dissipation_figures>
62. [^](#ref_62_0)非门，与非门，或非门 <https://zhuanlan.zhihu.com/p/34974464>
63. [^](#ref_63_0)CMOS <https://en.wikipedia.org/wiki/CMOS>
64. [^](#ref_64_0)Memory\_hierarchy <https://en.wikipedia.org/wiki/Memory_hierarchy>
65. [^](#ref_65_0)Shift register <https://en.wikipedia.org/wiki/Shift_register>
66. ^[a](#ref_66_0)[b](#ref_66_1)Dynamic\_random-access\_memory <https://en.wikipedia.org/wiki/Dynamic_random-access_memory>
67. [^](#ref_67_0)Static\_random-access\_memory <https://en.wikipedia.org/wiki/Static_random-access_memory>
68. [^](#ref_68_0)Reading <https://en.wikipedia.org/wiki/Static_random-access_memory#Reading>
69. [^](#ref_69_0)Flash\_memory <https://en.wikipedia.org/wiki/Flash_memory>
70. ^[a](#ref_70_0)[b](#ref_70_1)3d-nand-technology <https://www.intel.cn/content/www/cn/zh/architecture-and-technology/3d-nand-technology.html>
71. [^](#ref_71_0)你真的懂 3D NAND 闪存？ | 半导体行业观察 <https://zhuanlan.zhihu.com/p/48579501>
72. [^](#ref_72_0)Overview NVMe drive Intel SSD 660p: is it appropriate to QLC-memory SSDS to PCI Express? <https://enuze.com/overview-nvme-drive-intel-ssd-660p-is-it-appropriate-to-qlc-memory-ssds-to-pci-express/>
73. [^](#ref_73_0)660p <https://www.intel.com/content/www/us/en/products/memory-storage/solid-state-drives/consumer-ssds/6-series/ssd-660p-series.html>
74. [^](#ref_74_0)970evoplus <https://www.samsung.com/semiconductor/minisite/ssd/product/consumer/970evoplus/>
75. [^](#ref_75_0) Read more: https\://www\.tweaktown.com/reviews/8875/samsung-970-evo-plus-ssd-review-96-layer-refresh/index.html <https://www.tweaktown.com/reviews/8875/samsung-970-evo-plus-ssd-review-96-layer-refresh/index.html>
76. [^](#ref_76_0)固态硬盘颗粒：SLC/MLC/TLC 有什么区别 <https://www.zhihu.com/question/39495513>
77. [^](#ref_77_0)如何评价三星首款 QLC 闪存 SSD 860 QVO ？ <https://www.zhihu.com/question/303271772>
78. [^](#ref_78_0)SATA <https://zh.wikipedia.org/wiki/SATA>
79. [^](#ref_79_0)PCI\_Express <https://zh.wikipedia.org/wiki/PCI_Express>
80. [^](#ref_80_0)NVM\_Express <https://zh.wikipedia.org/wiki/NVM_Express>
81. [^](#ref_81_0)M.2 <https://zh.wikipedia.org/wiki/M.2>
82. [^](#ref_82_0)纳米技术走到尽头？固态硬盘闪存如何跳出即将终结的摩尔定律  <http://www.sohu.com/a/311471171_615464>
83. [^](#ref_83_0)TDP、TBP、SDP 和 ACP 的区别是什么？ <https://www.zhihu.com/question/67429706/answer/252708550>
84. [^](#ref_84_0)TDP 是 CPU 的功耗吗？TDP 是固定不变的吗？ <https://zhuanlan.zhihu.com/p/51145563>
85. [^](#ref_85_0)Intel Core i9-9900K 9th Gen CPU Review: Fastest Gaming Processor Ever <https://www.tomshardware.com/reviews/intel-core-i9-9900k-9th-gen-cpu,5847-11.html>
86. [^](#ref_86_0)power-supply-calculato <https://us.msi.com/power-supply-calculator/>
87. [^](#ref_87_0)turbo\_boost\_technology <https://en.wikichip.org/wiki/intel/turbo_boost_technology>
88. [^](#ref_88_0)CPU\_power\_dissipation <https://en.wikipedia.org/wiki/CPU_power_dissipation>
89. [^](#ref_89_0)为什么计算机芯片大都采用低电压大电流的供电方案 <https://www.zhihu.com/question/303037255/answer/558630384>
