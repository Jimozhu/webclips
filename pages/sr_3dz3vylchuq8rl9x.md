---
title: "Javascrip 事件循环 EventLoop 微任务与宏任务"
date: 2022-03-29T13:58:46+08:00
draft: false
categories: [dev]
tags: [dev, web, js]
---

> 原文地址 [juejin.cn](https://juejin.cn/post/7080101335592337438)

## 1、javascript 的运行机制介绍

javascript 是单线程的语言，默认情况下一个时间点只能做一件事情，因此引入异步模型 javascript 是一门解释性脚本语言，即（边解释边运行）

## 2、阻塞式代码和非阻塞式代码

#### 阻塞式代码：

同步代码 代码会严格按照单线程 (从上到下， 从左到右) 执行代码逻辑，以此标准来进行代码的解释和运行

```
const a = 1,
    b = 2
let d1 = new Date().getTime(),
    d2 = new Date().getTime()
//这段代码会占用执行栈2s
while(d2 - d1 < 2000){
  d2 = new Date().getTime()
}
//2s后才会输出结果
console.log(a + b)

```

上面代码会遵循从上到下，从左到右的执行顺序， d1, d2 之间只有毫秒级的差异，因此会进入第 6 行的 while 循环，重复给 d2 赋值，直到满足跳出循环条件（也就是 2s 后），然后才会执行 console.log 打印操作 `这里就是同步代码带来的阻塞`[](https://link.juejin.cn?target=)

#### 非阻塞式代码：

异步执行的代码 JavaScript 引擎在工作时，依然是按照自上而下的顺序解释和运行代码。 在解释时，如果遇到需要异步执行的代码，就将其 `挂起` 并略过，继续向下执行同步代码，等当前执行栈同步代码全部执行完毕后，程序将去任务队列拿可以执行的异步任务，将其放入执行栈，依次执行 `异步代码不会阻塞同步代码的执行，会等待同步代码执行完毕后再执行`

```
const a = 1,
      b = 2
let d1 = new Date().getTime(),
    d2 = new Date().getTime()
setTimeout(() => {
  console.log('异步代码')
},1000)
//会运行2s的同步代码
while(d2 - d1 > 2000){
  d2 = new Date().getTime()
}
console.log('同步代码')

```

运行结果是：

1. 遇到 setTimeout 异步任务，将其挂起
2. 1s 过后， SetTimeout 结束等待，进入任务队列
3. 2s 过后， while 循环结束，继续向下执行
4. 打印 '同步代码'
5. 去任务队列拿得到结果的异步任务
6. 打印 ’异步任务‘[](https://link.juejin.cn?target=)

## 3、JavaScript 线性模型构成

在浏览器中，是以多个线程协助操作来实现 JS 的 单线程异步模型的，具体有以下线程

- GUI 渲染线程
- Javascript 引擎线程
- 事件触发线程
- 定时器触发线程
- http 请求线程
- 其他线程

我们可以发现，在浏览器中运行 Javascript 的线程并不只有一个

`在javascript代码运行过程中实际程序执行是只存在一个活动线程，这里实现同步异步就是靠多线程的切换形式来实现的`

所以当我们通常分析时，将上面的细分线程归纳为下列两条线程：

- 主线程： 用于 执行页面的渲染， JavaScript 代码的运行，事件触发等等
- 工作线程： 这个线程是在幕后工作的， 用来处理异步任务的执行来实现非阻塞的运行模式， 这里维护了需要延时执行的任务列表， 包括定时器和一些浏览器内部需要延迟执行的任务

**javascript 的运行模型**

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/635b8c25.webp)

### 事件循环机制

（1）所有同步任务都在主线程上执行，形成一个[执行栈](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2013%2F11%2Fstack.html "https://www.ruanyifeng.com/blog/2013/11/stack.html")（execution context stack）。 （2）主线程之外，还存在一个 "任务队列"（task queue）。只要异步任务有了运行结果，就在 "任务队列" 之中放置一个事件。 （3）一旦 "执行栈" 中的所有同步任务执行完毕，系统就会读取 "任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。 （4）主线程不断重复上面的第三步。 参考：[Event Loop- 阮一峰](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2014%2F10%2Fevent-loop.html "https://www.ruanyifeng.com/blog/2014/10/event-loop.html")

### 关于 setTimeout

**（1）、如果当前同步任务耗时过久，会影响延时到期定时器的执行**

**（2）、如果 setTimeout 存在嵌套调用， 那么系统会设置最短时间间隔为 4ms**

```
function cb() { setTimeout(cb, 0)}
setTimeout(cb, 0)

```

在 chrome 中，如果定时器被嵌套调用 5 次以上，系统会判定该方法被阻塞了，之后如果该定时器调用间隔小于 4ms，浏览器会将每次调用间隔设置为 4ms

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/4b8f1f12.webp)

**（3）、未激活的页面，setTimeout 执行最小间隔为 1000ms** 如果当前标签不是被激活标签，那么定时器的最小间隔就是 1000ms

**（4）、使用 setTimeout 设置的回调函数中的 this 不符合直觉**

```
let name = 'global'
let myObj = {
  name: 'myObj',
  sayName: function(){
    console.log(this.name)
  }
}
//这里相当于直接放入myObj.sayName这个函数的地址，等到函数执行栈中解析时, this是指向全局对象的
setTimeout(myObj.sayName(), 1000)   //'global'

```

这里打印出的结果是‘global’，这段代码在编译的时候，执行上下文中的 this 指向全局对象 window, 如果是严格模式，会被设置为 undefined

如何解决：

1. 将要执行的代码放入匿名函数中

```
//这里解析时，是先找到myObj,然后调用他上面的sayName方法
setTimeout(() => {
  myObj.sayName()
}, 1000)
//或：
setTimeout(function(){
  myObj.sayName()
},1000)

```

2. 使用 bind 方法，将 sayName 方法绑定在 myObj 上

```
setTimeout(myObj.sayName.bind(myObj), 1000)

```

## 4、JavaScript 代码片段分析实践

```
function task1(){
  console.log('第一个任务')
}
function task2(){
  cosnole.log('第二个任务')
}
function task3(){
  console.log('第三个任务')
}
function task4(){
  console.log('第四个任务')
}
task1()
setTimeout(task2, 1000)
setTimeout(task3, 500)
task4()
// 输出 一、四、三、二

```

- task1 是同步任务进入执行栈执行
- 两个 setTimeout 放入工作线程，等有了执行结果后依次放入任务队列
- task4 在函数执行栈 执行完 task1 之后进入执行栈执行
- 500ms 过后， taks3 进入任务队列， 1000ms 之后 task2 进入任务队列
- 等待执行栈执行完同步任务后， 依次执行 task3、task2[](https://link.juejin.cn?target=)

## 5、线程执行栈的介绍

函数执行栈是一个栈的数据结构，满足先进后出， 当我们运行单层函数时， 执行栈执行的函数进栈后，会出栈销毁然后下一个函数进行进栈出栈， 当遇到函数嵌套时，就会堆积栈帧

```
function task1(){
  console.log('task1执行开始')
  task2()
  console.log('task2执行结束')
}
function task2(){
  console.log('task2执行开始')
  task3()
  console.log('task3执行结束')
}
function task3(){
  console.log('task3执行开始')
}
task1()
console.log('task1执行结束')

```

执行结果为：

```
task1执行开始
task2执行开始
task3执行开始
task3执行结束
task2执行结束
task1执行结束

```

**执行流程分析**

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/aa006868.webp) 第一次执行的时候调用 task1 函数执行到 cosnole.log('task1 执行开始')，进行打印输出， 接下来遇到 task2 的调用：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/6f2f5b01.webp) 进入 task2， 解释到 console.log 进行打印输出，然后解释道 task3() 函数的执行，将 task3 函数放入栈顶 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/e90c3ea5.webp) task3 中只有一行代码， console.log, 打印完之后将 task3 进行出栈工作 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/4b184502.webp) task2 中执行完打印操作后，没有其他代码，同样会进行出栈操作 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/3b2ee175.webp) 最后执行栈中只剩 task1，在执行完 task2() 之后代码， 也会进行出栈 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/fbbf19cc.webp) 最后，task1 执行完毕，退出执行栈，执行完 console.log() 后，执行栈清空[](https://link.juejin.cn?target=)

## 6、递归深度问题及解决方案

#### 关于递归

清除上面的执行栈逻辑后，我们来梳理一下递归函数，递归函数在项目中也是比较常见的。如果递归层级过深，就会触发大量的栈帧堆积，如果处理的数据过多，会导致执行栈啊的高度不够放入新的栈帧，从而造成栈溢出的错误

#### 关于执行栈的深度

执行栈的深度根据浏览器和 JS 引擎有着不同的区别，我们在 Chrome 浏览器中运行一下代码：

```
let i = 1
  function task(){
    i++
    console.log(`执行了${i}次`)
    task()
  }
  task()

```

我们可以看到，在执行了 9157 次后，收到了栈溢出的提示，也就是说无法在进行深层次的递归了

#### 跨越递归层级限制

如何解决这种问题，我们尝试将代码更改一下

```
let i = 1
  function task(){
    i++
    console.log(`执行了${i}次`)
    setTimeout(() => {
      task()
    }, 0)
  }
  task()

```

执行结果： 可以看到，此时我们的递归是可以一直执行的

这两种方法有何不同呢，我们画图分析一下： **第一种方法：** ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/faab316e.webp)

