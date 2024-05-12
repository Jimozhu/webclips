---
title: "24个强大的HTML属性"
date: 2023-04-13T08:58:26+08:00
draft: false
categories: [dev]
tags: [dev, web]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7219669309537845285)

{{< toc >}}

HTML 属性非常多，除了基本的一些属性外，还有很多很有用的功能性特别强大的属性；

本文将介绍 24 个强大的 HTML 属性，这些属性可以让你的网站更加动态和交互，让用户感到更加舒适和愉悦。

让我们一起来探索这 24 个强大的 HTML 属性吧！

# 1. Accept

Accept 属性是用于指定浏览器可以处理的 MIME 类型的列表。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/15c885d3.webp)[]()

> Tips：
>
> MIME 类型是一种标识文档类型的标准，
>
> 例如 text/html 表示 HTML 文档，image/jpeg 表示 JPEG 图像等等。

通过在 HTTP 请求头中包含 Accept 属性，浏览器可以告诉服务器它可以接受哪些 MIME 类型的响应。服务器可以根据这个信息来选择最合适的响应类型并返回给浏览器。Accept 属性的值是一个逗号分隔的 MIME 类型列表，可以使用通配符来表示一类 MIME 类型，例如 text/\*表示所有文本类型。

# 2. Autofocus

Autofocus 属性是用于在页面加载时自动将焦点设置到指定的元素上。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/bdacf480.webp)[]()

> Tips：
>
> Autofocus 属性可以应用于多种 HTML 元素，例如文本框、按钮、下拉列表等等。
>
> 在 HTML5 中，Autofocus 属性可以省略属性值，表示将焦点设置到第一个具有 Autofocus 属性的元素上。

当页面加载完成后，如果存在 Autofocus 属性的元素，浏览器会自动将光标聚焦在该元素上，使用户可以直接与该元素进行交互，而无需手动点击或使用 Tab 键切换焦点。

# 3. Inputmode

Inputmode 属性是用于指定文本框中输入的内容类型的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/f1395c8f.webp)[]()

它可以帮助浏览器更好地优化输入体验，例如在移动设备上自动弹出合适的虚拟键盘。

> Tips：
>
> Inputmode 属性的值可以是以下几种类型：
>
> - text：默认值，表示输入任意文本。
> - none：表示不需要输入任何内容。
> - tel：表示输入电话号码。
> - url：表示输入 URL 地址。
> - email：表示输入电子邮件地址。
> - numeric：表示输入数字。
> - decimal：表示输入带小数点的数字。
> - search：表示输入搜索关键字。

在不同的浏览器中，Inputmode 属性的支持程度可能会有所不同。

因此，在使用 Inputmode 属性时，需要进行兼容性测试。

# 4. Pattern

Pattern 属性是用于指定文本框中输入内容的正则表达式模式。它可以帮助浏览器验证用户输入的内容是否符合指定的格式要求。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/404440d4.webp)[]()

如果用户输入的内容不符合 Pattern 属性指定的正则表达式模式，浏览器会显示一个默认的错误提示信息。

> Tips：
>
> - Pattern 属性的值必须是一个有效的正则表达式。
> - Pattern 属性只能应用于文本框、文本域和密码框等可输入文本的元素。
> - Pattern 属性不会阻止用户输入非法字符，但会在提交表单时验证输入内容是否符合指定的格式要求。
> - Pattern 属性的错误提示信息可以使用 title 属性自定义。

Pattern 属性通常与 required 属性一起使用，以确保用户输入的内容符合指定的格式要求且不为空。例如，可以使用 Pattern 属性来验证用户输入的邮政编码、电话号码、电子邮件地址等等。

# 5. Required

Required 属性是用于指定表单元素是否必填的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/ec2f8b69.webp)[]()

如果一个表单元素设置了 Required 属性，那么在提交表单时，如果该元素的值为空，浏览器会阻止表单的提交，并提示用户必须填写该字段。

