<template>
   <div id="testapp">
    <!-- 这个档案录入后，还应该进行档案管理员还要进行审核，若审核通过则列为在待实体归档，直接给出系统消息
    提示，提示还有未审核通过的档案记录， -->
    
   <div>
       
        <el-input class="inputone" v-model="keyinput" placeholder="题名\附件名\内容 enter查询" @keyup.enter.native="searchIndex"  ></el-input> &nbsp
        <el-button  @click="dialogVisible=true;getIdAndTitle()"  type="primary">新增档案</el-button>
        <el-button  @click="subCheckForArch"  type="success">一键提交审核</el-button>
        <el-button   @click="dialogEnclosure=true;addEnclosure()" type="primary" plain>导入excel</el-button>
        <el-button @click="exportExcel" type="success" plain>导出excel</el-button>
        <el-button @click="aboveUploadEnclosure" type="primary" plain>批量上传附件</el-button>
        <el-button @click="aboveDownloadEnclosure" type="success" plain>下载附件</el-button>
        <el-button type="warning" plain  @click="aboveDelEnclosure">删除附件</el-button>
        <el-button type="success" @click="clearFilter">清除所有过滤</el-button> 
        
          
         <!-- 批量导入附件的操作 -->
          <el-dialog  title="批量上传附件"   :visible.sync="multiEnclosureVisible"  width="76%">
                     <!-- http://localhost:8080/ArchivesSystem/document/mUploadEnclosure -->
                      <el-upload
                       v-loading="multiLoading"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.7)"
                       element-loading-text="正在上传附件......"
                        :headers="{'Authorization': token }"
                        :before-upload="beforeUpload"
                        class="upload-demo"
                        drag
                        :action="multiurl"
                        :on-success="uploadMultiSuccess"
                        :file-list="fileList"
                        multiple>
                     <i class="el-icon-upload"></i>
                     <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                     <div class="el-upload__tip" slot="tip"></div>
                    </el-upload>

                   <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="multiEnclosureVisible=false;reseteditForm()">取 消</el-button>
                     <el-button type="primary" icon="el-icon-circle-check"  @click="multiEnclosureVisible=false;completeUpload()">完成上传</el-button>
                  </span>   

               </el-dialog> 


         <el-dialog  title="新增档案"   :close-on-click-modal="false"   :visible.sync="dialogVisible" width="64%">
                 
                  <el-form  size="mini" :inline="true"  :rules="DepartRules"  :model="DepartForm" ref="DepartForm" label-width="100px">
                        

                      <el-form-item label="全宗号" prop="departId" >
                           <el-select v-model="DepartForm.departId" placeholder="请选择">
                                 <el-option
                                  v-for="item in DepartIdList"
                                 :label="item.departId"
                                 :key="item.departId"
                                 :value="item.departId"
                                 >
                               <!-- <span style="float: left">{{ item.nickname }}</span> -->
                              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.departId}}</span>
                             </el-option>
                            </el-select>
                      </el-form-item>
                      
                      <el-form-item label="盒号" prop="boxId" >
                           <el-input style="width:194px;" v-model="DepartForm.boxId" placeholder=""></el-input>
                      </el-form-item>
                      
                      <el-form-item label="分类号" prop="taxonNo" >
                           <el-cascader 
                            :options="optionsForTaxonNo"   
                            :show-all-levels="false"
                            v-model="DepartForm.taxonNo"
                            >

                            </el-cascader>
                      </el-form-item>

                      <el-form-item label="件号" prop="itemId" >
                           <el-input style="width:194px;" v-model="DepartForm.itemId" placeholder=""></el-input>
                      </el-form-item>
                      
                      <!--  分类名由程序自己进行匹配分配即可 展示分类号的同时也要分类名 -->
                      <!-- <el-form-item label="分类号" prop="taxonNo" >
                           <el-cascader 
                            :options="optionsForTaxonNo"   
                            :show-all-levels="false"
                            v-model="DepartForm.taxonNo"
                            >

                            </el-cascader>
                      </el-form-item> -->
                      
                     <el-form-item label="归档年度" prop="establishYear" >
                           <el-date-picker
                                   v-model="DepartForm.establishYear"
                                   type="year"
                                   value-format="yyyy"
                                   format="yyyy"
                                   placeholder="选择年"
                                   style="width:193px"
                                   >
                          </el-date-picker>
                      </el-form-item>

                       <el-form-item label="归档日期" prop="createdTime" >
                           <el-date-picker
                             v-model="DepartForm.createdTime"
                             type="datetime"
                             value-format="yyyy-MM-dd HH:mm:ss"
                             placeholder="选择日期"
                             style="width:195px"
                             >
                            </el-date-picker>
                      </el-form-item>
                      
                       <el-form-item label="题名" prop="title">
                           <el-input style="width:497px" v-model="DepartForm.title" placeholder=""></el-input>
                      </el-form-item>
                      
                      <el-form-item label="页数" prop="pageNumber">
                           <el-input style="width:193px" v-model="DepartForm.pageNumber" placeholder=""></el-input>
                      </el-form-item>
                    
                      <el-form-item label="保管时间" prop="storageTerm" >
                           <el-select v-model="DepartForm.storageTerm" placeholder="请选择">
                                 <el-option
                                  v-for="item in storTime"
                                 :label="item.labelname"
                                 :key="item.timename"
                                 :value="item.timename">
                               <span style="float: left">{{ item.labelname}}</span>
                              <span style="float: right; color: #8492a6; font-size: 14px">{{ item.timename}}</span>
                             </el-option>
                            </el-select>
                      </el-form-item>
 
                       <el-form-item label="密级" prop="securityClassification" >
                           <el-select v-model="DepartForm.securityClassification" placeholder="请选择" style="width:193px">
                                 <el-option
                                  v-for="item in securityGrade"
                                 :label="item.labelname"
                                 :key="item.securityName"
                                 :value="item.securityName"
                                 >
                               <span style="float: left">{{ item.labelname }}</span>
                              <span style="float: right; color: #8492a6; font-size: 14px">{{ item.securityName}}</span>
                             </el-option>
                            </el-select>
                      </el-form-item>

                      <!-- 相当于为 那种非 兼职部门管理员，所作的确认操作，确保 部门和全宗号的对应 -->
                      <el-form-item label="创建部门" prop="departName">
                           <el-select v-model="DepartForm.departName" placeholder="请选择" style="width:192px">
                                 <el-option
                                  v-for="item in DepartIdList"
                                 :label="item.department"
                                 :key="item.department"
                                 :value="item.department">
                              
                              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.department}}</span>
                             </el-option>
                            </el-select>
                      </el-form-item>
                     
                      <el-form-item label="描述" prop="description">
                           <el-input style="width:494px" v-model="DepartForm.description" placeholder=""></el-input>
                      </el-form-item>

                      <el-form-item label="备注" prop="remarks">
                           <el-input style="width:494px"  v-model="DepartForm.remarks" placeholder=""></el-input>
                      </el-form-item>

                    <!-- <el-form-item label="全宗号" prop="username" >
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
                      </el-form-item>  -->
                   <!-- action为上传的api路径，即指向后端controller方法  -->
                   <!-- <el-form-item label="附件" prop="enclosure">
                       <el-upload
                             class="upload-demo"
                             action="http://localhost:8080/ArchivesSystem/document/upload"
                             :on-preview="handlePreview"
                             :on-remove="handleRemove"
                             :before-remove="beforeRemove"
                             multiple
                             :limit="2"
                             :on-exceed="handleExceed"
                             :file-list="fileList">
                         <el-button size="small" type="primary" disabled>点击上传</el-button>
                         <div slot="tip" class="el-upload__tip">只能上传txt/pdf/xls文件，且不超过500kb</div>
                        </el-upload>
                     </el-form-item> -->

                  </el-form>

                  <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="dialogVisible = false;resetForm('DepartForm')">取 消</el-button>
                     <!-- <el-button  icon="el-icon-upload"  @click="uploadEnclosure('DepartForm')" type="success" plain>保存并上传附件</el-button> -->
                     <el-button type="primary"  @click="addDepartment('DepartForm')">保存</el-button>
                  </span>  

         </el-dialog>
          
            <!-- 表格上方的按钮操作-->
            <el-dialog   title="批量导入档案记录" :visible.sync="dialogEnclosure" :close-on-click-modal="true"  width="76%">
                         <div  v-loading="excelloading" 
                               element-loading-text="正在导入档案记录......"
                         > 
                              
                        
                           <el-upload
                             class="upload-demo"
                             ref="uploadExcel"
                             action=" " 
                             :auto-upload='false'
                             accept=".xlsx,xls"
                             :on-preview="handlePreview"
                             :on-remove="handleRemove"
                             :before-remove="beforeRemove"
                             :on-change="handleChange"
                             :http-request="httpRequestExcel"
                             :on-progress="progressA"
                             multiple
                             :limit="3"
                             :on-exceed="handleExceed"
                             :file-list="fileList">
                         
                         <el-button  slot="trigger"  type="primary" size="small"   icon="el-icon-document">选择文件</el-button>
                         <el-button style="margin-left: 10px;" size="small" type="success" icon="el-icon-upload" @click="excelSubmit()"
                         >上传到服务器</el-button>
                         <div slot="tip" class="el-upload__tip">
                             <div> 只能上传Excel文件 </div>
                        </div>
                        </el-upload>

                         </div>

                   <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="dialogEnclosure=false;excelloading=false;reseteditForm('editForm')">取 消</el-button>
                     <el-button type="primary" icon="el-icon-circle-check"  @click="excelloading=false;dialogEnclosure=false">完成添加</el-button>
                  </span>   
                
                      
            </el-dialog>

               <!--  这里是修改档案的方法，其中携带了上传附件等 -->
            <el-dialog  title="修改档案"   :visible.sync="editFormVisible"  width="76%">
                   <el-form   :inline="true" :model="editForm"   ref="editForm"  label-width="80px">
                     <el-form-item label="盒号" prop="boxId">
					             <el-input v-model="editForm.boxId" auto-complete="off"></el-input>
				            </el-form-item>
                    <el-form-item label="件号" prop="itemId">
					             <el-input v-model="editForm.itemId" auto-complete="off"></el-input>
				            </el-form-item>
                     <el-form-item label="题名" prop="title">
					             <el-input v-model="editForm.title" auto-complete="off"></el-input>
				            </el-form-item>
                     
                     <el-form-item label="页数" prop="pageNumber">
					             <el-input v-model="editForm.pageNumber" auto-complete="off"></el-input>
				            </el-form-item>
                    
                      <el-form-item label="描述" prop="description">
					             <el-input type="textarea" style="width:106%" v-model="editForm.description" auto-complete="off"></el-input>
				            </el-form-item>

					            <el-form-item label="附件" prop="enclosure">
                       <el-upload
                             class="upload-demo"
                             action=" "
                             :auto-upload='false'
                             accept=".txt , .pdf , .xls , .doc , .rar , .zip"
                             :on-preview="handlePreview"
                             :on-remove="handleRemove"
                             :before-remove="beforeRemove"
                             :on-change="handleChange"
                             :http-request="httpRequest"
                             ref="upload"

                             multiple
                             :limit="1"
                             :on-exceed="handleExceed"
                             :file-list="fileList">
                         
                         <el-button  slot="trigger"  type="primary" size="small"   icon="el-icon-document">选择文件</el-button>
                         <el-button style="margin-left: 10px;" size="small" type="success" icon="el-icon-upload" @click="submitUpload(editForm.id)">上传到服务器</el-button>
                         <div slot="tip" class="el-upload__tip">
                             <div>  </div>
                                <div v-if="editForm.oldFilename"> 
                                已存附件名称:&nbsp<font size="2" color="blue"> {{editForm.oldFilename}} </font> <br>
                                 <!-- <el-button> 下载 </el-button> -->
                               </div>
                        </div>
                        </el-upload>
                     </el-form-item>
				             <!-- v-if=""  若editForm.oldFilename 不为空则进行显示按钮，否则不显示按钮 -->
                     <el-form-item   v-if="editForm.oldFilename" prop="title">
					                   <el-button 
                              v-loading="editForm.id === indexChangeArch_down[editForm.id]"   
                              element-loading-background="rgba(0, 0, 0, 0)"
                              class="changeArch_download"
                              icon="el-icon-download"
                              @click="downloadEnclosure(editForm.id,editForm)">下载附件</el-button>
				            </el-form-item>
                    
                      <el-form-item  v-if="editForm.oldFilename" prop="title">
					                   <el-button type="danger" plain  icon="el-icon-delete" @click="deleteEnclosure(editForm.id,editForm)" >删除附件</el-button>
				            </el-form-item>
                     

                       
                   </el-form>

                  <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="editFormVisible = false;isShowProgress=false;reseteditForm('editForm')">取 消</el-button>
                     <el-button type="primary" icon="el-icon-circle-check"  @click="changeEdit('editForm')">完成修改</el-button>
                  </span>  
            
            </el-dialog>
             

             <!-- 编写一个新增附件的dialog 该功能为操作列表中的按钮 -->
               <el-dialog  title="上传附件"   :visible.sync="uploadEnclosureVisible"  width="76%">
                       <el-form   :inline="true"  :model="editForm"   ref="editForm"  label-width="80px">
                           <el-form-item label="附件" prop="enclosure">
                           <el-upload
                             class="upload-demo"
                             ref="upload"
                             action=" " 
                             :auto-upload='false'
                             accept=".*"
                             :on-preview="handlePreview"
                             :on-remove="handleRemove"
                             :before-remove="beforeRemove"
                             :on-change="handleChange"
                             :http-request="httpRequest"
                             :on-progress="progressA"
                             multiple
                             :limit="1"
                             :on-exceed="handleExceed"
                             :file-list="fileList">
                         
                         <el-button  slot="trigger"  type="primary" size="small"   icon="el-icon-document">选择文件</el-button>
                         <el-button style="margin-left: 10px;" size="small" type="success" icon="el-icon-upload" @click="submitUpload(editForm.id)">上传到服务器</el-button>
                         <div slot="tip" class="el-upload__tip">
                             <div>  </div>
                               <div v-if="editForm.oldFilename"> 
                                已存附件名称:&nbsp<font size="2" color="blue"> {{editForm.oldFilename}} </font> <br>
                               </div> 
                        </div>
                        </el-upload>
                     </el-form-item>
                     
                     <!-- v-if=""  若editForm.oldFilename 不为空则进行显示按钮，否则不显示按钮 -->
                     <el-form-item   v-if="editForm.oldFilename" prop="title">
					                   <el-button type="primary" plain  icon="el-icon-download" @click="downloadEnclosure(editForm.id,editForm)">下载附件</el-button>
				            </el-form-item>
                     
                      
                    
                      <el-form-item  v-if="editForm.oldFilename" prop="title">
					                   <el-button type="danger" plain  icon="el-icon-delete" @click="deleteEnclosure(editForm.id,editForm)" >删除附件</el-button>
				            </el-form-item>
                     

                       </el-form> 

                   <span slot="footer" class="dialog-footer">
                   
                     <el-button @click="uploadEnclosureVisible=false;isShowProgress=false;reseteditForm('editForm')">取 消</el-button>
                     <el-button type="primary" icon="el-icon-circle-check"  @click="changeEdit('editForm')">完成修改</el-button>
                  </span>   

               </el-dialog> 
               
                 <!-- 查看审核意见的dialog  -->
                 <el-dialog  title="审核意见"   :visible.sync="reviseCommentVisible"  width="76%">
                       <el-form   :inline="true"  :model="reviseCommentForm"   ref="reviseCommentForm"  label-width="80px">
                         <article class="markdown-body"   v-html="reviseCommentForm.reviseComments" ></article> 
                       </el-form> 

                   <span slot="footer" class="dialog-footer">
                   
                     <el-button  type="primary" @click="clearReviseForm('reviseCommentForm')">关闭</el-button>
     
                  </span>   

               </el-dialog> 
               
               
               <!-- <video>

               </video> -->
              
       </div>

        

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
             <el-button v-if="props.row.state=='未通过' || props.row.state=='待提交审核' || UserRolePer =='docu:changeOrdelete' "   
              @click="handleClick(props.$index,props.row)" type="primary" icon="el-icon-edit" 
              size="mini">修改</el-button>
          
          <el-button
          v-if="props.row.state=='未通过' || props.row.state=='待提交审核' || UserRolePer =='docu:changeOrdelete' "
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
           
           <el-button  v-if="props.row.enclosure && props.row.state=='待提交审核' ||  props.row.enclosure && props.row.state=='未通过' || UserRolePer =='docu:changeOrdelete'&&props.row.enclosure"   @click="deleteEnclosure(props.$index,props.row)"  type="danger" size="mini"  icon="el-icon-delete" plain>删除附件</el-button>
           <el-button  v-if="!props.row.enclosure && props.row.state=='待提交审核'|| !props.row.enclosure && props.row.state=='未通过'|| UserRolePer =='docu:changeOrdelete'&&!props.row.enclosure "  @click="handleClick(props.$index,props.row)" type="success"  icon="el-icon-upload" size="mini">上传附件</el-button>
           
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
      prop="taxonNo"
      label="分类号"
      width="100"
      align="center"
      show-overflow-tooltip>
    </el-table-column>
 
   <el-table-column
      prop="taxonTitle"
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
      prop="reviseComments"
      label="审核意见"
      width="100"
      align="center"
      show-overflow-tooltip
      >
        <template slot-scope="scope" >
               <el-button  @click="reviseCommentVisible=true;viewComments(scope.row)"  v-if="scope.row.state ==='未通过' " type="warning" round>查看</el-button>
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
           :type="scope.row.state ==='待提交审核' || scope.row.state=== '未通过' ? 'danger':'success' "
           disable-transitions
           >
             {{scope.row.state}}
           </el-tag>
      </template>
    </el-table-column>
    
     <el-table-column
      prop="checkUsername"
      label="审核人"
      width="89"
      align="center"
      show-overflow-tooltip>
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
          <el-button v-if="scope.row.state=='未通过' || scope.row.state=='待提交审核'  || UserRolePer =='docu:changeOrdelete' "    @click="handleClick(scope.$index,scope.row)" type="text" size="mini">修改</el-button>
          
          <el-button
          v-if="scope.row.state=='未通过' || UserRolePer =='docu:changeOrdelete' || scope.row.state=='待提交审核' "
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
          
           <el-button  v-if="scope.row.enclosure && scope.row.state=='未通过' || scope.row.enclosure && scope.row.state=='待提交审核' || UserRolePer =='docu:changeOrdelete'&&scope.row.enclosure"   @click="deleteEnclosure(scope.$index,scope.row)" type="text" size="mini">删除附件</el-button>
           <el-button  v-if="!scope.row.enclosure && scope.row.state=='待提交审核'  || !scope.row.enclosure && scope.row.state=='未通过' || UserRolePer =='docu:changeOrdelete'&&!scope.row.enclosure "  @click="uploadEnclosureClick(scope.$index,scope.row)" type="text" size="mini">上传附件</el-button>
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
  
  
  <!-- <el-pagination  class="mpage" 
    layout="prev, pager, next"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @current-change = page
    >

  </el-pagination> -->

   <el-pagination class="mpage" 
      background
      @size-change="handleSizeChange"
      @current-change="page"
      :current-page="currentPage"
      :page-sizes="[2,3,5,10,20,100,200,300,500,1000]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
   </el-pagination>
   <br>
   <br>

    <div  class="filter_style"> </div>

   </div>

   </div>

   
