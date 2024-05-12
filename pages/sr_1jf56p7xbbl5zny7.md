---
title: "密码学基础体系"
date: 2022-02-14T22:31:16+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/467282919?utm_source=tuicool&utm_medium=referral)

密码学本质上是研究加密通信的技术学科，该技术让信息发出者跟指定的信息接受者之间形成可信信道，从而进行第三方不可见的信息传输。从定义上看，密码学跟 “加密” 就有着紧密的联系，当然，其内涵明显大于后者。

随着 欧洲通用数据保护条例 (General Data Protection Regulation, GDPR) 和效仿它的《中华人民共和国个人信息保护法》的提出和施行，个人信息保护成为一个越来越重要而且现实的问题。一方面，处理大量用户数据的企业有着合法合规的需要，另一方面，在日渐严格的信息保护规则下，如何发掘这些被加密之后的数据的价值，成为新的迫切应用需求。而密码学 以及强依赖于它的隐私计算技术，自然地成为了一种现实的解决方案。

密码学在计算中的应用，不可避免地会增加通信成本和数据计算成本，相比于明文式的用户数据直接计算，隐私计算目前的计算成本经常要高出数个数量级。这种成本本质上是信任成本，可以划归为经济活动 “信息租金” 的范畴。

## 对称密码体制

### 古典密码学

密码学的最初发展的阶段为古典密码学。在最早的战争时期，同一阵营需要相互传递消息（不管是快马、飞鸽还是电报），为避免重要的情报被敌方获取，他们会将原本想要传递的消息（被称为**明文**）利用**加密密钥**进行加密（**密文**），从而进行传递。对方收到密文后，会用在战前商量好的**解密密钥**进行解密，恢复成为明文。

作为古典密码学的最简单形式之一，移位密码非常好理解，举例而言：

- Alice 想要给 Bob 发送消息 “SEEYOUATSCHOOL”，但他们不想让其他人知道消息的内容，那么他们商量好密钥 k = 5，将消息中的每个字母按照字典序加五后（模 26）的字母表示。即

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/6c37b2a9.jpe)

- 因此，S(18) 变为 X(23), E(4) 变为 J(9)...，加密后的密文为 “XJJDTZFYXHMTTQ”
- Bob 收到密文后，将消息中的每个字母按照字典序减五后（模 26）的字母表示，则恢复成为了明文，明白 Alice 约定与他在学校见面。

古典密码还包括了代换密码、放射密码、希尔密码等等，这里就不一一介绍。

### 分组密码体制

连续的明文用相同的密钥来加密，这样的密码体制为分组密码。详细描述而言，可以认为是将被编码后的明文序列，划分为长度相等的若干组。对于每组使用相同的密钥加密成为等长的密文序列，再按顺序拼接成为完整密文。（上述古典密码学中的密码体制中的移位密码，其实就属于每组序列长度为 1 的分组密码。）

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/81fb41ee.jpe)

商密中的分组密码标准 [[1]](#ref_1) 为 SM4，国际分组密码标准包括 AES[[2]](#ref_2)、3DES[[3]](#ref_3)、IDEA[[4]](#ref_4).

### 流密码

流密码在加密过程中不会一直使用相同的密钥，而是由密钥种子生成一个**密钥流**，然后利用加密算法会逐字节的使用密钥流来加密明文流，从而产生密文流。这里的密钥流可以通过硬件（线性反馈移位寄存器）的方式实现。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/714939af.jpe)

### 哈希函数

密码学上的哈希函数可为数据完整性提供保障。哈希函数通常用来构造数据的短 “指纹”：一旦数据改变，指纹就不再正确。通常指纹也被称为 “消息摘要”。

哈希函数具有的重要特性为单向性，即消息 A，哈希之后变为消息摘要 B，但是由 B 却很难推出 A。

所以安全的哈希函数需要抗击以下三种攻击：

