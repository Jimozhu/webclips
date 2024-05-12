---
title: "深入理解 Promise"
date: 2022-08-20T13:02:20+08:00
draft: false
categories: [dev]
tags: [dev, js]
---
> 原文地址 [kazehaiya.github.io](https://kazehaiya.github.io/2021/09/09/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3-Promise/?utm_source=tuicool&utm_medium=referral)

### [](#%E5%89%8D%E8%A8%80 "前言")前言

对于前端开发者们来说，ES6 的学习已经成为必然，其中的 `Promise` 更是频繁出没于各大面试题，因此了解 `Promise` 已经不能简简单单的会用，更需要深入原理。[《ES6 入门教程》](https://es6.ruanyifeng.com/)其中对 `Promise` 的讲解已经能满足业务场景的需要，来源和基础使用此篇就不做赘述，只是记录一下 `Promise` 的一些边角知识和我的一些心得体会。

### [](#%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF "事件循环")事件循环

深入了解 `Promise` 之前，我们需要对 JavaScript 的 “事件循环（Event Loop）” 机制有一定的了解。那么什么是 “事件循环” 呢？这个如果细说的话又能开一个系列，这里只简单的描述一下。

在 JavaScript 中任务分为两种：**宏任务（Task）**、**微任务（MicroTask）**。在主线程运行的时候，**同步任务**会直接运行，**异步任务**则会根据其类型分别进入 “宏任务队列” 和 “微任务队列”，在**同步任务**执行完毕后，会先清空 “微任务队列”，然后再清空 “宏任务队列”，其大致的运行图如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_pbnb9bse3sfhvzjv/d6b02cab.png)

> ⚠️ 注意：一般情况下，异步任务都是按顺序依次执行，但同样也存在一些 “插队” 执行的现象，特别是两异步任务同时执行的情况下，因处理时间的不同可能会出现意料之外的结果。
>
> 『图片引用自博客：[https://www.cnblogs.com/weiyongchao/p/13766429.html』](https://www.cnblogs.com/weiyongchao/p/13766429.html%E3%80%8F)

### [](#%E6%A1%88%E4%BE%8B%E7%AE%80%E6%9E%90 "案例简析")案例简析

了解了 “事件循环” 后，我们基本明白了 JavaScript 代码的执行机制，`Promise` 在其中扮演的是一个 “微任务”，基于此，我们分析几个案例来一步步了解 `Promise`。

#### [](#Promise-%E7%8A%B6%E6%80%81 "Promise 状态")Promise 状态

众所周知，`Promise` 有三种状态：`pending`、`fulfilled` 和 `rejected`，代码尝试如下：

```javascript
const p = new Promise((res, rej) => {
  setTimeout(() => {
    res();
  }, 3000);
});

console.log(p);

console.log(Promise.resolve());
console.log(Promise.reject());
```

#### [](#Promise-%E5%86%85%E7%9A%84%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E6%98%AF%E5%90%8C%E6%AD%A5%E4%BB%BB%E5%8A%A1 "Promise 内的执行函数是同步任务")Promise 内的执行函数是同步任务

很多新手容易弄混的部分是 “Promise 是异步函数，因此它初始化传入的执行函数属于异步任务”，同样用代码来解释：

```javascript
console.log("start");

const p = new Promise((res, rej) => {
  console.log("working...");
  res();
});

console.log("end");
```

#### [](#Promise-%E7%8A%B6%E6%80%81%E4%B8%8D%E5%8F%AF%E9%80%86 "Promise 状态不可逆")Promise 状态不可逆

除了最开始的 `pending` 态外，一旦转变为 `fulfilled` 或 `rejected` 状态后，其状态就不会再改变了：

```javascript
const p = new Promise((res, rej) => {
  res(1);
  rej(2);
});

console.log(p);
```

#### [](#then-%E9%93%BE%E8%BF%94%E5%9B%9E%E7%9A%84%E6%98%AF%E6%96%B0-Promise-%E5%AF%B9%E8%B1%A1 "then 链返回的是新 Promise 对象")`then` 链返回的是新 Promise 对象

`then` 链中，无论你返回什么内容，它都会给你给你包装一个 `Promise` 的外壳：

```javascript
const p = new Promise((res, rej) => {
  res();
});

console.log(p.then());
console.log(p.then(() => 1));
console.log(
  p.then(
    () =>
      new Promise((res, rej) => {
        res();
      })
  )
);
```

`then` 链有两个函数，第二个 `onReject` 函数如果有设置，那么其后续会返回至 `fulfilled` 状态链：

```javascript
new Promise((res, rej) => {
  rej(1);
})
  .then(
    (res) => {},
    (rej) => {
      console.log("err", rej);
    }
  )
  .then((res) => {
    console.log("success", res);
  });
```

> ⚠️ 注意：在日常开发中不要设置 `then` 链的 `onReject` 函数，说不定那天就因为常规思维而被它给坑了 (_´∇ ｀_)。

#### [](#then-%E9%93%BE%E6%98%AF%E5%8F%AF%E9%80%8F%E4%BC%A0%E7%9A%84 "then 链是可透传的")`then` 链是可透传的

当 `then` 链内的内容为非函数的情况下，其会将上一个 `Promise` 的结果和状态传递给下一个函数：

```javascript
Promise.resolve("start")
  .then(console.log("pass"))
  .then((res) => console.log(res));
```

> 【**小贴士**】其实工作中经常会用到这个特性，比如 `then` 链默认不写第二个函数，从而使用 `catch` 在 `then` 链末尾单独对错误进行处理，当然 `catch` 的返回值默认也是 `fulfilled` 状态哟。
>
> 【拓展】`finally` 效果与 “`then` 链透传” 一致，仅多了内部函数执行，感兴趣的可自行尝试一下 ～

### [](#%E6%A1%88%E4%BE%8B%E6%B7%B1%E5%85%A5 "案例深入")案例深入

#### [](#%E5%B5%8C%E5%A5%97-Promise%EF%BC%8Cthen-%E9%93%BE%E8%BF%94%E5%9B%9E%E9%9D%9E-Promise-%E7%BB%93%E6%9E%9C "嵌套 Promise，then 链返回非 Promise 结果")嵌套 `Promise`，`then` 链返回非 `Promise` 结果

刚刚聊的都是较为基础的例子，想要捋清 `Promise` 的知识可能还需要一些稍有难度的案例，这样才能加深对它的印象。那么看一下这个嵌套 `Promise` 的例子，弄懂了它，基本上就能对 `Promise` 有一定的理解了，不会被大多数的面试题给难住：

```javascript
Promise.resolve()
  .then(() => {
    console.log("1-1");

    new Promise((res, rej) => {
      console.log("1-2");
      res();
    })
      .then(() => {
        console.log("1-3");
      })
      .then(() => {
        console.log("1-4");
      });

    return 'Anything except promise func, also no "return"';
  })
  .then(() => {
    console.log("2-1");
  });
```

这里注意到，我们在第一个 then 链内调用了一个新的 `Promise` 方法，但没有返回值，那么运行的结果会是顺序执行吗？在浏览器上运行得到的结果为：

可以看到 “2-1” 在 “1-4” 之前打印了，可这又是为什么呢？让我们一步步分析来看：

- 【Step1】`then` 链先打印 `1-1`，然后进入 `Promise` 函数内；
- 【Step2】打印 `Promise` 内部的 `1-2`，执行 `resolve` 函数，并将紧接着的 `then` 链存入**微任务事件队列**；
- 【Step3】跳出 `Promise` 并运行至 `then` 链结尾，无返回值，默认 `resolve` 处理**并将下一个 `then` 链存入微任务队列**；
- 【Step4】此时微任务队列有俩微任务，依次执行处理，后续内容就是依次打印 `1-3` 和 `2-1` ，最后再打印 `1-4` 了；

微任务队列内容变化如下：

```javascript
【Step 1】
[
  then(() => {
    console.log('1-1');
    new Promise((res, rej) => {
      console.log('1-2');
      res();
    })
      .then(() => {
        console.log('1-3');
      })
      .then(() => {
        console.log('1-4');
      });
  }).then(() => {
    console.log('2-1');
  }),
]

【Step2】
[
  (then(() => {
    console.log('1-3');
  }).then(() => {
    console.log('1-4');
  }),
  then(() => {
    console.log('2-1');
  }))
]

【Step3】
[
  then(() => {
    console.log('1-4');
  })
];
```

从此结果我们可以了解到，在无返回值的情况下最好不要在内部处理别的 `Promise` 函数并接上 `then` 链来达到步骤控制，很容易会出现一些意想不到的问题。在业务中，很容易就会写出这样的代码，如：

```javascript
const initFunc = async () => {
  await http.post("getInfo").then((info) => {
    const { userId, userRightIds } = info;

    http.post("getUserInfo", { userId }).then(() => {});

    http.post("getRightList", { userRightIds }).then(() => {});
  });
};
```

模拟请求的代码如下：

```javascript
async function test() {
  let testVal = 1;

  await Promise.resolve().then(() => {
    Promise.resolve()
      .then()
      .then()
      .then()
      .then()
      .then()
      .then(() => {
        testVal = 2;
      });
  });

  console.log(testVal);
}

test();
```

所以，业务代码内尽量不要嵌套写 `Promise`，用 `async/await` 拆拆，或者每个内部 `Promise` 函数加上对应的 `async/await` 方法令其执行完再做其它操作，这样就不会写出 bug 了。

#### [](#%E5%B5%8C%E5%A5%97-Promise%EF%BC%8Cthen-%E9%93%BE%E8%BF%94%E5%9B%9E-Promise-%E7%BB%93%E6%9E%9C "嵌套 Promise，then 链返回 Promise 结果")嵌套 `Promise`，`then` 链返回 `Promise` 结果

当然，嵌套 `Promise` 也是有坑存在的，说不定那天面试也会面到，当然项目内是不会出现这种写法的（有的话那么需要问问是谁面他进来的，同时还得考虑考虑是否继续和他共事），返回 `Promise` 结果的例子咱先不看，先分解一下，看如下例子：

```javascript
Promise.resolve()
  .then(() => {
    console.log("1-1");
  })
  .then(() => {
    console.log("1-2");
  })
  .then(() => {
    console.log("1-3");
  });

Promise.resolve()
  .then(() => {
    console.log("2-1");
  })
  .then(() => {
    console.log("2-2");
  })
  .then(() => {
    console.log("2-3");
  });
```

这结果想必难不倒大家，可以很轻松的解答出来，那么再代入嵌套的例子看看，应该就好分析了：

```javascript
Promise.resolve()
  .then(() => {
    Promise.resolve()
      .then(() => {
        console.log("1-1");
      })
      .then(() => {
        console.log("1-2");
      })
      .then(() => {
        console.log("1-3");
      });

    return Promise.resolve()
      .then(() => {
        console.log("2-1");
      })
      .then(() => {
        console.log("2-2");
      })
      .then(() => {
        console.log("2-3");
      });
  })

  .then(() => {
    console.log("3-1");
  });
```

因为 `then3` 依赖 `then2` 的状态改变，而 `then2` 又需要和 `then1` 抢微任务队列的资源，因此返回的结果就是交替的结果，`3-1` 最后打印。

**但是**，我们把 `then2` 链精简一下，只留一个 `2-1`，按道理来说 `3-1` 应该在 `1-2` 之后打印的，但实际结果如下：

```javascript
Promise.resolve()
  .then(() => {
    Promise.resolve()
      .then(() => {
        console.log("1-1");
      })
      .then(() => {
        console.log("1-2");
      })
      .then(() => {
        console.log("1-3");
      });

    return Promise.resolve().then(() => {
      console.log("2-1");
    });
  })

  .then(() => {
    console.log("3-1");
  });
```

为什么和预测结果不一样了呢？其实此问题的问题点并不在 `Promise` 身上，听我一一分析。

**首先**，在 `then2` 打印 `2-1` 后，其会返回一个新的 `Promise` 对象放入微任务队列，它的返回值为 `undefined`

**然后** `then1` 打印 `1-2` 并将 `1-3` 所在 `then` 链传入

**紧接着** 这个返回值为 `undefiend` 的 `Promise` 对象执行，然后返回一个 `undefiend` 值，这就回到上面返回值为非 `Promise` 的情形了，紧接着 `then3` 就放入了微任务队列

**在看**微任务队列，发现 `then3` 就在 `then1` 那最后一个链之后，那结果就呼之欲出了。

代码解如下：

```javascript
【Step1】
[

  then(() => { console.log('1-1'); })
    .then(() => { console.log('1-2'); })
    .then(() => { console.log('1-3'); }),

  Promise.resolve(then(() => { console.log('2-1'); }))
]
【Step2】
[

  then(() => { console.log('1-2'); })
    .then(() => { console.log('1-3'); }),

  Promise.resolve(undefined)
]
【Step3】
[
  then(() => { console.log('1-3'); }),
  then(() => { console.log('3-1'); })
]
```

> 此需要注意的是，`then` 链处理返回结果为 `Promise` 类型时，其会多一个 `Promise.resolve(undefined)` 的隐藏链。
> 当然，如果 `then2` 直接返回一个 `Promise.resolve()` 其结果仍然是一样的，这就涉及到任务队列的插队问题了，因为我们返回的是一个新的 `Promise` 对象，这和原来的 `Promise` 链还是有一点区别的，这里只需要记住，最多差两条链的结果就行，没有深究的必要（实际项目也不会遇到这个问题）

### [](#%E5%8F%82%E8%80%83%E6%96%87%E7%AB%A0 "参考文章")参考文章

- [Promise A+ 规范](http://malcolmyu.github.io/malnote/2015/06/12/Promises-A-Plus/)
- [Promise 注册微任务和执行过程](https://juejin.cn/post/6844903993412583431)
- [一次弄懂 Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606)
- [动图学 JavaScript 之：事件循环（Event Loop）](https://zhuanlan.zhihu.com/p/100682415)
- [【图解】浏览器及 nodeJS 中的 EventLoop 事件循环机制](https://www.cnblogs.com/weiyongchao/p/13766429.html)
