<template>
    <FixedTable v-bind='$attrs'>
        <tr slot='leftThead'>
            <AlignCell tag='th' v-for='th in corner' :key='th'>{{th}}</AlignCell>
        </tr>
        <tr slot='thead'>
            <AlignCell tag='th' v-for='th in thead' :key='th'>{{th}}</AlignCell>
        </tr>
        <template slot='leftBody'>
            <tr v-for='(tr, index) in tbody' :key='index'>
                <AlignCell v-for='td in tr.td.slice(0,2)' :key='td'>{{td}}</AlignCell>
            </tr>
        </template>
        <template slot='tbody'>
            <tr v-for='(tr, index) in tbody' :key='index'>
                <AlignCell v-for='td in tr.td.slice(2)' :key='td'>{{td}}</AlignCell>
            </tr>
        </template>
    </FixedTable>
</template>

<script>
import FixedTable from '../fixed-table';
import AlignCell from '../align-cell';
export default {
    components: {
        FixedTable,
        AlignCell
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
