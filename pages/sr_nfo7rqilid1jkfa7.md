---
title: "统计学中的数值变换"
date: 2023-04-19T09:37:55+08:00
draft: false
categories: [simpleread]
tags: []
---

> 原文地址 [www.biaodianfu.com](https://www.biaodianfu.com/box-cox.html)

我们测得一些数据，要对数据进行分析的时候，会发现数据有一些问题使得我们不能满足我们以前分析方法的一些要求（正态分布、平稳性）为了满足经典线性模型的正态性假设，常常需要使用数值变换，使其转换后的数据接近正态，比如数据是非单峰分布的，或者各种混合分布，我们就需要进行一些转化。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_nfo7rqilid1jkfa7/6f543d15.png)

**为什么需要做数据变换？**

从直观上讲，是为了更便捷的发现数据之间的关系（可以理解为更好的数据可视化）。举个栗子，下图的左图是各国人均 GDP 和城市人口数量的关系，可以发现人均 GDP 是严重左偏的，并且可以预知在回归方程中存在明显的异方差性，但如果对 GDP 进行对数变换后，可以发现较明显的线性关系。为什么呢？因为我们度量相关性时使用的 [Pearson 相关系数检验](https://www.biaodianfu.com/pearson-kendall-spearman.html)的是变量间的线性关系，只有两变量服从不相关的二元正态分布时，Pearson 相关系数才会服从标准的 t - 分布，但如果变量间的关系是非线性的，则两个不独立的变量之间的 Pearson 相关系数也可以为 0.

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_nfo7rqilid1jkfa7/fdcb2c7e.png)

所以，数据变换后可以更便捷的进行统计推断 (t 检验、ANOVA 或者线性回归分析)。例如通常构造估计量的置信区间时是使用样本均值加减两倍标准差的方式，而这就要求样本均值的分布是渐近正态分布，如果数据呈现出明显的偏度，则此时使用上述统计推断方式就是不适用的；另外，最经典的例子就是回归分析中的异方差性，误差项的方差随着自变量的变化而变化，如果直接进行回归估计残差的方差会随着自变量的变化而变化，如果对变量进行适当变换，此时残差服从同一个正态分布。

在统计学中，常用的数值变换方式包括以下几种：

*   对数变换：对数变换可以将数据从指数分布或长尾分布转换为近似正态分布，同时还可以处理数据中的异常值。
*   平方根变换：平方根变换可以将偏态分布的数据转换为近似正态分布，同时还可以降低异常值的影响。
*   Box-Cox 变换：Box-Cox 变换是一种幂函数变换，可以将非正态分布的数据转换为正态分布，从而提高统计分析的准确性。
*   归一化变换：归一化变换可以将数据按照一定比例缩放到特定的范围内，通常是 \[0,1] 或\[-1,1]之间。
*   标准化变换：标准化变换可以将数据按照均值为 0、标准差为 1 的标准正态分布进行转换，使得数据具有可比性和可解释性。
*   非线性变换：非线性变换可以通过对数据进行复杂的函数变换，将数据转换为更为合适的分布形式，如指数分布、正态分布等。

需要注意的是，不同的数据变换方法适用于不同的数据分布情况。在实际应用中，需要结合具体的数据特征和分析目的，选择合适的数据变换方式。同时，需要注意数据变换可能会导致原始数据的信息丢失或变形，因此需要谨慎选择和使用。

目录

