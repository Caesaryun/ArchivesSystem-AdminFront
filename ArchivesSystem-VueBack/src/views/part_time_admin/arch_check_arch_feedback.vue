<template>
   <div id="testapp">
          
    <div>
        
        <el-button  @click="subCheckForArch"  type="success">提交审核</el-button>  
        <el-button  @click="subCheckForArch"  type="success"></el-button>

<div class="block"> 

   <el-table  
    :data="tableData"
    border
    style="width: 100%" 
    ref="multipleTable"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    :header-cell-style="{'text-align':'center'}"
    >
<!-- 设置表格居中
     :header-cell-style="{'text-align':'center'}"
    :cell-style="{'text-align':'center'}" -->
 
    <el-table-column
      type="selection"
      width="55"
      align="center"
      >     
    </el-table-column>

     <!-- v-loading="isloading" -->

     <el-table-column type="expand">
            <template slot-scope="props">
        <el-form label-position="left"  class="demo-table-expand">
          <el-form-item label="全宗号">
            <span>{{ props.row.departId}}</span>
          </el-form-item>
          </el-form-item>
          <el-form-item label="题名">
            <span>{{ props.row.title }}</span>
          </el-form-item>
          <el-form-item label="档号">
            <span>{{ props.row.fileId }}</span>
          </el-form-item>
          <el-form-item label="归档日期">
            <span>{{ props.row.createdTime }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="附件名称">
            <span>{{ props.row.oldFilename }}</span>
          </el-form-item>
        <el-form-item label="备注">
            <span>{{ props.row.remarks}}</span>
          </el-form-item>
         <el-form-item label="描述">
            <span>{{ props.row.description }}</span>
          </el-form-item>

        <el-form-item label="操作" >
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
           <!--  设置若点击了它且符合现在的 index 设置一个全局的 indexTemp 进行比较即可
                 若index = 2 ，则看其是否在this.indexTemp[]中保存过该数据，若已
                 点击过2，则一定会有 indexTemp[2] = 2以此来进行 true或false判断，便需要this.
                 当预览成功后，便将indexTemp[2] = 空即可
                 ,下载时候，快速的出现一个loading然后在下载完成的res处设置消失即可
            -->
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
     
      prop="departId"
      label="全宗号"
      width="75"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
     
     <el-table-column
      prop="departName"
      label="部门"
      width="100"
      align="center"
      show-overflow-tooltip>
      
    </el-table-column>
     
      <el-table-column
      prop=""
      label="分类号"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
 
   <el-table-column
      prop=""
      label="分类名"
      width="100"
      align="center"
      show-overflow-tooltip
      
      >
      
    </el-table-column>

     <el-table-column
      prop="enclosure"
      label="附件"
      width="60"
      align="center"
      show-overflow-tooltip
      >
        <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
               <img  @click="filePreview(scope.$index,scope.row)" :src="scope.row.enclosure"  width="20px"/> 
            </el-tooltip>

        </template>

    </el-table-column>

    

    <el-table-column
      prop="boxId"
      label="盒号"
      width="70"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

    <el-table-column
      prop="itemId"
      label="件号"
      width="70"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
   
    <el-table-column
      prop="title"
      label="题名"
      width="100"
      show-overflow-tooltip>
       <!-- 
      <template slot-scope="scope">
          <el-input  size="small" v-model="scope.row.title" @change="handleEdit(scope.$index, scope.row)"></el-input>
      </template> -->

    </el-table-column>

    <el-table-column
      prop="fileId"
      label="档号"
      width="130"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="establishYear"
      label="归档年度"
      width="110"
      align="center"
      sortable
      show-overflow-tooltip

      >
       
    </el-table-column>

   <el-table-column
      prop="storageTerm"
      label="保管期限"
      width="100"
      align="center"
      show-overflow-tooltip
      :filters=Store_filters
      :filter-method="filterStorageTerm"
      filter-placement="bottom-end"
      >
      <template slot-scope="scope">
           <el-tag
           :type="scope.row.storageTerm ==='永久'? 'primary':'success' 
           || scope.row.storageTerm ==='1年'? 'danger':'success' "
           disable-transitions
           >
             {{scope.row.storageTerm}}
           </el-tag>
      </template>

    </el-table-column>

    <el-table-column
      prop="securityClassification"
      label="密级"
      width="46"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

   <el-table-column
      prop=""
      label="审核人"
      width="89"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

    <el-table-column
      prop="createdTime"
      label="归档日期"
      width="100"
      sortable
      show-overflow-tooltip>
    </el-table-column>
 
   <el-table-column
      prop="pageNumber"
      label="页数"
      width="46"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

<el-table-column
      prop="securityTime"
      label="保密期限"
      width="90"
      align="center"
      show-overflow-tooltip

      :filters=security_Store_filters
      :filter-method="filterTag"
      filter-placement="bottom-end"

      >
       <template slot-scope="scope">
           <el-tag
           :type="scope.row.securityTime ==='无'? 'primary':'success' "
           disable-transitions
           >
             {{scope.row.securityTime}}
           </el-tag>
      </template>
          
    </el-table-column>

<el-table-column
      prop="state"
      label="状态"
      width="90"
      align="center"
      show-overflow-tooltip
      
      :filters=State_filters
      :filter-method="filterState"
      filter-placement="bottom-end"
      > 
           <template slot-scope="scope">
           <el-tag
           :type="scope.row.state ==='待提交审核'? 'danger':'success' "
           disable-transitions
           >
             {{scope.row.state}}
           </el-tag>
      </template>
    </el-table-column>

<el-table-column
      prop="remarks"
      label="备注"
      width="70"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
<el-table-column
      prop="description"
      label="描述"
      width="70"
      show-overflow-tooltip>
    </el-table-column>

   <el-table-column
      prop="oldFilename"
      label="附件名称"
      width="124"
      align="center"
      show-overflow-tooltip>
    </el-table-column>

   <el-table-column
      prop="fileType"
      label="附件扩展名"
      width="90"
      v-if="false"
      show-overflow-tooltip>
    </el-table-column>


      <!-- 想办法将按钮进行伸缩自如的操作
       width="239"
      -->
    <el-table-column
      fixed="right"
      label="操作"
      width="239"
      align="left"
      show-overflow-tooltip
      >
      <template slot-scope="scope">
         <div > 
          <el-button v-if="scope.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete' "    @click="handleClick(scope.$index,scope.row)" type="text" size="mini">修改</el-button>
          
          <el-button
          v-if="scope.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete' || scope.row.state=='待提交审核' "
          @click.native.prevent="deleteRow(scope.$index,tableData,scope.row)"
          type="text"
          size="mini">
          删除
         </el-button>

            <!--  只有这一种状态，待实体归档可以操作，其他的状态都不行，若是为 待实体归档 则说明是新增的 则可以进行编辑，否则就不能上传或删除 ，或者 角色为 root则可以进行操作 
                 这里：使用的权限来进行判断，若该角色拥有该权限则可以进行操作，这样就不必拘泥于某个角色之中
                 若后期有申请操作时也不必赋予角色，直接赋予申请角色该权限即可，该权限为 ： docu:changeOrdelete 
            -->
           <el-button  
            class="LodingTwo"
            v-loading="scope.row.id === indexTemp[scope.row.id]"   
            element-loading-background="rgba(0, 0, 0, 0)"
            v-if="scope.row.enclosure"  
            @click="filePreview(scope.$index,scope.row)" type="text" size="mini">预览</el-button>
          
           <el-button  v-if="scope.row.enclosure && scope.row.state=='待实体归档' || UserRolePer =='docu:changeOrdelete'&&scope.row.enclosure"   @click="deleteEnclosure(scope.$index,scope.row)" type="text" size="mini">删除附件</el-button>
           <el-button  v-if="!scope.row.enclosure && scope.row.state=='待实体归档'|| UserRolePer =='docu:changeOrdelete'&&!scope.row.enclosure "  @click="uploadEnclosureClick(scope.$index,scope.row)" type="text" size="mini">上传附件</el-button>
           <el-button 
            v-loading="scope.row.id === indexTempDownload[scope.row.id] "   
            element-loading-background="rgba(0, 0, 0, 0)"
            class="DownloadLoadingTwo"

            v-if="scope.row.enclosure"   
            @click="downloadEnclosure(scope.row.id,scope.row)" 
             type="text" size="mini">下载附件</el-button>
           
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

    <div  class="filter_style"> </div>

   </div>
           </div>
   </div>
</template>

<script>

//import Hello from '../components/hello.vue' 

export default{
   data(){ 
       return {

                  
         };
     },
   methods: {
              
    },
   created(){
   
    },
   components:{
       // Hello 
     }
}
</script>

<style>
   
</style>