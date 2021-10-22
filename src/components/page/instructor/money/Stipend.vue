<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row type="flex" style="align-items: left">
        <el-col :span="4" v-if="!monitor">
          <!--<el-select v-model="selectedMajor" @change="checkStatus_major" placeholder="专业选择">-->
          <el-select v-model="selectedMajor" placeholder="专业选择" @change="handleSelectedMajor">
            <el-option
              v-for="major in choice.optionsForMajor"
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
          <el-select v-model="selectedTime"
                     placeholder="所有时间" @change="handleSelectedTime">
            <el-option
              v-for="time in stipendOptions.optionsForTime"
              :key="time"
              :label="time"
              :value="time">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <!--<el-select v-model="selectedClass" @change="checkStatus" :disabled="classSelectionDisabled"-->
          <el-select v-model="selectedLevel"
                     placeholder="所有等级" @change="handleSelectedLevel">
            <el-option
              v-for="level in stipendOptions.optionsForLevel"
              :key="level"
              :label="level"
              :value="level">
            </el-option>
          </el-select>
        </el-col>

        <!--<el-col :span="3">-->
        <!--<el-button @click.native="sendQuery">查询</el-button>-->
        <!--</el-col>-->

      </el-row>
    </div>
    <el-table id="table" :data="stipendData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <!--<el-table-column label="专业" prop="major"></el-table-column>-->
      <el-table-column label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="等级" prop="level"></el-table-column>
      <el-table-column label="计划金额" prop="planAmount"></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
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
    name: 'stipend',
    created() {
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
        if (this.selectedMajor !== '所有专业')
          return this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              return ['所有班级'].concat(res.data.data);
            }
          );
        return ['所有班级'];
      },
      stipend() {
        const dict = {};
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        this.receiveStipend(dict);
      },
    },
    methods: {
      receiveStipend(dict){
        this.$axios.post('/sm/stipendoptions', dict).then(
          res => {
              this.stipendOptions.optionsForTime = ['所有时间'].concat(res.data.data.optionsForTime);
              this.stipendOptions.optionsForLevel = ['所有等级'].concat(res.data.data.optionsForLevel)
          }
        );
      },
      // resetPage重置当前页码，顺便发送查询请求
      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },
      // 每当改选班级，会重置页码并自动查询
      handleSelectedClass() {
        this.resetPage();
      },
      // 每当改选专业，会重置页码、班级并自动查询
      handleSelectedMajor() {
        this.resetSelectedClass();
        this.resetPage();
      },
      // 每当改选时间，会重置页码并自动查询
      handleSelectedTime() {
        this.resetPage();
      },
      // 每当改选等级，会重置页码并自动查询
      handleSelectedLevel() {
        this.resetPage();
      },
      resetSelectedClass() {
        this.currentPage = 1;
        this.selectedClass = '所有班级';
        // this.getOtherSelection();
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.choice.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        if (this.selectedTime !== '所有时间') dict.time = this.selectedTime;
        if (this.selectedLevel !== '所有等级') dict.level = this.selectedLevel;
        //发送请求
        this.$axios.post("/sm/stipendinfo", dict).then(response => {
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
      exportTable() {
        // 向请求服务端导出记录
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        dict.showAllMembers = this.memberSwitch;
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        if (this.selectedTime !== '所有时间') dict.time = this.selectedTime;
        if (this.selectedLevel !== '所有等级') dict.level = this.selectedLevel;
//        发送请求
        this.$axios.post("/sm/stipend/export-stipend", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '助学金.xlsx');
          this.whileLoading=false;
        })
      },

    },
    data() {
      return {
        choice: {
          optionsForMajor: [],
          optionsForTime: [],
          optionsForLevel: [],
        },
        stipendOptions: {},
        // specialChoice: [],
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
        selectedLevel: '所有等级',
        monitor:false,

      };
    }
  }
</script>
