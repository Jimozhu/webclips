---
title: "关于 Emoji 你不知道的事"
date: 2023-04-24T09:49:44+08:00
draft: false
categories: [dev]
tags: [dev]
---
## 结论先行

- **基本 emoji 和常用 Unicode 字符毫无区别**

每个 emoji 用对应一个 Unicode 码位，如：`🌔` U+1F314 (对应 JS 中 UTF-16 编码是：`"\uD83C\uDF14"`)，汉字 `𠇔` U+201D4，对应 JS 中的 UTF-16 编码是 `"\uD840\uDDD4"`

- **emoji 有特殊的修饰、拼接等规则**

在某些 emoji 字符后增加一个**肤色修饰符**改变 emoji 的肤色、可以将多个 emoji 通过**连接符**拼接成一个 emoji，这些特殊规则使得在代码中判定 emoji 的长度、截取和对 emoji 做其他处理都比较困难。需要澄清的是：用一个 Unicode 字符修饰前一个字符不是 emoji 独有的，其他 Unicode 字符也存在，如：`Ü`，由大写字母 U（U+0055），后面跟一个连音符号（U+0308）组成。

- **术语**

码点/码位：Unicode 编码空间中的一个编码，如，汉字 `𠇔` 的码位是 201D4，通常表示为：U+201D4

## 起源

**1982 年**，卡内基美隆大学是首次在电子公告里中使 `:-)` 表情符号。后续在日本手机短信中盛行，并称为颜文字（日语：かおもじ，英文：emoticon），颜文字仍然是普通的文本字符。 **1999 年**，栗田穰崇 (Shigetaka Kurita) 发明了 e-moji (え-もじ)，并设计了 176 个 emoji 符号，共 6 种颜色，分辨率为 12x12。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/e5592f67.webp) 纽约博物馆馆藏：最初的 176 个 emoji

**2010 年**，Unicode 正式收录了 emoji，为每个 emoji 分配了唯一的码点。 **2011 年**，Apple 在 iOS 中加入了标准的 emoji 输入键盘，2 年后安卓系统也引入了 emoji 键盘。

## Unicode

Unicode 中原本就收录了很多有意义的字符，如：㎓、𐦖、☳，大家还可以查看 Unicode 1 号平面的[埃及象形文字区](https://www.unicode.org/charts/PDF/U13000.pdf) (U+13000–U+1342F)。收录 emoji 对 Unicode 来说没有挑战，技术上是完全兼容的。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/c31bad00.webp) Unicode 象形文字区节选

## Emoji 的编码

### 基本 emoji

> 基本 emoji 是指在 Unicode 编码表中用 1 个唯一码位表示的 emoji

最简单的 emoji 就是 Unicode 表中的一个字符，和我们常用的 Unicode 字符没有区别。多数基本 emoji 都被分配到 Unicode 编码表 1 号平面的 `U+1F300–1F6FF` 和 `U+1F900–1FAFF` 两个区域，完整的列表请看 [15.0/emoji-sequences.txt](https://unicode.org/Public/emoji/15.0/emoji-sequences.txt) ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/2675eeb1.webp) Unicode 中 emoji 的码位

我们常见的 emoji 是彩色的，而常见的字体是黑色的。字符的颜色取决于字体文件，如果你愿意，你也可以把其常见的汉字字体设计成彩色的。iOS/MacOS 的 `Apple Color Emoji` 字体是一种 160x160 的点阵字体， Android 的 `Noto Emoji` 是一种 128x128 的点阵字体，而 Windows 使用的 `Segoe UI Emoji` 是一种矢量彩色字体。

问**为什么同一个 emoji 在不同设备、不同软件中显示不同？** 不同设备、软件使用了不同的 emoji 字体所以显示效果不同。Unicode 只是约定了码点到 emoji 的映射关系，并没有约定 emoji 图形，每个 emoji 字体文件可以按照自己的想法设计 emoji。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/0e2a680c.webp) 同一个 emoji 在不同软件上的显示效果

问为什么在钉钉中发送 `[憨笑]` 会显示成 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/2e2e7090.webp) ？ 早期包含 Unicode emoji 的字体还没广泛普及，你给对方发一个 emoji 符号 `😄`，如果没对方设备有对应的字体看到的会是 `？`。 为了解决缺失 emoji 字体导致大家显示不一致的问题(或者为了方便自定义自己的 **伪 emoji** ——为了方便描述，把软件自定义的图片称作伪 emoji)，很多软件自己开发了能向下兼容的解决方案，如钉钉。该自定义方案与 Unicode 编码没有关系，只是将特殊的字符串与一张图片映射起来，当对方发送 `[xx]` 字符串时，将它显示成对应的**图片**。 早期支付宝的**转账**备注功能中也定义了自己的 `伪emoji`。`伪emoji` 的好处是向下兼容，如果使用标准的 Unicode emoji 可能会导致别的系统无法处理(如：做了汉字正则校验)，导致转账失败；弊端是不通用，别的系统通常不支持另一个系统定义的 `伪emoji`，直接将 `[xx]` 文本显示出来，如：收银台在支付界面就会直接显示转账备注的伪 emoji 文本 `[xx]`。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/8adcee6b.webp)

