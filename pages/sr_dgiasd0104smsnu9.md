---
title: "ES Module 是如何工作的"
date: 2022-08-16T15:33:13+08:00
draft: false
categories: [dev]
tags: [web, js]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7069647533160529950)

# 正文

## 1\. ESM 是什么

ESM（EcmaScript Module） 为 JS 带来了一个正式的、规范化的模块系统，不过这个系统花了近 10 年才实现。直到 2018 年 Firefox 的 60 版本发布，目前所有主流浏览器均已实现 ESM。很多 JS 开发者都知道模块化的实现是很有争议的（在 ESM 发布之前，JS 的模块化是比较多样的），但很少有 JS 开发者真正理解 ESM 是如何工作的。

让我们来看看 ESM 解决了什么问题，以及 ESM 和其他模块规范的区别

### 1.1 模块化能解决什么问题？

我们仔细想想用 JS 编写代码时，完全就是在管理变量，例如下图：给变量赋值，或更改一个变量的值，或者将两个变量的值组合赋值给另一个变量

![ESM01.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/942ac321.webp)

因为大部分的代码都是与变量有关的，因此如何组织这些变量对于编写代码的质量是至关重要的。一次只操作几个变量可以让事情变得更加简单，一种操作可以解决这些问题，就是**作用域**。一个函数中的变量不能访问另一个函数中的变量（函数作用域）

![ESM02.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/8a83da75.webp)

这样，我们在编写一个函数的时候，就不需要考虑其他的函数是否会修改该函数内部的变量的值了。但这种方式也有一个缺点，那就是多个函数之间很难共享变量。如果确实想要共享变量怎么办？一种做法是将需要共享的变量放在这两个作用域之上的作用域（例如全局作用域）上。

还记得 JQuery 吗？我们在编写 JQuery 代码之前，必须要确保 JQuery 在全局作用域中。

![ESM03.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/d80862a3.webp)

这也是一种方法，但这种方法也是有弊端的。必须要保证模块之间的顺序不能错乱，如果你在加载 JQuery 之前写了 JQuery 代码，那么程序就会抛出错误，因为找不到 JQuery。

![ESM04.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/db32d0e6.webp)

这会导致我们在维护一些老代码的时候，需要考虑删除一些旧代码、旧 `<script></script>` 是否会破坏代码。因为这些依赖是隐性的。

还有一个问题就是变量保存在全局作用域中，很有可能会被其他的代码所覆盖。例如某些恶意代码会覆盖全局作用域中的变量导致你的网站无法正常运行。

### 1.2 模块化可以提供什么帮助？

模块化提供了一种更好的方式来组织这些变量和函数，使用模块可以把有意义的变量和函数组合在一起。模块化会将函数和变量保存在模块作用域中，模块中的函数可以在模块作用域中共享变量。

但模块作用域与函数作用域不同的是，模块作用域有一个方法，可以让其他的模块也使用该模块中的变量。它表述了模块中的哪些变量、函数等可以被使用。

当某些内容对其他模块可用时，称之为**导出**。有了导出，其他的模块就可以显式描述自己依赖了该模块的什么变量或者函数。

```javascript
// module A
export const counter = 0;

// module B
import { counter } from "./moduleA";
```

这是一个显式的依赖，如果删除了另一个模块，就会知道哪些模块会出现问题。

使用了模块化，就可以将代码拆解为彼此独立的小模块，可以组合这些小模块，最终就像乐高积木一样组成一个大型的项目。

因此模块化是非常重要的，在之前社区中也提出了很多模块化规范，比较知名的有 CJS（Node.js）、AMD（require.js）、CMD（sea.js）以及目前推出的 ESM。ESM 已经添加到 JS 的规范中，目前 Node 也在适配 ESM 中。

下面让我们来深入了解一下 ESM 是如何工作的。

## 2\. ESM 是如何工作的

当你在使用模块化进行开发时，你将会构建一个依赖关系图，不同依赖项之间的连接来自于导入语句。

这些导入语句让浏览器和 Node 知道需要加载哪些代码，你给它们一个文件的地址，它们去追踪这些文件。

