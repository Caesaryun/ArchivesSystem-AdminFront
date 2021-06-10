<template>
   <div id="testapp">
    
   <div>
       
       <el-input class="inputone" v-model="inputDepart" placeholder="部门名称"></el-input> &nbsp
       <el-button>查询</el-button>&nbsp<el-button  @click="dialogVisible=true;getAdminName()"  type="primary">新增</el-button>
          
         <el-dialog  title="新增立档部门" :visible.sync="dialogVisible" width="50%">
                  <el-form :rules="DepartRules"  :model="DepartForm" ref="DepartForm" label-width="150px">
               
                      <el-form-item label="部门名称" prop="department">
                           <el-input style="width:70%" v-model="DepartForm.department"></el-input>
                      </el-form-item>
                      
                      <el-form-item label="全宗号" prop="departId" >
                           <el-input  style="width:70%" v-model="DepartForm.departId" placeholder="例：11258xx"></el-input>
                      </el-form-item>
                    
                     <el-form-item  label="管理员用户名" prop="username" >
                           <el-select  style="width:70%" v-model="DepartForm.username" placeholder="请选择">
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
                     <el-button @click="dialogVisible = false;resetForm('DepartForm')">关闭</el-button>
                     <el-button type="primary"  @click="addDepartment('DepartForm')">确定</el-button>
                  </span>  

         </el-dialog>

          <!--  分配一个管理员给暂时空缺的即完成了修改 -->
          <el-dialog  title="分配管理员" :visible.sync="distriVisible" width="50%">
               
                 
                   <el-select v-model="adminUserName" placeholder="请选择">
                                 <el-option
                                  v-for="item in adminarray"
                                 :label="item"
                                 :key="item"
                                 :value="item">
                               <span style="float: left">{{ item }}</span>
                             
                             </el-option>
                            </el-select>
                
                 <span slot="footer" class="dialog-footer">
                     <el-button @click="distriVisible = false;resetForm()">取 消</el-button>
                     <el-button type="primary"  @click="distriAdmin()">确 定</el-button>
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
      prop="department"
      label="部门名称"
      width="150">
    </el-table-column>
    
    <el-table-column
      prop="departId"
      label="全宗号"
      width="120">
    </el-table-column>

    <el-table-column
      prop="username"
      label="管理员用户名"
      width="120">
    </el-table-column>

    <el-table-column
      prop="boxNumber"
      label="档案盒数"
      width="150">
    </el-table-column>
    <el-table-column
      prop="dossierNumber"
      label="档案卷数"
      width="160">
    </el-table-column>
    <el-table-column
      prop="created"
      label="立档时间"
      show-overflow-tooltip
      width="160">
    </el-table-column>
   
    <el-table-column
      fixed="right"
      label="操作"
      width="200">

      <template slot-scope="scope">
        <!-- v-if="scope.row.username === '暂时空缺' " -->
        <el-button    @click="handleClick(scope.row)" type="success" size="mini">修改</el-button>
        
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
       //搜索表格中数据....
       

      
      //删除该部门的信息
      deleteDepartment(row){

         this.$confirm('此操作将永久删除部门信息及其所有数字档案信息 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
           this.$axios.get(this.dbURL+'/department/deleteDepartment?departId='+row.id,{
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
             console.log("这里是添加档案部门的操作")
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
            this.department_id = row.id
            
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
             console.log("department ******************************")
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