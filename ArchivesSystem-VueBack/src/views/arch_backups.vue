<template>
   <div id="testappbackups"  v-loading="loading" 
                             element-loading-background="rgba(0,0,0,0.6)"
                             element-loading-text="正在备份中..."
        >

  <el-input class="inputone" v-model="keyinput" placeholder="enter查询" @keyup.enter.native="searchIndex"  ></el-input> &nbsp
  <el-button  @click="backupsMysql()"  type="success" plain>备份数据库</el-button>
    
  <el-button @click="clearFilter">清除所有过滤器</el-button>
  
  <el-table  
    :data="tableData"
    border
    style="width: 100%" 
    ref="multipleTable"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    :header-cell-style="{'text-align':'center'}"
    >

 
    <el-table-column
      type="selection"
      width="55"
      align="center"
      >     
    </el-table-column>


     <el-table-column type="expand">
            <template slot-scope="props">
        <el-form label-position="left"  class="demo-table-expand">
          <el-form-item label="备份时间">
            <span>{{ props.row.created}}</span>
          </el-form-item>
          </el-form-item>
          <el-form-item label="备份用户">
            <span>{{ props.row.userName }}</span>
          </el-form-item>
          <el-form-item label="文件名">
            <span>{{ props.row.fileName}}</span>
          </el-form-item>
          <el-form-item label="本地保存路径">
            <span>{{ props.row.filePath }}</span>
          </el-form-item>

        </el-form>
       </template>
     </el-table-column>

     <el-table-column
      prop="id"
      label="编号"
      width="75"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>
    

     <el-table-column
     
      prop="created"
      label="备份时间"
      width="108"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
     
     <!--  设置一些标签用于选择的操作 -->
     <el-table-column
      prop="userName"
      label="备份用户"
      width="120"
      align="center"
      show-overflow-tooltip
      >
          
    </el-table-column>

    <el-table-column
      prop="fileName"
      label="文件名"
      width="190"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>

    <el-table-column
      prop="filePath"
      label="本地保存路径"
      width="390"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
    <el-table-column
      label="操作"
      width="190"
      align="center"
      show-overflow-tooltip
      >
      <template slot-scope="scope">
         <div > 
              <!-- <el-button   @click="previewFile(scope.$index,scope.row)" type="primary" size="mini">下载</el-button> -->
              <el-button   @click="deletebackups(scope.$index,scope.row)" type="text" size="mini">删除</el-button>
              
         </div>

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
</template>

<script>

//import Hello from '../components/hello.vue' 

import Element from 'element-ui'


export default{
  inject:['reload'],


   data(){ 
       return {
          tableData:{}, 
          currentPage:1,
          total:0,
          pageSize:1,
          multipleSelection: [],
          checkVisible:false,
          
          loading:false,

         };
     },
   methods: {
        
        deletebackups(index,row){
          
          this.$confirm('此操作将永久删除该备份记录 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
           this.$axios.get(this.dbURL+'/backups-mysql/deletebackups?id='+row.id,{
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


        //备份数据
        backupsMysql(){
          
          this.loading = true;

          this.$axios.get(this.dbURL+'/backups-mysql/backups-mysql',{
            headers:{
                   "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
               console.log(res);
               Element.Message.success("备份成功！",{duration : 3*1000});
               this.reload();
               this.loading = false;

          })

        },

         //获取数据
        page(currentPage){
     
          this.$axios.get(this.dbURL+'/backups-mysql/getbackups?currentPage='+currentPage,{
            headers:{
                   "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
               console.log("备份的数据....")
               console.log(res);
               this.tableData = res.data.data.records
               this.total = res.data.data.total
               this.pageSize = res.data.data.size

          })


       },
      //////////////////
       

    },
   created(){
           this.page(1);

    },
   components:{
       // Hello 
     }
}
</script>

<style>
  
  .mpage{
      margin: 0 auto;
      text-align: center;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 109px;
    /* color: #99a9bf; */
    color:rgb(102, 119, 165);
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>