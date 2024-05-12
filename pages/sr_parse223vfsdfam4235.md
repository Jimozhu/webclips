---
title: "【译】Parse, not validate / 为什么我们需要强类型语言？"
date: 2023-05-04T09:11:22+08:00
draft: false
categories: [dev]
tags: [dev]
---
译者：作为一个从 JS 开始入门编程的程序员，我在很长一段时间以来不知道“强类型语言”到底有什么好处。就好像 TS，虽然它让 IDE 的类型提示等等更加健全了，但觉着更多的还是加大了我的工作量，我也很不想在一些个人项目去使用它，有种“杀鸡焉用牛刀”的感觉。

同时，我在前端开发中也常常为一种情形棘手：“基于 Schema 定义的动态组件渲染”，比如将一段长长的 JSON 渲染为一个复杂表单）。由于这段 JSON 中需要包含组成表单的完整信息（各个表单项的类型、标题、成员、校验方法、联动关系等），JSON 的形状会非常的复杂，而在开发过程中就需要大量的处理边界情况（如没有成员的 CheckboxGroup、没有指定上传器的 FileUploader）。总之，就是非常的痛苦。

而最近，后端老大给我们做了一个分享，灵感便是来源于这篇博客：[**Parse, don’t validate**](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)。这个分享直接解答了我几个问题：

1. 为什么我们需要强类型语言（对于 JS 生态，为什需要 TS）。
2. 如何正确的书写 TS，而不用深陷边界处理的泥潭。

如此相见恨晚的一场分享，只是听一次实在是不够，于是俺决定以自己的口吻翻译一遍。

正文的代码示例均为 Haskell，但并不复杂，我也增加了一些注释以便于理解。

下面开始正文，英文原文地址：[**Parse, don’t validate**](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)。

## 正文

过去我总是很难解释**类型驱动**的设计模式到底意味着什么。当别人问我“你为什么要这么做？”的时候，我无法给他们一个满意的答案。显然我并不是凭空想象出这套模式的，我也有自己的一套推理。只是我还从来没有成功与他人分享过这个推理过程。

