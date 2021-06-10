<template>
   <div id="echarts">
            

                       <!-- <el-card class="box-card-echarts">
                         <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
                       </el-card> -->


           <el-row :gutter="20">
            
            <el-col :span="12">
                <el-card shadow="hover">
                    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card shadow="hover">
                      <div id="myChart2" :style="{width: '300px', height: '300px'}"></div>
                </el-card>
            </el-col>
        </el-row>


   </div>
</template>

<script>



export default{

   data(){ 
       return {
            msg:'welcome to',
            //archdata: [10,45,37,30,50],
            //departmentdata:["信息工程学院","图书馆","学报编辑部","学校办公室","科技馆"], 
             archdata:[],
             departmentdata:[],
            
             usertaxon:["管理员","大众用户"],
             usernum:[12,100],

         };
     },
     mounted(){
         this.drawLine();  //数据变动这里即会改变
         this.drawLine2();

     },
   methods: {
        //获取数据，统计每个部门的档案记录数目即可，弄一个定时器实时的更新数据
    
       getarchData(){
           
         this.$axios.post(this.dbURL+"/common-users/getarchdata",{
            headers:{
               "Authorization":localStorage.getItem("token")
            }
          }).then(res=>{
            console.log("获取档案记录条数...")
            console.log(res)

            for(var i=0;i<res.data.size;i++)
            {
                this.archdata[i] = res.data.archdata[i]
                
            }
            
            for(var i=0;i<res.data.size;i++)
            {
                this.departmentdata[i] =  res.data.department[i]
                
            }
            
            this.drawLine();  //要在这里重新再次调用函数方可
            
          
          })


        },
         

         //drawLine2
         drawLine2(){
                console.log("画图....")
              
                let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
                //绘制图表
                myChart2.setOption({
                    title:{text:'用户数量'},
                    tooltip:{},
                    xAxis:{
                          data:this.usertaxon
                    },

                    yAxis:{},
                
                series: [{
                name: '数量',
                type: 'bar',
                //data: [5, 20, 36, 10, 10, 20]
                data:this.usernum
            }]

                });
         },

        //画图
        drawLine(){
                console.log("画图....")
              
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                //绘制图表
                myChart.setOption({
                    title:{text:'实时档案数量'},
                    tooltip:{},
                    xAxis:{
                          data:this.departmentdata
                    },

                    yAxis:{},
                
                series: [{
                name: '数量',
                type: 'bar',
                //data: [5, 20, 36, 10, 10, 20]
                data:this.archdata
            }]

                });

           },  
           
           
    },
   created(){
           this.getarchData();

    },
   components:{
       // Hello 
     }
}
</script>

<style>
    .box-card-echarts{
          width: 480px;  
    }
   
    .el-row {
        margin-bottom: 20px;
    }

</style>