### 字素集

字素集（grapheme cluster）在 Unicode 中通常一个码点对应一个字符，但是 Unicode 引入了特定的机制允许多个 Unicode 码点组合成一个字形符号。这样由于多个码点组合成的一个字符称作字素集。 比如 `Ü` 是一个字素集，是由两个码点组成：大写字母 U（U+0055），后面跟一个连音符号（U+0308）。再比如：`'曙󠄀'.length=3`、`'🤦🏼‍♂️'.length=7`，前者由基本的 `曙` 字符加上一个**变体选择符 ️ VS-17 **(见后文)组成，后者由多个**基础 emoji **和**修饰符、连接符**组成。 点开有惊喜 Ų̷̡̡̨̫͍̟̯̣͎͓̘̱̖̱̣͈͍̫͖̮̫̹̟̣͉̦̬̬͈͈͔͙͕̩̬̐̏̌̉́̾͑̒͌͊͗́̾̈̈́̆̅̉͌̋̇͆̚̚̚͠ͅ 左边是一个.length 为 65 的字素集，它是不可分割的一个字符
在 Unicode 的规范中要求所有软件(本编辑器、文本渲染、搜索等)将一个字素集当做不可分割的整体，即：当做一个单一的字符对待。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/03adc591.webp) Unicode 处理的难点就在于字素集，下文均与该定义有关，开发者的噩梦都源自该概念。不能简单地通过 `.length` 读取字符串的长度；如果想截取字符串的前 10 个字符，也不能简单的使用 `.substring(0, 10)`，因为这可能会截断 emoji 字符；反转字符串也非常困难，`U+263A U+FE0F` 有意义，反转之后 `U+FE0F U+263A` 却没有意义，后文会介绍正确的处理方式。

### 变体选择符 ️

Variation Selector（又叫异体字选择器），是 Unicode 中定义的一种**修饰符**机制。一个基本字符后接上一个**异体字选择器**组成一个**异体字**。背景是：一个字符可能会有多个不同的变体，这些变体本质上是同一个字符，具有同样的含义，由于地区、文化差异导致他们演变成了不同的书写形式。Unicode 为变体字分配了同一个码点，如果想要显示特定的书写形式可以在字符后紧接着一个**异体字选择器**指定。 [![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/daf0bd35.webp)](https://zh.m.wikipedia.org/wiki/File:U66d9-k.svg)[![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/89f6ad65.webp)](https://zh.m.wikipedia.org/wiki/File:U66d9.svg)就是变体字。需要澄清的是，并非所有相似的字符都按照异性字的形式合并成了一个码点，`値` 和 `值` 就是分别分配了不同的码点，理论上这两个字符也可以合并变体字共用一个码点。 在 Unicode 中引入彩色的 emoji 前就已经定义了一些黑色的图形符号，引入彩色 emoji 后，新的 emoji 与黑色的符号具有相同的含义，于是共用了同一个 Unicode 码点，可在字符后接上一个 VS 指定要显示那个版本。 常用的 VS 有 16 个 **VS-1 ~ VS-16**，对应的 Unicode 是(U+FE00~U+FE0F)，其中 **VS-15**（U+FE0E）用于指定显示黑色的 text 版本，**VS-16**（U+FE0F）用于指定显示彩色的 emoji 版本。

| **默认显示** |      | **VS-15 修饰符**  |      | **VS-16 修饰符**       |
| ------------ | ---- | ----------------- | ---- | ---------------------- |
| U+2702       | ✂︎ | U+2702 **U+FE0E** | ✂︎ | U+2702 **U+FE0F** ✂️ |
| U+2620       | ☠︎ | U+2620 **U+FE0E** | ☠︎ | U+2620 **U+FE0F** ☠️ |
| U+26A0       | ⚛︎ | U+26A0 **U+FE0E** | ⚛︎ | U+26A0 **U+FE0F** ⚛️ |
| U+2618       | ☘︎ | U+2618 **U+FE0E** | ☘︎ | U+2618 **U+FE0F** ☘️ |

**可以动手验证一下**

> ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/0b8bc087.webp)
>
> - ✂ 不含修饰符 `'\u2702'`
> - ✂︎ 含 VS-15 `'\u2702\uFE0E'`
> - ✂️ 含 VS-16 `'\u2702\uFE0F'`

