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
            <span ref='span'>
                <slot></slot>
            </span>
        </span>
    </component>
</template>

<script>
    import { calcWidth } from './utils'
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
        }
      },
      data() {
        return {
          observer: undefined
        }
      },
      mounted() {
        this.calc()
        this.observer = new MutationObserver(this.calc)
        this.observer.observe(this.$refs.span, {
          childList: true,
          subtree: true,
          characterData: true
        })
      },
      destroyed() {
        this.observer.disconnect()
      },
      methods: {
        calc() {
          const table = this.$el.offsetParent
          if (!table) {
            return
          }
          const index = this.$el.cellIndex + 1
          const element = table.querySelectorAll(
            `.align-cell:nth-child(${index})>span>span`
          )
          this.$nextTick(() => {
            calcWidth(element)
          })
        }
      },
      computed: {
        hasDom() {
          return this.$slots.default
        }
      }
    }
</script>
