---
title: "响应式编程 (Reactive Programming) 初探"
date: 2022-08-25T09:19:41+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzU3NTY3MTQzMg==&mid=2247537821&idx=1&sn=bc90040975f5a68a7fed0c35d068086e&chksm=fd1d897aca6a006c812bd35a64211fab0fe81229eefeec3642181282a0e3b6213aa35848c845#rd)

### 什么是响应式编程

网络上对于 `响应式编程` 有各种各样的解释，比如：

响应式编程 (Reactive Programming) 是一种基于数据流 (Data Stream) 和 变化传递 (Propagation of change) 的声明式 (declarative) 的编程范式。

言简意赅，从字面上准确地描述了响应式编程的业务主体及意义。然而，这个定义本身并不能对理解响应式编程有什么过多的帮助，因为 `数据流Stream` 是天然存在的，数据的 `传递和变化过程` 必然也是同周围环境相互影响的，即使没有响应式编程，也是程序要处理的业务主体。例如：

移动鼠标持续生成移动事件（即数据），引起显卡持续渲染过程，并生成变化的图像数据，在显示器上显示出来。

这个业务主要完全符合上述定义中描述的业务主体，然而，实现这个业务的 `编程范式` 确并不一定基于 `响应式编程`。

不过，定义中也确实表达了一点，也是很重要的内容：

- 它是一种 `编程范式`。或者说是一种思维方式
- 它区别于固化于程序员大脑中的 `基于过程的命令式的带状态的` 编程习惯。

而改变固有的编程习惯，以 `响应式编程的方式思考` 也是适应 RP 的最困难的过程。

### 响应式编程是面向数据流的编程

同面向过程，面向对象一样，面向数据流是编程思考主体的改变。于是响应式编程的思路大致如下：

数据流本身是常见的事物，客户端上的用户操作、服务端接口的调用事件，都是自然形成的持续不断的数据流，通过对数据流监听，可以方便的对事件做出响应。在对数据流监听的基础上，通过预定义的无状态操作符 (Operators)，结合 lamba 表达式，来实现对数据的变换 (Transforming)、过滤 (Filtering)、组合 (Combine)，进而实现既定的业务规则，甚至可以通过接受多个数据流的输入来协作完成任务。

#### 数据流（Stream）

`Stream`，时间线上的 `Event` 序列，在响应式编程中，`Event` 有三种基本类型：

- _值 (Value)_
- _错误 (Error)_
- _完成 (Complete)_

通过在 `Stream` 上监听，我们可以持续捕获这些 `Event`，让其通过预定义的 `Function`，从而给出相应的业务动作或异常处理，直到捕获到 `Complete` 。这个过程中，包含的响应式编程的相关概念如下：

- Stream：被观察者，Observable
- Function： 观察者，Observer
- Stream 上监听：订阅，Subscribe
- 被捕获的 Event：事件

上述内容可以用如下的图来描述

```
--1--2--3--4--E--|-->
[ map(x=>x*x) ]
[ onError(E=>-1)]
--1--4--9--16--(-1)--|-->

-->：时间线
1,2,3,4：Value事件
E：Error事件
|: Completeg事件
map: Function
onError: 异常处理
```

#### 操作符（Operators）

在 `响应式编程` 中，提供了丰富的操作符，它们主要分为：

- 创建 (Creating)
- Create,Defer,From,Just,...
- 转换 (Transforming)
- Buffer,FlatMap,GroupBy,Map,...
- 过滤 (Filtering)
- Debounce,Distinct,Filter,First,...
- 合并 (Combining)
- CombineLatest,Zip,...
- 异常处理 (Error Handing)
- onError,...
- 工具 (Observable Utility)
- Delay,ObserveOn,SubscribeOn,...
- 条件 / 布尔 (Conditional and Boolean)
- All,Contains,DefaultIfEmpty,...
- 聚合 (Mathematical and Aggregate)
- Average,Count,Max,Min,Reduce,...
- 其它 (Others)

