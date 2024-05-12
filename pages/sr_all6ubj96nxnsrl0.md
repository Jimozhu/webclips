---
title: "你知道 WebAssembly 吗？"
date: 2023-01-31T23:22:07+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7194623444749647929)

# 走进 WebAssembly

## 为什么要说 WebAssembly 呢

其实对于我而言，之前有了解过 WebAssembly，知道他很强大，但是没有实际的使用过。偶然间在调研和使用 ffmpeg 的过程中，看到了很多浏览器端的方案，都是使用了 WebAssembly，原来已经有很多实际的应用真的在使用它，那么它是不是 web 的未来呢？这篇文章主要就是带大家走进 WebAssembly，网上有很多类似的文章，但对于大多数的前端同学来说可能有难以理解的地方，所以本次文章尽量用通俗易懂的方式带大家了解 WebAssembly。

## WebAssembly 是什么

**官方的解释**： WebAssembly/wasm WebAssembly 或者 wasm 是一个可移植、体积小、加载快并且兼容 Web 的全新格式，是由主流浏览器厂商组成的 W3C 社区团体制定的一个新的规范。

**我们来通俗的解释**： WebAssembly 能够把非 JavaScript 代码运行在浏览器中，这些代码可以是 C、C++、Rust 等等。

## WebAssembly 如何与 Web 兼容的

WebAssembly 提供了一种在网络平台以接近本地速度的方式运行多种语言编写的代码的方式。

![WebAssembly 原理](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/fc9dc037.webp)

Web 平台可以看成有两个部分：

> VM，用于运行 Web 应用代码，例如 JS 引擎运行 JS 代码
>
> Web API，例如 DOM、CSSOM、WebGL、IndexedDB、Web Audio API

在以前，VM 只能加载 JS 运行，JS 可能足够满足我们的需求，但如今 JS 会有各种各样的原生性能的领域，比如 3D 游戏、VR/AR、计算机视觉、图片/视频编辑等，并且，下载和解析体积比较大的 JS 是很困难的。

随着 WebAssembly 的出现，上述提到的 VM 现在可以加载两种类型的代码执行：JavaScript 和 WebAssembly。

虽然同样运行在浏览器中，但是 WebAssembly 不是用来替代 Javascript 的，他们其实是相辅相成的。WebAssembly 会被编译进你的浏览器，在你的 CPU 上以接近原生的速度运行。你可以直接在 JavaScript 中将它们当作模块来用。也就是说，你可以通过 WebAssembly 来充分利用编译代码的性能，同时保持 JavaScript 的灵活性。 WebAssembly 其实是一种中间格式。

JS 是高层次的语言，灵活且极具表现力，动态类型、不需要编译步骤，并且有强大的生态，非常易于编写 Web 应用。

WebAssembly 是一种低层次、类汇编的语言，使用一种紧凑的二级制格式，能够以近乎原生的性能运行，并提供了低层次的内存模型，是 C++、Rust 等语言的编译目标，使得这类语言编写的代码能够在 Web 上运行。

## WebAssembly 的特性

- **快速、高效、可移植** —— 通过利用常见的硬件能力，WebAssembly 代码在不同平台上能够以接近本地速度运行。
- **可读、可调试** —— WebAssembly 是一门低阶语言，但是它有确实有一种人类可读的文本格式（其标准即将得到最终版本），这允许通过手工来写代码，看代码以及调试代码。
- **保持安全** —— WebAssembly 被限制运行在一个安全的沙箱执行环境中。像其他网络代码一样，它遵循浏览器的同源策略和授权策略。
- **不破坏网络** —— WebAssembly 的设计原则是与其他网络技术和谐共处并保持向后兼容。

## WebAssembly 和 JavaScript

我们先来看下 WebAssembly 在浏览器中的位置：

![WebAssembly 在浏览器中的位置](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/480321d4.webp)

- WebAssembly 和 JavaScript 在同一个层次执行，也就是 JS Engine
- 和 JavaScript 一样，能够操作 WebAPI

根据上图，我们先来看下 JavaScript 在 Web 中被解析执行的过程： ![js 在 web 中的工作](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/3ab4e9eb.webp) 每个图形大概的表示每个阶段消耗的时间，JS 在 Web 中主要经过了这些过程

- 解析（parse）、编译 + 优化（compile + optimize）、重新优化（re-optimize）、执行（execute）、垃圾回收（garbage collection）

我们再来看下 WebAssembly 在 Web 中被解析执行的过程： ![wasm 工作过程](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/9657bb3d.webp)

- 解码（parse）、编译 + 优化（compile + optimize）、执行（execute）

因为 Wasm 的特性和它特殊的格式，在很多情况下，Wasm 比 Javascript 要更快

- 获取 Wasm 花费的时间更少，因为它比 JavaScript 更紧凑，特有的二进制格式有效地减小了包体积，进一步提升了浏览器的加载速度。
- 解码 Wasm 花费的时间更少。
- 编译和优化，因为 Wasm 更接近机器代码。
- 不需要重新优化，因为 Wasm 内置了类型和其他信息，因此 JS 引擎不需要去推测它。
- 执行通常需要更少的时间，因为 Wasm 的指令集更适合机器。
- 由于内存是手动管理的，因此不需要垃圾收集。

## WebAssembly 的使用

**WebAssembly 编写和使用过程:** ![WASM 使用过程](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/da93df7d.webp)

- 各种语言当前有分别对应的不同编译工具，能够将代码编译为 wasm 格式的文件，如果所对应的需求所使用的 wasm 是比较常见的库，比如 ffmpeg，那么可以在 github 上找到很多已经编译好的 wasm 文件。
- 有文件后，可以通过 fetch 或者 等方式获取 wasm 文件内容，并得到一份 ArrayBuffer。
- 将得到的 ArrayBuffer 编译为浏览器可执行的模块，并实例化
- 到这里就可以调用从 Wasm 模块内导出的方法了

