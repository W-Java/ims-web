<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row>
        <el-col :span="4" v-if="!monitor">
          <el-select v-model="selectedMajor"
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
                     :disabled="classSelectionDisabled"
                     @change="handleSelectedClass"
                     placeholder="所有班级">
            <el-option v-for="_class in optionsForClass"
                       :key="_class"
                       :label="_class"
                       :value="_class">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedTerm" @change="handleSelectedTerm" placeholder="学年学期">
            <el-option v-for="term in choice.optionsForTerm"
                       :key="term"
                       :label="term"
                       :value="term">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-container>
            <el-input v-model="scoreLowerBound" @change="handleSelectedScore" placeholder="分数下界"
                      ref="inputLowerBound"></el-input>
            <div style="align-items: center;line-height: 240%;">
              <i class="el-icon-minus"></i>
            </div>
            <el-input v-model="scoreUpperBound" @change="handleSelectedScore" placeholder="分数上界"
                      ref="inputUpperBound"></el-input>
          </el-container>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedScoreSegment" @change="setScoreSegment" placeholder="分数段选择">
            <el-option v-for="segment in scoreSegment"
                       :key="segment"
                       :label="segment"
                       :value="segment">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <el-table id="table" :data="gradeData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn"
              @sort-change="sortGrades">
      <el-table-column label="专业排名" prop="majorRank"></el-table-column>
      <el-table-column label="班级排名" prop="classRank"></el-table-column>
      <el-table-column label="班级名称" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="总学分" prop="credit"></el-table-column>
      <el-table-column label="不及格门数" prop="failNum"></el-table-column>
      <el-table-column label="加权平均分" prop="grade" sortable="custom"></el-table-column>
    </el-table>
    <el-row :gutter="10">
      <el-col :span="2">
        <el-button @click="exportTable()" type="primary" size="small">导出表格</el-button>
      </el-col>
      <el-col :span="5">
        <el-button size="small" type="primary" @click="handleCommand">导入表格</el-button>

        <el-dialog width="50%"  title="导入提示" :visible.sync="dialogVisible">
          <el-row :gutter="5">
            <el-col :span="24">
              <div style="font-size: small;color: #606266">1.支持导入单个学期成绩，请正确选择对应学期</div>
              <div style="font-size: small;color: #606266">2.如果对应记录存在则会更新，请谨慎操作</div>
              <div style="font-size: small;color: #606266">3.表格上传后系统会进行导入，处理完成后会给您发送系统消息</div>
              <div style="font-size: small;color: #606266">只能上传xls/xlsx文件,<a href="https://ims-file.oss-cn-shenzhen.aliyuncs.com/%E5%AD%A6%E7%94%9F%E6%88%90%E7%BB%A9%E7%A4%BA%E4%BE%8B%E8%A1%A8%E6%A0%BC.xls
