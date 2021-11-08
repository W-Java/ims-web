<template>
  <div>
<!--    班长显示两个 学生显示一个     -->
    <p style="color: #ec2a00;" v-if="monitor">
      *提示：请确保本班所有同学在公示确认阶段完成对自己综测结果的确认。
    </p><br>
    <p style="color: #c0c4cc;">
      *提示：请在公示阶段完成前点击“确认综测结果”按钮完成对自己综测结果的确认。
    </p><br>
<!--    XXXX年综合测评表     -->
    <h1 align="center">{{currentAcademicYear}}年综合测评</h1>
    <div>
      <el-row class="basicExih">
        <el-col :span="4"><b>加权成绩</b></el-col>
        <el-col :span="2">&nbsp{{basicInfo.grade}}</el-col>
        <el-col :span="4"><b>本学年所修学分</b></el-col>
        <el-col :span="2">{{basicInfo.currentCredit}}</el-col>
        <el-col :span="4"><b>挂科数</b></el-col>
        <el-col :span="2">{{basicInfo.failedNumber}}</el-col>
        <el-col :span="4"><b>德育分</b></el-col>
        <el-col :span="2">{{basicInfo.moralScore}}</el-col>
      </el-row>
      <el-row class="basicExih">
        <el-col :span="4"><b>综合素质加分合计</b></el-col>
        <el-col :span="20">{{basicInfo.bonus}}</el-col>
      </el-row>
      <el-row class="basicExih">
        <el-col :span="24"><b>综合加分细则</b></el-col>
      </el-row>
      <el-row>
        <el-table
          border
          :span-method="tableSpanMethod"
          :data="data">
          <el-table-column
            label="加分类别"
            prop="itemType">
          </el-table-column>
          <!--<el-table-column-->
          <!--label="类别总分"-->
          <!--prop="typeTotal">-->
          <!--</el-table-column>-->
          <el-table-column
            label="加分项名"
            prop="itemName">
          </el-table-column>
          <el-table-column
            label="分值"
            prop="score">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="basicExih">
        <!--<el-col :span="4"><b>加分成绩</b></el-col>-->
        <!--<el-col :span="4">{{basicInfo.grade}}</el-col>-->
        <el-col :span="4"><b>最终成绩</b></el-col>
        <el-col :span="4">{{basicInfo.finalScore}}</el-col>
        <el-col :span="4"><b>排名</b></el-col>
        <el-col :span="4">{{basicInfo.compresRank}}</el-col>
      </el-row>
    </div>
<!--    公式确认的按钮     -->
    <div style="text-align: right" v-if="checked">
      <el-button type="primary" @click.native="check">公示确认</el-button>
    </div>