问**为什么把黑色的剪刀 ✂︎ 粘贴到 Chrome 搜索栏中显示成彩色，把彩色剪刀 ✂️ 复制到 Chrome 的 Console 中显示成黑色？** ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/e41f4dfa.webp) ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/367d4c64.webp) 我们通过 VS 符号告诉软件要显示成指定的异体字符，但是软件可以不听我们的，软件可能会强制指定特定的字体，如果该字体中只包含一种异体字符的字形数据那就只会显示该字形。

### 肤色修饰符

大多数人形相关的 Emoji 默认是黄色的，在 2015 年为 emoji 引入肤色支持。没有为每种肤色的 emoji 组合分配新的码点，而是引入了五个新码点作为**修饰符**：1F3FB **🏻**、1F3FC **🏼**、1F3FD **🏽**、1F3FE **🏾**、1F3FF **🏿** 。肤色修饰符追加到现有的 emoji 后面则形成新的变种，如：👋 `U+1F44B`+ **🏽**`U+1F3FD`= 👋🏽

- 👋 在 JavaScript 中 UTF-16 值是 `'\uD83D\uDC4B'`
- **🏽 ** 在 JavaScript 中 UTF-16 值是 `'\uD83C\uDFFD'`

组合在一起 `'\uD83D\uDC4B\uD83C\uDFFD'` 就得到了 👋🏽 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/f37478e3.webp)

