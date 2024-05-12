---
title: "编程语言：类型系统的本质"
date: 2022-07-02T15:44:28+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [知乎](https://zhuanlan.zhihu.com/p/575332343)

{{< toc >}}

## 引子

我一直对编写更好的代码有浓厚的兴趣。如果你能真正理解什么是抽象，什么是具象，就能理解为什么现代编程语言中，接口和函数类型为什么那么普遍存在了。在使用函数式语言进行编程后，就能够很清晰地理解为什么随着时间的推移，更主流的语言开始采用函数式语言中的一些被认为理所当然的特性。

我将多年间学习类型系统和编程语言开发的经验汇聚起来，加以提炼，并辅以现实世界的应用，撰写了这篇文章。本文脉络如下：

1. 概述：什么是类型？为什么要引入类型的概念？
2. 编程语言中的基本类型
3. 类型组合
4. OOP 与接口类型
5. 函数类型
6. 函子（Functor）和单子（Monad）

# 概述：什么是类型？为什么要引入类型的概念？

类型系统设计的理论与日常生产软件之间存在直接的联系。这并不是一个革命性的发现：复杂的类型系统特性之所以存在，就是为了解决现实世界的问题。

本节介绍类型和类型系统，讨论它们为什么存在以及为什么有用。我们将讨论类型系统的类型，并解释类型强度、静态类型和动态类型。

## 两个术语：类型、类型系统

### 类型

类型是对数据做的一种分类，定义了能够对数据执行的操作、数据的意义，以及允许数据接受的值的集合。编译器和运行时会检查类型，以确保数据的完整性，实施访问限制，以及按照开发人员的意图来解释数据。

### 类型系统

类型系统是一组规则，为编程语言的元素分配和实施类型。这些元素可以是变量、函数和其他高级结构。类型系统通过两种方式分配类型：程序员在代码中指定类型，或者类型系统根据上下文，隐式推断出某个元素的类型。类型系统允许在类型之间进行某些转换，而阻止其他类型的转换。

## 从复杂系统的约束开始

“系统” 一词由来已久，在古希腊是指复杂事物的总体。到近代，一些科学家和哲学家常用系统一词来表示复杂的具有一定结构的整体。在宏观世界和微观世界，从基本粒子到宇宙，从细胞到人类社会，从动植物到社会组织，无一不是系统的存在方式。

控制论（维纳，1948，《控制论 (或关于在动物和机器中控制和通讯的科学)》）告诉我们，负反馈就是系统稳定的机制，一个组织系统之所以能够受到干扰后能迅速排除偏差恢复恒定的能力，关键在于存在着“负反馈调节” 机制：系统必须有一种装置，来测量受干扰的变量和维持有机体生存所必需的恒值之间的差别。例如，一个实时系统复杂性任务的约束，包括时间约束、资源约束、执行顺序约束和性能约束。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/1a5e0171.jpe)

类型检查：类型检查确保程序遵守类型系统的规则。编译器在转换代码时进行类型检查，而运行时在执行代码时进行类型检查。编译器中负责实施类型规则的组件叫作类型检查器。如果类型检查失败，则意味着程序没有遵守类型系统的规则，此时程序将会编译失败，或者发生运行时错误。“遵守类型系统规则的程序相当于一个逻辑证明。”

类型系统，就是复杂软件系统的 “负反馈调节器”。通过一套类型规范，加上编译监控和测试机制，来实现软件系统的数据抽象和运行时数据处理的安全。

随着软件变得越来越复杂，我们越来越需要保证软件能够正确运行。通过监控和测试，能够说明在给定特定输入时，软件在特定时刻的行为是符合规定的。但类型为我们提供了更加一般性的证明，说明无论给定什么输入，代码都将按照规定运行。

例如，将一个值标记为 const，或者将一个成员变量标记为 private，类型检查将强制限制实施其他许多安全属性。

## 从 01 到现实世界对象模型

类型为数据赋予了意义。类型还限制了一个变量可以接受的有效值的集合。

在低层的硬件和机器代码级别，程序逻辑（代码）及其操作的数据是用位来表示的。在这个级别，代码和数据没有区别，所以当系统误将代码当成数据，或者将数据当成代码时，就很容易发生错误。这些错误可能导致系统崩溃，也可能导致严重的安全漏洞，攻击者利用这些漏洞，让系统把他们的输入数据作为代码执行。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/0a5dd5b9.jpe)