- 抗原像攻击：B 推不出 A
- 抗第二原像攻击：无法找到 A'，使得 A'推出 B
- 抗碰撞攻击：多次尝试，无法碰撞出 B 的消息 A。（md5[[5]](#ref_5) 已经被碰撞攻击攻破，目前不再使用）

### 对称密码体制的缺陷

对称密码体制的加密密钥 e 和解密密钥 d 或者相同，或者解密密钥还可以从加密密钥容易的导出。所以它需要消息传递的两方（比如 Alice 和 Bob）在首次传输密文之前，使用一个**安全信道**来**协商密钥**。实际上在过去这是很难达到的。

## 非对称密码 - 公钥密码体制

非对称密码体制，又称为公钥密码体制，显然其与对称密码体制最根本的区别在于加密密钥和解密密钥是非 “对称” 的：即由加密密钥 e 推出解密密钥 d 是计算上不可行的。

因此，非对称密码体制和对称密码体制在用法上就会有所区别：

- 对称密码体制可以用于两方相互沟通，Alice 可以传递消息给 Bob，Bob 也可以使用用同一套密码传递消息给 Alice；
- 但非对称密码体制却可以这样使用，Alice 把自己的**加密密钥（公钥）e** 公布给允许向她传递消息的 Bob、Cathy、David...，而只有 Alice 自己才拥有**解密密钥（私钥）d**，这样 Bob、Cathy、David 都可以用 e 加密消息传递给 Alice，而只有她自己才可以进行解密。

公钥，即可以公布出的钥匙，所以非对称密码体制通常被称为公钥密码体制。因此公钥密码体制并不需要一个预先共享 / 协商密钥的安全信道。

构建公钥密码体制的核心在于陷门单向函数。

单向函数：一个函数容易计算却难于求逆

陷门单向函数：一个单向函数，在具有特定陷门的知识（私钥）后容易求出其逆

### 公钥密码算法

现实中，多用公钥密码算法去加密一个对称密码算法的密钥，然后使用对称密码算法来加密一个大的数据（大文件 or 视频）。原因是公钥密码算法的速度比对称密码算法会慢几个数量级。

所以公钥密码体制通常用来做两件事情，1. **加密**对称密码的密钥；2. 数字**签名**。

商密公钥加密标准：SM2 信封加密。国际公钥加密标准包括 RSA[[6]](#ref_6)、ECIES[[7]](#ref_7)、E1Gamal[[8]](#ref_8) 等

### 数字签名

顾名思义，签名是为了证明消息公布者的身份。所以签名与加密的公私钥相反，加密密钥是私钥，而解密密钥才是公钥。

签名：签名者用私钥作用在明文上，生成签名。将（消息、签名）发布后，所有的验证者可以用公钥进行验证。

验证：验证者用公钥 + 签名计算出一个值，若这个值与提前公布好的值相等，则验证成功。

数字签名可以保证签名和消息的完整性，同时也可以满足抗抵赖性的要求。

商密数字签名标准：SM2 数字签名算法。国际数字签名标准包括 RSA、ECDSA、DSA 等

## 常用公钥密码体制

### RSA 密码体制

RSA 是人类发现的第一个公钥密码算法，由 Ron Rivest、Adi Shamir、Leonard Adleman 三人提出，RSA 就是他们的姓氏首字母拼接得到的。

RSA 的数学基础是**大数因子分解困难**。具体算法描述如下：

1. Alice 任意选取两个不同的大素数 p、q，计算二者乘积 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/351a2399,v) ，则 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/8cf39b36,v)
2. 选择大整数 e，且 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/f2521fcf,v) ，作为加密密钥（公钥）
3. 使用扩展欧几里得求出 e 对于 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/b6f5dbeb,v) 的模拟元 d，即满足 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/59b4a553,v) . d 就是解密密钥（私钥）。
4. Alice 公开整数 n 和 e，秘密保存 d。
5. **Bob 加密**： 对于明文 m，使用公钥 e 进行加密 - ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/6638f507,v) ， 形成密文 c. 将 c 发送给 Alice。
6. **Alice 解密**：对于密文 c，使用私钥 d 进行解密 - ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/01867c70,v) ，计算出 Bob 的明文 m. 消息传递成功

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/255e84b6,v) . 这里的 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/e70567a3,v) ，是由数论中的拉格朗日定理推理得到的。

- 这里解释**大数因子分解困难**为什么是 RSA 的数学基础：在 4 中，Alice 公布了整数 n 和 e，如果对 n 可以轻易的计算出因子分解后的 p 和 q，那么就可以直接计算出 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/b6f5dbeb,v) ，那么任何人在知道 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/b6f5dbeb,v) 的情况下都可以计算出私钥 d，那么他就可以对所有的密文进行解密，这套密码也就被完全攻破了。
- 为何大数因子分解是困难的呢？对于一个大数 n，想要对它最分解只有暴力搜索所有可能的解这一种方式，对于一个足够大的数，解它的时间复杂度是 O(n)。当然，我们的 “**足够大”** 是相对于计算资源而言的，对于普通 cpu 和量子计算机的 “足够大” 的 n 肯定不是同一量级。

