
       <!-- 审核已提交审核的档案数据 
            1.可以看到 审核中 ，点击未通过则 从表中消失，点击 通过 则完成 已归档 ，其他在馆等状态 则未 借阅状态 也从表中消失
            2.总的来说只能看到 审核中 的数据在这个审核档案 的页面中 
            
            // 
            third_root 则 可以看到所有状态，但只能操作
            1.待提交审核
            2.未通过
            其他的状态 皆只能 预览 下载，其他修改 删除 删除等皆不可
             -->
          
<template>
   <div id="testapp">
        
              <div >
                    <el-dialog  title="审核意见"  :visible.sync="checkVisible"    :close-on-click-modal="false" width="76%">
                     
                     <el-form  :rules="CheckRules"  :inline="true"  :model="commentForm"   ref="commentForm"  label-width="80px">
                     
                   <!-- <el-form-item label="材料名称" prop="title">
                       <font>{{commentForm.title}}</font>
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
          <el-form-item label="全宗号">
            <span>{{ props.row.departId}}</span>
          </el-form-item>
          </el-form-item>
          <el-form-item label="部门">
            <span>{{ props.row.departName }}</span>
          </el-form-item>
          <el-form-item label="题名">
            <span>{{ props.row.title}}</span>
          </el-form-item>
          <el-form-item label="材料名称">
            <span>{{ props.row.oldFilename }}</span>
          </el-form-item>
          <el-form-item label="审核状态">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="审核意见">
            <span>{{ props.row.reviseComments }}</span>
          </el-form-item>
        <el-form-item label="归档时间">
            <span>{{ props.row.createdTime}}</span>
          </el-form-item>

        </el-form>
       </template>
     </el-table-column>

     <!-- <el-table-column
      prop="id"
      label="编号"
      width="75"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column> -->
    

     <el-table-column
     
      prop="departId"
      label="全宗号"
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
      prop="taxonNo"
      label="分类号"
      width="70"
      align="center"
      show-overflow-tooltip
      >
    </el-table-column>

    <el-table-column
      prop="taxonTitle"
      label="分类名"
      width="70"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
    <el-table-column
      prop="oldFilename"
      label="附件名称"
      width="154"
      show-overflow-tooltip>
    </el-table-column> 

    <el-table-column
      prop="boxId"
      label="盒号"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
    
    <el-table-column
      prop="itemId"
      label="件号"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

   <el-table-column
      prop="title"
      label="题名"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

   <el-table-column
      prop="establishYear"
      label="归档年度"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

    <el-table-column
      prop="storageTerm"
      label="保管期限"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
    
    <el-table-column
      prop="securityClassification"
      label="密级"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
   <el-table-column
      prop="createdTime"
      label="归档日期"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
    
     <el-table-column
      prop="pageNumber"
      label="页数"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
    
    <el-table-column
      prop="securityTime"
      label="保密期限"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

    <el-table-column
      prop="state"
      label="审核状态"
      width="100"
      align="center"
      show-overflow-tooltip
    
      >
      <!--  :filters="[{text: '审核中', value: '审核中'}]"
      :filter-method="filterTag"
      filter-placement="bottom-end" -->

       <template slot-scope="scope">
        <el-tag
          :type="scope.row.state === '审核中' ? 'warning' : 'success'"
          disable-transitions>{{scope.row.state}}</el-tag>
      </template>
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
             {text:'科技馆',value:'科技馆'},
             {text:'图书馆',value:'图书馆'},
             {text:'信息工程学院',value:'信息工程学院'},
             {text:'软件学院',value:'软件学院'},
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
        
        console.log(this.commentForm)
         
        //直接获取长度，若为0则说明为空
        var length = Object.keys(this.commentForm.reviseComments).length
  
        if(length === 0)
        {
          Element.Message.warning("意见不能为空！",{duration : 3*1000});
          return 
        }
       
         this.$axios({
            method:'GET',
            url:this.dbURL+'/document/refuse',
            headers:{"Authorization":localStorage.getItem("token")},
            params:{
              archid:this.commentForm.id,
              revisecomments:this.commentForm.reviseComments
            },
           }).then(res=>{

                // console.log(res)
                // Element.Message.success("提交审核意见成功！",{duration : 3*1000});
                // this.commentForm.reviseComments = ''  //执行完了才清空
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
            //发送请求
            this.$axios({
            method:'GET',
            url:this.dbURL+'/document/accesscheckarch?arch_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            // params:editPage.id,
           }).then(res=>{
               
               Element.Message.success("审核成功！",{duration : 2*1000});
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
     downloadFile(id,editPage,index){
          
          if(editPage.fileType == "mp4")
          {
            let a = document.createElement('a')
            a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
            a.click(); 
            
          }
          else {
        
          this.$axios({
            method:'GET',
            url:this.dbURL+'/document/download?arch_id='+editPage.id,
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
                a.setAttribute("download", editPage.oldFilename);
                a.click()

          })
          }
      

     },
      //预览文件
      previewFile(index,editPage){
          

          if(editPage.fileType == "mp4")
          {
            let a = document.createElement('a')
            a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
            a.click();
          }
          else {
      
          this.$axios({
            method:'GET',
            url:this.dbURL+'/document/previewPdfFile?arch_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            //responseType: 'arraybuffer'
            responseType: 'blob'
          }).then(res=>{
                console.log("excute  previewFile ...")
                console.log(res)

                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   //type:'application/pdf'   //也是必不可少的
                   type:res.data.type
                }); 
                let objectUrl = window.URL.createObjectURL(blob);
                window.open(objectUrl)
                
          })

        }
          
      },

       //打开页面就得到数据
       page(currentPage){
           
           //置入当前页数提交页数
          this.$store.commit("SET_COUNTCURRENTPAGE",currentPage);
          
          const _this = this
          this.$axios.get(this.dbURL+'/document/getdocutocheck?currentpage='+currentPage,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log("获取check arch")
              console.log(res)
              
              if(res.data.code === 401)
              {
               Element.Message.warning("没有获取数据的权限！",{duration : 3*1000});
              }
            
              _this.tableData = res.data.arch_pages.records
             
               _this.currentPage = res.data.arch_pages.current
              _this.total = res.data.arch_pages.total
              _this.pageSize = res.data.arch_pages.size


              //处理时间,提取年份即可
              console.log(_this.tableData[0].establishYear[0])

              for(let i in _this.tableData)
              {   
                 _this.tableData[i].establishYear = _this.tableData[i].establishYear[0]
              }
             
              // for(let i in _this.tableData)
              // {
              //     if(_this.tableData[i].reviseComments!=null)
              //        {  //注意需要是不为空的
              //           var MarkdownIt = require("markdown-it")
              //           var md = new MarkdownIt()
              //           var result = md.render(_this.tableData[i].reviseComments)  //内容渲染
              //          _this.tableData[i].reviseComments = result
              //        }
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