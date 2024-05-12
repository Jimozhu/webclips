---
title: "前端JavaScript反调试和反反调试"
date: 2022-08-22T09:12:13+08:00
draft: false
categories: [web]
tags: [js]
---
> 原文地址 [www.zhangbj.com](https://www.zhangbj.com/p/585.html)

## 反调试

前端代码可以在开发者工具中看到，还可以查看网络请求的数据等。限制别人打开开发者工具或者让别人用不了开发者工具就达到反调试的目的了。

## 常规方法

监听是否打开开发者工具，若打开，则直接调用 `JavaScript` 的 `window.close()` 方法关闭网页。

### 方法一

监听 `F12` 按键、监听 `Ctrl+Shift+I`（Windows 系统）组合键、监听右键菜单。监听 `Ctrl+s` 是为了禁止保存至本地，避免被 `Overrides`。

```javascript
<script>

    //监听F12、Ctrl+Shift+i、Ctrl+s
    document.onkeydown = function (event) {
        if (event.key === "F12") {
            window.close();
            window.location = "about:blank";
        } else if (event.ctrlKey && event.shiftKey && event.key === "I") {//此处I必须大写
            window.close();
            window.location = "about:blank";
        } else if (event.ctrlKey && event.key === "s") {//此处s必须小写
            event.preventDefault();
            window.close();
            window.location = "about:blank";
        }

    };

    //监听右键菜单
    document.oncontextmenu = function () {
        window.close();
        window.location = "about:blank";
    };

</script>
```

### 方法二

监听窗口大小变化。

```javascript
<script>

    var h = window.innerHeight, w = window.innerWidth;

    window.onresize = function () {
        if (h !== window.innerHeight || w !== window.innerWidth) {
            window.close();
            window.location = "about:blank";
        }
    }

</script>
```

### 方法三

利用 `Console.log`。

```javascript
<script>

    //控制台打开的时候回调方法
    function consoleOpenCallback(){
        window.close();
        window.location = "about:blank";
        return "";
    }


    //立即运行函数，用来检测控制台是否打开
    !function () {
        // 创建一个对象
        let foo = /./;
        // 将其打印到控制台上，实际上是一个指针
        console.log(foo);
        // 要在第一次打印完之后再重写toString方法
        foo.toString = consoleOpenCallback;
    }()

</script>
```

## 使用 debugger

第一种：`constructor`

```javascript
<script>

    function consoleOpenCallback() {
        document.body.innerHTML='年轻人，不要太好奇';
        window.close();
        window.location = "about:blank";
    }

    setInterval(function () {
        const before = new Date();
        (function(){}).constructor("debugger")();
        // debugger;
        const after = new Date();
        const cost = after.getTime() - before.getTime();
        if (cost > 100) {
            consoleOpenCallback();
        }
    }, 1000);

</script>
```

第二种：`Function`

```javascript
<script>
    setInterval(function () {
        const before = new Date();
        (function (a) {
            return (function (a) {
                return (Function('Function(arguments[0]+"' + a + '")()'))
            })(a)
        })('bugger')('de');

        // Function('debugger')();

        // debugger;
        const after = new Date();
        const cost = after.getTime() - before.getTime();
        if (cost > 100) {
            consoleOpenCallback2();
        }

    }, 1000);
</script>
```

## 第三方库

有大佬写了一个库专门用来判断是否打开了开发者工具，可供参考使用：

[https://github.com/sindresorhus/devtools-detect](https://github.com/sindresorhus/devtools-detect)

## 文章代码

[https://github.com/fendoudebb/learning/blob/master/javascript/debugger.html](https://github.com/fendoudebb/learning/blob/master/javascript/debugger.html)

## 参考

[https://x-c3ll.github.io/posts/javascript-antidebugging](https://x-c3ll.github.io/posts/javascript-antidebugging/)

## 反反调试 - 常规方法

前文所提到的几个反调试方法，除 `debugger` 方式外，均判断是否打开开发者工具。破解的方式也很简单，基本只需两步就可以搞定。

1. 将开发者工具以独立窗口形式打开。
2. 打开开发者工具后再打开网址。

## 反反调试 - debugger 方法

若使用了 `debugger` 方法防反调试，会出现无限 `debugger`，有两种破解方法。

```javascript
<script>

    function consoleOpenCallback2() {
        document.body.innerHTML='年轻人，不要太好奇';
        window.close();
        window.location = "about:blank";
    }

    setInterval(function () {
        const before = new Date();
        (function(){}).constructor("debugger")();
        // debugger;
        const after = new Date();
        const cost = after.getTime() - before.getTime();
        if (cost > 100) {
            consoleOpenCallback2();
        }
    }, 1000);

</script>
```

### 直接使用 debugger 指令

使用了间隔 `setInterval` 轮询，直接用 `debugger` 指令，则可以在 `Chrome` 找到对应行（格式化后），右键行号，选择 `Never pause here` 即可。

### 使用了 constructor 构造 debugger

使用了匿名函数构造 `debugger` 指令，断点信息显示如下：

```javascript
(function anonymous() {
  debugger;
});
```

只需在 `console` 中输入以下代码后，点击 `F8`（Resume script execution）回复 `js` 代码执行即可（直接点击小的蓝色放行按钮即可）。

```javascript
Function.prototype.constructor = function () {};
```

### 使用了 Function 构造 debugger

使用了 `Function` 构造 `debugger`，断点信息显示如下：

```javascript
(function anonymous() {
  Function(arguments[0] + "bugger")();
});
```

只需在 `console` 中输入以下代码：

```
Function = function () {}
```

## 说明

对于一些混淆过的 `js`，不能直接看到，其实就是通过构造函数构造的 `debugger` 指令，下图是某网站的构建方式。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/79668239.png)

> 某些网站的前端代码反调试，打开控制台要看 Network，控制台不断的 debugger 方案一：右击 debugger 行数位置，点击 addconditionalbreakpoint.. 添加 false，

某些网站的前端代码反调试，打开控制台要看 `Network`，控制台不断的 `debugger`

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/a42f4acb.webp)

## 方案一：右击 `debugger` 行数位置，点击 `add conditional breakpoint..`

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/bab35145.webp)

添加 `false`，然后按回撤， 刷新网页，发现成功跳过无限 `debugger`

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/46a91ebf.webp)

