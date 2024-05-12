---
title: "都 2021 年了，你怎么还在说 webassembly？"
date: 2021-08-12T22:14:32+08:00
draft: false
categories: [dev]
tags: [dev, web]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/GvknRowW4_n-dtmAr3_OAQ)

## What is webssembly?

首先，按照惯例，科普下啥是 webssembly

- 一种新的、抽象的虚拟机指令集（W3C）标准；
- 四大浏览器已经支持该标准 MVP 版本的所有特性；
- 一种以 `.wasm` 未后缀的二进制格式；
- 可以通过标准的 Web API 接口在浏览器中加载、解析和执行；

## Why is webssembly?

那么，这玩意是为啥而诞生的呢？

那就得从 1995 年说起了，那一年，我刚学会走路，Javascript 诞生了，并且从此一发不可收拾，推动了 web 的迅速发展。如果把 WEB 看作是一辆车，那么 Javascript 就是车子的发动机，随着人们对车子的要求越来越高，Javascript 这发动机的毛病就逐渐体现出来，主要有两点：

- 语法太灵活导致大型项目开发困难（马力不足）
- 性能不能满足一些场景的需要（转速不够，跑的慢）

为了解决这问题，Google 在 2009 年在 V8 中引入了 JIT 技术（Just in Time Compiling），通过各种编译优化直接将 JavaScript 编译成运行在 CPU 上的机器码。JavaScript 的性能提升了 20 - 40 倍。

20 - 40 倍！是不是觉着这时候车子都可以飞起来了，然而，实际并不是这样，因为，JavaScript 原来的执行效率实在太低了。

JIT 技术也有自身的缺陷，V8 会通过类型推断来减少对弱类型变量的拆装箱。但是 JavaScript 是动态类型的，如果我们在编写代码的时候改变变量的类型。这会导致 JIT 的重编译，有时候 V8 的性能提升，还没重编译的开销大。

那该咋办呢？这时候，你可能会说，那我在写代码的时候不改变变量的类型不就好了吗！是的，这个思路不错，并且，有人直接付出行动了，Microsoft 开发了 TypeScript， 通过为 JS 加入静态类型检查来改进 JS 松散的语法，提升代码健壮性。Google 则开发了的 Dart，为浏览器引入新的虚拟机去直接运行 Dart 程序以提升性能；Mozilla 更是研究出了 JavaScript 的子集 asm.js，JavaScript Engine 针对 asm.js 进行性能优化。

但是，好像没有解决根本问题，TypeScript 只是解决了 JS 语法松散的问题，最后还是需要编译成 JS 去运行，对性能并没有提升，Dart 没有主流浏览器支持，arm.js 语法太简单、条件过于苛刻，开发效率低。况且，3 大巨头各玩各的，这怎么能行，违背了地球和平统一的原则！！

所以，咱们的主角，WebAssembly，诞生了！它即高效又安全，即开放又符合浏览器标准。WebAssembly 并不是一门编程语言，而是一份字节码标准，需要使用高级编程语言编译出字节码放到 WebAssembly 的虚拟机中运行（有点像 Java ），目前主流浏览器都已经支持 WebAssembly。

## How to use webssembly?

### Q1: 如何使用 WebAssembly 进行开发？

#### Step1: 高级语言 → 中间码（IR）

首先，我们要将高级语言通过编译器翻译成一种更低级的语言 - 中间码（IR），再经过对应工具链转换，生成对应的 `.wasm` 文件

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/ab9e11e5.png)wasm

目前较为常见的是将 C/C++ 代码或者是 Rust 代码转为 wasm 文件，那么，我们就分别来看看这两种方式是怎么操作的：

####…… Case 1: C to wasm

具体步骤如下：

**Step 1: 环境安装**

