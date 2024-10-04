---
title: 程序员必须掌握哪些算法？
date: 2024-10-04T15:30:36.579Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/23148377/answer/1720536467
---
&#x20;**刷了小 400 道 Leetcode，总结了如下知识点（文末可下载笔记）：**&#x20;

![](https://picx.zhimg.com/50/v2-363af759be179e952c28f9bf143a470f_720w.jpg?source=2c26e567)

上述都是[程序员面试](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E7%A8%8B%E5%BA%8F%E5%91%98%E9%9D%A2%E8%AF%95\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLnqIvluo_lkZjpnaLor5UiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.nZsMpTjwK55Y6mXWlY53oY1R3BSGHhxC-4bA2MSH3Cg\&zhida_source=entity)的高频考点，想要彻底掌握的话，**一定要有体系地去刷**，以[深度优先遍历](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E9%81%8D%E5%8E%86\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLmt7HluqbkvJjlhYjpgY3ljoYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.TnqN9DR1YxC34sbz3SQfcEOnaidwccL3Ynt_mxuebks\&zhida_source=entity)的方法循序渐进的实战，让自己把每个知识点彻底挖透记牢。推荐大家用 Leetcode 官方出品的免费教程 [Leetbook](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/leetbook/)，按照各个知识点循序渐进地罗列了算法题。

推荐的学习顺序：

1. 复杂度分析、数组、栈、队列、链表、哈希表、二叉树、堆、Trie 树、并查集、图
2. [递归](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E9%80%92%E5%BD%92\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLpgJLlvZIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.Z73YDYvRXYiQlQ2O1Bf11y_Ah6zo4gO8vsg-7wSWPvk\&zhida_source=entity)、查找、排序、查、字符串匹配、动态规划

Leetbook 的好处是把算法归类为各个章节，而且大部分章节都是免费的。如上图，在入门的时候就不要刷那种高频面试题了，先把[数据结构](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLmlbDmja7nu5PmnoQiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.KafWgq4IAIksHDdhaYqxNFdizgHlgrV-RJ5j0NGugRw\&zhida_source=entity)和算法的各个基础打好。每个 book 里都是先教学、再由易到难地实战，一个知识点大概有十几道题，刷完基本上就能掌握一些套路，到[medium](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=medium\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiJtZWRpdW0iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.7lrObW2izUliQQrf93TIgZ6Un6jZceUShX_S6QHXw0I\&zhida_source=entity)的水平了。

然后才是去看各种[面经](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E9%9D%A2%E7%BB%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLpnaLnu48iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.ckUEKTjj9L7GVdI_S6EEq3yOoBYuVw2Esp1d0RyKjsA\&zhida_source=entity)和高频题，给自己查漏补缺，并且**要稍微记录一下，几行代码或者解题思路，方便自己快速复习**。

&#x20;**这里再给大家分享一些资料，都是刷题福音：**&#x20;

[](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/DIGyzrc3SKPxGUgvGx8RQw)

下面是我总结的一些必刷算法（字母是难度），部分解法在文末的脑图中，可以直接下载。

### **栈**

* [155. 最小栈 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/min-stack/)
* [85. 最大矩形 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/maximal-rectangle/)

### **链表**

* [206. 反转链表 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/reverse-linked-list/)
* [160. 相交链表 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/intersection-of-two-linked-lists/)
* [876. 链表的中间结点 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/middle-of-the-linked-list/)
* [21. 合并两个有序链表 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/merge-two-sorted-lists/), [23. 合并 K 个升序链表 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/merge-k-sorted-lists/)
* [141. 环形链表 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/linked-list-cycle/), [142. 环形链表 II M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/linked-list-cycle-ii/)
* [19. 删除链表的倒数第 N 个结点 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
* [287. 寻找重复数 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-the-duplicate-number/)
* [146. LRU 缓存机制 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/lru-cache/)

### **并查集**

* [200. 岛屿数量 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/number-of-islands/)
* 字节跳动大闯关

### **树**

**二叉树**

* 二叉树前序 / 中序 /[后序遍历](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%90%8E%E5%BA%8F%E9%81%8D%E5%8E%86\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLlkI7luo_pgY3ljoYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.tWS-XBB4VC9WHVT2vXyULD4dIsell1ieGc7KN-_j3Kg\&zhida_source=entity)
* [112. 路径总和 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/path-sum/), [113. 路径总和 II M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/path-sum-ii/), [437. 路径总和 III M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/path-sum-iii/)
* [236. 二叉树的最近公共祖先 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)
* [958. 二叉树的完全性检验 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/check-completeness-of-a-binary-tree/)
* [124. 二叉树中的最大路径和 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

**[平衡二叉树](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLlubPooaHkuozlj4nmoJEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.gocC3B4LSwVNfs6k8lin4LoLYDQIZi9GErOBJFW9Z2o\&zhida_source=entity)**

* 基本原理和操作
* 为什么有了 BST 和 AVL 还需要红黑树

**完全二叉树**

* 完全二叉树的插入
* [222. 完全二叉树的节点个数 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/count-complete-tree-nodes/)

### **哈希表**

* [剑指 Offer 48. 最长不含重复字符的子字符串 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/)

**前缀和 + 哈希表**

* [560. 和为 K 的子数组 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/subarray-sum-equals-k/)
* [523. 连续的子数组和 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/continuous-subarray-sum/)

### **查找**

**[二分查找](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLkuozliIbmn6Xmib4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.3gHmpuLm6ZCvaL1J0C_ihCGc3YfsgQHPjbj1Dsa_6VE\&zhida_source=entity)**

* [bug-free 写法：左闭右开，先写排除中位数的逻辑](https://www.zhihu.com/question/36132386/answer/97729337)
* [189. 旋转数组 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/rotate-array/), [153. 寻找旋转排序数组中的最小值 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/), [154. 寻找旋转排序数组中的最小值 II H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array-ii/)
* [162. 寻找峰值 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-peak-element/)
* [287. 寻找重复数 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-the-duplicate-number/)
* [4. 寻找两个正序数组的中位数 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/median-of-two-sorted-arrays/)
* [668. 乘法表中第 k 小的数 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/kth-smallest-number-in-multiplication-table/)
* [719. 找出第 k 小的距离对 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-k-th-smallest-pair-distance/)
* [793. 阶乘函数后 K 个零 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/preimage-size-of-factorial-zeroes-function/)

**BFS**

* [抖音红人](https://link.zhihu.com/?target=https%3A//blog.csdn.net/u014253011/article/details/82556976)
* [1293. 网格中的最短路径 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/)
* [854. 相似度为 K 的字符串 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/k-similar-strings/)

**DFS**

* [抖音红人](https://link.zhihu.com/?target=https%3A//blog.csdn.net/anlian523/article/details/82557468)
* [200. 岛屿数量 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/number-of-islands/)
* [面试题 08.12. 八皇后 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/eight-queens-lcci/)
* [46. 全排列 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/permutations/), [47. 全排列 II M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/permutations-ii/)
* [93. 复原 IP 地址 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/restore-ip-addresses/)

**[双指针](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%8F%8C%E6%8C%87%E9%92%88\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLlj4zmjIfpkogiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.KUPHFEgjCgVHd-Zw6gGUUAMpPYGIpyEUaAO6o3ZBGIw\&zhida_source=entity)**

* [1. 两数之和 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/two-sum/)
* [数组中两数相减的最大值](https://link.zhihu.com/?target=https%3A//blog.csdn.net/fkyyly/article/details/83930343)

**[滑动窗口](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E6%BB%91%E5%8A%A8%E7%AA%97%E5%8F%A3\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLmu5Hliqjnqpflj6MiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.FXN2JNiw_1a_j6hkOWn6w8wAv-nhMtbGsnDM092VLyI\&zhida_source=entity)**

* [560. 和为 K 的子数组 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/subarray-sum-equals-k/)
* [713. 乘积小于 K 的子数组 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/subarray-product-less-than-k/)
* [76. 最小覆盖子串 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/minimum-window-substring/)

### **排序**

* 插入：插入排序，[选择排序](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLpgInmi6nmjpLluo8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.pVVlDiFkUKjWNiOdlKcNYcoflGbMJc5VnzWwMCLEtRQ\&zhida_source=entity)
* 选择：选择排序，堆排
* 交换：[冒泡排序](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLlhpLms6HmjpLluo8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.uO_YCZ1y9aaz6ts0rR7NmC_zcUqGl2fxMs8s0OeGR-k\&zhida_source=entity), 快速排序，快排优化
* [归并排序](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLlvZLlubbmjpLluo8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.2WTGAG3k53JOCn-IbIWOG7OMVBMWIvCLFmahEcrWKMI\&zhida_source=entity), 原地归并，[剑指 Offer 51. 数组中的逆序对 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/), [327. 区间和的个数 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/count-of-range-sum/)
* [基数排序](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E5%9F%BA%E6%95%B0%E6%8E%92%E5%BA%8F\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLln7rmlbDmjpLluo8iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.021osB_Ripnnr_6oh361xJTZcCJS6RkNgLOkQ4nf9tE\&zhida_source=entity)
* [148. 排序链表 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/sort-list/)
* [拓扑排序](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/fengziwei/p/7875355.html)

**字典序**

* [31. 下一个排列 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/next-permutation/)
* [386. 字典序排数 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/lexicographical-numbers/)
* [440. 字典序的第 K 小数字 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/k-th-smallest-in-lexicographical-order/)
* [1163. 按字典序排在最后的子串 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/last-substring-in-lexicographical-order/)

**TopK 问题**

* [剑指 Offer 40. 最小的 k 个数 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)
* [347. 前 K 个高频元素 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/top-k-frequent-elements/)
* [373. 查找和最小的 K 对数字 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/find-k-pairs-with-smallest-sums/)
* [402. 移掉 K 位数字 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/remove-k-digits/)

### **[动态规划](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=2\&q=%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLliqjmgIHop4TliJIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoyLCJ6ZF90b2tlbiI6bnVsbH0.OGP1BPszQplAckfQSKMa9h9gMboSTrGE8kAtmgSKzIs\&zhida_source=entity)**

* [72. 编辑距离 H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/edit-distance/)
* [516. 最长回文子序列 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/longest-palindromic-subsequence/), [5. 最长回文子串 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/longest-palindromic-substring/)
* [1143. 最长公共子序列 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/longest-common-subsequence/)
* [300. 最长递增子序列 M](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/longest-increasing-subsequence/)
* [53. 最大子序和 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/maximum-subarray/)
* [背包问题](https://link.zhihu.com/?target=https%3A//blog.csdn.net/stack_queue/article/details/53544109)
* 最短路径：Dijkstra, Floyd, Bellmanford, Johnson
* [121. 买卖股票的最佳时机 E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/), [122. 买卖股票的最佳时机 II E](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/), [123. 买卖股票的最佳时机 III H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/), [188. 买卖股票的最佳时机 IV H](https://link.zhihu.com/?target=https%3A//leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/)

### **[模式匹配](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E6%A8%A1%E5%BC%8F%E5%8C%B9%E9%85%8D\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLmqKHlvI_ljLnphY0iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.qVnPjHO9tjC7g5IrVovLrTbh577DkW7JLYcLyh4rDck\&zhida_source=entity)**

* 单模式单匹配：KMP
* 多模式单匹配：Trie
* 多模式多匹配：AC[自动机](https://zhida.zhihu.com/search?content_id=342905179\&content_type=Answer\&match_order=1\&q=%E8%87%AA%E5%8A%A8%E6%9C%BA\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2MjMsInEiOiLoh6rliqjmnLoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjozNDI5MDUxNzksImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.JG7o-8q_U0RPhpxDJ29Cy52VucRkOsLKgIpSKNYhv1I\&zhida_source=entity)

### **大数据**

* 蓄水池抽样法

\---

当然，**除了勤奋地刷题之外，一定要多学习大佬们的思路，掌握最优的解法**。这里离不开一些开源笔记的帮助：

一位 CMU 硕士整理的 101 道经典题型，按体系归好类了，初学者可以先跟着走一遍（文末下载）：

![](https://picx.zhimg.com/50/v2-6126d77c485169840e4e1b9f6c0b6d72_720w.jpg?source=2c26e567)

还有 LeetCode Cookbook 对 1479 道题都给了思路和解法、复杂度分析（文末下载）：

![](https://pic1.zhimg.com/50/v2-8fbe20d09c2d94e6121fcc7377841a7e_720w.jpg?source=2c26e567)

**上面的资料都帮大家整理好啦，记得帮**

[@李 rumor](//www.zhihu.com/people/b2ba8fde30546be10c97f8a95aa1596e)

**点个赞再去下载呀～**

[](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s/DIGyzrc3SKPxGUgvGx8RQw)

![](https://pic1.zhimg.com/50/v2-461cdee5d08c5ed12848e39a0dc7564c_720w.jpg?source=2c26e567)
