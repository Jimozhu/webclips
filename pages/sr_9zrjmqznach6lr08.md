---
title: "电商最小存货 - SKU 和 算法实现"
date: 2022-02-09T15:18:46+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7002746459456176158)

## 前言

目前电商平台的业务中，只要有商品，不可避免的会遇到 [SKU](https://baike.baidu.com/item/%E6%9C%80%E5%B0%8F%E5%AD%98%E8%B4%A7%E5%8D%95%E4%BD%8D) 方面功能。这篇文章就从理论到实践，从商品创建到商品购买，手把手带你实现 SKU 相关的“核心算法”。

让我们看看实际场景：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/131785a5.gif)

有了上图规格选中预处理，就能够帮助用户在购买商品时，直观的了解到商品是否可以购买。

在我们实际开发过程中，商品创建页会先进行规格组装，商品购买页会对规格选择做处理。规格组装通过规格组合成 SKU 集合，规格选择根据规格内容获取库存数据量，计算 SKU 是否可被选择，两者功能在电商流程中缺一不可。

## 组装 SKU 实践

#### 属性描述

根据[百度百科](https://baike.baidu.com/item/%E6%9C%80%E5%B0%8F%E5%AD%98%E8%B4%A7%E5%8D%95%E4%BD%8D)解释的 SKU

- 最小存货单位\( Stock Keeping Unit \) 在连锁零售门店中有时称单品为一个 SKU，定义为保存库存控制的最小可用单位，例如纺织品中一个 SKU 通常表示规格、颜色、款式。

#### 业务场景

- 只要是做电商类相关的产品，比如购物 APP、购物网站等等，都会遇到这么一个场景，每个商品对应着多个规格，用户可以根据不同的规格组合，选择出自己想要的产品。我们自己在生活中也会经常用到这个功能。

通过上面描述，让我们把概念和实际数据关联起来，下面让我们来举个 🌰 ：

现有规格

```javascript
const type = ["男裤", "女裤"];
const color = ["黑色", "白色"];
const size = ["S", "L"];
```

那么根据现有规格，可以得到所有的 SKU 为：

```javascript
[
  ["男裤", "黑色", "S"],
  ["男裤", "黑色", "L"],
  ["男裤", "白色", "S"],
  ["男裤", "白色", "L"],
  ["女裤", "黑色", "S"],
  ["女裤", "黑色", "L"],
  ["女裤", "白色", "S"],
  ["女裤", "白色", "L"],
];
```

上述 SKU 是如何得到的呢，让我们一起看看实现思路，并且通过上面的 🌰 来计算一遍。

### SKU 组合实现思路

#### 笛卡尔积

首先让我们来看看笛卡尔积的描述

- 笛卡尔乘积是指在数学中，两个\[集合\] _X_ 和 _Y_ 的笛卡尔积\(Cartesian product\)，又称 \[ 直积 \] ，表示为 _X_ × _Y_，第一个对象是 _X_ 的成员而第二个对象是 _Y_ 的所有可能 \[ 有序对 \] 的其中一个成员
- 假设集合 A = \{ a, b \}，集合 B = \{ 0, 1, 2 \}，则两个集合的笛卡尔积为 \{ \( a, 0 \), \( a, 1 \), \( a, 2\), \( b, 0\), \( b, 1\), \( b, 2\) \}

看来笛卡尔积满足组合计算的条件，那么下面先来一波思维碰撞，先通过导图，看看怎么实现

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/5c20dafe.jpe)

通过上面的思维导图，可以看出这种规格组合是一个经典的排列组合，去组合每一个规格值得到最终 SKU。

那么让我们来进行代码实现，看看代码如何实现笛卡尔积。

### 实现代码

