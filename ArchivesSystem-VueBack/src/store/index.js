import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
/**
 * 状态监听
 */


// const store = new Vuex.Store({})

// store.registerModule('vux', {
//   state: {
//     showLoader: false,
//     loaderContent: '正在加载···',
//     updateData: null,
//     loginStatus: null
//   },
//   mutations: {
//       uploadShowLoader(state, showLoader) {
//       state.showLoader = showLoader
//     },
//     // loading内容更新
//     uploadLoaderContent(state, loaderContent){
//       state.loaderContent = loaderContent
//     },
//     // 数据更新
//     dataUpload(state, updateData) {
//       state.updateData = updateData
//     },
//     // 登录状态监听
//     uploadLoginStatus(state, loginStatus){
//       state.loginStatus = loginStatus
//     }
//   },
//   getters: {},
//   actions: {},
//   moudles: {}
// })
// /**
//  * 出口
//  */
// export default store


export default new Vuex.Store({
   
     state:{
       token:'',
       userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
       menuInfo:JSON.parse(sessionStorage.getItem("menuInfo")),
       isgetmenu:'',
       search_key:JSON.parse(sessionStorage.getItem("search_key")), //保存搜索的关键字数据
       isExcuteUseSearchKey:false, //保存是否执行
       countCurrentPage:1,  //记下当前页数，开始默认为 1
       //monthRangeValue:JSON.parse(sessionStorage.getItem("monthRangeValue")) //格式不对
       monthRangeValue:'',
      },

     mutations:{
      SET_TOKEN:(state,token)=>{
        state.token = token
        localStorage.setItem("token",token)
      },
      
      SET_USERINFO:(state,userInfo)=>{
        state.userInfo = userInfo
        sessionStorage.setItem("userInfo",JSON.stringify(userInfo))
      },
       //置入menuInfo菜单信息
      SET_MENUINFO:(state,menuInfo)=>{
           state.menuInfo = menuInfo
           sessionStorage.setItem("menuInfo",JSON.stringify(menuInfo))
      },
         //设置是否执行菜单menu方法的操作
      SET_ISGETMENU:(state,isgetmenu)=>{
          state.isgetmenu = isgetmenu
          localStorage.setItem("isgetmenu",isgetmenu)
      },
      //保存是否执行哪个useSessionGetData
      SET_ISEXCUTEUSESEARCHKEY:(state,isExcuteUseSearchKey)=>{
           state.isExcuteUseSearchKey = isExcuteUseSearchKey
           localStorage.setItem("isExcuteUseSearchKey",isExcuteUseSearchKey)
      },
      //置入当前页数进行保存
      SET_COUNTCURRENTPAGE:(state,countCurrentPage)=>{
           state.countCurrentPage = countCurrentPage
           localStorage.setItem("countCurrentPage",countCurrentPage)
      },
      //置入 搜索关键字信息
      SET_SEARCH_KEY:(state,search_key)=>{
           state.search_key = search_key
           sessionStorage.setItem("search_key",JSON.stringify(search_key))
      },
      SET_MONTHRANGEVALUE:(state,monthRangeValue)=>{
           state.monthRangeValue = monthRangeValue
           sessionStorage.setItem("monthRangeValue",monthRangeValue)
      },

      REMOVE_INFO:(state)=>{
        state.token=''
        state.userInfo={}
        localStorage.setItem("token",'')
        sessionStorage.setItem("userInfo",JSON.stringify(' '))
        sessionStorage.setItem("menuInfo",JSON.stringify(' '))
        sessionStorage.setItem("search_key",JSON.stringify(' '))
        localStorage.setItem("isExcuteUseSearchKey",'')
        localStorage.setItem("countCurrentPage",1)
        sessionStorage.setItem("monthRangeValue",JSON.stringify(' '))
        
      }
     },
     getters:{
       
      getUser:state=>{
        return state.userInfo
      },
      getMenu:state=>{
        return state.menuInfo
      },
      getSearchKey:state=>{
            return state.search_key
      },
      getTimeRange:state=>{
              return state.monthRangeValue
      }

     },
     actions:{

     },
     modules:{

     }


})