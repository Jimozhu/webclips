---
title: "css基础知识"
date: 2021-08-26T10:15:50+08:00
draft: false
categories: [web]
tags: [dev, web, js]
---
there are a few key concepts that were vital to things finally all making sense and fitting together. These were:

- The Box Model (e.g. box-sizing, height, width, margin, padding)
- Layout (e.g. display)
- Document Flow and Positioning (e.g. position, top, left, etc.)

## THE BOX MODEL

there are two different models by which to measure this and you can adjust this with the [box-sizing property](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing).

- box-sizing: content-box (browser default)

The size of an element only includes its content, and not its padding or border.

- box-sizing: border-box

The size of an element is inclusive of its padding and border. When you set width: 100% with content-box, the content will be 100% of the width of the parent element, but any borders and padding will make the element even wider.

- margin values sometimes collapse with an adjacent element's margin, taking the maximum of the margins between them rather than the combination of both. The rules around this can be somewhat complex, and MDN has a document describing them: [深入理解 CSS 外边距折叠（Margin Collapse）](https://segmentfault.com/a/1190000011524464) [外边距重叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
- margin and explicit width/height don't work on inline content
- margin is not applicable to table cells
- 在默认的水平文档流方向下，CSS margin 和 padding 属性的垂直方向的百分比值都是相对于父元素宽度计算的。

## LAYOUT

Elements are usually laid out in the document in the order that they appear in the markup. The display property controls how an element and/or its children are laid out. You can read about display in more detail at [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display).

- `display: inline` allows content to flow kind of like text and to fit with other inline content, sort of like tetris pieces
- `display: block` means the element effectively behaves like a rectangle containing all of its children that grows in height to fit content (`width` is 100% of the parent content box by default). Effectively, line breaks are inserted before and after the element.
- `display: inline-block` is like a mixture of both inline and block. Its contents will be contained within a rectangle, but that rectangle can be laid out as part of inline content.
- `display: flex` and `display: grid` are more advanced layout algorithms for arranging children according to certain rules. These are the bread and butter of building flexible, responsive layouts and are well-worth learning about in more depth. Learning these has been gamified in [Flexbox Froggy](https://flexboxfroggy.com/) and [Grid Garden](https://cssgridgarden.com/).

## DOCUMENT FLOW AND POSITIONING

The `position` property affects how elements are positioned with respect to the flow of the document in combination with positioning properties (`top, left, right, bottom, inset`). `relative`、`absolute`、`fixed` 这三个属性值有一个共同点，都是相对于某个基点的定位，不同之处仅仅在于基点不同。

- `static` 是 `position` 属性的默认值. 每个块级元素占据自己的区块（block），元素与元素之间不产生重叠，这个位置就是元素的默认位置. Statically positioned elements also do not have their own [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context), which means that setting `z-index` will also have no effect. `static` 定位所导致的元素位置，是浏览器自主决定的，所以这时 `top`、`bottom`、`left`、`right` 这四个属性无效.
- `relative` 表示，相对于默认位置（即 `static` 时的位置）进行偏移，即定位基点是元素的默认位置。它必须搭配 `top`、`bottom`、`left`、`right` 这四个属性一起使用，用来指定偏移的方向和距离。
- `absolute` 表示，相对于上级元素（一般是父元素）进行偏移，即定位基点是父元素。它有一个重要的限制条件：定位基点（一般是父元素）不能是 `static` 定位，否则定位基点就会变成整个网页的根元素 `html`。另外，`absolute` 定位也必须搭配 `top`、`bottom`、`left`、`right` 这四个属性一起使用。
- `fixed` 表示，相对于视口（viewport，浏览器窗口）进行偏移，即定位基点是浏览器窗口。这会导致元素的位置不随页面滚动而变化，好像固定在网页上一样。它如果搭配 `top`、`bottom`、`left`、`right` 这四个属性一起使用，表示元素的初始位置是基于视口计算的，否则初始位置就是元素的默认位置。
- `sticky` 跟前面四个属性值都不一样，它会产生动态效果，很像 `relative` 和 `fixed` 的结合：一些时候是 `relative` 定位（定位基点是自身默认位置），另一些时候自动变成 `fixed` 定位（定位基点是视口）。`sticky` 生效的前提是，必须搭配 `top`、`bottom`、`left`、`right` 这四个属性一起使用，**不能省略**，否则等同于 `relative` 定位，不产生"动态固定"的效果。原因是这四个属性用来定义"偏移距离"，浏览器把它当作 `sticky` 的生效门槛。**它的具体规则是**，当页面滚动，父元素开始脱离视口时（即部分不可见），只要与 `sticky` 元素的距离达到生效门槛，`relative` 定位自动切换为 `fixed` 定位；等到父元素完全脱离视口时（即完全不可见），`fixed` 定位自动切换回 `relative` 定位。[position:sticky 简介](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)

## BFC（Block formatting contexts）

BFC 中的元素的布局是不受外界的影响（我们往往利用这个特性来消除浮动元素对其非浮动的兄弟元素和其子元素带来的影响。）并且在一个 BFC 中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。

一个 BFC 是一个 HTML 盒子并且至少满足下列条件中的任何一个：

- float 的值不为 none
- position 的值不为 static 或者 relative
- display 的值为 table-cell, table-caption, inline-block, flex, 或者 inline-flex 中的其中一个
- overflow 的值不为 visible

在一个 BFC 中，两个相邻的块级盒子的垂直外边距会产生折叠。
