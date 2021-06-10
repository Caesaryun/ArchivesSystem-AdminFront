<template>
   <div id="created_index"   v-loading="loading_index" 
                             element-loading-background="rgba(0,0,0,0.6)"
                             element-loading-text="正在创建索引中...">


         <el-card class="box-card">
                <el-button type="success" plain @click="createIndex">点击创建索引</el-button>   
        </el-card>
        
   </div>
</template>

<script>

//import Hello from '../components/hello.vue' 
import Element from 'element-ui'

export default{
    
    inject:['reload'],


   data(){ 
       return {
            loading_index:false,

                  
         };
     },
   methods: {
        
        createIndex(){
            this.loading_index = true;

         this.$axios({
            method:'GET',
            url:this.dbURL+'/document/createIndex',
            headers:{"Authorization":localStorage.getItem("token")},
          }).then(res=>{
               
               console.log(res)
               
               this.loading_index = false;

                 if(res.data.data == 1)
                 {
                     
                    Element.Message.success("创建索引成功！",{duration : 3*1000});
                 }
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
   
   #created_index{
           width: 100%;
           height: 100%;
   }


   .box-card {
    width: 67%;
    margin-left: 15%;
  }

</style>