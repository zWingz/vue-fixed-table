<template>
    <FixedTable v-bind='$attrs'>
        <tr slot='leftThead'>
            <AlignCell tag='th' v-for='th in leftThead' :key='th'>{{th}}</AlignCell>
        </tr>
        <tr slot='thead'>
            <AlignCell tag='th' v-for='th in thead' :key='th'>{{th}}</AlignCell>
        </tr>
        <tr slot='rightThead'>
            <AlignCell tag='th' v-for='th in rightThead' :key='th'>{{th}}</AlignCell>
        </tr>
        <template v-for='(tr, index) in tbody'>
            <tr slot='leftBody' :key='index'>
                <AlignCell v-for='td in tr.td.slice(0,1)' :key='td'>{{td}}</AlignCell>
            </tr>
            <tr slot='tbody' :key='index'>
                <AlignCell v-for='td in tr.td.slice(0, -5)' :key='td'>{{td}}</AlignCell>
            </tr>
            <tr slot='rightBody' :key='index'>
                <AlignCell v-for='td in tr.td.slice(-1)' :key='td'>{{td}}</AlignCell>
            </tr>
        </template>
    </FixedTable>
</template>

<script>
    import {FixedTable, AlignCell} from '../src'
    export default {
        components: {
            FixedTable,
            AlignCell
        },
        props: {
            data: Object
        },
        computed: {
            leftThead() {
                return this.data.thead.slice(0, 1)
            },
            thead() {
                return this.data.thead.slice(0, -5)
            },
            rightThead() {
                return this.data.thead.slice(-1)
            },
            tbody() {
                return this.data.tbody
            }
        }
    }
</script>

<style>

</style>