不过呢，大概一个月前，我正在回复[推特上的一个消息](https://twitter.com/lexi_lambda/status/1182242561655746560)，关于“使用动态或静态语言解析 JSON 时遇到的差异”，突然我知道该如何表达了！我甚至发明了一个很活泼的口号来说明类型驱动的设计模式到底意味着什么：“**Parse, don't validate**（解析优于验证）”。

### 类型驱动设计的本质

静态类型系统可以很轻松的回答一个问题：这个方法是否是可能实现的？

看看下面这个 Haskell 类型定义：

```haskell
foo :: Integer -> Void
```

我们能够实现这样一个 foo 方法么？答案是不能，因为 `Void` 是一个不含任何值的类型，所以不可能有任何方法能够产生一个类型为 `Void` 的值。

这个例子其实挺没劲的，让我们看一个更加现实的例子，这是 Haskell 内置的 head 方法的类型：

```haskell
head :: [a] -> a
```

head 方法返回一个列表中的第一个元素，它做的事情很简单。

但当我们尝试去自己实现的时候，编译器给出了警告：

```haskell
head :: [a] -> a

-- x:_ 是Haskell中的“pattern”，它的作用是匹配任何非空数组的第一个元素
head (x:_) = x
```

```shell
warning: [-Wincomplete-patterns]
    Pattern match(es) are non-exhaustive
    In an equation for ‘head’: Patterns not matched: []
```

这段警告指出，`head` 方法是“不完全的（partial）”，也就是说目前的方法定义无法满足所有可能的输入。具体来说，它无法支持空数组 `[]` 的输入。很显然，我们无法返回空数组的第一个元素。（[Partial functions](https://wiki.haskell.org/Partial_functions) 并非是不合法不可用的，Haskell 内置的 `head` 就是一个 partial function——译者注）

### 将不完全函数变为完全函数

对于有动态类型语言学习背景的人来说，以上内容可能有点难以理解。如果我们有一个数组，我们很可能会很希望得到它的第一个元素，那么确实，在 Haskell 中，从数组中取出第一个元素也并非不可实现，只是需要一点额外工作。有两种方式去将这个 `head` 方法变为完全（total）函数，我会从简单方法的开始。

#### 方法一：降低预期

正如之前所说，`head` 之所以是不完全的，是因为当数组为空时，没有元素能被返回，所以目前的 `head` 方法做出了一个不可能满足的承诺。于是最简单的解决方法就是：我们降低对返回值的预期——我们会尽可能的返回元素，但我们也保留什么都不返回的权利。在 Haskell 中，我们使用 `Maybe` 类型来表达这种可能：

```haskell
head :: [a] -> Maybe a
```

这就让我们实现 `head` 有了一些自由空间了——当我们发现类型 `a` 无法产生值的时候，可以返回 `Nothing`。

```haskell
-- 这是我们自己实现的一个head方法
head :: [a] -> Maybe a
head (x:_) = Just x
head []    = Nothing
```

问题解决了？没错......但这个方案有一些隐含的代价。

通过返回 `Maybe` 来解决这个问题显然是很方便的，但是当我们真的要使用这样一个 `head` 方法时，可就没原先方便了！既然 `head` 总是可能返回 `Nothing`，这份满含不确定性的负担就落到了方法调用者的肩上，事实上这种“推卸责任”是很讨厌的。看看以下的代码就知道为什么了：

```haskell
{-
	getConfigurationDirectories做了什么：
	1. 读取CONFIG_DIRS环境变量
	2. 将其通过“,”分割成DIR列表
	3. 如果列表中有空元素，报错
-}
getConfigurationDirectories :: IO [FilePath]
getConfigurationDirectories = do
  configDirsString <- getEnv "CONFIG_DIRS"
  let configDirsList = split ',' configDirsString
  -- 这里手动处理了列表为空的情况
  when (null configDirsList) $
    throwIO $ userError "CONFIG_DIRS cannot be empty"
  pure configDirsList

{-
	main做了什么：
	1. 通过调用getConfigurationDirectories获取DIR列表
	2. 取列表的第一个元素
	3. 如果第一个元素不存在，报错
	4. 否则将其传递给initializeCache
-}
main :: IO ()
main = do
  configDirs <- getConfigurationDirectories
  -- 尽管在获取configDirs的时候，手动处理了列表为空的情形，但head方法正如上面定义，返回的类型仍然是 Maybe FilePath
  case head configDirs of
    Just cacheDir -> initializeCache cacheDir
    Nothing -> error "should never happen; already checked configDirs is non-empty"
```

在 `getConfigurationDirectories` 从环境变量中处理出 DIR（文件路径）列表的时候，它主动的检查了列表是否为空。但是，当使用 `head` 方法去获取列表的第一个元素时，我们仍然要处理 `Nothing` 的情况，因为 `head` 的返回值类型是 `Maybe a`，尽管我们知道这种情形在运行时是不可能发生的！这就很糟糕了，它糟就糟在：

1. 首先，这就很麻烦。我们已经检查了数组为非空数组，那我们为啥还要在代码中添加一段多余的检查？
2. 其次，这可能会降低性能。虽然在这个例子中影响并不明显，但我们可以想象在更复杂的情形中（比如循环），这种额外的检查可能会明显的增加性能消耗。
3. 最糟糕的是，这段代码很容易导致 bug！如果 `getConfigurationDirectories` 有意无意的被更新了，导致其不再检查列表是否为空，开发者很可能会忘记更新 `main` 中的代码。结果就是，“should never happen”的 error 会被抛到前台。

可以看出，这种额外的检查在我们的类型系统中捅了个窟窿。如果我们可以“静态”的证明 `Nothing` 情形是不会发生的，那即使 `getConfigurationDirectories` 不再检查列表是否为空，静态检查也会抛出错误。但是，我们仍然需要依赖写手动的检查（或者测试用例）来捕获错误。

#### 方法二：向前管理

显然，我们自己实现的这个 `head` 方法有个大坑。如果我们能让它更聪明一些：当确保列表为非空的时候，`head` 能够果断的返回第一个元素，而不用再要求我们处理不可能发生的空值情形。怎么实现呢？

让我们再看看 Haskell 内置 `head` 方法的类型定义：

```haskell
head :: [a] -> a
```

在之前的段落中，我们通过修改返回值类型以降低预期，将其变为了一个完全函数，但我们也已经证明了这种方法并不理想。

于是另一种方法也很显而易见，那就是从参数类型入手（在这个例子中就是 `[a]`）。我们可以加强参数类型而非削弱返回类型，从源头消灭 `head` 方法被空数组调用的可能。

为了实现加强参数，我们需要一种类型来代表“非空数组”。巧了，`NonEmpty` 类型（来自于 `Data.List.NonEmpty`）正是我们需要的。它的定义是这样的：

```haskell
-- ":|"的作用是将元素添加到列表头部，所以NotEmpty的结果一定是非空数组
-- 1 :| [2, 3] -> [1, 2, 3]
data NonEmpty a = a :| [a]
```

`NonEmpty a` 其实就是一个 `a` 与可能为空的 `[a]` 的结合。即使 `[a]` 是 `[]`，`a` 也一定是存在的。我们来更新一下 `head` 方法：

```haskell
head :: NonEmpty a -> a
head (x:|_) = x
```

现在编译器就不会给出警告了，因为我们的 `head` 是一个完全函数。我们可以用这个新的实现来更新之前的代码：

```haskell
getConfigurationDirectories :: IO (NonEmpty FilePath)
getConfigurationDirectories = do
  configDirsString <- getEnv "CONFIG_DIRS"
  let configDirsList = split ',' configDirsString
  case nonEmpty configDirsList of
  	-- 在这里处理可能Nothing的情况
    Just nonEmptyConfigDirsList -> pure nonEmptyConfigDirsList
    Nothing -> throwIO $ userError "CONFIG_DIRS cannot be empty"

main :: IO ()
main = do
  configDirs <- getConfigurationDirectories
  -- 这里不再需要额外的处理了
  initializeCache (head configDirs)
```

可以看到 `main` 中的额外代码已经消失了！我们也只需要在 `getConfigurationDirectories` 中做一次空数组检查。它使用 `nonEmpty` 方法从 `[a]` 中构建出了 `NonEmpty a`。`nonEmpty` 的方法定义是这样的：

```haskell
nonEmpty :: [a] -> Maybe (NonEmpty a)
```

可以看到 `Maybe` 仍然存在，但是这次我们在输入校验处立即就处理了 `Nothing` 的情形。当校验通过后，我们就得到了一个 `NonEmpty FilePath` 值，类型系统也知道它确实是非空的。

通过加强参数类型而非削弱结果类型，上一小节的问题都得到了解决：

1. 不再需要多余的检查。
2. 不会有额外检查带来的性能消耗
3. 如果 `getConfigurationDirectories` 被意外更改而没有确保数组非空，它的返回类型就不会是 `NonEmpty`，那 `main` 就会有抛出类型错误提示，我们在运行代码之前就会发现错误！

### Parsing 的力量

你可能会想上面的这些例子和本文的标题（Parse, not validate）有啥关系？毕竟我们只是介绍了两种处理非空数组的方法，但我们可以从另一个角度出发。

解析（parse）与校验（validate）的区别，在我看来就在于信息是如何被处理的。看看下面的两组方法：

```haskell
validateNonEmpty :: [a] -> IO ()
validateNonEmpty (_:_) = pure ()
validateNonEmpty [] = throwIO $ userError "list cannot be empty"

parseNonEmpty :: [a] -> IO (NonEmpty a)
parseNonEmpty (x:xs) = pure (x:|xs)
parseNonEmpty [] = throwIO $ userError "list cannot be empty"
```

这两个方法几乎一致：他们都检查了传入的数组是否为空，且如果是的话，他们会让程序抛出错误。区别在于，`validateNonEmpty` 总是返回 `()`，而 `parseNonEmpty` 总是返回 `NonEmpty a`——它保留了输入的类型并对其做了加强。虽然两种方法做了类似的事，但是后者让它的调用者获取到了更多的信息。

对比下来可以你应该可以感受到，`validateNonEmpty` 正确的使用了类型检查，而 `parseNonEmpty` 则通过加强类型信息更好的利用了静态类型系统，所以我才会起这么个标题“parse, not validate”。你可能有点质疑，`parseNonEmpty` 真的做了任何 _parse_ 的工作么？它看起来只是做了校验并返回一个结果。让我们可以进一步掰扯掰扯。

想一想，什么是解析？说到底，一个解析器就是一个方法，**你给它输入一个不太结构化的数据，它返回一个更加结构化的数据**。事实上，解析器一定是不完全函数，因为输入的某些数据肯定无法映射到结果，也因此解析器应该包含一些失败的情形。

所以我们可以看出，`parseNonEmpty` 正是一个解析器，它将数组解析为非空数组，并在失败时终止程序并抛出错误。

基于这个定义，可以看出解析器是非常强大的工具：它们能够让你在数据输入的最前期进行检查（换句话说，在系统和系统外部的边界进行检查），且未来不再需要类似重复的工作！Haskell 的使用者便深蕴这其中的好处，有许多常见的解析器被广泛使用：

- [aeson](https://hackage.haskell.org/package/aeson)，可以用于从 JSON 数据解析出每个域的数据类型。
- [optparse-applicative](https://hackage.haskell.org/package/optparse-applicative)，用于解析命令行参数。
- 一些基于数据库的包如 [persistent](https://hackage.haskell.org/package/persistent) 和 [postgresql-simple](https://hackage.haskell.org/package/postgresql-simple)，可以用于从外部存储解析数据。
- [servant](https://hackage.haskell.org/package/servant)，可以从 http 头、路径参数中处理出 Haskell 数据类型。

这些包的共同点在于，它们都在你的 Haskell 系统与外部世界进行交互的边界介入。外部世界并不会晓得什么 `product` 或者 `sum` 的类型定义，它们只是一串字节罢了，所以我们别无选择，必须要去解析。将解析的步骤前置，而不是在使用数据的时候再去考虑校验，可以大大的减少写出各种 bug 的可能，也就不容易出现安全漏洞。

这种做法的短板之一在于，有时数据的解析要远早于它们被使用。在动态类型语言中，如果没有测试用例覆盖，要保持数据的解析与最终的使用逻辑同步，会有些棘手。但对于静态类型系统，基本不存在这种问题，正如上文 `NonEmpty` 的例子，如果解析类型与使用逻辑不同步，系统会在静态编译步骤便抛出错误。

### Validation 的隐患

可能看到这里的你已经多多少少的认同，解析（Parsing）要比校验（Validation）值得优先考虑，但或许你仍有疑问，如果类型系统最终仍然会强制你做一些必要的检查，校验真的有这么不堪么？或许报错会有点难看，但系统内部逻辑中多一些冗余的检查是不是也没有坏处？

不不，事情可没那么简单。临时去做各种验证会导致在语言安全（[language-theoretic security](http://langsec.org/)）领域别称为“_散射验证（shotgun parsing）_”的现象。该现象在论文《[The Seven Turrets of Babel: A Taxonomy of LangSec Errors and How to Expunge Them](http://langsec.org/papers/langsec-cwes-secdev2016.pdf)》中被提出，作者是这样定义的：

> 散射验证是一种编程反模式，特征是在系统内部逻辑中混杂数据的解析与校验步骤。这就像在数据输入的时候撒下一团校验，然后祈祷它们能够捕获所有的异常情况。

然后作者对这种模式的问题进行了进一步解释：

> 散射验证剥夺了系统拒绝非法输入的能力。系统不得不去处理输入流中的非法输入，结果就是系统的最终状态会非常的难以预测。

从另一个角度来看，如果系统没有事先解析数据以保证数据流的干净，会有这样一种风险：系统收到了部分合法的输入并进行了操作，突然它收到了一个非法输入，那它就就需要回滚之前修改以保证一致性。这种回滚操作有时是可行的，比如回滚一个 RDBMS（关系数据库管理系统），但更多情形下这是不可能的。

可能你还看不出“散射验证”和“校验”有什么关系，毕竟如果你把校验前置，你可能也不会遇到散射验证。但问题在于，校验很难（甚至是不可能）确保所有的情形真的被处理了，或者某些“不可能”的情形其实是可能发生的。整个系统必须时时刻刻考虑异常发生的可能。

而解析通过将系统分为两层解决了这个问题——解析层与执行层，而由于非法输入导致的问题失败只会在解析层发生。相比之下，执行层的错误会尽可能的减少，我们可以去仔细的处理。

### 实践 Parsing, not validating

到目前为止，这篇文章好像都在推销观点，“读者亲，务必要先去解析！”。假设我的推销成功而你也买账了，你也必然会疑惑，“我已经懂你说的是啥（what），也明白必要性（why）了，可我要怎么去做（how）呢？”

我的建议是：专注于数据类型。

比如，你要实现一个方法，它要接收一个键值对列表，突然你想到，你不确定当列表中有重复的键时，你要怎么做。解决方法之一是写一个方法去检查列表中是否存在重复键：

```haskell
{--
	- (MonadError AppError m): The function will return results in a monad m that can throw AppError errors.
	- (Eq k): The key type k must have an equality constraint, so we can check for duplicates.
	- [(k, v)]: The input is a list of key-value pairs, with key type k and value type v.
	- m (): The return value is in the monad m and is () (void) if no duplicates are found.

	In summary, this function checks a list of key-value pairs for duplicate keys, and throws an error if any are found, otherwise returns a void value.
--}
checkNoDuplicateKeys :: (MonadError AppError m, Eq k) => [(k, v)] -> m ()
```

然而这个检查很脆弱，因为它很容易被遗忘：返回值（void）并没有被使用，所以这个方法总是可以被省略而不报错。更好的做法是选择一种数据类型去禁止重复键值对被创建，比如 `Map`。将方法的类型定义调整为接收 `Map` 而不是键值对列表，然后我们去照常实现即可。

如果你做了这样的调整，使用这个方法还是会无法通过类型检查，因为输入依然是键值对列表。于是我们就把输入给调整，把输入的输入调整，寻着调用链一直往上，最终我们要不找到了值被创建的地方，要不就是找到了允许重复键存在的地方。这个时候，你就可以插入一个修改过的 `checkNoDuplicateKeys`：

```Haskell
{--
	The differences are:
	- It now returns a Map k v instead of ().
	- It is still in the monad m that can throw AppError.

  So this version:
  - Checks the input list of key-value pairs for duplicates
  - If no duplicates are found, it constructs a Map from the key-value pairs and returns that
  - If duplicates are found, it throws an error
--}
checkNoDuplicateKeys :: (MonadError AppError m, Eq k) => [(k, v)] -> m (Map k v)
```

现在这个检查方法就不能被省略了，因为它的返回值是系统所需要的！

这个假设传递了两个简单的想法：

1. **使用非法数据无法兼容的数据结构**。使用尽可能精确的数据结构去描述你的数据。如果当前的数据结构难以排除特定的可能性，可以考虑使用其他的数据结构。不要害怕去做重构。
2. **将数据校验的责任尽可能向上推**。尽可能快的将你的数据转化为你需要的精确表达。理想的情况下，这应该发生在系统的边界，发生在任何数据被操作之前。如果某段代码分支需要更加精确的表达，那在进入这个分支的时候就应该立即去做类似的操作（简单的来说，大系统可能还包含子系统，而每层系统边界就是处理数据的地方，就和剥洋葱一样）。

换句话来说，在实现方法的时候，入参应该是你想要得到的数据类型，而不是你现有的数据类型。整个设计过程就类似于在沟之间架桥，一般都是从两端开始，最后在中间相遇。不要害怕去实践这种方式，你很有可能在不断重构的过程中学到新东西！

这里还有一些额外的建议：

- **让数据类型控制代码，而不是代码控制数据类型**。举个例子，不要因为你现在的方法需要一个 `Bool`，就在你的数据集中插一个 `Bool`。一定要使用最正确的数据类型，不要害怕重构。类型系统会确保你修改了需要修改的每一个角落，最后它会减轻你的负担。
- **谨慎返回 `m()`（void）的方法**，除非它的主要目的就是不返回值，但是如果它的目的是检查并抛出错误，恐怕我们可以选择更好的方法。
- **不要害怕去多次分段解析数据**。避免散射校验只是说你不该在数据被完全解析前去操作它，不代表你应该通过一部分的数据去决定如何处理其他数据。很多的解析器都是上下文敏感的。
- **避免不规范的数据类型，尤其当它是可变（mutable）的时候**。在系统中多处使用不规范的数据会导致整个系统的状态不稳定、不同步。你最终会希望数据有单一、可靠的来源。
  - **如果要使用到不规范的数据，应该将其抽象在单独的一层**。封装一个单独可信赖的小模块去限制这些数据的影响范围，保证整个系统可以做到同步。
- **使用抽象数据类型（abstract datatypes）来让校验器起到解析器的作用**。比如，你想要保证整数在一个特定的范围内，那此时我们可以使用一个抽象的 `newtype`，配合构造器（constructor）去让校验器起到解析器的作用。（译者：[abstract datatype](https://wiki.haskell.org/Abstract_data_type) 为 Haskell 的特性，关于 TS 中类似问题的讨论，可以查看这个 [Issue](https://github.com/microsoft/TypeScript/issues/43505)。）

总而言之，一切还是要你自己权衡。并不是说一定要为了去除一个 `error "impossible"` 去重构你的整个系统。谨慎处理它们，但如果你真搞不定了，也可以留个评论，让下一个接手的人去处理嘛。

### 回顾、反思以及相关资料

恭喜你读到这里，以上就是正文的所有内容。这篇文章应该让你感受到了类型系统的优势，哪怕你和译者我一样并不那么了解 Haskell。

这篇文章的观点其实并不新颖，而且其核心想法——“完全函数（write total functions）”，是非常简单的概念。只是我发现抽象的概念说的再说也并不是很容易让人理解，因此本文才着重的从*过程*出发，希望能给你在编码习惯上带来一定方向。

可惜的是，我并不掌握太多有关这个话题的资料，但仍有一个是我要特别推荐的，那就是 Matt Parson 的博客：[Type Safety Back and Forth](https://www.parsonsmatt.org/2017/10/11/type_safety_back_and_forth.html)。我强烈推荐你去读读看，其中包含了另一种角度，以及其他的实例。另外，如果你想了解对这个话题的更进一步剖析，我也推荐 Matt Noonan 于 2018 年发表的论文《[Ghosts of Departed Proofs](https://kataskeue.com/gdp.pdf)》，其中描述了许多类型系统中应对更复杂情形的技术。

最后的最后，我想说重构并不是容易的事，本文的例子都非常简单，但现实中的问题肯定没有那么好解决。即使是对于类型系统非常有经验的人，也可能非常难以实践这些操作。所以如果你没能解决某些问题，不要觉得是你的失败。本文的主张是可以去努力的方向，而不是系统的硬性条件。尝试才是最重要的！
