<template>
   <div id="testapp">
             <!--审核档案记录的页面，直接得到所有的档案记录，且可以选择不同的部门，之后
             展示出所有的待审核的档案记录，给出审核的状态及意见，之后生成一个未通过的pdf其中有修改意见，直接发
             给兼职人员的一个功能页面审核消息
             就得到相关的审核信息，
              -->
              <div >
                    <el-dialog  title="审核意见"  :visible.sync="checkVisible"    :close-on-click-modal="false" width="76%">
                     
                     <el-form  :rules="CheckRules"  :inline="true"  :model="commentForm"   ref="commentForm"  label-width="80px">
                     
                   <!-- <el-form-item label="材料名称" prop="title">
                       <font>{{commentForm.oldfileName}}</font>
				            </el-form-item> -->
                    

                    <el-form-item   prop="reviseComments" >
                       <mavon-editor v-model="commentForm.reviseComments"></mavon-editor>
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
          <el-form-item label="任务名称">
            <span>{{ props.row.taskName}}</span>
          </el-form-item>
          </el-form-item>
          <el-form-item label="部门">
            <span>{{ props.row.departName }}</span>
          </el-form-item>
          <el-form-item label="创建人">
            <span>{{ props.row.createdUsername }}</span>
          </el-form-item>
          <el-form-item label="材料名称">
            <span>{{ props.row.oldfileName }}</span>
          </el-form-item>
          <el-form-item label="审核状态">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="审核意见">
            <span>{{ props.row.reviseComments }}</span>
          </el-form-item>
        <el-form-item label="创建时间">
            <span>{{ props.row.createdTime}}</span>
          </el-form-item>

        <!-- <el-form-item label="操作" >
             <el-button v-if="props.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete' "   
              @click="handleClick(props.$index,props.row)" type="primary" icon="el-icon-edit" 
              size="mini">修改</el-button>
          
          <el-button
          v-if="props.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete' "
          @click.native.prevent="deleteRow(props.$index,tableData,props.row)"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          >
          删除
         </el-button>
  
           <el-button  
            v-loading="props.row.id === indexTempFirst[props.row.id]"   
            element-loading-background="rgba(0, 0, 0, 0)"
            class="LodingFirst"
            v-if="props.row.enclosure"   @click="filePreview(props.$index,props.row)"  size="mini"   icon="el-icon-view">预览</el-button>
           
           <el-button  v-if="props.row.enclosure && props.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete'&&props.row.enclosure"   @click="deleteEnclosure(props.$index,props.row)"  type="danger" size="mini"  icon="el-icon-delete" plain>删除附件</el-button>
           <el-button  v-if="!props.row.enclosure && props.row.state=='待实体归档'|| UserRolePer =='docu:changeOrdelete'&&!props.row.enclosure "  @click="handleClick(props.$index,props.row)" type="success"  icon="el-icon-upload" size="mini">上传附件</el-button>
           
           <el-button 
            v-loading="props.row.id === indexTempDownload[props.row.id] "   
            element-loading-background="rgba(0, 0, 0, 0)"
            class="DownloadLoadingFirst"
            v-if="props.row.enclosure"   @click="downloadEnclosure(props.row.id,props.row)"   plain size="mini" icon="el-icon-download">下载附件</el-button>

        </el-form-item> -->

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
     
      prop="taskName"
      label="任务名称"
      width="75"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
     
     <!--  设置一些标签用于选择的操作 -->
     <el-table-column
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
          
    </el-table-column>

    <el-table-column
      prop="createdUsername"
      label="创建人"
      width="70"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>

    <el-table-column
      prop="email"
      label="邮箱"
      width="70"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
    <el-table-column
      prop="oldfileName"
      label="材料名称"
      width="154"
      show-overflow-tooltip>
    </el-table-column> 

    <el-table-column
      prop="checkState"
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
      prop="createdTime"
      label="创建时间"
      width="150"
      align="center"
      show-overflow-tooltip
      sortable
      >
    </el-table-column>

    <el-table-column
      label="审核选项"
      width="190"
      align="center"
      show-overflow-tooltip
      >
      <template slot-scope="scope">
         <div > 
              <el-button  @click="previewFile(scope.$index,scope.row)" type="text" size="mini">查看材料</el-button>
              <el-button  @click="downloadFile(scope.row)" type="text" size="mini">下载</el-button>
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

          commentForm:{
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

         };
     },
   methods: {
     //取消
     reseteditForm(){
          this.commentForm.reviseComments = '';
     },
     //提交审核意见
     submitComment(){
        
        console.log(this.commentForm.reviseComments)
        this.commentForm.checkState = "不通过"  
         
        //直接获取长度，若为0则说明为空
        var length = Object.keys(this.commentForm.reviseComments).length
  
        if(length === 0)
        {
          Element.Message.warning("意见不能为空！",{duration : 3*1000});
          return 
        }
       
         this.$axios({
            method:'GET',
            url:this.dbURL+'/apply-check/refusecomment',
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.commentForm,
           }).then(res=>{
                console.log(res)
                Element.Message.success("提交审核意见成功！",{duration : 3*1000});
                this.commentForm.reviseComments = ''  //执行完了才清空
                this.reload();
                
          })
         
         this.checkVisible = false
     },
     //通过
     accessCheck(index,editPage){
        
        this.$confirm('确认审核成功?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {

         this.$axios({
            method:'GET',
            url:this.dbURL+'/apply-check/accesscheck?apply_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            // params:editPage.id,
           }).then(res=>{
               
               Element.Message.success("审核成功，已为用户激活相关权限！",{duration : 3*1000});
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
     //下载文件
     downloadFile(editPage){
          
           this.$axios({
            method:'GET',
            url:this.dbURL+'/apply-check/download?applycheck_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            responseType: 'blob'
          }).then(res=>{
                console.log("excute  downloadFile ...")
               
                console.log(res.data)
                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   type:'application/octet-stream'
                }); 
                let objectUrl = URL.createObjectURL(blob);
                a.setAttribute("href",objectUrl);
                a.setAttribute("download", editPage.oldfileName);
                a.click()

          })

     },
      //预览文件
      previewFile(index,editPage){
          
          this.$axios({
            method:'GET',
            url:this.dbURL+'/apply-check/previewfile?applycheck_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            //responseType: 'arraybuffer'
            responseType: 'blob'
          }).then(res=>{
                console.log("excute  previewFile ...")
                console.log(res)
                console.log(res.data)
      
                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   //type:'application/pdf'   //也是必不可少的
                   type:res.data.type
                }); 
                let objectUrl = window.URL.createObjectURL(blob);
                window.open(objectUrl)
                
                
          })

          
      },

       //打开页面就得到数据
       page(currentPage){
           
          const _this = this
          this.$axios.get(this.dbURL+'/apply-check/getcheckall?currentpage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
               console.log(res)
          
               this.tableData = res.data.data.records
               this.total = res.data.data.total
               this.pageSize = res.data.data.size
               
              //  console.log(res.data.data.records[0].departName)
              // for(let i=0;i<res.data.data.total;i++)
              // {
              //    this.departMent_filters[i].text = res.data.data.records[i].departName
              //    this.departMent_filters[i].value = res.data.data.records[i].departName
                 
              // }

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