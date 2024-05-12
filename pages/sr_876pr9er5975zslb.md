---
title: "An actor based Framework using technologies and design patterns of Erlang/OTP in Golang"
date: 2023-01-30T09:49:31+08:00
draft: false
categories: [dev]
tags: [dev, golang, erlang]
---
> 原文地址 [golang.ch](https://golang.ch/an-actor-based-framework-using-technologies-and-design-patterns-of-erlang-otp-in-golang/)

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_876pr9er5975zslb/ffd9df33.png)

Technologies and design patterns of Erlang/OTP have been proven over the years. Now in Golang. Up to x5 times faster than original Erlang/OTP in terms of network messaging. The easiest way to create an OTP-designed application in Golang.

### [](https://github.com/ergo-services/ergo#purpose)Purpose

This project aims to leverage Erlang/OTP experience with Golang performance. Ergo Framework implements [DIST protocol](https://erlang.org/doc/apps/erts/erl_dist_protocol.html), [ETF data format](https://erlang.org/doc/apps/erts/erl_ext_dist.html) and [OTP design patterns](https://erlang.org/doc/design_principles/des_princ.html) `gen.Server`, `gen.Supervisor`, `gen.Application` which makes you able to create distributed, high performance and reliable microservice solutions having native integration with Erlang infrastructure

### [](https://github.com/ergo-services/ergo#features)Features

- Support Erlang 24 (including [Alias](https://blog.erlang.org/My-OTP-24-Highlights/#eep-53-process-aliases) and [Remote Spawn](https://blog.erlang.org/OTP-23-Highlights/#distributed-spawn-and-the-new-erpc-module) features)
- Spawn Erlang-like processes
- Register/unregister processes with simple atom
- `gen.Server` behavior support (with atomic state)
- `gen.Supervisor` behavior support with all known [restart strategies](https://erlang.org/doc/design_principles/sup_princ.html#restart-strategy) support
  - One For One
  - One For All
  - Rest For One
  - Simple One For One
- `gen.Application` behavior support with all known [starting types](https://erlang.org/doc/design_principles/applications.html#application-start-types) support
  - Permanent
  - Temporary
  - Transient
- `gen.Stage` behavior support (originated from Elixir’s [GenStage](https://hexdocs.pm/gen_stage/GenStage.html)). This is abstraction built on top of `gen.Server` to provide a simple way to create a distributed Producer/Consumer architecture, while automatically managing the concept of backpressure. This implementation is fully compatible with Elixir’s GenStage. Example is here [examples/genstage](https://github.com/ergo-services/ergo/blob/master/examples/genstage) or just run `go run ./examples/genstage` to see it in action
- `gen.Saga` behavior support. It implements Saga design pattern – a sequence of transactions that updates each service state and publishes the result (or cancels the transaction or triggers the next transaction step). `gen.Saga` also provides a feature of interim results (can be used as transaction progress or as a part of pipeline processing), time deadline (to limit transaction lifespan), two-phase commit (to make distributed transaction atomic). Here is example [examples/gensaga](https://github.com/ergo-services/ergo/blob/master/examples/gensaga).
- `gen.Raft` behavior support. It’s improved implementation of [Raft consensus algorithm](https://raft.github.io/). The key improvement is using quorum under the hood to manage the leader election process and make the Raft cluster more reliable. This implementation supports quorums of 3, 5, 7, 9, or 11 quorum members. Here is an example of this feature [examples/genraft](https://github.com/ergo-services/ergo/blob/master/examples/genraft).
- Connect to (accept connection from) any Erlang/Elixir node within a cluster
- Making sync request `ServerProcess.Call`, async – `ServerProcess.Cast` or `Process.Send` in fashion of `gen_server:call`, `gen_server:cast`, `erlang:send` accordingly
- Monitor processes/nodes, local/remote
- Link processes local/remote
- RPC callbacks support
- [embedded EPMD](https://github.com/ergo-services/ergo#epmd) (in order to get rid of erlang’ dependencies)
- Unmarshalling terms into the struct using `etf.TermIntoStruct`, `etf.TermProplistIntoStruct` or to the string using `etf.TermToString`
- Custom marshaling/unmarshaling via `Marshal` and `Unmarshal` interfaces
- Encryption (TLS 1.3) support (including autogenerating self-signed certificates)
- Compression support (with customization of compression level and threshold). It can be configured for the node or a particular process.
- Proxy support with end-to-end encryption, includeing compression/fragmentation/linking/monitoring features.
- Tested and confirmed support Windows, Darwin (MacOS), Linux, FreeBSD.
- Zero dependencies. All features are implemented using the standard Golang library.
