---
title: "哈希冲突的概率"
date: 2022-07-26T19:56:21+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [blog.csdn.net](https://blog.csdn.net/u012926924/article/details/50717407)

一个 Hash 函数由指定类型的项和一个在指定范围内生成的 Hash 值组成。输入的每一项可能是任何事物：字符串，文件，甚至目录。相同的输入总能生成相同的 Hash 值，并且一个好的 Hash 函数总是致力于不同的 Hash 输入得到不同的值。

一个 Hash 函数并不知道在输入集合中的其他项，当一个输入项通过它时，它仅仅进行着一些按位与 / 或操作，因此，总有 2 个不同的输入项，得到相同 Hash 值的可能。
举个众所周知的 Hash 函数 CRC32，如果你给这个 Hash 函数 “plumless” 和“buckeroo” 这 2 个字符串，它会生成相同的 Hash 值，这是已知的 Hash 冲突。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/c67ad661.png)

## 计算 Hash 冲突的概率

虽然已经很多可以选择的 Hash 函数，但创建一个好的 Hash 函数仍然是一个活跃的研究领域。一些 Hash 函数是快的，一些是慢的，一些 Hash 值均匀地分布在值域上，一些不是。如果你对一些。对于我们的目的，让我们假设这个 Hash 函数是非常好的。它的 Hash 值均匀地分布在值域上。

在这种情况下，对于一个输入集合生成的 Hash 值是非常像生成一个随机数集合。我们的问题转化为如下：
**_给 K 个随机值，非负而且小于 N, 他们中至少有个相等的概率是多少？_**
实际上我们求这个问题的对立问题更加简单：他们都不相同的概率是多少？无论这个对立问题的结果是多少，我们用 1 减去对立问题的结果就得到原问题的结果。

对于一个值域为 N 的 Hash 值，假设你已经挑选出一个值。之后，剩下 N-1 个值是不同于第一个值的，因此，对于第二次随机生成不同第一个数的概率为 N/N-1.
简而言之，有 N 个不同的数，你第一次挑选出某个，然后继续从 N 个数中挑选，那只要不是选到和第一次一样的那个数一样就不一样喽，所以概率为 N-1/N。
之后就是第三次挑选，第三次挑选出的第三个数要求不同于前两个数，所以概率就为 N-1/N\*N-2/N.
一般的，随机生成 K 个数，他们都不相同的概率为：
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/abab5c09.png)
计算机中，对于 K 很大的时候计算很麻烦，幸运的是，上面的表达式近似于
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/e64c5cf4.png)
这个会更快得计算，我们如何知道这是一个好的近似。我们看一下分析过程，使用泰勒公式和 [epsilon-delta proof](http://mathworld.wolfram.com/Epsilon-DeltaProof.html)，这个误差趋于 0 当 N 增大的时候。或者，更简单，你可以计算 2 者的值然后比较他们，运行下面的 python 代码，你会感觉到这个近似是多么准确：

```
import math
N = 1000000
probUnique = 1.0
for k in xrange(1, 2000):
    probUnique = probUnique * (N - (k - 1)) / N
    print k, 1 - probUnique, 1 - math.exp(-0.5 * k * (k - 1) / N)
```

好的，这个奇妙的表达式作为我们每个值都不一样的结果，然后我们用 1 减去得到 Hash 冲突的概率
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/e43b9939.png)
这是一个 N=2^32 的图，它说明了使用 32bit 的 Hash 值的冲突概率，当 Hash 数是 77163 时，发生碰撞的可能为 50%, 这是有价值的。而且注意无论 N 区任意值都会得到一个类似 S 曲线的图。
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/675168d3.png)

## 简化表达式

这是非常有趣的，我们的表达式是 1-e^-x 这种形式，下面近似这仅仅在 X 较小的时候误差非常小，1/10 或更小：
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/9ade50a1.png)
换句话说，这个表达式非常好的近似于它自己的指数，实际上 x 越小，越准确，所以小的冲突概率，我们能使用这个简化表达式
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/d473f3ed.png)
这实际上是一个非常方便的表示。因为它避免了一些在原表达式中的精度问题。浮点型数字在非常接近 1 的时候表示不是很好。

此外，如果 N 远大于 K,K 和 K-1 并没有什么大区别。所以我们可以更加化简为：K^2/2N

## 一些冲突概率

在某些应用中，例如将 Hash 值作为 ID, 避免冲突是非常重要的。这是非常好的概率是更小的原因。

假设 Hash 值是 32 位，64 位，160 位，下表包括了小概率的范围。如果你知道 Hash 值的取值数量，非常简单地找到这个最近的行，我们以挂彩排中奖的角度去看这个冲突概率
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_b40bnpldgp6jitkv/69c98a3c.png)
