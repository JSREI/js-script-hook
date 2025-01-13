# Script Hook

产品演示视频：https://www.bilibili.com/video/BV12BrkYGEHv/

源代码仓库链接：https://github.com/JSREI/js-script-hook

![Greasy Fork Downloads](https://img.shields.io/greasyfork/dt/419533)  ![Greasy Fork Rating](https://img.shields.io/greasyfork/rating-count/419533)  ![GitHub Created At](https://img.shields.io/github/created-at/JSREI/js-script-hook)  ![GitHub contributors](https://img.shields.io/github/contributors-anon/JSREI/js-script-hook)  ![GitHub top language](https://img.shields.io/github/languages/top/JSREI/js-script-hook)  ![GitHub commit activity](https://img.shields.io/github/commit-activity/t/JSREI/js-script-hook)  ![GitHub Release](https://img.shields.io/github/v/release/JSREI/js-script-hook)   ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr-closed/JSREI/js-script-hook)  ![GitHub License](https://img.shields.io/github/license/JSREI/js-script-hook)  ![GitHub Repo stars](https://img.shields.io/github/stars/JSREI/js-script-hook)  ![GitHub forks](https://img.shields.io/github/forks/JSREI/js-script-hook)  ![GitHub watchers](https://img.shields.io/github/watchers/JSREI/js-script-hook)  

![logo.png](./README.assets/logo.png)

# 一、解决了什么问题？

我们在进行JS逆向的时候，经常碰到请求是`script`类型的：

![image-20250109023632545](./README.assets/image-20250109023632545.png)

实际上是使用`html`的`script`标签设置`src`发出的请求，比如一些跨域的请求，一些`jsonp`请求，`Chrome`目前（2024-12-20）没有支持对`script`类型的请求打条件断点之类的，而这个脚本就是填补这块儿的空白的。

功能一览：

![JSREI Script Hook](./README.assets/JSREI%20Script%20Hook.png)



一次jsonp请求的生命周期：

![jsonp-life-circle.drawio](./README.assets/jsonp-life-circle.drawio.png)



逆向练习靶场：

- [https://github.com/JSREI/js-script-hook-goat](https://github.com/JSREI/js-script-hook-goat)

辅助逆向实战文章：

- [Script Hook辅助逆向jsonp参数加密](https://github.com/JSREI/js-script-hook-goat/blob/main/docs/jsonp-request-encrypt/README.md)
- [Script Hook辅助逆向jsonp响应加密](https://github.com/JSREI/js-script-hook-goat/blob/main/docs/jsonp-response-encrypt/README.md)
- [Script Hook辅助逆向jsonp请求参数/响应字段加密](https://github.com/JSREI/js-script-hook-goat/blob/main/docs/jsonp-request-encrypt-and-response-encrypt/README.md)

核心功能演示：

![ezgif-5-191ba6b41b](./README.assets/ezgif-5-191ba6b41b.gif)

# 二、安装

本项目为油猴脚本，要使用的话需要你先安装了`Chrome`的油猴插件：

```
https://chromewebstore.google.com/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo
```

## 2.1 从油猴商店直接安装

脚本有新版本的话会推送到油猴商店，在油猴商店直接安装即可：

```
https://greasyfork.org/zh-CN/scripts/419533-js-script-hook
```

安装成功后能够在油猴的脚本列表看到有一项`js-script-hook`：

<img src="./README.assets/image-20250109202738169.png" style="width: 400px">

## 2.2 源码编译安装

如果您对油猴脚本不信任，可Review本仓库下的代码后自行编译。

克隆仓库到本地：

```
git clone git@github.com:JSREI/js-script-hook.git
```

进入克隆到的本地目录：

```
cd js-script-hook
```

安装依赖（yarn）：

```
yarn install
```

或者使用npm安装：

```
npm install
```

然后打包（yarn）：

```
yarn build
```

或者使用npm打包：

```
npm run build
```

打好包的文件在`dist/index.js`中，以`dist/index.js`中的内容创建一个新的油猴组件即可：

```bash
dist/index.js
```

安装成功后能够在油猴的脚本列表看到有一项`js-script-hook`：

<img src="./README.assets/image-20250109202728996.png" style="width: 400px">

# 三、产品文档

## 3.1 界面设置

本脚本自带了一个操作界面，选择“`Configuration`"子菜单打开配置界面：

<img src="./README.assets/image-20250109201543898.png" style="width: 600px">

配置界面大概长这个样子：

![image-20250109024541404](./README.assets/image-20250109024541404.png)

配置界面分为两部分，一部分是全局配置，一部分是断点配置。

### 3.1.1 全局配置

#### 界面语言

本工具与国际接轨，同时支持”简体中文“和”English“两种语言，可根据自己熟悉的语言自行切换，注意，此处的语言配置对控制台上打印的信息也同时生效，并且此项更改后需要重启刷新页面后才能生效：

![image-20250109201852722](./README.assets/image-20250109201852722.png)

#### 响应断点Hook方式

一般保持默认即可，如果想尝试新奇功能，可阅读说明后调整设置：

![image-20250109203238494](./README.assets/image-20250109203238494.png)

对于jsonp的callback的hook，工具内置了两种方式，其中一种是使用一个Hook函数替换掉被Hook函数的引用指针，这种方式的优势是兼容性比较好，绝大多数网站都不会报错，缺点是命中断点之后需要再点几下鼠标，手动跟进去callback函数代码：

![image-20250109213357997](./README.assets/image-20250109213357997.png)

而如果使用直接修改callback函数体的方式，则能够把断点直接打到callback函数体里：

![image-20250109213542250](./README.assets/image-20250109213542250.png)

而原版的callback函数的代码长这个样子：

```js
// JSONP请求的回调函数
function jsonpCallback_1734635066(response) {
    console.log('JSONP Response:', response);
    // 这里可以将响应打印到页面上
    document.getElementById('response').textContent = JSON.stringify(response, null, 4);
}
```

#### Hook Flag前缀

Hook的时候会修改代码做一些标记位之类的，我之前写的工具注意到有师傅喜欢修改这类个人前缀，所以这次单独留了一个界面设置，你可以把自己的id设置进去定制属于自己的专属环境：

![image-20250109203252884](./README.assets/image-20250109203252884.png)

#### 是否忽略.js后缀的请求

大多数时候.js后缀的请求都是单纯的加载JavaScript资源文件，可以选择忽略掉这类请求，当勾选的时候，控制台上也不会再打印.js请求，但是请注意，有部分jsonp请求的url确实也是.js后缀的，这种情况不要勾选此选项否则断点无法生效：

![image-20250109203309612](./README.assets/image-20250109203309612.png)

#### 是否忽略不是jsonp的请求

如果只关注jsonp类型的请求，可以选择忽略掉其它请求，当勾选的时候，控制台上也不会再打印非jsonp请求，注意，请求是否是jsonp是脚本内置的引擎自行推测的，可能会存在失误的情况，如果控制台上打印的请求信息里没有表明这是一个jsonp请求，而您又认为这确实是一个jsonp请求的话，请取消勾选此选项：

![image-20250109203331447](./README.assets/image-20250109203331447.png)

控制台打印的请求日志判断是否是jsonp的方式：

![image-20250109215803301](./README.assets/image-20250109215803301.png)

#### 跳转到项目主页打开此界面以防样式错乱

油猴脚本注入的界面可能会跟网页中原有的样式发生冲突或者污染，从而导致样式错乱，跳转到经过测试的项目主页打开设置界面可以有效防止布局错乱，推荐勾选此选项：

![image-20250109203343343](./README.assets/image-20250109203343343.png)

### 3.1.2 断点配置

#### 是否启用此断点

是否启用此断点，仅当断点处于启用状态的时候才会生效，取消勾选可以暂时禁用断点而无需删除：

![image-20250109203357970](./README.assets/image-20250109203357970.png)

#### URL匹配方式

URL匹配方式用于指定当Script的URL符合什么条件时命中此断点，因为很多时候页面中可能会存在很多个script请求，而我们可能往往只关心其中的某一个，这个时候就可以使用断点用URL匹配的方式来设置满足特定条件时才进入断点：

对Script的URL的匹配方式有以下几种：

- 直接匹配所有URL（默认）
- 当Script的URL完全匹配给定的关键字串时进入断点，需要进一步指定关键字
- 当Script的URL包含给定的关键字串时进入断点，需要进一步指定关键字
- 当Script的URL匹配给定的正则表达式时进入断点，需要进一步指定正则表达式

当设置好了之后可以单击”测试“按钮，立刻测试此断点配置得是否有效：

![image-20250109203410731](./README.assets/image-20250109203410731.png)

#### 是否开启请求断点

启用请求断点后，在script请求发出之前进入断点：

![image-20250109203421428](./README.assets/image-20250109203421428.png)



#### 是否开启响应断点

启用响应断点之后，在jsonp请求的回调函数中命中断点：

![image-20250109203433061](./README.assets/image-20250109203433061.png)



#### jsonp回调函数参数名称

绝大对数情况下您无需配置这个选项，除非是脚本内置的推测引擎失效。

要Hook住jsonp的callback函数的话，首先要能够知道这个callback函数的名称，通常可能是如下形式：

```
http://localhost:10010/?jsonp_callback=jsonpCallback_1734635066
```

其中的名为`jsonp_callback`的参数就是用来指定callback函数的名称，而这个名称一般会跟着一个时间戳或者随机字符之类的，是每次都不同的，默认情况下脚本有内置引擎会从请求信息中自动推测出jsonp的callback函数的名称，但是也可能会有推测不成功的情况，如果推测不成功，在您可以在这里配置上`jsonp_callback`，对于无法自定推测的网站，也建议您提个issue反馈一下。

关于内置引擎是如何自动推测jsonp的callback函数的，后续会附上一篇单独的文章来介绍：

![image-20250109203445667](./README.assets/image-20250109203445667.png)

#### 备注

你可以输入一些备注，或者相关信息的一些上下文，以防止时间长了之后忘记，只要断点还在就能够一直记住这些上下文，断点不用的时候不需要删除，只需要暂时禁用就可以：

![image-20250109203456868](./README.assets/image-20250109203456868.png)

#### 同时配置多个断点

如果一个断点不够用的时候，可以点击加号增加一个断点，这样当需要逆向多个网站的时候可以不用那么手忙脚乱卡操作，当有多个断点的时候，默认按照最后修改时间倒序排序，即最后修改的断点排在最前面，这样就不需要滚动条滑来滑去了，每次展示在最上面的都是最近最关心的断点：

![image-20250109204028617](./README.assets/image-20250109204028617.png)

注意，当同时有多个断点规则命中同一个请求的时候，也会进入多次debugger断点，所以请注意不用的断点可以及时关闭。

并且对于断点的最大数量没有限制，可以根据个人电脑性能自行决定，哪怕是几年不删除断点有几千个断点应该也问题不大。

#### 删除断点

可以点击每个断点右上角的X号，注意不会有二次确认，点删除立刻生效：

![image-20250109204131222](./README.assets/image-20250109204131222.png)

删除之后：

![image-20250109204143836](./README.assets/image-20250109204143836.png)

## 3.2 控制台打印

脚本会捕捉所有的script请求和响应，在控制台上以表格形式打印详情：

![image-20250109024829101](./README.assets/image-20250109024829101.png)

## 3.3 断点

当命中请求断点的时候，这里的有个变量可以喽一眼，可以大概看到当前被断住的请求的一些上下文信息：

![image-20250109024918866](./README.assets/image-20250109024918866.png)

响应断点：

![image-20250109025028086](./README.assets/image-20250109025028086.png)

# 四、常见问题
## 4.1 当遇到界面与 2.1界面不相同,没有Configuration的情况：

![image-20250109025028086](./README.assets/image-2025-01-13_17.58.09.png)

(https://www.tampermonkey.net/faq.php#Q209)[检查是否开启开发者模式]
1. 打开菜单，选择“扩展程序”和“管理扩展程序”，或者在新的浏览器标签页中输入 chrome://extensions 或 edge://extensions 以导航到扩展程序页面。
    ![image-20250109025028086](./README.assets/chrome_extensions.jpg)
2. 在右上角找到并点击“开发者模式”开关以启用它。
     ![image-20250109025028086](./README.assets/developer_mode.jpg)

## 4.2 如果使用Edge在按照界面又没跳转
可以多尝试几次
    ![image-20250109025028086](./README.assets/image-2025-01-13_18.07.16.png)



# 五、问题反馈

 当您遇到了问题，可以在仓库新建一个issue反馈：

```
https://github.com/JSREI/js-script-hook/issues/new
```

建议您优先以新建issue的方式反馈问题，issue是可记录可追溯的，也方便后来者遇到同一个问题时有参考。


# 六、感谢支持
暂无。

当您提issue或者pr后，会将您的GitHub账号放在此处感谢您为产品迭代做出的贡献！

# 七、Contributors

欢迎提交pr，提了就merge，点击就送！

<img src="https://contrib.nn.ci/api?repo=JSREI/js-script-hook" />

# 八、Star History

<img src="https://starchart.cc/JSREI/js-script-hook.svg" />

# 九、逆向技术交流群

扫码加入逆向技术交流群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016230653669.png" style="width: 200px">

如群二维码过期，可以加我个人微信，发送【逆向群】拉你进群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20231030132026541-7614065.png" style="width: 200px">

[点此](https://t.me/jsreijsrei)或扫码加入TG交流群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016231143315.png" style="width: 200px">





