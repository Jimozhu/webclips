---
title: "Neovim 备忘"
date: 2021-05-05T11:45:33+08:00
draft: false
---
# Neovim 备忘

## 单词导航

```
w        移动到下一个单词的开头
W        移动到下一个词组的开头
e        移动到下一个单词的结尾
E        移动到下一个词组的结尾
b        移动到前一个单词的开头
B        移动到前一个词组的开头
ge        移动到前一个单词的结尾
gE        移动到前一个词组的结尾
```

## 当前行导航

```
0        跳到本行第一个字符
^        跳到本行第一个非空字符
g_  跳到本行最后一个非空字符
$        跳到本行最后一个字符
n|  跳到本行第n列
```

## 句子和段落导航

```
(   跳到前一个句子
)   跳到下一个句子

{   跳转到上一个段落
}   跳转到下一个段落
```

## 窗格导航

```
H   跳转到屏幕的顶部
M   跳转到屏幕的中间
L   跳转到屏幕的底部
nH  跳转到距离顶部n行的位置
nL  跳转到距离底部n行的位置
```

## 插件

[vim-plug](https://github.com/junegunn/vim-plug)

插件管理

```
PlugInstall #Install plugins
PlugUpdate  #Install or update plugins
PlugUpgrade    #Upgrade vim-plug itself
PlugStatus  #Check the status of plugins
```

[vim-easymotion](https://github.com/easymotion/vim-easymotion)

快速跳转

```
<Leader>w            | Beginning of word forward.
<Leader>b            | Beginning of word backward.
```

[vim-easy-align](https://github.com/junegunn/vim-easy-align)

with the following lines of text,

```
apple   =red
grass+=green
sky-=   blue
```

try these commands:

- ```
  vipga=
  ```

  - `v` isual-select `i` nner `p` aragraph
  - Start EasyAlign command (`ga`)
  - Align around `=`
- ```
  gaip=
  ```

  - Start EasyAlign command (`ga`) for `i` nner `p` aragraph
  - Align around `=`

[vim-surround](https://github.com/tpope/vim-surround)

Surround.vim is all about "surroundings": parentheses, brackets, quotes, XML tags, and more. The plugin provides mappings to easily delete, change and add such surroundings in pairs.

- Press `cs"'` inside `"Hello world!"` to change it to `'Hello world!'`
- Press `cs"#` inside `"Hello world!"` to change it to `#Hello world!#`
- Press `ds"` inside `"Hello world!"` to change it to `Hello world!`
- cursor on `"Hello"`, Press `ysiw]` inside `"Hello world!"` to change it to `"[Hello] world!"`
- wrap the entire line in parentheses with `yssb` or `yss)`.

[nerdtree](https://github.com/preservim/nerdtree)

A tree explorer plugin for vim.

`nmap <leader>n :NERDTreeToggle<cr>`

Keyboard Commands:

```
t: Open the selected file in a new tab
i: Open the selected file in a horizontal split window
s: Open the selected file in a vertical split window
I: Toggle hidden files
m: Show the NERD Tree menu
R: Refresh the tree, useful if files change outside of Vim
q: Close the NERDTree window
```

## 参考

- [https://vim.rtorr.com/lang/zh_cn](https://vim.rtorr.com/lang/zh_cn)

  [![gKDcsf.jpg](https://simpleread.oss-cn-guangzhou.aliyuncs.com/nvim_memo/b0a782aa.jpe)](https://imgtu.com/i/gKDcsf)
