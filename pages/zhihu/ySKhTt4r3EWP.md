---
title: 【研究】量化选股-因子检验和多因子模型的构建
date: 2024-10-04T15:15:04.933Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/20634542
---
> ### **量化选股 - 多因子模型**

总体分为基本面选股、市场行为选股。基本面选股包括：多因子模型，风格轮动模型，行业轮动模型。市场行为选股包括：资金流选股，动量反转模型，一致预期模型，趋势追踪模型和筹码选股。

今天要讲的是**多因子模型**。

多因子选股模型是广泛应用的一种方法。采用一系列的因子作为选股标准，满足则买入，不满足则卖出。不同的市场时期总有一些因子在发挥作用，该模型相对来说比较稳定。

模型的优点是可以**综合很多信息后给出一个选股结果**。选取的因子不同以及如何综合各个因子得到最终判断的方法不同会产生不同的模型。一般来说，综合因子的方法有打分法和回归法两种，打分法较为常见。

\
\


> ### **模型构建实例**

1. 选取 09-15 年做样本期，进行因子检验。

2. benchmark = 000001.XSHG

\
\


> ### **一。备选因子选取**

根据市场经验和经济逻辑选取。选择更多和更有效的因子能增强模型信息捕获能力。 如一些基本面指标（PB、PE、EPS、增长率），技术面指标（动量、换手率、波动），或其他指标（预期收益增长、分析师一致预期变化、宏观经济变量）。

结合 JQ 能提供的数据，具体选取以下三个方面的因子：

（1）估值：账面市值比（B/M)、盈利收益率（EPS）、动态市盈（PEG）

（2）成长性：ROE、ROA、主营毛利率（GP/R)、净利率 (P/R)

（3）资本结构：资产负债（L/A)、固定资产比例（FAP）、流通市值（CMV）

下面就上述 10 个因子的有效性进行验证。

\
\


> ### **二。因子有效性检验**

采用排序的方法检验备选因子的有效性。

对任一个因子，从第一个月月初计算市场每只股票该因子的大小，从小到大对样本股票池排序，平均分为 n 个组合，一直持有到月末。每月初用同样的方法调整股票池。运用一定样本时期的数据来建立模型。

\
\


## **0. 导入所需库**

**In \[1]:**

```text
import pandas as pd
from pandas import Series, DataFrame
import numpy as np
import statsmodels.api as sm
import scipy.stats as scs
import matplotlib.pyplot as plt
```

\


## &#x20;**1. 每月初取所有因子数值（以 2015-01-01 为例）**&#x20;

（1）估值：账面市值比（B/M)、盈利收益率（EPS）、动态市盈（PEG）

（2）成长性：ROE、ROA、主营毛利率（GP/R)、净利率 (P/R)

（3）资本结构：资产负债（L/A)、固定资产比例（FAP）、流通市值（CMV）

\


**In \[2]:**

```text
factors = ['B/M','EPS','PEG','ROE','ROA','GP/R','P/R','L/A','FAP','CMV']

# 月初取出因子数值
def get_factors (fdate,factors):
    stock_set = get_index_stocks ('000001.XSHG',fdate)
    q = query (
        valuation.code,
        balance.total_owner_equities/valuation.market_cap/100000000,
        income.basic_eps,
        valuation.pe_ratio,
        income.net_profit/balance.total_owner_equities,
        income.net_profit/balance.total_assets,
        income.total_profit/income.operating_revenue,
        income.net_profit/income.operating_revenue,
        balance.total_liability/balance.total_assets,
        balance.fixed_assets/balance.total_assets,
        valuation.circulating_market_cap
        ).filter (
        valuation.code.in_(stock_set),
        valuation.circulating_market_cap
    )
    fdf = get_fundamentals (q, date=fdate)
    fdf.index = fdf ['code']
    fdf.columns = ['code'] + factors
    return fdf.iloc [:,-10:]
fdf = get_factors ('2015-01-01',factors)
fdf.head ()
```

**Out\[2]:**