**第二种方法**

将递归操作放入任务队列，使我们的执行栈中在执行的只有一条记录 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/73079dd3.webp)

可以看到，加入 setTimeout 后，task 在将 自身放入工作线程后就可以出栈销毁了。 执行栈中永远只有一个任务在运行，就避免了栈帧的无限叠加， 但是我们上面说到过， setTimeout 是无法保证代码运行时效的，这样做只是解决了递归深度问题， 这个例子只是为了加深对于事件循环的理解， 真正循环还是要用指针循环[](https://link.juejin.cn?target=)

## 7、宏任务和微任务

#### 为什么要有微任务：

宏任务可以满足我们大部分的日常需求，不过如果有对时间精度要求较高的需求，宏任务就难以实现了

页面的渲染事件、各种 IO 的完成事件、执行 JavaScript 脚本的事件、用户交互的事件等都随时有可能被添加到消息队列中，而且添加事件是由系统操作的，JavaScript 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在消息队列中的位置，所以很难控制开始执行任务的时间。为了直观理解，可以看下面这段代码：

```
<!DOCTYPE html>
<html>
    <body>
        <div id='demo'>
            <ol>
                <li>test</li>
            </ol>
        </div>
    </body>
    <script type="text/javascript">
        function timerCallback2(){
          console.log(2)
        }
        function timerCallback(){
            console.log(1)
            setTimeout(timerCallback2,0)
        }
        setTimeout(timerCallback,0)
    </script>
</html>

```

在这段代码中，我的目的是想通过 setTimeout 来设置两个回调任务，并让它们按照前后顺序来执行，中间也不要再插入其他的任务，因为如果这两个任务的中间插入了其他的任务，就很有可能会影响到第二个定时器的执行时间了。

但实际情况是我们不能控制的，比如在调用 setTimeout 来设置回调任务的间隙，消息队列中就有可能被插入很多系统级的任务。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/56bb5a88.webp) 可以看到，两个定时器之间被插入了 浏览器在处理的任务 (渲染工作等)，如果插入的任务运行时间较长，就会影响后面任务的执行

