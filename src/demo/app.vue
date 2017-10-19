<template>
    <section class='container'>
            <P>
                情景一:
            </P>
            <p>
                全局滚动.固定顶部和左侧栏
            </p>
            <demo :data='data'>
            </demo>
            <P>
                情景二:
            </P>
            <p>
                局部滚动,固定顶部和左侧
            </p>
             <div id='scroll' class='overauto section' style='max-height: 400px'>
                <demo :data='data' scrollTarget='#scroll'>
                </demo>
            </div> 
            <P>
                情景三:
            </P>
            <p>
                y轴方向全局滚动,x轴使用虚拟滚动条
            </p>
            <demo :data='data' self-scroll>
            </demo>
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
            }
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
<style>
    .overauto {
        overflow: auto;
    }
</style>

