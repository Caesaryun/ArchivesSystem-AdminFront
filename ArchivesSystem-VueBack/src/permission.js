import router from "./router"

//路由判断登录，根据路由配置文件的参数
router.beforeEach((to,from,next)=>{
    
    if(to.matched.some(record=>record.meta.requireAuth)){       //判断该路由是否需要登录权限
        const token = localStorage.getItem("token")
        console.log("没有token，表明未认证，故而无法访问一些页面！"+ token)
        
        if(token){
             if(to.path === '/login'){

             }else{
                 next()
             }
        }else{
            next({
                path:'/login'
            })
        }
     
    }else{
        next()
    }
        
})