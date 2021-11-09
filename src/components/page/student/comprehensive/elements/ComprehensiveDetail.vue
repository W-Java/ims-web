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
      <el-col :span="24"><b>综合素质加分申报</b></el-col>
    </el-row>
    <el-row style="padding: 1%; text-align: center" :gutter="300">
      <el-col :span="8">
        <el-card
          class="box-card"
          shadow="hover"
          @click.native="
            () => {
              this.$emit('pageToGrowing')
            }
          "
          style="cursor:pointer;"
        >
          <div slot="header">
            <span>突出贡献加分</span>
          </div>
          <div >
            <p>将转到“成长档案”中填写</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          class="box-card"
          shadow="hover"
          @click.native="
            () => {
              this.$emit('pageToGrowing')
            }
          "
          style="cursor:pointer;"
        >
          <div slot="header">
            <span>先进典型加分</span>
          </div>
          <div >
            <p>将转到“成长档案”中填写</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          class="box-card"
          shadow="hover"
          @click.native="
            () => {
              this.$emit('pageToCAOB')
            }
          "
          style="cursor:pointer;"
        >
          <div slot="header">
            <span>学生干部及其它加分</span>
          </div>
          <div >
            <p>点击后开始填写</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'grade',
    'currentCredit',
    'failedNumber',
    'moralScore'
  ],
  emits: [
    'pageToGrowing',
    'pageToCAOB'
  ]
}
</script>

<style scoped>
  .basicExih{
    padding: 1%;
  }
</style>
