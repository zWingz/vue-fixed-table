<template>
    <section class='container'>
        <div class='section'>
            <FixedTable>
                <template slot='fixCorner'>
                    <tr>
                        <th v-for='item in corner'>{{item}}</th>
                    </tr>
                </template>
                <template slot='fixleft'>
                    <tr v-for='(tr, index) in tbody'>
                        <td v-for='(td, tdindex) in tr.td.slice(0,2)' :key='td'>{{td}}</td>
                    </tr>
                </template>
                <template slot='thead'>
                    <tr>
                        <th v-for='th in thead' :key='th'>{{th}}</th>
                    </tr>
                </template>
                <template slot='tbody'>
                    <tr v-for='(i, index) in tbody'>
                        <td v-for='td in i.td.slice(2)' :key='td'>{{td}}</td>
                    </tr>
                </template>
            </FixedTable>
            <!-- <div id='scroll' class='overauto section' style='max-height: 400px'>
                <FixedTable scrollTarget='#scroll'>
                    <template slot='fixCorner'>
                        <tr>
                            <th>Corner</th>
                            <th>Corner</th>
                        </tr>
                    </template>
                    <template slot='fixleft'>
                        <tr v-for='i in 30' :key='i'>
                            <td>fixed</td>
                            <td>fixed</td>
                        </tr>
                    </template>
                    <template slot='thead'>
                        <tr>
                            <th v-for='j in 20' :key='j'>head{{j}}</th>
                        </tr>
                    </template>
                    <template slot='tbody'>
                        <tr v-for='i in 30' :key='i'>
                            <td v-for='j in 20' :key='j'>j</td>
                        </tr>
                    </template>
                </FixedTable>
            </div> -->
        </div>
    </section>
</template>

<script>
import FixedTable from '../fixed-table';
import axios from 'axios';
export default {
    components: {
        FixedTable
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
    },
    computed: {
        corner() {
            return this.data.thead.slice(0, 2)
        },
        thead() {
            return this.data.thead.slice(2)
        },
        tbody() {
            return this.data.tbody;
        }
    }
}
</script>
<style>
    .section {
        margin: 40px 0;
    }
    .overauto {
        overflow: auto;
    }
</style>

