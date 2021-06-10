<template>
   <div id="poster">
        <div class="title-form">

	  </div>
    <div  class="form3">
		  <div>
			  <!-- <a href="#/qrcode_login"><img v-if="isShow" style="margin-left:84.6%;width:70px;height:70px;" src="http://tb2.bdstatic.com/tb/static-common/widget/login_dialog/imgs/ic_login_code_2d81599.png">
			       </a> -->
			 <a href="#/login"> 
               <img  v-if="isShow" style="margin-left:85%;width:70px;height:70px;" 
                src="http://tb2.bdstatic.com/tb/static-common/widget/login_dialog/imgs/ic_login_password_413f650.png">
		         </a>
		  </div>
	      
		   <span style="margin-top:-4%;margin-left:14.2%" class="font-ui">管理员登录</span>
            <span style="margin-top:-7%;margin-left:27.5%;color:#">请使用<font color="white">ARchivesApp</font>扫码登录</span>
           <div>
                 <img  
                 style="margin-left:22%;margin-top:6%;"
                 width="255px" 
                 height="255px"
                 :src="codeImg">
          </div>
			 
			
         </div>
		 
		   
		<div class="form2">
			
			<!-- 这里是下一片div -->
		</div> 


   </div>
</template>

<script>

import Element from 'element-ui'

export default{
   data(){ 
       return {

               isShow:true, 
               src:'http://passport.baidu.com/v2/api/qrcode?sign=v1_0e595831c0e2183cd6e6d4badbbcf&lp=pc&qrloginfrom=pc',
               num:0,
               polling:'',
               codeImg:'',

         };
     }, 
   methods: {
         //进入这个页面就开始登录的请求
         getLoopLogin(timeout = 15000){
             this.polling = window.setInterval(() => {
                  setTimeout(this.qr_login(), 0);
              }, 3500);
         },
          //获取二维码信息，每次点开就获取一次即可
          getQRcode(){
        
           this.$axios({
                
                method:'GET',
                url:this.dbURL+'/common-accessborrow/getqrcode',
                 //responseType: 'arraybuffer'
                responseType: 'blob'
                }).then(res=>{

                     console.log(res)
                     let a = document.createElement('a');
                     let blob = new Blob([res.data],{
                      //type:'application/pdf'   //也是必不可少的
                       type:res.data.type
                      }); 
                     let objectUrl = window.URL.createObjectURL(blob);
                     this.codeImg = objectUrl
                     console.log(this.codeImg)

                 });

          },
          //请求登录，看看是否登录
          qr_login(){
              console.log("请求第 ：" + this.num + "次登录...");
              this.num++;
            const _this = this

             this.$axios.post(this.dbURL+'/common-accessborrow/login').then(res=>{
                
                console.log(res)
                if(res.data.data == "nokey")
                {
                      //Element.Message.warning("nokey！",{duration : 3*1000});
                      //this.$router.push("/qrcode_login");
                }
                else if(res.data.data.msg == "yes")
                {
                   Element.Message.success("成功登录！",{duration : 3*1000});
                   const jwt = res.headers['authorization']
                   const userInfo = res.data.data
			       _this.$store.commit("SET_TOKEN",jwt);  //保存token信息
				   _this.$store.commit("SET_USERINFO",userInfo)
                   const isexcute = 0  //0表示第一次执行
                  _this.$store.commit("SET_ISGETMENU",isexcute);

                   this.$router.push("/home")
                }

				
		   })


          },   
                  
    },
   created(){  //轮番访问

        //    window.setInterval(() => {
        //           setTimeout(this.qr_login(), 0);
        //       }, 5000);
        this.getQRcode();

        this.getLoopLogin();

    },
    beforeRouteLeave(to,from,next){
         next();
         console.log("终止轮询！")
         if(this.polling){
             clearInterval(this.polling);
             this.polling = null;
         }
         
    },

   components:{
       // Hello 
     }
}
</script>

<style>

  

  #poster {
	/* background: url(../assets/sea.jpeg) no-repeat; */
    background-image: url(../assets/img/sea.jpeg);
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
	overflow: auto;  /* 让边框超出后可下滑*/

  }
  
  body{
    margin: 0px;
    padding: 0;
  }
 
  .form3{
	  /* background: url(../assets/ArchivesSystemLogo.gif) no-repeat; */
	   /* background-image:url(../assets/img/as11.gif); */
	   margin-top: 1%;
	   height: 420px;
	   width: 465px;
	   margin-left: 31%;
	   border: 0px  solid #660d35;
	  /* background-color: rgba(75, 81, 95, 0.3); */
	   background-color: rgba(75, 81,97, 0.2);
	   box-shadow: 15px 14px 10px rgba(52, 56, 66, 0.5);
	   border-radius: 7px;
  }
 
  /* position:absolute */
  .demo-ruleForm{
	  position: absolute;  
	  width: 380px;
	  margin-top: 12%;
	  margin-left: 1%;
  }
 
  
   .labelname  .el-form-item__label{
	 /* background-color: rgba(66, 94, 255, 0.8); */
	  color: white;
	  font-size: 18px;
	  border-radius: 11px;
	  padding: 0 21px 0 0;
   }
  
  /* 将星号去掉 */
  .demo-ruleForm .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before
   {
	   content: ' ';
   }
    
  
   .labelpwd  .el-form-item__label{
	  /* background-color: rgba(66, 94, 255, 0.8); */
	  color: white;
	  font-size: 18px;
	  border-radius: 11px;
	  padding: 0 25px 0 0;
	   
   }
   
   
   .form2{
	   height: 200px;
	   width: 100px;
   }
   
   
   .font-ui{
	   position: absolute;
	   color:black;
	   margin-left: 13%;
	   margin-top:5%;
	   font-size: 25px;
	   
	   font-family:楷体;
   }
   
   
   div.el-form-item__error{
	   
	   box-shadow: 10px 10px 20px rgba(52, 56, 66, 0.7);
	   background-color: rgba(251, 255, 239, 0.5);
	   border-radius:4px;
	   color: red;
	   font-size: 15px;
   }
   
   .title-form{
	   /* background-color:rgba(251, 255, 239, 0.2); */
	  /* background:url(../assets/ArchivesSystemLogo.gif) no-repeat; */
     /*  text-align: center; */
      /* line-height: 60px; */
	   height: 70px;
	   width: 100%; 
	   
	   background-position: center;
	   margin-top: 4px;
	   
   } 
   
   .inputname .el-input__inner{
	    background-color: rgba(255, 255, 255, 0.4);
		border-radius: 4px;
		/* border: 1px  solid #55ff00; */
		color: black;
		font-size: 17px;
	}
   
   .inputpwd .el-input__inner{
	  background-color: rgba(255, 255, 255, 0.4);
	  border-radius: 4px;
	  /* border: 1px  solid #55ff00; */
	  color: black;
	  font-size: 17px;
   }
</style>