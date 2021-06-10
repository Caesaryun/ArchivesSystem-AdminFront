<template>
   <div id="contact">
          <div>
                  
             <el-row :gutter="20">
            
            <el-col :span="12">
               
                <el-card  class="card-contact-one" shadow="hover">

                      <div v-for="o in 1" :key="o" class="text item">
                           <div class="user-avator"><img src="../../assets/img/BG.jpg"></div>          
                           <div class="user-name"><font color="white"> {{ username }} </font> </div>
                           <br>
                      </div>
                      <hr>
                      <br>
                       <!-- <router-link :to="{path:'arch_contact',query:{user:o}}"> -->
                     <div id="user" v-for="(item,i) in UserInfo" :key="i" class="text item" >
                           <router-link  :to="{path:'arch_talk'}"  @click.native="getUser(item)">
                             <div class="user-avator"><img src="../../assets/img/sea.jpeg"></div>          
                             <div class="user-name"><font color="white"> {{item}}</font></div>
                             <br>
                           </router-link>
                      </div>


                     
                </el-card>
               
            </el-col>
            <!-- @scroll="scroll" -->
             <div v-if="!user"> 进入聊天吧！ </div>
            <el-col :span="12" v-if="user">
                <el-card class="card_two" shadow="hover">
                        <h3>正在对 &nbsp;<font color="#409EFF">{{user}}</font> 发起聊天&nbsp;&nbsp; 
                         <!-- <font v-if="state" size="2" color="#409EFF">{{state}}</font> <font v-if="!state" size="2" color="red">未在线</font>  -->
                      </h3>
                       
                        <br>
                        <hr style="margin-top:1%">
                       
                       
                        <div  id="message-no" >
                            <div class="chat-box">
                            <div class="msg-box" ref="msg-box">
                                
                             <div v-for="(i,index) in list" :key="index" class="msg"  
                                 :style="i.userId == userId?'flex-direction:row-reverse':''"> 

                             <!-- <i class="username-style">{{i.username}}</i>      -->
                             <div class="user-head">
		                         <!-- <img  src="../../assets/img/sea.jpeg" height="40" width="40"  :title="i.username"> -->
                              <img  src="../../assets/img/sea.jpeg" height="40" width="40"  :title="i.username">
                            </div>

                              <!-- <i class="username-style">{{i.username}}</i> -->

                               <div class="user-msg">
		                       <span :style="i.userId == userId?' float: right;':''" :class="i.userId == userId?'right':'left'">{{i.content}}</span>
		                      </div>

                                 </div>

                              
                               </div>
                         </div>

                        </div>
                       
                        <el-input class="input-mess" ref="sendMsg" type="textarea" v-model="inputmessage"  @keyup.enter.native="send()"  placeholder="请输入内容"></el-input>

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

import Vue from 'vue'

import Element from 'element-ui'
 
