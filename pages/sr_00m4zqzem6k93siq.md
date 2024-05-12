---
title: "重学 TS"
date: 2023-03-20T14:35:55+08:00
draft: false
categories: [dev]
tags: [dev, ts]
---
> 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/614782362)

> 本文作者是蚂蚁集团前端工程师亦池，记录了重学 TS 过程中整理的一些笔记，有一些基础知识点、类型推导技巧、案例和习题。它不是一个完整的 TS 知识体系，重点记录了 TS 基础使用者容易被忽略而高阶体操需要的信息。

非常汗颜，写 ts 好多年了，虽然不是 anyscript 风格，但一直当作类型标注在写，顶多用用函数重载和范型，连 infer 是谁都不认识，虽然也从当年这个文章中：[用 TypeScript 类型运算实现一个中国象棋程序](https://zhuanlan.zhihu.com/p/426966480)，知道 ts 的能力，但当时的认知是这种花活大可不必 。

好像写了这么久的基础 ts 也相安无事，类型都在的。因为 ts 是一门语言，跟 js 一样，实现目标有很多路径，大不了你给每个函数、变量都显式注明类型，大家也都能用。但是不会使用类型推导方法你就得：

- 到处写相似的类型声明，他们本来是有关联的可以写辅助类型工具推导出来的
- 一旦有个地方需求变更需要改动类型，你可能要手动改动调用链上的 N 处
- 遇到项目中高阶选手写的推导类型一脸懵

只会写基础 TS 就跟处处写重复代码不会抽 通用模块、功能函数 的 js 初学者一样一样的，run 是能 run，就是有点费键盘。。。

TS 是一门语言，它拥有一套完整的基础语法，包括逻辑语句，可以做到各种转换和一些运算。要当一门语言来理解。

### 编辑器代码的实例

如果说我为啥突然想进修 ts，因为不想拉低语雀编辑器的 ts 水平。来看下这个我同事 箕宿 写的一段类型。 背景是这样的：

> 我们有一个抛出去的通用类 Viewer，现在要再另一个地方往这个类上加几个语雀环境下的业务相关的方法，不想污染原类 Viewer，语雀编辑器自行使用拓展后的的类来实例化。原 js 代码的实现模式其实就是 mixins，在原类的 prototype 上挂点方法。 问题是怎么给这个 mixin 加类型，我们对官方方案的非通用方法的 extends 不太满意。

难点：这个 mixin 返回的东西既是构造器方法类型，可以被外部直接 new 新的实例，所以也是类的实例，需要能获取原类和 mixin 上扩展的所有属性和方法。就像是构造了一个新的类，但是 ts 里 class 是无法实现多继承的。我们是要解决**一个多继承的有完善类型的推导问题，提供一个泛化的工具 mixin 能力。**

```typescript
export type TypeJoin<A extends any[]> = A extends [infer R, ...infer L]
  ? R & TypeJoin<L>
  : A;
export type Class<A extends any[] = any[], I = any> = new (...args: A) => I;
export type ClassInstance<T> = T extends Class<any[], infer R> ? R : never;
export type MixinType<O extends Class, T> = ClassInstance<O> & T;
export type MixinTypeClass<O extends Class, T> = Class<
  ConstructorParameters<O>,
  MixinType<O, T>
>;

export type ClassMix<
  Cs extends Class<void[]>[],
  Result extends any[] = []
> = Cs extends [infer R, ...infer L]
  ? L extends Class<void[]>[]
    ? ClassMix<L, [...Result, ClassInstance<R>]>
    : [...Result, ClassInstance<R>]
  : Result;

function extendsMultiple<Cs extends Class<void[]>[]>(
  ...args: Cs
): Class<void[], TypeJoin<ClassMix<Cs>>> {
  class mixed {}
  return mixed as Class<void[], TypeJoin<ClassMix<Cs>>>;
}

// 使用方式： 定义多个功能相对独立class
class Mix {
  bar = "123";
  getName(this: Foo) {
    return this.foo;
  }
}

class Mix2 {
  sayHello(this: Foo) {
    console.info(this.foo);
  }
}

// 业务使用方extends合并后的Class做实例化，其实实现上还是mixin拓展了原类的prototype，类似上面注释掉的mixin，这里聚焦在类型的实现上
class Foo extends extendsMultiple(Mix, Mix2) {
  foo = "FOO";
  constructor(private a: string) {
    super();
    this.foo = a;
  }
}

const a = new Foo("123");
// 现在a上有了Mix和Mix2双方的方法和属性
a.bar;
a.foo;
a.getName();
a.sayHello();
```

## 资料

- 基础：
- [https://www.typescriptlang.org/docs/handbook/intro.html](https://www.typescriptlang.org/docs/handbook/intro.html)，推荐直接通读官方文档，其他各种开发者二次分享的文档也都有官网知识点的影子。
- TS 内置的一些工具类型
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- 工具类型的内部实现：[https://roblox-ts.com/docs/api/utility-types/#omitthisparametert](https://roblox-ts.com/docs/api/utility-types/#omitthisparametert)
- this: [https://fettblog.eu/this-in-javascript-and-typescript/](https://fettblog.eu/this-in-javascript-and-typescript/)
- 解析和思想：
- [Typescript 类型编程，从入门到念头通达](https://juejin.cn/post/7132490947320872974)
- [TypeScript 中高级应用与最佳实践](https://juejin.cn/post/6844903904140853255)
- ts 体操：[https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)，刷题吧，少年 ～

## 有用的

### 基础

### 类型关系

类型之间的并集（`|`）会向上取顶部的类型。即 `never | 'a' => 'a'`，`unkown | 'a' => 'a'` 类型之间的交集（`&`）会向下取底部的类型。即 `never & 'a' = never`，`unkown & 'a' => unkown`

- bottom Type: never
- top type: unknown
- 既是 top 也是 bottom: any

### never

在 TypeScript 中，never 类型便为空类型和底部类型。never 类型的变量无法被赋值，与其他类型求交集为自身，求并集不参与运算。

### 应用一: 联合类型中的过滤

**never 在联合类型中会被过滤掉：**

```typescript
type Exclude<T, U> = T extends U ? never : T;

// 相当于: type A = 'a'
type A = Exclude<"x" | "a", "x" | "y" | "z">;

T | never; // 结果为T
T & never; // 结果为never
```

取一个映射类型中所有 value 为指定类型的 key。例如，已知某个 React 组件的 props 类型，我需要 “知道”（编程意义上）哪些参数是 function 类型。

```typescript
interface SomeProps {
  a: string;
  b: number;
  c: (e: MouseEvent) => void;
  d: (e: TouchEvent) => void;
}
// 如何得到 'c' | 'd' ？

type GetKeyByValueType<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never;
}[keyof T];

type FunctionPropNames = GetKeyByValueType<SomeProps, Function>; // 'c' | 'd'
```

运算过程如下：

```typescript
// 开始
{
    a: string
    b: number
    c: (e: MouseEvent) => void
    d: (e: TouchEvent) => void
}
// 第一步，条件映射
{
    a: never
    b: never
    c: 'c'
    d: 'd'
}
// 第二步，索引取值
never | never | 'c' | 'd'
// never的性质
'c' | 'd'
```

### 应用二：防御性编程

举个具体点的例子，当你有一个 union type:

```typescript
interface Foo {
  type: "foo";
}
interface Bar {
  type: "bar";
}
type All = Foo | Bar;
```

在 switch 当中判断 type，TS 是可以收窄类型的 (discriminated union)：

```typescript
function handleValue(val: All) {
  switch (val.type) {
    case "foo":
      // 这里 val 被收窄为 Foo
      break;
    case "bar":
      // val 在这里是 Bar
      break;
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val;
      break;
  }
}
```

注意在 default 里面我们把被收窄为 never 的 val 赋值给一个显式声明为 never 的变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事改了 All 的类型：

`type All = Foo | Bar | Baz`

然而他忘记了在 handleValue 里面加上针对 Baz 的处理逻辑，这个时候在 default branch 里面 val 会被收窄为 Baz，导致无法赋值给 never，产生一个编译错误。所以通过这个办法，你可以确保 handleValue 总是穷尽 (exhaust) 了所有 All 的可能类型。

### unknown

unknown 指的是**不可预先定义的类型**，在很多场景下，它可以替代 any 的功能同时保留静态检查的能力。

```typescript
const num: number = 10;
(num as unknown as string).split(""); // 注意，这里和any一样完全可以通过静态检查
```

这个时候 unknown 的作用就跟 any 高度类似了，你可以把它转化成任何类型，不同的地方是，在静态编译的时候，unknown 不能调用任何方法，而 any 可以。

```typescript
const foo: unknown = "string";
foo.substr(1); // Error: 静态检查不通过报错
const bar: any = 10;
bar.substr(1);
```

unknown 的一个使用场景是，避免使用 any 作为函数的参数类型而导致的静态类型检查 bug：

```typescript
function test(input: unknown): number {
  if (Array.isArray(input)) {
    return input.length; // Pass: 这个代码块中，类型守卫已经将input识别为array类型
  }
  return input.length; // Error: 这里的input还是unknown类型，静态检查报错。如果入参是any，则会放弃检查直接成功，带来报错风险
}
```

我们在一些无法确定函数参数（返回值）类型中 unknown 使用的场景非常多

```typescript
// 在不确定函数参数的类型时
// 将函数的参数声明为unknown类型而非any
// TS同样会对于unknown进行类型检测，而any就不会
function resultValueBySome(val: unknown) {
  if (typeof val === "string") {
    // 此时 val 是string类型
    // do someThing
  } else if (typeof val === "number") {
    // 此时 val 是number类型
    // do someThing
  }
  // ...
}
```

### 联合类型

```typescript
type A<T> = T extends { a: infer U; b: infer U } ? U : any;
type Foo = A<{ a: number; b: string }>; // type Foo = string | number
```

声明多个同名 类型变量 也会被推断为联合类型

### 函数类型

```typescript
type FnType = (x: number, y: number) => number;

function fn(): number {
  return 1;
}

const fn = function (): number {
  return 1;
};

const fn = (): number => {
  return 1;
};

const obj = {
  fn(): number {
    return 1;
  },
};
```

函数的类型声明格式很多样，记住是在 () 后面添加返回值类型即可。

**重载签名的类型不会合并：**

```typescript
// 重载签名（函数类型定义）
function toString(x: string): string;
function toString(x: number): string;

// 实现签名（函数体具体实现）
function toString(x: string | number) {
  return String(x);
}

function stringOrNumber(x): string | number {
  return x ? "" : 0;
}

// input 是 string 和 number 的联合类型
// 即 string | number
const input = stringOrNumber(1);

toString("hello"); // ok
toString(2); // ok
toString(input); // error
```

链式的函数可以在返回函数中再添加范型

```typescript
type Join<T extends string[], U extends string, Acc extends string = ''> =
T extends [infer First extends string, ...infer Rest extends string[]]
? Rest extends []
  ? `${Acc}${First}`
  : Join<Rest, U,`${Acc}${First}${U}`>
: Acc

declare function join<T extends string>(delimiter: T): <S extends string[]>(...parts: S) => Join<S, T>

declare const hyphenJoiner = join('-')
declare const result = hyphenJoiner('a', 'b', 'c'); // = 'a-b-c'
join('#')('a', 'b', 'c') // = 'a#b#c'
```

### 泛型

除了传入的范型，还可以利用传入的范型组合新的范型，就类似像是对一个处理函数，利用函数参数的运算，组合了一个新的在函数作用域内的变量。

举例： Overwrite 从 U 中的同名属性的类型覆盖 T 中的同名属性类型。(后者中的同名属性覆盖前者)

```typescript
/**
 * Overwrite实现
 * 获取前者独有的key和类型，再取两者共有的key和该key在后者中的类型，最后合并。
 */
// 从T中提取存在于U中的key和对应的类型
type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

// 从T中排除存在于U中的key和类型
type Diff<T extends object, U extends object> = Pick<
  T,
  Exclude<keyof T, keyof U>
>;

type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

/**
 * @example
 * type Eg = { key1: string; other: boolean }
 */
type Eg = Overwrite<{ key1: number; other: boolean }, { key1: string }>;
```

### extends 条件语句

这是类型推导绕不开的工具，因为我一开始就比较熟悉这个，不贴资料了。

### infer

基础概念看[文档](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)。infer 一定用在 extends 语句后表示待推断的类型，对于新手来说，理解一下 infer 不仅可以作为函数入参出参的推断类型，可以在任意地方成为推断类型，譬如数组、字符串内部。 **extends 和 infer 是走入类型推断高阶 ts 的基石，是最常用的工具。**

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/80d8ebb1.jpe)

### 递归

数组和字符串都有自己的递归方法。详细可查阅文档。

### 数组

```typescript
type LoopArr<T extends any[]> = T extends [infer P, ...infer R]
  ? // can do something with P
    [P, ...LoopArr<R>]
  : [];
```

_该 example 没有任何实际意义，仅仅展示一下递归的方式_

如果没有指定特定的子序列，P 是每次都是数组的第一项，达到逐项遍历，你也可以给指定一个子序列，从某一部分开始遍历，譬如 `T extends [ 2, 3 , infer P, ...infer R]`

### 字符串

```typescript
type LoopStr<T extends string> = T extends `${infer P}${infer R}`
  ? // can do something with P
    `${P}${LoopStr<R>}`
  : "";
```

_该 example 没有任何实际意义，仅仅展示一下递归的方式_

如果没有指定特定的子字符序列，P 是每次都是字符串中的第一个字符，达到逐项遍历，你也可以给指定一个子序列，从某一部分开始遍历，譬如 `T extends` ABC${infer P}${infer R}``

### 类

初学者一定对 class 这种类型感到困惑，因为他们有时候代表类的实例类型，有时候代表构造器方法类型

```typescript
/**
 * 定义一个类
 */
class People {
  name: number;
  age: number;
  constructor() {}
}

// p1可以正常赋值
const p1: People = new People();
// 等号后面的People报错，类型“typeof People”缺少类型“People”中的以下属性: name, age
const p2: People = People;

// p3报错，类型 "People" 中缺少属性 "prototype"，但类型 "typeof People" 中需要该属性
const p3: typeof People = new People();
// p4可以正常赋值
const p4: typeof People = People;
```

结论是这样的：

- 当把类直接作为类型时，该类型约束的是该类型必须是类的实例；即该类型获取的是该类上的实例属性和实例方法（也叫原型方法）；
- 当把 typeof 类作为类型时，约束的满足该类的类型；即该类型获取的是该类上的静态属性和方法。
- 静态属性和静态方法的继承，即属性和方法不是挂载到构造函数的 prototype 原型上的，而是直接挂载到构造函数本身。
- new 关键字用在类型上，表示构造函数的类型。
- 当我们声明一个类的时候，其实声明的是这个类的实例类型和静态类型两个类型。

这里有一些信息和 js 中原型链形成的类的继承有相关性

- [TypeScript 高级用法详解](https://juejin.cn/post/6844904021300346887)
- [js 中 proto 和 prototype 的区别和关系？](https://www.zhihu.com/question/34183746)
- [详解 Typescript 里的 This](https://zhuanlan.zhihu.com/p/104565681)
- [Typescript: extending "this" inside class](https://stackoverflow.com/questions/60696671/typescript-extending-this-inside-class)

而 instanceof 的右侧要求是一个构造函数，TypeScript 将细化为：

- 此构造函数的 prototype 属性的类型，如果它的类型不为 any 的话
- 构造签名所返回的类型的联合

### 好用的小特性

### name!

如果你打算通过构造函数以外的其他方式去初始化类中的字段 (例如，也许外部库一定会帮你填充类的一部分)，则可以使用 确定赋值断言运算符 `!`，它只能被用在你确定安全的地方

```typescript
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
Try;
```

### Type-only Field Declarations

当 `target >= ES2022` 或者 配置文件里的 `useDefineForClassFields` 是 `true` 时, 类字段在父类构造函数完成后初始化，覆盖父类设置的任何值。当您只想为继承的字段重新声明更准确的类型时，这可能是一个问题。要处理这些情况，你可以写 声明 向 TypeScript 指示此字段声明不应有运行时效果。

```typescript
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Does not emit JavaScript code,
  // only ensures the types are correct
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
Try;
```

### class constructor parameter properties

TypeScript 提供了特殊的语法，用于将构造函数参数转换为具有相同名称和值的类属性。这些叫做 `parameter properties` ，是通过在构造函数参数之前加上可见性修饰符之一来创建的： `public`, `private`, `protected`, `readonly`，这种做法代码上比较简洁：

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
(property) Params.x: number
console.log(a.z);Property 'z' is private and only accessible within class 'Params'.Property 'z' is private and only accessible within class 'Params'.Try
```

### 类型谓词 is

- 语法：parameterName is TypeparameterName

必须是来自于当前函数签名里的一个参数名，判断 parameterName 是否是 Type 类型。**类型谓词执行结果将会匹配 boolean 类型**

is 关键字用在函数的返回值上，用来表示对于函数返回值的类型保护。

```typescript
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}

function fn(x: string | number) {
  if (isString(x)) {
    return x.length; // error 类型“string | number”上不存在属性“length”。
  } else {
    // .....
  }
}

// =>
function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

function fn(x: string | number) {
  if (isString(x)) {
    return x.length;
  } else {
    // .....
  }
}
```

上面的例子还不明显，毕竟是因为 ts 解析器对 Object.prototype.toString 没有实现类型推断，我们要是用 `typeof x === 'string'`，利用 typeof 具有类型推断的能力一样达到效果

但总有些类型是不能依靠 typeof 的能力的，譬如朋友提出的这个：

```typescript
interface TA {
  a: number;
}

interface TB {
  b: number;
}

function cookTest(val: TA | TB) {
  if (val.a) {
    // error: Property 'a' does not exist on type 'TA | TB'.
  }
}
```

这时候 is 就可以用起来了：

```typescript
interface TA {
  a: number;
}

interface TB {
  b: number;
}

function getA(params: TA | TB): params is TA {
  return "a" in params;
}

function cookTest(val: TA | TB) {
  const a = getA(val) ? val.a : ""; // 安全
}
```

当然我依旧觉得这不是最好的例子，这么繁琐的用法，在这里我宁愿用 `val as TA` 。

所以，**通常我们使用 is 关键字（类型谓词）在函数的返回值中，从而对于函数传入的参数进行类型保护**。

### 修饰符的加减

TS 中引入了两个修饰符来**精确控制**添加或者移除映射属性的 "?" 修饰符和 readonly 修饰符

```typescript
type T0<T> = { -readonly [P in keyof T]-?: T[P] };
type T1<T> = { +readonly [P in keyof T]+?: T[P] };
```

解释：

- "+" 修饰符，为映射属性**添加** "?" 修饰符或者 readonly
- "-" 修饰符，为映射属性**移除** "?" 修饰符或者 readonly
- "+" 或者 "-" 修饰符**必须应用**在 "?" 修饰符或者 readonly **之前**
- 对于 "+" 修饰符， 明确的添加与省略它的作用是相同的，所以通常都省略。 例如 "+readonly" 等同于 "readonly"

### ✨ 联合类型的父子关系

当子类型与父类型组成联合类型时，实际效果等于父类型。例如：

```typescript
type A = number | 1; // number
type B = never | string; // string （never 前面说了是所有类型的子类型）
```

利用 `never | others = others` 的特性可以实现 object 的过滤，譬如：

```typescript
type ExtractFun<T> = {
  [key in keyof T]: T[key] extends Function ? key : never;
}[keyof T];

type PickFun<T> = Pick<T, ExtractFun<T>>;

type Origin = {
  count: number;
  message: string;
  method(): void;
};
type test0 = onlyFunKey<Origin>;
/**
test0 = {
    method(): void
}
**/
```

### this

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/432c15c0.jpe)

虽然 this 的声明在转化成 js 后会丢失，但是在 ts 中会发现不符合声明条件的调用，提前拦住错误

### 映射类型中的 in

in 可以解决：`An index signature parameter type cannot be a literal type or generic type`

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/f3786a90.jpe)

```typescript
type name = "firstName" | "lastName";
type TName = {
  [key in name]: string;
};
```

### interface 和 type 关键字

interface 和 type 两个关键字因为其功能比较接近，常常引起新手的疑问：应该在什么时候用 type，什么时候用 interface？ interface 的特点如下： :::info

- 同名 interface 自动聚合，也可以和已有的同名 class 聚合，适合做 polyfill
- 自身只能表示 object/class/function 的类型 ::: 建议**库的开发者所提供的公共 api 应该尽量用 interface/class**，方便使用者自行扩展。举个例子，monaco 缺失了一些需要的 API，所以需要手动 polyfill 一下。

```typescript
/**
 * Cloud Studio使用的monaco版本较老0.14.3，和官方文档相比缺失部分功能
 * 另外vscode有一些特有的功能，必须适配
 * 故在这里手动实现作为补充
 */
declare module monaco {
  interface Position {
    delta(deltaLineNumber?: number, deltaColumn?: number): Position;
  }
}

// monaco 0.15.5
monaco.Position.prototype.delta = function (
  this: monaco.Position,
  deltaLineNumber = 0,
  deltaColumn = 0
) {
  return new monaco.Position(
    this.lineNumber + deltaLineNumber,
    this.column + deltaColumn
  );
};
```

与 interface 相比，type 的特点如下： :::info

- 表达功能更强大，不局限于 object/class/function
- 要扩展已有 type 需要创建新 type，不可以重名
- 支持更复杂的类型操作 ::: 基本上所有用 interface 表达的类型都有其等价的 type 表达。但在实践的过程中，也发现了一种类型只能用 interface 表达，无法用 type 表达，那就是往函数上挂载属性。

```typescript
interface FuncWithAttachment {
    (param: string): boolean;
    someProperty: number;
}

const testFunc: FuncWithAttachment = ...;
const result = testFunc('mike');    // 有类型提醒
testFunc.someProperty = 3;    // 有类型提醒
```

from [《TypeScript 中高级应用与最佳实践》](https://juejin.cn/post/6844903904140853255)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/de6994e6.jpe)

目前语雀编辑器内部也是除了对外抛出的接口定义约束用的 interface，内部的类型都尽量用的 type。

### 环境 Ambient Modules

在实际应用开发时有一种场景，当前作用域下可以访问某个变量，但这个变量并不由开发者控制。例如通过 Script 标签直接引入的第三方库 CDN、一些宿主环境的 API 等。这个时候可以利用 TS 的环境声明功能，来告诉 TS 当前作用域可以访问这些变量，以获得类型提醒。

具体有两种方式，declare 和三斜线指令。

```typescript
declare const IS_MOBILE = true; // 编译后此行消失
const wording = IS_MOBILE ? "移动端" : "PC端";
```

用三斜线指令可以一次性引入整个类型声明文件。

```typescript
/// <reference path="../typings/monaco.d.ts" />
const range = new monaco.Range(2, 3, 6, 7);
```

### 类型兼容性 - 逆变 / 协变

先说，逆变是我在 ts 接触到的最难理解的部分。

### 概念

集合论中，如果一个集合的所有元素在集合 B 中都存在，则 A 是 B 的子集；

**类型系统中，如果一个类型的属性更具体，则该类型是子类型。（因为属性更少则说明该类型约束的更宽泛，是父类型）**（子类型更具体，父类型更宽泛）（子类型可以赋值给父类型）

类中，如果一个类继承另一个类，可能做了扩展，属性更多，则是子类（子类更具体，父类更宽泛）（子类可以安全覆盖父类）。

**因此，我们可以得出基本的结论：子类型比父类型更加具体, 父类型比子类型更宽泛。** 下面我们也将基于类型的可复制性（可分配性）、协变、逆变、双向协变等进行进一步的讲解。

> 协变与逆变 (Covariance and contravariance) 是在计算机科学中，描述具有父 / 子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父 / 子型别关系的用语。
> 具有父子关系的多个类型，在通过某种构造关系构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

let Eg1: Animal;
let Eg2: Dog;
// 兼容，可以赋值
Eg1 = Eg2;

let Eg3: Array<Animal>;
let Eg4: Array<Dog>;
// 兼容，可以赋值
Eg3 = Eg4;

type AnimalFn = (arg: Animal) => void;
type DogFn = (arg: Dog) => void;

let Eg1Fn: AnimalFn;
let Eg2Fn: DogFn;
// 不再可以赋值了，
// AnimalFn = DogFn不可以赋值了, Animal = Dog是可以的
Eg1Fn = Eg2Fn;
```

假设可以赋值，则传递参数的约束是原始的更少的 Animal 相关约束，但是调用时的实现却是赋值的 Dog 的实现，会出现实现调用的内容可能比约束更多，譬如实现上 Eg2Fn 里可能调用了只有 Dog 上出现的方法，不安全。所以不允许。

普通情况下，子类型可以赋值给父类型。但是**在作为函数参数时，子类型参数的函数不再可以赋值给接受父类型参数的函数。即** `**type Fn<T> = (arg: T) => void**` **构造器构造后，父子关系逆转了，此时成为 “逆变”。**

为了方便，约定 A → B 指的是以 A 为参数类型，以 B 为返回值类型的函数类型。

参数类型一定是 T 及其子类，那么它也一定满足继承于 T 的超类。

返回值只能使用 T 及其超类上的方法，那么它是 T 的子类时才一定可以调用这些方法。

此时，我们称 返回值类型是协变的，而参数类型是逆变的。

A ≼ B 意味着 A 是 B 的子类型。

返回值类型是协变的，意思是 A ≼ B 就意味着 (T → A) ≼ (T → B) 。

参数类型是逆变的，意思是 A ≼ B 就意味着 (B → T) ≼ (A → T)

**即逆变是缩小类型范围的表现，协变是放大类型范围的表现。**

### 特性

函数的参数类型赋值就被称为逆变，参数少（父）的可以赋给参数多（子）的那一个。看起来和类型兼容性（多的可以赋给少的）相反。为什么？？？不理解这种反安全性的设计

```typescript
let fn1!: (a: string, b: number) => void;
let fn2!: (a: string, b: number, c: boolean) => void;
fn2 = fn1; // 正确，被允许
fn1 = fn2; // error
type IParent = () => void;
type IChild = (val: string) => void;

let parentTest: IParent = () => {};
let childTest: IChild = (val) => {
  console.log(val);
};

childTest = parentTest; // ok
parentTest = childTest; // error

let parentTest2: IParent = (val) => {
  console.log(val);
}; // error
let childTest2: IChild = () => {}; // ok
```

实现比类型定义更少的参数是合法的，但实现比类型定义更多的参数是违法的。

这个很反直觉，一个理解方式是，**把类型声明当成生产方，实现当成消费方，消费了生产方不存在的参数是行不通的，也就是实现不能比类型定义多出参数。但是生产方提供了更多的内容，消费方不处理是没关系的，也就是实现可以比类型定义少参数。**

**函数类型赋值兼容时函数的返回值就是典型的协变场景**

```typescript
let fn1!: (a: string, b: number) => string;
let fn2!: (a: string, b: number) => string | number | boolean;
fn2 = fn1; // correct
fn1 = fn2; // error: 不可以将 string|number|boolean 赋给 string 类型
```

这是调用结果之间的赋值，要保证安全性。 对于函数类型来说，函数参数的类型兼容是反向的，我们称之为 逆变 ，返回值的类型兼容是正向的，称之为 协变 。

### 类型推导工具中的应用

- infer 推导的名称相同并且都处于**逆变**的位置，则推导的结果将会是**交叉类型**。

```typescript
type Bar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : never;

// type T1 = string
type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;

// type T2 = never
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
```

- infer 推导的名称相同并且都处于**协变**的位置，则推导的结果将会是**联合类型**。

```typescript
type Foo<T> = T extends {
  a: infer U;
  b: infer U;
}
  ? U
  : never;

// type T1 = string
type T1 = Foo<{ a: string; b: string }>;

// type T2 = string | number
type T2 = Foo<{ a: string; b: number }>;
```

### 一个不能理解的例子

```typescript
// lib.dom.d.ts中EventListener的接口定义
interface EventListener {
  (evt: Event): void;
}
// 简化后的Event
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}
// 简化合并后的MouseEvent
interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

// 简化后的Window接口
interface Window {
  // 简化后的addEventListener
  addEventListener(type: string, listener: EventListener);
}

// 日常使用
window.addEventListener("click", (e: Event) => {});
window.addEventListener("mouseover", (e: MouseEvent) => {});
```

可以看到 Window 的 listener 函数要求参数是 Event，但是日常使用时更多时候传入的是 Event 子类型，与上述不符。但是这里可以正常使用，正是其默认行为是**双向协变**的原因。可以通过 tsconfig.js 中修改 strictFunctionType 属性来严格控制协变和逆变。这个双向协变是我不能理解的。。。。

### 资料

- [《Ts 高手篇：22 个示例深入讲解 Ts 最晦涩难懂的高级类型工具》](https://juejin.cn/post/6994102811218673700)
- [一个逆变应用的列子：《TypeScript: Union to intersection type[TypeScript 高级类型编程初级教程][全文翻译]》](https://juejin.cn/post/7035887669054242823)
- [《typescript 难点：顺变和逆变》](https://juejin.cn/post/6844904066821128199)
- [https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)

## 反直觉

### 数组是对象的一种

```typescript
// Ts 示例：希望 [1, () => number, string] 能够被处理成 [1, number, string]
// 对象遍历的方式
type GetType1<T extends any[]> = {
  [K in keyof T]: T[K] extends () => infer R ? R : T[K];
};

type GetType1Test = GetType1<[1, () => number, string]>;
```

**数组是 key 为 0，1，2 等数字索引的特殊对象，都可以用映射类型的 in 遍历**

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/ae8936a4.jpe)

### 对象继承时初始化的顺序

在某些情况下，JavaScript 类初始化的顺序可能令人惊讶。让我们考虑一下这段代码:

```typescript
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

这里发生了什么？ 由 JavaScript 定义的类初始化顺序为:

- 基类字段已初始化
- 基类构造函数运行
- 派生类字段已初始化
- 派生类构造函数运行

这意味着基类构造函数在其自己的构造函数中看到了自己的 name 值，因为派生类字段初始化尚未运行。

### keyof 索引是公有属性 key 的联合

keyof 索引查询

对应任何类型 T, keyof T 的结果为该类型上所有公有属性 key 的联合：

```typescript
interface Eg1 {
  name: string;
  readonly age: number;
}
// T1的类型实则是name | age
type T1 = keyof Eg1;

class Eg2 {
  private name: string;
  public readonly age: number;
  protected home: string;
}
// T2实则被约束为 age
// 而name和home不是公有属性，所以不能被keyof获取到
type T2 = keyof Eg2;
```

索引访问：

```typescript
interface Eg1 {
  name: string;
  readonly age: number;
}
// string
type V1 = Eg1["name"];
// string | number
type V2 = Eg1["name" | "age"];
// any
type V2 = Eg1["name" | "age2222"];
// string | number
type V3 = Eg1[keyof Eg1];
```

如果 [] 中的 key 有不存在 T 中的，则是 any；

交叉类型取的多个类型的并集，但是如果相同 key 但是类型不同，则该 key 为 never。

### 条件类型的分布式特性

```typescript
/**
 * @example
 * type A1 = 1
 */
type A1 = "x" extends "x" ? 1 : 2;

/**
 * @example
 * type A2 = 2
 */
type A2 = "x" | "y" extends "x" ? 1 : 2;

/**
 * @example
 * type A3 = 1 | 2
 */
type P<T> = T extends "x" ? 1 : 2;
type A3 = P<"x" | "y">;
```

为什么 A2 和 A3 的值不一样？

- 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型
- 若 extends 前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给 extends 后面的类型（是一个分发的过程）。

**总结，就是 extends 前面的参数为联合类型时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。**

如果不想被分解（分发），做法也很简单，可以通过简单的元组类型包裹以下：

```typescript
type P<T> = [T] extends ["x"] ? 1 : 2;
/**
 * type A4 = 2;
 */
type A4 = P<"x" | "y">;
```

### 赋值

```typescript
interface testA {
  findElementById: IInterfaces["findElementById"];
  extractMention: IInterfaces["extractMention"];
}

let testa: testA;
(Object.keys(interfaces) as Array<keyof IInterfaces>).forEach((name) => {
  testa[name] = interfaces[name];
});
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/81d3d2d0.jpe)

不允许把一个整体拆开一次次赋值

### enum

enum 在 TS 中出现的比较早，它引入了 JavaScript 没有的数据结构（编译成一个双向 map），入侵了运行时，与 TypeScript 宗旨不符。用 string literal union（'small' | 'big' | 'large'）可以做到相同的事，且在 debug 时可读性更好。如果很在意条件比较的性能，应该用二进制 flag 加位运算。

```typescript
// TypeScript
enum Size {
  small = 3,
  big,
  large,
}
const a: Size = Size.large; // 5

// 编译为
var Size;
(function (Size) {
  Size[(Size["small"] = 3)] = "small";
  Size[(Size["big"] = 4)] = "big";
  Size[(Size["large"] = 5)] = "large";
})(Size || (Size = {}));
const a = Size.large; // 5
```

### 对象字面量的 excess property check

子类型中必须包含源类型所有的属性和方法:

```typescript
function getPointX(point: { x: number }) {
  return point.x;
}

const point = {
  x: 1,
  y: "2",
};

getPointX(point); // OK
```

**注意**: 如果直接传入一个对象字面量是会报错的：

```typescript
function getPointX(point: { x: number }) {
  return point.x;
}

getPointX({ x: 1, y: "2" }); // error
```

这是 ts 中的另一个特性，叫做: **excess property check** ，**当传入的参数是一个对象字面量时，会进行额外属性检查。**

### 全局模块 vs. 文件模块

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/632edb31.jpe)

## 刷题习得黑魔法

### 字符串、数组拆解

数组可以直接用类似 js 的 `[infer start, ...infer M, infer end]` 来获得一个数组的第一个和最后一个值。 字符串也是 `${infer L}${infer M}${infer R}`，但注意这里 L 是第一个字符，M 是第二个字符，R 是剩下的字符，如果字符只有 2 个，则 R 是''，如果字符只有一位，则无法这么拆解成 3 个变量，`T extends`${infer L}${infer M}${infer R}`` 条件会走到 false 的语句里去，这一点比较奇怪。

```typescript
// 15 实现一个通用Last<T>，它接受一个数组T并返回其最后一个元素的类型。
type Last<T extends any[]> = T extends [...infer B, infer P] ? P : never;

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type tail1 = Last<arr1>; // expected to be 'c'
type tail2 = Last<arr2>; // expected to be 1

// 实现 Replace<S, From, To> 将字符串 S 中的第一个子字符串 From 替换为 To 。
type Replace<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer L}${From}${infer R}`
  ? `${L}${To}${R}`
  : S;

type replaced = Replace<"types are fun!", "fun", "awesome">; // 期望是 'types are awesome!'
```

Replace 的用法可见字符串拆解时，变量位置明确时可以是多个字符的字符串

### 遍历

### 联合类型

类似结构的联合类型可以直接通过 extends 条件语句遍历到

```typescript
interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}

interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}

type LookUp<T, K extends string> = T extends { type: K } ? T : never;

type MyDog = LookUp<Cat | Dog, "dog">; // expected to be `Dog`
```

这个特性可以做些变态的事了，譬如把联合类型组成笛卡尔积的数组，直接看：[https://github.com/type-challenges/type-challenges/issues/614](https://github.com/type-challenges/type-challenges/issues/614)

```typescript
type Permutation<T, K = T> = [T] extends [never]
  ? []
  : K extends K
  ? [K, ...Permutation<Exclude<T, K>>]
  : never;

type perm = Permutation<"A" | "B" | "C">;
// ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

### 映射类型

通过 `extends keyof T` 进行遍历

```typescript
type ObjectEntries<
  T extends Record<string, any>,
  K = keyof T
> = K extends keyof T ? [K, T[K]] : [];

interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model>; // ['name', string] | ['age', number] | ['locations', string[] | null];
```

### 元组

元组的遍历，借助元组解构逐个处理逻辑，再把剩下的元组迭代调用当前的类型分析器

```typescript
type PromiseParseAll<T extends any[]> = T extends [infer P, ...infer O]
  ? P extends Promise<infer R>
    ? [R, ...PromiseParseAll<O>]
    : [P, ...PromiseParseAll<O>]
  : [];
type PromiseAll<T extends any[]> = Promise<PromiseParseAll<T>>;
// expected to be `Promise<[number, 42, string]>`
type PRes = PromiseAll<[Promise<number>, 42, Promise<string>]>;
```

### 字符串

字符串类似

```typescript
type TrimLeft<T extends string> = T extends `${infer L}${infer R}`
  ? L extends " " | "\n" | "\t"
    ? TrimLeft<R>
    : T
  : never;
type trimed = TrimLeft<"  Hello World ">; // 应推导出 'Hello World '
```

### 字符串转数字

使用场景：字符串的逐个解析有递归特性，我们可以转成字符串后做一些这方面的处理，处理完后还需要转回去

```typescript
type ToNumber<T> = T extends `${infer N extends number}`
  ? N
  : T
```

### 映射类型 key 值的交集与并集

```typescript
type foo = {
  name: string;
  age: string;
};

type coo = {
  age: number;
  sex: string;
};

type TestUnion = keyof foo | keyof coo; // 'name' | 'age' | 'sex'
type TestBoth = keyof (foo | coo); // 'age'
```

### 联合类型变交叉类型

利用函数入参的逆变特性，把输入类型构建成函数参数

```typescript
type UnionToIntersection<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => any
  ? I
  : never;
type TestUnion2Intersection = UnionToIntersection<
  { a: 1 } | { b: 2 } | { c: 3 }
>;
// expected to be {a: 1} & {b: 2} & {c: 3}
```

### 联合类型转元组 - 多个函数交集的返回值类型只取最后一个

`(()=>a) & (()=>b) & (()=>c)` 获得这些函数返回值会是 c

```typescript
//需要了解性质：多个函数交集的返回值类型只取最后一个！(This is Important!)
//例如：
// type Intersepted = (() => 'a') & (() => 'b') & (() => 'c')
// type Last = Intersepted extends () => infer R ? R : never // 'c'
//参考：https://github.com/type-challenges/type-challenges/issues/21658#issue-1523555097

/**并集转交集 */
type UnionToIntersection<T> = (T extends T ? (args: T) => any : never)
  extends (args: infer P) => any
  ? P
  : never;    // a | b | c ==> a & b & c
/**联合类型最后一个 */
type UnionLast<T> = (UnionToIntersection<T extends T ? () => T : never>)
  extends () => infer R ? R : never;           // a | b | c ==> (()=>a) | (()=>b) | (()=>c) ==> (()=>a) & (()=>b) & (()=>c) ==> c

type UnionToTuple<T> = [T] extends [never]
  ? []
  : [UnionLast<T>, ...UnionToTuple<Exclude<T, UnionLast<T>>>];

type TestUnionToTuple1 = UnionToTuple<1>           // [1]
type TestUnionToTuple2 = UnionToTuple<'any' | 'a'> // ['any','a']
Equal<UnionToTuple<any | 'a'>,       UnionToTuple<any>>         // will always be a true
Equal<UnionToTuple<unknown | 'a'>,   UnionToTuple<unknown>>     // will always be a true
Equal<UnionToTuple<never | 'a'>,     UnionToTuple<'a'>>         // will always be a true
Equal<UnionToTuple<'a' | 'a' | 'a'>, UnionToTuple<'a'>>         // will always be a true
```

### 判断两个类型相等

大多数非严格情况下的相等使用 `A extends B` 基本可以做到，譬如前一步的类型中间方法根据条件返回了 true 或 false，接下来要判断结果是否是 true，直接用 `T extends true ? xxx : xxx` 进行接下来的操作就好。

但是枚举类型下，extends 无法很好的区分是否可选，是否只读的区别。

```typescript
type a = { a: string } extends { readonly a: string } ? true : false; // true
type b = { readonly a: string } extends { a: string } ? true : false; // true
type c = { a: string } extends { a?: string } ? true : false; // true
type d = { a?: string } extends { a: string } ? true : false; // false
```

所以严格的相等要借助函数的协变，具体的逻辑我也没 get 到。。。

```typescript
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;
```

### 判断 never

先来看一个反直觉的现象：

```typescript
// 1.
type JudgeNever = never extends never ? true : false; // true

// 2.
type TryIsNever<T extends any> = T extends never ? true : false;
type testTryIsNever = TryIsNever<never>; // never

// 3.
type IsNever<T extends any> = [T] extends [never] ? true : false;
type testIsNever = IsNever<never>; // true
```

非常难以理解是不

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/22301892.jpe)

详情：

大概意思就是：never 是一个特殊的联合类型（它本身是一个底部类型），它没有任何一个成员，而根据 Distributive Conditional Types，联合类型作为泛型传入后，会分开计算，因此当输入是 never 时，因为他一个成员都没有，自然也不需要计算了，直接返回 never。而 `[T]` 是 ts 实现的一个特性，能够打破这种 Distributive Conditional Types 规则。 然后似乎范型默认是当联合类型处理条件语句？所以 1 和 2 的结构不同 如果不能理解咱就记住：`[T] extends [never]` 只能这么判断类型是否是 never

### ❓❓❓T extends never 的作用

```typescript
// 解析：https://github.com/type-challenges/type-challenges/issues/22792、
// https://github.com/type-challenges/type-challenges/issues/1140
type IsUnion<T, Copy = T> = [T] extends [never]
  ? false
  : T extends never
  ? false
  : [Copy] extends [T]
  ? false
  : true;

type TestN<T, Copy = T> = T extends never
  ? false
  : [Copy] extends [T]
  ? false
  : true;
type TestNI = TestN<string | number>; // true

type TestNC<T, Copy = T> = [Copy] extends [T] ? false : true;
type TestNCI = TestNC<string | number>; // false
```

为什么 TestNI 和 TestNCI 如此不同， `T extends never` 的作用究竟是什么？

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/dbb35bbc.jpe)

让我们来看看：

```typescript
type Hmm<T> = keyof T extends never ? true : false;
// 如前人所说是true
// 1.
type testMapVal = Hmm<{ a: string } | { b: string }>; // true

type testUnionMapKeyType = keyof ({ a: string } | { b: string }); // never
// 几个没有共同属性的映射类型的联合类型的keyof 是never

type TestUnkown<T> = T extends never ? true : false;
// 2.
type testUnionMapKey = TestUnkown<keyof ({ a: string } | { b: string })>; // never
```

1 和 2 的差异乍一看很奇怪，但是看了上一张我们知道 1 中 `keyof T extends never` 等同于 `never extends never` 就是 true。2 中 keyof 是先求值再作为范型传进去，按照联合类型分配律，never 这个底部类型组成的联合类型没有成员，不会执行条件语句，也就返回 never 了。

再回头看看这一段

```typescript
type IsUnion<T, Copy = T> = [T] extends [never]
  ? false
  : T extends never
  ? false
  : [Copy] extends [T]
  ? false
  : true;
```

- 第 1 个条件让 T 为 never 类型时返回 false
- 第 2 个条件是进行联合类型进行分配律拆解进入下一步骤的桥梁？并不是用来做条件判断的，上一步已经排除 never 类型后，这里都会判断为不成立。
- 第 3 个条件 `[Copy] extends [T]` 是要求不使用分配律来判断结果，大胆推测这里只是不对 copy 用分配律，copy 只能是联合类型，T 依旧可以是联合类型中的某一个，所以联合类型 `[number|string] extends [string]` 就会进入到为假的语句里返回 true，有且只有联合类型能做到这样

啊。。。我强行解释也解释不了了，谁能解释留言教教我 。

回到这题不纠结 never，肯能换种写法更好理解

```typescript
IsUnion<T, B = T> = [T] extends [never]
  ? false
  : (T extends T
     ? [B] extends [T]
        ? false
        : true
     : never
  );
```

:::info 这里还有一个技巧 `IsUnion<T, B = T>` 看上去 B 和 T 是一样，但其实当 T 为联合类型时，B 可能为其中任意一种子类型，譬如 T 是 `string|number`，B 可以是 `number` :::

### 枚举类型 key 的重新映射和过滤

可以使用 `Key in keyof T as XXX`，对枚举类型重新封装生成新类型 如果 as 后的类型是 `never` 则会在结果中过滤掉这个类型。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/e9bbcb23.jpe)

> Implement RemoveIndexSignature , exclude the index signature from object types.

```typescript
type TypeLiteralOnly<T> = string extends T
  ? never
  : number extends T
  ? never
  : boolean extends T
  ? never
  : symbol extends T
  ? never
  : T;

type RemoveIndexSignature<T> = {
  [Key in keyof T as TypeLiteralOnly<Key>]: T[Key];
};
type FooRemove = {
  [key: string]: any;
  foo(): void;
};

type ARemove = RemoveIndexSignature<FooRemove>; // expected { foo(): void }
```

### 枚举可能性组合 - 联合类型

联合类型在遍历时能产生枚举的效果：

```typescript
// [] | [1] | [3] | [1, 2, 3] | [2, 3] | [1, 2] | [2] | [1, 3]
type Subsequence<T extends any[]> = T extends [infer Left, ...infer Rest]
  ? [Left, ...Subsequence<Rest>] | Subsequence<Rest>
  : T;

// //  [1, 2, 3]
// type Subsequence<T extends any[]> = T extends [infer Left, ...infer Rest]
// ? [Left, ...Subsequence<Rest>]
// : T

// []
// type Subsequence<T extends any[]> = T extends [infer Left, ...infer Rest]
// ? Subsequence<Rest>
// : T

type TestSubsequence = Subsequence<[1, 2, 3]>; //[] | [1] | [3] | [1, 2, 3] | [2, 3] | [1, 2] | [2] | [1, 3]
```

这里的巧妙之处就是构建了一个联合类型，而其中一项可能是空元组 `[]`。通过分解我们知道，每一次执行 `Subsequence<Rest>` 的结果可能是 `[]` 也可能是这个元组本身。所以我们会有：

- 每次递归都命中空元组，结果就是 `[]`
- 第 1 次递归命中 `[Left, ...Subsequence<Rest>]`，这时候元组会有 `[1, ...Subsequence<2,3>]`
- 第 2 轮递归：`Subsequence<2,3>` 命中 `[Left, ...Subsequence<Rest>]`，结果：`[1, 2, ...Subsequence<3>]`
- 第 3 轮递归，`Subsequence<3>` 命中 `[Left, ...Subsequence<Rest>]`，经过第四轮获得的 `[]`，整体结果 `[1,2,3]`
- 第 3 轮递归，`Subsequence<3>` 命中 `Subsequence<Rest>`，整体结果 `[1,2]`
- 第 2 轮递归：`Subsequence<2,3>` 命中 `Subsequence<Rest>`，结果：`[1, ...Subsequence<3>]`
- 第 3 轮递归，`Subsequence<3>` 命中 `[Left, ...Subsequence<Rest>]`，经过第四轮获得的 `[]`，整体结果 `[1,3]`
- 第 3 轮递归，`Subsequence<3>` 命中 `Subsequence<Rest>`，整体结果 `[1]`
- 同理，如果第 1 次递归命中的取值是 `Subsequence<Rest>` 的类型，则这次递归结果是 `[]`，经过后续 2，3，4 轮递归会有
- `[2，3]`
- `[2]`
- 再同理，第一二轮递归都可能命中 `Subsequence<Rest>` 的类型，递归结果是 `[]`，剩下的靠第 3 轮得到：
- `[3]`

这个排列组合确实逻辑比较绕。 可以再看个例子，自个脑补过程巩固下：

```typescript
type Combination<T extends string[], U = T[number], K = U> = K extends string
  ? K | `${K} ${Combination<[], Exclude<U, K>>}`
  : "";

// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<["foo", "bar", "baz"]>;
```

### 拆分更清晰

一个类型推导拆成几个步骤，实现几个中间态的推导类型，就类似把一个大函数拆散，并且还可以方便的拥有了存储的中间态类型，也能能有效减少条件语句的分支数量。

实现类型 PercentageParser。根据规则 `/^(\+|\-)?(\d*)?(\%)?$/` 匹配类型 T。 匹配的结果由三部分组成，分别是：[正负号, 数字, 单位]，如果没有匹配，则默认是空字符串。

```typescript
type PString1 = ''
type PString2 = '+85%'
type PString3 = '-85%'
type PString4 = '85%'
type PString5 = '85'

type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]
type Symbol = "+" | "-";
type PercentageParser<A extends string> =
  A extends `${infer F extends Symbol}${infer R}%`
    ? [F, R, "%"]
    : A extends `${infer F extends Symbol}${infer R}`
    ? [F, R, ""]
    : A extends `${infer R}%`
    ? ["", R, "%"]
    : ["", A, ""];
type ParseSign<T extends string> =
  T extends `${infer Head}${string}`
    ? Head extends '+' | '-'
      ? Head
      : ''
    : '';

type ParsePercent<T extends string> =
  T extends `${string}%`
    ? '%'
    : '';

type ParseNumber<T extends string> =
  T extends `${ParseSign<T>}${infer N}${ParsePercent<T>}`
    ? N
    : '';

type PercentageParser<T extends string> = [
  ParseSign<T>,
  ParseNumber<T>,
  ParsePercent<T>,
];
```

### 计数

ts 类型是无法进行数学加减运算的，有运算或者计数的诉求，都可以构建一个元组，用元组的 length 来计数

```typescript
type FlattenDepth<
  T extends unknown[],
  Depth extends number = 1,
  Count extends 1[] = []
> = Count["length"] extends Depth
  ? T
  : T extends [infer Head, ...infer Tail]
  ? Head extends unknown[]
    ? [
        ...FlattenDepth<Head, Depth, [...Count, 1]>,
        ...FlattenDepth<Tail, Depth, Count>
      ]
    : [Head, ...FlattenDepth<Tail, Depth, Count>]
  : [];

type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>; // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

### 加减运算

用上面计数相同的思想，我们甚至可以用类型计算斐波拉契数列：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/f1564329.jpe)

```typescript
type Fibonacci<
  T extends number,
  CurrentIndex extends any[] = [""],
  Prev extends any[] = [],
  Current extends any[] = [""]
> = CurrentIndex["length"] extends T
  ? Current["length"]
  : Fibonacci<T, [...CurrentIndex, ""], Current, [...Prev, ...Current]>;

type ResultFibonacci1 = Fibonacci<3>; // 2
type ResultFibonacci2 = Fibonacci<8>; // 21
```

## ts 题

### ConnectedFn

- [https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)

```typescript
type Origin = {
  count: number;
  message: string;
  asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
  syncMethod<T, U>(action: Action<T>): Action<U>;
};

type Result = {
  asyncMethod<T, U>(input: T): Action<U>;
  syncMethod<T, U>(action: T): Action<U>;
};

type ExtractFun<T> = {
  [key in keyof T]: T[key] extends Function ? key : never;
}[keyof T];

type onlyFunKey<T> = ExtractFun<T>;
// type test0 = onlyFunKey<Origin>;

type PickFun<T> = Pick<T, onlyFunKey<T>>;
type test0 = PickFun<Origin>;

type TmpAsyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>;
type TransformAsyncFn<T> = T extends (
  input: Promise<infer P>
) => Promise<Action<infer K>>
  ? (input: P) => Action<K>
  : never;

type test1<T, U> = TransformAsyncFn<TmpAsyncMethod<T, U>>;

type TmpSyncMethod<T, U> = (action: Action<T>) => Action<U>;
type TransformSyncFn<T> = T extends (action: Action<infer P>) => Action<infer K>
  ? (action: P) => Action<K>
  : never;

type TransformFn<T> = T extends (
  input: Promise<infer P>
) => Promise<Action<infer K>>
  ? (input: P) => Action<K>
  : T extends (action: Action<infer P>) => Action<infer K>
  ? (action: P) => Action<K>
  : never;

type test2<T, U> = TransformFn<TmpAsyncMethod<T, U>>;
type test3<T, U> = TransformFn<TmpSyncMethod<T, U>>;

type ConnectedFn<T> = {
  [key in keyof PickFun<T>]: TransformFn<PickFun<T>[key]>;
};

type test4<T, U> = ConnectedFn<Origin>;
```

- [https://juejin.cn/post/6994102811218673700#heading-14](https://juejin.cn/post/6994102811218673700#heading-14)

### 变态题

### 减法运算

> 给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。

例如：

```typescript
type Zero = MinusOne<1>; // 0
type FiftyFour = MinusOne<55>; // 54
```

原题干：[https://github.com/type-challenges/type-challenges/blob/main/questions/02257-medium-minusone/README.zh-CN.md](https://github.com/type-challenges/type-challenges/blob/main/questions/02257-medium-minusone/README.zh-CN.md)

解法一：

利用数组的长度来代表数字，加减法都可以通过改变数组长度实现

技巧是把原数字中**每位数都变成了一个数组**长度和数字相同的数组，避免整体一起算导致的递归有 1000 次限制问题，大大减少递归次数。

```typescript
// Utility Type
type ToNumber<T> = T extends `0${infer N extends number}`
  ? N
  : T extends `${infer N extends number}`
    ? N
    : T

// Utility Type
type DigitToArr<T extends number, R extends unknown[] = []> =
  R['length'] extends ToNumber<T>
    ? R
    : DigitToArr<T, [...R, 0]>

// Step 1
type NumberToArr<T extends number | string, Arr extends unknown[][] = []> =
  `${T}` extends `${infer A extends number}${infer Rest}`
    ? NumberToArr<Rest, [...Arr, DigitToArr<A>]>
    : Arr

// Step 2
type MinusArr<R extends unknown[]> =
  R extends [...infer A, infer B]
    ? B extends [...infer M, infer _N]
      ? [...A, M]
      : [...MinusArr<A>, DigitToArr<9>]
    : []

// Step 3
type ArrToString<Arr extends unknown[][], R = ''> =
  Arr extends [infer A extends unknown[], ...infer Rest extends unknown[][]]
    ? `${A['length']}${ArrToString<Rest>}`
    : R

type MinusOne<T extends number> =
  T extends 0
    ? -1
    : ToNumber<ArrToString<MinusArr<NumberToArr<T>>>>

// Steps
type Step1 = NumberToArr<3450> // [[0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0], []]
type Step2 = MinusArr<Step1> // [[0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
type Step3 = ArrToString<Step2> // "3449"
type Result = ToNumber<Step3> // 3449
```

原答案：[https://github.com/type-challenges/type-challenges/issues/22169](https://github.com/type-challenges/type-challenges/issues/22169)

解法二： 直接对每位数做了 0-9 减 1 后的映射。并且利用了字符串和数字互转的特性，采用字符串解构来做到逐位处理。

2 次 reverse 导致是因为字符串很容易获取第一位数，但无法直接获取最后一位数，而减法是末尾向左逐步计算的，所以需要倒置处理

这种方式没有用递归，性能比较好。

```typescript
type ParseInt<T extends string> = T extends `${infer Digit extends number}` ? Digit : never
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}` ? `${ReverseString<Rest>}${First}` : ''
type RemoveLeadingZeros<S extends string> = S extends '0' ? S : S extends `${'0'}${infer R}` ? RemoveLeadingZeros<R> : S
type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}` ?
    Digit extends 0 ?
      `9${InternalMinusOne<Rest>}` :
    `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`:
  never
type MinusOne<T extends number> = ParseInt<RemoveLeadingZeros<ReverseString<InternalMinusOne<ReverseString<`${T}`>>>>>
type test = MinusOne<9007199254740992>
```

原答案：[https://github.com/type-challenges/type-challenges/issues/13507](https://github.com/type-challenges/type-challenges/issues/13507)

用数组的长度来作为数字去比较大小或者去计算，是常用的计较，会变种出很多变态的题，譬如：

- 比较大小
- [https://github.com/type-challenges/type-challenges/blob/main/questions/04425-medium-greater-than/README.md](https://github.com/type-challenges/type-challenges/blob/main/questions/04425-medium-greater-than/README.md)
- 解析：[https://github.com/type-challenges/type-challenges/issues/24326](https://github.com/type-challenges/type-challenges/issues/24326)。（不是最佳答案，最佳答案可以再上一题解题思路上扩展）

### 加法运算

> 给定一个整数数组 nums 和一个目标整数 target, 如果 nums 数组中存在两个元素的和等于 target 返回 true, 否则返回 false

```typescript
/** Helpers */
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// new Array(N).fill(T)
type Repeat<
  N extends number,
  T extends any = null,
  M extends T[] = []
> = M["length"] extends N ? M : Repeat<N, T, [T, ...M]>;

// If A >= B, return A - B. Else, return never.
type Subtract<A extends number, B extends number> = Repeat<A> extends [
  ...Repeat<B>,
  ...infer Rest
]
  ? Rest["length"]
  : never;

// T < U ? true: false
type LessThan<T extends number, U extends number> = Equal<T, U> extends true
  ? false
  : Subtract<T, U> extends never
  ? true
  : false;

type Shift<T extends any[], N extends number = 1> = N extends 0
  ? T
  : T extends [infer _, ...infer Rest]
  ? Shift<Rest, Subtract<N, 1>>
  : [];

// Iterate over T
// -> If current element CURR > TARGET and TARGET - CURR exists in the remainder of T, return true.
// -> Else, recursively call TwoSum over remainder of T.
// -> If iteration is completed, return false.
type TwoSum<
  T extends number[],
  TARGET extends number,
  CURR extends number = T[0],
  NEXT extends number[] = Shift<T>,
  RESULT extends boolean = T extends []
    ? false
    : LessThan<TARGET, CURR> extends true
    ? TwoSum<NEXT, TARGET>
    : Subtract<TARGET, CURR> extends NEXT[number]
    ? true
    : TwoSum<NEXT, TARGET>
> = RESULT;

type Test1TwoSum = TwoSum<[3, 8], 11>;
```

这里实际上是把加法转化成了减法，性能也不是最优的，仅供观摩体操

### 除法运算

> The FizzBuzz problem is a classic test given in coding interviews. The task is simple: Print integers 1 to N, except: - Print "Fizz" if an integer is divisible by 3; - Print "Buzz" if an integer is divisible by 5; - Print "FizzBuzz" if an integer is divisible by both 3 and 5.
> For example, for N = 20, the output should be: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz In the challenge below, we will want to generate this as an array of string literals. For large values of N, you will need to ensure that any types generated do so efficiently (e.g. by correctly using the tail-call optimisation for recursion).

```typescript
type FizzBuzzOne<
  C extends number,
  C3 extends number,
  C5 extends number,
  _FB = `${C3 extends 3 ? "Fizz" : ""}${C5 extends 5 ? "Buzz" : ""}`
> = _FB extends "" ? `${C}` : _FB;

type FizzBuzz<
  N extends number,
  _R extends string[] = [],
  _CT extends unknown[] = [unknown],
  _C3T extends unknown[] = [unknown],
  _C5T extends unknown[] = [unknown]
> = _R["length"] extends N
  ? _R
  : FizzBuzz<
      N,
      [..._R, FizzBuzzOne<_CT["length"], _C3T["length"], _C5T["length"]>],
      [..._CT, unknown],
      _C3T["length"] extends 3 ? [unknown] : [..._C3T, unknown],
      _C5T["length"] extends 5 ? [unknown] : [..._C5T, unknown]
    >;
```

这里解法跟题干相关，`n/3` 通过在递归中不断构建逐位递增的数组且一到 3 时就清空重来，对比数据相同来做的，不是真的除，而是遍历找到了所有 3 的倍数值。

### 比较大小

```typescript
type ToTuple<T extends number, R extends readonly unknown[] = []> = R['length'] extends T
  ? R
  : ToTuple<T, [...R, unknown]>

type Max<L extends number, R extends number> =
  ToTuple<L> extends [...ToTuple<R>, ...infer _]
  ? L
  : R

type Maximum<T extends number[]> = T extends [infer F]
  ? F
  : T extends [infer L extends number, infer R extends number]
    ? Max<L, R>
    : T extends [infer L extends number, infer R extends number, ...infer O extends number[]]
      ? Maximum<[Max<L, R>, ...O]>
      : never
```

这里有个技巧性的比较大小的方式 `Max`，是构建 2 个和数值相同长度的元组，然后用一个 extends 另一个，看一下是否还有剩余值，非常体操的行为了 。

### 排列组合

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_00m4zqzem6k93siq/bba080ba.jpe)

```typescript
type AllCombinations_ABC = AllCombinations<"ABC">;
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

首先运用了把字符串拆成单个字符的联合类型，作为基础单元 利用 in 遍历联合类型，取出一个和其他的组合获得结果

```typescript
type Exclude<T, U> = T extends U ? never : T;

type IsNever<T> = [T] extends [never] ? true : false;

type StringToUnion<T> = T extends `${infer Head}${infer Tail}`
  ? Head | StringToUnion<Tail>
  : never;

type AllCombinations<
  S,
  Acc extends string = StringToUnion<S>
> = IsNever<Acc> extends true
  ? ""
  :
      | ""
      | {
          [Combo in Acc]: `${Combo}${AllCombinations<
            never,
            Exclude<Acc, Combo>
          >}`;
        }[Acc];
```

### 幂运算 - 二进制转十进制

```typescript
type BinaryToDecimal<
  S extends string,
  Acc extends unknown[] = []
> = S extends `${infer First}${infer Rest}`
  ? First extends "1"
    ? BinaryToDecimal<Rest, [...Acc, ...Acc, ""]>
    : BinaryToDecimal<Rest, [...Acc, ...Acc]>
  : Acc["length"];

type Res1BinaryToDecimal = BinaryToDecimal<"10">; // expected to be 0 + 2 = 2
type Res2BinaryToDecimal = BinaryToDecimal<"0011">; // expected to be 1 + 2 = 3
type Res3BinaryToDecimal = BinaryToDecimal<"1011">; // expected to be 1 + 2 + 0 + 8 = 11

type Res5BinaryToDecimal = BinaryToDecimal<"1000">; // expected to be 0 + 0 + 0 + 8 = 8
/**
 * BinaryToDecimal<'1011'> 每轮递归ACC的值
 * 1 - '1': ['']
 * 2 - '0': ['', '']
 * 3 - '1': [...['', ''], ...['', ''], ''].length = 5
 * 4 - '1': [...['', '', '', '', ''], ...['', '', '', '', ''], ''].length = 11
 */

/**
 * BinaryToDecimal<'1000'> 每轮递归ACC的值
 * 1 - '1': ['']
 * 2 - '0': ['', '']
 * 3 - '0': [...['', ''], ...['', '']].length = 4
 * 4 - '0': [...['', '', '', ''], ...['', '', '', '']].length = 8
 */
```

数组长度计数和递归到了这个进度后都是常规操作了。

`[...Acc, ...Acc]` 也不难理解，二进制，每多一位，都是前面的数量 \* 2 翻倍么。

只是这里我一开始十分的不理解人脑是从右往左逐位算的，所以 1011 = 1 + 2 + 0 + 8 = 11。 为什么程序从左到右算也能对。然后发现是脑子太固化了，1011 = 8 + 0 + 2 + 1 = 11 可不也成立么。每次往数组里丢一个新的值进去，在后面的递归中都会被每轮 \_ 2，所以数组增加一位，就是在完成 2^n 的操作，这里的 n 就是后续递归次数，每次递归翻倍。所以 0 和 1 的区别也确实就是只是 n 增加一位需要做原本的翻倍，还是该位有数据，需要丢个数据进数组，从而进行后续的翻倍。\*\*关键点就是每次数组新增加的一位都完成了后续 n 轮递归中 2\_\_^n\_ \* 的职能。\*\*

## 路别走偏了

整理看下来，类型体操是不是觉得比 js 还难学，就跟 js 的原型链实现的类一样，奇奇怪怪的。我觉得原因是 TS 一开始设计时没想承载这么多，譬如做加减乘除运算，是大家的在利用的它的规则和特性搞事情。TS 本身缺乏类型方法内变量存储的设计、没有计数和运算能力、逻辑语句又只有三元运算符没有循环之类的，所以在做计数运算、递归等都比较让人迷惑，有些浮夸的体操我自己也是觉得做做开开眼图一乐就好，还是专注于日常工具方法、类能用得到的类型推导部分吧。

最后，即使已经进阶到高级选手了，**不要滥用工具类型，对外暴露的 API，应该尽量多手动标注函数返回值类型**。**契约高于实现。**

这些 ts 类型体操的花活多是留给基础框架内部用的，通过写推导类型作为类型的通用方法，提高我们的类型编程的效率和准确性。
