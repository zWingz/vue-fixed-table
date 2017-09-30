import Vue from 'vue';
import app from './app';
import './style.css';
new Vue({
    render: h => h(app)
}).$mount('#app')
