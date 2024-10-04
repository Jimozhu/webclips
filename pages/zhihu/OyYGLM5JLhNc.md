---
title: 新闻上的文本分类：机器学习大乱斗
date: 2024-10-04T15:30:53.972Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/26729228
---
**目标**

* 从头开始实践中文短文本分类，记录一下实验流程与遇到的**坑**
* 运用多种机器学习（深度学习 + 传统机器学习）方法比较短文本分类处理过程与结果差别

**工具**

* 深度学习：keras
* 传统机器学习：sklearn

**参与比较的机器学习方法**

* CNN 、 CNN + word2vec
* LSTM 、 LSTM + word2vec
* MLP（多层感知机）
* 朴素贝叶斯
* KNN
* SVM
* SVM + word2vec 、SVM + doc2vec

第 1-3 组属于深度学习方法，第 4-6 组属于传统机器学习方法，第 7 组算是种深度与传统合作的方法，画风清奇，拿来试试看看效果

**源代码、数据、word2vec 模型下载**

[](https://link.zhihu.com/?target=https%3A//github.com/wavewangyue/text_classification)

> word2vec 模型文件（使用百度百科文本预训练）下载：[https://pan.baidu.com/s/13QWrN-9aayTTo0KKuAHMhw](https://link.zhihu.com/?target=https%3A//pan.baidu.com/s/13QWrN-9aayTTo0KKuAHMhw)\
> 提取码 biwh

**数据集**

> 搜狗实验室 搜狐新闻数据 下载地址：[http://www.sogou.com/labs/resource/cs.php](https://link.zhihu.com/?target=http%3A//www.sogou.com/labs/resource/cs.php)

**先上结果**

![](https://pic3.zhimg.com/v2-9a40a2ff55492dba0564d48fdf3d645a_b.jpg)

**实验结论**

* 引入预训练的 word2vec 模型会给训练带来好处，具体来说：（1）间接引入外部训练数据，防止过拟合；（2）减少需要训练的参数个数，提高训练效率
* LSTM 需要训练的参数个数远小于 CNN，但训练时间大于 CNN。CNN 在分类问题的表现上一直很好，无论是图像还是文本；而想让 LSTM 优势得到发挥，首先让训练数据量得到保证
* 将单词在 word2vec 中的词向量加和求平均获得整个句子的语义向量的方法看似 naive 有时真挺奏效，当然仅限于短句子，长度 100 以内应该问题不大
* 机器学习方法万千，具体选择用什么样的方法还是要取决于数据集的规模以及问题本身的复杂度，对于复杂程度一般的问题，看似简单的方法有可能是坠吼地

干货上完了，下面是实验的具体流程

## **0 数据预处理**

将下载的原始数据进行转码，然后给文本标类别的标签，然后制作训练与测试数据，然后控制文本长度，分词，去标点符号

哎，坑多，费事，比较麻烦

首先，搜狗实验室提供的数据下载下来是 xml 格式，并且是 GBK （万恶之源）编码，需要转成 UTF8，并整理成 json 方便处理。原始数据长这个样：

![](https://pic1.zhimg.com/v2-584d7a2aaf5616ba645e1f8607a2e908_b.jpg)

这么大的数据量，怎么转码呢？先尝试利用 python 先读入数据然后转码再保存，可傲娇 python 并不喜欢执行这种语句。。。再尝试利用 vim 的 :set fileencoding=utf-8，乱码从███变成锟斤拷。。。

![](https://picx.zhimg.com/v2-f0760a208c5e8da8980782e72dbc300b_b.jpg)

经过几次尝试，菜鸡的我只能通过文本编辑器打开，然后利用文本编辑器转换编码。这样问题来了，文件大小 1.6G，记事本就不提了，Notepad 和 Editplus 也都纷纷阵亡。。。

![](https://picx.zhimg.com/v2-f0760a208c5e8da8980782e72dbc300b_b.jpg)

还好最后发现了 **UltraEdit**，不但可以打开，速度简直飞起来，转码后再整理成的 json 长这个样子：

![](https://picx.zhimg.com/v2-19fa491ddff3b388bed2a24a05877519_b.jpg)

UltraEdit 就是好就是秒就是呱呱叫

搜狗新闻的数据没有直接提供分类，而是得通过新闻来源网址的 url 来查其对应得分类，比如 [http://gongyi.sohu.com](https://link.zhihu.com/?target=http%3A//gongyi.sohu.com) 的 url 前缀对应的新闻类型就是 “公益类”。对着他提供的对照表查，1410000 + 的总数据，成功标出来的有 510000+，标不出来的新闻基本都来自 [http://roll.sohu.com](https://link.zhihu.com/?target=http%3A//roll.sohu.com)，这是搜狐的滚动新闻，乱七八糟大杂烩，难以确定是什么类

![](https://pic2.zhimg.com/v2-cbc3a75761c268ebb95e030db537e2c5_b.jpg)

对成功标出来的 15 个类的新闻，统计一下类别的分布，结果如下：

![](https://pic4.zhimg.com/v2-aefee97ca2964444f52796fafcb1d013_b.jpg)

分布比较不均，第 14 类和第 15 类的新闻很少，另外第 8 类和第 11 类一个新闻也没有

![](https://pic2.zhimg.com/v2-cbc3a75761c268ebb95e030db537e2c5_b.jpg)

所以最后选了剩下的 11 个类，每个类抽 2000 个新闻，按 4：1 分成训练与测试，如图

![](https://pic4.zhimg.com/v2-ae26e55ec01009115d9b5c9dbf13bec5_b.jpg)

11 个类分别是

![](https://pic3.zhimg.com/v2-f8f476c3725514593ae712495a355e14_b.jpg)

对这些新闻的长度进行统计结果如下：

![](https://picx.zhimg.com/v2-1c58ff49c5ab9f963122b556ac51c691_b.jpg)

横轴是新闻的长度，纵轴是拥有此长度的新闻数量。在长度为 500 字和 1600 字时突然两个**峰**，猜测是搜狐新闻的一些长度限制？？？

长度 0-100 的放大观察，分布还可以，说明如果基于这套数据做**短**文本分类，需要对原始文本进行固定长度的截取，长度 100 可能是个不错的选择

![](https://picx.zhimg.com/v2-8008a008ab67e5227f94011787040d63_b.jpg)

上一步选出来的训练新闻长这样，因为考虑到新闻标题的意义重大，这里就将新闻标题和新闻内容接到一起，用空格隔开，然后截取每条新闻的前 **100** 个字

![](https://picx.zhimg.com/v2-03e1620d6a8c82595837f51bd0b71fab_b.jpg)

一行是一条新闻，训练数据 17600 行，测试数据 4324 行。然后用 jieba 分词，分词后利用词性标注结果，把词性为‘x’（字符串）的去掉，就完成了去标点符号

![](https://pic4.zhimg.com/v2-795c99af36e7b126563f78d181f71a15_b.jpg)

jieba 真是好真是秒真是呱呱叫

最后得到以下结果文件：（1）新闻文本数据，每行 1 条新闻，每条新闻由若干个词组成，词之间以空格隔开，训练文本 17600 行，测试文本 4324 行；（2）新闻标签数据，每行 1 个数字，对应这条新闻所属的类别编号，训练标签 17600 行，测试标签 4324 行

## **1 CNN**

深度学习用的 keras 工具，操作简单易懂，模型上手飞快，居家旅行必备。keras 后端用的 Tensorflow，虽然用什么都一样

&#x20;**不使用预训练 word2vec 模型的 CNN：**&#x20;

首先一些先设定一些会用到的参数

```python
MAX_SEQUENCE_LENGTH = 100 # 每条新闻最大长度
EMBEDDING_DIM = 200 # 词向量空间维度
VALIDATION_SPLIT = 0.16 # 验证集比例
TEST_SPLIT = 0.2 # 测试集比例
```

第一步先把训练与测试数据放在一起提取特征，使用 keras 的 Tokenizer 来实现，将新闻文档处理成单词索引序列，单词与序号之间的对应关系靠单词的索引表 word\_index 来记录，这里从所有新闻中提取到 65604 个单词，比如 \[苟，国家，生死] 就变成了 \[1024, 666, 233] ；然后将长度不足 100 的新闻用 0 填充（在前端填充），用 keras 的 pad\_sequences 实现；最后将标签处理成 one-hot 向量，比如 6 变成了 \[0,0,0,0,0,0,1,0,0,0,0,0,0]，用 keras 的 to\_categorical 实现

```python
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils import to_categorical
import numpy as np

tokenizer = Tokenizer()
tokenizer.fit_on_texts(all_texts)
sequences = tokenizer.texts_to_sequences(all_texts)
word_index = tokenizer.word_index
print('Found %s unique tokens.' % len(word_index))
data = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)
labels = to_categorical(np.asarray(all_labels))
print('Shape of data tensor:', data.shape)
print('Shape of label tensor:', labels.shape)
```

再将处理后的新闻数据按 6.4：1.6：2 分为训练集，验证集，测试集

```python
p1 = int(len(data)*(1-VALIDATION_SPLIT-TEST_SPLIT))
p2 = int(len(data)*(1-TEST_SPLIT))
x_train = data[:p1]
y_train = labels[:p1]
x_val = data[p1:p2]
y_val = labels[p1:p2]
x_test = data[p2:]
y_test = labels[p2:]
print 'train docs: '+str(len(x_train))
print 'val docs: '+str(len(x_val))
print 'test docs: '+str(len(x_test))
```

然后就是搭建模型，首先是一个将文本处理成向量的 embedding 层，这样每个新闻文档被处理成一个 100 x 200 的二维向量，100 是每条新闻的固定长度，每一行的长度为 200 的行向量代表这个单词在空间中的词向量。下面通过 1 层卷积层与池化层来缩小向量长度，再加一层 Flatten 层将 2 维向量压缩到 1 维，最后通过两层 Dense（全连接层）将向量长度收缩到 12 上，对应新闻分类的 12 个类（其实只有 11 个类，标签 0 没有用到）。搭完收工，最后，训练模型，测试模型，一鼓作气，攻下高地。

```python
from keras.layers import Dense, Input, Flatten, Dropout
from keras.layers import Conv1D, MaxPooling1D, Embedding
from keras.models import Sequential

model = Sequential()
model.add(Embedding(len(word_index) + 1, EMBEDDING_DIM, input_length=MAX_SEQUENCE_LENGTH))
model.add(Dropout(0.2))
model.add(Conv1D(250, 3, padding='valid', activation='relu', strides=1))
model.add(MaxPooling1D(3))
model.add(Flatten())
model.add(Dense(EMBEDDING_DIM, activation='relu'))
model.add(Dense(labels.shape[1], activation='softmax'))
model.summary()
```

模型长这个样子

![](https://pic1.zhimg.com/v2-4d1f356ae3983fcfafa8adc66c1a21d4_b.jpg)

**问**：这里只使用了 1 层卷积层，为什么不多加几层？

**答**：新闻长度只有 100 个单词，即特征只有 100 维，1 层卷积加池化后特征已经缩减为 32 维，再加卷积可能就卷没了。 2 层 3 层也做过，效果都不好

**问**：为什么只训练 2 轮

**答**：问题比较简单，1 轮训练已经收敛，实验表明第 2 轮训练基本没什么提升

**问**：为什么卷积核为什么选择 250 个？

**答**：因为开心

![](https://pica.zhimg.com/v2-83d765d2b872cfd2f920f743de5ebb1c_b.jpg)

实验结果如下

![](https://pic2.zhimg.com/v2-8c9fdf283f5922fde1065c55867aaed5_b.jpg)

准确度 **0.81459521**

拥有 11 个分类的问题达到这个准确度，应该也不错（易满足）。并且搜狗给的数据本来也不是很好（甩锅）。可以看到在训练集上的准确度达到了 0.88，但是测试集上的准确度只有 0.81，说明还是有些过拟合。另外，整个模型需要训练的参数接近 1500 万，其中 1300 万都是 embedding 层的参数，说明如果利用 word2vec 模型替换 embedding 层，解放这 1300 万参数，肯定会让训练效率得到提高

&#x20;**基于预训练的 word2vec 的 CNN ：**&#x20;

参考资料

> keras 示例程序 pretrained\_word\_embeddings.py 代码地址\
> [https://github.com/fchollet/keras/blob/master/examples/pretrained\_word\_embeddings.py](https://link.zhihu.com/?target=https%3A//github.com/fchollet/keras/blob/master/examples/pretrained_word_embeddings.py)\
> 中文讲解地址（在 Keras 模型中使用预训练的词向量）\
> [http://keras-cn.readthedocs.io/en/latest/blog/word\_embedding/](https://link.zhihu.com/?target=http%3A//keras-cn.readthedocs.io/en/latest/blog/word_embedding/)

既然提到了 word2vec 可能会提高训练效率，那就用实验验证一下。 **（重点）（重点）（重点）** 正常的深度学习训练，比如上面的 CNN 模型，第一层（除去 Input 层）是一个将文本处理成向量的 embedding 层。这里为了使用预训练的 word2vec 来代替这个 embedding 层，就需要将 embedding 层的 1312 万个参数用 word2vec 模型中的词向量替换。替换后的 embedding 矩阵形状为 65604 x 200，65604 行代表 65604 个单词，每一行的这长度 200 的行向量对应这个词在 word2vec 空间中的 200 维向量。最后，设定 embedding 层的参数固定，不参加训练，这样就把预训练的 word2vec 嵌入到了深度学习的模型之中

```python
VECTOR_DIR = 'wiki.zh.vector.bin' # 词向量模型文件

from keras.utils import plot_model
from keras.layers import Embedding
import gensim

w2v_model = gensim.models.KeyedVectors.load_word2vec_format(VECTOR_DIR, binary=True)
embedding_matrix = np.zeros((len(word_index) + 1, EMBEDDING_DIM))
for word, i in word_index.items(): 
    if unicode(word) in w2v_model:
        embedding_matrix[i] = np.asarray(w2v_model[unicode(word)],
                                         dtype='float32')
embedding_layer = Embedding(len(word_index) + 1,
                            EMBEDDING_DIM,
                            weights=[embedding_matrix],
                            input_length=MAX_SEQUENCE_LENGTH,
                            trainable=False)
```

模型搭建与刚才类似，就是用嵌入了 word2vec 的 embedding\_layer 替换原来的 embedding 层

```python
from keras.layers import Dense, Input, Flatten, Dropout
from keras.layers import Conv1D, MaxPooling1D, Embedding
from keras.models import Sequential

model = Sequential()
model.add(embedding_layer)
model.add(Dropout(0.2))
model.add(Conv1D(250, 3, padding='valid', activation='relu', strides=1))
model.add(MaxPooling1D(3))
model.add(Flatten())
model.add(Dense(EMBEDDING_DIM, activation='relu'))
model.add(Dense(labels.shape[1], activation='softmax'))
model.summary()
#plot_model(model, to_file='model.png',show_shapes=True)
model.compile(loss='categorical_crossentropy',
              optimizer='rmsprop',
              metrics=['acc'])
model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=2, batch_size=128)
model.save('word_vector_cnn.h5')
print model.evaluate(x_test, y_test)
```

模型长相跟之前一致，实验输出与测试结果如下

![](https://pica.zhimg.com/v2-295cbca3819f1ce40b04725c4a9d39ea_b.jpg)

准确度 **0.85336374**

相比不使用 word2vec 的 cnn，过拟合的现象明显减轻，使准确度得到了提高。并且需要训练的参数大大减少了，使训练时间平均每轮减少 20s 左右

![](https://pic2.zhimg.com/v2-c9a7f16ba6aece43cdbeb0d7a63847b7_b.jpg)

## **2 LSTM**

终于到了自然语言处理界的大哥 LSTM 登场，还有点小期待

![](https://pic2.zhimg.com/v2-07a0d36f39780286a44aa3ffaa816bb5_b.jpg)

&#x20;**不使用预训练的 word2vec 模型的 LSTM：**&#x20;

特征提取以及 embedding 的过程跟 CNN 的实验一致。接下来的 LSTM 层的功能在最终效果上（或许）可以理解成将一个序列的词向量压缩成一个句向量。每个新闻经过 embedding 层后得到一个 100 x 200 的 2 维向量，通过将这 100 个词向量按前后顺序逐个输入 LSTM 层中，最后输出一个 1 维的长度 200 的向量，最后一个全连接层将长度收缩到 12

```python
from keras.layers import Dense, Input, Flatten, Dropout
from keras.layers import LSTM, Embedding
from keras.models import Sequential

model = Sequential()
model.add(Embedding(len(word_index) + 1, EMBEDDING_DIM, 
          input_length=MAX_SEQUENCE_LENGTH))
model.add(LSTM(200, dropout=0.2, recurrent_dropout=0.2))
model.add(Dropout(0.2))
model.add(Dense(labels.shape[1], activation='softmax'))
model.summary()
```

模型长这样

![](https://picx.zhimg.com/v2-7e0bf24ad44a2221a2a745be7aa94661_b.jpg)

大哥开动！

![](https://pic4.zhimg.com/v2-d9377e3e6b070c364d666f642684dc91_b.jpg)

准确度** 0.70627138**

![](https://picx.zhimg.com/v2-536817508db38857d3b8452ae7a4895f_b.jpg)

并没有期待中那么美好。。。原因是这点小数据量，并没有让 LSTM 发挥出它的优势。并不能给大哥一个奔驰的草原。。。并不能让大哥飞起来。。。另外使用 LSTM 需要训练的参数要比使用 CNN 少很多，但是训练时间是 CNN 的 2 倍。大哥表示不但飞不动，还飞的很累。。。

&#x20;**基于预训练的 word2vec 模型：**&#x20;

流程跟上面使用 word2vec 的 CNN 的基本一致，同样也是用嵌入了 word2vec 的 embedding\_layer 替换原始的 embedding 层

```python
from keras.layers import Dense, Input, Flatten, Dropout
from keras.layers import LSTM, Embedding
from keras.models import Sequential

model = Sequential()
model.add(embedding_layer)
model.add(LSTM(200, dropout=0.2, recurrent_dropout=0.2))
model.add(Dropout(0.2))
model.add(Dense(labels.shape[1], activation='softmax'))
model.summary()
```

![](https://pic3.zhimg.com/v2-1b37ecf36007fbeb342ce21c7f19c5cc_b.jpg)

准确度 **0.82736602**

效果好了不少，依然存在过拟合现象，再一次说明了数据量对 LSTM 的重要性，使用预训练的 word2vec 模型等于间接增加了训练语料，所以在这次实验中崩坏的不是很严重

## &#x20;**3 MLP（多层感知机）**&#x20;

参考资料

> keras 示例程序 reuters\_mlp.py 代码地址\
> [https://github.com/fchollet/keras/blob/master/examples/reuters\_mlp.py](https://link.zhihu.com/?target=https%3A//github.com/fchollet/keras/blob/master/examples/reuters_mlp.py)

MLP 是一个结构上很简单很 naive 的神经网络。数据的处理流程也跟上面两个实验差不多，不过不再将每条新闻处理成 100 x 200 的 2 维向量，而是成为长度 65604 的 1 维向量。65604 代表数据集中所有出现的 65604 个单词，数据的值用 tf-idf 值填充，整个文档集成为一个用 17600 x 65604 个 tf-idf 值填充的矩阵，第 i 行 j 列的值表征了第 j 个单词在第 i 个文档中的的 tf-idf 值（当然这里也可以不用 tf-idf 值，而只是使用 0/1 值填充， 0/1 代表第 j 个单词在第 i 个文档中是否出现，但是实验显示用 tf-idf 的效果更好）

```python
tokenizer = Tokenizer()
tokenizer.fit_on_texts(all_texts)
sequences = tokenizer.texts_to_sequences(all_texts)
word_index = tokenizer.word_index
print('Found %s unique tokens.' % len(word_index))
data = tokenizer.sequences_to_matrix(sequences, mode='tfidf')
labels = to_categorical(np.asarray(all_labels))
```

模型很简单，仅有两个全连接层组成，将长度 65604 的 1 维向量经过 2 次压缩成为长度 12 的 1 维向量

```python
from keras.layers import Dense, Dropout
from keras.models import Sequential

model = Sequential()
model.add(Dense(512, input_shape=(len(word_index)+1,), activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(labels.shape[1], activation='softmax'))
model.summary()
```

![](https://pic4.zhimg.com/v2-d3a9275977fdbf00a19156b1293cc165_b.jpg)

![](https://pic1.zhimg.com/v2-cf097abbc557b786dde96eefb1008652_b.jpg)

准确度 **0.86066135**

相比 CNN 与 LSTM 的最好成绩，虽然简单，但是依然 NB

只是不能像 CNN 与 LSTM 那样借助预训练 word2vec 的帮助，加上数据量不大，所以稍微有些过拟合，不过结果依旧很不错。没有复杂的 embedding，清新脱俗的传统感知机模型在这种小数据集的简单问题上表现非常好（虽然训练参数已经达到了 3300 万个，单轮耗时也将近 200s 了）

## **4 朴素贝叶斯**

非深度学习方法这里使用 sklearn 来实践

首先登场的是朴素贝叶斯。数据处理的过程跟上述的 MLP 是一致的，也是将整个文档集用 tf-idf 值填充，让整个文档集成为一个 17600 x 65604 的 tf-idf 矩阵。这里需要使用 sklearn 的 CountVectorizer 与 TfidfTransformer 函数实现。代码如下

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer   
count_v0= CountVectorizer();  
counts_all = count_v0.fit_transform(all_text);
count_v1= CountVectorizer(vocabulary=count_v0.vocabulary_);  
counts_train = count_v1.fit_transform(train_texts);   
print "the shape of train is "+repr(counts_train.shape)  
count_v2 = CountVectorizer(vocabulary=count_v0.vocabulary_);  
counts_test = count_v2.fit_transform(test_texts);  
print "the shape of test is "+repr(counts_test.shape)  
  
tfidftransformer = TfidfTransformer();    
train_data = tfidftransformer.fit(counts_train).transform(counts_train);
test_data = tfidftransformer.fit(counts_test).transform(counts_test);
```

这里有一个需要注意的地方，由于训练集和测试集分开提取特征会导致两者的特征空间不同，比如训练集里 “苟” 这个单词的序号是 1024，但是在测试集里序号就不同了，或者根本就不存在在测试集里。所以这里先用所有文档共同提取特征（counts\_v0），然后利用得到的词典（counts\_v0.vocabulary\_）再分别给训练集和测试集提取特征。然后开始训练与测试

```python
from sklearn.naive_bayes import MultinomialNB  
from sklearn import metrics
clf = MultinomialNB(alpha = 0.01)   
clf.fit(x_train, y_train);  
preds = clf.predict(x_test);
num = 0
preds = preds.tolist()
for i,pred in enumerate(preds):
    if int(pred) == int(y_test[i]):
        num += 1
print 'precision_score:' + str(float(num) / len(preds))
```

![](https://pic3.zhimg.com/v2-78010ed5a2dab3479b60162edc1a72e2_b.jpg)

准确度 **0.85430157**

这只是一个简单的朴素贝叶斯方法，准确度高到惊人，果然最简单的有时候就是最有效的

![](https://pic1.zhimg.com/v2-daeab17d08f17d73b74a061de0c1d6ac_b.jpg)

## **5 KNN**

跟上面基本一致，只是将 MultinomialNB 函数变成 KNeighborsClassifier 函数，直接上结果

```python
from sklearn.neighbors import KNeighborsClassifier  

for x in range(1,15):  
    knnclf = KNeighborsClassifier(n_neighbors=x)
    knnclf.fit(x_train,y_train)  
    preds = knnclf.predict(x_test);
    num = 0
    preds = preds.tolist()
    for i,pred in enumerate(preds):
        if int(pred) == int(y_test[i]):
            num += 1
    print 'K= '+str(x)+', precision_score:' + str(float(num) / len(preds))
```

![](https://pic4.zhimg.com/v2-10235f60e8f50c32f17c9ab63f021081_b.jpg)

K=11 时，准确度 **0.31961147**，非常低，说明 KNN 方法不太适合做此类问题

## **6 SVM**

这里 svm 的 kernel 选用了线性核，其他的比如多项式核和高斯核也都试过，效果极差，直接上结果

```python
from sklearn.svm import SVC   
svclf = SVC(kernel = 'linear') 
svclf.fit(x_train,y_train)  
preds = svclf.predict(x_test);  
num = 0
preds = preds.tolist()
for i,pred in enumerate(preds):
    if int(pred) == int(y_test[i]):
        num += 1
print 'precision_score:' + str(float(num) / len(preds))
```

![](https://pica.zhimg.com/v2-197af21281170ca479264b845668cfa4_b.jpg)

准确度 **0.84435708**，还是不错的，超过 LSTM ，不及 CNN 与 MLP

## **7 SVM + word2vec 与 doc2vec**

这两个实验是后期新加入的，画风比较清奇，是骡是马溜一圈，就决定拿过来做个实验一起比较一下

&#x20;**svm + word2vec：**&#x20;

这个实验的主要思想是这样：原本每条新闻由若干个词组成，每个词在 word2vec 中都有由一个长度 200 的词向量表示，且这个词向量的位置是与词的语义相关联的。那么对于每一条新闻，将这条新闻中所有的词的词向量加和取平均，既能保留句子中所有单词的语义，又能生成一个蕴含着这句话的综合语义的 “句向量”，再基于这个长度 200 的句向量使用 svm 分类。这个思想看起来很 naive，但是又说不出什么不合理的地方。尝试一下，代码与结果如下：

```python
import gensim
import numpy as np
w2v_model = gensim.models.KeyedVectors.load_word2vec_format(VECTOR_DIR, binary=True)
x_train = []
x_test = []
for train_doc in train_docs:
    words = train_doc.split(' ')
    vector = np.zeros(EMBEDDING_DIM)
    word_num = 0
    for word in words:
        if unicode(word) in w2v_model:
            vector += w2v_model[unicode(word)]
            word_num += 1
    if word_num > 0:
        vector = vector/word_num
    x_train.append(vector)
for test_doc in test_docs:
    words = test_doc.split(' ')
    vector = np.zeros(EMBEDDING_DIM)
    word_num = 0
    for word in words:
        if unicode(word) in w2v_model:
            vector += w2v_model[unicode(word)]
            word_num += 1
    if word_num > 0:
        vector = vector/word_num
    x_test.append(vector)
```

![](https://pic4.zhimg.com/v2-79bd21d10a748a086ca526b881bff2c1_b.jpg)

准确度 **0.85175763**，惊了，这种看似很 naive 的方法竟然取得了非常好的效果。相比于之前所有包括 CNN、LSTM、MLP、SVM 等方法，这种方法有很强的优势。它不需要特征提取的过程，也不需固定新闻的长度，一个模型训练好，跨着数据集都能跑。但是也有其缺陷一面，比如忽略词语的前后关系，并且当句子长度较长时，求和取平均已经无法准确保留语义信息了。但是在短文本分类上的表现还是很亮

![](https://pic3.zhimg.com/v2-dd9fc6cb5673d7e8f38b85bc359b0390_b.jpg)

&#x20;**svm + doc2vec：**&#x20;

上面 svm + word2vec 的实验提到当句子很长时，简单求和取平均已经不能保证原来的语义信息了。偶然发现了 gensim 提供了一个 doc2vec 的模型，直接为文档量身训练 “句向量”，神奇。具体原理不讲了（也不是很懂），直接给出使用方法

```python
import gensim
sentences = gensim.models.doc2vec.TaggedLineDocument('all_contents.txt')
model = gensim.models.Doc2Vec(sentences, size=200, window=5, min_count=5)
model.save('doc2vec.model')
print 'num of docs: ' + str(len(model.docvecs))
```

all\_contents.txt 里是包括训练文档与测试文档在内的所有数据，同样每行 1 条新闻，由若干个词组成，词之间用空格隔开，先使用 gensim 的 TaggedLineDocument 函数预处理下，然后直接使用 Doc2Vec 函数开始训练，训练过程很快（可能因为数据少）。然后这所有 21924 篇新闻就变成了 21924 个长度 200 的向量，取出前 17600 个给 SVM 做分类训练，后 4324 个测试，代码和结果如下：

```python
import gensim
model = gensim.models.Doc2Vec.load('doc2vec.model')
x_train = []
x_test = []
y_train = train_labels
y_test = test_labels
for idx, docvec in enumerate(model.docvecs):
    if idx < 17600:
        x_train.append(docvec)
    else:
        x_test.append(docvec)
print 'train doc shape: '+str(len(x_train))+' , '+str(len(x_train[0]))
print 'test doc shape: '+str(len(x_test))+' , '+str(len(x_test[0]))

from sklearn.svm import SVC   
svclf = SVC(kernel = 'rbf') 
svclf.fit(x_train,y_train)  
preds = svclf.predict(x_test);  
num = 0
preds = preds.tolist()
for i,pred in enumerate(preds):
    if int(pred) == int(y_test[i]):
        num += 1
print 'precision_score:' + str(float(num) / len(preds))
```

![](https://picx.zhimg.com/v2-a224dbe4992f9f34605422a5d5c9bcd5_b.jpg)

准确度 **0.48126734**，惨不忍睹。原因可能就是文档太短，每个文档只有不超过 100 个词，导致对 “句向量” 的学习不准确，word2vec 模型训练需要 1G 以上的数据量，这里训练 doc2vec 模型 20000 个文档却只有 5M 的大小，所以崩坏

&#x20;**另外！** 这里对 doc2vec 的应用场景有一些疑问，如果我新加入一条新闻想要分类，那么我必须先要把这个新闻加到文档集里，然后重新对文档集进行 doc2vec 的训练，得到这个新新闻的文档向量，然后由于文档向量模型变了， svm 分类模型应该也需要重新训练了。所以需要自底向上把所有模型打破重建才能让为新文档分类？那实用性很差啊。也可能我理解有误，希望是这样

## **总结**

总结放在开头了

打完收工

![](https://pic2.zhimg.com/v2-171bf77bd92c47959cbe9c70fa3790c9_b.png)
