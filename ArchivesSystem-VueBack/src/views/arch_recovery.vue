<template>
   <div id="testapprecovery">


<el-card class="box-card">
            
  <el-upload
  class="upload-demo"
  ref="upload"
  action=" "
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-change="handleChange"
  :file-list="fileList"
   :http-request="httpRequest"

  :auto-upload="false"
  >
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">点击恢复数据</el-button>
  
</el-upload>

</el-card>


         


   </div>
</template>
   
<script>
  import Element from 'element-ui'


export default {
          inject:['reload'],

    data() {
      return {
        fileList: [],


      };
    },
    methods: {

      httpRequest(param){
        console.log(this.fileList)

        let formData = new FormData();
        formData.append("fileList",this.fileList[0].raw);  //置入 文件内容
       
    
        this.$axios.post(this.dbURL+'/backups-mysql/recoverybackups',formData,{
                     headers:{
                         "Authorization":localStorage.getItem("token")//只有超级管理员方可有此功能操作
                     },
                     onUploadProgress: (progressEvent) => {
                        let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        param.onProgress({percent: num})     //进度条
                    }
                  }).then(res=>{
                       console.log("hello world .............");

                       Element.Message.success("恢复成功",{duration : 3*1000});
                       this.fileList = [];  
                })
                

      },

      submitUpload() {
       
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleChange(file,fileList){  //这里可以获取到文件数据
        console.log("调用change")
        console.log(fileList)
        this.fileList = fileList  //将文件数据保存在fileList数组中
      },

    },


  }

</script>

<style>
  
  

  .box-card {
    width: 500px;
    height:400px;
    margin-left: 25%;
  }

</style>