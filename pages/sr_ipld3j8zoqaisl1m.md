---
title: "Flex 布局中的数学原理(grow/shrink)"
date: 2022-09-15T09:42:26+08:00
draft: false
categories: [dev]
tags: [dev, css]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7142877905234690062#heading-7)

{{< toc >}}

现在的前端，基本上是 flex 布局的天下了，其用法简单、功能强大，是 CSS 中的一大杀器。flex 布局之所以傲视群雄，离不开其背后用到的数学原理，今天就带领大家深入了解 flex 布局中最核心的两个属性：

- flex-grow
- flex-shrink

## flex-grow

这个属性的作用是：**父元素在主轴方向还有剩余空间时，子元素们如何分配这些剩余空间**。其值为一个权重，默认为 0，剩余空间将会按照各个子元素的权重来分配。假设三个子元素的 flex-grow 分别为 a，b，c，如果容器存在剩余空间 K，就会按照权重比例分配给对应的子元素，即分别增加 `a*K/(a+b+c)`, `b*K/(a+b+c)`, `c*K/(a+b+c)`。

### 常规场景

举个例子：父元素宽度 500px，a、b、c 三个子元素的宽度分别为 100px，150px，100px，于是剩余空间为 150px。如果三个元素的 flex-grow 分别是 1，2，3，那么每个元素的最终宽度分别是多少呢？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/8c376696.webp)

按照上面的公式，由于 1+2+3 = 6，因此各元素的增长率分别是：

- `1 / 6`
- `2 / 6`
- `3 / 6`

三个元素被分到的空间和最终宽度分别是：

- 增长 `150px * 1 / 6 = 25px`，最终宽度 `100px + 25px = 125px`
- 增长 `150px * 2 / 6 = 50px`，最终宽度 `150px + 50px = 200px`
- 增长 `150px * 3 / 6 = 75px`，最终宽度 `100px + 75px = 175px`

记录成表格如下：

<table><thead><tr><th>500px 容器</th><th><strong>初始宽度</strong></th><th><strong>flex-grow 值</strong></th><th><strong>增长率</strong></th><th><strong>增长宽度</strong></th><th><strong>最终宽度</strong></th></tr></thead><tbody><tr><td><strong>a（紫色）</strong></td><td>100px</td><td>1</td><td>1 / 6</td><td>25px</td><td>125px</td></tr><tr><td><strong>b（绿色）</strong></td><td>150px</td><td>2</td><td>2 / 6</td><td>50px</td><td>200px</td></tr><tr><td><strong>c（蓝色）</strong></td><td>100px</td><td>3</td><td>3 / 6</td><td>75px</td><td>175px</td></tr></tbody></table>

实际效果如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/3affac7a.webp)

### 被 max-width 干扰的场景

注意：**flex-grow 会受到 max-width 的影响**。如果某个元素 grow 后的结果大于 max-width 指定的值，那么 max-width 的值将会优先使用，那么剩下的元素如何分配剩余空间呢？我们把中间绿色的元素设置 `max-width: 150px` 让其不超过 150px，请问左边紫色和右边蓝色的元素的宽度分别是多少？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/23697bd7.webp)

你可能会认为，既然总宽 500px，中间绿色元素为 150px，那么左右两个元素按照 flex-grow 的比例瓜分剩余的 350px 即可 ，即紫色元素 `100px + 350px / 4 = 187.5px`，蓝色元素 `100px + 3 * 350px /4 = 362.5px`。

然而并非如此，正确的计算方式是依然先按照 1:2:3 进行分配，计算得到中间的绿色元素为 200px，但是由于 max-width 为 150px，多出了 50px，**那么这 50px 被左右两边的紫色和蓝色元素按照 1:3 的比例瓜分掉**，也就是紫色元素宽度为 `125px + 50px/4 = 137.5px`，蓝色元素宽度为 `175px + 3*50px/4 = 212.5px`，如下图所示：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/d6305d37.webp)

### 值为小数的场景

有一点需要注意：flex-grow 取值可以是小数，例如 0.1，**当所有元素的 flex-grow 之和小于 1 的时候，剩余空间不会全部分配给各个元素**。实际上用来分配的空间是 `sum * 剩余空间`，但比例保持不变。还是上面一个例子，但是三个元素的 flex-grow 分别是 0.1，0.2，0.3，那么计算公式将变成下面这样：

- `150 * 0.1 / 1 = 15px`
- `150 * 0.2 / 1 = 30px`
- `150 * 0.3 / 1 = 45px`

