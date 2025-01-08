# js-script-hook

# 开发中，敬请期待！

## 一、脚本简介

为什么有这个东西？

在进行JS逆向的时候，经常碰到请求是JS类型的，实际上是使用script标签发出的请求，比如一些跨域的请求，一些jsonp请求，
Chrome目前（2024-12-20）没有支持对script类型的请求打条件断点之类的，而这个脚本就是填补这块儿的空白的。

优势：
- 支持对script类型的请求打断点
  - script请求之前进入断点
  - 直接把断点打到script jsonp回调函数里

## 二、安装
开发中，敬请期待！

实战系列文章：
- [潇湘书院登录](https://github.com/JSREP/www.xxsypro.com-RE)
- [一淘网](https://github.com/JSREP/www.etao.com-RE)
- [叮当快药sign逆向练习](https://github.com/JSREP/www.ddky.com-RE)
- [365玩游戏平台](https://github.com/JSREP/minilogin.sgty.com-RE)
- [G妹游戏登录](https://github.com/JSREP/www.gm99.com-RE)
- [空中网登录](https://github.com/JSREP/passport.kongzhong.com-RE)

## 三、在script类型的请求发送之前打断点
TODO 
## 四、在script类型的请求接收到响应之后打断点
TODO 
### 何为jsonp？

在介绍本部分之前，希望读者能够对jsonp有几个基本的概念，
说白了就是xhr发送请求时会涉及到跨域问题，但是script不会，
于是

### 打jsonp响应断点 
TODO 
