1. git
2. CMake, 安装链接：[https://blog.csdn.net/xujiuba/article/details/107234040](https://blog.csdn.net/xujiuba/article/details/107234040)
3. 系统编译工具：Linux 上，安装 GCC。OS X 上，安装 Xcode。Windows 上安装 Visual Studio 2015 Community with Update 3 或更新版本
4. 安装 Python 2.7.x

**Step 2: Emscripten SDK 安装**

1. git clone [https://github.com/emscripten-core/emsdk.git](https://github.com/emscripten-core/emsdk.git)
2. cd emsdk
3. ./emsdk install latest (安装最新版本)
4. ./emsdk activate latest （激活最新版本）
5. source ./emsdk_env.sh （配置环境变量）

**Step 3: 编写 C 代码**

首先，我们来编写一段 c 代码，我们可以看到，我们先是生命了一个主函数，输出了一个 hello word，下面又生命了一个自定义函数，也打印了一段文本：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/3a5a3005.png)wasm

由于 Emscripten 编译器生成的代码只会只会调用 main() 主函数，其他函数会被认为是无效代码而消除，因此需要从 emscripten.h 库中引入 EMSCRIPTEN_KEEPALIVE 修饰该函数，告诉编译器该函数需要被导出。

**Step 4: 执行命令生成 wasm 文件**

```
emcc -o index.html index.c -O3 -s WASM=1 --shell-file html_template/template.html -s NO_EXIT_RUNTIME=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
```

- -s WASM=1：指定要输出. wasm 文件，如果未指定，编译器默认只会生成 asm.js 文件
- -o index.html: 指定编译器生成 html 文件与 js 文件，用于加载生成的 `.wasm` 文件
- -O3: 表示编译优化选项，有 0，1，2，3，s 几个级别，级别越高生成的代码提及越小，反编译难度越高
- `--shell-file`: 指定 html 模版文件
- NO_EXIT_RUNTIME 参数: 为了在 main 函数退出时，运行时不会被关闭
- “EXTRA_EXPORTED_RUNTIME_METHODS=[‘ccall’]”：指定导出的方法挂到 Module 的 ccall 方法中

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/afd7babe.png) wasm

**Step 5: 调用 C 中的方法**

在生成的 index.html 文件中，添加如下代码，执行 anywhere（一个 node 本地服务插件 -- `npm install anywhere -g`），启动一个本地服务，打开 html 页面，点击页面中添加的按钮，便可在控制台中看到 C 中函数被调用了：

```
<button>点我点我</button>  <script type="text/javascript">      document.querySelector('myButton').addEventListener('click', function() {          var result = Module.ccall(              'myFunction', // C代码中的方法名              null, // 函数返回值类型              null, // 参数类型              null // 参数          )      })  </script>
```

##### Case 2: Rust to wasm

**Step 1: 环境安装**

1. 安装 rust、node、npm: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. 配置全局变量: `export PATH=“$PATH:$HOME/.cargo/env"`
3. 安装 wasm 打包工具 wasm-pack: `cargo install wasm-pack`

**Step 2: 初始化一个 Rust 项目**

首先，我们通过命令脚本创建一个 rust 工程:

```
cargo new --lib my-wasm
```

这个工程的结构与我们 webpack 前端工程很像，lib.rs 就是主要逻辑代码存放的地方，cargo.toml 则是类似于我们 package.json 一样的配置文件;

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/cd8c17cd.png)wasm

**Step 3: 修改 Rust 代码**

同样，我们直接开始修改 lib.rs 文件的内容，使用 wasm_bindgen 绑定修饰方法，该方法才会被编译器打包输出，extern 内部包含的代码，就是在定义一些 js 端传递过来的代码，以便在 rs 代码中调用。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/ba20e026.png)

wasm

**Step 4: 修改配置文件**

接下我们修改配置文件，添加上相应的依赖

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/5385bb51.png)wasm

**Step 5: 编译生成产物**

最后一步就是执行命令，将 rust 代码编译生成 wasm 文件:

```
wasm-pack build --target bundler
```

这个命令有两种后缀

- 一个是 bundler 生成的是 npm 包结构，可以直接发布提供他人下载引用；
- 一个是 web 生成的产物可以直接通过相对路径的方式引用。

这命令主要干了一下这些事：

1. 将我们的 rust 代码编译成 WebAssembly
2. 在 WebAssembly 上执行 `wasm_bindgen`，生成一个 js 文件，将 webassembly 文件引入到一个 NPM 可以识别的模块中
3. 创建一个 pkg 目录并将该上一步的 js 文件和 WebAssembly 代码移入其中
4. 读取 Cargo.toml 中的内容并产生等效 package.json 文件
5. 复制 README.md 文件至程序包中

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/fe0238c5.png) wasm

### Q2: 如何在 JS 代码中引用 wasm 文件？

前面说的是如何生成 wasm 文件，接下来就是怎么样去使用 wasm 文件，其实，我们拿到的文件内容后，需要将它转换成 arrayBuffer，再通过原声的 `Webassembly.instance` 方法接收，最后返回的才是我们能阅读的代码

其实很简单，如下图：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/292957b6.png)wasm

那么，在 react 工程中，也那么简单吗？

其实差不多，我们只需要在 webpack 添加相应的 `loader` 即可：

