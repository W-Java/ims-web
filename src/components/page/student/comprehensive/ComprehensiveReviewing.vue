<template>
  <div>
    <h1 align="center">{{currentAcademicYear}}年综合测评</h1>
    <div>
      <el-row class="basicExih">
        <el-col :span="4"><b>加权成绩</b></el-col>
        <el-col :span="20">{{basicInfo.grade}}</el-col>
      </el-row>
      <el-row class="basicExih">
        <el-col :span="4"><b>本学年所修学分</b></el-col>
        <el-col :span="20">{{basicInfo.currentCredit}}</el-col>
      </el-row>
      <el-row class="basicExih">
        <el-col :span="4"><b>挂科数</b></el-col>
        <el-col :span="20">{{basicInfo.failedNumber}}</el-col>
      </el-row>
      <el-row class="basicExih">
        <el-col :span="4"><b>德育分</b></el-col>
        <el-col :span="20">{{basicInfo.moralScore}}</el-col>
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
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag>{{scope.row.status}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
      <!--<el-row class="basicExih">-->
        <!--<el-col :span="4"><b>加分成绩</b></el-col>-->
        <!--<el-col :span="20">{{basicInfo.bonusScore}}</el-col>-->
      <!--</el-row>-->
      <el-row class="basicExih">
        <el-col :span="4"><b>最终成绩</b></el-col>
        <el-col :span="20">{{basicInfo.finalScore}}</el-col>
      </el-row>
    </div>
    <div style="padding-left: 50%;">
      <el-button type="primary" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name:"comprehensivereviewing",
  data(){
    return{
      //reviewed:'',   //是否审核过了
      basicInfo:{
        grade: '',
        currentCredit: '',
        failedNumber: '',
        moralScore: '',
        finalScore: '',
        bonus:'',
      },
      statusList:{
        'UNCHECKED':'未审核',
        'FAILED':'审核驳回',
        'FIRSTPASS':'班长审核通过',
        'SECONDPASS':'班级互审通过',
        'PASS':'最终通过',
        'SAVING':'打分表暂存'
      },
      data:[],
      currentAcademicYear:'',
    }
  },
  created(){
    this.currentAcademicYear = this.$route.query.term;
    this.$axios.post('sm/comprehensive/basicinfo',{currentAcademicYear:this.currentAcademicYear}).then(
      res=>{
        if(res.data.status === 0){
          this.basicInfo = res.data.data;
        }
      }).catch(error=>{

    }).finally(()=>{
      this.$axios.post('/sm/comprehensive/reviewing/itemTable',{currentAcademicYear:this.currentAcademicYear}).then(
        res=>{
          if(res.data.status === 0){
            this.data = res.data.data;
            let maxCadres = 0;
            let sum = 0;
            this.data = this.data.sort((a,b) => {
              return a.itemType>b.itemType;
            });
            for(let item of this.data){
              item.contestKind = (item.contestKind ===null || item.contestKind==='null') ? '' : item.contestKind ;
              item.contestLevel = (item.contestLevel ===null || item.contestLevel==='null') ? '' : item.contestLevel ;
              item.gradeLevel = (item.gradeLevel ===null || item.gradeLevel==='null') ? '' : item.gradeLevel ;
              item.itemName = item.contestKind + "  " + item.contestLevel + "  " + item.gradeLevel + "  " + item.itemName;
              item.realstatus = item.status;
              item.status = this.statusList[item.status];
              if(item.itemType === '学生干部' && maxCadres < item.score && item.status !== 'FAILED'){
                maxCadres = item.score;
              }
              if(item.itemType !== '学生干部' && item.realstatus !== 'FAILED'){
                sum += item.score;
              }
            }
            sum += maxCadres;
            console.log(maxCadres);
            this.basicInfo.bonus = sum > 3 ? 3 : sum;
            this.basicInfo.finalScore = (this.basicInfo.grade*0.8 + this.basicInfo.moralScore*0.2 +this.basicInfo.bonus).toFixed(2);
            //智育分*80%+德育分*20%+加减分项
          }
        });
    });
  },
  methods:{
    //表格合并单元格渲染
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
    back(){
      this.$router.push({
        name: 'comprehensiveIndex',
        query:this.currentAcademicYear
      });
    }
  }
}
</script>

<style>
  .basicExih{
    padding: 1%;
  }
</style>
