<template>
  <!--  综测情况汇总  -->
  <div>
<!--    title     -->
    <p style="color: #c0c4cc;">*提示：智育分数将由辅导员统一导入，德育分数、减分分数将由班长统一填写。学生只需点击“突出贡献加分”“先进典型加分”“学生干部及其他加分”按钮进行加分项的填写。</p><br>
    <div align="center">
      <h1>{{currentAcademicYear}}年综合测评</h1>
    </div>
<!--    主界面   -->
    <comprehensive-detail
      :grade = 'basicInfo.grade'
      :current-credit = 'basicInfo.currentCredit'
      :failed-number = 'basicInfo.failedNumber'
      :moral-score = 'basicInfo.moralScore'
      @pageToGrowing = 'pageToGrowing'
      @pageToCAOB = 'pageToCAOB'
    />
<!--    两个按钮    -->
    <div>
      <el-row style="text-align: center; padding-top: 10%;">
        <el-button type="primary" @click="back">返回</el-button>
        <el-button type="primary" @click="editRecords">加分项管理</el-button>
      </el-row>
    </div>
<!--    弹出加分项详情    -->
    <bonus-management
      :edit-add = 'editAdd'
      :add-group = 'addGroup'
      @deleteOne = 'deleteOne'
    />
  </div>
</template>

<script>
  import ComprehensiveDetail from "./elements/ComprehensiveDetail.vue";
  import BonusManagement from "./elements/BonusManagement.vue";
  export default {
    name: "ComprehensiveDeclare",
    components: {
      BonusManagement,
      ComprehensiveDetail
    },
    data(){
      return {
        basicInfo:{
          grade: 0,
          currentCredit: 0,
          failedNumber: 0,
          moralScore: '',
        },
        currentAcademicYear:'',
        editAdd: false,
        addGroup: []
      }
    },
    created(){
      this.currentAcademicYear = this.$route.query.term;
      console.log(this.currentAcademicYear);
      this.$axios.post('/sm/comprehensive/basicinfo',{currentAcademicYear:this.currentAcademicYear}).then(res=>{
        this.basicInfo = res.data.data;
      });
    },
    methods:{
      pageToCAOB(){
        this.$router.push({
            name: 'cadresAndOthersBonus',
          //query:{currentAcademicYear:this.currentAcademicYear},
            query:{term:this.currentAcademicYear},
            //params: {selectedClass: this.cards[index], selectedMajor: this.major[index]}
          });
      },
      back(){
        this.$router.push({
          name: 'comprehensiveIndex',
          query:{term:this.currentAcademicYear}
        });
      },
      pageToGrowing(){
        this.$router.push({
          name: 'growingfile',
        });
      },
      editRecords() {
        this.editAdd = true;
        let dict = {};
        this.$axios.post('sm/comprehensive/getAllAddGrade', dict).then(response => {
          if (response.data.status === 0) {
            this.addGroup = response.data.data;
          }
        })
      },
      deleteOne(record) {
        this.$confirm('是否确认删除此记录（删除不可恢复）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.id = record.id;
          console.log(record.id)
          this.$axios.post('sm/comprehensive/deleteItem', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('删除成功！');
              this.editAdd = false;
            }
            else {
              this.$message.error('删除失败！');
            }
          })
        }).catch(() => {
          this.$message.info('删除取消');
        });
      }
    },

    }


</script>

<style scoped>

</style>