![](https://picx.zhimg.com/6e96345cdf38fe46aacf8c039c073f9d_b.png)

\


### &#x20;**2. 对每个因子按大小排序（以 'B/M' 为例）**&#x20;

**In \[3]:**

```text
score = fdf['B/M'].order()
score.head()
```

**Out\[3]:**

```text
code
600301.XSHG   -0.045989
600444.XSHG   -0.029723
600228.XSHG   -0.026231
600217.XSHG   -0.026090
600876.XSHG   -0.010862
Name: B/M, dtype: float64
```

股票池中股票数目

**In \[4]:**

```text
len(score)
```

**Out\[4]:**

```text
966
```

\


## **3. 按分值将股票池五等分构造组合 port1-5**

**In \[5]:**

```text
startdate = '2015-01-01'
enddate = '2015-02-01'
nextdate = '2015-03-01'
df = {}
CMV = fdf['CMV']
port1 = list(score.index)[: len(score)/5]
port2 = list(score.index)[ len(score)/5: 2*len(score)/5]
port3 = list(score.index)[ 2*len(score)/5: -2*len(score)/5]
port4 = list(score.index)[ -2*len(score)/5: -len(score)/5]
port5 = list(score.index)[ -len(score)/5: ]
```

**Out\[5]:**

```text
15066.599999999999
```

\


## &#x20;**4. 函数 - 计算组合月收益（按流通市值加权）**&#x20;

**In \[6]:**

```python
def caculate_port_monthly_return(port,startdate,enddate,nextdate,CMV):

    close1 = get_price(port, startdate, enddate, 'daily', ['close'])
    close2 = get_price(port, enddate, nextdate, 'daily',['close'])
    weighted_m_return = ((close2['close'].ix[0,:]/close1['close'].ix[0,:]-1)*CMV).sum()/(CMV.ix[port].sum()) 
    return weighted_m_return
caculate_port_monthly_return(port1,'2015-01-01','2015-02-01','2015-03-01',fdf['CMV'])
```

**Out\[6]:**

```text
0.042660461430416276
```

\


### **5. 函数 - 计算 benchmark 月收益**

**In \[7]:**

```text
def caculate_benchmark_monthly_return(startdate,enddate,nextdate):

    close1 = get_price(['000001.XSHG'],startdate,enddate,'daily',['close'])['close']
    close2 = get_price(['000001.XSHG'],enddate, nextdate, 'daily',['close'])['close']
    benchmark_return = (close2.ix[0,:]/close1.ix[0,:]-1).sum()
    return benchmark_return
caculate_benchmark_monthly_return('2015-01-01','2015-02-01','2015-03-01')
```

**Out\[7]:**

```text
-0.06632375461831419
```

\


## **6. 观察 5 个组合在 2015-01-01 日构建起一个月内的收益情况**

**In \[8]:**

```text
benchmark_return = caculate_benchmark_monthly_return(startdate,enddate,nextdate)
df['port1'] =  caculate_port_monthly_return(port1,startdate,enddate,nextdate,CMV)
df['port2'] = caculate_port_monthly_return(port2,startdate,enddate,nextdate,CMV)
df['port3'] = caculate_port_monthly_return(port3,startdate,enddate,nextdate,CMV)
df['port4'] = caculate_port_monthly_return(port4,startdate,enddate,nextdate,CMV)
df['port5'] = caculate_port_monthly_return(port5,startdate,enddate,nextdate,CMV)
print Series(df)
print 'benchmark_return %s'%benchmark_return
```

**Out\[8]:**

```text
port1    0.042660
port2   -0.047200
port3    0.012783
port4   -0.063027
port5   -0.117817
dtype: float64
benchmark_return -0.0663237546183
```

\


### **7. 构建因子组合并计算每月换仓时不同组合的月收益率**

**数据范围**：2009-2015 共 7 年

得到结果 monthly\_return 为 panel 数据，储存所有因子，在 7×12 个月内 5 个组合及 benchmark 的月收益率

\


**In \[9]:**

```text
factors = ['B/M','EPS','PEG','ROE','ROA','GP/R','P/R','L/A','FAP','CMV']
# 因为研究模块取 fundmental 数据默认 date 为研究日期的前一天。所以要自备时间序列。按月取
year = ['2009','2010','2011','2012','2013','2014','2015']
month = ['01','02','03','04','05','06','07','08','09','10','11','12']
result = {}

for i in range (7*12):
    startdate = year [i/12] + '-' + month [i%12] + '-01'
    try:
        enddate = year [(i+1)/12] + '-' + month [(i+1)%12] + '-01'
    except IndexError:
        enddate = '2016-01-01'
    try:
        nextdate = year [(i+2)/12] + '-' + month [(i+2)%12] + '-01'
    except IndexError:
        if enddate == '2016-01-01':
            nextdate = '2016-02-01'
        else:
            nextdate = '2016-01-01'
    print 'time % s'% startdate
    fdf = get_factors (startdate,factors)
    CMV = fdf ['CMV']
    #5 个组合，10 个因子
    df = DataFrame (np.zeros (6*10).reshape (6,10),index = ['port1','port2','port3','port4','port5','benchmark'],columns = factors)
    for fac in factors:
        score = fdf [fac].order ()
        port1 = list (score.index)[: len (score)/5]
        port2 = list (score.index)[ len (score)/5+1: 2*len (score)/5]
        port3 = list (score.index)[ 2*len (score)/5+1: -2*len (score)/5]
        port4 = list (score.index)[ -2*len (score)/5+1: -len (score)/5]
        port5 = list (score.index)[ -len (score)/5+1: ]
        df.ix ['port1',fac] = caculate_port_monthly_return (port1,startdate,enddate,nextdate,CMV)
        df.ix ['port2',fac] = caculate_port_monthly_return (port2,startdate,enddate,nextdate,CMV)
        df.ix ['port3',fac] = caculate_port_monthly_return (port3,startdate,enddate,nextdate,CMV)
        df.ix ['port4',fac] = caculate_port_monthly_return (port4,startdate,enddate,nextdate,CMV)
        df.ix ['port5',fac] = caculate_port_monthly_return (port5,startdate,enddate,nextdate,CMV)
        df.ix ['benchmark',fac] = caculate_benchmark_monthly_return (startdate,enddate,nextdate)
        print 'factor % s'% fac
    result [i+1]=df
monthly_return = pd.Panel (result)
```

\


### &#x20;**8. 取某个因子的 5 个组合收益情况（'L/A' 为例）**&#x20;

**In \[10]:**

```text
monthly_return[:,:,'L/A']
```

**Out \[10]:**

![](https://pica.zhimg.com/dbc4cc0f970868d9ab18b1c16e059fa4_b.png)

\


**In \[11]:**

```text
(monthly_return[:,:,'L/A'].T+1).cumprod().tail()
```

**Out \[11]:**

![](https://pica.zhimg.com/9cc17c2b0a15a43278db6b644e5d0090_b.png)

\


### **9. 因子检验量化指标**

模型建立后，计算 n 个组合的年化复合收益、超额收益、不同市场情况下高收益组合跑赢 benchmark 和低收益组合跑输 benchmark 的概率。

&#x20;**检验有效性的量化标准：**&#x20;

（1）序列 1-n 的组合，年化复合收益应满足一定排序关系，即组合因子大小与收益具有较大相关关系。假定序列 i 的组合年化收益为 Xi, 则 Xi 与 i 的相关性绝对值 Abs (Corr (Xi,i))>MinCorr。此处 MinCorr 为给定的最小相关阀值。

（2）序列 1 和 n 表示的两个极端组合超额收益分别为 AR1、ARn。MinARtop、MinARbottom 表示最小超额收益阀值。

if AR1 > ARn #因子越小，收益越大

则应满足 AR1 > MinARtop >0 and ARn < MinARbottom < 0

if AR1 < ARn #因子越小，收益越大

则应满足 ARn > MinARtop >0 and AR1 < MinARbottom < 0

以上条件保证因子最大和最小的两个组合，一个明显跑赢市场，一个明显跑输市场。

(3) 在任何市场行情下，1 和 n 两个极端组合，都以较高概率跑赢 or 跑输市场。

以上三个条件，可以选出过去一段时间有较好选股能力的因子。

\


**In \[12]:**

```text
total_return = {}
annual_return = {}
excess_return = {}
win_prob = {}
loss_prob = {}
effect_test = {}
MinCorr = 0.3
Minbottom = -0.05
Mintop = 0.05
for fac in factors:
    effect_test [fac] = {}
    monthly = monthly_return [:,:,fac]
    total_return [fac] = (monthly+1).T.cumprod ().iloc [-1,:]-1
    annual_return [fac] = (total_return [fac]+1)**(1./6)-1
    excess_return [fac] = annual_return [fac]- annual_return [fac][-1]
    #判断因子有效性
    #1. 年化收益与组合序列的相关性 大于 阀值
    effect_test [fac][1] = annual_return [fac][0:5].corr (Series ([1,2,3,4,5],index = annual_return [fac][0:5].index))
    #2. 高收益组合跑赢概率
    #因子小，收益小，port1 是输家组合，port5 是赢家组合
    if total_return [fac][0] < total_return [fac][-2]:
        loss_excess = monthly.iloc [0,:]-monthly.iloc [-1,:]
        loss_prob [fac] = loss_excess [loss_excess<0].count ()/float (len (loss_excess))
        win_excess = monthly.iloc [-2,:]-monthly.iloc [-1,:]
        win_prob [fac] = win_excess [win_excess>0].count ()/float (len (win_excess))
        
        effect_test [fac][3] = [win_prob [fac],loss_prob [fac]]
        
        #超额收益
        effect_test [fac][2] = [excess_return [fac][-2]*100,excess_return [fac][0]*100]
            
    #因子小，收益大，port1 是赢家组合，port5 是输家组合
    else:
        loss_excess = monthly.iloc [-2,:]-monthly.iloc [-1,:]
        loss_prob [fac] = loss_excess [loss_excess<0].count ()/float (len (loss_excess))
        win_excess = monthly.iloc [0,:]-monthly.iloc [-1,:]
        win_prob [fac] = win_excess [win_excess>0].count ()/float (len (win_excess))
        
        effect_test [fac][3] = [win_prob [fac],loss_prob [fac]]
        
        #超额收益
        effect_test [fac][2] = [excess_return [fac][0]*100,excess_return [fac][-2]*100]
#effect_test [1] 记录因子相关性，>0.5 或 <-0.5 合格
#effect_test [2] 记录【赢家组合超额收益，输家组合超额收益】
#effect_test [3] 记录赢家组合跑赢概率和输家组合跑输概率。【>0.5,>0.4】合格 (因实际情况，跑输概率暂时不考虑)
DataFrame (effect_test)
```

**Out\[12]:**

![](https://picx.zhimg.com/2ca941ab0cfec9feea51a70291fa8f29_b.png)

![](https://pic1.zhimg.com/26ffefdf53d4b48870a3b815954a7082_b.png)

\


检验结果，同时满足上述三个条件的 **5 个有效因子（粗体）** ：

（1）估值：**账面市值比（B/M)**、盈利收益率（EPS）、 **动态市盈（PEG）**&#x20;

（2）成长性：ROE、ROA、主营毛利率（GP/R)、**净利率 (P/R)**

（3）资本结构：资产负债（L/A)、 **固定资产比例（FAP）** 、 **流通市值（CMV）**&#x20;

其中：CMV，FAP,PEG 三个因子越小收益越大；B/M，P/R 越大收益越大

\


**(1) 有效因子的总收益和年化收益**

小市值妖孽！！按 CMV 因子排序时，CMV 小的组合总收益 14.6 倍，年化 58%！总收益第二名是 FAP 的 port2，达到 2.71 倍。(这也是造成 FAP 组合收益相关性稍低的原因）

**In \[13]:**

```text
effective_factors = ['B/M','PEG','P/R','FAP','CMV']
DataFrame(total_return).ix[:,effective_factors]
```

**Out\[13]:**

![](https://pic1.zhimg.com/0ff7bdd86197b47d64c033309d41e960_b.png)

**In \[14]:**

```text
DataFrame(annual_return).ix[:,effective_factors]
```

**Out\[14]:**

![](https://pic1.zhimg.com/3220cffde626adae56fb24467cce8926_b.png)

\


**（2）有效因子组合和 benchmark 收益率展示****In \[15]:**

```text
def draw_return_picture(df):
    plt.figure(figsize =(10,4))
    plt.plot((df.T+1).cumprod().ix[:,0], label = 'port1')
    plt.plot((df.T+1).cumprod().ix[:,1], label = 'port2')
    plt.plot((df.T+1).cumprod().ix[:,2], label = 'port3')
    plt.plot((df.T+1).cumprod().ix[:,3], label = 'port4')
    plt.plot((df.T+1).cumprod().ix[:,4], label = 'port5')
    plt.plot((df.T+1).cumprod().ix[:,5], label = 'benchmark')
    plt.xlabel('return of factor %s'%fac)
    plt.legend(loc=0)
for fac in effective_factors:
    draw_return_picture(monthly_return[:,:,fac])
```

**Out \[15]:**

![](https://pic1.zhimg.com/9392b743bcf265519678ad30cb5c819c_b.png)

![](https://pic4.zhimg.com/6c5b39be1672b35eba9123a2b59fc86d_b.png)

![](https://pic1.zhimg.com/ab65a538e0f76170bfa416c3ed79d63e_b.png)

![](https://picx.zhimg.com/5f35bd48567895e0a7d1e4a8b3fb9a59_b.png)

![](https://pic3.zhimg.com/0760acb607193e98de17a09c9260f4b2_b.png)

\


> ### **3. 冗余因子的剔除**

&#x20;**（仅给出思路，此处因子较少不做这一步）**&#x20;

有些因子，因为内在的逻辑比较相近等原因，选出来的组合在个股构成和收益等方面相关性较高。所以要对这些因子做冗余剔除，保留同类因子中收益最好、区分度最高的因子。具体步骤：

（1）对不同因子的 n 个组合打分。收益越大分值越大。分值达到好将分值赋给每月该组合内的所有个股。

if AR1 > ARn #因子越小，收益越大

则组合 i 的分值为（n-i+1)

if AR1 < ARn #因子越小，收益越小

则组合 i 的分值为 i

（2）按月计算个股不同因子得分的相关性矩阵。得到第 t 月个股的因子得分相关性矩阵 Score\_Corrt,u,v。u,v 为因子序号。

（3）计算样本期内相关性矩阵的平均值。即样本期共 m 个月，加总矩阵后取 1/m。

（4）设定得分相关性阀值 MinScoreCorr。只保留与其他因子相关性较小的因子。

\
\


> ### **4. 模型建立和选股**

根据选好的有效因子，每月初对市场个股计算因子得分，按一定权重求得所有因子的平均分。如遇因子当月无取值时，按剩下的因子分值求加权平均。通过对个股的加权平均得分进行排序，选择排名靠前的股票交易。

以下代码段等权重对因子分值求和，选出分值最高的股票进行交易。

**（1）模型构建**

**In \[16]:**

```text
def score_stock (fdate):
    #CMV，FAP,PEG 三个因子越小收益越大，分值越大，应降序排；B/M，P/R 越大收益越大应顺序排
    effective_factors = {'B/M':True,'PEG':False,'P/R':True,'FAP':False,'CMV':False}
    fdf = get_factors (fdate)
    score = {}
    for fac,value in effective_factors.items ():
        score [fac] = fdf [fac].rank (ascending = value,method = 'first')
    print DataFrame (score).T.sum ().order (ascending = False).head (5)
    score_stock = list (DataFrame (score).T.sum ().order (ascending = False).index)
    return score_stock,fdf ['CMV']
def get_factors (fdate):
    factors = ['B/M','PEG','P/R','FAP','CMV']
    stock_set = get_index_stocks ('000001.XSHG',fdate)
    q = query (
        valuation.code,
        balance.total_owner_equities/valuation.market_cap/100000000,
        valuation.pe_ratio,
        income.net_profit/income.operating_revenue,
        balance.fixed_assets/balance.total_assets,
        valuation.circulating_market_cap
        ).filter (
        valuation.code.in_(stock_set)
    )
    fdf = get_fundamentals (q,date = fdate)
    fdf.index = fdf ['code']
    fdf.columns = ['code'] + factors
    return fdf.iloc [:,-5:]
[score_result,CMV] = score_stock ('2016-01-01')
```

**Out \[16]:**

```text
code
600382.XSHG    4274
600638.XSHG    4224
600291.XSHG    4092
600791.XSHG    4078
600284.XSHG    4031
dtype: float64
```

\


**In \[17]:**

```text
year = ['2009','2010','2011','2012','2013','2014','2015']

month = ['01','02','03','04','05','06','07','08','09','10','11','12']
factors = ['B/M','PEG','P/R','FAP','CMV']
result = {}

for i in range (7*12):

    startdate = year [i/12] + '-' + month [i%12] + '-01'
    try:
        enddate = year [(i+1)/12] + '-' + month [(i+1)%12] + '-01'
    except IndexError:
        enddate = '2016-01-01'
    try:
        nextdate = year [(i+2)/12] + '-' + month [(i+2)%12] + '-01'
    except IndexError:
        if enddate == '2016-01-01':
            nextdate = '2016-02-01'
        else:
            nextdate = '2016-01-01'
    print 'time % s'% startdate
    #综合 5 个因子打分后，划分几个组合
    df = DataFrame (np.zeros (7),index = ['Top20','port1','port2','port3','port4','port5','benchmark'])
    [score,CMV] = score_stock (startdate)
    port0 = score [:20]
    port1 = score [: len (score)/5]
    port2 = score [ len (score)/5+1: 2*len (score)/5]
    port3 = score [ 2*len (score)/5+1: -2*len (score)/5]
    port4 = score [ -2*len (score)/5+1: -len (score)/5]
    port5 = score [ -len (score)/5+1: ]
    print len (score)
 
   df.ix ['Top20'] = caculate_port_monthly_return (port1,startdate,enddate,nextdate,CMV)
    df.ix ['port1'] = caculate_port_monthly_return (port1,startdate,enddate,nextdate,CMV)
    df.ix ['port2'] = caculate_port_monthly_return (port2,startdate,enddate,nextdate,CMV)
    df.ix ['port3'] = caculate_port_monthly_return (port3,startdate,enddate,nextdate,CMV)
    df.ix ['port4'] = caculate_port_monthly_return (port4,startdate,enddate,nextdate,CMV)
    df.ix ['port5'] = caculate_port_monthly_return (port5,startdate,enddate,nextdate,CMV)
    df.ix ['benchmark'] = caculate_benchmark_monthly_return (startdate,enddate,nextdate)
    result [i+1]=df
backtest_results = pd.DataFrame (result)
```

\


&#x20;**（哈哈，此处结果下一次再公布～）**&#x20;

\
\


> #### **5. 不足和改进**

随着模型使用人数的增加，有的因子会逐渐失效，也可能出现一些新的因素需要加入到因子库中。同时，各因子的权重设计有进一步改进空间。模型本身需要做持续的再评价，并不断改进来适应市场的变化。

\
\


> ## **最后**

验证有效的因子怎么组成策略，下一次再分享～

\
\


**致谢**

本文理论部分参考丁鹏老师《量化投资 —— 策略与选股一书》，在此表示感谢。

本文研究工具为 IPython Notebook 2.7。API 来自聚宽（JoinQuant），在此表示感谢。

\


原文见：[【研究】量化选股 —— 多因子模型](https://link.zhihu.com/?target=https%3A//www.joinquant.com/post/168b1828882a960710b4bf660eef7723)

\
\


资源共享，是人类进步的推动力

&#x20;**『分享文章 + 关注公众号』**&#x20;

回复**『大数据书籍』or **『量化书籍』** **领取

![](https://pic4.zhimg.com/955cd366bcca7f377a3434119e6d6e03_b.jpg)
