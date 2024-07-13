---
title: 浅析 Preact Signals 及实现原理
date: 2024-07-11T01:42:54.236Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://juejin.cn/post/7389902503984922664'
---

## 介绍

Preact Signals 是 Preact 团队在 22 年 9 月引入的一个特性。我们可以将它理解为一种细粒度响应式数据管理的方式，这个在很多前端框架中都会有类似的概念，例如 SolidJS、Vue3 的 Reactivity、Svelte 等等。

Preact Signals 在命名上参考了 SolidJS 的 Signals 的概念，不过两个框架的实现方式和行为都有一些区别。在 Preact Signals 中，一个 signal 本质上是个拥有 `.value` 属性的对象，你可以在一个 React 组件中按照如下方式使用:

```ts
import { signal } from '@preact/signals';

const count = signal(0);

function Counter() {
  const value = count.value;
  
  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => count.value ++}>Click</button>
    </div>
  )
}
```

通过这个例子，我们可以看到 Signal 不同于 React Hooks 的地方：它是可以直接在组件外部调用的。

同时这里我们也可以看到，在组件中声明了一个叫 `count` 的 `signal` 对象，但组件在消费对应的 `signal` 值的时候，只用访问对应 signal 对象的 `.value` 值即可。

在开始具体的介绍之前，笔者先从 Preact 官方文档中贴几个关于 Signal API 的介绍，让读者对 Preact Signals 这套数据管理方式有个基本的了解。

## API

以下为 Preact Signals 提供的一些 Common API:

### signal(initialValue)

这个 API 表示的就是个最普通的 Signals 对象，它算是 Preact Signals 整个响应式系统最基础的地方。

当然，在不同的响应式库中，这个最基础的原语对象也会有不同的名称，例如 Mobx、RxJS 的 `Observers`，Vue 的 `Refs`。而 Preact 这里参考了和 SolidJS 一样的术语 `signal`。

Signal 可以表示包装在响应式里层的任意 JS 值类型，你可以创建一个带有初始值的 signal，然后可以随意读和更新它:

```ts
import { signal } from '@preact/signals-core';

const s = signal(0);
console.log(s.value); // Console: 0

s.value = 1;
console.log(s.value); // Console: 1
```

### computed(fn)

Computed Signals 通过 `computed(fn)` 函数从其它 signals 中派生出新的 signals 对象:

```ts
import { signal, computed } from '@preact/signals-core';

const s1 = signal('hello');
const s2 = signal('world');

const c = computed(() => {
  return s1.value + " " + s2.value
})
```

不过需要注意的是，`computed` 这个函数在这里并不会立即执行，因为按照 Preact 的设计原则，`computed signals` 被规定为懒执行的 (这个后面会介绍)，它只有在本身值被读取的时候才会触发执行，同时它本身也是只可读的:

```ts
console.log(c.value) // hello world
```

同时 computed signals 的值是会被缓存的。一般而言，`computed(fn)` 运行开销会比较大， Preact 只会在真正需要的时候去重新更新它。一个正在执行的 `computed(fn)` 会追踪它运行期间读取到的那些 signals 值，如果这些值都没变化，那么是会跳过重新计算的步骤的。

因此在上面的示例中，只要 `s1.value` 和 `s2.value` 的值不变化，那么 `c.value` 的值永远不会重新计算。

同样，一个 `computed signal` 也可以被其它的 `computed signal` 消费:

```ts
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

console.log(quadruple.value); // Console: 4
count.value = 20;
console.log(quadruple.value); // Console: 80
```

同时 `computed` 依赖的 signals 也并不需要是静态的，它只会对最新的依赖变更发生重新执行:

```ts
const choice = signal(true);
const funk = signal("Uptown");
const purple = signal("Haze"); 

const c = computed( 
  () => {
    if (choice.value) {
      console.log(funk.value, "Funk");
    } else {
      console.log("Purple", purple.value);
    }
}); 
  
c.value; // Console: Uptown Funk

purple.value = "Rain"; // purple is not a dependency, so 
c.value; // effect doesn't run

choice.value = false; 
c.value; // Console: Purple Rain 

funk.value = "Da"; // funk not a dependency anymore, so 
c.value; // effect doesn't run
```

