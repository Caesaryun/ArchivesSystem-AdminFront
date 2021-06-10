import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import "babel-polyfill";

/*
 * 定义常量
 */
let DOMAIN_NAME = ''
let SERVER_NAME = ''
let API_PREFIX = ''
/**
 * 开发环境和发布环境变量
 */
if (process.env.NODE_ENV === 'development') {
    DOMAIN_NAME = ''
    SERVER_NAME = ''
    API_PREFIX = ''
    console.log('开发环境')
} else {
    console.log('发布环境')
    DOMAIN_NAME = ''
    SERVER_NAME = ''
    API_PREFIX = ''
}
Vue.prototype.DOMAIN_NAME = DOMAIN_NAME
Vue.prototype.SERVER_NAME = SERVER_NAME
Vue.prototype.API_PREFIX = API_PREFIX
/**
 *  日志输出开关
 */
Vue.config.productionTip = false
/**
 *  点击延迟
 */
FastClick.attach(document.body)


/////////////

import baseapi from './globalconfig/baseapi'

//添加一个axios
import axios from 'axios'

Vue.prototype.$axios = axios 

//引入permission.js判断是否需要登录才能访问
import "./permission"

//引入axios.js

import "./axios"

//引入一个设置全局变量的vue
import isget from './views/Addarch.vue'
Vue.prototype.isgetmenu = isget.isgetmenu

//引入maven-editor编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import echarts from 'echarts'

Vue.prototype.$echarts = echarts


Vue.use(mavonEditor)


Vue.use(baseapi)

//java后端里面的还应该设置一个监测全局的GlobalException类


Vue.use(ElementUI, {size: 'small'});



new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')