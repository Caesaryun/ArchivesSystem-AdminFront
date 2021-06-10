<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
               
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/BG.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{username}}</div>
                            <!-- <div>管理员</div> -->
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：12:00<span></span></div>
                    <div class="user-info-list">上次登录地点：大连<span></span></div>
                </el-card>
               

<!--               
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>
                    Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    CSS
                    <el-progress :percentage="3.7"></el-progress>
                    HTML
                    <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
                </el-card> -->


            </el-col>

            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <!-- <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col> -->

                    <!-- <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col> -->

                    <!-- <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col> -->


                </el-row>
                
                <el-card shadow="hover" style="height:249px;margin-top:-2.2%;">
                   
                   <div class="time-line-div">
                    <!-- <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">
                                    {{scope.row.title}}
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>

                    </el-table> -->
             
                
            <el-timeline>
    
    
    <el-timeline-item timestamp="2020/6/1" placement="top">
      <el-card style="width:94%;background-color:rgba(240, 226, 199,0.9)">
        <h4>Tom 新增了67条档案</h4>
        <p>Tom 提交于 2020/6/1 20:46</p>
      </el-card>
    </el-timeline-item>


    <el-timeline-item timestamp="2020/5/16" placement="top">
      <el-card  style="width:94%;background-color:rgba(240, 226, 199,0.9)">
        <h4>Tom 新增了55条档案</h4>
        <p>Tom 提交于 2020/5/16 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2020/5/12" placement="top">
      <el-card  style="width:94%;background-color:rgba(240, 226, 199,0.9)">
        <h4>WangYun 新增了30条档案</h4>
        <p>WangYun 提交于 2020/5/12 20:46</p>
      </el-card>
    </el-timeline-item>
   
    <el-timeline-item timestamp="2020/4/15" placement="top">
      <el-card  style="width:94%;background-color:rgba(240, 226, 199,0.9)">
        <h4>Tom 新增了20条档案</h4>
        <p>Tom 提交于 2020/4/15 20:46</p>
      </el-card>
    </el-timeline-item>
     
     <el-timeline-item timestamp="2020/4/10" placement="top">
      <el-card  style="width:94%;background-color:rgba(240, 226, 199,0.9)">
        <h4>WangYun 新增了100条档案</h4>
        <p>WangYun 提交于 2020/4/10 20:46</p>
      </el-card>
    </el-timeline-item>

  </el-timeline>

                   </div>

                </el-card>


            </el-col>
        </el-row>

        <el-row :gutter="20">
            
            <el-col :span="12" style="width:35%">
                <el-card shadow="hover">
                    <div id="myChart" :style="{width: '300px', height: '374px'}"></div>
                </el-card>
            </el-col>

            <el-col :span="12" style="width:65%">
                <el-card shadow="hover">
                 <h3>进行系统广播</h3>
                 <br>
                 <mavon-editor v-model="systemMessage"></mavon-editor>
                 <br>
                 <el-button type="primary" icon="el-icon-circle-check"  @click="systemSend()">点击发送</el-button>
                </el-card>
            </el-col>


        </el-row>
          
         <el-row :gutter="20">
            
            <el-col :span="12">
                <el-card shadow="hover">
                    
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card shadow="hover">
                
                </el-card>
            </el-col>


        </el-row>


    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import Event from '../../util/Event';
    
    import Element from 'element-ui'


    export default {
        name: 'dashboard',
        data() {
            return {
                systemMessage:'',

                username:'',

                 archdata:[],
                 departmentdata:[],

                
                name: localStorage.getItem('ms_username'),
                todoList: [{
                    title: '今天要修复100个bug',
                    status: false,
                },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }, {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: true,
                    }
                ],
                data: [{
                    name: '2018/09/04',
                    value: 1083
                },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
                options: {
                    title: '最近七天每天的用户访问量',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: '最近七天用户访问趋势',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        mounted(){
            this.drawLine();  //数据变动这里即会改变
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created() {
            this.handleListener();
            this.changeDate();

            this.getarchData();  //获取档案最新数据
            
            this.username = this.$store.getters.getUser.username;

        },
        activated() {
            this.handleListener();
        },
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            Event.$off('collapse', this.handleBus);
        },
        methods: {
             //系统消息
             systemSend(){
               
             this.$axios.get(this.dbURL+"/common-borrow/socket?message="+this.systemMessage,{
               headers:{
               "Authorization":localStorage.getItem("token")
                }
              }).then(res=>{

               console.log("返回系统消息的操作......")
               console.log(res)
               if(res.data.code === 401)
               {
                   Element.Message.warning("不具有该操作权限！",{duration : 3*1000});
               }
               else{
                   Element.Message.success("已成功发送广播消息！",{duration : 3*1000});
               }

            })
        },


             load () {
                       this.count += 2
               },
           //
           getarchData(){
           
         this.$axios.post(this.dbURL+"/common-users/getarchdata",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log("获取档案记录条数...")
            console.log(res)

            for(var i=0;i<res.data.size;i++)
            {
                this.archdata[i] = res.data.archdata[i]
                
            }
            
            for(var i=0;i<res.data.size;i++)
            {
                this.departmentdata[i] =  res.data.department[i]
                
            }
            
            this.drawLine();  //要在这里重新再次调用函数方可
            
          
          })


        },
         
         //画图
        drawLine(){
                console.log("画图....")
              
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                //绘制图表
                myChart.setOption({
                    title:{text:'实时档案数量'},
                    tooltip:{},
                    xAxis:{
                          data:this.departmentdata
                    },

                    yAxis:{},
                
                series: [{
                name: '数量',
                type: 'bar',
                //data: [5, 20, 36, 10, 10, 20]
                data:this.archdata
            }]

                });

           },  


            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                })
            },
            handleListener() {
                Event.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg) {
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart() {
                // this.$refs.bar.renderChart();
                // this.$refs.line.renderChart();
				
				
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }
       
    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }
   



    .user-info-cont div:first-child {
        font-size: 25px;
        color: #409EFF;
        /* margin-left: -7%; */
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

   .time-line-div{
       height:190px;
       overflow: auto;
   }
</style>