三个元素的最终宽度分别为：

- `100px + 15px = 115px`
- `150px + 30px = 180px`
- `100px + 45px = 145px`

即还有 `150px * 0.4 = 60px` 没有分配给任何子元素，如下图所示：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/08815a90.webp)

如果这个时候，我给中间的元素设置 max-width 为 150px 话，会是什么样的效果呢？多出来的 30px 会被左右的元素瓜分掉吗？如果是，那么分别瓜分多少呢？

其实，这种情况下剩余空间并不会分配给其余的元素，而是累加到留白的区域，即 60px 剩余空间增大到 90px。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/8d0a531f.webp)

### 内容自适应的场景

你可能会问，如果我们事先并没有给 a、b、c 三个子元素设置宽度的话，如何计算剩余空间呢？答案是：**会根据其内容占用的宽度来计算**。例如我们把三个 div 的 width 属性去掉，在里面分别添加 5 个汉字、3 个汉字和 8 个汉字，然后打开控制台通过 computed 面板来查看默认宽度。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/753603e9.webp)

发现一个汉字占据 16px，所以 a、b、c 三个子元素的宽度分别是 80px、48px 和 128px，假设如果我们把容器改为 flex 布局，同样按照 1:2:3 的比例分配剩余空间，那么计算结果如下：

<table><thead><tr><th></th><th>初始宽度</th><th>flex-grow 值</th><th>被分配到的剩余空间</th><th>最终宽度</th></tr></thead><tbody><tr><td>a（紫色）</td><td>80px</td><td>1</td><td>40.66666px</td><td>120.66666px</td></tr><tr><td>b（绿色）</td><td>48px</td><td>2</td><td>81.33333px</td><td>129.33333px</td></tr><tr><td>c（蓝色）</td><td>128px</td><td>3</td><td>122px</td><td>250px</td></tr></tbody></table>

经过实践验证，也确实是如此：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/2aa9c936.webp)

### 总结

对于使用 flex-grow 进行从左到右布局的场景，总结如下：

- 如果所有元素的 flex-grow 之和大于等于 1，则子元素的宽度之和等于父元素宽度
- 如果 flex-grow 之和小于 1，则子元素的宽度之和小于父元素宽度
- 子元素增长率的计算公式为：元素的 flex-grow 值除以各元素 flex-grow 值之和
- max-width 可能会对 flex-grow 产生影响，影响的宽度由剩余元素按照比例重新计算

## flex-shrink

该属性与 `flex-grow` 的作用恰恰相反，`flex-shrink` 用于定义：**父元素在主轴方向空间不足时，子元素们如何收缩**。其默认值为 1，表示元素宽度变小的一个权重分量，但是每个元素具体收缩多少，不仅仅取决于这个权重，还取决于自身的宽度。

### 常规场景

举个例子：父元素 400px，三个子元素宽度分别为为 150px、200px、150px，flex-shrink 的值分别为 1，2，3。通过计算得知 `400px - (150px + 200px + 150px) = -100px`，说明容器空间不足，还缺少 `100px` ，所以只能让内部的三个元素分别收缩一定的量来挤一挤，那分别收缩多少呢？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/7290fa68.webp)

第一直觉就是：按照 1:2:3 的比例分配不就好了，各元素分别收缩 `100px /6`、`2*100px / 6` 和 `3*100px / 6` 即可。

这种思路在 flex-grow 场景下是可行的，但是在 flex-shrink 下则不然，因为需要把元素自身的宽度也考虑进去，公式为：

- 总收缩宽度 = 各元素的宽度 \* flex-shrink 值之和
- 各元素收缩率 = 元素宽度 \* flex-shrink / 总收缩宽度

因此上面的总收缩宽度为 `1 * 150px + 2 * 200px + 3 * 150px = 1000px`，各元素的收缩率分别是：

- `1 * 150px / 1000px = 0.15`
- `2 * 200px / 1000px = 0.4`
- `3 * 150px / 1000px = 0.45`

因此三个元素分别收缩长度和最终宽度分别是：

- 收缩 `100px * 0.15 = 15px`，最终宽度 `150px - 15px = 135px`
- 收缩 `100px * 0.4 = 40px`，最终宽度 `200px - 40px = 160px`
- 收缩 `100px * 0.45 = 45px`，最终宽度 `150px - 45px = 105px`

记录成表格如下：

