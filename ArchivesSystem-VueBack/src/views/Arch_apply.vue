<template>
   <div id="testapp">
        <!-- 实现一个相互交流的功能
           下载那个excel导入数据库的命名模板，然后进行录入数据，之后进行提交材料审核，若通过则开始进行
        档案的录入，归档材料及包括要归档的哪些数据，比如图片材料，今年的会议等，添加的档案数据，详情见 归档材料范围
        ，当录入数据后，这里只是一个初步的审核模块，提交一些需要归档的范围，看看是否合理即可，之后当录入数据后还需要审核档案的状态
(1)归档是否齐全，保管期限划分是否准确

(2)装订方式及材料是否符合档案保护要求

(3)分类是否科学、合理

(4)编号时有无重号、断号现象

(5)著录是否规范、准确

(6)归档文件整理说明的撰写是否规范

(7)装盒是否符合要求

不同年度、不同期限、不同机构不装同一盒 -->
        
         <el-steps :active="active" finish-status="success"  simple>
              <el-step title="填写" icon="el-icon-edit"></el-step>
              <el-step title="上传审核材料" icon="el-icon-upload"></el-step>
              <el-step :title=checkState   icon="el-icon-picture"></el-step>
              <el-step title="结束"   icon="el-icon-picture"></el-step>
         </el-steps>
        
        <div >
           <div class="div_two" >
                 <div class="one_step" v-if="active === 0"> 
                       <p>任务名称： <el-input  style="width:40%" clearable v-model="task_name"></el-input><p>
                       <p style="margin-left:28px">部门： <el-select   v-model="depart_name" placeholder="请选择所属部门">
                           <el-option
                                  v-for="item in DepartIdList"
                                 :label="item.department"
                                 :key="item.department"
                                 :value="item.department">
                               <span style="float: left">{{ item.department }}</span>
                              <span style="float: right; color: #8492a6; font-size: 14px">{{ item.department}}</span>
                             </el-option>

                           </el-select> 
                      </p>
                      <p style="margin-left:14px">创建人： <el-select   v-model="created_username" placeholder="请选择创建人">
                            <el-option
                                  v-for="item in DepartIdList"
                                 :label="item.username"
                                 :key="item.username"
                                 :value="item.username">
                               <span style="float: left">{{ item.username }}</span>
                              <span style="float: right; color: #8492a6; font-size: 14px">{{ item.username}}</span>
                             </el-option>
                           </el-select> 
                      </p>
                    <p style="margin-left:28px">邮箱： <el-input style="width:40%"  v-model="email"  clearable></el-input></p>
                 </div>

                 <div  class="check_file" v-if="active === 1"> 
                        <h2 style="color:blue;margin-left:22%">上传审核材料</h2>
                        <el-upload
                          class="upload-demo"
                          drag
                          action="http://localhost:8080/ArchivesSystem/apply-check/upload"
                          :before-upload="handleBefore"
                          :on-success="handleSuccess"
                          :data="paramData"
                          :limit="1"
                          multiple>
                          
                         <i class="el-icon-upload"></i>
                         <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                         <div class="el-upload__tip" slot="tip"><h3>已上传文件：{{oldFileName}}</h3></div>
                        </el-upload>
                 </div>

                 <div class="check_div"  v-if="active === 2"> 
                      
                     <el-card class="box-card" >
                         <div slot="header" class="clearfix">
                          <span><h2>{{checkState}}</h2></span>
                          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                        </div>
                    <div v-for="o in 1" :key="o" class="text item">
                       <p v-if="revise_comments">
                          审核意见：
                          <article class="markdown-body"   v-html="revise_comments" ></article>
                       </p>
                     </div>
                    </el-card>

                </div>
               
                <div class="over_div"  v-if="active === 3"> 
                      
                     <el-card class="box-card" >
                         <div slot="header" class="clearfix">
                          <img src="http://123.56.127.215/success.jpeg" class="image">
                          <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
                          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                        </div>
                       <h3><font color="#404dff">已成功激活相关权限！</font></h3>
                    </el-card>

                </div>

                <div  class="button_style">

                   <el-button class="button-one" type="primary"  v-if="active == 0 " @click="next()">下一步</el-button>
                   <el-button class="button-two" type="primary"  v-if="active == 1  || checkState == '不通过' && active == 1 || checkState == '不通过' && active==2 " @click="prev()">上一步</el-button>
                   
                </div>
           </div>
        </div>

   </div>
