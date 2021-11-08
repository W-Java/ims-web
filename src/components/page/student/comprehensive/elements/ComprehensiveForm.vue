<template>
  <div>
    <el-row class="basicExih">
      <el-col :span="4"><b>加权成绩</b></el-col>
      <el-col :span="2">&nbsp{{grade}}</el-col>
      <el-col :span="4"><b>本学年所修学分</b></el-col>
      <el-col :span="2">{{currentCredit}}</el-col>
      <el-col :span="4"><b>挂科数</b></el-col>
      <el-col :span="2">{{failedNumber}}</el-col>
      <el-col :span="4"><b>德育分</b></el-col>
      <el-col :span="2">{{moralScore}}</el-col>
    </el-row>
    <el-row class="basicExih">
      <el-col :span="4"><b>综合素质加分合计</b></el-col>
      <el-col :span="20">{{bonus}}</el-col>
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
      <el-col :span="4">{{finalScore}}</el-col>
      <el-col :span="4"><b>排名</b></el-col>
      <el-col :span="4">{{compreRank}}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['grade', 'currentCredit', 'failNumber', 'moralScore', 'bonus', 'finalScore', 'compresRank']
}
</script>

<style scoped>

</style>
