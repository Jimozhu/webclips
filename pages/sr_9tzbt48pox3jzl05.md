---
title: "浏览器指纹技术简介"
date: 2022-08-15T09:22:34+08:00
draft: false
categories: [dev]
tags: [dev, web]
---
> 原文地址 [www.biaodianfu.com](https://www.biaodianfu.com/fingerprint.html)

日常生活中，生物识别技术已经是多数智能手机的标配，大多数手机具备人脸识别、指纹识别等功能，目前的指纹识别技术已经非常成熟。但我们今天要聊的并不是生物识别技术中的指纹识别，而是浏览器指纹。很多人对这项技术是又爱又恨，这究竟是为什么呢？那我们今天就来深入了解下浏览器指纹。

## 什么是浏览器指纹？

人的指纹千变万化，具有唯一性，可以作为人的身份标识。同时人的姓名、身份证号、相貌特征也可以作为唯一的身份标识。设备指纹或机器指纹是为了识别而收集的有关远程计算设备的软件和硬件的信息。比如设备的硬件 ID，像手机在生产过程中都会被赋予一个唯一的 IMEI 编号，用于唯一标识该台设备。像电脑的网卡，在生产过程中会被赋予唯一的 MAC 地址。通常使用指纹算法将信息同化为一个简短的标识符。而浏览器指纹就是指通过与设备的 web 浏览器交互而专门收集的信息。

浏览器指纹是一种通过浏览器对网站可见的配置和设置信息来跟踪 Web 浏览器的方法，浏览器指纹就像我们人手上的指纹一样，具有个体辨识度，只不过现阶段浏览器指纹辨别的是浏览器。

人手上的指纹之所以具有唯一性，是因为每个指纹具有独特的纹路、这个纹路由凹凸的皮肤所形成。每个人指纹纹路的差异造就了其独一无二的特征。那么浏览器指纹也是同理，获取浏览器具有辨识度的信息，进行一些计算得出一个值，那么这个值就是浏览器指纹。辨识度的信息可以是 UA、时区、地理位置或者是你使用的语言等等，你所选取的信息决定了浏览器指纹的准确性。

日常生活中，生物识别技术已经是多数智能手机的标配，大多数手机具备人脸识别、指纹识别等功能，目前的指纹识别技术已经非常成熟。但我们今天要聊的并不是生物识别技术中的指纹识别，而是浏览器指纹。很多人对这项技术是又爱又恨，这究竟是为什么呢？那我们今天就来深入了解下浏览器指纹。

## 什么是浏览器指纹？

人的指纹千变万化，具有唯一性，可以作为人的身份标识。同时人的姓名、身份证号、相貌特征也可以作为唯一的身份标识。设备指纹或机器指纹是为了识别而收集的有关远程计算设备的软件和硬件的信息。比如设备的硬件 ID，像手机在生产过程中都会被赋予一个唯一的 IMEI 编号，用于唯一标识该台设备。像电脑的网卡，在生产过程中会被赋予唯一的 MAC 地址。通常使用指纹算法将信息同化为一个简短的标识符。而浏览器指纹就是指通过与设备的 web 浏览器交互而专门收集的信息。

浏览器指纹是一种通过浏览器对网站可见的配置和设置信息来跟踪 Web 浏览器的方法，浏览器指纹就像我们人手上的指纹一样，具有个体辨识度，只不过现阶段浏览器指纹辨别的是浏览器。

人手上的指纹之所以具有唯一性，是因为每个指纹具有独特的纹路、这个纹路由凹凸的皮肤所形成。每个人指纹纹路的差异造就了其独一无二的特征。那么浏览器指纹也是同理，获取浏览器具有辨识度的信息，进行一些计算得出一个值，那么这个值就是浏览器指纹。辨识度的信息可以是 UA、时区、地理位置或者是你使用的语言等等，你所选取的信息决定了浏览器指纹的准确性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9tzbt48pox3jzl05/6bd374a3.png)

对于网站而言，拿到浏览器指纹并没有实际价值，真正有价值的是这个浏览器指纹对应的用户信息。作为网站站长，收集用户浏览器指纹并记录用户的操作，是一个有价值的行为，特别是针对没有用户身份的场景。例如在一个内容分发网站上，用户 A 喜欢浏览二次元的内容，通过浏览器指纹记录这个兴趣，那么下次用户不需要登录即可向 A 用户推送二次元的信息。在个人 PC 如此普及的当下，这也是一种内容分发的方式。

