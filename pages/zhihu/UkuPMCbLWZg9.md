---
title: 神经网络预测股票市场
date: 2024-10-04T15:14:07.765Z
categories:
  - zhihu
tags:
  - zhihu
  - 股票
origin_url: //zhuanlan.zhihu.com/p/46798641
---
> &#x20;**摘要：**  股票跌跌不休？用神经网络预测一波啊！

![](https://pic3.zhimg.com/v2-85f07bdb5ece7e1851ff419d97594934_b.jpg)

机器学习和深度学习已经成为定量对冲基金为了实现最大化利润而通常使用的新的有效策略。作为一个人工智能和金融爱好者，这是一个令人兴奋的消息，因为神经网络结合了我感兴趣的两个领域。本文将介绍如何使用神经网络预测股票市场，特别是股票 (或指数) 的价格。这篇文章基于我 GitHub 上的[python 项目](https://link.zhihu.com/?target=https%3A//github.com/VivekPa/NeuralNetworkStocks)，在项目中可以找到完整的 python 代码以及如何运行这个程序。另外，要了解更多类似的内容，请查看我自己的页面:[Engineer Quant](https://link.zhihu.com/?target=https%3A//medium.com/engineer-quant)。

金融是高度非线性的而且有时股票价格数据甚至看起来完全随机的。如 ARIMA 和 GARCH 模型这些传统的时间序列方法，只有在序列是静止的情况下才有效，这是一种需要对序列进行日志返回 (或其他转换) 预处理的限制假设。然而，在实时交易系统中实现这些模型时出现的主要问题是，随着新数据的添加，无法保证序列的静止。

这是通过使用不需要任何平稳性的神经网络来解决的。此外，神经网络天生就能有效地发现数据之间的关系，并利用它来预测 (或分类) 新数据。

一个典型的全堆栈数据科学项目有以下工作流程：

1、数据采集 —— 这为我们提供了特征；

2、数据预处理 —— 这是使数据可用的一个常见且必要的步骤；

3、开发和实现模型 - 选择神经网络的类型和参数；

4、回溯模型 —— 在任何交易策略中都是非常关键的一步；

5、优化 —— 找到合适的参数；

神经网络的输入数据是过去十天的股价数据，我们用它来预测第二天的股价数据。

## **数据采集**

幸运的是，这个项目所需的股价数据很容易通过使用它们的 Python API，即 get\_yahoo\_data (ticker, start\_date, end\_date) 在 Yahoo Finance 中得到，或直接从它们的网站获取。

## **数据预处理**

在我们的例子中，我们需要将数据分解成过去 10 天股价和第二天价格的训练集。我通过定义一个 preprocessing 类，将其分解为训练和测试数据，并定义一个方法 get\_train (self, seq\_len)，该方法返回训练数据 (输入和输出) 为 numpy 数组，给定一个特定的窗口长度 (在例子中是 10)。完整代码如下：

```text
def gen_train(self, seq_len):
 """
 Generates training data
 :param seq_len: length of window
 :return: X_train and Y_train
 """
 for i in range((len(self.stock_train)//seq_len)*seq_len - seq_len - 1):
 x = np.array(self.stock_train.iloc[i: i + seq_len, 1])
 y = np.array([self.stock_train.iloc[i + seq_len + 1, 1]], np.float64)
 self.input_train.append(x)
 self.output_train.append(y)
 self.X_train = np.array(self.input_train)
 self.Y_train = np.array(self.output_train)
```

类似的，对于测试数据，我定义了一个方法返回 X\_test 和 Y\_test。

## **神经网络模型**

对于这个项目，我使用了两种神经网络模型：多层感知器 (MLP) 和长短期记忆网络模型 (LSTM)。我将简要介绍这些模型的工作原理，但如果需要了解 MLPs 的工作原理，请查阅[本文](https://link.zhihu.com/?target=https%3A//medium.com/engineer-quant/multilayer-perceptron-4453615c4337)。

MLPs 是最简单的神经网络形式，从模型中输入，并使用特定的权重，这些值通过隐藏层被向前输入以产生输出。通过隐藏层的反向传播来改变每个神经元之间的权值并由此进行学习。MLPs 的一个问题是缺乏 “记忆”，不清楚在以前的训练数据中发生了什么，以及这将如何影响新的训练数据。在我们的模型上下文中，一个数据集中十天股价的数据与另一个数据集中十天股价的数据之间的差异可能很重要 (例如)，但是 MLPs 没有能力分析这些关系。

这就是 LSTMs 或递归神经网络 (RNNs) 出现的地方。RNNs 能够存储关于数据的特定信息以供以后使用，这扩展了网络分析股票价格数据之间复杂结构的能力 RNNs 的一个问题是梯度消失问题。这是由于当层数增加时，学习率被乘以若干次，这导致梯度继续下降。LSTMs 对此进行了优化，使其更加有效。

## **模型实现**

为了实现这些模型，我选择了 keras，因为它向网络添加层而不是一次性定义整个网络。这使我们能够快速改变层的数量和层的类型，这在优化网络时非常方便。

使用股票价格数据的一个重要步骤是对数据进行规一化。这通常意味着减去平均值除以标准差，但在例子中，我们想要在一段时间内的实时交易中使用这个系统，因此，利用统计矩可能不是使数据归一化的最精确方法。因此，我只是将整个数据除以 200 (一个任意的数字，使一切都变得很小)。虽然归一化似乎是凭空捏造出来的，但它仍然有效地确保神经网络中的权重不会变大。

让我们从简单的 MLP 开始。在 keras 中，这是通过创建序列模型并在上面添加全连接层来实现的。完整代码如下:

```text
model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Dense(100, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(100, activation=tf.nn.relu))
model.add(tf.keras.layers.Dense(1, activation=tf.nn.relu))

model.compile(optimizer="adam", loss="mean_squared_error")
```

这就是 keras 的优雅之处。仅用这五行代码，我们就创建了一个带有两个隐藏层的 MLP，每个层都有 100 个神经元。与传统的随机梯度下降法相比，Adam 优化器是一种更有效的优化算法，因此在机器学习领域越来越受欢迎。通过观察随机梯度下降法的另外两个扩展的优点，我们可以更好地理解这些优点：

自适应梯度算法 (AdaGrad)，保持每个参数的学习速率，提高了稀疏梯度问题 (例如自然语言和计算机视觉问题) 的性能。

均方根传播 (RMSProp) 也保持每个参数的学习速率，这些学习速率是根据最近权重梯度的平均值 (例如变化的速度) 来调整的。这意味着该算法可以很好地处理在线和非平稳问题 (如噪声)。

可以认为 Adam 结合了上述扩展的优点，这就是为什么我选择使用 Adam 作为我的优化器。

现在我们需要将模型与我们的训练数据相匹配。同样，keras 使它变得简单，只需要以下代码：

```text
model.fit(X_train, Y_train, epochs=100)
```

一旦拟合了我们的模型，我们需要根据测试数据来评估它的性能，这是由下列代码完成

```text
model.evaluate(X_test, Y_test)
```

你可以使用评估中的信息来评估模型预测股票价格的能力。

对于 LSTM 模型，过程是类似的，因此我将贴出下面的代码以供你理解：

model = tf.keras.Sequential()

`model.add(tf.keras.layers.LSTM(20, input_shape=(10, 1), return_sequences=True))`

`model.add(tf.keras.layers.LSTM(20))`

`model.compile(optimizer="adam", loss="mean_squared_error")`

`model.add(tf.keras.layers.Dense(1, activation=tf.nn.relu))`

`model.evaluate(X_test, Y_test)`

`model.fit(X_train, Y_train, epochs=50)`

很重要的一点是 keras 要求输入数据具有特定的由模型决定的维度，使用 numpy 重塑数据非常重要。

## **回测模型**

现在，我们已经使用训练数据对模型进行了拟合，并使用测试数据对其进行了评估，我们可以通过在新数据上对模型进行回测来进一步进行评估。由下列代码实现：

```text
def back_test(strategy, seq_len, ticker, start_date, end_date, dim):
 """
 A simple back test for a given date period
 :param strategy: the chosen strategy. Note to have already formed the model, and fitted with training data.
 :param seq_len: length of the days used for prediction
 :param ticker: company ticker
 :param start_date: starting date
 :type start_date: "YYYY-mm-dd"
 :param end_date: ending date
 :type end_date: "YYYY-mm-dd"
 :param dim: dimension required for strategy: 3dim for LSTM and 2dim for MLP
 :type dim: tuple
 :return: Percentage errors array that gives the errors for every test in the given date range
 """
 data = pdr.get_data_yahoo(ticker, start_date, end_date)
 stock_data = data["Adj Close"]
 errors = []
 for i in range((len(stock_data)//10)*10 - seq_len - 1):
 x = np.array(stock_data.iloc[i: i + seq_len, 1]).reshape(dim) / 200
 y = np.array(stock_data.iloc[i + seq_len + 1, 1]) / 200
 predict = strategy.predict(x)
 while predict == 0:
 predict = strategy.predict(x)
 error = (predict - y) / 100
 errors.append(error)
 total_error = np.array(errors)
 print(f"Average error = {total_error.mean()}")
```

然而，这个回测是一个简化版本，而不是一个完整的回测系统。对于完整的回测系统，还需要考虑幸存者偏差、前视偏误、市场机制变化和交易成本等因素。因为这只是一个教育项目，一个简单的测试就足够了。但是，如果你对建立完整的回测系统有任何疑问，请随时与我联系。

以下是我的 LSTM 模型在预测 2 月份苹果股票价格时的表现:

![](https://pic1.zhimg.com/v2-275e0abfef0f5fa21299bb28aebdf308_b.jpg)

对于一个没有优化的简单 LSTM 模型，这已经是一个很好的预测。它向我们展示了神经网络的鲁棒性和机器学习模型在参数间复杂关系建模中的作用。

## **超参数调试**

在样本外测试中，优化神经网络模型对提高模型的性能具有重要意义。我还没有在项目的开放源码版本中包含调优，因为我希望它对那些阅读它的人来说是一个挑战，以便继续进行并尝试优化模型以使其性能更好。对于那些不知道优化的人来说，它涉及到找到最大化模型性能的超参数。有几种方法可以搜索这些理想超参数，从网格搜索到随机方法。我强烈地感觉到，学习优化模型可以把你的机器学习知识提升到一个新的水平，因此，希望你提出一个优化模型，超过我的表现，如上图所示。

## **结论**

机器学习是不断更新的，每天都有新的方法被开发出来。我们必须不断更新知识，最好的方法就是为一些有趣的项目建立模型，比如股票价格预测。虽然上面的 LSTM 模型还不足以用于实时交易，但是通过开发这样一个模型所建立的基础可以帮助我们建立更好的模型，有一天我们的交易系统可能会用到这些模型。

以上为译文，由[阿里云云栖社区](https://link.zhihu.com/?target=http%3A//weibo.com/taobaodeveloperclub)组织翻译。

[译文链接](https://link.zhihu.com/?target=http%3A//click.aliyun.com/m/1000018478/)

文章原标题《neural-networks-to-predict-the-market》

作者：[Vivek Palaniappan](https://link.zhihu.com/?target=https%3A//towardsdatascience.com/%40VivekPa69%3Fsource%3Dpost_header_lockup) 译者：乌拉乌拉，审校：。

文章为简译，更为详细的内容，请查看[原文](https://link.zhihu.com/?target=https%3A//towardsdatascience.com/neural-networks-to-predict-the-market-c4861b649371)。

**更多技术干货敬请关注云栖社区知乎机构号：[阿里云云栖社区 - 知乎](https://www.zhihu.com/org/a-li-yun-yun-qi-she-qu-48/activities)**

本文为云栖社区原创内容，未经允许不得转载。
