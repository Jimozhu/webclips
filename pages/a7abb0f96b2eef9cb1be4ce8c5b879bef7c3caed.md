---
title: "译-CSS-Animations-与-CSS-Transitions"
date: 2023-11-01 10:03:01
categories: [other]
tags: []
origin_url: https://juejin.cn/post/7295954109404004403
---
> 本文译者为 360 奇舞团前端开发工程师  
> 原文标题：CSS Animations Versus CSS Transitions  
> 原文作者：Kirupa Chinnathambi  
> 原文出处：《Creating Web Animations: Bringing Your UIs to Life》

在 CSS 中有两种设置动画的方式即 `CSS animations` 和 `CSS transitions`。它们看上去有些相似，但了解后会发现他们有很大不同。接下来，我们将探讨两者之间的异同，以及什么情况下更适合选择哪一种。

相同点
---

正如刚才提到的，`animations` 和 `transitions` 咋看之下非常相似，它们的共同点有：

*   都指定了要监听的 CSS 属性
*   都可以通过设置 timing functions 来控制从一个属性值过渡到另一个属性值的速率
*   都可以通过设置 duration 来控制动画过渡所需的时间
*   都可以通过代码监听动画事件，然后进一步添加想要的动画效果
*   CSS 属性变化都是很直观的

除此之外，`animations` 和 `transitions` 还有各自独特的地方。接下来我们会详细地看看这些独特之处，并进行对比分析。

不同点
---

`animations` 和 `transitions` 的不同点表现在动画被触发的方式、设置动画循环、设置动画过渡效果、使用规范以及用 JavaScript 控制这几个方面。让我们分别进行详细探讨。

### 1、触发（Triggering）

`animations` 与 `transitions` 最主要的区别之一是动画被触发的方式。

`transitions` 会在 CSS 属性值发生变化时触发开始。它不关注 CSS 属性值是如何变化的。只要计算的属性值与最初设置的值发生变化，就会启动动画。

例如，一个常见的场景是使用 :hover 伪类来改变 CSS 属性值（如下图）。

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/2edc67f2.webp)

CSS 代码如下所示：

    .circle {
      border-radius: 100px;
      background-color: #DDF0FF;
      border: 10px solid #00CC00; 
    }
    .circle:hover {
      transform: scale(2, 2);
    }
    

通过 `transition` 属性监听 transform 的变化，你可以看到圆形在变大：

    .circle {
      border-radius: 100px;
      background-color: #DDF0FF;
      border: 10px solid #00CC00;
      transition: transform .2s ease-out; 
    }
    .circle:hover {
      transform: scale(2, 2);
    }
    

另一种触发 `transition` 动画的方式是通过 JavaScript 添加删除 CSS 类。当添加删除 CSS 类的时候 CSS 属性值就会发生变化。只要计算出的属性值发生变化，`transition` 监听的属性就会被触发动画。

也可以通过使用 JavaScript 设置内联样式来改变属性值。设置 `transition` 来监听这些属性的变化。要想在点击时改变圆形的大小，你的代码可以这样写:

    var circle = document.querySelector(".circle");
    
    circle.addEventListener("click", changeSize, false);
    
    function changeSize(e) {
      circle.style.transform = "scale(4, 4)"; 
    }
    

`circle.style.transform = "scale(4, 4)"` 这行代码是最有趣的。因为我们已经在 CSS 中设置了 `transition`，所以即使是通过 JavaScript 改变的 transform 属性值，还是能够触发动画。这种通过 JavaScript 改变属性值进而触发动画的方式非常酷。在之后的进阶教程中，你会看到我们会运用这种方式。

另外，想触发动画也可以隐式的设置。当设置 `animation` 后，动画会自动被触发。你可以通过设置 animation-play 的状态值来控制此行为。属性值有 running 和 paused。

### 2、循环

这很好实现，可以通过设置 animation-iteration-count 属性来实现动画的循环。也可以通过设置一个固定数值来设置想要循环的次数。

    animation-iteration-count: 5;
    

如果你只是想让动画无限循环，你也可以这样做:

    animation-iteration-count: infinite;
    

`transition` 没有属性可以用来指定循环播放的次数。当动画被触发后，`transition` 只能播放一次。可以通过 transitionEnd 事件给 `transition` 添加循环效果。相较之下，`animation` 设置动画循环就简单多了。

### 3、定义中间点/关键帧

`animation` 可以通过在动画开始和结束之间创建关键帧（keyframes）的方式来进一步控制 CSS 属性值。

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/89f258d1.webp)

你可以设置任意多的关键帧，当动画播放时，每个关键帧都会反映出指定的属性变化。每个关键帧甚至都可以有自己的定时函数，因此你可以根据需要在关键帧之间定义的 CSS 属性值之间进行有趣的插值！

