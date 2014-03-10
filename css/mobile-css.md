
### 移动设备禁止缩放
在html的head中加入以下代码即可
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 图片自适应
将以下class应用于img标签上即可
```css
.image {
	display: block;
	margin: 0 auto;
	max-width: 100%;
	height: auto; /*高度会根据屏幕尺寸变化， 也可以赋予固定高度*/
}
```

### Safari下input宽度问题
这个问题还是盒式模型的问题，添加以下css即可
```css
input[type="text"]{
   -moz-box-sizing:    border-box;
   -webkit-box-sizing: border-box;
    box-sizing:        border-box;
}
```

### 移动设备上，给body设置`overflow:hidden;`无效
给body内的容器设置`overflow`属性则可以生效，可以使用如下代码
```css
body {
	margin: 0;
}
#container {
	overflow-x: hidden; /*禁止container横向滚动*/
}
```

### 元素在屏幕垂直居中居中
由于Android暂时不支持`display:table;`及`display:table-cell`属性，故不能适用此技巧使元素垂直居中

### 简单的离线缓存
缓存文件的格式一定要规范，如下`cache.manifest`文件内容:
```
CACHE MANIFEST
# v33 (使用更改注释的方法来更新cache)
CACHE:
	css/main.css
	css/carousel.css
	js/carousel.js
	js/album.js
	http://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.3/zepto.min.js
NETWORK:
    *
```
最后两行不能丢，否则未缓存的文件可能无法正常请求。