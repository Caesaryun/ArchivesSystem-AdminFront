<template>
    <div class='navBar'>
         <!-- element-ui里面的一个组件 navmenu里面 -->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items" >
                
                <template v-if="item.subs">
                    <el-submenu :index="item.indexid" :key="item.indexid">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.indexid" :key="subItem.indexid">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.indexid">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.indexid" :key="subItem.indexid">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>

                 <!-- 将index修改为了indexid -->
                <template v-else>
                    <el-menu-item :index="item.indexid" :key="item.indexid"   >
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>

            </template>
        </el-menu>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Event from '../../util/Event';


    export default {
        // 组建的名称
        title: '',
        name: 'navBar',
        computed: {     //这里直接进行计算变化
            ...mapState({
                // showLoader: state => state.vux.showLoader,
            }),
            onRoutes() {
                return this.$route.path.replace('/', '');
            }

        },
        /**
         * 子组建传值
         * objData: {
         *   type: Object,
         *   default: () => ({ })
         * }
         * arrData: {
         *   type: Array,
         *   twoWay: true,
         *   default: []
         * }
         */
        props: {},
        // 组建刷新
        inject: ['reload'],
        // 挂在组建
        components: {},

        data() {
            return {
                collapse: false,

                 items:{}
                   //[
            //         {
            //             icon: 'el-icon-lx-home',
            //             index: 'test',
            //             title: '系统首页',
            //         },
            //         {
            //             icon: 'el-icon-lx-cascades',
            //             index: 'department',
            //             title: '归档部门管理',
            //         },
            //         {
            //             icon: 'el-icon-lx-copy',
            //             index: 'tabs',
            //             title: '档案管理',
            //         },
            //         {
            //             icon: 'el-icon-lx-calendar',
            //             index: '3',
            //             title: '表单相关',
            //             subs: [    //这就是子级菜单
            //                 {
            //                     index: 'form',
            //                     title: '基本表单'
            //                 },
            //                 {
            //                     index: '3-2',
            //                     title: '三级菜单',
            //                     subs: [
            //                         {
            //                             index: 'editor',
            //                             title: '富文本编辑器'
            //                         },
            //                         {
            //                             index: 'markdown',
            //                             title: 'markdown编辑器'
            //                         },
            //                     ]
            //                 },
            //                 {
            //                     index: 'upload',
            //                     title: '文件上传'
            //                 }
            //             ]
            //         },
            //         {
            //             icon: 'el-icon-lx-emoji',
            //             index: 'icon.less',
            //             title: '自定义图标'
            //         },
            //         {
            //             icon: 'el-icon-lx-favor',
            //             index: 'charts',
            //             title: 'schart图表'
            //         },
            //         {
            //             icon: 'el-icon-rank',
            //             index: '6',
            //             title: '拖拽组件',
            //             subs: [
            //                 {
            //                     index: 'drag',
            //                     title: '拖拽列表',
            //                 },
            //                 {
            //                     index: 'dialog',
            //                     title: '拖拽弹框',
            //                 }
            //             ]
            //         },
            //         {
            //             icon: 'el-icon-lx-warn',
            //             index: '7',
            //             title: '错误处理',
            //             subs: [
            //                 {
            //                     index: 'permission',
            //                     title: '权限测试'
            //                 },
            //                 {
            //                     index: '404',
            //                     title: '404页面'
            //                 }
            //             ]
            //         }
            //     ]
             }
        },
        // 初始化记载
        created() {
           
            console.log("输出 collapse : ")
            console.log(this.collapse)

            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            Event.$on('collapse', msg => {
                this.collapse = msg;
            })
         //1.首先初始化菜单表
          console.log("初始化菜单表")

           if(localStorage.getItem("isgetmenu")==0)
           {    
                console.log("第一次初始化菜单：执行这里....")

                this.initmenu();  //执行一次的初始化操作
                const ismenu = 1
                this.$store.commit("SET_ISGETMENU",ismenu);
           }
           else if(localStorage.getItem("isgetmenu")==1)
           {   //执行这里从session中获取到数据
               this.items = this.$store.getters.getMenu
               //写一个方法来进行对数据进行处理
               console.log("第二次执行这里，从store中获取数据...")

            //    this.items[0].subs = JSON.parse(this.items[0].subs)
            //    this.items[3].subs = JSON.parse(this.items[3].subs)
              // console.log(this.items)
            // this.items[2].subs = JSON.parse(this.items[2].subs)
              for(let i in this.items)
              {   
                  if(this.items[i].parent_id == 1)
                  {  //为1表示有 subs
                       console.log("存在数据subs")
                       this.items[i].subs = JSON.parse(this.items[i].subs)
                 }

              }
             

           }
          

        },
        // DOM加载完毕执行操作
        mounted() {
            

        },
        // 事件处理
        methods: {
             //1.首先初始化菜单表方法
             initmenu(){
                 this.$axios.get(this.dbURL+'/menu/initmenu',{
                     headers:{
                             "Authorization":localStorage.getItem("token")
                             }
                 }).then(res=>{
                     //将数据存到相应的localstorage中
                     //这里的items就直接从本地的获取即可，将其设置在created中，每次都直接从本地内存中中获取即可
                     //initmenu方法就只执行一次即可
                     const menuInfo = res.data.data
                     this.$store.commit("SET_MENUINFO",menuInfo)
                     console.log("输出subs:")

                     this.items = res.data.data

                     console.log(this.items)

                     
                      //从json格式进行转换,
                     for(let i in this.items)
                      {
                       if(this.items[i].parent_id == 1)
                       {  //为1表示有 subs
                       console.log("存在数据")
                       this.items[i].subs = JSON.parse(this.items[i].subs)
                       console.log(this.items[i].subs)
                       }
                        
                      }


                 })
             }
                ///直接将角色规定死，无法改变角色，所有的角色的权限都将其设置好，
                        //所以后面进行添加用户时直接给出角色即可，就不提供所谓添加用户角色的功能
                         //这样的话就直接若有多个角色，就直接选择用roleid最小的即为权限最大的那个角色即可
                         //这样就直接给出这个角色的菜单表即可，总的来说就是不再创建角色的操作，
                         //还有一个操作就是，直接执行一次临时表操作，且执行一次查询操作后得到数据后
                         //就直接保存在localstorage中，待退出后就直接清除，且保证每次
                         //临时表的操作仅是一次即可
           ///下一个方法

               
        },
        // 离开路由的操作
        destroyed() {
        }
    }
</script>

<style scoped lang='less'>
    .navBar {
        ul {
            height: 100%;
        }

        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;

        .sidebar::-webkit-scrollbar {
            width: 0;
        }

        .sidebar-el-menu:not(.el-menu--collapse) {
            width: 250px;
        }

        .sidebar > ul {
            height: 100%;
        }
    }
</style>