通过对编程语言的研究，人们正在设计出越来越强大的类型系统（例如，Elm 或 Idris 语言的类型系统）。Haskell 正变得越来越受欢迎。同时，在动态类型语言中添加编译时类型检查的工作也在推进中：Python 添加了对类型提示的支持，而 TypeScript 这种语言纯粹是为了在 JavaScript 中添加编译时类型检查而创建的。

显然，为代码添加类型是很有价值的，利用编程语言提供的类型系统的特性，可以编写出更好、更安全的代码。

## 编程语言中的数据类型

类型系统是每个编程语言都会有的基本概念。

- Lisp 数据类型可分类为：

  - 标量类型 - 例如，数字类型，字符，符号等。
  - 数据结构 - 例如，列表，向量，比特向量和字符串。
- C 语言的类型系统分为：基本类型和复合类型。不同类型所占用的内存长度不相同：

  - 整型数值基本类型
    - char 占用一个字节
    - short 占用两个字节
    - int 目前基本都是 4 字节
    - long int (可以简写为 long) (32 位系统是 4 字节，64 位系统是 8 字节)
    - long long int (可以简写为 long long) 占用 8 节字
  - 浮点数数值基本类型
    - float 占用 4 字节 (单精度)
    - double 占用 8 节字 (双精度浮点数)
  - 复合类型包含如下几种
    - struct 结构体
    - union 联合体
    - enum 枚举 (长度等同 int)
    - 数组
    - 指针
- Go 语言中有丰富的数据类型，除了基本的整型、浮点型、布尔型、字符串外，还有数组，切片（slice），结构体（struct），接口（interface），函数（func），map , 通道（channel）等。

  - 整型：int8 int6 int32 int64；对应的无符号整型：uint8 uint16 uint32 uint64。uint8 就是我们熟知的 byte 型, int16 对应 C 语言中的 short 型，int64 对应 C 语言中 long 型。
  - 浮点类型：float32 和 float64, 浮点这两种浮点型数据格式遵循 IEEE 754 标准。
  - 切片：可变数组，是对数组的一种抽象。切片是引用类型。
  - 接口：实现多态，面向接口编程。定义一个接口 I , 然后使用不同的结构体对接口 I 进行实现, 然后利用接口对象作为形式参数, 将不同类型的对象传入并调用相关的函数, 实现多态。接口可以进行嵌套实现, 通过大接口包含小接口。

## 类型强度

强类型和弱类型的区别没有权威的定义。大多数早期关于强类型和弱类型的讨论可以概括为静态类型和动态类型之间的区别。

但流行的说法是强类型倾向于不容忍隐式类型转换，而弱类型倾向于容忍隐式类型转换。这样，强类型语言通常是类型安全的，也就是说，它只能以允许的方式访问它被授权访问的内存。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/46b9708b.jpe)

通常，动态类型语言倾向于与 Python、Ruby、Perl 或 Javascript 等解释型语言相关联，而静态类型语言倾向于编译型语言，例如 Golang、Java 或 C。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/f424d486.jpe)

## 静态类型与动态类型

我们经常听到 “静态与动态类型” 这个问题，其实，两者的区别在于类型检查发生的时间。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/0fa89b36.jpe)

1. 静态类型系统在编译时确定所有变量的类型，并在使用不正确的情况下抛出异常。静态类型系统，将运行时错误转换成编译时错误，能够使代码更容易维护、适应性更强，对于大型应用程序，尤其如此。
2. 而在动态类型中，类型绑定到值。检查是在运行时进行的。动态类型系统在运行时确定变量类型，如果有错误则抛出异常，如果没有适当的处理，可能会导致程序崩溃。动态类型不会在编译时施加任何类型约束。日常交流中有时会将动态类型叫作 “鸭子类型”（duck typing），这个名称来自俗语：“如果一种动物走起来像鸭子，叫起来像鸭子，那么它就是一只鸭子。” 代码可按照需要自由使用一个变量，运行时将对变量应用类型。

静态类型系统的早期类型错误报告保证了大规模应用程序开发的安全性，而动态类型系统的缺点是编译时没有类型检查，程序不够安全。只有大量的单元测试才能保证代码的健壮性。但是使用动态类型系统的程序，很容易编写并且不需要花费很多时间来确保类型正确。所谓 “鱼和熊掌不可兼得”，这就是关于“效率” 与“质量”的哲学问题了。

不过，现代类型检查器具有强大的类型推断算法，使它们能够确定变量或者函数的类型，而不需要我们显式地写出类型。

