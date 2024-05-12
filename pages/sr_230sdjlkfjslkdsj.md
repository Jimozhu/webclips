---
title: "CSS世界：流、元素与基本属性"
date: 2023-01-28T22:15:02+08:00
draft: false
categories: [dev,web]
tags: [dev,web,css]
---

## display 的组合值

对于 display 的值，比如：block、inline、inline-block，其中 inline-block 明显是拼接的值，那么它有什么特殊意义呢。其实对于一个元素，我们可以将其看成两个盒子来决定它是如何进行布局的：外在盒子和内在盒子。外在盒子负责元素是可以一行显示，还是只能换行显示；内在盒子负责宽高、内容呈现什么的。

所以值为 inline-block 的元素可以看成由外在的“内联盒子”和内在的“块级容器盒子”组成，所以设置该值的元素在布局上可以同其他内联元素一行显示，同时可以设置其宽高。那么 block 我们其实也可以看成是 block-block，inline 可以看成 inline-inline，对于更多的 inline-flex、inline-table 也可以以同样的内外盒子概念去理解。

## width 和 height

大家有没有想过，width 和 height 属性是作用与一个元素的哪个盒子呢？外盒子还是内盒子？显而易见，上述内容已经揭晓了答案，是作用于内盒子。那么你真的了解这两个 css 属性吗？

### 深藏不漏的 width:auto

1. 充分利用可用空间。比方说，`<div>`、`<p>` 这些元素的宽度默认是 100\%于父级容器的。这种充分利用可用空间的行为还有个专有名字，叫作 fill-available，大家了解即可。

2. 收缩与包裹。典型代表就是浮动、绝对定位、inline-block 元素或 table 元素，英文称为 shrink-to-fit，直译为“收缩到合适”，有那么点儿意思，但不够形象，我一直把这种现象称为“包裹性”。CSS3 中的 fit-content 指的就是这种宽度表现。

3. 收缩到最小。这个最容易出现在 table-layout 为 auto 的表格中.当每一列空间都不够的时候，文字能断就断，但中文是随便断的，英文单词不能断。于是，第一列被无情地每个字都断掉，形成一柱擎天。这种行为在规范中被描述为“preferred minimum width”或者“minimum content width”。后来还有了一个更加好听的名字 min-content。

4. 超出容器限制。除非有明确的 width 相关设置，否则上面 3 种情况尺寸都不会主动超过父级容器宽度的，但是存在一些特殊情况。例如，**内容很长的连续的英文和数字**，或者内联元素被设置了 white-space:nowrap。如下示例：

```css
.father {
 width: 150px;
 background-color: #cd0000;
 white-space: nowrap;
}
.child {
 display: inline-block;
 background-color: #f0f3f9;
}
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_230sdjlkfjslkdsj/1120e226.webp)

子元素既保持了 inline-block 元素的收缩特性，又同时让内容宽度最大，直接无视父级容器的宽度限制。这种现象后来有了专门的属性值描述，**这个属性值叫作 max-content**

CSS 世界中，盒子分“内在盒子”和“外在盒子”，显示也分“内部显示”和“外部显示”，同样地，尺寸也分“内部尺寸”和“外部尺寸”。其中“内部尺寸”英文写作“Intrinsic Sizing”，表示尺寸由内部元素决定；还有一类叫作“外部尺寸”，英文写作“Extrinsic Sizing”，宽度由外部元素决定。

#### 外部尺寸和流体特性

1. 正常流宽度。当我们在一个容器里倒入足量的水时，水一定会均匀铺满整个容器。在页面中随便扔一个

   元素，其尺寸表现就会和这水流一样铺满容器。这就是 block 容器的流特性。这种特性，所有浏览器的表现都是一致的。
2. 格式化宽度。格式化宽度仅出现在“绝对定位模型”中，也就是出现在 position 属性值为 absolute 或 fixed 的元素中。在默认情况下，绝对定位元素的宽度表现是“包裹性”，**宽度由内部尺寸决定**，但是，有一种情况其宽度是由外部尺寸决定的，是什么情况呢？当 left/top 或 top/bottom 对立方位的属性值同时存在的时候，元素的宽度表现为“格式化宽度”，其宽度大小相对于最近的具有定位特性 position 属性值不是 static）的祖先元素计算。例如：`div { position: absolute; left: 20px; right: 20px; }`，假设该 `<div>` 元素最近的具有定位特性的祖先元素的宽度是 1000 像素，则这个 `<div>` 元素的宽度是 960（即 1000−20−20）像素

#### 内部尺寸与流体特性

所谓“内部尺寸”，简单来讲就是元素的尺寸由内部的元素决定，而非由外部的容器决定。如何快速判断一个元素使用的是否为“内部尺寸”呢？很简单，假如这个元素里面没有内容，宽度就是 0，那就是应用的“内部尺寸”。

几乎所有 inline-block 元素都是内部尺寸元素，他们的尺寸根据内容决定。

### box-sizing: border-box 设计的初衷

CSS 世界中，唯一离不开 `box-sizing:border-box` 的就是原生普通文本框 `<input>` 和文本域 `<textarea>` 的 100\%自适应父容器宽度。

拿文本域 `<textarea>` 举例，`<textarea>` 为替换元素，替换元素的特性之一就是尺寸由内部元素决定，且无论其 display 属性值是 inline 还是 block。这个特性很有意思，对于非替换元素，如果其 display 属性值为 block，则会具有流动性，宽度由外部尺寸决定，**但是替换元素的宽度却不受 display 水平影响**，因此，我们通过 CSS 修改 `<textarea>` 的 display 水平是无法让尺寸 100\%自适应父容器的。

所以，我们只能通过 width 设定让 `<textarea>` 尺寸 100\%自适应父容器。那么，问题就来了，`<textarea>` 是有 border 的，而且需要有一定的 padding 大小，否则输入的时候光标会顶着边框，体验很不好。于是，width/border 和 padding 注定要共存，同时还要整体宽度 100\%自适应容器。**如果不借助其他标签，肯定是无解的。**

在浏览器还没支持 box-sizing 的年代，我们的做法有点儿类似于“宽度分离”，外面嵌套 `<div>` 标签，模拟 border 和 padding，`<textarea>` 作为子元素，border 和 padding 全部为 0，然后宽度 100\%自适应父级 `<div>`

说来说去，也就 box-sizing:border-box 才是根本解决之道！

```css
textarea {
 width: 100%;
-ms-box-sizing: border-box; /* for IE8 */
box-sizing: border-box;
}
```

在我看来，box-sizing 被发明出来最大的初衷应该是解决替换元素宽度自适应问题。

```css
input, textarea, img, video, object {
 box-sizing: border-box;
}
```

而不是使用\*设置所有元素都是 border-box

### height

对于 width 属性，就算父元素 width 为 auto，其百分比值也是支持的；但是，对于 height 属性，**如果父元素 height 为 auto，只要子元素在文档流中，其百分比值完全就被忽略了。**

#### 为何 height: 100\%会无效

有一种看似合理的说法：如果父元素 height:auto 子元素还支持 height:100\%，则父元素的高度很容易陷入死循环，高度无限。实则这种说法是不对的

因为宽度设置也是有类似场景的：

```html
<div class="box">
 <img src="1.jpg">
 <span class="text">红色背景是父级</span>
