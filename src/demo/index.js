import Vue from 'vue';
import app from './app';
import './style.scss';
new Vue({
    render: h => h(app)
}).$mount('#app')
