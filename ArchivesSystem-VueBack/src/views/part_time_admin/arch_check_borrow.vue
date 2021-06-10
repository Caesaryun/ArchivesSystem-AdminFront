<template>
   <div id="testapp">
        
              <div >
                    <el-dialog  title="审核意见"  :visible.sync="checkVisible"    :close-on-click-modal="false" width="76%">
                     
                     <el-form  :rules="CheckRules"  :inline="true"  :model="commentForm"   ref="commentForm"  label-width="80px">
                     
                   <!-- <el-form-item label="材料名称" prop="title">
                       <font>{{commentForm.title}}</font>
				            </el-form-item> -->
                    

                    <el-form-item   prop="reviseComments" >
                       <mavon-editor v-model="reviseComments"></mavon-editor>
				     </el-form-item>
                   
                   </el-form>

                  <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="checkVisible = false;reseteditForm('commentForm')">取 消</el-button>
                     <el-button type="primary" icon="el-icon-circle-check"  @click="submitComment">提交</el-button>
                  </span>  
            
            </el-dialog>  

              </div>

  <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button> -->
  <el-button @click="clearFilter">清除所有过滤器</el-button>
  
  <el-table  
    :data="tableData"
    border
    style="width: 100%" 
    ref="multipleTable"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    :header-cell-style="{'text-align':'center'}"

    v-loading="pictLoading" element-loading-background="rgba(234,254,236, 0.5)"
    element-loading-text="正在为用户发送通知书！"
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
           <el-form-item label="档案编号">
            <span>{{ props.row.archId}}</span>
          </el-form-item>
          <el-form-item label="排队位次">
            <span>{{ props.row.rankNo}}</span>
          </el-form-item>
          </el-form-item>
          <el-form-item label="借阅理由">
            <span>{{ props.row.reason }}</span>
          </el-form-item>
          <el-form-item label="审核状态">
            <span>{{ props.row.state}}</span>
          </el-form-item>
          <el-form-item label="审核人">
            <span>{{ props.row.allowName }}</span>
          </el-form-item>
          <el-form-item label="审核意见">
            <span>{{ props.row.reviseComments }}</span>
          </el-form-item>

        </el-form>
       </template>
     </el-table-column>

     <el-table-column
      prop="id"
      label="借阅编号"
      width="75"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>
    
     <el-table-column
      prop="archId"
      label="档案编号"
      width="75"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>

     <el-table-column
     
      prop="rankNo"
      label="排队位次"
      width="75"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
     
     <!--  设置一些标签用于选择的操作 -->
     <!-- <el-table-column
      prop="departName"
      label="部门"
      width="100"
      align="center"
      show-overflow-tooltip
      
      :filters=departMent_filters
      :filter-method="filterTag"
      filter-placement="bottom-end"
      >
      <template slot-scope="scope">
           <el-tag
           :type="scope.row.departName ==='学报编辑部'? 'primary':'success' "
           disable-transitions
           >
             {{scope.row.departName}}
           </el-tag>
      </template>
          
    </el-table-column> -->

    <el-table-column
      prop="borrowTime"
      label="预计借阅时长(天)"
      width="120"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>

    <el-table-column
      prop="reason"
      label="借阅理由"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
    <el-table-column
      prop="username"
      label="用户名"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column> 

    <el-table-column
      prop="state"
      label="审核状态"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

    <el-table-column
      prop="reviseComments"
      label="审核意见"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
    
   <el-table-column
      prop="checkUsername"
      label="审核人"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
  

    <el-table-column
      label="审核选项"
      width="190"
      align="center"
      show-overflow-tooltip
      >
      <template slot-scope="scope">
         <div > 
              <el-button  v-if="scope.row.enclosure" @click="previewFile(scope.$index,scope.row)" type="text" size="mini">查看附件</el-button>
              <el-button  v-if="scope.row.enclosure"  @click="downloadEnclosure(scope.row.id,scope.row)" type="text" size="mini">下载</el-button>
              <el-button  @click="accessCheck(scope.$index,scope.row)" type="text" size="mini">通过</el-button>
              <el-button  @click="refuseCheck(scope.$index,scope.row)" type="text" size="mini">不通过</el-button>
         </div>

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
</template>