```javascript
/**
 * 笛卡尔积组装
 * @param {Array} list
 * @returns []
 */
function descartes(list) {
  // parent 上一级索引;count 指针计数
  let point = {}; // 准备移动指针
  let result = []; // 准备返回数据
  let pIndex = null; // 准备父级指针
  let tempCount = 0; // 每层指针坐标
  let temp = []; // 组装当个 sku 结果

  // 一：根据参数列生成指针对象
  for (let index in list) {
    if (typeof list[index] === "object") {
      point[index] = { parent: pIndex, count: 0 };
      pIndex = index;
    }
  }

  // 单维度数据结构直接返回
  if (pIndex === null) {
    return list;
  }

  // 动态生成笛卡尔积
  while (true) {
    // 二：生成结果
    let index;
    for (index in list) {
      tempCount = point[index].count;
      temp.push(list[index][tempCount]);
    }
    // 压入结果数组
    result.push(temp);
    temp = [];

    // 三：检查指针最大值问题，移动指针
    while (true) {
      if (point[index].count + 1 >= list[index].length) {
        point[index].count = 0;
        pIndex = point[index].parent;
        if (pIndex === null) {
          return result;
        }
        // 赋值 parent 进行再次检查
        index = pIndex;
      } else {
        point[index].count++;
        break;
      }
    }
  }
}
```

让我们看看实际的输入输出和调用结果。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/133778bd.png)

那么这个经典的排列组合问题就这样解决啦。接下来，让我们再看看，如何在商品购买中，去处理商品多规格选择。

## 商品多规格选择

开始前回顾下使用场景

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/fbf3a301.gif)

这个图片已经能很明确的展示业务需求了。结合上述动图可知，在用户每次选择了某一规格后，需要通过程序的计算去处理其他规格情况，以便给用户提供当前情况下可供选择的其他规格。

那么让我们来看看实现思路，首先在初始化中，提供可选择的 SKU，从可选择的 SKU 中去剔除不包含的规格内容，在剔除后，提供可以进行下一步选择的规格，后续在每次用户点击情况下，处理可能选中的 SKU，最终在全部规格选择完成后，得到选中的 SKU。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/7f485b7a.png)

## 商品多规格选择实现思路

#### 邻接矩阵

首先，看下什么是邻接矩阵，来自[百度百科](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E9%2582%25BB%25E6%258E%25A5%25E7%259F%25A9%25E9%2598%25B5%2F9796080%3Ffr%3Daladdin "https://baike.baidu.com/item/%E9%82%BB%E6%8E%A5%E7%9F%A9%E9%98%B5/9796080?fr=aladdin")的解释

- 用一个二维数组存放顶点间关系（边或弧）的数据，这个二维数组称为邻接矩阵。
- 逻辑结构分为两部分：V 和 E 集合，其中，V 是顶点，E 是边。因此，用一个一维数组存放图中所有顶点数据。

字面描述可能比较晦涩难懂，那么让我们来看看图片帮助理解，如果两个顶点互通（有连线），那么它们对应下标的值则为 1，否则为 0。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/666fda65.png)

#### 让我们继续前面的 🌰 数据来看

规格

```javascript
const type = ["男裤", "女裤"];
const color = ["黑色", "白色"];
const size = ["S", "L"];
```

假设总 SKU 的库存值为下面示例，可选为有库存，不可选为某项规格无库存

```javascript
[
  ["男裤", "黑色", "S"], // S 无号
  ["男裤", "黑色", "L"],
  ["男裤", "白色", "S"], // S 无号
  ["男裤", "白色", "L"],
  ["女裤", "黑色", "S"], // S 无号
  ["女裤", "黑色", "L"],
  ["女裤", "白色", "S"], // S 无号
  ["女裤", "白色", "L"],
];
```

那么根据邻接矩阵思想，可以得到结果图：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/f6f4e92d.png)

从图中可以看出，SKU 中每两规格都可选择，那么相对的标志值为 1，否则为 0，当整条规格选中都是 1，才会使整条 SKU 链路可选。

思路是有了，但是如何通过代码去实现呢，想必大家也有各种方式去实现，那么我就介绍下自己的实现方式：集合。

### 计算思路

#### 集合

高中过去好多年了，难免忘记，这里通过集合说明图一起回顾下集合的定义

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/a10d1eaa.png)

上图来自百度图片

想起集合，那么计算思路算是有了，这边我们需要用集合相等的情况，去处理 SKU 和规格值的计算。

实现思维导图

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9zrjmqznach6lr08/99404a13.jpe)

