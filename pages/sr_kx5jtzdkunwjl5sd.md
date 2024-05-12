---
title: "Go 官方设计了一个信号量库"
date: 2021-08-30T16:15:27+08:00
draft: false
categories: [dev]
tags: [dev, golang]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzkyNzI1NzM5NQ==&mid=2247485294&idx=1&sn=9a64b475d54321e80089b329d3e4dbf5&utm_source=tuicool&utm_medium=referral)

## 前言

## 何为信号量

要想知道一个东西是什么，我都爱去百度百科上搜一搜，输入 "信号量"，这答案不就来了。

> 信号量 (Semaphore)，有时被称为信号灯，是 [多线程环境下使用的一种设施，是可以用来保证两个或多个关键代码段不被并发调用。在进入一个关键代码段之前，线程必须获取一个信号量；一旦该关键代码段完成了，那么该线程必须释放信号量。其它想进入该关键代码段的线程必须等待直到第一个线程释放信号量。为了完成这个过程，需要创建一个信号量 VI，然后将 Acquire Semaphore VI 以及 Release Semaphore VI 分别放置在每个关键代码段的首末端。确认这些信号量 VI 引用的是初始创建的信号量。

通过这段解释我们可以得知什么是信号量，其实信号量就是一种变量或者抽象数据类型，用于控制并发系统中多个进程对公共资源的访问，访问具有原子性。信号量主要分为两类：

- 二值信号量：顾名思义，其值只有两种 `0` 或者 `1`，相当于互斥量，当值为 `1` 时资源可用，当值为 `0` 时，资源被锁住，进程阻塞无法继续执行。
- 计数信号量：信号量是一个任意的整数，起始时，如果计数器的计数值为 `0`，那么创建出来的信号量就是不可获得的状态，如果计数器的计数值大于 `0`，那么创建出来的信号量就是可获得的状态，并且总共获取的次数等于计数器的值。

## 信号量工作原理

信号量是由操作系统来维护的，信号量只能进行两种操作等待和发送信号，操作总结来说，核心就是 `PV` 操作：

- P 原语：P 是荷兰语 Proberen(测试) 的首字母。为阻塞原语，负责把当前进程由运行状态转换为阻塞状态，直到另外一个进程唤醒它。操作为：申请一个空闲资源 (把信号量减 1)，若成功，则退出；若失败，则该进程被阻塞；
- V 原语：V 是荷兰语 Verhogen(增加) 的首字母。为唤醒原语，负责把一个被阻塞的进程唤醒，它有一个参数表，存放着等待被唤醒的进程信息。操作为：释放一个被占用的资源 (把信号量加 1)，如果发现有被阻塞的进程，则选择一个唤醒之。

在信号量进行 PV 操作时都为原子操作，并且在 PV 原语执行期间不允许有中断的发生。

PV 原语对信号量的操作可以分为三种情况：

- 把信号量视为某种类型的共享资源的剩余个数，实现对一类共享资源的访问
- 把信号量用作进程间的同步
- 视信号量为一个加锁标志，实现对一个共享变量的访问

具体在什么场景使用本文就不在继续分析，接下来我们重点来看一下 `Go` 语言提供的扩展包 `Semaphore`，看看它是怎样实现的。

## 官方扩展包 `Semaphore`

我们之前在分析 `Go` 语言源码时总会看到这几个函数：

```go
func runtime_Semacquire(s *uint32)
func runtime_SemacquireMutex(s *uint32, lifo bool, skipframes int)
func runtime_Semrelease(s *uint32, handoff bool, skipframes int)
```

这几个函数就是信号量的 `PV` 操作，不过他们都是给 `Go` 内部使用的，如果想使用信号量，那就可以使用官方的扩展包：Semaphore，这是一个带权重的信号量，接下来我们就重点分析一下这个库。

> 安装方法：go get -u golang.org/x/sync

### 数据结构

```go
type Weighted struct {
 size    int64 // 设置一个最大权值
 cur     int64 // 标识当前已被使用的资源数
 mu      sync.Mutex // 提供临界区保护
 waiters list.List // 阻塞等待的调用者列表
}
```

`semaphore` 库核心结构就是 `Weighted`，主要有 `4` 个字段：

- `size`：这个代表的是最大权值，在创建 `Weighted` 对象指定
- `cur`：相当于一个游标，来记录当前已使用的权值
- `mu`：互斥锁，并发情况下做临界区保护
- `waiters`：阻塞等待的调用者列表，使用链表数据结构保证先进先出的顺序，存储的数据是 `waiter` 对象，`waiter` 数据结构如下：

```go
type waiter struct {
 n     int64 // 等待调用者权重值
 ready chan<- struct{} // close channel就是唤醒
}
```

这里只有两个字段：

- `n`：这个就是等待调用者的权重值
- `ready`：这就是一个 `channel`，利用 `channel` 的 `close` 机制实现唤醒

`semaphore` 还提供了一个创建 `Weighted` 对象的方法，在初始化时需要给定最大权值：

```go
// NewWeighted为并发访问创建一个新的加权信号量，该信号量具有给定的最大权值。
func NewWeighted(n int64) *Weighted {
 w := &Weighted{size: n}
 return w
}
```

### 阻塞获取权值的方法 - `Acquire`

先直接看代码吧：

```go
func (s *Weighted) Acquire(ctx context.Context, n int64) error {
 s.mu.Lock() // 加锁保护临界区
 // 有资源可用并且没有等待获取权值的goroutine
 if s.size-s.cur >= n && s.waiters.Len() == 0 {
  s.cur += n // 加权
  s.mu.Unlock() // 释放锁
  return nil
 }
 // 要获取的权值n大于最大的权值了
 if n > s.size {
  // 先释放锁，确保其他goroutine调用Acquire的地方不被阻塞
  s.mu.Unlock()
  // 阻塞等待context的返回
  <-ctx.Done()
  return ctx.Err()
 }
 // 走到这里就说明现在没有资源可用了
 // 创建一个channel用来做通知唤醒
 ready := make(chan struct{})
 // 创建waiter对象
 w := waiter{n: n, ready: ready}
 // waiter按顺序入队
 elem := s.waiters.PushBack(w)
 // 释放锁，等待唤醒，别阻塞其他goroutine
 s.mu.Unlock()

 // 阻塞等待唤醒
 select {
 // context关闭
 case <-ctx.Done():
  err := ctx.Err() // 先获取context的错误信息
  s.mu.Lock()
  select {
  case <-ready:
   // 在context被关闭后被唤醒了，那么试图修复队列，假装我们没有取消
   err = nil
  default:
   // 判断是否是第一个元素
   isFront := s.waiters.Front() == elem
   // 移除第一个元素
   s.waiters.Remove(elem)
   // 如果是第一个元素且有资源可用通知其他waiter
   if isFront && s.size > s.cur {
    s.notifyWaiters()
   }
  }
  s.mu.Unlock()
  return err
 // 被唤醒了
 case <-ready:
  return nil
 }
}
```

注释已经加到代码中了，总结一下这个方法主要有三个流程：

- 流程一：有资源可用时并且没有等待权值的 `goroutine`，走正常加权流程；
- 流程二：想要获取的权值 `n` 大于初始化时设置最大的权值了，这个 `goroutine` 永远不会获取到信号量，所以阻塞等待 `context` 的关闭；
- 流程三：前两步都没问题的话，就说明现在系统没有资源可用了，这时就需要阻塞等待唤醒，在阻塞等待唤醒这里有特殊逻辑；
- 特殊逻辑二：`context` 关闭后，则根据是否有可用资源决定通知后面等待唤醒的调用者，这样做的目的其实是为了避免当不同的 `context` 控制不同的 `goroutine` 时，未关闭的 `goroutine` 不会被阻塞住，依然执行，来看这样一个例子（因为 `goroutine` 的抢占式调度，所以这个例子也会具有偶然性）：
- 特殊逻辑一：如果在 `context` 被关闭后被唤醒了，那么就先忽略掉这个 `cancel`，试图修复队列。

```go
func main()  {
 s := semaphore.NewWeighted(3)
 ctx,cancel := context.WithTimeout(context.Background(), time.Second * 2)
 defer cancel()

 for i :=0; i < 3; i++{
   if i != 0{
    go func(num int) {
     if err := s.Acquire(ctx,3); err != nil{
      fmt.Printf("goroutine： %d, err is %s\n", num, err.Error())
      return
     }
     time.Sleep(2 * time.Second)
     fmt.Printf("goroutine： %d run over\n",num)
     s.Release(3)

    }(i)
   }else {
    go func(num int) {
     ct,cancel := context.WithTimeout(context.Background(), time.Second * 3)
     defer cancel()
     if err := s.Acquire(ct,3); err != nil{
      fmt.Printf("goroutine： %d, err is %s\n", num, err.Error())
      return
     }
     time.Sleep(3 * time.Second)
     fmt.Printf("goroutine： %d run over\n",num)
     s.Release(3)
    }(i)
   }

 }
 time.Sleep(10 * time.Second)
}
```

上面的例子中 `goroutine:0` 使用 `ct` 对象来做控制，超时时间为 `3s`，`goroutine:1` 和 `goroutine:2` 对象使用 `ctx` 对象来做控制，超时时间为 `2s`，这三个 `goroutine` 占用的资源都等于最大资源数，也就是说只能有一个 `goruotine` 运行成功，另外两个 `goroutine` 都会被阻塞，因为 `goroutine` 是抢占式调度，所以我们不能确定哪个 `gouroutine` 会第一个被执行，这里我们假设第一个获取到信号量的是 `gouroutine:2`，阻塞等待的调用者列表顺序是：`goroutine:1` -> `goroutine:0`，因为在 `goroutine:2` 中有一个 `2s` 的延时，所以会触发 `ctx` 的超时，`ctx` 会下发 `Done` 信号，因为 `goroutine:2` 和 `goroutine:1` 都是被 `ctx` 控制的，所以就会把 `goroutine:1` 从等待者队列中取消，但是因为 `goroutine:1` 属于队列的第一个队员，并且因为 `goroutine:2` 已经释放资源，那么就会唤醒 `goroutine:0` 继续执行，画个图表示一下：

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_kx5jtzdkunwjl5s/ee766c95.png)