### RSA 的签名算法

1. 消息签名者 Alice 任意选取两个不同的大素数 p、q，计算二者乘积 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/84bbb0ad,v) ，则 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/b6f5dbeb,v+%3D+%28p-1%29%28q-1%29)
2. 选择大整数 e，且 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/f2521fcf,v) ，作为加密密钥（私钥）
3. 使用扩展欧几里得求出 e 对于 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/b6f5dbeb,v) 的模拟元 d，即满足 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/8b84863f,v) . d 就是解密密钥（公钥）。
4. Alice 公开整数 n 和 d，秘密保存 e。
5. Alice 签名：对于消息 x， ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/9c1a58eb,v) ，公布（x，y）
6. Bob 验证：若计算 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/f1f2d856,v) 得到的结果与 x 相等，则验证成功，证明消息是 Alice 发布的，否则验证失败。

第一种量子计算算法秀尔算法，把分解整数质因素的指数时间复杂度 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/cc8cea9e,v)

缩减到多项式时间 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/91dc2a56,v) [[9]](#ref_9)，这意味着，依赖大数因数分解困难性的 RSA 加密算法，在量子计算下变得不再安全了 [[10]](#ref_10).

### E1Gamal 密码体制

E1Gamal 密码体制是基于**求解离散对数困难**的问题，这里介绍最基础的 E1Gamal 密码体制，基于椭圆曲线的 E1Gamal 密码体制（ECC）这里就不展开描述了。具体算法如下：

1. Alice 取一个大素数 p, ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/ec52ce4f,v) 是 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/01be9de2,v) 的一个本原元。 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/bf1f4e33,v) 的阶为 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/1970baec,v) ，即 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/bf1f4e33,v%5E%7Bp-1%7D%5Cequiv+1%28modp%29) .
2. ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/89fb4cad,v)
3. Alice 公布 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/10a5facb,v) ，a 为私钥
4. Bob 加密：秘密选取随机数 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/2085c717,v) ， 对明文 m 加密后的结果为 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/88885f3e,v) , 将 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/8ac0e24f,v) 发送给 Alice. 其中 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/0a668264,v)
5. Alice 解密： ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/3e29c40b,v) . 其中 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/3aa2d4ad,v)

这里解释**求解离散对数困难**为什么是 E1Gamal 的数学基础：由于 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/10a5facb,v) 都已经被公布出来，如果求解离散对数并不困难，那么私钥 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/aabd6507,v) 便可被任何人求出。显然，这样的密码体制是不安全的。

- 为何**求解离散对数困难**是困难的呢？求解对数是计算 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/e1159c56,v) ，这本身并不困难（可用泰勒展开），但要在模 p 的正整数中寻找 ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_1jf56p7xbbl5zny7/e1159c56,v) 结果，是非常困难的。

## 参考

1. [^](#ref_1_0) 谢宗晓, 董坤祥, 甄杰. 国产商用密码算法及其相关标准介绍 [J]. 中国质量与标准导报, 2021(4):3.
2. [^](#ref_2_0)Daemen, J., & Rijmen, V. (1999). AES proposal: Rijndael.
3. [^](#ref_3_0)[https://www.cryptosys.net/3des.html](https://www.cryptosys.net/3des.html)
4. [^](#ref_4_0)Lai, X., & Massey, J. L. (1990, May). A proposal for a new block encryption standard. In Workshop on the Theory and Application of of Cryptographic Techniques (pp. 389-404). Springer, Berlin, Heidelberg.
5. [^](#ref_5_0)Rivest, R., & Dusse, S. (1992). The MD5 message-digest algorithm.
6. [^](#ref_6_0)Rivest, R. L., Shamir, A., & Adleman, L. (1978). A method for obtaining digital signatures and public-key cryptosystems. Communications of the ACM, 21(2), 120-126.
7. [^](#ref_7_0)Gayoso Martínez, V., Hernández Encinas, L., & Sánchez Ávila, C. (2010). A survey of the elliptic curve integrated encryption scheme.
8. [^](#ref_8_0)ElGamal, T. (1985). A public key cryptosystem and a signature scheme based on discrete logarithms. IEEE transactions on information theory, 31(4), 469-472.
9. [^](#ref_9_0)Shor, P. W. (1999). Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer. SIAM review, 41(2), 303-332.
10. [^](#ref_10_0)Cocks, C. C. (1973). A note on non-secret encryption. CESG Memo.
