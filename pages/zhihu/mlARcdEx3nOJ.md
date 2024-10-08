---
title: 为什么说固态硬盘的4K性能很重要？
date: 2024-10-04T15:30:36.833Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/93032287
---
## 前言

很多对硬件有所了解的朋友，都知道把电脑的机械硬盘升级成固态硬盘，开机、打开程序 / 文件都会快很多；再深入一点的，知道看固态硬盘好不好，要看随机 4K 访问的性能；但如果再问，随机 4K 性能是什么？为什么要看随机 4K 性能？有些测试软件有好几个随机 4K 性能看哪个？能回答上来的人可能就不多了。

这篇文章，我给大家介绍一下操作系统是怎么访问一个硬盘上的文件的，了解了操作系统访问文件的过程，我们就会知道为什么固态硬盘的 4K 性能可以大幅提高访问文件的速度了 —— 而开机、打开程序 / 文件，对于硬盘来说，都不过是访问硬盘上不同的文件而已。

***

## 基础知识

### **1. 硬盘的扇区**

不管是机械硬盘还是固态硬盘，都有数百上千亿个基本存储单元 —— 机械硬盘是一组磁性分子，固态硬盘是单个的晶体管，它们的不同状态，代表着 1\~4 个 0 和 1 的组合。我们为了方便访问，会把若干个这样的组合作为硬盘的最小读写单位 —— 扇区（sector）。老式的机械硬盘一个扇区是 4096 位（bit，代表一个 0 或者 1），一个字节有 8 位，也就是 512 字节（Byte）。现代硬盘、固态一般一个扇区是 4096 个字节，也就是 4KB。固态硬盘里面其实不叫扇区，叫页（Page），现在有的闪存芯片一个 Page 是 8KB 甚至 16KB 的，但为了兼容性，操作系统访问物理硬盘的时候，通常还是使用 512 字节扇区来进行访问。这样一个扇区上的数据，很多文章中会说是一块（Block）数据，这也是很多地方把硬盘称之为块设备的原因（Block Device）。下文统一用扇区来指代。

### **2. 扇区寻址**

现代硬盘的寻址方式是 LBA（Logical Block Addressing，逻辑块寻址），操作系统不再关心某一个扇区的具体物理存储位置，而是由硬盘控制器对这些扇区进行编号，编号很简单，从 0 开始数，0，1，2，3，4，……，这样一直数下去，有多少扇区就告诉操作系统多少，然后操作系统要访问那个扇区的数据，就告诉硬盘控制器读取第几个扇区的数据。

### **3. 硬盘分区**

但一般来说，操作系统并不是直接把我们的文件的数据存放在某几个扇区上，而是对硬盘进行分区，然后给每个分区建立一个特定的文件系统，把文件数据存放在文件系统的存储单元上。所谓的分区，就是把某一段编号的扇区作为一个逻辑存储空间，例如下面是我一个 256GB 固态的分区情况：

```text
Model: ATA TOSHIBA THNSNJ25 (scsi)
Disk /dev/sdg: 500118192s
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start       End         Size        File system  Name      Flags
 1      2048s       332326911s  332324864s               zfs-root
 2      332326912s  466546687s  134219776s               l2arc
 3      466546688s  500101119s  33554432s                zil
 9      500101120s  500117503s  16384s                             boot, esp
```

整个硬盘一共有 500,118,192 个扇区，每个扇区 512B，分区 1 从第 2048 个扇区开始，第 332,326,911 扇区结束，一共有 332,324,864 个扇区也就是大概 160GB 不到；从第 332,326,912 扇区到第 466,546,687 扇区一共 134,219,776 个扇区的 64GB 是第二个分区。

根据不同的标准，硬盘的分区信息会记录在硬盘上的某些特定扇区上。常见的分区标准有 MBR（Master Boot Record，主引导记录）和 GPT（ GUID Partition Table，唯一标识分区表）。

### **4. 文件系统和文件系统的存储单元**

所谓文件系统（File System）是一种把硬盘扇区和我们实际操作的各种文件联系起来的一种数据结构，例如我在桌面上放了一个叫 “abc.txt” 的文件，通过文件系统，操作系统就可以知道这个文件的数据保存在硬盘上的哪些扇区。不同的操作系统会支持一种或者多种文件系统，例如我们常用的 Windows 10，就支持 FAT/FAT32、exFAT、NTFS、ReFS 这五种文件系统，我们可以在格式化某个分区的时候选择一种文件格式。

