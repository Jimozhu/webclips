---
title: "Service Workers - overview"
date: 2022-08-14T16:38:55+08:00
draft: false
categories: [dev]
tags: [dev, web]
---
> 原文地址 [juejin.cn](https://juejin.cn/post/7003230645598044196)

它是一个 JavaScript Worker，所以不能直接访问 DOM。但是，Service Worker 可以通过回应 postMessage 接口发送的消息与其控制的页面进行通信，这些页面可以根据需要操作 DOM。

- Service Worker 是一个可编程的网络代理，你可以控制如何处理来自页面的网络请求。
- 它在不使用时终止，并在下一次需要时重新启动，因此不能依赖 Service Worker 的 `onfetch` 和 `onmessage` 处理程序中的全局状态。如果需要在重启后保留和重用某些信息，Service Worker 可以访问 [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)。
- Service Worker 广泛使用了 Promise，所以如果你还不太了解 Promise ，请先学习它。

## Service Worker 生命周期

Service Worker 的生命周期与你的网页完全分开。

安装 Service Worker，您需要在页面的 JavaScript 中注册它。

通常在安装步骤中，你需要缓存一些静态资源。如果所有文件都被成功缓存，那么证明 Service Worker 已经安装成功。如果任何文件无法下载和缓存，则安装步骤将失败并且 Service Worker 不会被激活（即不会被安装）。如果发生这种情况，请不要担心，它下次会再试一次。

安装后，将执行激活步骤，在这时处理旧缓存管理，我们将在 Service Worker 更新部分进行介绍。

激活后，Service Worker 将控制其范围内的所有页面，除了第一次注册 Service Worker 的页面在再次加载之前不会受到控制。一旦 Service Worker 处于控制状态，它将处于两种状态之一：被终止以节省内存，或者它会处理从页面发出的网络请求或消息时的 `fetch` 和 `message` 事件。

下面是首次安装时 Service Worker 生命周期的过度简化版本。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_uharr0xa69pvntny/c5d277c9.webp)

## 先决条件

### 浏览器支持