<script>

//import Hello from '../components/hello.vue' 
import Element from 'element-ui'

export default{
   inject:['reload'],

   data(){ 
       return {
          
          tableData:{}, 
          currentPage:'',
          total:0,
          pageSize:1,
          multipleSelection: [],
          checkVisible:false,
         
          reviseComments:'',
         
          commentForm:{
            id:'',
            reviseComments:'',
          },
          //reviseComments:'',

          CheckRules:{
             reviseComments:[
                 { required: true, message: '请输入审核意见', trigger: 'change' }
              ],
          },

          //filters部门的filters
          departMent_filters:[ 
             {text:'学报编辑部',value:'学报编辑部'},
             {text:'学校办公室',value:'学校办公室'},
           ],
         
         pictLoading:false,

         };
     },
   methods: {
     //取消
     reseteditForm(){
          this.commentForm.reviseComments = '';
     },
     //提交审核意见，这是不通过的情况
     submitComment(){
        

        console.log(this.commentForm)
    
        //直接获取长度，若为0则说明为空
        var length = Object.keys(this.reviseComments).length
  
        if(length === 0)
        {
          Element.Message.warning("意见不能为空！",{duration : 3*1000});
          return 
        }
        
        this.commentForm.reviseComments = this.reviseComments
        
         this.$axios({
            method:'GET',
            url:this.dbURL+'/common-borrow/refuseborrow',
            headers:{"Authorization":localStorage.getItem("token")},
            params:{
               id:this.commentForm.id,
               revisecomments:this.commentForm.reviseComments
            },
            
           }).then(res=>{

                console.log(res)

                Element.Message.success("提交审核意见成功！且成功刷新了排队序号！",{duration : 3*1000});
                this.commentForm.reviseComments = ''  //执行完了才清空
                this.reload();
                
          })
         
         this.checkVisible = false
     },
     //选择通过 该 申请，通过后 则锁定 档案状态为 不可借，当归还后，将 借阅排队表 数据 减一
     accessCheck(index,editPage){
       this.pictLoading = true;

       this.$confirm('确认审核成功?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
            this.$axios({
            method:'GET',
            url:this.dbURL+'/common-borrow/accessBorrow?borrowId='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            // params:editPage.id,
           }).then(res=>{
               
               Element.Message.success("审核成功！",{duration : 2*1000});
               this.pictLoading = false;
               
               this.reload();
          })


        }).catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        

     },
     //不通过
     refuseCheck(index,editPage){
        
        this.checkVisible = true
        this.commentForm = Object.assign({},editPage)   //将表格中数据填充到新的表单中 editForm 中
         
     },
    

       //打开页面就得到数据
       page(currentPage){
           
           //置入当前页数提交页数
          this.$store.commit("SET_COUNTCURRENTPAGE",currentPage);
          
          const _this = this
          this.$axios.get(this.dbURL+'/common-borrow/getarchborrowall?currentpage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log("获取borrow .......")
              console.log(res)
              console.log(res.data)
              
              
              if(res.data.code === 401)
              {
               Element.Message.warning("没有获取数据的权限！",{duration : 3*1000});
              }
            
            _this.tableData = res.data.data.records
             
               _this.currentPage = res.data.data.current
              _this.total = res.data.data.total
              _this.pageSize = res.data.data.size



          })
       },

      resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },

      clearFilter() {
        this.$refs.multipleTable.clearFilter();
      },
      
      formatter(row, column) {
        //alert(row.createdUsername)
        return row.createdUsername;
      },
      filterTag(value, row) {
        return row.departName === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }    

    },
   created(){
            this.page(1)

    },
   components:{
       // Hello 
     }
}
</script>

<style>
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    /* color: #99a9bf; */
    color:rgb(102, 119, 165);
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>