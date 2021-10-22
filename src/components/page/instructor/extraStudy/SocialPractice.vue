<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row>
        <el-col :span="4">
          <el-select v-model="selectedTime"
                     @change="handleSelectedTime"
                     placeholder="所有年份">
            <el-option v-for="time in choice.optionsForTime"
                       :key="time"
                       :label="time"
                       :value="time">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedStatus"
                     @change="handleSelectedStatus"
                     placeholder="是否立项">
            <el-option v-for="status in choice.optionsForStatus"
                       :key="status"
                       :label="status"
                       :value="status">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="selectedNumber" type="tel" @change="handleSelectedNumber" ref="numberInput" placeholder="请输入学号或姓名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="selectedCharger" type="tel" @change="handleSelectedCharger" ref="chargerInput" placeholder="请输入负责人学号或姓名"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table id="table" :data="socialData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="社会实践名称" prop="social"></el-table-column>
      <el-table-column label="是否立项" prop="status"></el-table-column>
      <el-table-column label="项目负责人" prop="charger"></el-table-column>
      <el-table-column label="工号" prop="chargerNumber"></el-table-column>
      <el-table-column label="实践时间" prop="time"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
    </el-table>
    <el-button @click="exportTable()" size="small">导出表格</el-button>
    <div class="block" style="float: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordQuantity">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 0 50px;
  }

  .el-table__expanded-cell {
    padding: 0;
  }

  .el-form-item img {
    width: 500px;
    height: 200px;
  }

  .el-form-item__content {
    width: 100%;
  }

  .block {
    float: right;
  }
</style>

<script>
  var dict = {};
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
    name: 'socialpractice',
    data() {
      return {
        socialData: [],
        choice: {
          optionsForTime: [],
          optionsForStatus: [],
        },
        selectedTime: '所有年份',
        selectedStatus: '是否立项',
        selectedNumber: '',
        selectedCharger: '',
        stripeOn: true,
        whileLoading: false,
        classSelectionDisabled: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
      }
    },

    created() {
      this.sendQuery()
    },
    asyncComputed: {
      specialChoice() {
        this.$axios.get('/sm/socialoptions').then(
          res => {
            this.choice.optionsForTime = ['所有年份'].concat(res.data.data.optionsForTime);
            this.choice.optionsForStatus = ['是否立项'].concat(res.data.data.optionsForStatus);
          }
        );
      }
    },
    methods: {
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.selectedTime!=='所有年份') dict.time=this.selectedTime;
        if(this.selectedStatus!=='是否立项') dict.status=this.selectedStatus;
        if (this.selectedNumber.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
        }
        if (this.selectedCharger.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedCharger)===null){
            dict.stuChargerName=this.selectedCharger;
          }
          else{
            dict.chargerNumber = this.selectedCharger;
          }
        }
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post("/sm/social", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.socialData =  response.data.data.students;
            this.whileLoading = false;
          }
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
      exportTable(){
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.selectedTime!=='所有年份') dict.time=this.selectedTime;
        if(this.selectedStatus!=='是否立项') dict.status=this.selectedStatus;
        if (this.selectedNumber.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
        }
        if (this.selectedCharger.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedCharger)===null){
            dict.stuChargerName=this.selectedCharger;
          }
          else{
            dict.chargerNumber = this.selectedCharger;
          }
        }
        //发送请求
        this.$axios.post("/sm/social/export-social", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '社会实践.xlsx');
          this.whileLoading=false;
        })
      },

      // resetPage重置当前页码，顺便发送查询请求
      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },

      handleSelectedTime(){
        this.resetPage();
      },
      handleSelectedStatus(){
        this.resetPage();
      },
      handleSelectedNumber(){
        this.resetPage();
      },
      handleSelectedCharger(){
        this.resetPage();
      },

    }
  }


</script>
