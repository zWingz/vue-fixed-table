<template>
    <div ref='scroller' class='virtual-scroll overhidden' :style='style' v-show='bottom > 5 && virtualPercent < 1' @mousedown.self='barClickHandle'>
        <div ref='bar' class="virtual-scroll-bar" :style='barLeft' @mousedown='barMouseDownHandle'></div>
    </div>
</template>

<script>
    import { addResizeEventListener, timerFnc } from 'utils'
    export default {
      data() {
        return {
          scrollWidth: 0, // 滚动条宽度
          scrollLeft: 0, // 滚动距离
          virtualPercent: 0, // 滚动按钮宽度占比
          virtualMouseDownX: 0, // 鼠标按键x坐标
          virtualObserver: {},
          target: {}, // 滚动元素
          opacity: false, // 是否需要设置透明
          bottom: 0, // 底部
          iframe: {} // iframe,用来监听resize
        }
      },
      computed: {
        /**
         * @function
         * 计算往左滚动距离
         */
        barLeft() {
          let barScroll = this.scrollLeft * this.virtualPercent
          if (isNaN(barScroll)) {
            barScroll = 0
          }
          return {
            transform: `translate3d(${barScroll}px, 0px, 0px)`,
            width: this.virtualPercent * 100 + '%'
          }
        },
        /**
         * @function
         * 滚动条位置
         */
        style() {
          return {
            transform: `translate3d(0px, ${-this.bottom}px, 0px)`,
            opacity: this.opacity ? 0 : 1
          }
        }
      },
      mounted() {
        // virtual
        this.bar = this.$refs.bar
        this.target = this.$el.previousElementSibling
        this.virtualObserver = new MutationObserver(this.refreshScroll)
        this.virtualObserver.observe(this.target, {
          childList: true,
          characterData: true,
          // attributeFilter: ['style'],
          subtree: true
        })
        // 计算滚动属性
        // this.refreshScroll();
        // 计算滚动条位置
        this.windowScrollHandle()
        ;['scroll', 'resize'].forEach(each => {
          window.addEventListener(each, this.windowScrollHandle, false)
        })
        this.target.addEventListener('scroll', this.targetScrollHandle, false)
        // 添加resize监听器
        this.iframe = addResizeEventListener(this.target, this.refreshScroll)
      },
      async activated() {
        // this.targetScrollHandle()
        await this.$nextTick()
        this.target.scrollLeft = this.scrollLeft
        this.windowScrollHandle()
      },
      destroyed() {
        this.target.removeEventListener('scroll', this.targetScrollHandle)
        ;['scroll', 'resize'].forEach(each => {
          window.removeEventListener(each, this.windowScrollHandle)
        })
        this.iframe.removeEventListener('resize', this.refreshScroll)
        this.iframe.remove()
        this.virtualObserver.disconnect()
      },
      methods: {
        setOpacityShow: timerFnc(function() {
          this.opacity = false
        }, 100),
        /**
         * @function
         * 监听全局滚动, 用来将虚拟滚动条固定在底部
         */
        windowScrollHandle: timerFnc(
          async function() {
            const { bottom } = this.target.getBoundingClientRect()
            let result = bottom - document.documentElement.clientHeight
            if (result < 0) {
              result = 0
            }
            this.bottom = result
            this.setOpacityShow()
          },
          100,
          function() {
            this.opacity = true
          }
        ),
        /**
         * @function
         * 目标滚动时候同步到虚拟滚动条位置
         */
        targetScrollHandle() {
          this.scrollLeft = this.target.scrollLeft
        },
        /**
         * @function
         * 监听target的大小变化,重新计算虚拟滚动条的宽度.以及滚动占比
         */
        refreshScroll: timerFnc(
          function() {
            if (this._isDestroyed) {
              return
            }
            this.scrollWidth =
              this.target.scrollWidth -
              (this.target.offsetWidth || this.target.clientWidth)
            if (this.scrollLeft > this.scrollWidth || this.scrollWidth === 0) {
              this.scrollLeft = 0
            }
            this.virtualPercent = this.target.offsetWidth / this.target.scrollWidth
            this.windowScrollHandle()
            this.targetScrollHandle()
          },
          100,
          function() {
            this.opacity = true
          }
        ),
        /**
         * @event
         * 点解滚动条自动滚动到特定位置
         */
        barClickHandle(event) {
          const barLeft = this.scrollLeft * this.virtualPercent
          let offsetX = event.offsetX - this.$refs.bar.offsetWidth - barLeft
          if (offsetX < 0) {
            offsetX = -barLeft + event.offsetX
          }
          this.scrollLeft += offsetX / this.virtualPercent
        },
        /**
         * @event
         * 点解滚动条给body监听mousemove事件以及mouseup事件.
         * 执行拖动
         */
        barMouseDownHandle(event) {
          if (event.button !== 0) {
            return
          }
          this.virtualMouseDownX = event.pageX
          document.body.addEventListener('mousemove', this.mousemoveHandle, false)
          document.body.classList.add('no-select')
          document.body.addEventListener('mouseup', this.bodyMouseUpHandle, false)
        },
        /**
         * @event
         * 拖动事件
         */
        mousemoveHandle(event) {
          const offsetX = event.pageX - this.virtualMouseDownX,
            speed = offsetX / this.virtualPercent
          if (offsetX > 0) {
            this.up(speed)
          } else {
            this.down(-speed)
          }
          this.virtualMouseDownX = event.pageX
        },
        /**
         * @event
         * body的mouseUp事件,用来移除mousemove事件以及mouseup事件
         */
        bodyMouseUpHandle() {
          document.body.removeEventListener(
            'mousemove',
            this.mousemoveHandle,
            false
          )
          document.body.removeEventListener(
            'mouseup',
            this.bodyMouseUpHandle,
            false
          )
          document.body.classList.remove('no-select')
        },
        /**
         * @function
         * 往左拉
         */
        down(speed) {
          this.scrollLeft =
            this.scrollLeft - speed > 0 ? this.scrollLeft - speed : 0
        },
        /**
         * @function
         * 往右拉
         */
        up(speed) {
          this.scrollLeft =
            this.scrollLeft + speed > this.scrollWidth
              ? this.scrollWidth
              : this.scrollLeft + speed
        }
      },
      watch: {
        /**
         * @function
         * 监听scrollLeft,并对目标元素进行滚动
         */
        scrollLeft: function(val) {
          this.target.scrollLeft = val
        }
      }
    }
</script>

<style lang='scss'>
    .no-select {
      user-select: none;
    }
    .virtual-scroll {
      opacity: 1;
      height: 9px;
      // background: rgba(0,0,0,.2);
      background: #eee;
      position: absolute;
      bottom: 10px;
      right: 0px;
      left: 0px;
      transform: translate3d(0, 0, 0);
      transition: opacity 0.3s ease;
      border-radius: 4px;
      z-index: 2;
      &.hide {
        visibility: hidden;
        pointer-events: none;
        width: 0;
        overflow: hidden;
      }
    }
    .virtual-scroll-bar {
      background: #2d3041;
      // background: $s1;
      background: rgba(0, 0, 0, 0.2);
      border-radius: inherit;
      height: 9px;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.4);
      }
    }
</style>
