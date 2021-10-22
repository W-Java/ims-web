<template>
  <!--这里写内容-->
  <div>
    <el-table :data="countList.data" style="width:100%;" :stripe="true" :v-loading="whileLoading">
      <el-table-column
        label="统计任务名称">
        <template slot-scope="scope">
          <a @click="showResult(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleCountListSizeChange"
      @current-change="handleCountListCurrentChange"
      :current-page="countList.currentPage"
      :page-sizes="[20, 50, 100]"
      :page-size="countList.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="countList.recordQuantity">
    </el-pagination>
    <el-dialog :fullscreen="true" :v-loading="whileLoading" :visible.sync ="dialogVisible">
      <el-table :data="countData.data" style="width: 100%" :stripe="true"  fixed>
        <el-table-column v-for="item in countData.header" :prop="item.key" :label="item.key" :key="item.key">
        </el-table-column>
      </el-table>
      <el-row type="flex">
        <el-col :span="4" justify="end">
          <el-button @click="exportTable()" type="primary" size="small">导出表格</el-button>
        </el-col>
        <el-col :span="20">
          <el-pagination
            @size-change="handleCountDataSizeChange"
            @current-change="handleCountDataCurrentChange"
            :current-page="countData.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="countData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="countData.recordQuantity">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<style scoped>

</style>

<script>
  var saveBytes;
  var saveByteArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
      var blob = new Blob(data, {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }());

  export default {
    name: 'countlist',
    data() {
      return {
        monitor: '',
        whileLoading:false,
        dialogVisible:false,
        countList:{
          currentPage:1,
          pageSize:20,
          recordQuantity: 0,
          data:[
          ]
        },
        countData:{
          id:1,
          currentPage:1,
          pageSize:20,
          recordQuantity: 0,
          header:[],
          data:[]
        },
        fastOption:{
          stu_class:"班级",
          stu_id:"学号",
          stu_name:"姓名",
          sex:"性别",
          phone:"电话",
          nation:"民族",
          province:"省份",
          hometown:"籍贯",
          dorm:"寝室楼栋",
          door:"宿舍号",
          major:"专业",
          id_card_no:"身份证号",
          qq:"QQ号",
          home_add:"家庭住址",
          dad_name:"父亲姓名",
          dad_phone:"父亲电话",
          mom_name:"母亲姓名",
          mom_phone:"母亲电话",
          po_status:"政治面貌",
          cadre:"班级干部"
        },
      };
    },
    created(){
      this.monitor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0;
      this.sendCountListQuery();
    },
    methods: {
      //解析时间字符串获得Date对象
      parseToDate(date, time) {
        let year = 0;
        let month = 0;
        let day = 0;
        if (date) {
          year = parseInt(date.substr(0, 4));
          month = parseInt(date.substr(5, 2)) - 1;
          day = parseInt(date.substr(8, 2));
        }
        let hh = 0;
        let ff = 0;
        if (time) {
          hh = parseInt(time.substr(0, 2));
          ff = parseInt(time.substr(3, 2));
        }
        return new Date(year, month, day, hh, ff);
      },
      exportTable() {
        this.whileLoading = true;
        this.$axios.post('sm/statsExport', {id: this.countData.id}, {responseType: 'blob'}).then(
          response => {
            saveBytes = response.data;
            saveByteArray([saveBytes], '统计结果.xlsx');
            this.whileLoading = false;
          }
        )
      },
      showResult(id){
        this.countData.id=id;
        this.sendCountDataQuery();
        this.dialogVisible=true;
      },
      handleCountListSizeChange(val) {
        this.countList.pageSize = val;
        this.sendCountListQuery();
      },
      handleCountListCurrentChange(val) {
        this.countList.pageSize = val;
        this.sendCountListQuery();
      },
      sendCountListQuery(){
        this.whileLoading=true;
        let postData={};
        postData.currentPage=this.countList.currentPage;
        postData.pageSize=this.countList.pageSize;
          postData.status = 'submit';
        if (this.monitor) {
          postData.identity = 'monitor';
        }
        this.$axios.post("sm/StatsList",postData)
          .then(
            response=>{
              if(response.data.status===0){
                this.countList.recordQuantity=response.data.data.recordQuantity;
                this.countList.data=[];
                let loopTime=response.data.data.countList.length;
                for (let i = 0; i < loopTime; i++) {
                  let startDate = this.parseToDate(response.data.data.countList[i].startDate, response.data.data.countList[i].startTime);
                  let endDate = this.parseToDate(response.data.data.countList[i].endDate, response.data.data.countList[i].endTime);
                  let nowDate = new Date();
                  let countStatus = '';
                  if (nowDate < startDate) {
                    countStatus = '暂未开始';
                  } else if (nowDate <= endDate) {
                    countStatus = '统计中';
                  } else {
                    countStatus = '已结束';
                  }
                  let item={
                    id:response.data.data.countList[i].id,
                    name:response.data.data.countList[i].name,
                    status: countStatus,
                    startTime:response.data.data.countList[i].startDate+" "+response.data.data.countList[i].startTime,
                    endTime:response.data.data.countList[i].endDate+" "+response.data.data.countList[i].endTime
                  };
                  this.countList.data.push(item);
                }
              }
              this.whileLoading=false;
            }
          )
      },
      handleCountDataCurrentChange(val) {
        this.countData.pageSize = val;
        this.sendCountDataQuery();
      },
      handleCountDataSizeChange(val) {
        this.countData.pageSize = val;
        this.sendCountDataQuery();
      },
      sendCountDataQuery(){
        this.whileLoading=true;
        let postData={};
        postData.currentPage=this.countData.currentPage;
        postData.pageSize=this.countData.pageSize;
        postData.id=this.countData.id;
        this.$axios.post("sm/statsData",postData)
          .then(
            response=>{
              if(response.data.status===0){
                this.countData.recordQuantity=response.data.data.recordQuantity;
                let header=JSON.parse(response.data.data.header);
                let preSetHeader=response.data.data.preHeader.split(',');
                let size=preSetHeader.length;
                for (let i = 0; i < size; i++) {
                  let headerItem={
                    key:this.fastOption[preSetHeader[i]],
                    type:'text'
                  };
                  header.push(headerItem);
                }
                this.countData.header=header;
                let data=[];
                let loopTimes=response.data.data.data.length;
                for (let i = 0; i < loopTimes; i++) {
                  let dataItem=JSON.parse(response.data.data.data[i]);
                  for (let j = 0; j < size; j++) {
                    let preData=response.data.data.preData[i].split(',');
                    dataItem[this.fastOption[preSetHeader[j]]]=preData[j];
                  }
                  data.push(dataItem);
                }
                this.countData.data=data;
              }
              this.whileLoading=false;
            }
          )
      }
    }
  }
</script>
