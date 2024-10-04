---
title: ChatGPT 的 4000 个 token 上下文不够用怎么办？
date: 2024-10-04T15:27:04.811Z
categories:
  - zhihu
tags:
  - zhihu
  - 我的收藏
origin_url: //zhuanlan.zhihu.com/p/616860260
---
经过短暂的兴奋之后，你意识到只有 4000 个 token 的上下文似乎不能完成你想完成的工作。

然后又经过 GPT-4 发布后的短暂兴奋，你意识到有 32000 个 token 似乎够了。

但是你真的打算把你的整个代码仓库用 32000 个 token 扔进去，然后等他把你今天的工作成果给吐出来吗？似乎 32000 个 token 都不够用啊。

## ChatGPT 利用的 5 重境界

按照从业余到专业，分为以下 5 重：

1. 【输入文字少，输出文字多】：比如说，我想写一本民国穿越小说。然后等着 ChatGPT 给你把小说吐出来。
2. 【输入文字多，输出文字少】：比如说我给 ChatGPT 5 条评论做为例子。然后让 ChatGPT 把接下来的 3 条评论仿照前 5 条的例子做同样的分类。也就是你不是来 ChatGPT 来找内容生成的灵感的，而是把它当作一个海量信息处理的工具。这个处理规则很复杂，没法手写，只能由 AI 来推断。
3. 【你帮它做好任务拆解】：但是 token 不够了。为了解决这个问题，你帮它把一个大任务提前拆解好多个小任务。然后每个小任务调用一次。最后再拼接起来。比如要做一个超大文档的摘要任务。你可以搞一个切成小块的方法，然后每次让 ChatGPT 只做一个块的摘要。
4. 【接入工具】：让 ChatGPT 使用工具。也就是 ChatGPT 输出的文本实际上是给你的指令。比如说 ChatGPT 说这题我不会，我想 Google 一下这个关键字。然后你就按照 ChatGPT 的指令，去 Google 搜索完了，再把结果做为下一次的 chat 喂回去。
5. 【让 ChatGPT 来分解任务】：你帮它做好分解任务毕竟是一个基于规则的算法，对问题的适应性有限。如果任务分解也由 ChatGPT 自己来呢？

## 输入文字多，输出文字少

