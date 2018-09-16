<template>
  <div class='rel'>
    <div class='fixed-table-container' :style='containerStyle' ref='content' :class="{'scroll-container': selfScroll}">
      <div class='flex'>
        <table v-if='isFixLeft' ref='leftClone' class='fixed-table table-clone left' :style='leftStyle'>
          <thead class='fixed-table corner' :style='cornerStyle' :class='[{fixed: fixed.top}]'>
            <slot name='leftThead'></slot>
          </thead>
          <tbody>
            <slot name='leftBody'></slot>
          </tbody>
        </table>
        <table ref='tbody' class='fixed-table  flex-grow' :style='bodyStyle'>
          <thead ref='thead' :style='theadStyle' :class='[{fixed: fixed.top}]'>
            <slot name='thead'></slot>
          </thead>
          <tbody>
            <slot name='tbody'></slot>
          </tbody>
        </table>
        <table v-if='isFixRight' ref='rightClone' class='fixed-table table-clone right' :style='rightStyle'>
          <thead class='fixed-table corner' :style='cornerStyle' :class='[{fixed: fixed.top}]'>
            <slot name='rightThead'></slot>
          </thead>
          <tbody>
            <slot name='rightBody'></slot>
          </tbody>
        </table>
      </div>
    </div>
    <scrollxbar v-if='selfScroll' :scrollTarget='scrollTarget'></scrollxbar>
  </div>
</template>

