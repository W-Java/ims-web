<template>
    <!--这里写内容-->
  <div>
    <div>
      <el-row type="flex" style="align-items: left">
        <el-col :span="4">
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

        <el-col :span="4">
          <!--<el-select v-model="selectedClass" @change="checkStatus" :disabled="classSelectionDisabled"-->
          <el-select v-model="selectedClass" :disabled="classSelectionDisabled"
                     placeholder="所有班级" @change="handleSelectedClass">
            <el-option
              v-for="_class in optionsForClass"
              :key="_class"
              :label="_class"
              :value="_class">
            </el-option>
          </el-select>
        </el-col>

      </el-row>
    </div>
    <el-table id="table" :data="partTimeData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <!--<el-table-column label="专业" prop="major"></el-table-column>-->
      <el-table-column label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex"></el-table-column>
      <el-table-column label="所在单位" prop="department"></el-table-column>
      <el-table-column label="职务" prop="duty"></el-table-column>
      <el-table-column label="任职时间" prop="occupationalSpan"></el-table-column>
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
    name: 'parttime',
    data() {
      return {
        choice: {
          optionsForMajor: [],
        },
        currentPage: 1,
        pageSize: 20,
        recordQuantity: 0,
        partTimeData: [],
        stripeOn: true,
        whileLoading: false,
        classSelectionDisabled: true,
        selectedClass: '所有班级',
        selectedMajor: '所有专业',
      }
    },
    created() {
      this.getOptions_basic();
      this.sendQuery();
      dict = {};
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
          );
        }
      }
    },
    methods: {
      resetPage(){
        this.currentPage = 1;
        this.sendQuery();
      },
      handleSelectedMajor(){
        this.resetSelectedClass();
        this.resetPage();
      },
      handleSelectedClass(){
        this.resetPage();
      },
      resetSelectedClass(){
        this.selectedClass = '所有班级';
      },
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post("sm/parttimeinfo", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.partTimeData = response.data.data.partTimeData;
            this.whileLoading = false;
          }
        });
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.choice.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
      handleModificatibase64on(student){
        // this is going to be done later.
      },
      exportTable(){
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        //发送请求
        this.$axios.post("/sm/parttime/export-parttime", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '勤工助学.xlsx');
          this.whileLoading=false;
        })
      },
    },
  }
</script>
