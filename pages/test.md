---
title: "样式内容测试"
date: 2021-03-16T19:10:16+08:00
draft: true
categories: [dev]
tags: [dev, web]
pin: true
---
# 样式内容测试 {#head101 .header title="this is a test"}

在一行的**末尾**添加*两个*或~~多个~~空格，然后按*回车键*（return），即可创
建一个换行（line break）。
几乎每个 _Markdown_ 应用程序都 [https://www.browserleaks.com/canvas](https://www.browserleaks.com/canvas) 支持两个或多个空格进行换行 (称为 “结尾空格（trailing whitespace）”) 的方式，但这是有争议的，因为很难在编辑器中直<br/>接看到空格，并且*很多人*在每个句子后面都会有意或无意地添加两个空格。由于这个原因，你可能需要使用除结尾空格以外的其它方式来进行换行。幸运的是，几乎每个 Markdown 应用程序都~~支持~~另一种换行方式：HTML 的 <br> 标签。

html <b>b tag</b> b 标签

new line

---

- In order to solve of unwanted lists
- 段落的前后
- 有的前后

1. 111
2. 222
3. 333
4. 4444

- foo
- bar

* baz

- [https://github.com/ionic-team/stencil](https://github.com/ionic-team/stencil)

  A Web Component compiler for building fast, reusable UI components and static site generated Progressive Web App

Foo

- bar
- baz

- [X] foo
  - [ ] bar
  - [X] baz
- [ ] bim

段落的前后要有空行，所谓的

> 空行是指没有文字内容。
> 若想在段内强制换行的方式是使用两个

> 以上空格加上回车（引用中换行省略回车）。

[在线测试地址](https://www.browserleaks.com/canvas)，可查看浏览器的 Canvas 唯一性字符串。

![60ZAsg.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/test/577fa306.png)

- [X] foo
  - [ ] bar
  - [X] baz
- [ ] bim

Java 代码

```java
public class ConditionUserCase {

  Lock lock = new ReentrantLock();
  Condition condition = lock.newCondition();

  public void conditionWait() throws InterruptedException {
    lock.lock();
    try {
      condition.await();
    } finally {
      lock.unlock();
    }
  }

  public void conditionSignal() {
    lock.lock();
    try {
      condition.signal();
    } finally {
      lock.unlock();
    }
  }
}

```

R 代码

```r
a <- c(1:7, NA)
mean(a, na.rm = TRUE)
```

{{< github "spech66/hugo-shortcodes" >}}
