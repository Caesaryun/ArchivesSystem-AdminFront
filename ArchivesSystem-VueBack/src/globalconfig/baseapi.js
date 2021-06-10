//let baseURL = "http://localhost:9090"  //这里的这个http://192.2xx.xx.xx:port ;

exports.install = function(Vue){
    //  Vue.prototype.text1 = function(){
    //      alert("这是一个全局的函数");
    //  }s
      //声明一个基础的url
     Vue.prototype.baseUrl='./' 
     Vue.prototype.dbURL= "http://localhost:8080/ArchivesSystem"  //
    //  Vue.prototype.dbURL = "http://localhost:8080"    //这里是另外一个
     Vue.prototype.aliyunServer = "http://123.56.127.215"  //云服务器上的地址
   
}