## 小结

- 类型是一种数据分类，定义了可以对这类数据执行的操作、这类数据的意义以及允许取值的集合。
- 类型系统是一组规则，为编程语言的元素分配并实施类型。
- 类型限制了变量的取值范围，所以在一些情况中，运行时错误就被转换成了编译时错误。
- 不可变性是类型施加的一种数据属性，保证了值在不应该发生变化时不会发生变化。
- 可见性是另外一种类型级别的属性，决定了哪些组件能访问哪些数据。
- 类型标识符使得阅读代码的人更容易理解代码。
- 动态类型（或叫 “鸭子类型”）在运行时决定类型。
- 静态类型在编译时检查类型，捕获到原本有可能成为运行时错误的类型错误。
- 类型系统的强度衡量的是该系统允许在类型之间进行多少隐式转换。
- 现代类型检查器具有强大的类型推断算法，使它们能够确定变量或者函数的类型，而不需要我们显式地写出类型。

# 编程语言中的基本类型

本节介绍编程语言类型系统的特性，从基本类型开始，到函数类型、OOP、泛型编程和高阶类型（如函子和单子）。

## 基本类型

常用的基本类型包括空类型、单元类型、布尔类型、数值类型、字符串类型、数组类型和引用类型。

## 函数类型

“函数类型是类型系统在基本类型及其组合的基础上发展的又一个阶段。”

大部分现代编程语言都支持匿名函数，也称为 lambda。lambda 与普通的函数类似，但是没有名称。每当我们需要使用一次性函数时，就会使用 lambda。所谓一次性函数，是指我们只会引用这种函数一次，所以为其命名就成了多余的工作。

lambda 或匿名函数：lambda，也称为匿名函数，是没有名称的函数定义。lambda 通常用于一次性的、短期存在的处理，并像数据一样被传来传去。

函数能够接受其他函数作为实参，或者返回其他函数。接受一个或多个非函数实参并返回一个非函数类型的 “标准” 函数也称为一阶函数，或普通函数。接受一个一阶函数作为实参或者返回一个一阶函数的函数称为二阶函数。

我们可以继续往后推，称接受二阶函数作为实参或者返回二阶函数的函数为三阶函数，但是在实际运用中，我们只是简单地把所有接受或返回其他函数的函数称为高阶函数。

我们可以使用 “函数类型” 简化策略模式。如果一个变量是函数类型（命名函数类型），并在使用其他类型的值的地方能够使用函数，就可以简化一些常用结构的实现，并把常用算法抽象为库函数。

## 泛型编程

泛型编程支持强大的解耦合以及代码重用。

泛型数据结构把数据的布局与数据本身分隔开。迭代器支持遍历这些数据结构。泛型算法（例如，最经典的 sort 排序算法 ）是能够在不同数据类型上重用的算法。迭代器（Iterator）用作数据结构和算法之间的接口，并且能够根据迭代器的能力启用不同的算法。

例如， 一个泛型函数 ：

```
(value:T) => T
```

它的类型参数是 T。当为 T 指定了实际类型时，就创建了具体函数。具体类图示例如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/7686d9e7.jpe)

再例如，一个泛型二叉树。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/b1cc1249.jpe)

泛型高阶函数 map() , filter() , reduce() 代码和示意图如下。

- map()

```
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
    return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)}
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/b6b0b227.jpe)

- filter()

```
public inline fun <T> Iterable<T>.filter(predicate: (T) -> Boolean): List<T> {
    return filterTo(ArrayList<T>(), predicate)}
```

- reduce()

```
public inline fun <S, T : S> Iterable<T>.reduce(operation: (acc: S, T) -> S): S {
    val iterator = this.iterator()
    if (!iterator.hasNext()) throw UnsupportedOperationException("Empty collection can't be reduced.")
    var accumulator: S = iterator.next()
    while (iterator.hasNext()) {
        accumulator = operation(accumulator, iterator.next())
    }
    return accumulator}
