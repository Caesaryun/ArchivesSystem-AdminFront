<template>
   <div id="testapp">
    
   <div>
       
       <el-input class="inputone"  @keyup.enter.native="getallkey"    v-model="search"  placeholder="用户名"></el-input> &nbsp
       <el-button  @click="getallkey()" >查询</el-button>&nbsp<el-button  @click="dialogVisible=true;getAdminName()"  type="primary">新增</el-button>
          
         <el-dialog  title="新增大众用户" :visible.sync="dialogVisible" width="50%">
                  <el-form :rules="DepartRules"  :model="DepartForm" ref="DepartForm" label-width="150px">
               
                      <el-form-item label="用户名称" prop="department">
                           <el-input style="width:70%" v-model="DepartForm.department"></el-input>
                      </el-form-item>
                      
                      <el-form-item label="密码" prop="departId" >
                           <el-input  style="width:70%" v-model="DepartForm.departId" placeholder="例：11258xx"></el-input>
                      </el-form-item>
                    
                    

                  </el-form>

                  <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false;resetForm('DepartForm')">关闭</el-button>
                     <el-button type="primary"  @click="addDepartment('DepartForm')">确定</el-button>
                  </span>  

         </el-dialog>
       
            <el-dialog  title="修改" :visible.sync="distriVisible" width="50%">
                  <el-form :rules="DepartRules"  :model="DepartForm" ref="DepartForm" label-width="150px">
               
                      <el-form-item label="用户名称" prop="department">
                           <el-input style="width:70%" v-model="DepartForm.department"></el-input>
                      </el-form-item>
                      
                      <el-form-item label="密码" prop="departId" >
                           <el-input  style="width:70%" v-model="DepartForm.departId" placeholder="例：11258xx"></el-input>
                      </el-form-item>
                    
                    

                  </el-form>

                  <span slot="footer" class="dialog-footer">
                     <el-button @click="distriVisible = false;resetForm('DepartForm')">关闭</el-button>
                     <el-button type="primary"  @click="addDepartment('DepartForm')">确定</el-button>
                  </span>  

         </el-dialog>
       
         
        
     
       </div>
 
<div class="block"> 

   <el-table  
    :data="tableData"
    border
    style="width: 100%" >

    <el-table-column
      fixed
      prop="id"
      label="编号"
      width="150">
    </el-table-column>
    
    <el-table-column
      prop="username"
      label="用户名"
      width="170">
    </el-table-column>

    <el-table-column
      prop="phone"
      label="电话"
      width="160">
    </el-table-column>

    <el-table-column
      prop="email"
      label="邮箱"
      width="170">
    </el-table-column>

    <el-table-column
      prop="age"
      label="年龄"
      width="170">
    </el-table-column>
 
    
    <el-table-column
      align="right"
      label="操作"
      width="350"
      >
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="searchTwo"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
       
      <template slot-scope="scope">
      <el-button  @click="handleClick(scope.row)" type="primary" size="mini">修改</el-button>
        
      <el-button  @click="deleteDepartment(scope.row)" type="danger" size="mini">删除</el-button>
        

      </template>

    </el-table-column>
  </el-table>


 
  <!-- <el-pagination  
     class="mpage" 
    layout="prev, pager, next"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @current-change = page
    >
  </el-pagination> -->
   
       <el-pagination
	    class="mpage"
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

    inject:['reload'],

    methods: {

     getallkey(){
        //alert("搜索数据，键入数据，从后端搜索")

        this.$axios.post(this.dbURL+"/common-users/getallkey?key="+this.search,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
             console.log("search data>>>>>>>>>>>>")
             console.log(res)
              
              this.tableData = res.data.data.records
              this.currentPage = res.data.data.current
              this.total = res.data.data.total
              this.pageSize = res.data.data.size
       
          })
          
     },

      
      //删除该部门的信息
      deleteDepartment(row){

         this.$confirm('此操作将永久删除该大众用户 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
           this.$axios.get(this.dbURL+'/common-users/deleteCommonUser?id='+row.id,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log(res)

            this.reload();  //调用刷新方法

            this.$message({
            type: 'success',
            message: '删除成功!'
          });

          });

          
        }).catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        
      },

       //分配管理员
       distriAdmin(){
            // alert(this.department_id)
            // alert(this.adminUserName)
           var adminL = Object.keys(this.adminUserName).length
          if(adminL===0)
          {
              Element.Message.warning("需要选择用户名！",{duration : 3*1000});
              return
          }

          this.$axios.post(this.dbURL+"/department/modifyDepart?departId="+this.department_id+"&admin="+this.adminUserName,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
                Element.Message.success("分配成功！",{duration : 3*1000});
                this.reload();
                
          })


            
       },


       getAdminForDistri(){  //管理员数据
          
          this.$axios.post(this.dbURL+"/department/getfordis",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
             console.log("获取待分配的管理员数据.......")
             console.log(res)
             //this.adminarray
             //将对象转为数组的操作
        
            for(let i in res.data.data)
            {  
               this.adminarray[i] = res.data.data[i].account
            }
            


          })

       },

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
            
             this.$refs[formName].validate((valid)=>{
               if(valid)
               {
                 
               //添加立档部门的操作
                this.$axios.post(this.dbURL+'/department/add_depart',this.DepartForm,{
                  headers:{
                            "Authorization":localStorage.getItem("token")
                         }
                }).then(res=>{
					   console.log(res.data.data)
					   if(res.data.data === 1)
					   {
						   Element.Message.success("添加成功！",{duration : 3*1000});
               this.DepartForm  = {};
					   }
					   else{
						   Element.Message.error("添加失败，部门名称或全宗号重复！或无权限！",{duration : 3*1000});
					   }
					   
                })

                 //this.dialogVisible=false
               }
               else {

                Element.Message.error("输入异常！",{duration : 3*1000});
                
               }
             })
             
          },
               //将数据置空
       resetForm(formName) {
	           //this.$refs[formName].resetFields();
	      },

         handleClick(row) 
         {  
            this.distriVisible = true; 
            // this.getAdminForDistri();
            console.log(row);
           // this.department_id = row.id
            
         },
         
      //查询全部立档部门的信息,这是只有超级管理员方可查询的信息，应该给予相应的token方可
      page(currentPage)
      {
          const _this = this
          this.$axios.get(this.dbURL+'/common-users/getCommon?currentpage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
             console.log("common user  ******************************")
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
        this.getAdminForDistri();

    },

    data() {
      return {

      
      search: '',
      searchTwo:'',

      //为部门分配管理员的修改
      distriVisible:false,
      department_id:'',  //部门的id，唯一编号
      adminUserName:'',  //管理员的用户名
      adminarray:[],

		 //添加了新的
		 inputDepart:'',
		 //
		  
        tableData:{}, //这个即为档案部门的的信息
        currentPage:1,
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

 .el-dialog__header {
  background: #ecf5ff;

}


 .el-dialog__body{
  background-color: #eef1e9 !important;
}

 .el-dialog__footer {
  background-color: #fafaf6 !important;
}

</style>