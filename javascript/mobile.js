
/* ----------------- 针对移动设备按钮的点击效果 -------------------
点击时添加active的类, 点击的效果在该类中实现
 */
// 添加改行代码即可激活移动设备对active伪类的支持
document.addEventListener("touchstart", function(){}, true);

// -- 以下方法被遗弃
$(document.body).on('touchstart','.btn',function () {
  this.classList.add('active');
});
// touchmove事件也需要监听, 否则按住元素拖动时, 激活样式不会移除
$(document.body).on('touchend touchmove','.btn',function () {
  this.classList.remove('active');
});

/* ---------------------本地存贮的问题-----------------------------
localStorage在移动设备上兼容性较好, sessionStrorage则较差
 */