---
title: 文本换行必会的五个属性！
date: 2022-12-15T01:41:00.000Z
draft: false
categories:
  - dev
tags:
  - web
  - css
origin_url: 'https://juejin.cn/post/7176544539644002361'
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7176544539644002361)

文本换行！是的，这个知识点应该说是我们见的最多的知识，只要有文字的存在，那就必定少不了文本换行，那么问题来了，怎么样才会出现文本换行，是 `浏览器默认行为` 还是 `css行为`？我们先来看看以下例子：

```css
// 父元素
.box {
  width: 200px;
  height: 500px;
  margin-top: 100px;
  background-color: cyan;
}

// 子元素
.box .box-item {
  width: 160px;
  height: 100px;
  margin-top: 10px;
  background-color: orange;
}
```

上面的 css 代码只是处理了父子盒子的宽高等一些基础 css 属性处理，子盒子固定宽度小于父盒子固定宽度，我们再看看 html 标签元素，标签元素的布局都是一样，主要是内容分为四种情况：`中文内容`、`数字内容`、`英文内容`、`包含连字符的内容`。

```html
<div class="box">
  <!--中文内容-->
  <div class="box-item" id="zh-item">你好，前端！你好，前端！</div>
  <!--数字内容-->
  <div class="box-item" id="es-item">
    128937192312937192379123719378123127 3812983
  </div>
  <!--英文内容-->
  <div class="box-item" id="es-item">
    Helloooooooooooooooooo World! Hello World! Hello World!
  </div>
  <!--英文内容+连字符-->
  <div class="box-item" id="es-item">
    Helloooooooooooooooooo--------------------
  </div>
</div>
```

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/03dc108c.webp) 从图片上看，不同内容在固定宽度的盒子的换行情况各不一样，我们有没有发现四个细微细节：

- **中文内容**：`换行点在宽度边缘`。
- **数字内容**：`换行点在空格处`。
- **英文内容**：`换行点在单个单词空格处`。
- **包含连字符的内容**：`换行点在连字符处`。

我能不能再杠一点（😀），假如内容中有中文字段，，有数字字段，也有英文字段，更有包含连字符的内容呢？这样的话页面显示的效果又是怎样？

```html
<div class="box-item">
  你好，前端！你好，前端！12899371 9233Hello World!Hellooooo----------
</div>
```

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/d1a0f783.webp)

哎哟喂，咋变成这样呢？其实这些都是浏览器的默认行为，没有任何 css 做的换行操作，所以我们可以这样去理解浏览器的默认换行行为，只要内容超出盒子宽度分为四种情况：

- **如果内容只是中文字段**，浏览器默认超出宽度就换行。
- **如果内容只是数字字段或英文字段**：超出盒子的第一个字符是空格，浏览器默认换行。
- **如果内容只是包含连字符的内容**：以连字符为准，不管超出字符是否从空格开始，都是按照超出字符中的第一个连字符开始换行。

既然我们现在都已经明确了文本换行的出现的各种情况，下面我们就要根据上面出现的各种换行的情况一一处理我们需要换行的文本内容。这时候 `overflow-wrap`、`word-break`、`white-space`、`line-break`、`hyphens` 的五个 css 属性就很有用了，下面我们一起来学习一下。

## 1 overflow-wrap

- **overflow-wrap**：中文意思是 `溢出换行`，它有三个值：`normal`、`anywhere`、`break-word`。normal 值相当于浏览器默认行为，这个属性重点在后面两个属性值，那这两个属性有什么区别呢？我们先看看下面例子：

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/08ce8bba.webp) 从上图我们可以发现，在两个子盒子中都设置了 width:min-content 和 overflow-wrap，我们可以发现有很大区别，设置了 break-word 值的盒子换行在单词空格处，而 `设置了anywhere值的盒子每个字符就换行一次，也就是受min-content的影响`。其实如果设置了一个固定的宽度，anywhere 和 break-word 的功能一样都是 `控制文本在宽度边界进行换行`。从而**解决了非中文字符在固定宽度换行的问题**。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/2d6f95f6.webp) 细心地我们有没有发现第一个盒子的换行情况：`在空格处换行`。一个极度强迫完美的用户说：这样不好看，不想不要多余空格。好的好的，既然我们发现了这个问题就要解决问题了，如何解决？这时候 **white-space** 就华丽地登场了。

## 2 white-space

- **white-space**：中文意思：`白色的空间（空格）`，用来处理标签元素中的空白符（空格）。它有五个属性值：`normal`、`nowrap`、`pre`、`pre-wrap`、`pre-line`。 **nowrap**：中文意思：不换行，`防止文本自动换行`。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/ea35882e.webp) **pre**：中文意思：前缀，用于 `保留空白符`（文本开头的空白符），浏览器默认行为是去掉空白符的，如果设置了这个值，会保留空白符。行为类似 HTML 的 pre 标签。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/66c9c33b.webp) **pre-wrap**：中文意思：前缀换行，用于 `在空白符最后换行`。注意地，这个属性值会控制一个空格换行一次。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/c158f898.webp) **pre-line**：中文意思：前缀线，用于 `多个空白符合并为一个空白符`。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/3a7e5c0b.webp)

文本中空白符的处理的五个属性花了九牛二虎之力终于啃完了，那么问题又来了，空白符虽然处理了，还是会有一些文本不能换行，所以要搭配一下 overflow-wrap 使用：

```css
// 处理了前缀空格，又保证了换行
overflow-wrap: break-word;
white-space: pre-line;
```

## 3 word-break

- **word-break**：中文意思：单词换行，它有四个值：`normal`、`break-all`、`keep-all`、 `break-word`。

  **break-all**：不论超出盒子宽度的字符是否包含空白符还是其他字符都进行换行，只要超出盒子宽度就换行。

  **keep-all**：保持文本不换行，有点类似浏览器默认行为，也就是设置了 normal 属性值。

  **break-word**：这个属性值已经被弃用了，它的用法与 word-break: normal;与 overflow-wrap: anywhere;共同使用的功能一样。

## 4 line-break

- **line-break**：用来处理如何断开带有**标点符号**的内容行。它有五个值： `anywhere`、 、`auto`、`loose`、`normal`、`strict`。

  **auto**：使用默认的换行规则处理文本。

  **loose**：使用尽可能松散换行规则处理文本。

  **normal**：使用一般换行规则处理文本。

  **strict**：使用严格换行规则处理文本。

  **anywhere**：忽略任何阻断换行的字符。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_z4h5dwe62jlaerah/43767b82.webp)

## 5 hyphens

- **hyphens**：为文本添加连字符进行换行。它有三个值：`none`、`manual`、`auto`。 **none**：只在空白符换行，即使文本有换行符。

  **manual**：手动插入连字符插入 ­（解析为-），只有文本中有建议换行符才会换行。

  **auto**：浏览器在适当的位置自动插入连字符换行。

  > **硬连字符**： `＆hyphen;` ，即使文本中没有中间换行，也会显示连字符
  > **软连字符**： `＆shy;` ，只有文本换行才显示连字符
  >

## 6 不换行溢出处理

```css
display: block|inline-block;
width: 200px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

## 总结

- **overflow-wrap**：控制文本换行点。
- **white-space**：控制文本换行点的空白符。
- **word-break**：无视特殊字符，控制文本只要超出固定宽度就换行。
- **line-break**：控制带有很长标点符号的文本。
- **hyphens**：通过添加连字符控制文本换行。