我们以 RxJava([https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava)) 这个响应式编程框架的实现，介绍几个比较常用的操作符。

##### Create([https://reactivex.io/documentation/operators/create.html](https://reactivex.io/documentation/operators/create.html))

```
[ Create{onNext(1);onNext{2};onComplete} ]
----------------1---------2------------|-->
```

通过 Create Operator 来创建一个 Stream:

```java
Flowable. < Integer > create(emitter - > {
    emitter.onNext(1);emitter.onNext(2);emitter.onComplete();
}, BackpressureStrategy.BUFFER).subscribe(array3 - > {});
```

##### Buffer([https://reactivex.io/documentation/operators/buffer.html](https://reactivex.io/documentation/operators/buffer.html))

```
--1--2--3--4--5--6----|->
[ Buffer ]
--[1,2,3]--[4,5,6]----|->
```

通过 Buffer，可以将流中逐个发出的事件按规则转换成 buffer 集合的流。

```java
Flowable.just(1, 2, 3, 4, 5, 6)
.buffer(3) // 每3个元素为一组
.subscribe(array3->{});
```

##### FlatMap([https://reactivex.io/documentation/operators/flatmap.html](https://reactivex.io/documentation/operators/flatmap.html))

```
--1--2--3----|->
[ FlatMap(x-> --x--x--|->) ]
--1--1--2--2--3--3----|->
```

将一个流中的每个事件转换成另一个流，并展开连接成一个流。

```java
Flowable.just(1, 2, 3)
.flatMap(x -> Flowable.just(x, x))
.subscribe(array2 -> {
});
```

##### Map([https://reactivex.io/documentation/operators/map.html](https://reactivex.io/documentation/operators/map.html))

```
--1--2--3----|->
[ Map(x=>x*10) ]
--10--20--30----|->
```

将一个流中的每个事件类型转换成另一个类型。

```java
Flowable.just(1, 2, 3)
.map(x -> x * 10)
.subscribe(x10 -> {
});
```

##### Filter([https://reactivex.io/documentation/operators/filter.html](https://reactivex.io/documentation/operators/filter.html))

```
--1--2--3----｜->
[ Filter(x->x>1) ]
-- --2--3----|-?
```

使用指定的 Predicate 过滤流中的第一个事件。

```java
Flowable.just(1, 2, 3)
.filter(x -> x > 1)
.subscribe(x10 -> {
});
```

##### Zip

```
--1--2--3----|->
--a--b--c----|->
[ Zip((x,y)-> --[x,y]--|->) ]
--[1,a]--[2,b]--[3,c]----|->
```

合并多个流中的每个事件，并将合并后的事件流做为新流。

```java
Flowable.zip(
	Flowable.just(1, 2, 3),
	Flowable.just("a", "b", "c"),
	(f1, f2) -> new Object[]{f1, f2}
)
.subscribe(xy -> {
});
```

### 在业务中使用响应式编程

有了对 `Stream` 的认知，我们尝试融入一些业务场景。考虑一个比较常见的服务端（PS: 我是一枚后端程序猿）业务场景：

A 服务通过订阅 MQ 的 "object-update-message-topic" 来接收指定数据的变更通知，然后从生产服务 (objectProduceService) 拉取相关数据对象并更新本地缓存(objectCacheService)。

显而易见：

- MQ 持续推送过来的消息形成了 Stream，理论上这个是个 Infinity Stream
- A 服务订阅这个 Stream
- 变更通知即是 Event
- 拉取数据并更新本地缓存的操作是 Function
- 过程中的产生的异常构成了 Error 事件和相关的处理过程

#### 命令式的面向过程的实现

对于这个简单的业务场景，我们可以有如下的实现：

