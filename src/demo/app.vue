<template>
    <section class='main-container' :class='{full: index === 2, "width-full": index === 3}'>
        <div class='sidebar'>
            <div class='menu-container'>
                <div class="root-menu" @click='index = 1' :class='{active: index === 1}'>
                    <div class='menu-title'>
                        表格一
                    </div>
                </div>            
                <div class="root-menu" @click='index = 2' :class='{active: index === 2}'>
                    <div class='menu-title'>
                        表格二
                    </div>
                </div>            
                <div class="root-menu" @click='index = 3' :class='{active: index === 3}'>
                    <div class='menu-title'>
                        表格三
                    </div>
                </div>            
            </div>
        </div>
        <div class='main-wraper'>
            <div class='view'>
                <div class='view-title' v-if='index === 1'>
                    表格一:全局滚动.滚动时固定顶部/左侧/右侧
                </div>
                <div class='view-title' v-if='index === 2'>
                    表格二:容器内局部滚动,滚动时在容器内固定顶部/左侧/右侧
                </div>
                <div class='view-title' v-if='index === 3'>
                    表格三:高度跟随全局,宽度自适应且x轴滚动. 出现虚拟x滚动条.解决滚动条太下无法拖动问题.同时固定顶部/左侧/右侧
                </div>
                <div class='view-content' v-loading='!load'>
                    <template v-if='load'>
                        <demo :data='data' :offsetLeft='200' v-if='index === 1'></demo>
                        <div id='scroll' class='scroll-container border' v-if='index === 2'>
                            <demo :data='data' scrollTarget='#scroll'></demo>
                        </div> 
                        <demo :data='data' self-scroll v-if='index === 3'></demo>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import demo from './demo';
import axios from 'axios';
export default {
    components: {
        demo
    },
    data() {
        return {
            data: {
                thead: [],
                tbody: []
            },
            index: 1,
            load: false
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            const res = await axios.post('https://www.easy-mock.com/mock/5ad94a09505da819e171ff74/tableMock/list')
            this.data = res.data.data
            this.load = true;
        }
    },
    watch: {
        index() {
            this.load = false;
            setTimeout(() => {
                this.load = true
            }, 250)
        }
    }
}
</script>
