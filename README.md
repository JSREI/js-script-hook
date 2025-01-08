# Script Hook

![Greasy Fork Downloads](https://img.shields.io/greasyfork/dt/523208)  ![Greasy Fork Rating](https://img.shields.io/greasyfork/rating-count/523208)  ![GitHub Created At](https://img.shields.io/github/created-at/JSREI/js-script-hook)  ![GitHub contributors](https://img.shields.io/github/contributors-anon/JSREI/js-script-hook)  ![GitHub top language](https://img.shields.io/github/languages/top/JSREI/js-script-hook)  ![GitHub commit activity](https://img.shields.io/github/commit-activity/t/JSREI/js-script-hook)  ![GitHub Release](https://img.shields.io/github/v/release/JSREI/js-script-hook)   ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr/JSREI/js-script-hook)  ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr-closed/JSREI/js-script-hook)  ![GitHub License](https://img.shields.io/github/license/JSREI/js-script-hook)  ![GitHub Repo stars](https://img.shields.io/github/stars/JSREI/js-script-hook)  ![GitHub forks](https://img.shields.io/github/forks/JSREI/js-script-hook)  ![GitHub watchers](https://img.shields.io/github/watchers/JSREI/js-script-hook)  

# 一、解决了什么问题？

我们在进行JS逆向的时候，经常碰到请求是JS类型的：

![image-20250109023632545](./README.assets/image-20250109023632545.png)

实际上是使用script标签发出的请求，比如一些跨域的请求，一些jsonp请求，Chrome目前（2024-12-20）没有支持对script类型的请求打条件断点之类的，而这个脚本就是填补这块儿的空白的。

功能一栏：

![JSREI Script Hook](./README.assets/JSREI%20Script%20Hook.png)



# 二、安装

本项目为油猴脚本，要使用的话需要你先安装了Chrome的油猴插件：

```
https://chromewebstore.google.com/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo
```

然后在油猴商店安装即可：

```
https://greasyfork.org/zh-CN/scripts/523208-js-script-hook
```

如果您对油猴脚本不信任，可Review本仓库下的代码自行编译：

```bash
yarn build
```

然后从`dist/index.js`文件创建一个新的油猴脚本即可：

```
dist/index.js
```

# 三、功能详细解释

## # 3.1 界面设置

![image-20250109024541404](./README.assets/image-20250109024541404.png)

## 3.2 控制台打印

![image-20250109024829101](./README.assets/image-20250109024829101.png)

## 3.3 断点位置

请求断点：

![image-20250109024918866](./README.assets/image-20250109024918866.png)

响应断点：

![image-20250109025028086](./README.assets/image-20250109025028086.png)



# 四、问题反馈

 当您遇到了问题，可以在仓库新建一个issue反馈：

```
https://github.com/JSREI/js-script-hook/issues/new
```

建议您优先以新建issue的方式反馈问题，issue是可记录可追溯的，也方便后来者遇到同一个问题时有参考。


# 五、感谢支持 
暂无。

当您提issue或者pr时，将您的GitHub账号放在此处感谢您为产品迭代做出的贡献！

# 六、Contributors

<img src="https://contrib.nn.ci/api?repo=JSREI/js-script-hook" />

# 七、Star History

<img src="https://starchart.cc/JSREI/js-script-hook.svg" />

# 八、逆向技术交流群

扫码加入逆向技术交流群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016230653669.png" style="width: 200px">

如群二维码过期，可以加我个人微信，发送【逆向群】拉你进群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20231030132026541-7614065.png" style="width: 200px">

[点此](https://t.me/jsreijsrei)或扫码加入TG交流群：

<img src="https://github.com/JSREI/.github/raw/main/profile/README.assets/image-20241016231143315.png" style="width: 200px">