![ESM06.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/9e33acb8.webp)

但是文件本身浏览器是无法直接用的，因此还需要解析这些文件，将它们转换为称之为（Module Record 模块记录）的数据结构。这样，它们就知道文件中发生了什么。

![ESM07.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/a3664f27.webp)

之后，将模块记录转换为模块实例，一个实例兼备两件事情：代码和状态。

代码基本是一组指令的集合，就像是制作菜肴的食谱，但是没有原材料，你无法用食谱做任何事情。

而状态就是原材料。状态是变量在任何时间点的实际值，当然变量只是代指这些保存在内存中的值。

因此，模块实例将 **代码（指令列表）** 和 **状态（所有变量的值）** 组合在一起。

![ESM08.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/df55474e.webp)

所以在加载这个模块的时候，就从一个文件变成了一个模块实例。ESM 在工作过程中，一共需要三大阶段：

1. 构建（Construction）：查找、下载这些文件，并解析为模块记录
2. 实例化（Instantiation）：将导出的变量指向内存中（但是不会填充值），然后将导出和导入指向这个内存，这就是所谓的链接（Linking）。
3. 计算（Evaluation）：运行代码，用实际的值来填充到内存中

![ESM09.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/651bfb49.webp)

我们都说 ES 模块是异步的，你可以把它看作是异步的，因为工作被分为了三个阶段——构建、实例化、计算。这些阶段可以分别完成。

而 CJS 则不是异步的，因此在 CJS 规范中，一个模块和它的依赖关系是一次性构建、实例化和计算的，中间没有任何间断。

但是这些步骤也不一定是异步的，它们可以使用同步的方式完成，这取决于什么在加载这些模块。因为不是所有的事情都由 ESM 规范所控制，其实这项工作分为了两部分，由不同的规范所控制。

- ESM 规范说明应该如何将文件解析为模块记录，以及如何实例化和计算该模块。然而 ESM 规范没有说明如何获得这些文件。
- 而下载文件是由 loader 所控制的，在不同的平台中由不同的规范定义 loader。在浏览器中，由 HTML 规范所定义 loader

![ESM10.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/bac0fc4b.webp)

loader 还控制了模块的加载方式，它调用了 ESM 模块中的内置方法：`ParseModule`、`Module.Instantiate` 和 `Module.Evaluate`。有点像是一个木偶师在用绳索来控制 JS 引擎。

![ESM11.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/0ebea297.webp)

下面，我们来详细看看每一个步骤都发生了什么。

### 2.1 构建

在构建（Construction）阶段，每个模块会发生三件事情：

- 弄清楚从哪里下载模块文件（又称为模块解析）
- 获取文件（从 URL 下载或者从文件系统加载）
- 将文件解析为模块记录

#### 查找文件并获取文件

loader 负责查找文件和下载文件，首先需要找到入口文件，在 HTML 中通过 `<script src=""></script>` 来告诉浏览器文件在哪里。

![ESM12.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/933ce3d3.webp)

但是它是如何找到 `main.js` 依赖的模块的呢？这就是 `import` 语句的用武之地了。import 语句的一部分称为模块说明符，他告诉 loader 在哪里可以找到下一个模块。

![ESM13.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/ab40b0dc.webp)

关于模块说明符需要注意的一点是：它们在浏览器和 Node.js 环境下会有不同的方式处理。每个环境都有自己解析模块说明符的方法。为了做到这一点，它们使用了一种叫做 **模块解析算法** 的东西，这种算法在不同平台之间不太相同。

浏览器只接受 URL 作为模块说明符，它们从 URL 中加载文件。但是在解析文件之前，并不知道文件依赖了哪些模块，因此需要先解析，再下载所依赖的模块文件。

这就意味着需要一层一层的遍历树，解析一个文件，然后找出它的依赖项，然后查找文件并下载。

![ESM14.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/5e261ba1.webp)

此时如果主线程一直在等待下载文件，那么将会线程阻塞。这是因为在浏览器运行中，下载部分需要耗费很长一段时间。

![ESM15.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/53ad7bd0.webp)

