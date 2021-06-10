<template>
    <div class='headerBar'>
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">档案管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                 
                 <!-- 私信 -->
                <!-- <div class="btn-private_contact">
                    <el-button  round>消息【包含，私信，通知，下拉】</el-button>
                </div> -->

                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->

                <!-- 用户头像 -->
                <div class="user-avator"><img src="../../assets/img/sea.jpeg"></div>
               
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <a href="http://blog.gdfengshuo.com/about/" target="_blank">
                            <el-dropdown-item>关于</el-dropdown-item>
                        </a> -->

                        <a href="" target="_blank">
                            <el-dropdown-item>交流中心</el-dropdown-item>
                        </a>

                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Event from '../../util/Event';

    export default {
        // 组建的名称
        title: '',
        name: 'headerBar',
        computed: {
            ...mapState({
                // showLoader: state => state.vux.showLoader,
            }),
            // username() {

            //     let username = localStorage.getItem('ms_username');
            //     return username ? username : this.name;
            // }
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
                fullscreen: false,
                name: 'hello',
                message: 2,
                isexcute: false,  //默认为false,表示token未失效的时候的退出

                username:'',
            }
        },
        // 初始化记载
        created() {
            this.getIdAndName();
        },
        // DOM加载完毕执行操作
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        },
        // 事件处理
        methods: {
             //获取用户的信息
             getIdAndName(){
              
        
        this.$axios(
            {
            method:'GET',
            url:this.dbURL+'/users/getUserName',
            headers:{"Authorization":localStorage.getItem("token")},
            //params:this.search_key,

           }).then(res=>{
                  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                  this.username = res.data.data.username;
                  
                  console.log(res)
          })


        },


            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {
                    //若命令等于loginout则执行退出操作
                    // localStorage.removeItem('ms_username')
                   
                    console.log("执行logout")
                    this.$axios.get(this.dbURL+"/users/logout",{
                        headers:{
                            "Authorization":localStorage.getItem("token")
                        }
                    }).then(res=>{
                        this.isexcute = true, //若执行了这里则为表示成功退出
                        this.$store.commit("REMOVE_INFO")  //清除信息
                        this.$router.push("/login") 
                    })
                    
                    if(!this.isexcute){
                     console.log("token已失效的情况，执行这里！")
                     this.$store.commit("REMOVE_INFO")  //清除信息
                     this.$router.push("/login")
                    } 
                    
                }
            },
            // 侧边栏折叠
            collapseChage() {
                let vue = this;
                vue.collapse = !vue.collapse;
                Event.$emit('collapse', vue.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        // 离开路由的操作
        destroyed() {
        }
    }
</script>

<style scoped lang='less'>
    .headerBar {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        //color: #fff;
        color: white;
        background-color: #242f42;
        //background-color:#c1d6eb;
        //background-color:#94c5f7 ;
        
        .collapse-btn {
            float: left;
            padding: 0 21px;
            cursor: pointer;
            line-height: 70px;
        }

        .logo {
            float: left;
            width: 250px;
            line-height: 70px;
        }

        .header-right {
            float: right;
            padding-right: 50px;
        }

        .header-user-con {
            display: flex;
            height: 70px;
            align-items: center;
        }

        .btn-fullscreen {
            transform: rotate(45deg);
            margin-right: 5px;
            font-size: 24px;
        }

        .btn-bell, .btn-fullscreen {
            position: relative;
            width: 30px;
            height: 30px;
            text-align: center;
            border-radius: 15px;
            cursor: pointer;
        }
         
        .btn-bell-badge {
            position: absolute;
            right: 0;
            top: -2px;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #f56c6c;
            color: #fff;
        }

        .btn-bell .el-icon-bell {
            color: #fff;
        }

        .user-name {
            margin-left: 10px;
            margin-top: 1%;
        }

        .user-avator {
            margin-left: 20px;

        }

        .user-avator img {
            display: block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .el-dropdown-link {
            color:white;
            cursor: pointer;
        }

        .el-dropdown-menu__item {
            text-align: center;
        }
    }


</style>
