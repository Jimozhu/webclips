---
title: 程序员阅读清单：我喜欢的 100 篇技术文章（1-20）
date: 2024-08-26T02:09:25.728Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://www.piglei.com/articles/programmer-reading-list-1/'
---

程序员们也许是互联网上最爱分享的群体之一，他们不仅喜欢开源自己写的软件，也爱通过写文章来分享知识。从业以来，我阅读过大量技术文章，其中不乏一些佳作。这些佳作中，有些凭借深刻的技术洞见令我深受启发，也有些以庖丁解牛般的精湛手法解释一项技术，让我读后大呼过瘾。

作为 “爱分享” 的程序员中的一份子，我想当一次推荐人，将读过的好文章分享给大家。我给这个系列起名为 **《程序员阅读清单：我喜欢的 100 篇技术文章》** 。

受限于本人的专业与兴趣所在，清单中的文章对以下几个领域有所偏重：*程序员通识、软件工程、后端开发、技术写作、Python 语言、Go 语言*。

下面是阅读清单的第一部分，包含第 1 到 20 篇文章。

## 清单

### 1. 《开发者应学习的 10 件有关 “学习” 的事》

* 原文链接：[10 Things Software Developers Should Learn about Learning](https://cacm.acm.org/research/10-things-software-developers-should-learn-about-learning/)
* 作者：Neil C.C. Brown, Felienne F. J. Hermans, and Lauren E. Margulieux

学习对于任何一个人都很重要，对于软件开发者来说更是如此。这是一篇有关 “学习” 的科普类文章，从介绍人类记忆的工作原理开始，引出专家与新手的区别、间隔与重复的重要性等主题。

文章中的一些观点相当具有启发性。比如 “抽象和具象”：新知识对于初学者来说先是抽象的，然后通过大量例子将其具象化，最终彻底掌握后又重新变回抽象。又比如：做智力题和编程能力并没有关联性 —— 这和我们认知中的 “聪明人更会编程” 大不相同。

### 2. 《开发者如何管理自驱力》

* 原文链接：[Managing My Motivation, as a Solo Dev](https://mbuffett.com/posts/maintaining-motivation/)
* 作者：Marcus Buffett

作者是一名单兵作战的开发者，分享在管理自驱力方面的心得。文章提供了许多提高自驱力的切实可行的小点子，比如：

* 开发一个通知机器人，当自己的软件有新订阅时通知自己 —— 外力驱动；
* 每天的开发任务做到 90% 后停止，留到第二天完成 —— 让新一天有盼头；
* 为了避免自己被 “今日一事无成” 的罪恶感击溃，先干点高产出的正事，再做其他。

### 3. 《用 Go 语言分析 10 亿行数据，从 95 秒到 1.96 秒》

* 原文链接：[One Billion Row Challenge in Golang - From 95s to 1.96s](https://r2p.dev/b/2024-03-18-1brc-go/)
* 作者：Renato Pereira

一篇很不错的 Go 语言性能优化文章，涉及到这些知识点：文件读取性能优化、生产者消费者模型优化、channel 对比 mutex、自定义 hash 算法，等等。

作者的思维模式、用到的工具链及优化手法非常规范，整个调优过程层层递进，文章行文也很工整。非常值得一读。

### 4. 《在开发高质量软件上的花费值得吗？》

* 原文链接：[Is High Quality Software Worth the Cost?](https://martinfowler.com/articles/is-quality-worth-cost.html)
* 作者：Martin Fowler

对于大多数事物而言，如果想要追求更高的质量，必然要花费更多的成本，但对软件而言是否也是如此？作者 Martin Fowler 将软件质量分为两类：外在与内在。

由于软件的内在质量很难被外人所感知，因此花在改善内在质量上的成本常被质疑。但实际上，在内在质量上投入并不增加成本，反而能降低整体花费。文章会通过详细的分析与对比告诉你为什么。

### 5. 《错误抽象》

* 原文链接：[The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
* 作者：Sandi Metz

如果你想要建造一栋楼房，假如地基不正，最终只能收获一栋歪歪扭扭的残次品。对编程而言，抽象便是地基，良好的抽象是一切美好事物的前提。

这篇文章探讨了复用与抽象间的关系，作者犀利地指出一个事实：对 “沉没成本” 的恐惧常常孕育出错误抽象，而后者将引发项目质量恶化。

一篇短小精悍的经典之作，不容错过。

### 6. 《谷歌技术写作课：编写有帮助的错误信息》

* 原文链接：[Writing Helpful Error Messages](https://developers.google.com/tech-writing/error-messages)
* 作者：谷歌工程团队

在软件开发中，错误信息是一种极为微妙的存在，糟糕的错误信息使人沮丧，时刻提醒着我们：“魔鬼藏在细节中”。

对此，谷歌团队提供了一份关于错误信息的写作建议，包含：精确描述、提供解决方案、面向目标读者写作、用正确的语气写作，等等。我认为这应该成为每位程序员的必修课。

### 7. 《深入 Python 字典 —— 一份 “可探索” 的解释》

* 原文链接：[Inside python dict — an explorable explanation](https://just-taking-a-ride.com/inside_python_dict/chapter1.html)
* 作者：Alexander Putilin

毫不夸张的说，网上介绍 Python 字典原理的文章多到泛滥。但这篇比较特别，它的特别主要体现在标题里的 “可探索” 上。

在文章中，作者用一些 Python 代码模拟了字典数据类型。这些代码可在页面上点击执行，过程完全可视化。比如当字典中出现哈希冲突时，会有非常细致的动画，看起来妙趣横生。

### 8. 《愿意让自己显得愚蠢》

* 原文链接：[Willingness to look stupid](https://danluu.com/look-stupid/)
* 作者：Dan Luu

人们天生在意他人的看法，每个人都希望自己是别人眼里的 “聪明人”，而不是 “傻瓜”。不过，本文作者分享了一个不太常见的观点： *做一些让自己显得愚蠢的事，利远大于弊。*  比方说：提出愚蠢问题往往能获得对事物更深入的理解；用别人眼中的蠢办法学习，效果更好。

### 9. 《我们为什么坚持使用 Ruby on Rails》

* 原文链接：[Why we're sticking with Ruby on Rails](https://about.gitlab.com/blog/2022/07/06/why-were-sticking-with-ruby-on-rails/)
* 作者：Sid Sijbrandij

著名的开源软件 GitLab 的大部分代码都在一个 Rails 单体项目里。GitLab 采用 “模块化单体” 架构，并未使用近年颇为流行的微服务架构。作者在文章中解释了 GitLab 这么做的原因：微服务架构徒增偶然复杂度，却对降低本质复杂度帮助不大。

我很认同文章中的一句话： *架构该为需求服务，而不是反过来。*&#x20;

### 10. 《ChatGPT 是互联网的一张模糊的 JPEG 图》

* 原文链接：[ChatGPT Is a Blurry JPEG of the Web](https://readwise.io/reader/shared/01gry4pcabx8kh4k1pkpf2e2pe/)
* 作者：Ted Chiang

这篇文章发表于大语言模型爆发前夜：GPT-3.5 已经问世，GPT-4 蓄势待发。虽然文章的主体论调偏（有理由的）消极，但是文章中的大量精彩类比，以及作者优美的文笔，令人击节称叹。也许你不一定认同作者关于大模型的观点，但你很难不被作者字里行间所流露出的深邃思考所打动。

阅读这篇文章时，我曾多次感叹：“怎么写得这么好？”。我将页面拖动到顶部，仔细检查作者的名字 —— 谜底揭开：“难怪，作者是特德・姜！”

> 注：特德・姜，美国当代注明科幻小说家，作品曾获得星云奖、雨果奖等多项大奖。

### 11. 《重新发明 Python notebook 时学到的教训》

* 原文链接：[Lessons learned reinventing the Python notebook](https://marimo.io/blog/lessons-learned)
* 作者：Akshay

一篇与产品设计有关的总结文章。文章主角是 marimo—— 一个类似 Jupyter 的 Python 笔记本软件。本文所涉及的内容包括：如何利用有向无环图让笔记总是可重现；为什么强约束的简单设计优于弱约束的复杂，等等。

我很爱读这类文章，因为由技术人写的优秀产品设计经验，如珍珠般少见。

### 12. 《断点单步跟踪是一种低效的调试方法》

* 原文链接： [断点单步跟踪是一种低效的调试方法](https://blog.codingnow.com/2018/05/ineffective_debugger.html)
* 作者：云风

曾经的我以为编程像解数学题，不同人的解法或稍有区别，但终究殊途同归。然而最近两年，我发现编程更像是画画或写作，每个人信奉着自己的道。

云风的这篇文章的标题，坦率来说有些骇人听闻，但仔细读过后，的确能感受到一种独特的编程智慧，一种专属于有着数十年经验的编程匠人的哲思。

### 13. 《作为 “胶水”》

* 原文链接：[Being Glue](https://noidea.dog/glue)
* 作者：Tanya Reilly

软件工程师的日常工作除编码以外，还有大量其他事务，比如总结文档、优化工具链等，作者将这类事务统称为 “胶水工作”。

胶水工作看似不起眼，但对于项目的成败至关重要。本文指出了一个被人忽视的事实：承担更多胶水工作的有责任心的工程师，反而更不易晋升。针对这一点，作者提供了一些有用的建议。

### 14. 《拥抱苦差事》

* 原文链接：[Embrace the Grind](https://jacobian.org/2021/apr/7/embrace-the-grind/)
* 中文翻译：[拥抱苦差事](https://www.piglei.com/articles/embrace-the-grind-cn-translation/)
* 作者：Jacob Kaplan-Moss

本文以一个魔术揭秘开头，引出作者如何通过完成 “苦差事”，将整个开发团队拉出泥沼的故事；之间穿插着对程序员金句 “懒惰是程序员的美德” 的思考。

重读这篇文章时，我想起最近在一本书上看到的另一句话，大意是这样的：*“外行人做事时渴求及时反馈与成就感，而专业人士在一切变得乏味后，仍然继续向前。”*

### 15. 《也许是时候停止推荐〈代码整洁之道了〉》

* 原文链接：[It's probably time to stop recommending Clean Code](https://qntm.org/clean)
* 作者：qntm

作为一本经典书籍，《代码整洁之道》长期出现在各类编程书单中。但是，本文作者发现，这本出版于十几年前的书中的大量内容已经过时，其中的不少代码示例质量糟糕。

在这篇文章中，本文作者对书中的部分 Java 代码片段进行了几乎称得上是 “凶残” 的 Code Review。文章观点有一定争议性，但也不乏道理。

### 16. 《我在编辑时考虑的事》

* 原文链接：[What I think about when I edit](https://evaparish.com/blog/how-i-edit)
* 作者：Eva Parish

作为一名专业的技术写作者，作者 Eva 常常帮其他人编辑技术文档。久而久之，她总结出了 9 条编辑建议，比如：明确文章主题、有理由的重复，等等。

虽然文章中的部分建议更适用于英文写作场景，但我仍然很推荐它。因为你很容易发现，这篇文章虽然信息量大，但读来非常流畅、舒服 —— 我想这就是优秀的 “编辑” 带来的魔力。

### 17. 《修复流行 Python 库的内存泄露问题》

* 原文链接：[Fixing Memory Leaks In Popular Python Libraries](https://www.paulsprogrammingnotes.com/2021/12/python-memory-leaks.html)
* 作者：Paul Brown

这篇文章的标题很大，但其实只是一篇短文，里面的 Python 示例代码不超过 10 行。

在一次黑客马拉松活动中， 本文作者和同事一起定位了 py-amqp 库的一个内存泄露问题。提交 PR 后，他在 redis-py 等流行的库中发现了类似的情况。问题和 Python 中的 try/except 语句块有关，迷惑性很强。

### 18. 《UI 设计原则》

* 原文链接：[Principles of\_ User Interface Design](http://bokardo.com/principles-of-user-interface-design/)
* 作者：Joshua Porter

文章总结了 19 条 UI 设计原则，包括：清晰最重要、让用户有掌控感、渐进式披露，等等。我最喜欢的是第 17 条原则：“伟大的设计是隐形的”，它让我想起一些优秀的开源软件库。

虽然名为 UI 设计，但这些原则并不只属于设计师，我认为每个人都可以从中受益。作为程序员，每当我们写下一个函数定义语句，实际就是在做一次 UI 设计。

### 19. 《你的数据库技能不是 “锦上添花”》

* 原文链接：[Your Database Skills Are Not 'Good to Have'](https://renegadeotter.com/2023/11/12/your-database-skills-are-not-good-to-have.html)
* 作者：Andrei Taranchenko

在文章中，作者 Andrei 先分享了一个 20 年前的故事：用 MySQL 巧妙完成了一项困难的业务需求。然后引出文章主题：如今大家对数据库技能的关注度不应该这么低。

我很认同作者对于关系数据库和 ORM 等工具的观点。有时候，当项目遇到性能问题时，分明加个索引、优化下查询就能解决，许多人却大喊着：“快点，上缓存！换 DB！”—— 实在大可不必。

### 20. 《预估开发时间很难，但还是得做》

* 原文链接：[Software Estimation Is Hard. Do It Anyway.](https://jacobian.org/2021/may/20/estimation/)
* 作者：Jacob Kaplan-Moss

在软件开发中，“估时间” 是一项令人头疼的事。我们都曾有过类似的经历：拍胸脯说 3 天搞定的任务，最后足足耗费了大半个月。

到后来，“估时间” 成了到底留 1 倍还是 2 倍 buffer 的无聊游戏。但正如本文的标题所言，预估开发时间虽然难，却不可避免。这篇文章（系列）提供了一些与之相关的技巧，相信可以给你一些启发。

## 结语

以上就是 “程序员阅读清单” 第一期的全部内容，祝你阅读愉快！

题图来源：Photo by Farsai Chaikulngamdee on Unsplash


  