## 方案二：文件替换

1. 在 js 文件右击， 然后点击 `save as ...`, 把 js 文件保存到本地。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/c3b35e61.webp)

2. 修改保存到本地的 js 文件，将 `debugger` 成 `false` 保存 js 文件

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/efe752d6.webp)

3. 在浏览器 `Soures` 获取需要替换的 js 文件 `url`

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/6be23079.webp)

4. 使用 fiddler 动态拦截替换 js，刷新网页即可

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/accf213b.webp)

## 方案三：代码注入，注入代码到 js 文件

```js
//1 .去除无限debugger
Function.prototype.__constructor_back = Function.prototype.constructor;
Function.prototype.constructor = function () {
  if (arguments && typeof arguments[0] === "string") {
    //alert("new function: "+ arguments[0]);
    if ("debugger" === arguments[0]) {
      //arguments[0]="console.log(\"anti debugger\");";
      //arguments[0]=";";
      return;
    }
  }
  return Function.prototype.__constructor_back.apply(this, arguments);
};
```

## 方案四：手动替换

我们先构造一个空方法

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/0f33592f.png)

将目标网站的方法偷梁换柱

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/f22d2f3f.png)

由于网站代码强混淆，所以函数名称会不一样。下面放个 GIF 图
完美解决 但是注意不要刷新，页面刷新后需要重新替换。

## 方案五：禁用浏览器断点

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_89e25z4oxpbjahff/a69a58ee.png)
点击图中按钮，之后将不会再命中任何断点。这种方法虽然可以防止无限循环命中 debugger 断点，但是也存在很大的缺陷，因为对于其他代码，我们还是需要断点调试功能的。所以这个方法仅限于静态分析。

## 函数重定义

最基本、最常用的代码反调试技术，一般代码调试很可能会用到 `console.log` 来输出调试结果，
如果对此函数进行重定义，则可以修改调试输出的结果

```js
window["console"]["log"] = () => {};
// 执行了一个空函数，所以无任何输出
console.log("Great");
```

## 断点干扰

`debugger` 函数会在控制台被打开的时候运行，控制台关闭后不会产生任何作用，
所以可以在代码中设置一个能够干扰调试的 `debugger` 方法，例如无限循环 `debugger`

```js
setTimeout(function(){while (true) {eval("debugger")
```

## 时间差异

当脚本在 DevTools 等工具环境下执行时，运行速度会非常慢（时间久），所以我们就可以根据运行时间来判断脚本当前是否正在被调试。比如说，我们可以通过测量代码中两个设置点之间的运行时间，然后用这个值作为参考，如果运行时间超过这个值，说明脚本当前在调试器中运行。

```js
set Interval(function(){
  var startTime = performance.now(), check,diff;
  for (check = 0; check < 1000; check++){
    console.log(check);
    console.clear();
  }
  diff = performance.now() - startTime;
  if (diff > 200){
    alert("Debugger detected!");
  }
},500);
```

## DevTools 检测（Chrome）

这项技术利用的是 div 元素中的 id 属性，当 div 元素被发送至控制台（例如 `console.log(div)`）时，浏览器会自动尝试获取其中的元素 `id`。如果代码在调用了 `console.log` 之后又调用了 `getter` 方法，说明控制台当前正在运行。

```js
let div = document.createElement("div");
let loop = setInterval(() => {
  console.log(div);
  console.clear();
});
Object.defineProperty(div, "id", {
  get: () => {
    clearInterval(loop);
    alert("Dev Tools detected!");
  },
});
```

# 参考链接

- [https://www.996station.com/1106](https://www.996station.com/1106)
- [https://www.zhangbj.com/p/586.html](https://www.zhangbj.com/p/586.html)
- [https://www.zhangbj.com/p/585.html](https://www.zhangbj.com/p/585.html)
