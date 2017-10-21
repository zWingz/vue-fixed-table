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
            <div class='view'  v-if='index === 1'>
                <div class='view-title'>
                    表格一:全局滚动.滚动时固定顶部和左侧栏
                </div>
                <div class='view-content'>
                    <demo :data='data' :offsetLeft='200'>
                    </demo>
                </div>
            </div>
            <div class='view' v-if='index ===2'>
                <div class='view-title'>
                    表格二:容器内局部滚动,滚动时在容器内固定顶部和左侧
                </div>
                <div class='view-content'>
                    <div id='scroll' class='scroll-container'>
                        <demo :data='data' scrollTarget='#scroll'>
                        </demo>
                    </div> 
                </div>
            </div>
            <div class='view'  v-if='index === 3'>
                <div class='view-title'>
                    表格三:高度跟随全局,固定宽度且x轴滚动. 出现虚拟x滚动条.解决滚动条太下无法拖动问题.
                </div>
                <div class='view-content'>
                    <demo :data='data' self-scroll>
                    </demo>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import FixedTable from '../fixed-table';
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
            index: 1
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            const data = await axios.post('https://www.easy-mock.com/mock/59e8918c21a50c465d91d78f/tableMock/list')
            this.data = data.data.data;
        }
    }
}
</script>
