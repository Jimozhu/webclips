---
title: 代数数据类型是什么？
date: 2024-10-04T15:30:37.477Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/24460419/answer/771705967
---
[函数范式与领域建模​zhangyi.xyz/fp-and-domain-model/![](https://picx.zhimg.com/v2-acc2e0d1929c157af4a547de23da2ca1_180x120.jpg)](https://link.zhihu.com/?target=http%3A//zhangyi.xyz/fp-and-domain-model/)

这个挺好。

## \[译] 翻译[@尹良灿](//www.zhihu.com/people/7612e4fc31e958c2b2e90dffb1770126)推荐的:

## 代数类型大小和域建模[Algebraic type sizes and domain modelling](https://link.zhihu.com/?target=http%3A//fsharpforfunandprofit.com/posts/type-size-and-design/)

2015 年 8 月 13 日 [tweet](https://link.zhihu.com/?target=https%3A//twitter.com/intent/tweet)

在这篇文章中，我们将研究如何计算代数类型的 “大小” 或基数，并了解这些知识如何帮助我们做出设计决策。

## 入门

我将通过将其视为一个集合并计算可能元素的数量来定义类型的 “大小”。

例如，有两种可能的布尔值，因此`Boolean`类型的大小为 2。

是否有尺寸为 1 的类型？是 - `unit`类型只有一个值：`()`。

是否有大小为零的类型？也就是说，是否有一种根本没有价值的类型？不是在 F＃中，而是在 Haskell 中。它被称为`Void`。

这样的类型怎么样：

```text
type ThreeState = 
    | Checked
    | Unchecked
    | Unknown
```

它的大小是多少？有三种可能的值，因此大小为三。

这样的类型怎么样：

```text
type Direction = 
    | North
    | East
    | South
    | West
```

显然，四。

我想你应该已经明白了！

## 计算 product 类型的大小

我们来看看现在计算组合类型的大小。如果你记得[理解 F＃类型](https://link.zhihu.com/?target=https%3A//fsharpforfunandprofit.com/series/understanding-fsharp-types.html)系列，有两种代数类型：“product” 类型，如[元组](https://link.zhihu.com/?target=https%3A//fsharpforfunandprofit.com/posts/tuples/)和记录，以及 “sum” 类型，在 F＃中称为[区分联合](https://link.zhihu.com/?target=https%3A//fsharpforfunandprofit.com/posts/discriminated-unions/)。

例如，假设我们有一个`Speed`以及一个`Direction`，我们将它们组合成一个名为的记录类型`Velocity`：

```text
type Speed = 
    | Slow
    | Fast

type Velocity = {
    direction: Direction
    speed: Speed 
    }
```

大小是`Velocity`多少？

这是每个可能的价值：

```text
{direction=North; speed=Slow}; {direction=North; speed=Fast}
{direction=East;  speed=Slow}; {direction=East;  speed=Fast}
{direction=South; speed=Slow}; {direction=South; speed=Fast}
{direction=West;  speed=Slow}; {direction=West;  speed=Fast}
```

有八个可能的值，一个用于两个`Speed`值和四个`Direction`值的每种可能组合。

我们可以将其概括为一条规则：

* **规则：product 类型的大小是组件类型大小的*乘积*。**

也就是说，给定一个这样的记录类型：

```text
type RecordType = {
    a : TypeA
    b : TypeB }
```

大小计算如下：

```text
size(RecordType) = size(TypeA) * size(TypeB)
```

对于一个元组来说同样如此：

```text
type TupleType = TypeA * TypeB    
```

大小是：

```text
size(TupleType) = size(TypeA) * size(TypeB)
```

### sum 类型

可以以相同的方式分析求和类型。给定这样`Movement`定义的类型：

```text
type Movement = 
    | Moving of Direction
    | NotMoving
```

我们可以写出并计算所有可能性：

```text
Moving North
Moving East
Moving South
Moving West
NotMoving
```

所以，总共五个。这恰好是`size(Direction) + 1`。这是另一个有趣的一个：

```text
type ThingsYouCanSay =
    | Yes
    | Stop
    | Goodbye

type ThingsICanSay =
    | No
    | GoGoGo
    | Hello

type HelloGoodbye = 
    | YouSay of ThingsYouCanSay 
    | ISay of ThingsICanSay 
```

同样，我们可以写出并计算所有可能性：

```text
YouSay Yes
ISay No
YouSay Stop
ISay GoGoGo
YouSay Goodbye
ISay Hello
```

在这种`YouSay`情况下有三个可能的值，在这种情况下有三个可能的值，总共`ISay`六个。

同样，我们可以制定一般规则。

* **规则：sum 或 union 类型的大小是组件类型大小的*总和*。**

也就是说，给定一个这样的联合类型：

```text
type SumType = 
    | CaseA of TypeA
    | CaseB of TypeB
```

大小计算如下：

```text
size(SumType) = size(TypeA) + size(TypeB)
```

## 使用泛型类型

如果我们将泛型类型放入混合中会发生什么？

例如，像这样的类型的大小是多少：

```text
type Optional<'a> =   
    | Something of 'a
    | Nothing
```

嗯，首先要说的是，`Optional<'a>`它不是一个 *类型，* 而是一个*类型构造函数*。`Optional<string>`是一种类型。`Optional<int>`是一种类型，但`Optional<'a>`不是。

尽管如此，我们仍然可以通过注意到它`size(Optional<string>)`只是`size(string) + 1`，`size(Optional<int>)`只是等来计算它的大小`size(int) + 1`。

所以我们可以说：

```text
size(Optional<'a>) = size('a) + 1
```

同样，对于具有两个[泛型](https://zhida.zhihu.com/search?content_id=170377489\&content_type=Answer\&match_order=3\&q=%E6%B3%9B%E5%9E%8B\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzEsInEiOiLms5vlnosiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzAzNzc0ODksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjozLCJ6ZF90b2tlbiI6bnVsbH0.qxfcvESIMO29my44_3R6ZTPD08SOInX4zfggN9LVrTE\&zhida_source=entity)的类型，如下所示：

```text
type Either<'a,'b> =   
    | Left of 'a
    | Right of 'b
```

我们可以说它的大小可以使用通用组件的大小来计算（使用上面的 “求和规则”）：

```text
size(Either<'a,'b>) = size('a) + size('b)
```

## 递归类型

那么递归类型呢？让我们看看最简单的一个链表。

链表是空的，或者它有一个带元组的单元格：头部和尾部。头是一个`'a`，尾巴是另一个列表。这是定义：

```text
type LinkedList<'a> = 
    | Empty
    | Node of head:'a * tail:LinkedList<'a>
```

要计算大小，让我们为各种组件指定一些名称：

```text
let S = size(LinkedList<'a>)
let N = size('a)
```

现在我们可以写：

```text
S = 
    1         // Size of "Empty" case 
    +         // Union type
    N * S     // Size of "Cell" case using tuple size calculation
```

让我们来看看这个公式吧。我们从：

```text
S = 1 + (N * S)
```

让我们用公式替换最后一个 S 得到：

```text
S = 1 + (N * (1 + (N * S)))
```

如果我们清理它，我们得到：

```text
S = 1 + N + (N^2 * S)
```

（`N^2`意思是 “N 平方”）

让我们再次用公式替换最后一个 S：

```text
S = 1 + N + (N^2 * (1 + (N * S)))
```

并再次清理：

```text
S = 1 + N + N^2 + (N^3 * S)
```

你可以看到这是怎么回事！公式`S`可以无限扩展为：

```text
S = 1 + N + N^2 + N^3 + N^4 + N^5 + ...
```

我们怎么解释这个？好吧，我们可以说列表是以下情况的联合：

* 空列表（大小 = 1）
* 一个元素列表（大小 = N）
* 两个元素列表（大小 = N x N）
* 三元素列表（大小 = N x N x N）
* 等等。

而这个公式已经抓住了这一点。

另外，您可以`S`使用公式直接计算`S = 1/(1-N)`，这意味着`Direction`（size = 4）的列表具有 “-1/3” 的大小。嗯，这很奇怪！它让我想起了[这个 “-1/12” 视频](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fv%3Dw-I6XTVZXww)。

## 计算函数的大小

功能怎么样？他们可以大小吗？

是的，我们需要做的就是记下每个可能的实现并计算它们。简单！

例如，假设我们有一个函数`SuitColor`映射卡`Suit`到`Color`，红色或黑色。

```text
type Suit = Heart | Spade | Diamond | Club
type Color = Red | Black

type SuitColor = Suit -> Color
```

无论提供什么样的诉讼，一种方法是返回红色：

```text
(Heart -> Red); (Spade -> Red); (Diamond -> Red); (Club -> Red)
```

另一种实施方式是为所有套装返回红色，除了`Club`：

```text
(Heart -> Red); (Spade -> Red); (Diamond -> Red); (Club -> Black)
```

实际上我们可以写下这个函数的所有 16 种可能的实现：

```text
(Heart -> Red); (Spade -> Red); (Diamond -> Red); (Club -> Red)
(Heart -> Red); (Spade -> Red); (Diamond -> Red); (Club -> Black)
(Heart -> Red); (Spade -> Red); (Diamond -> Black); (Club -> Red)
(Heart -> Red); (Spade -> Red); (Diamond -> Black); (Club -> Black)

(Heart -> Red); (Spade -> Black); (Diamond -> Red); (Club -> Red)
(Heart -> Red); (Spade -> Black); (Diamond -> Red); (Club -> Black)  // the right one!
(Heart -> Red); (Spade -> Black); (Diamond -> Black); (Club -> Red)
(Heart -> Red); (Spade -> Black); (Diamond -> Black); (Club -> Black)

(Heart -> Black); (Spade -> Red); (Diamond -> Red); (Club -> Red)
(Heart -> Black); (Spade -> Red); (Diamond -> Red); (Club -> Black)
(Heart -> Black); (Spade -> Red); (Diamond -> Black); (Club -> Red)
(Heart -> Black); (Spade -> Red); (Diamond -> Black); (Club -> Black)

(Heart -> Black); (Spade -> Black); (Diamond -> Red); (Club -> Red)
(Heart -> Black); (Spade -> Black); (Diamond -> Red); (Club -> Black)
(Heart -> Black); (Spade -> Black); (Diamond -> Black); (Club -> Red)
(Heart -> Black); (Spade -> Black); (Diamond -> Black); (Club -> Black)
```

另一种思考方式是我们可以定义一个记录类型，其中每个值代表一个特定的实现：我们为`Heart`输入返回哪种颜色，我们为`Spade`输入返回哪种颜色，依此类推。

`SuitColor`因此，实现的类型定义如下所示：

```text
type SuitColorImplementation = {
    Heart : Color
    Spade : Color
    Diamond : Color
    Club : Color }
```

这种记录类型的大小是多少？

```text
size(SuitColorImplementation) = size(Color) * size(Color) * size(Color) * size(Color)
```

这里有四个`size(Color)`。换句话说，`size(Color)`每个输入都有一个，所以我们可以这样写：

```text
size(SuitColorImplementation) = size(Color) to the power of size(Suit)
```

一般来说，给定一个函数类型：

```text
type Function<'input,'output> = 'input -> 'output
```

该函数的大小是`size (output type) 的 size (input type)`次方：

```text
size(Function) =  size(output) ^ size(input)
```

让我们把它编成规则：

* **RULE：函数类型的大小是`size(output type)^size(input type)`。**

## 在类型之间转换

好吧，这一切都非常有趣，但它*有用*吗？

是的，我认为是。我认为理解这种类型的大小有助于我们设计从一种类型到另一种类型的转换，这是我们做了很多事情！

假设我们有一个联合类型和一个记录类型，两者都代表是 / 否答案：

```text
type YesNoUnion = 
    | Yes
    | No

type YesNoRecord = { 
    isYes: bool }
```

我们如何在它们之间进行映射？

它们都有 size = 2，所以我们应该能够将一种类型的每个值映射到另一种类型，反之亦然：

```text
let toUnion yesNoRecord =
    if yesNoRecord.isYes then 
        Yes
    else
        No

let toRecord yesNoUnion =
    match yesNoUnion with
    | Yes -> {isYes = true}
    | No ->  {isYes = false}
```

这就是你可以称之为 “无损” 的转换。如果您对转换进行往返，则可以恢复原始值。数学家会称之为*同构*（来自希腊语 “相同的形状”）。

另一个例子怎么样？这是一个包含三种情况的类型，是，否，也许。

```text
type YesNoMaybe = 
    | Yes
    | No
    | Maybe
```

我们可以无损地将其转换为此类型吗？

```text
type YesNoOption = { maybeIsYes: bool option }    
```

嗯，大小是`option`多少？一加上内部类型的大小，在这种情况下是一个`bool`。所以`size(YesNoOption)`也是三个。

以下是转换功能：

```text
let toYesNoMaybe yesNoOption =
    match yesNoOption.maybeIsYes with
    | None -> Maybe
    | Some b -> if b then Yes else No

let toYesNoOption yesNoMaybe =
    match yesNoMaybe with
    | Yes ->   {maybeIsYes = Some true}
    | No ->    {maybeIsYes = Some false}
    | Maybe -> {maybeIsYes = None}
```

所以我们可以制定一个规则：

* **规则：如果两种类型具有相同的大小，您可以创建一对无损转换函数**

我们来试试吧。这是一种`Nibble`类型和`TwoNibbles`类型：

```text
type Nibble = {
    bit1: bool
    bit2: bool
    bit3: bool
    bit4: bool }

type TwoNibbles = {
    high: Nibble
    low: Nibble }
```

我们可以转换`TwoNibbles`成`byte`后退吗？

大小`Nibble`is `2 x 2 x 2 x 2`= 16（使用产品大小规则），大小`TwoNibbles`是 size（Nibble）x size（Nibble），或者`16 x 16`是 256。

所以是的，我们可以转换`TwoNibbles`为 a `byte`和 back。

## 有损转换

如果类型不同，会发生什么？

如果目标类型比源类型 “更大”，那么您始终可以无损地映射，但如果目标类型比源类型 “小”，则会出现问题。

例如，`int`类型小于`string`类型。您可以将转换`int`为`string`准确，但你不能转换`string`成`int`容易。

如果*确实*要将字符串映射到 int，则必须将某些非整数字符串映射到目标类型中的特殊非整数值：

换句话说，我们从大小知道目标类型不能只是一个`int`类型，它必须是一个`int + 1`类型。换句话说，一个 Option 类型！

有趣的是，`Int32.TryParse`BCL 中的函数返回两个值，一个成功 / 失败`bool`，并将解析后的结果作为一个`int`。换句话说，一个元组`bool * int`。

该元组的大小`2 x int`是真正需要的更多值。选项类型 ftw！

现在让我们说我们正在从 a 转换`string`为 a `Direction`。有些字符串是有效的，但大多数都没有。但这一次，我们还要说，我们要区分空输入，太长输入和其他无效输入，而不是只有一个无效情况。

我们不能再使用 Option 为目标建模，所以让我们设计一个包含所有七种情况的自定义类型：

```text
type StringToDirection_V1 = 
    | North
    | East
    | South
    | West
    | Empty    
    | NotValid
    | TooLong
```

但是这种设计混合了成功的转换和失败的转换。为什么不将它们分开？

```text
type Direction = 
    | North
    | East
    | South
    | West

type ConversionFailure = 
    | Empty    
    | NotValid
    | TooLong

type StringToDirection_V2 = 
    | Success of Direction
    | Failure of ConversionFailure
```

大小是`StringToDirection_V2`多少？

有四种选择的`Direction`的`Success`情况下，和三个选择`ConversionFailure`的`Failure`情况下，使总规模为七，就像在第一个版本。

换句话说，这两种设计都是*等效的*，我们可以使用其中任何一种。

就个人而言，我更喜欢版本 2，但如果我们的遗留代码中有版本 1，那么好消息是我们可以无损地从版本 1 转换为版本 2 并再次返回。这反过来意味着如果需要，我们可以安全地重构到版本 2。

## 设计核心域

了解可以无损转换的不同类型允许您根据需要调整域设计。

例如，这种类型：

```text
type Something_V1 =
    | CaseA1 of TypeX * TypeY
    | CaseA2 of TypeX * TypeZ
```

可以无损地转换为这个：

```text
type r =
    | CaseA1 of TypeY
    | CaseA2 of TypeZ

type Something_V2 = 
    TypeX * Inner 
```

或者这个：

```text
type Something_V3 = {
    x: TypeX
    inner: Inner }
```

这是一个真实的例子：

* 您有一个网站，其中一些用户已注册，有些用户没有。
* 对于所有用户，您都有会话 ID
* 仅限注册用户，您有额外信息

我们可以像这样建模这个要求：

```text
module Customer_V1 =

    type UserInfo = {name:string} //etc
    type SessionId = SessionId of int

    type WebsiteUser = 
        | RegisteredUser of SessionId * UserInfo
        | GuestUser of SessionId 
```

或者，我们可以将共同点`SessionId`提升到更高的水平，如下所示：

```text
module Customer_V2 =

    type UserInfo = {name:string} //etc
    type SessionId = SessionId of int

    type WebsiteUserInfo = 
        | RegisteredUser of UserInfo
        | GuestUser 

    type WebsiteUser = {
        sessionId : SessionId
        info: WebsiteUserInfo }
```

哪个更好？从某种意义上说，它们都是 “相同的”，但显然最好的设计取决于使用模式。

* 如果您更关心用户类型而不是会话 ID，那么版本 1 会更好。
* 如果您经常查看会话 ID 而不关心用户类型，那么版本 2 会更好。

知道它们是同构的好处是你可以定义*两种*类型，在不同的上下文中使用它们，并根据需要在它们之间进行无损映射。

## 与外界接触

我们拥有所有这些不错的域类型`Direction`，`WebsiteUser`但在某些时候我们需要与外部世界接口 - 将它们存储在数据库中，将它们作为 JSON 接收等等。

问题是外面的世界没有一个好的[类型系统](https://zhida.zhihu.com/search?content_id=170377489\&content_type=Answer\&match_order=1\&q=%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MzEsInEiOiLnsbvlnovns7vnu58iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoxNzAzNzc0ODksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.QsEyM4bmdHXqlxx5OiTx3WtU6IqiQXRmeGWhpE7SIbM\&zhida_source=entity)！一切都倾向于原始：字符串，整数和布尔。

从我们的域到外部世界意味着从具有 “小” 值集的类型到具有 “大” 值集的类型，我们可以直接做到这一点。但是从外部世界进入我们的域意味着从 “大” 值集合转变为 “小” 值集，这需要验证和错误情况。

例如，域类型可能如下所示：

```text
type DomainCustomer = {
    Name: String50
    Email: EmailAddress
    Age: PositiveIntegerLessThan130 }
```

这些值受到限制：名称最多 50 个字符，经过验证的电子邮件，年龄介于 1 到 129 之间。

另一方面，DTO 类型可能如下所示：

```text
type CustomerDTO = {
    Name: string
    Email: string
    Age: int }
```

值不受约束：名称的任何字符串，未经验证的电子邮件，年龄可以是 2 ^ 32 个不同值中的任何一个，包括否定值。

这意味着，我们*不能*创建一个`CustomerDTO`以`DomainCustomer`映射。我们*必须*至少有一个其他值（`DomainCustomer + 1`）来映射无效输入，最好是更多来记录各种错误。

这自然导致`Success/Failure`我的[功能错误处理](https://link.zhihu.com/?target=https%3A//fsharpforfunandprofit.com/rop/)谈话中描述的模型，

映射的最终版本将是从 a `CustomerDTO`到 a `SuccessFailure<DomainCustomer>`或类似的。

这导致最终规则：

* &#x20;**规则：不要相信任何人。如果从外部源导入数据，请确保处理无效输入。**&#x20;

如果我们认真对待这个规则，它会产生一些影响，例如：

* 永远不要尝试直接反序列化到域类型（例如没有 ORM），只能尝试 DTO 类型。
* 始终验证从数据库或其他 “可信” 源读取的每条记录。

你可能会认为包含在一个`Success/Failure`类型中的所有东西都会变得烦人，这是真的（！），但是有一些方法可以使这更容易。例如，请看[这篇文章](https://link.zhihu.com/?target=https%3A//fsharpforfunandprofit.com/posts/elevated-world-5/%23asynclist)。

## 进一步阅读

代数数据类型的 “代数” 是众所周知的。最近在[“代数数据类型的代数（和微积分！）”](https://link.zhihu.com/?target=https%3A//codewords.recurse.com/issues/three/algebra-and-calculus-of-algebraic-data-types) 和[Chris Taylor](https://link.zhihu.com/?target=https%3A//chris-taylor.github.io/blog/2013/02/13/the-algebra-of-algebraic-data-types-part-iii/)的[系列中](https://link.zhihu.com/?target=https%3A//chris-taylor.github.io/blog/2013/02/13/the-algebra-of-algebraic-data-types-part-iii/)有一个很好的总结 。

在我写完之后，我指出了两个类似的帖子：

* [一个由 Tomas Petricek](https://link.zhihu.com/?target=http%3A//tomasp.net/blog/types-and-math.aspx/)提供，内容几乎相同！
* [Bartosz Milewski](https://link.zhihu.com/?target=http%3A//bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/)在他的类别理论系列中的[一个](https://link.zhihu.com/?target=http%3A//bartoszmilewski.com/2015/01/13/simple-algebraic-data-types/)。

正如其中一些帖子所提到的，你可以用这些类型的公式做一些奇怪的事情，比如区分它们！

如果您喜欢学术论文，您可以阅读 Conor McBride 从 2001 年开始的[“ ](https://link.zhihu.com/?target=http%3A//www.cs.nott.ac.uk/~txa/publ/jpartial.pdf)[正则类型的导数是其单孔上下文的类型”](https://link.zhihu.com/?target=http%3A//strictlypositive.org/diff.pdf)（PDF）中的衍生物的原始讨论，以及[“区分数据结构”](https://link.zhihu.com/?target=http%3A//www.cs.nott.ac.uk/~txa/publ/jpartial.pdf)的后续行动。（PDF）\[Abbott，Altenkirch，Ghani 和 McBride，2005]。

## 摘要

这可能不是世界上最激动人心的话题，但我发现这种方法既有趣又有用，我想与你分享。

让我知道你的想法。谢谢阅读！
