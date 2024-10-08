---
title: 特征工程到底是什么？
date: 2024-10-04T15:30:53.491Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/29316149/answer/110159647
---
转自我的博文：

[使用 sklearn 做单机特征工程](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/jasonfreak/p/5448385.html)

**目录**

1 特征工程是什么？\
2 数据预处理\
　　2.1 无量纲化\
　　　　2.1.1 标准化\
　　　　2.1.2 区间缩放法\
　　　　2.1.3 标准化与归一化的区别\
　　2.2 对定量特征二值化\
　　2.3 对定性特征哑编码\
　　2.4 缺失值计算\
　　2.5 数据变换\
3 特征选择\
　　3.1 Filter\
　　　　3.1.1 方差选择法\
　　　　3.1.2 相关系数法\
　　　　3.1.3 卡方检验\
　　　　3.1.4 互信息法\
　　3.2 Wrapper\
　　　　3.2.1 递归特征消除法\
　　3.3 Embedded\
　　　　3.3.1 基于惩罚项的特征选择法\
　　　　3.3.2 基于树模型的特征选择法\
4 降维\
　　4.1 主成分分析法（PCA）\
　　4.2 线性判别分析法（LDA）\
5 总结\
6 参考资料

\


&#x20;**1 特征工程是什么？**&#x20;

　　有这么一句话在业界广泛流传：数据和特征决定了机器学习的上限，而模型和算法只是逼近这个上限而已。那特征工程到底是什么呢？顾名思义，其本质是一项工程活动，目的是最大限度地从原始数据中提取特征以供算法和模型使用。通过总结和归纳，人们认为特征工程包括以下方面：

