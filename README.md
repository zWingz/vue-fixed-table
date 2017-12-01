# vue-table 组件

[![CircleCI](https://circleci.com/gh/zWingz/vue-fixed-table.svg?style=svg)](https://circleci.com/gh/zWingz/vue-fixed-table)

[Demo](https://zwingz.github.io/vue-fixed-table/release/demo.html)

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