大部分文件系统都不是使用硬盘的物理扇区来访问数据，而是定义自己的存储单元；一个存储单元就是连续的若干个扇区。例如 Windows 最常用的 NTFS 文件格式，默认是 8 个扇区（格式化分区的时候可以选择其它）作为一个存储单元，每次读写数据以一个存储单元为最小读写单位。NTFS 里面管这么一个存储单元叫簇（Cluster），类似于扇区寻址，NTFS 给这些簇从 0 开始顺序编号。

***

## 操作系统如何访问一个 NTFS 分区中的文件？

下面正式开始，我给大家介绍在 Windows 中，是如何访问一个文件的。我这里用一个叫 WinHex 的软件进行操作。 **这一段可能需要一些 16 进制知识，有些朋友看不太懂的，直接看加粗的标题，知道这一步干嘛就可以了。**&#x20;

我要访问的文件是保存在桌面上的一个叫 ABC.txt 的文本文件，完整路径是 “C:\Users\User\Desktop\ABC.txt”：

![](https://pic1.zhimg.com/v2-f1a171f8ed82375fd6af3754aa5f71a0_b.jpg)

### **1. 读取硬盘的 0 扇区（分区表），找到文件所在分区起始扇区**

用 WinHex 打开物理硬盘，默认会显示第 0 个扇区的数据：

![](https://pic2.zhimg.com/v2-4fb968b610314d27aa6476a59d009787_b.jpg)

这个时候 WinHex 已经自己判断出这是一个使用 GPT 分区类型的硬盘，分了四个区。其中 C 盘是第 4 个分区，起始分区在 1,320,960 扇区。

### **2. 读取第四个分区第一个扇区，找到 $MFT 文件的起始簇**

我们定位到 C 盘第一个扇区，看看里面的内容：

![](https://pic4.zhimg.com/v2-705d36b8785b6a156b09d9c2fdf54cc9_b.jpg)

左边的 Offset 就是数据在硬盘上的偏移位置，单位是字节，1,320,960 个扇区就是 676,331,520 个字节，换成 16 进制就是 0x028500000。这堆数据很乱，WinHex 提供了一个 NTFS 引导扇区的查看模板，我们用这个模板来看一下。

![](https://picx.zhimg.com/v2-d51ba60a06a0904a00efafcbcd0be97f_b.jpg)

可以看到，这是一个使用 NTFS 文件系统的分区，每个扇区 512 字节，每个簇 8 个扇区。然后最重要的，是一个叫 $MFT 的文件，起始簇编号是 786,432。这个文件是 NTFS 文件系统最重要的一个文件，MFT 是 Master File Table，主要文件表的意思。我们所有的目录、文件的存放位置都记录在这个文件里面。

**3. 读取 $MFT 中的记录，找到根目录数据所在簇**

很容易计算到，C 盘的第 786,432 簇对应硬盘上的第 7,612,416 扇区，也就是偏移 0x0E85000000：

![](https://pic3.zhimg.com/v2-0b703772fbf2289b015459aa822cf8f6_b.jpg)

WinHex 也提供了 $MFT 里面记录的查看模板，但 MFT 的记录类型很多，有一些记录这个模板不能显示。从图片中我们可以看到，第 0 条记录是 $MFT 本身，上级节点，也就是 C: 盘的根目录在第 5 条记录。

然后可以看到，$MFT 自己的记录里面，有一个 80 属性，记录了这个文件的数据使用的簇。这个属性从偏移 0x0E8500100 开始

![](https://pic4.zhimg.com/v2-e0caf270501c9a47ac6c7a33c8d25689_b.jpg)

红框标出的 0x0E8500120 的数据是 0x40，意思是 $MFT 文件使用的簇记录从 0x0E8500100 开始第 0x40 个字节开始，也就是偏移 0x0E8500140。这里一共有四段，分别是：

* 32 40 57 00 00 0C
* 32 00 02 74 63 1F
* 32 80 09 1C 14 D5
* 31 40 E1 29 32
* 00 结尾表示后面没有其它数据了。

第一段中第一个字节的 XY，含义是接下来 X 个字节表示数据占多少簇，在后面的 Y 个字节表示起始簇的编号。32 40 57 00 00 0C 的意思是数据从分区第 0x0C0000 簇开始，使用了 0x5740 簇空间。$MFT 中每条记录长度固定是 1K，也就是这个分区中每一簇可以存放 4 条记录，这一段的最大记录号是 0x015D00。

第二段和第一段有一点区别，这里 Y 是 74 63 1F，表示第二段的第一簇是从第一段第一簇（0x0C0000）偏移 0x1F6374 簇，也就是分区的第 0x2B6374 簇。记录号从 0x015D01 到 0x016500。

第三段的 0xD5141C，类似第二段，但 0xD5 转换成二进制是 1101 0101，首位为 1，意味着这是个负数，所以完整的写法是 0xFFD5141C，计算下来第三段从分区的第 7790 簇开始。记录号从 0x016501 到 0x018B00。

第四段同第二段。

$MFT 每条记录是 1024 字节，也就是 2 个扇区，很容易就计算到根目录记录的扇区：

![](https://pic4.zhimg.com/v2-43ed960a086a2341f5895820fe650ab7_b.jpg)

记录号 5，因为是根目录，文件名是空的，有一个 A0 属性，长度 80 字节，非常驻数据 —— 非常驻的意思是，这个目录 / 文件的数据因为太大，保存在其它地方（足够小的会直接保存在 $MFT 里面）。这个属性就是 WinHex 没有解析完整的了，我们看看偏移 0x0E8501550 的具体数据：

![](https://pic1.zhimg.com/v2-01571c55bccf01d4032665719f9435f0_b.jpg)

从 0x0E8501550 向下 32 个（十六进制是 0x20）字节，也就是 0x0E8501570，数据是 48，这里的 48 是指根目录位置的位置，是在这个属性的数据从 0x48 开始，对应的数据是 11 01 24。

这个 A0 属性和前面 $MFT 自己记录的 80 属性一样，不再解释了。

### **4. 读取根目录的数据，找到 C:\Users 在 $MFT 中的记录号**

硬盘第 0x24 簇就是第 1,321,248 扇区，偏移 0x028524000

![](https://pic3.zhimg.com/v2-52e1674913c866e365475759bf6c16e2_b.jpg)

这里没有模板了，我们大致可以看到根目录下的几个文件名，这里红框标出的几个都是隐藏文件，平时看不到的。我们用搜索工具，在附近找到了 Users 这个文件夹的数据：

![](https://pica.zhimg.com/v2-9af8338912d509748c0c8870f9c366a6_b.jpg)

红框中前两个字节数据是 98 06，说明这个文件夹在 $MFT 的第 0x0698 条记录。

### **5. 读取 Users 在 $MFT 中的记录，找到数据所在簇**

计算 $MFT 的第 0x0698 条记录的偏移位置，定位过去

![](https://pic1.zhimg.com/v2-8b35965291e86426959bf54a16ba4fb2_b.jpg)

重复上面查看 A0 属性的步骤，找到 C:\Users 这个目录的数据，这里就不详述了；

### **6. 读取 C:\Users 数据，找到 C:\Users\User 目录在 $MFT 中的记录号**

### **7. 读取 C:\Users\User 目录在 $MFT 中的记录，找到数据所在簇**

### **8. 读取 C:\Users\User 目录的数据，找到 C:\Users\User\Desktop 目录在 $MFT 中的记录号**

### **9. 读取 C:\Users\User\Desktop 目录在 $MFT 中的记录**

这一步和上面有点不一样，我的桌面很干净，Desktop 目录数据很小，直接就放在 $MFT 记录中了，因此没有 A0 属性，只有一个 608 字节的 90 属性。

![](https://pic2.zhimg.com/v2-74880d244d0f67ba80e8ddbaaa5fecad_b.jpg)

很容易就在 90 属性的数据里面找到了 ABC.txt，在 $MFT 中的记录号是 0x016DD6：

![](https://pic1.zhimg.com/v2-f093a19758e7cca87c8cf0b05875f61c_b.jpg)

### **10. 找到 ABC.txt 在 $MFT 中的记录**

![](https://pic1.zhimg.com/v2-fc6e936591bae2a9551793b65088643c_b.jpg)

表示文件内容的 80 属性是常驻属性，直接看偏移 0x05B75928 的内容：

![](https://pic2.zhimg.com/v2-a38078156630781b5b3963b7590c9d27_b.jpg)

数据从属性第 0x018 个字节开始，一共 33 个字节。

### **11. 读取另一个比较大的文件**

如果换成另外一个大一点的文件，例如我放在桌面上一张叫 “背景.jpg” 的照片：

![](https://pica.zhimg.com/v2-faabf43373115eec5f41c88652b28966_b.jpg)

![](https://pic2.zhimg.com/v2-f3f6e48254d214c27001736446d505bd_b.jpg)

![](https://pica.zhimg.com/v2-771b9f8b5e08b60efe59bbdc425354b2_b.jpg)

从 80 属性可以看到，这张照片的数据和 $MFT 类似，分成了八段。然后我们需要有下一步分别读取这八段数据。

***

## 硬盘性能对读取数据的影响

从上面我那么啰嗦的过程可以看到，整个读取过程中，不算文件本身大小，我们起码对硬盘进行了 10 次的随机访问，文件系统每次访问的最小单元是 4K 大小的簇，需要额外读取 40K 数据 —— 如果这个文件放了更多层目录，这个次数和数据量会更多。而且事实上，这个过程还没有考虑权限问题。当你访问一个目录或者文件之前，操作系统还要从 $Secure 文件中查看你有没有权限访问这个文件。最起码还要多三次随机访问，如果是在企业环境中有大量的用户、组，可能还不止。 **每次访问都需要对上一次的访问结果进行计算后才知道下一次要访问哪些扇区，也就是单线程、单队列的随机 4K 访问。**&#x20;

如果用固态硬盘，例如我电脑上的这个 512G 的西数黑盘，单线程单队列的随机 4K 读取性能是这样的：

![](https://pic3.zhimg.com/v2-5b2fb72ce6b90a50eec6dc76ef55f882_b.jpg)

每秒钟可以进行 9790 次这样的操作，10 次耗时 1.02ms—— 对人类来说 1ms 几乎是很难感受到延迟的。

而我电脑上的一个 1TB 的笔记本机械硬盘，读取性能则是这样：

![](https://pic3.zhimg.com/v2-3cc24da7f93f4330fc149755c19d777a_b.jpg)

每秒钟只能进行 111 次这样的操作，10 次耗时 90.1ms，0.09 秒，已经能感受到明显的延迟了。

当然，Windows 会有磁盘缓存机制，不会每一次读取数据都需要从硬盘上读取，10 次访问可能实际只有 3\~4 次是真正需要从硬盘读取的。但是刚开机的时候是没有缓存的，而且运行一个程序，往往需要访问数十上百个文件 —— 这还没有算文件本身的数据传输时间。

另外，像 Windows 启动的时候，往往是多个服务一起运行，都需要访问硬盘上的数据，这个时候，就需要看硬盘的多线程深队列的 4K 随机性能。

***

## 其它

### **NVMe 和 SATA 固态**

NVMe 固态的性能提升是不小，但单队列单线程的随机 4K 性能并不像持续读取性能从 500MB/s 提升到 3GB/s 那样可以提高 5\~6 倍，再好的 NVMe 固态，也很少超过 70MB/s，而很多口碑不太好的 SATA 固态，也有 20MB/s 或者更高。算下来，就是 2ms 和 0.6ms 的区别，对于普通人来说也是很难感受到的。而且很多时候，这 2ms 还不一定够 CPU 完成对数据的处理 —— 除非是纯粹的测试软件或者简单的文件复制这种不怎么需要 CPU 参与的工作。就算 CPU 来得及处理，你的显示器也还没反应过来 ——240Hz 显示器两帧之间间隔 4.17ms，平均算 2.1ms 好了，要是 144Hz 甚至 60Hz 的显示器就更不用说了。

同样的，傲腾可以高达 200MB/s 以上的单队列单线程随机读取性能，可以把这个时间降低到 0.2ms，也不会在体验上有多大的影响。

### **各种磁盘加速软件以及傲腾、混合硬盘**

上面可以看到，影响我们访问时间的这些读取，数据量都很小，但对机械硬盘来说，寻道访问却有需要消耗不少时间。其中 $MFT 文件我们访问了很多次，即使仅仅把 $MFT 文件、一些常用目录的数据文件都放到内存或者固态硬盘上，对于提升机械硬盘的性能帮助是非常大的 —— 这就是各种磁盘加速软件的原理，例如商业收费的 PrimoCache，AMD 的 StormMI，Intel 的傲腾都是这样的 —— 当然，如果使用容量足够大的固态、傲腾当缓存，很多文件本身的数据也可以得到加速，性能进一步提升。现在淘宝上有一些 16G 的品牌机备件傲腾或者工包不到 50 就能买到，四舍五入等于不要钱，需要使用机械硬盘又有空闲 M2 插槽的，可以考虑入手一个了 ——AMD 的 StoreMI 也可以用的。
