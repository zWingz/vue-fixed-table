#### 所有滚动都依赖全局, 只需要配置相应的`slot`

``` html
<FixedTable :offsetTop='50'>
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