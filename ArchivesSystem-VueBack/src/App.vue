<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
         
        <!--  1. 添加跳转页面后保持之前页面
              2. 去router/index.js中给需要被缓存的页面设置meta属性，不需要的视图不用添加 
              3. 在跳转到的页面设置beforeRouteLeave
              -->

             
    </div>
</template>
<script>
    export default {
        name: 'App',
        components: {},
        computed: {},
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                loading: true,
                isRouterAlive: true,
            }
        },
        created() {
        },
        methods: {
            reload() {
                let vue = this
                vue.isRouterAlive = false
                //在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
                vue.$nextTick(() => {
                    vue.isRouterAlive = true
                })
            }
        }
    }
</script>
<style>
    /*@import "./assets/css/main.css";*/
    @import "../node_modules/element-ui/lib/theme-chalk/index.css";
    @import "./assets/css/icon.less";
    @import "./assets/css/customize.ui.less";
    @import "./assets/css/base.less";
</style>

