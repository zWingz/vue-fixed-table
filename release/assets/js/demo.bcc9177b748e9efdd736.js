webpackJsonp([1],{"+IeH":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("c/Tr"),l=s.n(i),r=s("51yV"),o=s.n(r),n=s("L/hj");const a=navigator.userAgent,c=/Firefox/.test(a),h=-1!==a.indexOf("Safari")&&-1===a.indexOf("Chrome");e.default={components:{scrollxbar:o.a},props:{offsetLeft:{type:[String,Number],default:0},offsetTop:{type:[String,Number],default:0},scrollTarget:{},useTrans:Boolean,selfScroll:{type:Boolean,default:!1}},data:()=>({clientRect:{top:0,left:0,right:0,bottom:0},targetOffset:{top:0,left:0},fixed:{top:!1,left:!1,right:!1},resizeObserver:void 0,hoverObserver:void 0,tbodyWidth:0,tleftWidth:0,tRightWidth:0,topChanging:!1,leftChanging:!1,opacity:1,scrolling:!1,iframe:{}}),computed:{theadStyle(){return{transform:`translate3d(0px, ${this.fixed.top&&!this.topChanging?-this.clientRect.top:0}px, 1px)`}},bodyStyle(){return{width:this.tbodyWidth+"px"}},leftStyle(){return{transform:`translate3d(${this.fixed.left&&!this.leftChanging?this.offsetLeft-this.clientRect.left:0}px, 0px, 0px)`,width:"initial",opacity:this.offsetLeft-this.clientRect.left>this.tleftWidth?this.opacity:1}},rightStyle(){return{transform:`translate3d(${this.leftChanging?0:-this.clientRect.right}px, 0px, 0px)`,width:"initial",opacity:this.opacity}},cornerStyle(){return{transform:`translate3d(0px, ${this.fixed.top&&!this.topChanging?-this.clientRect.top:0}px, 1px)`}},containerStyle(){return{zIndex:this.scrolling?"1":""}},scroller(){if(!this.scrollTarget)return window;let t;if(t="string"==typeof this.scrollTarget?document.querySelector(this.scrollTarget):this.scrollTarget){const e=Object(n.e)(t,"position");"absolute"!==e&&"fixed"!==e&&(t.style.position="relative")}return this.getTargetOffsetParent(this.$refs.content,t),t},xScroller(){return this.$refs.content},isFixLeft(){return!!this.$slots.leftThead},isFixRight(){return!!this.$slots.rightThead},isTransition(){return c||h||this.useTrans}},mounted(){this.resizeObserver=new MutationObserver(this.observerHandle),this.init()},activated(){window.setTimeout(()=>{this.init(),l()(document.querySelectorAll("tbody tr.hover")).forEach(t=>{t.classList.remove("hover")})},0)},deactivated(){this.destroyed()},beforeDestroy(){this.clientRect={top:0,left:0,right:0},this.destroyed()},methods:{init(){this.scroller.addEventListener("scroll",this.scrollHandle,!1),this.scroller.addEventListener("mousewheel",this.scrollerMouseWheel,!1),this.selfScroll&&(this.xScroller.addEventListener("mousewheel",this.xScrollerMouseWheel,!1),this.xScroller.addEventListener("scroll",this.scrollHandle,!1)),this.selfScroll||this.scrollTarget?this.iframe=Object(n.a)(this.$refs.content,this.resizeHandel):window.addEventListener("resize",this.resizeHandel,!1),this.resizeObserver.observe(this.$refs.content,{childList:!0,subtree:!0,characterData:!0}),(this.isFixLeft||this.isFixRight)&&(this.$el.addEventListener("mouseover",this.mouseOver,!1),this.$el.addEventListener("mouseout",this.mouseLeave,!1)),this.update()},destroyed(){this.scroller.removeEventListener("scroll",this.scrollHandle),this.scroller.removeEventListener("mousewheel",this.scrollerMouseWheel),this.selfScroll&&(this.xScroller.removeEventListener("mousewheel",this.xScrollerMouseWheel),this.xScroller.removeEventListener("scroll",this.scrollHandle)),(this.isFixLeft||this.isFixRight)&&(this.$el.removeEventListener("mouseover",this.mouseOver),this.$el.removeEventListener("mouseout",this.mouseLeave)),this.resizeObserver.disconnect(),(this.selfScroll||this.scrollTarget)&&(this.iframe.removeEventListener("resize",this.resizeHandel),this.iframe.remove()),window.removeEventListener("resize",this.resizeHandel)},hoverClass(t,e){const s=t.target.closest("tr");if(!s)return;const i=s.rowIndex,l=Object(n.f)(`tbody tr:nth-child(${i})`,this.$el);0!==l.length&&l.forEach(t=>{t.classList[e]("hover")})},mouseOver(t){this.hoverClass(t,"add")},mouseLeave(t){this.hoverClass(t,"remove")},getTargetOffsetParent(t,e){let s=t.offsetTop,i=t.offsetLeft;for(t=t.parentElement;t&&t!==e;)s+=t.offsetTop,i+=t.offsetLeft,t=t.parentElement;this.targetOffset.left=i,this.targetOffset.top=s},getPointOffsetParent(){const t=this.targetOffset.left,e=this.targetOffset.top;let s=-this.scroller.clientWidth+this.tleftWidth+this.$refs.tbody.clientWidth+this.tRightWidth-this.scroller.scrollLeft;return s<=0&&(s=0),{top:e-(this.scrollTarget?this.scroller.scrollTop:Object(n.d)()),left:t-(this.scrollTarget?this.scroller.scrollLeft:Object(n.c)()),right:s}},scrollPositionInit(){const{left:t,top:e}=this.clientRect;this.selfScroll?this.$nextTick(()=>{this.$refs.content.scrollLeft=-this.clientRect.left}):this.scrollTarget?this.$nextTick(()=>{this.scroller.scrollLeft=-t,this.scroller.scrollTop=-e}):scrollTo(t+this.tleftWidth,e)},scrollerMouseWheel(t){const e=t.target.closest(".scroll-container");if(e!==this.$refs.content&&e!==document.body)return;t.preventDefault();let s;(s=this.scrollTarget?this.scroller:document.scrollingElement).scrollTop+=t.deltaY,s.scrollLeft-=t.deltaX},xScrollerMouseWheel(t){t.preventDefault(),this.xScroller.scrollLeft+=t.deltaX},setScrollIng:Object(n.g)(function(){this.scrolling=!1},250),scrollHandle(){if(this.scrolling=!0,this.setScrollIng(),this.selfScroll){const t=this.$refs.content,{top:e}=this.$refs.tbody.getBoundingClientRect(),s=-t.scrollLeft;let i=this.tleftWidth+this.$refs.tbody.clientWidth+this.tRightWidth-t.clientWidth+s;i=i<0?0:i,this.clientRect={top:e,left:s,right:i,bottom:0}}else if(this.scrollTarget){const t=this.getPointOffsetParent();this.clientRect={top:t.top,left:t.left,right:t.right,bottom:0}}else{const{top:t,left:e,bottom:s,right:i}=this.$refs.tbody.getBoundingClientRect();let l=window.innerWidth-(i+this.tRightWidth);l>0&&(l=0),this.clientRect={top:t,left:e-this.tleftWidth,bottom:s,right:-l}}},observerHandle:Object(n.g)(function(){this.update()},0),resizeHandel:Object(n.g)(function(){this.update(),this.opacity=1},0,function(){this.opacity=0}),update(){this._isDestroyed||(this.isFixLeft&&this.$refs.leftClone&&(this.tleftWidth=this.$refs.leftClone.clientWidth),this.isFixRight&&this.$refs.rightClone&&(this.tRightWidth=this.$refs.rightClone.clientWidth),this.$refs.content&&(this.tbodyWidth=this.$refs.content.clientWidth-this.tleftWidth-this.tRightWidth),this.$nextTick(()=>{this.scrollHandle()}))},transitionTop:Object(n.g)(function(){this.topChanging=!1},0),transitionLeft:Object(n.g)(function(){this.leftChanging=!1},0)},watch:{offsetLeft(t){setTimeout(()=>{this.scrollHandle()},250)},"clientRect.top":function(t,e){this.fixed.top=t<0,t<0&&this.isTransition&&(this.topChanging=!0,this.transitionTop())},"clientRect.left":function(t){this.fixed.left=t<this.offsetLeft,t<0&&this.isTransition&&(this.leftChanging=!0,this.transitionLeft())}}}},"2lNz":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("5tFE"),l=s.n(i),r=s("lPb5"),o=s.n(r);e.default={components:{FixedTable:l.a,AlignCell:o.a},props:{data:Object},computed:{leftThead(){return this.data.thead.slice(0,2)},thead(){return this.data.thead.slice(0,-5)},rightThead(){return this.data.thead.slice(-2)},tbody(){return this.data.tbody}}}},"51yV":function(t,e,s){var i=s("VU/8")(s("z7y6"),s("Rn/j"),function(t){s("liTV")},null,null);t.exports=i.exports},"5tFE":function(t,e,s){var i=s("VU/8")(s("+IeH"),s("qcqz"),function(t){s("qn0E")},null,null);t.exports=i.exports},"7did":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("exGp"),l=s.n(i),r=s("eNIl"),o=s.n(r),n=s("mtWM"),a=s.n(n);e.default={components:{demo:o.a},data:()=>({data:{thead:[],tbody:[]},index:1,load:!1}),mounted(){this.getData()},methods:{getData(){var t=this;return l()(function*(){const e=yield a.a.post("https://www.easy-mock.com/mock/59e8918c21a50c465d91d78f/tableMock/list");t.data=e.data.data,t.load=!0})()}},watch:{index(){this.load=!1,setTimeout(()=>{this.load=!0},250)}}}},"A+uo":function(t,e,s){var i=s("VU/8")(s("7did"),s("zThj"),null,null,null);t.exports=i.exports},"CxC/":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("7+uW"),l=s("A+uo"),r=s.n(l),o=s("zL8q"),n=s.n(o),a=s("tvR6"),c=(s.n(a),s("Job/"));s.n(c);i.default.config.devtools=!0,i.default.use(n.a),new i.default({render:t=>t(r.a)}).$mount("#app")},ITKQ:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("exGp"),l=s.n(i),r=s("L/hj");e.default={name:"AlignCell",props:{dir:{type:String,default:"l"},tag:{type:String,default:"td"},noSyncTh:{type:Boolean,default:!1}},data:()=>({observer:void 0}),mounted(){var t=this;return l()(function*(){t.calc(),t.observer=new MutationObserver(t.calc),t.observer.observe(t.$refs.span,{childList:!0,subtree:!0,characterData:!0})})()},destroyed(){this.observer.disconnect()},methods:{calc(){const t=this.$el.offsetParent;if(!t)return;const e=this.$el.cellIndex+1,s=t.querySelectorAll(`.align-cell:nth-child(${e})>span>span`);this.$nextTick(()=>{Object(r.b)(s)})}},computed:{hasDom(){return this.$slots.default}}}},"Job/":function(t,e){},"L/hj":function(t,e,s){"use strict";e.d=function(){return document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop},e.c=function(){return document.documentElement.scrollLeft||window.pageXOffset||document.body.scrollLeft},e.b=function(t,e){let s;s="string"==typeof t?document.querySelectorAll(t):t;let i=0;(s=Array.prototype.slice.call(s,0)).forEach(t=>{const e=t.offsetWidth;e>i&&(i=e)}),s.forEach(t=>{t.parentNode.style.width=i+"px"})},e.a=function(t,e){const s=document.createElement("object");return s.setAttribute("style","position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;"),s.onload=(()=>{s.contentDocument.defaultView.addEventListener("resize",e,!1)}),s.type="text/html",t.appendChild(s),s.data="about:blank",s},e.g=function(t,e,s){let i=null;const r=e||200;return function(e){var o=this;i&&window.clearTimeout(i),s&&s.call(this),i=window.setTimeout(l()(function*(){yield t.call(o,e),i=null}),r)}},e.f=function(t,e){e||document;const s=e.querySelectorAll(t);return Array.prototype.slice.call(s,0)};var i=s("exGp"),l=s.n(i);e.e=function(t,e){if(!t||!e)return null;"float"===e&&(e="cssFloat");try{const s=document.defaultView.getComputedStyle(t,"");return t.style[e]||s?s[e]:null}catch(s){return t.style[e]}}},"Rn/j":function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"show",rawName:"v-show",value:t.bottom>5&&t.virtualPercent<1,expression:"bottom > 5 && virtualPercent < 1"}],ref:"scroller",staticClass:"virtual-scroll overhidden",style:t.style},[s("div",{ref:"bar",staticClass:"virtual-scroll-bar",style:t.barLeft})])},staticRenderFns:[]}},S99R:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("FixedTable",t._b({},"FixedTable",t.$attrs,!1),[s("tr",{attrs:{slot:"leftThead"},slot:"leftThead"},t._l(t.leftThead,function(e){return s("AlignCell",{key:e,attrs:{tag:"th"}},[t._v(t._s(e))])})),s("tr",{attrs:{slot:"thead"},slot:"thead"},t._l(t.thead,function(e){return s("AlignCell",{key:e,attrs:{tag:"th"}},[t._v(t._s(e))])})),s("tr",{attrs:{slot:"rightThead"},slot:"rightThead"},t._l(t.rightThead,function(e){return s("AlignCell",{key:e,attrs:{tag:"th"}},[t._v(t._s(e))])})),t._l(t.tbody,function(e,i){return[s("tr",{key:i,attrs:{slot:"leftBody"},slot:"leftBody"},t._l(e.td.slice(0,2),function(e){return s("AlignCell",{key:e},[t._v(t._s(e))])})),s("tr",{key:i,attrs:{slot:"tbody"},slot:"tbody"},t._l(e.td.slice(0,-5),function(e){return s("AlignCell",{key:e},[t._v(t._s(e))])})),s("tr",{key:i,attrs:{slot:"rightBody"},slot:"rightBody"},t._l(e.td.slice(-2),function(e){return s("AlignCell",{key:e},[t._v(t._s(e))])}))]})],2)},staticRenderFns:[]}},T6ph:function(t,e){},bHJs:function(t,e){},eNIl:function(t,e,s){var i=s("VU/8")(s("2lNz"),s("S99R"),function(t){s("T6ph")},null,null);t.exports=i.exports},lPb5:function(t,e,s){var i=s("VU/8")(s("ITKQ"),s("qJON"),function(t){s("bHJs")},null,null);t.exports=i.exports},liTV:function(t,e){},qJON:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s(t.tag,t._g(t._b({tag:"component",staticClass:"align-cell"},"component",t.$attrs,!1),t.$listeners),[s("span",{class:"align-cell-"+t.dir},[s("span",{ref:"span"},[t._t("default")],2)])])},staticRenderFns:[]}},qcqz:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"rel"},[s("div",{ref:"content",staticClass:"fixed-table-container",class:{"scroll-container":t.selfScroll},style:t.containerStyle},[s("div",{staticClass:"flex"},[t.isFixLeft?s("table",{ref:"leftClone",staticClass:"fixed-table table-clone left",style:t.leftStyle},[s("thead",{staticClass:"fixed-table corner",class:[{fixed:t.fixed.top}],style:t.cornerStyle},[t._t("leftThead")],2),s("tbody",[t._t("leftBody")],2)]):t._e(),s("table",{ref:"tbody",staticClass:"fixed-table  flex-grow",style:t.bodyStyle},[s("thead",{ref:"thead",class:[{fixed:t.fixed.top}],style:t.theadStyle},[t._t("thead")],2),s("tbody",[t._t("tbody")],2)]),t.isFixRight?s("table",{ref:"rightClone",staticClass:"fixed-table table-clone right",style:t.rightStyle},[s("thead",{staticClass:"fixed-table corner",class:[{fixed:t.fixed.top}],style:t.cornerStyle},[t._t("rightThead")],2),s("tbody",[t._t("rightBody")],2)]):t._e()])]),t.selfScroll?s("scrollxbar"):t._e()],1)},staticRenderFns:[]}},qn0E:function(t,e){},tvR6:function(t,e){},z7y6:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("exGp"),l=s.n(i),r=s("L/hj");e.default={data:()=>({scrollWidth:0,scrollLeft:0,virtualPercent:0,virtualMouseDownX:0,virtualObserver:{},bar:{},target:{},opacity:!1,bottom:0,iframe:{}}),computed:{barLeft(){let t=this.scrollLeft*this.virtualPercent;return isNaN(t)&&(t=0),{transform:`translate3d(${t}px, 0px, 0px)`,width:100*this.virtualPercent+"%"}},style(){return{transform:`translate3d(0px, ${-this.bottom}px, 0px)`,opacity:this.opacity?0:1}}},mounted(){this.bar=this.$refs.bar,this.target=this.$el.previousElementSibling,this.virtualObserver=new MutationObserver(this.refreshScroll),this.virtualObserver.observe(this.target,{childList:!0,characterData:!0,subtree:!0}),this.bar.addEventListener("mousedown",this.barMouseDownHandle,!1),this.windowScrollHandle(),["scroll","resize"].forEach(t=>{window.addEventListener(t,this.windowScrollHandle,!1)}),this.target.addEventListener("scroll",this.targetScrollHandle,!1),this.iframe=Object(r.a)(this.target,this.refreshScroll)},activated(){var t=this;return l()(function*(){yield t.$nextTick(),t.target.scrollLeft=t.scrollLeft,t.windowScrollHandle()})()},destroyed(){this.target.removeEventListener("scroll",this.targetScrollHandle),this.bar.removeEventListener("mousedown",this.barMouseDownHandle),["scroll","resize"].forEach(t=>{window.removeEventListener(t,this.windowScrollHandle)}),this.iframe.removeEventListener("resize",this.refreshScroll),this.iframe.remove(),this.virtualObserver.disconnect()},methods:{setOpacityShow:Object(r.g)(function(){this.opacity=!1},100),windowScrollHandle:Object(r.g)(l()(function*(){const{bottom:t}=this.target.getBoundingClientRect();let e=t-document.documentElement.clientHeight;e<0&&(e=0),this.bottom=e,this.setOpacityShow()}),100,function(){this.opacity=!0}),targetScrollHandle(){this.scrollLeft=this.target.scrollLeft},refreshScroll:Object(r.g)(function(){this._isDestroyed||(this.scrollWidth=this.target.scrollWidth-(this.target.offsetWidth||this.target.clientWidth),(this.scrollLeft>this.scrollWidth||0===this.scrollWidth)&&(this.scrollLeft=0),this.virtualPercent=this.target.offsetWidth/this.target.scrollWidth,this.windowScrollHandle(),this.targetScrollHandle())},100,function(){this.opacity=!0}),barMouseDownHandle(t){0===t.button&&(this.virtualMouseDownX=t.pageX,document.body.addEventListener("mousemove",this.mousemoveHandle,!1),document.body.classList.add("no-select"),document.body.addEventListener("mouseup",this.bodyMouseUpHandle,!1))},mousemoveHandle(t){const e=t.pageX-this.virtualMouseDownX,s=e/this.virtualPercent;e>0?this.up(s):this.down(-s),this.virtualMouseDownX=t.pageX},bodyMouseUpHandle(){document.body.removeEventListener("mousemove",this.mousemoveHandle,!1),document.body.removeEventListener("mouseup",this.bodyMouseUpHandle,!1),document.body.classList.remove("no-select")},down(t){this.scrollLeft=this.scrollLeft-t>0?this.scrollLeft-t:0},up(t){this.scrollLeft=this.scrollLeft+t>this.scrollWidth?this.scrollWidth:this.scrollLeft+t}},watch:{scrollLeft:function(t){this.target.scrollLeft=t}}}},zThj:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("section",{staticClass:"main-container",class:{full:2===t.index,"width-full":3===t.index}},[s("div",{staticClass:"sidebar"},[s("div",{staticClass:"menu-container"},[s("div",{staticClass:"root-menu",class:{active:1===t.index},on:{click:function(e){t.index=1}}},[s("div",{staticClass:"menu-title"},[t._v("\n                    表格一\n                ")])]),s("div",{staticClass:"root-menu",class:{active:2===t.index},on:{click:function(e){t.index=2}}},[s("div",{staticClass:"menu-title"},[t._v("\n                    表格二\n                ")])]),s("div",{staticClass:"root-menu",class:{active:3===t.index},on:{click:function(e){t.index=3}}},[s("div",{staticClass:"menu-title"},[t._v("\n                    表格三\n                ")])])])]),s("div",{staticClass:"main-wraper"},[s("div",{staticClass:"view"},[1===t.index?s("div",{staticClass:"view-title"},[t._v("\n                表格一:全局滚动.滚动时固定顶部/左侧/右侧\n            ")]):t._e(),2===t.index?s("div",{staticClass:"view-title"},[t._v("\n                表格二:容器内局部滚动,滚动时在容器内固定顶部/左侧/右侧\n            ")]):t._e(),3===t.index?s("div",{staticClass:"view-title"},[t._v("\n                表格三:高度跟随全局,宽度自适应且x轴滚动. 出现虚拟x滚动条.解决滚动条太下无法拖动问题.同时固定顶部/左侧/右侧\n            ")]):t._e(),s("div",{directives:[{name:"loading",rawName:"v-loading",value:!t.load,expression:"!load"}],staticClass:"view-content"},[t.load?[1===t.index?s("demo",{attrs:{data:t.data,offsetLeft:200}}):t._e(),2===t.index?s("div",{staticClass:"scroll-container border",attrs:{id:"scroll"}},[s("demo",{attrs:{data:t.data,scrollTarget:"#scroll"}})],1):t._e(),3===t.index?s("demo",{attrs:{data:t.data,"self-scroll":""}}):t._e()]:t._e()],2)])])])},staticRenderFns:[]}}},["CxC/"]);