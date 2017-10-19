<template>
    <FixedTable v-bind='$attrs'>
        <template slot='fixCorner'>
            <tr>
                <th v-for='th in corner'>{{th}}</th>
            </tr>
        </template>
        <template slot='fixleft'>
            <tr v-for='tr in tbody'>
                <td v-for='td in tr.td.slice(0,2)'>{{td}}</td>
            </tr>
        </template>
        <template slot='thead'>
            <tr>
                <th v-for='th in thead'>{{th}}</th>
            </tr>
        </template>
        <template slot='tbody'>
            <tr v-for='tr in tbody'>
                <td v-for='td in tr.td.slice(2)'>{{td}}</td>
            </tr>
        </template>
    </FixedTable>
</template>

<script>
import FixedTable from '../fixed-table';
export default {
    components: {
        FixedTable
    },
    props: {
        data: Object
    },
    computed: {
        corner() {
            return this.data.thead.slice(0, 2)
        },
        thead() {
            return this.data.thead.slice(2)
        },
        tbody() {
            return this.data.tbody
        }
    }
}
</script>

<style>

</style>
