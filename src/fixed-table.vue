<template>
    <div class='fixed-table-container' :style='containerStyle'>
         <table v-if='$slots.fixleft' ref='leftClone' class='fixed-table table-clone left fixed-table-opacity' :style='leftStyle'> 
            <thead v-if='$slots.fixCorner' class='fixed-table corner fixed-table-opacity' :style='cornerStyle'>
                <slot name='fixCorner'></slot>
            </thead> 
             <slot name='fixleft'></slot>
         </table> 
         <!-- <table ref='thead' class='fixed-table top'> -->
         </table> 
        <table ref='tbody' class='fixed-table'>
             <thead  ref='thead' :style='theadStyle' class='fixed-table-opacity'>
                <slot name='thead'></slot>
             </thead>
            <slot name='tbody'></slot>
        </table>
    </div>
</template>

<script>
const userAgent = navigator.userAgent;
const isMoz = /Firefox/.test(userAgent)
export default {
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
        useOpacity: Boolean
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
            tdWidthArray: [], // 存放表格中td和th的宽度
            tdLeftWidthArray: [], // 存放左侧固定蓝表格的td和td宽度
            container: {
                paddingTop: 0
            },
            tbodyWidth: 'initial', // 表格宽度
            tleftWidth: 'initial', // 左侧表格宽度,
            topChange: false,
            leftChange: false,
            topChangeTimer: undefined,
            leftChangeTimer: undefined,
            updateTimer: undefined,
            scrollTimer: undefined,
            scrolling: false
        }
    },
    computed: {
        theadStyle() {
            return {
                transform: `translate3d(0px, ${this.fixed.top ? -this.clientRect.top : 0}px, 0px)`,
                width: this.tbodyWidth,
                // left: this.tleftWidth,
                opacity: this.topChange ? '0' : '1'
                // position: 'sticky'
            }
        },
        tbodyStyle() {
            return {
                width: this.tbodyWidth,
                marginTop: '-1px'
            }
        },
        leftStyle() {
            return {
                transform: `translate3d(${this.fixed.left ? this.offsetLeft - this.clientRect.left : 0}px, 0px, 0px)`,
                width: this.tleftWidth,
                // top: this.container.paddingTop + 'px',
                opacity: this.leftChange ? '0' : '1'
            }
        },
        cornerStyle() {
            return {
                transform: `translate3d(0px, ${this.fixed.top ? -this.clientRect.top : 0}px, 0px)`,
                // width: this.tleftWidth,
                opacity: (this.topChange || this.leftChange) ? '0' : '1'
                // position: 'sticky'
            }
        },
        containerStyle() {
            return {
                // paddingTop: this.container.paddingTop + 'px',
                paddingLeft: this.tleftWidth,
                zIndex: this.scrolling ? '9999' : ''
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
            result && result.classList.add('scroll-container')
            this.getTargetOffsetParent(this.$refs.tbody, result);
            return result
        }
    },
    mounted() {
        this.scroller.addEventListener('scroll', this.scrollHandle);
        window.addEventListener('resize', this.resizeHandel)
        this.resizeObserver = new MutationObserver(this.update)
        this.resizeObserver.observe(this.$refs.tbody, {
            childList: true,
            subtree: true
        })
        if(this.$slots.fixleft) {
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
        window.removeEventListener('resize', this.resizeHandel)
        // this.observer.disconnect();
    },
    methods: {
        addHoverHandle() {
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
                top: top - (this.scrollTarget ? this.scroller.scrollTop : window.getScrollTop()),
                left: left - (this.scrollTarget ? this.scroller.scrollLeft : window.getScrollLeft())
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
                window.scrollTo(left + parseInt(this.tleftWidth, 0), top + this.container.paddingTop)
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
            if(!this.scrollTarget) {
                const { top, left, bottom, right } = this.$refs.tbody.getBoundingClientRect()
                // console.log(left, this.tleftWidth)
                this.clientRect = {
                    top: top - this.container.paddingTop,
                    left: left - parseInt(this.tleftWidth, 0),
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
            }, 500)
        },
        update() {
            // this.tbodyWidth = 'initial';
            // this.tleftWidth = 'initial';
            // setTimeout(() => {
            this.$nextTick(() => {
                // const isThLen = this.$refs.thead.offsetWidth > this.$refs.tbody.offsetWidth;
                // console.log(isThLen)
                const tds = this.$refs.tbody.querySelector('tr').querySelectorAll('td');
                const ths = this.$refs.thead.querySelectorAll('th')
                if(this.$slots.fixleft) {
                    // const leftTds = this.$refs.leftClone.querySelector('tr').querySelectorAll('td')
                    // const corner = this.$refs.leftCorner.querySelectorAll('th')
                    // leftTds.forEach((each, index) => {
                    //     const thWidth = corner[index].offsetWidth;
                    //     const tdWidth = each.offsetWidth;
                    //     this.tdLeftWidthArray.push(Math.max(tdWidth, thWidth))
                    // })
                    this.tleftWidth = this.$refs.leftClone.offsetWidth + 'px'
                    console.log(this.$refs.leftClone.offsetWidth)
                    // this.tleftWidth = this.tdLeftWidthArray.reduce((sum, each) => sum + each, 0) + 1 + 'px'
                }
                // this.tdWidthArray = [];
                // this.tdLeftWidthArray = [];
                // const width = Math.max(this.$el.offsetWidth - parseInt(this.tleftWidth, 0), this.$refs.thead.offsetWidth, this.$refs.tbody.offsetWidth)
                // console.log(this.$el.offsetWidth - parseInt(this.tleftWidth, 0), this.$refs.thead.offsetWidth, this.$refs.tbody.offsetWidth, width)
                // this.tbodyWidth = width + 'px';
                // console.log(this.$refs.thead.offsetWidth)
                // const thsWidth = Array.from(ths).reduce((sum, each) => (sum + each.offsetWidth), 0)
                // const tdsWidth = Array.from(tds).reduce((sum, each) => (sum + each.offsetWidth), 0)
                // const isThLen = thsWidth > tdsWidth;
                // tds.forEach((each, index) => {
                //     const thWidth = ths[index].offsetWidth;
                //     const tdWidth = each.offsetWidth;
                //     this.tdWidthArray.push(isThLen ? thWidth : tdWidth)
                // })
                // this.syncWidth();
            })
        },
        syncWidth() {
            // this.$refs.thead.querySelectorAll('th').forEach((each, index) => {
            //     each.style.width = this.tdWidthArray[index] + 'px'
            // })
            // this.$refs.tbody.querySelectorAll('tr').forEach(tr => {
            //     tr.querySelectorAll('td').forEach((td, index) => {
            //         td.style.width = this.tdWidthArray[index] + 'px'
            //     })
            // })
            // 同步left和corner
            // if(this.$slots.fixleft) {
            //     this.$refs.leftCorner.querySelectorAll('th').forEach((each, index) => {
            //         each.style.width = this.tdLeftWidthArray[index] + 'px'
            //     })
            //     this.$refs.leftClone.querySelectorAll('tr').forEach(tr => {
            //         tr.querySelectorAll('td').forEach((td, index) => {
            //             td.style.width = this.tdLeftWidthArray[index] + 'px'
            //         })
            //     })
            // }
            // this.container.paddingTop = this.$refs.thead.querySelector('tr').offsetHeight
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
                if(this.topChangeTimer) {
                    clearTimeout(this.topChangeTimer)
                    this.topChangeTimer = undefined
                }
                this.topChange = true;
                this.topChangeTimer = setTimeout(() => {
                    this.topChange = false;
                }, 100)
            }
        },
        'clientRect.left': function(val) {
            this.fixed.left = val < this.offsetLeft;
            if(val < 0 && (isMoz || this.useOpacity)) {
                if(this.leftChangeTimer) {
                    clearTimeout(this.leftChangeTimer)
                    this.leftChangeTimer = undefined
                }
                this.leftChange = true;
                this.leftChangeTimer = setTimeout(() => {
                    this.leftChange = false;
                }, 200)
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
    }
    .fixed-table-opacity {
        // transition: opacity .2s ease;
    }
    .table-clone {
        position: absolute;
        z-index: 1;
        // z-index: 2;
        top: 0px;
        left: 0px;
        &.corner {
            z-index: 2;
        }
    }
</style>