![](https://picx.zhimg.com/50/20e4522e6104ad71fc543cc21f402b36_720w.jpg?source=2c26e567)

\


　　特征处理是特征工程的核心部分，sklearn 提供了较为完整的特征处理方法，包括数据预处理，特征选择，降维等。首次接触到 sklearn，通常会被其丰富且方便的算法模型库吸引，但是这里介绍的[特征处理库](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E7%89%B9%E5%BE%81%E5%A4%84%E7%90%86%E5%BA%93\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLnibnlvoHlpITnkIblupMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.d8oaHH5EQM-TMtWrzQZYXEvU6VRTD_oLu4qDLf-JBVk\&zhida_source=entity)也十分强大！

　　本文中使用 sklearn 中的[IRIS（鸢尾花）数据集](https://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html%23sklearn.datasets.load_iris)来对特征处理功能进行说明。IRIS 数据集由 Fisher 在 1936 年整理，包含 4 个特征（Sepal.Length（[花萼长度](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E8%8A%B1%E8%90%BC%E9%95%BF%E5%BA%A6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLoirHokLzplb_luqYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.V73s9dDrrvf34aZYmjqGGCPR2nn_IgCsQKF_dRbu8vo\&zhida_source=entity)）、Sepal.Width（[花萼宽度](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E8%8A%B1%E8%90%BC%E5%AE%BD%E5%BA%A6\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLoirHokLzlrr3luqYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.pOosO53jdNYZ7mZHPZcadIof4ZFD50U-G4bvGJSvuPA\&zhida_source=entity)）、Petal.Length（花瓣长度）、Petal.Width（花瓣宽度）），特征值都为正浮点数，单位为厘米。目标值为鸢尾花的分类（Iris Setosa（山鸢尾）、Iris Versicolour（[杂色鸢尾](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%9D%82%E8%89%B2%E9%B8%A2%E5%B0%BE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmnYLoibLpuKLlsL4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.494YcdV8WgyOhzOspjVbvR7BEzFVkWTsFdMzv8tBcM0\&zhida_source=entity)），Iris Virginica（维吉尼亚鸢尾））。导入 IRIS 数据集的代码如下：

```python
from sklearn.datasets import load_iris
 
#导入 IRIS 数据集
iris = load_iris()

#特征矩阵
iris.data

#目标向量
iris.target
```

\


**2 数据预处理**

　　通过[特征提取](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E7%89%B9%E5%BE%81%E6%8F%90%E5%8F%96\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLnibnlvoHmj5Dlj5YiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.1q4uQT_iqavQzwn4OhdRcydOCN-zZEuP6rwbIHs53LM\&zhida_source=entity)，我们能得到未经处理的特征，这时的特征可能有以下问题：

* 不属于同一量纲：即特征的规格不一样，不能够放在一起比较。无量纲化可以解决这一问题。
* 信息冗余：对于某些定量特征，其包含的有效信息为区间划分，例如学习成绩，假若只关心 “及格” 或不 “及格”，那么需要将定量的考分，转换成 “1” 和 “0” 表示及格和未及格。二值化可以解决这一问题。
* 定性特征不能直接使用：某些机器学习算法和模型只能接受定量特征的输入，那么需要将定性特征转换为定量特征。最简单的方式是为每一种定性值指定一个定量值，但是这种方式过于灵活，增加了调参的工作。[通常使用哑编码的方式将定性特征转换为定量特征](https://link.zhihu.com/?target=http%3A//www.ats.ucla.edu/stat/mult_pkg/faq/general/dummy.htm)：假设有 N 种定性值，则将这一个特征扩展为 N 种特征，当原始特征值为第 i 种定性值时，第 i 个扩展特征赋值为 1，其他扩展特征赋值为 0。哑编码的方式相比直接指定的方式，不用增加调参的工作，对于线性模型来说，使用哑编码后的特征可达到非线性的效果。
* 存在缺失值：缺失值需要补充。
* 信息利用率低：不同的机器学习算法和模型对数据中信息的利用是不同的，之前提到在线性模型中，使用对定性特征哑编码可以达到非线性的效果。类似地，对定量变量多项式化，或者进行其他的转换，都能达到非线性的效果。

　　我们使用 sklearn 中的 preproccessing 库来进行数据预处理，可以覆盖以上问题的解决方案。

**2.1 无量纲化**

　　无量纲化使不同规格的数据转换到同一规格。常见的无量纲化方法有标准化和区间缩放法。标准化的前提是特征值服从[正态分布](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%AD%A3%E6%80%81%E5%88%86%E5%B8%83\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmraPmgIHliIbluIMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.QkxVpF2eZOmttyx9oENDiLqMlx-pgICKR8BnLgDtRZw\&zhida_source=entity)，标准化后，其转换成[标准正态分布](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%A0%87%E5%87%86%E6%AD%A3%E6%80%81%E5%88%86%E5%B8%83\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmoIflh4bmraPmgIHliIbluIMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Gp2DWcbe32OJJFG2xNM36_qIHp1iIiiXCIVY1wY_uyM\&zhida_source=entity)。区间缩放法利用了边界值信息，将特征的取值区间缩放到某个特点的范围，例如 \[0, 1] 等。

**2.1.1 标准化**

　　标准化需要计算特征的均值和标准差，公式表达为：

　　使用 preproccessing 库的 StandardScaler 类对数据进行标准化的代码如下：

![](https://pic1.zhimg.com/50/c7e852db6bd05b7bb1017b5425ffeec1_720w.jpg?source=2c26e567)

```python
from sklearn.preprocessing import StandardScaler
 
#标准化，返回值为标准化后的数据
StandardScaler().fit_transform(iris.data)
```

**2.1.2 区间缩放法**

　　区间缩放法的思路有多种，常见的一种为利用两个最值进行缩放，公式表达为：

　　使用 preproccessing 库的 MinMaxScaler 类对数据进行区间缩放的代码如下：

![](https://picx.zhimg.com/50/0f119a8e8f69509c5b95ef6a8a01a809_720w.jpg?source=2c26e567)

```text
from sklearn.preprocessing import MinMaxScaler

# 区间缩放，返回值为缩放到 [0, 1] 区间的数据
MinMaxScaler ().fit_transform (iris.data)
```

**2.1.3 标准化与归一化的区别**

　　简单来说，标准化是依照特征矩阵的列处理数据，其通过求 z-score 的方法，将样本的特征值转换到同一量纲下。归一化是依照特征矩阵的行处理数据，其目的在于样本向量在点乘运算或其他[核函数](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%A0%B8%E5%87%BD%E6%95%B0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmoLjlh73mlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.bt5ePYrMnIugkQAMkilf4_t_gmC3CboaFJCHgUhEvUo\&zhida_source=entity)计算相似性时，拥有统一的标准，也就是说都转化为 “单位向量”。规则为 l2 的归一化公式如下：

\


![](https://picx.zhimg.com/50/fbb2fd0a163f2fa211829b735194baac_720w.jpg?source=2c26e567)

\


　　使用 preproccessing 库的 Normalizer 类对数据进行归一化的代码如下：

```python
from sklearn.preprocessing import Normalizer

#归一化，返回值为归一化后的数据
Normalizer().fit_transform(iris.data)
```

**2.2 对定量特征二值化**

　　定量特征二值化的核心在于设定一个阈值，大于阈值的赋值为 1，小于等于阈值的赋值为 0，公式表达如下：

![](https://picx.zhimg.com/50/11111244c5b69c1af6c034496a2591ad_720w.jpg?source=2c26e567)

　　使用 preproccessing 库的[Binarizer 类](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=Binarizer%E7%B1%BB\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiJCaW5hcml6ZXLnsbsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.WVLCvAWc-vxsqcJmAlxlxMdpLc3vlR1dquNsVH10UBw\&zhida_source=entity)对数据进行二值化的代码如下：

```python
from sklearn.preprocessing import Binarizer

#二值化，阈值设置为 3，返回值为二值化后的数据
Binarizer(threshold=3).fit_transform(iris.data)
```

**2.3 对定性特征哑编码**

　　由于 IRIS 数据集的特征皆为定量特征，故使用其目标值进行哑编码（实际上是不需要的）。使用 preproccessing 库的 OneHotEncoder 类对数据进行哑编码的代码如下：

```python
from sklearn.preprocessing import OneHotEncoder

#哑编码，对 IRIS 数据集的目标值，返回值为哑编码后的数据
OneHotEncoder().fit_transform(iris.target.reshape((-1,1)))
```

**2.4 缺失值计算**

　　由于 IRIS 数据集没有缺失值，故对数据集新增一个样本，4 个特征均赋值为 NaN，表示数据缺失。使用 preproccessing 库的 Imputer 类对数据进行缺失值计算的代码如下：

```python
from numpy import vstack, array, nan
from sklearn.preprocessing import Imputer

#缺失值计算，返回值为计算缺失值后的数据
#参数 missing_value 为缺失值的表示形式，默认为 NaN
#参数 strategy 为缺失值填充方式，默认为 mean（均值）
Imputer().fit_transform(vstack((array([nan, nan, nan, nan]), iris.data)))
```

**2.5 数据变换**

　　常见的数据变换有基于多项式的、基于指数函数的、基于对数函数的。4 个特征，度为 2 的多项式转换公式如下：

![](https://pic1.zhimg.com/50/d1c57a66fad39df90b87cea330efb3f3_720w.jpg?source=2c26e567)

　　使用 preproccessing 库的 PolynomialFeatures 类对数据进行多项式转换的代码如下：

```python
from sklearn.preprocessing import PolynomialFeatures

#多项式转换
#参数 degree 为度，默认值为 2
PolynomialFeatures().fit_transform(iris.data)
```

　　基于单变元函数的数据变换可以使用一个统一的方式完成，使用 preproccessing 库的 FunctionTransformer 对数据进行对数函数转换的代码如下：

```python
from numpy import log1p
from sklearn.preprocessing import FunctionTransformer

#自定义转换函数为对数函数的数据变换
#第一个参数是单变元函数
FunctionTransformer(log1p).fit_transform(iris.data)
```

**3 特征选择**

　　当数据预处理完成后，我们需要选择有意义的特征输入机器学习的算法和模型进行训练。通常来说，从两个方面考虑来选择特征：

* 特征是否发散：如果一个特征不发散，例如方差接近于 0，也就是说样本在这个特征上基本上没有差异，这个特征对于样本的区分并没有什么用。
* 特征与目标的相关性：这点比较显见，与目标相关性高的特征，应当优选选择。除方差法外，本文介绍的其他方法均从相关性考虑。

　　根据特征选择的形式又可以将特征选择方法分为 3 种：

* Filter：[过滤法](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E8%BF%87%E6%BB%A4%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLov4fmu6Tms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.F_TIrDJjU6KW9VSL4zw5Tum0GkgsTCs-AU9fJUt1AZI\&zhida_source=entity)，按照发散性或者相关性对各个特征进行评分，设定阈值或者待选择阈值的个数，选择特征。
* Wrapper：包装法，根据目标函数（通常是预测效果评分），每次选择若干特征，或者排除若干特征。
* Embedded：集成法，先使用某些机器学习的算法和模型进行训练，得到各个特征的权值系数，根据系数从大到小选择特征。类似于 Filter 方法，但是是通过训练来确定特征的优劣。

　　我们使用 sklearn 中的 feature\_selection 库来进行特征选择。

**3.1 Filter**

**3.1.1 方差选择法**

　　使用方差选择法，先要计算各个特征的方差，然后根据阈值，选择方差大于阈值的特征。使用 feature\_selection 库的 VarianceThreshold 类来选择特征的代码如下：

```python
from sklearn.feature_selection import VarianceThreshold

#方差选择法，返回值为特征选择后的数据
#参数 threshold 为方差的阈值
VarianceThreshold(threshold=3).fit_transform(iris.data)
```

**3.1.2 相关系数法**

　　使用相关系数法，先要计算各个特征对目标值的相关系数以及相关系数的 P 值。用 feature\_selection 库的 SelectKBest 类结合相关系数来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectKBest
from scipy.stats import pearsonr

#选择 K 个最好的特征，返回选择特征后的数据
#第一个参数为计算评估特征是否好的函数，该函数输入特征矩阵和目标向量，输出二元组（评分，P 值）的数组，数组第 i 项为第 i 个特征的评分和 P 值。在此定义为计算相关系数
#参数 k 为选择的特征个数
SelectKBest(lambda X, Y: array(map(lambda x:pearsonr(x, Y), X.T)).T, k=2).fit_transform(iris.data, iris.target)
```

**3.1.3 卡方检验**

　　经典的卡方检验是检验定性自变量对定性因变量的相关性。假设自变量有 N 种取值，因变量有 M 种取值，考虑自变量等于 i 且因变量等于 j 的样本频数的观察值与期望的差距，构建统计量：

![](https://pic1.zhimg.com/50/7bc586c806b9b8bf1e74433a2e1976bc_720w.jpg?source=2c26e567)

　　不难发现，[这个统计量的含义简而言之就是自变量对因变量的相关性](https://link.zhihu.com/?target=http%3A//wiki.mbalib.com/wiki/%25E5%258D%25A1%25E6%2596%25B9%25E6%25A3%2580%25E9%25AA%258C)。用 feature\_selection 库的 SelectKBest 类结合卡方检验来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2

#选择 K 个最好的特征，返回选择特征后的数据
SelectKBest(chi2, k=2).fit_transform(iris.data, iris.target)
```

**3.1.4 [互信息法](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=2\&q=%E4%BA%92%E4%BF%A1%E6%81%AF%E6%B3%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLkupLkv6Hmga_ms5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.s0ZgWRJ7LWtNsN6r11etvKSBupCvtF6KtMYAPqPYtGM\&zhida_source=entity)**

　　经典的互信息也是评价定性自变量对定性因变量的相关性的，互信息计算公式如下：

![](https://pic1.zhimg.com/50/6af9a077b49f587a5d149f5dc51073ba_720w.jpg?source=2c26e567)

　　为了处理定量数据，最大信息系数法被提出，使用 feature\_selection 库的 SelectKBest 类结合最大信息系数法来选择特征的代码如下：

```python
 from sklearn.feature_selection import SelectKBest
 from minepy import MINE
 
 #由于 MINE 的设计不是函数式的，定义 mic 方法将其为函数式的，返回一个二元组，二元组的第 2 项设置成固定的 P 值 0.5
 def mic(x, y):
     m = MINE()
     m.compute_score(x, y)
     return (m.mic(), 0.5)

#选择 K 个最好的特征，返回特征选择后的数据
SelectKBest(lambda X, Y: array(map(lambda x:mic(x, Y), X.T)).T, k=2).fit_transform(iris.data, iris.target)
```

**3.2 Wrapper**

**3.2.1 递归特征消除法**

　　递归消除特征法使用一个基模型来进行多轮训练，每轮训练后，消除若干权值系数的特征，再基于新的特征集进行下一轮训练。使用 feature\_selection 库的 RFE 类来选择特征的代码如下：

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression

#递归特征消除法，返回特征选择后的数据
#参数 estimator 为基模型
#参数 n_features_to_select 为选择的特征个数
RFE(estimator=LogisticRegression(), n_features_to_select=2).fit_transform(iris.data, iris.target)
```

**3.3 Embedded**

**3.3.1 基于惩罚项的特征选择法**

　　使用带惩罚项的基模型，除了筛选出特征外，同时也进行了降维。使用 feature\_selection 库的 SelectFromModel 类结合带 L1 惩罚项的逻辑回归模型，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import LogisticRegression

#带 L1 惩罚项的逻辑回归作为基模型的特征选择
SelectFromModel(LogisticRegression(penalty="l1", C=0.1)).fit_transform(iris.data, iris.target)
```

　　实际上，[L1 惩罚项降维的原理在于保留多个对目标值具有同等相关性的特征中的一个](http://www.zhihu.com/question/28641663/answer/41653367)，所以没选到的特征不代表不重要。故，可结合 L2 惩罚项来优化。具体操作为：若一个特征在 L1 中的权值为 1，选择在 L2 中权值差别不大且在 L1 中权值为 0 的特征构成同类集合，将这一集合中的特征平分 L1 中的权值，故需要构建一个新的逻辑回归模型：

```python
from sklearn.linear_model import LogisticRegression

class LR(LogisticRegression):
    def __init__(self, threshold=0.01, dual=False, tol=1e-4, C=1.0,
                 fit_intercept=True, intercept_scaling=1, class_weight=None,
                 random_state=None, solver='liblinear', max_iter=100,
                 multi_class='ovr', verbose=0, warm_start=False, n_jobs=1):

        #权值相近的阈值
        self.threshold = threshold
        LogisticRegression.__init__(self, penalty='l1', dual=dual, tol=tol, C=C,
                 fit_intercept=fit_intercept, intercept_scaling=intercept_scaling, class_weight=class_weight,
                 random_state=random_state, solver=solver, max_iter=max_iter,
                 multi_class=multi_class, verbose=verbose, warm_start=warm_start, n_jobs=n_jobs)
        #使用同样的参数创建 L2 逻辑回归
        self.l2 = LogisticRegression(penalty='l2', dual=dual, tol=tol, C=C, fit_intercept=fit_intercept, intercept_scaling=intercept_scaling, class_weight = class_weight, random_state=random_state, solver=solver, max_iter=max_iter, multi_class=multi_class, verbose=verbose, warm_start=warm_start, n_jobs=n_jobs)

    def fit(self, X, y, sample_weight=None):
        #训练 L1 逻辑回归
        super(LR, self).fit(X, y, sample_weight=sample_weight)
        self.coef_old_ = self.coef_.copy()
        #训练 L2 逻辑回归
        self.l2.fit(X, y, sample_weight=sample_weight)

        cntOfRow, cntOfCol = self.coef_.shape
        #权值系数矩阵的行数对应目标值的种类数目
        for i in range(cntOfRow):
            for j in range(cntOfCol):
                coef = self.coef_[i][j]
                #L1 逻辑回归的权值系数不为 0
                if coef != 0:
                    idx = [j]
                    #对应在 L2 逻辑回归中的权值系数
                    coef1 = self.l2.coef_[i][j]
                    for k in range(cntOfCol):
                        coef2 = self.l2.coef_[i][k]
                        #在 L2 逻辑回归中，权值系数之差小于设定的阈值，且在 L1 中对应的权值为 0
                        if abs(coef1-coef2) < self.threshold and j != k and self.coef_[i][k] == 0:
                            idx.append(k)
                    #计算这一类特征的权值系数均值
                    mean = coef / len(idx)
                    self.coef_[i][idx] = mean
        return self
```

　　使用 feature\_selection 库的 SelectFromModel 类结合带 L1 以及 L2 惩罚项的[逻辑回归模型](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=3\&q=%E9%80%BB%E8%BE%91%E5%9B%9E%E5%BD%92%E6%A8%A1%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLpgLvovpHlm57lvZLmqKHlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.bQw8Fwff7La8dLax0UTaBltg8Xu0cybJ7_E4IH02aCo\&zhida_source=entity)，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel
 
#带 L1 和 L2 惩罚项的逻辑回归作为基模型的特征选择
#参数 threshold 为权值系数之差的阈值
SelectFromModel(LR(threshold=0.5, C=0.1)).fit_transform(iris.data, iris.target)
```

**3.3.2 基于树模型的特征选择法**

　　树模型中 GBDT 也可用来作为基模型进行特征选择，使用 feature\_selection 库的 SelectFromModel 类结合 GBDT 模型，来选择特征的代码如下：

```python
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import GradientBoostingClassifier

#GBDT 作为基模型的特征选择
SelectFromModel(GradientBoostingClassifier()).fit_transform(iris.data, iris.target)
```

**4 降维**

　　当特征选择完成后，可以直接训练模型了，但是可能由于特征矩阵过大，导致计算量大，训练时间长的问题，因此降低特征矩阵维度也是必不可少的。常见的降维方法除了以上提到的基于 L1 惩罚项的模型以外，另外还有主成分分析法（PCA）和线性判别分析（LDA），线性判别分析本身也是一个分类模型。PCA 和 LDA 有很多的相似点，其本质是要将原始的样本映射到维度更低的[样本空间](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%A0%B7%E6%9C%AC%E7%A9%BA%E9%97%B4\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmoLfmnKznqbrpl7QiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.DY47fUEtLtsadkYV5NEXzEeDOv_ZSOHCaVBBE-IoeFw\&zhida_source=entity)中，但是 PCA 和 LDA 的映射目标不一样：[PCA 是为了让映射后的样本具有最大的发散性；而 LDA 是为了让映射后的样本有最好的分类性能](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/LeftNotEasy/archive/2011/01/08/lda-and-pca-machine-learning.html)。所以说 PCA 是一种无监督的降维方法，而 LDA 是一种有监督的降维方法。

&#x20;**4.1 主成分分析法（PCA）**&#x20;

　　使用 decomposition 库的 PCA 类选择特征的代码如下：

```python
from sklearn.decomposition import PCA

#主成分分析法，返回降维后的数据
#参数 n_components 为主成分数目
PCA(n_components=2).fit_transform(iris.data)
```

&#x20;**4.2 线性判别分析法（LDA）**&#x20;

　　使用 lda 库的 LDA 类选择特征的代码如下：

```python
from sklearn.lda import LDA

#线性判别分析法，返回降维后的数据
#参数 n_components 为降维后的维数
LDA(n_components=2).fit_transform(iris.data, iris.target)
```

**5 总结**

　　再让我们回归一下本文开始的特征工程的[思维导图](https://zhida.zhihu.com/search?content_id=39535993\&content_type=Answer\&match_order=1\&q=%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDQsInEiOiLmgJ3nu7Tlr7zlm74iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozOTUzNTk5MywiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.0nSFxcP1uV7Aqxokw5S_tVjSIkVc3TiXw3qZnCcnexU\&zhida_source=entity)，我们可以使用 sklearn 完成几乎所有特征处理的工作，而且不管是数据预处理，还是特征选择，抑或降维，它们都是通过某个类的方法 fit\_transform 完成的，fit\_transform 要不只带一个参数：特征矩阵，要不带两个参数：特征矩阵加目标向量。这些难道都是巧合吗？还是故意设计成这样？方法 fit\_transform 中有 fit 这一单词，它和训练模型的 fit 方法有关联吗？接下来，我将在[《使用 sklearn 优雅地进行数据挖掘》](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/jasonfreak/p/5448462.html)中阐述其中的奥妙！

**6 参考资料**

1. [FAQ: What is dummy coding?](https://link.zhihu.com/?target=http%3A//www.ats.ucla.edu/stat/mult_pkg/faq/general/dummy.htm)
2. [IRIS（鸢尾花）数据集](https://link.zhihu.com/?target=http%3A//scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html%23sklearn.datasets.load_iris)
3. [卡方检验](https://link.zhihu.com/?target=http%3A//wiki.mbalib.com/wiki/%25E5%258D%25A1%25E6%2596%25B9%25E6%25A3%2580%25E9%25AA%258C)
4. [干货：结合 Scikit-learn 介绍几种常用的特征选择方法](https://link.zhihu.com/?target=http%3A//dataunion.org/14072.html)
5. [机器学习中，有哪些特征选择的工程方法？](http://www.zhihu.com/question/28641663/answer/41653367)
6. [机器学习中的数学 (4)- 线性判别分析（LDA）, 主成分分析 (PCA)](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/LeftNotEasy/archive/2011/01/08/lda-and-pca-machine-learning.html)