我们可以通过这个 Demo 看到，`c` 这个 `computed signal` 只会在它最新依赖的 `signal` 对象值发生变化的时候去触发重新执行。

### effect(fn)

上一节中介绍的 Computed Signals 一般都是一些不带副作用的纯函数 (所以它们可以在初次懒执行)。这节要介绍的 `Effect Signals` 则是用来处理一些响应式中的副作用使用。

和 `Computed Signals` 一样的是，`Effect Signals` 同样也会对依赖进行追踪。但 Effect 则不会懒执行，与之相反，它会在创建的时候立即执行，然后当它追踪的依赖值发生变化的时候，它会随着变化而更新:

```ts
import { signal, computed, effect } from '@preact/signals-core';

const count = signal(1);
const double = computed(() => count.value * 2);
const quadrple = computed(() => double.value * 2);

effect(() => {
  // is now 4
  console.log('quadruple is now', quadruple.value);
})

count.value = 20; // is now 80
```

这里的 `effect` 执行是由 Preact Signals 内部的通知机制触发的。当一个普通的 signal 发生变化的时候，它会通知它的直接依赖项，这些依赖项同样也会去通知它们自己对应的直接依赖项，依此类推。

在 Preact 的内部实现中，通知路径中的 `Computed Signals` 会被标记为 `OUTDATED` 的状态，然后再去做重新执行计算操作。如果一个依赖变更通知一直传播到一个 `effect` 上面，那么这个 `effect` 会被安排到当其自身前面的 `effect` 函数执行完之后再执行。

如果你只想调用一次 `effect` 函数，那么可以把它赋值为一个函数调用，等到这个函数执行完，这个 `effect` 也会一起结束:

```ts
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);
const dispose = effect(() => {
  console.log('quadruple is now', quadruple.value);
});

// Console: quadruple is now 4
dispose();
count.value = 20;
```

### batch(fn)

用于将多个值的更新在回调结束时合成为一个。batch 的处理可以被嵌套，并且只有当最外层的处理回调完成后，更新才会刷新:

```ts
const name = signal('Dong');
const surname = signal('Zoom');

// Combine both writes into one
batch(() => {
  name.value = 'Haha';
  surname.value = 'Nana';
})
```

## 实现方式

关于 Signals 的具体实现方式具体可以参考: [github.com/preactjs/si…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpreactjs%2Fsignals "https://github.com/preactjs/signals") 。

在开始介绍之前，我们结合前面的 API 介绍，来强调一些 Preact Signals 本身的设计性原则:

* **依赖追踪**: 跟踪使用到的 signals (不管是 signals 还是 computed)。依赖项可能会动态改变
* **懒执行的 computed:** computed 值在被需要的时候运行
* **缓存**: computed 值只在依赖项可能改变的情况下才会重新计算
* **立即执行的 effect**: 当依赖中的某个内容变化时，effect 应该尽快运行。

### 依赖追踪

不管什么时候评估实现 `compute / effect` 这两个函数，它们都需要一种在其运行时期捕获他们会读取到的 signal 的方式。Preact Signals 给 `Compute` 和 `Effect` 这两个 Signals 都设置了其自身对应的 `context` 。

当读取 Signal 的 `.value` 属性时，它会调用一次 `getter` ，`getter` 会将 signal 当成当前 context 依赖项源头给添加进来。这个 context 也会被这个 signal 添加为其依赖项目标。

到最后，signal 和 effects 对其自身的依赖关系以及依赖者都会有个最新的试图。每个 signal 都可以在其 `.value` 值发生改变的时候通知到它的依赖者。例如在一个 `effect` 执行完成之后释放掉了，effect 和 computed signals 都是可以通知他们依赖集去取消订阅这些通知的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43d15400514d433b9009021c9a3fde72~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024\&h=600\&s=96374\&e=png\&b=fbfbfb)