> Tips：
>
> - Required 属性只能应用于表单元素，不能应用于其他 HTML 元素。
> - Required 属性不会验证用户输入的内容是否符合指定的格式要求，只会验证该元素是否为空。
> - Required 属性不会阻止用户提交空格或空白字符，因此需要使用其他方式来验证用户输入的内容是否有效。
> - Required 属性可以与 Pattern 属性一起使用，以验证用户输入的内容是否符合指定的格式要求。
> - Required 属性可以与 Autofocus 属性一起使用，以确保用户在进入表单页面时，焦点自动聚焦在必填字段上。

Required 属性通常与表单元素的 type 属性一起使用，例如文本框、下拉列表、单选框、复选框等等。

# 6. Autocomplete

Autocomplete 属性是用于指定表单元素是否启用自动完成功能的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/fb2c67e5.webp)[]()

自动完成功能可以帮助用户更快地填写表单，减少输入错误的可能性。

> Tips：
>
> - on：默认值，表示启用自动完成功能。
> - off：表示禁用自动完成功能。
> - name：表示使用表单元素的 name 属性作为自动完成的关键字。
> - email：表示使用用户最近输入的电子邮件地址作为自动完成的关键字。
> - username：表示使用用户最近输入的用户名作为自动完成的关键字。
> - current-password：表示使用用户最近输入的密码作为自动完成的关键字。
> - new-password：表示使用用户最近输入的新密码作为自动完成的关键字。
> - tel：表示使用用户最近输入的电话号码作为自动完成的关键字。
> - address-level1：表示使用用户最近输入的国家或地区名称作为自动完成的关键字。
> - address-level2：表示使用用户最近输入的省份或州名称作为自动完成的关键字。
> - address-level3：表示使用用户最近输入的城市或地区名称作为自动完成的关键字。
> - address-level4：表示使用用户最近输入的街道名称作为自动完成的关键字。
> - country：表示使用用户最近输入的国家名称作为自动完成的关键字。

在不同的浏览器中，Autocomplete 属性的支持程度可能会有所不同。因此，在使用 Autocomplete 属性时，需要进行兼容性测试。

# 7. Multiple

Multiple 属性是用于指定表单元素是否允许多选的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/85bb0a68.webp)[]()

Multiple 属性通常应用于下拉列表、文件上传和复选框等表单元素。

> Tips：
>
> - Multiple 属性只能应用于下拉列表、文件上传和复选框等表单元素，不能应用于单选框和文本框等表单元素。
> - Multiple 属性的值必须是布尔值，即 true 或 false。
> - Multiple 属性的默认值为 false，表示不允许多选。
> - Multiple 属性的值为 true 时，下拉列表会显示为可多选的列表框，复选框会显示为可多选的复选框列表，文件上传会允许用户选择多个文件。
> - 在使用 Multiple 属性时，需要在后台程序中对多选的值进行处理，例如使用数组来存储多选的值。

如果一个表单元素设置了 Multiple 属性，那么用户可以选择多个选项，而不仅仅是单选。

# 8. Download

Download 属性是用于指定链接下载文件时的文件名的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/500fad76.webp)[]()

如果一个链接设置了 Download 属性，那么当用户点击该链接下载文件时，浏览器会将文件保存到本地，并使用 Download 属性指定的文件名来命名文件。

> Tips：
>
> - Download 属性的值可以是任意字符串，表示下载文件时使用的文件名。
> - Download 属性只能应用于标签中，不能应用于其他 HTML 元素。
> - Download 属性不会改变文件的实际名称，只会在下载时使用指定的文件名。
> - Download 属性的值可以是动态生成的，例如使用 JavaScript 来生成文件名。
> - 在使用 Download 属性时，需要确保下载的文件是合法的，不侵犯他人的版权和隐私。

Download 属性通常应用于标签中，用于下载 PDF、图片、音频、视频等文件。

# 9. Contenteditable