5 种肤色修饰符的取值是基于[菲茨帕特里克度量](https://zh.wikipedia.org/zh-cn/%E8%8F%B2%E8%8C%A8%E5%B8%95%E7%89%B9%E9%87%8C%E5%85%8B%E5%BA%A6%E9%87%8F)，因此叫做 EMOJI MODIFIER FITZPATRICK。肤色度量共有 6 个取值，但在 emoji 中前两个颜色合并成了一个。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/904b7049.webp) 最终 280 个人形 emoji 就产生了 1680 种肤色变种，这是五种不同肤色的舞者：🕺🕺🏻🕺🏼🕺🏽🕺🏾🕺🏿

### 零宽度连接符（ZWJ）

Unicode 通过多个**基础 emoji **组合的形式表示某些**复杂 emoji**。组合的方式是在两个 emoji 之间添加一个 `U+200D`，即：零宽度连接符（ZERO-WIDTH JOINER，简写为 ZWJ），如：

- 👩 + ZWJ+ 🌾 = 👩‍🌾

![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/353cbd57.webp) 下面是一些例子，完整的组合列表参考：[Unicode 15.0/emoji-zwj-sequences.txt](https://unicode.org/Public/emoji/15.0/emoji-zwj-sequences.txt)

> - 👩 + ✈️ → 👩‍✈️
> - 👨 + 💻 → 👨‍💻
> - 👰 + ♂️ → 👰‍♂️
> - 🐻 + ❄️ → 🐻‍❄️
> - 🏴 + ☠️ → 🏴‍☠️
> - 🏳️ + 🌈 → 🏳️‍🌈
> - 👨 + 🦰 → 👨‍🦰 _（有意思的是：发色是通过 ZWJ 组合基础 emoji 实现，而肤色则是用肤色修饰符实现）_
> - 👨🏻 + 🤝 + 👨🏼 → 👨🏻‍🤝‍👨🏼
> - 👨 + ❤️ + 👨 → 👨‍❤️‍👨
> - 👨 + ❤️ + 💋 + 👨 → 👨‍❤️‍💋‍👨
> - 👨 + 👨 + 👧 → 👨‍👨‍👧
> - 👨 + 👨 + 👧 + 👧 → 👨‍👨‍👧‍👧

可惜，有些 emoji **不是**通过 ZWJ 组全 emoji 实现的，可能是因为没有赶上 ZWJ 定义的时机

> - 🌂 + 🌧 ≠ ☔️
> - 💄 + 👄 ≠ 💋
> - 🐴 + 🌈 ≠ 🦄
> - 👁 + 👁 ≠ 👀
> - 👨 + 💀 ≠ 🧟
> - 👩 + 🔍 ≠ 🕵️‍♀️
> - 🦵 + 🦵 + 💪 + 💪 + 👂 + 👂 + 👃 + 👅 + 👀 + 🧠 ≠ 🧍

### 旗帜·双字母连字

Unicode 中包含国旗符号，每个国旗也没有分配独立的码点，而是由双字符连字（ligature）来表示。（但 Windows 平台因为某些原因不支持显示，如果你是用 Windows 平台的浏览器阅读本文，只能说抱歉了）

- 🇺 + 🇳 = 🇺🇳
- 🇷 + 🇺 = 🇷🇺
- 🇮 + 🇸 = 🇮🇸
- 🇿 + 🇦 = 🇿🇦
- 🇯 + 🇵 = 🇯🇵

这里的 🇦 ~ 🇿 不是字母，而是**地区标识符**，对应的码点是 `U+1F1E6`~`U+1F1FF`，可以随意复制并组合，如果是合法的组合会显示成一个国家的旗帜。你可以在 MacOS 的 FontBook 中打开 Apple Color Emoji 查看到这些码点以及各个地区的旗帜符号 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2cd55a8c9bc4153bbc10e03f25f705c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "地区标识符") ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a45cdac1d5914ee9b5a83e5740bb45de~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp "旗帜符号 标注了 CN") 完整地区标识符如下，你可以动手组合试一试： 🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿

### 标签序列

在 Unicode 中称作 [Emoji Tag Sequence](https://emojipedia.org/emoji-tag-sequence/)。在 Unicode 中 `U+E0020`~ `U+E007F` 95 个码点表示的是 Unicode 中不可见的控制符号，其中从 `E0061`~`E007A` 的 26 个码点分别表示**小写的拉丁字符**(不是常规的拉丁字母，而是 emoji 相关的控制字符)，对应关系如下：

> - U+**E0061** - TAG LATIN SMALL LETTER **A**
> - U+**E0062** - TAG LATIN SMALL LETTER **B**

...

> - U+**E007A** - TAG LATIN SMALL LETTER **Z**

前文的**双字母连字**机制支持将两个地区标识符连接在一起表示一个旗帜符号。标签序列与之类似，是 Unicode 中定义的一种更复杂的连接方式，格式是：`基础emoji`+ `一串拉丁标签字符`(U+E0061~U+E007A) + `结束符`(U+E007F) 如：🏴 + _gbeng_ + `U+E007F` = 🏴󠁧󠁢󠁥󠁮󠁧󠁿 其中 🏴 是基础 emoji `U+1F3F4`，\_gbeng \_分别代表对应的拉丁控制字符： `g(U+E0067)`、`b(U+E0062)`、`e(U+E0065)`、 `n(U+E006E)`、`g(U+E0067)`，`U+E007F` 表示结束符，全称是 TAG CANCEL

```javascript
/**
 * 根据地区缩写返回对应的emoji
 * 如：flag('gbeng') -> 🏴󠁧󠁢󠁥󠁮󠁧󠁿
 */
function flag(letterStr) {
  const BASE_FLAG = "🏴";
  const TAG_CANCEL = String.fromCodePoint(0xe007f);

  // 将普通字母字符序列转换为"标签拉丁字符"序列
  const tagLatinStr = letterStr
    .toLowerCase()
    .split("")
    .map((letter) => {
      const codePoint = letter.charCodeAt(0) - "a".charCodeAt(0) + 0xe0061;
      return String.fromCodePoint(codePoint);
    })
    .join("");

  return BASE_FLAG + tagLatinStr + TAG_CANCEL;
}
复制代码;
```

目前用这种方式表示的 emoji 共有三个

- 🏴 + gbeng + U+E007F = 🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰旗帜，完整序列：1F3F4 E0067 E0062 E0065 E006E E0067 E007F
- 🏴 + gbsct + U+E007F = 🏴󠁧󠁢󠁳󠁣󠁴󠁿 苏格兰旗帜，完整序列：1F3F4 E0067 E0062 E0073 E0063 E0074 E007F
- 🏴 + gbwls + U+E007F = 🏴󠁧󠁢󠁷󠁬󠁳󠁿 威尔士旗帜，完整序列：1F3F4 E0067 E0062 E0077 E006C E0073 E007F

### 键位符

共有 12 个键位符 #️⃣ \*️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣，规则是这样的：井号、星号和数字，加 `U+FE0F` 变成 emoji，再加上 `U+20E3` 变成带方框的键位符。

- - - FE0F + 20E3 = \*️⃣
- # + FE0F + 20E3 = #️⃣
- 0 + FE0F + 20E3 = 0️⃣
- ...

`U+FE0F` 是前文提到的变体选择符中的 `VS-16`，表示显示为 emoji 形态。JavaScript 中 `'\u0030'` 表示数字 `'0',` `'\u0030\ufe0f'` 则表示它的 emoji 变体，两者在 zsh 的 console 中显示效果不同，`.length` 的值也不同。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/e7d4da41.webp) ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/5fba8740.webp)

