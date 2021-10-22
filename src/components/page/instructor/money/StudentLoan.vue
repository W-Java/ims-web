<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row :gutter="10">
        <el-col :span="3">
          <el-switch
            style="margin-top: 10px"
            v-model="remarkSwitch"
            @change="handleRemarkSwitch"
            active-color="#e477bb"
            inactive-color="rgba(227, 120, 188, 0.25)"
            active-text="生源地"
            inactive-text="校园地">
          </el-switch>
        </el-col>

        <el-col :span="4" v-if="!monitor">
          <!--<el-select v-model="selectedMajor" @change="checkStatus_major" placeholder="专业选择">-->
          <el-select v-model="selectedMajor" placeholder="专业选择" @change="handleSelectedMajor">
            <el-option
              v-for="major in optionsForMajor"
              :key="major"
              :label="major"
              :value="major">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4" v-if="!monitor">
          <!--<el-select v-model="selectedClass" @change="checkStatus" :disabled="classSelectionDisabled"-->
          <el-select v-model="selectedClass" :disabled="classSelectionDisabled" placeholder="所有班级"
            @change="handleSelectedClass">
            <el-option
              v-for="_class in optionsForClass"
              :key="_class"
              :label="_class"
              :value="_class">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <!--<el-select v-model="selectedClass" @change="checkStatus" :disabled="classSelectionDisabled"-->
          <el-select v-model="selectedTime" placeholder="所有时间" @change="handleSelectedTime">
            <el-option
              v-for="time in optionsForTime"
              :key="time"
              :label="time"
              :value="time">
            </el-option>
          </el-select>
        </el-col>

      </el-row>
    </div>
    <el-table id="table" :data="stipendData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <!--<el-table-column label="专业" prop="major"></el-table-column>-->
      <el-table-column label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="金额" prop="Amount"></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="总金额" prop="sum"></el-table-column>
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
    name: 'StudentLoan',
    created(){
      if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
        this.monitor=true;
      }
      else{
        this.getOptions_basic();
      }
      this.sendQuery();
    },
    asyncComputed: {
      classSelectionDisabled() {
        return this.selectedMajor === '所有专业';
      },
      // 班级选项
      optionsForClass() {
        if(this.selectedMajor === '所有专业') {
          return ['所有班级'];
        }
        else {
          return this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              return ['所有班级'].concat(res.data.data);
            }
          )
        }
      },
      optionsForTime(){
        //获取班级与专业之外的其余筛选项
        const dict = {};
        if(this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if(this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        return this.$axios.post('/sm/studentloanoptions', dict).then(
          res => {
            return ['所有时间'].concat(res.data.data.optionsForTime);
          }
        );
      }
    },
    methods :{
      // resetPage重置当前页码，顺便发送查询请求
      resetPage(){
        this.currentPage = 1;
        this.sendQuery();
      },
      // 每当改选专业，会重置页码、班级并自动查询
      handleSelectedMajor(){
        this.resetSelectedClass();
        this.resetPage();
      },
      // 每当改选班级，会重置页码并自动查询
      handleSelectedClass(){
        this.resetPage();
      },
      // 每当改选时间，会重置页码并自动查询
      handleSelectedTime(){
        this.resetPage();
      },
      // 重置班级选项
      resetSelectedClass(){
        this.selectedClass = '所有班级';
      },
      // 每当改选生源地、校园地开关，会重置所有选项并自动查询
      handleRemarkSwitch() {
          this.selectedClass= '所有班级';
          this.selectedMajor= '所有专业';
          this.selectedTime= '所有时间';
          this.remarkOption = this.remarkSwitch ? "生源地":"校园地";
          console.log(this.remarkOption);
          this.resetPage();
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        dict.remark = this.remarkOption;
        if(this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if(this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        if(this.selectedTime !== '所有时间') dict.time = this.selectedTime;
        //发送请求
        this.$axios.post("/sm/studentloaninfo",  dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.stipendData = response.data.data.stipendData;
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
        this.whileLoading =  true;
        // 生成条件
        const dict = {};
        dict.remarkOption = this.remarkOption;
        if(this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if(this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        if(this.selectedTime !== '所有时间') dict.time = this.selectedTime;
        //发送请求
        this.$axios.post("/sm/loan/export-loan", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '助学贷款.xlsx');
          this.whileLoading=false;
        })
      },

    },
    data() {
      return {
        optionsForMajor:[],
        currentPage: 1,
        pageSize: 20,
        recordQuantity: 0,
        stipendData: [],
        stripeOn: true,
        whileLoading: false,
        classSelectionDisabled: true,
        selectedClass: '所有班级',
        selectedMajor: '所有专业',
        selectedTime: '所有时间',
        remarkSwitch: false,
        remarkOption: '校园地',
        monitor:false,
      };
    }
  }
</script>