```java
public void startObjectUpdateMessageSubscribe() {
    this.subscribe("object-update-message-topic", new MessageConsumer < ObjectUpdateMessage > () { /**             * 对象变更消息处理器             *             * @param message 消息             */
        @Override public void onMessage(@NotNull ObjectUpdateMessage message) {
            // 验证数据
            if (message.getObjectId() <= 0 L) {
                return;
            }
            long objectId = message.getObjectId();
            Object obj;
            try {
                // 从上游接口拉取数据
                obj = objectProduceService.getObject(objectId);
                log.info("Load object success, objectId={}, obj is {}", objectId, obj == null ? "null" : "nonNull");
            } catch (Throwable e) {
                // 异常处理
                log.error(String.format("Load object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                return;
            }
            try {
                // 缓存到本地
                boolean isSetOk = objectCacheService.set(
                    CacheEntry.builder()
                    .id(objectId)
                    .obj(obj)
                    .build()
                );
                log.info("Cache object {}, objectId={}", isSetOk ? "success" : "failed", objectId);
            } catch (Throwable e) {
                // 异常处理
                log.error(String.format("Cache object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
            }
        }
    });
}
```

#### 基于响应式编程实现

现在我们基于响应式编程来实现这个业务过程，首先通过绘制一个简图来简单描述下这个 Stream:

```
--m--m--m--...-->[ map(m=>m.getObjectId)] // 获取需要更新的数据id--id--id--id--...-->[ filter(id=>id>0L) ] // 验证数据--id--  --id--...-->[ flatMap(id=>--object--|-> // 从上游接口拉取数据       [ map(object->cacheEntry) ] // 包装成cacheEntry       [ onError(E->empty) ] // 当异常时返回空       --cacheEntry--|->) ]--cacheEntry--  --cacheEntry--...-->[ do(cacheEntry=> --isSetOk--|-> // 更新本地缓存         [ onSuccess(isSetOk->doSomething)] // 缓存成功         [ onError(E->doSomething) ] // 缓存数据异常处理) ] // 写入缓存--cacheEntry--cacheEntry--...-->...:表示无限
```

于是我们有如下的实现 (PS: 代码基于 RxJava([https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava)))：

```java
public void startObjectUpdateMessageSubscribeWithReactive() {
    Flowable. < ObjectUpdateMessage > create(emitter - > this.subscribe("object-update-message-topic",
                (MessageConsumer < ObjectUpdateMessage > ) message - > {
                    try {

                        emitter.onNext(message);
                    } catch (Throwable e) {

                        emitter.onError(e);
                    }
                    //  emitter.onComplete(); 因为是Infinity Stream，所以理论上不会有Complete Event
                }
            ),
            BackpressureStrategy.BUFFER)
        .map(message - > message.getObjectId())
        .filter(objectId - > objectId > 0 L) // 验证数据
        .flatMapMaybe(objectId - >
            // 从上游接口拉取数据
            Maybe.fromCallable(() - > this.objectProduceService.getObject(objectId))
            .doOnSuccess(obj - > log.info("Load object success, objectId={}, obj is nonNull", objectId))
            .map(nonNullObject - >

                CacheEntry.builder()

                .id(objectId)

                .obj(nonNullObject)

                .build()
            )
            .switchIfEmpty(Maybe.fromCallable(() - > {
                log.info("Load object success, objectId={}, obj is null", objectId);
                return CacheEntry.builder().id(objectId).build();
            }))
            .onErrorResumeNext(e - > {
                // 异常处理
                log.error(String.format("Load object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                return Maybe.empty();
            })
        )
        .doOnNext(cacheEntry - > // 更新本地缓存
            Single.fromCallable(() - > objectCacheService.set(cacheEntry))
            .subscribe(isSetOk - > {
                log.info("Cache object {}, objectId={}", isSetOk ? "success" : "failed", cacheEntry.getId());
            }, e - > {
                // 异常处理
                log.error(String.format("Cache object error, objectId=%s, error=%s", cacheEntry.getId(), e.getMessage()), e);
            })
        )
        .subscribe();
}
```

### 为什么要用响应式编程

通过对比前面两段代码，各位看官会发现，对于这个简单的业务场景，基于响应式编程的实现会更复杂和冗长。

`问`: _使用响应式编程的意义在哪？_