<table><thead><tr><th>400px 容器</th><th><strong>初始宽度</strong></th><th><strong>flex-shrink 值</strong></th><th><strong>收缩率</strong></th><th><strong>需收缩的空间</strong></th><th><strong>最终宽度</strong></th></tr></thead><tbody><tr><td><strong>a（紫色）</strong></td><td>150px</td><td>1</td><td>0.15</td><td>15px</td><td>135px</td></tr><tr><td><strong>b（绿色）</strong></td><td>200px</td><td>2</td><td>0.4</td><td>40px</td><td>160px</td></tr><tr><td><strong>c（蓝色）</strong></td><td>150px</td><td>3</td><td>0.45</td><td>45px</td><td>105px</td></tr></tbody></table>

图示如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/c161028b.webp)

### 被 min-width 干扰的场景

与 max-width 会影响 flex-grow 类似，flex-shrink 也会受到 min-width 的影响，例如我们对中间绿色元素添加 `min-width: 180px` 的属性，左右紫色和蓝色元素最终的宽度是多少呢？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/1bbf57a2.webp)

既然紫色区域锁定了 140px，不参与宽度收缩，那是不是超出的 100px 只能由左右两个元素来按照比例进行分配了呢？有了 flex-grow 的参照，相信大家也知道这么算是不对的，应该还是先按照不考虑 min-width 属性时进行计算，然后再把 min-width 超出的部分让剩余的元素按照比例承担，由于紫色的元素超出了 5px，按照上面的计算公式：

- 剩余元素加权宽度之和：`200px * 2 + 150px * 3 = 850px`
- 绿色元素缩短宽度 `200px * 2 * 5px / 850px = 2.35px`，因此剩余 `160px - 2.35px = 157.65px`
- 蓝色元素缩短 `150px * 3 * 5px / 850px = 2.65px`，因此剩余 `105px - 2.65px = 102.35px`

图示如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/672c83e5.webp)

### 值为小数的场景

同样，当所有元素的 flex-shrink 之和小于 1 时，计算方式也会有所不同，因为此时并不会收缩所有的空间，而只会收缩 flex-shrink 之和相对于 1 的比例的空间。还是上面的例子，但是 flex-shrink 分别改为 0.1，0.2，0.3，于是总权重为 `150px * 0.1 + 200px * 0.2 + 150px * 0.3 = 100`。

三个元素收缩总和并不是 150px，而是只会收缩 100px 的 `0.1 + 0.2 + 0.3 = 60%` 的空间，即 60px，因此每个元素收缩的空间为：

- `60px * 0.1 * 150 / 100 = 9px`
- `60px * 0.2 * 200 / 100 = 24px`
- `60px * 0.3 * 150 / 100 = 27px`

三个元素的最终宽度分别为：

- `150px - 9px = 141px`
- `200px - 24px = 176px`
- `150px - 27px = 123px`

如下图所示：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/a1bda4c9.webp)

### 内容自适应的场景

如果元素的宽度未指定，也会按照里面内容的大小进行动态计算，例如分别给三个元素里面添加文本，每个汉字的宽度是 16px，那么每个元素内容的宽度分别是 240px、160px 和 80px，加权宽度之和为 `1 * 240px + 2 * 160px + 3 * 80px = 800px`：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/4970a528.webp)

表格计算结果如下：

<table><thead><tr><th>400px 容器</th><th><strong>初始宽度</strong></th><th><strong>flex-shrink 值</strong></th><th><strong>收缩率</strong></th><th><strong>收缩宽度</strong></th><th><strong>最终宽度</strong></th></tr></thead><tbody><tr><td><strong>a（紫色）</strong></td><td>240px</td><td>1</td><td>0.3</td><td>24px</td><td>216px</td></tr><tr><td><strong>b（绿色）</strong></td><td>160px</td><td>2</td><td>0.2</td><td>32px</td><td>128px</td></tr><tr><td><strong>c（蓝色）</strong></td><td>80px</td><td>3</td><td>0.3</td><td>24px</td><td>56px</td></tr></tbody></table>

实际验证也确实如此：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ipld3j8zoqaisl1/717e0d22.webp)

### 总结

对于使用 flex-shrink 进行从左到右布局的场景，总结如下：

- 如果所有元素的 flex-shrink 之和大于等于 1，则子元素的宽度和等于父元素宽度
- 如果 flex-shrink 之和小于 1，则子元素的宽度和大于父元素宽度
- 子元素收缩率的计算公式为：flex-shrink 的值乘以元素宽度除以各元素 flex-shrink 值乘以元素宽度后的值之和
- min-width 可能会对 flex-shrink 产生影响，影响的宽度由剩余元素按照比例重新计算