<script>
  import scrollxbar from './scroll-x-bar'
  import {
    addResizeEventListener,
    timerFnc,
    querySelectorAll,
    getStyle,
    getScrollTop,
    getScrollLeft
  } from './utils'
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        targetOffset: {
          top: 0, // 距离
          left: 0 // 距离
        },
        // observer: {},
        fixed: {
          top: false, // 是否固定
          left: false, // 是否固定
          right: false
        },
        resizeObserver: undefined, // resize的observer
        hoverObserver: undefined, // 用于绑定hover事件
        tbodyWidth: 0, // 表格宽度
        tleftWidth: 0, // 左侧表格宽度,
        tRightWidth: 0, // 右侧表格宽度,
        topChanging: false,
        leftChanging: false,
        opacity: 1,
        scrolling: false,
        iframe: {}
      }
    },
    computed: {
      theadStyle() {
        return {
          transform: `translate3d(0px, ${
            this.fixed.top && !this.topChanging
              ? -(this.clientRect.top - this.offsetTop)
              : 0
          }px, 1px)`
        }
      },
      bodyStyle() {
        return {
          // marginLeft: '-1px',
          width: this.tbodyWidth + 'px'
          // width: this.tbodyWidth - (this.isFixLeft ? 1 : 0) + 'px',
          // position: 'relative',
          // left: '-1px'
        }
      },
      leftStyle() {
        return {
          transform: `translate3d(${
            this.fixed.left && !this.leftChanging
              ? this.offsetLeft - this.clientRect.left
              : 0
          }px, 0px, 0px)`,
          width: 'initial',
          opacity: !(this.offsetLeft - this.clientRect.left > this.tleftWidth)
            ? 1
            : this.opacity
        }
      },
      rightStyle() {
        const base = {
          transform: `translate3d(${
            this.leftChanging ? 0 : -this.clientRect.right
          }px, 0px, 0px)`,
          width: 'initial',
          opacity: this.opacity
        }
        return base
      },
      cornerStyle() {
        return {
          transform: `translate3d(0px, ${
            this.fixed.top && !this.topChanging
              ? -(this.clientRect.top - this.offsetTop)
              : 0
          }px, 1px)`
          // opacity: (this.topChanging || this.leftChanging) ? '0' : '1'
        }
      },
      containerStyle() {
        return {
          zIndex: this.scrolling ? '1' : ''
        }
      },
      scroller() {
        if (!this.scrollTarget) {
          return window
          // return document.scrollingElement
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
      scrollerDom() {
        if (this.scrollTarget) {
          return this.scroller
        }
        return document.body
      },
      xScroller() {
        return this.$refs.content
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
      this.resizeObserver = new MutationObserver(this.observerHandle)
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
        top: 0,
        left: 0,
        right: 0
      }
      this.destroyed()
    },
    methods: {
      init() {
        this.scrollerDom.classList.add('scroll-container')
        this.scroller.addEventListener('scroll', this.scrollHandle, false)
        this.scroller.addEventListener(
          'mousewheel',
          this.scrollerMouseWheel,
          false
        )
        if (this.selfScroll) {
          this.xScroller.addEventListener(
            'mousewheel',
            this.xScrollerMouseWheel,
            false
          )
          this.xScroller.addEventListener('scroll', this.scrollHandle, false)
        }
        if (this.selfScroll || this.scrollTarget) {
          this.iframe = addResizeEventListener(
            this.$refs.content,
            this.resizeHandel
          )
        } else {
          window.addEventListener('resize', this.resizeHandel, false)
        }
        this.resizeObserver.observe(this.$refs.content, {
          childList: true,
          subtree: true,
          characterData: true
        })
        if (this.isFixLeft || this.isFixRight) {
          this.$el.addEventListener('mouseover', this.mouseOver, false)
          this.$el.addEventListener('mouseout', this.mouseLeave, false)
        }
        this.update()
      },
      destroyed() {
        this.scrollerDom.classList.remove('scroll-container')
        this.scroller.removeEventListener('scroll', this.scrollHandle)
        this.scroller.removeEventListener('mousewheel', this.scrollerMouseWheel)
        if (this.selfScroll) {
          this.xScroller.removeEventListener(
            'mousewheel',
            this.xScrollerMouseWheel
          )
          this.xScroller.removeEventListener('scroll', this.scrollHandle)
        }
        if (this.isFixLeft || this.isFixRight) {
          this.$el.removeEventListener('mouseover', this.mouseOver)
          this.$el.removeEventListener('mouseout', this.mouseLeave)
        }
        this.resizeObserver.disconnect()
        if (this.selfScroll || this.scrollTarget) {
          this.iframe.removeEventListener('resize', this.resizeHandel)
          this.iframe.remove()
        }
        window.removeEventListener('resize', this.resizeHandel)
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
        let left = dom.offsetLeft
        dom = dom.parentElement
        while (dom && dom !== parent) {
          top += dom.offsetTop
          left += dom.offsetLeft
          dom = dom.parentElement
        }
        this.targetOffset.left = left
        this.targetOffset.top = top
      },
      getPointOffsetParent() {
        const { left, top } = this.targetOffset
        let right =
          -this.scroller.clientWidth +
          this.tleftWidth +
          this.$refs.tbody.clientWidth +
          this.tRightWidth -
          this.scroller.scrollLeft
        if (right <= 0) {
          right = 0
        }
        return {
          top:
            top - (this.scrollTarget ? this.scroller.scrollTop : getScrollTop()),
          left:
            left -
            (this.scrollTarget ? this.scroller.scrollLeft : getScrollLeft()),
          right
        }
      },
      scrollPositionInit() {
        const { left, top } = this.clientRect
        if (this.selfScroll) {
          this.$nextTick(() => {
            this.$refs.content.scrollLeft = -this.clientRect.left
          })
        } else if (this.scrollTarget) {
          this.$nextTick(() => {
            this.scroller.scrollLeft = -left
            this.scroller.scrollTop = -top
          })
        } else {
          window.scrollTo(left + this.tleftWidth, top)
        }
      },
      scrollerMouseWheel(e) {
        const scrollTarget = e.target.closest('.scroll-container')
        if (
          scrollTarget !== this.$refs.content &&
          scrollTarget !== document.body
        ) {
          return
        }
        e.preventDefault()
        let target
        if (this.scrollTarget) {
          target = this.scroller
        } else {
          target = document.scrollingElement
        }
        target.scrollTop += e.deltaY
        target.scrollLeft -= e.deltaX
      },
      xScrollerMouseWheel(e) {
        e.preventDefault()
        this.xScroller.scrollLeft += e.deltaX
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
          const { content } = this.$refs
          const { top } = tbody.getBoundingClientRect()
          const left = -content.scrollLeft
          const length = this.tleftWidth + tbody.clientWidth + this.tRightWidth
          let right = length - content.clientWidth + left
          right = right < 0 ? 0 : right
          this.clientRect = {
            top: top,
            left,
            right,
            bottom: 0
          }
        } else if (!this.scrollTarget) {
          const { top, left: l, bottom, right } = tbody.getBoundingClientRect()
          const left = l - this.tleftWidth
          let r =
            window.innerWidth -
            right -
            this.tRightWidth -
            (window.scrollbars.visible ? 9 : 0)
          if (r > 0) {
            r = 0
          }
          this.clientRect = {
            top: top,
            left,
            bottom,
            right: -r
          }
        } else {
          const point = this.getPointOffsetParent()
          this.clientRect = {
            top: point.top,
            left: point.left,
            right: point.right,
            bottom: 0
          }
        }
      },
      observerHandle: timerFnc(function() {
        this.update()
      }, 0),
      resizeHandel: timerFnc(
        function() {
          this.update()
          this.opacity = 1
        },
        0,
        function() {
          this.opacity = 0
        }
      ),
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
        if (this.$refs.content) {
          this.tbodyWidth =
            this.$refs.content.clientWidth - this.tleftWidth - this.tRightWidth
        }
        this.$nextTick(() => {
          this.scrollHandle()
        })
      },
      transitionTop: timerFnc(function() {
        this.topChanging = false
      }, 0),
      transitionLeft: timerFnc(function() {
        this.leftChanging = false
      }, 0)
    },
    watch: {
      offsetLeft(val) {
        setTimeout(() => {
          this.scrollHandle()
        }, 250)
      },
      'clientRect.top': function(val, old) {
        this.fixed.top = val < this.offsetTop
        if (val < 0 && this.isTransition) {
          this.topChanging = true
          this.transitionTop()
        }
      },
      'clientRect.left': function(val) {
        this.fixed.left = val < this.offsetLeft
        if (val < 0 && this.isTransition) {
          this.leftChanging = true
          this.transitionLeft()
        }
      }
    }
  }
</script>

<style lang='scss'>
  .fixed-table-container {
    position: relative;
    z-index: 1;
    transform: translate3d(0, 0, 0);
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
      tbody {
        background: lighten(#f1f2fe, 1.5%);
      }
      &.corner {
        z-index: 2;
      }
      &.left {
        box-shadow: 5px 0px 3px -3px #dadada;
      }
      &.right {
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
