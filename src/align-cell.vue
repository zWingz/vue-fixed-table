<style>
    .align-cell-l {
        text-align: left;
    }
    .align-cell-r {
        text-align: right;
    }
    .align-cell-c {
        text-align: center;
    }
    .align-cell span {
        display: inline-block;
    }
</style>

<template>
    <component :is='tag' class='align-cell' v-on='$listeners' v-bind='$attrs'>
        <span :class='"align-cell-" + dir'>
            <span ref='span'><slot></slot></span>
        </span>
    </component>
</template>

<script>
import { calcWidth } from './utils';
export default {
    name: 'AlignCell',
    props: {
        dir: {
            type: String,
            default: 'l'
        },
        tag: {
            type: String,
            default: 'td'
        },
        noSyncTh: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            observer: undefined
        }
    },
    async mounted() {
        this.calc();
        this.observer = new MutationObserver(this.calc)
        this.observer.observe(this.$refs.span, {
            // childList: true,
            subtree: true,
            characterData: true
        })
    },
    // async activated() {
    //     this.calc();
    //     console.log('activated');
    // },
    methods: {
        async calc() {
            // console.log('calc');
            const table = this.$el.offsetParent;
            const index = this.$el.cellIndex + 1;
            const element = table.querySelectorAll(`.align-cell:nth-child(${index})>span>span`)
            // TODO
            this.$nextTick(() => {
                calcWidth(element, this.dir)
            });
            // console.log(element, tr.rowIndex, index);
        }
    },
    computed: {
        hasDom() {
            return this.$slots.default
        }
    }
}
</script>