同一个 signals 可能在一个 `context` 里面被读取多次。在这种情况下，进行依赖项的去重会很方便。然后我们还需要一种处理 发生变化依赖项集合 的方式：要么在每次重新触发运行时 时再重建依赖项集合，要么递增地添加 / 删除依赖项 / 依赖者。

Preact Signals 在早期版本中使用到了 JS 的 `Set` 对象去处理这种情况 (`Set` 本身的性能比较不错，能在 `O(1)` 时间内去添加 / 删除子项，同时能在 O (N) 的时间里面遍历当前集合，对于重复的依赖项，Set 也会自动去重)。

但创建 Sets 的开销可能相对 Array 要更昂贵 (从空间上看)，因为 Signals 至少需要创建两个单独的 `Sets` : 存储依赖项和依赖者。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6446765ee8749ef859ef35ff2cfb292~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1582\&h=556\&s=81856\&e=png\&b=fcfcfc)

同时 `Sets` 中也有个属性，它们是按照插入顺序来进行迭代。这对于 Signals 中处理缓存的情况会很方便，但也有些情况下，Signals 插入的顺序并不是总保持不变的，例如以下情况:

```ts
const s1 = signal(0)
const s2 = signal(0)
const s3 = signal(0)

const c = computed(() => {
  if (s1.value) {
    s2.value;
    s3.value
  } else {
    s3.value 
    s2.value
  }
})
```

可以看到，这这次代码中，依赖项的顺序取决于 `s1` 这个 signal，顺序要么是 s1、s2、s3，要么是 s1、s3、s2。按照这种情况，就必须采取一些其他的步骤来保证 Sets 中的内容顺序是正常的：删除然后再添加项目，清空函数运行前的集合，或者为每次运行创建一个新的集合。每种方法都有可能导致内存抖动。而所有这些只是为了处理理论上可能，但可能很少出现的，依赖关系顺序改变的情况。

而 Preact Signals 则采用了一种类似**双向链表**的数据结构去存储解决了这个问题。

### 链表

链表是一种比较原始的存储结构，但对于实现 Preact Signals 的一些特点来说，它具备一些非常好的属性，例如在双向链表节点中，以下操作会非常节省:

* 在 `O(1)` 时间内，将一个 signals 值插到链表的某一端
* 在 `O(1)` 时间内，删除链表任何位置的一个节点 (假设存在对应指针的情况下)
* 在 `O(n)` 时间内，遍历链表中的节点

以上这些操作，都可以用于管理 Signals 中的依赖 / 依赖列表。

Preact 会首先给每个依赖关系都创建一个 `source Node` 。而对应 `Node` 的 `source` 属性会指向目前正在被依赖的 Signal。同时每个 Node 都有 `nextSource` 和 `prevSource` 属性，分别指向依赖列表中的下一个和前一个 `source Nodes` 。Effect 和 Computed Signals 获得一个指向链表第一个 `Node` 的 `sources` 属性，然后我们可以去遍历这里面的一些依赖关系，或者去插入 / 删除新的依赖关系。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/766ec97d07b0439d9dfe5ac808fd60cc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024\&h=600\&s=70127\&e=png\&b=fefdfd)

然后处理完上面的依赖项步骤后，我们再反过来去做同样的事情：给每个依赖者创建一个 `Target Node` 。Node 的 `target` 属性则会指向它们依赖的 Effect 或 Computed Signals。`nextTarget` 和 `prevTarget` 构建一个双项链表。普通和 computed Signals Node 节点中会有个`targets` 属性用于指向他们依赖列表中的第一个 Target Node:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40a65a1ef1764f1181120d4e97d06fa4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024\&h=600\&s=66436\&e=png\&b=fefdfd)

但一般依赖项和依赖者都是成对出现的。对于每个 `source Node` 都会有一个对应的 `target Node` 。本质上我们可以将 `source Nodes` 和 `target Nodes` 统一合并为 `Nodes` 。这样每个 Node 本质上会有四条链节，依赖者可以作为它依赖列表的一部分使用，如下图所示:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b59acee2f97a46a280137c77c791d0b1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024\&h=600\&s=108274\&e=png\&b=fdfcfc)