```

### 高阶类型

高阶类型与高阶函数类似，代表具有另外一个类型参数的类型参数。例如，`T<U>` 或 `Box<T<U>>` 有一个类型参数 T，后者又有一个类型参数 U。

正如高阶函数是接受其他函数作为实参的函数，高阶类型是接受其他种类作为实参的种类（参数化的类型构造函数）。

### 类型构造函数

在类型系统中，我们可以认为类型构造函数是返回类型的一个函数。我们不需要自己实现类型构造函数，因为这是类型系统在内部看待类型的方式。

每个类型都有一个构造函数。一些构造函数很简单。例如，可以把类型 number 的构造函数看作不接受实参、返回 number 类型的一个函数，也就是 `() -> [number type]`。

对于泛型，情况则有了变化。泛型类型，如 `T[]`，需要一个实际的类型参数来生成一个具体类型。其类型构造函数为 `(T) -> [T[] type]`。例如，当 T 是 number 时，我们得到的类型是一个数值数组 `number[]`，而当 T 是 string 时，得到的类型是一个字符串数组 `string[]`。这种构造函数也称为“种类”，即类型 `T[]` 的种类。

高阶类型与高阶函数一样，将抽象程度提高了一个级别。在这里，我们的类型构造函数可以接受另外一个类型构造函数作为实参。

## 空类型（null）

道生一，一生二，二生三，三生万物。

这里的 null，大概就是 “道” 吧！

### null vs 亿万美元的错误

著名的计算机科学家、图灵奖获得者托尼 · 霍尔爵士称 null 引用是他犯下的 “亿万美元错误”。他说过：

“1965 年我发明了 null 引用。现在我把它叫作我犯下的亿万美元错误。当时，我在一种面向对象语言中为引用设计第一个全面的类型系统。我的目标是让编译器来自动执行检查，确保所有使用引用的地方都是绝对安全的。但是，我没能抗拒诱惑，在类型系统中添加了 null 引用，这只是因为实现 null 引用太简单了。这导致了难以计数的错误、漏洞和系统崩溃，在过去四十年中可能造成了数亿美元的损失。”

几十年来发生了非常多的 null 解引用错误，所以现在很明显，最好不要让 null（即没有值）自身成为某个类型的一个有效的值。

接下来，我们介绍通过组合现有类型来创建新类型的多种方式。

# 类型组合

本节介绍类型组合，即如何把类型组合起来，从而定义新类型的各种方式。

组合类型，是将类型放到一起，使结果类型的值由每个成员类型的值组成。

## 代数数据类型（Algebraic Data Type，ADT）

ADT 是在类型系统中组合类型的方式。ADT 提供了两种组合类型的方式：

1. 乘积类型
2. 和类型

### 乘积类型

乘积类型就是本章所称的复合类型。元组和记录是乘积类型，因为它们的值是各构成类型的乘积。类型 `A = {a1, a2}`（类型 A 的可能值为 a1 和 a2）和 `B = {b1, b2}`（类型 B 的可能值为 b1 和 b2）组合成为元素类型 `< A, B >` 时，结果为 `A×B = {(a1, b1), (a1, b2), (a2, b1), (a2, b2)}`。

元组和记录类型都是乘积类型的例子。另外，记录允许我们为每个成员分配有意义的名称。

### 和类型

和类型，是将多个其他类型组合成为一个新类型，它存储任何一个构成类型的值。类型 A、B 和 C 的和类型可以写作 `A + B + C`，它包含 A 的一个值，或者 B 的一个值，或者 C 的一个值。

可选类型和变体类型是 “和类型” 的例子。

# OOP 与接口类型

本节介绍面向对象编程的关键元素，以及什么时候使用每种元素，并讨论接口、继承、组合和混入。

## OOP: 面向对象编程

面向对象编程（Object-Oriented Programming，OOP）：OOP 是基于对象的概念的一种编程范式，对象可以包含数据和代码。数据是对象的状态，代码是一个或多个方法，也叫作 “消息”。在面向对象系统中，通过使用其他对象的方法，对象之间可以“对话” 或者发送消息。

OOP 的两个关键特征是封装和继承。封装允许隐藏数据和方法，而继承则使用额外的数据和代码扩展一个类型。

封装出现在多个层次，例如，服务将其 API 公开为接口，模块导出其接口并隐藏实现细节，类只公开公有成员，等等。与嵌套娃娃一样，代码两部分之间的关系越弱，共享的信息就越少。这样一来，组件对其内部管理的数据能够做出的保证就得到了强化，因为如果不经过该组件的接口，外部代码将无法修改这些数据。

一个 “参数化表达式” 的面向对象继承体系的例子。类图如下。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/cc65fbc5.jpe)

这里的表达式，可以通过 eval() 方法，计算得到一个数字，二元表达式有两个操作数，加法和乘法表达式通过把操作数相加或相乘来计算结果。

我们可以把表达式建模为具有 eval() 方法的 IExpression 接口。之所以能将其建模为接口，是因为它不保存任何状态。

接下来，我们实现一个 BinaryExpression 抽象类，在其中存储两个操作数。但是，我们让 eval() 是抽象方法，从而要求派生类实现该方法。SumExpression 和 MulExpression 都从 BinaryExpression 继承两个操作数，并提供它们自己的 eval() 实现。代码如下。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/b46ff037.jpe)

## 接口类型：抽象类和接口

我们使用接口来指定契约。接口可被扩展和组合。

接口或契约：接口（或契约）描述了实现该接口的任何对象都理解的一组消息。消息是方法，包括名称、实参和返回类型。接口没有任何状态。与现实世界的契约（它们是书面协议）一样，接口也相当于书面协议，规定了实现者将提供什么。

接口又称为动态数据类型，在进行接口使用的的时候, 会将接口对位置的动态类型改为所指向的类型

会将动态值改成所指向类型的结构体。

# 函数类型

本节介绍函数类型，以及当我们获得了创建函数变量的能力后能够做些什么，还展示实现策略模式和状态机的不同方式，并介绍基本的 map()、filter() 和 reduce() 算法。

## 什么是函数类型？

### 函数类型或签名

函数的实参集合加上返回类型称为函数类型（或函数签名）。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/f8922185.jpe)

函数类型本质上跟接口类型的范畴相同，都是一组映射规则（接口协议），不绑定具体的实现（class，struct）。

函数的实参类型和返回类型决定了函数的类型。如果两个函数接受相同的实参，并返回相同的类型，那么它们具有相同的类型。实参集合加上返回类型也称为函数的签名。

### 一等函数

将函数赋值给变量，并像处理类型系统中的其他值一样处理它们，就得到了所谓的一等函数。这意味着语言将函数视为 “一等公民”，赋予它们与其他值相同的权利：它们有类型，可被赋值给变量，可作为实参传递，可被检查是否有效，以及在兼容的情况下可被转换为其他类型。

“一等函数” 编程语言，可以把函数赋值给变量、作为实参传递以及像使用其他值一样使用，这使得代码的表现力更强。

## 一个简单的策略模式

### 策略设计模式

策略模式是最常用的设计模式之一。策略设计模式是一种行为软件设计模式，允许在运行时从一组算法中选择某个算法。它把算法与使用算法的组件解耦，从而提高了整个系统的灵活性。下图展示了这种模式。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/04e48329.jpe)

策略模式由 IStrategy 接口、ConcreteStrategy1 和 ConcreteStrategy2 实现以及通过 IStrategy 接口使用算法的 Context 构成。代码如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/9cd251da.jpe)

### 函数式策略

我们可以把 WashingStrategy 定义为一个类型，代表接受 Car 作为实参并返回 void 的一个函数。然后，我们可以把两种洗车服务实现为两个函数，standardWash() 和 premiumWash()，它们都接受 Car 作为实参，并返回 void。CarWash 可以选择其中一个函数应用到一辆给定的汽车，如下图。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/d40dbf6a.jpe)

策略模式由 Context 构成，它使用两个函数之一：concreteStrategy1() 或 concreteStrategy2() 。代码如下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/85a2796f.jpe)

## 一个简单的装饰器模式

装饰器模式是一个简单的行为软件设计模式，可扩展对象的行为，而不必修改对象的类。装饰的对象可以执行其原始实现没有提供的功能。装饰器模式如图所示。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/54301059.jpe)

图说明：装饰器模式，一个 IComponent 接口，一个具体实现，即 ConcreteComponent，以及使用额外行为来增强 IComponent 的 Decorator。

### 一个单例逻辑的装饰器

一个单例逻辑的装饰器代码实例如下。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/e9b60d80.jpe)

### 用函数装饰器来实现

下面我们来使用函数类型实现装饰器模式。

首先，删除 IWidgetFactory 接口，改为使用一个函数类型。该类型的函数不接受实参，返回一个 Widget:() => Widget。

在之前使用 IWidgetFactory 并传入 WidgetFactor 实例的地方，现在需要使用 () => Widget 类型的函数，并传入 makeWidget()，代码如下。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/2f0e7637.jpe)

我们使用了一种类似于上面的策略模式的技术：将函数作为实参，在需要的时候进行调用。但是，上面的 use10Widgets() 每次调用都会构造生成一个新的 Widget 实例。

接下来看如何添加单例行为。我们提供一个新函数 singletonDecorator()，它接受一个 WidgetFactory 类型的函数，并返回另外一个 WidgetFactory 类型的函数。代码如下。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/88a054d9.jpe)

现在，use10Widgets() 不会构造 10 个 Widget 对象，而是会调用 lambda，为所有调用重用相同的 Widget 实例。

### 小结

与策略模式一样，面向对象方法和函数式方法实现了相同的装饰器模式。

面向对象版本需要声明一个接口（IWidgetFactory），该接口的至少一个实现（WidgetFactory），以及处理附加行为的一个装饰器类。

与之相对，函数式实现只是声明了工厂函数的类型（() => Widget），并使用两个函数：一个工厂函数（makeWidget()）和一个装饰器函数（singletonDecorator()）。

# 函子和单子 (Functor and Monad)

## 概述

函子和单子的概念来自范畴论。范畴论是数学的一个分支，研究的是由对象及这些对象之间的箭头组成的结构。有了这些小构造块，我们就可以建立函子和单子这样的结构。我们不会深入讨论细节，只是简单说明一下。许多领域（如集合论，甚至类型系统）都可以用范畴论来表达。

### 函子 (Functor)

"Talk is cheap, show me the code".

函子，就是数据类型 Functor，它有一个属性值 value 和一个 map 方法。map 方法可以处理 value，并生成新的 Functor 实例。函子的代码如下：

```Java
class Functor<T>{
    private value:T;