对于用户而言，建立个人上网行为与浏览器指纹之间的联系或多或少都有侵犯用户隐私的意味，特别是将你的浏览器指纹和真实的用户信息相关联起来的时候。浏览器指纹本质上就是侵犯隐私。在大多数情况下，您不知道自己正在被跟踪。即使您知道，也很难预防。

### 浏览器指纹的价值

理论上，无登录的状态下，并且浏览器中无法读取或存储持久 cookie，无法读取客户端的 IP，或同一个设备上切换不同的浏览器的情况下，我们仍然可以通过浏览器指纹完全或者部分识别单个设备。

- 使服务提供商能够检测并防止身份盗窃和一些欺诈行为
- 组成个人浏览历史的长期记录（并提供有针对性的广告甚至是对目标发起相对应的攻击行为)

主要场景：

- 针对性的广告推送。在网站上浏览某个商品，了解了相关的商品信息，但并没有下单购买，甚至没有进行登录操作。过两天用同台电脑访问其他网站的时候却发现很多同类商品的广告。
- 协助识别同一设备。在某博客中你有多个小号（水军），这些小号的存在就是为了刷某个帖子的热度或者进行舆论引导，即便你在切换账号的时候清空了 cookie、本地缓存，重开路由器甚至使用 vpn 来进行操作，但是管理人员可能还是知道这是同一个人在操作，从而被打击

### 浏览器指纹的发展

浏览器指纹技术的发展跟大多数技术一样，并非一蹴而就的，现有的几代浏览器指纹技术是这样的：

- 第一代是状态化的，主要集中在用户的 cookie 和 evercookie 上，需要用户登录才可以得到有效的信息。
- 第二代才有了浏览器指纹的概念，通过不断增加浏览器的特征值从而让用户更具有区分度，例如 UA、浏览器插件信息等
- 第三代是已经将目光放在人身上了，通过收集用户的行为、习惯来为用户建立特征值甚至模型，可以实现真正的追踪技术。但是目前实现比较复杂，依然在探索中。

目前浏览器指纹的追踪技术可以算是进入 2.5 代，这么说是因为跨浏览器识别指纹的问题仍没有解决。

## 浏览器指纹的采集

信息熵（entropy）是接收的每条消息中包含的信息的平均量，信息熵越高，则能传输越多的信息，信息熵越低，则意味着传输的信息越少。浏览器指纹是由许多浏览器的特征信息综合起来的，其中特征值的信息熵也不尽相同。因此，指纹也分为基本指纹和高级指纹。

### 浏览器基本指纹

基本指纹是任何浏览器都具有的特征标识，比如硬件类型（Apple）、操作系统（Mac OS）、用户代理（User agent）、系统字体、语言、屏幕分辨率、浏览器插件 (Flash, Silverlight, Java, etc)、浏览器扩展、浏览器设置 (Do-Not-Track, etc)、时区差（Browser GMT Offset）等众多信息，这些指纹信息 “类似” 人类的身高、年龄等，有很大的冲突概率，只能作为辅助识别。

浏览器特征指纹获取：

<table><tbody><tr><td>指纹内容</td><td>获取指纹的方式</td></tr><tr><td>userAgent(用户代理)</td><td>navigator.userAgent</td></tr><tr><td>浏览器的语言</td><td>navigator.language</td></tr><tr><td>浏览器的插件</td><td>Array.from(navigatorObj.plugins).map(item =&gt; item.name).join(‘,’)</td></tr></tbody></table>

系统特征指纹获取：

<table><tbody><tr><td>指纹内容</td><td>获取指纹的方式</td></tr><tr><td>操作系统</td><td>navigator.platform</td></tr></tbody></table>

时区特征指纹获取：

<table><tbody><tr><td><strong>指纹内容</strong></td><td><strong>获取指纹的方式</strong></td></tr><tr><td>格林威治时间和本地时间之间的时差</td><td>new Date().getTimezoneOffset()</td></tr><tr><td>时区所属</td><td>需查询服务器获取相应信息</td></tr><tr><td>地区经纬度</td><td>navigator.geolocation.getCurrentPosition(需在 https 安全环境下才能调用) 或查询服务器获取相应信息</td></tr><tr><td>地理地区名称</td><td>需查询服务器获取相应信息</td></tr><tr><td>IP 地址</td><td>需查询服务器获取相应信息</td></tr></tbody></table>

