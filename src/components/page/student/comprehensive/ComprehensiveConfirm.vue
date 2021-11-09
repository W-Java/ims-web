<template>
  <div>
<!--    班长显示两个 学生显示一个     -->
    <p style="color: #ec2a00;" v-if="monitor">
      *提示：请确保本班所有同学在公示确认阶段完成对自己综测结果的确认。
    </p><br>
    <p style="color: #c0c4cc;">
      *提示：请在公示阶段完成前点击“确认综测结果”按钮完成对自己综测结果的确认。
    </p><br>
<!--    标题    -->
    <h1 align="center">{{currentAcademicYear}}年综合测评</h1>
<!--    综合测评表     -->
    <ComprehensiveForm
      :grade = 'basicInfo.grade'
      :current-credit = 'basicInfo.currentCredit'
      :fail-number = 'basicInfo.failedNumber'
      :moral-score = 'basicInfo.moralScore'
      :bonus = 'basicInfo.bonus'
      :final-score = 'basicInfo.finalScore'
      :compre-rank = 'basicInfo.compreRank'
    />
<!--    最终信息表   -->
    <FinalInformation
      :checked = 'checked'
      :show-table = 'showTable'
      :students-data = 'studentsData'
      :loading = 'loading'
      :current-page = 'currentPage'
      :page-size = 'pageSize'
      :record-quantity = 'recordQuantity'
      @handleSizeChange = 'handleSizeChange'
      @handleCurrentChange = 'handleCurrentChange'
    />
  </div>
</template>

<script>
import ComprehensiveForm from "./elements/ComprehensiveConfirm/ComprehensiveForm";
import FinalInformation from "./elements/ComprehensiveConfirm/FinalInformation";

export default {
  name:'comprehensiveconfirm',
  components: {
    ComprehensiveForm,
    FinalInformation
  },
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
