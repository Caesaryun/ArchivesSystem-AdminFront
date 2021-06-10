<template>
   <div id="testapp22">
          <el-card class="box-card33" v-if="true">
            <!-- 这里提供下载模板的地方，然后编辑放在另一个页面或建一个dialog，但只有二级管理员之上才有资格编辑 --> 
            <el-button type="primary" @click="upload" >点击上传档案导入模板</el-button>   
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
              
    },
   created(){
   
    },
   components:{
       // Hello 
     }
}
</script>

<style>


#testapp22{
      height: 600px;
}

  .box-card33{
    width: 67%;
    margin-left: 15%;
  }

  
</style>