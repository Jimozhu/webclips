---
title: Rust生命周期详解
date: 2024-10-04T15:30:36.971Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/93193353
---
我们都知道 Rust 有 **引用（Reference）** 和 **借用（Borrow）** 的概念，当我们使用 Reference 的时候，Rust 会通过分析引用对象的生命周期来防止引用一个已经不可用的对象。大多数时候，对象的生命周期是可以推断的或者隐式的，无需我们手动去声明。

但是就像在 Generic 中我们需要声明类型一样，有些时候我们需要显示声明引用的生命周期，例如在函数中，编译器无法静态推断出入参和出参的生命周期，于是我们需要显式声明参数的生命周期。

## 通过生命周期阻止悬空指针

生命周期的主要目标是防止悬空指针。

```rust
{
    let r;

    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r);
}
```

上述例子外部范围生命了变量 r，内部区域声明了变量 x。在内部区域，我们尝试设置 r 为 x 的引用，当内部区域终止时，我们尝试打印 r。这份代码不会编译通过因为在打印 r 的地方我们尝试引用已经不再这个区域的变量 x。

```text
error[E0597]: `x` does not live long enough
  --> src/main.rs:7:5
   |
6  |         r = &x;
   |              - borrow occurs here
7  |     }
   |     ^ `x` dropped here while still borrowed
...
10 | }
   | - borrowed value needs to live until here
```

上述编译错误告诉我们 x 没有存在足够长的时间。原因是当运行到第 7 行时，x 将会被销毁，在第 10 行的时候，r 还在引用 x，但是此时 x 已经不存在了，此时编译器将会告诉我们 x 需要存在知道第 10 行，但是第 7 行就被销毁了！

## Borrow 检查

Rust 有个 Borrow 检查器用于检查 Borrow 对象（或者叫引用）是否有效。

```rust
{
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}
```

编译器会隐式生成生命周期 a 和 b，我们可以看到 x 存在 b 生命周期内，而 r 引用则存在 a 生命周期内，Borrow 检查器会在编译的时候会检查 r 的生命周期和 r 所指向的 x 的生命周期，而 r 的生命周期 a 大于 x 的生命周期，于是编译器会报错。

## 函数的泛型生命周期

让我们写个函数返回两个字符串中最长的一个。

```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
```

这个函数将两个`&str`作为 longest 的参数。因为我们不想拥有这两个字符串，所以我们只想让函数接受字符串引用，我们可以将`String`，字符串或者字符串 slice 作为 longest 的参数。

我们可以像如下一样实现 longest 函数。

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

这个函数接受两个 & str，返回最长的那个 & str。

但是这个函数编译的时候会报错

```text
error[E0106]: missing lifetime specifier
 --> src/main.rs:1:33
  |
1 | fn longest(x: &str, y: &str) -> &str {
  |                                 ^ expected lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but the
signature does not say whether it is borrowed from `x` or `y`
```

编译器告诉我们返回类型需要一个泛型生命周期参数因为编译器不能推断出返回值的生命周期是指向 x 的生命周期还是 y 的生命周期。实际上函数里面包含 if 语句和 else 语句，我们无法清楚知道返回值的生命周期是指向哪个！

这个时候我们需要显式声明生命周期！

## 函数签名中的生命周期参数

我们可以像泛型模板参数一样声明我们的生命周期参数。生命周期参数放在尖括号 <> 内，通过类似于`'a`来命名。

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

对于 longest 函数来说我们的返回值生命周期应该是 x 和 y 的生命周期中最小的那个。我们在模板参数中声明`'a`生命周期参数，然后在 x 和 y 参数中通过`&'a str`来使用这个生命周期参数。

生命周期参数不像模板参数是程序员显式声明的，而是编译器在编译器推断出来的。例如在上述 longest 例子中，当编译器看到`x: &'a str`的时候，`'a`会被编译器推断为 x 的生命周期，当编译器看到`y: &'a str`的时候，编译器会将`'a`推断为 y 的生命周期，但是此时有冲突，于是编译器会将`'a`推断为 x 和 y 的生命周期中最小的那个。

于是，上述 longest 函数便是返回值的生命周期将会是 x 和 y 的生命周期中最小的那个。

**函数的生命周期声明是函数的入参和返回值的一种生命周期约定和限制**。对于上述函数来说，生命周期参数限制了你的返回值只能是 x 和 y 的生命周期的最小的那个。

同时注意，生命周期声明类似于变量类型声明，不会改变对象的真正生命周期。当你生命的生命周期和实际不符合的时候，编译器会报错。

```rust
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

上述函数声明了`'a`和`'b`生命周期参数，分别对应 x 和 y 的生命周期。函数返回值声明只会用 x 的生命周期。但是编译器发现函数可能返回 y，于是编译器会报错。

```text
42 | fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
   |                                   -------     -------
   |                                   |
   |                                   this parameter and the return type are declared with different lifetimes...
...
46 |         y
   |         ^ ...but data from `y` is returned here
```

编译器告诉我们返回的生命周期和声明的不符合。

## Struct 定义的生命周期声明

当我们定义的 struct 的里面有对象引用的时候，我们需要在 struct 的模板参数中增加生命周期声明。

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.')
        .next()
        .expect("Could not find a '.'");
    let i = ImportantExcerpt { part: first_sentence };
}
```

上述例子中我们定义了 ImportantExcerpt struct，其中 part 是一个字符串引用。此时我们需要声明 part 的生命周期。在这里生命周期`'a`便是 part 的生命周期，编译器会在编译的时候检查 ImportantExcerpt 和`'a`，如果 ImportantExcerpt 大于`'a`，则会报错。

