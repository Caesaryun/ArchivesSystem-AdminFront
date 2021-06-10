<template>
   <div id="poster">
      <div class="title-form">

	  </div>
    <div  class="form1">
		  <div>
			  <a href="#/qrcode_login"><img v-if="isShow" style="margin-left:85%;width:70px;height:70px;" src="http://tb2.bdstatic.com/tb/static-common/widget/login_dialog/imgs/ic_login_code_2d81599.png">
			       </a>
			 <!-- <a href="#/login"> <img v-if="!isShow" style="margin-left:80%;width:70px;height:70px;" src="http://tb2.bdstatic.com/tb/static-common/widget/login_dialog/imgs/ic_login_password_413f650.png">
		         </a> -->
		  </div>
	      
		   <!-- <span class="font-ui">管理员登录</span> -->
          <el-form style="margin-top:6.7%"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		    <el-form-item   class="labelname" label="用户名" prop="account" :required="false">
			   <el-input class="inputname"  v-model="ruleForm.account"></el-input>
		    </el-form-item>
		   
		   <el-form-item class="labelpwd" label="密码" prop="password">
		     <el-input  class="inputpwd" type="password" v-model="ruleForm.password"></el-input>
		   </el-form-item>
		   
		    <el-form-item>
		      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
		      <el-button  @click="resetForm('ruleForm')">重置</el-button>
		    </el-form-item>
		    </el-form>
			
			
         </div>
		 
		<div class="form2">
			
			<!-- 这里是下一片div -->
		</div> 
		 
    </div>
	
	
	
</template> 

<script>

//import Hello from '../components/hello.vue' 

export default{
   data() {
      return {
        ruleForm: {
          account: '',  ///
          password: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        },
		isShow:true,

      };
    },
    methods: {
		
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
        
		//    alert('who are you');
		   const _this= this
		//    _this.$router.push("/")
		   console.log("this.dburl:"+this.dbURL)
		   console.log("输出ruleForm")
           console.log(this.ruleForm)

		   this.$axios.post(this.dbURL+'/users/login',this.ruleForm).then(res=>{

			    console.log(res)
			    const jwt = res.headers['authorization']
				
				console.log("jwttoken:")
				console.log(jwt)

				const userInfo = res.data.data
			    _this.$store.commit("SET_TOKEN",jwt);  //保存token信息
				_this.$store.commit("SET_USERINFO",userInfo)

				const isexcute = 0  //0表示第一次执行
                _this.$store.commit("SET_ISGETMENU",isexcute);

                console.log("userInfo:")
				console.log(_this.$store.getters.getUser)

				this.$router.push("/home")
				
		   })
		   
          } else{
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}


</script>

<style>

  #poster {
	/* background: url(../assets/sea.jpeg) no-repeat; */
    background-image: url(../../assets/img/sea.jpeg);
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
 
  .form1{
	  /* background: url(../assets/ArchivesSystemLogo.gif) no-repeat; */
	 background-image: url(../../assets/img/as11.gif);
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
	   color:ghostwhite;
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