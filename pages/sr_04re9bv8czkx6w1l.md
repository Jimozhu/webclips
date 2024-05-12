---
title: "程序员应该遵守的编程原则"
date: 2022-08-15T09:37:35+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [www.biaodianfu.com](https://www.biaodianfu.com/principles-of-programming.html)

程序员拥有一个较好的编程原则能使他的编程能力有大幅的提升，可以使其开发出维护性高、缺陷更少的代码。以下内容梳理自 StactOverflow 的一个问题：编程时你最先考虑的准则是什么？

## KISS（Keep It Simple Stupid）

KISS 原则是英语 Keep It Simple, Stupid 的首字母缩略字，是一种归纳过的经验原则。KISS 原则是指在设计当中应当注重简约的原则。总结工程专业人员在设计过程中的经验，大多数系统的设计应保持简洁和单纯，而不掺入非必要的复杂性，这样的系统运作成效会取得最优；因此简单性应该是设计中的关键目标，尽量回避免不必要的复杂性。

这个首字母缩略词根据报导，是由洛克希德公司的首席工程师凯利 · 约翰逊（U-2 、SR-71 等的设计者）所创造的。虽然长久以来，它一直是被写为 “Keep it simple, stupid”，但约翰逊将其转化成 “Keep it simple stupid”（无逗号），而且这种写法仍然被许多作者使用。 词句中最后的 S 并没有任何隐涵工程师是愚蠢的含义，而是恰好相反的要求设计是易使人理解的。

说明这个原则最好的实例，是约翰逊向一群设计喷射引擎飞机工程师提供了一些工具，他们所设计的机具，必须可由一名普通机械师只用这些工具修理。 因此，“愚蠢” 是指被设计的物品在损坏与修复的关联之间，它们的难易程度。这个缩写词已被美国军方，以及软件开发领域的许多人所使用。

另外相类似的概念也可作 KISS 原则的起源。例如 “奥卡姆剃刀”，爱因斯坦的 “一切尽可能简单”、达芬奇的 “简单是最终的复杂性” 、安德鲁 · 圣艾修伯里的 “完美不是当它不能再添加时，它似乎是在它不能被进一步刮除时实现的”。

有两种软件设计方法，一种是尽可能的简单并保证没有什么缺陷。另外一种方式是尽可能的复杂并保障没有什么缺陷。而第一种方式相比第二种更加困难。

保持简单（避免复杂）永远是你应该做的第一件事，简单的代码不仅写起来简单、不容易出 Bug，还易于维护。简单规则下，还包括：

- [Don’t Make Me Think](http://www.sensible.com/dmmt.html)：如果一段程序对于阅读者来说需要花费太多的努力才能理解，那它很可能需要进一步简化。
- [最少意外原则](http://en.wikipedia.org/wiki/Principle_of_least_astonishment)：程序代码应尽可能的不要让阅读者感到意外。也就是说应该遵循编码规范和常见习惯，按照公认的习惯方式进行组织和命名，不符常规的编程动作应该尽可能的避免。

如何把 Kiss 原则应用到工作中？

- 要谦虚，不要认为自己是个天才，这是你第一个误解。只有谦虚了，你才能真正达到超级天才的水平，即使不行，who cares！你的代码那么 stupid simple，所以你不需要是个天才！
- 将你的任务分解为 4-12 小时的子任务。
- 把你的问题拆分成多个小问题。每个问题用一个或者很少的几个类来解决掉。
- 保持你的方法足够小，每个方法永远不要超过 30-40 行代码。每个方法都应该只处理一个小小的问题，不要搞太多 uses case 进去。如果你的方法中有多个分支，尝试把他们拆分成多个小的方法。这样不仅容易阅读和维护，找 bug 也更快。慢慢的你将学会爱。
- 让你的类也小点，原则和上面的方法是一样的。
- 先解决问题，然后开始编码。不要一边编码，一边解决问题。这样做也没什么错，但你有能力提前把事情切分成多个小的块，然后开始编码可能是比较好的。但也请你不要害怕一遍遍重构你的代码。另外行数还不是为了衡量质量的标准，只是有个基本的尺子而已。
- 不要害怕干掉代码。重构和重做是两个非常重要的方面。如果你遵循上面的建议，重写代码的数量将会最小化，如果你不遵循，那么代码很可能会被重写。
- 其他的任何场景，都请你尝试尽可能的简单，simple，这也是最难的一步，但一旦你拥有了它，你再回头看，就会说，之前的事情就是一坨屎。

参考链接：

- [Do The Simplest Thing That Could Possibly Work](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html)

## DRY（Don’t Repeat Yourself）

DRY 即 Don’t repeat

ourself（不要重复你自己，简称 DRY），或一个规则，实现一次（One rule, one place）是面向对象编程中的基本原则，程序员的行事准则。旨在软件开发中，减少重复的信息。DRY 的原则是 “系统中的每一部分，都必须有一个单一的、明确的、权威的代表”，指的是（由人编写而非机器生成的）代码和测试所构成的系统，必须能够表达所应表达的内容，但是不能含有任何重复代码。当 DRY 原则被成功应用时，一个系统中任何单个元素的修改都不需要与其逻辑无关的其他元素发生改变。此外，与之逻辑上相关的其他元素的变化均为可预见的、均匀的，并如此保持同步。

我对 DRY 的理解：

- 尽可能的减少重复，如代码重复、文档重复、数据重复、表征重复、开发人员重复（相同的功能不能的开发人员的优自己的实现）
- 不重复造轮子，能够使用开源的解决方案的情况下没有必要再实现一遍。
- 重复的事项，尽可能的使用自动化程序解决。
- 不要过于优化，过度追求 DRY，破坏了程序的内聚性。

相关规则有：[代码复用](http://en.wikipedia.org/wiki/Code_reuse)

## YAGNI – You ain’t gonna need it

YAGNI 是 You Ain’t Gonna Need It（你不会需要它）的简写，是极限编程的关键原则。YAGNI 意思非常简单：仅在您真正需要它们时才去做，而不是在您认为或预见将来可能需要它们时就提前做了！

您可以将 YAGNI 视为即时制造的拥护者。在这种情况下，制造业正在编写代码并交付功能。只有当有人真的需求功能存在时，您才可以开始工作并创建它。否则，您将保持自己的懒惰！

它为什么如此重要？没有编写的每一行代码都是时间，因此可以节省金钱。但是，甚至更多！它是：

- 更少的代码维护
- 更少的代码测试
- 事情发生变化时更少的代码可重构
- 更多时间用于更重要的功能
- 更多时间用于文档编制

而且还包括：

- 节省了编译 / 移植的时间
- 节省了测试运行的时间
- 生成时 / 运行时节省了资源
- 不必以某种方式保留的知识

它可以防止什么？如今，大多数软件开发都是根据客户的需求进行的。无论您是在产品公司，在提供开发服务的公司还是在其他地方工作。总是会在某处某人想要具有某个功能。是您的客户要求具有某个需求的功能，还是产品经理响应客户的反馈的功能。无论实际驱动者是谁，无论是早晚，这都是实际需求的体现。您正确预见未来功能请求的机会非常低。因此，您很有可能实现某些功能，而不是您的实际利益相关者想要的功能。过早地执行某些操作很可能会导致一切都被丢弃。这是一个没人真正喜欢的场景！然后，有时会发生另一种情况：没有人真正需要该功能！

## Code For The Maintainer

为维护者编写程序。比如让代码有自解释的功能。在你编写代码的时候永远记得将来需要维护他。

参考链接：[Code For The Maintainer](http://wiki.c2.com/?CodeForTheMaintainer)

## Be as lazy as possible.

人类因 “偷懒” 而进步。懒惰只是创造了需求。需求本身并不算进步。满足需求形成了进步。

偷懒还包括：

- [不要重复发明轮子](https://en.wikipedia.org/wiki/Reinventing_the_wheel)
- [过度优化](https://en.wikipedia.org/wiki/Program_optimization)是万恶之源

参考链接：[Do The Simplest Thing That Could Possibly Work](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html)

## Programming is only the road, not the way.

编码只是一种实现方式，而不是解决方案。编码只是告诉电脑应该如何去做。要编写高效、可靠的软件需要精通算法、最佳实践等其他与变成相关的内容。

编程前需要先了解你要解决的问题是什么。编程只是手段并不是目的。能实现并不代表需要实现。知道什么时候不需要编程或没有必须要去编程。

## If you are in a hurry, stroll along slowly. If you really are in a hurry, make a detour.

如果你很忙，那就放慢速度。如果你真的很忙，那就先放一放。这听起来很愚蠢，但是千万不要让自己陷入会导致后期问题的妥协。如果你正在编写程序的核心部分，尽可能保证精确。如果你在编写离核心代码较远的方法，可以尽可能的加快速度。

## Know your path, Neo.

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_04re9bv8czkx6w1l/d0253778.jpe)

知道你的实现路径，你需要了解你每天使用的环境、工具及其他依赖的内容，并且把它调试到适合自己的配置。如果你的编程环境真的很好，那么你编程中的基本不需要关心他。如果你需要完成一项任务，最好的方式是不要引进 “新的内容”，只有当你完全掌握“新的内容” 的时候再去考虑引入。

## If it wasn’t tested, it is broken.

如果没有经过测试的代码都是不能运行的。

## 与程序沟通时分辨原因和结果，与人交流时要分辨事实和观点

相关的准则，包括：

- [最小化耦合关系]([http://en.wikipedia.org/wiki/Coupling_(computer_programming)](http://en.wikipedia.org/wiki/Coupling_(computer_programming))：代码片段（代码块，函数，类等）应该最小化它对其它代码的依赖。这个目标通过尽可能少的使用共享变量来实现。
- [最大化内聚性](http://en.wikipedia.org/wiki/Cohesion_(computer_science)) ：具有相似功能的代码应该放在同一个代码组件里。
- [开放 / 封闭原则](http://en.wikipedia.org/wiki/Open_Closed_Principle)：程序里的实体项 (类，模块，函数等) 应该对扩展行为开放，对修改行为关闭。换句话说，不要写允许别人修改的类，应该写能让人们扩展的类。
- [单一职责原则](http://en.wikipedia.org/wiki/Single_responsibility_principle)：一个代码组件 (例如类或函数) 应该只执行单一的预设的任务。
- [隐藏实现细节](http://en.wikipedia.org/wiki/Information_Hiding)：隐藏实现细节能最小化你在修改程序组件时产生的对那些使用这个组件的其它程序模块的影响。
- [笛米特法则 (Law of Demeter)](http://en.wikipedia.org/wiki/Law_of_Demeter)— 程序组件应该只跟它的直系亲属有关系（例如继承类，内包含的对象，通过参数入口传入的对象等。）

原文链接：[What do you consider the 1st principle(s) of programming?](http://programmers.stackexchange.com/questions/91527/what-do-you-consider-the-1st-principles-of-programming)

参考链接：[Programming Principles](https://github.com/webpro/programming-principles)
