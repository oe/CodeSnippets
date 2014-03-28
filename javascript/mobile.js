
/* ----------------- 针对移动设备按钮的点击效果 -------------------
点击时添加active的类, 点击的效果在该类中实现
 */
$(document.body).on('touchstart','.btn',function () {
  this.classList.add('active');
});
$(document.body).on('touchend','.btn',function () {
  this.classList.remove('active');
});

/* ---------------------本地存贮的问题-----------------------------
localStorage在移动设备上兼容性较好, sessionStrorage则较差
 */