使用这种方式可以避免 `goroutine` 永久失眠。

### 不阻塞获取权值的方法 - `TryAcquire`

```
func (s *Weighted) TryAcquire(n int64) bool { s.mu.Lock() // 加锁 // 有资源可用并且没有等待获取资源的goroutine success := s.size-s.cur >= n && s.waiters.Len() == 0 if success {  s.cur += n } s.mu.Unlock() return success}
```

这个方法就简单很多了，不阻塞地获取权重为 `n` 的信号量，成功时返回 `true`，失败时返回 `false` 并保持信号量不变。

### 释放权重

```
func (s *Weighted) Release(n int64) { s.mu.Lock() // 释放资源 s.cur -= n // 释放资源大于持有的资源，则会发生panic if s.cur < 0 {  s.mu.Unlock()  panic("semaphore: released more than held") } // 通知其他等待的调用者 s.notifyWaiters() s.mu.Unlock()}
```

这里就是很常规的操作，主要就是资源释放，同时进行安全性判断，如果释放资源大于持有的资源，则会发生 panic。

### 唤醒 `waiter`

在 `Acquire` 和 `Release` 方法中都调用了 `notifyWaiters`，我们来分析一下这个方法：

```
func (s *Weighted) notifyWaiters() { for {  // 获取等待调用者队列中的队员  next := s.waiters.Front()  // 没有要通知的调用者了  if next == nil {   break // No more waiters blocked.  }  // 断言出waiter信息  w := next.Value.(waiter)  if s.size-s.cur < w.n {   // 没有足够资源为下一个调用者使用时，继续阻塞该调用者，遵循先进先出的原则，   // 避免需要资源数比较大的waiter被饿死   //   // 考虑一个场景，使用信号量作为读写锁，现有N个令牌，N个reader和一个writer   // 每个reader都可以通过Acquire（1）获取读锁，writer写入可以通过Acquire（N）获得写锁定   // 但不包括所有的reader，如果我们允许reader在队列中前进，writer将会饿死-总是有一个令牌可供每个reader   break  }  // 获取资源  s.cur += w.n  // 从waiter列表中移除  s.waiters.Remove(next)  // 使用channel的close机制唤醒waiter  close(w.ready) }}
```

