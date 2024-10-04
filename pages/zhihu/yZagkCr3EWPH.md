---
title: 各家代理ip的优缺点都是什么？
date: 2024-10-04T15:30:53.701Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/55807309/answer/311248215
---
这几天我把各大商家的代理套餐全都买了一遍，然后按照统一的标准做了一下详细的测评，希望对大家有所帮助。

本文来自我的专栏（一起学爬虫）：

[静觅：爬虫代理哪家强？十大付费代理详细对比评测出炉！347 赞同・43 评论文章![](https://pic4.zhimg.com/v2-b3df7a17fc6605acbb472eb53339e4f9_180x120.jpg)](https://zhuanlan.zhihu.com/p/33576641)

以下为正文：

## 一、前言

随着大数据时代的到来，爬虫已经成了获取数据的必不可少的方式，做过爬虫的想必都深有体会，爬取的时候莫名其妙 IP 就被网站封掉了，毕竟各大网站也不想自己的数据被轻易地爬走。

对于爬虫来说，为了解决封禁 IP 的问题，一个有效的方式就是使用代理，使用代理之后可以让爬虫伪装自己的真实 IP，如果使用大量的随机的代理进行爬取，那么网站就不知道是我们的爬虫一直在爬取了，这样就有效地解决了反爬的问题。

那么问题来了，使用什么代理好呢？这里指的代理一般是 HTTP 代理，主要用于数据爬取。现在打开搜索引擎一搜 HTTP 代理，免费的、付费的太多太多品牌，我们该如何选择呢？看完这一篇文章，想必你心中就有了答案。

对于免费代理，其实想都不用想了，可用率能超过 10% 就已经是谢天谢地了。真正靠谱的代理还是需要花钱买的，那这么多家到底哪家可用率高？哪家响应速度快？哪家比较稳定？哪家性价比比较高？为此，我对市面上比较流行的多家付费代理针对可用率、爬取速度、爬取稳定性、价格、安全性、请求限制等做了详细的评测，让我们来一起看一下到底哪家更强！

由于知乎不支持表格，所以本文表格采用截图的方式插入文章，导致图片并不清晰，推荐阅读原文：

[](https://link.zhihu.com/?target=https%3A//cuiqingcai.com/5094.html)

## 二、测评范围

## 1. 免费代理

在这里我主要测试的是付费代理，免费代理可用率太低，几乎不会超过 10%，但为了作为对比，我选取了[西刺](https://zhida.zhihu.com/search?content_id=86657866\&content_type=Answer\&match_order=1\&q=%E8%A5%BF%E5%88%BA\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLopb_liLoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo4NjY1Nzg2NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.1crQ_Py6j4lnkrzuD2-WI6YKz9DDpNQgMHHyKbF2-qs\&zhida_source=entity)免费代理进行了测试。

## 2. 付费代理

付费代理我选取了站大爷、芝麻 HTTP 代理、太阳 HTTP 代理、讯代理、快代理、蘑菇代理、阿布云代理、全网代理、云代理、大象代理进行了对比评测，购买了他们的各个不同级别的套餐使用同样的网络环境进行了测评，详情如下：

![](https://pic1.zhimg.com/50/v2-fd3fab2767a48b0dfa2f2a2d6bba98de_720w.jpg?source=2c26e567)

注：其中蘑菇代理、太阳 HTTP 代理、芝麻 HTTP 代理的默认版表示此网站只有这一种代理，不同套餐仅是时长区别，代理质量没有差别。

嗯，我把上面的套餐全部买了一遍，以供下面的评测使用。

## 三、测评目标

本次测评主要分析代理的可用率、响应速度、稳定性、价格、安全性、使用频率等因素，下面我们来一一进行说明。

## 1. 可用率

可用率就是提取的这些代理中可以正常使用的比率。假如我们无法使用这个代理请求某个网站或者访问超时，那么就代表这个代理不可用，在这里我的测试样本大小为 500，即提取 500 个代理，看看里面可用的比率多少。

## 2. 响应速度

响应速度可以用耗费时间来衡量，即计算使用这个代理请求网站一直到得到响应所耗费的时间。时间越短，证明代理的响应速度越快，这里同样是 500 个样本，计算时只对正常可用的代理做统计，计算耗费时间的平均值。

## 3. 稳定性

由于爬虫时我们需要使用大量代理，如果一个代理响应速度特别快，很快就能得到响应，而下一次请求使用的代理响应速度特别慢，等了三十秒才得到响应，那势必会影响爬取效率，所以我们需要看下商家提供的这些代理稳定性怎样，总不能这一个特别快，下一个又慢的不行。所以这里我们需要统计一下耗费时间的方差，方差越大，证明稳定性越差。

## 4. 价格

价格，这个当然是需要考虑的内容，如果一个代理不论是响应速度还是稳定性都特别不错，但是价格非常非常高，这也是不可接受的。

## 5. 安全性

这的确也是需要考虑的因素，比如一旦不小心把代理提取的 API 泄露出去了，别人就肆意使用我们的 API 提取代理使用，而一直耗费的是我们的套餐。另外一旦别人通过某些手段获取了我们的代理列表，而这些代理是没有安全验证的，这也会导致别人偷偷使用我们的代理。在生产环境上，这方面尤其需要注意。

## 6. 使用频率

有些代理套餐在 API 调用提取代理时有频率限制，有的代理套餐则会限制请求频率，这些因素都会或多或少影响爬虫的效率，这部分因素我们也需要考虑进来。

## 四、测评标准

要做标准的测评，那就必须在标准的测评环境下进行，且尽可能排除一些杂项的干扰，如网络波动、传输延迟等一系列的影响。

## 1. 主机选取

由于我的个人笔记本是使用 WiFi 上网的，所以可能会有网络波动，而且实际带宽其实并不太好把控，因此它并不适合来做标准评测使用。评测需要在一个网络稳定的条件下进行，而且多个代理的评测环境必须相同，在此我选择了一台腾讯云主机作为测试，主机配置如下：

![](https://picx.zhimg.com/50/v2-f9bcd5aaa2d437cba5e34a3a578b2946_720w.jpg?source=2c26e567)

这样我们就可以保证一个标准统一的测试环境了。

## 2. 现取现测

另外在评测时还需要遵循一个原则，那就是现取现测，即取一个测一个。现在很多付费代理网站都提供了 API 接口，我们可以一次性提取多个代理，但是这样会导致一个问题，每个代理在提取出来的时候，商家是会尽量保证它的可用性的，但过一段时间，这个代理可能就不好用了，所以假如我们一次性提取出来了 100 个代理，但是这 100 个代理并没有同时参与测试，后面的代理就会经历一个的等待期，过一段时间再测这些代理的话，肯定会影响后半部分代理的有效性，所以这里我们将提取的数量统一设置成 1，即请求一次接口获取一个代理，然后立即进行测试，这样可以保证测试的公平性，排除了不同代理有效期的干扰。

## 3. 时间计算

由于我们有一项是测试代理的响应速度，所以我们需要计算程序请求之前和得到响应之后的时间差，这里我们使用的测试 Python 库是 requests，所以我们就计算发起请求和得到响应之间的时间差即可，时间计算方法如下所示：

```text
start_time = time.time()
requests.get(test_url, timeout=timeout, proxies=proxies)
end_time = time.time()
used_time = end_time - start_time 
```

这里 used\_time 就是使用代理请求的耗时，这样测试的就仅仅是发起请求到得到响应的时间。

## 4. 测试链接

测试时我们也需要使用一个稳定的且没有反爬虫的链接，这样可以排除服务器的干扰，这里我们使用百度来作为测试目标。

## 5. 超时限制

在测试时免不了的会遇到代理请求超时的问题，所以这里我们也需要统一一个超时时间，这里设置为 60 秒，如果使用代理请求百度，60 秒还没有得到响应，那就视为该代理无效。

## 6. 测试数量

要做测评，那么样本不能太小，如只有十几次测试是不能轻易下结论的，这里我选取了一个适中的测评数量 500，即每个套餐获取 500 个代理进行测试。

## 五、测评过程

嗯，测评过程这边主要说一下测评的代码逻辑，首先测的时候是取一个测一个的，所以这里定义了一个 test\_proxy () 方法：

```text
test_url = 'https://www.baidu.com/'
timeout = 60
def testproxy(proxy):
    try:
        proxies = {
            'https': 'http://' + proxy
        }
        starttime = time.time()
        requests.get(testurl, timeout=timeout, proxies=proxies)
        endtime = time.time()
        usedtime = endtime - starttime
        print('Proxy Valid', 'Used Time:', usedtime)
        return True, used_time
    except (ProxyError, ConnectTimeout, SSLError, ReadTimeout, ConnectionError):
        print('Proxy Invalid:', proxy)
        return False, None
```

这里需要传入一个参数 proxy，代表一个代理，即 IP 加端口组成的代理，然后这里使用了 requests 的 proxies 参数传递给 get () 方法。对于代理无效的检测，这里判断了 ProxyError, ConnectTimeout, SSLError, ReadTimeout, ConnectionError 这几种异常，如果发生了这些异常统统视为代理无效，返回错误。如果在 timeout 60 秒内得到了响应，那么就计算其耗费时间并返回。

在主程序里，就是获取 API 然后统计结果了，代码如下：

```text
max = 500
def main():
    print('Testing')
    usedtimelist = []
    validcount = 0
    totalcount = 0
    while True:
        flag, result = getpage(apiurl)
        if flag:
            proxy = result.strip()
            if isproxy(proxy):
                totalcount += 1
                print('Testing proxy', proxy)
                testflag, testresult = testproxy(proxy=proxy)
                if testflag:
                    validcount += 1
                    usedtimelist.append(testresult)
                statsresult(usedtimelist, validcount, totalcount)
        time.sleep(wait)
        if totalcount == max:
            break
```

这里加了一些判断，如 is\_proxy () 方法判断了获取的是不是符合有效的代理规则，即判断它是不是 IP 加端口的形式，这样可以排除 API 返回一些错误信息的干扰。另外这里设置了 total\_count 和 valid\_count 变量，只有符合代理规则的代理参与了测试，这样才算一次有效测试，total\_count 加一，如果测试可用，那么 valid\_count 加一并记录耗费时间。最后调用了 stats\_results 方法进行了统计：

```text
import numpy as np
def statsresult(usedtimelist, validcount, totalcount):
    if not usedtimelist or not totalcount:
        return
    usedtimearray = np.asarray(usedtimelist, np.float32)
    print('Total Count:', totalcount,
          'Valid Count:', validcount,
          'Valid Percent: %.2f%%' % (validcount * 100.0 / totalcount),
          'Used Time Mean:', usedtimearray.mean(),
          'Used Time Var', usedtimearray.var())
```

这里使用了 Numpy 来统计了耗费时间的均值和方差，分别反映代理的响应速度和稳定性。

嗯，就这样，利用这个方法我对各个不同的代理套餐逐一进行了测试。

## 六、测评结果

经过测评，初步得到如下统计结果：

![](https://pic1.zhimg.com/50/v2-0c7b1723e51277b389a541a43f33b43a_720w.jpg?source=2c26e567)

注：

* &#x20;**表中的响应时间方差越大，代表稳定性越低。**&#x20;
* **[阿布云](https://zhida.zhihu.com/search?content_id=86657866\&content_type=Answer\&match_order=2\&q=%E9%98%BF%E5%B8%83%E4%BA%91\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLpmL_luIPkupEiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo4NjY1Nzg2NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.joga6p9Oa1pdqP3U4fubmZowJ5LAd0kVa3sQEML2OQU\&zhida_source=entity)代理经典版方差较小是因为它是长时间锁定了同一个 IP，因此极其稳定，但每秒最大请求默认 5 次。**

## 七、测评分析

下面我们将从各个方面分析一下各个套餐的优劣。

## 1. 可用率

通过可用率统计，我们可以发现可用率较高的代理套餐有：

![](https://picx.zhimg.com/50/v2-c65873714d20ecebd698f68b05439075_720w.jpg?source=2c26e567)

## 2. 响应速度

通过平均响应速度判别，我们可以发现响应速度较快的代理套餐有：

![](https://pic1.zhimg.com/50/v2-f415ca7d4288da405ba3ee71b75c7dbe_720w.jpg?source=2c26e567)

## 3. 稳定性

通过平均响应速度方差分析，我们可以发现稳定性较高的代理套餐有：

![](https://pica.zhimg.com/50/v2-2951bd08a1c23cf553c569673b3b3116_720w.jpg?source=2c26e567)

## 4. 价格

我们可以先看一下各个套餐的价格：

![](https://picx.zhimg.com/50/v2-d711afa37d8f91a7e6b0cc524755f719_720w.jpg?source=2c26e567)

![](https://pic1.zhimg.com/50/v2-9dc901ea9a2bfe9a9a5940c4ac0ee2dc_720w.jpg?source=2c26e567)

按照包月的价格，我们可以统一对比如下：

![](https://pic1.zhimg.com/50/v2-20f60cce8aa96996a066b5084b53eab0_720w.jpg?source=2c26e567)

## 5. 安全性

对于安全性，此处主要考虑提取 API 是否有访问验证，使用代理时是否有访问验证，即可以通过设置白名单来控制哪些可以使用。

其中只有芝麻 HTTP 代理、太阳 HTTP 代理默认使用了白名单限制，即只有将使用 IP 添加到白名单才可以使用，可以有效控制使用权限。

另外阿布云代理提供了[隧道代理](https://zhida.zhihu.com/search?content_id=86657866\&content_type=Answer\&match_order=1\&q=%E9%9A%A7%E9%81%93%E4%BB%A3%E7%90%86\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLpmqfpgZPku6PnkIYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo4NjY1Nzg2NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.xgkAjkFZUSIMdcOoBt_uRWB0aG9kG839kEG0sKKNELQ\&zhida_source=entity)验证，只有成功配置了用户名和密码才可以正常使用。

所以在此归纳如下：

![](https://picx.zhimg.com/50/v2-d4151961532ab209827f455ca52b5114_720w.jpg?source=2c26e567)

## 6. 调取频率

不同的接口具有不同的 API 调用频率限制，归纳如下：

![](https://picx.zhimg.com/50/v2-c63613e9ec044109a38493d6f75c01f4_720w.jpg?source=2c26e567)

在此可以简单总结如下：

![](https://picx.zhimg.com/50/v2-3309daf027eacef4540468b2ff4dcecd_720w.jpg?source=2c26e567)

## 7. 特色功能

除了常规的测试之外，我这边还选取了某些套餐的与众不同之处进行说明，这些特点有的算是缺点，有的算是优点，现列举如下：

![](https://pic1.zhimg.com/50/v2-64a4eb8d59101c09af2fe900ec56006b_720w.jpg?source=2c26e567)

## 八、测评综合

分项了解了各个代理套餐的可用率、响应速度、稳定性、性价比、安全性等内容之后，最后做一下总结：

![](https://picx.zhimg.com/50/v2-5440d0ca9ff9d3bd99fc1d96b9e3efc1_720w.jpg?source=2c26e567)

所以在综合来看比较推荐的有：[芝麻代理](https://zhida.zhihu.com/search?content_id=86657866\&content_type=Answer\&match_order=1\&q=%E8%8A%9D%E9%BA%BB%E4%BB%A3%E7%90%86\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NDYsInEiOiLoip3purvku6PnkIYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo4NjY1Nzg2NiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.TcZUBBsGmCYssGuGqRWR4zU_tZytdgCLFuJPlA76MGQ\&zhida_source=entity)、讯代理、阿布云代理三家，详细的对比结果可以参照表格。

以上便是各家代理的详细对比测评情况，希望此文能够在大家选购代理的时候有所帮助。

## 九、更多资源

如想了解更多爬虫资讯，请关注我的个人微信公众号：进击的 Coder

[http://weixin.qq.com/r/5zsjOyvEZXYarW9Y9271](https://link.zhihu.com/?target=http%3A//weixin.qq.com/r/5zsjOyvEZXYarW9Y9271) (二维码自动识别)
