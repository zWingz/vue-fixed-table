#### 所有滚动都依赖局部, 需要置于一个有局部滚动容器中

``` html
<!-- 产生局部滚动 -->
<div id='scroll' class='scroll-container'>
    <FixedTable scrollTarget='#scroll'>
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
</div>
```