export default{
   
    inject:['reload'],

   data(){ 
       return {
            path:"ws://localhost:8080/ArchivesSystem/webtalk/",
            socket:"",
            inputmessage:'',  //输入的消息
            username:this.$store.getters.getUser.username,
            userId:this.$store.getters.getUser.id,
            avatar:'', 

            //UserInfo:[{name:"Mike"},{name:"15524558529"},{name:"Tom"},{name:"群 group-1"}],
            UserInfo:[],

            user:'',  //默认为 1
            
            //自己的消息
            selfmessage:'',
            
            list:[], //聊天记录的数组
            
            state:"",  //在线状态

        };
     },
     mounted(){
            console.log("一打开页面就执行上线...");
            this.websocket();
          
     },
    watch:{
        
    },

   methods: {
        
       scroll(){

       },
        //获取params值
       getUser(o){
          
           this.user = o;
           
           this.state = ""; //将状态置空
          
          console.log("list ..........")

          console.log(this.list)
      
          console.log(this.list.length)

          var arrLength = this.list.length

          if(this.list.length > 0)
          {
             for(var i=0;i<arrLength;i++)
             {
                 console.log("删除...." + i)
                 this.list.splice(i,5);
             }
            
             this.list.splice(0,5)
            
          }

           this.websocket();
           
       },
     
       websocket(){
          
           this.username = this.$store.getters.getUser.username
           console.log(this.username)
           console.log(this.user)
            

           if('WebSocket' in window)
           {
              this.socket = new WebSocket(this.path+this.username)

              console.log(this.socket)

              this.socket.onopen = this.onopen();
              
              this.socket.onmessage = evt =>{
                
                 console.log(evt)
                 this.onmessage(evt)
                 
              }
             
             this.socket.onclose = function(event){
                console.log("关闭...")
             }
              
           }
           else{
             alert("浏览器不支持")
           }
          
       },
       
       onopen(){
            //this.setMessageInnerHTML("连接成功")
            console.log("连接成功！");
       },

       onclose(){
         
           console.log("连接关闭");
          
       },
       onmessage(e){
           console.log("收到从后端 别人发来 的消息...xx");
           console.log(e)
        
           let resData = JSON.parse(e.data)
           console.log(resData)

           if(resData.length>0)
           { 
               for(var i=0;i<resData.length;i++)
               {
                 let userjson = JSON.parse(resData[i])
                 console.log(userjson)
                 this.UserInfo[i] = userjson.username
                 console.log("userinfo....");
                 console.log(this.UserInfo)
                 Vue.set(this.UserInfo,i,this.UserInfo[i])  //修改数组的值，及时更新
                 
               }
           }

           if(resData.systemMessage !=null)
           {
             this.$notify({
                    title: '系统广播',
                    message:resData.systemMessage,
                    duration: 0
              });

           }
           
           
           console.log("state : ",this.state)
           
           if(resData.msg == null)
           {
             return;
           }

          console.log("发送消息给 to : ", resData.to)  //15524558529
          if(this.user===resData.username)
          {

            this.list = [...this.list,{userId:resData.userId,username:resData.username,avatar:resData.avatar,content:resData.msg}]
            
          }


           if(this.username === resData.username)
           {
             this.list = [...this.list,{userId:resData.userId,username:resData.username,avatar:resData.avatar,content:resData.msg}]
                
           }
           else{

             Element.Message.success("有来自 " + resData.username + "的新消息！",{duration : 3*1000});

           }

          //this.list = [...this.list,{userId:resData.userId,username:resData.username,avatar:resData.avatar,content:resData.msg}]
                
          //  if(this.user === resData.username )
          //  {
          //       //Element.Message.success("有来自 " + resData.username + "的新消息！",{duration : 3*1000});
          //       this.list = [...this.list,{userId:resData.userId,username:resData.username,avatar:resData.avatar,content:resData.msg}]
                
          //       console.log(this.list)
                
          //  }
         
          //  if(this.user === resData.to)
          //  {
          //    this.list = [...this.list,{userId:resData.userId,username:resData.username,avatar:resData.avatar,content:resData.msg}]
                
          //  }
           //Element.Message.success("有来自 " + resData.username + "的新消息！",{duration : 3*1000});

           
        
       },

       closeWebSocket(){
           
            console.log("关闭的方法..")
            this.socket.close();
       },

       setMessageInnerHTML(innerHtml){
             console.log("执行显示.......")
            // document.getElementById('message').innerHTML += innerHtml + '<br/>'; 

       },
      
       selfMessageInnerHTML(innerHtml)
       {
           //document.getElementById('selfmessage').innerHTML += innerHtml + '<br/>'; 
       },

       send(){
         
          //this.selfMessageInnerHTML(this.inputmessage)
          let _this = this;
          _this.$refs["sendMsg"].focus();
          if(!_this.inputmessage)
          {
              return;
          }


          console.log("发送消息...")
          let params ={
              userId:_this.userId,
              username:_this.username,
              avatar:_this.avatar,
              msg:_this.inputmessage,
              count:_this.count,
              to:this.user,  //发送给谁...
          };
          
          

          //对消息拼接,
        //   var mess = {"from":this.username,"to":this.user,"msg":this.inputmessage};
        //   mess = JSON.stringify(mess)  //转换为让后端能接收的 json格式
        

          this.socket.send(JSON.stringify(params))  //发送给后端
        
          this.inputmessage = "";
          setTimeout(() => {
          _this.scrollBottom();
          }, 500);


       },
      //滚动条到底部
      scrollBottom(){
          let el = this.$refs["msg-box"];
          el.scrollTop = el.scrollHeight;
      },
     
       

    },
   destroyed(){
         this.closeWebSocket();  //离开，自动执行退出在线
   },
   created(){
        //this.websocket();
       
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

    /* /////////////// */


 .username-style{
		 margin-top:-10%;
		 /* margin-left: -15%; */
     font-size: 2px;
	}
	
	.chat-box{
		margin: 0 auto;
		background: #fafafa;
		position: absolute;
		height: 58%;
		width:50%;
		max-width: 680px;
		
	}
	
	.msg-box{
		position: absolute;
		/* height: calc(100% - 6.5rem); */
		width:100%;
		margin-top: 3rem;
		overflow-y: scroll;
		height: 200px;
		/* background-color: white; */

	}
	
	.msg {
	  width: 95%;
	  min-height: 2.5rem;
	  margin: 1rem 0.5rem;
	  position: relative;
	  display: flex;
	  justify-content: flex-start !important;
	  }
	  
	  .user-head {
	    min-width: 2.5rem;
	   /* width: 20%; */
	    width: 2.5rem;
	    height: 2.5rem;
	    border-radius: 50%;
	    background: #f1f1f1;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		  background-image: url(../../assets/img/sea.jpeg);
      margin: 0 1%;
		}
		
		.user-msg {
		  width: 80%;
		/* // position: absolute; */
		  word-break: break-all;
		  position: relative;
		  z-index: 5;
		  }
		  
		.user-msg  span {
		    display: inline-block;
		    padding: 0.5rem 0.7rem;
		    border-radius: 0.5rem;
		    margin-top: 0.2rem;
		    font-size: 0.88rem;
		  }
	
	.left {
	  background:wheat;
	  animation: toLeft 0.5s ease both 1;
	}
	.right {
	  background: #53a8ff;
	  color: white;
	  animation: toright 0.5s ease both 1;
	}
	
	@keyframes toLeft {
	  0% {
	    opacity: 0;
	    transform: translateX(-10px);
	  }
	  100% {
	    opacity: 1;
	    transform: translateX(0px);
	  }
	}
	
	@keyframes toright {
	  0% {
	    opacity: 0;
	    transform: translateX(10px);
	  }
	  100% {
	    opacity: 1;
	    transform: translateX(0px);
	  }
	}
	
	.input-box {
	 /* padding: 0 0.5rem; */
	 
	  position: absolute;
	 /* bottom:0; */
	  width: 95%;
	  height:3.5rem;
	 
	  background: #fafafa;
	  box-shadow: 0 0 5px #ccc;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-top: 56%;
	  }
	  
	/* .input-box input{
	   height: 2.3rem;
	   display: inline-block;
	   width:140%;
	   padding: 0.5rem;
	   border: none;
	   border-radius: 0.2rem;
	   font-size: 0.88rem;
	 } */
	 
	/* .btn {
	   height: 2.3rem;
	   min-width:5.4rem;
	   background: #e0e0e0;
	  padding: 0.6rem;
	  padding-top:1.18rem;
	   font-size: 0.88rem;
	   color: white;
	   text-align: center;
	   border-radius: 0.2rem;
	   margin-left:0rem;
	   transition: 0.5s;
	   
	 } */
	 
	 /* .btn-active {
	   background: #409eff;
	 } */


 .el-notification__content{
         color: white;
 }

 .el-notification__title{
   color:rgb(228, 233, 180);
   font-size: 18px;
 }

 


</style>