---
title: "两种视口的故事(一)"
date: 2023-01-31T09:38:13+08:00
draft: false
categories: [dev]
tags: [dev]
---
原作者: [Peter-Paul Koch](https://www.quirksmode.org/about "https://www.quirksmode.org/about")

原文地址: [www.quirksmode.org/mobile/view…](https://www.quirksmode.org/mobile/viewports.html "https://www.quirksmode.org/mobile/viewports.html")

**在这个小系列中, 我会解释视口以及各种重要元素的宽度是如何计算的, 如 `<html>` 元素, window 和 screen.**

本篇文章讲的是桌面端浏览器, 目的是为同样讨论移动端浏览器做铺垫. 大多数 web 开发者凭直觉理解了大部分关于桌面端的概念. 在移动端也有相同的概念, 但更为复杂, 所以提前讨论这些常用术语会非常有助于理解移动端浏览器.

## 概念：设备像素和 CSS 像素\(device pixels and CSS pixels\)

你需要明白的第一个概念是 CSS 像素及其与设备像素的区别.

设备像素是我们直觉上所理解的像素. 这些像素确切地指出你在使用哪种设备, 其值通常可由 `screen.width/height` 获取.

如果你给某个元素的设置宽度为 `128px`, 并且显示屏宽度为 1024px, 当你把浏览器窗口调到最大, 屏幕上最多能容纳 8 个这样的元素\(大体上是的, 暂时忽略一些微妙的情况\).

但是, 如果用户缩放屏幕, 计算结果会随之变化. 若缩放至 200\%, 1024px 宽的屏幕只能容纳 4 个 128px 宽的元素.

现代浏览器实现缩放只不过是在"拉伸"像素. 也就是说, 不是元素的宽度从 128 变到 256 像素, 而是*实际像素*的尺寸增加了一倍. 形式上, 元素的宽度仍然是 128 个 CSS 像素, 尽管它恰好占用了 256 个设备像素的空间.

换句话说, 缩放至 200\% 时, 一个 CSS 像素变成一个设备像素的 4 倍.\(长两倍, 宽两倍, 共 4 倍\).

几张图片可以阐明这个概念. 下面有四个像素, 此时缩放比是 100\%. 这个没什么值得注意的; CSS 像素与设备像素完全重叠.

![四个像素, 此时缩放比是 100%. 这个没什么值得注意的; CSS 像素与设备像素完全重叠](https://www.quirksmode.org/mobile/pix/viewport/csspixels_100.gif "四个像素, 此时缩放比是 100%. 这个没什么值得注意的; CSS 像素与设备像素完全重叠")

缩小时, CSS 像素开始收缩, 意味着一个设备像素覆盖了多个 CSS 像素

![缩小时, CSS 像素开始收缩, 意味着一个设备像素覆盖了多个 CSS 像素](https://www.quirksmode.org/mobile/pix/viewport/csspixels_out.gif "缩小时, CSS 像素开始收缩, 意味着一个设备像素覆盖了多个 CSS 像素")

放大时则相反. CSS 像素开始变大, 一个 CSS 像素覆盖了多个设备像素.

![放大时则相反. CSS 像素开始变大, 一个 CSS 像素覆盖了多个设备像素](https://www.quirksmode.org/mobile/pix/viewport/csspixels_in.gif "放大时则相反. CSS 像素开始变大, 一个 CSS 像素覆盖了多个设备像素")

这里的关键点在于 CSS 像素, 正是 CSS 像素决定了样式表的呈现.

### 100\% 缩放

开始举例前, 假设缩放比为 100\%. 100\%缩放更严格的定义是:

> 100\%的缩放比指的是: 一个 CSS 像素等于一个设备像素

100\%缩放这个概念对于后续的解释说明非常有用, 但是你不必在日常工作中过于纠结. 桌面端测试网页时, 通常是 100\%的缩放比例, 但即使用户放大或缩小, CSS 像素的魔力也会确保你的布局保持相同比例.

## 屏幕\(screen\)尺寸

让我们看看一些实用的尺寸. 首先是 `screen.width` 和 `screen.height`. 这俩包含用户屏幕的总宽度和总高度. 这两个尺寸是用设备像素度量的, 因为它是固定的: 是显示器的特性, 而非浏览器.

![screen.width 和 screen.height](https://www.quirksmode.org/mobile/pix/viewport/desktop_screen.jpg "screen.width 和 screen.height")

有意思吧\! 可这些信息有什么用呢\?

基本上没什么用. 用户的显示器对我们并不重要--除非你想用于 web 统计数据库.

## 窗口\(window\)尺寸

相反, 你想知道的是浏览器窗口的内部尺寸. 这个尺寸告诉了你用户还有多少剩余空间可用于 CSS 布局. 其值可由 `window.innerWidth` 和 `window.innerHeight` 获得.

![window.innerWidth 和 window.innerHeight](https://www.quirksmode.org/mobile/pix/viewport/desktop_inner.jpg "window.innerWidth 和 window.innerHeight")

很明显, 窗口的内部宽度是用 CSS 像素表示的.

> 译者注: 可以用鼠标滚轮缩放网页, 然后打印 `window.innerWidth` 和 `window.innerHeight` 查看.

你需要知道你的布局有多少能挤在浏览器的窗口, 也要知道用户放大时, 能挤在窗口的布局会变少.

因此, 如果用户放大了, 窗口可用空间会变少, `window.innerWidth/Height` 相应地也会变小.

\(Opera 是一个例外, `window.innerWidth/Height` 不会随着用户的放大而减小: 因为这两个属性是通过设备像素测量的. 这个问题在桌面端上很烦人, 在手机上更是致命, 我们稍后会看到\)

![如果用户放大了, 窗口可用空间会变少, window.innerWidth/Height 相应地也会变小](https://www.quirksmode.org/mobile/pix/viewport/desktop_inner_zoomed.jpg "如果用户放大了, 窗口可用空间会变少, window.innerWidth/Height 相应地也会变小")

注意: 计算出来的宽高包括了滚动条\(译者注: 垂直水平滚动条\). 因为滚动条是窗口内的一部分.\(主要是历史原因造成的\)

## 滚动偏移距离\(scrolling offset\)

`window.pageXOffset` 和 `window.pageYOffset` 包括文档的水平和垂直滚动距离. 因此你可以获取用户滚动了多少距离.

![window.pageYOffset](https://www.quirksmode.org/mobile/pix/viewport/desktop_page.jpg "window.pageYOffset")

这些属性使用的也是 CSS 像素. 不管缩放状态是什么, 你都能知道文档向上滚动了多少距离.

理论上, 如果用户向上滚动, 然后放大页面, `window.pageX/YOffset` 的值会改变. 然而, 浏览器试图保持同一元素在页面可见部分的顶部, 以保持网页前后一致. 这也并不总是完美的, 但也意味着 `window.pageX/YOffset` 并没有真正的改变: 滚动出窗口的 CSS 像素数仍然保持\(大致\)一样.

![向上滚动, 然后放大页面](https://www.quirksmode.org/mobile/pix/viewport/desktop_page_zoomed.jpg "向上滚动, 然后放大页面")

## 概念: 视口\(viewport\)

在介绍更多 JavaScript 属性之前, 我们得先介绍一下另一个概念: 视口.

视口的作用是约束 `<html>` 元素, 该元素是网页中最顶级的包含块.

这听起来似乎有点模糊, 所以来看一个实例吧. 假设你有一个流式布局, 侧边栏中的其中一个宽度为 `width: 10%`. 此时, 这个侧边栏会随着窗口大小的调整而跟着放大和缩小. 这里的工作原理是什么\?

技术上来说, 该侧边栏的宽度是其父元素宽度的 10\%. 假设是 `<body>`\(且你还没有给它设置宽度\). 因此, 问题就变成了 `<body>` 的宽度是多少\?

通常, 所有块级元素的宽度都是其父元素宽度的 100\%\(有例外, 但暂时先忽略\). 所以 `<body>` 与其父元素 `<html>` 一样宽.

`<html>` 元素的宽度又是多少呢\? 嗨, 它与浏览器窗口一样宽. 这就是为什么 `width: 10%` 的侧边栏占据整个浏览器窗口的 10\%. 所有 web 开发者都知道和运用.

你不知道的是这在理论上是如何实现的. 理论上, `<html>` 元素的宽度受限于视口的宽度. `<html>` 元素的宽度是视口宽度的 100\%.

反过来, 视口完全就是浏览器窗口: 就是这样定义的. 视口不是一个 HTML 结构, 所以 CSS 不会影响它. 桌面端中, 视口有浏览器窗口的宽高. 移动端情况要复杂的多.

## 后果

这会产生一些奇怪的后果. 你能在本网站\(译者注: 指原文所在的网站\)就能看到. 一直滚动到顶部, 然后放大两三次, 结果就是网站内容溢出了浏览器窗口.

然后滚动至右边, 你会看到网站顶部的一蓝色块排列不整齐了.

![网站顶部的一蓝色块排列出错了](https://www.quirksmode.org/mobile/pix/viewport/desktop_htmlbehaviour.jpg "网站顶部的一蓝色块排列出错了")

这是视口的定义所导致的结果. 我给顶部的蓝色块设置了 `width: 100%`. 基于谁的 100\%\? 是 `<html>` 元素, 它与视口同宽, 视口同浏览器窗口同宽.

关键是: 尽管 100\%缩放时工作良好, 视口中我们进行了放大操作, 视口宽度变得比网页的总宽度要小. 在视口内的内容倒没什么, 溢出 `<html>` 元素的部分, 而且该元素有 [overflow:](https://link.juejin.cn?target=https%3A%2F%2Fwww.quirksmode.org%2Fcss%2Foverflow.html "https://www.quirksmode.org/css/overflow.html") `visible`, 所以溢出的内容都会被显示出来.

但是, 蓝色块不会溢出. 毕竟我给它设置了 `width: 100%`, 浏览器把视口的宽度赋给了它. 浏览器才不会在乎宽度是否过于狭窄.

![100% 视口宽度](https://www.quirksmode.org/mobile/pix/viewport/desktop_100percent.jpg "100% 视口宽度")

## 文档宽度

我真正需要知道的是页面内容的总宽度是多少, 包括"突出"的部分. 据我所知, 不可能找到这个值\(嗯, 除非分别计算页面所有元素的宽度和边距, 但注意这很容易出错\).

我开始相信我们需要一个 JavaScript 属性来给出我所说的"文档宽度"\(显然是以 CSS 像素为单位\).

![文档宽度](https://www.quirksmode.org/mobile/pix/viewport/desktop_documentwidth.jpg "文档宽度")

如果确实感到奇怪, 为什么不把这个值暴露给 CSS 呢\? 我想让蓝色块与文档宽度一样宽, 而不是 `<html>` 元素的宽度.\(不过这确实棘手, 如果无法实现, 我也不会感到惊讶\)

浏览器厂商们, 你们怎么看\?

## 视口\(viewport\)尺寸

你可能想知道视口的尺寸. 可以通过 `document.documentElement.clientWidth/Height` 获取.

![document.documentElement.clientWidth/Height](https://www.quirksmode.org/mobile/pix/viewport/desktop_client.jpg "document.documentElement.clientWidth/Height")

如果你了解 DOM, 你知道 `document.documentElement` 实际就是 `<html>` 元素: 即任何 HTML 文档的根元素. 然而, 视口更高一个层次; 可以这么说, 它是包含 `<html>` 元素的元素. 如果给 `<html>` 元素一个宽度, 这可能很重要. \(顺带说一句, 我不推荐这样做, 但这是可行的.\)

在这种情况下, `document.documentElement.clientWidth/Height` 仍然获取的是视口的尺寸, 而不是 `<html>`. \(这有点特殊, 只适用于这个元素的这两个属性. 其他情况是元素的实际宽度.\)

![仍然获取的是视口的尺寸](https://www.quirksmode.org/mobile/pix/viewport/desktop_client_smallpage.jpg "仍然获取的是视口的尺寸")

所以, `document.documentElement.clientWidth/Height` 总是代表视口的尺寸, 而不管 `<html>` 元素的尺寸是多少.

## 两个属性对

视口尺寸不也是从 `window.innerWidth/Height` 获取的吗\? 是, 也不是.

`document.documentElement.clientWidth/Height` 和 `window.innerWidth/Height` 是有区别的: 前者不包括滚动条, 后者包括. 尽管这有点催毛求疵.

有这几个属性是由于历史原因. 那时候, Netscape 只支持 `window.innerWidth/Height`, IE 只支持 `document.documentElement.clientWidth/Height`. 从那时起, 其他浏览器都开始支持 `clientWidth/Height`, 只有 IE 没有支持 `window.innerWidth/Height`.

桌面端可用两个属性对是个小麻烦, 但对于移动端却是福音, 我们会看到.

## `<html>` 元素的尺寸

`clientWidth/Height` 给出了视口在任何情况下的尺寸. 但我们如何获取 `<html>` 元素本身的尺寸呢\? 那就是: `document.documentElement.offsetWidth/Height`.

![document.documentElement.offsetWidth/Height](https://www.quirksmode.org/mobile/pix/viewport/desktop_offset.jpg "document.documentElement.offsetWidth/Height")

这两个属性可访问真实的块级元素 `<html>`, `offsetWidth` 反应的就是设置的 `width`.

![offsetWidth 反应的就是设置的 width](https://www.quirksmode.org/mobile/pix/viewport/desktop_offset_smallpage.jpg "offsetWidth 反应的就是设置的 width")

## 事件坐标

现在来谈谈事件坐标. 触发鼠标事件时, 至少有 5 个属性对可确定事件发生的位置. 我们只讨论其中 3 个.

1. `pageX/Y` 指相对于 `<html>` 元素的 CSS 像素坐标.
2. `clientX/Y` 指相对于视口的 CSS 像素坐标.
3. `screenX/Y` 指相对于屏幕的设备像素坐标.

### [pageX/Y clientX/Y screenX/Y](https://www.quirksmode.org/mobile/viewports.html "https://www.quirksmode.org/mobile/viewports.html")

![pageX/Y](https://www.quirksmode.org/mobile/pix/viewport/desktop_pageXY.jpg "pageX/Y")

90\%的时间都是用 `pageX/Y`; 通常你想知道的是相对于文档的坐标. 另外 10\%会用到 `clientX/Y`. 你永远不必了解相对于屏幕的事件坐标.

## 媒体查询

最后, 谈谈媒体查询. 想法非常简单: 你可以自定义特定的 CSS 规则, 仅当页面宽度大于/等于/小于某个尺寸时这些规则才会生效. 例如:

```css
div.sidebar {
  width: 300px;
}

@media all and (max-width: 400px) {
  // styles assigned when width is smaller than 400px;
  div.sidebar {
    width: 100px;
  }
}
```

现在的侧边栏宽 300px, 媒体查询宽度小于 400px 时, 侧边栏宽度是 100px.

问题是: 测量的是哪个宽度\?

有两种相关的媒体查询: `width/height` 和 `device-width/device-height`.

1. `width/height` 使用与 `documentElement.clientWidth/Height` 相同的值\(视口\). 是 CSS 像素.
2. `device-width/device-height` 使用与 `screen.width/height` 相同的值\(屏幕\). 是设备像素.

![媒体查询](https://www.quirksmode.org/mobile/pix/viewport/desktop_mediaqueries.jpg "媒体查询")

如何选择呢\? 毫无疑问, 当然是 `width`. web 开发者不关注设备宽度, 重要的是浏览器窗口的宽度.

桌面端用 `width`, 而非 `device-width`. 移动端的情况更混乱.

## 总结

我们对桌面端浏览器特点的研究到此结束. [本系列的第二部分](https://www.quirksmode.org/mobile/viewports2.html "https://www.quirksmode.org/mobile/viewports2.html")会将这些概念移植到移动端, 并着重区分了与桌面端的一些重要差异.
