---
title: "ES6 学习笔记"
date: 2021-07-25T12:48:50+08:00
draft: false
categories: [dev]
tags: [js, web, dev]
---
> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.tuicool.com](https://www.tuicool.com/articles/ieYfa2J)

## 一、ECMAScript 6

### 1. Babel 转码器

#### 1.1 简介

Babel  是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码

#### 1.2babel 安装和配置

```
1. 安装babel
npm init -y 初始化package.json
npm i -D @babel/core
2. 安装规则集
    npm i -D @babel/preset-env   // es6->es5的规则集
3. 创建配置文件
    .babelrc文件
    {
        "presets":[
            "@babel/env"
        ]
    }
```

#### 1.3 命令行运行

```
1. 安装命令行工具@babel/cli
    npm i -D @babel/cli
2. 语法
    npx babel target.js / -o buidle.js / -d dir
```

### 2. `let`

#### 2.1 简介

ES6 新增了 let 命令，用来声明变量。它的用法类似于 var，但是所声明的变量，只在 let 命令所在的代码块内有效

#### 2.2 用法：

```
let num = 12;
```

#### 2.3 let 块级作用域

```
在es6中，只有出现{}，就会产生作用域,let声明的变量如果在{}中，那么这个变量就是局部变量
    如果let声明的变量出现在for循环中，这个变量也是局部变量，只能在for循环的大括号中使用
```

#### 2.4 不存在变量提升

```
console.log(str);
let str='';
//出现"Cannot access 'str' before initialization"报错信息，
//说明使用变量在前，声明变量在后
```

#### 2.5 不允许重复声明

```
let str='';
let str='123';
//出现"Identifier 'str' has already been declared"报错信息，说明变量重复声明了
```

#### 2.6 暂时性死区

```
var count = 1;
    {
        console.log(count);
        let count = 3;
    }
    //这时会报错，报错信息是"先使用变量，后声明变量"。
```

#### 2.7 顶层对象的属性

- ES6 为了改变这一点，一方面规定，为了保持兼容性， `var` 命令和 `function` 命令声明的全局变量，依旧是顶层对象 (window) 的属性；
- 另一方面规定， `let` 命令、 `const` 命令、 `class` 命令声明的全局变量，不属于顶层对象 (window) 的属性。

#### 2.8 globalThis 对象

- 全局环境中，this 会返回顶层对象。但是，Node 模块和 ES6 模块中，this 返回的是当前模块。
- 函数里面的 this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this 会指向顶层对象。但是，严格模式下，这时 this 会返回 undefined

### 3. `const`

#### 3.1 简介

`const` 声明一个只读的常量，一旦声明，常量的值就不能改变。

#### 3.2 用法

```
const url = 'http://localhost:8080'
```

#### 3.3 一旦声明，常量的值就不能改变

```
const url='http';
const url='http://localhost:8080';//报错
console.log(url);
//修改值时，会报错：Assignment to constant variable

const obj={
    user:'fct'
}
obj.user='lllui';//不报错
console.log(obj);
//如果常量保存是一个对象，那么这个常量其实只保存了一个地址，和对象中的具体内容没关系
```

#### 3.4 let 的几个特点，const 全都有

### 4. 变量的解构赋值

#### 4.1 简介

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

#### 4.2 数组解构赋值：

定义变量的结构和目标数组的结构一致，那么对应位置的变量就能获取到对应位置的值。

```
// 1.数组
let arr=[1,2,3,4];
let [b1,b2,b3]=arr;
console.log(b1,b2,b3);//1 2 3

let arr3 = [1,[2,3,[4,5,6,[7,8,9,[10]]]]];
// 3,5,9,10
let [,[,d1,[,d2,,[,,d3,[d4]]]]] = arr3
console.log(d1,d2,d3,d4);

// 2.数组解构赋值--默认值
let [f=2]=[];
console.log(f);//2

/* 3. rest参数
    语法：[a1,...rest] = [1,2,3,4,5]
    作用：获取匹配后剩余的所有元素*/
let [a1,...rest] = [1,2,3,4,5];
console.log(a1,rest);//1 ,[ 2, 3, 4, 5 ]
```

#### 4.3 对象的解构赋值：

定义变量名称和对象中的属性名一致，那么就能获取到对应属性名的值。

```
// 1. 对象解构赋值-------------------------------
let obj={
    user:'fct',
    age:'21',
    sex:'sex'
}
let {age,sex,user,tel}=obj;
console.log(user,age,sex,tel);//fct 21 sex undefined

// 2. 解构也可以用于嵌套结构的对象
let obj2 = {
    info: {
        tel: '123',
        address: 'xx'
    }
};
//2.1 info是模式，不是变量因此不会被赋值
let { info: { tel, address }} = obj2;
console.log(tel, address);//123 xx
console.log(info);//info is not defined
//2.2 取info
let { info , info: { tel, address }} = obj2;
console.log(tel, address);//123 xx
console.log(info);//{ tel: '123', address: 'xx' }

//3. 修改变量名, uname:uname1---------(同名对象属性)
let obj3 ={
    uname:'kevin',
    friends:{
        1:{
            uname:'lily'
        },
        2:{
            uname:'lucy'
        }
    }
};
// 3.1 修改friends变量名
let {friends:py}=obj3;
console.log(py);//{ '1': { uname: 'lily' }, '2': { uname: 'lucy' } }
// 3.2 模式,friends是模式
let {friends:{1:{uname}}}=obj3;
console.log(uname);//lily
// 3.3 想获取lily和lucy两个人名
let {uname:uname1,friends:{1:{uname:uname2},2:{uname}}} = obj3;

/* 修改变量名和匹配路径上的模式的区别
    uname:uname1
    如果uname就是最终想获取的值，uname1就是修改变量名;
    uname:{xxxxx}
    如果uname是最终想获取值的路径上的名称，uname就是模式*/

// 4.默认值
let { a = 2 } = {

};
console.log(a);//2

// 5. ...rest参数
let { a = 2, ...rest } = { a: 1, b: 2, c: 3 };
console.log(a, rest);//1 { b: 2, c: 3 }
```

```
//例题：解构对象赋值
let obj4 = {
    name: '电脑',
    main: [
        {
            name: '电源',
            pinpai: 'xx电源'
        }, {
            name: 'CPU',
            pinpai: 'YYCPU'
        }
    ],
    peijian: [
        {
            name: '键盘',
            pinpai: '罗技'
        }, {
            name: '鼠标',
            pinpai: '雷蛇'
        }
    ]
}
// 取出所有的name的值
let {name:name1,main:[{name:name2},{name:name3}],peijian:[{name:name4},{name:name5}]}=obj4;
console.log(name1,name2,name3,name4,name5);//电脑 电源 CPU 键盘 鼠标
```

#### 4.4 函数的参数也可以使用解构赋值

```
//1. 形参解构赋值
function demo([a1,a2,a3,a4,a5]){
    console.log(a1,a2,a3,a4,a5);
}
demo([1,2,3,4,5]);//1 2 3 4 5

function demo2({a:first,b}){
    console.log(first,b);
}
demo2({a:1,b:2});//1 2

function demo3({a,...obj}){
    console.log(a,obj);
}
demo3({a:1,b:2,c:3});//1 { b: 2, c: 3 }

//2. 实参解构赋值
function demo4(a,b){
    console.log(a,b);
}
let obj={
    author:'fct',
    id:244,
    url:'http://',
    title:'标题',
    desc:'描述内容'
}
let {author,desc}=obj;
demo4(author,desc);//fct 描述内容

// 3.默认值
function demo5({ a = 5, b = 6 } = {}) {
    console.log(a, b);
}
demo5();//5 6
demo5({});//5 6
demo5({ a: 2 });//2 6
```

### 5. 字符串拓展

#### 5.1 模板字符串

定义字符串的新的方式，这种方式中可以随意换行，可以写变量，这个变量也可以直接被解析

```
//模板字符串：
let obj={
    str1:'举头望明月，'
}
let str2='低头思故乡。'
let str=`
    床前明月光，
    疑是地上霜。
    ${obj.str1}
    ${str2}`;
console.log(str);
/*
    床前明月光，
    疑是地上霜。
    举头望明月，
    低头思故乡。
*/
```

### 6. 数组扩展

#### 6.1 扩展运算符

#### 6.1.1 语法：

​ `...arr`

```
// 1.扩展运算符
let arr=[1,2,'a','b',true];
console.log(arr);//[ 1, 2, 'a', 'b', true ]
console.log(...arr);//1 2 a b true
```

#### 6.1.2 作用：

​ 能把数组中的元素直接释放出来，成为一个个的值

6.1.3 应用场景：

1. 替代函数的 apply 方法

   ```
   let arr=[1,2,'a','b',true];function demo(a,b,c,d,e){    console.log(a,b,c,d,e);}demo.apply(this,arr);//1 2 a b truedemo(...arr);//1 2 a b true
   ```
2. 复制数组 或 复制对象

   ```
   // 2.1复制数组
   let arr2=[1,{name:'keli'},3];
   let arr3=[...arr2];
   arr2[1].name='lilei';
   arr2[0]=666;
   // 浅拷贝,地址引用还在
   console.log(arr2);//[ 666, { name: 'lilei' }, 3 ]
   console.log(arr3);//[ 1, { name: 'lilei' }, 3 ]

   //2.2 复制对象
   let obj3={
       name:'fct',
       age:'22'
   }
   let obj4={...obj3};
   console.log(obj4);//{ name: 'fct', age: '22' }
   ```
3. 合并数组或对象

   ```
   //合并对象
   let obj={
       a:1,
       b:2,
       c:3
   }
   let obj2={
       d:4
   }
   obj2={...obj2,...obj};//合并对象
   console.log(obj2);//{ d: 4, a: 1, b: 2, c: 3 }
   ```
4. 扩展运算符和 rest 参数有一个显著的区别

   `1.` 扩展运算符 永远 出现等号的 右边，或者直接使用。

   ```
   let obj4={...obj3};
   ```

   `2.` rest 参数一般都在等号的左边

   ```
   let { a , ...rest } = { a: 1, b: 2, c: 3 };
   console.log(a, rest);//1 { b: 2, c: 3 }
   ```
5. 实现了 Iterator 接口的对象

   ```
   //将类数组都可以用扩展运算符转为真正的数组let divList=document.querySelectorAll('div');let divArr=[...divList];//例2：function demo2(){    console.log(arguments);//[Arguments] { '0': 1, '1': 2, '2': 3, '3': 45 }    console.log([...arguments]);//[ 1, 2, 3, 45 ]}demo2(1,2,3,45);
   ```
6. Map 和 Set 结构，Generator 函数

   原生具备 Iterator 接口的数据结构如下。

   `Array`
   `Map`
   `Set`
   `String`
   `TypedArray`
   函数的 `arguments 对象`

   `NodeList 对象`

#### 6.2 `Array.from()`

`Array.from()` : 将类数组转化为真实的数组

`Array.from` 方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

```
let obj5={
    0:'a',
    1:'b',
    2:'hello',
    length:3
}
// let arr4=[...obj5];//报错，没有部署Iterator接口
let arr4=Array.from(obj5);//成功
console.log(arr4);//[ 'a', 'b', 'hello' ]
```

#### 6.3 `Array.of()`

用于将一组值，转换为数组

```
let arr5=Array.of(1,2,3,4);
console.log(arr5);//[ 1, 2, 3, 4 ]

let arr6=new Array(3);
console.log(arr6);//[ <3 empty items> ]
```

#### 6.4 `fill()`

使用给定值，填充一个数组

```
let arr7=new Array(5).fill(3);
console.log(arr7);//[ 3, 3, 3, 3, 3 ]
```

### 7. 对象的扩展

#### 7.1 属性的简洁表示法

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法

```
let x=10;
let obj={
    // x:x
    x,// 属性简洁表示法
    fn(a,b){//函数简洁表示
        console.log(a,b);
    }
}
console.log(obj);//{ x: 10, fn: [Function: fn] }
```

#### 7.2 属性名表达式

ES6 允许字面量定义对象时, 把表达式放在方括号内, 作为对象的属性名

```
let str = 'uname';
function myage(){
    return 'age';
}
let obj3 ={
    [str]:'kevin',
    [myage()]:12
}
console.log(obj3);//{ uname: 'kevin', age: 12 }
```

#### 7.3 对象新增的方法

#### 1. Object.is()

在所有环境中，只要两个值是一样的，它们就应该相等

它用来比较两个值是否严格相等， `与严格比较运算符（===）的行为基本一致。`

`不同之处` 只有两个：一是 + 0 不等于 - 0，二是 NaN 等于自身。

```
Object.is('foo','foo');//true
Object.is({},{});//false

+-0===-0;//true
NaN===NaN;//false
Object.is(+0,-0);//false
Object.is(NaN,NaN);//true
```

#### 2. Object.assign()

`Object.assign` 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）

```
// Object.assign()
let target={};
let newObj=Object.assign(target,{a:1},{b:'cc',c:'er'},{d:4});
console.log(target);//{ a: 1, b: 'cc', c: 'er', d: 4 }
console.log(newObj);//{ a: 1, b: 'cc', c: 'er', d: 4 }
```

对象的每个属性都有描述对象（ `Descriptor` ），用于控制该属性的行为

Object.defineProperty( obj , key ,{

value : '值',

writable : true, // 可写

enumerable : true, // 可枚举性

configurable : true // 是否可配置

})

`0bject.assign():` 忽略 enumerable 为 false 的属性，只拷贝对象自身的可枚举的属性。

Object.getOwnPropertyDescriptor(obj,'key')，方法可以获取该属性的描述对象

#### 3.Object.keys()，Object.values()，Object.entries()

```
Object.keys():
Object.values():
Object.entries():
```

### 8. `Promise` 期约

#### 8.1 简介

`Promise` 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

所谓 Promise，简单说就是一个 `容器` ，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

#### 8.2 使用

```
//Promise 是一个构造函数，使用时new
let p = new Promise(function(resolve,reject){
    // 异步
    resolve(data) // 保存请求成功时的结果
    reject(err)   // 保存请求失败是的错误信息
});

//把Promise容器中保存的结果拿出来
p.then(function success(data){

    },function error(err){

    })
```

#### 8.3 网络请求工具

`fetch` (es6 内置的新的网络请求方式)

`axios` (ajax)

#### 8.4Promise 三个状态

1、 `pending` --------[待定]-------------- 初始状态

2、 `resolved` ------[实现]---------------- 操作成功

3、 `rejected` -----[被否决]------------- 操作失败

当 promise 状态发生改变，就会 `触发then()` 里的响应函数处理后续步骤；

promise 状态一经改变，不会再变。

Promise 对象的状态改变，只有两种可能：

从 pending 变为 resolved

从 pending 变为 rejected。

这两种情况只要发生，状态就凝固了，不会再变了

#### 8.5 Promise.proptotype. `then()`

#### 8.6 Promise.prototype. `catch()`

```
.catch() = .then(null,function(err){})
//捕获Promise错误的信息
```

#### 8.7 Promise.prototype. `finally()`

不管 Promise 是成功了还是失败了，这个方法一定会执行

#### 8.8 Promise.prototype. `all()`

- Promise.all() 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例
- 语法：

  ```
  let p=Promise.all([p1,p2,p3]);
  p.then((data)=>{
    conlose.log(data);//输出数据集合
  })
  ```
- 返回值：

  1. 当 p1,p2,p3 都成功时，能获取到这个三个 promise 的成功结果，组成一个数组
  2. 当这三个 promise 有任意一个失败，Promise.all 就返回失败结果

#### 8.9 Promise. `race()`

- Promise.race() 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例, 只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。
- 语法：

  ```
  let first=Promise.race([p1,p2,p3]);
  first.then((data)=>{
    conlose.log(data);//获取最先改变状态的期约Promise
  })
  ```
- 返回值：

  只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。

#### 8.10 Promise. `resolve()`

​ 简写： `resolve()`

​ 把 promise 的状态设置成功状态

#### 8.10 Promise. `reject()`

​ 把 promise 的状态设置失败状态

#### 8.11 Promise. `allSettled()`

- 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。
- 语法

  ```
  let results=Promise.allSettled([p1,p2,p3]);
  results.then((data)=>{
      console.log(data);//Promise数据数组
  })
  ```

### 9.Generator(了解)

- `Generator` 函数是 ES6 提供的一种 `异步编程` 解决方案, 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态, 执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态.
- 语法：

  Generator 函数是一个普通函数，但是有两个特征。一是， `function` 关键字与函数名之间有一个星号；二是，函数体内部使用 `yield` 表达式，定义不同的内部状态（ `yield` 在英语里的意思就是 “产出”）。
- 执行 Generator 后返回值是 `遍历器对象` ，这个对象上有一个方法 `next()` , 调用这个方法才能执行 Generator 函数内部的每一个状态.
- `next()` 方法的返回值

  `next方法` 返回一个对象，它的 `value` 属性就是当前 `yield` 表达式的值 hello， `done` 属性的值 false，表示遍历还没有结束

  ```
  //Generator 函数
  function* hello(){
      yield 'hello',
      yield 'world',
      yield 1;
      yield 2;
      yield 'fct';
  }
  let it=hello();//生成遍历器对象

  console.log(it);//hello {<suspended>}
  console.log(it.next());//{value: "hello", done: false}
  console.log(it.next());//{value: "world", done: false}
  console.log(it.next());//{value: 1, done: false}
  console.log(it.next());//{value: 2, done: false}
  console.log(it.next());//{value: "fct", done: false}
  console.log(it.next());//{value: undefined, done: true}
  ```
- `co库`

快速执行 Generator 函数

### 10. `Async` 函数

#### 10.1 简介

​ 是 Generator 函数的语法糖 (新语法), 理解 `async` = `Generator` + `co` 。

​ await 也是状态机，只有 await 后的代码执行完成，才能向后执行，await 还能执行 `promise.then()` 方法

#### 10.2 语法

```
//语法：
async function demo(){
    await 1;
    await 2;
}
//调用
demo();
```

#### 10.3 使用

```
async function demo(){
    let a=await 1;
    let b=await 2;
    let c=await 'fct';
    return a+'-'+b+'-'+c;
}
console.log(demo());//Promise { <pending> }---返回值是Promise对象
demo().then((data)=>{
    console.log(data);//   1-2-fct
    // 无return ，值为  undefined
})
```

#### 10.4 优点

```
Promise
```

#### 10. 5 错误捕获

- async 函数返回一个 Promise 对象
- Promise 对象的状态变化：默认的，async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或者抛出错误。
- 任何一个 await 语句后面的 Promise 对象变为 reject 状态，那么整个 async 函数都会中断执行，则 reject 的参数会被 catch 方法的回调函数接收到

#### 10.6 `await` 命令

```
Promise
```

### 11. 函数扩展

#### 11.1 函数参数的默认值

```
// es6 函数参数默认值
function demo(a=1,b=3){
    console.log(a+b);
}
demo();//1+3=4
demo(2);//2+3=5
demo(4,6);//4+6=10

// 参数是数组
function demo2([a=1,b=2]=[]){
    console.log(a+b);
}
demo2();//3
demo2([5]);//7
demo2([5,4]);//9

// 参数是对象
function demo3({a=3,b=6}={}){
    console.log(a+b);
}
demo3();//9
demo3({a:1});//7
demo3({b:2});//5
demo3({num1:1,num2:2});//9
```

#### 11.2 rest 参数

ES6 引入 `rest 参数` （形式为... 变量名），用于获取函数的多余参数

注意：rest 参数必须放在函数形参的最后一位

```
// rest参数function demo4(a,b,...abc){    console.log(abc);}demo4(1,2,3,4,5);//[ 3, 4, 5 ]
```

#### 11.3 严格模式

​ ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

​ 一般把严格模式加在全局。

#### 11.4 name 属性

​ 函数的 name 属性，返回该函数的函数名。

```
function demo(){}
demo.name //demo
```

#### 11.5 箭头函数

​ ES6 允许使用 “箭头”（=>）定义函数。

​ `this引用` 的是定义箭头函数的上下文

```
//语法：
  let demo = () => (123||{a:1},[1,2,3])
  //同上
  function demo(){
      return 123||{a:1},[1,2,3];
  }
  let demo = () => {console.log('没有返回值的箭头函数')}
  let demo = a => a;
  let demo = (a,b) => { return a+b};
```

使用注意点：

(1) 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象。

箭头函数内部不自动产生 this, 而是使用定义箭头函数时所在位置的外层作用域中的 this。

​ (2) 不可以当作构造函数

```
(3)	不能用作 Generator 函数
```

​ (4) 不可以使用 arguments 对象, 使用 rest 参数替代

### 12. `class` 类

#### 12.1 基本使用

```
ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
```

```
//语法：
class Person{
    //构造方法:默认实例化时会自动调用，做初始化
    constructor(name,age,sex){
        this.name = name;
        this.age =age;
        this.sex = sex;
    }
    say(){
        console.log('我是',this.name);
    }
}
//使用
let obj = new Person('小明',12,'男');
console.log(obj);//Person { name: '小明', age: 12, sex: '男' }
obj.say();//我是 小明
```

#### 12.2 说明：

- 在 class 中定义的方法，是放在构造函数的原型上的
- 类的内部所有定义的方法，都是不可枚举的

  ```
  conlose.log(Object.keys(Person.prototype));//[]
  console.log(Object.getOwnPropertyNames(Person.prototype));//[ 'constructor', 'say' ]
  ```
- 一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加
- 实例化 class 时，必须有 new 关键字，否则报错
- 取值函数（getter）和存值函数（setter）

  ```
  get getName(){
          return this.name;
      }
  set setName(value){
      this.name=value;
  }


  obj.setName='xiaoming';
  console.log(obj.getName);//xiaoming
  obj.say();//我是 xiaoming
  ```
- `this` 指向问题

  1. `ES6` 模块中， `this` 返回的是当前模块
  2. 单纯作为函数运行， `this` 会指向顶层对象。但是，严格模式下，这时 `this` 会返回 `undefined`
  3. 如果类中的一个函数不管是通过实例化对象调用还是作为纯函数调用，我都想让函数中的 `this` 指向当前类的实例 (当前模块)，处理方案有 2 种

     1. 在 `constructor` 方法中绑定 `this`

        ```
        this.say = this.say.bind(this);
        ```
     2. 使用箭头函数

        ```
        say =()=>{

        }
        ```
- 静态方法

  在一个方法前，加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为 “静态方法”。

  ```
  class Person{
    static all(){//定义静态方法

    }
  }

  //使用：
  Person.all();
  //如果静态方法包含this关键字，这个this指的是类
  ```
- 继承

  - Class 可以通过 `extends` 关键字实现继承

    ```
    //语法
    class Bird{
        constructor(cb,leg) {
            this.cb=cb;
            this.leg=leg;
        }
        fly(){
            console.log('会飞');
        }
    }
    // 麻雀
    class Maqu extends Bird{
        constructor(cb,leg,name,color){
            super(cb,leg);//调用父类的constructor()
            this.name=name;
            this.color=color;
        }
        tiao(){
            console.log('用'+this.leg+'跳');
        }
    }
    let lily=new Maqu('2只翅膀','2条腿','lily','白色');
    console.log(lily);//Maqu { cb: '2只翅膀', leg: '2条腿', name: 'lily', color: '白色' }
    lily.fly();//会飞
    lily.tiao();//用2条腿跳
    ```
  - `super()`
    子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 `super` 方法，子类就得不到 this 对象。

    ```
    //调用父类的constructor()
    super();
    ```

### 13.Es6 module

#### 13.1 简介

​ ES6 模块功能主要由两个命令构成： `export` 和 `import` 。 `export` 命令用于规定模块的对外接口， `import` 命令用于输入其他模块提供的功能。

```
//export 导出命令
//  13_moduleA.js
export var num=12;

export function demo(){
    console.log('demo');
}

export let count=10;

export const url='http://localhost:3000';

export class Person{
    constructor(name){
        this.name=name;
    }
}

export let jt=()=>{
    console.log('箭头函数');
}

let num1=1;
let num2=2;
export{
    num1,num2
}

// 重命名导出的模块 可以使用as关键字重命名
export { num as myNum};//将num重命名为  myNum
```

```
//import 导入命令
//13_moduleB.js
import {num,demo,count,url,Person,jt,num1,num2} from './13_moduleA.js';
//注意：引入的必须是xx.js中export导出的数据
console.log(num);
demo();
console.log(count);
console.log(url);
let m=new Person('小明');
console.log(m);
jt();

//把xx.js中所有export导出的数据取出来，然后放到obj对象上
import * as obj from './xx.js';
```

#### 13.2 `export default` 导出命令

```
//默认导出，一个js中只能出现一次
  const pic='1.jpg';
  export default pic：//导出一个名称为`default`的模块

  //import 导入 export default模块语法：
  import A/b/myPic from './xx.js';//随便命名
```

- 使用 webpack 运行该项目

  安装：

  ```
  npm i -S webpack webpack-cli webpack-dev-server
  npm i -g webpack webpack-cli webpack-dev-server
  ```

  创建一个配置文件：webpack.config.js

  运行 webpack 命令, 在 code 文件夹下运行

  webpack , 然后按回车键

  在 dist 文件夹下创建一个 index.html，在这个 HTML 中添加

  在运行一条命令：webpack-dev-server

  在浏览器中打开 [http://localhost:9000/](http://localhost:9000/)

### 14.Proxy 代理

#### 14.1 简介

​ `Proxy` 可以理解成，在目标对象之前架设一层 “拦截”，外界对该对象的访问，都必须先通过这层拦截，Proxy 用于修改某些操作的默认行为。

#### 14.2 使用

```
//语法：
  new Proxy(target,handler);
//返回值----返回一个对象
```

#### 14.3 Proxy 支持的拦截操作有 13 个

- `get(target, propKey, receiver)` ：拦截对象属性的读取
- `set(target, propKey, value, receiver)` ：拦截对象属性的设置

  等......

#### 14.4 应用

```
let obj={
    name:'lilei',
    age:21,
    sex:'男'
}
let proxy=new Proxy(obj,{
    get(target,key,receiver){
        console.log(target,propKey,receiver);//{ name: 'lilei', age: 21, sex: '男' } name { name: 'lilei', age: 21, sex: '男' }
        // console.log('禁止访问任何属性');
        // return false;   //1.
        return '结果：'+Reflect.get(target,key,receiver);//2.
    },
    set(target,propKey,value,receiver){
        console.log(target,propKey,value,receiver);
        //{ name: 'lilei', age: 21, sex: '男' } name 小明 { name: 'lilei', age: 21, sex: '男' }
        return Reflect.set(target,propKey,value,receiver);
    }
});

console.log(proxy.name);//1. false---- 2.结果：lilei
proxy.name='小明';
console.log(proxy.name);//结果：小明
```

- 会使用到的一个 API， `Reflect`

### 15. less

#### 15.1 简介

​ `less` 是 `css` 的预处理语言。除了 `less` ，还有 `scss(sass)` 、 `stylus` 这些预处理语言。将 `CSS` 赋予了动态语言的特性，如 变量， 继承， 运算， 函数。

​ `css预处理语言` 编写的 `css` ，浏览器是不认识，所以需要首先编译成 `纯css` ，需要使用工具。命令行工具 ， `gulp` ， `webpack` 。

#### 15.2 安装

```
#安装
npm install xxxxxxxx

#全局安装,全局安装后，主要就是给命令行提供命令的
npm i -g less

#项目依赖：就是给当前项目使用的
npm i -S / -D less
#-S 是 --save-dev 的简写，作用是开发阶段和上线阶段都需要使用的模块，默认值就是-S ,如：npm i less
#-D 是 --save 的简写，作用是只在开发阶段使用
```

#### 15.3 使用

- 创建 `less` 文件
  首先创建一个 `.less` 结尾的文件
- 命令行编译
  `lessc xx.less xx.css`

#### 15.4 less 语法

1. 变量

   ```
   // 定义变量
   @danger:red;
   @baseWidth:20px;
   @baseHeight:10px;
   @warning:yellow;
   @success:green;
   @primary:blue;

   #box{
       min-height: @baseHeight*20;
       background: @warning;
       color:@danger;
   }
   ```
2. 嵌套

   - 提供了使用嵌套（nesting）代替层叠或与层叠结合使用的能力

     ```
     #box{
         min-height: @baseHeight*20;
         background: @warning;
         color:@danger;
         // 嵌套
         .sp1{
             color:@primary;
             font-size:ceil(200/34px);
         }
     }
     ```
   - & 妙用

     ```
     .font{
         color:#cccccc;
         font-size:20px;
         // &妙用：代表的上一层选择器的名字
         &:hover{
             color:darken(@danger,20%);
         }
     }
     ```
3. 混合

   - 声明的集合，使用时 直接键入名称即可

     ```
     // margin 集合.margin20{//无参数可省略（    margin:@baseWidth;}// 声明圆角效果，1. 固定值.radius(){    border-radius: 4px;}// 2. 可变的值.radius2(@w){    border-radius: @w;}// 3. 变量可以有默认值.radius3(@w:5px){    border-radius: @w;}.c1 {    border:1px solid @success;    .margin20;    .radius();}.c2{    border:1px solid @danger;    .margin20;    .radius2(8px);}.c3{    border:2px solid @primary;    .margin20;    .radius3(10px);}
     ```

     4. 继承

        可以实现 css 复用

        ```
        #box2{
            &:extend(#box);
            //&:extend(#box .p1 .font);
            //&:extend(#box all);
        }
        //all属性，继承整个目标的样式，包括子级
        ```
4. 导入

   允许在 less 文件中引入其他的 less 或 css 文件

   ```
   @import 'path';
   @import 'test.less';
   ```
5. 函数

   都是内置的，直接使用就可以

   - 判断类型
   - 颜色操作
   - 数学函数
6. 循环方法

```
// 循环方法
.generate-columns(@n, @i: 1) when (@i =< @n) {
    .column-@{i} {
      width: (@i * 100% / @n);
      height: 10px;
      background:darken(@primary,@i * 5%);
    }
    .generate-columns(@n, (@i + 1));
}
.generate-columns(10);
```
