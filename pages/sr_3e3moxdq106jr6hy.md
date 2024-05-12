---
title: "Web3.0 开发入门"
date: 2022-06-09T16:07:24+08:00
draft: false
categories: [dev]
tags: [dev, btcoin]
---
> 原文地址 [技术圈](https://jishuin.proginn.com/p/763bfbd797fe)

# 前言

Web 3.0 的概念是由以太坊联合创始人 Gavin Wood 在 2014 年提出的，指基于区块链的去中心化在线生态系统，它代表了下一代互联网时代。目前 Web 3.0 仍处于起步阶段，但是发展非常迅猛，其去中心化、抗审查等特点使得人们更容易建设一个开放的网络生态。本文会先对 Web3.0 的底层区块链做个简单介绍，然后再介绍 Web3.0 的整体架构，最后通过一个简单的例子来介绍 Web3.0 开发常用的一些技术。本文只是一个引子，让大家对 Web3.0 不再陌生，文中提到的一些技术感兴趣的同学可以再自行深入了解。

# 区块链简介

## 区块链架构

区块链是一个去中心化的分布式账本，可以在数字世界中进行价值的表示和转移。区块链的架构自下而上分为六层，分别是数据层、网络层、共识层、激励层、合约层和应用层。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/8161e4f7.png)

- 数据层

区块链是通过区块（block）存储数据，每个数据节点之间都包含所有数据，即分布式账本。每个区块都包括了区块的大小、区块头、区块所包含的交易数量及部分或所有的近期新交易。数据层主要是解决这些数据以什么样的形式组合在一起，形成一个有意义的区块。区块链的数据结构中包括两种哈希指针，它们均是不可篡改特性的数据结构基础。一个是形成“区块 + 链”（block+chain）的链状数据结构，另一个是哈希指针形成的梅克尔树（如下图所示）。链状数据结构使得对某一区块内的数据的修改很容易被发现；梅克尔树的结构起类似作用，使得对其中的任何交易数据的修改很容易被发现。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/2ea89f18.png)

可以在 [https://www.blockchain.com/explorer](https://www.blockchain.com/explorer) 上查看比特币的区块链交易数据，可以在 [https://cn.etherscan.com/](https://cn.etherscan.com/)上查看以太坊的区块链交易数据。

- 网络层

区块链使用的是去中心化的网络架构，没有中心化服务器，依靠用户点对点交换信息，主要包括 P2P 组网机制、数据传播和验证机制。正是由于节点的 P2P 特性，数据传输是分散在各个节点之间进行的，部分节点或网络遭到破坏对其他部分影响很小。节点指的是区块链客户端软件（比如比特币客户端、以太坊客户端），一般分为全节点和轻节点，全节点包含了所有区块链的区块数据，轻节点仅包括与自己相关的数据。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/71a0f1ca.png)

- 共识层

共识层的功能是让高度分散的节点在 P2P 网络中，针对区块数据的有效性达成共识，决定了谁可以将新的区块添加到主链中（挖矿机制）。

工作量证明共识机制（PoW），矿工需要将网络中未确认的交易按梅克尔树组装成候选区块，在候选区块的头部有一个 32 位的随机数区域，矿工需要反复调整随机数并计算，目标是让整个区块的哈希值小于一个“目标值”，谁先完成这个目标谁就有权力将交易记录到区块链分布式账本中并获得一定的奖励。挖矿的过程比拼的就是各个矿工节点的算力，可以变相认为谁的算力高谁的工作量就高，就有权力记账和获得奖励。比特币使用的是 PoW 机制；以太坊开始使用的是 PoW 机制，后来改成了 PoS 机制，原因是该机制交易速度更快、资源消耗更低。这种挖矿计算是非对称的，挖矿可能需要经过许多次哈希计算，而要验证的确找到有效的随机数，只需要一次计算就可以，因此其他节点能够很快验证交易是否已经被记入账本。

- 激励层

激励层的功能主要是提供一些激励措施，鼓励节点参与记账，保证整个网络的安全运行。通过共识机制胜出取得记账权的节点能获得一定的奖励。

目前比特币的激励措施是新区块产生时系统会奖励矿工一定的比特币（系统产生的新比特币，也会记录在分布式账本，来源地址是 0，因此整个过程叫挖矿），奖励最初是 50 个比特币，每四年减半一次，分别为 25 个、12.5 个，以此类推。当比特币数量达到 2100 万枚的上限后（2140 年），激励就全靠交易的手续费了。以太坊交易是靠 gas 手续费来激励矿工。

