<template>
   <div id="testapp23">
            <el-card class="box-card3333"  
            v-loading="pictLoading" element-loading-background="rgba(234,254,236, 0.5)"
            element-loading-text="正在归还中！"
            >
                  <div  class="back_one">
                     <h2>归还档案</h2>
                     <br>
                    <el-select
                       v-model="borrowId"
                       multiple
                   
                       filterable
                       
                       remote
                       reserve-keyword
                       placeholder="请输入借阅号"
                       :remote-method="remoteMethod"
                       :loading="loading">
                     <el-option
                     v-for="item in optionsborrow"
                     :key="item.value"
                     :label="item.value"
                     :value="item.value">
                </el-option>
              </el-select> 

               &nbsp; &nbsp;
               <el-select
                       v-model="arch_id"
                       multiple
                       filterable
                       remote
                     
                       reserve-keyword
                       placeholder="请输入数字档案id"
                       :remote-method="remoteMethodForArch"
                       :loading="loading">
                   <el-option
                     v-for="item in optionsarch"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                </el-option>

              </el-select>
              
                &nbsp; &nbsp;
                  <el-button type="primary"  @click="back_arch">点击归还</el-button>
               </div>

         </el-card>
            
   </div>
</template>

<script>

import Element from 'element-ui'

export default{
   inject:['reload'],
   
   data(){ 
       return {
            borrowId:'',
            arch_id:'',
            
            borrowNo:'',
            archNo:'',

        optionsborrow: [],   // orgList
        value: [],
        list: [],
        loading: false,
        states: [],     //alOrds
       
        optionsarch:[],
        listarch:[],
        statesarch:[],
        

        commonBorrow:{},
         
        pictLoading:false,


         };
     },
   mounted() {
      this.getBorrowId();
      this.getBorrowArchId();

    },
   methods: {
           //归还档案处理，一般的操作的话，就输入，相关的 借阅号即可，若无借阅号，输入userid与档案数字编号即可
         
         back_arch(){
           
          this.pictLoading = true;

          console.log(this.borrowId)

           if (this.arch_id.length != 0 || this.borrowId.length!=0)
          {
           this.borrowNo = this.borrowId[0]
           this.archNo = this.arch_id[0]
           
           this.commonBorrow.id = this.borrowNo
           this.commonBorrow.archId = this.archNo

          this.$axios({
            method:'GET',
            url:this.dbURL+'/common-borrow/return_arch',
            headers:{"Authorization":localStorage.getItem("token")},
            // params:{
            //    borrowId:this.borrowNo,
            //    arch_id:this.archNo
            // },
            params:this.commonBorrow,

           }).then(res=>{

                  console.log(res)
                  this.pictLoading = false; 
                  
                  if(res.data.data == "havedone")
                  {
                     Element.Message.warning("已归还成功？或数据更新遇到不可抗力导致事务中断，请联系超级管理员！",{duration : 3*1000});
                  }
                  else{
                     Element.Message.success("已成功归还档案！",{duration : 3*1000});
                  }
                 
                  this.reload();
                 
                })
             }
             else{
                Element.Message.warning("至少有一个不为空",{duration : 3*1000});
             }

      },
      //查询所有的档案id
      getBorrowArchId(){
        
        this.$axios({
            method:'GET',
            url:this.dbURL+'/common-borrow/getborrowid',
            headers:{"Authorization":localStorage.getItem("token")},
            
           }).then(res=>{

             this.statesarch = res.data.data
            
             this.listarch = this.statesarch.map(item => {
                          return { value: `${item.archId}`, label: `${item.archId}` };
                    });


          })
      },
      //进入这个页面及将所有的借阅记录获取
      getBorrowId(){

            this.$axios({
            method:'GET',
            url:this.dbURL+'/common-borrow/getborrowid',
            headers:{"Authorization":localStorage.getItem("token")},
            // params:{
            //    borrowId:this.borrowId,
            //    revisecomments:this.commentForm.reviseComments
            // },
            
           }).then(res=>{

             //this.optionsborrow = res.data.data
             this.states = res.data.data
            
             this.list = this.states.map(item => {
                          return { value: `${item.id}`, label: `${item.id}` };
                    });


          })
      },
   //archid 
   remoteMethodForArch(query){
           if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;  //将数据置入 optionsborrow中
            this.optionsarch = this.listarch.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.optionsarch = [];
        }
   },

    remoteMethod(query) {
      
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;  //将数据置入 optionsborrow中
            this.optionsborrow = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.optionsborrow = [];
        }
      }

    },
   created(){
            this.getBorrowId();
            this.getBorrowArchId();

    },
   components:{
       // Hello 
     }
}
</script>

<style>
.box-card3333{
     margin-top: 2%;
     padding-bottom: 10%;
     background-color: rgb(240, 226, 199);
}
   .back_one
   {
       margin-left: 24%;
       margin-top: 3%;
   }
</style>