在每个 `computed / effect` 函数执行之前，Preact 会迭代以前的依赖关系，并设置每个 Node 为 `unused` 的标志位。同时还会临时把 Node 存储到它的 `.source.node` 属性中用于以后使用。

在函数执行期间，每次读取依赖项时，我们可以使用节点以前记录的值 (上次的值) 来发现该依赖项是否在这次或者上次运行时已经被记录下来，如果记录下来了，我们就可以回收它之前的 Node (具体方式就是将这个节点的位置重新排序)。如果是没见过的依赖项，我们会创建一个新的 Node 节点，然后将剩下的节点按照使用的时期进行逆序排序。

函数运行结束后，Preact Signals 会遍历依赖列表，将打上了 `unused` 标志的 Nodes 节点给删除掉。然后整理一下剩余的链表节点。

这种链表结构可以让每次只用给每个依赖项 - 依赖者的关系对分配一个 Node，然后只要依赖关系是存在的，这个节点是可以一直用的 (不过需要更新下节点的顺序而已)。如果项目的 Signals 依赖树是稳定的，内存也会在构建完成后一直保持稳定。

### 立即执行的 effect

有了上面依赖追踪的处理，通过变更通知实现的立即执行的 effect 会很容易。Signals 通知其依赖者们，自己的值发生了变化。如果依赖者本身是个有依赖者的 `computed` signals，那么它会继续往前传递通知。依此类推，接到通知的 effect 会自己安排自己运行。

如果通知的接收端，已经被提前通知了，但还没机会执行，那它就不会向前传递通知了。这回减轻当前依赖树扩散出去或者进来时形成的通知踩踏。如果 signals 本身的值实际上没发生变化，例如 s.value = s.value。普通的 signal 也不会去通知它的依赖者。

Effect 如果想调度它自身，需要有个排序好的调度表。Preact 给每个 Effect 实例都添加了专门的 `.nextBatchedEffect` 属性，让 Effect 实例作为单向调度列表中的节点进行双重作用，这减少了内存抖动，因为反复调度同一个效果不需要额外的内存分配或释放。

### 通知订阅和垃圾回收

`computed` signals 实际上并不总是从他们的依赖关系中获取通知的。只有当有像 effect 这样的东西在监听 signals 本身时，compute signals 才会订阅依赖通知。这避免了下面的一些情况:

```ts
const s = signal(0);

{
  const c = computed(() => s.value)
}
//c 并不在同一个作用域下
```

如果 `c` 总是订阅来自 `s` 的通知，那么 `c` 无法被垃圾回收，直到 s 也去它这个 scope 上面去。主要因为 s 会继续挂在一个对 c 的引用上。

在 Preact Signals 中，链表提供了一种比较好的办法去动态订阅和取消订阅依赖通知。

在那些 computed signal 已经订阅了通知的情况下，我们可以利用这个做一些额外的优化。后面会介绍 computed 懒执行和缓存。

### Computed signals 的懒执行 & 缓存

实现懒执行 `computed Signals` 的最简单方法是每次读取其值时都重新计算。不过，这不是很高效。这就是缓存和依赖跟踪需要帮助优化的地方。

每个普通和 Computed Signals 都有它们自己的版本号。每次当其值变化时，它们会增加版本号。当运行一个 compute fn 时，它会在 Node 中存储上次看到的依赖项的版本号。我们原本可以选择在节点中存储先前的依赖值而不是版本号。然而，由于 computed signals 是懒执行的，这些依赖值可能会永远挂在一些过期或者无限循环执行的 Node 节点上。因此，我们认为版本编号是一种安全的折中方法。

我们得出了以下算法，用于确定当 computed signals 可以懒执行和复用它的缓存:

1. &#x20;**如果自上次运行以来，任何地方的 signal 的值都没有改变，那么退出 & 返回缓存值。**&#x20;

每次当普通 signal 改变时，它也会递增一个全局版本号，这个版本号在所有的普通信号之间共享。每个计算信号都跟踪他们看到的最后一个全局版本号。如果全局版本自上次计算以来没有改变，那么可以早点跳过重新计算。无论如何，在这种情况下，都不可能对任何计算值进行任何更改。

