<template>
   <div id="testapptemplate"> 
  
        <el-card class="box-card222">
                 <!-- 这里提供下载模板的地方，然后编辑放在另一个页面或建一个dialog，但只有二级管理员之上才有资格编辑 -->
                 <el-button type="success" @click="downloadTemplate" icon="el-icon-download">点击下载档案导入模板</el-button>
                 
        </el-card>

          
         <el-card class="box-card222">
           <h3>教程</h3>
               <el-collapse accordion>
  <el-collapse-item>
    <template slot="title">
      第一步<i class="header-icon el-icon-info"></i>
    </template>
    <div>点击下载档案导入模板</div>
    <div></div>
  </el-collapse-item>
  <el-collapse-item title="第二步">
    <div>填写模板</div>
    <div></div>
  </el-collapse-item>
  <el-collapse-item title="第三步">
    <div>选择档案操作，点击导入excel</div>
    <div></div>
    <div></div>
  </el-collapse-item>
  <el-collapse-item title="第四步">
    <div>对需要上传的附件进行编号，且保证附件编号与填写的档案excel模板中一致</div>
    <div>选择批量附件上传</div>
    <div><img src="http://123.56.127.215/success.jpeg" class="image222"></div>
  </el-collapse-item>
</el-collapse>
        </el-card>

        
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
        
        //用户下载模板的操作
        downloadTemplate() {
       
           
           this.$axios({
            method:'GET',
            url:this.dbURL+'/document/getTemplate',
            headers:{"Authorization":localStorage.getItem("token")},
            responseType: 'blob'
          }).then(res=>{
               
                let a = document.createElement('a');
                let blob = new Blob([res.data],{
                   type:'application/octet-stream'
                }); 
                let objectUrl = URL.createObjectURL(blob);
                a.setAttribute("href",objectUrl);
                a.setAttribute("download","导入档案的Excel模板.xlsx");
                a.click()

              })
           
            
      },




    },
   created(){
   
    },
   components:{
       // Hello 
     }
}
</script>

<style>

#testapptemplate{
      height: 600px;
}


  .box-card222 {
    width: 67%;
    margin-left: 15%;
  }

  .image222 {
    width: 100%;
    display: block;
  }



</style>