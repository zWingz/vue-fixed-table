<template>
    <div class='rel'>
        <div class='fixed-table-container' :style='containerStyle' ref='content' :class='{"scroll-container": selfScroll}'>
            <div class='flex'>
                <table v-if='isFixLeft' ref='leftClone' class='fixed-table table-clone left' :class='addTransitionClass' :style='leftStyle'> 
                    <thead class='fixed-table corner' :style='cornerStyle' :class='[{fixed: fixed.top}, addTransitionClass]'>
                        <slot name='leftThead'></slot>
                    </thead> 
                    <tbody>
                        <slot name='leftBody'></slot>
                    </tbody>
                </table> 
                <table ref='tbody' class='fixed-table  flex-grow' :style='bodyStyle'>
                    <thead  ref='thead' :style='theadStyle' :class='[{fixed: fixed.top}, addTransitionClass]'>
                        <slot name='thead'></slot>
                    </thead>
                    <tbody>
                        <slot name='tbody'></slot>
                    </tbody>
                </table>
                <!-- <div v-if='$slots.rightBody && (selfScroll || scrollTarget)' class='flex-no-shrink' :style='{width: tRightWidth + "px", height: "1px"}'></div> -->
                <table v-if='isFixRight' ref='rightClone' class='fixed-table table-clone right' :class='addTransitionClass' :style='rightStyle'> 
                    <thead class='fixed-table corner' :style='cornerStyle' :class='[{fixed: fixed.top}, addTransitionClass]'>
                        <slot name='rightThead'></slot>
                    </thead> 
                    <tbody>
                        <slot name='rightBody'></slot>
                    </tbody>
                </table>
            </div>
        </div>
        <scrollxbar v-if='selfScroll'></scrollxbar>
    </div>
</template>