- 合约层

合约层封装了各类脚本、算法和智能合约，使得区块链具有可编程能力。例如，比特币的脚本\[1\]中就规定了比特币的交易方式和过程中的种种细节，不过这种脚本使用不够便捷且不是图灵完备的。以太坊提出了智能合约的解决方案，提供了一种图灵完备的高级编程语言来编写智能合约，并使智能合约能够运行在分布式的以太坊虚拟机 EVM 上。智能合约就是存储在区块链上的一段代码，它们可以被区块链上的交易所触发，触发后，这段代码可以从区块链上读取数据或者向区块链上写入数据。区块链系统（比特币、以太坊）可以认为是一个分布式状态机，通过交易触发合约（脚本、智能合约）运行来改变状态机的状态。

- 应用层

应用层封装了区块链的各种应用场景，具体应用可参见 90+ #Ethereum Apps You Can Use Right Now\[2\]。

以下为一笔比特币转账交易的过程：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/dd69b03e.png)

## 以太坊简介

因为我们将要在以太坊上开发一个 Web3.0 demo 应用，所以先简单介绍一下以太坊的一些基本概念。

### 账户和钱包

以太坊账户分为外部账户和合约账户。外部账户是拥有私钥的账户，拥有私钥意味着控制对以太币或合约的访问。合约账户具有地址但是没有私钥，合约账户具有智能合约代码，而外部账户不具有。智能合约代码是在合约账户创建时由以太坊区块链记录的软件程序，由 EVM 执行。

钱包是用来管理以太坊账户的软件应用程序 ，它控制对以太币的访问、管理私钥和地址、跟踪账户的余额、创建并签名交易。可以说，以太坊钱包是通往以太坊世界的大门。一个针对以太坊钱包的常见误解是认为钱包中包含以太币或者代币。实际上，钱包中只保存了密钥。以太币和其他各种代币都保存在以太坊区块链上。

当创建一个以太坊外部账户的时候，会用非对称加密算法生成一对公钥与私钥，并保存在钱包里，而地址是公钥的哈希值。交易的签名和验证过程如下（椭圆曲线数字签名算法）：

`Sig=Fsig(Fkeccak256(m) , k)`

其中：

* k 是用于签名的私钥
* m 是经过 RLP 编码的交易数据包
* Fkeccak256 是 Keccak-256 哈希函数
* Fsig 是签名算法
* Sig 是输出的数字签名

函数 Fsig 生成了一个签名，这个签名包含两部分内容，通常称为 r 和 s：`Sig=(r, s)`

签名验证算法的输入包括交易数据包（其实是交易的哈希值的一部分）、签名方的公钥和签名（r 和 s 值），如果针对消息和公钥的签名验证成功，算法会返回 true。

### 以太币和 gas

以太坊的货币单位称为 ether，也常使用 ETH 表示，例如 1 ether 或者 1 ETH。以太币可以被拆分成更小的单元，最小单元称为 wei，1 ether = 10\^18 wei。以太币的面额和单位名称如下所示：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/024ed06d.png)

以太坊交易过程使用的是 gas 来支付手续费。gas 并不是以太币，它是一种独立的虚拟货币，跟以太币之间存在汇率关系。gas 独立于以太币，是为了在以太币价格大幅度波动的情况下，仍旧保护系统的灵活性，保证 gas 的价值相对稳定。

gas 的另一个作用是控制交易对资源的使用。交易数据会包含 gasPrice（交易发起方愿意支付的 gas 价格）和 gasLimit（交易发起方愿意为这个交易支付的最大 gas 数量）两个参数，而每一条智能合约代码语句的运行都会消耗对应的 gas，当运行过程中累计的 gas 消耗超过了 gasLimit，合约就会终止执行，交易失败。失败的交易仍旧会被作为一次失败的尝试而记录在案，执行所花费的 gas 将从发起账户中被扣除，除此之外，它不会对合约或者账户状态产生任何其他影响。

### 客户端

Geth 是官方提供的 go 语言实现的以太坊客户端。客户端可以以全功能节点的方式运行，也可以以远程调用的方式运行。全功能节点会下载全部的区块数据，对系统的网络和存储有较高的要求。从远程调用以太坊的客户端不在本地保存区块链数据，也不参与区块和交易验证，这样的客户端提供钱包功能，也可以创建并广播交易。以太坊客户端会对外提供 API（例如 web3.js API、JSON-RPC API）来访问以太坊网络。

### 智能合约