![](https://note-2019-images.oss-cn-hangzhou.aliyuncs.com/67816912.webp)

`transition` 就只能从初始状态播放到最终状态。不能像 `animation` 那样随意设置关键帧，所以 `transition` 不适合做复杂的动画效果。

### 4、预先指定属性

接下来，我们将讨论在设置 CSS 属性值之间动画过渡效果时， `animation` 和 `transition` 的区别。

通常在使用 `transition` 时。需要将想要被监听变化的 CSS 属性显示的指定出来。

例如，CSS 大概会是这样：

    #mainContent {
      background-color: #CC0000;
      transition: background-color .5s ease-in; 
    }
    #mainContent:hover {
      cursor: pointer;
      background-color: #000000;
      width: 500px; 
    }
    

悬停时，我们想为 background-color 和 width 指定不同的值。但我们的 `transition` 只监听 background-color 的变化。如果我们想让 background-color 和 width 同时具有动画效果，就需要为 width 添加另一个 `transition` 监听。

    #mainContent {
      background-color: #CC0000;
      transition: 
        background-color .5s ease-in, 
        width .5s ease-in; 
    }
    #mainContent:hover {
      cursor: pointer;
      background-color: #000000;
      width: 500px; 
    }
    

你也可以使用 `all` 关键字让 `transition` 监听所有属性值的变化。但出于性能考虑，不应该默认这样做。当然，正如所有关于性能优势或缺陷的说法一样，在相信我的话之前，你应该先看看它是否适用于你的场景。

`animation` 的话，可以在每个关键帧中随心所欲地指定属性：

    @keyframes imageSlide {
      0% {
        transform: translate(-150px, 0);
      }
      20% {
        transform: translate(50px, 0)
        height: 200px; 
      }
      80% {
        transform: translate(200px, 0)
        height: 300px; 
      }
      100% {
        transform: translate(600px, 0)
        background-color: #FFFFFF; 
      } 
    }
    

在这个示例中，包括除 height 与 background-color 以外的任何属性，都会产生平滑的动画，即使没有预先监听这些属性！

### 5、与 JavaScript 的交互

简而言之，如果你想使用 JavaScript 来操纵动画效果，使用 CSS `transition` 是更好地选择。CSS `animation` 在这方面并不擅长，因为使用代码访问和操作 CSS `animation` 非常复杂。

在某些情况下，只在 CSS 中声明一个 `transition` 或 `animation` 就足够了。可以在 CSS 中指定起始值、终止值和任何中间值。然后 `animation` 或 `transition` 就会自动读取这些值并执行相应的动画效果。但有时候，如之前在随机颜色的例子中那样，需要临时更改属性的最终值。这种情况下，就需要使用 JavaScript 了。

提到 JavaScript 与 `transition` 或 `animation` 的结合时，毫无疑问的几乎总会选择使用 `transition` 。在 JavaScript 中使用 `animation` 是可以的......但就像在肉桂挑战赛（一项非常困难的竞吃项目）中获胜一样。这并非不可能实现，但很可能你并不想这么做。造成这种差异的原因与 `transition` 和 `animation` 的工作原理有关。

`animation` 的工作原理很特殊。这是因为 `@keyframes` 规则清楚地列出了动画运行时的路径。在关键帧中定义的每个属性值都会产生对应的动画效果。没有可以更改的余地。在 JavaScript 中更改关键帧需要一系列非常复杂的步骤，其中包括修改 `@keyframes` 样式规则。如果你曾经修改过样式表中的 CSS 属性值，你就会知道这非常不好实现。如果你以前从未这样做过，那绝对值得至少尝试一次......而且只尝试一次。

`transition` 则与 `animation` 的预定义路径相反。`transition` 并不像看起来那样定义的那么好。当所监听的属性发生变化时，`transition` 就会启动。如前所述， `transition` 并不关心所监听的属性如何变化。只要属性值发生了变化，`transition` 动画就会被触发。也就是说，在不涉及预定义起始点和结束点的交互场景中，可以通过在 CSS 中设置 `transition` 属性，并使用 JavaScript 操纵被 `transition` 监听的值，来减轻所有与动画相关的繁琐工作，这样你就可以做很多有趣的事情了。之后我们会讲解更多使用到这种方法的例子。

结论
--

既然已经对 `animation` 和 `transition` 有了全面的了解，你可能已经在什么情况下选择使用哪个有了自己的想法。

我选择他们的原则是这样的：

*   如果我需要的是多个关键帧所带来的灵活性，那么我会选择 `animation` 。
*   如果我需要的是一个简单的起承转合动画，那么我会选择 `transition` 。
*   如果我想让动画自动开始或循环播放，那么我会选择 `animation` 。
*   如果我想使用 JavaScript 来操作动画的属性值，就会选择 `transition` 。

现在，你可以根据实际情况，并结合是否会使用 JavaScript 操作动画，以及根据两者的特性，来选择是使用 `transition` 还是 `animation`。我的建议是使用时要基于他们本身的特性。改变它们的默认特性而付出的艰苦努力值得钦佩，但往往没有必要。
    