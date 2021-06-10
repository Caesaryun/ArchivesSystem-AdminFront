<template>
   <div id="testapp">
    
   <div>
       
       <el-input class="inputone" v-model="inputadmin" placeholder="部门名称"></el-input> &nbsp
       <el-button>查询</el-button>&nbsp<el-button  @click="dialogVisible=true"  type="primary">新增</el-button>
          
         <el-dialog class="dialog-admin" title="新增管理员" :visible.sync="dialogVisible" width="50%">
                 
                  <el-form  :model="adminForm" ref="adminForm" label-width="129px">
               
                      <el-form-item label="用户名" prop="username">
                           <el-input style="width:70%" placeholder="登录账号" v-model="adminForm.username"></el-input>
                      </el-form-item>
                    

                     <el-form-item label="所属部门" prop="department" >
                           <el-select  style="width:70%"  clearable  v-model="adminForm.department" placeholder="请选择">
                                 <el-option
                                  v-for="item in departmentList"
                                  :key="item"
                                  :label="item"
                                  :value="item">
                                <span style="float: left">{{ item }}</span>
                                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item}}</span> -->
                             </el-option>
                            </el-select>
                      </el-form-item>

                         <el-form-item label="密码" prop="password" >
                           <el-input style="width:70%" v-model="adminForm.password" placeholder=""></el-input>
                         </el-form-item>

                          <el-form-item label="手机号" prop="phone" >
                           <el-input style="width:70%" v-model="adminForm.phone" placeholder=""></el-input>
                         </el-form-item>
                           
                          <!-- multiple -->

                        <el-form-item label="角色" prop="roleName" >
                           <el-select  style="width:70%"  value-key="id" v-model="roleName"  placeholder="请选择">
                             <el-option
                             v-for="item in roleList"
                             :key="item.id"
                             :label="item.id"
                             :value="item">
                             </el-option>
                           </el-select>

                      </el-form-item> 
                       
                        <el-form-item style="width:70%" label="状态" prop="radiostate" >
                              <el-radio v-model="radiostate" label="1">正常</el-radio>
                              <el-radio v-model="radiostate" label="2">禁用</el-radio>
                         </el-form-item>


                  </el-form>
                 
                  

                  <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false;resetForm('adminForm')">关 闭</el-button>
                     <el-button type="primary"  @click="addAdminUser('adminForm')">确定</el-button>
                  </span>  

         </el-dialog>
     

        <!-- 进行修改的操作 -->
        <el-dialog  title="管理员信息修改" :visible.sync="distriVisible" width="50%">
               
                  <el-form  :model="adminChangeForm" ref="adminChangeForm" label-width="129px">
               
                      <el-form-item label="用户名" prop="username">
                           <el-input style="width:70%" placeholder="登录账号" v-model="adminChangeForm.username"></el-input>
                      </el-form-item>
                  
                         <el-form-item label="密码" prop="password" >
                            <el-input style="width:70%" v-model="adminChangeForm.password" placeholder="密码不显示"></el-input>
                         </el-form-item>

                          <el-form-item label="手机号" prop="phone" >
                           <el-input style="width:70%" v-model="adminChangeForm.phone" placeholder=""></el-input>
                         </el-form-item>
                           
            
                        <el-form-item style="width:70%" label="状态" prop="radiostate" >
                              <el-radio v-model="radiostate" label="1">正常</el-radio>
                              <el-radio v-model="radiostate" label="2">禁用</el-radio>
                         </el-form-item>


                  </el-form>
                 

                  
                  
                 <span slot="footer" class="dialog-footer">
                     <el-button @click="distriVisible = false;resetForm('adminChangeForm')">关 闭</el-button>
                     <el-button type="primary"  @click="changeAdminUser('adminChangeForm')">确定</el-button>
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
      width="140">
    </el-table-column>

    <el-table-column
      fixed
      prop="username"
      label="用户名"
      width="120">
    </el-table-column>
    
    <el-table-column
      fixed
      prop="department"
      label="所属部门"
      width="120">
    </el-table-column>

    <el-table-column
      fixed
      prop="email"
      label="邮箱"
      width="150">
    </el-table-column>
   
    <el-table-column
      fixed
      prop="phone"
      label="手机"
      width="120">
    </el-table-column>

    <el-table-column
      fixed
      prop="state"
      label="状态"
      width="120">
    </el-table-column>

    <el-table-column
      fixed
      prop="created"
      label="创建时间"
      width="200">
    </el-table-column>
   
    <!-- <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="distriVisible=true;handleClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button type="text" size="small">删除</el-button>
      </template>
    </el-table-column> -->
         
         <el-table-column
             fixed="right"
             label="操作"
             width="200"  
         >
             <template slot-scope="scope">
             <el-button @click="distriVisible=true;handleClick(scope.row)" type="primary" size="mini">修改</el-button>
             <el-button @click="deleteAdmin(scope.$index,scope.row)"  type="danger" size="mini">删除</el-button>
             </template>

         </el-table-column>

  </el-table>


 
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
      
      //删除管理员信息
      deleteAdmin(index,row){
          
         this.$confirm('此操作将永久删除该管理员信息 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
           this.$axios.get(this.dbURL+'/department/deleteAdmin?id='+row.id,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log(res)

             this.reload();  
            //rows.splice(index, 1);

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
        ///

      },


    //管理员信息修改
    changeAdminUser(formdata){
         console.log("adming.................")

         console.log(this.adminChangeForm)
         var usernameL = Object.keys(this.adminChangeForm.username).length
         
         if(usernameL < 3)
         {
               Element.Message.warning("用户名不能为空且小于3个字符！",{duration : 3*1000});
               return
         }
 

         this.$axios({
            method:'GET',
            url:this.dbURL+'/department/modifyAdmin',
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.adminChangeForm,
           }).then(res=>{
                  
                  Element.Message.success("修改成功！",{duration : 3*1000});
                  this.reload();
                  this.adminChangeForm = {};

          })

        

    },


      //获取所有角色
      getRoles(){
          
          this.$axios.post(this.dbURL+"/department/getRoles",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
          
            //将对象转为数组的操作
            for(let i in res.data.data)
            {   
               this.roleList[i] = res.data.data[i].rolename
            }

          })

      },
        //获取所有立档部门
        getDepartment(){
         
         this.$axios.post(this.dbURL+"/department/getDepartment",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
           
            // this.departmentList = res.data.data
            //将对象转为数组的操作
           var _this = this;
           
           
            for(let i in res.data.data)
            {  
               //_this.departmentList.push(res.data.data[i].department)
               this.departmentList[i] = res.data.data[i].department
               //console.log(this.departmentList[i])
            }

             
          })


        }, 
          //添加管理员
         addAdminUser(formName){
             
             console.log("这里是添加管理员的操作")
             console.log(this.roleName)
            
             var usernameL = Object.keys(this.adminForm.username).length
             
             if(usernameL < 3)
             {
               Element.Message.warning("用户名不能为空且小于3个字符！",{duration : 3*1000});
               return
             }
             
             var passwordL = Object.keys(this.adminForm.password).length
             if(passwordL <6)
             {
               Element.Message.warning("密码不能少于6个字符！",{duration : 3*1000});
               return
             }
             
            var roleL =  Object.keys(this.roleName).length
            if(roleL == 0)
            {
               Element.Message.warning("角色不能为空",{duration : 3*1000});
               return
            }
          
           var DL = Object.keys(this.adminForm.department).length
           
            if(this.roleName === "third_root")
            {
              if(DL === 0)
              {
                 Element.Message.warning("选择了third_root角色，请选择部门，若无部门则先创建！",{duration : 3*1000});
                 return
              }
              
            }

             this.adminForm.state = this.radiostate  //将状态赋值给adminForm

             console.log(this.adminForm)

            
          this.$axios({
            method:'GET',
            url:this.dbURL+'/department/addAdmin?role='+this.roleName,
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.adminForm,
           }).then(res=>{
                console.log(res)
              if(res.data.data === 1)
                  {
                    Element.Message.success("添加成功！",{duration : 3*1000});
                    this.adminForm = {};
                    this.roleName = [];
                    

                  }else if(res.data.data === 3){
                       Element.Message.error("添加失败！用户名重复！",{duration : 3*1000});
                  }
                  else{
                    Element.Message.error("添加失败！",{duration : 3*1000});
                  }

          })
        

            // this.dialogVisible = false;
             
          },
               //将数据置空
       resetForm(formName) {
	        this.$refs[formName].resetFields();
          this.roleName = [];
          
	      },

         handleClick(row) 
         {  //distriVisible=true;handleClick(scope.row)
            this.distriVisible=true
            console.log(row);
            this.adminChangeForm = Object.assign({},row)   //将表格中数据填充到新的表单中 editForm 中
         },
         
      //
      page(currentPage)
      {

          this.$axios.get(this.dbURL+'/department/getAdmin?currentPage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              // console.log("************ZZZZZZZZZZZZZZZZZZZZZZ*********")
              // console.log(res)
              this.tableData = res.data.data
              // this.currentPage = res.data.data.current
              this.total = res.data.data[0].total
              //this.pageSize = res.data.data.size

          })
      },



    },
    created(){
        //页面一启动就调用方法page
        this.page(1);

        this.getDepartment();
        this.getRoles();
    },

    data() {
      return {

         //分配管理员
         distriVisible:false,

         adminChangeForm:{
             username:'',
             password:'',
             phone:'',
             state:'',
         },

         //
         inputadmin:'',
         adminForm:{   
             username:'', 
             password:'',
             department:'',
             phone:'',
            // roleName:'', //角色
             state:'',  //状态选择，禁用或 正常
         },
         radiostate:'1',  //默认为正常状态
         roleName:[],

         departmentList:[], 
         
        // roleList:[
        //     {
        //     value: 'root',
        //     label: '黄金糕'
        //     }, 
        //     {
        //     value: 'second_root',
        //     label: '双皮奶'
        //     }
        // ],
         roleList:[],

        /////
        tableData:{}, //这个即为档案部门的的信息
        currentPage:1,
        total:0,
        pageSize:4, 
        visible: false,  //删除的提示框
        
        dialogVisible:false,



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

.dialog-admin .el-dialog__header {
  background: #ecf5ff;

}


.dialog-admin  .el-dialog__body{
  background-color: #eef1e9 !important;
}

.dialog-admin  .el-dialog__footer {
  background-color: #fafaf6 !important;
}



</style>