这样阻塞主线程就导致程序会运行的很慢。这也是 ESM 将算法分为多个阶段的原因。

这种将算法分割为多个阶段的方法就是 ESM 和 CJS 的主要区别之一。

而 CJS 做的事情不同，因为在文件系统中读取的文件比网络请求要快得多，所以 Node.js 在加载文件时可以阻塞主线程。由于文件已经加载，那么只需要实例化和计算就可以了（在 CJS 中，这两个阶段不是分开的）。这也就意味着，在 CJS 中，返回整个模块之前，需要遍历整棵依赖树，下载、实例化和计算所有的依赖。

![ESM16.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/b68dd004.webp)

在 CJS 中的 `require` 的模块标识符中，可以使用变量。这是因为在寻找下一个模块之前，该模块就已经执行了除了 require 之外的所有代码，因此在执行模块解析的过程中，变量是有值的。

但是在使用 ESM 时，在进行任何计算阶段之前，需要先构建出整个模块图。这就意味着不能在模块标识符中存在任何变量，因为这些变量还没有值。

![ESM17.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/1c7d962d.webp)

但是有时候使用变量在模块标识符中是很有用的，例如，你可能希望在某个阶段或某种条件下再导入某个依赖模块。

为了让 ESM 做到这一点，有一个动态导入的提议。有了它，你就可以用

```javascript
import(`${path}/foo.js`);
```

这种方式来导入一个模块。这种方式的实现原理是，使用 `import()` 加载的任何文件都作为单独依赖图的入口。动态导入的模块就如同导入了一个依赖图的入口文件，该依赖图将会单独处理。

![ESM18.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/4af21f64.webp)

不过要注意一点，**这两个依赖图的将会共享一个模块实例**。这是因为加载程序缓存依赖实例，对于任意全局作用域的每个模块，都将只有一个依赖实例。这意味着引擎的工作量会减少，例如即使有多个模块依赖于同一个模块文件，也只会加载这个模块一次（这是缓存模块的其中一个原因，另外一个原因将会呈现在计算阶段）。

loader 使用一个叫做模块映射（module map）的数据结构来管理缓存。当 loader 去获取一个 URL 的时候，他将该 URL 放在模块映射中，并注明正在获取（fetching）这个文件，然后继续获取下一个文件。

![ESM19.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/1adea716.webp)

如果另一个模块也依赖了同一个文件，会发生什么情况？loader 会在模块映射中去找这个 URL，如果他看到了正在获取这个文件，那么就会跳转到下一个文件。

模块映射不仅仅追踪要获取的文件，而且还充当了模块的缓存，请看下面。

#### 解析（Parsing）

现在已经获取到了文件，还需要将该文件转为一个模块记录（Module Record），这有助于浏览器理解模块之间的不同点。

![ESM20.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/20a4b073.webp)

创建模块记录后，会将模块记录放在模块映射中，下次再看到同一个模块，就可以直接将这个模块映射从模块记录中拉出来。

![ESM21.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/0fa3a0da.webp)

在解析阶段有一个微不足道的细节，但是却有着十分重要的作用。所有的模块都会被作为严格模式 `"use strict"` 来解析。另外作为模块被解析时，关键字 `await` 会被保留在顶层作用域，同时 `this` 是 `undefined`

而如果是普通的 JS 代码被解析时，却有着不同的情况。这种不同的解析方法被称之解析目标（parse goal）。如果用不同的解析方法来解析同一个文件，就会有不同的结果。所以在解析一个文件之前，你得知道这个文件是一个模块（module）。

在浏览器中，是非常简单的，只需要在 `<script>` 中添加 `type="module"` 即可。它告诉浏览器该文件是一个模块，同时该文件的所有导入也都是模块。

![ESM22.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/98791fea.webp)

在 Node 中，需要将文件的后缀改为 `mjs`，或者在 `package.json` 中添加选项 `type: "module"`

最终，一个模块文件被解析为一个或者多个模块记录。

![ESM23.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/15bea277.webp)

下一步是实例化这个模块并将所有实例链接到一起。

### 2.2 实例化

正如前面提到的一样，实例化（Instantiation）将代码与状态结合在一起。状态存在内存中，因此实例化的步骤就是将状态写入内存中。

