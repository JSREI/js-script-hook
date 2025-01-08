# jQuery jsonp原理分析



# 要讨论的问题是什么？



# 使用示例



```js
$.getJSON(url+"?callback=?",function(data){
    ....
});
```



```js
$.ajax({
     type: "get",
     url: "http://examples.learningjquery.com/jsonp/g.php",
     dataType: "jsonp",
     jsonp: "callback",
     jsonpCallback: "hehe",
     success: function(json){
        console.log(json);
    }
});
```





# 代码浅读























