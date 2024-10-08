---
title: go 1.18泛型
date: 2022-11-13T08:50:11.000Z
draft: false
categories:
  - dev
tags:
  - dev
  - golang
  - go
---
# 什么是泛型

泛型程序设计（generic programming）是程序设计语言的一种风格或范式。泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型。各种程序设计语言和其编译器、运行环境对泛型的支持均不一样。Java 和 C# 称之为泛型（generics）ML、Scala 和 Haskell 称之为参数多态（parametric polymorphism）；C++ 和 D 称之为模板（template）。具有广泛影响的 1994 年版的《Design Patterns》一书称之为参数化类型（parameterized type）。

# 为什么需要泛型

考虑这么一个需求，实现一个函数，这个函数接受 2 个 int 的入参，返回两者中数值较小的。需求是非常简单的，我们可以不假思索的写下如下的代码：

```go
func Min(a,b int) int {
    if a < b {
        return a
    }
    return b
}
```

看起来很美好，但是这个函数有局限性，入参只能用 int 类型，如果需求做了拓展，需要支持对两个 `float64` 的入参做判断，返回两者中较小的。

众所周知，go 是一个强类型的语言，且不像 c 那样在算术表达式里有隐式的类型转换（例如隐式的 int 转 bool，float 转 int），所以上述这个函数就不能满足需求场景的，不过要支持这个拓展的需求也是很简单的，改成如下的代码然后使用 MinFloat64 即可：

```go
func Min(a,b int) int {
    if a < b {
        return a
    }
    return b
}
func MinFloat64(a,b float64) float64 {
    if a < b {
        return a
    }
    return b
}
```

但是如果需求又做了拓展，需要支持对两个 int64 类型的。同理也很简单，如下：

```go
func Min(a,b int) int {
    if a < b {
        return a
    }
    return b
}
func MinFloat64(a,b float64) float64 {
    if a < b {
        return a
    }
    return b
}
func MinInt64(a,b int64) int64 {
    if a < b {
        return a
    }
    return b
}
```

但是如果需求又做了拓展......然后我们就一直加哇加哇

不知道大家有没有发现，一旦需求做了拓展，我们都需要也跟着做一些变更，一直做着重复事情，而且通过看函数原型，我们发现只有类型声明这里不一致，当然函数名也是不一致，因为 golang 也是不支持**函数重载（function overloading）** 的，如果 golang 支持了函数重载，我们这里不一致的也就只剩下类型了（ps：函数重载其实也是泛型的一种实现，在编译时通过将类型参数信息加入函数符号里，就实现了编码时的调用同名函数，但是在运行时因为类型信息也不会有二义性）。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/go_generic/6e81e4ba.webp)

那么有没有一种手段可以减少我们重复的工作量呢？在需求做了拓展后，也能在不改动原有代码的基础上做支持，也就是提高代码的可复用性，而这就是泛型的使命。

# before go1.18 泛型

在没有泛型前，开发者们是如何实现"泛型的"。

1. ## copy \& paste

这是我们最容易想到的方式，也是我们在前文介绍的方式，看起来是一种很笨的方式，但是结合实际情况，大多数情况下你可能只需要两三个类型的实现，过早的去优化，可能会带来更多的问题，go proverbs 里有一句就很符合这个场景。