硬件特征指纹获取：

<table><tbody><tr><td>指纹内容</td><td>获取指纹的方式</td></tr><tr><td>设备能够支持的最大同时触摸的点数</td><td>navigator.maxTouchPoints</td></tr><tr><td>可用的逻辑处理器核心数</td><td>navigator.hardwareConcurrency</td></tr><tr><td>设备屏幕的宽高与色彩信息</td><td>${screen.width}*${screen.height}*${screen.colorDepth}</td></tr></tbody></table>

### 浏览器高级指纹

普通指纹是不够区分独特的个人，这时就需要高级指纹，将范围进一步缩小，甚至生成一个独一无二的跨浏览器身份。用于生产指纹的各个信息，有权重大小之分，信息熵大的将拥有较大的权重。

#### Canvas 指纹

Canvas 是 HTML5 中的动态绘图标签，也可以用它生成图片或者处理图片。即便使用 Canvas 绘制相同的元素，但是由于系统的差别，字体渲染引擎不同，对抗锯齿、次像素渲染等算法也不同，canvas 将同样的文字转成图片，得到的结果也是不同的。

由于指纹主要基于浏览器、操作系统和已安装的图形硬件，因此还是无法完全做到唯一识别用户 (重复率很低)。

实现代码大致为：在画布上渲染一些文字，再用 toDataURL 转换出来，即便开启了隐私模式一样可以拿到相同的值。

```javascript
function getCanvasFingerprint() {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = "18pt Arial";
  context.textBaseline = "top";
  context.fillText("Hello, user.", 2, 2);
  return canvas.toDataURL("image/jpeg");
}
getCanvasFingerprint();
```

接着将获取到的 canvasImageData 通过 hash 算法得出唯一值 (md5 或者 sha256 等)，就是我们所得到的 canvas 指纹了：

```javascript
import sha256 from "crypto-js/sha256";
const canvasFinger = sha256(canvasImageData);
```

#### WebGL 指纹

WebGL（Web 图形库）是一个 JavaScript API，可在任何兼容的 Web 浏览器中渲染高性能的交互式 3D 和 2D 图形，而无需使用插件。WebGL 通过引入一个与 OpenGL ES 2.0 非常一致的 API 来做到这一点，该 API 可以在 HTML5 元素中使用。这种一致性使 API 可以利用用户设备提供的硬件图形加速。网站可以利用 WebGL 来识别设备指纹，一般可以用两种方式来做到指纹生产：

- WebGL 报告，完整的 WebGL 浏览器报告表是可获取、可被检测的。在一些情况下，它会被转换成为哈希值以便更快地进行分析。
- WebGL 图像，渲染和转换为哈希值的隐藏 3D 图像。由于最终结果取决于进行计算的硬件设备，因此此方法会为设备及其驱动程序的不同组合生成唯一值。这种方式为不同的设备组合和驱动程序生成了唯一值。

产生 WebGL 指纹原理是首先需要用着色器（shaders）绘制一个梯度对象，并将这个图片转换为 Base64 字符串。然后枚举 WebGL 所有的拓展和功能，并将他们添加到 Base64 字符串上，从而产生一个巨大的字符串，这个字符串在每台设备上可能是非常独特的。

例如 fingerprint2js 库的 WebGL 指纹生产方式：

```javascript
// 部分代码
gl = getWebglCanvas()
if (!gl) { return null }
var result = []
var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}'
var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}'
var vertexPosBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer)
var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0])
// 创建并初始化了Buffer对象的数据存储区。
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
vertexPosBuffer.itemSize = 3
vertexPosBuffer.numItems = 3
// 创建和初始化一个WebGLProgram对象。
var program = gl.createProgram()
// 创建着色器对象
var vshader = gl.createShader(gl.VERTEX_SHADER)
// 下两行配置着色器
gl.shaderSource(vshader, vShaderTemplate)  // 设置着色器代码
gl.compileShader(vshader) // 编译一个着色器，以便被WebGLProgram对象所使用

var fshader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fshader, fShaderTemplate)
gl.compileShader(fshader)
// 添加预先定义好的顶点着色器和片段着色器
gl.attachShader(program, vshader)
gl.attachShader(program, fshader)
// 链接WebGLProgram对象
gl.linkProgram(program)
// 定义好的WebGLProgram对象添加到当前的渲染状态
gl.useProgram(program)
program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex')
program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset')                           gl.enableVertexAttribArray(program.vertexPosArray)
gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0)
gl.uniform2f(program.offsetUniform, 1, 1)
// 从向量数组中绘制图元
gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems)
try {
    result.push(gl.canvas.toDataURL())
} catch (e) {
    /* .toDataURL may be absent or broken (blocked by extension) */
}
```

