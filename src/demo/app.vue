<template>
    <section class='container'>
        <div class='section'>
            <FixedTable use-opacity>
                <template slot='fixCorner'>
                    <tr>
                        <th>Corner</th>
                        <th>Corner</th>
                    </tr>
                </template>
                <tbody slot='fixleft'>
                    <tr v-for='i in 10' :key='i'>
                        <td>fixed</td>
                        <td>fixed</td>
                    </tr>
                </tbody>
                <template slot='thead'>
                    <tr>
                        <th v-for='j in 20' :key='j'>head{{j}}</th>
                    </tr>
                </template>
                <tbody slot='tbody'>
                    <tr v-for='i in 10' :key='i'>
                        <td v-for='j in 20' :key='j'>j</td>
                    </tr>
                </tbody>
            </FixedTable>
            <div id='scroll' class='overauto section' style='max-height: 400px'>
                <FixedTable scrollTarget='#scroll'>
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
                            <th v-for='j in 20' :key='j'>head{{j}}</th>
                        </tr>
                    </template>
                    <tbody slot='tbody'>
                        <tr v-for='i in 30' :key='i'>
                            <td v-for='j in 20' :key='j'>j</td>
                        </tr>
                    </tbody>
                </FixedTable>
            </div>
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
<style>
    .section {
        margin: 40px 0;
    }
    .overauto {
        overflow: auto;
    }
</style>

