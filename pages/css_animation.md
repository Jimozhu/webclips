---
title: "CSS动画"
date: 2021-07-17T16:48:04+08:00
draft: false
categories: [web]
tags: [dev, web, css]
---

> 原文地址 [juejin.cn](https://juejin.cn/post/6844903845470945294)

通过开发者工具可以发现，`animation`（动画）属性是 8 个属性的简写。

![](https://user-gold-cdn.xitu.io/2019/5/16/16abfcf257199ff1?imageView2/0/w/1280/h/960/ignore-error/1)

这 8 个属性具体含义如下：

| 属性                      | 描述                                                                |
| ------------------------- | ------------------------------------------------------------------- |
| animation-duration        | 指定动画完成一个周期所需要时间，单位秒（s）或毫秒（ms），默认是 0。 |
| animation-timing-function | 指定动画计时函数，即动画的速度曲线，默认是 "ease"。                 |
| animation-delay           | 指定动画延迟时间，即动画何时开始，默认是 0。                        |
| animation-iteration-count | 指定动画播放的次数，默认是 1。                                      |
| animation-direction       | 指定动画播放的方向。默认是 normal。                                 |
| animation-fill-mode       | 指定动画填充模式。默认是 none。                                     |
| animation-play-state      | 指定动画播放状态，正在运行或暂停。默认是 running。                  |
| animation-name            | 指定 @keyframes 动画的名称。                                        |

下面我们一个个仔细说明，各个动画属性都是用来做什么的，以及需要注意的地方。

`CSS` 动画，也称关键帧动画。通过 `@keyframes` 来定义关键帧。

帧的概念，想必大家很清楚，比如电影就是一帧帧图片在播放，利用图像在人脑中短时间停留来形成动态效果。`CSS` 动画也是利用这个原理。不过开发者不需要给出每一帧的定义。只需要定义一些关键的帧即可。因为其余的帧，浏览器会根据计时函数插值计算出来。

比如我们一个 `div` 旋转一圈，只需要定义开始和结束两帧即可：

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

其中，`rotate` 是我给这个动画起的名字，`from` 表示最开始的那一帧，`to` 表示结束时的那一帧。

准确地说，`CSS` 动画用百分比来刻画一个动画周期，`from` 其实是 `0%` 的别称，`to` 是 `100%` 的别称。因此关键帧 `rotate` 等价于：

```css
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

定义好了关键帧后，下来就可以直接用它了：

```css
animation: rotate 2s;
```

或者：

```css
animation-name: rotate;
animation-duration: 2s;
```

通过 `animation-name` 来指定动画使用的关键帧，这个是必须的。用 `JS` 来理解的话，相当于：只有变量声明是不行的，还需要使用。

另外上述代码还指定了动画运行的时间 `animation-duration` 为 `2s`。最后运行效果如下：

![](https://user-gold-cdn.xitu.io/2019/5/16/16abff677d79e1c9?imageslim)

动图的效果不是太明显，方块在旋转时，不是匀速的。因为此时刻画动画速度的属性 `animation-timing-function` 默认值是 `ease`，即先快后慢。

下面动图演示了计时函数属性一些值的情形：

![](https://user-gold-cdn.xitu.io/2019/5/16/16abffea7441f245?imageslim)

`animation-timing-function` 常见值有：`linear`、`ease`、`ease-in`、`ease-out`、`ease-in-out`。这些值其实都是 `cubic-bezier(n,n,n,n)` 的特例。它们被称为贝塞尔曲线。除了开发者工具外，《CSS 揭秘》作者也写了的一个在线调试贝塞尔曲线的网站：[cubic-bezier.com](https://link.juejin.cn/?target=https%3A%2F%2Fcubic-bezier.com%2F%23.17%2C.67%2C.83%2C.67 "https://cubic-bezier.com/#.17,.67,.83,.67")。贝塞尔曲线这个知识点很有用，`canvas` 里也有相应的 `API`。可以展开的点其实比较多，这里只是初步介绍。

需要提一下，计时函数属性另外的一个好玩的值是 `steps` 函数，可以用来实现逐帧动画：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac00b22e3b4c10?imageslim)

计时函数属性介绍到此，后面一律使用值 `linear`，即表示匀速动画。

回到关键帧，我们除了指定开头和结束位置的关键帧（如果不指定 `0%` 和 `100%`，浏览器会自动推断），当然也可以指定任意百分比的帧是什么情况，比如开篇例子的另一种实现：

```css
div {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0ff;
  animation: move 6s linear both;
}

@keyframes move {
  0% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(200px, 0);
  }
  66% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(200px, 0);
  }
}
```

关键帧代码有冗余，可以进一步简写：

```css
@keyframes move {
  0%,
  66% {
    transform: translate(0, 0);
  }
  33%,
  100% {
    transform: translate(200px, 0);
  }
}
```

此时，动画时长改成了 `6s`，动画进行到三分之一处时，让 `div` 位于 `200px`，三分之二回到开始位置，结束时移动到 `200px` 处。

这种是比较直观的实现方式，有很多面试者一般都会想到这种。

注意 `animation: move 6s linear both;` 声明中的 `both`。它是属性 `animation-fill-mode` 的一个值。这个属性容易被忽略，然而却是 `CSS` 动画比较重要的一个属性。直译为动画填充模式，具体说的是什么事情呢？

`@keyframes` 只是定义了动画过程中每一帧的值，然而在动画开始前和动画结束后，元素改处于什么状态呢？`animation-fill-mode` 说的就是这个事情。除了默认值 `none` 外，还有另外 3 个值：

- forwards，表示，动画完成后，元素状态保持为最后一帧的状态。
- backwards，表示，有动画延迟时，动画开始前，元素状态保持为第一帧的状态。
- both，表示上述二者效果都有。

举个例子，`div` 从 `100px` 处移动到 `200px` 处的关键帧定义为：

```css
@keyframes move {
  0% {
    transform: translate(100px, 0);
  }
  100% {
    transform: translate(200px, 0);
  }
}
```

设置填充模式为 `forwards` 时，动画最后停留在 `200px` 处：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac0310ff7ba99a?imageslim)

设置动画延迟 `1s` 后执行，且填充模式为 `backwards` 时，可以看到动画在开始前是处于 `100px` 处，动画结束后回到 `0px` 处：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac035a53f40b08?imageslim)

最后设置填充模式为 `both` 的情形：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac0380ae444be8?imageslim)

动画结束后，保持动画最后一帧的状态，这个太有用了，比如我们可以实现一个进度条：

```css
div {
  height: 10px;
  border: 1px solid;
  background: linear-gradient(#0ff, #0ff);
  background-repeat: no-repeat;
  background-size: 0;
  animation: move 2s linear forwards;
}

@keyframes move {
  100% {
    background-size: 100%;
  }
}
```

效果如下：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac0435e14da43a?imageslim)

上面提到了可以使用 `animation-delay` 设置延迟时间。不为大家注意的是，延迟可以为负数。负延迟表示动画仿佛开始前就已经运行过了那么长时间。

拿上述进度条为例子，原动画用了 `2s` 是从 `0%` 加载到 `100%` 的。如果设置延迟为 `-1s`。这动画会从 `50%` 加载到 `100%`。仿佛已经运行了 `1s` 一样：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac04adc7f87ab6?imageslim)

`CSS` 动画是可以暂停的。属性 `animation-play-state` 表示动画播放状态，默认值 `running` 表示播放， `paused` 表示暂停：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac050679097040?imageslim)

`animation-play-state` 这个属性非常好用，它可以与负延迟一起实现特殊的效果，比如进度条插件：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac05cf7d085fe6?imageslim)

目前为止还有两个属性没有介绍，一个是 `animation-iteration-count` 表示动画播放次数。它很好懂，只有一点要注意，无限播放时使用 `infinite`。另一个是播放方向 `animation-direction`，它的意思说指定动画按照指定顺序来播放 `@keyframes` 定义的关键帧。其值有：

- normal 默认值。
- reverse 表示动画反向播放。
- alternate 表示正向和反向交叉进行。
- alternate-reverse 表示反向和正向交叉进行。

示意如下：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac05f8eb006595?imageslim)

`animation` 属性以及 8 个子属性介绍完了，另外需要说明的是它们与 `background` 及其各子属性一样，是支持多个值的，即在同一个元素上应用多个动画，送给大家一个如意金箍棒：

```css
div {
  margin: 200px;
  height: 20px;
  border: 1px solid;
  animation: rotate 2.5s infinite, color 2s infinite, width 3s infinite;
  animation-direction: normal, normal, alternate;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes color {
  20% {
    background-color: #f91;
  }
  80% {
    background-color: #0ff;
  }
}
@keyframes width {
  0% {
    width: 40%;
  }
  100% {
    width: 70%;
  }
}
```

效果如下：

![](https://user-gold-cdn.xitu.io/2019/5/16/16ac09be6014ea60?imageslim)

本文完。
