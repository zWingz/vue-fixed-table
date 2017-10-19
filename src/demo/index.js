import Vue from 'vue';
import app from './app';
import './style.scss';
Vue.config.devtools = true;
new Vue({
    render: h => h(app)
}).$mount('#app')
