<template>
   <div id="testapp">
          <div class="div-detail-one">
               <h3>档案题名： </h3> 
               <h3>归档年度： </h3> 


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
        /* 开始渲染即得到传递来的id,name用params path用 query */
        const arch_Id = this.$route.query.arch_Id

        console.log(arch_Id)

       //alert(arch_Id)
    },
   components:{
       // Hello 
     }
}
</script>

<style>
   
</style>