    constructor(val:T){
        this.value = val
    }

    public map<U>(fn:(val:T)=>U){
        let rst = fn(this.value)
        return new Functor(rst)
    }
}
```

验证一下 Functor 的应用实例，是否符合我们想要的数据类型？

```java
new Functor(3)
    .map(d=>add(d))
    .map(d=>double(d.value))
    .map(d=>square(d.value)) // Functor { value: 256 }
```

这就是函子，一种受规则约束，含有值 (value) 和值的变形关系 (函数 map) 的数据类型(容器)。它是一种新的函数组合方式，可以链式调用，可以用于约束传输的数据结构，可以映射适配函数的输出值与下一个函数输入值，可以一定程度上避免函数执行的副作用。

函子的用途是什么呢？这个问题需要从前面讲过的函数组合 (Function Composition) 讲起。

函数组合是一种把多个函数组合成新函数的方式，它解决了函数嵌套调用的问题，还提供了函数拆分组合的方式。

### 函数的函子

除了函子外，需要知道的是，还有函数的函子。给定一个有任意数量的实参且返回类型 T 的值的一个函数。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/1062d1ae.jpe)

### 函子在数学与函数式编程中

在数学中，特别是范畴论，函子是范畴之间的映射（范畴间的同态）。由一范畴映射至其自身的函子称之为 “自函子”。

在函数式编程里，函子是最重要的数据类型，也是基本的运算单位和功能单位。Functor 是实现了 map() 函数并遵守一些特定规则的容器类型。

我们有一个泛型类型 H，它包含某个类型 T 的 0 个、1 个或更多个值，还有一个从 T 到 U 的函数。在本例中，T 是一个空心圆，U 是一个实心圆。map() 函子从 H<T> 实例中拆包出 T，应用函数，然后把结果放回到一个 `H<U>` 中。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/192aeebc.jpe)

其实，上面的 `map(transform: (T) -> R): List<R>` 高阶函数就是一个 `函子` 。

函子：函子是执行映射操作的函数的推广。对于任何泛型类型，以 `Box<T>` 为例，如果 map() 操作接受一个 `Box<T>` 和一个从 T 到 U 的函数作为实参，并得到一个 `Box<U>`，那么该 map() 就是一个函子。

#### 函子定义（Functor Laws）

```
恒等定律：fmap id = id
组合定律：fmap (g . h) = (fmap g) . (fmap h)
```

函子很强大，但是大部分主流语言都没有很好的方式来表达函子，因为函子的常规定义依赖于高阶类型（不是 “高阶函数”，是 “高阶类型”）的概念。

#### Functor 函子的代码实现示例

```javascript
class Functor {
  // 构造函数，创建函子对象的时候接收任意类型的值，并把值赋给它的私有属性 _value
  constructor(value) {
    this._value = value;
  }