<script>
    import scrollxbar from './scroll-x-bar';
    import {
        getStyle,
        getScrollTop,
        getScrollLeft,
        addResizeEventListener
    } from './utils';
    const userAgent = navigator.userAgent;
    const isMoz = /Firefox/.test(userAgent);
    const isSafari = userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1
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
                // container: {
                //     paddingTop: 0
                // },
                tbodyWidth: 0, // 表格宽度
                tleftWidth: 0, // 左侧表格宽度,
                tRightWidth: 0, // 右侧表格宽度,
                topChange: false,
                leftChange: false,
                topChangeTimer: undefined,
                leftChangeTimer: undefined,
                updateTimer: undefined,
                scrollTimer: undefined,
                scrolling: false,
                iframe: {}
            };
        },
        computed: {
            theadStyle() {
                return {
                    transform: `translate3d(0px, ${this.fixed.top && !this.topChange
                        ? -this.clientRect.top
                        : 0}px, 1px)`
                    // opacity: this.topChange ? '0' : '1'
                };
            },
            bodyStyle() {
                return {
                    // marginLeft: '-1px',
                    width: this.tbodyWidth - (this.isFixLeft ? 1 : 0) + 'px',
                    position: 'relative',
                    left: '-1px'
                };
            },
            leftStyle() {
                return {
                    transform: `translate3d(${this.fixed.left && !this.leftChange
                        ? this.offsetLeft - this.clientRect.left
                        : 0}px, 0px, 0px)`,
                    width: 'initial'
                    // opacity: this.leftChange ? '0' : '1'
                };
            },
            rightStyle() {
                const base = {
                    transform: `translate3d(${this.leftChange
                        ? 0
                        : -this.clientRect.right}px, 0px, 0px)`,
                    width: 'initial'
                    // opacity: this.leftChange ? '0' : '1'
                };
                return base;
            },
            cornerStyle() {
                return {
                    transform: `translate3d(0px, ${this.fixed.top && !this.topChange
                        ? -this.clientRect.top
                        : 0}px, 1px)`
                    // opacity: (this.topChange || this.leftChange) ? '0' : '1'
                };
            },
            containerStyle() {
                return {
                    zIndex: this.scrolling ? '1' : ''
                };
            },
            scroller() {
                if(!this.scrollTarget) {
                    return window;
                }
                let result;
                if(typeof this.scrollTarget === 'string') {
                    result = document.querySelector(this.scrollTarget);
                } else {
                    result = this.scrollTarget;
                }
                if(result) {
                    const pos = getStyle(result, 'position');
                    if(pos !== 'absolute' && pos !== 'fixed') {
                        result.style.position = 'relative';
                    }
                }
                this.getTargetOffsetParent(this.$refs.content, result);
                return result;
            },
            xScroller() {
                return this.$refs.content;
            },
            isFixLeft() {
                return !!this.$slots.leftBody;
            },
            isFixRight() {
                return !!this.$slots.rightBody;
            },
            isTransition() {
                return isMoz || this.useTrans;
            },
            addTransitionClass() {
                return this.isTransition && !(this.leftChange || this.topChange)
                    ? 'fixed-table-transition'
                    : '';
            }
        },
        mounted() {
            this.resizeObserver = new MutationObserver(this.resizeHandel);
            this.init();
        },
        activated() {
            window.setTimeout(() => {
                this.init();
                Array.from(
                    document.querySelectorAll('tbody tr.hover')
                ).forEach(each => {
                    each.classList.remove('hover');
                });
            }, 0);
        },
        deactivated() {
            this.destroyed();
        },
        beforeDestroy() {
            this.clientRect = {
                top: 0,
                left: 0,
                right: 0
            };
            this.destroyed();
        },
        methods: {
            init() {
                this.scroller.addEventListener('scroll', this.scrollHandle, false);
                if(this.selfScroll) {
                    this.xScroller.addEventListener(
                        'scroll',
                        this.scrollHandle,
                        false
                    );
                }
                if(this.selfScroll || this.scrollTarget) {
                    this.iframe = addResizeEventListener(
                        this.$refs.content,
                        this.resizeHandel
                    );
                } else {
                    window.addEventListener('resize', this.resizeHandel, false)
                }
                this.resizeObserver.observe(this.$refs.content, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                if(this.isFixLeft || this.isFixRight) {
                    this.$el.addEventListener('mouseover', this.mouseOver, false);
                    this.$el.addEventListener('mouseout', this.mouseLeave, false);
                }
                this.update();
            },
            destroyed() {
                this.scroller.removeEventListener('scroll', this.scrollHandle);
                if(this.selfScroll) {
                    this.xScroller.removeEventListener('scroll', this.scrollHandle);
                }
                if(this.isFixLeft || this.isFixRight) {
                    this.$el.removeEventListener('mouseover', this.mouseOver);
                    this.$el.removeEventListener('mouseout', this.mouseLeave);
                }
                this.resizeObserver.disconnect();
                if(this.selfScroll || this.scrollTarget) {
                    this.iframe.removeEventListener('resize', this.resizeHandel);
                    this.iframe.remove();
                }
                window.removeEventListener('resize', this.resizeHandel)
            },
            hoverClass(e, type) {
                const tr = e.target.closest('tr');
                if(!tr) {
                    return;
                }
                const idx = tr.rowIndex;
                const trs = this.$el.querySelectorAll(`tbody tr:nth-child(${idx})`);
                trs.forEach(each => {
                    each.classList[type]('hover');
                });
            },
            mouseOver(e) {
                this.hoverClass(e, 'add');
            },
            mouseLeave(e) {
                this.hoverClass(e, 'remove');
            },
            getTargetOffsetParent(dom, parent) {
                let top = dom.offsetTop;
                let left = dom.offsetLeft;
                dom = dom.parentElement;
                while(dom && dom !== parent) {
                    top += dom.offsetTop;
                    left += dom.offsetLeft;
                    dom = dom.parentElement;
                }
                this.targetOffset.left = left;
                this.targetOffset.top = top;
            },
            getPointOffsetParent() {
                const left = this.targetOffset.left;
                const top = this.targetOffset.top;
                let right = -this.scroller.clientWidth + this.tleftWidth + this.$refs.tbody.clientWidth + this.tRightWidth * 2 - this.scroller.scrollLeft;
                if(right <= this.tRightWidth) {
                    right = this.tRightWidth
                }
                return {
                    top:
                        top -
                        (this.scrollTarget
                            ? this.scroller.scrollTop
                            : getScrollTop()),
                    left:
                        left -
                        (this.scrollTarget
                            ? this.scroller.scrollLeft
                            : getScrollLeft()),
                    right
                };
            },
            scrollPositionInit() {
                const { left, top } = this.clientRect;
                if(this.selfScroll) {
                    this.$nextTick(() => {
                        this.$refs.content.scrollLeft = -this.clientRect.left;
                    });
                } else if(this.scrollTarget) {
                    this.$nextTick(() => {
                        this.scroller.scrollLeft = -left;
                        this.scroller.scrollTop = -top;
                    });
                } else {
                    scrollTo(left + this.tleftWidth, top);
                }
            },
            scrollHandle() {
                if(this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                }
                this.scrolling = true;
                this.scrollTimer = setTimeout(() => {
                    this.scrolling = false;
                    this.scrollTimer = undefined;
                }, 250);
                if(this.selfScroll) {
                    const content = this.$refs.content;
                    const { top } = this.$refs.tbody.getBoundingClientRect();
                    const left = -content.scrollLeft;
                    // const length =
                    //     this.tleftWidth +
                    //     this.$refs.tbody.clientWidth +
                    //     this.tRightWidth * 2;
                    // const right = length - content.clientWidth + left;
                    const length =
                        this.tleftWidth +
                        this.$refs.tbody.offsetWidth +
                        this.tRightWidth;
                    // const right = length - content.offsetWidth + left;
                    let right = length - content.offsetWidth + left;
                    // console.log('tleft', this.tleftWidth);
                    // console.log('tbody', this.$refs.tbody.clientWidth);
                    // console.log('tRight', this.tRightWidth);
                    // console.log('content', content.clientWidth);
                    // console.log('left', left);
                    // console.log('right', right)
                    right = right < 0 ? 0 : right;
                    this.clientRect = {
                        top: top,
                        left,
                        right,
                        bottom: 0
                    };
                } else if(!this.scrollTarget) {
                    const {
                        top,
                        left,
                        bottom,
                        right
                    } = this.$refs.tbody.getBoundingClientRect();
                    // const right = this.$refs.rightClone.getBoundingClientRect().left - window.innerWidth
                    let r = window.innerWidth - (right + this.tRightWidth)
                    if(r > 0) {
                        r = 0
                    }
                    this.clientRect = {
                        top: top,
                        left: left - this.tleftWidth,
                        bottom,
                        right: -r
                    };
                } else {
                    const point = this.getPointOffsetParent();
                    this.clientRect = {
                        top: point.top,
                        left: point.left,
                        right: point.right,
                        bottom: 0
                    };
                }
            },
            resizeHandel() {
                if(this.updateTimer) {
                    clearTimeout(this._isDestroyed);
                }
                this.updateTimer = setTimeout(() => {
                    this.update();
                    this.updateTimer = undefined;
                }, 200);
            },
            update() {
                if(this._isDestroyed) {
                    return;
                }
                if(this.isFixLeft && this.$refs.leftClone) {
                    this.tleftWidth = this.$refs.leftClone.clientWidth;
                }
                if(this.isFixRight && this.$refs.rightClone) {
                    this.tRightWidth = this.$refs.rightClone.clientWidth;
                }
                if(this.$refs.content) {
                    this.tbodyWidth =
                        this.$refs.content.clientWidth -
                        this.tleftWidth -
                        this.tRightWidth;
                }
                this.$nextTick(() => {
                    this.scrollHandle();
                });
            },
            transitionFixed(key) {
                const timer = this[key + 'Timer'];
                if(timer) {
                    clearTimeout(timer);
                    this[key + 'Timer'] = undefined;
                }
                this[key] = true;
                this[key + 'Timer'] = setTimeout(() => {
                    this[key] = false;
                }, 250);
            }
        },
        watch: {
            offsetLeft(val) {
                setTimeout(() => {
                    this.scrollHandle();
                }, 250);
            },
            'clientRect.top': function(val, old) {
                this.fixed.top = val < 0;
                if(val < 0 && this.isTransition) {
                    this.transitionFixed('topChange');
                }
            },
            'clientRect.left': function(val) {
                this.fixed.left = val < this.offsetLeft;
                if(val < 0 && this.isTransition) {
                    this.transitionFixed('leftChange');
                }
            }
        }
    };
</script>

<style lang='scss'>
    .fixed-table-container {
        position: relative;
        z-index: 1;
        transform: translate3d(0, 0, 0);
        display: flex;
        border-right: 1px solid #dadada;
        border-left: 1px solid #dadada;
    }
    .fixed-table {
        border-spacing: 0px;
        border-collapse: separate;
        transform-style: preserve-3d;
        th,
        td {
            border-bottom-color: transparent;
            border-right-color: transparent;
        }
        tbody tr:last-child {
            td {
                border-bottom-color: #dadada;
            }
        }
        thead.fixed {
            td,
            th {
                border-bottom-color: #dadada;
            }
        }
    }
    .fixed-table-transition {
        transition: transform .4s ease-in-out;
    }
    .table-clone {
            // position: absolute;
            z-index: 1;
            &.corner {
                z-index: 2;
            }
            &.left {
                td, th {
                    &:last-child {
                        border-right: 1px solid #dadada;
                    }
                    &:first-child {
                        border-left: none;
                    }
                }
            }
            &.right {
                // position: absolute;
                td, th {
                    &:first-child {
                        border-left: 1px solid #dadada;
                    }
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
