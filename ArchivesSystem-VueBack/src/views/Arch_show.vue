<template>
   <div id="testapp">

      <!-- 把它做的如百度搜索数据一般，搜索出来后点击进入便可以得到详细的信息
      如全宗号........等等，及附件的具体内容进行填充  -->
      <div class="div-one">
  
       <el-input class="inputone" clearable  v-model="keyinput" placeholder=""  @keyup.enter.native="searchIndex"></el-input> &nbsp
      

       <el-button  class="btn-one" type="primary" icon="el-icon-search" @click="searchIndex">查询</el-button>
      
      <div> 

    <el-date-picker
      v-model="monthRangeValue"
      type="monthrange"
      format="yyyy-MM"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="归档时间"
      end-placeholder="归档时间"
      :picker-options="pickerOptions"
      class="dateStyle"
    
      >
    </el-date-picker>

        &nbsp   <!-- value2 就是绑定在file_ext上的 -->
     <el-select v-model="file_ext"  style="width:120px" placeholder="所有文件">
     <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.value"
      :value="item.value2" 
       v-bind:disabled="item.value2 == file_ext"
      >
      <span style="float: left">{{ item.label}}</span>
      <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
    </el-option>
  </el-select>
    
      &nbsp  
     <el-select v-model="depart_name"  style="width:120px" placeholder="所有部门">
     <el-option
      v-for="item in  DepartIdList"
      :key="item.department"
      :label="item.department"
      :value="item.department"
      :disabled="item.department == depart_name"  
      
      >
      <span style="float: left">{{ item.department}}</span>
      <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department }}</span> -->
    </el-option>

  </el-select>

        </div>
      
      </div>
     
    <div class="div-two">
          
          <div class="div-hot" v-if="false" >       
              热搜榜：

          </div>

 <div class="block" >
  <el-timeline>

    <el-timeline-item  v-for="arch in arch_data" :key="arch.id"  placement="top">
      <el-card>
        <h3  style="stext-decoration:underline">            
                               <!-- :to="{path:'arch_detail',query:{arch_Id:'12121'}} -->
            <router-link class="a-href-font"  :to="{path:'arch_detail',query:{arch_Id:'12121'}}">  
               
                <dl v-html="arch.title">
                    {{arch.title}} 
                </dl>        
           </router-link>

        </h3>
        <p style="font-family:'楷体';font-size:15px">全宗号：{{arch.departId}}  <i style="font-style:normal;color:blue">|</i> 档号：{{arch.fileId}} </p> 
        <p style="font-family:'楷体';font-size:15px"><i style="color:blue" class="el-icon-tickets"></i>描述: <i style="font-style:normal"  v-html="arch.description">{{arch.description}}</i>     </p>
        <p style="font-family:'楷体';font-size:15px"><i  style="color:blue" class="el-icon-date"></i>归档时间：{{arch.createdTime}} </p>
        <p style="font-size:15px"> <i style='color:blue' class="el-icon-document"></i> <i  class="el-icon-d-arrow-left"  v-html="arch.oldFilename"> {{arch.oldFilename}} </i> <i class="el-icon-d-arrow-right"></i></p>
        <p style="font-family:'楷体';font-size:15px">附件大小：<i style="font-style:normal"> {{arch.fileSize}} </i> <i style="font-style:normal;color:blue">KB</i></p> 
        <p>状态：{{arch.state}} </p>
        <p style="font-family:'楷体';font-size:15px"> <i icon="el-icon-office-building"></i>所属部门：<i style="font-style:normal;font-family:'宋体';color:blue" >  {{arch.departName}}</i></p>
        
      </el-card>
    </el-timeline-item>

    
  </el-timeline>
</div>
    <!-- :page-sizes="[5,10,20,100]" -->
   <el-pagination class="mpage" 
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2,3,5,10,20,100]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
   </el-pagination>
          
       </div>



     </div>
</template>

<script>

//import Hello from '../components/hello.vue' 

