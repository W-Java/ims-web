<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4" v-if="!monitor">
        <el-select placeholder="专业" v-model="filterModel.major" @change="sendQuery">
          <el-option v-for="item in majorOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" v-if="!monitor">
        <el-select placeholder="班级" v-model="filterModel.class" :disabled="classOptionsDisabled" @change="sendQuery">
          <el-option v-for="item in classOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select placeholder="开始学期" v-model="filterModel.startTerm" @change="sendQuery">
          <el-option v-for="item in otherOptions.availableTerms" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select placeholder="结束学期" v-model="filterModel.endTerm" @change="sendQuery">
          <el-option v-for="item in otherOptions.availableTerms" :key="item" :label="item" :value="item" :disabled="item<filterModel.startTerm"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="挂科数（数字或“-”连接的范围）" v-model="filterModel.failureCount" @change="sendQuery"></el-input>
      </el-col>
    </el-row>
    <el-table id="table" :data="tableData" v-loading="tableLoading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.subjects">
            <el-table-column label="课程" prop="course"></el-table-column>
            <el-table-column label="学分" prop="credit"></el-table-column>
            <el-table-column label="成绩" prop="grade"></el-table-column>
            <el-table-column label="开课学期" prop="classTerm"></el-table-column>
            <el-table-column label="补重修学期" prop="retakeTerm"></el-table-column>
            <el-table-column label="成绩标志" prop="flag"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="专业班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="未通过课程/环节数" prop="failureCount"></el-table-column>
      <el-table-column label="挂科学分" prop="failureCredit"></el-table-column>
    </el-table>
    <el-button @click="exportTable()" size="small">导出表格</el-button>
    <el-pagination @size-change="reassignPagesize" @current-change="sendQuery" style="float: right;" :current-page.sync="filterModel.currentPage" :page-size="filterModel.pageSize" :total="recordQuantity" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div style="clear: both;"></div>
  </div>
</template>

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
    name: 'failsituation',
    data() {
      return {
        monitor:false,
        recordQuantity: 0,
        filterModel: {
          major: '所有专业',
          class: '所有班级',
          startTerm: '',
          endTerm: '',
          failureCount: '',
          pageSize: 20,
          currentPage: 1
        },
        tableData: [],
        tableLoading: false
      };
    },
    asyncComputed: {
      // 专业选项
      majorOptions() {

        return this.$store.dispatch('majoroptions',{})
          .then(response => {
            return ['所有专业'].concat(response.data.data);
          })
      },
      // 班级选项
      classOptions() {
        if (this.filterModel.major === '所有专业')
          return ['所有班级'];
        else {
          return this.$axios.post('/sm/fail-situation/class-option', {major: this.filterModel.major})
            .then(response => {
              return ['所有班级'].concat(response.data.data.classOptions);
            })
        }
      },
      // 其他选项
      otherOptions() {
        return this.$axios.post('/sm/fail-situation/other-option', {
          major: this.filterModel.major === '所有专业' ? undefined : this.filterModel.major,
          _class: this.filterModel.class === '所有班级' ? undefined : this.filterModel.class
        })
          .then(response => {
            return response.data.data;
          })
      }
    },
    watch: {
      // 当可选的学期范围发生变化时，重置学期的选项
      'otherOptions.availableTerms'(curVal, oldVal) {
        this.filterModel.startTerm = '';
        this.filterModel.endTerm = '';
      },
      'filterModel.startTerm'(curVal, oldVal) {
        if (this.filterModel.endTerm === '' || this.filterModel.endTerm < curVal) {
          this.filterModel.endTerm = curVal;
        }
      }
    },
    computed: {
      // 班级选项禁用
      classOptionsDisabled() {
        if (this.filterModel.major === '所有专业') {
          this.filterModel.class = '所有班级';
          return true;
        }
        else
          return false;
      }
    },
    methods: {
      // 发送查询请求，包含专业、班级、学期、挂科数、每页数量、页码
      sendQuery() {
        this.tableLoading = true;
        let data = {};
        Object.assign(data, this.filterModel);
        // 处理专业和班级
        if (data.major === '所有专业') delete data.major;
        if (data.class !== '所有班级') data._class = data.class;
        delete data.class;
        // 处理开始学期和结束学期
        if (data.startTerm === '') delete data.startTerm;
        if (data.endTerm === '') delete data.endTerm;
        // 处理挂科数
        if (data.failureCount !== '') {
          let countArray = data.failureCount.split('-');
          let reg = /^[0-9]+$/;
          if (countArray.length === 1) {
            if (reg.test(countArray[0].trim())) {
              data.minFailureCount = parseInt(countArray[0]);
              data.maxFailureCount = parseInt(countArray[0]);
            }
          }
          else if (countArray.length === 2) {
            if (reg.test(countArray[0].trim()))
              data.minFailureCount = parseInt(countArray[0]);
            if (reg.test(countArray[1].trim()))
              data.maxFailureCount = parseInt(countArray[1]);
          }
          if (data.minFailureCount === undefined || data.maxFailureCount === undefined || data.minFailureCount > data.maxFailureCount) {
            this.$message.error('挂科数范围指定格式有误');
            this.tableLoading = false;
            return;
          }
        }
        delete data.failureCount;
        // 发送！
        this.$axios.post('/sm/fail-situation/query', data)
          .then(response => {
            this.recordQuantity = response.data.data.recordQuantity;
            this.tableData = response.data.data.result;
            this.tableData.forEach(element => {
              element.failureCredit = 0;
              element.subjects.forEach(el => {
                element.failureCredit += Number(el.credit);
              });
            });
            this.tableLoading = false;
          })
      },
      // !!! pagination的pagesize有bug，需要手动调整
      reassignPagesize(newSize) {
        this.filterModel.pageSize = newSize;
        this.sendQuery();
      },
      exportTable(){
        this.tableLoading = true;
        let data = {};
        Object.assign(data, this.filterModel);
        // 处理专业和班级
        if (data.major === '所有专业') delete data.major;
        if (data.class !== '所有班级') data._class = data.class;
        delete data.class;
        // 处理开始学期和结束学期
        if (data.startTerm === '') delete data.startTerm;
        if (data.endTerm === '') delete data.endTerm;
        // 处理挂科数
        if (data.failureCount !== '') {
          let countArray = data.failureCount.split('-');
          let reg = /^[0-9]+$/;
          if (countArray.length === 1) {
            if (reg.test(countArray[0].trim())) {
              data.minFailureCount = parseInt(countArray[0]);
              data.maxFailureCount = parseInt(countArray[0]);
            }
          }
          else if (countArray.length === 2) {
            if (reg.test(countArray[0].trim()))
              data.minFailureCount = parseInt(countArray[0]);
            if (reg.test(countArray[1].trim()))
              data.maxFailureCount = parseInt(countArray[1]);
          }
          if (data.minFailureCount === undefined || data.maxFailureCount === undefined || data.minFailureCount > data.maxFailureCount) {
            this.$message.error('挂科数范围指定格式有误');
            return;
          }
        }
        delete data.failureCount;
        // 发送！
        this.$axios.post("/sm/fail-situation/export-fail", data,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '挂科情况.xlsx');
          this.tableLoading=false;
        })
      },

    },
    created() {
      if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
        this.monitor=true;
      }
      console.log('長門有希', '报“_vm.otherOptions is null”的错是正常的，不用管');
      this.sendQuery();
    }
  }
</script>

<style scoped>
  .col-member-switch {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