智能合约是运行在以太坊的虚拟机上的计算机程序，一旦部署之后，智能合约的代码就不能被更改，但是可以删除。把合约注册到区块链上需要通过一个特殊的交易，这个交易的目标地址是 0x0000000000000000000000000000000000000000，也被称为零地址。

当交易目标是合约地址时，它会导致该合约在 EVM 中运行，使用交易和交易的数据作为其输入。由于合约账户没有私钥，因此无法启动交易。只有外部账户才能启动交易，但合约可以通过调用其他合约，构建复杂的执行路径来对交易做出反应。智能合约永远不会“自动运行”，或者“在后台运行”。

常用的以太坊智能合约编程语言为 solidity。

### token/代币/通证

token、代币、通证指的都是同一种东西。区块链上的代币是指基于区块链的一种抽象资产，可以被持有并且用来代表资产、现金或访问权限。

代币与以太币不同，因为以太坊协议本身跟代币完全没有任何关联。发送以太币是以太坊平台的内在动作，但发送或拥有代币并不是以太坊协议中定义的内容。以太坊账户的以太币余额在协议级别处理，而以太坊账户的代币余额在智能合约级别处理。要在以太坊上创建新代币，你必须创建一个新的智能合约。部署后，智能合约将处理所有内容，包括所有权，转移和访问权限。

代币有可替代性代币和不可替代性代币，标准分别是 ERC20\[3\]和 ERC721\[4\]，目前市面上比较火爆的 NFT 就是一种不可替代性代币。

# Web3.0 简介

## **从信息互联网到价值互联网**

1989 年，Tim Bernes-Lee 撰写了一篇题为“Information Management: A Proposal”的论文，其中他将“网络”一词描述为一个由超文本链接相互连接而成的信息系统网络，这就是 Web 1.0。Web 1.0 发生在 1990 至 2004 年间，Netscape、谷歌、Yahoo、Amazon、eBay、Java 和 AOL 等公司凭借其浏览器和搜索引擎主导了互联网，这些平台是 Web 1.0 时代的内容创造者，而上面的绝大多数用户是内容的消费者。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/41d389ec.png)

随着社交媒体平台的出现，Web 2.0 时期开始于 2004 年。在 Web 2.0 时代，用户能够上传自己的文本、图片和视频等内容到平台上，不再是内容的被动接受者，而是可以创造内容并与其他人进行交流。在 Web 2.0 时代，人们变成各种应用程序的用户，并在这些产品上创造大量的内容，这些数据被一个中心化的平台所掌控。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/3a06319e.png)

Web 3.0 的概念是由以太坊联合创始人、 Polkadot 创造者 Gavin Wood 在 2014 年提出的，代表了下一代的去中心化互联网，并赋予了个体价值。Web 3.0 关注的是通过区块链等去中心化技术形成的“谁创造，谁拥有”的关系价值。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/e5260019.png)

以太坊官网\[5\]对 Web 3.0 主要特点的总结如下：

- **Web3 is decentralized:** instead of large swathes of the internet controlled and owned by centralized entities, ownership gets distributed amongst its builders and users.

* **Web3 is** **permissionless** **:** everyone has equal access to participate in Web3, and no one gets excluded.
* **Web3 has native payments:** it uses cryptocurrency for spending and sending money online instead of relying on the outdated infrastructure of banks and payment processors.
* **Web3 is** **trustless** **:** it operates using incentives and economic mechanisms instead of relying on trusted third-parties.

## Web 2.0 与 Web 3.0 开发范式对比

Web 2.0 开发范式：

* 需要开发登录、注册功能，需要搭建数据库来存储用户注册信息以及用户交互数据
* 使用前端代码语言\(JavaScript, HTML, CSS\)来开发页面逻辑，需要搭建一个服务器来部署前端页面
* 使用后端代码语言（像 Node.js, Java, Go 等）来开发业务逻辑，并需要搭建一个服务器来部署后端服务，并需要运维服务
* 所有代码、数据都部署在中心化的服务器上，所有控制权归开发者

Web 3.0 开发范式：

* 不需要用户绑定邮箱，绑定手机，可以直接通过钱包登录，也不需要存储用户信息
* 可以不需要搭建前端服务器，用户可通过 IPFS 或 arweave 存储前端页面，并进行访问
* 不需要搭建后端服务器，后端逻辑是用智能合约编写的，运行在 EVM 上的
* 不需要搭建数据库，历史数据与数据库操作通过 TheGraph 来实现

# 实战：去中心化的 HPC 代币交易系统

