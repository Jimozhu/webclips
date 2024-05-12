---
title: "在浏览器中使用 ECMAScript Modules"
date: 2021-03-25T15:36:39+08:00
draft: false
categories: [web]
tags: [dev, web, js]
---
[ECMAScript Modules](https://tc39.es/ecma262/#sec-modules) 简称 ESM，也叫 [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)，是 2015 年 6 月随着 [ES6(ES2015)](https://262.ecma-international.org/6.0/#sec-source-text-module-records) 正式发布的模块化解决方案。

在 ESM 发布之前，社区也有一些模块化加载方案，最主要的有 [CommonJS](https://en.wikipedia.org/wiki/CommonJS)、[AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 两种。CommonJS 用于 服务端 Node.js，AMD 则用于 浏览器 (webpack)，此外还有 [UMD](https://github.com/umdjs/umd)，兼容 CommonJS 和 AMD 规范，并支持传统的全局变量模式。

感兴趣的同学可以了解一下 ESM 的发展历史：[Modules - History & Future](https://gist.github.com/jkrems/769a8cd8806f7f57903b641c74b5f08a)

而 ESM 方案既可以用服务端 ([Deno](https://deno.land/))，也可直接在浏览器使用，完美做到了前后端同构。 ESM 方案主要包括 `export` 和 `import` 两个命令。关于具体的语法讲解可以看阮一峰的《ECMAScript 6 入门》中的介绍：

- [ECMAScript 6 入门 - Module 的语法](https://es6.ruanyifeng.com/#docs/module)
- [ECMAScript 6 入门 - Module 的加载实现](https://es6.ruanyifeng.com/#docs/module-loader)

本文介绍一下 **ECMAScript 6 入门** 中没有提的内容和浏览器模块加载的机制。

- ESM 自动为严格模式 [Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。
- ESM 不支持 HTML 注释语法 `<!-- hello -->`。
- ESM 有模块作用域，所有文件内的声明都在模块作用域内，只能通过 `export` 导出内部变量，如在 ESM 内声明 `var foo = 42`; 不会声明一个全局变量，在该模块外无法通过 `window.foo` 读取。
- ESM 内顶层 `this` 是 `undefined`，而不是 `Window` 对象，可以用 `globalThis` 来代替 `this` 调用 `Window` 对象。
- `import` 和 `export` 只在 ESM 中生效，在传统 Script 中使用会报错。
- ESM 支持 `Top level await`，在传统 Script 中则不支持。

## 加载 ESM

在浏览器中，可以直接使用 `<script>` 标签通过指定 `type` 为 `module` 加载一个 ESM。

```
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

可以识别 `type="module"` 的浏览器会忽略带有 `nomodule` 属性的 `script` 标签，可以通过这种方式为不支持 ESM 的浏览器做降级处理。

如果浏览器支持 ESM，这也意味着浏览器支持其他的 ES6 语法，像 `Promise`，`async-await`，可以通过这种方法减少对代码中 ES6 等高级语法的编译，减少代码打包体积，提升加载速度和 JS 代码的执行速度，提高页面性能，然后对不支持 ESM 的浏览器提供编译后的版本，做降级处理。

## 文件后缀

ESM 文件支持 `.js` 和 `.mjs` 两种文件后缀，在浏览器中后缀并不重要，主要通过 `type` 属性和 `content-type` 是否为 `application/javascript` 来进行判断是否为 js 文件，但是 `.mjs` 不是一个标准的文件扩展，而且可能有部分文件服务器并不能保证能正确识别 `.mjs` 文件的 [MIME type](https://html.spec.whatwg.org/multipage/scripting.html#scriptingLanguages:javascript-mime-type) 为 [text/javascript](https://html.spec.whatwg.org/multipage/indices.html#text/javascript)，导致 `content-type` 不为 `application/javascript`，从而加载失败。所以还是推荐使用 `.js` 作为文件后缀。

## 跨域

ESM 在浏览器中会有 CORS 跨域问题，所有跨域的 ESM 资源加载都需要在资源响应头上添加 `Access-Control-Allow-Origin` 的响应头，而在之前的 js 资源加载上是不需要的。

## 加载机制

默认的 `<script>` 标签加载资源会阻塞 HTML 解析，可以通过 `defer` 和 `async` 属性来让 JS 脚本异步加载。

> `defer` 与 `async` 的区别是：`defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；`async` 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，`defer` 是 “渲染完再执行”，`async` 是 “下载完就执行”。另外，如果有多个 `defer` 脚本，会按照它们在页面出现的顺序加载，而多个 `async` 脚本是不能保证加载顺序的。

而 ESM 默认是通过 `defer` 的方式加载的，所以是不需要在 `script` 标签上加 `defer` 属性的。

图解：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/4f213729.png)

ES6 并没有描述[模块加载](https://262.ecma-international.org/6.0/#sec-hostresolveimportedmodule)的细节，完全依赖 JS 引擎实现。

当 JS 引擎执行一个 ESM，大概有以下 4 个步骤：

1. **Parsing**: 读取模块的代码并检查语法错误。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/ccaf4f6c.png)

2. **Loading**: 递归的加载所有导入的模块，建立 module graph。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/8ac228e2.png)

3. **Linking**: 对于每个新加载的模块，都会创建一个模块实例 `Module.Instantiate`，并使用该模块中所有导出的内容的 **内存地址** 对 `import` 进行映射。
4. **Run time**: 最后，运行每个新加载模块的主体代码，此时，`import` 已经处理完成了。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/f5bd070f.png)

所以，所有模块的静态依赖在该模块代码执行前都必须下载、解析并进行 Linking。 一个应用程序可能有几百个依赖，如果某个依赖加载出错了，则不会运行任何代码。

> Chrome67+, Released May 21, 2019

在 static `import` 中，代码实际运行前会递归的下载所有的依赖，建立 module graph，并执行依赖的代码。有时，我们需要按需加载，而不是提前加载所有代码，这时候就需要 [Dynamic import()](https://v8.dev/features/dynamic-import)。

可以通过 `import()` 函数，传入一个模块路径作为参数，返回一个包含 ESM `export` 对象的 `Promise`，

```
<script type="module">
  const moduleSpecifier = './05/lib.js';
  import(moduleSpecifier)
    .then(({ repeat, shout }) => {
      repeat('hello');    // → 'hello hello'
      shout('Dynamic import in action');    // → 'DYNAMIC IMPORT IN ACTION!'
    });
</script
```

Dynamic import 会建立一个新的 module graph，和原来的分开进行单独处理。单数对相同的模块还是会进行实例共享，这是因为 loading 会对模块进行缓存。对于每一个链接相同的模块，都只有一个模块实例

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/5c10ee96.png)

> Chrome89+，Released Mar 1，2021

[Top-level await](https://v8.dev/features/top-level-await) 是 ESM 提供的功能，可以直接在模块顶层使用 `await` 关键字，将整个模块当作一个大型的异步函数。如果是一个子模块，那么可以在父模块执行前先执行子模块的代码，但不会阻止同级模块的加载。

```
<script type="module">
  const moduleSpecifier = './lib.js';
  const { repeat, shout } = await import(moduleSpecifier);
  repeat('hello');    // → 'hello hello'
  shout('Dynamic import in action');    // → 'DYNAMIC IMPORT IN ACTION!'
</script>
```

> Chrome89+，Released Mar 1，202

通过 URL 引入依赖不是很方便，如果想通过 pacakge name 引入，可以使用 Import Maps 来实现。

```
<script type="importmap">
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
```

Import Maps 定义了模块导入名称的映射，可以使用 bare 导入。

除了直接制定 package name 外，还可以当作 path resolve：

```
{
  "imports": {
    "lodash": "/node_modules/lodash/lodash.js",
    "lodash/": "/node_modules/lodash/"
  }
}
```

可以使用如下方法导入文件下的 js 文件：

```
// You can directly import lodash
import _lodash from "lodash";
// or import a specific moodule
import _shuffle from "lodash/shuffle.js";
```

> Chrome64+，Released Jan 24，2018

在代码中可以通过 `import.meta` 获取前端模块的元数据，获取的元数据内容 ECMAScript 中没有制定标准，所以取决于具体的 runtime 运行环境。在浏览器一般会有 `import.meta.url`，表示模块的资源链接。

> 数据来源：[v8.dev/features/mo…](https://v8.dev/features/modules#performance)

使用 ESM，完全可以不借助于 webpack/parcel/rollup 等打包工具直接进行网站开发，但目前只有少部分场景适用：

- 本地开发
- 依赖少于 100 个，依赖层级比较浅（最深不超过 5 层）的比较简单的页面。

加载 300 个模块的网页性能分析发现打包过后的性能比未打包的更好：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/es6_modules/1a3def51.png)

可以发现，打包优化后的代码性能更好，这是因为 static `import/export` 是可以进行静态分析的，所以可以通过 [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) 来优化无用代码，因此 static `import/export` 不仅仅是语法，也是非常重要的工具能力。

所以，在生产环节还是需要进行打包优化，可以减少代码体积，提升加载速度，Vite 也是采用 [rollup.js](https://rollupjs.org/) 进行生产环境打包。

可以使用 `<link rel="modulepreload">` 进行 ESM 的预加载。通过这种方式，浏览器可以预加载甚至预编译 ESM 及其依赖。

```
<link rel="modulepreload" href="lib.mjs">
<link rel="modulepreload" href="main.mjs">
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

这对依赖比较多，层级比较深的应用很有帮助。但是如果不使用 rel="modulepreload"，那么浏览器需要实际加载 ESM 的时候通过多个 HTTP 请求构建 module graph，如果把所有的模块都进行预加载，可以大大节省依赖加载的时间。

通过 [HTTP/2 或 HTTP/3](https://blog.fundebug.com/2019/03/07/understand-http2-and-http3/) 的[多路复用](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/14)，可以同时传输多个请求和响应消息，对于 模块树 加载有很高的性能提升。

其实多文件加载在首次加载有劣势，在多次访问的时候也有优势，当我们有 100 个模块时，有一个模块改了东西，打包成一个文件的话，整个文件浏览器都需要重新下载，不能被缓存。而使用 ESM，模块就可以单独的压缩上线，而不影响其他没有修改的模块。

- [JavaScript modules - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Using JavaScript modules on the web](https://developers.google.com/web/fundamentals/primers/modules#mjs), by Addy Osmani and Mathias Bynens
- [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/), Hacks blog post by Lin Clark
- [ES6 in Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/), Hacks blog post by Jason Orendorff
- Axel Rauschmayer's book [Exploring JS: Modules](http://exploringjs.com/es6/ch_modules.html)
- [Using ES modules in browsers with import-maps](https://blog.logrocket.com/es-modules-in-browsers-with-import-maps/), by Kasra Khosravi
- [ES6 入门教程: Module 的语法](https://es6.ruanyifeng.com/#docs/module), by 阮一峰