">点此下载示例表格</a></div>
              <br><br>
            </el-col>
            <el-col :span="12" >
              <el-select v-model="selectedTerms" placeholder="专业选择">
                <el-option
                  v-for="term in choice.optionsForTerms"
                  :key="term"
                  :label="term"
                  :value="term">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" >
              <el-upload
                ref="upload"
                action="sm/uploadExcel"
                :before-upload="beforefileupload"
                :file-list="fileList"
                :on-sucess="handlesucess"
                :auto-upload="true">
                <!--<div style="font-size: small;color: #606266">只能上传xls/xlsx文件,<a href="www.baidu.com">点此下载示例表格</a></div>-->
                <el-button slot="trigger" size="small" type="primary" @click="submitUpload" :disabled="uploadButtonDisabled">导入表格</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-dialog>
      </el-col>
      <div class="block" style="float: right;">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[20, 30, 40]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="recordQuantity">
        </el-pagination>
      </div>
    </el-row>
    <!--<el-row>-->
    <!--<div  style="font-size: small;color: #606266" >只能上传xls/xlsx文件,<a href="www.baidu.com">点此下载示例表格</a></div>-->
    <!--</el-row>-->
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
    name: 'studentgrades',
    data() {
      return {
        monitor: false,
        gradeData: [],
        fileList: [],
        choice: {
          optionsForMajor: [],
          optionsForTerm: [],
          optionsForTerms: ['2016-2017-1','2016-2017-2','2017-2018-1','2017-2018-2','2018-2019-1','2018-2019-2','2019-2020-1','2019-2020-2']
        },
        selectedMajor: '所有专业',
        selectedClass: '所有班级',
        selectedScore: '',
        selectedTerm: '所有学期',
        selectedTerms: '所有学期',
        selectedScoreSegment: undefined,
        selectedSort: '',
        selectedSortKind: '',
        symptomScoreSegment: ["91-100", "81-90", "71-80", "61-70", "51-60", "41-50", "31-40", "21-30", "11-20", "0-10"],
        scoreUpperBound: undefined,
        scoreLowerBound: undefined,
        statementIsTrue: true,
        stripeOn: true,
        whileLoading: true,
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        uploadButtonDisabled: true,
        pageSize: 20,
        currentPage: 1,
        recordQuantity: 0,
        dialogVisible: false
      }
    },
    created() {
      //获得基本选项
      if (JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0) {
        this.monitor = true;
      }
      else {
        this.getOptions_basic();
      }
      this.sendQuery()
    },
    asyncComputed: {
      classSelectionDisabled() {
        return this.selectedMajor === "所有专业";
      },
      uploadButtonDisabled(){
        return this.selectedTerms === '所有学期';
      },
      // 班级选项
      optionsForClass() {
        if (this.selectedMajor !== '所有专业') {
          return this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              return ['所有班级'].concat(res.data.data);
            }
          );
        }
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
    watch: {
      scoreLowerBound(newVal, oldVal) {
        this.scoreLowerBound = newVal.replace(/[\D]/g, '');
        let lowerBound = parseInt(this.scoreLowerBound);
        if (lowerBound < 0 || lowerBound > 100)
          this.scoreLowerBound = oldVal;
        this.$refs['inputLowerBound'].currentValue = this.scoreLowerBound;
      },
      scoreUpperBound(newVal, oldVal) {
        this.scoreUpperBound = newVal.replace(/[\D]/g, '');
        let upperBound = parseInt(this.scoreUpperBound);
        if (upperBound < 0 || upperBound > 100)
          this.scoreUpperBound = oldVal;
        this.$refs['inputUpperBound'].currentValue = this.scoreUpperBound;
      }
    },
    methods: {
      sendQuery: function () {

        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedSort !== '') {
          dict.sort = this.selectedSort;
          dict.kind = this.selectedSortKind;
        }
        if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        if (this.selectedTerm !== '所有学期') dict.term = this.selectedTerm;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        dict.scoreUpperBound = this.scoreUpperBound;
        dict.scoreLowerBound = this.scoreLowerBound;
        if (parseInt(this.scoreLowerBound) > parseInt(this.scoreUpperBound)) {
          this.$message("分数下界不能大于分数上界");
          return;
        }
        //发送请求
        this.$axios.post('/sm/stugrades', dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.gradeData = response.data.data.students;
            this.whileLoading = false;
          }
        });
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(res => {
          res.data.data = ['所有专业'].concat(res.data.data);
          this.choice.optionsForMajor = res.data.data;
        })
      },
      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(res => {
          res.data.data = ['所有班级'].concat(res.data.data);
          this.choice.optionsForClass = res.data.data;
        });
      },

      setScoreSegment() {
        let lowerBound = (9 - this.symptomScoreSegment.indexOf(this.selectedScoreSegment)) * 10;
        this.scoreLowerBound = (lowerBound === 0 ? '0' : '' + (lowerBound + 1));
        this.scoreUpperBound = '' + (lowerBound + 10);
        this.resetPage();
      },
      handleCommand() {
        this.dialogVisible = true;
        this.$axios.post('/sm/stugradesoptions', dict).then(
          res => {
            this.choice.optionsForTerm = ['所有学期'].concat(res.data.data.optionsForTerm)
          }
        )
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery()
      },
      exportTable() {
        this.$confirm('此操作将导出所筛选的工作记录, 是否继续?', '提示', {type: 'warning'})
          .then(() => {
            // 向请求服务端导出记录
            this.whileLoading = true;
            // 生成条件
            const dict = {};
            if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
            if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
            if (this.selectedTerm !== '所有学期') dict.term = this.selectedTerm;
            dict.scoreUpperBound = this.scoreUpperBound;
            dict.scoreLowerBound = this.scoreLowerBound;
            if (parseInt(this.scoreLowerBound) > parseInt(this.scoreUpperBound)) {
              this.$message("分数下界不能大于分数上界");
              return;
            }
//        发送请求
            this.$axios.post("/sm/grade/export-grade", dict, {responseType: 'blob'}).then(response => {
              saveBytes = response.data;
              saveByteArray([saveBytes], '学生成绩.xlsx');
              this.whileLoading = false;
            })
          })
      },
      handlesucess(res, file, filelist) {
        filelist.concat({name: file.name});
        console.log(filelist);
        if (res.data.status === 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        }
        else if (res.data.status === 250) {
          this.$confirm({
            message: res.data.message,
            type: 'wrong'
          });
          this.$axios.post("sm/downloadFailedData", {fileKey: res.data.data}, {responseType: 'blob'}).then(response => {
            saveBytes = response.data;
            saveByteArray([saveBytes], '失败信息.xlsx');
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'fail'
          });
        }
      },
      beforefileupload(file) {
        let Xls = file.name.split('.');
        if (Xls[1] === 'xls' || Xls[1] === 'xlsx') {
          let fd = new FormData();
          fd.append('file', file);
          fd.append('tableType', 'study_grade');
          fd.append('para', this.selectedTerms);                                                                                      //TODO 改学期
          let config={headers:{'Content-Type':'multipart/form-data'}};
          this.$axios.post("sm/uploadExcel", fd, config).then(res => {
            console.log(res);
          })
          // uploadfiledata.action="studentgrades";
          // uploadfiledata.para=this.selectedTerm;
          return false
        } else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!')
          return false
        }
      },

      getStudentOptions(dict) {
        this.$axios.post('/sm/stugradesoptions', dict).then(
          res => {
            this.choice.optionsForTerm = ['所有学期'].concat(res.data.data.optionsForTerm)
          }
        )
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
      resetSelectedClass() {
        this.currentPage = 1;
        this.selectedClass = '所有班级';
      },

      handleSelectedTerm() {
        this.resetPage();
      },

      handleSelectedScore() {
        this.resetPage();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      sortGrades(column) {
        console.log(column.order)
        var order = column.order;
        this.selectedSort = column.prop;
        if (order === "descending")
          this.selectedSortKind = "desc";
        else if (order === "ascending")
          this.selectedSortKind = "acs";
        else if (order === null)
          this.selectedSort = '';
        this.sendQuery()
      }
    }
  }
</script>