跟函数生命周期声明类似，当一个生命周期参数修饰多个字段的时候，编译器会将这个生命周期参数推断出这几个字段生命周期最小的那个。

```rust
struct Foo<'a> {
    x: &'a i32,
    y: &'a i32,
}

fn main() {

    let x = 6;
    let m;                     

    {                          
        let y = 6;            
        let f = Foo { x: &x, y: &y };  
        m = f.x;             
    }                          

    println!("{}", m);        
}
```

在上述例子中，Foo 包含一个生命周期参数，这个生命周期参数修饰了 x 和 y 结构体字段，`'a`将会被编译器推断为 x 和 y 的生命周期中最小的那个，在这个例子中，`'a`会被推断为 y 的生命周期。 在这个例子中，编译器会报错，因为 x 的生命周期被声明为和 y 的生命周期一样，所以当打印 m 的时候，x 会被编译器认为已经无效。

```rust
error[E0597]: `y` does not live long enough
  --> src/main.rs:13:33
   |
13 |         let f = Foo { x: &x, y: &y };  
   |                                 ^^ borrowed value does not live long enough
14 |         m = f.x;             
15 |     }                          
   |     - `y` dropped here while still borrowed
16 |                                
17 |     println!("{}", m);        
   |                    - borrow later used here
```

上面错误告诉我们 y 的生命周期不够长。其实就是说 r 引用的生命周期应该至少要到 print 那一样，但是 y 的生命周期没有那么长，于是就报错了。

我们可以将我们的代码修改成如下：

```rust
struct Foo<'a, 'b> {
    x: &'a i32,
    y: &'b i32,
}

fn main() {

    let x = 6;
    let m;                     

    {                          
        let y = 6;            
        let f = Foo { x: &x, y: &y };  
        m = f.x;             
    }                          

    println!("{}", m);        
}
```

此时`'a`将会被推断为 x 的生命周期，`'b`将会被推断为 y 的生命周期，编译将会通过！

## 省略生命周期参数

如果当我们使用引用的时候就要声明生命周期，那我们需要多写很多模式代码，那就太无趣了！幸亏 Rust 已经帮我们考虑了这一点，在一些常见情境下，我们可以省略生命周期声明。

当前 Rust 在以下三种情况下可以省略生命周期声明：

* 函数的每个参数将会赋予各自的生命周期。例如`fn foo(x: &i32)`将相当于为`fn foo<'a>(x: &'a i32)`，`fn foo(x: &i32, y: &i32)`相当于`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`，以此类推。
* 如果输入参数只有一个生命周期参数，那个这个生命周期参数将会被赋予所有输入值。例如`fn foo(x: &i32) -> &i32`相当于`fn foo<'a>(x: &'a i32) -> &'a i32`。
* 在 struct 的 impl 语句中，如果有多个输入参数，但是输入参数中有**\&self**或者**\&mut self**，那么 self 的生命周期将会被赋予所有的书参数。这条规则对于编写 struct 方法是非常有利的。

第一条规则很好理解，编译器会被每个引用赋予各自的生命周期参数，这也是默认行为。

第二条要注意输入参数只有一个生命周期参数的时候才能适用，当只有一个生命周期参数的时候，返回值的生命周期只能为输入参数的生命周期，因此无需手动声明。

```rust
struct Context<'a>(&'a str);
fn do_context(context: &Context) {}
```

上述代码片段会报错，因为 do\_context 需要两个生命周期参数，因此不能省略。

第三条规则表示对于 struct 的方法来说，默认的返回值跟对象的生命周期一致，这也是大多数情况下的行为。但是一些特殊情况下，如果我们想要返回 struct 中某些字段的生命周期大于对象本身的时候，我们需要显式指定。

```rust
struct Context<'a>(&'a str);

struct Parser<'a> {
    context: &'a Context<'a>,
}

impl<'a> Parser<'a> {
    fn parse(&self) -> Result<(), &str> {
        Err(&self.context.0[1..])
    }
}

fn parse_context<'a>(context: &'a Context<'a>) -> Result<(), &'a str> {
    Parser { context: context }.parse()
}
```

例如对于上述例子来说，Parser 的生命周期参数`'a`将会推断为 Context 和 str 的生命周期中的最小的那个，但是在`parse_context`中，`'a`生命周期应该在`parse_context`外部，很明显大于 Parser 的生命周期，如此返回的 str 也是`'a`生命周期，应该是正确的。但是当我们编译的时候，出现如下错误：

```text
error[E0515]: cannot return value referencing temporary value
  --> src/lib.rs:14:5
   |
14 |     Parser { context: context }.parse()
   |     ---------------------------^^^^^^^^
   |     |
   |     returns a value referencing data owned by the current function
   |     temporary value created here
```

编译器说返回的对象是局部的！问题在哪里？ 原来是 Parser 的 parse 方法的默认返回值的生命周期和 Parser 对象是一致的，所以 parse 返回的引用在 parse\_context 结束的时候就无效了，因此编译器报错了，埋怨引用了局部对象。

找到了问题的症结，我们需要显示生命 parse 方法的返回值为`'a`生命周期，而不是默认的 Parser 的生命周期！

```rust
struct Context<'a>(&'a str);

struct Parser<'a> {
    context: &'a Context<'a>,
}

impl<'a> Parser<'a> {
    fn parse(&self) -> Result<(), &'a str> {
        Err(&self.context.0[1..])
    }
}

fn parse_context<'a>(context: &'a Context<'a>) -> Result<(), &'a str> {
    Parser { context: context }.parse()
}
```

编译通过，我们可以引用 Parser 里面的内部变量了！
