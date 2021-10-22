<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row>
        <el-col :span="3" v-if="!monitor">
          <el-select v-model="selectedMajor"
                     :disabled="majorSelectionDisabled"
                     @change="handleSelectedMajor"
                     placeholder="所有专业">
            <el-option v-for="major in choice.optionsForMajor"
                       :key="major"
                       :label="major"
                       :value="major">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" v-if="!monitor">
          <el-select v-model="selectedClass"
                     @change="handleSelectedClass"
                     :disabled="classSelectionDisabled" placeholder="所有班级">
            <el-option v-for="_class in optionsForClass"
                       :key="_class"
                       :label="_class"
                       :value="_class">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedYear"
                     @change="handleSelectedYear"
                     placeholder="所有年份">
            <el-option v-for="year in choice.optionsForYear"
                       :key="year"
                       :label="year"
                       :value="year">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedLevel"
                     @change="handleSelectedLevel"
                     placeholder="所有等级">
            <el-option v-for="level in choice.optionsForLevel"
                       :key="level"
                       :label="level"
                       :value="level">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedKind"
                     @change="handleSelectedKind"
                     placeholder="所有类别">
            <el-option v-for="kind in choice.optionsForKind"
                       :key="kind"
                       :label="kind"
                       :value="kind">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedStatus"
                     @change="handleSelectedStatus"
                     placeholder="所有状态">
            <el-option v-for="status in choice.optionsForStatus"
                       :key="status"
                       :label="status"
                       :value="status">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="selectedNumber" @change="handleSelectedNumber" ref="numberInput" placeholder="请输入学号或姓名"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table id="table" :data="innovationData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <!--<el-table-column label="专业" prop="major"></el-table-column>-->
      <el-table-column label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="项目名称" prop="innovation"></el-table-column>
      <el-table-column label="等级" prop="level"></el-table-column>
      <el-table-column label="类别" prop="kind"></el-table-column>
      <el-table-column label="立项年份" prop="year"></el-table-column>
      <el-table-column label="负责人" prop="charger"></el-table-column>
      <el-table-column label="指导老师" prop="tutor"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
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
    name: 'innovation',
    data() {
      return {
        monitor:false,
        innovationData: [],
        choice: {
          optionsForMajor: [],
          optionsForYear: [],
          optionsForLevel: [],
          optionsForKind: [],
          optionsForStatus: []
        },
        optionsForClass: [],
        selectedMajor: '所有专业',
        selectedClass: '所有班级',
        selectedYear: '所有年份',
        selectedKind: '所有类别',
        selectedLevel: '所有等级',
        selectedStatus: '所有状态',
        selectedNumber: '',
        stripeOn: true,
        whileLoading: false,
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        prevStatusOfClassSelection: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
      }
    },
    created() {
      //获得基本选项
      if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
        this.monitor=true;
      }
      else{
        this.getOptions_basic();
      }
      this.sendQuery()
    },
    asyncComputed: {
      classSelectionDisabled() {
        return this.selectedMajor === "所有专业";
      },
      addOptionForMajor() {
        let temp = this.choice.optionsForMajor;
        temp.shift();
        return temp;
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
      //除专业班级其他的选项
      specialChoice() {
        const dict = {};
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        this.getStudentOptions(dict);
      }
    },
    methods: {
      getStudentOptions(dict){
        this.$axios.post('/sm/innovationoptions',dict).then(
          res => {
            this.choice.optionsForYear = ['所有年份'].concat(res.data.data.optionsForYear);
            this.choice.optionsForLevel = ['所有等级'].concat(res.data.data.optionsForLevel);
            this.choice.optionsForKind = ['所有类别'].concat(res.data.data.optionsForKind);
            this.choice.optionsForStatus = ['所有状态'].concat(res.data.data.optionsForStatus);
          }
        );
      },

      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedNumber.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
          if(this.monitor===true){
            dict._class=this.selectedClass;
            dict.major=this.selectedMajor;
          }
        }
        else {
          if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
          if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        }
        if(this.selectedYear!=='所有年份') dict.year=this.selectedYear;
        if(this.selectedKind!=='所有类别') dict.kind=this.selectedKind;
        if(this.selectedLevel!=='所有等级') dict.level=this.selectedLevel;
        if(this.selectedStatus!=='所有状态') dict.status=this.selectedStatus;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post("/sm/innovation", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.innovationData =  response.data.data.students;
            this.whileLoading = false;
          }
        });
      },
      //从后端获得基本选项
      getOptionsForClass(){
        this.$store.dispatch('classoptions',{data:{major:this.selectedMajor}}).then(res=>{
          res.data.data = ['所有班级'].concat(res.data.data);
          this.optionsForClass = res.data.data;
        });
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            res.data.data=["站位","所有专业"].concat(res.data.data);
            this.choice.optionsForMajor = res.data.data;
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
      exportTable(){
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.selectedMajor!=='所有专业') dict.major=this.selectedMajor;
        if(this.selectedClass!=='所有班级') dict._class=this.selectedClass;
        if(this.selectedYear!=='所有年份') dict.year=this.selectedYear;
        if(this.selectedKind!=='所有类别') dict.kind=this.selectedKind;
        if(this.selectedLevel!=='所有等级') dict.level=this.selectedLevel;
        if(this.selectedStatus!=='所有状态') dict.status=this.selectedStatus;
        if(this.selectedNumber.length!==0){
          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
          if(this.monitor===true){
            dict._class=this.selectedClass;
            dict.major=this.selectedMajor;
          }
        }
        //发送请求
        this.$axios.post("/sm/innovation/export-innovation", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '创新创业.xlsx');
          this.whileLoading=false;

        })

      },

      // resetPage重置当前页码，顺便发送查询请求
      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },

      //选择专业后拉取该专业下的班级
      handleSelectedMajor() {
        if (this.selectedMajor === '所有专业')
          this.classSelectionDisabled = true;
        else {
          this.classSelectionDisabled = false;
          this.getOptionsForClass();
        }
        this.resetSelectedClass();
        this.resetPage();
      },
      handleSelectedClass() {
        this.resetPage();
      },
      handleSelectedYear(){
        this.resetPage();
      },
      handleSelectedLevel(){
        this.resetPage();
      },
      handleSelectedKind(){
        this.resetPage();
      },
      handleSelectedStatus(){
        this.resetPage();
      },
      handleSelectedNumber(){
        this.sendQuery();
      },
      resetSelectedClass() {
        this.currentPage = 1;
        this.selectedClass = '所有班级';
        // this.getOtherSelection();
      },

    },
    watch: {
      selectedNumber(newVal, oldVal) {
        if (oldVal.length === 0) {
          this.prevStatusOfClassSelection = this.classSelectionDisabled; // 记录输入学号前的班级下拉菜单禁用状态
          this.classSelectionDisabled = true;
          this.majorSelectionDisabled = true;
        }
        if (newVal.length === 0) {
          this.classSelectionDisabled = this.prevStatusOfClassSelection;
          this.majorSelectionDisabled = false;
        }
      }
    }
  }


</script>
