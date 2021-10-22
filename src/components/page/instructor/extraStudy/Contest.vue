<template>
    <!--这里写内容-->
  <div>
    <div>
      <el-row>
        <el-col :span="4" v-if="!monitor">
          <el-select v-model="selectedMajor"
                     :disabled="majorSelectionDisabled"
                     @change="handleSelectedMajor"
                     placeholder="专业选择">
          <el-option v-for="major in choice.optionsForMajor"
                     :key="major"
                     :label="major"
                     :value="major">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="4" v-if="!monitor">
          <el-select v-model="selectedClass"
                     @change="handleSelectedClass"
                     :disabled="classSelectionDisabled"
                     placeholder="所有班级">
          <el-option v-for="_class in optionsForClass"
                     :key="_class"
                     :label="_class"
                     :value="_class">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedTerm" placeholder="所有学期" @change="handleSelectedTerm">
            <el-option v-for="term in choice.optionsForTerm"
                       :key="term"
                       :label="term"
                       :value="term">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedContest" placeholder="所有竞赛" @change="handleSelectedContest">
            <el-option v-for="contest in choice.optionsForContest"
                       :key="contest"
                       :label="contest"
                       :value="contest">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="selectedNumber"  @change="handleSelectedNumber" ref="numberInput" placeholder="请输入学号或姓名"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table id="table" :data="contestData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <!--<el-table-column label="专业" prop="major"></el-table-column>-->
      <el-table-column label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="比赛名称" prop="contest"></el-table-column>
      <el-table-column label="竞赛级别" prop="level"></el-table-column>
      <el-table-column label="奖励等级" prop="grade"></el-table-column>
      <el-table-column label="获奖时间" prop="time"></el-table-column>
      <el-table-column label="比赛类型" prop="kind"></el-table-column>
      <el-table-column label="指导老师" prop="tutor"></el-table-column>
      <el-table-column label="获奖证书" prop="certificate"></el-table-column>
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
    name: 'contest',
    data() {
      return {
        monitor:false,
        contestData: [],
        choice: {
          optionsForMajor: [],
          optionsForTerm: [],
          optionsForContest: []
        },
        optionsForClass: [],
        selectedMajor: '所有专业',
        selectedClass: '所有班级',
        selectedTerm: '所有学期',
        selectedContest: '所有竞赛',
        selectedNumber: '',
        stripeOn: true,
        whileLoading: false,
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        prevStatusOfClassSelection: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0,// 总数据量
        monitor:false,
      }
    },

    created() {
      //获得基本选项
      if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
        this.monitor=true;
      }
      else{
        this.getOptions_basic();
        console.log("233333")
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
      },
    },
    methods: {
      getStudentOptions(dict){
        this.$axios.post('/sm/contestoptions',dict).then(
          res => {
            this.choice.optionsForTerm = ['所有学期'].concat(res.data.data.optionsForTerm);
            this.choice.optionsForContest = ['所有竞赛'].concat(res.data.data.optionsForContest);
          }
        )
      },

      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedNumber.length!==0) {
          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
        }
        else {
          if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
          if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        }
        if(this.selectedTerm!=='所有学期') dict.term=this.selectedTerm;
        if(this.selectedContest!=='所有竞赛') dict.contest=this.selectedContest;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post("/sm/contest", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.contestData =  response.data.data.students;
            this.whileLoading = false;
          }
        });
      },
      //从后端获得基本选项
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(res => {
            res.data.data=["站位","所有专业"].concat(res.data.data);
            this.choice.optionsForMajor = res.data.data;
          }
        );
        console.log(this.choice.optionsForMajor)
      },
      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
          res => {
            this.optionsForClass = ['所有班级'].concat(res.data.data);
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
        if(this.selectedMajor!=='所有专业') dict.major=this.selectedMajor;
        if(this.selectedClass!=='所有班级') dict._class=this.selectedClass;
        if(this.selectedTerm!=='所有学期') dict.term=this.selectedTerm;
        if(this.selectedContest!=='所有竞赛') dict.contest=this.selectedContest;
        var start = new RegExp(/^\d+/);
        if(start.exec(this.selectedNumber)===null){
          dict.stuName=this.selectedNumber;
        }
        else{
          dict.number = this.selectedNumber;
        }
        //发送请求
        this.$axios.post("/sm/contest/export-contest", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '竞赛情况.xlsx');
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
      handleSelectedTerm(){
        this.resetPage();
      },
      handleSelectedContest(){
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
      //限制学号只能输入数字
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
