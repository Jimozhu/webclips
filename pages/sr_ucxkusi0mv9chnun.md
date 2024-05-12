---
title: "多媒体技术原理及应用场景探索"
date: 2022-11-02T08:43:35+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7160876696189534245)

多媒体的应用越来越广泛，主要的场景包括：点播、直播、实时音视频。深入了解其内在的技术原理，做到手中有粮心中不慌。

- **点播**，用于离线视频的观看，是视频业务的主要场景，通常使用基于 `HTTP` 的 `.mp4`、`.m3u8` 或 `.mpd` 流媒体封装格式。
- **直播**，主要使用 `.m3u8`、`.mpd` 或者 `.flv` 流媒体封装格式。
- **实时音视频**，主要通过基于 `SRTP/SCTP` 的 `WebRTC` 协议进行推/拉流控制（小程序上暂不支持 `WebRTC`，使用 `RTMP` 协议）

## 概览

多媒体技术应用，涉及的概念和技术比较多，大概将其划分为以下几个层面进行概述：

- **采集**：包括视频、音频采集。视频采集主要通过摄像机进行连续成像，音频通过麦克风连续记录声波
- **编码**：将采集到的成像模拟数据进行 [A/D](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAnalog-to-digital_converter "https://en.wikipedia.org/wiki/Analog-to-digital_converter") 转换并通过 [RGB](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FRGB_color_model "https://en.wikipedia.org/wiki/RGB_color_model") 编码，声波模拟数据进行 `A/D` 转换并通过 [PCM](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPulse-code_modulation "https://en.wikipedia.org/wiki/Pulse-code_modulation") 编码，这就是音视频的原始数据，体积会很大。字幕比较简单体积也很小，一般采用纯文本格式编码（如：[WebVTT](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FWebVTT "https://en.wikipedia.org/wiki/WebVTT")）。
- **压缩**：无论是直播还是点播，媒体资源的编码是共通的，都是使用特定的算法或者格式将原始音频、视频、字幕数据进行压缩（如：[MP3](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMP3 "https://en.wikipedia.org/wiki/MP3")/[ACC](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FACC "https://en.wikipedia.org/wiki/ACC")/[Opus](https://en.wikipedia.org/wiki/Opus_(audio_format))、[H.264](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAdvanced_Video_Coding "https://en.wikipedia.org/wiki/Advanced_Video_Coding")/[H.265](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHigh_Efficiency_Video_Coding "https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding") 等）。
- **打包**：点播或者直播观众端可以共用相同的流媒体协议（如：[HLS](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Fdraft-pantos-hls-rfc8216bis "https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis")、[DASH](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fobp%2Fui%2F%23iso%3Astd%3Aiso-iec%3A23009%3A-1%3Aed-4%3Av1%3Aen "https://www.iso.org/obp/ui/#iso:std:iso-iec:23009:-1:ed-4:v1:en") 等），将媒体打包成 `.ts`、`.mp4/m4a/m4v`、`.mp3/acc` 等文件片段进行传输，实现边加载边播并充分利用 `CDN` 进行分发；实时音视频对时延要求很高，一般都是采用 [SRTC](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3711 "https://datatracker.ietf.org/doc/html/rfc3711") 或 [RTMP](https://link.juejin.cn?target=https%3A%2F%2Fwwwimages2.adobe.com%2Fcontent%2Fdam%2Facom%2Fen%2Fdevnet%2Frtmp%2Fpdf%2Frtmp_specification_1.0.pdf "https://wwwimages2.adobe.com/content/dam/acom/en/devnet/rtmp/pdf/rtmp_specification_1.0.pdf") 等实时传输协议进行媒体数据的传输。
- **封装**：媒体资源（音频、视频、字幕）/片段需要进行合并/封装，常用的媒体封装格式包括[.mp4](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fstandard%2F79110.html "https://www.iso.org/standard/79110.html")、[.m3u8](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FM3U "https://en.wikipedia.org/wiki/M3U")、[.mpd](https://link.juejin.cn?target=https%3A%2F%2Fottverse.com%2Fstructure-of-an-mpeg-dash-mpd%2F "https://ottverse.com/structure-of-an-mpeg-dash-mpd/") 等；实时音视频使用实时传输协议，直接传输编码后的媒体数据。
- **转码**：如果只是简单的点播或者直播，可以直接使用 `.mp4` 或者 `.m3u8` 媒体封装格式，具有良好的兼容性；简单的实时音视频也通过很少的代码实现推/拉流；但实际业务场景可能比较复杂，通常需要进行防盗链/加密或者精细化控制，这个时候就需要进行解密和转码，`Web` 端可以通过 `Uint8Array` 对媒体数据进行转码，通过 [EME](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2F2017%2FREC-encrypted-media-20170918%2F "https://www.w3.org/TR/2017/REC-encrypted-media-20170918/") 进行 [DRM](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital_rights_management "https://en.wikipedia.org/wiki/Digital_rights_management") 解密，通过 [MSE](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fmedia-source%2F "https://www.w3.org/TR/media-source/") 对媒体数据进行重组，通过 [WebRTC](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebrtc%2F "https://www.w3.org/TR/webrtc/") 进行推拉流控制。
- **播放**：最终视频的播放通常都要通过 `video` 标签进行播放（原则上也可以通过 `canvas`+`audio`，但是兼容性问题比较多，鲜有使用的），播放的过程是一个非常复杂的过程，大体是上述过程的逆序。视频会被解压缩并还原成 `RGB` 原始格式，逐帧显示到屏幕上，音频数据也会没解压并还原成 `PCM` 原始数据，然后通过 [D/A](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital-to-analog_converter "https://en.wikipedia.org/wiki/Digital-to-analog_converter") 转换并驱动扬声器发声。

![overview.drawio.svg](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/acc8f650.webp)

## 采集

### 音频采集

声音的本质是[机械波](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E6%259C%25BA%25E6%25A2%25B0%25E6%25B3%25A2 "https://baike.baidu.com/item/%E6%9C%BA%E6%A2%B0%E6%B3%A2")，当声波通过介质（如：空气、固体、液体等）达到接收端（如：话筒、耳朵），引起响应的震动，就能被感知/听到。

![wave.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/ecfc6923.webp)

声波有两个基本属性：频率和振幅。振幅对应声音的音量，频率对应声音的音调。

当声波传递到话筒时，话筒里的碳膜会随着声音一起振动，而碳膜下面是一个电极，碳膜振动时会触碰电极，接触时间的长短跟振动幅度有关（即：声音响度），这样就完成了声音信号到电压信号的转换。后面经过电路放大后，就得到了模拟音频信号（连续的电压或电流），留声机或是磁带记录的就是这种模拟信号。计算不能直接处理模拟信号，所以需要进行 [A/D](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAnalog-to-digital_converter "https://en.wikipedia.org/wiki/Analog-to-digital_converter") 转换，以一定的频率对模拟信号进行采样得到离散的波形振幅数值，然后再进行量化和存储，就得到了数字音频数据。

### 视频采集

视频的本质是一帧帧（张）连续的图片，按照一定的频率逐帧排列。视频采集的过程就是把通过镜头的光学图像投射到传感器上，然后光学图像被转换成电信号，然后通过 `A/D` 转换得到数字信号，数字信号交由 [DSP](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital_signal_processor "https://en.wikipedia.org/wiki/Digital_signal_processor") 芯片加工处理得到最终的图片数字数据。如果是录屏的话，则直接读取显示缓冲区的 `RGB` 数据即可。

## 编码

### 音频编码

最常见的 `A/D` 转换是通过脉冲编码调制 [PCM](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPulse-code_modulation "https://en.wikipedia.org/wiki/Pulse-code_modulation")。要将连续的电压信号进行采样和量化，转换为 `PCM`，量化指标主要包括以下几个维度：

- **采样频率**：单位时间内采样的次数。通常采样频率越高，越接近真实的情况，声音就越好，同时数据量就越大。人耳能够感受到的音频范围在 20\~20KHz 之间，普通的 FM 一般采用 22KHz，CD 采用 44.1KHz，采样频率一般都不超过 48KHz（DVD 采用的采样频率）。
- **采样位数**：每个采样点用多少比特表示。比特位越多，可表示的数值范围越大，量化后的波形越接近原始波形，音质就越好，同时数据量也会越大。移动通信一般采用 8 比特，CD 采用 16 比特。
- **声道数量**：如果每次采样记录一个波形数据称为单声道，两个波形数据称为双声道（立体声），播放的时候每个声道对应一个喇叭。声道用于模拟发声的位置，通常采用的都是立体声，在电影院等特定场景需要多声道，以便能够更真实地模拟实际场景。
- **采样时长**：音频数据的大小（Byte）=采样频率（Hz）x 采样时长（S）x（采样位数/8）x 声道数量

下面我们看一下具体的采样案例：

![pcm-sample.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/f51918c1.webp)

其中红色的曲线是要采集的声音波形，蓝色的点是采样量化以后的 `PCM` 数据。横轴是时间，对应采样频率，采样频率越高，数据越秘籍，越越接近原始波形；纵轴是采样位数，上图是 4 位，能表示的数值范围是 0-15，位数越多数据越精细化，越接近原始波形。

`PCM` 数据的存储比较简单，没有头部信息，将全部采样数据按照一定的顺序（如：双声道采用 `LRLR`）依序拼接，数据不经过任何压缩处理。

### 视频编码

采集得到的原始视频帧数据通常会被编码为 [RGB](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FRGB_color_model "https://en.wikipedia.org/wiki/RGB_color_model") 或者 [YUV](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FYUV "https://en.wikipedia.org/wiki/YUV") 格式。 RGB 三个字母分别代表了红（Red）、绿（Green）、蓝（Blue），这三种颜色称为三原色，将它们以不同的比例相加，可以产生多种多样的颜色。 `RGB` 图像中，每个像素点都有红、绿、蓝三个原色，其中每种原色都占用 8bit，也就是一个字节，那么一个像素点也就占用 24bit，也就是三个字节。一张 1280x720 大小的图片，就占用 1280x720x3/1024/1024=2.63MB 存储空间。

`YUV` 颜色编码采用的是 `明亮度`、`色度` 和 `浓度` 来指定像素的颜色。 ![rgb-to-yuv.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/696c17e7.webp)

`YUV` 与 `RGB` 的相互转换如下： ![rgb-yuv.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/4d481cdf.webp)

以上转换的格式就是 `YUV 4:4:4` 采样，即完全采样。 转换为 `YUV` 是为了进行采样存储，`YUV` 有很多种采样算法，我们以 `YUV 4:2:2` 为例来看一下是怎么实现体积压缩的。

假设图像像素为：\[Y0 U0 V0\]、\[Y1 U1 V1\]、\[Y2 U2 V2\]、\[Y3 U3 V3\]

`YUV 4:4:4` 采样如下： ![yuv-444.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/350cbe40.webp)

**其中，Y 分量用叉表示，UV 分量用圆圈表示。**
采样的码流为：Y0 U0 V0 Y1 U1 V1 Y2 U2 V2 Y3 U3 V3
最后映射出的像素点依旧为：\[Y0 U0 V0\]、\[Y1 U1 V1\]、\[Y2 U2 V2\]、\[Y3 U3 V3\]
可以看到这种采样方式的图像和 `RGB` 颜色模型的图像大小是一样，并没有达到节省带宽的目的。

然后我们再看一下 `YUV 4:2:2` 采样： ![yuv-422.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/af16e6fe.webp)

采样的码流为：Y0 U0 Y1 V1 Y2 U2 Y3 V3
其中，每采样过一个像素点，都会采样其 Y 分量，而 U、V 分量就会间隔一个采集一个。
最后映射出的像素点为 \[Y0 U0 V1\]、\[Y1 U0 V1\]、\[Y2 U2 V3\]、\[Y3 U2 V3\]

采样的码流映射为像素点，还是要满足每个像素点有 Y、U、V 三个分量。
但是可以看到，第一和第二像素点公用了 U0、V1 分量，第三和第四个像素点公用了 U2、V3 分量，这样就节省了图像空间。
一张 1280x720 大小的图片，在 `YUV 4:2:2` 采样时的大小为：（1280x720x8+1280x720x0.5x8x2/8/1024/1024=1.76 MB，相比于 `RGB` 节省了三分之一的存储空间。

**注意：**`YUV` 不完全采样本身是有损的，之所以能够这么做，主要有两个原因：其一，人眼对明亮度敏感但对色度/浓度不敏感；其二，相邻像素点之间的色相/浓度往往是比较接近的，直接复用对最终的图片质量影响很小。

## 压缩

不管是原始音频编码 `PCM` 还是视频编码 `RGB/YUV`，存储的是原始编码数据，没有经过任何压缩处理，体积很大，不利于存储或者传输。 而音频及视频都是有其独特的数据特征的，使用通用的 `zip` 或者 `rar` 也能压缩一定的体积，但是效果不尽人意，所有出现了大量的专门针对音频或者视频的压缩算法。

### 音频压缩

我们以 `CD` 音质为例，采样深度为 16 位，采样频率为 44.1kHz，声道数为 2，那么：

- **比特率**\=采样率 x 采样深度 x 通道数=44100x16\*2=1378.123kbps
- **3 分钟音频大小**\=3x60x1378.125/8/1024=30.28MB

我们日常听歌使用的 `.mp3` 一首歌大概也就 3-5MB，这就是压缩的作用了。 压缩分位两类：无损压缩和有损压缩。无损压缩通过优化数据的排列或组合实现，优点是可以根据规则完整地复原数据，缺点就是压缩率有限。有损压缩是通过去除一些非必要或者冗余的数据达到减少数据的目的，优点是压缩率比较高，缺点就是有部分信息丢失。

**常用的无损音频压缩格式包括：**

- [FLAC, Free Lossless Audio Codec](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFLAC "https://en.wikipedia.org/wiki/FLAC")：免费开源的无损音频编码，能减少 50-70\%的体积，跟压缩选项有关。源码在[这里](https://link.juejin.cn?target=https%3A%2F%2Fftp.osuosl.org%2Fpub%2Fxiph%2Freleases%2Fflac%2F "https://ftp.osuosl.org/pub/xiph/releases/flac/") ![flac-option.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/e9d2a540.webp)
- [ALAC, Apple Lossless Audio Codec](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FApple_Lossless "https://en.wikipedia.org/wiki/Apple_Lossless")：苹果无损音频编码，已于 2011 年 10 月 26 日以 [Apache License](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FApache_License "https://zh.wikipedia.org/wiki/Apache_License") 协议开源，能减少 40-60\%的体积。源码在[这里](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacosforge%2Falac "https://github.com/macosforge/alac")。

**有损音频压缩格式包括：**

- [MP3, MPEG-1 Audio Layer III or MPEG-2 Audio Layer III](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMP3 "https://en.wikipedia.org/wiki/MP3")：是最常见的音频编码格式，兼容性最好，其压效果可以通过调整比特率实现数据大小与音质之间的平衡（PS：与 MP3 相关的专利已于 2017 年 4 月 16 日全数过期）。即使 `MP3` 是一种很优秀的压缩格式，但由于设计的限制（比特率最大 320kbs，采样频率最高 48kHz，频谱小于 15kHz 等），目前已经在逐步被一些新的编码格式（如：`ACC`、`Opus`）取代，比如 `hls` 中就不再推荐使用 `mp3` 编码音频。
- [ACC](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAdvanced_Audio_Coding "https://en.wikipedia.org/wiki/Advanced_Audio_Coding")：被设计作为 `MP3` 的继任者，在相同比特率下，通常会比 `MP3` 有更好的声音质量。支持 48 个高至 96kHz 的全宽带声道，16 个 120Hz 的低频声道，不多于 16 个耦合通道及数据流。目前已经成为很多平台（`YouTube`、`iPhone` 等）的默认选项，并得到越来越多平台的支持。
- [Opus](https://en.wikipedia.org/wiki/Opus_(audio_format))：是一个[开放格式](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E9%2596%258B%25E6%2594%25BE%25E6%25A0%25BC%25E5%25BC%258F "https://zh.wikipedia.org/wiki/%E9%96%8B%E6%94%BE%E6%A0%BC%E5%BC%8F")，比 `MP3`、`ACC` 等常见格式有更低的延迟和更高的压缩率，而且使用上没有任何专利或限制，但目前支持度比较有限，Mac/iOS 上只有 `.caf` 容器支持。编码标准文档在[这里](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc6716 "https://datatracker.ietf.org/doc/html/rfc6716")。 ![opus-support.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/14326c63.webp)

音频编码格式非常多，每一种都涉及大量的细节，在此不展开讨论，更多音频压缩格式参考 [Audio file format](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAudio_file_format "https://en.wikipedia.org/wiki/Audio_file_format")。

### 视频压缩

视频采集得到的原始数字数据会被简单地编码为 `RGB` 或者 `YUV`，体积很大。以 1280x720 尺寸视频为例，假设视频帧率为 30，那么一秒钟的视频采用 `RGB` 编码的大小为：30x2.63MB=4734MB=78.90MB，即使使用有损的 `YUV 4:2:0` 编码，也会有 39.45MB，在线观看这样的视频至少需要**315.6Mb**的带宽，这对于绝大多数用户来说简直是天文数字，这还只是普通高清视频，`2K` 或者 `4K` 就更夸张了。

实际应用中，需要将数据进一步压缩，以便存储、传输和使用。 视频压缩算法很多，如：[H.264](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAdvanced_Video_Coding "https://en.wikipedia.org/wiki/Advanced_Video_Coding")、[H.265](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHigh_Efficiency_Video_Coding "https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding")、[VP8](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FVP8 "https://en.wikipedia.org/wiki/VP8")、[VP9](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FVP9 "https://en.wikipedia.org/wiki/VP9") 等，更多的编码格式参考 [Video coding format](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FVideo_coding_format "https://en.wikipedia.org/wiki/Video_coding_format")。

下面我们通过目前使用最广泛的 `H.264` 算法介绍一下视频压缩的过程。

- 帧内压缩：处理空间冗余，采用预测编码。将一张图片分成 16x18、8x8 或 4x4 的块，因为一张图片的一个相邻区域通常不会有太大的变化，所以可以预测这个块内的值都是同一个值 `R0`，然后再计算块内其他每个点真实值与预测值的差，仅记录有差值的点即可，这样就减少了数据的大小，解码的时候通过预测值及差值就可以完整地恢复原来的数据，所以这个过程是无损的。
- 帧间压缩：处理时间冗余，视频前后帧之间通常绝大部分是相同，只有少部分运动的对象位置会有变化，所以可以通过记录差值而不是全部信息来减少体积。`H.264` 编码中，将视频帧分成了如下几种类型：
  - I 帧：关键帧，是一个张完整的画面，可以独立解码，供其他帧参考
  - P 帧：前向预测帧，无法独立解码，需要参看前面的 I 帧或者 P 帧才能还原画面
  - B 帧：双向预测帧，无法独立解码，需要参考前面的 I/P 帧和后面的 I/P 帧才能还原画面
  - IDR 帧：也是关键帧，可以独立解码，与 I 帧的区别是，IDR 帧强制后续的帧不再参考 IDR 帧之前的帧，前面的缓冲将被清空，重新开始一个序列，用于避免数据异常后持续影响后续的帧。
- DCT 变换：数据预处理，利用 `DCT` 变换具有很强的“能量集中”特性，经过 `DCT` 变换后，数据能量聚集在矩阵的左上方（低频信号），低能量的数据（高频信号）聚集在右下角，这个转换过程本身并没有减少数据。
- 量化处理：对 `DCT` 转换以后的数据进行量化处理，是一个有损过程，会将不太影响图片质量的高频信号（右下角）变为 0，从而减少体积。
- CABAC 压缩：处理统计冗余，基于统计分布的重新编码压缩，属于无损压缩。

## 打包

媒体资源通常体积会比较大，有些甚至是动态新增的（比如直播流），所以会有一系列的流媒体协议（如：`hls`、`dash` 等）用于预定媒体资源的分段传输方式，以便能够边下边播，并能够利用 `CDN` 进行分发。常用的打包方式有：[ts, MPEG-2 Transport Stream](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fstandard%2F75928.html "https://www.iso.org/standard/75928.html") 和 [fmp4, fragmented MPEG-4](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fstandard%2F79110.html "https://www.iso.org/standard/79110.html")。不管是 `ts` 还是 `fmp4` 都可以将音频和视频数据一起进行打包，音频和字幕也是可以单独进行传输而不用跟视频资源一起打包的。

## 封装

音频、视频从采集到编码到压缩，都是分开处理的，字幕更是一个独立的存在。在需要传输并呈现给用户的时候，我们需要将相关的音频、视频、字幕进行的封装，这样才能达到同步的效果。把这种存放音频、视频、字幕的容器叫做封装格式，就是我们常见的一些视频文件格式，如：`.mp4`、`.m3u8`、`.mpd`、`.flv` 等。

## 转码

常用的标准视频封装格式（如：`.mp4`、`.m3u8` 等），浏览器默认的 `video` 播放器就可以直接播放，整个的解封/解码/转码/同步/渲染全部由浏览器原生支持。如果是自定义的视频流（自定义加密）或者需要做浏览器兼容，则需要进行数据的解码/转码/同步等流程控制，其目的就是要把流媒体数据重新组装成播放器能够正常播放的数据格式。

`Web` 提供了一系列的标准接口，可以用于操作视频流数据，通过 `Uint8Array` 对媒体数据进行解码或重组，通过 [EME](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2F2017%2FREC-encrypted-media-20170918%2F "https://www.w3.org/TR/2017/REC-encrypted-media-20170918/") 进行 [DRM](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital_rights_management "https://en.wikipedia.org/wiki/Digital_rights_management") 解密，通过 [MSE](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fmedia-source%2F "https://www.w3.org/TR/media-source/") 对重组的媒体数据关联到播放器。

常见的两种播放器（[hls.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvideo-dev%2Fhls.js%2F "https://github.com/video-dev/hls.js/") 和 [flv.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FBilibili%2Fflv.js%2F "https://github.com/Bilibili/flv.js/")）就是利用这些标准接口实现对 `hls` 和 `flv` 视频流到 `mp4` 的转码，并使用默认 `video` 播放器进行播放的，两者的工作原理类似，我们看一下 `hls.js` 的技术架构即可一探究竟。 ![hls.js.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/4b764178.webp)

## 播放

上面提到，标准的视频封装格式，浏览器默认的 `video` 标签就可以直接播放了，在移动端 `.mp4`、`.m3u8` 都有良好的兼容性，PC 端 chrome 浏览器不支持 `.m3u8`，需要通过 `MSE` 协议进行扩展支持，有非常成熟的播放第三方库（如：`hls.js`、`video.js` 等），`.flv` 在移动端和 PC 端没有原生支持，逐步被淘汰，不过由于历史原因，也还有大量的应用，目前基本不再使用 `flash` 技术，也都是通过 `MSE` 协议进行扩展支持，也有比较成熟的第三方库（如：`flv.js`）可以很好地支持。

说完了常规的标准封装格式，我们来说一点非常规的情况，毕竟业务是多种多样，需求是千变万化的。非常规的需求主要体现在两个方面：防爬和个性内容注入，涉及到内容修改的场景都需要定制化的播放流程。个性化的内容注入包括提示信息或者广告内容等，应用场景也还比较有限，广告内容一般是阻断式的，防止用户跳过。下面重点说一下防爬机制。

## 防爬

优质的视频资源生产都是有刚性成本的，大量的优质资源往往是公司的核心资产，甚至是核心堡垒。 所以，对视频资源的防爬是视频服务平台应该重点防范的事项。防爬归根到底也就两个手段：加密和频控。 加密是为了防止竞争对手低成本获取资源，频控是预防资源被大规模盗取。

频控可以很简单，比如限制特定 IP/用户的访问频次，或者通过给资源链接加验签防止盗链。当然也可以很复杂，可以根据用户的访问指纹/时间/频率等指标，建立用户行为模型，智能识别机器人抓取行为，频控虽然是防爬取最有效的方案，但其本身跟多媒体技术关联不大，不展开讨论，下面重点聊一下加密。

加密答题上可以分为两类：标准加密和自定义加密。

下面我们以 `hls` 协议为例介绍加密过程，`hls` 格式将多媒体数据封装成一个纯文本的 `.m3u8` 索引文件（参考 [M3u File Format](https://link.juejin.cn?target=https%3A%2F%2Fdocs.fileformat.com%2Faudio%2Fm3u%2F "https://docs.fileformat.com/audio/m3u/")），索引文件会列出媒体资源的分段数据的打包流媒体资源（如 `.ts`），这个 `.ts` 文件就是可以整体进行对称加密的。在生产 `hls` 资源的时候，可以指定加密算法及秘钥 `key`，在生成的索引 `.m3u8` 索引文件中会有一个 `#EXT-X-KEY` 标签，用于制定解密算法及获取秘钥 `key` 的接口地址，播放器加载完索引文件后就回去请求接口获取解密密钥 `key`，后续所有的 `.ts` 媒体资源下载完以后就可以通过制定的解密算法及密钥 `key` 完成数据的解密还原。这些过程都是 `hls` 协议本身就支持的，所以整个播放过程不需要特殊的处理。 当前如果是通过 `MSE` 扩展协议进行播放的话需要自行处理，`hls.js` 播放器默认也是支持的。

我们看一下通过 `.mp4` 视频文件生成加密 `.m3u8` 的例子

```bash
  # 0. 安装ffmpeg
  # brew install ffmpeg

  # 1. 准备秘钥文件（encrypt.key）
  # 内容是任意字符串

  # 2. 准备关键信息文件（key_info.key）
  # 格式如下：
  # 第一行：请求URL，用于客户端获取密钥文件（）
  # 第二行：密钥文件文件路径（./encrypt.key）
  # 第三行：加密偏移向量IV（可选，默认0x00000000000000000000000000000000）

  # 3. mp4文件转码并加密
  # -hls_key_info_file 制定关键信息文件路径
  # -f 转换后的格式
  # -hls_time 每个ts片段的时长
  ffmpeg -i mp4.mp4 -hls_key_info_file ./key_info.key -hls_time 10 -f hls mp4.m3u8

  # 4. 会生成一个`.m3u8`文件及n个`.ts`文件
  # `.m3u8`文件的格式如下：
  #EXTM3U
  #EXT-X-VERSION:3
  #EXT-X-TARGETDURATION:17
  #EXT-X-MEDIA-SEQUENCE:0
  #EXT-X-KEY:METHOD=AES-128,URI="http://127.0.0.1:3000/key",IV=0x00000000000000000000000000000000
  #EXTINF:16.666667,
  mp40.ts
  #EXTINF:8.333333,
  mp41.ts
  #EXTINF:5.033333,
  mp42.ts
  #EXT-X-ENDLIST

  # 5. 客户端播放
  # 首先，会拉取`.m3u8`文件并解析出URI
  # 然后，请求请求URI获取密钥
  # 最后，会拉取.ts文件并用获取到的秘钥进行解密并播放
```

这种标准加密的流程，可以解决流媒体资源片段被重用的问题，结合秘钥接口进行频控，可以较好地保护媒体资源被低成本爬取。 但这种方案逆向成本并不大，核心还是要依赖频控，防止被大规模爬取，加密本身也仅限于一定程度防止对 `.ts` 资源的盗链。

上面说的标准加密基本上可以说只能放君子，难以防小人，如果有心爬取，只需要对加密原理了解一下就可以实施，成本很低。 所以，实际的业务中用的更多的是自定义加密，刚才提到的资源地址做验签其实也算是自定义加密范畴，但比较简单不再赘述，我们来说一下媒体内容的加密。视频内容加密包括两种：所以文件加密和视频内容加密。原理都一样，都是对内容进行对称加密，核心在于如何确保秘钥的安全，不同点在于成本，对索引文件加密对性能影响很小，对媒体流数据加密解密有一定的性能开销，也需要处理更底层的数据，对播放器技术要求更高。

在纯 `H5` 的场景，密钥的安全性保障比较困难，常用的手段无非就是对核心代码进行混淆、转换、干扰、方调试等处理，加大逆向的成本，参考 [JavaScript Obfuscator Tool](https://link.juejin.cn?target=https%3A%2F%2Fobfuscator.io%2F "https://obfuscator.io/")，国内一些大厂也有一定程度的引用，比如 `B站` 就使用了 [sojson](https://link.juejin.cn?target=https%3A%2F%2Fwww.sojson.com%2Fjsjiemi.html "https://www.sojson.com/jsjiemi.html") 这样的工具对加密的过程进行混淆。

在 `Native` 环境其实也面临类似的困境，默认的 `.apk` 或 `.ipa` 逆向成本并不比 `.js` 高多少，所以行业中就催生了 `应用加固` 的行当。各大平台厂商都提供了应用加固的服务，如：[百度应用加固](https://link.juejin.cn?target=https%3A%2F%2Fanquan.baidu.com%2Fproduct%2Fapprein "https://anquan.baidu.com/product/apprein")、[腾讯应用加固](https://link.juejin.cn?target=https%3A%2F%2Fwiki.open.qq.com%2Fwiki%2F%25E5%25BA%2594%25E7%2594%25A8%25E5%258A%25A0%25E5%259B%25BA "https://wiki.open.qq.com/wiki/%E5%BA%94%E7%94%A8%E5%8A%A0%E5%9B%BA")、[阿里应用加固](https://link.juejin.cn?target=https%3A%2F%2Fwww.aliyun.com%2Fproduct%2Fmobilepaas%2Fmpaas_ppm_public_cn%3Futm_content%3Dse_1009556471 "https://www.aliyun.com/product/mobilepaas/mpaas_ppm_public_cn?utm_content=se_1009556471")等等，技术原理参考 [APP 加固技术近几年的变化](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F260366073 "https://zhuanlan.zhihu.com/p/260366073")。上加固处理，可以极大地提高逆向成本。这就是为什么在 `hybrid` 场景，一般会依赖 `Native` 完成加解密操作的原因，相对比较安全。

以上都属于应用级别的安全机制，原则上都是能够被逆向的，没有绝对的安全。关于数字内容安全，还有更高安全级别的标准方案，参考[数字版权管理](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E6%2595%25B0%25E5%25AD%2597%25E7%2589%2588%25E6%259D%2583%25E7%25AE%25A1%25E7%2590%2586 "https://zh.wikipedia.org/wiki/%E6%95%B0%E5%AD%97%E7%89%88%E6%9D%83%E7%AE%A1%E7%90%86")，在国外很多知名厂商都有应用，如：`亚马逊`、`AT&T`、`Apple Inc.`、`Netfix`、`Google`、`BBC`、`微软` 等，国内云厂商也有一定的支持，参考腾讯云[「DRM 视频加密技术-数字版权管理解决方案」](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzIzMjY3MjYyOA%3D%3D%26mid%3D2247484007%26idx%3D1%26sn%3D793da31aad530c8585fbffc053f4fc2a%26chksm%3De8901e7cdfe7976afb4bf31d7e0ec20cc01f208263c7aae37e2980b6b6190eec584893e46b0d%26scene%3D0%23rd "https://mp.weixin.qq.com/s?__biz=MzIzMjY3MjYyOA==&mid=2247484007&idx=1&sn=793da31aad530c8585fbffc053f4fc2a&chksm=e8901e7cdfe7976afb4bf31d7e0ec20cc01f208263c7aae37e2980b6b6190eec584893e46b0d&scene=0#rd")，阿里云[「DRM 加密」](https://link.juejin.cn?target=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F187586.html "https://help.aliyun.com/document_detail/187586.html")。`DRM` 的原理是将安全秘钥的协商和解密过程由应用转移到了更底层（浏览器/操作系统），甚至直接由专门的硬件设备进行支持，安全性相对更高，但仍然存在安全缺陷，参考 [Chrome CDM 框架重大缺陷，DRM 视频轻易复制](https://link.juejin.cn?target=https%3A%2F%2Fwww.52pojie.cn%2Fthread-609243-1-1.html "https://www.52pojie.cn/thread-609243-1-1.html")、[Google's Widevine L3 DRM cracked by a security researcher](https://link.juejin.cn?target=https%3A%2F%2Fcyware.com%2Fnews%2Fgoogles-widevine-l3-drm-cracked-by-a-security-researcher-eaed58ca "https://cyware.com/news/googles-widevine-l3-drm-cracked-by-a-security-researcher-eaed58ca")。

综上，不管用什么机制或策略，没有绝对的安全，都只是相对安全。在特定业务场景下，需要结合资源的重要程度选择适当的安全机制，以达到一个合理的性价比。国内主流的做法还是基于 `水印 + 自定义的加密 + 频控` 组合方式做自我保护，这也算是性价比比较高的方式了。

## 应用

点播和直播在技术和协议栈上目前基本是一致的，可以互通，实时音视频的差异比较大，除了最基本的音视频编码相同以外，整个传输控制流程都完全不一样。

点播和直播目前常用的媒体流协议包括：`MP4`、`HLS`、`DASH`、`RTMP`，这几种技术的对比如下：

| 方案 | 优势                            | 劣势                                                      |
| ---- | ------------------------------- | --------------------------------------------------------- |
| HLS  | 支持度高；HTTP 协议；自适应网络 | 专利保护（PC Chrome 不支持）；                            |
| DASH | 开源协议；HTTP 协议；网络自适应 | 兼容性不好（依赖 `MSE`）；                                |
| FMP4 | 兼容性好；HTTP 协议；           | 不能自适应网络；                                          |
| RTMP | 低延迟；                        | 不能自适应网络；不能利用 CDN；使用 TCP 协议；逐步被放弃； |

目前 `HLS` 应该是主流的选择，因为其在移动端有良好的兼容性，PC 端也有成熟的兼容方案（如：`video.js`），还有一个原因是 `hls` 也便于进行加密处理。

实时音视频目前基本都是通过 `WebRTC` 实现，这是一套完整的解决方案，与普通的视频服务关联不大，下面重点聊一下。 `WebRTC` 核心的亮点是低延时，这对于实时音视频是最核心的诉求，影响实时音视频体验的延迟因素比较多，我们重点关注网络相关的传输延迟，主要包括：接通延迟、通话延迟。

- 接通延迟：被叫方接受通话后，多久能收到多方的音视频，这个延迟用户体验感官比较明显，如果延迟高就会出现接通后长时间没有反应
- 通话延迟：体现为在通话过程中画面或者声音不连贯，这是影响体验最重要的方面，大多数优化也是也是针对通话延迟的

我们看一下各种实时传输协议的延迟情况：

| 延迟     | RTMP/TCP                                                                                                            | RTMP/QUIC                                                                       | WebRTC                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------- |
| 接通延迟 | + 通知延迟（1RTT） + 握手延迟（3RTT） + 发送延迟（0.5RTT） + 转发延迟（0.5RTT） + 控制协议延迟（2+RTT） +TCP 慢启动 | + 通知延迟（1RTT） + 握手延迟（3RTT） + 发送延迟（0.5RTT） + 转发延迟（0.5RTT） | + 通知延迟（1RTT） + 发送延迟（0.5RTT） |
| 通话延迟 | + 发送延迟（0.5RTT） + 转发延迟（0.5RTT） +TCP 对首阻塞                                                             | + 发送延迟（0.5RTT） + 转发延迟（0.5RTT）                                       | + 发送延迟（0.5RTT）                    |

理想情况下（`P2P` 通信），`WebRTC` 协议在通话过程中只有 `0.5RTT` 的时延。在实际应用中大多需要通过服务端进行中转（并不主要因为 `P2P` 连通问题，主要是需要进行视频存档或者进行转码），会有 `1RTT` 的时延。

`WebRTC` 的通信连接/通信过程依赖一个 [ICE](https://link.juejin.cn?target=https%3A%2F%2Ftools.ietf.org%2Fpdf%2Frfc8445.pdf "https://tools.ietf.org/pdf/rfc8445.pdf") 框架完成，整体架构如下： ![ice.jpeg](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/eac9ee33.webp)

- **STUN Server**: 负责 IP 发现及 NAT 类型检测及 [NAT 穿透](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FNAT_traversal "https://en.wikipedia.org/wiki/NAT_traversal")，检测过程如下： ![nat-check.jpeg](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/6a86ee1a.webp)

`NAT穿透` 不是任何情况都能成功的，根据之前业务中的实际统计情况，成功率大概在 `89%` 左右，各 `NAT` 类型原则上能否穿透的关系如下： ![nat-tranversal.jpeg](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/48f7214a.webp)

- **TURN Server**: 负责在无法完成 P2P 连接的情况下中继媒体数据，实际业务场景还会涉及到录制、转码、合成等一些列的业务需求，所以通常会是一个比较重的服务。
- **Gateway Server**: 属于信令服务，负责建立通信双方信息（如：[Candidate](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FRTCIceCandidate "https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate")、[SDP](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSession_Description_Protocol "https://en.wikipedia.org/wiki/Session_Description_Protocol") 等）交换，话双方的通信，房间的创建、状态维护及销毁等过程的协调和管理。

除了以上几部分，实际业务中通常还有单独的业务服务（`Service Server`），用于通讯各方的通信通知（确定谁跟谁通信）。

_PS：[SRUN Server](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3489 "https://datatracker.ietf.org/doc/html/rfc3489") 和 [TURN Server](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8656 "https://datatracker.ietf.org/doc/html/rfc8656") 是标准化的服务，有成熟的公共服务可以选用，参考 [STUN+TURN servers list](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fyetithefoot%2F7592580 "https://gist.github.com/yetithefoot/7592580")，公共的服务一般只用于 demo，为了稳定及数据隐私，通常业务需要自行实现，有开源代码可用，参考 [Free open source implementation of TURN and STUN Server](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoturn%2Fcoturn "https://github.com/coturn/coturn")。_

`WebRTC` 接通/断开的时序大致如下： ![room.png](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_ucxkusi0mv9chnun/080b0ffe.webp)

_PS: 关于 `WebRTC` 部分，如果想了解更多细节，建议参看《WebRTC 音视频实时互动技术：原理、实践与源码分析》_

## 参考

- [Video coding format](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FVideo_coding_format "https://en.wikipedia.org/wiki/Video_coding_format")
- [Analog-to-digital converter](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAnalog-to-digital_converter "https://en.wikipedia.org/wiki/Analog-to-digital_converter")
- [Digital-to-analog converter](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital-to-analog_converter "https://en.wikipedia.org/wiki/Digital-to-analog_converter")
- [Pulse-code modulation](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPulse-code_modulation "https://en.wikipedia.org/wiki/Pulse-code_modulation")
- [WebVTT](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FWebVTT "https://en.wikipedia.org/wiki/WebVTT")
- [MP3](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMP3 "https://en.wikipedia.org/wiki/MP3")
- [ACC](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FACC "https://en.wikipedia.org/wiki/ACC")
- [FLAC](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFLAC "https://en.wikipedia.org/wiki/FLAC")
- [ALAC](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FApple_Lossless "https://en.wikipedia.org/wiki/Apple_Lossless")
- [Opus\_\(audio_format\)](https://en.wikipedia.org/wiki/Opus_(audio_format))
- [Advanced Video Coding](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAdvanced_Video_Coding "https://en.wikipedia.org/wiki/Advanced_Video_Coding")
- [High Efficiency Video Coding](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHigh_Efficiency_Video_Coding "https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding")
- [HTTP Live Streaming 2nd Edition draft-pantos-hls-rfc8216bis-09](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Fdraft-pantos-hls-rfc8216bis "https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis")
- [Information technology — Dynamic adaptive streaming over HTTP \(DASH\) — Part 1: Media presentation description and segment formats](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fobp%2Fui%2F%23iso%3Astd%3Aiso-iec%3A23009%3A-1%3Aed-4%3Av1%3Aen "https://www.iso.org/obp/ui/#iso:std:iso-iec:23009:-1:ed-4:v1:en")
- [Information technology — Coding of audio-visual objects — Part 14: MP4 file format](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fstandard%2F79110.html "https://www.iso.org/standard/79110.html")
- [Information technology — Generic coding of moving pictures and associated audio information — Part 1: Systems](https://link.juejin.cn?target=https%3A%2F%2Fwww.iso.org%2Fstandard%2F75928.html "https://www.iso.org/standard/75928.html")
- [HLS vs DASH vs MP4 vs MPEG-TS Linear vs RTMP for Streaming](https://link.juejin.cn?target=https%3A%2F%2Fwww.zype.com%2Fblog%2Fhls-vs-dash-vs-mp4-vs-mpeg-ts-linear-vs-rtmp-for-streaming "https://www.zype.com/blog/hls-vs-dash-vs-mp4-vs-mpeg-ts-linear-vs-rtmp-for-streaming")
- [Packaging HTTP Live Streaming with fragmented MP4 \(fMP4 HLS\)](https://link.juejin.cn?target=https%3A%2F%2Fdocs.unified-streaming.com%2Fdocumentation%2Fpackage%2Ffmp4-hls.html "https://docs.unified-streaming.com/documentation/package/fmp4-hls.html")
- [RTP: A Transport Protocol for Real-Time Applications](https://link.juejin.cn?target=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3550 "https://datatracker.ietf.org/doc/html/rfc3550")
- [WebRTC](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebrtc%2F "https://www.w3.org/TR/webrtc/")
- [Interactive Connectivity Establishment \(ICE\): A Protocol for Network Address Translator \(NAT\) Traversal](https://link.juejin.cn?target=https%3A%2F%2Ftools.ietf.org%2Fpdf%2Frfc8445.pdf "https://tools.ietf.org/pdf/rfc8445.pdf")
- [Encrypted Media Extensions](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3.org%2FTR%2F2017%2FREC-encrypted-media-20170918%2F "https://www.w3.org/TR/2017/REC-encrypted-media-20170918/")
- [Digital rights management](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDigital_rights_management "https://en.wikipedia.org/wiki/Digital_rights_management")
- [APP 加固技术近几年的变化](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F260366073 "https://zhuanlan.zhihu.com/p/260366073")
- [Chrome CDM 框架重大缺陷，DRM 视频轻易复制](https://link.juejin.cn?target=https%3A%2F%2Fwww.52pojie.cn%2Fthread-609243-1-1.html "https://www.52pojie.cn/thread-609243-1-1.html")
- [计算机如何“看懂”图片？达摩院提出新的研究方法](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F749037 "https://developer.aliyun.com/article/749037")
- 《WebRTC 音视频实时互动技术：原理、实践与源码分析》
