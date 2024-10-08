---
title: "程序的本质复杂性和元语言抽象"
date: 2022-11-18T22:10:23+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [coolshell.cn](https://coolshell.cn/articles/10652.html)

# 组件复用技术的局限性

常听到有人讲 “我写代码很讲究，一直严格遵循 [DRY 原则](https://en.wikipedia.org/wiki/Don't_repeat_yourself)，把重复使用的功能都封装成可复用的组件，使得代码简短优雅，同时也易于理解和维护”。显然，DRY 原则和组件复用技术是最常见的改善代码质量的方法，不过，在我看来以这类方法为指导，能帮助我们写出 “不错的程序”，但还不足以帮助我们写出简短、优雅、易理解、易维护的 “好程序”。对于熟悉 Martin Fowler《重构》和 GoF《设计模式》的程序员，我常常提出这样一个问题帮助他们进一步加深对程序的理解：

> 如果目标是代码 “简短、优雅、易理解、易维护”，组件复用技术是最好的方法吗？这种方法有没有根本性的局限？

虽然基于函数、类等形式的组件复用技术从一定程度上消除了冗余，提升了代码的抽象层次，但是这种技术却有着本质的局限性，其根源在于 **每种组件形式都代表了特定的抽象维度，组件复用只能在其维度上进行抽象层次的提升**。比如，我们可以把常用的 HashMap 等功能封装为类库，但是不管怎么封装复用类永远是类，封装虽然提升了代码的抽象层次，但是它永远不会变成 Lambda，而实际问题所代表的抽象维度往往与之并不匹配。

以常见的二进制消息的解析为例，组件复用技术所能做到的只是把读取字节，检查约束，计算 CRC 等功能封装成函数，这是远远不够的。比如，下面的表格定义了二进制消息 X 的格式：

```
Message X:
--------------------------------------------------------
| ID |  Name           | Type    | Size | Constraints  |
--------------------------------------------------------
| 1  | message type    | int     | 1    | = 0x01       |
--------------------------------------------------------
| 2  | payload size    | int     | 2    | > 0          |
--------------------------------------------------------
| 3  | payload         | bytes   | <2>  |              |
--------------------------------------------------------
| 4  | CRC             | int     | 4    |              |
--------------------------------------------------------
```

它的解析函数大概是这个样子：

```c
bool parse_message_x(char* data, int32 size, MessageX& x) {
    char *ptr = data;
    if (ptr + sizeof(int8) <= data + size) {
        x.message_type = read_int8(ptr);
        if (0x01 != x.message_type) return false;
        ptr += sizeof(int8);
    } else {
        return false;
    }
    if (ptr + sizeof(int16) <= data + size) {
        x.payload_size = read_int16(ptr);
        ptr += sizeof(int16);
    } else {
        return false;
    }
    if (ptr + x.payload_size <= data + size) {
        x.payload = new int8[x.payload_size];
        read(ptr, x.payload, x.payload_size);
        ptr += x.payload_size;
    } else {
        return false;
    }
    if (ptr + sizeof(int32) <= data + size) {
        x.crc = read_int32(ptr);
        ptr += sizeof(int32);
    } else {
        delete x.payload;
        return false;
    }
    if (crc(data, sizeof(int8) + sizeof(int16) + x.payload_size) != x.crc) {
        delete x.payload;
        return false;
    }
    return true;
}
```

很明显，虽然消息 X 的定义非常简单，但是它的解析函数却显得很繁琐，需要小心翼翼地处理很多细节。在处理其他消息 Y 时，虽然虽然 Y 和 X 很相似，但是却不得不再次在解析过程中处理这些细节，就是组件复用方法的局限性，它只能帮我们按照函数或者类的语义把功能封装成可复用的组件，但是消息的结构特征既不是函数也不是类，这就是抽象维度的失配。

#### [](https://www.cnblogs.com/weidagang2046/p/the-nature-of-meta.html#-2)程序的本质复杂性

上面分析了组件复用技术有着根本性的局限性，现在我们要进一步思考：

> 如果目标还是代码 “简短、优雅、易理解、易维护”，那么代码优化是否有一个理论极限？这个极限是由什么决定的？普通代码比起最优代码多出来的“冗余部分” 到底干了些什么事情？

回答这个问题要从程序的本质说起。Pascal 语言之父 Niklaus Wirth 在 70 年代提出：Program = Data Structure + Algorithm，随后逻辑学家和计算机科学家 R Kowalski 进一步提出：Algorithm = Logic + Control。谁更深刻更有启发性？当然是后者！而且我认为数据结构和算法都属于控制策略，综合二位的观点，加上我自己的理解，程序的本质是：Program = Logic + Control。换句话说，程序包含了逻辑和控制两个维度。

逻辑就是问题的定义，比如，对于排序问题来讲，逻辑就是 “什么叫做有序，什么叫大于，什么叫小于，什么叫相等”？控制就是如何合理地安排时间和空间资源去实现逻辑。逻辑是程序的灵魂，它定义了程序的本质；控制是为逻辑服务的，是非本质的，可以变化的，如同排序有几十种不同的方法，时间空间效率各不相同，可以根据需要采用不同的实现。

程序的复杂性包含了本质复杂性和非本质复杂性两个方面。套用这里的术语， **程序的本质复杂性就是逻辑，非本质复杂性就是控制**。逻辑决定了代码复杂性的下限，也就是说不管怎么做代码优化，Office 程序永远比 Notepad 程序复杂，这是因为前者的逻辑就更为复杂。如果要代码简洁优雅，任何语言和技术所能做的只是尽量接近这个本质复杂性，而不可能超越这个理论下限。

理解” 程序的本质复杂性是由逻辑决定的” 从理论上为我们指明了代码优化的方向：让逻辑和控制这两个维度保持正交关系。来看 Java 的 Collections.sort 方法的例子：

```java
interface Comparator<T> {
    int compare(T o1, T o2);
}
public static <T> void sort(List<T> list, Comparator<? super T> comparator)
```

使用者只关心逻辑部份，即提供一个 Comparator 对象表明序在类型 T 上的定义；控制的部分完全交给方法实现者，可以有多种不同的实现，这就是逻辑和控制解耦。同时，我们也可以断定，这个设计已经达到了代码优化的理论极限，不会有本质上比它更简洁的设计（忽略相同语义的语法差异），为什么？因为逻辑决定了它的本质复杂度，Comparator 和 Collections.sort 的定义完全是逻辑的体现，不包含任何非本质的控制部分。

另外需要强调的是，上面讲的 “控制是非本质复杂性” 并不是说控制不重要，控制往往直接决定了程序的性能，当我们因为性能等原因必须采用某种控制的时候，实际上被固化的控制策略也是一种逻辑。比如，当你的需求是“从进程虚拟地址 ptr1 拷贝 1024 个字节到地址 ptr2“，那么它就是问题的定义，它就是逻辑，这时，提供进程虚拟地址直接访问语义的底层语言就与之完全匹配，反而是更高层次的语言对这个需求无能为力。

介绍了逻辑和控制的关系，可能很多朋友已经开始意识到了上面二进制文件解析实现的问题在哪里，其实这也是 **绝大多数程序不够简洁优雅的根本原因：逻辑与控制耦合**。上面那个消息定义表格就是不包含控制的纯逻辑，我相信即使不是程序员也能读懂它；而相应的代码把逻辑和控制搅在一起之后就不那么容易读懂了。

熟悉 OOP 和 GoF 设计模式的朋友可能会把 “逻辑与控制解耦” 与经常听说的 “接口和实现解耦” 联系在一起，他们是不是一回事呢？其实，把这里所说的逻辑和 OOP 中的接口划等号是似是而非的， 而 GoF 设计模式最大的问题就在于有意无意地让人们以为“what 就是 interface, interface 就是 what”，很多朋友一想到要表达 what，要抽象，马上写个接口出来，这就是潜移默化的惯性思维，自己根本意识不到问题在哪里。其实，接口和前面提到的组件复用技术一样，同样受限于特定的抽象维度，它不是表达逻辑的通用方法，比如，我们无法把二进制文件格式特征用接口来表示。

另外，我们熟悉的许多 GoF 模式以 “逻辑与控制解耦” 的观点来看，都不是最优的。比如，很多时候 Observer 模式都是典型的以控制代逻辑，来看一个例子：

> 对于某网页的超链接，要求其颜色随着状态不同而变化，点击之前的颜色是 #FF0000，点击后颜色变成 #00FF00。

基于 Observer 模式的实现是这样的：

```javascript
$(a).css("color", "#FF0000");

$(a).click(function () {
  $(this).css("color", "#00FF00");
});
```

而基于纯 CSS 的实现是这样的：

```css
a:link {
  color: #ff0000;
}
a:visited {
  color: #00ff00;
}
```

通过对比，您看出二者的差别了吗？显然，Observer 模式包含了非本质的控制，而 CSS 是只包含逻辑。理论上讲，CSS 能做的事情，JavaScript 都能通过控制做到，那么为什么浏览器的设计者要引入 CSS 呢，这对我们有何启发呢？

#### [](https://www.cnblogs.com/weidagang2046/p/the-nature-of-meta.html#-3)元语言抽象

好的，我们继续思考下面这个问题：

> 逻辑决定了程序的本质复杂性，但接口不是表达逻辑的通用方式，那么是否存在表达逻辑的通用方式呢？

答案是：有！这就是元 (Meta)，包括元语言(Meta Language) 和元数据 (Meta Data) 两个方面。元并不神秘，我们通常所说的配置就是元，元语言就是配置的语法和语义，元数据就是具体的配置，它们之间的关系就是 C 语言和 C 程序之间的关系；但是，同时元又非常神奇，因为元既是数据也是代码，在表达逻辑和语义方面具有无与伦比的灵活性。至此，我们终于找到了让代码变得简洁、优雅、易理解、易维护的终极方法，这就是： **通过元语言抽象让逻辑和控制彻底解耦**！

比如，对于二进制消息解析，经典的做法是类似 Google 的 [Protocol Buffers](https://code.google.com/p/protobuf/)，把消息结构特征抽象出来，定义消息描述元语言，再通过元数据描述消息结构。下面是 Protocol Buffers 元数据的例子，这个元数据是纯逻辑的表达，它的复杂度体现的是消息结构的本质复杂度，而如何序列化和解析这些控制相关的部分被 Protocol Buffers 编译器隐藏起来了。

```
message Person {
  required int32 id = 1;
  required string name = 2;
  optional string email = 3;
}
```

元语言解决了逻辑表达问题，但是最终要与控制相结合成为具体实现，这就是元语言到目标语言的映射问题。通常有这两种方法：

1. 元编程 (Meta Programming)，开发从元语言到目标语言的编译器，将元数据编译为目标程序代码；
2. 元驱动编程 (Meta Driven Programming)，直接在目标语言中实现元语言的解释器。

这两种方法各有优势，元编程由于有静态编译阶段，一般产生的目标程序代码性能更好，但是这种方式混合了两个层次的代码，增加了代码配置管理的难度，一般还需要同时配备 Build 脚本把整个代码生成自动集成到 Build 过程中，此外，和 IDE 的集成也是问题；元驱动编程则相反，没有静态编译过程，元语言代码是动态解析的，所以性能上有损失，但是更加灵活，开发和代码配置管理的难度也更小。除非是性能要求非常高的场合，我推荐的是元驱动编程，因为它更轻量，更易于与目标语言结合。

下面是用元驱动编程解决二进制消息解析问题的例子，meta_message_x 是元数据，parse_message 是解释器：

```javascript
var meta_message_x = {
  id: "x",
  fields: [
    { name: "message_type", type: int8, value: 0x01 },
    { name: "payload_size", type: int16 },
    { name: "payload", type: bytes, size: "$payload_size" },
    {
      name: "crc",
      type: crc32,
      source: ["message_type", "payload_size", "payload"],
    },
  ],
};

var message_x = parse_message(meta_message_x, data, size);
```

这段代码我用的是 JavaScript 语法，因为对于支持 Literal 的类似 JSON 对象表示的语言中，实现元驱动编程最为简单。如果是 Java 或 C++ 语言，语法上稍微繁琐一点，不过本质上是一样的，或者引入 JSON 配置文件，然后解析配置，或者定义 MessageConfig 类，直接把这个类对象作为配置信息。

二进制文件解析问题是一个经典问题，有 Protocol Buffers、Android AIDL 等大量的实例，所以很多人能想到引入消息定义元语言，但是如果我们把问题稍微变换，能想到采用这种方法的人就不多了。来看下面这个问题：

> 某网站有新用户注册、用户信息更新，和个性设置等 Web 表单。出于性能和用户体验的考虑，在用户点击提交表单时，会先进行浏览器端的验证，比如：name 字段至少 3 个字符，password 字段至少 8 个字符，并且和 repeat password 要一致，email 要符合邮箱格式；通过浏览器端验证以后才通过 HTTP 请求提交到服务器。

普通的实现是这个样子的：

```javascript
function check_form_x() {
var name = $('#name').val();
if (null == name || name.length <= 3) {
return {status : 1, message: 'Invalid name'};
}

var password = $('#password').val();
if (null == password || password.length <= 8) {
return {status : 2, message: 'Invalid password'};
}

var repeat_password = $('#repeat_password').val();
if (repeat_password != password.length) {
return {status : 3, message: 'Password and repeat password mismatch'};
}

var email = $('#email').val();
if (check_email_format(email)) {
return {status : 4, message: 'Invalid email'};
}

…

return {status : 0, message: 'OK'};

}
```

上面的实现就是按照组建复用的思想封装了一下检测 email 格式之类的通用函数，这和刚才的二进制消息解析非常相似，没法在不同的表单之间进行大规模复用，很多细节都必须被重复编写。下面是用元语言抽象改进后的做法：

```javascript
var meta_create_user = {
  form_id: "create_user",
  fields: [
    { id: "name", type: "text", min_length: 3 },
    { id: "password", type: "password", min_length: 8 },
    { id: "repeat-password", type: "password", min_length: 8 },
    { id: "email", type: "email" },
  ],
};

var r = check_form(meta_create_user);
```

通过定义表单属性元语言，整个逻辑顿时清晰了，细节的处理只需要在 check_form 中编写一次，完全实现了 “简短、优雅、易理解、以维护” 的目标。其实，不仅 Web 表单验证可以通过元语言描述，整个 Web 页面从布局到功能全部都可以通过一个元对象描述，完全将逻辑和控制解耦。此外，我编写的用于解析命令行参数的 [lineparser.js](https://github.com/weidagang/line-parser-js) 库也是基于元语言的，有兴趣的朋友可以参考并对比它和其他命令行解析库的设计差异。

最后，我们再来从代码长度的角度来分析一下元驱动编程和普通方法之间的差异。假设一个功能在系统中出现了 n 次，对于普通方法来讲，由于逻辑和控制的耦合，它的代码量是 `n * (L + C)`，而元驱动编程只需要实现一次控制，代码长度是 `C + n * L`，其中 L 表示逻辑相关的代码量，C 表示控制相关的代码量。通常情况下 L 部分都是一些配置，不容易引入 bug，复杂的主要是 C 的部分，普通方法中 C 被重复了 n 次，引入 bug 的可能性大大增加，同时修改一个 bug 也可能要改 n 个地方。所以，对于重复出现的功能，元驱动编程大大减少了代码量，减小了引入 bug 的可能，并且提高了可维护性。

#### [](https://www.cnblogs.com/weidagang2046/p/the-nature-of-meta.html#-4)总结

《人月神话》的作者 Fred Brooks 曾在 80 年代阐述了它对于软件复杂性的看法，即著名的 [No Silver Bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet)。他认为不存在一种技术能使得软件开发在生产力、可靠性、简洁性方面提高一个数量级。我不清楚 Brooks 这一论断详细的背景，但是就个人的开发经验而言，元驱动编程和普通编程方法相比在生产力、可靠性和简洁性方面的确是数量级的提升, 在我看来它就是软件开发的银弹！
