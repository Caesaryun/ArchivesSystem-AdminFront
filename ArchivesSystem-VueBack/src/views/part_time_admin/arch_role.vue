<template>
   <div id="testapprole">
          
   <div>
       
       <el-input class="inputone" v-model="inputadmin" placeholder="角色名称"></el-input> &nbsp
       <el-button>查询</el-button>&nbsp<el-button  @click="dialogVisible=true"  type="primary">新增</el-button>
          
         <el-dialog  title="新增" :visible.sync="dialogVisible" width="50%">
                  <el-form  :model="roleForm" ref="roleForm" label-width="110px">
               
                      <el-form-item label="角色名称" prop="rolename">
                           <el-input style="width:75%" placeholder="例：xxx_root" v-model="roleForm.rolename"></el-input>
                      </el-form-item>
                    

                     <el-form-item label="角色描述" prop="description" >
                           <el-input style="width:75%" placeholder="角色描述" v-model="roleForm.description"></el-input>
                      </el-form-item>
                   
                      
                     
                     <el-form-item  style="width:79.4%" label="授权" prop="description" >
                         <el-tree
                            
                            :data="data"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            :props="defaultProps"
                            default-expand-all
                            >
                      </el-tree> 

                      </el-form-item>

                  </el-form>
                 

                  <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false;resetForm('roleForm')">关 闭</el-button>
                     <el-button type="primary"  @click="addRoles('roleForm')">确定</el-button>
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
      prop="rolename"
      label="角色名"
      width="180">
    </el-table-column>
    
    <el-table-column
      fixed
      prop="description"
      label="描述"
      width="240">
    </el-table-column>

    <el-table-column
      fixed
      prop="created"
      label="创建时间"
      width="240">
    </el-table-column>
  
   
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button> -->
       
        <el-button  @click="deleteRole(scope.row)" type="danger" size="small">删除</el-button>


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
        //删除角色
        deleteRole(row){
          
        this.$confirm('此操作将永久删除该角色信息及其关联信息 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => { 
            //发送请求
           this.$axios.get(this.dbURL+'/role/deleteRole?id='+row.id,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log(res)

             this.reload();  
          

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


      //  getCheckedNodes() {
      //   console.log(this.$refs.tree.getCheckedNodes());
      // },
          //添加新角色
         addRoles(formName){
             //通过node获取
             //this.getCheckedNodes();
            console.log("get ")
            let menuAndPerms = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
            console.log(menuAndPerms)
           
           for(let i=0;i<menuAndPerms.length;i++)
            {
               console.log(menuAndPerms[i])
            }
          
             var usernameL = Object.keys(this.roleForm.rolename).length
             
             if(usernameL == 0)
             {
               Element.Message.warning("角色名不能为空！",{duration : 3*1000});
               return
             }

             if(menuAndPerms.length==0)
            {
              Element.Message.warning("需要选择授权",{duration : 3*1000});
               return
            }


          this.$axios({
            method:'GET',
            url:this.dbURL+'/role/addRole?menuAndPerms='+menuAndPerms,
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.roleForm,
           }).then(res=>{
                console.log(res)
                
                if(res.data.data === 1)
                  {
                    Element.Message.success("添加成功！",{duration : 3*1000});
                    //this.roleForm = {};   //设置为空
                      this.roleForm.rolename = "";
                      this.roleForm.description = "";

                  }else if(res.data.data === 3){
                       Element.Message.error("添加失败！用户名重复！或无权限！",{duration : 3*1000});
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
          
	      },

         handleClick(row) 
         {
            console.log(row);
         },
         
      //获取所有角色的信息
      page(currentPage)
      {


          this.$axios.get(this.dbURL+'/role/getRoles?currentPage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{

              console.log("hello world!!!!!!!!!!!!!!!")

              console.log(res)
               this.tableData = res.data.data.records
              // this.currentPage = res.data.data.current
               this.total = res.data.data.total
               this.pageSize = res.data.data.size
        

          })
      },



    },
    created(){
        //页面一启动就调用方法page
        this.page(1);
        

    },

    data() {
      return {
         //
         inputadmin:'',
         roleForm:{   
             rolename:'', 
             description:'',
             
         },
    
        /////
        tableData:{}, //这个即为档案部门的的信息
        currentPage:1,
        total:0,
        pageSize:4, 
        visible: false,  //删除的提示框
        
        dialogVisible:false,

         data: [{
          id: "test",
          label: '系统首页',
          children: [
            {
            id:"arch_return_back",
            label: '档案归还管理',
            children: [{
              id:"docu:return_look",
              label: '查看'
            }, {
              id:"docu:return_delete",
              label: '删除'
            }]
          },
           {
            id:"arch_count",
            label: '统计',
            children: [{
              id:"docu:count:look",
              label: '查看'
            }, {
              id: "docu:count:delete",
              label: '删除'
            }]
          },
          ]
        }, {
          id:"department",
          label: '部门管理',
          children: [{
            id:"department:manage:look",
            label: '查看'
          }, {
            id: "department:manage:add",
            label: '增加'
          },
           {
            id: "department:modify",
            label: '修改'
          },
          {
            id: "department:delete",
            label: '删除'
          }
          ]
        }, {
          id:"arch_check",
          label: '档案管理',
          children: [{
            id:"arch_check_file",
            label: '归档材料审核',
            children: [{
            id: "checkfile:look",
            label: '查看'
          },{
            id: "checkfile:modify",
            label: '修改'
          }]
          }, {
            id:"arch_check_arch",
            label: '档案审核',
            children: [{
            id:"check_arch:look",
            label: '查看'
          },{
            id:"check_arch:modify",
            label: '修改'
          }]
          }]
        },   //档案收录模块
        {
          id:"testx",
          label: '档案收录',
          children: [{
            id:"arch_docu",
            label: '档案操作',
            children: [{
            id: "docu:look",
            label: '查看'
          },{
            id: "docu:add",
            label: '添加'
          },{
            id: "docu:modify",
            label: '修改'
          },{
            id: "docu:modify",
            label: '删除'
          }]
          }, {
            id:"arch_search",
            label: '档案检索',
            children: [{
            id:"check_arch:look",
            label: '查看'
          }]
          },
          {
            id:"arch_down_templete",
            label: '下载档案模板',
            children: [{
            id:"check_arch:look",
            label: '下载'
          }]
          }
          ]
        },   //档案申请归档材料审核
        {
          id:"arch_apply",
          label: '申请管理',
          children: [{
            id:"apply:look",
            label: '查看', 
          },
          {
            id:"apply:add",
            label: '添加', 
          },
          {
              id:"apply:modify",
              label: '修改', 
          },
          {
            id:"apply:delete",
            label: '删除', 
          }, ]
        },

        ],



        defaultProps: {
          children: 'children',
          label: 'label'
        },

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