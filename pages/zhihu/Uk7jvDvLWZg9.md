---
title: 有那些适合个人使用, 速度快的海外 VPS?
date: 2024-10-04T15:31:10.195Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //www.zhihu.com/question/20784987/answer/148488942
---
中国幅员辽阔，地区差异明显，国内三大运营商，每家情况都可能不同。对联通友好的不一定对电信友好，移动宽带虽然国内网速渣，但国际出口却很牛逼。而且以国人一贯所为必上多倍发包加速软件，锐速、[kcptun](https://zhida.zhihu.com/search?content_id=54930652\&content_type=Answer\&match_order=1\&q=kcptun\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjAsInEiOiJrY3B0dW4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1NDkzMDY1MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.-aFE3LUmMB_JfQPTxFvihXPF98hQ2R50Bfwuy3M1HmE\&zhida_source=entity)哪个不暴力？最后肯定被玩坏 ( **建议配合使用谷歌 BBR 加速，** [CentOS 6/7 x86\_64 更换 4.9 版本内核，支持 Google BBR 拥塞控制算法](https://link.zhihu.com/?target=http%3A//www.sponsoredreviews.cn/12.html))。

所谓授人与鱼不如授人与渔，之前我糊里糊涂就上了 digitalocean , 结果发现并不适合电信用户。下面我就把自己掌握的测试方法全部写出，避免大家被坑！

**测试方式:**ping 延迟、[路由跟踪](https://zhida.zhihu.com/search?content_id=54930652\&content_type=Answer\&match_order=1\&q=%E8%B7%AF%E7%94%B1%E8%B7%9F%E8%B8%AA\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjAsInEiOiLot6_nlLHot5_ouKoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1NDkzMDY1MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.DQ5cJZwGY17KympSUQqIfI7_lvu-pfdJLf4W3Gltbo4\&zhida_source=entity)、丢包率测试和 100M 文件下载测速 (不必全部采用)

**测试对象:**[DigitalOcean](https://link.zhihu.com/?target=https%3A//m.do.co/c/e3bf65eb23e7)**旧金山机房**

**测速 ip： **[http://speedtest-sfo1.digitalocean.com](https://link.zhihu.com/?target=http%3A//speedtest-sfo1.digitalocean.com)

**100 M 下载测速**： [http://speedtest-sfo1.digitalocean.com/100mb.test](https://link.zhihu.com/?target=http%3A//speedtest-sfo1.digitalocean.com/100mb.test)

(**如何寻找测试 ip 和测速文件？关键字 “厂商 + Speedtest/Looking Glass”**)

**一、ping 测速 :**低延迟是一个很好的开端，网络游戏对这个要求高。据我经验延迟超过 220ms 的 VPS，不仅用 putty 操作时很可能出现无响应导致软件安装进程中断，在线网页操作速度也慢。我给的建议是延迟最好在 170ms 以下。

个人：直接 ping -t 命令即可。

站长: [多个地点 Ping 服务器，网站测速 - 站长工具](https://link.zhihu.com/?target=http%3A//ping.chinaz.com/)

DO 旧金山机房平均延迟已经 250ms，不少超过 300ms 的，这怎么用？

![](https://pica.zhimg.com/50/v2-a4509a14865c6a66b24e12fd5b252225_720w.jpg?source=2c26e567)

&#x20;**二、路由跟踪 ：** 主要看走什么线路，是否直连！如果绕来绕去的话，我肯定是不买的。提个醒，不要想当然地以为香港的 VPS 肯定就是直连，大家可以测试下香港 SoftPlayer 是不是绕了全中国了？当然即使是香港直连延迟低，也不见得它速度就快，怕就怕它技术不行，丢包率高或者偷偷限速，香港 gigsgigscloud 就是如此，我之前还在答案里推荐过呢，没想到后来不知怎么就不行了，速度上不去，估计是限速了！！！！

针对企业的优质线路有电信 CN2，ip 开头是 59.43.x.x. 联通有精品网 AS9929 ，不过一般很少见到。中国海底光缆出口为青岛、上海、汕头，请参考海底光缆分布图[http://www.cablemap.info/](https://link.zhihu.com/?target=http%3A//www.cablemap.info/) 。

个人：使用 ipip 出品的本地可视化跟踪工具 Best trace , 地图显示 ip 对应地点。

下载地址：[http://cdn.ipip.net/17mon/besttrace.exe](https://link.zhihu.com/?target=http%3A//cdn.ipip.net/17mon/besttrace.exe)

站长：使用 ipip 的在线 traceroute 工具，可以全国各地任选机房，跟踪完毕后同样可以生成地图。[链接： TraceRoute 查询\_最专业的 IP 地址库\_IPIP.NET](https://link.zhihu.com/?target=http%3A//www.ipip.net/traceroute.php)

上海联通用户到美国旧金山机房居然绕广州！明明可以直连，延迟都 300ms 了。

![](https://picx.zhimg.com/50/v2-d0b24aba42461a32fb73f0c84933b430_720w.jpg?source=2c26e567)

下面是生成的地图

![](https://picx.zhimg.com/50/v2-988ed22444139c9ccb61a47f739885ec_720w.jpg?source=2c26e567)

其实新加坡机房更扯，电信用户先绕美国再绕日本，最终才到新加坡！

三、**丢包率测试**

测试工具：MTR ，其实是将 ping 命令与 traceroute 结合起来的一个工具 ，可以查看每个路由结点的丢包率，问题是出在自己这一方的运营商呢还是对方呢？丢包率高，网络不稳定，一会快一会慢是不行的。如果你觉得网络不好，可以将 MTR 测试报告给服务商，让他们负责优化。

个人：使用 WinMTR , 下载地址：[WinMTR - Free Network Diagnostic Tool](https://link.zhihu.com/?target=http%3A//winmtr.net/)

站长：推荐[MTR 测试 网站速度测试 17CE](https://link.zhihu.com/?target=http%3A//www.17ce.com/mtr) ，机房不多可以做参考。

我选取了一个安徽联通机房做测试，结果发现居然绕欧洲了，而且接口处丢包率达到 50%

![](https://picx.zhimg.com/50/v2-de74e41005058b4caa16b6a3651a1faa_720w.jpg?source=2c26e567)

**四、 100 M 文件下载测速:**下载速度建议至少 2**00K/S**, 这个不单与服务器有关，与自家宽带也有关系。自家带宽越大，干扰越强，请务必结合其他因素考虑。

个人下载 100M 测速文件：[http://speedtest-sfo1.digitalocean.com/100mb.test](https://link.zhihu.com/?target=http%3A//speedtest-sfo1.digitalocean.com/100mb.test)

站长：推荐[网站测速 | 17CE.COM ，](https://link.zhihu.com/?target=http%3A//www.17ce.com/)使用 get 指令来执行全国各地下载测速，下面的图只贴了一部分，我观察全部的检测结果电信速度确实很不错。

之前测过安徽联通的丢包率，这回测试下载速度，结果却是没反应。并且不少下载速度

在 200K/S 以下的 ，我只截取部分，感兴趣可以自己测试。

![](https://picx.zhimg.com/50/v2-a405074bc6708c8a0c054bcad4d3a959_720w.jpg?source=2c26e567)

以上工具可以起到基本的辅助作用，但也要去别的论坛探探底，推荐 V2EX 。有些商家很缺德，给你测试的 ip 和测速文件就是个幌子！

**购买前的测试方式讲完了，此问题既然着眼于适合个人使用的 VPS，那我就推荐一些便宜但是性价比很高的 VPS，速度是不错的，事先说明：没准以后也会被玩烂**

1、**樱花免费 docker**

**测速 ip：153.125.238.209**

樱花的口碑一直很好，延迟在 100ms 左右，免费申请地址：[Arukas Control Panel](https://link.zhihu.com/?target=https%3A//app.arukas.io/) .

建议使用**github 账户**申请，审核速度更快！如果个人新注册账户申请，没准不会通过。

更新：官方邮件通知免费至今年 6 月 30 日 。

备注：免费的 VPS 还有亚马逊 AWS 和 google cloud , 都是免费一年的，不过麻烦的是要绑定信用卡。我之前用[全球付](https://zhida.zhihu.com/search?content_id=54930652\&content_type=Answer\&match_order=1\&q=%E5%85%A8%E7%90%83%E4%BB%98\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjAsInEiOiLlhajnkIPku5giLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1NDkzMDY1MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.WS7VHlbwtt5KfQscVMuXey9imua-4096FW9tAstGS20\&zhida_source=entity)的虚拟卡成功绑定 AWS, 但申请的时候还是没有通过，当时没填写个人网址，而且现在全球付得预先充值 300 元了。google cloud 是不支持全球付的，但从我借用别人的服务器来看，速度是很棒的。

**2、 [Vultr:High Performance Cloud Servers](https://link.zhihu.com/?target=http%3A//www.vultr.com/promo25b/%3Fref%3D6879912)**

东京机房测速: (移动用户请选择新加坡机房)

测速 ip: [http://hnd-jp-ping.vultr.com](https://link.zhihu.com/?target=http%3A//hnd-jp-ping.vultr.com/)

100 M 下载文件: [https://hnd-jp-ping.vultr.com/vultr.com.100MB.bin](https://link.zhihu.com/?target=https%3A//hnd-jp-ping.vultr.com/vultr.com.100MB.bin)

**vultr 每月 2.5 美元，512M 内存**！** 按小时付费。有免费[快照](https://zhida.zhihu.com/search?content_id=54930652\&content_type=Answer\&match_order=1\&q=%E5%BF%AB%E7%85%A7\&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3MjgyMjg2NjAsInEiOiLlv6vnhaciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo1NDkzMDY1MiwiY29udGVudF90eXBlIjoiQW5zd2VyIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.vUFig847yCXQdREKGFky6gbut7JldQ3k2WsrEFxFNwQ\&zhida_source=entity)，不想用直接快照备份然后删除服务器是不收费的，特别适合那啥。**

对我自己来说速度还是不错的，下面是我之前东京机房个人测速截图，不过现在东京机房被玩烂了，有些地区比不上洛杉矶了。东京的延迟不错，100ms 左右，感兴趣的也可以测试下：

![](https://picx.zhimg.com/50/v2-0f3c95cd0d7da3a1d9d807e756773875_720w.jpg?source=2c26e567)

**3、[Bandwagon Host](https://link.zhihu.com/?target=https%3A//bwh1.net/aff.php%3Faff%3D13153%26pid%3D58)**

官方测速 ip：107.182.184.6

100M 下载测速：[http://107.182.184.6/100mb.bin](https://link.zhihu.com/?target=http%3A//107.182.184.6/100mb.bin)

搬瓦工以前推出过年付 3.99 刀的 openvz 套餐，引来抢购狂潮，我以前也跟很多人一样觉得超售如此厉害，网络一定很糟糕。怀着迟疑的态度买了一款，后来测试速度还不错，而且没有什么丢包，可见其技术实力。

现在洛杉矶机房对移动联通很友好，月付 2.99 美元（年付 19.99 美元）,512 M 内存，500 GB 流量，KVM 架构 (可以安装加速软件，不容易超售)。

\------------------------------------------------------------------------------------

更新：搬瓦工新推出 CN2 线路

测试 ip : 23.252.99.102

此 ip 延迟比 107.182.184.6 减少了 100ms 左右 ，电信用户的福音。