</div>
```

```css
.box {
 display: inline-block;
 white-space: nowrap;
 background-color: #cd0000;
}
.text {
 display: inline-block;
 width: 100%;
 background-color: #34538b;
 color: #fff;
}
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_230sdjlkfjslkdsj/6b17652b.webp)

**并没有陷入死循环。**

要明白其中的原因要先了解浏览器渲染的基本原理。首先，先下载文档内容，加载头部的样式资源（如果有的话），然后按照**从上而下、自外而内的顺序渲染 DOM 内容**。套用本例就是，先渲染父元素，后渲染子元素，是有先后顺序的。因此，当渲染到父元素的时候，子元素的 width:100\%并没有渲染，宽度就是图片加文字内容的宽度；等渲染到文字这个子元素的时候，父元素宽度已经固定，此时的 width:100\%就是已经固定好的父元素的宽度。宽度不够怎么办？溢出就好了，overflow 属性就是为此而生的

那问题又来了：**为何宽度支持，高度就不支持呢**？规范中其实给出了答案。如果包含块的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为 auto。一句话总结就是：因为解释成了 auto。要知道，auto 和百分比计算，肯定是算不了的：`'auto' * 100/100 = NaN`。

但是，宽度的解释却是：如果包含块的宽度取决于该元素的宽度，那么产生的布局在 CSS 2.1 中是未定义的。这里的宽度布局其实也是“未定义行为”，也就是规范没有明确表示该怎样，浏览器可以自己根据理解去发挥。好在根据我的测试，布局效果在各个浏览器下都是一致的。这里和高度的规范定义就区别明显了，高度明确了就是 auto，高度百分比计算自然无果，width 却没有这样的说法，因此，就按照包含块真实的计算值作为百分比计算的基数。

#### 如何让 height: 100\%生效

答案是使用绝对定位。此时的 height:100\%就会有计算值，即使祖先元素的 height 计算为 auto 也是如此。需要注意的是，绝对定位元素的百分比计算和非绝对定位元素的百分比计算是有区别的，**区别在于绝对定位的宽高百分比计算是相对于 padding box 的，也就是说会把 padding 大小值计算在内，但是，非绝对定位元素则是相对于 content box 计算的。**

## 内联元素

### 如何辨别内联元素

1. 从定义上看：首先要明白这一点：“内联元素”的“内联”特指“外在盒子”，和“display 为 inline 的元素”不是一个概念！inline-block 和 inline-table 都是“内联元素”，因为它们的“外在盒子”都是内联盒子。自然 display:inline 的元素也是“内联元素”，那么，按钮元素是内联元素，因为其 display 默认值是 inline-block；图片元素也是内联元素，因为其 display 默认值是 inline 等。

2. 从表现看：就行为表现来看，“内联元素”的典型特征就是可以和文字在一行显示。因此，文字是内联元素，图片是内联元素，按钮是内联元素，输入框、下拉框等原生表单控件也是内联元素。

### 幽灵空白节点

“幽灵空白节点”是内联盒模型中非常重要的一个概念，具体指的是：在 **HTML5 文档声明中**，内联元素的所有解析和渲染表现就如同每个行框盒子的前面有一个“空白节点”一样。这个“空白节点”永远透明，不占据任何宽度，看不见也无法通过脚本获取，就好像幽灵一样，但又确确实实地存在。

简单举例：

```css
div {
	background-color: #cd0000;
}
span {
	display: inline-block;
}
```

```html
<div><span></span></div>
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_230sdjlkfjslkdsj/29716400.webp)

可以看见，div 的高度并不是 0

作祟的就是这里的“幽灵空白节点”，**如果我们认为在元素的前面还有一个宽度为 0 的空白字符**，是不是一切就解释得通呢？

规范中实际上对这个“幽灵空白节点”是有提及的，“幽灵空白节点”实际上也是一个盒子，不过是个假想盒，名叫“strut”，中文直译为“支柱”，是一个存在于每个“行框盒子”前面，同时具有该元素的字体和行高属性的 0 宽度的内联盒。
