---
title: "【译】Figma 背后的 css"
date: 2023-03-05T12:09:32+08:00
draft: false
categories: [dev]
tags: [web, css]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7205875448568512571)

> 原文地址：[The CSS behind Figma](https://ishadeed.com/article/figma-css/)

> 原文作者：[Ahmad Shadeed](https://ishadeed.com/)

在学习如何构建 Figma 插件的过程中，我偶然发现了一些 Figma 中 Flexbox 和 Grid 布局好玩的用法。这个发现使我情不自禁地继续深挖下去。

在这篇文章中，我将为您介绍 Flexbox 和 Grid 为 web 开发人员提供的许多新的构建新布局的能力。

阅读本文不需要您详细了解 Flexbox 或 Grid 的相关知识，大多数示例我都会介绍的非常详细。

开干。

## 简介

本文旨在展示 Flexbox 和 Grid 的强大，并突出它们有趣的应用场景。有一部分内容可能专注于我个人非常中意的 UI 细节。

## 使用 css 网格

Figma 页面右侧有一个默认的“设计”面板。当我们在画布上选中一个元素时，可以在设计面板看到该元素的 X 轴、Y 轴、宽度和高度值。设计面板展示的内容根据元素类型的不同（文本、组、框架等）而有所不同。

我发现这里有趣的点在于设计面板中的每一行都使用了 CSS 网格。我非常非常喜欢这个实现。

请看下图。

![1.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/2164f729.webp)

可以看到上图中有很多条虚线，这些线组成了 28 列，是的！你没有看错。设计面板中的每一行都是在该网格上构建出来的。

每一列的宽度为 `8px`。

```css
.raw_components--_singleRow {
  display: grid;
  grid-template-columns: repeat(28, 8px);
  grid-template-rows: 32px;
}
```

另外，例如在控制投影细节的面板中，也用到了相同的布局。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/2b4261b3.webp)

对我来说，这就是 css 网格的完美实践，即使乍一看你可能觉得这都是些小布局，但这是 css 网格非常有效的实践。

## 对齐按钮

在这个使用场景中，每个对齐按钮占据网格的 4 列（32px）。注意图标本身是如何很好地居中的。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/40395f1e.webp)

```css
.raw_components--_singleRow {
  display: grid;
  grid-template-columns: repeat(28, 8px);
  grid-template-rows: 32px;
}

.raw_components--_iconButton {
  grid-column-end: span 4;
}
```

## 元素位置

在这个例子中，我们看到 x 轴和 y 轴的输入框以及新的“绝对位置”按钮是如何划分区域的。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/4f010d90.webp)

## 自动布局

自动布局这个控件非常有意思。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/3096843e.webp)

这里有一个 28 列 \* 2 行的网格，用于容纳帮助我们对 Auto Layout 容器中的子项进行对齐的控件。

```css
.stack_panel_v4--doubleRow {
  display: grid;
  grid-template-columns: repeat(28, 8px);
  grid-template-rows: repeat(2, 32px);
}
```

好了，我们来深入了解一下细节！

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/38ea8e90.webp)

在网格层级，每个元素都使用 `grid-column` 或 `grid-row`，或者同时使用这两个属性来定位。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/1171f247.webp)

你看到的对齐点是由 SVG 图案绘制的。这是一个非常棒的细节和用法！

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/751a1022.webp)

除此之外，为了给每个对齐位置提供可点击区域，这里还有一个包含 9 个网格项的 3\*3 的网格。

```css
.alignment_view_v4--tooltipGrid {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
}
```

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/b4e3a9a0.webp)

接下来是指示器容器，其中包含显示 Auto Layout 容器中元素如何对齐的图标。

为了更容易理解，我把整块区域划分为 4 个部分：

- 基础背景
- SVG 点
- 可点击的 3\*3 网格
- 指示器容器（蓝色图标部分）

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/5e87bd2d.webp)

接下来我们着重关注指示器容器部分，来看一下它的基础结构和 CSS 样式。

```html
<!-- 60*60 container -->
<div class="alignment_view_v4--indicatorContainer">
  <!-- 20*20 icon (the blue one) -->
  <div class="alignment_view_v4--indicatorGroup">
    <div class="alignment_view_v4--indicator"></div>
    <div class="alignment_view_v4--indicator"></div>
    <div class="alignment_view_v4--indicator"></div>
  </div>
</div>
```

在上面的 HTML 结构中，可以看到有指示器容器和对齐图标。 图标本身是用 flexbox 构建和对齐的，这是我非常喜欢的一点。

```css
/* Size is 60*60 */
.alignment_view_v4--indicatorContainer {
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
```

由此，我们一共有两个 Flexbox 容器，一个是 `indicatorContainer` 元素，另一个用于图标本身。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/b82065c9.webp)

以下是蓝色图标的样式。有一个 `flex-direction: column;` 的 flex 容器，然后有 3 个不同大小的蓝色线段元素。