#### 音频指纹

AudioContext 指纹和 Canvas 类似也是基于硬件设备或者软件的差别，来产生不同的音频输出，然后计算得到不同的 hash 来作为标志。

- 方法一：生成音频信息流 (三角波)，对其进行 FFT 变换，计算 SHA 值作为指纹。
- 方法二：生成音频信息流（正弦波），进行动态压缩处理，计算 MD5 值。

两种方法都是在音频输出到音频设备之前进行清除，用户根本就毫无察觉就被获取了指纹。

以 fingerprintjs2 的音频指纹源码为例：

```javascript
var each = function (obj, iterator) {
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      iterator(obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator(obj[key], key, obj);
      }
    }
  }
};

var AudioContext =
  window.OfflineAudioContext || window.webkitOfflineAudioContext;

var context = new AudioContext(1, 44100, 44100);

var oscillator = context.createOscillator();
oscillator.type = "triangle";
oscillator.frequency.setValueAtTime(10000, context.currentTime);

var compressor = context.createDynamicsCompressor();
each(
  [
    ["threshold", -50],
    ["knee", 40],
    ["ratio", 12],
    ["reduction", -20],
    ["attack", 0],
    ["release", 0.25],
  ],
  function (item) {
    if (
      compressor[item[0]] !== undefined &&
      typeof compressor[item[0]].setValueAtTime === "function"
    ) {
      compressor[item[0]].setValueAtTime(item[1], context.currentTime);
    }
  }
);

oscillator.connect(compressor);
compressor.connect(context.destination);
oscillator.start(0);
context.startRendering();

var audioTimeoutId = setTimeout(function () {
  console.warn(
    'Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' +
      navigator.userAgent +
      '".'
  );
  context.oncomplete = function () {};
  context = null;
  return done("audioTimeout");
}, 100);

context.oncomplete = (event) => {
  try {
    clearTimeout(audioTimeoutId);
    audioFingerprint.value = event.renderedBuffer
      .getChannelData(0)
      .slice(4500, 5000)
      .reduce(function (acc, val) {
        return acc + Math.abs(val);
      }, 0)
      .toString();
    oscillator.disconnect();
    compressor.disconnect();
    audioFingerprintHash.value = sha256(audioFingerprint.value);
  } catch (error) {
    console.log(error);
    return;
  }
};
```

#### WebRTC

WebRTC（网页实时通信，Web Real Time Communication），是可以让浏览器有音视频实时通信的能力，它提供了三个主要的 API 来让 JS 可以实时获取和交换音视频数据，MediaStream、RTCPeerConnection 和 RTCDataChannel。当然如果要使用 WebRTC 获得通信能力，用户的真实 ip 就得暴露出来（NAT 穿透），所以 RTCPeerConnection 就提供了这样的 API，直接使用 JS 就可以拿到用户的 IP 地址。

### 指纹计算

