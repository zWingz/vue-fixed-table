# vue-table 组件

[![CircleCI](https://circleci.com/gh/zWingz/vue-fixed-table.svg?style=svg)](https://circleci.com/gh/zWingz/vue-fixed-table)

[Demo](https://zwing.site/vue-fixed-table/docs/)

功能：
+ 固定表格头、左侧栏
+ 单元格整体居中，局部对齐
+ 虚拟的横向滚动条

解决问题:

后台系统的列表页中,如果不做处理
在内容过多情况下.会引起页面滚动.同时会撑开页面.
表头/两侧会滚动条隐藏掉.不利于数据的展示

解决方法:
+ 全局滚动.(表格过大.页面整体会被撑开)
+ 容器内滚动.(表格显得很狭窄)
+ 垂直方向全局滚动, 水平方向是局部滚动. (请自行使用flex布局使得表格自身横向滚动,纵向自适应页面高度.页面宽度不被撑开, 加虚拟滚动条辅助时候水平滚动不需要拉到最后)
+ 固定表格头/两侧边


----
## 主要依赖

`vue@2.4.4`
----

## Build Setup

+ git clone

+ cd dir,执行

    `npm install`
    
    完成依赖包安装
    

+ 开发环境(访问 http://localhost:8082/demo/)

    `npm run dev`

+ 生产环境

    `npm run build`

## Fixed-Table 使用

固定表头, 左侧以及右侧

需要通过一定的slot插入相应的内容达到固定

### options

|    props     | 类型           | 默认  | 描述                                                         |
| :----------: | -------------- | ----- | ------------------------------------------------------------ |
|  offsetTop   | String, Number | 0     | 顶部偏移                                                     |
|  selfScroll  | Boolean        | false | 是否自滚动. 垂直滚动会依赖全局, 横向滚动会依赖自身. 所以需要额外样式是的容器能产生横向的滚动条.(DEMO 1) |
| scrollTarget | Object, String | window    | 局部滚动容器, 可传dom元素或者选择器, 既全局滚动.(DEMO2) |
|   useTrans   | Boolean        | false | 是否使用动画做回退方案, 在safari和firefox下会有闪动. 所以safari和firefox默认开启. |


### slot

需要通过`slot`插入到相应的插槽中, 通过对插槽的控制达到固定效果

| slot       | 介绍             |
| ---------- | ------------ |
| leftThead  | 左侧表头     |
| thead      | 中间表头     |
| rightThead | 右侧表头     |
| leftBody   | 左侧固定表体 |
| tbody      | 表体         |
| rightBody  | 右侧固定表体 |


## align-cell 使用

### options
| props | 类型   | 默认 | 描述       |
| ------- | ------ | ---- | ---------- |
| dir     | String | 'l'  | 对齐方向   |
| tag     | String | 'td' | 渲染的标签 |


## scroll-x-bar 使用

虚拟的横向滚动条, 需要让容易自行产生横向滚动.

让容器在页面高度不足的时候, 也可以拖动横向滚动条.

**一定要让容器产生横向滚动**