```css
.alignment_view_v4--indicatorGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 20px;
  height: 20px;
}

.alignment_view_v4--indicator {
  height: 4px;
  border-radius: 1px;
}

.alignment_view_v4--indicator:nth-child(1) {
  width: 10px;
}

.alignment_view_v4--indicator:nth-child(2) {
  width: 16px;
}

.alignment_view_v4--indicator:nth-child(3) {
  width: 7px;
}
```

令我惊讶的是，当我们更改自动布局元素的对齐方式时，`indicatorContainer` 和 `indicatorGroup` 都会自动响应。

这是一个自动布局设置为左上对齐的示例。

```css
.alignment_view_v4--indicatorContainer {
  justify-content: flex-start;
  align-items: flex-start;
}

.alignment_view_v4--indicatorGroup {
  align-items: flex-start;
}
```

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/1487acc4.webp)

## 使用 Flexbox

### 图层面板行

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/c6c839c0.webp)

在上图中，我们有一个名为“Sign up_001”的主框架，其内部有 3 个嵌套项。嵌套层级越深，左侧表明嵌套的缩进越多。

审查元素行，我发现了这个：

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/416f4fc1.webp)

每一行都是一个 flex 的父元素，因此我在 HTML 父元素旁边高亮显示了 flex 标签。

在下图中查看它的实际效果：

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/f0c6c063.webp)

酷，但问题来了：缩进是怎么实现的呢？ 老实说，我在审查元素之前就预料到了，并不感到惊讶。 通过添加[间隔组件](https://ishadeed.com/article/spacing-in-css/#spacer-components "https://ishadeed.com/article/spacing-in-css/#spacer-components")来实现。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/f7d8ca6b.webp)

每个间隔组件宽度为 `16px`，并且除了第一个之外的所有组件都有一个 `margin-right: 8px` 的属性。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/77520fc1.webp)

随着嵌套层级增多，每一行看起来就会像下图这样。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/9bd3f1b5.webp)

现在视图表现层已经很清楚了，我们来看看标记和样式部分。

```html
<div class="object_row">
  <span class="object_row--indents">
    <span class="object_row--indent"></span>
    <!-- The more indent items, the more nesting.. -->
  </span>
  <span class="object_row--layerIcon"></span>
  <span class="object_row--rowText"></span>
  <span class="object_row--rowActions">
    <span class="object_row--lockIcon"></span>
    <span class="object_row--visibleIcon"></span>
  </span>
</div>
```

我们有两个 flexbox 父元素，一个用于整行，另一个用于间隔组件（Figma 团队称它们为缩进，我喜欢这个名字）。

```css
.object_row {
  display: flex;
  height: 32px;
}

.object_row--indents {
  display: flex;
  height: 100%;
}

.object_row--layerIcon {
  width: 16px;
}

.object_row--rowText {
  width: calc(100% - 16px);
  flex-shrink: 1;
}

.object_row--rowActions {
  width: 0; /* becomes width: auto on hover */
}
```

如上，嵌套层级通过添加新的间隔元素来实现。

考虑一下下面的标记结构。我们有两个间隔元素，也就是说这一行是它所在组中的第一行。

```html
<div class="object_row">
  <span class="object_row--indents">
    <span class="object_row--indent"></span>
    <span class="object_row--indent"></span>
  </span>
  <span class="object_row--layerIcon"></span>
  <span class="object_row--rowText"></span>
  <span class="object_row--rowActions">
    <span class="object_row--lockIcon"></span>
    <span class="object_row--visibleIcon"></span>
  </span>
</div>
```

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/6ac97e74.webp)

是不是很有趣，很酷？ 看到我最喜欢的设计工具使用我最喜欢的 CSS 功能真是……太棒了。

## 其它 Flexbox 用例

Flexbox 被大量用于小型组件。 我们来探讨其中的部分实现。

### 描边细节

对于颜色组件，Flexbox 用于控制颜色值和不透明度。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/36878d46.webp)

在相同的上下文中，当用户将鼠标悬停在下拉菜单上时，它将通过 `flex-grow: 1;` 使文本区域扩展到整个可用空间。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/21788200.webp)

### 文档颜色

在这个示例中，使用 Flexbox 能够使 wrapper 容器的收益最大化。相反，使用 CSS 网格达不到同样的效果。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/97b7b185.webp)

### 约束组件

这里有多个 Flexbox 容器。 第一个用于顶部、中间和底部行。 第二个用于中间项，它本身也是一个 Flexbox 容器。

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_2f7gh3yzkl9h1t9f/6976ef44.webp)

## 结论

以上就是本次探索的全部内容。对我来说，在我将要使用的工具中看到 Flexbox 和 Grid 如此独特而有趣的用法，将激励我去探索我们现有 CSS 工具的更多用例。

如果您喜欢这种类型的文章，我发表了一篇深入探讨我对构建 [Facebook Messenger 聊天气泡](https://ishadeed.com/article/facebook-messenger-chat-component/ "https://ishadeed.com/article/facebook-messenger-chat-component/")探索的文章。

感谢阅读。