2. **如果 computed** **signals**  **正在监听通知，并且自上次运行以来没有被通知，那么退出 & 返回缓存值。**&#x20;

当 compute signals 从其依赖项中得到通知时，它标记缓存值已经过时。如前所述，compute signals 并不总是得到通知。但是当他们得到通知时，我们可以利用它。

3. &#x20;**按顺序重新评估依赖项。检查它们的版本号。如果没有依赖项改变过它的版本号，即使在重新评估后，也退出 & 返回缓存值。**&#x20;

这个步骤是我们特别关心保持依赖项按使用顺序排列的原因。如果一个依赖项发生改变，那么我们不希望重更新 compute list 中后来的依赖项，因为那可能只是不必要的工作。谁知道，也许那个第一个依赖项的改变导致下次 compute function 运行时丢弃了后面的依赖项。

4. &#x20;**运行 compute function。如果返回的值与缓存值不同，那么递增计算信号的版本号。缓存并返回新值。**&#x20;

这是最后的手段！但如果新值等于缓存的值，���么版本号不会改变，而线路下方的依赖项可以利用这一点来优化他们自己的缓存。

最后两个步骤经常递归到依赖项中。这就是为什么早期的步骤被设计为尝试短路递归的原因。

## 一些思考

### JSX 渲染

Signal 在 Preact JSX 语法进行传值的时候，可以直接传对应的 Signal 对象而不是具体的值，这样在 Signal 对象的值发生变化的时候，可以在组件不经过重新渲染的情况下触发值的变化 (本质上是把 Signal 值绑定到 DOM 值上)。

例如以下组件:

```ts
import { render } from 'preact'
import { signal } from '@preact/signals'

const count = signal(1);

// Component 跳过流程是怎么处理
// 可能对 state less 的组件跳过 render (function component)
funciton Counter() {
  console.log('render')
  return (
    <>
     <p>Count: {count}</p>
     <button onClick={() => count.value ++}>Add Count</button>
    </>
  )
}

render(<TodoList />, document.getElement('app'))
```

这个地方如果传的是个 count 的 signal 对象，那么在点击 button 的时候，这里的 `Counter` 组件并不会出发 `re-render` ，如果是个 signal 值，那么它会出发更新。

关于把 Signals 在 JSX 中渲染成文本值，可以直接参考: [github.com/preactjs/si…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpreactjs%2Fsignals%2Fpull%2F147 "https://github.com/preactjs/signals/pull/147")

这里渲染的原理是 Preact Signal 本身会去劫持原有的 Diff 执行算法:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec6b6bba0efe4af086eefa1a204ab09d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1562\&h=858\&s=177256\&e=png\&b=1f1f1f)

把对应的 signal value 存到 `vnode.__np` 这个节点属性上面去，并且这里会跳过原有的 diff 算法执行逻辑 (这里的 `old(value)` 执行函数)。

然后在 diff 完之后的更新的时候，直接去把对应的 signals 值更新到真实的 dom 节点上面去即可:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c6913535686491eb397b44dd5564358~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1620\&h=1650\&s=379017\&e=png\&b=1f1f1f)

### Preact signals 和 hooks 之间关系

两者并不互斥，可以一起使用，因为两者所依赖的更新的逻辑不一样。

### Preact 对比 React Hooks 带来的收益

Preact Signals 本身在状态管理上区别于 React Hooks 上的一个点在于: Signals 本身是基于应用的状态图去做数据更新，而 Hooks 本身则是依附于 React 的组件树去进行更新。

本质上，一个应用的状态图比组件树要浅很多，更新状态图造成的组件渲染远远低于更新状态树所产生的渲染性能损耗，具体差异可以参考分别使用 Hooks 和 Signals 的 Devtools Profile 分析:

## 参考资料

* [Why Signals Are Better Than React Hooks](https://www.youtube.com/watch?v=SO8lBVWF2Y8 "https://www.youtube.com/watch?v=SO8lBVWF2Y8")

* [preactjs.com/guide/v10/s…](https://preactjs.com/guide/v10/signals/ "https://preactjs.com/guide/v10/signals/")