`答`: _响应式编程提高了代码的抽象等级，所以可以让编码人员将关注点更多的放到业务逻辑，而不是纠缠于大量的非业务过程的实现细节。_

我们尝试对前面实现的业务做一些变更来理解这个概念:

- 业务变更: 数据对象的组装需要两个上游服务
- _objectProduceService_
- _extendProduceService_
- 优化：数据变更过于频繁，为减少不必要的数据拉取请求，需要 `控制拉取频率` 并且 `合并重复请求`

#### 命令式的面向过程的实现

实现思路：

- 使用 _ConcurrentMap/ScheduledExecutorService_ 相结合来实现 `重复请求合并` 与 `拉取频率控制`
- 使用 _ExecutorService_ 来实现两个接口的并发调用

```java
public void startObjectUpdateMessageSubscribe() {
    ConcurrentMap < Long, Object > scheduleFutureCache = new ConcurrentHashMap < > ();
    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    ExecutorService executorService = Executors.newFixedThreadPool(10);
    this.subscribe("object-update-message-topic", new MessageConsumer < ObjectUpdateMessage > () { /**             * 对象变更消息处理器             *             * @param message 消息             */
        @Override public void onMessage(@NotNull ObjectUpdateMessage message) {
            // 验证数据
            if (message.getObjectId() <= 0 L) {
                return;
            }
            long objectId = message.getObjectId();
            scheduleFutureCache.computeIfAbsent(objectId, k - > {
                ScheduledFuture << ? > schedule = scheduler.schedule(() - > {
                    try {
                        Future < Object > futureObj = executorService.submit(() - > {
                            Object obj;
                            try {
                                // 从上游接口拉取数据
                                obj = objectProduceService.getObject(objectId);
                                log.info("Load object success, objectId={}, obj is {}", objectId, obj == null ? "null" : "nonNull");
                            } catch (Throwable e) {
                                // 异常处理
                                log.error(String.format("Load object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                                throw e;
                            }
                            return obj;
                        });
                        Future < Object > futureExt = executorService.submit(() - > {
                            Object ext;
                            try {
                                // 从上游接口拉取数据
                                ext = extendProduceService.getExtend(objectId);
                                log.info("Load extend success, objectId={}, ext is {}", objectId, ext == null ? "null" : "nonNull");
                            } catch (Throwable e) {
                                // 异常处理
                                log.error(String.format("Load extend error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                                throw e;
                            }
                            return ext;
                        });
                        _Object obj = null;
                        try {
                            // 并发从上游查询数据
                            Object oObj = futureObj.get();
                            Object oExt = futureExt.get();
                            if (oObj != null && oExt != null) {
                                obj = new _Object(oObj, oExt); // 当两个请求都返回有效的结果(无异常/nonNull)时组装Object
                            }
                            log.info("Load object success, objectId={}, obj is {}", objectId, obj == null ? "null" : "nonNull");
                        } catch (Throwable e) {
                            // 异常处理
                            log.error(String.format("Load object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                            return;
                        }
                        try {
                            // 缓存到本地
                            boolean isSetOk = objectCacheService.set(

                                CacheEntry.builder()

                                .id(objectId)

                                .obj(obj)

                                .build()
                            );
                            log.info("Cache object {}, objectId={}", isSetOk ? "success" : "failed", objectId);
                        } catch (Throwable e) {
                            // 异常处理
                            log.error(String.format("Cache object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                        }
                    } finally {
                        // 清理资源
                        scheduleFutureCache.remove(objectId);
                    }
                }, 100 L, TimeUnit.MILLISECONDS); // 控制请求qps=10
                return schedule;
            });
        }
    });
}
```

#### 以响应式编程的方式思考

几乎所有的业务都可以转变为一个 `Stream`，所以 Stream 就是我们的业务 `请求`。

- `Stream既可以是无限的的，也可以是有限的，它可以是只发射单个事件，甚至也可以是空的`
- `对应的业务请求可以描述为请求可以有一个或多个，甚至没有`

