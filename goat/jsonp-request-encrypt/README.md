# Script Hook辅助逆向jsonp参数加密

# 一、逆向目标

这个页面上点击"发送JSONP请求"按钮的时候，会向后端发送一个jsop的请求上报数据：

![image-20250112002041376](./README.assets/image-20250112002041376.png)

但是上报的数据参数是加密的：

![image-20250112003254255](./README.assets/image-20250112003254255.png)

我们的目标就是搞清楚这个data的加密逻辑。

# 二、下载 & 启动靶场

克隆仓库到本地：

```bash
git clone git@github.com:JSREI/js-script-hook.git
```

进入靶场目录：

```bash
cd js-script-hook/goat/jsonp-request-encrypt
```

启动Server：

```bash
node server.js
```

打开客户端页面：

```
client.html
```

然后要破解的内容就在这个页面上。

# 三、安装脚本

安装请参考项目主页的安装教程，此处不再赘述：

```
https://github.com/JSREI/js-script-hook?tab=readme-ov-file#%E4%BA%8C%E5%AE%89%E8%A3%85
```

# 四、分析

先配置一下脚本：

![image-20250112020656925](./README.assets/image-20250112020656925.png)

增加一个匹配所有URL的断点：

![image-20250112020725546](./README.assets/image-20250112020725546.png)

然后回到页面上点击“发送JSONP请求”按钮，发现进入了断点，从右侧的调用栈往前追溯：

![image-20250112022346028](./README.assets/image-20250112022346028.png)

发现这里是发起请求的地方，加密参数是外面传进来的参数：

![image-20250112021518863](./README.assets/image-20250112021518863.png)

然后继续往前追溯调用栈，看到了传递参数的地方：

![image-20250112021345091](./README.assets/image-20250112021345091.png)

然后这个`_0x1a2bData`是前面调用一个方法`_0x1a2b`生成的：

![image-20250112021632098](./README.assets/image-20250112021632098.png)

看起来`_0x1a2b(data, _0x3c9d)`像是在调用一个加密函数，我们先看一下传递的参数，传递了两个参数，第一个参数就是页面上要往后端上报的数据：

![image-20250112021729990](./README.assets/image-20250112021729990.png)

第二个参数是一个神秘的字符串，看起来像是一个秘钥，这个是在页面上写死的值：

![image-20250112021832766](./README.assets/image-20250112021832766.png)

搞明白了两个参数是怎么来的之后，我们继续跟进去`_0x1a2b(_0x2a3f, _0x3c9d);`看看加密逻辑是什么，鼠标移动到`_0x1a2b`上等一会儿，会展示对应的函数的信息，跟进去函数地址：

![image-20250112021957446](./README.assets/image-20250112021957446.png)

然后我们就跟到了这个函数的定义的地方，看起来是一个AES加密：

![image-20250112022058840](./README.assets/image-20250112022058840.png)

加密函数的逻辑：

```js
// 加密函数
function _0x1a2b(data, _0x3c9d) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), _0x3c9d).toString();
}
```

至此逻辑分析完毕，我们能够很方便的去追溯主要就是因为能够打了script类型的断点，让我们能够从底下往上追溯，同时又能够结合运行时的变量的值来更快的理解逻辑，这就是这个[Script Hook](https://github.com/JSREI/js-script-hook)工具给我们带来的优势。



