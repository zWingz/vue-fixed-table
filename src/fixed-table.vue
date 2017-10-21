<template>
    <div class='rel'>
        <div class='fixed-table-container' ref='content' :style='containerStyle' :class='{"scroll-container": selfScroll}'>
            <table v-if='$slots.fixleft' ref='leftClone' class='fixed-table table-clone left fixed-table-opacity' :style='leftStyle'> 
                <thead v-if='$slots.fixCorner' class='fixed-table corner fixed-table-opacity' :style='cornerStyle'>
                    <slot name='fixCorner'></slot>
                </thead>
                <tbody>
                    <slot name='fixleft'></slot>
                </tbody>
            </table> 
            <table ref='tbody' class='fixed-table table-body' :style='bodyStyle'>
                <thead  ref='thead' :style='theadStyle' class='fixed-table-opacity'>
                    <slot name='thead'></slot>
                </thead>
                <tbody>
                    <slot name='tbody'></slot>
                </tbody>
            </table>
        </div>
        <scrollxbar v-if='selfScroll'></scrollxbar>
    </div>
</template>

<script>
import scrollxbar from './scroll-x-bar';
import { getStyle, getScrollTop, getScrollLeft, addResizeEventListener } from './utils';
const userAgent = navigator.userAgent;
const isMoz = /Firefox/.test(userAgent)
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
        useOpacity: Boolean,
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
                left: false // 是否固定
            },
            resizeObserver: undefined, // resize的observer
            hoverObserver: undefined, // 用于绑定hover事件
            // container: {
            //     paddingTop: 0
            // },
            tbodyWidth: 0, // 表格宽度
            tleftWidth: 0, // 左侧表格宽度,
            topChange: false,
            leftChange: false,
            topChangeTimer: undefined,
            leftChangeTimer: undefined,
            updateTimer: undefined,
            scrollTimer: undefined,
            scrolling: false,
            iframe: {}
        }
    },
    computed: {
        theadStyle() {
            return {
                transform: `translate3d(0px, ${this.fixed.top ? -this.clientRect.top : 0}px, 1px)`,
                opacity: this.topChange ? '0' : '1'
            }
        },
        bodyStyle() {
            return {
                // marginLeft: '-1px',
                width: this.tbodyWidth + 'px'
            }
        },
        leftStyle() {
            return {
                transform: `translate3d(${this.fixed.left ? this.offsetLeft - this.clientRect.left : 0}px, 0px, 0px)`,
                width: 'initial',
                opacity: this.leftChange ? '0' : '1'
            }
        },
        cornerStyle() {
            return {
                transform: `translate3d(0px, ${this.fixed.top ? -this.clientRect.top : 0}px, 1px)`,
                opacity: (this.topChange || this.leftChange) ? '0' : '1'
            }
        },
        containerStyle() {
            return {
                zIndex: this.scrolling ? '1' : ''
            }
        },
        scroller() {
            if(!this.scrollTarget) {
                return window;
            }
            let result;
            if(typeof this.scrollTarget === 'string') {
                result = document.querySelector(this.scrollTarget)
            } else {
                result = this.scrollTarget;
            }
            if(result) {
                const pos = getStyle(result, 'position')
                if(pos !== 'absolute' && pos !== 'fixed') {
                    result.style.position = 'relative';
                }
            }
            this.getTargetOffsetParent(this.$refs.content, result);
            return result
        },
        xScroller() {
            return this.$refs.content
        },
        isFixLeft() {
            return !!this.$slots.fixleft
        }
    },
    mounted() {
        this.scroller.addEventListener('scroll', this.scrollHandle, false);
        if(this.selfScroll) {
            this.xScroller.addEventListener('scroll', this.scrollHandle, false)
        }
        // window.addEventListener('resize', this.resizeHandel)
        // this.resizeObserver = new MutationObserver(this.update)
        // this.resizeObserver.observe(this.$refs.tbody, {
        //     childList: true,
        //     subtree: true
        // })
        this.iframe = addResizeEventListener(this.$refs.content, this.resizeHandel)
        if(this.isFixLeft) {
            this.hoverObserver = new MutationObserver(this.addHoverHandle)
            this.hoverObserver.observe(this.$refs.tbody, {
                childList: true,
                subtree: true
            })
        }
        this.addHoverHandle();
        this.update();
    },
    activated() {
        this.scrollPositionInit();
    },
    beforeDestroy() {
        this.scroller.removeEventListener('scroll', this.scrollHandle)
        if(this.selfScroll) {
            this.xScroller.removeEventListener('scroll', this.scrollHandle)
        }
        this.iframe.removeEventListener('resize', this.resizeHandel)
    },
    methods: {
        addHoverHandle() {
            if(this.isFixLeft) {
                const tbodyTr = this.$refs.tbody.querySelectorAll('tbody tr')
                const leftTr = this.$refs.leftClone.querySelectorAll('tbody tr')
                leftTr.forEach((each, index) => {
                    const mouseenter = () => {
                            tbodyTr[index].classList.add('hover')
                            each.classList.add('hover')
                        }
                    const mouseleave = () => {
                        tbodyTr[index].classList.remove('hover')
                        each.classList.remove('hover')
                    }
                    each.addEventListener('mouseenter', mouseenter)
                    each.addEventListener('mouseleave', mouseleave)
                    tbodyTr[index].addEventListener('mouseenter', mouseenter)
                    tbodyTr[index].addEventListener('mouseleave', mouseleave)
                })
            }
        },
        getTargetOffsetParent(dom, parent) {
            let top = dom.offsetTop;
            let left = dom.offsetLeft;
            dom = dom.parentElement
            while(dom && dom !== parent) {
                top += dom.offsetTop;
                left += dom.offsetLeft;
                dom = dom.parentElement
            }
            this.targetOffset.left = left;
            this.targetOffset.top = top;
        },
        getPointOffsetParent() {
            const left = this.targetOffset.left
            const top = this.targetOffset.top
            return {
                top: top - (this.scrollTarget ? this.scroller.scrollTop : getScrollTop()),
                left: left - (this.scrollTarget ? this.scroller.scrollLeft : getScrollLeft())
            }
        },
        scrollPositionInit() {
            const { left, top } = this.clientRect
            if(this.scrollTarget) {
                this.$nextTick(() => {
                    this.scroller.scrollLeft = -left;
                    this.scroller.scrollTop = -top;
                })
            } else {
                window.scrollTo(left + this.tleftWidth, top)
            }
        },
        scrollHandle() {
            if(this.scrollTimer) {
                clearTimeout(this.scrollTimer)
            }
            this.scrolling = true;
            this.scrollTimer = setTimeout(() => {
                this.scrolling = false;
                this.scrollTimer = undefined;
            }, 250)
            if(this.selfScroll) {
                const { top } = this.$refs.tbody.getBoundingClientRect()
                const left = -this.$refs.content.scrollLeft
                this.clientRect = {
                    top: top,
                    left,
                    right: 0,
                    bottom: 0
                }
            } else if(!this.scrollTarget) {
                const { top, left, bottom, right } = this.$refs.tbody.getBoundingClientRect()
                this.clientRect = {
                    top: top,
                    left: left - this.tleftWidth,
                    bottom,
                    right
                }
            } else {
                const point = this.getPointOffsetParent()
                this.clientRect = {
                    top: point.top,
                    left: point.left,
                    right: 0,
                    bottom: 0
                }
            }
        },
        resizeHandel() {
            if(this.updateTimer) {
                clearTimeout(this.updateTimer)
            }
            this.updateTimer = setTimeout(() => {
                this.update();
                this.updateTimer = undefined;
            }, 300)
        },
        update() {
            if(this._isDestroyed) {
                return;
            }
            if(this.isFixLeft && this.$refs.leftClone) {
                this.tleftWidth = this.$refs.leftClone.offsetWidth
            }
            if(this.$refs.content) {
                this.tbodyWidth = this.$refs.content.offsetWidth - this.tleftWidth;
            }
        },
        opacityFixed(key) {
            const timer = this[key + 'Timer']
            if(timer) {
                clearTimeout(timer)
                this[key + 'Timer'] = undefined
            }
            this[key] = true;
            this[key + 'Timer'] = setTimeout(() => {
                this[key] = false;
            }, 400)
        }
    },
    watch: {
        offsetLeft(val) {
            setTimeout(() => {
                this.scrollHandle();
            }, 250)
        },
        'clientRect.top': function(val, old) {
            this.fixed.top = val < 0;
            if(val < 0 && (isMoz || this.useOpacity)) {
                this.opacityFixed('topChange');
            }
        },
        'clientRect.left': function(val) {
            this.fixed.left = val < this.offsetLeft;
            if(val < 0 && (isMoz || this.useOpacity)) {
                this.opacityFixed('topChange');
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
        display: flex;
    }
    .fixed-table {
        border-spacing: 0px;
        border-collapse: separate;
        transform-style: preserve-3d;
        overflow: hidden;
            th, td {
                border-bottom-color: transparent;
                border-right-color: transparent;
            }
            tbody tr:last-child {
                td {
                    border-bottom-color: #dadada;
                }
            }
            thead.fixed {
                td, th {
                    border-bottom-color: #dadada;
                }
            }
    }
    .fixed-table-opacity {
        transition: opacity .4s ease;
    }
    .table-body {
        width: initial;
        flex-grow: 1;
        flex-shrink: 0;
        position: relative;
        left: -1px;
    }
    .table-clone {
        // position: absolute;
        z-index: 1;
        // z-index: 2;
        // top: 0px;
        // left: 0px;
        flex-grow: 0;
        flex-shrink: 0;
        &.corner {
            z-index: 2;
        }
        td, th {
            &:last-child {
                border-right: 1px solid #dadada;
            }
        }
    }
    .rel {
        position: relative;
    }
</style>