这里只需要注意一个点：唤醒 `waiter` 采用先进先出的原则，避免需要资源数比较大的 waiter 被饿死。

### 何时使用 `Semaphore`

到这里我们就把 `Semaphore` 的源代码看了一篇，代码行数不多，封装的也很巧妙，那么我们该什么时候选择使用它呢？

目前能想到一个场景就是 `Semaphore` 配合上 `errgroup` 实现一个 "工作池"，使用 `Semaphore` 限制 `goroutine` 的数量，配合上 `errgroup` 做并发控制，示例如下：

```
const ( limit = 2) func main()  { serviceName := []string{  "cart",  "order",  "account",  "item",  "menu", } eg,ctx := errgroup.WithContext(context.Background()) s := semaphore.NewWeighted(limit) for index := range serviceName{  name := serviceName[index]  if err := s.Acquire(ctx,1); err != nil{   fmt.Printf("Acquire failed and err is %s\n", err.Error())   break  }  eg.Go(func() error {   defer s.Release(1)   return callService(name)  }) } if err := eg.Wait(); err != nil{  fmt.Printf("err is %s\n", err.Error())  return } fmt.Printf("run success\n")}func callService(name string) error { fmt.Println("call ",name) time.Sleep(1 * time.Second) return nil}
```

结果如下：

```
call  order
call  cart
call  account
call  item
call  menu
run success
```

## 总结

本文我们主要赏析了 `Go` 官方扩展库 `Semaphore` 的实现，他的设计思路简单，仅仅用几十行就完成了完美的封装，值得我们借鉴学习。不过在实际业务场景中，我们使用信号量的场景并不多，大多数场景我们都可以使用 `channel` 来替代，但是有些场景使用 `Semaphore` 来实现会更好，比如上篇文章【[[警惕] 请勿滥用 goroutine](https://mp.weixin.qq.com/s?__biz=MzkyNzI1NzM5NQ==&mid=2247485253&idx=1&sn=bd63ffef075ee64987ad6b527243a45b&scene=21#wechat_redirect)】我们使用 `channel+sync` 来控制 `goroutine` 数量，这种实现方式并不好，因为实际已经起来了多个 `goroutine`，只不过控制了工作的 `goroutine` 数量，如果改用 `semaphore` 实现才是真正的控制了 `goroutine` 数量。

文中代码已上传 `github`：[https://github.com/asong2020/Golang_Dream/blob/master/code_demo/semaphore_demo/semaphore.go](https://github.com/asong2020/Golang_Dream/blob/master/code_demo/semaphore_demo/semaphore.go)，欢迎 `star`。