  // 接收一个函数，处理值的变形并返回一个新的函子对象
  map(fn) {
    return new Functor(fn(this._value));
  }
}

let num1 = new Functor(3).map((val) => val + 2);
// 输出：Functor { _value: 5 }
console.log(num1);
let num2 = new Functor(3).map((val) => val + 2).map((val) => val * 2);
// 输出：Functor { _value: 10 }
console.log(num2);
// 改变了值类型
let num3 = new Functor("webpack")
  .map((val) => `${val}-cli`)
  .map((val) => val.length);
// 输出：Functor { _value: 11 }console.log(num3)
```

### 单子（Monad Functor）

函子的 value 支持任何数据类型，当然也可以是函子。但是这样会造成函子嵌套的问题。

```
Maybe.of(3).map(n => Maybe.of(n + 2)) // Maybe { value: Maybe { value: 5 } }
```

单子（Monad 函子）就是解决这个问题的。

Monad Functor 总是返回一个单层的函子，避免出现嵌套的情况。因为它有一个 flatMap 方法，如果生成了一个嵌套函子，它会取出后者的 value，保证返回的是一个单层函子，避免出现嵌套的情况。

代码如下。

```java
class Monad<T> exteds Functor<T>{
    static of<T>(val:T){
        return new Monad(val)
    }