HTML 中的 Contenteditable 属性是用于指定元素是否可编辑的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/0face1a7.webp)

> Tips：
>
> - Contenteditable 属性的值可以是 true、false 或 inherit。
> - Contenteditable 属性的默认值为 false，表示元素不可编辑。
> - Contenteditable 属性的值为 true 时，元素可编辑。
> - Contenteditable 属性的值为 inherit 时，元素的可编辑性继承自父元素。
> - Contenteditable 属性不会改变元素的默认行为，例如标签仍然可以跳转到其他页面。
> - 在使用 Contenteditable 属性时，需要注意安全性问题，避免 XSS 攻击和恶意脚本注入。

如果一个元素设置了 Contenteditable 属性，那么用户可以在该元素中输入文本、插入图片、修改样式等等。Contenteditable 属性通常用于实现富文本编辑器、可编辑的表格等功能。

# 10. Readonly

HTML 中的 Readonly 属性是用于指定表单元素是否只读的属性。
![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/21d0a136.webp)

> Tips：
>
> - Readonly 属性的值必须是布尔值，即 true 或 false。
> - Readonly 属性的默认值为 false，表示表单元素可编辑。
> - Readonly 属性的值为 true 时，表单元素只读。
> - Readonly 属性不会阻止用户通过 JavaScript 修改表单元素的值。
> - Readonly 属性不同于 Disabled 属性，Disabled 属性会禁用表单元素，使其无法提交数据。
> - 在使用 Readonly 属性时，需要在后台程序中对只读的值进行处理，例如使用隐藏域来存储只读的值。

如果一个表单元素设置了 Readonly 属性，那么用户可以看到该元素的值，但无法修改该元素的值。Readonly 属性通常应用于文本框、下拉列表、日期选择器等表单元素，用于展示数据或防止用户修改数据。

# 11. Hidden

Hidden 属性是用于指定元素是否隐藏的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/7095f21f.webp)[]()

> Tips：
>
> - Hidden 属性的值必须是布尔值，即 true 或 false。
> - Hidden 属性的默认值为 false，表示元素不隐藏。
> - Hidden 属性的值为 true 时，元素隐藏。
> - Hidden 属性不同于 CSS 的 display:none 属性，display:none 属性会将元素从页面中完全移除，无法通过 JavaScript 等方式访问该元素。
> - 在使用 Hidden 属性时，需要在后台程序中对隐藏的值进行处理，例如使用隐藏域来存储隐藏的值。

如果一个元素设置了 Hidden 属性，那么该元素将不会在页面中显示，但仍然存在于页面中，可以通过 JavaScript 等方式访问该元素。Hidden 属性通常应用于表单元素、按钮、图像等元素，用于在不影响页面布局的情况下，传递数据或控制页面行为。

# 12. Spellcheck

HTML 中的 Spellcheck 属性是用于指定元素是否启用拼写检查的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/6211a146.webp)[]()

> Tips：
>
> - Spellcheck 属性的值必须是布尔值，即 true 或 false。
> - Spellcheck 属性的默认值为 false，表示元素不启用拼写检查。
> - Spellcheck 属性的值为 true 时，元素启用拼写检查。
> - Spellcheck 属性的支持程度因浏览器而异，不同浏览器可能会有不同的拼写检查算法和字典。
> - 在使用 Spellcheck 属性时，需要注意安全性问题，避免 XSS 攻击和恶意脚本注入。

如果一个元素设置了 Spellcheck 属性，那么用户在该元素中输入文本时，浏览器会自动检查拼写错误，并在错误单词下方显示红色波浪线。Spellcheck 属性通常应用于文本框、文本域等元素，用于提高用户输入的准确性。

# 13. Translate

HTML 中的 Translate 属性是用于指定元素是否应该被翻译的属性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/bbaa680c.webp)[]()

