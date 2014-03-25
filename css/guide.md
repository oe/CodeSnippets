# 书写规范
## 概要
1. 属性冒号`:`后加空格
* `{`前加空格
* 除了透明色rgba, 其他都使用16进制书写颜色值
* css文件模块化  
```
styles
├── components
│   ├── comments.scss
│   └── listings.scss
├── globals
│   ├── browser_helpers.scss
│   ├── responsive_helpers.scss
│   ├── variables.scss
├── plugins
│   ├── jquery.fancybox-1.3.4.css
│   └── reset.scss
├── sections
│   ├── issues.scss
│   ├── profile.scss
└── shared
    ├── forms.scss
    └── markdown.scss
```
* 字体单位: `font-size`用`px`, `line-height`用`em`
* 书写样式组件时, 使用标签名加类名的方式, 如 `ul.cat-list`
* 最小化样式, 使用子代选择器, 如 `ul.cat-list > li`
* 当需要修改样式时, 使用这种命名 `.listings-layout.listings-bigger` 而不是这种 `.listings-layout.bigger`
* 类似于 `disabled`, `mousedown`, `danger`, `hover`, `selected`这种类名, 最好以这种方式命名 `button.selected`
* 伪类选择器优先选择`:first-child`,因为其兼容IE7, 而不是`:last-child`