我们启动对 `Stream` 的订阅，监听 `Events`，并对其做出合理的 `响应`。对于业务而言，这等同于我们接收到了 `请求`，并对 `请求` 做出正确的 `响应`。

回到上面的服务端更新本地缓存的业务场景，初始版本的 `响应式编程思考` 如下：

- MQ 推送数据对象变更消息 Stream：持续不断的本地缓存更新请求
- 并更新本地缓存：对请求做出响应：
- 验证消息数据
- 从上游服务拉取最新的数据对象
- 更新本地缓存

```
--m--m--m--...-->[ map(m=>m.getObjectId)] // 获取需要更新的数据id--id--id--id--...-->[ filter(id=>id>0L) ] // 验证数据--id--  --id--...-->[ flatMap(id=>--object--|-> // 从上游接口拉取数据       [ map(object->cacheEntry) ] // 包装成cacheEntry       [ onError(E->empty) ] // 当异常时返回空       --cacheEntry--|->) ]--cacheEntry--  --cacheEntry--...-->[ do(cacheEntry=> --isSetOk--|-> // 更新本地缓存         [ onSuccess(isSetOk->doSomething)] // 缓存成功         [ onError(E->doSomething) ] // 缓存数据异常处理) ] // 写入缓存--cacheEntry--cacheEntry--...-->
```

后续，我们叠加了更复杂的业务规则

- 数据对象需要从多个上游服务拉取数据并组合
- 合并重复的请求、控制请求频率

可以看到，`Stream` 本身，即 `请求`，并没有任何变化，变化的内容是对请求的 `响应`:

- 验证消息数据
- 通过合并一段时间内的相同的请求来实现降低重复请求和控制频率
- 创建一个从 objectProduceService 拉取的数据的 Stream(单个事件)，并调度到 IO 线程池上执行
- 创建一个从 extendProduceService 拉取的数据的 Stream(单个事件)，并调度到 IO 线程池上执行
- 合并两个流返回的有效数据，并组装成目标数据对象
- 根据请求频率的控制要求 (如最大 qps=10) 来缓存一段时间 (qps=10, 则 TimeInterval=100ms) 的 Event
- 发射一个合并后 ObjectId
- 基于 ObjectId 分组，创建新 Stream
- 以并发方式从上游服务拉取指定数据
- 更新本地缓存

我们成功地以 `响应式编程思维` 完成了对变个业务场景的分析，接下来，只需要使用正确的 `Operators` 完成代码的编写即可。

#### 基于响应式编程实现

实现思路：

- 使用 `groupBy` 操作符对 objectId 进行分组，进而实现 `重复请求合并`
- 通过操作分组后的子流 `groupedFlowable`，使用 buffer 操作符，缓存指定时间长度，来实现 `拉取频率控制`
- 使用 `zip` 操作符，结合 `subscribeOn` 线程调度，来实现两个接口的并发调用

```
--m1--m2--m1--...-->[ map(m=>m.getObjectId)] // 获取需要更新的数据id--id1--id2--id1--...-->[ filter(id=>id>0L) ] // 验证数据--id1--id2--id1--...-->[ groupBy(id) ] // 按objectId进行分组[ flatMap(id=>--id1--...-->             ,--id2--...-->             ,...       [ buffer(time) ]          ,[ buffer(time) ]          ,... // 控制请求qps=10       --[id1,id1,...]--|->      ,--[id1,id1,...]--|->      ,...       [  mapOptional(arr=>id1) ],[  mapOptional(arr=>id2) ],...              --id1--|->
,--id2--|->
,...) ]--id1--id2--...-->[ flatMap(id=>zip(  // 从上游接口拉取数据         --object--|->, // 并发(调度到io线程)从上游查询数据         --extObj--|->,         (object, extObj) -> targetObj // 当两个请求都返回有效的结果(无异常/nonNull)时组装Object
 )
 --targetObj--|->// 当两个请求都返回有效的结果(无异常/nonNull)时组装Object
 [ map(targetObj->cacheEntry) ] // 包装成cacheEntry
 [ onError(E->empty) ] // 当异常时返回空
 --cacheEntry--|->) ]--cacheEntry1--  --cacheEntry2--...-->[ do(cacheEntry=> --isSetOk--|-> // 更新本地缓存         [ onSuccess(isSetOk->doSomething)] // 缓存成功         [ onError(E->doSomething) ] // 缓存数据异常处理) ] // 写入缓存--cacheEntry--  --cacheEntry--...-->
```