</template>

<script>

//import Hello from '../components/hello.vue' 
import Element from 'element-ui'
import "github-markdown-css/github-markdown.css"

export default{
   
   inject:['reload'],

   data(){ 
       return {
         DepartIdList:{},
         task_name: '',
         depart_name:'',
         created_username: '',
         email:'',
         oldFileName:'',  //文件名称
         checkState:'',  //审核状态
         revise_comments:'', //审核意见

         //上传文件的参数
         paramData:{
            id:'',  //表id 与 taskForm的id对应
         },

         active:'',

         taskForm: {
           id:'',  //设置表id，第二次更新的时候就这样，当然其他时候则另起记录
           taskName: '',
           departName:'',
           createdUsername: '',
           email:'',
           checkState:'',
         },
         
         Formrules: {
          task_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          depart_name: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],

         }

         };
     },
   methods: {
      //一开始进入这个页面的时候就查询，表中数据，看一下是否存在 审核中 状态的数据，若存在则直接添加到
      //跳转到审核中的页面
      isCheckState(){
            //获取现在时间 年月 
           
            var dateNow = new Date()
            var year = dateNow.getFullYear()
            var month = dateNow.getMonth()+1  //月份从 0 开始加1
            
            this.$axios.get(this.dbURL+'/apply-check/getcheckstate',{
            headers:{
                 "Authorization":localStorage.getItem("token")
                    }
            }).then(res=>{
               console.log("查看审核中数据")
               console.log(res)

               //若没有申请审核的数据，则直接开始即可
               if(res.data.data == "third_root" || res.data.data==="root")
               { 
                  this.checkState = "审核状态"
                  this.active = 0
               }

               var dateLocal = new Date(res.data.data.createdTime)
               var created_month = dateLocal.getMonth()+1
               var created_year = dateLocal.getFullYear();
               var lenth;  //月份的距离应该大于 6 lenth应该为 6这样才能重新申请
               
               

               if(created_month >= month)
               {
                  lenth = created_month - month
               }
               else{
                  lenth = month-created_month
               }
               

               if(res.data.data.checkState == "审核中")
               {  
                   this.taskForm.id = res.data.data.id
                   this.taskForm.taskName = res.data.data.taskName
                   this.taskForm.createdUsername = res.data.data.createdUsername
                   this.taskForm.email = res.data.data.email
                   this.taskForm.departName = res.data.data.departName
                  
                   this.task_name = res.data.data.taskName
                   this.depart_name = res.data.data.departName
                   this.created_username = res.data.data.createdUsername
                   this.email = res.data.data.email
                   this.oldFileName = res.data.data.oldfileName
                   
                   this.checkState = res.data.data.checkState
                  

                   this.active = 2
                   
               }
               else if(res.data.data.checkState == "不通过"){
                     
                   this.taskForm.id = res.data.data.id
                   this.taskForm.taskName = res.data.data.taskName
                   this.taskForm.createdUsername = res.data.data.createdUsername
                   this.taskForm.email = res.data.data.email
                   this.taskForm.departName = res.data.data.departName

                   this.task_name = res.data.data.taskName
                   this.depart_name = res.data.data.departName
                   this.created_username = res.data.data.createdUsername
                   this.email = res.data.data.email
                   this.oldFileName = res.data.data.oldfileName
                   
                   this.checkState = res.data.data.checkState
                   

                   //添加审核意见
                   this.revise_comments = res.data.data.reviseComments
                   //渲染审核意见
                   var MarkdownIt = require("markdown-it")
                   var md = new MarkdownIt()
                   var result = md.render(res.data.data.reviseComments)  //内容渲染
                   this.revise_comments = result

                   //添加不通过时的状态
                   this.taskForm.checkState = res.data.data.checkState

                  
                   this.active = 2
                   
               }  //审核成功了，且时间还处于6个月中，故还是执行这里，除非6个月已过，可以进行申请下条数据
                  //获取时间 年 月 即可，年份要等于今年，月份要大于   && created_year===year && lenth < 6
               else if(res.data.data.checkState == "审核成功" && created_year === year && lenth <= 6 ){
                     this.checkState = res.data.data.checkState
                     
                     this.active = 3
               }    //需要注意后端查询 条件 加上 待提交审核材料
               else if(res.data.data.checkState == "待提交审核材料")
               {
                   this.taskForm.id = res.data.data.id
                   this.taskForm.taskName = res.data.data.taskName
                   this.taskForm.createdUsername = res.data.data.createdUsername
                   this.taskForm.email = res.data.data.email
                   this.taskForm.departName = res.data.data.departName
                  
                   this.task_name = res.data.data.taskName
                   this.depart_name = res.data.data.departName
                   this.created_username = res.data.data.createdUsername
                   this.email = res.data.data.email

                   this.checkState = res.data.data.checkState

                   this.active = 0

               }
               else{
                    this.checkState = "审核状态"
                    this.active = 0
               }
              
          })
      },
                //获取到属于该管理员所管理的全宗号，即部门id,depart_id，当然也可以直接获取到部门名称即责任者
      getIdAndTitle(){   ///当点击新增加档案的时候就调用了该方法
          const _this = this
          this.$axios.get(this.dbURL+'/document/getIdAndName',{
            headers:{
                 "Authorization":localStorage.getItem("token")
                    }
          }).then(res=>{
              console.log("这里是获取全宗号与责任者的操作！！")
              console.log(res)
              this.DepartIdList = res.data.data
              
          })
      },    

      //下一步的操作
      next(){
         
         //var regex = "[a-zA-Z0-9_]{1,}[@][a-z0-9]{2,3}[.][a-z]{2,3}"
         this.taskForm.taskName = this.task_name
         this.taskForm.departName = this.depart_name
         this.taskForm.createdUsername = this.created_username
         this.taskForm.checkState = this.checkState  
         //alert(this.checkState)
         
         if(this.task_name == null )
         {
             Element.Message.warning("任务名不能为空！",{duration : 3*1000});
             return
         }
         if(this.taskForm.departName == null )
         {
             Element.Message.warning("部门不能为空！",{duration : 3*1000});
             return
         }
         if(this.taskForm.createdUsername == null )
         {
             Element.Message.warning("创建人不能为空！",{duration : 3*1000});
             return
         }
         
         if(this.email!=null)
         {  
            this.taskForm.email = this.email
         }
        
          if(this.task_name !=null && this.task_name !='' && this.created_username!=null &&
             this.created_username!='' && this.depart_name!=null && this.depart_name!='')
          {
              /* 进行判断邮箱 */
              /* 进行发送请求将数据填充到表中，且使用 saveOrupdate方法，或许用户会进行修改 */
             if(this.active == 0)
             {
               console.log("执行第一步的请求")
               
               this.$axios({
                   method:'GET',
                   url:this.dbURL+'/apply-check/addtask',
                   headers:{"Authorization":localStorage.getItem("token")},
                   params:this.taskForm,

               }).then(res=>{
                  console.log("提交任务成功，且返回数据")
                  //获取到返回来的表id值
                  console.log(res.data)
                  this.taskForm.id = res.data.data.id
                  this.checkState = res.data.data.checkState
                  console.log("更新了状态")
                  
               })
                
             }
             if(this.active == 1)
             {
               console.log("执行上传审核材料文件")
                
             }

             if(this.active++ > 2) 
                 this.active =0

          }

         // if(this.active++ > 2) 
         //    this.active =0 

      },
      prev(){
         --this.active

        if(this.active < 0) 
            this.active = 0
      }
      ,
      //上传前的回调函数
      handleBefore(){
           this.paramData.id = this.taskForm.id
           
      },
      //上传成功的回调函数
      handleSuccess(res){
         
         console.log(res.data)
         this.reload();
         
         //this.active = 2
      }



    },
   created(){
            this.getIdAndTitle()
            this.isCheckState()
    },
   components:{
       // Hello 
     }
}
</script>

<style>
       .div_two{
            margin-left: 29%;
            margin-top: 4%;
              
       } 


.one_step p{
   line-height: 45px;
}

.one_step .el-input__inner{
     width: 330px;
}

.button_style{
   margin-top: 1%;
   /* margin-left: 17%; */
}

.button_style .button-one{
      margin-left: 22%;  
} 
.button_style .button-two{
      margin-left: 27%;  
} 



 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card{
    position:relative;
    width: 590px;
    right:9%;

  }

  .check_file{
     margin-left: 4%;
  }

  .el-upload-dragger{
     width: 465px;
  }

  .image {
    width: 100%;
    display: block;
  }

</style>