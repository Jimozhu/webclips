---
title: 三支股票 A.B和C，请问该如何算出最优的投资组合配比（最大回报，最小风险）？
date: 2024-10-04T15:15:04.858Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //www.zhihu.com/question/36388336/answer/88192236
---
看题主的组合才 3 只股票就搞得很复杂了。。。

这两天刚用 python 做了下投资组合理论的验证。要是会点编程，别说 A、B、C 三只股票了，就是整个上证 + 深证三千多只股票也没问题的。

原文见：

[【组合管理】—— 投资组合理论（有效前沿）](https://link.zhihu.com/?target=https%3A//www.joinquant.com/post/702)\
\


源码都贴上了，现在这时代不会点编程都吃不饱饭了，感兴趣的可以搬去用不谢。

\------------------------------------------2016.2.26 更新 ----------------------------------------------------

ps：有人问到这个分析是在哪儿做的。我也是对[量化策略](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E9%87%8F%E5%8C%96%E7%AD%96%E7%95%A5\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLph4_ljJbnrZbnlaUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.3BzCq1j02eF8a9jjisd2DSLD4YSSrnvxEai3TIscPpU\&zhida_source=entity)感兴趣，最近用 JoinQuant 的平台在做些研究，顺便分享出来和大家一起交流。

\--------------------------------------------------------------------------------------------------------------

**正态性检验和蒙特卡洛完成投资[组合优化](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E7%BB%84%E5%90%88%E4%BC%98%E5%8C%96\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLnu4TlkIjkvJjljJYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.XmVX7wpKlkA19cXS4nE-OgbH7a9TuA7GCo8EJcb74Tk\&zhida_source=entity)**

by 陈小米。

最近一直在思考怎样有效的配置资产组合。 很多时候根据条件选好股票池之后，通常简单粗暴的等分仓位给每只股票。 其实，这个过程中有很多可以优化的空间。

下面，给大家分享一下如何运用有效前沿进行资产组合优化。

**PART ONE: 正态性检验**

这部分是附赠福利。只对资产组合优化感兴趣的朋友可以直接跳到 PART TWO。

（知乎回答字数限制，这部分暂且删除，感兴趣的到原文链接自己看哦～）

**PART TWO：均值 - 方差投资组合理论**

该理论基于用均值和方差来表述组合的优劣的前提。将选取几只股票，用蒙特卡洛模拟初步探究组合的有效前沿。

通过最大 Sharpe 和[最小方差](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E6%9C%80%E5%B0%8F%E6%96%B9%E5%B7%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLmnIDlsI_mlrnlt64iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Pb8TCBc5Om9r9gCl8DJduDfaDTD3kvxQYMqjztuWZ38\&zhida_source=entity)两种优化来找到最优的资产组合配置权重参数。

最后，刻画出可能的分布，两种最优以及组合的有效前沿。

\


**1. 选取几只感兴趣的股票**

000413 东旭光电，000063 中兴通讯，002007 [华兰生物](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E5%8D%8E%E5%85%B0%E7%94%9F%E7%89%A9\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLljY7lhbDnlJ_niakiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.ro1oeJxbVQ6K6gEhnnPl-bzPDpWlW4z-O-esc5hONIU\&zhida_source=entity)，000001 平安银行，000002 万科 A

并比较一下数据（2015-01-01 至 2015-12-31）

\


In \[102]:

```text
stock_set = ['000413.XSHE','000063.XSHE','002007.XSHE','000001.XSHE','000002.XSHE']
noa = len (stock_set)
df = get_price (stock_set, start_date, end_date, 'daily', ['close'])
data = df ['close']
# 规范化后时序数据
(data/data.ix [0]*100).plot (figsize = (8,5))
```

Out\[102]:

```text
<matplotlib.axes._subplots.AxesSubplot at 0x7fd041958810>
```

![](https://pic1.zhimg.com/50/bd536c477fec170042fa2ed354ca3e4a_720w.jpg?source=2c26e567)

**2. 计算不同证券的均值、[协方差](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E5%8D%8F%E6%96%B9%E5%B7%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLljY_mlrnlt64iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Gg55lXr8t78OsSGWJu5ktNTvkqjbSWmJag7Ea6XDwOw\&zhida_source=entity)**

每年 252 个交易日，用每日收益得到年化收益。

计算投资资产的协方差是构建资产组合过程的核心部分。运用 pandas 内置方法生产协方差矩阵。

In \[103]:

```text
returns = np.log(data / data.shift(1))
returns.mean()*252
```

Out\[103]:

```text
000413.XSHE    0.184516
000063.XSHE    0.176790
002007.XSHE    0.309077
000001.XSHE   -0.102059
000002.XSHE    0.547441
dtype: float64
```

In \[104]:

```text
returns.cov()*252
```

Out\[104]:

![](https://picx.zhimg.com/50/5dc37d06bf40a325da3214ed16fa5b76_720w.jpg?source=2c26e567)

**3. 给不同资产随机分配初始权重**

由于 A 股不允许建立[空头头寸](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E7%A9%BA%E5%A4%B4%E5%A4%B4%E5%AF%B8\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLnqbrlpLTlpLTlr7giLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.FAlSR0KXbg0VTyjT-6sLJL6-wVZOsPFbviwkoaeuBc4\&zhida_source=entity)，所有的权重系数均在 0-1 之间

\


In \[105]:

```text
weights = np.random.random(noa)
weights /= np.sum(weights)
weights
```

Out\[105]:

```text
array([ 0.37505798,  0.21652754,  0.31590981,  0.06087709,  0.03162758])
```

**4. 计算预期组合年化收益、[组合方差](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=1\&q=%E7%BB%84%E5%90%88%E6%96%B9%E5%B7%AE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLnu4TlkIjmlrnlt64iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.30TkrSL9DV5Y69gxnvDbQH_X7RXfRWNZV5GQUnbFhSg\&zhida_source=entity)和组合标准差**

In \[106]:

```text
np.sum(returns.mean()*weights)*252
```

Out\[106]:

```text
0.21622558669017816
```

In \[107]:

```text
np.dot(weights.T, np.dot(returns.cov()*252,weights))
```

Out\[107]:

```text
0.23595133640121463
```

In \[108]:

```text
np.sqrt(np.dot(weights.T, np.dot(returns.cov()* 252,weights)))
```

Out\[108]:

```text
0.4857482232609962
```

**5. 用蒙特卡洛模拟产生大量随机组合**

进行到此，我们最想知道的是给定的一个[股票池](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=2\&q=%E8%82%A1%E7%A5%A8%E6%B1%A0\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLogqHnpajmsaAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.ox0hz-888GMrHaxNbA9E2IVoa2DEjuRsYB1CWiOxtNo\&zhida_source=entity)（证券组合）如何找到风险和收益平衡的位置。

下面通过一次[蒙特卡洛模拟](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=3\&q=%E8%92%99%E7%89%B9%E5%8D%A1%E6%B4%9B%E6%A8%A1%E6%8B%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiLokpnnibnljaHmtJvmqKHmi58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjMsInpkX3Rva2VuIjpudWxsfQ.6JvEqvIBULSlPD2tUBOXh_fmsUwiG5WnKTMwofcbuIc\&zhida_source=entity)，产生大量随机的权重向量，并记录随机组合的预期收益和方差。

\


In \[111]:

```text
port_returns = []
port_variance = []
for p in range (4000):
    weights = np.random.random (noa)
    weights /=np.sum (weights)
    port_returns.append (np.sum (returns.mean ()*252*weights))
    port_variance.append (np.sqrt (np.dot (weights.T, np.dot (returns.cov ()*252, weights))))

port_returns = np.array (port_returns)
port_variance = np.array (port_variance)

# 无风险利率设定为 4%
risk_free = 0.04
plt.figure (figsize = (8,4))
plt.scatter (port_variance, port_returns, c=(port_returns-risk_free)/port_variance, marker = 'o')
plt.grid (True)
plt.xlabel ('excepted volatility')
plt.ylabel ('expected return')
plt.colorbar (label = 'Sharpe ratio')
```

Out\[111]:

```text
<matplotlib.colorbar.Colorbar instance at 0x7fd04155e638>
```

![](https://pic1.zhimg.com/50/6181a6b2538d43c6f497679af852a0c2_720w.jpg?source=2c26e567)

**6. 投资组合优化 1——sharpe 最大**

建立 statistics 函数来记录重要的投资组合统计数据（收益，方差和夏普比）

通过对约束最优问题的求解，得到最优解。其中约束是权重总和为 1。

\


In \[115]:

```text
def statistics (weights):
    weights = np.array (weights)
    port_returns = np.sum (returns.mean ()*weights)*252
    port_variance = np.sqrt (np.dot (weights.T, np.dot (returns.cov ()*252,weights)))
    return np.array ([port_returns, port_variance, port_returns/port_variance])

# 最优化投资组合的推导是一个约束最优化问题
import scipy.optimize as sco

# 最小化夏普指数的负值
def min_sharpe (weights):
    return -statistics (weights)[2]

# 约束是所有参数 (权重) 的总和为 1。这可以用minimize 函数的约定表达如下
cons = ({'type':'eq', 'fun':lambda x: np.sum (x)-1})

# 我们还将参数值 (权重) 限制在 0 和 1 之间。这些值以多个元组组成的一个元组形式提供给最小化函数
bnds = tuple ((0,1) for x in range (noa))

# 优化函数调用中忽略的唯一输入是起始参数列表(对权重的初始猜测)。我们简单的使用平均分布。
opts = sco.minimize (min_sharpe, noa*[1./noa,], method = 'SLSQP', bounds = bnds, constraints = cons)
opts
```

Out\[115]:

```text
  status: 0
 success: True
    njev: 4
    nfev: 28
     fun: -1.1623048291871221
       x: array([ -3.60840218e-16,   2.24626781e-16,   1.63619563e-01,
        -2.27085639e-16,   8.36380437e-01])
 message: 'Optimization terminated successfully.'
     jac: array([  1.81575805e-01,   5.40387481e-01,   8.18073750e-05,
         1.03137662e+00,  -1.60038471e-05,   0.00000000e+00])
     nit: 4
```

得到的最优组合权重向量为：

\


In \[116]:

```text
opts['x'].round(3)
```

Out\[116]:

```text
array([-0.   ,  0.   ,  0.164, -0.   ,  0.836])
```

[sharpe](https://zhida.zhihu.com/search?content_id=30711234\&content_type=Answer\&match_order=4\&q=sharpe\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjc3MDAsInEiOiJzaGFycGUiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozMDcxMTIzNCwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjQsInpkX3Rva2VuIjpudWxsfQ.eSd6aXP7jI9DQFvTmiNtrIfQPBhAMDcknxFTFVSHZfk\&zhida_source=entity)最大的组合 3 个统计数据分别为：

\


In \[117]:

```text
#预期收益率、预期波动率、最优夏普指数
statistics (opts ['x']).round (3)
```

Out\[117]:

```text
array([ 0.508,  0.437,  1.162])
```

**7. 投资组合优化 2—— 方差最小**

接下来，我们通过方差最小来选出最优投资组合。

\


In \[118]:

```text
#但是我们定义一个函数对 方差进行最小化
def min_variance (weights):
    return statistics (weights)[1]

optv = sco.minimize (min_variance, noa*[1./noa,],method = 'SLSQP', bounds = bnds, constraints = cons)
optv
```

Out\[118]:

```text
  status: 0
 success: True
    njev: 7
    nfev: 50
     fun: 0.38542969450547221
       x: array([  1.14787640e-01,   3.28089742e-17,   2.09584008e-01,
         3.53487044e-01,   3.22141307e-01])
 message: 'Optimization terminated successfully.'
     jac: array([ 0.3851725 ,  0.43591119,  0.3861807 ,  0.3849672 ,  0.38553924,  0.        ])
     nit: 7
```

方差最小的最优组合权重向量及组合的统计数据分别为：

\


In \[119]:

```text
optv['x'].round(3)
```

Out\[119]:

```text
array([ 0.115,  0.   ,  0.21 ,  0.353,  0.322])
```

In \[120]:

```text
#得到的预期收益率、波动率和夏普指数
statistics(optv['x']).round(3)
```

Out\[120]:

```text
array([ 0.226,  0.385,  0.587])
```

\


**8. 组合的有效前沿**

有效前沿有既定的目标收益率下方差最小的投资组合构成。

在最优化时采用两个约束，1. 给定目标收益率，2. 投资组合权重和为 1。

\


In \[138]:

```text
def min_variance (weights):
    return statistics (weights)[1]

# 在不同目标收益率水平（target_returns）循环时，最小化的一个约束条件会变化。
target_returns = np.linspace (0.0,0.5,50)
target_variance = []
for tar in target_returns:
    cons = ({'type':'eq','fun':lambda x:statistics (x)[0]-tar},{'type':'eq','fun':lambda x:np.sum (x)-1})
    res = sco.minimize (min_variance, noa*[1./noa,],method = 'SLSQP', bounds = bnds, constraints = cons)
    target_variance.append (res ['fun'])

target_variance = np.array (target_variance)
```

&#x20;**下面是最优化结果的展示。**&#x20;

叉号：构成的曲线是有效前沿（目标收益率下最优的投资组合）

红星：sharpe 最大的投资组合

黄星：方差最小的投资组合

\


In \[139]:

```text
plt.figure (figsize = (8,4))
# 圆圈：蒙特卡洛随机产生的组合分布
plt.scatter (port_variance, port_returns, c = port_returns/port_variance,marker = 'o')
# 叉号：有效前沿
plt.scatter (target_variance,target_returns, c = target_returns/target_variance, marker = 'x')
# 红星：标记最高 sharpe 组合
plt.plot (statistics (opts ['x'])[1], statistics (opts ['x'])[0], 'r*', markersize = 15.0)
#黄星：标记最小方差组合
plt.plot (statistics (optv ['x'])[1], statistics (optv ['x'])[0], 'y*', markersize = 15.0)
plt.grid (True)
plt.xlabel ('expected volatility')
plt.ylabel ('expected return')
plt.colorbar (label = 'Sharpe ratio')
```

Out\[139]:

```text
<matplotlib.colorbar.Colorbar instance at 0x7fd040d72518>
```

![](https://picx.zhimg.com/50/bef29a74fa757f1f8bd03006c13287f7_720w.jpg?source=2c26e567)