```
yarn add wasm-loader && yarn add node-fetch
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/c53b2cb8.png)wasm

### Q3：JS 与 WebAssembly 如何实现通信？

其实，在实例化 WebAssembly 模块时，需要一个内存对象。您可以创建一个新的 WebAssembly.Memory 并将该对象传递进来。否则，将自动创建一个内存对象并将其附加到实例：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/8e24ec7b.png)wasm![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/86764a82.png)wasm

因为这只是一个 JavaScript 对象，所以这意味着 JavaScript 也可以在该内存的字节中挖掘数据。因此，以这种方式，WebAssembly 和 JavaScript 可以共享内存并来回传递值:

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/0049e07b.png)wasm

WebAssembly 可以在内存中放置一个字符串。它将编码为字节… 然后将这些字节放入数组中

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/1c2d8195.png)wasm

然后它将第一个索引（整数）返回给 JavaScript。因此，JavaScript 可以提取字节并使用它们

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/61d75e20.png)wasm

那么关于共享内存，有以下两个需要关注的问题：

1. 共享内存，那么是否会照成内存泄露？
2. Webassembly 能否访问内存对象外部的空间？

- 对于问题 1，因为内存对象只是一个 JavaScript 对象，所以垃圾回收器会跟踪它本身，当附加了内存对象的 WebAssembly 实例超出范围时，可以对整个内存数组进行垃圾回收。
- 对于问题 2，ArrayBuffer 的边界提供了一个边界，WebAssembly 模块可以直接接触的内存数量受到限制，它可以直接触摸此数组内部的字节，但看不到该数组范围之外的任何内容。

## Who use WebAssembly?

我们再来看业界中两个使用 WebAssembly 成功的较为典型的案例

### Case 1: Squoosh

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/ef3a6c76.png)

wasm

这个网站的主要功能是做一些图像的处理，我们可以在上面上传一张图片，然后可以离线的去进行一些对图像的处理，比如说进行图片压缩、量化或者 smozing 这样的一些处理，我们可以看到，相对来说，我们的一些操作，页面中很快就能展现出处理后的效果

如果仔细去研究这个网站的实现，我们会发现它依赖了很多现有的成熟的库，编译成了 wasm 来使用的。比如说 libimagequant、MozJPEG、webp，这些都是目前业界内对图像处理非常优秀的一些库。

### Case 2: Ebay Barcode scanner

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/dcbdd768.png)wasm

ebay 网页端的扫码功能，在使用了 wasm 技术后，说是得到了 50 倍的性能提升，他们在实现这个 barcode scanner 的时候，也是选用了业界比较有名的 ZBar 这样一个库，将它编译成了 wasm 来使用;

当然，现在并不是所有的浏览器都支持 wasm 的，所以肯定需要一些备用方案或者说是兜底逻辑

而 ebay 他们的做法是采用了竞争的模式，同时起了 3 个线程，每个对应一个 worker，第一个 worker 执行的是 Zbar 对应的 wasm 文件，第二个是他们自研的一个仓库转换成 wasm，然后第三个 worker 执行的是原声的 js，当扫码条形码时，三个 worker 同时运行，哪一个 worker 最先返回结果，就是用这个结果。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/e4048e21.png)wasm

以这种形式，来保证不管是在哪一种版本的浏览器中，在保证兼容性的同时，还能最快的得到结果。

---

最后，总结下，WebAssembly 与 JS 的结合，让 Web 这部车，拥有了超越轿跑的速度。

附：以下是 JS 与 WebAssembly 的性能对比，

相同环境下，分别使用 JS 与 WebAssembly 进行斐波那契数列的运算，记录其耗时，当计算量不大时，JS 所用的时间要略少于 WebAssembly，随着计算量的增加，WebAssembly 的优势逐渐增大：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/4c725143.png)wasm

这是由于，低计算量时，JS 与 WebAssembly 之间的相互调用，需要通过胶水层代码，需要耗费一定的事件，因此无法体现出 WebAssembly 的优势，但随着计算量的增大，胶水层代码在整个计算过程中所耗时比例逐步降低，此时，WebAssembly 的速度优势就体现出来了。

Chrome、Safari 及 Firefox 浏览器中，分别使用 JS 与 WebAssembly 复杂数组快排，记录各自的耗时。不同浏览器中，JS 与 WebAssembly 的运行速度相差较大，但在同一浏览器中 WebAssembly 的计算性能都要优于 JS：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kfhtvkkmvlcindf3/3b1f2fc1.png)wasm

这也体现出了目前三大浏览器对 WebAssembly 的支持情况。

---

参考资料：

- [https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)
- [https://rustwasm.github.io/book/introduction.html](https://rustwasm.github.io/book/introduction.html)
- [https://www.joyent.com/blog/improved-wasm-support-coming-to-node](https://www.joyent.com/blog/improved-wasm-support-coming-to-node)
- [https://github.com/WebAssembly](https://github.com/WebAssembly)
- [https://www.rust-lang.org/what/wasm](https://www.rust-lang.org/what/wasm)
- [https://www.ebayinc.com/stories/blogs/tech/webassembly-at-ebay-a-real-world-use-case/](https://www.ebayinc.com/stories/blogs/tech/webassembly-at-ebay-a-real-world-use-case/)
