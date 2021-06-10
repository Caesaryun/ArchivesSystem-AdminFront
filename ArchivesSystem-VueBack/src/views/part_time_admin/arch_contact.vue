<template>
   <div id="contact">
          <div>
                  
             <el-row :gutter="20">
            
            <el-col :span="12">
               
                <el-card  class="card-contact-one" shadow="hover">

                      <div v-for="o in 1" :key="o" class="text item">
                           <div class="user-avator"><img src="../../assets/img/BG.jpg"></div>          
                           <div class="user-name"><font color="white"> {{'用户自己 ' + o }} </font> </div>
                           <br>
                      </div>
                      <hr>
                      <br>
                       <!-- <router-link :to="{path:'arch_contact',query:{user:o}}"> -->
                     <div id="user" v-for="o in UserInfo" :key="o" class="text item" >
                           <router-link  :to="{path:'arch_contact'}"  @click.native="getUser(o)">
                             <div class="user-avator"><img src="../../assets/img/sea.jpeg"></div>          
                             <div class="user-name"><font color="white"> {{'用户 ' + o.name }} </font> </div>
                             <br>
                           </router-link>
                      </div>


                     
                </el-card>
               
            </el-col>
            <!-- @scroll="scroll" -->
             <div v-if="!user"> 进入聊天吧！ </div>
            <el-col :span="12" v-if="user">
                <el-card class="card_two" shadow="hover">
                        <h3>Contact &nbsp;<font color="#409EFF">{{user}}</font></h3>
                       
                        <br>
                        <hr style="margin-top:1%">
                        <div  id="message-no" >
                               
                                <div id="message"></div>

                                <div id="selfmessage"></div>

                        </div>
                       
                        <el-input class="input-mess" type="textarea" v-model="inputmessage"  @keyup.enter.native="send()"  placeholder="请输入内容"></el-input>

                        <!-- <el-button type="success"  @click="send()" icon="el-icon-s-promotion">发送消息</el-button> -->
                </el-card>
            </el-col>


        </el-row>
                
                
                
         <!-- <div  id="message"></div> -->     
         <!-- <el-input  v-model="inputmessage" placeholder="请输入内容"></el-input> -->
         <!-- <el-button type="success"  @click="send()" icon="el-icon-s-promotion">发送消息</el-button> -->   
         
          <!-- 
               <hr>
               <el-button type="primary"  @click="closeWebSocket()">关闭</el-button> 
            -->
          </div>


  </div>

</template>

<script>

 
export default{
   
    inject:['reload'],

   data(){ 
       return {
            path:"ws://localhost:8080/ArchivesSystem/websocket/",
            socket:"",
            inputmessage:'',
            
            username:'',
            
            UserInfo:[{name:"Mike"},{name:"15524558529"},{name:"Tom"},{name:"群 group-1"}],
            
            user:'', 
            
            //自己的消息
            selfmessage:'',
            
            list:[], //聊天记录的数组
            

        };
     },
     mounted(){
           
            this.websocket();

     },
    watch:{
        
    },

   methods: {
        
       scroll(){

       },
        //获取params值
       getUser(o){
          
           this.user = o.name;
           //this.$router.push('/arch_contact?user='+this.user);

           document.getElementById('message').innerHTML = ''; 
           document.getElementById('selfmessage').innerHTML = '';  

            //跳转页面为空

           this.websocket();
           
       },
     
       websocket(){
           //保存username，获取当前用户
           this.username = this.$store.getters.getUser.username
           console.log(this.username)
           console.log(this.user)
            

           if('WebSocket' in window)
           {
              this.socket = new WebSocket(this.path+this.username+"/"+ this.user)

              console.log(this.socket)
              this.socket.onopen = this.onopen();
              //this.socket.onmessage = this.onmessage();
              this.socket.onmessage = evt =>{
                 //console.log("接收到从后端的信息")
                 console.log(evt)
                 this.onmessage(evt)
                 //this.setMessageInnerHTML(evt.data)
              }

              //this.socket.onclose = this.onclose();
           }
           else{
             alert("浏览器不支持")
           }
          
       },
       
       onopen(){
            this.setMessageInnerHTML("连接成功")
       },
       onclose(){
           this.setMessageInnerHTML("websocket连接关闭")
           this.socket.onclose();
       },
       onmessage(evt){
           console.log("收到从后端 别人发来 的消息...xx");
           
           this.setMessageInnerHTML(evt.data);
       },

       closeWebSocket(){
            //this.onclose();
            console.log("关闭的方法..")
            this.onclose();
       },

       setMessageInnerHTML(innerHtml){
             console.log("执行显示.......")
             document.getElementById('message').innerHTML += innerHtml + '<br/>'; 

       },
      
       selfMessageInnerHTML(innerHtml)
       {
           document.getElementById('selfmessage').innerHTML += innerHtml + '<br/>'; 
       },

       send(){
         
          this.selfMessageInnerHTML(this.inputmessage)

          console.log("发送消息...")
          
          //对消息拼接,
          var mess = {"from":this.username,"to":this.user,"msg":this.inputmessage};
          mess = JSON.stringify(mess)  //转换为让后端能接收的 json格式
          
          console.log(mess)

          this.socket.send(mess)  //发送给后端
        
          this.inputmessage = "";
       },

     
       

    },
   destroyed(){
         this.closeWebSocket();

   },
   created(){
        

    },
   components:{
       // Hello 
     }
}
</script>

<style >
    #message-no{
        width:100%;
        height:310px;
        overflow: auto;
        /* background-color:rgb(239, 245, 236); */
        
    }




.el-row {
        margin-bottom: 20px;
    }

    .card-contact-one{
        /* //width:240px; */
        width: 44%;
        margin-left: 10%;
        margin-top: 1%;
        background-color: rgba(5, 4, 4, 0.7);
        height: 455px;
    }

   .card_two{
         margin-top: 1%;
         margin-left: -49%;
         width: 137%;
   }

   .input-mess .el-textarea__inner{
          /* line-height:-10; */
          height: 94px;
          margin-top: -5%;
          width: 100%;
   }

   
        .user-avator {
            margin-left: 20px;

        }

        .user-avator img {
            display: block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

      .user-name{
           margin-left: 34%;
           margin-top: -14%;
      }

    #user:hover{
         background-color: rgba(197, 236, 213, 0.8);

    }

    #selfmessage{
        margin-left: 40%;
        font-size: 17px;
        color: blue;
    }

    #message{
        font-size: 17px;
        color: rgb(37, 66, 72);
        /* background-color:rgba(197, 236, 213, 0.8) ; */
    }

    
 

</style>