下面我们将基于以太坊开发一种遵循 ERC20\[6\]标准的可替代性代币，叫做 HPC，并提供一个简单的页面进行 HPC 代币的交易。

## 安装客户端\&生成账户

根据官网 [https://geth.ethereum.org/docs/](https://geth.ethereum.org/docs/)指导安装 geth 客户端并生成两个测试账号。

- Mac 下安装 geth

```bash
brew tap ethereum/ethereum brew install ethereum
```

- 安装完 geth 后会同时提供一个钱包工具 Clef，可用于账号管理和进行交易签名

```bash
mkdir -p geth-config/keystore clef newaccount --keystore geth-config/keystore
# 运行两次，创建两个测试账户 clef newaccount --keystore geth-config/keystore
```

创建完账户后可以看到 `geth-config/keystore` 目录下多了两个账号的配置文件，后续也可以利用这两个文件将账户导入其他钱包

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/d5648dbf.png)

- 以轻节点模式启动 geth，我们使用 Goerli 区块链网络（一个以太坊测试网络）来进行测试，Goerli 区块链网络的 id 是 5

```bash
clef --keystore geth-config/keystore --configdir geth-config/clef --chainid 5
#先启动clef，后续交易需要使用clef来签名
geth --datadir geth-config --signer=geth-config/clef/clef.ipc --goerli --syncmode light --http --http.api "eth,debug"
# 新开一个terminal tab，启动geth
```

- 启动 geth 后，geth 默认会在 127.0.0.1:8545 上启动一个 http 服务，可以使用 geth attach 命令连接该服务进入到一个 js console 环境，并可以使用 web3.js api 与区块链主网进行交互

```bash
geth attach http://127.0.0.1:8545
# 新开一个terminal tab运行该命令，运行该命令后terminal tab会被block住，
# 需要到运行clef服务的tab去授权，授权完geth attach命令就会进入一个交互式的页面，
# 该页面可以使用web3.js api进行交互
```

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/84e842c2.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/fde8ac82.png)

- 获取测试以太币，从 [https://goerlifaucet.com/](https://goerlifaucet.com/)或者 https://goerli-faucet.mudit.blog/获取 goerli 测试网络的以太币

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/34268ade.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/01de27bc.png)![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/e22ea059.png)

## 开发智能合约（类比服务端代码）

- 使用 solidity\[7\]语言进行开发，根据 ERC20\[8\]标准智能合约需要实现以下接口，同时在代码中设定智能合约的拥有者可以调用 mint 函数进行挖矿产生代币，完整项目代码参见 [https://github.com/watchsky/hpc](https://github.com/watchsky/hpc_eth_coin/tree/master/contracts)

```solidity
pragma solidity ^0.5.2;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

- 安装 solidity 编译器，Mac 系统使用 brew 安装

`brew install solidity`

- 编译合约

`solc --bin --abi HippoCoin.sol # 在代码目录下执行 `

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/6819b28e.png)

- 部署智能合约，在 js console 环境下使用 web3.js api 进行部署

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/dac879ba.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/9a6e6968.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/7584b1be.png)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/525a6f3e.png)

- 在 geth js console 环境下对我们的智能合约进行测试

```
hpcContract = new eth.Contract(abi, '0x74fe09b3ba8adea31f6448f4c742e9148a262d9b')
# 获取合约实例
hpcContract.mint('0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709', 200000, {from: '0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709'})
# 0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709是创建合约的地址，在合约代码里将其设为了owner，可以进行挖矿 hpcContract.mint('0xee45cE18A60C2Df0B092185Ca4C0B483018FB07B', 500000, {from: '0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709'})
hpcContract.transfer('0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709', 500, {from: '0xee45cE18A60C2Df0B092185Ca4C0B483018FB07B'})
```