> Tips：
>
> - Translate 属性的值必须是布尔值，即 yes 或 no。
> - Translate 属性的默认值为 yes，表示元素需要翻译。
> - Translate 属性的值为 no 时，元素不需要翻译。
> - Translate 属性的支持程度因浏览器而异，不同浏览器可能会有不同的翻译算法和字典。
> - 在使用 Translate 属性时，需要注意安全性问题，避免 XSS 攻击和恶意脚本注入。

如果一个元素设置了 Translate 属性，那么浏览器会根据该属性的值来决定是否翻译该元素的内容。Translate 属性通常应用于网站的多语言版本中，用于控制哪些元素需要翻译，哪些元素不需要翻译。

# 14. Loading

HTML 中的 `loading` 属性是一个新的属性，它可以用于指定浏览器在加载资源时的优先级。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/bf32ae8f.webp)[]()

该属性可以应用于 `<img>`、`<iframe>`、`<script>`、`<link>` 和 `<audio>` 等标签上。

> Tips：
>
> - `lazy`：表示资源应该在页面加载后延迟加载。这是默认值。
> - `eager`：表示资源应该在页面加载时立即加载。
> - `auto`：表示浏览器应该自行决定何时加载资源。

`loading` 属性并不是所有浏览器都支持的，因此在使用时需要进行兼容性检查。

# 15. Onerror

`onerror` 是一个 JavaScript 事件处理程序， JavaScript 错误时触发。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/f173bc9a.webp)[]()

可以将 `onerror` 事件处理程序添加到 `window` 对象上，以便在全局范围内捕获 JavaScript 错误。

> Tips：
>
> - `message`：错误消息。
> - `source`：发生错误的脚本 URL。
> - `lineno`：发生错误的行号。
> - `colno`：发生错误的列号。
> - `error`：包含有关错误的详细信息的 Error 对象。

`onerror` 事件处理程序只能捕获未被其他错误处理程序捕获的 JavaScript 错误。

最好在代码中使用 try-catch 语句来捕获和处理 JavaScript 错误。

# 16. Poster

`poster` 是 HTML5 中 `<video>` 标签的一个属性，用于指定在视频加载之前和播放之前显示的图像。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/f52f7da9.webp)[]()

> Tips：
>
> `poster` 属性只适用于 `<video>` 标签，而不适用于 `<audio>` 标签。

它通常用于提供视频的预览图像或缩略图。

# 17. Controls

`controls` 是 HTML5 中 `<video>` 和 `<audio>` 标签的一个属性，用于指定是否显示媒体播放器的控件。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/58078f39.webp)[]()

如果将 `controls` 属性设置为 `controls`，则会在媒体播放器上显示控件，例如播放/暂停按钮、音量控制、进度条等。

```xml
<!DOCTYPE html>

<html>

<head>

<title>Controls Example</title>

</head>

<body>

<video width="320" height="240" controls>

<source src="video.mp4" type="video/mp4">

<source src="video.ogg" type="video/ogg">

Your browser does not support the video tag.

</video>

</body>

</html>`
```

`controls` 属性只适用于支持 HTML5 的浏览器。如果浏览器不支持 HTML5，则不会显示控件。

# 18. Autoplay

`autoplay` 是 HTML5 中 `<video>` 和 `<audio>` 标签的一个属性，用于指定媒体是否应在页面加载时自动播放。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/ffef4b9d.webp)[]()

如果将 `autoplay` 属性设置为 `autoplay`，则媒体将在页面加载时自动播放。

```xml
<!DOCTYPE html>

<html>

<head>

<title>Autoplay Example</title>

</head>

<body>

<video width="320" height="240" autoplay>

<source src="video.mp4" type="video/mp4">

<source src="video.ogg" type="video/ogg">

Your browser does not support the video tag.

</video>

</body>

</html>`
```

自动播放可能会对用户体验产生负面影响，因此在使用 `autoplay` 属性时需要慎重考虑。在某些情况下，浏览器可能会阻止自动播放，例如在移动设备上，用户必须首先与页面进行交互，才能允许自动播放。

# 19. Loop

