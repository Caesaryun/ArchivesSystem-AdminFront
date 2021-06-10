import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


//axios.defaults.baseURL = "http://localhost:9090"

axios.interceptors.request.use(config=>{
    
     return config
     //前置拦截
})

//后置拦截
axios.interceptors.response.use(response=>{

      let res = response.data
      
      console.log("axios print data ......")
      console.log(response)
      console.log(res.data)

      //有的数据，没有 response.data.code 因为没有按照 Result 进行传递
      //打包数据，故而这种情况使用 status 即可
      //  if(res.code === 200 || response.status === 200)  
      if(res.code === 200 || response.status === 200)  //若是返回的code为200说明正常的
      {
          console.log("transmit data to next ......")
          return response
      }
    //   else if(res.code === 403)
    //   {
    //     Element.Message.error("档案的全宗号重复！",{duration : 3*1000});
    //     return Promise.reject(response.data.msg)
    //   }
     else if(res.code === 400){
        Element.Message.error("密码错误！",{duration : 3*1000});
        return Promise.reject(response.data.msg)
      }
    //   else if(res.code === 401){
    //       console.log("其他错误，可通过拦截")
    //       return response
    //   }
      

},
error=>{
    console.log(error)
    
    if(error.response.data){
        error.message = error.response.data.msg 
    }
    //状态为 401
    if(error.response.status === 401){
        Element.Message.warning("令牌token已过期，已执行退出！" + 401,{duration : 3*1000});
        // store.commit("REMOVE_INFO")
        // router.push("/login")
    }    //状态为500则退出
    else if(error.response.status === 500)
    {
        console.log("error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(error.response)
        console.log(error.response.data)

        if(error.response.data.code === 409)  //为409则退出，其他则不
        {
            Element.Message.warning("令牌token已过期，已执行退出！",{duration : 3*1000});
            store.commit("REMOVE_INFO")
            router.push("/login")
        }
        else{
            Element.Message.warning("相关服务未开启，请联系超级管理员！",{duration : 3*1000});
        }

    //     Element.Message.warning("令牌token已过期，已执行退出！",{duration : 3*1000});
    //     store.commit("REMOVE_INFO")
    //     router.push("/login")

    }
    else{
        Element.Message.error(error.message,{duration : 3*1000});
        return Promise.reject(response.data.msg)
    }
}
)