查看交易记录 [https://goerli.etherscan.io/address/0x74fe09b3ba8adea31f6448f4c742e9148a262d9b](https://goerli.etherscan.io/address/0x74fe09b3ba8adea31f6448f4c742e9148a262d9b)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/a1e2c531.png)

代币详情 [https://goerli.etherscan.io/token/0x74fe09b3ba8adea31f6448f4c742e9148a262d9b](https://goerli.etherscan.io/token/0x74fe09b3ba8adea31f6448f4c742e9148a262d9b)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/ca93adf4.png)![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/20b60e39.png)

## 开发前端页面

- 因为需要通过页面来进行 HPC 代币的交易，因此需要使用一个 web 钱包来进行交易的签名和发送。这里我们使用 MetaMask\[9\]钱包，它支持通过浏览器插件\[10\]的方式运行。为了测试，我们将前面创建的两个账户（0xee45cE18A60C2Df0B092185Ca4C0B483018FB07B 和 0xEC30B4dAec9B113E5009a2259e7A4f201aE1D709）导入 MetaMask，如下图所示

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/13b7a7d7.png)

- 开发前端代码，主要逻辑是要跟 MetaMask 钱包交互，当安装了 MetaMask Chrome 插件后会在页面上注册一个 `window.ethereum` 对象，通过该对象可以使用到钱包提供的功能，发送交易时需要对数据进行编码，使用的是 ethers 库，完整代码参见 [https://github.com/watchsky/hpc](https://github.com/watchsky/hpc_eth_coin/tree/master/src)，以下列出请求连接钱包和发送交易的代码

请求连接钱包：

```
export const requestMetamaskAccount = async () => {
  if (!ethereum) {
    return;
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });

  if (accounts.length === 0) {
    currentAccount = null;
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
  }

  return currentAccount;
};
```

发送交易：

```
  const toAddress = document.getElementById("toAddress").value.trim();
  const amount = document.getElementById("amount").value.trim();

  const contractAddress = '0x74FE09B3bA8AdEa31f6448f4c742e9148A262d9b';
  const abiInterface = new utils.Interface(abi);
  const functionData = abiInterface.encodeFunctionData("transfer", [
    toAddress,
    parseInt(amount),
  ]);
  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: "0x94810dee", // customizable by user during MetaMask confirmation.
    gas: "0x8a82", // customizable by user during MetaMask confirmation.
    to: contractAddress, // Required except during contract publications.
    from: account, // must match user's active address.
    value: "0x00", // Only required to send ether to the recipient from the initiating external account.
    data: functionData,
    chainId: "0x5", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
  });
```

- 对静态资源使用 webpack 打包构建，然后通过 ipfs 将页面资源部署到去中心化的网络中

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/4046675e.png)

- 页面效果 [https://ipfs.io/ipfs/QmQDnUK2X1XQLFkQJeiqocseWiq4bE6SWRo65U6sd7J2Wn](https://ipfs.io/ipfs/QmQDnUK2X1XQLFkQJeiqocseWiq4bE6SWRo65U6sd7J2Wn\?filename=index.html)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/b4557fbc.png)![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_3e3moxdq106jr6hy/843e0e57.png)

为了让大家对 Web3.0 常用的一些底层技术有所了解，本文的案例没有使用任何框架来开发，但实际开发中我们可以利用一些工具来帮助开发提效，例如 Home \- Truffle Suite\[11\]、Embark into the Ether. | Embark\[12\]、Fleek: Build on the New Internet\[13\]、Remix \- Ethereum IDE\[14\]。

# 参考资料

* 比特币的脚本: https://bitcoindev.network/bitcoin-script-101/
* [90+ #Ethereum Apps You Can Use Right Now](https://consensys.net/blog/news/90-ethereum-apps-you-can-use-right-now/)
* ERC20: [https://ethereum.org/en/developers/docs/standards/tokens/erc-20/](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* ERC721: [https://ethereum.org/en/developers/docs/standards/tokens/erc-721/](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)
* 以太坊官网: [https://ethereum.org/en/web3/](https://ethereum.org/en/web3/)
* ERC20: [https://ethereum.org/en/developers/docs/standards/tokens/erc-20/](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* solidity: [https://docs.soliditylang.org/en/v0.8.13/](https://docs.soliditylang.org/en/v0.8.13/)
* ERC20: [https://ethereum.org/en/developers/docs/standards/tokens/erc-20/](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* MetaMask: [https://metamask.io/](https://metamask.io/)
* [浏览器插件MetaMask:](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
* [https://trufflesuite.com/](https://trufflesuite.com/)
* [Embark into the Ether](https://framework.embarklabs.io/)
* Fleek: Build on the New Internet: [https://fleek.co/](https://fleek.co/)
* Remix \- Ethereum IDE: [https://remix.ethereum.org/](https://remix.ethereum.org/)
* [区块链是什么\?超级详细，看了无师自通\!](http://c.biancheng.net/view/1884.html)
* [Web 3.0 架构不仅是去中心化的，更是模块化的](https://www.toutiao.com/article/7092936458687742475)
* [Web 3.0 生态全解析：颠覆性的技术变革](https://www.toutiao.com/article/7078869546806805028)
* [What is Web3 and why is it important\?](https://ethereum.org/en/web3/)
* [Ethereum Provider API](https://docs.metamask.io/guide/ethereum-provider.html)
