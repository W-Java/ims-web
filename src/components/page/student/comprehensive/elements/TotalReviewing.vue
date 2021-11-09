<template>
  <div>
    <el-row class="basicExih">
      <el-col :span="4"><b>加权成绩</b></el-col>
      <el-col :span="20">{{grade}}</el-col>
    </el-row>
    <el-row class="basicExih">
      <el-col :span="4"><b>本学年所修学分</b></el-col>
      <el-col :span="20">{{currentCredit}}</el-col>
    </el-row>
    <el-row class="basicExih">
      <el-col :span="4"><b>挂科数</b></el-col>
      <el-col :span="20">{{failedNumber}}</el-col>
    </el-row>
    <el-row class="basicExih">
      <el-col :span="4"><b>德育分</b></el-col>
      <el-col :span="20">{{moralScore}}</el-col>
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--<el-row class="basicExih">-->
    <!--<el-col :span="4"><b>加分成绩</b></el-col>-->
    <!--<el-col :span="20">{{bonusScore}}</el-col>-->
    <!--</el-row>-->
    <el-row class="basicExih">
      <el-col :span="4"><b>最终成绩</b></el-col>
      <el-col :span="20">{{finalScore}}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'grade',
    'currentCredit',
    'failedNumber',
    'moralScore',
    'bonus',
    'finalScore',
    'data'
  ]
}
</script>

<style scoped>
  .basicExih{
    padding: 1%;
  }
</style>
