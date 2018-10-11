<template>
    <section class='main-container' :class='{full: index === 2, "width-full": index === 1}'>
        <div class='sidebar'>
            <div class='inner'>
                <div class="root-menu" @click='index = 1' :class='{active: index === 1}'>
                    垂直方向全局滚动/水平方向局部滚动
                </div>
                <div class="root-menu" @click='index = 2' :class='{active: index === 2}'>
                    局部滚动
                </div>
            </div>
        </div>
        <div class='main-wraper' :class='{full: index === 2, "width-full": index === 1}'>
            <div class='view'>
                <div class='view-title' v-if='index === 1'>
                    表格一:高度跟随全局,宽度自适应且x轴滚动. 出现虚拟x滚动条.解决滚动条太下无法拖动问题.同时固定顶部/左侧/右侧
                </div>
                <div class='view-title' v-if='index === 2'>
                    表格二:容器内局部滚动,滚动时在容器内固定顶部/左侧/右侧
                </div>
                <components class='markdown-body' :is='code'></components>
                <div class='view-content' v-loading='!load'>
                    <template v-if='load'>
                        <demo :data='data' self-scroll v-if='index === 1' :offsetTop='50'></demo>
                        <div id='scroll' class='scroll-container border' v-if='index === 2'>
                            <demo :data='data' scrollTarget='#scroll'></demo>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import demo from './demo'
    import axios from 'axios'
    import Code1 from './demo1.md'
    import Code2 from './demo2.md'
    import Code3 from './demo3.md'
    export default {
        components: {
            demo,
            Code1,
            Code2,
            Code3
        },
        data() {
            return {
                data: {
                    thead: [],
                    tbody: []
                },
                index: 1,
                load: false,
                html: '',
                md: {}
            }
        },
        computed: {
            code() {
                return ['Code1', 'Code2', 'Code3'][this.index - 1]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                axios.post(
                    'https://www.easy-mock.com/mock/5ad94a09505da819e171ff74/tableMock/list'
                ).then(res => {
                    this.data = res.data.data
                    this.load = true
                })
            }
        },
        watch: {
            index() {
                this.load = false
                setTimeout(() => {
                    this.load = true
                }, 250)
            }
        }
    }
</script>