    isNothing() {
        return this.value === null || this.value === undefined    }

    public map<U>(fn:(val:T)=>U){
        if (this.isNothing()) return Monad.of(null)
        let rst = fn(this.value)
        return Monad.of(rst)
    }

    public join(){
        return this.value    }

    public flatMap<U>(fn:(val:T)=>U){
        return this.map(fn).join()
    }}

Monad.of(3).flatMap(val => Monad.of(val + 2)) // Monad { value: 5 }
```

通常讲，Monad 函子就是实现 flatMap 方法的 Pointed 函子。

Monad 由以下三个部分组成：

1. 一个类型构造函数（M），可以构建出一元类型 `M<T>`。
2. 一个类型转换函数（return or unit），能够把一个原始值装进 M 中。

```
unit(x) : T -> M T
```

3. 一个组合函数 bind，能够把 M 实例中的值取出来，放入一个函数 `fn: T-> M<U>` 中去执行，最终得到一个新的 M 实例。

```
bind:  执行 fn: T  -> M<U>
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/e0dd8440.jpe)

除此之外，它还遵守一些规则：

- 单位元规则，通常由 unit 函数去实现。
- 结合律规则，通常由 bind 函数去实现。

代码实例：

```javascript
class Monad {
  value = "";
  // 构造函数
  constructor(value) {
    this.value = value;
  }
  // unit，把值装入 Monad 构造函数中
  unit(value) {
    this.value = value;
  }
  // bind，把值转换成一个新的 Monad
  bind(fn) {
    return fn(this.value);
  }
}
// 满足 x-> M(x) 格式的函数
function add1(x) {
  return new Monad(x + 1);
}

// 满足 x-> M(x) 格式的函数
function square(x) {
  return new Monad(x * x);
}

// 接下来，我们就能进行链式调用了
const a = new Monad(2).bind(square).bind(add1);
console.log(a.value === 5); // true
```

上述代码就是一个最基本的 Monad，它将程序的多个步骤抽离成线性的流，通过 bind 方法对数据流进行加工处理，最终得到我们想要的结果。

### 范畴论中的函子

Warning：下文的内容偏数学理论，不感兴趣的同学跳过即可。

原文： _A monad is a monoid in the category of endofunctors_ （Philip Wadler）。

翻译：Monad 是一个 **自函子** **范畴** 上的 **幺半群** ” 。

这里标注了 3 个重要的概念：自函子、范畴、幺半群，这些都是数学知识，我们分开理解一下。

#### 什么是范畴？

任何事物都是对象，大量的对象结合起来就形成了集合，对象和对象之间存在一个或多个联系，任何一个联系就叫做态射。

一堆对象，以及对象之间的所有态射所构成的一种代数结构，便称之为 **范畴** 。

#### 什么是函子？

我们将范畴与范畴之间的映射称之为 **函子** 。映射是一种特殊的态射，所以函子也是一种态射。

#### 什么是自函子？

自函子就是一个将范畴映射到自身的函子。

#### 什么是幺半群 Monoid？

幺半群是一个存在 单位元 的半群。

#### 什么是半群？

如果一个集合，满足结合律，那么就是一个 **半群** 。

#### 什么是单位元？

单位元是集合里的一种特别的元素，与该集合里的二元运算有关。当单位元和其他元素结合时，并不会改变那些元素。如：

