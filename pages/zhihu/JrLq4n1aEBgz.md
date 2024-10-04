---
title: 词典文件压缩
date: 2024-10-04T15:31:10.100Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/26223113
---
有一类在线服务（比如说，关键词过滤）需要使用大量文本 / 二进制数据，这些数据通常离线构建好并且定时更新，在线服务定时更新数据文件。数据文件通常以按行组织，每行有 1-2 列（或者更多）。数据加载后存储到 set/map/hash。

词典文件规模不大的情况，这种方法是很轻量易用的。但随着时间流逝，会逐渐面临一些问题：

1\. 数据文件不断膨胀，以 C++ 为例，string/map/set 本身的开销很大，内存会逐渐不敷使用

2\. 查询需求复杂化，不只是简单的 Get，而逐渐扩展到 MutlitGet/PrefixGet

3\. 文件的管理 / 校验困难

今天要介绍的[scdb](https://link.zhihu.com/?target=https%3A//github.com/robbinfan/cloud-scdb)就是用于解决这些问题的一个简单实现。

## SCDB 简介

scdb 定位于一个 Linux 平台上有较高性能的通用文本数据压缩工具。

1\. scdb 支持 key 的集合或者 kv 集合两种格式，key 部分使用 nest louds trie 进行压缩，value 部分支持 3 种压缩方式：

* 紧凑型压缩：不直接使用 std::string，而是将 raw string 直接存储在连续内存块中
* snappy 压缩：相比紧凑型压缩，存储使用 snappy 压缩后的 raw string
* nlt 压缩：和 key 相同，也使用 nest louds trie 压缩

2\. scdb 构建压缩文件时会自动生成 checksum，并记录用户构建选项到 metadata。这么做的意义在于提供对压缩文件使用者的保护：

* 读取压缩文件之前会首先进行格式校验和 checksum 比对，避免载入非法的文件甚至是不完整的文件导致异常发生
* 用户构建选项内置到压缩文件，可以优化访问速度。比如 scdb 同时支持多种压缩类型，不同类型的 Get 接口在获取 Value 值是实现是不同的，通过内置而不是让使用者告知压缩类型，即可以避免面对用户设置错误的问题，也可以在初始化时读取到压缩类型而进行接口访问速度优化（通过函数指针指向不同 Get () 实现减少 if 分支从而实现访问加速）。

\


3\. scdb 可以通过 mmap 快速加载压缩文件，无需解压即可使用，实际占用内存和压缩文件大小相同，同时支持预热选项，将压缩文件完整加载到内存；高度优化的访问接口，提供和 std::set/std::map 相若的访问速度，以及 STL 不支持的 PrefixGet 接口。

4\. 提供构建工具（set-builder，map-builder），将文本文件转化为 scdb 支持的压缩文件格式，简化使用。用户也可以通过 libscdb 提供的 Writer 接口构建自己的 builder。

## 数据结构

scdb 为了在压缩后仍能提供较高的 QPS，在数据结构选择上下了很大功夫。

无论是 set 还是 map，都要解决 key 的查找。我们需要这样一种数据结构：

* 可以持久化到文件，可以通过 mmap 快速加载到内存无需重建
* 支持 Exist/Get/PrefixGet 等查询

\


显而易见的选择有：

* hash：最常规的选项，内存占用也较好（key 的总大小 / 0.75），访问速度非常好，但无法提供复杂的查询
* bst：类似 hash 的接口，可以遍历，持久化是一个问题，复杂查询也不支持
* trie：trie 可以提供较复杂的查询功能，比如 prefix 查询，但常规的 double array trie，速度也非常快，但内存占用太恐怖（key 的总大小的几倍）

\


以上几种都不是让人满意的选择，最后我选择使用了一种非标准数据结构的 nest louds trie 的开源实现 marisa-trie。

marisa-trie 提供非常高的压缩比，经我测试一个 260MB，比较冗余的文本文件，压缩后可到 60M 左右，压缩比相当惊人；但和标准 double array trie 相比，访问速度也差了一个数量级。

marisa-trie 未必是最优实现方案，但已经是目前开源实现中的最优选择了。

我们使用 marisa-trie 存储所有的 key，每个 key 最后可以得倒一个序号，代表 key 在 trie 中的序号。在查询这个 key 的时候，也可以得到这个序号。

利用这个特性就实现了 key-value 的映射关系的建立。构建 key 成功后，即可以通过建立一个数组来映射 key-> value 偏移量的映射。

这个数组（uint32\_t/uint64\_t) 的大小和 key 集合的大小相同，如果不压缩的话，会占用可观的内存。

scdb 使用了一个 PFORDelta 算法进行压缩，将数组中的超大值视为 exception 单独存储，其余值则按照 maxbit 进行压缩。这里比较有趣的一点是提供对压缩后数组的随机访问而无需批量解压后再使用，因此这可能是目前地球上第一个提供随机访问支持的 PFORDelta 实现。

Value 部分的存储比较简单，按照 key 的大小分成若干段，每一段连续存储 raw string/compressed raw string（对于 nlt 压缩则略有不同，使用了其它的映射技巧）。

scdb 大量使用了 succinct data structure，这是一个非常有意思且快速发展的数据结构类型，有机会我专门讲讲 sds 在 search/nlp 的 yingy

## 性能

scdb 目前尚缺乏完整的 benchmark，但初步测试也得到一些结论：

1\. nlt 压缩的构建速度最慢，压缩比最高

2\. snappy 压缩提供的 Get 速度甚至还高于紧凑型压缩！

3\. PrefixGet 和 Get 性能相若

## 有待完善的...

scdb 目前只能算一个半成品，和我理想中的样子还有一定差距：

1\. 词典文件的统一管理和加载：通过词典文件的 checksum/timestamp 和当前使用中的词典实例比较，实现弹性加载词典文件；使用者不直接管理词典文件，通过 Singleton\<DicticnaryManager> 接口来访问数据，DictionaryManager 动态更新文件并管理 Reader 实例。

2\. 提供更多语言的 Reader 实现，方便应用到 MR/Storm 等场景。
