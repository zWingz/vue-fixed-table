#### 垂直滚动属于全局, 水平滚动属于组件自身,要让table容器自身产生滚动

``` html
<!-- 产生局部滚动 -->
<FixedTable scrollTarget='#scroll' self-scroll>
    <tr slot='leftThead'>
        <!-- some -->
    </tr>
    <tr slot='thead'>
        <!-- some -->
    </tr>
    <tr slot='rightThead'>
        <!-- some -->
    </tr>
    <template v-for='(tr, index) in someListData'>
        <tr slot='leftBody' :key='index'>
            <!-- some -->
        </tr>
        <tr slot='tbody' :key='index'>
            <!-- some -->
        </tr>
        <tr slot='rightBody' :key='index'>
            <!-- some -->
        </tr>
    </template>
</FixedTable>
```