<!--    综测公示的表格   -->
    <!--控制结束后学生页面不再展示别人的公示-->
    <div v-if="showTable">
      <div style="padding-top: 2%">
        <el-table id="table"
                  style="width: 100%" stripe
                  :data="studentsData"
                  v-loading="loading"
                  border>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="studentsData[props.$index].records" style="width: 100%">
                <el-table-column label="项目类型" prop="itemType"></el-table-column>
                <el-table-column label="项目名" prop="itemName"></el-table-column>
                <el-table-column label="项目等级">
                  <template slot-scope="scope">
                    <span v-if="scope.row.itemLevel!==null&&scope.row.itemLevel!=='null'">{{scope.row.itemLevel}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="项目分数" prop="score"></el-table-column>
                <el-table-column label="凭证">
                  <template slot-scope="scope">
                    <span v-if="scope.row.imgUrl===null">暂无证明</span>
                    <img v-else class="scoreImg" v-bind:src="scope.row.imgUrl"/>
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="reason"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="compreRank" label="综测排名">
          </el-table-column>
          <el-table-column prop="majorRank" label="裸分排名">
          </el-table-column>
          <el-table-column prop="_class" label="班级">
          </el-table-column>
          <el-table-column prop="number" label="学号">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="grade" label="裸分">
          </el-table-column>
          <el-table-column prop="moral" label="德育分">
          </el-table-column>
          <el-table-column prop="addGrade" label="综测加分">
          </el-table-column>
          <el-table-column prop="allGrade" label="总分">
          </el-table-column>
        </el-table>
      </div>
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
    </div>
  </div>
</template>

<script>

export default {
  name:'comprehensiveconfirm',
  data(){
    return {
      currentAcademicYear: '',
      basicInfo: {
        grade: '&nbsp',
        currentCredit: '&nbsp',
        failedNumber: '&nbsp',
        moralScore: '&nbsp',
        bonusScore: '&nbsp',
        finalScore: '&nbsp',
        bonus: '&nbsp',
        compreRank: '&nbsp'
      },
      checked: false,
      showTable: false,
      data: [],
      studentsData: [],
      pageSize: 20,
      currentPage: 1,
      recordQuantity: 0,
      monitor: false,
      loading: true,
  }
  },
  created(){
    this.monitor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0;
    this.currentAcademicYear = this.$route.query.term;
    //个人成绩信息
    this.$axios.get('/sm/comprehensive/yearStatus/'+this.currentAcademicYear).then(res=>{
      if(res.data.data !== 'CLOSED'){
        this.showTable = true;
      }
      if(this.showTable === true)
        this.sendQuery();
    });
    this.$axios.post('sm/comprehensive/acknowledge',{isUpdate:false,year:this.currentAcademicYear}).then(res=>{
      if(res.data.status === 0) {
        this.checked = !res.data.data.isAcknowledge;
      }
    });
    this.$axios.post('/sm/comprehensive/basicinfo',{currentAcademicYear:this.currentAcademicYear}).then(res=>{
      if(res.data.status === 0){
        this.basicInfo = res.data.data;
      }
    });
    this.$axios.post('/sm/comprehensive/reviewing/itemTable',{currentAcademicYear:this.currentAcademicYear}).then(
      res=>{
        if(res.data.status === 0){
          this.data = res.data.data;
          this.data = this.data.sort((a,b) =>{
            return a.itemType>b.itemType;
          });
          this.data.forEach(function (item) {
            item.contestKind = (item.contestKind ===null || item.contestKind==='null') ? '' : item.contestKind ;
            item.contestLevel = (item.contestLevel ===null || item.contestLevel==='null') ? '' : item.contestLevel ;
            item.gradeLevel = (item.gradeLevel ===null || item.gradeLevel==='null') ? '' : item.gradeLevel ;
            item.itemName = item.contestKind + "  " + item.contestLevel + "  " + item.gradeLevel + "  " + item.itemName;
          });

        }
      });
  },
  methods:{
    check(){
      this.$axios.post('sm/comprehensive/acknowledge',{isUpdate:true,year:this.currentAcademicYear}).then(res=>{
        if(res.data.status === 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
            this.checked = !res.data.data.isAcknowledge;
        }
      })
    },
    sendQuery(){
        let dict ={};
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        dict.year = this.currentAcademicYear;
        this.loading = true;
        this.$axios.post('/sm/comprehensive/studentRecords',dict).then(
          res=>{
            if(res.data.status === 0){
              this.recordQuantity = res.data.data.recordQuantity;
              this.studentsData = res.data.data.students;
              let index = 1;
              for(let i of this.studentsData){
                i.compreRank = (this.currentPage-1)*this.pageSize + index;
                index++;
                i.records = [];
                if (i.addGroup !== []) {
                  for (let j of i.addGroup)
                    i.records = i.records.concat(j.records);
                  console.log(i.records)
                }
              }
            }
          }).catch(res=>{
            this.$message.error("数据载入失败");
        }).finally(res=>{
          this.loading = false;
        });
    },
    tableSpanMethod({row,column,rowIndex,columnIndex}){
      if(columnIndex === 0){    //要渲染的所在列
        let num = 0;
        for(let i = 0; i < this.data.length; i++){
          if(row.itemType === this.data[i].itemType){
            num++;
          }
        }
        if(num === 1){
          return{
            rowspan:num,
            colspan:1
          };
        }
        else if(num > 1){
          if(this.data[rowIndex - 1] && this.data[rowIndex].itemType === this.data[rowIndex - 1].itemType){
            return{
              rowspan:0,
              colspan:0
            }
          }else{
            return{
              rowspan:num,
              colspan:1
            }
          }
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.sendQuery()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.sendQuery()
    },
  }
}
</script>

<style>
  .basicExih{
    padding: 1%;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #659bbf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .scoreImg {
    width: 150px;
    height: 100px;
  }

</style>
