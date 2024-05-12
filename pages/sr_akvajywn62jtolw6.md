---
title: "Google 账户两步验证的工作原理"
date: 2022-11-18T10:01:05+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [blog.seetee.me](https://blog.seetee.me/post/2011/google-two-step-verification/)

我们往往会在不同的网站上使用相同的密码，这样一旦一个网站账户的密码泄露，就会危及到其他使用相同密码的账户的安全，这也是最近的密码泄露事件造成如此大影响的原因。为了解决这个问题，一些网站在登录时要求除了输入账户密码之外，还需要输入另一个一次性密码。银行常用的动态口令卡就是这种一次性密码的例子，在线支付网站的一次性短信密码则是另一种实现。

Google 现在也推荐用户启用[两步验证](https://www.google.com/support/accounts/bin/static.py?hl=en&page=guide.cs&guide=1056283&topic=1056284)（Two-step verification）功能（Youtube 上的[视频介绍](https://www.youtube.com/watch?v=zMabEyrtPRg)），并且除了以短信或者电话的方式发送一次性密码之外，还提供了另一种基于时间的一次性密码（Time-based One-time Password，简称 TOTP），只需要在手机上安装密码生成应用程序，就可以生成一个随着时间变化的一次性密码，用于帐户验证，而且这个应用程序不需要连接网络即可工作。仔细看了看这个方案的实现原理，发现挺有意思的。下面简单介绍一下。

Google 的两步验证算法源自另一种名为 HMAC-Based One-Time Password 的算法，简称 HOTP。HOTP 的工作原理如下：

客户端和服务器事先协商好一个密钥 K，用于一次性密码的生成过程，此密钥不被任何第三方所知道。此外，客户端和服务器各有一个计数器 C，并且事先将计数值同步。

进行验证时，客户端对密钥和计数器的组合 (K,C) 使用 [HMAC](https://en.wikipedia.org/wiki/HMAC)（Hash-based Message Authentication Code）算法计算一次性密码，公式如下：

```
HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))
```

上面采用了 HMAC-SHA-1，当然也可以使用 HMAC-MD5 等。HMAC 算法得出的值位数比较多，不方便用户输入，因此需要截断（Truncate）成为一组不太长十进制数（例如 6 位）。计算完成之后客户端计数器 C 计数值加 1。用户将这一组十进制数输入并且提交之后，服务器端同样的计算，并且与用户提交的数值比较，如果相同，则验证通过，服务器端将计数值 C 增加 1。如果不相同，则验证失败。

这里的一个比较有趣的问题是，如果验证失败或者客户端不小心多进行了一次生成密码操作，那么服务器和客户端之间的计数器 C 将不再同步，因此需要有一个重新同步（Resynchronization）的机制。这里不作具体介绍，详情可以参看 RFC 4226。

介绍完了 HOTP，Time-based One-time Password（TOTP）也就容易理解了。TOTP 将 HOTP 中的计数器 C 用当前时间 T 来替代，于是就得到了随着时间变化的一次性密码。非常有趣吧！

虽然原理很简单，但是用时间来替代计数器会有一些特殊的问题，这些问题也很有意思，我们选取几个进行一下探讨。

首先，时间 T 的值怎么选取？因为时间每时每刻都在变化，如果选择一个变化太快的 T（例如从某一时间点开始的秒数），那么用户来不及输入密码。如果选择一个变化太慢的 T（例如从某一时间点开始的小时数），那么第三方攻击者就有充足的时间去尝试所有可能的一次性密码（试想 6 位数字的一次性密码仅仅有 10^6 种组合），降低了密码的安全性。除此之外，变化太慢的 T 还会导致另一个问题。如果用户需要在短时间内两次登录账户，由于密码是一次性的不可重用，用户必须等到下一个一次性密码被生成时才能登录，这意味着最多需要等待 59 分 59 秒！这显然不可接受。综合以上考虑，Google 选择了 30 秒作为时间片，T 的数值为从 Unix epoch（1970 年 1 月 1 日 00:00:00）来经历的 30 秒的个数。

第二个问题是，由于网络延时，用户输入延迟等因素，可能当服务器端接收到一次性密码时，T 的数值已经改变，这样就会导致服务器计算的一次性密码值与用户输入的不同，验证失败。解决这个问题个一个方法是，服务器计算当前时间片以及前面的 n 个时间片内的一次性密码值，只要其中有一个与用户输入的密码相同，则验证通过。当然，n 不能太大，否则会降低安全性。

事实上，这个方法还有一个另外的功能。我们知道如果客户端和服务器的时钟有偏差，会造成与上面类似的问题，也就是客户端生成的密码和服务端生成的密码不一致。但是，如果服务器通过计算前 n 个时间片的密码并且成功验证之后，服务器就知道了客户端的时钟偏差。因此，下一次验证时，服务器就可以直接将偏差考虑在内进行计算，而不需要进行 n 次计算。

以上就是 Google 两步验证的工作原理，推荐大家使用，这确实是保护帐户安全的利器。

### 参考资料

1. TOTP: Time-based One-time Password Algorithm, RFC Draft, [http://tools.ietf.org/id/draft-mraihi-totp-timebased-06.html](https://tools.ietf.org/id/draft-mraihi-totp-timebased-06.html)
2. HOTP: An HMAC-Based One-Time Password Algorithm, RFC 4226, [http://tools.ietf.org/html/rfc4226](https://tools.ietf.org/html/rfc4226)
3. Google Authenticator project, [http://code.google.com/p/google-authenticator/](https://code.google.com/p/google-authenticator/)

---

> [原文地址](https://zhuanlan.zhihu.com/p/64312324)

## TOTP 是什么？

TOTP 是 Time-based One-Time Password 的简写，表示基于时间戳算法的一次性密码。 是时间同步，基于客户端的动态口令和动态口令验证服务器的时间比对，一般每 60 秒，或 30 秒产生一个新口令，要求客户端和服务器能够十分精确的保持正确的时钟，客户端和服务端基于时间计算的动态口令才能一致。

## 适用场景

- 服务器登录动态密码验证
- 公司 VPN 登录双因素验证
- 银行转账动态密码
- 网银、网络游戏的实体动态口令牌
- 等基于时间有效性验证的应用场景

## TOTP 的基本原理

### TOTP 计算公式

```text
TOTP(K, TC) = Truncate(HMAC-SHA-1(K, TC))
```

K，密钥串 HMAC-SHA-1， 表示使用 SHA-1 做 HMAC（当然也可以使用 SHA-256 等） C，基于时间戳计算得出，通过定义纪元（T0）的开始并以时间间隔（TI）为单位计数，将当前时间戳变为整数时间计数器（TC） Truncate，是一个函数，用于截取加密后的字符串

### TC 的计算公式

```text
TC = (T - T0) / T1;
```

T，当前的时间戳 T0，起始时间，一般为 0 T1，时间间隔，根据业务需要自定义

### Truncate 函数

1. 取加密后的最后一个字节的的低 4 位，offset；
2. 以 offset 开始取 4 个字节，按照大端方式组成整数，binary；
3. 根据需要的长度对 binary 取模，opt
4. 以字符串方式返回 opt，并补足长度

```python
h = hmac.new(self.key.encode(), msg, sha256).digest()
offset = h[len(h)-1] & 0xf
binary = (h[offset] & 0x7f) << 24
binary = binary | ((h[offset+1] & 0xff)<<16)
binary = binary | ((h[offset+2] & 0xff)<<8)
binary = binary | (h[offset+3] & 0xff)
otp = binary % (10 ** self.codeDigits)
return str(otp).rjust(self.codeDigits, '0')
```

## Python 实现

```python
import binascii
import hmac
import time
from hashlib import sha256

class TOTP:

    def __init__(self, key, codeDigits):
        self.key = key
        self.codeDigits = codeDigits

    def truncate(self, time):
        time = time.rjust(16,'0')
        bigint = binascii.unhexlify(hex(int('10'+time, 16))[2:])
        msg = bigint[1:len(bigint)]
        h = hmac.new(self.key, msg, sha256).digest()
        offset = h[len(h)-1] & 0xf
        binary = (h[offset] & 0x7f) << 24
        binary = binary | ((h[offset+1] & 0xff)<<16)
        binary = binary | ((h[offset+2] & 0xff)<<8)
        binary = binary | (h[offset+3] & 0xff)
        otp = binary % (10 ** self.codeDigits)
        return str(otp).rjust(self.codeDigits, '0')

    def tc(self, ttl):
        return format(int(int(time.time())/int(ttl)),'x').upper()
```

上面的代码就是我基于 python3 的实现（可以保存为 totp.py），散列算法使用的是 SHA-256，使用方式如下：

```python
import totp
import base64

secretKey = base64.b32encode(b'My secret key')
t = totp.TOTP(secretKey, 4)
time = t.tc(60)    # 此处时间单位为秒
result=t.truncate(time)
print(result)
```

源码可以从这里获取： [github](https://github.com/pandong2015/learning/tree/master/totp)
