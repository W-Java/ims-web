<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row :gutter="10">
        <el-col :span="2">
          <el-switch style="margin-top: 10px"
                     v-model="kindSwitch"
                     @change="handleKindSwitch"
                     active-text="论文"
                     inactive-text="专利">
          </el-switch>
        </el-col>
        <el-col :class="{'is-display':kindSwitch}" :span="4">
          <el-select v-model="patent.selectedTime"
                     @change="handleSelectedPatentTime"
                     placeholder="所有年份">
            <el-option v-for="time in patent.choice.optionsForTime"
                       :key="time"
                       :label="time"
                       :value="time">
            </el-option>
          </el-select>
        </el-col>
        <el-col :class="{'is-display':kindSwitch}" :span="4">
          <el-select v-model="patent.selectedLevel"
                     @change="handleSelectedLevel"
                     placeholder="是否为第一发明人">
            <el-option v-for="level in patent.choice.optionsForLevel"
                       :key="level"
                       :label="level"
                       :value="level">
            </el-option>
          </el-select>
        </el-col>
        <el-col :class="{'is-display':!kindSwitch}" :span="4">
          <el-select v-model="paper.selectedPaperTime"
                     @change="handleSelectedPaperTime"
                     placeholder="所有年份">
            <el-option v-for="time in paper.choice.optionsForTime"
                       :key="time"
                       :label="time"
                       :value="time">
            </el-option>
          </el-select>
        </el-col>
        <el-col :class="{'is-display':!kindSwitch}" :span="4">
          <el-select v-model="paper.selectedSituation"
                     @change="handleSelectedSituation"
                     placeholder="所有收录情况">
            <el-option v-for="situation in paper.choice.optionsForSituation"
                       :key="situation"
                       :label="situation"
                       :value="situation">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="selectedNumber" @change="handleSelectedNumber" ref="numberInput" placeholder="请输入学号或姓名"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table id="tablePatent" :class="{'is-display':kindSwitch}" :data="patent.patentData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="专利名称" prop="patent"></el-table-column>
      <el-table-column label="类别" prop="kind"></el-table-column>
      <el-table-column label="授权号" prop="authorization"></el-table-column>
      <el-table-column label="获批时间" prop="time"></el-table-column>
      <el-table-column label="是否为第一发明人" prop="level"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
    </el-table>
    <el-button :class="{'is-display':kindSwitch}" @click="exportTable()" size="small">导出表格</el-button>
    <el-table id="tablePaper" :class="{'is-display':!kindSwitch}" :data="paper.paperData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="论文名称" prop="paper"></el-table-column>
      <el-table-column label="发表期刊" prop="publish"></el-table-column>
      <el-table-column label="发表时间" prop="time"></el-table-column>
      <el-table-column label="收录情况" prop="level"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
    </el-table>
    <el-button :class="{'is-display':!kindSwitch}" @click="exportTable()" size="small">导出表格</el-button>
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
  .is-display{
    display:none
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
    name: 'paperpatent',
    data() {
      return {
        patent: {
          patentData:[],
          choice:{
            optionsForTime: [],
            optionsForLevel: [],
          },
          selectedTime: '所有年份',
          selectedLevel: '是否为第一发明人',
        },
        paper: {
          paperData: [],
          choice: {
            optionsForTime: [],
            optionsForSituation: [],
          },
          selectedTime: '所有年份',
          selectedSituation: '所有收录',
        },
        selectedNumber: '',
        kindSwitch: true,
        stripeOn: true,
        whileLoading: false,
        classSelectionDisabled: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
      }
    },

    created() {
      this.optionsFor_basic();
      this.sendQuery()
    },
    methods: {
      handleKindSwitch(){
        this.selectedNumber='';
        this.patent.selectedTime='所有年份';
        this.patent.selectedLevel='是否为第一发明人';
        this.paper.selecedTime='所有年份';
        this.paper.selectedSituation='所有收录';
        this.optionsFor_basic();
        this.sendQuery();
      },
      optionsFor_basic(){
        if(this.kindSwitch===false){
          this.$axios.get('/sm/patentoptions').then(
            res => {
              this.patent.choice.optionsForTime = ['所有年份'].concat(res.data.data.optionsForTime);
              this.patent.choice.optionsForLevel = ['是否为第一发明人'].concat(res.data.data.optionsForLevel);
            }
          );
        }else{
          this.$axios.get('/sm/paperoptions').then(
            res => {
              this.paper.choice.optionsForTime = ['所有年份'].concat(res.data.data.optionsForTime);
              this.paper.choice.optionsForSituation = ['所有收录'].concat(res.data.data.optionsForSituation);
            }
          );
        }
      },
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.kindSwitch===false){
          if(this.patent.selectedTime!=='所有年份') dict.time=this.patent.selectedTime;
          if(this.patent.selectedLevel!=='是否为第一发明人') dict.level=this.patent.selectedLevel;
          if (this.selectedNumber.length!== 0){

            var start = new RegExp(/^\d+/);
            if(start.exec(this.selectedNumber)===null){
              dict.stuName=this.selectedNumber;
            }
            else{
              dict.number = this.selectedNumber;
            }
          }
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          //发送请求
          this.$axios.post("/sm/patent", dict).then(response => {
            if (response.data.status === 0) {
              this.recordQuantity = response.data.data.recordQuantity;
              this.patent.patentData =  response.data.data.students;
              this.whileLoading = false;
            }
          });
        }else {
          if (this.paper.selectedTime !== '所有年份') dict.time = this.paper.selectedTime;
          if (this.paper.selectedSituation !== '所有收录') dict.level = this.paper.selectedSituation;
          if (this.selectedNumber.length!== 0){

            var start = new RegExp(/^\d+/);
            if(start.exec(this.selectedNumber)===null){
              dict.stuName=this.selectedNumber;
            }
            else{
              dict.number = this.selectedNumber;
            }
          }
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          //发送请求
          this.$axios.post("/sm/paper", dict).then(response => {
            if (response.data.status === 0) {
              this.recordQuantity = response.data.data.recordQuantity;
              this.paper.paperData = response.data.data.students;
              this.whileLoading = false;
            }
          });
        }
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
        if(this.kindSwitch===false){
          if(this.patent.selectedTime!=='所有年份') dict.time=this.patent.selectedTime;
          if(this.patent.selectedLevel!=='是否为第一发明人') dict.level=this.patent.selectedLevel;
          if (this.selectedNumber.length!== 0){
            var start = new RegExp(/^\d+/);
            if(start.exec(this.selectedNumber)===null){
              dict.stuName=this.selectedNumber;
            }
            else{
              dict.number = this.selectedNumber;
            }
          }
          //发送请求
          this.$axios.post("/sm/patent/export-patent", dict,{responseType:'blob'}).then(response => {
            saveBytes = response.data;
            saveByteArray([saveBytes], '专利情况.xlsx');
            this.whileLoading=false;
          }).catch((error)=>{})
        }else {
          if (this.paper.selectedTime !== '所有年份') dict.time = this.paper.selectedTime;
          if (this.paper.selectedSituation !== '所有收录') dict.level = this.paper.selectedSituation;
          if (this.selectedNumber.length!== 0){

            var start = new RegExp(/^\d+/);
            if(start.exec(this.selectedNumber)===null){
              dict.stuName=this.selectedNumber;
            }
            else{
              dict.number = this.selectedNumber;
            }
          }          //发送请求
          this.$axios.post("/sm/paper/export-paper", dict,{responseType:'blob'}).then(response => {
            saveBytes = response.data;
            saveByteArray([saveBytes], '论文情况.xlsx');
            this.whileLoading=false;
          })
        }
      },

      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },
      handleSelectedPatentTime(){
        this.resetPage();
      },
      handleSelectedLevel(){
        this.resetPage();
      },
      handleSelectedPaperTime(){
        this.resetPage();
      },
      handleSelectedSituation(){
        this.resetPage();
      },
      handleSelectedNumber(){
        this.sendQuery();
      },

    }
  }

</script>
