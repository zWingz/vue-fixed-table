<template>
  <div class='rel'>
    <div class='fixed-table-container rel' ref='content' @mouseover='mouseOver' @mouseout='mouseLeave'>
      <table v-if='isFixLeft' ref='leftClone' class='fixed-table table-clone left'>
        <thead class='fixed-table corner' :style='theadStyle' :class='[{fixed: fixedTop}]'>
          <slot name='leftThead'></slot>
        </thead>
        <tbody>
          <slot name='leftBody'></slot>
        </tbody>
      </table>
      <div class='scroll-container flex-grow'>
        <table ref='tbody' class='fixed-table  flex-grow' :style='tableContentStyle'>
          <thead ref='thead' :style='theadStyle' :class='[{fixed: fixedTop}]'>
            <slot name='thead'></slot>
          </thead>
          <tbody>
            <slot name='tbody'></slot>
          </tbody>
        </table>
        <scrollxbar :scrollTarget='scrollTarget'></scrollxbar>
      </div>
      <table v-if='isFixRight' ref='rightClone' class='fixed-table table-clone right'>
        <thead class='fixed-table corner' :style='theadStyle' :class='[{fixed: fixedTop}]'>
          <slot name='rightThead'></slot>
        </thead>
        <tbody>
          <slot name='rightBody'></slot>
        </tbody>
      </table>
    </div>
    <div style='z-index: 1; position: fixed;'></div>
  </div>
</template>

<script>
  import scrollxbar from './scroll-x-bar'
  import { timerFnc, querySelectorAll, getStyle } from './utils'
  const { userAgent } = navigator
  const isMoz = /Firefox/.test(userAgent)
  const isSafari =
    userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1
  export default {
    components: {
      scrollxbar
    },
    props: {
      offsetLeft: {
        type: [String, Number],
        default: 0
      },
      offsetTop: {
        type: [String, Number],
        default: 0
      },
      scrollTarget: {},
      useTrans: Boolean,
      selfScroll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        clientRect: {
          top: 0
        },
        targetOffset: {
          top: 0 // 距离
        },
        fixedTop: false,
        tleftWidth: 0, // 左侧表格宽度,
        tRightWidth: 0, // 右侧表格宽度,
        topChanging: false,
        opacity: 1,
        scrolling: false
      }
    },
    computed: {
      theadStyle() {
        return {
          transform: `translate3d(0px, ${
            this.fixedTop && !this.topChanging
              ? -(this.clientRect.top - this.offsetTop)
              : 0
          }px, 1px)`
        }
      },
      tableContentStyle() {
        return {
          paddingRight: this.tRightWidth + 'px',
          paddingLeft: this.tleftWidth + 'px'
        }
      },
      scroller() {
        if (!this.scrollTarget) {
          return window
        }
        let result
        if (typeof this.scrollTarget === 'string') {
          result = document.querySelector(this.scrollTarget)
        } else {
          result = this.scrollTarget
        }
        if (result) {
          const pos = getStyle(result, 'position')
          if (pos !== 'absolute' && pos !== 'fixed') {
            result.style.position = 'relative'
          }
        }
        this.getTargetOffsetParent(this.$refs.content, result)
        return result
      },
      isFixLeft() {
        return !!this.$slots.leftThead
      },
      isFixRight() {
        return !!this.$slots.rightThead
      },
      isTransition() {
        // return false;
        return isMoz || isSafari || this.useTrans
      }
    },
    mounted() {
      this.init()
    },
    activated() {
      this.init()
      Array.from(document.querySelectorAll('tbody tr.hover')).forEach(each => {
        each.classList.remove('hover')
      })
    },
    deactivated() {
      this.destroyed()
    },
    beforeDestroy() {
      this.clientRect = {
        top: 0
      }
      this.destroyed()
    },
    methods: {
      init() {
        this.scroller.addEventListener('scroll', this.scrollHandle, {
          passive: true
        })
        this.scroller.addEventListener('resize', this.scrollHandle, {
          passive: true
        })
        this.update()
      },
      destroyed() {
        this.scroller.removeEventListener('scroll', this.scrollHandle)
        this.scroller.removeEventListener('resize', this.scrollHandle)
      },
      hoverClass(e, type) {
        const tr = e.target.closest('tr')
        if (!tr) {
          return
        }
        const idx = tr.rowIndex
        const trs = querySelectorAll(`tbody tr:nth-child(${idx})`, this.$el)
        if (trs.length === 0) {
          return
        }
        trs.forEach(each => {
          each.classList[type]('hover')
        })
      },
      mouseOver(e) {
        this.hoverClass(e, 'add')
      },
      mouseLeave(e) {
        this.hoverClass(e, 'remove')
      },
      getTargetOffsetParent(dom, parent) {
        let top = dom.offsetTop
        dom = dom.parentElement
        while (dom && dom !== parent) {
          top += dom.offsetTop
          dom = dom.parentElement
        }
        this.targetOffset.top = top
      },
      getPointOffsetParent() {
        const { top } = this.targetOffset
        return {
          top: top - this.scroller.scrollTop
        }
      },
      setScrollIng: timerFnc(function() {
        this.scrolling = false
      }, 250),
      scrollHandle() {
        const { tbody } = this.$refs
        if (!tbody) {
          return
        }
        this.scrolling = true
        this.setScrollIng()
        if (this.selfScroll) {
          const { top } = tbody.getBoundingClientRect()
          this.clientRect = {
            top
          }
        } else {
          const point = this.getPointOffsetParent()
          this.clientRect = {
            top: point.top
          }
        }
      },
      update() {
        if (this._isDestroyed) {
          return
        }
        if (this.isFixLeft && this.$refs.leftClone) {
          this.tleftWidth = this.$refs.leftClone.clientWidth
        }
        if (this.isFixRight && this.$refs.rightClone) {
          this.tRightWidth = this.$refs.rightClone.clientWidth
        }
        // this.$nextTick(() => {
        //   this.scrollHandle()
        // })
      },
      transitionTop: timerFnc(function() {
        this.topChanging = false
      }, 0)
    },
    watch: {
      offsetLeft(val) {
        setTimeout(() => {
          this.scrollHandle()
        }, 250)
      },
      'clientRect.top': function(val, old) {
        this.fixedTop = val < this.offsetTop
        if (val < 0 && this.isTransition) {
          this.topChanging = true
          this.transitionTop()
        }
      }
    }
  }
</script>

<style lang='scss'>
  .fixed-table-container {
    position: relative;
    z-index: 2;
    box-shadow: -1px 0px 0px 0px #dadada, 1px 0px 0px 0px #dadada,
      0px 1px 0 0 #dadada;
    //   border: 1px solid #dadada;
    border-top: none;
    display: flex;
    .fixed-table {
      border-spacing: 0px;
      border-collapse: separate;
      transform-style: preserve-3d;
      th,
      td {
        border-bottom: none;
        border-right: none;
        border-left: none;
        box-shadow: 1px 0 0 0 #dadada;
      }
      thead.fixed {
        box-shadow: 0 1px 0 0 #dadada;
      }
    }
    .table-clone {
      z-index: 1;
      width: initial;
      position: absolute;
      tbody {
        background: lighten(#f1f2fe, 1.5%);
      }
      &.left {
        left: 0px;
        box-shadow: 5px 0px 3px -3px #dadada;
      }
      &.right {
        right: 0px;
        box-shadow: -5px 0px 3px -3px #dadada;
      }
    }
  }
  .flex {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .rel {
    position: relative;
  }
  .flex-no-shrink {
    flex-shrink: 0;
  }
</style>