</template>

<script>

//import Hello from '../components/hello.vue' 
import Element, { Alert } from 'element-ui'

import "github-markdown-css/github-markdown.css"

 let id = 0;

 export default {
    //引入刷新页面方法
    inject:['reload'],

    methods: {
      //完成上传
      completeUpload(){
          this.fileList = []
          this.multiLoading = false;
          this.reload(); 
      },
      //上传成功后的
      uploadMultiSuccess(response, file, fileList){
             
           console.log(response)

          if(response.data==1){
              
                          clearTimeout(this.timer)
                          this.timer = setTimeout(() => {
                          
                            //Element.Message.success("上传成功！",{duration : 3*1000});
                            this.$notify({
                                      title: '成功',
                                      message:response.fileName + "的附件上传成功！",
                                      type: 'success'
                                   });
                            this.multiLoading = false;
                            //this.reload();
                            // this.fileList =[];

                          }, 3*1000);

	         }
           else if(response.data === "noId"){

             this.$notify({
                           title: '失败',
                           message:response.fileName + "-" + "不存在该附件编号！",
                           type: 'error'
                          });
	            //this.$message.error("上传失败");//文件上传错误提示
              this.multiLoading = false;

	        }else{
              this.$message.error("上传失败");//文件上传错误提示
              this.multiLoading = false;
          }

      
      },
      beforeUpload(){
        
        this.multiLoading = true;

      },
      //批量上传附件的
      aboveUploadEnclosure(){
           
             this.multiEnclosureVisible = true;
           

      },
      //表格上方下载附件
      aboveDownloadEnclosure(){

      console.log(this.$refs.multipleTable.selection)
      
      if(this.$refs.multipleTable.selection.length === 0)
      {
        Element.Message.warning("请选择需要下载的附件！",{duration : 3*1000});
        return
      } 
            for(let i=0;i<this.$refs.multipleTable.selection.length;i++)
            {
              console.log("执行下载",i)
              var arch_id = this.$refs.multipleTable.selection[i].id
              this.editForm = this.$refs.multipleTable.selection[i]
               
              if(this.$refs.multipleTable.selection[i].fileType === "txt[默认]")
              {
                  this.$notify({
                  title: '失败',
                  message: '编号'+arch_id+"的附件不存在！",
                  type: 'error'
                 });
                
              }
              else
              {
              
              this.downloadEnclosure(arch_id,this.editForm,i);
              
              this.$notify({
                 title: '成功',
                 message: '编号'+arch_id+"的附件下载成功！",
                 type: 'success'
                 });
              }

            }
        
      },

     //改变每页大小
     handleSizeChange(pageSize) {

        console.log(`每页 ${pageSize} 条`);
        this.pageSize = pageSize
        this.currentPage = 1  //这里调用，则将currentPage置 为 1
        this.page(this.currentPage);

      },

      //导出excel的操作
      exportExcel(){
       
        console.log("excel导出 输出选中的数据....")
        console.log(this.$refs.multipleTable.selection)

        if(this.$refs.multipleTable.selection.length === 0)
        {
           Element.Message.warning("请选择需要导出的档案记录！",{duration : 3*1000});
           return
         } 
         console.log(this.$refs.multipleTable.selection[0].id)
         console.log(this.$refs.multipleTable.selection.length)
         //将相关的arch_id保存在集合中
         for(var i=0;i<this.$refs.multipleTable.selection.length;i++)
         {
           this.archIds[i] = this.$refs.multipleTable.selection[i].id
         }
         //生成文件名称
        var numberID = Math.round(Math.random()*1000000)

        var excelName = this.$refs.multipleTable.selection[0].departName + "-" + numberID + ".xlsx";
        
         
        this.$axios.get(this.dbURL+'/document/exportExcel?archIds='+this.archIds,{
            headers:{
               "Authorization":localStorage.getItem("token")
            },
             responseType: 'blob',
          }).then(res=>{
            console.log(res)
            
            

            //ok完成，将this.archIds置空
            this.archIds = []

                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   type:'application/octet-stream'
                }); 
                let objectUrl = URL.createObjectURL(blob);
                a.setAttribute("href",objectUrl);
                a.setAttribute("download",excelName);
                a.click()


          }
          )

      },
        //定义一个http-request的函数,该函数用于提交数据附件等信息
      httpRequestExcel(param){
        
            
        let formData = new FormData();
        formData.append("fileList",this.fileList[0].raw);  //置入 文件内容
      
        this.$axios.post(this.dbURL+'/document/importExcel',formData,{
                     headers:{
                         "Authorization":localStorage.getItem("token")//只有超级管理员方可有此功能操作
                     },
                     onUploadProgress: (progressEvent) => {
                        let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        param.onProgress({percent: num})     //进度条
                    }
                  }).then(res=>{
                       
                       if(res.data.data === "no")
                       {
                         
                          Element.Message.error("导入档案记录失败，请认真检查文件格式，且不能导入其他部门的档案",{duration : 3*1000});
                          this.excelloading = false;
                       }
                       else{
                          clearTimeout(this.timer)

                         this.timer = setTimeout(() => {
                           this.excelloading = false;
                            Element.Message.success("导入档案记录成功！",{duration : 3*1000});
                            this.reload();
                          }, 3*1000);
                          //Element.Message.success("导入档案记录成功！",{duration : 3*1000});
                       }
                      // this.excelloading = false
                       
                       this.fileList = [];  //添加成功将其置空
                })
             
      },
      //通过Excel导入档案记录
      excelSubmit(){
         
          if(this.fileList.length === 0)
          {
            Element.Message.error("未选择文件！",{duration : 3*1000});
            return 
          }

         this.excelloading = true;

  
         this.$refs.uploadExcel.submit(); 
      },

      //获取分类号，分类名信息
      getTaxonAndTitle(){
          
      },
    //
     clearReviseForm(value){
         
           this.reviseCommentVisible = false;
          
     },

     //查看审核意见
     viewComments(row){
          //渲染审核
          // var MarkdownIt = require("markdown-it")
          // var md = new MarkdownIt()
          // var result = md.render(row.reviseComments)  //内容渲染
          // row.reviseComments = result
          
          this.reviseCommentForm = Object.assign({},row) 
           
     },
     getReviseComments(row){
      
            var MarkdownIt = require("markdown-it")
            var md = new MarkdownIt()
            var result = md.render(row.reviseComments)  //内容渲染
            row.reviseComments = result
            
            this.reviseCommentForm = Object.assign({},row) 
     },
    //提交审核档案记录的操作
    subCheckForArch(){
      
      console.log(this.$refs.multipleTable.selection)
      
      if(this.$refs.multipleTable.selection.length === 0)
      {
        Element.Message.warning("请选择需要提交审核的档案记录！",{duration : 3*1000});
        return
      } 

      let archid = this.$refs.multipleTable.selection[0].id //档案id

      for(let i=0;i<this.$refs.multipleTable.selection.length;i++)
        {
            //this.uptodeleteEnclosure(this.$refs.multipleTable.selection[i].id)
            this.checkForArch(this.$refs.multipleTable.selection[i].id)
        }
        //this.reload()
              
    },   //提交审核的操作
    checkForArch(archid){
      

        this.$axios.get(this.dbURL+'/document/tocheckarch?arch_id='+archid,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log(res)
            
            if(res.data.data == "okcheck")
            {
              this.$notify({
                 title: '成功',
                 message: '编号'+archid+"的档案已成功提交审核！",
                 type: 'success'
                 });
               
            }
            else if(res.data.data=="checknow")
            {
              this.$notify.warning({
              title: '重复提交',
              message: '编号'+archid+"的档案已在审核中！"
              });
            }else if(res.data.data === "checkover")
            {
              this.$notify.success({
              title: '重复提交',
              message: '编号'+archid+"的档案已归档！"
              });
            }


          });   

    },

      //查询数据的操作
      searchIndex(){
            // alert(this.keyinput)
            this.$router.push('/arch_search');
             //带参数跳转
            //this.$router.push({path:'/test',query:{setid:123456}});

      },
        //获取到属于该管理员所管理的全宗号，即部门id,depart_id，当然也可以直接获取到部门名称即责任者
      getIdAndTitle(){   ///当点击新增加档案的时候就调用了该方法
          const _this = this
          this.$axios.get(this.dbURL+'/document/getIdAndName',{
            headers:{
                 "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log("这里是获取全宗号与责任者的操作！！")
              console.log(res)
              this.DepartIdList = res.data.data
              
          })
      },
      // esyear(rule,value,callback){
      //      alert(value)
      //      if(!value)
      //      {
      //        callback(new Error('年份不能为空！'));
      //      }
      // },
      //上传附件之前先将数据进行保存，保存后获取到相关的数据档案表档案的id 1001或其他
      uploadEnclosure(formName){
              this.addDepartment(formName)
              
              if(this.addok)  //为true则弹出
              {
                 clearTimeout(this.timer);  //清除延迟执行
                 this.timer = setTimeout(()=>{   //设置延迟执行
                   this.dialogEnclosure = true //先新增后再上传附件
                 },1000);
                 
                 this.addok = false;  //执行过一次后就设置为false
              }
              
              
          
      },
      //添加附件的
      addEnclosure(){
          console.log("It can reserve something for the manager!")
          //获取到选中的那行数据
          console.log(this.$refs.multipleTable.selection)
          console.log(this.$refs.multipleTable.selection[0].id)  
          //将数据保存到一个集合中，之后将数据循环出来，之后再分别的进行一个个的附件上传即可

      },
      //下载附件的操作，若为视频文件则直接使用a标签进行下载即可
      downloadEnclosure(id,editPage,index){
           //alert(id); 这个id为 编号，也是独一无二的
          //直接进行访问这样也能进行下载
          //groupName,remoteFilePath
          //http://123.56.127.215/

          if(editPage.fileType == "mp4")
          {
            console.log("这里是视频的操作")
            let a = document.createElement('a')
            a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
            window.open(a.href)
            //a.click(); 
            
          }
          else {
          
          this.indexTempDownload[id] = id;   //设置 1012 = this.indexTempDownload[1012] = 1012
          this.indexChangeArch_down[id] = id;

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

                this.indexTempDownload[id] =""; //当下载到数据进行置空停止Loading
                this.indexChangeArch_down[id] = "";
          })
          }
          // let a = document.createElement('a')
          // // a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
          // a.href=this.dbURL+"/document/download?arch_id="+id;
          // a.click();
 


      },

      //预览页面，预览txt,pdf,doc,xls，ppt
      // 若为 mp4等视频文件，则直接进行访问其路径即可group,remotepath即可
      filePreview(index,editPage){
          
           
          // let a = document.createElement('a')
          //  a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
          // //a.href=this.dbURL+"/document/previewfile";
          // a.click();
        
          this.isloading = true

          if(editPage.fileType == "mp4")
          {
            console.log("这里是浏览视频的操作")
            let a = document.createElement('a')
            a.href="http://123.56.127.215/"+editPage.groupName+"/"+editPage.remoteFilePath;
            
            // let objectUrl = window.URL.createObjectURL(blob);
            window.open(a.href)

           // a.click();
          }
          else {
           /*视频预览不必显示按钮，该indexTemp用于保存id若id相等为true值，以便判断是否显示 Loading */
          this.indexTemp[editPage.id] = editPage.id
          this.indexTempFirst[editPage.id] = editPage.id

          this.$axios({
            method:'GET',
            url:this.dbURL+'/document/previewPdfFile?arch_id='+editPage.id,
            headers:{"Authorization":localStorage.getItem("token")},
            //responseType: 'arraybuffer'
            responseType: 'blob'
          }).then(res=>{
                console.log("excute  previewFile ...")
                console.log(res)
                console.log(res.data)
                
                this.indexTemp[editPage.id] = " ";
                this.indexTempFirst[editPage.id] = ""; //成功预览则关闭Loading


                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   //type:'application/pdf'   //也是必不可少的
                   type:res.data.type
                }); 
                let objectUrl = window.URL.createObjectURL(blob);
                window.open(objectUrl)
                
                

                console.log("输出indexTemp:")
                console.log(index)
                console.log(this.indexTemp[index])
                

                // a.setAttribute("href",objectUrl);
                // //a.setAttribute("download", editPage.oldFilename);
                // a.click()
                console.log(res.data.type)
                
          })

          }
          
          //window.open(this.dbURL+'/document/previewfile');
         // window.open(",'_blank").location.href = this.dbURL+'/document/previewfile'
 
      },
     //删除附件
     deleteEnclosure(index,editForm){
          
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
           this.$axios.get(this.dbURL+'/document/deletefile?arch_id='+editForm.id,{
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

    //表格上方的通过勾选表格进行删除附件的方法,
    //且若没选择数据，则无法执行，且删除的操作，需要权限验证，若没有相应的
    //enclosure:delete，检查其是否在馆，若状态为在馆，无法删除，只有提供相关权限方可
    //而若是待归档时可以删除
    aboveDelEnclosure(){
      console.log("表格上方删除附件的操作")
      console.log(this.$refs.multipleTable.selection)
      
      if(this.$refs.multipleTable.selection.length === 0)
      {
        Element.Message.warning("请选择需要删除的附件！",{duration : 3*1000});
        return
      } 

      let archid = this.$refs.multipleTable.selection[0].id //档案id

      /* 批量删除的操作，这里就应该进行循环的发送请求即可，若有的不能删除给出反馈信息 */
      /* 再写一个删除方法这里来调用即可 */
     this.$confirm('此操作将永久删除选中的附件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            //发送请求
            for(let i=0;i<this.$refs.multipleTable.selection.length;i++)
            {
              console.log("执行删除",i)
              this.uptodeleteEnclosure(this.$refs.multipleTable.selection[i].id)
            }
            
           this.reload()
           
           this.page(1) //重新获取表格数据
          
        }).catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        
      console.log(this.$refs.multipleTable.selection[0].id)

    },
   //配置删除附件的方法
   uptodeleteEnclosure(archid)
   {
            console.log("there is archid ")
            this.$axios.get(this.dbURL+'/document/updelenclosure?arch_id='+archid,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log(res)
            console.log(res.data.data)
            if(res.data.data == "delok")
            {
              this.$notify({
                 title: '成功',
                 message: '编号'+archid+"的附件删除成功！",
                 type: 'success'
                 });
               
            }
            else if(res.data.data=="nodel")
            {
              this.$notify.error({
              title: '错误',
              message: '编号'+archid+"的附件未删除成功！"
              });
            }
          
            //this.reload();  //调用刷新方法

          });
   },

   //选择的操作，tabel的选择的操作 //表格选择的selection
    handleSelectionChange(val) {
        this.multipleSelection = val;
        //再定义其他方法来使用 multipleSelection选择的表格
        let sel = this.$refs.multipleTable.selection
        console.log("输出table:")
        console.log(sel)
        
    },

      getAdminName(){
          this.$axios.post(this.dbURL+"/department/getadmininfo",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
             console.log(res)
             this.adminName = res.data.data
             console.log(this.adminName)
             console.log(this.adminName[0].account)

          })
        },  
      
      //添加档案，
      addDepartment(formName){
          
            // console.log(this.DepartForm.taxonNo)  //获取 分类号
            // this.DepartForm.taxonNo = this.DepartForm.taxonNo[2];
            // console.log(this.DepartForm.taxonNo)

             console.log("这里是添加档案文件的操作")
             var YearTwoL =  Object.keys(this.DepartForm.establishYear).length

            if(YearTwoL == 0)
            {  
                Element.Message.warning("归档年份未选择",{duration : 3*1000});
                return 
            }

             console.log(this.DepartForm.establishYear)

             var newyear = new Date(this.DepartForm.establishYear)  //将时间转为Date形式
             console.log(newyear)
             this.DepartForm.establishYear = newyear  //置入其中
             
             //分类号
             this.DepartForm.taxonNo = this.DepartForm.taxonNo[2];

            this.$refs[formName].validate((valid)=>{
               if(valid)
               {
                 console.log(this.DepartForm)
                //添加档案的操作，添加成功后，返回
                this.$axios.post(this.dbURL+'/document/add_docu',this.DepartForm,{
                  headers:{
                      "Authorization":localStorage.getItem("token")
                 }
                }).then(res=>{
                      if(res.data.code === 401)
                      {
                        Element.Message.error("添加失败，权限未激活，请先进行归档材料审核！",{duration : 3*1000});
                      }
                      else if(res.data.code === 402)
                      {
                        Element.Message.error("添加失败，"+res.data.msg,{duration : 3*1000});
                      }
                      else{
                         Element.Message.success("添加成功！",{duration : 3*1000});
                      }
                    
                       this.reload(); //刷新一下
                })
                 this.addok = true  //表示已添加成功，可以启动上传附件
                 this.dialogVisible=false   //添加成功则关闭
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
         //点击表格的操作，修改的操作
         handleClick(index,row) 
         {
            //点击修改则将之前的fileList情况
            //this.fileList = [];    //清空
            this.showForuser = true
            this.hiddenForMore = false 
            this.editFormVisible = true
            this.editForm = Object.assign({},row)   //将表格中数据填充到新的表单中 editForm 中
         },
         //上传附件的操作，
         uploadEnclosureClick(index,row){
                
                this.uploadEnclosureVisible = true  //让dialog显示出来
                this.editForm = Object.assign({},row)   //将表格中数据填充到新的表单中 editForm 中
         },
        
        //点击表格删除的操作和记录附件
        deleteRow(index,rows,row) {
          
          //  alert(row.id) //获取到该行的id，然后axios请求将该id的档案进行删除，这样岂不妙哉
         this.$confirm('此操作将永久删除该档案记录和已存附件 , 是否继续 ? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then(() => {
           
            this.$axios.get(this.dbURL+'/document/delete_arch?arch_id='+row.id,{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
            }).then(res=>{
               console.log(res)
               rows.splice(index, 1);
               
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
           
           
         
         },  //取消修改 
         reseteditForm(formName){
              console.log("执行了吗？清空数据，包括文件")
              this.fileList = [];

         },
         //完成修改
         changeEdit(formName){
          
          // this.editFormVisible = false
          // this.uploadEnclosureVisible = false; //令上传框也隐藏
            
          this.changeFormData.boxId = this.editForm.boxId
          this.changeFormData.title = this.editForm.title
          this.changeFormData.itemId = this.editForm.itemId
          this.changeFormData.pageNumber = this.editForm.pageNumber
          this.changeFormData.description = this.editForm.description
          this.changeFormData.id = this.editForm.id

          console.log(this.changeFormData)
          var titlelength =  Object.keys(this.editForm.title).length
          if(titlelength === 0)
          {
             Element.Message.warning("题名不能为空",{duration : 3*1000});
             return;
          }
          

           this.$axios({
            method:'GET',
            url:this.dbURL+'/document/modifyarch',
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.changeFormData,

           }).then(res=>{
                  console.log(res)
                  this.changeFormData = "";
                  Element.Message.success("修改成功",{duration : 3*1000});
                  this.reload();
          })
        
         this.editFormVisible = false
          this.uploadEnclosureVisible = false; //令上传框也隐藏

         },
         //修改某一列
         handleEdit(index, row) {
                console.log(index, row);
                //alert(row.id)
          },
         
      //查询全部立档部门的信息,这是只有超级管理员方可查询的信息，应该给予相应的token方可
      //查询属于它自己的档案信息，非超级管理员，假设现在是一个兼职档案员在操作
      //首先需要传递token，获取它的相应的身份权
      page(currentPage)
      {
          
          //置入当前页数提交页数
          this.$store.commit("SET_COUNTCURRENTPAGE",currentPage);
          
          const _this = this
          this.$axios.get(this.dbURL+'/document/getdocuforone?currentpage='+currentPage+"&pageSize="+this.pageSize,{
            headers:{
              "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log("archpages' data ")

              console.log(res)
              console.log(res.data.arch_pages.records)

              console.log(res.data.UserPermission)    //角色 需要进行保存一下
              //this.UserRole = res.data.role.role   //保存角色到UserRole中 
              //这样的话，虽然不是root角色但是只要申请到了该权限，则同样可以进行操作
              this.UserRolePer = res.data.UserPermission.UserPermission

              //_this.tableData = res.data.data.records

              _this.tableData = res.data.arch_pages.records
             
               _this.currentPage = res.data.arch_pages.current
              _this.total = res.data.arch_pages.total
              _this.pageSize = res.data.arch_pages.size


              //处理时间,提取年份即可
              console.log(_this.tableData[0].establishYear[0])

              for(let i in _this.tableData)
              {   
                  // console.log(i)
                 _this.tableData[i].establishYear = _this.tableData[i].establishYear[0]
                 //console.log(_this.tableData[i].establishYear)
              }
             
              console.log("tabledata:"+_this.tableData)
              console.log("*********************评论的**************")
              for(let i in _this.tableData)
              {    
                  if(_this.tableData[i].reviseComments!=null)
                     {  //注意需要是不为空的
                        var MarkdownIt = require("markdown-it")
                        var md = new MarkdownIt()
                        var result = md.render(_this.tableData[i].reviseComments)  //内容渲染
                       _this.tableData[i].reviseComments = result
                     }
              }
             
             
          })
          //若token已失效，则给出提示，让重新登录即可

      },
      // //选择的操作，tabel的选择的操作
      // handleSelectionChange(val) {
      //   this.multipleSelection = val;
      //   //再定义其他方法来使用 multipleSelection选择的表格
      //   let sel = this.$refs.multipleTable.selection
      //   console.log("输出table:")
      //   console.log(sel)
        
      // },
      //文件上传的各个函数
      handleRemove(file, fileList) {  //删除文件时
        console.log("handleRemove:")
        console.log(file, fileList);
      },
      handlePreview(file) {  //点击已上传文件出现
        console.log("handlePreview")
        console.log(file);
      },
      handleExceed(files, fileList) {  //限制文件的操作
        console.log("handleExceed")
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {  //删除文件
        console.log("beforeRemove:")
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //文件上传状态改变时调用
      handleChange(file,fileList){  //这里可以获取到文件数据
        console.log("调用change")
        console.log(fileList)
        this.fileList = fileList  //将文件数据保存在fileList数组中
      },
      //定义一个http-request的函数,该函数用于提交数据附件等信息
      httpRequest(param){
        console.log("这里是进行上传httpRequest = are you ok!")
            //得到了arch_id 
        console.log(this.archs_id)

        var arch_id = this.archs_id
            
        let formData = new FormData();
        formData.append("fileList",this.fileList[0].raw);  //置入 文件内容
        formData.append("arch_id",arch_id);  //置入 档案编号id 是档案表的唯一标识

        // {"Content-Type": "multipart/form-data;charset=utf-8"}

        this.$axios.post(this.dbURL+'/document/upload',formData,{
                     headers:{
                         "Authorization":localStorage.getItem("token")//只有超级管理员方可有此功能操作
                     },
                     onUploadProgress: (progressEvent) => {
                        let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        param.onProgress({percent: num})     //进度条
                    }
                  }).then(res=>{
                       console.log("刷新页面")
                       this.reload();

                       Element.Message.success("上传成功！",{duration : 3*1000});
                       this.fileList = [];  //添加成功将其置空
                })
             
      },
      //点击上传文件到服务器，这里都是一个个的上传
      submitUpload(id) {
          if(this.fileList.length === 0)
          {
            Element.Message.error("未选择文件！",{duration : 3*1000});
            return 
          }

         this.archs_id = id 
         this.$refs.upload.submit();  //触发http-request函数，即可httpRequest()函数

        // if(this.fileList.length === 0)
        // {
        //   Element.Message.error("未选择文件！",{duration : 3*1000});
        //   return 
        // } 
        //this.isShowProgress = true //若有文件则让进度条显示出来

        console.log("档案编号id:"+id) 
         /* 
        // let formData = new FormData();
        // formData.append("fileList",this.fileList[0].raw);  //置入 文件内容
        // formData.append("arch_id",id);  //置入 档案编号id 是档案表的唯一标识
        // // {"Content-Type": "multipart/form-data;charset=utf-8"}
        // this.$axios.post(this.dbURL+'/document/upload',formData,{
        //              headers:{
        //                  "Authorization":localStorage.getItem("token")//只有超级管理员方可有此功能操作
        //              }
                  
        //           }).then(res=>{
                       
        //                Element.Message.success("上传成功！",{duration : 3*1000});
        //                this.fileList = [];  //添加成功将其置空
        //                setTimeout( () => {this.isShowProgress = false}, 1000)  //上传成功关闭进度条

        //                console.log(res);  //获取到相关的档案id，即document表的id    
        //                console.log("上传档案ok")
        //                console.log(res.data)   
        //         })
            */

        //this.$refs.upload.submit();

      },
       /**     文件正在上传时的钩子    **/
      progressA(event, file) {},
      
      /*这里是 表格上方的按钮的操作 */
      submitUp2(){
        this.$refs.uploadTwo.submit();  //在之前upload之前，然后点击这个确认触发http-request
      },
     
    
      //表格的过滤器操作
      clearFilter() {
        this.$refs.multipleTable.clearFilter();
      },
      
      formatter(row, column) {
        //alert(row.createdUsername)
        return row.createdUsername;
      },
      filterTag(value, row) {
        return row.securityTime === value;
      },
       //这是状态state的过滤方法
      filterState(value,row){
  
        return row.state === value;
       },
      //这个是保管时间的过滤方法
      filterStorageTerm(value,row){
          
        return row.storageTerm === value;
      },
      
      
      
    },
    created(){
        //页面一启动就调用方法page
        console.log("这里是page")
        //获得之前的页数
        // alert("local currentpage")
        // alert(localStorage.getItem("countCurrentPage"))
         
        if(localStorage.getItem("countCurrentPage"))
        {  /* 执行这里 */
           this.page(localStorage.getItem("countCurrentPage"))
        } 
        //this.page(1)
     

    },

    data() {
      return {
        //添加一个保存arch_id的操作
        archIds:[],
        multiEnclosureVisible:false, //批量上传附件
        multiurl:this.dbURL+'/document/mUploadEnclosure',  //批量上传的路径
        multiLoading:false,
        token: localStorage.getItem('token'),  //将该token置入 上传附件的操作中

        /////////////
        tableData:{}, //这个即为档案部门的的信息
        currentPage:1,  //默认为 1
        total:0,
        pageSize:5,  //默认为 5
        visible: false,  //删除的提示框
        //选择框的操作
        multipleSelection: [],
        //multipleTable:[],   //存放选中的值
        //保管时间的数组
        storTime:[{timename:'永久',labelname:'forever'},{timename:'1年',labelname:'a year'},{timename:'5年',labelname:'five years'},{timename:'10年',labelname:'decade'}],
        //密级的选择
        securityGrade:[{securityName:'无',labelname:'no'},{securityName:'秘密',labelname:'secret'},{securityName:'机密',labelname:'confidential'},{securityName:'绝密',labelname:'top-secret'}],
       //全宗号id 与 部门名称 责任者
       DepartIdList:{
         departId:'',  //全宗号
         department:''  //部门名称，即责任者
        },
        //用户的角色的权限，若该角色拥有该权限则可以进行操作
        UserRolePer:'',
        //文件地址  http://123.56.127.215/group1/M00/00/00/rBGmz2Br0FWABGmOAAAAZfrNWLM251.txt
        //         http://123.56.127.215/group1/M00/00/00/rBGmz2Bm9lGAH-SgAABAABP3TZ0740.xls
        URLfILE:'http://123.56.127.215/group1/M00/00/00/rBGmz2Br0FWABGmOAAAAZfrNWLM251.txt',

       //上传文件保存在这里面
        fileList: [],
        //展示弹窗
        dialogVisible:false,
        dialogEnclosure:false,
        editFormVisible:false,   //这个是编辑框修改的的变量
        //设置一个变量判断是否成功添加 
        addok:false,
        //是否隐藏或显示
        ischange:false,
        //隐藏一些table里面的列 ，并且显示一些功能键
        showForuser:false,
        hiddenForMore:true,
        //进度条的数据设置
        percentage:0,  //进度条的百分比，初始未 0 
        customColor: '#409eff',
        isShowProgress:false,   //是否显示进度条的布尔值
        //输入数据进行查询档案的操作，输入 题名，附件名称，内容都可以进行查询
        keyinput:'', 

        //loading样式的
        isloading:false,
        indexTempFirst:[],  //保存第一个
        indexTemp:[],   //index数值存在里面
        indexTempDownload:[],  //下载的Loading
        indexChangeArch_down:[],  //修改档案Loading真假判断
        //上传附件的操作列表中的上传附件的按钮的变量
        uploadEnclosureVisible:false,
        //用个id来保存档案表id
        archs_id:'',

        //编辑界面数据
        editForm:{
          id:'',
          title:'',
          establishYear:'',
          boxId:'',
          itemId:'',
          pageNumber:'',
          description:'',
        },  //修改的操作
        changeFormData:{
          id:'',
          title:'',
          boxId:'',
          itemId:'',
          pageNumber:'',
          description:'',
        },
        //新增档案时的
        DepartForm: {        //这里是新增档案,这个也是必不可少的不然无法显示
          departId:'',
          boxId:'',
          itemId:'',
          establishYear:'',
          createdTime:'',
          title:'',
          pageNumber:'',
          storageTerm:'',
          securityClassification:'',
          departName:'',
          description:'',
          remarks:'',
          taxonNo:'', //分类号
                     //附件的操作
        },
        //输入的校验规则，若不能满足则无法进入下一步
        DepartRules:{
             departId:[
                 { required: true, message: '请选择全宗号', trigger: 'change' }
              ],
              taxonNo:[{ required: true, message: '请选择分类号', trigger: 'change' }],
              boxId:[
                 { required: true, message: '请输入盒号', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ],
              itemId:[
                 { required: true, message: '请输入件号', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ],
              establishYear:[
                 {required: true, message: '请选择年份', trigger: 'change' }
              ],
              createdTime:[
                {required: true, message: '请选择时间', trigger: 'change' }
              ],
              title:[
                 { required: true, message: '请输入题名', trigger: 'blur' },
                 { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
              ],
              pageNumber:[
                 { required: true, message: '请输入页数', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ],
              storageTerm:[
                 { required: true, message: '请选择保管时间', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ],
              securityClassification:[
                 { required: true, message: '请选择密级', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ],
              departName:[
                 { required: true, message: '请选择责任者', trigger: 'blur' },
                 { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
              ] 
              
        }
        ,     //昵称 和 账号
         adminName:{
            account:'',
            nickname:''
         },
        value: '',  //值

        //过滤器的操作，这个是保密期限的过滤器
        security_Store_filters:[
           {text:'无',value:'无'},
          {text:'永久',value:'永久'},
          {text:'1年',value:'1年'},
          {text:'5年',value:'5年'},
          {text:'10年',value:'10年'},
          {text:'20年',value:'20年'}
        ],

       Store_filters:[ 
          {text:'永久',value:'永久'},
          {text:'1年',value:'1年'},
          {text:'5年',value:'5年'},
          {text:'10年',value:'10年'},
          {text:'20年',value:'20年'}
          ],
        
        State_filters:[
          {text:'待提交审核',value:'待提交审核'},
          {text:'审核中',value:'审核中'},
          {text:'未通过',value:'未通过'},
          {text:'待实体归档',value:'待实体归档'},
          {text:'已归档',value:'已归档'}
        ],

        //审核意见的dialog
        reviseCommentVisible:false,
        reviseCommentForm:{
           reviseComments:'',
        },

        //记住已渲染过的id
        reviseId:[],
        
        excelloading:false,
        timer:'',

        //级联选择器
         optionsForTaxonNo: [
          {
          value: 'DQ',
          label: '党群',
          children: [
            {
            value: 'DQ11',
            label: '党务综合',
                  children:[
                    {
                      value:'DQ11',
                      label:'DQ11'
                    }
                  ]
            }, 
            {
            value: 'DQ12',
            label: '纪检、监察',
            children:[
                    {
                      value:'DQ12',
                      label:'DQ12'
                    }
                  ]
            },
            {
              value: 'DQ13',
              label: '组织、离退休',
              children:[
                    {
                      value:'DQ13',
                      label:'DQ13'
                    }
                  ]
            },
            {
              value: 'DQ14',
              label: '宣传教育、党校',
              children:[
                    {
                      value:'DQ14',
                      label:'DQ14'
                    }
                  ]
            },
            {
              value: 'DQ15',
              label: '统战（民主党派）',
              children:[
                    {
                      value:'DQ15',
                      label:'DQ15'
                    }
                  ]
            },
            {
              value: 'DQ16',
              label: '工会（职工代表大会）',
              children:[
                    {
                      value:'DQ16',
                      label:'DQ16'
                    }
                  ]
            },
            {
              value: 'DQ17',
              label: '共青团（学生社团活动）',
              children:[
                    {
                      value:'DQ17',
                      label:'DQ17'
                    }
                  ]
            }
            ]
        },
        {
          value: 'XZ',
          label: '行政',
          children: [
            {
            value: 'XZ11',
            label: '行政综合',
                  children:[
                    {
                      value:'XZ11',
                      label:'XZ11'
                    }
                  ]
            }, 
            {
            value: 'XZ12',
            label: '人事（师资培养）',
            children:[
                    {
                      value:'XZ12',
                      label:'XZ12'
                    }
                  ]
            },
            {
              value: 'XZ13',
              label: '审计',
              children:[
                    {
                      value:'XZ13',
                      label:'XZ13'
                    }
                  ]
            },
            {
              value: 'XZ14',
              label: '保卫',
              children:[
                    {
                      value:'XZ14',
                      label:'XZ14'
                    }
                  ]
            },
            {
              value: 'XZ15',
              label: '后勤',
              children:[
                    {
                      value:'XZ15',
                      label:'XZ15'
                    }
                  ]
            },
            {
              value: 'XZ16',
              label: '图书、情报',
              children:[
                    {
                      value:'XZ16',
                      label:'XZ16'
                    }
                  ]
            },
            {
              value: 'XZ17',
              label: '外事',
              children:[
                    {
                      value:'XZ17',
                      label:'XZ17'
                    }
                  ]
            }
            ]
        },
        {      //教学档案
          value: 'JX',
          label: '教学',
          children: [
            {
            value: 'JX11',
            label: '教学综合',
                  children:[
                    {
                      value:'JX11',
                      label:'JX11'
                    }
                  ]
            }, 
            {
            value: 'JX12',
            label: '专业设置及实验室建设',
            children:[
                    {
                      value:'JX12',
                      label:'JX12'
                    }
                  ]
            },
            {
              value: 'JX13',
              label: '招生工作',
              children:[
                    {
                      value:'JX13',
                      label:'JX13'
                    }
                  ]
            },
            {
              value: 'JX14',
              label: '学籍管理（学生奖惩、毕业材料）',
              children:[
                    {
                      value:'JX14',
                      label:'JX14'
                    }
                  ]
            },
            {
              value: 'JX15',
              label: '课堂教学与实践',
              children:[
                    {
                      value:'JX15',
                      label:'JX15'
                    }
                  ]
            },
            {
              value: 'JX16',
              label: '学位工作',
              children:[
                    {
                      value:'JX16',
                      label:'JX16'
                    }
                  ]
            },
            {
              value: 'JX17',
              label: '教学研究',
              children:[
                    {
                      value:'JX17',
                      label:'JX17'
                    }
                  ]
            },
            {
              value: 'JX18',
              label: '教材',
              children:[
                    {
                      value:'JX18',
                      label:'JX18'
                    }
                  ]
            },
            {
              value: 'JX19',
              label: '研究生学位论文',
              children:[
                    {
                      value:'JX19',
                      label:'JX19'
                    }
                  ]
            },
            {
              value: 'JX20',
              label: '本（专）科生毕业论文',
              children:[
                    {
                      value:'JX21',
                      label:'JX21'
                    }
                  ]
            },
            {
              value: 'JX21',
              label: '教学实习与实验',
              children:[
                    {
                      value:'JX22',
                      label:'JX22'
                    }
                  ]
            }
            ]
        },
        // 科学研究生档案 
        {      
          value: 'KY',
          label: '科学研究',
          children: [
            {
            value: 'KY11',
            label: '科研管理',
                  children:[
                    {
                      value:'KY11',
                      label:'KY11'
                    }
                  ]
            }, 
            {
            value: 'KY12',
            label: '学术论文',
            children:[
                    {
                      value:'KY12',
                      label:'KY12'
                    }
                  ]
            },
            {
              value: 'KY13',
              label: '科研项目代号',
              children:[
                    {
                      value:'KY13',
                      label:'KY13'
                    }
                  ]
            }
            ]
        },
        ///////////基本建设档案
        {      
          value: 'JJ',
          label: '基本建设',
          children: [
            {
            value: 'JJ11',
            label: '综合',
                  children:[
                    {
                      value:'JJ11',
                      label:'JJ11'
                    }
                  ]
            }, 
            {
            value: 'JJ12',
            label: '基建项目代号',
            children:[
                    {
                      value:'JJ12',
                      label:'JJ12'
                    }
                  ]
            }
            ]
        },
         //////////仪器设备档案
        {      
          value: 'SB',
          label: '仪器设备',
          children: [
            {
            value: 'SB11',
            label: '综合',
                  children:[
                    {
                      value:'SB11',
                      label:'SB11'
                    }
                  ]
            }, 
            {
            value: 'SB12',
            label: '设备项目代号',
            children:[
                    {
                      value:'SB12',
                      label:'SB12'
                    }
                  ]
            },
            ]
        },
        //产品生产与科技开发档案
        {      
          value: 'CP',
          label: '产品生产与科技开发',
          children: [
            {
            value: 'CP11',
            label: '综合',
                  children:[
                    {
                      value:'CP11',
                      label:'CP11'
                    }
                  ]
            }, 
            {
            value: 'CP12',
            label: '产品项目代号',
            children:[
                    {
                      value:'CP12',
                      label:'CP12'
                    }
                  ]
            },
            ]
        },
       ///////////CB 出版档案
       {     
          value: 'CB',
          label: '出版',
          children: [
            {
            value: 'CB11',
            label: '综合',
                  children:[
                    {
                      value:'CB11',
                      label:'CB11'
                    }
                  ]
            }, 
            {
            value: 'CB12',
            label: '大学校报',
            children:[
                    {
                      value:'CB12',
                      label:'CB12'
                    }
                  ]
            }
            ]
        },
      //财会
      {     
          value: 'CK',
          label: '财会',
          children: [
            {
            value: 'CK11',
            label: '综合',
                  children:[
                    {
                      value:'CK11',
                      label:'CK11'
                    }
                  ]
            }, 
            {
            value: 'CK12',
            label: '会计报表',
            children:[
                    {
                      value:'CK12',
                      label:'CK12'
                    }
                  ]
            },
            {
              value: 'CK13',
              label: '会计帐簿',
              children:[
                    {
                      value:'CK13',
                      label:'CK13'
                    }
                  ]
            },
            {
              value: 'CK14',
              label: '会计凭证',
              children:[
                    {
                      value:'CK14',
                      label:'CK14'
                    }
                  ]
            },
            {
              value: 'CK15',
              label: '工资清册',
              children:[
                    {
                      value:'CK15',
                      label:'CK15'
                    }
                  ]
            }
            ]
        },
      ////////////  实物档案
      {   
          value: 'SW',
          label: '实物',
          children: [
            {
            value: 'SW11',
            label: '题词、题字、画册、签名簿',
                  children:[
                    {
                      value:'SW11',
                      label:'SW11'
                    }
                  ]
            }, 
            {
            value: 'SW12',
            label: '奖状、证书（校级以上）',
            children:[
                    {
                      value:'SW12',
                      label:'SW12'
                    }
                  ]
            },
            {
              value: 'SW13',
              label: '奖牌、牌匾、奖杯、锦旗（校级以上）',
              children:[
                    {
                      value:'SW13',
                      label:'SW13'
                    }
                  ]
            },
            {
              value: 'SW14',
              label: '作废印章',
              children:[
                    {
                      value:'SW14',
                      label:'SW14'
                    }
                  ]
            },
            {
              value: 'SW15',
              label: '校庆纪念品',
              children:[
                    {
                      value:'SW15',
                      label:'SW15'
                    }
                  ]
            },
            {
              value: 'SW16',
              label: '学校互访礼品、纪念品',
              children:[
                    {
                      value:'SW16',
                      label:'SW16'
                    }
                  ]
            }
            ]
        },
         ///////////// 声像档案
        {      
          value: 'SX',
          label: '声像',
          children: [
            {
            value: 'SX11',
            label: '照片',
                  children:[
                    {
                      value:'SX11',
                      label:'SX11'
                    }
                  ]
            }, 
            {
            value: 'SX12',
            label: '录音带',
            children:[
                    {
                      value:'SX12',
                      label:'SX12'
                    }
                  ]
            },
            {
              value: 'SX13',
              label: '录像带',
              children:[
                    {
                      value:'SX13',
                      label:'SX13'
                    }
                  ]
            },
            {
              value: 'SX14',
              label: '幻灯片',
              children:[
                    {
                      value:'SX14',
                      label:'SX14'
                    }
                  ]
            },
            {
              value: 'SX15',
              label: '磁盘',
              children:[
                    {
                      value:'SX15',
                      label:'SX15'
                    }
                  ]
            },
            {
              value: 'SX16',
              label: '胶片',
              children:[
                    {
                      value:'SX16',
                      label:'SX16'
                    }
                  ]
            },
            {
              value: 'SX17',
              label: '缩微胶片',
              children:[
                    {
                      value:'SX17',
                      label:'SX17'
                    }
                  ]
            },
            {
              value: 'SX18',
              label: '光盘',
              children:[
                    {
                      value:'SX18',
                      label:'SX18'
                    }
                  ]
            }
            ]
        },
     ///////////////底图档案
     {     
          value: 'DT',
          label: '底图',
          children: [
            {
            value: 'DT11',
            label: '科研底图',
                  children:[
                    {
                      value:'DT11',
                      label:'DT11'
                    }
                  ]
            }, 
            {
            value: 'DT12',
            label: '基建底图',
            children:[
                    {
                      value:'DT12',
                      label:'DT12'
                    }
                  ]
            },
            {
              value: 'DT13',
              label: '产品底图',
              children:[
                    {
                      value:'DT13',
                      label:'DT13'
                    }
                  ]
            }
            ]
        },

        ]
      ////////////// 下一个




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

  /* .enclosureCss{
      margin: 0 auto;
      width: 20px;
      text-align: center;
  } */

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

  .upload-progress-position{
     /* position: absolute; */
     left:200px;
     top:200px;
  }

 /* .el-loading-spinner .circular{
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
  } */

.LodingFirst  .el-loading-spinner{
  background-size: 48px 48px;
  width: 100%;
  height: 100%;
  /* position: relative; */
  
} 

.LodingFirst  .el-loading-spinner .path{
    stroke-dasharray: 94,150;
    stroke-dashoffset: 0;
    stroke-width: 4;
    stroke: #60ff40;
    stroke-linecap: round;
}


.LodingTwo .el-loading-spinner{
  /* background: url(../assets/img/BG.jpg) no-repeat; */
  background-size: 48px 48px;
  /* width: 100%;
  height: 100%; */
  /* position: relative; */
  color: chartreuse;
  position:relative;
  top: 50%;
  right:41%;
} 

.LodingTwo  .el-loading-spinner .path{
    stroke-dasharray: 100,150;
    stroke-dashoffset: 0;
    stroke-width: 3;
    stroke: #404dff;
    stroke-linecap: round;
}

.DownloadLoadingFirst .el-loading-spinner .path{
    stroke-dasharray: 100,150;
    stroke-dashoffset: 0;
    stroke-width: 4;
    stroke: #404dff;
    stroke-linecap: round;
}

.DownloadLoadingTwo .el-loading-spinner .path{
    stroke-dasharray: 100,150;
    stroke-dashoffset: 0;
    stroke-width: 4;
    stroke: #40ffb6;
    stroke-linecap: round;
}

.changeArch_download .el-loading-spinner .path{
    stroke-dasharray: 100,150;
    stroke-dashoffset: 0;
    stroke-width: 4;
    stroke: #40ffb6;
    stroke-linecap: round;
}

.filter_style{
    position:absolute;
    top:1%;
}


</style>