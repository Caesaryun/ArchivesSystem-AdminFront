module.exports = {
   
    // baseUrl: './',
    productionSourceMap: false,
    devServer: {
        port:8888,
        open:true,   //自动打开浏览器
        hotOnly:true,   //热更新
        proxy: {
            '/api':{
                target:'http://localhost:8080/ArchivesSystem/',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            // '/ms':{
            //     target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
            //     changeOrigin: true
            // }
        }
    }
}