除开从 http 中拿到的指纹，也可以通过其他方式拿到浏览器的特性信息，在 ([https://panopticlick.eff.org/about](https://panopticlick.eff.org/about)) 这篇文档中就陈列了一些可行的特征值

- 每个浏览器的用户代理字符串
- 浏览器发送的 HTTP ACCEPT 标头
- 屏幕分辨率和色彩深度
- 系统设置为时区
- 浏览器中安装的浏览器扩展 / 插件，例如 Quicktime，Flash，Java 或 Acrobat，以及这些插件的版本
- 计算机上安装的字体，由 Flash 或 Java 报告。
- 浏览器是否执行 JavaScript 脚本
- 浏览器是否能种下各种 cookie 和 “超级 cookie（super cookies）”
- 通过 Canvas 指纹生成的图像的哈希
- WebGL 指纹生成的图像的哈希
- 是否浏览器设置为 “Do Not Track”
- 系统平台（例如 Win32，Linux x86）
- 系统语言（例如，cn,en-US）
- 浏览器是否支持触摸屏

拿到这些值后可以进行一些[运算](https://www.eff.org/deeplinks/2010/01/primer-information-theory-and-privacy)，得到浏览器指纹具体的信息熵以及浏览器的 uuid。

下图是数个特征值的信息熵、重复概率和具体的值：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9tzbt48pox3jzl05/ddc9ded3.jpe)

将上面的指纹信息综合起来，可以大大降低碰撞率，提高客户端 uuid 的准确性。指纹的也有权重之分，在论文《[Cross-Browser Fingerprinting via OS and Hardware Level Features](http://yinzhicao.org/TrackingFree/crossbrowsertracking_NDSS17.pdf)》中更是详细研究了各个指标的信息熵和稳定性。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9tzbt48pox3jzl05/852c78aa.png)

从该论文中可以看出，时区、屏幕分辨率和色深、Canvas、webGL  的信息熵在跨浏览器指纹上的权重是比较大的。

#### 跨浏览器指纹

综上提到的浏览器指纹都是从同一个浏览器上获得。但是很多特征值都是不稳定的，例如 UA、canvas 指纹在相同设备的不同浏览器打开会完全不一样。同一套浏览器指纹算法在不同浏览器上也就不可用了。

跨浏览器指纹就是即便是在不同浏览器上也可以取得相同或者近似值的稳定浏览器特征。

跨浏览器指纹也有对应的研究成果：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9tzbt48pox3jzl05/e80be347.jpe)

列举了浏览器特征值的在单浏览器和跨浏览器的信息熵以及稳定性，上诉说到的 canvas 指纹稳定性仅有 8.17%。

常规的特征值很难满足在信息量足够的情况下还保持高稳定性。

挑选几个表中符合这些特征的值 Task(a) Task(r)、List of fonts（JS）、TimeZone 和 CPU Vritual cores

- Task(a)~Task(r)，它是一种显卡渲染 (Rendering Tasks) 图片的特征值。例如 Task（a）Texture，它是测试常规片段着色器中的纹理功能，通过渲染一个随机的三基色值的像素，片段着色器需要在纹理中插入点，以便将纹理映射到模型上的每个点，这个插入算法在不同的显卡又是不一致的。如果纹理变化较大，那么差异也就越明显，我们可以通过记录这种差异来为这个显卡作出区分度。
- List of fonts（JS），通过 js 获取页面支持的字体情况。获取页面支持的字体分为两种方式，Flash 和 JS，现在 Flash 渐渐退出了舞台就不考虑它了。List of fonts 是值通过 js 拿到页面支持的字体情况以及如何绘制字体，是通过测量不同字体的文本 HTML 元素的填充尺寸，来和其他设备做区分。
- TimeZone，时区，这个比较好理解，既然是同一台设备那么时区应该也是一致的。
- CUP Vritual cores 即为 CPU 的内核数量，最简单的方法就是通过一个 hardwareConcurrency 来拿到。

尽管在低版本浏览器是不支持这个 API 的，但也可以通过这个 polyfill 拿到。实现原理大致为借用 Web Worker 的能力，监听 payload 的时间，计算量达到硬件最大并发的时候就可以得到内核的数量（有点硬核）。

## 浏览器指纹的对抗

如果你没有足够专业的知识或者非常频繁更换浏览器信息的话，几乎 100% 可以通过浏览器指纹定位到一个用户，当然这也不见得全是坏事。

- 泄露的隐私非常片面，只能说泄露了用户部分浏览网页时的行为。
- 价值不够，用户行为并未将实际的账户或者具体的人对应起来，产生的价值有限。
- 有益利用，利用浏览器指纹可以隔离部分黑产用户，防止刷票或者部分恶意行为。

但是即便如此，浏览器指纹也有一些可以防止的措施。

反浏览器指纹追踪只要打破上述指纹追踪的三个特性即可：

- 指纹的确定性。要使两个浏览平台产生完全一样的指纹，目前暂未发现有效方法;
- 指纹的易获性。可以使用浏览器的各种设置或插件来减缓追踪 [1]，但这种方法可能会影响用户体验，例如无法使用 Cookie 和 JavaScript;
- 指纹的稳定性。来自法国 INRIA Rennes 大学的研究人员皮埃尔拉普里克斯博士提出了一个解决思路 [2]，可以组建一个动态的浏览平台，使用户每次浏览网页都产生不一样的指纹。

并且皮埃尔通过两种方法来打破了指纹的稳定性：

- 利用虚拟化和模块化架构自动组合和重新配置多个级别的软件组件，随机生成浏览环境，为每个浏览会话产生随机的指纹，从而来模糊实际设备的指纹。
- 通过在指纹识别过程中引入足够的噪音，打破非常特定的指纹技术 (Canvas，Audio，JavaScript 引擎) 的稳定性，使追踪者不能将新鲜的指纹与旧的指纹绑定在一起，从而使得跨越多个会话的跟踪变得不可能。

### Do Not Track

在 http 头部可以声明这样一个标志 “DNT” 意味“Do Not Track”，如果值为 1 表示为不要追踪我的网页行为，0 则为可以追踪。即便没有 cookie 也可以通过这个标志符告诉服务器我不想被追踪到，不要记录我的行为。

不好的消息是大多数网站目前并没有遵守这个约定，完全忽略了 “Do Not Track” 这个信号。

EFF 提供了这样一个工具 Privacy Badger，它是一个浏览器插件形式的广告拦截器，对于那些遵守这个约定的公司会在这个广告拦截器的白名单上，允许显示广告，从而激励更多的公司遵守 “Do Not Track”，以便完全展示广告。

个人觉得这一个方向很不错的做法，如果用户使用这个工具，网站在拿用户行为之前会抉择两边的利益，从而减轻用户对于隐私泄露的风险。

Privacy Badger 的更多信息可以在这里（[https://www.eff.org/privacybadger](https://www.eff.org/privacybadger)）查看。

### Tor Browser

通过上述我们对浏览器指纹的了解，不难发现，如果你浏览器的特征越多，越容易被追踪到。相反如果你想要刻意将某些浏览器特征隐藏或者进行魔改，那么恭喜你，你的浏览器可能就拥有了一个独一无二的浏览器指纹，都不需要刻意去计算，直接就可以将你和其他用户区分开。

所以有效的方法是尽量将特征值进行大众化，例如目前市面最广泛的搭配是 Window 10 + Chrome，那么你将 UA 改为这个组合就是一个有效的方法，同时尽量避免网站获取信息熵非常高的特征值，例如 canvas 指纹。

Tor 浏览器在这上面做了很多工作，以防止它们被用来跟踪 Tor 用户，为了响应 Panopticlick 和其他指纹识别实验，Tor 浏览器现在包含一些补丁程序，以防止字体指纹（通过限制网站可以使用的字体）和 Canvas 指纹（通过检测对 HTML5 Canvas 对象的读取并要求用户批准）来防止，例如上面获取 Canvas 指纹的代码，在 Tor 上会弹出如下警告：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_9tzbt48pox3jzl05/ef1bd28e.png)

同时还可以将 Tor 浏览器配置为主动阻止 JavaScript。综上所述，这些措施使 Tor 浏览器成为抵抗指纹的强大防御工具。但是这样有安全感的浏览器牺牲的是它的速度，使用 Tor 浏览器访问页面会比市面的浏览器慢得多。感兴趣的同学可以尝试一下 Tor Browser

### 禁用 JS

阻止网站获取浏览器信息的最有效方法是禁用浏览器上的 JavaScript。JavaScript 是一种前端脚本语言，可用于使网站具有响应能力并提供更好的用户体验。但是，它们是站点用于获取浏览器指纹信息的主要工具。如果禁用 JavaScript，站点将无法创建浏览器的指纹，因为只有少数浏览器信息（例如 User-Agent 字符串名称）和其他一些信息将可用。

对于浏览器指纹，可用的信息越多，系统在唯一识别浏览器方面的性能就会越好。但是，禁用 JavaScript 意味着您将无法访问某些严重依赖 JavaScript 的网站。但是这样会导致页面较大部分地功能不可用。

而且非常不幸的是，即便禁止了 JS 但是还可以通过 CSS 来采取浏览器的信息，例如：

```css
@media (device-width: 1080px) {
  body {
    background: url("https://example.org/1080.png");
  }
}
```

可以在服务器中看 1080.png 图片的请求日志，就可以得知哪些用户的屏幕是 1080px 的。

参考链接：

- [HTTP 头部信息查看](https://httpbin.org/headers)
- [Canvas 指纹测试](https://browserleaks.com/canvas)
- [音频指纹测试](https://audiofingerprint.openwpm.com/)
- [查看自己的浏览器指纹 ID](https://fingerprint.com/demo/)
- [查看自己浏览器的基本信息](https://www.whatismybrowser.com/)
