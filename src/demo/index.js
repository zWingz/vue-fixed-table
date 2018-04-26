import Vue from 'vue'
import app from './app'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style.scss'
import './markdown.scss'
Vue.config.devtools = true
Vue.use(ElementUI)
new Vue({
    render: h => h(app)
}).$mount('#app')