`loop` 是 HTML5 中 `<video>` 和 `<audio>` 标签的一个属性，用于指定媒体是否应在播放结束后循环播放。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/3403f355.webp)[]()

如果将 `loop` 属性设置为 `loop`，则媒体将在播放结束后循环播放。

```xml
<!DOCTYPE html>

<html>

<head>

<title>Loop Example</title>

</head>

<body>

<video width="320" height="240" loop>

<source src="video.mp4" type="video/mp4">

<source src="video.ogg" type="video/ogg">

Your browser does not support the video tag.

</video>

</body>

</html>`
```

循环播放可能会对用户体验产生负面影响，因此在使用 `loop` 属性时需要慎重考虑。

# 20. Cite

`cite` 是 HTML 中的一个全局属性，可以用于指定引用的来源。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/44ffe2fc.webp)[]()

`cite` 属性的值应该是一个 URL，指向引用的来源。

> Tips：
>
> `cite` 属性可以应用于 `<blockquote>`、`<q>`、`<del>`、`<ins>` 等标签上。

如果引用的来源不是一个 URL，可以将 `cite` 属性的值设置为一个描述引用的字符串。

```xml
<!DOCTYPE html>

<html>

<head>

<title>Cite Example</title>

</head>

<body>

<blockquote cite="https://www.example.com/quote">

This is a quote from an external source.

</blockquote>

<q cite="https://www.example.com/quote">

This is a short quote from an external source.

</q>

<del cite="https://www.example.com/deleted">

This text has been deleted from an external source.

</del>

<ins cite="https://www.example.com/inserted">

This text has been inserted from an external source.

</ins>

</body>

</html>
```

`cite` 属性并不会自动创建链接，因此如果需要创建链接，需要使用 `<a>` 标签，并将 `href` 属性设置为 `cite` 属性的值。

# 21. Datetime

`datetime` 是 HTML 中 `<time>` 标签的一个属性，用于指定日期和时间。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/5daa6edc.webp)[]()

`datetime` 属性的值应该是一个有效的日期和时间格式，例如 `YYYY-MM-DDThh:mm:ss`。

`datetime` 属性并不会自动格式化日期和时间，因此需要使用 JavaScript 或其他工具来格式化日期和时间。

# 22. Async

`async` 是 HTML 中 `<script>` 标签的一个属性，用于指定脚本是否应该异步加载。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/bd1b1d6b.webp)[]()

如果将 `async` 属性设置为 `async`，则脚本将异步加载，不会阻止页面的解析和渲染。

异步加载的脚本可能会在页面的其他部分加载之前执行，因此需要谨慎使用。如果脚本依赖于页面的其他部分，可能会导致错误。

# 23. Defer

`defer` 是 HTML 中 `<script>` 标签的一个属性，用于指定脚本是否应该延迟加载。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/68ea9d6f.webp)[]()

如果将 `defer` 属性设置为 `defer`，则脚本将延迟加载，直到页面解析完成后再执行。

```xml
<!DOCTYPE html>

<html>

<head>

<title>Defer Example</title>

<script defer src="script.js"></script>

</head>

<body>

<p>This is a paragraph.</p>

</body>

</html>
```

在上面的示例中，我们将 `defer` 属性设置为 `defer`，这将使脚本延迟加载。在这种情况下，脚本将在页面解析完成后执行，不会阻止页面的加载。

# 24. Draggable

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_scn44godkk35/4e4e6330.webp)[]()

`Draggable` 是 HTML5 中的一个属性，它允许用户通过拖动元素来移动它们。当一个元素被设置为 `draggable` 时，用户可以通过鼠标或触摸屏幕来拖动该元素。在拖动元素时，会触发一系列事件，如 `dragstart`、`drag` 和 `dragend`，这些事件可以用来实现拖放功能。

如果你是一位专业的前端工程师，想必很多属性你都用过！

以上分享的 24 个强大的属性，你是否都在项目中使用过呢？