### 小结

一共有七种 emoji 造字法

1. **基础 emoji，单个码点表示一个 emoji** 🧛 `U+1F9DB`
2. **单个码点 + 变体选择符** ⚛️ = ⚛︎ `U+26A0` + `U+FE0F`
3. **皮肤修饰符** 🤵🏽 = 🤵 `U+1F935` + **🏽** `U+1F3FD`
4. **ZWJ 连接符 ** 👨‍💻 = 👨 + ZWJ + 💻
5. **旗帜符号** 🇨🇳 = 🇨 + 🇳
6. **标签序列 ** 🏴󠁧󠁢󠁳󠁣󠁴󠁿 = 🏴 + gbsct + `U+E007F`
7. **键位序列 ** \*️⃣ = \* + `U+FE0F` + `U+20E3`

前四种方法也可以组合使用，可构造非常复杂的 emoji

> `U+1F6B5` 🚵 个人山地骑行
>
> - `U+1F3FB` 浅色皮肤
> - `U+200D` ZWJ
> - `U+2640` ♀️ 女性标志
> - `U+FE0F` 变体标志 = 🚵🏻‍♀️ 浅色皮肤的女性山地骑行

```javascript
/**
 * 显示一个字符种所有的Unicode码点
 */
function codePoints(str) {
	const result = [];
	for(let i = 0; i < str.length; i ++) {
		result.push(str.codePointAt(i).toString(16).toUpperCase());
	}
	return result;
}
codePoints('🚵🏻‍♀️') => ['1F6B5', 'DEB5', '1F3FB', 'DFFB', '200D', '2640', 'FE0F']
```

## 如何在代码中正确处理 emoji？

#### emoji 引入的问题

`'中国人123'.length = 6`，`'工作中👨‍💻'.length = 8` emoji 给编程带来的主要问题是视觉上看到的字符长度（后文称作**视觉 length**）与代码中获取的长度（后文称作**技术 length**）不相同，使得字符串截取等操作返回非预期内的结果，如： `'工作中👨‍💻'.substr(0,5) => '工作中👨'`，`'工作中👨‍💻'.substr(5)' => '‍💻'`

本质上在 emoji 出现之前 Unicode 编码就遇到了该问题，只不过 emoji 的普及让该问题更普遍。有的 emoji 长度为 1，有的长度可以达到 15。问题的根源是 Unicode 中可以用多个码点表示一个 emoji，如果所有 emoji 都用一个 Unicode 码点表示就不存在该问题。 ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/86f053f5.webp)

