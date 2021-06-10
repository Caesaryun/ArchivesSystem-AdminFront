<template>
   <div id="testapp">
    <!-- 文本的操作 -->
   <div>
       
       <el-input class="inputone" v-model="input" placeholder="部门名称"></el-input> &nbsp
       <el-button>查询</el-button>&nbsp<el-button  @click="dialogVisible=true;getAdminName()"  type="primary">新增</el-button>
          
         <el-dialog  title="新增立档部门" :visible.sync="dialogVisible" width="50%">
                  <el-form :rules="DepartRules"  :model="DepartForm" ref="DepartForm" label-width="110px">
               
                      <el-form-item label="部门名称" prop="department">
                           <el-input v-model="DepartForm.department"></el-input>
                      </el-form-item>
                      
                      <el-form-item label="全宗号" prop="departId" >
                           <el-input v-model="DepartForm.departId" placeholder="例：11258xx"></el-input>
                      </el-form-item>
                     <el-form-item label="管理员用户名" prop="username" >
                           <el-select v-model="DepartForm.username" placeholder="请选择">
                                 <el-option
                                  v-for="item in adminName"
                                 :label="item.nickname"
                                 :key="item.account"
                                 :value="item.account">
                               <span style="float: left">{{ item.nickname }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account}}</span>
                             </el-option>
                            </el-select>
                      </el-form-item>
                  </el-form>

                  <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false;resetForm('DepartForm')">取 消</el-button>
                     <el-button type="primary"  @click="addDepartment('DepartForm')">确定</el-button>
                  </span>  

         </el-dialog>
     
       </div>
 
<div class="block"> 

   <el-table  
    :data="tableData"
    border
    style="width: 100%" 
    ref="multipleTable"
    tooltip-effect="dark"
    >

    <el-table-column
      fixed
      prop="department"
      label="全宗号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="username"
      label="管理员用户名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="departId"
      label="全宗号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="boxNumber"
      label="档案盒数"
      width="120">
    </el-table-column>
    <el-table-column
      prop="dossierNumber"
      label="档案卷数"
      width="300">
    </el-table-column>
    <el-table-column
      prop="created"
      label="立档时间"
      width="120">
    </el-table-column>
   
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
       
        <el-button type="text" size="small">删除</el-button>


      </template>
    </el-table-column>
  </el-table>


 
  <el-pagination  class="mpage" 
    layout="prev, pager, next"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @current-change = "page"

    >

  </el-pagination>

   </div>

   </div>
</template>

<script>

//import Hello from '../components/hello.vue' 
import Element from 'element-ui'

 export default {

    methods: {
       getAdminName(){
          this.$axios.post(this.dbURL+"/department/getadmininfo",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
             console.log(res)
             this.adminName = res.data.data
             console.log(this.adminName[0].account)

          })
        },
         addDepartment(formName){
             console.log("这里是添加档案部门的操作")
             this.$refs[formName].validate((valid)=>{
               if(valid)
               {
                 
               //添加立档部门的操作
                this.$axios.post(this.dbURL+'/department/add_depart',this.DepartForm,{
                  "Authorization":localStorage.getItem("token")  //只有超级管理员方可有此功能操作
                }).then(res=>{
                       Element.Message.success("添加成功！",{duration : 3*1000});
                })

                 this.dialogVisible=false
               }
               else {

                Element.Message.error("输入异常！",{duration : 3*1000});
                
               }
             })
             
          },
               //将数据置空
       resetForm(formName) {
	        this.$refs[formName].resetFields();
	      },

         handleClick(row) 
         {
            console.log(row);
         },
         
      //查询全部立档部门的信息,这是只有超级管理员方可查询的信息，应该给予相应的token方可
      page(currentPage)
      {
          const _this = this
          this.$axios.get(this.dbURL+'/department/getdepart?currentpage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log(res)

              _this.tableData = res.data.data.records
              _this.currentPage = res.data.data.current
              _this.total = res.data.data.total
              _this.pageSize = res.data.data.size
             
          })
      }

    },
    created(){
        //页面一启动就调用方法page
        console.log("这里是page")
        this.page(1)
    },

    data() {
      return {
        tableData:{}, //这个即为档案部门的的信息
        currentPage:'',
        total:0,
        pageSize:1,
        visible: false,  //删除的提示框
        
        dialogVisible:false,
        DepartForm: {        //这里是新增档案部门,这个也是必不可少的不然无法显示
          department: '',
          departId:'',
          username:''
        },
        DepartRules:{
              department:[
                 { required: true, message: '请输入部门名称', trigger: 'blur' },
                 { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ],
              departId:[
                 { required: true, message: '请输入全宗号名称', trigger: 'blur' },
                 { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ],
              username:[
                 { required: true, message: '请选择管理员的用户名称', trigger: 'blur' },
                 { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ]  
        }
        ,
         adminName:{
            account:'',
            nickname:''
         },
        value: ''  //值



      }
    }
}
</script>

<style>
   .inputone{
       width:205px;
       margin-top:3px;
   }
    .mpage{
      margin: 0 auto;
      text-align: center;
  }

</style>