首先，JS 引擎会创建一个模块环境记录（module environment record），这用来管理模块记录的变量。然后它在内存中为所有的导出（export）找到对应的地址，模块环境记录将会追踪这些地址与导出之间的关联。

此时内存中的这些地址还没有值，只有在计算阶段完毕后才会填充值。这个规范会有一个警告：任何导出的函数声明都会在这个阶段进行初始化，这会让计算阶段运行的更加容易一些。

要实例化模块图，JS 引擎要根据 **深度优先** 算法遍历依赖树。这就意味着，JS 引擎需要找到最底层的模块（即该模块不依赖任何模块），并确定它的导出 export。

![ESM24.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/84ee7178.webp)

引擎将模块下面的所有导出（模块所依赖的所有导出）连接起来，然后他又返回上一级与主模块的导入连接起来。

请注意，导入和导出都指向了内存中的相同位置，首先需要将导出连接起来，保证所有的导入都有对应的导出。

![ESM25.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/cd18a931.webp)

这与 CJS 不同，在 CJS 中，整个导出对象在导出时是被复制了一份，这也就意味着 CJS 中的导出（例如数字）其实是副本。所以若导出模块更改了导出变量的值，导入模块不会受到影响。

![ESM26.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/132c838c.webp)

与 CJS 不同的是，ESM 使用了“活绑定”。两个模块都指向了同一块内存地址，那么导出模块更改了某个值，导入的值也会发生改变。不过值得注意的是，**只有导出模块可以修改这些值，导入模块不能修改导入的值**。

![ESM27.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/bb220be8.webp)

使用这种“活绑定”的优势在于，可以在不运行任何代码的情况下连接所有的模块，有助于分析循环依赖。

在这一阶段的最后，我们已经连接了所有导出/导入变量的实例与内存位置。

现在，我们可以开始计算代码，并将值填充到内存中了。

### 2.3 计算阶段

最后一步是填充内存，JS 引擎通过执行顶级代码（函数之外的代码）来实现这一点。除了会将值填充在内存中之外，还有可能会出现副作用。例如，模块可以调用服务器。

![ESM28.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/352ef5c7.webp)

由于会出现潜在的副作用，所以你可能只想要运行一次模块中的代码。与 JS 中的实例化对象不同，实例化运行多次，得到的结果是一样的。但是模块运行多次，可能获取的结果是不同的（这取决于运行了多少次）。

这也是使用模块映射的一个原因，模块映射通过 URL 缓存模块，这样每个模块只会存在一个模块记录。确保每个模块的代码只会运行一次。

另外，如果是循环依赖，最终会在依赖图中形成一个循环。通常会是一个很长的循环，为了解释这个问题，以一个短的循环作为例子：

![ESM29.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/a7f7b56d.webp)

让我们来看看在 CJS 中会发生什么，首先主模块执行到 `require` 语句，然后它会去加载 `counter` 模块。

![ESM30.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/91b1bfe7.webp)

然而，`counter` 模块尝试从主模块中导入 `message`，但是由于主模块还没有运行代码，因此将会返回 `undefined`。JS 引擎将从局部变量分配内存空间，并将这个值赋值为 `undefined`

代码将会运行到 `counter` 模块结束，我们来看看是否会获得 `message` 的正确值。我们来设置一个定时器，然后在主模块中继续执行。

![ESM31.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_dgiasd0104smsnu9/bc641907.webp)

`message` 将会初始化并添加到内存中，但是由于 `main` 和 `counter` 这两者没有联系，因此 `main` 模块导入的 `message` 仍然是 `undefined`。

如果使用“活绑定”，在定时器结束后，`main` 模块中的 `message` 的值就是正确的。

支持这种循环时设计 ESM 的一个重要原理，正式因为三种阶段的设计让这种场景处理起来也游刃有余。

# 结束

由于 ESM 被提出，JS 终于有了官方的模块化实现了，其他的模块化规范也会慢慢推出历史舞台。目前 Node 已经在逐步兼容 ESM 中。未来，ESM 的发展将会越来越好。