```java
public void startObjectUpdateMessageSubscribeWithReactive() {
    Flowable. < ObjectUpdateMessage > create(emitter - > this.subscribe("object-update-message-topic",
                (MessageConsumer < ObjectUpdateMessage > ) message - > {
                    try {

                        emitter.onNext(message);
                    } catch (Throwable e) {

                        emitter.onError(e);
                    }
                    //  emitter.onComplete(); 因为是Infinity Stream，所以理论上不会有Complete Event
                }
            ),
            BackpressureStrategy.BUFFER)
        .map(message - > message.getObjectId())
        .filter(objectId - > objectId > 0 L) // 验证数据
        .groupBy(objectId - > objectId) // 按objectId进行分组
        .flatMap(groupedFlowable - >
            groupedFlowable.buffer(100 L, TimeUnit.MILLISECONDS) // 控制请求qps=10
            .mapOptional(arr - > arr.stream().findFirst()) //
        )
        .flatMapMaybe(objectId - >
            // 从上游接口拉取数据
            Maybe.zip( // 并发(调度到io线程)从上游查询数据
                Maybe.fromCallable(() - > objectProduceService.getObject(objectId)).subscribeOn(Schedulers.io()),

                Maybe.fromCallable(() - > extendProduceService.getExtend(objectId)).subscribeOn(Schedulers.io()),

                (oObj, oExt) - > new _Object(oObj, oExt) // 当两个请求都返回有效的结果(无异常/nonNull)时组装Object
            )
            .doOnSuccess(obj - > log.info("Load object success, objectId={}, obj is nonNull", objectId))
            .map(nonNullObject - >

                CacheEntry.builder()

                .id(objectId)

                .obj(nonNullObject)

                .build()
            )
            .switchIfEmpty(Maybe.fromCallable(() - > {
                log.info("Load object success, objectId={}, obj is null", objectId);
                return CacheEntry.builder().id(objectId).build();
            }))
            .onErrorResumeNext(e - > {
                // 异常处理
                log.error(String.format("Load object error, objectId=%s, error=%s", objectId, e.getMessage()), e);
                return Maybe.empty();
            })
        )
        .doOnNext(cacheEntry - >
            Single.fromCallable(() - > objectCacheService.set(cacheEntry))
            .subscribe(isSetOk - > {
                log.info("Cache object {}, objectId={}", isSetOk ? "success" : "failed", cacheEntry.getId());
            }, e - > {
                // 异常处理
                log.error(String.format("Cache object error, objectId=%s, error=%s", cacheEntry.getId(), e.getMessage()), e);
            })
        )
        .subscribe();
}
```

### 结束语

##### 对比两种实现方式:

- 传统的实现过程，为实现业务变更和优化的目的，相比于变更前，代码量有明显的膨胀，而且变得难以理解
- 基于 `响应式的编程` 的实现方式，相比业务变更前，代码量并没有多少变化，业务过程仍然是清晰明了的

充分利用响应式编程，使得我们可以更关注业务本身，但正如文章的开头所述，使用响应式编程最大的难点在于 `如何以响应式编程思维` 来思考业务规则，而 `响应式编程思维` 要以 `基于Stream所承载的Events在业务过程中的自然响应过程` 来思考编程。

在服务端的业务过程实现中，正确理解和运用 `响应式编程`，特别是包含了复杂的数据对象组装过程，可以极大的简化原本臃肿的代码实现。

然而，对于服务端编程而言，`响应式编程` 的真正威力还不仅于此，在异步非阻塞的场景中，它才是核心。

结束！