基础的信息处理 Prompt 满大街都是了。[https://github.com/microsoft/semantic-kernel/blob/3a4d497c4831b939ebd71877f908ed181b5316aa/samples/skills/WriterSkill/NovelOutline/skprompt.txt](https://link.zhihu.com/?target=https%3A//github.com/microsoft/semantic-kernel/blob/3a4d497c4831b939ebd71877f908ed181b5316aa/samples/skills/WriterSkill/NovelOutline/skprompt.txt) Semantic Kernel 里有一箱子。就是个 Prompt “军火库”

![](https://pic1.zhimg.com/v2-25d0c1326d940ff99246e9d4b5444cbe_b.jpg)

## 你帮它做好任务拆解

这方面的资料有

* [Launch HN: Bloop (YC S21) - Code Search with GPT-4](https://link.zhihu.com/?target=https%3A//news.ycombinator.com/item%3Fid%3D35236275) We get around these limitations with a two-step process. First, we use GPT-4 to generate a keyword query which is passed to a semantic search engine. This embeds the query and compares it to chunks of code in vector space (we use Qdrant as our vector DB). We’ve found that using a semantic search engine for retrieval improves recall, allowing the LLM to retrieve code that doesn’t have any textual overlap with the query but is still relevant. Second, the retrieved code snippets are ranked and inserted into a final LLM prompt. We pass this to GPT-4 and its phenomenal understanding of code does the rest.
* [基于 GPT-4 /vscode 的重构工具方案 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/614341278) 这个任务可以分成两个子任务。找出需要改的代码，根据例子，把修改应用到需要改的代码上。
* [State of the Art GPT-3 Summarizer For Any Size Document or Format | Width.ai](https://link.zhihu.com/?target=https%3A//www.width.ai/post/gpt3-summarizer)
* [How to Summarize a Large Text with GPT-3 (allabtai.com)](https://link.zhihu.com/?target=https%3A//www.allabtai.com/how-to-summarize-a-large-text-with-gpt-3/)
* 从文本到图片：ChatGPT + Middle Journey [https://twitter.com/nickfloats/status/1635116672054079488](https://link.zhihu.com/?target=https%3A//twitter.com/nickfloats/status/1635116672054079488)
* 从图片到文本：VQA + ChatGPT [https://arxiv.org/pdf/2303.01903.pdf](https://link.zhihu.com/?target=https%3A//arxiv.org/pdf/2303.01903.pdf)

这种程度的拆解是很难 scale 的。比如说你想让 Bloop 在你的 codebase 上理解好已有的函数库，写一个新的 UI 来调用这些函数。这是做不到的。

## 接入工具

关键的难点是用什么样的 Prompt 让 ChatGPT 知道有哪些 tool 可以选择，以及怎么做选择。这方面的 Prompt 范例有

* [visual-chatgpt/visual\_chatgpt.py at main · microsoft/visual-chatgpt · GitHub](https://link.zhihu.com/?target=https%3A//github.com/microsoft/visual-chatgpt/blob/main/visual_chatgpt.py)
* [langchain/prompt.py at master · hwchase17/langchain · GitHub](https://link.zhihu.com/?target=https%3A//github.com/hwchase17/langchain/blob/master/langchain/agents/conversational_chat/prompt.py)
* [semantic-kernel/SemanticFunctionConstants.cs at main · microsoft/semantic-kernel · GitHub](https://link.zhihu.com/?target=https%3A//github.com/microsoft/semantic-kernel/blob/main/dotnet/src/SemanticKernel/CoreSkills/SemanticFunctionConstants.cs)
* [Langchain experiment (github.com)](https://link.zhihu.com/?target=https%3A//gist.github.com/geoffreylitt/b345e5a3fcc18368df04b49f6924c217)
* [(1) Riley Goodside 在 Twitter: "From this, we learn: 1) ChatGPT is not a pure language model; prompts are prefixed with external information: “You were made by OpenAI”, plus the date. Followers of mine might find this familiar:" / Twitter](https://link.zhihu.com/?target=https%3A//twitter.com/goodside/status/1598253339732344832)

![](https://pic3.zhimg.com/v2-04a67f204b8975bdee33df8e0104fbda_b.jpg)

这些使用工具的 Prompt 都 “巨长”。但是根据 [通往高级智慧之路：一步到位的 GPT4 分苹果游戏](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/rbs46YdhLOP-YKjhDXLDhw) 在 GPT4 里，Prompt 可以这部分完全去掉，整个长度从 40 行变成十来行。这将极大提高实用性。

能够使用的工具里有两种是最强大的，也是 Prompt 最难写的：

* 主动调取召回记忆的工具：比如要求从 Vector Database 里进行某个自然语言的查询
* 求助于人：就是说这个题，条件不全啊。老师你给补充一个呗

![](https://pica.zhimg.com/v2-e269407063c2596da3db62c3b5f2c740_b.jpg)

当我们手工分解任务的时候，需要把之前的任务的历史信息，发给后续的任务里做为输入。这样就很容易超过 4000 token 的长度限制。如果能把对 memory 的召回，也做为一种可选择的 tool。让 ChatGPT 对于需要召回哪些历史信息给一个自主的选择。这个选择以对 vector database 的搜索表达出来。那么似乎就可以节省大量的无意义的 context 传递。

## 让 ChatGPT 来分解任务

相关资料

* [https://github.com/nat/natbot/blob/main/natbot.py](https://link.zhihu.com/?target=https%3A//github.com/nat/natbot/blob/main/natbot.py)
* [The surprising ease and effectiveness of AI in a loop (Interconnected)](https://link.zhihu.com/?target=https%3A//interconnected.org/home/2023/03/16/singularity)

这个路线最离谱的是 [GPT-4 满分第一名通过大厂模拟面试，微软 154 页研究刷屏：与 AGI 的第一次接触 - 36 氪 (36kr.com)](https://link.zhihu.com/?target=https%3A//36kr.com/p/2186372243046530)  **GPT4 在 TaskRabbit 平台（美国 58 同城）雇了个人类帮它点验证码。**&#x20;

Semantic Kernel 的 prompt （[semantic-kernel/SemanticFunctionConstants.cs at main · microsoft/semantic-kernel · GitHub](https://link.zhihu.com/?target=https%3A//github.com/microsoft/semantic-kernel/blob/main/dotnet/src/SemanticKernel/CoreSkills/SemanticFunctionConstants.cs)） 尤其有意思

* 先是念个咒语，生成一个 plan。plan 的步骤分成了两个类型，一个是机械的 callFunction，就是函数调用
* 一个是所谓的 step，也就是给 chatgpt 的指令。也就是由 chatgpt 执行的 function
* 那么怎么执行这个 plan 呢。是用了一个改写的 prompt，把这个 plan 做为输入，让 chatgpt 作一步改写，也就是消除调一个 step，输出一个新的 plan
* 反复改写 plan，就是执行 plan 了

生成的 plan 长这个样子

![](https://pica.zhimg.com/v2-0933da060f613117909a6f32e3ee0956_b.jpg)

ChatGPT 的 Plugin 也是这样工作的

![](https://pica.zhimg.com/v2-c7fe1973ffc6731e493285f420602fd4_b.jpg)

这里每一个 used wolfram，就是一次 chat，然后组合多次 chat，回复了最初的问题。出处 [ChatGPT Gets Its “Wolfram Superpowers”!](https://link.zhihu.com/?target=https%3A//writings.stephenwolfram.com/2023/03/chatgpt-gets-its-wolfram-superpowers/)

从 [ChatGPT Plugins: Build Your Own in Python! - YouTube](https://link.zhihu.com/?target=https%3A//www.youtube.com/watch%3Fapp%3Ddesktop%26v%3DhpePPqKxNq8) 这个视频里可以看到。ai-plugin.json 中的 description\_for\_model 字段就是给 ChatGPT 的 prompt。

![](https://pic4.zhimg.com/v2-8ec695b57da0a30cf502bcc53f6c3c3f_b.jpg)

Plugin 的 prompt 可以非常长。比如 Wolfram 这个就堪比 “入职培训” 了

![](https://pic2.zhimg.com/v2-e3f799397135e24278a130f5dd7dd161_b.jpg)

人类在这个过程扮演的角色是 solution space 的砍枝。你给的 solution 和任务之间不能距离过远，也不能给过多的 solution。而 ChatGPT 扮演的角色就是在你砍枝过的一个相对简单的 solution space 中搜索出答案。这个比我们手工精确构造 problem solving 的每个 step 还是要轻松太多了。

Eric Evan 有句名言对我影响很深 “*not all *of a large system will be*well *designed”（[Eric Evans - Why do efforts to replace legacy systems fail? (gojko.net)](https://link.zhihu.com/?target=https%3A//gojko.net/2009/06/19/eric-evans-why-do-efforts-to-replace-legacy-systems-fail/)）。软件工程领域对于如何利用好印度的外包，利用好刚毕业的大学生是有很长时间的研究的，把他们限制在一个 bounded context 中工作。这和把 ChatGPT 限制在一个目标和一堆 plugin 中搜索，没啥本质区别了。很多之前软件开发中需要依靠大量人力来做的重复性工作（[未来 5 年以内 AI 会多大程度影响程序员？- 知乎 (zhihu.com)](https://www.zhihu.com/question/576636648/answer/2903913779)） 终于可以有希望被自动化了。

## 中期记忆

有理由相信，长期记忆和 working memory 是同一个东西

* RNN [https://johanwind.github.io/2023/03/23/rwkv\_overview.html](https://link.zhihu.com/?target=https%3A//johanwind.github.io/2023/03/23/rwkv_overview.html)
* RNN [How the RWKV language model works | The Good Minima (johanwind.github.io)](https://link.zhihu.com/?target=https%3A//johanwind.github.io/2023/03/23/rwkv_details.html)
* [RNN 最简单有效的形式是什么？ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/616357772)
* Lora 烧录长期记忆 [Cheng Li：【开源 GPT】骆驼语言团队进一步开源 “驼铃”，单张显卡 1 小时训练属于你自己的中文语言模型](https://zhuanlan.zhihu.com/p/616784584)

> 所以经过几天的努力，我们尝试把 82 条我们开发者相关的信息，finetune 到了这个模型当中。其实只需要 T4 highRAM 的 colab 机器，大约半个小时的训练时间（3 个 epoch）。从视频中可以看到模型成功记忆了我们希望他记忆的信息（也就是开发者信息，或者我简称让模型叫我爸爸）

长期记忆就是网络本身，而 RNN 在每个时间步骤上传递的 hidden state 就是对长期记忆的召回，也就是 working memory。

那么上面这些所有的努力。就是在构造一个 “中期记忆”，扩展 4000 个 token 的限制，让 ChatGPT 能帮我们完成更复杂的任务。

————————

关于这个主题有一篇更详细的学术 survey [https://arxiv.org/pdf/2302.07842.pdf](https://link.zhihu.com/?target=https%3A//arxiv.org/pdf/2302.07842.pdf)

Augmented Language Models: a Survey