#### 解法：视觉 length VS. 技术 length

解法显而易见，只要能将字符串中所有的**字符元素**按照视觉上看到的情况准确拆分，即：准确拆解字符串中的所有**字素集**。 下述伪代码是要实现的效果，很多开源工具库就在做同样的事情，搜：Grapheme Cluster 即可。找到一个 [JavaScript 版的 grapheme-splitter](https://github.com/orling/grapheme-splitter/blob/master/index.js)，但是数据已经过时（勿用）。

```javascript
const vs = new VisualString("工作中👨‍💻");
// vs.length => 4;  				// 视觉长度
// vs.physicalLength => 8;	// 字符串长度
// vs[0] => 工
// vs[3] => 👨‍💻               // 按照所见即所得的方式拆分字符

// 字素集方法
// vs.substr(3,1) => 👨‍💻      // 截取字符

// 字素集属性
// vs[3].physicalLength => 5  // 物理长度
// vs[3].isEmoji => true      // 是否是emoji
复制代码;
```

我们将产出工具库中将要提供这些能力

1. **判断一个字符串中是否包含 emoji**
2. **将一个字符串准确拆分成若干个字素集**
   - 每个字素集包含这些属性：`isEmoji`、`physicalLength`
3. **按照字素集对字符串做截取操作**
   - 基础截取： `new VisualString('👨123👨‍💻').substr(1, 4) => '123👨‍💻'`
   - 限定物理长度截取：`new VisualString('👨123👨‍💻').substr(1, 4, 6) => '123'`，最后一个参数 6 代表最大物理长度，其中 `'123👨‍💻'.length = 8`，如果限定最大物理长度 6 则只能截取到 `'123'`。 _备注：在产品体验上我们遵循“所见即所得”，但是在后端系统中传输和存储时候要遵循物理长度的限制，因此需要提供限定物理长度的截取能力。_

#### 版本兼容问题

如果 A 向 B 发送了一个组合 emoji「工作 👨‍💻123」，B 的系统或软件中版本低(兼容的 Unicode 版本低)不支持该组合 emoji，看到的可能会是「工作 👨💻123」。 用看到的是 👨‍💻 还是 👨💻 取决于用户的操作系统、软件和字体，我们提供的 JS 库无法感知到用户最终看到的是什么。我们提供的 JS 库会按照最新 Unicode 规范实现，无论用户看到的是什么都会把它当成一个**字符**(准确地说是字素集)，即： `const vs = new VisualString('工作👨💻123'); vs.length => 6; vs[2] => '👨💻'` 有办法可以一定程度上解决上述问题，但是我们觉得可能不解决才是正确的做法。

## 一个彩蛋

最后希望你使用 emoji 愉快 😄 发现 emoji 的维护者彻底贯彻「众生平等」，除了推出了不同肤色的 emoji 外，竟还设计了一个 Pregnant Man :) ![image.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_emoji3fd35fg4odkk35/65a4d54c.webp)
🤰🫃🫄🏼 以上是分别是 woman、man、person，emoji 的新趋势是设计中性的 emoji

---

## 参考

- [Full Emoji List, v15.0](https://unicode.org/emoji/charts/full-emoji-list.html)
- [Unicode Emoji 编程参考数据](https://unicode.org/Public/emoji/15.0/)：[emoji-sequences.txt](https://unicode.org/Public/emoji/15.0/emoji-sequences.txt)、[emoji-test.txt](https://unicode.org/Public/emoji/15.0/emoji-test.txt)、[emoji-zwj-sequences.txt](https://unicode.org/Public/emoji/15.0/emoji-zwj-sequences.txt)
- [Emoji under the hood](https://tonsky.me/blog/emoji/)， [翻译版本](https://taoshu.in/emoji.html)
- [A Systematic Review of Emoji](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02221/full)
- [Apple Color Emoji](https://emojipedia.org/apple/ios-15.4/)
- [Noto Color Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji)
- [Unicode Emoji 正则](https://www.unicode.org/reports/tr51/#EBNF_and_Regex)
- [grapheme-splitter 代码参考](https://github.com/orling/grapheme-splitter)（慎用，数据已过期）