*   [对数变换](#%E5%AF%B9%E6%95%B0%E5%8F%98%E6%8D%A2)
*   [平方根变换](#%E5%B9%B3%E6%96%B9%E6%A0%B9%E5%8F%98%E6%8D%A2)
*   [Box-Cox 变换](#BoxCox%E5%8F%98%E6%8D%A2)
*   [归一化与标准化变换](#%E5%BD%92%E4%B8%80%E5%8C%96%E4%B8%8E%E6%A0%87%E5%87%86%E5%8C%96%E5%8F%98%E6%8D%A2)
*   [非线性变换](#%E9%9D%9E%E7%BA%BF%E6%80%A7%E5%8F%98%E6%8D%A2)
*   [相关文章:](#%E7%9B%B8%E5%85%B3%E6%96%87%E7%AB%A0)

## 对数变换

对数变换是统计学中常用的一种数据变换方法，可以将数据从指数分布或长尾分布转换为近似正态分布，同时还可以处理数据中的异常值。

对数变换的基本思想是将数据取对数，由于对数函数是单调递增的，所以对数变换不会改变数据的顺序关系。在对数变换之后，数据的分布形态会变得更加对称，尤其是对于右偏或长尾分布的数据，对数变换可以将数据的分布形态向左移动，使得数据更加集中在均值附近。

对数变换的公式为：y’ = log(y)

其中，y 为原始数据，y’为变换后的数据。需要注意的是，由于对数函数的定义域为正实数，因此对数变换只适用于正数数据，对于含有零或负值的数据需要进行其他处理，例如加上一个常数或者使用其他数据转换方法。

对数变换有以下几个优点：

*   可以将指数分布或长尾分布转换为近似正态分布，提高统计分析的准确性。
*   对于含有异常值的数据，对数变换可以使得异常值的影响减小，从而提高数据的鲁棒性。
*   对数变换具有可逆性，变换后的数据可以通过指数运算还原到原始数据。

需要注意的是，对数变换可能会导致一些信息的损失或变形，例如在变换后，数据的单位会发生变化，因此需要在实际应用中进行谨慎使用。此外，对数变换还可能导致某些数据出现负数或者零值，因此需要进行适当的处理。

对数变换 (log transformation) 是特殊的一种数据变换方式，它可以将一类我们理论上未解决的模型问题转化为已经解决的问题。我将说两类比较有代表性的模型。

**理论上：随着自变量的增加，因变量的方差也增大的模型。**

先给个很经典的例子，如分析美国每月电力生产数。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_nfo7rqilid1jkfa7/fab127b1.png)

左边是正常数据，可以看到随着时间推进，电力生产也变得方差越来越大，即越来越不稳定。这种情况下常有的分析假设经常就不会满足（误差服从独立同分布的正态分布，时间序列要求平稳）。这必然导致我们寻求一种方式让数据尽量满足假设，让方差恒定，即让波动相对稳定。而这种目的可以通过对数转换做到。

理论上，我们将这类问题抽象成这种模型，即分布的标准差与其均值线性相关。

即：$\sqrt{Var(Z\_t)}=\mu \_t \times \sigma$，其中 $E(Z\_t)=\mu \_t$

由定义可推：Z\_t=\mu \_t(1+\frac{Z\_t-\mu \_t}{\mu \_t}), 利用 log 函数的性质： $\log(1+x) \approx x$ (当 x 足够小)

那么 $\log(Z\_t)\approx \log(\mu\_t)+\frac{Z\_t-\mu\_t}{\mu\_t}$

那么很容易就知道 $E(\log(Z\_t))\approx \log(\mu\_t)$和 $Var(\log(Z\_t))\approx \sigma ^2$

所以对数变换能够很好地将随着自变量的增加，因变量的方差也增大的模型转化为我们熟知的问题。

**经验上：研究数据的增长率分布存在一定规律的模型。**

再给个例子：实际研究中，某一研究对象自身性质难以研究，但其增长率是服从一定分布。例如说：$Z\_t = (1+X\_t) \times Z\_{t-1}$, 其中 $X\_t$是每年增长率（不很大）。

我们可以考虑对数变换：$\log(Z\_{t-1})=\log(\frac{Z\_t}{Z\_{t-1}})=\log(1+X\_t) \approx X\_t$

这样，我们又可以将研究数据的增长率分布存在一定规律的模型转化为我们熟知的问题。

## 平方根变换

平方根变换是一种常用的数据变换方法，可以将偏态分布的数据转换为近似正态分布，同时还可以降低异常值的影响。

平方根变换的基本思想是将数据取平方根，由于平方根函数是单调递增的，所以平方根变换不会改变数据的顺序关系。在平方根变换之后，数据的分布形态会变得更加对称，尤其是对于右偏或长尾分布的数据，平方根变换可以将数据的分布形态向左移动，使得数据更加集中在均值附近。

平方根变换的公式为：y’ = sqrt(y)

其中，y 为原始数据，y’为变换后的数据。需要注意的是，由于平方根函数的定义域为非负实数，因此平方根变换只适用于非负数

平方根变换常用于：

*   使服从 Poission 分布的计数资料或轻度偏态资料正态化，可用平方根变换使其正态化。
*   当各样本的方差与均数呈正相关时，可使资料达到方差齐性。

## Box-Cox 变换

Box-Cox 变换是 Box 和 Cox 在 1964 年提出的一种广义幂变换方法，是统计建模中常用的一种数据变换，用于连续的响应变量不满足正态分布的情况。Box-Cox 变换之后，可以一定程度上减小不可观测的误差和预测变量的相关性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_nfo7rqilid1jkfa7/411bbbd4.png)

Box-Cox 变换的基本思想是通过对数据进行一定的变换，使得变换后的数据更加符合正态分布的特征。这种变换是一种幂函数变换，其公式如下：

y(lambda) = (y^lambda – 1) / lambda, lambda != 0

其中，y 是原始数据，lambda 是变换参数。通过不同的 lambda 值，可以得到不同的 Box-Cox 变换结果。当 lambda 为 1 时，Box-Cox 变换即为对数变换。当 lambda 为 0 时，Box-Cox 变换变为一个特殊的极限情况，即数据变换为 y^lambda – 1，这时候需要特殊处理。

在实际应用中，通常使用最大似然估计法来估计 Box-Cox 变换的参数 lambda。对于不同的数据集，lambda 的值可以取不同的数值，一般来说，lambda 的取值范围为 - 5 到 5 之间。

需要注意的是，Box-Cox 变换只适用于正数数据，对于含有零或负值的数据需要进行其他处理，例如加上一个常数或者使用其他数据转换方法。同时，在进行 Box-Cox 变换时，需要保证变换后的数据具有实际意义，并且变换后的数据不会丢失原始数据的信息。

box-cox 变换的目标有两个：

*   一是变换后，可以一定程度上减小不可观测的误差和预测变量的相关性。主要操作是对因变量转换，使得变换后的因变量于回归自变量具有线性相依关系，误差也服从正态分布，误差各分量是等方差且相互独立。
*   二是用这个变换来使得因变量获得一些性质，比如在时间序列分析中的平稳性，或者使得因变量分布为正态分布。

Cox 变换的主要特点是引入一个参数 lambda，通过数据本身估计该参数进而确定应采取的数据变换形式，Box-Cox 变换可以明显地改善数据的正态性、对称性和方差相等性，又不丢失信息，后经过一定的推广和改进，扩展了其应用范围。

Box Cox 变换的核心参数是 lambda（λ），其范围从 - 5 到 5。所以我们主要目的在于通过一定的方法，选择除最佳的 lambda 值。

$y(\lambda)= \begin{cases}\frac{y^\lambda-1}{\lambda}, & \text { if } \lambda \neq 0 \ \log y, & \text { if } \lambda=0\end{cases}$

以上 y 值需要非负数才行，若对阵有负数的数据集，则公式如下:

$y(\lambda)= \begin{cases}\frac{(y+\lambda\_2)^{\lambda\_1}-1}{\lambda\_1}, & \text { if } \lambda\_1 \neq 0 \ \log (y+\lambda\_2), & \text { if } \lambda\_1=0 .\end{cases}$

平时我们想让一个非正态的数据变成正态，一次个想到可能就是取 log（即对数转化），可能还有倒数转化，平方根转化等等。而 Box-Cox 变换是多种变换的统称，当取不同 lambda 值时，其对应的就是不同的转化方式：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_nfo7rqilid1jkfa7/9ab61b57.png)

Python 的使用：

**1）非负性**

Python 中，Box-Cox 的 y>0，否则会报错，即：ValueError: Data must be positive. 所以对于 y<0 的情况，可以给 y 加上一个常数 C 进行调整，即得如下所示：

$y^{(\lambda)}= \begin{cases}\frac{(y+c)^\lambda-1}{\lambda}, & \text { if } \lambda \neq 0 \ \log (\mathrm{y}+\mathrm{c}), & \text { if } \lambda=0\end{cases}$

**2）正向 Box-Cox 使用**

首先该变换均在 scipy 模块之下，主要有以下两个地方：

Plain textCopy to clipboardOpen code in new windowEnlighterJS 3 Syntax Highlighterfrom scipy.stats import boxcox # 1from scipy.special import boxcox # 2from scipy.stats import boxcox # 1 from scipy.special import boxcox # 2

    from scipy.stats import boxcox   # 1
    from scipy.special import boxcox   # 2

区别在于，1 中包含了 box-cox 中的 lambda 计算（即不需要给函数 boxcox 输入参数 lmbda，boxcox 返回值中就有 lambda），所以其格式为：

Plain textCopy to clipboardOpen code in new windowEnlighterJS 3 Syntax Highlightery, lambda = boxcox(x, lmbda=None, alpha=None)y, lambda = boxcox(x, lmbda=None, alpha=None)

    y, lambda = boxcox(x, lmbda=None, alpha=None)

lambda 的计算方法一般为最大似然估计方法和 Bayes 方法。

而 2 中不包含 lambda 的计算，所以其函数参数必填的为数据 data 和 lambda。

Plain textCopy to clipboardOpen code in new windowEnlighterJS 3 Syntax Highlightery = boxcox(x1, x2, \*args,  **kwargs)y = boxcox(x1, x2, \*args, ** kwargs)

    y = boxcox(x1, x2, *args, **kwargs)

**3）逆向 Box-Cox 变换**

通常我们在 Box-cox 变换之后，将预处理后的数据投入到模型中进行训练，如果变换处理的是标签，那么还需要对测试集的预测值进行反 Box-Cox 变换，Python 实现如下：

Plain textCopy to clipboardOpen code in new windowEnlighterJS 3 Syntax Highlighterfrom scipy.special import inv\_boxcoxy = inv\_boxcox(x1, lambda)from scipy.special import inv\_boxcox y = inv\_boxcox(x1, lambda)

    from scipy.special import inv_boxcox

    y = inv_boxcox(x1, lambda)

其中 x 为需要进行反 Box-Cox 变换的数据，lamda 为训练集 Box-Cox 时使用的 lambda，一般即为上文中 stats.boxcox() 返回的第二个参数。需要注意：如果在训练集 Box-Cox 变换时使用了 C 常数进行了自变量的非零处理，那么还需要再反变换之后减去这个 C 常数。

## 归一化与标准化变换

参考链接：[数据缩放：标准化和归一化](https://www.biaodianfu.com/feature-scaling-normalization-vs-standardization.html)

## 非线性变换

我们可以总结这个非线性转换的步骤，即先通过 Φ(x) 将 x 空间的点转换成 z 空间的点，而在 z 空间上得到一个线性的假设，再恢复到原来的 x 空间中得到一个二次的假设（这个反运算的过程不一定存在）。

其实这个特征转换是非常重要的，比如在手写数字分类的案例中，我们将原始的像素的特征数据转换到更加具体的、具有物理意义的特征上去，进而进行分类的求解。这个例子其实就是在新的特征空间中做线性分类，而对于原始的像素空间里其实是一个非线性的假设。

## 相关文章:

1.  [主题模型 LDA(Latent Dirichlet Allocation) 初探](https://www.biaodianfu.com/lda-latent-dirichlet-allocation.html)
2.  [排序优化算法 Learning to Ranking](https://www.biaodianfu.com/learning-to-ranking.html)
3.  [条件随机场 CRF 及 CRF++ 安装与使用](https://www.biaodianfu.com/crf.html)
4.  [推荐算法之矩阵分解](https://www.biaodianfu.com/matrix-factorization.html)
5.  [聚类算法评估指标](https://www.biaodianfu.com/cluster-score.html)