因此我们需要用微任务来解决此类问题，**微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。**

**异步回调主要有两种方式：**

- **第一种是把异步回调函数封装成一个宏任务，宏任务不会立即进入执行栈，而是会先‘挂起’，等得到结果后会进入消息队列尾部，当循环系统执行到该任务的时候执行回调函数**
- **第二种方式的执行时机是在主函数执行结束之后、当前宏任务结束之前执行回调函数，这通常都是以微任务形式体现的**

#### 微任务的产生过程

我们知道当 JavaScript 执行一段脚本的时候，V8 会为其创建一个全局执行上下文，在创建全局执行上下文的同时，V8 引擎也会在内部创建一个**微任务队列**。顾名思义，这个微任务队列就是用来存放微任务的，因为在当前宏任务执行的过程中，有时候会产生多个微任务，这时候就需要使用这个微任务队列来保存这些微任务了。不过这个微任务队列是给 V8 引擎内部使用的，所以你是无法通过 JavaScript 直接访问的。

也就是说，每个宏任务都有其关联的微任务队列，也可以理解为：`由JS引擎产生的任务是微任务，由宿主API(setTimeout等)产生的任务是宏任务`

在浏览器里面，产生微任务的方式有两种：

0. 使用 MutationObserver 监控某个 DOM 节点，然后再通过 JavaScript 来修改这个节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务。
1. 使用 Promise，当调用 Promise.resolve() 或者 Promise.reject() 的时候，也会产生微任务。