浏览器选项正在增加。 Chrome、Firefox 和 Opera 支持 Service Worker。 Microsoft Edge 现在显示公众支持。 甚至 Safari 也暗示了未来的发展。 您可以在 Jake Archibald 的 [is Serviceworker ready](https://link.juejin.cn?target=https%3A%2F%2Fjakearchibald.github.io%2Fisserviceworkerready%2F "https://jakearchibald.github.io/isserviceworkerready/") 网站上关注所有浏览器的进度。

### HTTPS

在开发过程中，可以通过 localhost 使用 Service Worker，但要将其部署在站点上，需要在服务器上设置 HTTPS。

使用 Service Worker，可以劫持连接、制造和过滤响应。权利很大。虽然你会永远拥有这些权力，但中间人可能不会。为避免这种情况，你只能在通过 HTTPS 提供服务的页面上注册 Service Worker，这样我们可以知道浏览器接收的 Service Worker 有没有被篡改。

[GitHub Pages](https://link.juejin.cn?target=https%3A%2F%2Fpages.github.com%2F "https://pages.github.com/") 是一个通过 HTTPS 提供服务的 demo，可以参阅一下。

如果你想将 HTTPS 添加到服务器，那么你需要获取 TLS 证书并在服务器里设置它。请查看服务器的文档，然后查看 Mozilla 的 [SSL 配置生成器](https://link.juejin.cn?target=https%3A%2F%2Fssl-config.mozilla.org%2F "https://ssl-config.mozilla.org/") 进行操作。

## 注册 Service Worker

安装 Service Worker，需要通过在你的页面中注册它。这样浏览器就可以知道你的 Service Worker 在 JavaScript 文件的位置。

```javascript
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
```

这段代码检查 Service Worker API 是否可用，如果可用，则在页面加载后注册 `/sw.js` 中的 Service Worker 。

你可以在每次页面加载时调用 `register()` 而不用担心；浏览器会判断 service worker 是否已经注册并相应地处理它。

`register()` 方法的一个微妙之处是 service worker 文件的位置。在这种情况下，你会注意到 service worker 文件位于域的根目录。这意味着 service worker 的范围将是整个源。换句话说，这个 Service Worker 将接收该域上所有内容的 `fetch` 事件。如果我们在 `/example/sw.js` 中注册 Service Worker ，那么 Service Worker 只会看到 URL 以 `/example/` 开头的页面（即 /example/page1/、/example/page2/）的 `fetch` 事件。

现在，您可以跳转到 chrome://inspect/#service-workers 并在你的站点里查看 Service Worker 是否已启用。

![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_uharr0xa69pvntny/2277ffce.webp)

首次实现 Service Worker 时，可以通过 [chrome://serviceworker-internals](https://link.juejin.cn?target=) 查看你的 Service Worker 详细信息。如果仅仅是了解 Service Worker 的生命周期，这个网址还是有用的，以后它可以被 [chrome://inspect/#service-workers](https://link.juejin.cn?target=) 取代。

你可能会发现在隐身窗口中测试 Service Worker 很有用，可以关闭并重新打开窗口，之前的 Service Worker 不会影响新窗口。一旦该窗口关闭，从隐身窗口中创建的任何注册和缓存都将被清除。

## 安装 service worker

在受控页面启动注册过程后，service worker 脚本开始处理安装事件。

最基本的示例：你需要为 `install` 事件定义回调并决定要缓存哪些文件。

```javascript
self.addEventListener("install", function (event) {
  // Perform install steps
});
```

在 `install` 回调中，需要执行以下步骤：

1. 打开缓存，
2. 缓存我们的文件，
3. 确认是否缓存了所有必需的资源。

```javascript
var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = ["/", "/styles/main.css", "/script/main.js"];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});
```

这只是一个 demo，你可以在安装事件中执行其他任务或完全避免设置安装事件侦听器。

## 缓存和返回请求

现在我们已经安装了 Service Worker，接下来我们要 `return` 其中某个缓存的 `responses`。

安装 Service Worker 并且用户打开新页面或刷新当前页面后，Service Worker 将开始接收 `fetch` 事件，示例如下。

```javascript
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
```

这里我们定义了 fetch 事件，在 event.respondWith() 中，我们从 caches.match() 中传入了一个 promise。这个方法会查看请求并从 Service Worker 创建的缓存中查找缓存结果。

如果我们有匹配的响应，会返回缓存的值，否则返回调用 fetch 的结果；

如果我们想累积缓存新请求，可以通过处理 fetch 请求的响应然后将其添加到缓存中来实现，如下所示。

```javascript
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
```

上面这段代码做的事情如下：

1. 在 `fetch` 请求上给 `.then()` 添加回调。
2. 收到响应后，我们会执行以下检查：
   - 确保响应有效。
   - 检查响应中的状态为 200。
   - 确保响应类型是 **basic** ，这证明它是来自我们源的请求，意味着第三方资源的请求不会被缓存。
3. 如果通过了检查，克隆响应。这样做的原因是因为响应是一个 **Stream**，所以 `body` 只能被使用一次。由于我们想要返回响应供浏览器使用，并将其传递给缓存使用，因此我们需要克隆它，以便我们可以将一个发送到浏览器，一个发送到缓存。

## 更新 Service Worker

你的 Service Worker 将在某个时间点需要更新。这个时候，您需要执行以下步骤：

1. 更新 Service Worker 的 js 文件。当用户打开你的网站时，浏览器会尝试重新下载在后台定义 Service Worker 的脚本文件。如果 Service Worker 文件与当前文件相比只要有一个字节的差异，它就会认为它是新的。
2. 新 Service Worker 将启动并触发 `install` 事件。
3. 此时旧的 Service Worker 仍在控制当前页面，因此新的 Service Worker 将进入等待状态。
4. 当网站当前打开的页面关闭时，旧的 Service Worker 将被杀死，新的 Service Worker 将接管。
5. 一旦新 service worker 获得控制权，它的 `activate` 事件就会被触发。

activate 回调中会做缓存管理。为何要在 `activate` 回调中执行此操作？如果在安装步骤中清除任何旧缓存，则控制所有当前页面的任何旧的 Service Worker 将突然停止从该缓存中提供文件。

假设我们有一个名为 `“my-site-cache-v1”` 的缓存，我们希望将其拆分为一个页面缓存和一个博客文章缓存。这意味着在安装步骤中，我们将创建两个缓存，`“pages-cache-v1”` 和 `“blog-posts-cache-v1”`，在激活步骤中，我们要删除旧的 `“my-site-cache-v1“`。

以下代码将通过循环访问 Service Worker 中的所有缓存并删除未在缓存许可名单中定义的缓存来执行此操作。

```javascript
self.addEventListener("activate", function (event) {
  var cacheAllowlist = ["pages-cache-v1", "blog-posts-cache-v1"];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

## 常踩的坑

### 如果安装失败，没有提示

如果 `worker` 注册了，但没有出现在 `chrome://inspect/#service-workers` 或 `chrome://serviceworker-internals` 中，则很可能是因为抛出错误或者将 `rejected promise` 传递给 `event.waitUntil()` 导致无法安装。

要解决此问题，请转到 `chrome://serviceworker-internals` 并选中 **“Open DevTools window and pause JavaScript execution on service worker startup for debugging”** ，然后在 `install` 事件的开始处打断点 `debugger`，定位问题。

### fetch() 的默认值

#### 默认情况下没有凭据

使用 fetch 时，默认情况下，请求不包含诸如 cookie 之类的凭据。如果需要凭据，请这样调用：

```javascript
fetch(url, {
  credentials: "include",
});
```

`Fetch` 的行为更像其他 CORS 请求，例如 `<img crossorigin>`，它从不发送 `cookie`，除非你选择使用 `<img crossorigin="use-credentials">`。

#### 没有 CORS 默认失败

默认情况下，如果不支持 CORS，从第三方 URL 获取资源将会失败。可以在请求中添加 `no-CORS` 选项来解决这个问题，这会导致 “不透明” 响应，也就是说无法判断响应是否成功。

```javascript
cache
  .addAll(
    urlsToPrefetch.map(function (urlToPrefetch) {
      return new Request(urlToPrefetch, { mode: "no-cors" });
    })
  )
  .then(function () {
    console.log("All resources have been fetched and cached.");
  });
```

### 处理响应式图像

`srcset` 属性或 `<picture>` 元素在运行时会选择合适的 `image` 资源并发送网络请求。

对于 Service Worker，如果你想在 `install` 步骤中缓存图像，下面有几个选择：

1. 安装 `<picture>` 元素和 `srcset` 属性将请求的所有图像；
2. 安装图像的单个低分辨率版本；
3. 安装图像的单个高分辨率版本。

实际上，应该选择选项 2 或 3，但下载所有图像会浪费存储空间。

假设在安装时选择低分辨率版本，在页面加载时尝试从网络检索高分辨率图像，如果高分辨率图像失败，则回退到低分辨率版本。这很好，但有一个问题：

如果我们有以下两张图片：

<table><thead><tr><th>屏幕密度</th><th>Width</th><th>Height</th></tr></thead><tbody><tr><td>1x</td><td>400</td><td>400</td></tr><tr><td>2x</td><td>800</td><td>800</td></tr></tbody></table>

在 `srcset` 图像中，我们会有一些像这样的标记：

```html
<img src="image-src.png" srcset="image-src.png 1x, image-2x.png 2x" />
```

如果在 2x 显示器上，浏览器将选择下载 image-2x.png，离线的时候如果图片被缓存了，可以在 `.catch()` 中发送请求并返回 `image-src.png` ，但是浏览器会考虑到 2x 屏幕上的额外像素的图像，因此图像将显示为 200x200 CSS 像素而不是 400x400 CSS 像素。解决此问题的唯一方法是在图像上设置固定的高度和宽度：

```html
<img
  src="image-src.png"
  srcset="image-src.png 1x, image-2x.png 2x"
  style="width:400px; height: 400px;"
/>
```
