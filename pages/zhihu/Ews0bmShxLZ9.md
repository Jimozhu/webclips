---
title: 利用Puppeteer来标准化抓站新闻格式
date: 2024-10-04T15:30:37.236Z
categories:
  - zhihu
tags:
  - zhihu
  - 写代码的
origin_url: //zhuanlan.zhihu.com/p/84688168
---
本文比较长，阅读完成大概需要半小时到四十分钟的时间，知识点和信息熵覆盖度比较密集，提前预警一下。

***

## 背景和需要解决的问题：

1. 上游服务生产大量的文章爬虫数据，下游 Puppeteer 服务需要处理这些数据，转换成格式化的标准文章。
2. 之所以使用 Puppeteer 服务来产生标准化文章是因为只有浏览器才能比较精准的解析 css，而我们需要提取出关键的样式再赋予标准化的格式，比如加粗，加斜，或者居中，大小号字体等。
3. 任务处理比较多，QPS 需要达到 50-200。

首先，你需要先对 Puppeteer 有一个简单的认识，它的官网在这里：

[](https://link.zhihu.com/?target=https%3A//github.com/GoogleChrome/puppeteer)

然后，我们简单的用一句话概括，Puppeteer 就是一个可编程的服务端无头浏览器，提供了丰富的 API 来让开发者做一些自动化的事。

所以解决这个问题的思路就是：

1. Puppeteer 打开 Browser，准备好对应的 Tab。
2. 爬虫服务调用 Puppeteer 服务，Puppeteer 处理来源的原始 HTML。
3. HTML 利用 Puppeteer 打开后，进行节点的过滤和选择。
4. 解析真正的正文部分内容，获取节点内的 computedStyle。
5. 过滤一部分异常的内容，根据筛选后的符合标准化样式的 Style 做对应的格式化转换，加入我们自己的 className。
6. 把结果返回，如果中间有错误，把错误返回。
7. 关闭这个 Tab。
8. 关闭这个 Browser。

看起来挺美好的，启动一个简单的 NodeJs 后端服务，我们就可以按照这 8 个步骤完成开发，但是现实其实并不是这么美好。

1. 频繁的开关 browser 和 tab，效率很低。
2. Puppeteer 异常一次后，browser 就不受控制，无法关闭，导致内存泄露，前期上线后 QPS 高时，内存暴涨，QPS 低时，内存不释放。
3. 插入的 HTML 内容里有部分 JS 做了防抓站，会跳走。
4. 在 Page 中 evaluate 脚本的时候，极度难以调试，你也不知道爬虫抓来的是啥东西，错误率超高，调试需要 case by case，上线后 JS 报错很难追踪和复现。
5. Puppeteer 自身很慢，并发非常低，处理任务一秒一个都做不到，我们的要求是 QPS 最少 50。

所以其实这个项目的大头不在于解析样式和格式化样式（虽然这部分代码也挺有意思，后边简单给一些代码），但是挑战其实在于如何让服务稳定且性能高。

我做了几件事：

## 一，设计了一个简易的 Puppeteer 连接池

```js
class pool {
  constructor(browserMax, pageMax) {
    this.browsers = [];
    this.browserMax = browserMax;
    this.pageMax = pageMax;
  }
}
```

Pool 类接受 2 个参数，browserMax 和每个 browser 的 pageMax 数，使用 browsers 来储存所有的 browser 和 page。

```js
 async createAll() {
    for (var i = 0; i < this.browserMax; i++) {
      let browser = await createBrowser();
      this.browsers[i] = { browser, pages: []};
      let [defaultPage] = await browser.pages();
      defaultPage = await setPage(defaultPage);
      this.browsers[i].pages[0] = {
        page: defaultPage,
        used: false,
        count: 0,
        browser
      };
      for (var k = 1; k < this.pageMax; k++) {
        let page = await createPage(browser);
        this.browsers[i].pages[k] = {
          page,
          used: false,
          count: 0,
          browser
        };
      }
    }
    return this.browsers;
  }
```

提前创建好所有的 browser，避免每次请求需要用到的时候临时创建和关闭，增加并发和性能，我们创建的方法比较简单，这里需要注意的是，await 在 forEach 里有一些古怪的问题，这里不展开说，最好都使用 for in 或者 for of 来处理这种 async，await 的场景。

每个 browsers 的 item 存着一个 browser 引用，一组 page 引用。

```js
let [defaultPage] = await browser.pages();
```

这句是为了拿到默认打开第一个 tab 用的。

每个 page 的引用里保存了自己的引用，当前这个 page 是否在使用，使用了几次，以及归属于哪个 browser。

```js
async function createBrowser() {
  let browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "dev" ? false : true,
    ignoreHTTPSErrors: true,
    args: [
      "--disable-web-security",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote",
      "--disable-popup-blocking"
    ]
  });
  return browser;
}
```

创建 browser 的代码，需要配置一下 chrome 的参数，比如不限制安全请求，禁用 popup 弹窗，禁用 sandbox 规则等，因为我们不知道抓来的 html 里都有什么样的请求限制，索性都打开了。

启动的时候 headless 也根据环境来切换是否无头启动，本地 dev 开发，调试起来还是有界面的方便一些。

```js
async function createPage(browser) {
  // 使用默认的就是 PC 的 devices
  // const devices = require("puppeteer/DeviceDescriptors");
  // const iPhonex = devices["iPhone X"];
  let page = await browser.newPage();
  page = await setPage(page);
  return page;
}
```

创建 Page 的代码，可以设置统一的 UA 和设备类型，Puppeteer 默认是 PC 设备。

```js
async function setPage(page) {
  await page.setViewport({
    width: 1200,
    height: 800
  });
  // await page.emulate(iPhonex);
  // await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on("request", request => {
    let type = request.resourceType(); // else
    if (type === "image" || type === "script") request.abort();
    else if (
      request.isNavigationRequest() ||
      request.redirectChain().length > 0
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  return page;
}
```

设置每个 page 的一些属性，比如打开的 Viewport，模拟移动设备，是否进制执行 js，是否过滤一些资源请求，为了让处理速度更快，我们禁用掉了 script 和 image 资源，只保留 css 的资源加载，并且阻止了 frame 需要多次重定向的请求。

```js
async use(func, ctx) {
    let item = await this._findFreePage();
    if (item) {
      item.used = true;
      item.count++;
      let ret;
      try {
        ret = await func(item.page);
      } catch (e) {
        logger.error(`${e.message}`, ctx);
      }
      if (item.count >= 5) {
        await item.page.close();
        item.page = await createPage(item.browser);
        item.count = 0;
      }
      item.used = false;
      return ret;
    } else {
      responseCode.throwError(
        responseCode.NOT_FREE_PAGE_INSTANCE,
        "not free page instance"
      );
    }
  }
```

use 方法是从连接池里拿可复用的 page 的方法，这里的规则是先找到一个空闲的 page 单位，然后给这个 page 单位加锁，使用次数累计，然后开始执行使用，使用报错我们会进行 try catch 捕获，然后如果使用完了，使用次数超过 5 次，那么我们关闭这个 page，然后创建新的 page 实例，补上这个 page 单位。最后解锁 page，返回 page 实例的处理结果。

如果没有空闲的 page，返回对应的错误，说明所有的 page 都在使用中，调用方会进行等待重试。

```js
 async _findFreePage() {
    for (var i = 0; i < this.browserMax; i++) {
      for (var k = 0; k < this.pageMax; k++) {
        let item = this.browsers[i].pages[k];
        if (item.used === false) {
          if (item.page.isClosed()) {
            item.page = await this.createPage(this.browsers[i]);
            item.count = 0;
          }
          this.browsers[i].pages.push(this.browsers[i].pages.splice(k, 1)[0]);
          return item;
        }
      }
    }
    return false;
  }
```

我们怎么从池子里找到空闲的 page 呢，也比较简单，首先从我们存储的 browsers 对象中进行查找，找到下面没有被 used 的 page，判断是否有异常被关闭了，如果异常被关闭了，我们需要重新建立补上，然后使用次数归 0，最后我们这个选中的 page 的存储排序挪到数组最后，让其他的没有被 used 的 page 有更大（快）的机会被拿到。

```js
 async checkFree() {
    for (var i = 0; i < this.browserMax; i++) {
      for (var k = 0; k < this.pageMax; k++) {
        if (this.browsers[i].pages[k].used) {
          await sleep(1000);
          return this.checkFree();
        }
      }
    }
  }
  async close() {
    for (var i = 0; i < this.browserMax; i++) {
      await this.browsers[i].browser.close();
    }
  }
```

关闭方法不多说了，直接把所有 browsers 关了即可，checkFree 方法进行所有的 page 检查，如果有一个在使用，那么就等 1 秒，再重新检查，这个 checkFree 是用来进行所有 browsers 重启用的，使用方法如下：

```js
 let pagePool = new Pool(poolConfig.browserMax, poolConfig.pageMax);
  pagePool.browsers = await pagePool.createAll();

  function loopFreeMem(ms) {
    setTimeout(async () => {
      let oldPool = pagePool;
      backup = new Pool(poolConfig.browserMax, poolConfig.pageMax);
      backup.browsers = await backup.createAll();
      pagePool = backup;
      await oldPool.checkFree();
      await oldPool.close();
      logger.info(`loop free mem ${oldPool.id}, ${pagePool.id}`);
      loopFreeMem(ms);
    }, ms);
  }

  loopFreeMem(1000 * 60 * 60 * 4);
```

我们在服务启动之前，先创建一个 pagePool，然后创建所有的 page，保存在 browsers 这个数组中。

然后写一个定时释放所有 browsers 的递归，比如 4 小时一次的 loop，一天检查 6 次，避免服务内存一直不释放的问题。

在 loopFreeMem 函数中，我们先保存老的 pagePool 引用，然后创建一个新的，要切换的 browsers 对象，然后进行上面的 checkFree 操作，一直检查到所有的 page 都被用完释放，关闭所有 browsers，然后开始下一次 loop。

```js
 await pagePool.use(async page => {
    await page.evaluate();
 },ctx);
```

ctx 是 koa 传入的，为了在内部可以打 log 用，这样我们使用时，就是这样就可以拿到一个空闲的 page 实例了，再对 page 直接做我们想做的操作，比如 evaluate 等，而我们也不需要维护这个 page 的生命周期，所有的操作都封装在了 pagePool 连接池中。

## 二，调试 evaluate 中的代码。

我们都知道在 Puppeteer 的 evaluate 中执行的脚本是浏览器内的 JavaScript，它和 NodeJs 环境是不同的上下文，所以我们在 evaluate 中的日志是不太好看的，针对这个问题，其实可以在 \`evaluate return\` 的时候，把我们想 log 的数据一并导出就行了，实现起来也很简单。

```js
async function parse(page, xpath, selector) {
  // await autoScroll(page);
  const newDoc = await page.evaluate(
    (selector, xpath) => {
     return {
       str: result,
       log: logs
     };
  },
    selector,
    xpath
  );
  return newDoc
}
```

嗯，直接返回一个对象，带着我们想要的处理结果和日志结果，然后我们打印的时候可以这样：

```js
  let response = await createParse(page, selector, xpath);
  response.log.map(item => {
    logger.info(`${ctx.requestId} page.console: ${item}`);
  });
  return response.str
```

直接把接口请求的 requestId 和日志做关联然后循环输出就行了。

## 三，XPATH 隐藏的坑和格式化主逻辑

可以从上面看出我们是支持 xpath 和 selector 来进行二次的 HTML 筛选的，这里说一下 XPATH 的选择方法，因为大部分的同学可能对这个比较陌生，尤其是在浏览器端的 API。

```js
 function $xpath(path) {
        try {
          return document.evaluate(
            path,
            document.documentElement,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
          );
        } catch (e) {}
      }
```

这里注意第四个参数 XPathResult.ORDERED\_NODE\_ITERATOR\_TYPE，可以去查一下官方网站这个位置的参数有什么作用，之前遇到一个问题就是文章的排序没有按照原文的顺序来，因为默认的排序关系是选择关系，而不是 NODE 的 ORDERED。

```js
if (xpath) {
          result = "";
          rootList = $xpath(xpath);
          let domList = [];
          logs.push("xpath query success!");
          next = rootList.iterateNext();
          while (next) {
            domList.push(next);
            next = rootList.iterateNext();
          }
          for (var i = 0; i < domList.length; i++) {
            var item = domList[i];
            result += await cleancode(item);
          }
          return {
            str: result,
            log: logs
          };
        }
```

之后的操作就比较简单了，但是这里需要注意的是，xpath 在 evaluate 之后，如果你在 iterateNext 之前对结果节点进行了修改，那么你就无法再做 iterateNext 操作了，会报错。所以我们的 cleancode 函数需要在 while 分组完成后进行格式化了。

```js
 function dfs(dom, process) {
          nodeNum++;
          let children = [];
          Array.from(dom.childNodes).forEach(child => {
            let next = dfs(child, process);
            if (next) {
              children.push(next);
            }
          });
          return process(dom, children);
        }
```

在 cleancode 函数中，主要是依赖于 dfs 这个函数进行筛选后结果的递归操作，在每个 process 函数中对每个 dom 节点和这个节点的 children 集合做判断和修改，用来输出最后的格式化结果，下面我举几个例子：

```js
 function replaceTable(node) {
          let tableList = Array.from(node.getElementsByTagName("table"));
          if (tableList.length === 0) return;
          tableList.forEach(table => {
            let trs = Array.from(table.getElementsByTagName("tr"));
            let ps = [];
            trs.forEach(tr => {
              let html = tr.innerHTML;
              let p = document.createElement("p");
              p.innerHTML = html;
              ps.push(p);
            });
            ps.forEach(p => {
              table.parentNode.insertBefore(p, table);
            });
            table.parentNode.removeChild(table);
          });
        }
```

比如把 table 都换成 p 标签，因为我们的页面不支持直接渲染 TABLE，会很丑，也没办法控制大小。

```js
 function shouldDisplayBlock(dom) {
          let selfblock = getComputedStyle(dom).display === "block";
          if (selfblock) return selfblock;
          // 判断同级是否有 block
          let brotherBlock = false;
          for (var i = 0; i < dom.parentNode.childNodes.length; i++) {
            let node = dom.parentNode.childNodes[i];
            if (
              node.nodeType === 1 &&
              getComputedStyle(node).display === "block"
            ) {
              brotherBlock = true;
              break;
            }
          }
          return brotherBlock;
        }
```

比如判断一个 dom 是否应该是 block 的，因为有的网站，父元素不是 block，但是子元素 block 了，那么这个元素应该也是 block 的。

```js
function removeHidden(dom) {
          // 过滤隐藏元素
          let isDisplayNone = getComputedStyle(dom).display === "none",
            isVisibility = getComputedStyle(dom).visibility === "hidden",
            /*
            isSmallIMG =
              parseInt(getComputedStyle(dom).width, 10) < 12 &&
              parseInt(getComputedStyle(dom).height, 10) < 12,
              */
            isColor =
              getComputedStyle(dom).color.match(/rgba\((?:\d+,\s){3}(\d+)\)/) &&
              parseInt(
                getComputedStyle(dom).color.match(
                  /rgba\((?:\d+,\s){3}(\d+)\)/
                )[1],
                10
              ) === 0,
            isImgFontsize =
              parseInt(getComputedStyle(dom).fontSize, 10) <= 0 &&
              dom.getElementsByTagName("img").length === 0, // 字体的尺寸为 0
            isTextIndent =
              parseInt(getComputedStyle(dom).textIndent, 10) <= -999, // 文本缩进小于 999px 的
            isBGcolor =
              (!getComputedStyle(dom).backgroundColor ||
                getComputedStyle(dom).backgroundColor === "") &&
              getComputedStyle(dom).color === "#ffffff", // 不存在背景色，且字体颜色为白色
            isBGcolorSame =
              getComputedStyle(dom).backgroundColor &&
              getComputedStyle(dom).backgroundColor ===
                getComputedStyle(dom).color, // 存在背景色，且背景色和字体颜色一致
            isSmallWH =
              parseInt(getComputedStyle(dom).width, 10) < 18 &&
              parseInt(getComputedStyle(dom).height, 10) < 18 &&
              getComputedStyle(dom).overflow === "hidden", // 高度或者宽度小于 18px 且 overflow 为 hidden
            isOpacity = parseInt(getComputedStyle(dom).opacity, 10) === 0;
        
          return (
            isDisplayNone ||
            isVisibility ||
            // isSmallIMG ||
            isColor ||
            isImgFontsize ||
            isTextIndent ||
            isBGcolor ||
            isBGcolorSame ||
            isSmallWH ||
            isOpacity
          );
        }
```

再比如判断一个元素是不是真的不可见，我们的规则也非常多。

```js
 function processNode(dom, next) {
          if (dom.nodeType === 1) {
            let tagName = dom.tagName.toLowerCase();
            if (WHITELIST_TAG.includes(tagName) && next.length) {
              // 白名单标签，嵌套一层
              return (
                "<" +
                tagName +
                ' cms-style="' +
                tagName +
                '">' +
                next.join("") +
                "</" +
                tagName +
                ">"
              );
            } else if (tagName === "a") {
              return (
                "<a href='" +
                dom.getAttribute("href") +
                "'>" +
                next.join("") +
                "</a>"
              );
            } else if (MEDIA_TAG.includes(tagName)) {
              if (
                dom.getAttribute("data-original") ||
                dom.getAttribute("original") ||
                dom.getAttribute("real_src") ||
                dom.getAttribute("data-src") ||
                dom.getAttribute("p_src") ||
                dom.getAttribute("src")
              ) {
                return (
                  "<" +
                  tagName +
                  " src='" +
                  (dom.getAttribute("data-original") ||
                    dom.getAttribute("original") ||
                    dom.getAttribute("real_src") ||
                    dom.getAttribute("data-src") ||
                    dom.getAttribute("p_src") ||
                    dom.getAttribute("src")) +
                  "'>"
                );
              }
            } else if (NEWLINE_TAG.includes(tagName)) {
              return "<p cms-style='font-L'>&nbsp;</p>";
            } else if (
              // 过滤隐藏元素
              removeHidden(dom)
            ) {
              return "";
            } else if (
              shouldDisplayBlock(dom) &&
              // dom.offsetParent !== null && //pandu
              next.length
            ) {
              if (!next.join("").match(/<p\s?[^>]*>/g)) {
                // 获取 next 所有样式 进行叠加
                if (next.includes("<br>")) {
                  // 将 br 拆成多个 p
                  let brArr = [];
                  next
                    .join("")
                    .split(/<br>/)
                    .forEach(section => {
                      section &&
                        brArr.push(
                          "<p cms-style='" +
                            cmsStyle(dom) +
                            "'>" +
                            section +
                            "</p>"
                        );
                    });
                  return brArr.join("");
                } else {
                  // 在外层嵌套 p
                  return (
                    "<p cms-style='" +
                    cmsStyle(dom) +
                    "'>" +
                    next.join("") +
                    "</p>"
                  );
                }
              } else {
                return next.join("");
              }
            } else {
              return next.join("");
            }
          }
          if (dom.nodeType === 3) {
            let text = dom.nodeValue.replace(/^(&nbsp;?\s*)*$/g, "");
            if (
              dom.parentNode.tagName === "SCRIPT" ||
              dom.parentNode.tagName === "STYLE"
            ) {
              return "";
            }
            if (/(^\s+$|^\B$)/.test(text)) return "";
            return text;
          }
        }
```

最后我们把整个 HTML 通过 dfs 函数中的方法遍历出一套标准的基于白名单和过滤规则的 HTML string 来，可以看到过滤函数里拼接的标准样式都是通过 css 的属性选择器来进行修正的，而 cmsStyle 函数则是解析 dom 样式，来进行判断，这一行文本应该是什么标准样式的方法。还有比如遇到 br 和分段怎么办，遇到 script，遇到 image（处理懒加载属性），遇到媒体标签怎么处理的逻辑。

最后我们拿到了所有的样式之后，还有一套兜底的补充逻辑，比如我们 xpath 选中的内容，全是文本，没有匹配到合法的 html 标签，再或者选中的内容，有文本是直接在一级元素中的，我们无法遍历到 dom 和 children 的时候，需要一套能够补标签的逻辑，这个逻辑我利用的 Javascript 中的正则 exec 方法。

```js
// 兜底的 p 标签
        let reg = /<(p|blockquote|ul)[\s|\S]*?>[\s|\S]*?<\/\1>/g;
        reg.lastIndex = 0;
        let execsize = 0;
        let exceptTime = 0;
        let result = "";
        while ((crt = reg.exec(lasthtmlstring)) !== null) {
          let itemLength = crt[0].length;
          if (reg.lastIndex - itemLength != execsize) {
            let needWrapItem = lasthtmlstring.slice(
              execsize,
              reg.lastIndex - itemLength
            );
            if (!/^\s+$/g.test(needWrapItem)) {
              result += `<p cms-style='font-L'>${needWrapItem}</p>`;
            }
          }
          result += crt[0];
          execsize = reg.lastIndex;
          exceptTime++;
        }
        if (execsize !== lasthtmlstring.length) {
          result += `<p cms-style='font-L'>${lasthtmlstring.slice(
            execsize,
            lasthtmlstring.length
          )}</p>`;
        }
```

这里的技巧也可以说一下，我们通过记录每次 exec 匹配到的节点位置，匹配的长度，来进行非捕获的感知，比如我们匹配到的第一个 p 或者 blockquote 标签的位置不是第一个开始位置，说明开始位置到匹配的第一个位置这个区间出现了异常，如果不是空字符，那么我们就需要补一个 p 元素包住，这样全部匹配完毕后，最后的判断是说，如果匹配的最后结果不等于最终结果长度，说明结尾部分也是有异常的，需要补一个兜底的 P 元素。

## 四，充钱让服务变强。

前面说了一些优化方法和使用方法，以及格式化的主逻辑，我们其实最终遇到的问题还是说，并发扛不住，qps 到了 10 几个的时候，容器 pod 的 cpu 就飙到 99%-120% 的使用率。

那么我们通过调整了 browser 的数量，tab 的数量后发现，增加多 browser 和 tab 并不能让负载有效的增高，但是会让 cpu 和内存成倍的增加，最后发现每一个 browser 的创建，都会让 nodejs handle 住一个 chrome 的进程，这个消耗太大且不划算，最后我们决定，一个 docker 容器启动 4 个进程，每个进程启动 1 个 browser，每个 browser 启动 10 个 page。

这样一个 docker 容器就可以同时处理 40 个请求，但是只启动了 4 个 browser，然后我们决定通过多容器负载的方式来增加 qps，也就是说达到 200 的 QPS 的话我们就启动 5 个 pod 就可以了，因为一次处理请求在 1s 内很难完成，我们后来发现是因为有一些脏数据阻塞了 Puppeteer，我们可以通过设置比较短的超时时间来进行预防，比如：

```js
await page
    .setContent(html, {
      timeout: 5000,
      waitUntil: "domcontentloaded"
    })
    .catch(e => {
      e.source = html;
      responseCode.throwError(responseCode.CONTENT_ERROR, e);
    });

  xpath &&
    (await page.waitForXPath(xpath, { timeout: 4000 }).catch(e => {
      e.source = html;
      responseCode.throwError(responseCode.XPATH_ERROR, e);
    }));
  selector &&
    (await page.waitForSelector(selector, { timeout: 4000 }).catch(e => {
      e.source = html;
      responseCode.throwError(responseCode.SELECTOR_ERROR, e);
    }));
```

默认 page 的超时时间都比较长，一个页面里如果 5s 没有 domready，4s 没有找到对应的 xpath 和 selector 都应该是属于脏数据了，说明网站和我们的过滤规则不一致导致的，就不要卡着服务了。

还有就是我们整个服务启用了 4 个 IDC 服务，每个 IDC 服务启动了 20 个容器 pod，这样就大大的缓解了处理时间慢的问题，因为我们的个数多，一个 IDC 的请求大概能够同时处理 20\*40 个 page 的处理，这样就达成了 200QPS 的任务…，嗯，充钱让你强大。

## 五，抓站脚本写了防抓逻辑怎么破

我们在处理异常的时候，经常会遇到一些特别有意思的 JS 代码，比如页面报错了，onerror 之后弹个 alert，页面进入的时候有人用 JS 判断了如果 URL 不是本域的，就做重定向或者弹窗，这里告诉大家几个破解的小技巧。

```js
if (original_url) {
    let myURL = new URL(original_url);
    let original_host = myURL.host;
    let original_origin = original_url.slice(
      0,
      original_url.lastIndexOf("/") + 1
    );
    html = `
    <base href="${original_origin}"> 
    <script>
      window.alert = window.confirm = window.prompt = function(){};
      Object.defineProperty(document, 'domain', { value: '${original_host}'})
    </script>
    ${html} 
    `;
  }
  html = `
    <html>
    <script>
      window.onerror = function(e){
        return false;
      } 
    </script>
    ${html}
    </html>
  `;
  await page
```

original\_url 是抓站新闻的原始链接，我们解析出来 host 之后，先给页面加一个 base 标签，防止页面资源写的相对路径，因为 setContent 打开的 page，url 是空的。

然后我们插入 2 段 JS 脚本，先给 alert，confirm 这些脚本设置空，避免阻塞 Puppeteer 注入的 js，然后我们给 document 上的 domain 设置好正确的 domain， **（defineProperty 可以给一些只读属性设置新的值，比如 navigator.platform 也是适用的）** 这样一般的判断就都能过了，最后再给 onerror 给设置 return false，防止页面脚本报错阻塞我们插入的格式化文章 JS。

***

最后，这篇文章比较长，项目写了也蛮久了，最近看到很多关于 Puppeteer 的文章，所以也凑个热闹，节前需求不多，写了这篇文章来分享一些自己的小经验吧。

前同事团队也有一篇相关文章不错，也是和爬虫相关的，可以一起学习：

[自动化 Web 性能分析之 Puppeteer 爬虫实践](https://link.zhihu.com/?target=https%3A//juejin.im/post/5d90ca605188252ca056c44c)