- 假设一个集合 A\{a, b, c\} 和另外一个集合 B\{a, e\}，如何快速判断 B 是否是 A 的子集。这个问题比较简单的方法是用 B 中所有元素依次和 A 中的元素进行比较，对于集合中的元素，每个元素值都是唯一的。通过这样的特性，我们可以把所有字母转换为一个质数，那么 **集合 A 可以表示为集合元素**\(**质数**\)\*\*的积，B 同样，\*\*B 是否是 A 的子集，这个只需要将 B 除以 A，看看是否可以整除 ，如果可以那么说明，B 是 A 的子集。
- 那么根据邻接矩阵思路，整条 SKU 都会有一个 `集合值`，集合值由所有涉及规格对应 `乘积` 得到的结果，在选择规格过程中，每次选择去根据集合值去反向整除规格对应值去判断是否是子集，是否为 1。
- 现在根据乘法算法，有了以上的分析，我们可以整理下算法过程：
  - 数据预处理，把所有需要处理的规格内容一一对应一个不重复的质数，把 ITEM 组合转换为每个质数的积
  - 根据用户已经选择的 ITEM 进行扫描所有的 ITEM，如果 ITEM 已经被选中，则退出，如果没有， 则和所有已经选择的 ITEM 进行相乘 \(因为一个组合不可能出现两个类目相同的 ITEM，所以选中的 ITEM 需要去掉和当前匹配的 ITEM 在同一个类目中的 ITEM \) ，这个乘机就是上文中的集合 B
  - 把集合 B 依次和 SKU 组合构成的积 \(相当于上文中的集合 A\) 进行相除，比较，如果整除，则退出，当前匹配的 SKU 可以被选中，如果一直到最后还没有匹配上，则当前匹配的 SKU 不可被选中。

我们通过集合的思想，看看核心代码吧。

### 核心代码

计算质数方法：

```javascript
/**
 * 准备质数
 * @param {Int} num 质数范围
 * @returns
 */
getPrime: function (num) {
  // 从第一个质数 2 开始
  let i = 2;
  const arr = [];
  /**
   * 检查是否是质数
   * @param {Int} number
   * @returns
   */
  const isPrime = (number) => {
    for (let ii = 2; ii < number / 2; ++ii) {
      if (number % ii === 0) {
        return false;
      }
    }
    return true;
  };
  // 循环判断，质数数量够完成返回
  for (i; arr.length < total; ++i) {
    if (isPrime(i)) {
      arr.push(i);
    }
  }
  // 返回需要的质数
  return arr;
}
// 上述动图入参以及返回结果展示：
// getPrime(500) return==>
// 0: (8) [2, 3, 5, 7, 11, 13, 17, 19]
// 1: (8) [23, 29, 31, 37, 41, 43, 47, 53]
// 2: (8) [59, 61, 67, 71, 73, 79, 83, 89]
// 3: (8) [97, 101, 103, 107, 109, 113, 127, 131]
// 4: (8) [137, 139, 149, 151, 157, 163, 167, 173]
// 5: (8) [179, 181, 191, 193, 197, 199, 211, 223]
// 6: (8) [227, 229, 233, 239, 241, 251, 257, 263]
```

初始化处理，得到第一批邻接矩阵结果：

```javascript
/**
 * 初始化，格式需要对比数据，并进行初始化是否可选计算
 */
init: function () {
  this.light = util.cloneTwo(this.maps, true);
  var light = this.light;

  // 默认每个规则都可以选中，即赋值为 1
  for (var i = 0; i < light.length; i++) {
    var l = light[i];
    for (var j = 0; j < l.length; j++) {
      this._way[l[j]] = [i, j];
      l[j] = 1;
    }
  }
  // 对应结果值，此处将数据处理的方法对应邻接矩阵的思维导图
  // 0: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 1: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 2: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 3: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 4: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 5: (8) [1, 1, 1, 1, 1, 1, 1, 1]
  // 6: (8) [1, 1, 1, 1, 1, 1, 1, 1]

  // 得到每个可操作的 SKU 质数的集合
  for (i = 0; i < this.openway.length; i++) {
    // 计算结果单行示例：
    // this.openway[i].join('*') ==> eval(2*3*5*7*11*13*17*19)
    this.openway[i] = eval(this.openway[i].join('*'));
  }
  // return 初始化得到规格位置，规格默认可选处理，可选 SKU 的规格对应的质数合集
  this._check();
}
```

