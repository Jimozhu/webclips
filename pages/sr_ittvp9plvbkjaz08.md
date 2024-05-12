---
title: "TypeScript 类型元编程基础入门"
date: 2022-08-31T11:26:54+08:00
draft: false
categories: [dev]
tags: [js, ts, web]
---
> 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/384172236)

现在，TypeScript 已经在前端圈获得了广泛的群众基础。但据个人观察，很多同学还处于刚刚脱离 AnyScript 的阶段，看到 K in keyof T 这类东西就头疼，读不懂现代前端框架中普遍使用的类型操作技巧。如果你也对类型体操感到一头雾水，本文或许能为你提供一些授人以渔式的帮助。

由于本文预期的受众是完全没有高级类型操作经验的同学，因此下面我们不会直接列出一堆复杂的类型体操案例，而是从最简单的泛型变量语法等基础知识开始，逐步展示该如何从零到一地使用 TS 中强大的 type-level 编程能力。这些内容可以依次分成三个部分：

- 循环依赖与类型空间
- 类型空间与类型变量
- 类型变量与类型体操

> 如果你已经完成了 TypeScript 入门（能顺利解答 [type-challenges](https://github.com/type-challenges/type-challenges/) 中的 Easy 难度问题），那么本文对你来说应该过于简单，不需要阅读。

在开始介绍具体的类型操作语法前，这里希望先铺垫个例子，借此先理清楚「**TypeScript 相比于 JavaScript 到底扩展出了什么东西**」，这对后面建立思维模型会很有帮助。

## 循环依赖与类型空间

我们都知道，JavaScript 中是不建议存在循环依赖的。假如我们为一个编辑器拆分出了 Editor 和 Element 两个 class，并把它们分别放在 `editor.js` 和 `element.js` 里，那么这两个模块不应该互相 import 对方。也就是说，下面这种形式是不提倡的：

```typescript
// editor.js
import { Element } from "./element";

// element.js
import { Editor } from "./editor";
```

但是在 TypeScript 中，我们很可能必须使用这样的「循环依赖」。因为往往不仅在 Editor 实例里要装着 Element 的实例，每个 Element 实例里也需要有指回 Editor 的引用。由于类型标注的存在，我们就必须这么写：

```typescript
// editor.ts
import { Element } from "./element";

// Editor 中需要建立 Element 实例
class Editor {
  constructor() {
    this.element = new Element();
  }
}

// element.ts
import { Editor } from "./editor";

// Element 中需要标注类型为 Editor 的属性
class Element {
  editor: Editor;
}
```

这不就造成了 JS 中忌讳的循环引用了吗？当然这么写倒也不是不能用，因为这里为了类型标注而写的 `import` 不会出现在编译出的 JS 代码中（说粗俗点就是「编译以后就没了」，后面会详细解释）。但比较熟悉 TS 的同学应该都知道，这时的最佳实践是使用 [TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) 中新增的 `import type` 语法：

```typescript
// element.ts
import type { Editor } from "./editor";

// 这个 type 可以放心地用作类型标注，不造成循环引用
class Element {
  editor: Editor;
}

// 但这里就不能这么写了，会报错
const editor = new Editor();
```

注意到重复的地方了吗？没错，class 和 enum 是横跨两个空间的！这其实很好理解，比如对于一个名为 `Foo` 的 class，我们在写出 `let foo: Foo` 的时候，使用的是类型空间里的 `Foo`。而在写出 `let foo = new Foo()` 时，使用的则是值空间里的 `Foo`。因为前者会被擦除掉，后者会保留在 JS 里。

> 通俗地说，值空间在第一层，类型空间在第二层，[Anders](https://zhuanlan.zhihu.com/p/65473609) 老爷子在大气层。

现在，我们已经通过对 `import type` 语法的观察，明白了 TypeScript 中实际上存在着两个不同的空间。那么在这个神秘的类型空间里，我们能做什么呢？有句老话说得好，广阔天地，大有可为。

## 类型空间与类型变量

显然，类型空间里容纳着的是各种各样的类型。而非常有趣的是，编程语言中的「常量」和「变量」概念在这里同样适用：

- 当我们写 `let x: number` 时，这个固定的 `number` 类型就是典型的常量。如果我们把某份 JSON 数据的字段结构写成朴素的 interface，那么这个 interface 也是类型空间里的常量。
- 在使用泛型时，我们会遇到类型空间里的变量。这里的「变」体现在哪里呢？举例来说，**通过泛型，函数的返回值类型可以由输入参数的类型决定**。如果纯粹依靠「写死」的常量来做类型标注，是做不到这一点的。

在 TypeScript 中使用泛型的默认方式，相比 Java 和 C++ 这些（名字拼写）大家都很熟悉的经典语言，并没有什么区别。这里重要的地方并不是 `<T>` 形式的语法，而是这时我们**实际上是在类型空间中定义了一个类型变量**：

```typescript
// 使用泛型标注的加法函数，这里的 Type 就是一个类型变量
function add<Type>(a: Type, b: Type): Type {
  return a + b;
}

add(1, 2); // 返回值类型可被推断为 number
add("a", "b"); // 返回值类型可被推断为 string

add(1, "b"); // 形参类型不匹配，报错
```

在上面这个非常简单的例子里，通过 `Type` 这个类型变量，我们不仅在输入参数和返回值的类型之间建立了动态的联系，还在输入参数之间建立了约束，这是一种很强大的表达力。另外由于**这类变量在语义上几乎总是相当于占位符**，所以我们一般会把它们简写成 `T` / `U` / `V` 之类。

除了声明类型变量以外，另一种能在类型空间里进行的重要操作，就是从一种类型推导出另一种类型。TypeScript 为此扩展出了自己定义的一套语法，比如一个非常典型的例子就是 `keyof` 运算符。这个运算符是专门在类型空间里使用的，（不太准确地说）相当于能在类型空间里做的 `Object.keys`，像这样：

```typescript
// 定义一个表达坐标的 Point 结构
interface Point {
  x: number;
  y: number;
}

// 取出 Point 中全部 key 的并集
type PointKey = keyof Point;

// a 可以是任意一种 PointKey
let a: PointKey;

a = "x"; // 通过
a = "y"; // 通过
a = { x: 0, y: 0 }; // 报错
```

值得注意的是，`Object.keys` 返回的是一个数组，但 `keyof` 返回的则是一个集合。如果前者返回的是 `['x', 'y']` 数组，那么后者返回的就是 `'x' | 'y'` 集合。我们也可以用形如 `type C = A | B` 的语法来取并集，这时其实也是在类型空间进行了 `A | B` 的表达式运算。

除了 `keyof` 运算符以外，在类型空间编程时必备的还有泛型的 `extends` 关键字。它在这里的语义并非 class 和 interface 中的「继承」，而更类似于**由一个类型表达式来「约束」住另一个类型变量**：

```typescript
// identity 就是返回原类型自身的简单函数
// 这里的 T 就相当于被标注成了 Point 类型
function identity1<T extends Point>(a: T): T {
  return a;
}

// 这里的 T 来自 Point2D | Point3D 这个表达式
function identity2<T extends Point2D | Point3D>(a: T): T {
  return a;
}
```

现在，我们已经清楚地意识到了类型变量的存在，并且也知道我们能在类型空间里「**基于类型来生成新类型**」了。经过这个热身，你是不是已经按捺不住继续尝试体操动作的热情了呢？不过在继续往下之前，这里先总结一下这么几点吧：

- 类型空间里同样可以存在变量，其运算结果还可以赋值给新的类型变量。实际上 TypeScript 早已做到让这种运算图灵完备了。
- 类型空间里的运算始终只能针对类型空间里的实体，无法涉及运行时的值空间。比如从后端返回的 `data` 数据里到底有哪些字段，显然不可能在编译期的类型空间里用 `keyof` 获知。不要尝试表演超出生理极限的体操动作。
- 类型空间在运行时会被彻底擦除，因此你哪怕完全不懂不碰它也能写出业务逻辑，这时就相当于回退到了 JavaScript。

因此，TypeScript 看似简单的类型标注背后，其实是一门隐藏在类型空间里的强大编程语言。虽然目前我们还只涉及到了对其最基础的几种用法，但已经可以组合起来发挥出更大的威力了。下面将从一个实际例子出发，介绍在类型空间进行更进阶操作时的思路。

## 类型变量与类型体操

怎样的类型操作算是「类型体操」呢？充斥着 `T` / `U` / `V` 等类型变量的代码可能算是一种吧。由于这时我们做的已经是在类型空间里进行的元编程，必须承认这类代码常常是较为晦涩的。但这种能力很可能获得一些意想不到的好处，**甚至能对应用性能有所帮助**——你说什么？类型在运行时被通通擦除掉的 TypeScript，怎么可能帮助我们提升性能呢？

现在，假设我们在开发一个支持多人实时协作的编辑器。这时一个非常基础的需求，就是要能够将操作（operation）序列化为可传输的数据，在各个用户的设备上分布式地应用这些操作。一般来说，这类数据的结构都是数据模型中某些字段的 diff 结果，我们可以像应用 git patch 那样地把它应用到数据模型上。而由于每次操作所更新的字段都完全随机，**为了保存历史记录，我们需要将更新前后的字段数据都一起存起来**，像这样：

```typescript
class History {
  commit(element, from, to) {
    // ...
  }
}

// 更新单个字段
history.commit(element, { left: 0 }, { left: 10 });

// 或者更新多个字段
history.commit(element, { left: 5, top: 5 }, { left: 10, top: 10 });
```

基于工程经验，这个 `commit` 方法需要满足两个目标：

- 能够适配所有不同类型的 Element。
- **对每种 Element，调用方所能提交的字段格式要能够被约束住**。比如只允许为 TextElement 提交 `text` 字段，只允许为 ImageElement 提交 `src` 字段。

对于这两条要求，在原生的 JavaScript 中我们该怎么做呢？由于 JavaScript 是弱类型语言，第一条要求可以容易地满足。但对于约束字段的第二条要求，则通常需要由运行时的校验逻辑来实现：

```typescript
class History {
  commit(element, from, to) {
    // 要求所有 `from` 中的 key 都存在于 `to` 中
    const allKeyExists = Object.keys(from).every((key) => !!to[key]);
    // 要求 `from` 中的 key 长度和 `to` 一致
    const keySizeEqual = Object.keys(from).length === Object.keys(to).length;
    // 仅当同时满足上面两条时才通过校验
    if (!(allEeyExists && keySizeEqual)) {
      throw new Error("you fxxking idiot!");
    }

    // ...
  }
}
```

显然，这是一个 O(N) 复杂度的算法，并且还无法涵盖更精细的逻辑。例如这段代码无法检查存在嵌套的字段，只能检查对象 key 的名称而忽略了 value 的类型，不能根据 Element 的类型来校验字段的有效性…… 诸如此类的校验如果越写越复杂，还有一种工程上的变通方案，那就是通过 `NODE_ENV` 之类的环境变量，将这类校验代码限制在开发版的 JS 包里，在打运行时包时由编译器优化掉，[像 React 就做了这样的处理](https://www.zhihu.com/question/423354684/answer/1522345440)。这些确实倒是也都能做，但是何苦呢？

其实，通过上面介绍的几个 TypeScript 操作符，我们就可以将这类校验直接在编译期完成了。首先让我们来满足第一条的通用性要求：

```typescript
interface ImageElement {}
interface TextElement {}
// 无需继承，可以直接通过类型运算来实现
type Element = ImageElement | TextElement;

class History {
  // 直接标注 Element 类型
  commit(element: Element, from, to) {
    // ...
  }
}
```

上面的代码没有用到任何黑魔法，这里就不赘述了。重点在于第二条，如何根据 Element 类型来约束字段呢？联想到上面的 `keyof` 操作符，**我们很容易在类型空间里取出 Element 的所有 key**，并且还可以类比 ES6 中的 `{ [x]: 123 }` 语法，构建出类型空间里的新结构：

```typescript
type T = keyof Element; // T 为 'left' | 'top' 等字段的集合

// 将所有 T 的可选项作为 key
// 以 Element 中相应 value 的类型为 value
// 以此结构建立出一个新的类型变量
type MyElement1 = { [K in T]: Element[K] };

// 等价于这么写
type MyElement2 = { [K in keyof Element]: Element[K] };

let a: MyElement1; // 可以提示出 a.left 等 Element 中的字段
```

基于上面这些能力，我们就可以开始做体操动作了！首先我们在方法定义里引入泛型变量：

```typescript
class History {
  commit<T extends Element>(element: T, from, to) {
    // ...
  }
}
```

然后对这个 `T` 做 `keyof` 操作，用它的 key 来约束类型：

```typescript
// 这个 Partial 能帮助我们取出原始 T 类型结构的部分 key-value 子集
type Partial<T> = { [P in keyof T]?: T[P] | undefined };

class History {
  // U 的结构被限定成了 T 中所存在的 key-value
  commit<T extends Element, U extends Partial<{ [K in keyof T]: T[K] }>>(
    element: T,
    from: U,
    to: U
  ) {
    // ...
  }
}

// 这样我们仍然可以这样调用
history.commit(element, { left: 0 }, { left: 10 });

// 这样的字段 bug 就可以在编译期被发现
history.commit(element, { xxx: 0 }, { yyy: 1 });
```

这里先把 `T` 的结构用 `{ [K in keyof T]: T[K] }` 拿了出来，然后用 `Partial<T>` 来帮助我们获得这个结构的部分子集字段。例如 `{ a: number, b: number }` 的 Partial 子集就可以是 `{ a: number }`。TypeScript 还内置了很多这样的辅助类型，参见 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)。

然而上面的操作还不够，因为它无法解决下面这个问题：

```typescript
// 虽然 `from` 和 `to` 都有效，但它们二者的字段却对不上
history.commit(element, { left: 0 }, { top: 10 });
```

某种程度上，这种 bug 才是最可能出现的。我们能进一步通过类型操作来规避它吗？只要再引入一个类型变量，依葫芦画瓢地再做一次 `keyof` 操作就可以了：

```typescript
class History {
  commit<
    T extends Element,
    // 第二个参数的结构来自 T，而第三个参数的结构又来自第二个参数
    U extends Partial<{ [K in keyof T]: T[K] }>,
    V extends { [K in keyof U]: U[K] }
  >(element: T, from: U, to: V) {
    // ...
  }
}

// 现在 `from` 和 `to` 的字段就必须完全一致了
history.commit(element, { left: 0 }, { left: 10 });

// 上面问题就可以在编译期被校验掉
history.commit(element, { left: 0 }, { top: 10 });
```

好了，这个难度系数仅为 0.5 的体操顺利完成了。通过这种方式，我们通过寥寥几行类型空间的代码，就能借助 TypeScript 类型检查器的威力，将原本需要放在运行时的校验逻辑直接优化到在编译期完成，从而在性能和开发体验上都获得明显的提升，直接赢两次！

当然，相信可能很多同学会指出，这种手法还无法对运行时动态的数据做校验。但其实只要通过运行时库，**TypeScript 也可以用来写出语义化的运行时校验**。笔者贡献过的 [Superstruct](https://github.com/ianstormtaylor/superstruct) 和 @ 工业聚 的 [Farrow](https://github.com/farrow-js/farrow) 都做到了这一点（Farrow 已经做成了全家桶式的 Web 框架，但个人认为其中最创新的地方是其中可单独使用的 Schema 部分）。比如这样：

```typescript
import { assert, object, number, string, array } from "superstruct";

// 定义出校验结构，相当于运行时的 interface
const Article = object({
  id: number(),
  title: string(),
  tags: array(string()),
  author: object({
    id: number(),
  }),
});

const data = {
  id: 34,
  title: "Hello World",
  tags: ["news", "features"],
  author: {
    id: 1,
  },
};

// 这个 assert 发生在运行时而非编译时
assert(data, Article);
```

这样一来，我们就以 schema 为抓手，将类型空间的能力下沉到了值空间，拉通了端到端类型校验的全链路，形成了强类型闭环，赋能了运行时业务，打出了一套组合拳。试问能够如此这般成就用户的 TypeScript 赛道，足够击穿你的心智吗？

## 总结

本文对 TypeScript 中隐藏着的类型空间做了介绍，并介绍了在其中进行操作的一些基本手法（声明类型变量、从类型生成新类型等等）。对于未来的 low code 系统，如果我们对类型检查器具备更多的掌控，那么就有机会获得一些奇妙的的进步（举个例子，你觉得表单算不算一种依赖类型呢）。这方面仍然有非常大的想象空间。

另外顺便推荐一下知乎的[来玩 TypeScript 啊，机都给你开好了](https://www.zhihu.com/column/c_206498766)专栏，虽然我之前一直没看懂。

## 参考资料

- [What are some examples of type-level programming?](https://stackoverflow.com/questions/24481113/what-are-some-examples-of-type-level-programming)
- [What is the difference between type and class in Typescript?](https://stackoverflow.com/questions/51131898/what-is-the-difference-between-type-and-class-in-typescript/51132333#51132333)
- [TypeScript: Documentation - Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [TypeScript: Documentation - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript: Documentation - Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