下面我们具体看下每一步中的实际例子：

**1\. 首先需要配置编译 WASM 所需要的环境,你首先需要先编译 LLVM，这是运行后续工具的先决条件。**

- Git。
- CMake
- 系统编译工具。Linux 上，安装 GCC。OS X 上，安装 Xcode。Windows 上安装 Visual Studio 2015 Community with Update 3 或更新版本。
- Python 2.7.x，在 Linux 和 OS X 上，很可能已经装好了。看这里。

**2\. 接下来，您需要通过源码自己编译一个 Emscripten。运行下列命令来自动化地使用 Emscripten SDK。\(因为下面用 c 举例，所以使用 c 语言的 Wasm 编译工具 Emscripten\)。**

安装程序会设置所有 Emscripten 运行所需要的环境变量。

```bash
git clone https://github.com/juj/emsdk.git
cd emsdk

# 在 Linux 或者 Mac macOS 上
./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
./emsdk activate --global --build=Release sdk-incoming-64bit binaryen-master-64bit
# 如果在你的 macos 上获得以下错误
Error: No tool or SDK found by name 'sdk-incoming-64bit'
# 请执行
./emsdk install latest
# 按照提示配置环境变量即可
./emsdk activate latest


# 在 Windows 上
emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
emsdk activate --global --build=Release sdk-incoming-64bit binaryen-master-64bit

# 注意：Windows 版本的 Visual Studio 2017 已经被支持，但需要在 emsdk install 需要追加 --vs2017 参数。
```

**3\. 编写 C 代码（这里用 C 举例）**

```c
#include <stdio.h>

int main(int argc, char ** argv) {
  printf("Hello World\n");
}
```

**4\. 转到一个已经配置过 Emscripten 编译环境的终端窗口中，进入刚刚保存 hello.c 文件的文件夹中，然后运行下列命令：**

```ini
emcc hello.c -s WASM=1 -o hello.html
```

**5\. 经过上面步骤就可以得到 .wasm 文件，下面我们使用 fetch 来加载和运行 wasm，我们先来看一下代码。**

```javascript
function fetchAndInstantiate(url, importObject) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, importObject))
    .then((results) => results.instance);
}
```

- 首先我们使用 fetch 函数来获取了 wasm 文件内容，函数返回了 response 对象
- 我们使用 arrayBuffer 函数把 response 转换为带类型数组
- 最后使用 WebAssembly.instantiate 函数来进一步编译和实例化数组。

> WebAssembly 对象是原生提供的包含了所有 WebAssembly 相关功能的命名空间 其中 WebAssembly.Instance 对象是一个有状态的、可执行的模块的实例。实例对象包含所有的能够从 JavaScript 调用到 WebAssembly 代码的导出的 WebAssembly 函数。[MDN WebAssembly API 参考](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWebAssembly "https://developer.mozilla.org/zh-CN/docs/WebAssembly") ![WebAssembly 对象](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/a3a1532a.webp)

**6\. 我们可以使用上面的函数来运行我们自己的 wasm 文件。**

```javascript
fetchAndInstantiate("myModule.wasm", importObject).then((instance) => {
  // 调用导出函数：
  instance.exports.exported_func();

  // 或者获取导出内存的缓存内容：
  const i32 = new Uint32Array(instance.exports.memory.buffer);

  // 或者获取导出表格中的元素：
  const table = instance.exports.table;
  console.log(table.get(0)());
});
```

总结一下上面的内容，其实就是两种语言之间以 wasm 为桥梁进行了一次通信： ![转换过程](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/b89694ef.webp)

上面的整个步骤就是我们从环境搭建到最后使用 wasm 文件的流程，当前你所使用的语言可能不同，所使用的编译工具自然也不同。并且以上只是最简单的使用方式，如果考虑到性能、优化等问题，还有很深的内容值得探讨。

## WebAssembly 的应用

> [figma \- 基于浏览器的多人实时协作 UI 设计工具](https://www.figma.com/ "https://www.figma.com/")

> [Google Earth — 支持各大浏览器的 3D 地图，而且运行流畅](https://earth.google.com/web/ "https://earth.google.com/web/")

## WebAssembly 的兼容性

可以看到的是，很多现代浏览器对于 WebAssembly 的支持越来越好，未来的趋势对于 Webassembly 来说是向好的 ![兼容性](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_all6ubj96nxnsrl0/a5316a04.webp)

## 总结

当前  WebAssembly 大多数被用在对原生能力有很高要求的地方，或者是将一些应用程序移植到 Web，但是 WebAssembly 并不仅仅局限在浏览器，它还被应用在使代码跨平台、跨设备工作。

WebAssembly 到底是不是 web 的未来？现在来看的话，它还在发展阶段，首先要解决的问题其实就是各浏览器的兼容性，其次就是性能问题。我认为它并不是用来取代 JS 的，但是极有可能演变为 ES6 之后 Web 的新拐点。

## 参考文献

[WASM 中文网](https://www.wasm.com.cn/ "https://www.wasm.com.cn/")

[MDN WebAssembly 概念](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Concepts "https://developer.mozilla.org/zh-CN/docs/WebAssembly/Concepts")

[W3C Web 中文兴趣组 · WebAssembly 线上研讨会 2020 年 8 月 29 日](https://www.w3.org/2020/08/29-chinese-web-wasm.minutes.html "https://www.w3.org/2020/08/29-chinese-web-wasm.minutes.html")

[记一次完整 C++ 项目编译成 WebAssembly 的实践](https://developer.aliyun.com/article/740902 "https://developer.aliyun.com/article/740902")