计算是否可选方法：

```javascript
/**
 * 检查是否可以选择，更新邻接矩阵对应结果值
 * @param {Boolean} isAdd 是否新增状态
 * @returns
 */
_check: function (isAdd) {
  var light = this.light;
  var maps = this.maps;

  for (var i = 0; i < light.length; i++) {
    var li = light[i];
    var selected = this._getSelected(i);
    for (var j = 0; j < li.length; j++) {
      if (li[j] !== 2) {
      //如果是加一个条件，只在是 light 值为 1 的点进行选择
        if (isAdd) {
          if (li[j]) {
            light[i][j] = this._checkItem(maps[i][j], selected);
          }
        } else {
          light[i][j] = this._checkItem(maps[i][j], selected);
        }
      }
    }
  }
  return this.light;
}，

/**
 * 检查是否可选内容，更新邻接矩阵对应结果值
 * @param {Int} item 当前规格质数
 * @param {Array} selected
 * @returns
 */
_checkItem: function (item, selected) {
  // 拿到可以选择的 SKU 内容集合
  var openway = this.openway;
  var val;
  // 拿到已经选中规格集合*此规格集合值
  val = item * selected;
  // 可选 SKU 集合反除，查询是否可选
  for (var i = 0; i < openway.length; i++) {
    this.count++;
    if (openway[i] % val === 0) {
      return 1;
    }
  }
  return 0;
}

```

添加规格方法：

```javascript
/** 选择可选规格后处理
 * @param {array} point [x, y]
 */
add: function (point) {
  point = point instanceof Array ? point : this._way[point];
  // 得到选中规格对应的质数内容
  var val = this.maps[point[0]][point[1]];

  // 检查是否可选中
  if (!this.light[point[0]][point[1]]) {
    throw new Error(
      'this point [' + point + '] is no availabe, place choose an other'
    );
  }
  // 判断是否选中内容已经存在已经选择内容中
  if (val in this.selected) return;

  var isAdd = this._dealChange(point, val);
  this.selected.push(val);
  // 选择后邻接矩阵对应数据修改为 2，以做是否可选区分
  this.light[point[0]][point[1]] = 2;
  this._check(!isAdd);
}
```

移除已选规格方法：

```javascript
/**
 * 移除已选规格
 * @param {Array} point
 */
remove: function (point) {
  point = point instanceof Array ? point : this._way[point];
  // 容错处理
  try {
    var val = this.maps[point[0]][point[1]];
  } catch (e) {}

  if (val) {
    // 在选中内容中，定位取出需要移除规格质数
    for (var i = 0; i < this.selected.length; i++) {
      if (this.selected[i] == val) {
        var line = this._way[this.selected[i]];
        // 对应邻接矩阵内容更新为可选
        this.light[line[0]][line[1]] = 1;
        // 从已选内容中移除
        this.selected.splice(i, 1);
      }
    }
  // 进行重新计算
  this._check();
  }
}
```

### 整体代码

开源代码将在 9 月中旬提供。如需，请关注微信公众号：政采云前端团队。回复 sku，即可获取开源地址。

## 总结

看来老师没有骗我们，在学习中学到的**经典排列组合**，**邻接矩阵**，**集合**还是很有用处的。其中经典排列组合**笛卡尔积**思想不用死记硬背，通过理解就可以完成递归树状图的大量情况。根据邻接矩阵，可以简化空间复杂程度，通过集合思想，实现选择数据判断。

相信阅读完本篇文章的你，对于电商规格处理的两个算法已经有了大体了解。

### 参考文献

1.上述集合计算思路借鉴文献， 详情见[链接](http://git.shepherdwind.com/sku-search-algorithm.html)。

2.另一种正则匹配实现思路文献借鉴，详情见[链接](https://gist.github.com/shepherdwind/2141756)。

3.邻接矩阵思路借鉴文献，详情见[链接](https://gist.github.com/shepherdwind/2141756)。