export default{
   data(){ 
       return {
         arch_data:{},   //文档信息document等
         currentPage:1, //默认为1
         total:0,  //总数
         pageSize:5,  //默认为5

         keyinput:'',    
         startYear:'',
         endYear:'',
         depart_name:'所有部门',  //设置一个默认值
         file_ext:'noType',  //设置一个默认文件类型的值为 no 
         //将数据都封装到search_key中
         search_key:{
             keyinput:'',
             startYear:'',
             endYear:'',
             depart_name:'',  //部门名称
             file_ext:'',  //文件类型，如 xls，pdf,word
             currentPage:'',
             pageSize:'',
         },
         //全宗号id 与 部门名称 责任者
        DepartIdList:{
         departId:'',  //全宗号
         department:''  //部门名称，即责任者
        },
        
         //这里是文件格式的集合
         options: [{
          value: '所有文件',  //这是是用来展示在方框中的
          label: '所有文件（不限格式）',  //这个是展示在下方的
          value2:'noType'  //这个是实际传递的值
        }, {
          value: 'PDF',
          value2: 'pdf',
          label: 'Adobe Acrobat PDF(.pdf)'
        }, {
          value: 'Word',
          value2: 'doc',
          label: '微软 Word(.doc)'
        }, {
          value: 'Excel',
          value2:'xls',
          label: '微软 Excel(.xls)'
        }, {
          value: 'PowerPoint',
          value2:'ppt',
          label: '微软 PowerPoint(.ppt)'
        },
        {
          value: 'TXT',
          value2:'txt',
          label: '微软 TXT(.txt)'
        }
        ],
        
        //规定什么时候执行 useSessionSearchKeyGetData ,这里应该保存在 session中，不然又不再了
        isExcuteUseSearchKey:false,
        //月份range value 
        monthRangeValue:'',
        
        //日期选择的
        pickerOptions: {
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, 
          {
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, 
          // {
          //   text: '最近六个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setMonth(start.getMonth() - 6);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }
          ]
        },

       



        };
     },

   methods: {
    
      //使用session数据来进行得到页面的方法，以确保用户回到该页面后，数据仍旧存在
      //需要做好一些逻辑上的处理避免与 searchIndex方法发生一些错误
      useSessionSearchKeyGetData()
      { 
        console.log("这里是使用session数据的方法")
        console.log(this.$store.getters.getSearchKey)
        console.log("输出 isExcuteUseSearchKey ")
        console.log(localStorage.getItem("isExcuteUseSearchKey"))

        if(localStorage.getItem("isExcuteUseSearchKey"))
        {
          //执行时将数据也给填充上去，且时间需要处理一下
          this.monthRangeValue =  this.$store.getters.getTimeRange  //将之前的时间区间 填充

          this.keyinput = this.$store.getters.getSearchKey.keyinput
          this.startYear = this.$store.getters.getSearchKey.startYear
          this.endYear = this.$store.getters.getSearchKey.endYear
          this.file_ext = this.$store.getters.getSearchKey.file_ext
          this.depart_name = this.$store.getters.getSearchKey.depart_name
          this.currentPage = this.$store.getters.getSearchKey.currentPage
          this.pageSize = this.$store.getters.getSearchKey.pageSize

          console.log("开始为false，不执行，然后当下方执行后为true，执行操作")

          this.$axios({
            method:'GET',
            url:this.dbURL+'/document/searchIndexOne',
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.$store.getters.getSearchKey,

           }).then(res=>{
                  console.log(res)
                  console.log(res.data.msg)
                  this.arch_data = res.data.arch_data
                  console.log(res.data.total)
                  this.total = res.data.total

          })

        }
      },
      searchIndex(){
    
            //且该值也该直接保存下来，直接保存
            //为空的时候也要处理一下
            if(this.monthRangeValue!=null)
            {
           console.log("&&&&&&&&&&&&&& monthrange &&&&&&&&&")
            console.log(this.monthRangeValue)
            this.$store.commit("SET_MONTHRANGEVALUE",this.monthRangeValue)
            console.log("这里是 monthRangeValue不为空********，获取到数据")
            
            //设置开始年月时间
            var date = new Date(this.monthRangeValue[0])
            var Year = date.getFullYear()
            var Month = date.getMonth()+1
            if(Month <10)
            { // 09
              Month = "0" + Month
            }
            this.startYear = Year +"-"+ Month
            console.log(this.startYear)

            //设置结束时间 
            var date2 = new Date(this.monthRangeValue[1])
            var Year2 = date2.getFullYear()
            var Month2 = date2.getMonth()+1
             if(Month2 <10)
            { // 09
              Month2 = "0" + Month2
            }
            this.endYear = Year2 + "-" +Month2
            console.log(this.endYear)
            }
            else{
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                console.log("为空了，设置一下startYear,endYear,同时将保存在session中的置空")
                this.startYear = 'NaN-NaN'
                this.endYear = 'NaN-NaN'
                this.$store.commit("SET_MONTHRANGEVALUE",'')
            }
           
  
          this.isExcuteUseSearchKey = true,
          //保存 this.SET_ISEXCUTEUSESEARCHKEY
          this.$store.commit("SET_ISEXCUTEUSESEARCHKEY",this.isExcuteUseSearchKey);

          this.search_key.keyinput = this.keyinput
          this.search_key.startYear = this.startYear
          this.search_key.endYear = this.endYear
          this.search_key.file_ext =this.file_ext
          this.search_key.depart_name = this.depart_name
          //添加pageSize,currentPage
          this.search_key.currentPage = this.currentPage
          this.search_key.pageSize = this.pageSize

          console.log(this.search_key)
          //把search_key以及其他数据都保存下来到 session 中
          this.$store.commit("SET_SEARCH_KEY",this.search_key)

          console.log("保存在了session中 ok ")
          console.log(this.$store.getters.getSearchKey)
          

          
          /* 传递的数据：
            1‘ 年份区间,数值查询，
            2’ 题名，附件名称，附件内容（keyinput) 
            3’ 其他的 */
            
          //这里的token是需要调整的

          this.$axios({
            method:'GET',
            url:this.dbURL+'/document/searchIndexOne',
            headers:{"Authorization":localStorage.getItem("token")},
            params:this.search_key,

           }).then(res=>{
                  console.log(res)
                  console.log(res.data.msg)
                  this.arch_data = res.data.arch_data
                  console.log(res.data.total)
                  this.total = res.data.total
          })
          

      },  
      //一个获取档案部门名称的操作，且获取到所有的部门名称
      getDepartName()
      {
          const _this = this
          this.$axios.get(this.dbURL+'/document/getDepart',{
            headers:{
                 "Authorization":localStorage.getItem("token")
                 }
          }).then(res=>{
              console.log("这里是获取全宗号与责任者的操作！！获取到全部！")
              console.log(res)
              //这里的后台的方法作出了一些修改使用到了一些筛选重复部门的操作
              //其中考虑到每个部门可能会存在2个或以上的相关操作员，故而也就是导致了这些需要筛选的操作
              this.DepartIdList = res.data.data
              



          })
      },
      //跳转页面，设置pageSize
      handleSizeChange(pageSize) {
        console.log(`每页 ${pageSize} 条`);
        this.pageSize = pageSize
        this.currentPage = 1  //这里调用，则将currentPage置 为 1
        this.searchIndex()
      },
      //翻页的操作
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.searchIndex();

        console.log(`当前页: ${val}`);
  
      },
 

    },
   created(){
           this.getDepartName()
           //需要构建一个新的方法，专门用来使用session中的数据获取数据的方法
           this.useSessionSearchKeyGetData()
    },
   components:{
       // Hello 
     },
     
   
}
</script>

<style>
  
  .div-one{
      position: relative;
      left: 20%;
   
   }

  .div-one .inputone {
       width: 50%;
  }

   .div-two{
     margin-top: 4%;
     width: 80%;
     margin-left: 10%
   }
  
   h4{
     text-decoration: underline;
     line-height: 34px;
     
    }

    p{
      line-height: 20px;
    }

/* .sel{
    position:absolute;
    clip:rect(2px 90px 30px 2px);
    width:90px;
    height:28px;
    line-height:28px;
    font-size:15px;
    font-weight:bold;
} */
 
 span:hover{
   color:rgb(6, 139, 156);
 }

.a-href-font{
  color:RGB(29,158,255);
  font-family: '黑体';
  font-size: 18px;
}

.a-href-font:hover{
      color:RGB(61,102,246);
}

/* 这里即可设置相关样式 el-picker-panel el-date-range-picker el-popper  加上div 和 .   */
div.el-picker-panel.el-date-range-picker.el-popper{
        left:120px !important; 
}


</style>