> [“A little copying is better than a little dependency.](https://www.youtube.com/watch?v=PAAkCSZUG1c&t=9m28s "https://www.youtube.com/watch?v=PAAkCSZUG1c&t=9m28s")”（一点复制好过一点依赖）

优点：无需额外的依赖，代码逻辑简单。

缺点：代码会有一些臃肿，且灵活性有缺失。

2. ## interface

比较符合 OOP 的思路，面向接口编程则容易想到这种途径，不过像我们上述的取两数 min 场景就不能用 interface 去满足了，可应用的场景比较单一，考虑有下边这样一个接口。

```go
type Inputer interface {
    Input() string
}
```

对于 Inputer 接口，我们可以定义有多种实现，比如

```go
type MouseInput struct{}

func (MouseInput) Input() string {
    return "MouseInput"
}

type KeyboardInput struct{}
func (KeyboardInput) Input() string {
    return "KeyboardInput"
}
```

这样我们在调用时，也就可以用不同的类型定义相同的接口，通过 interface 来调用相同的函数了。不过本质上 interface 和 generic 是两种设计思路，应用的场景也不太一样，这里只是举了一个共通的例子。

优点：无需额外的依赖，代码逻辑简单。

缺点：代码会有一些臃肿，且应用的场景较单一。

3. ## reflect

reflect（反射）在运行时动态获取类型，golang runtime 将使用到的类型都做了存储，对于用户层 golang 则提供了非常强大的反射包，牺牲了性能，但是提供更多的便捷性，帮助程序员在可以在静态语言里使用一些动态的特性，本质上 reflect 和 generic 是两种截然不同的设计思路，反射在运行时发挥作用，而泛型则在编译时发挥作用，runtime 无须感知到泛型的存在，像 gorm 框架就大量用到了反射。reflect 包就内置了 DeepEqual 的实现，用来判断了两个入参是否相等。

```go
func DeepEqual(x, y any) bool {
   if x == nil || y == nil {
      return x == y
   }
   v1 := ValueOf(x)
   v2 := ValueOf(y)
   if v1.Type() != v2.Type() {
      return false
   }
   return deepValueEqual(v1, v2, make(map[visit]bool))
}
```

优点：代码简单，使用方便。

缺点：运行时开销大，不安全，没有编译时的类型保障。

（ps:用过反射的基本都遇到过 panic，运行时的类型保障，reflect 包里就存在着大量的类型检查，不符合的直接 panic，对这里存疑，reflect 包和 map/slice 这些不太一样，比较偏用户场景，为什么不用 error，要用 panic，猜测是 go team 认为在静态语言里类型不 match 是非常严重的场景？）

4. ## code generator

代码生成，大家接触比较多的可能就是 thrift/grpc 的代码生成，将 idl 转换成对应的语言源代码。在这里的 code generator 概念上会不太一样，概念上可能会类似之前的 php/jsp，写一份通用的模板，在模板内预置一些变量，然后使用工具将预置的变量做填充，生成最终的语言代码（ps：好像和泛型也比较像，哈哈哈），go 在 1.5 时也引入了 `go generator` 工具，一般会结合 `text/template` 包来使用，在 go code generator 里有比较火第三方工具：[github.com/cheekybits/…](https://github.com/cheekybits/genny) generator 来写两数之 Min，会是下边这样的风格：

```go
package main

import "github.com/cheekybits/genny/generic"

//go:generate genny -in=$GOFILE -out=gen-$GOFILE gen "T=int,float32,float64"
type T generic.Type

func MinT(a, b T) T {
   if a < b {
      return a
   }
   return b
}
```

执行 `go generator` 会生成如下代码：

```go
// This file was automatically generated by genny.
// Any changes will be lost if this file is regenerated.
// see https://github.com/cheekybits/genny

package main

func MinInt(a, b int) int {
   if a < b {
      return a
   }
   return b
}

func MinFloat32(a, b float32) float32 {
   if a < b {
      return a
   }
   return b
}

func MinFloat64(a, b float64) float64 {
   if a < b {
      return a
   }
   return b
}
```

优点：代码比较干净，因为是使用前去生成，也可以利用到静态检查的能力，安全且无运行时开销。

缺点：需要针对性的写模板代码，然后使用工具生成最终代码后才能在工程中使用，且依赖第三方的构建工具，因为涉及多份类型的源代码生成，工程里的代码里会变多，导致最终构建出的二进制也会较大。

# go 1.18 泛型

go 泛型的路程也是非常曲折的...

| **简述**                                | **时间** | **作者**                           |
| --------------------------------------- | -------- | ---------------------------------- |
| \[Type Functions\]                        | 2010 年  | Ian Lance Taylor                   |
| Generalized Types                       | 2011 年  | Ian Lance Taylor                   |
| Generalized Types v2                    | 2013 年  | Ian Lance Taylor                   |
| Type Parameters                         | 2013 年  | Ian Lance Taylor                   |
| go:generate                             | 2014 年  | Rob Pike                           |
| First Class Types                       | 2015 年  | Bryan C.Mills                      |
| Contracts                               | 2018 年  | Ian Lance Taylor, Robert Griesemer |
| Contracts                               | 2019 年  | Ian Lance Taylor, Robert Griesemer |
| Redundancy in Contracts\(2019\)‘s Design | 2019 年  | Ian Lance Taylor, Robert Griesemer |
| Constrained Type Parameters\(2020, v1\)   | 2020 年  | Ian Lance Taylor, Robert Griesemer |
| Constrained Type Parameters\(2020, v2\)   | 2020 年  | Ian Lance Taylor, Robert Griesemer |
| Constrained Type Parameters\(2020, v3\)   | 2020 年  | Ian Lance Taylor, Robert Griesemer |
| Type Parameters                         | 2021 年  | Ian Lance Taylor, Robert Griesemer |

从 2010 年开始设计，其中在发展过程中提出的 `Contracts`\(合约\)的方案，一度被认为会是泛型的实现，不过在 2019 年，也因为设计过于复杂做了废弃，直到 2021 年才确定了最终的基本方案开始实现，并在 2021 年 8 月的 golang 1.17 里做了 beta 版的实现，在 2022 年 1 月的 golang 1.18 里做了实装，真正意义上的十年磨一剑（ps：Ian Lance Taylor 太牛了）。

## 泛型类型

在 json 里有 number 类型，在 golang 的 `encoding/json` 库遇到 interface\{\}类型里默认就会用 float64 去解析 json 的 number 类型，这就会导致在面对大整数时会丢失精度，而实际上的 Number 类型应该对应到 golang 里的多个类型，包括 int32、int64、float32 和 float64 等，如果按照 golang 的语法，在泛型里我们可以这么标识 Number 类型。

```go
type Number[T int32|int64|float32|float64] T
```

但是很遗憾。。。目前 golang 还不支持这种写法，在编译时会有如下报错：

```
 cannot use a type parameter as RHS in type declaration
 //RHS:right hand side(在操作符的右侧)
```

报错的意思就是还不支持单独使用类型形参作为泛型类型，需要结合 struct、slice 和 map 等类型来使用，关于这个问题的讨论可以详见： [github.com/golang/go/i…](https://github.com/golang/go/issues/45639%EF%BC%8CIan "https://github.com/golang/go/issues/45639%EF%BC%8CIan") Lance Taylor 大佬做个回复：意思就是这是目前 go1.18 泛型已知的一个问题，具体大概会在 go 1.19 进行尝试。

我们尝试定义一个泛型 Number 切片类型，并实例化使用：

```go
package main

type Numbers[T int32 | int64 | float32 | float64] []T

func main() {
   var a = Numbers[int32]{1, 2, 3}
   println(a)
}
```

- T 就是**类型形参（type parameter）** ，这个关键字并不是固定的，我们可以起任何一个名字，它的作用就是用来占位的，标识这里有一个类型，但是具体的类型依赖于后边的类型约束。

* int32|int64|float32|float64 这一串用“或标识符 |”分隔的类型列表就是**类型约束（type constraint）** ，它约束了 T 的实际类型类型，我们也会这个类型列表叫做 **类型形参列表\(type parameter list\)**
* 而这里定义的类型就是 Numbers\[T\]，被称为**泛型类型\(generic type\)** ，泛型类型在定义时会带有形参
* 而这里定义的\[\]T 被称为**定义类型\(defined type\)**
* 在 main 函数里的 Numbers\[int32\]就是对泛型类型做了**实例化\(Instantiation\)** ，泛型只有在实例化后才能使用，其中这里的 int32 就是具体实例化的类型，必须是类型约束中定义的类型，叫做**类型实参\(type argument\)**

这里实际上是实例化了一个长度为 3，元素依次是 1,2,3 的 int32 的切片，同样的，我们也可以按如下这种方式定义，float32 也在我们的类型形参列表内。

```go
var b = Numbers[float32]{1.1, 2.1, 3.1}
```

上述是只有一个形参的泛型类型，我们来看几个复杂的泛型类型。

1. 多个类型形参

```go
type KV[K int32 | float32,V int8|bool] map[K]V//（多个类型形参的定义用逗号分隔）
var b = KV[int32, bool]{10: true}
```

上述我们定义了 `KV[K,V]` 这个泛型类型，`K` 和 `V` 是类型形参，`K` 的类型约束是 `int32|float32`，`V` 的类型约束是 `int8|bool`，`K int32 | float32,V int8|bool` 则是 `KV` 类型的类型形参列表，`KV[int32, bool]` 则是泛型类型的实例化，其中 `int32` 是 `K` 的实参，`bool` 是 `V` 的实参。

2. 嵌套的形参

```go
type User[T int32 | string, TS []T | []string] struct {
   Id     T
   Emails TS
}
var c = User[int32, []string]{
   Id:     10,
   Emails: []string{"123@qq.com", "456@gmail.com"},
}
```

这段个类型看起来会比较复杂，但是 golang 有一条限制：任何定义的形参，在使用时都需要有按顺序一一对应的实参。上述我们定义了 struct\{Id T Email TS\}这个泛型类型，`T` 和 `TS` 是类型形参，`T` 的类型约束是 `int32|string`，`TS` 的类型约束是 `[]T|[]string`，也就是说，我们在这里定义的 TS 形参的类型约束里使用了前置定义的 T 形参，这种语法 golang 也是支持的。

3. 形参传导的嵌套

```go
type Ints[T int32|int64] []T
type Int32s[T int32] Ints[T]
```

这里我们定义了 Ints 类型，形参是 int32|int64，又基于 Ints 类型，定义了 Int32s 类型，就是我们第二行的这个代码，初看起来可能会比较懵，但是拆开来看：

Int32s\[T\]这个泛型类型，T 是类型形参，T 的类型约束是 `int32`，Ints\[T\]则是这里的定义类型，这里的定义类型又是一个泛型类型，而实例化这个泛型类型的方式就是使用实参 T 来进行实例化，注意 T 在这里是 Int32s 的形参，确是 Ints 的实参。

## 泛型函数

仅有泛型类型并不能发挥泛型真正的作用，泛型最强大的作用是结合函数来使用，回到我们最开始的那个例子，取两数之 min，在有泛型的情况下，我们可以写出这样的代码：

```go
package main


func main() {
   println(Min[int32](10, 20))
   println(Min[float32](10, 20))
}

func Min[T int | int32 | int64 | float32 | float64](a, b T) T {
   if a < b {
      return a
   }
   return b
}
```

上述我们定义了 Min 泛型函数，包含泛型 T 类型，有对应的类型约束，在实际调用时，我们分别用 int32/float32 去做了形参实例化，来调用不同类型的泛型函数。

上述在使用起来也会有不方便的地方，我们在调用时还需要显示的去指定类型，才能使用泛型函数，golang 对这种情况支持了**自动类型推导（auto type inference）** ,可以简化我们的写法 **，** 我们可以像下述这种方式去调用 Min 函数。

```go
Min(10, 20)//golang里会把整数字面量推导为int，所以这里实际实例化的函数为Min[int]
Min(10.0, 20.0)//浮点数字面量推导为float64，所以这里调用的实例化函数为Min[float64]
```

有了泛型函数，一些常见的操作，比如集合操作取交/并/补/差集合也可以很简单的写出来了，在之前第三方的 lib 一般都是用反射来实现的，比如：[github.com/thoas/go-fu…](https://github.com/thoas/go-funk%E3%80%82 "https://github.com/thoas/go-funk%E3%80%82")

结合泛型类型和泛型函数，就是使用泛型 receiver，可以构造高级一点的集合数据结构了，比如在其他语言里比较常见的**栈\(stack\)** 。

```go
package main

import (
   "fmt"
)

type Stack[T interface{}] struct {
   Elems []T
}

func (s *Stack[T]) Push(elem T) {
   s.Elems = append(s.Elems, elem)
}

func (s *Stack[T]) Pop() (T, bool) {
   var elem T
   if len(s.Elems) == 0 {
      return elem, false
   }
   elem = s.Elems[len(s.Elems)-1]
   s.Elems = s.Elems[:len(s.Elems)-1]
   return elem, true
}

func main() {
   s := Stack[int]{}
   s.Push(10)
   s.Push(20)
   s.Push(30)
   fmt.Println(s)
   fmt.Println(s.Pop())
   fmt.Println(s)
}
//输出：
//{[10 20 30]}
//30 true
//{[10 20]}
```

上述我们定义了 Stack\[T\]这个泛型类型，我们使用空接口：interface\{\}做泛型约束，空接口的含义是不限制具体的类型，也就是可以用所有的类型进行实例化。实现了 Pop 和 Push 操作，有了泛型，像其他语言里常见的队列、优先队列、Set 等高级数据结构也可以比较简单的实现（像之前一些第三方的 lib 一般都是用反射来实现的）。

这里指的一提的是泛型并不支持直接使用我们之前常用的**类型断言\(type assert\)。**

```go
func (s *Stack[T]) Push(elem T) {
   switch elem.(type) {
   case int:
      fmt.Println("int push")
   case bool:
      fmt.Println("bool push")
   }
   s.Elems = append(s.Elems, elem)
}

//cannot use type switch on type parameter value elem (variable of type T constrained by any)
```

如果想获取一个泛型类型的实际类型，可以通过转换到 interface\{\}来实现（当然也可以用反射来实现）。

```go
func (s *Stack[T]) Push(elem T) {
   var a interface{}
   a = elem
   switch a.(type) {
   case int:
      fmt.Println("int push")
   case bool:
      fmt.Println("bool push")
   }
   s.Elems = append(s.Elems, elem)
}
```

## interface

golang 里有基础类型和复合类型这两类内置类型。

基础数据类型包括：布尔型、整型、浮点型、复数型、字符型、字符串型、错误类型。

复合数据类型包括：指针、数组、切片、字典、通道、结构体、接口。

通过将基础类型和复合类型做组合，我们可以定义出非常多的泛型，但是大量的类型会导致类型约束写的非常长，拿 number 来举例：

```go
type Numbers[T int|int8|int16|int32|int64|float32|float64] []T
```

### 定义类型约束

golang 支持用 interface 来预定义类型约束，这样我们在使用时就可以复用已有的类型约束，如下：

```go
type Number interface {
   int | int8 | int16 | int32 | int64 | float32 | float64
}

type Numbers[T Number] []T
```

内置类型可以自由组合形成泛型，同理，接口也可以跟接口组合，接口也可以跟内置类型组合来形成泛型。

```go
type Int interface {
   int | int8 | int16 | int32 | int64
}

type UInt interface {
   uint | uint8 | uint16 | uint32 | uint64
}

type IntAndUInt interface {
   Int | UInt
}

type IntAndString interface {
   Int | string
}
```

同样的 golang 为了方便我们使用也内置了两个接口，分别是 any 和 comparable。

### any

```go
// any is an alias for interface{} and is equivalent to interface{} in all ways.
type any = interface{}
```

any 其实是非常简单的，其实就是空接口（interface\{\}）的别名，空接口我们在上边也用到过，空接口是可以用作任意类型，用 any 可以更方便我们的使用，而且从语义上看，any 的语义也会比 interface\{\}的语义更加清晰。

### comparable

```go
// comparable is an interface that is implemented by all comparable types
// (booleans, numbers, strings, pointers, channels, arrays of comparable types,
// structs whose fields are all comparable types).
// The comparable interface may only be used as a type parameter constraint,
// not as the type of a variable.
type comparable interface{ comparable }
```

golang 内置了比较类型，是上述注释中提到的这些内置类型的组合，也是为了方便使用的，值得一提的是 comparable 是支持==和\!=操作，但是像比较大小的 > 和\<是不支持的，需要我们自己实现这种 **ordered** 类型。

```go
func Min[T comparable](a, b T) T {
   if a < b {
      return b
   }
   return a
}
//invalid operation: a < b (type parameter T is not comparable with <)
```

当然我们可以自己实现一份比较类型：

```go
type Signed interface {
        ~int | ~int8 | ~int16 | ~int32 | ~int64
}

type Unsigned interface {
        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr
}

type Integer interface {
        Signed | Unsigned
}

type Float interface {
        ~float32 | ~float64
}

// Ordered is a constraint that permits any ordered type: any type
// that supports the operators < <= >= >.
// If future releases of Go add new ordered types,
// this constraint will be modified to include them.
type Ordered interface {
        Integer | Float | ~string
}
```

而这正是 golang 官方拓展包的实现：[pkg.go.dev/golang.org/…](https://pkg.go.dev/golang.org/x/exp/constraints "https://pkg.go.dev/golang.org/x/exp/constraints")

### interface 集合操作

1. 并集

我们上边在用的一直都是**并集**操作，也就是用竖线分隔的多个类型：

```go
type Float interface {
        float32 | float64
}
```

上述的 Float 类型约束就支持 float32/float64 的实例化。

2. 交集

同样的 interface 也支持**交集**操作，将类型分别写到多行，最终 interface 定义的类型约束就是这几行约束的交集：

```go
type Float interface {
        float32 | float64
}
type Float32 interface {
        Float
        float32
}
```

这里我们定义的 Float32 就 Float 和 float32 的交集，而 Float 是 float32|float64，所以 Float32 最终其实只定义了 float32 这一个泛型约束（属于是....）。

3. 空集

通过空的交集我们可以定义出空的 interface 约束，比如

```go
type Null interface {
    float32
    int32
}
```

上述我们定义的 Null 就是 float32 和 int32 的交集，这两个类型的交集为空，所以最终定义出的这个 Null 就是一个空的类型约束，编译器不会阻止我们这样使用，但是实际上并没有什么意义。

### \~符号

在上边的 Ordered 类型约束的实现里，我们看到了\~这个操作符，这个操作符的意思是，在实例化泛型时，不仅可以直接使用对应的实参类型，如果实参的底层类型在类型约束中，也可以使用，说起来可能比较抽象，来一段代码看一下

```go
package main

type MyInt int

type Ints[T int | int32] []T

func main() {
   a := Ints[int]{10, 20} //正确
   b := Ints[MyInt]{10, 20}//错误
   println(a)
   println(b)
}
//MyInt does not implement int|int32 (possibly missing ~ for int in constraint int|int32)
```

所以为了支持这种新定义的类型但是底层类型符合的方便使用，golang 增加了新的 `~` 字符，意思是如果底层类型 match，就可以正常进行泛型的实例化。所以可以改成如下的写法：

```go
type Ints[T ~int | ~int32] []T
```

### interface 的变化

go 复用了 interface 关键字来定义泛型约束，那么对 interface 的定义自然也就有了变化，在 go1.18 之前，interface 的定义是：[go.dev/doc/go1.17\_…](https://go.dev/doc/go1.17_spec#Interface_types "https://go.dev/doc/go1.17_spec#Interface_types")

```go
An interface type specifies a method set called its interface
```

对 interface 的定义是 **method set\(方法集\)** ，也确实是这样的，在 go1.18 前，interface 就是方法的集合。

```go
type ReadWriter interface {
   Read(p []byte) (n int, err error)
   Write(p []byte) (n int, err error)
}
```

上述 ReadWriter 这个类型就是定义了 Read 和 Write 这两个方法，但是我们不妨反过来看待问题，有多个类型都实现了 ReadWrite 接口，那我们就可以把 ReadWrite 看成是多个类型的集合，而这个类型集合里的每一个类型都实现了 ReadWrite 定义的这两个方法，这里拿我们上边的空接口 interface\{\}来举例，因为每个类型都实现了空接口，所以空接口就可以用来标识全部类型的集合，也就是我们前文介绍的 any 关键字。

所以结合上述我们介绍的用 interface 来定义泛型约束的类型集合，go1.18 中，interface 的定义换成了：[go.dev/ref/spec#In…](https://go.dev/ref/spec#Interface_types "https://go.dev/ref/spec#Interface_types")

```
An interface type defines a type set.
```

对 interface 是 **type set\(类型集\)** ，对 interface 的定义从方法集变成了类型集。接口类型的变量可以存储接口类型集中的任何类型的值。而为了 golang 承诺的兼容性，又将 interface 分成了两种，分别是

1. **基本接口（basic interface）**

2) **一般接口（general interface）**

### 两种 interface

#### 基本接口

如果接口定义里只有方法没有类型（也是在 go1.18 之前接口的定义，用法也是基本一致的），那么这种接口就是**基本接口（basic interface）** 。

- 基本接口可以用来定义变量，例如最常用的 error，这个跟 go1.18 之前的定义是一致的

```go
// The error built-in interface type is the conventional interface for
// representing an error condition, with the nil value representing no error.
type error interface {
   Error() string
}

var err error
```

- 基本接口也可以作为类型约束，例如

```go
package main

import (
   "bytes"
   "io"
   "strings"
)

type ReadOrWriters[T io.Reader | io.Writer] []T

func main() {
   rs := ReadOrWriters[io.Reader]{bytes.NewReader([]byte{}), bytes.NewReader([]byte{})}
   ws := ReadOrWriters[io.Writer]{&strings.Builder{}, &strings.Builder{}}
}
```

#### 一般接口

只要接口里包含类型约束（无论是否包含方法），这种接口被称为 **一般接口\(General interface\)** ，如下例子都是一般接口

- 一般接口不能用来定义变量（限制一般接口只能用在泛型内，同时不影响 go1.18 前的接口定义）

```go
package main

type Int interface {
   int | int8 | int16 | int32 | int64
}

func main() {
   var i Int
}
//interface contains type constraints
```

- 一般接口只能用来定义类型约束

# 一些有意思的设计

1. 为什么选用了方括号 `[]` 而不是其他语言里常见的尖括号 `<>`。

是为了和 map，slice 这些「内置泛型」保持一致，这样用起来会更协调。golang 官方也回答了他们为什么选择了\[\]，而不是\<>，因为尖括号会导致歧义：

> When parsing code within a function, such as `v := F<T>`, at the point of seeing the `<` it's ambiguous whether we are seeing a type instantiation or an expression using the `<` operator. Resolving that requires effectively unbounded lookahead. In general we strive to keep the Go parser simple.
>
> 当解析一个函数块中的代码时，类似 `v := F<T>` 这样的代码，当编译器看到 `<` 符号时，它搞不清楚这到底是一个泛型的实例化，还是一个使用了小于号的表达式。解决这个问题需要有效的无界 lookahead。但我们现在更希望让 Go 的语法解析保持足够的简单。

# 总结

以上我们介绍了泛型的基本概念以及为什么需要泛型，在 go1.18 以前大家也都有各自的“泛型”实现方式，下一篇文章我们会解析 golang 泛型的实现原理。go 对泛型的支持还是非常谨慎的，目前的功能也不是很丰富，回到最开始的那句话，泛型引入了抽象，无用的抽象带来复杂性，所以在泛型的使用上也要非常慎重。

# 引用

1. [go.dev/ref/spec](https://go.dev/ref/spec)
2. [go.googlesource.com/proposal/+/…](https://go.googlesource.com/proposal/+/refs/heads/master/design/43651-type-parameters.md)
3. [go.dev/doc/go1.17\_…](https://go.dev/doc/go1.17_spec)
4. [go.googlesource.com/proposal/+/…](https://go.googlesource.com/proposal/+/refs/heads/master/design/43651-type-parameters.md)
5. [golang3.eddycjy.com/posts/gener…](https://golang3.eddycjy.com/posts/generics-history/)
6. [Go 1.18 泛型全面讲解：一篇讲清泛型的全部](https://segmentfault.com/a/1190000041634906 "https://segmentfault.com/a/1190000041634906")