#### 微任务的执行时机

通常情况下，在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JS 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。

如果在执行微任务的过程中，产生了新的微任务，同样会将该微任务添加到微任务队列中，V8 引擎一直循环执行微任务队列中的任务，直到队列为空才算执行结束。也就是说在执行微任务过程中产生的新的微任务并不会推迟到下个宏任务中执行，而是在当前的宏任务中继续执行。

画图理解： ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3dz3vylchuq8rl9x/e7462a40.webp)

**由此可见，微任务的工作流程为**

- 微任务和宏任务是绑定的，每个宏任务在执行时，会创建自己的微任务队列。
- 微任务的执行时长会影响到当前宏任务的时长。比如一个宏任务在执行过程中，产生了 100 个微任务，执行每个微任务的时间是 10 毫秒，那么执行这 100 个微任务的时间就是 1000 毫秒，也可以说这 100 个微任务让宏任务的执行时间延长了 1000 毫秒。所以在写代码的时候一定要注意控制微任务的执行时长。
- 在一个宏任务中，分别创建一个用于回调的宏任务和微任务，无论什么情况下，微任务都早于宏任务执行。

#### 总结

在 JavaScript 中，代码执行的顺序是：

0. 默认同步代码按照顺序自上而下，从左到右执行，运行过程中注册本次的微任务和后续的宏任务

   0. 对于微任务，直接放入任务队列，在下一次宏任务开始前立即执行
   1. 对于宏任务，放入工作线程，等宏任务获得结果后进入任务队列
1. 执行本次同步代码中注册的微任务， 并注册微任务中包含的宏任务和微任务
2. 将下一次宏任务开始前的微任务执行完毕
3. 执行最先进入任务队列的宏任务，并注册此次宏任务中的 微任务和后续的宏任务，同样的微任务放入任务队列，在下一次宏任务开始前执行， 宏任务放入工作线程，等获得结果后进入任务队列

宏任务：

<table><thead><tr><th>#</th><th>浏览器</th><th>Node</th></tr></thead><tbody><tr><td>I/O</td><td>✅</td><td>✅</td></tr><tr><td>setTimeout</td><td>✅</td><td>✅</td></tr><tr><td>setInterval</td><td>✅</td><td>✅</td></tr><tr><td>setImmediate</td><td>❌</td><td>✅</td></tr><tr><td>requestAnimationFrame</td><td>✅</td><td>❌</td></tr></tbody></table>

微任务：

<table><thead><tr><th>#</th><th>浏览器</th><th>Node</th></tr></thead><tbody><tr><td>process.nextTick</td><td>❌</td><td>✅</td></tr><tr><td>MutationObserver</td><td>✅</td><td>❌</td></tr><tr><td>Promise.resolve()、 Promise.reject(）</td><td>✅</td><td>✅</td></tr></tbody></table>

## 输出问题：

一、

```
document.addEventListener('click', function(){
      Promise.resolve().then(() => {console.log(1)})
      console.log(2)
  })
  document.addEventListener('click', function(){
      Promise.resolve().then(() => {console.log(3)})
      console.log(4)
  })

```

因为事件监听不会在阻断 JS 默认代码的执行，所以事件监听也是异步任务，并且是宏任务，所以两个事件相当于按顺序执行的两个宏任务 执行顺序是， 第一个点击事件先进入任务队列，立即执行 `console.log(2)`, 而 Promise.resolve() 产生的是微任务，会在下一次宏任务开始前立即执行，在输出 4 前会先输出 1 因此顺序就是 2 1 4 3
