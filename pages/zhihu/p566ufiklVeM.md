---
title: Unix / 类 Unix shell 中有哪些很酷很冷门很少用很有用的命令？
date: 2024-10-04T15:31:10.476Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/20140085/answer/14107336
---
感谢邀请。这个问题 quora 上有人提过

[What are some lesser known but useful Unix commands?](https://link.zhihu.com/?target=http%3A//www.quora.com/What-are-some-lesser-known-but-useful-Unix-commands)

，已经有不少答案了，我个人已经从这些答案中学到不少，这里我只是照搬过来，然后加上自己的解释。

1. **[lsof](https://zhida.zhihu.com/search?content_id=763251\&content_type=Answer\&match_order=1\&q=lsof\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjUsInEiOiJsc29mIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6NzYzMjUxLCJjb250ZW50X3R5cGUiOiJBbnN3ZXIiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.hK8PPYnHKB5WgVFCbq4plNZ3X18qbO7UjUrpo0hqILU\&zhida_source=entity): **列出所有打开的文件。举例：'lsof -p 456,123' 列出进程 456 和 123 所有打开的文件。'lsof -i 6' 列出所有 IPv6 协议的网络文件。
2. **nl:** 将输出的每一行加上行号。例如：'cat 1.txt | nl'，输出 1.txt 的文件并加上行号
3. **CTRL+a** 和 **CTRL+e**: 到命令行首 (ctrl+a) 和行末 (ctrl+e)，在小键盘上特别有用，不用费心思找 HOME 和 END 键
4. **ALT+.:**列出上一个命令的最后一个参数。这个命令我最常用。例如 'mkdir mydir'，然后 'cd ALT+.'。很好用
5. **CTRL+R**: 这个也很常用，搜索命令历史相当方便。
6. **grep/sed/cut/tr/**: 这几个命令的组合能够很方便的解析很多文件，就不一一举例了。个人不常用[awk](https://zhida.zhihu.com/search?content_id=763251\&content_type=Answer\&match_order=1\&q=awk\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjUsInEiOiJhd2siLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo3NjMyNTEsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.wD4ao3uxq_o3-0vu0qmNlQvFp14GeQ5NzhEeEfdKhjA\&zhida_source=entity)，觉得'sed' 就够用了。
7. **find/xargs**: 这个我也很常用，在一堆文件中查找某个特定字符串。这个常常和**6**中列出命令组合使用。
8. **ls -d \*/: **这个命令仅列出当前目录下所有的一级子目录，不包括 '.' 开头的隐藏目录，如果想列出隐藏目录，使用 'ls -d .\*'。'find -type d -maxdepth 1' 也有类似的效果。
9. **id**: 列出本用户所属的所有用户组。
10. **Brace Expansion**：已经有人说过了，我补充完整一点。"ls /usr/{,local}/bin"，列出 "/usr/bin" 和 "/usr/local/bin" 下所有文件。这个机制称为 "Brace Expansion"，再举个例子："diff .bashrc {,.backup}"，显示.bashrc 和.bashrc.backup 两个文件之间的差异。
11. **column:** 也有人提过，放在这里算总结吧，一个常用的语法是 'mount | column -t'，或者 'df | column -t'，让输出更加容易阅读。
12. **ssh/sshfs/scp: **善用 ssh 相关工具让你的远程工作起来更加方便。**'ssh -X'**打开 X-forward 功能。'ssh-keygen' 和'ssh-copy-id' 让你省去每次输入密码的麻烦。**ssh root\@10.1.1.1 “远程命令 "**让你的命令远程执行。**'sshfs root\@10.1.1.1:/var/ /home/root/var'** 将远程目录直接 mount 到本地目录。**"scp root\@10.1.1.1:.vimrc ."**将远程服务器中 root 用户 HOME 目录下的.vimrc 文件拷贝到本地。
13. &#x20;**使用 '<' 号读取文件到标准输入：** 对于所有接受标准输入的命令，使用 '< 文件名 ' 可以将某个文件送入标准输入，并且可以出现在命令的任何位置，例如:

```bash
        "cat filename"
        "<filename cat"
        "cat <filename"
```

\


上面三个命令的效果是一模一样的。

\


\---- 更新 -----

这里补充说明一下，上面的几个技巧中所有命令行编辑的快捷键 (CTRL+r CTR+a, CTRL+e) 是由 GNU readline 库定义的，'man readline' 可以得到更详细的说明以及更多的快捷键定义。但是由于和你使用的 TERMINAL 类型可能发生各种冲突，所以不是所有的快捷键都能够很好的工作。

\----- 更新 2---

类似问题的链接

[有哪些不常见但很有用处的 Unix 命令？](http://www.zhihu.com/question/19585354)\


\----- 更新 3----

[Top Ten One-Liners from CommandLineFu Explained](https://link.zhihu.com/?target=http%3A//www.catonmat.net/blog/top-ten-one-liners-from-commandlinefu-explained/)

上面这篇文章总结了不少有用的命令。这个链接是四篇文章组成的一个系列，值得一看。

另外，readline 的模式问题，BASH 缺省的是 emac 模式 (set -o emacs)，通过'set -o vi' 可以切换到 vi 模式，同一个网站上也有两篇很好的文章介绍操作技巧，值得一看。

**BASH VI 模式**

[Working Productively in Bash's Vi Command Line Editing Mode (with Cheat Sheet)](https://link.zhihu.com/?target=http%3A//www.catonmat.net/blog/bash-vi-editing-mode-cheat-sheet/)

**BASH EMAC 模式**

[Bash Emacs Editing Mode Cheat Sheet](https://link.zhihu.com/?target=http%3A//www.catonmat.net/blog/bash-emacs-editing-mode-cheat-sheet/)\


\--- 更新 4----

碰巧看见

[All commands](https://link.zhihu.com/?target=http%3A//commandlinefu.com)

上有一个使用**lsof**的实用技巧（

[Keep a copy of the raw Youtube FLV,MP4,etc stored in /tmp/](https://link.zhihu.com/?target=http%3A//www.commandlinefu.com/commands/view/10305/keep-a-copy-of-the-raw-youtube-flvmp4etc-stored-in-tmp)

），借这个地方记录一下：

现在浏览器的 flash 插件在播放在线视频的时候，常常将下载的视频放在 /tmp 目录下，然后执行 unlink 删除文件，但实际上文件并没有删除，这些被 unlink 的文件其实可以通过 /proc 找到。通过 lsof 找出插件的进程号，然后在 /proc/ 插件进程号 /fd/ 下找到当前打开文件的链接，然后就可以直接拷贝出来，在我的 ArchLinux 下 firefox 是这样的:

首先保证 firefox 正在播放 flash 视频，例如打开 youku，随便播放一个视频，按暂停，执行下面的步骤：

1. lsof -n -P | grep FlashXX：输出当前 flash 插件打开的所有文件，例如:"plugin-co **30427** 30428 dsun 15u REG 0,17 8790980 163285 **/tmp/FlashXXRxAIDF (deleted)**"
2. **30427**即 flash 插件进程号，执行‘ls -l /proc/30427/fd/ | grep /tmp/FlashXXRxAIDF'，输出 "lrwx------ 1 dsun dsun 64 Mar 27 13:31 **15****-> /tmp/FlashXXRxAIDF (deleted)**"
3. 拷贝文件：'cp /proc/30427/fd/15 **15.flv**'。

不过，根据上面 commandlinfu 中的另一个说法，可以直接这样做：

```text
for h in `find /proc/*/fd -ilname "/tmp/Flash*" 2>/dev/null`; do cp $h `basename $h`.flv; done
```

\


\--- 更新 5----

又看到一个我之前不知道的用法，用 backslash 执行命令，可以取消[alias](https://zhida.zhihu.com/search?content_id=763251\&content_type=Answer\&match_order=1\&q=alias\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjUsInEiOiJhbGlhcyIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjc2MzI1MSwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.pCq4Vi_pZUGaloKrtrhVirZh2YU9fNqzDavGrdy1Dms\&zhida_source=entity)的效果.

[http://tldp.org/LDP/GNU-Linux-Tools-Summary/html/general-shell-tips.html](https://link.zhihu.com/?target=http%3A//tldp.org/LDP/GNU-Linux-Tools-Summary/html/general-shell-tips.html)\


```text
\ (backslash)
The backslash escape character can be used before a shell command to override any aliases.
For example if rm was made into an alias for rm -i then typing “rm” would actually run rm -i.
However, typing \rm lets the shell ignore the alias and just run rm (its runs exactly what you type), this way it won't confirm if you want to delete things.
```
