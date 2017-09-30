<template>
    <section class='container'>

        <div style='margin-top: 10px'>
            <FixedTable use-opacity>
                <template slot='fixCorner'>
                    <tr>
                        <th>Corner</th>
                        <th>Corner</th>
                    </tr>
                </template>
                <tbody slot='fixleft'>
                    <tr v-for='i in 30' :key='i'>
                        <td>fixed</td>
                        <td>fixed</td>
                    </tr>
                </tbody>
                <template slot='thead'>
                    <tr>
                        <th v-for='j in 5' :key='j'>head{{j}}</th>
                    </tr>
                </template>
                <tbody slot='tbody'>
                    <tr v-for='i in 30' :key='i'>
                        <td v-for='j in 5' :key='j'>j</td>
                    </tr>
                </tbody>
            </FixedTable>

        </div>
    </section>
</template>

<script>
import FixedTable from '../fixed-table'
export default {
    components: {
        FixedTable
    }
}
</script>