```
任何一个数 + 0 = 这个数本身。那么 0 就是单位元（加法单位元）
任何一个数 * 1 = 这个数本身。那么 1 就是单位元（乘法单位元）
```

Ok，我们已经了解了所有应该掌握的专业术语，那就简单串解一下这段解释吧：

一个 **自函子** **范畴** 上的 **幺半群** ，可以理解为：

在一个满足结合律和单位元规则的集合中，存在一个映射关系，这个映射关系可以把集合中的元素映射成当前集合自身的元素。

## 小结

在不涉及范畴论的情况下，针对函子和单子，做一个简单的小结。

Functor 和 monad 都为包装输入提供了一些工具，返回包装后的输出。

Functor = unit + map（即工具）

在哪里，

unit= 接受原始输入并将其包装在一个小上下文中的东西。

map= 将函数作为输入的工具，将其应用于包装器中的原始值，并返回包装后的结果。

示例：让我们定义一个将整数加倍的函数

```
// doubleMe :: Int a -> Int b

const doubleMe = a => 2 \* a;

Maybe(2).map(doubleMe) // Maybe(4)

Monad = unit + flatMap （或绑定或链）
```

flatMapmap = 顾名思义，就是将 扁平化的工具。

## 番外篇：自组织理论与复杂软件系统

自组织理论是 20 世纪 60 年代末期开始建立并发展起来的一种系统理论。它的研究对象主要是复杂自组织系统（生命系统、社会系统）的形成和发展机制问题，即在一定条件下，系统是如何自动地由无序走向有序，由低级有序走向高级有序的。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/81bbfe49.jpe)

自组织是现代非线性科学和非平衡态热力学的最令人惊异的发现之一。基于对物种起源、生物进化和社会发展等过程的深入观察和研究，一些新兴的横断学科从不同的角度对自组织的概念给予了界说。

从系统论的观点来说，自组织是指一个系统在内在机制的驱动下，自行从简单向复杂、从粗糙向细致方向发展，不断地提高自身的复杂度和精细度的过程；

从热力学的观点来说，自组织是指一个系统通过与外界交换物质、能量和信息，而不断地降低自身的熵含量，提高其有序度的过程；

从统计力学的观点来说，自组织是指一个系统自发地从最可几状态向几率较低的方向迁移的过程；

从进化论的观点来说，自组织是指一个系统在遗传、变异和优胜劣汰机制的作用下，其组织结构和运行模式不断地自我完善，从而不断提高其对于环境的适应能力的过程。C. R. Darwin 的生物进化论的最大功绩就是排除了外因的主宰作用，首次从内在机制上、从一个自组织的发展过程中来解释物种的起源和生物的进化。

## 什么是复杂？

“复杂” ( Complexity )定义为由于组件之间的依赖关系、关系和交互，而难以对其行为建模的任何系统。更通俗地说，复杂系统的 “整体” 大于 “部分” 之和。也就是说，如果不查看单个组件以及它们如何相互作用，就无法理解其整体行为的系统，同时也无法通过仅查看单个组件而忽略系统影响来理解系统的整体行为。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/09f8fc3a.jpe)

随着软件系统的扩展，它变得足够大，以至于工作部件的数量，加上对其进行更改的工作程序员的数量，使得系统的行为非常难以推理。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_cu3udbhzndme16h/d9a8f520.jpe)

这种复杂性因许多组织向微服务架构的转变而加剧，例如所谓的 “死星” 架构，其中圆圈圆周上的每个点代表一个微服务，服务之间的线代表它们的交互。

## 参考资料

- 弗拉德 · 里斯库迪亚 (Vlad Riscutia). “编程与类型系统”（微软资深工程师撰写，从实际应用角度，系统阐述如何使用类型系统编写更好、更安全的代码） (华章程序员书库)。
- [http://slideplayer.com/slide/7413918/](http://slideplayer.com/slide/7413918/)
- https://dev.to/leolas95/static-and-dynamic-typing-strong-and-weak-typing-5b0m
- [https://towardsdatascience.com/the-type-system-every-programmer-should-know-c3134a1b9bde](https://towardsdatascience.com/the-type-system-every-programmer-should-know-c3134a1b9bde)
- [https://stackoverflow.com/questions/45252709/what-is-the-difference-between-a-functor-and-a-monad](https://stackoverflow.com/questions/45252709/what-is-the-difference-between-a-functor-and-a-monad)
- [https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html](https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
