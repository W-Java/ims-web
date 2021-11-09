<template>
  <div>
    <el-row :gutter="200" class="card">
      <el-col :span="8" v-for="(card,index) in semesterCards" :key="index">
        <el-card :body-style="{padding: '0px'}" shadow="hover" style="cursor: pointer;margin: 5%;" @click.native="checkSemester($event,index)">
          <!--              综合测评文字              -->
          <div class="top" style="padding: 5%; background-color: rgba(255,255,255,0.47)">
            <p style="text-align: left; ">综合测评</p>
          </div>
          <!--              年份标签            -->
          <div class="cardCenter">
            <div style="text-align: left; padding-left: 7%">
              <p>{{card.semester.substring(0,4)}}</p>
            </div>
            <div style="text-align: center; font-size: 20px;">
              <!--<p>-</p>-->
              <i style="font-size: 100px" class="el-icon-minus"></i>
            </div>
            <div style="text-align: right; padding-right: 7%">
              <p>{{card.semester.substring(5,9)}}</p>
            </div>
          </div>
          <!--              已结束、查看详情               -->
          <div class="bottom" style="padding: 3%">
            <el-row>
              <el-col :span="12" id="status"><p>{{card.status}}</p></el-col>
              <el-col :span="12" id="operation"><p>{{card.operator}}</p></el-col>
            </el-row>
          </div>
          <!--              状态持续到               -->
          <div  v-if="index === semesterCards.length - 1" style="color: #ff4034">
            <el-row>状态持续到</el-row>
            <el-row>{{endTime}}</el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'semesterCards',
    'endTime'
  ],
  emits: [
    'checkSemester',
  ]
}
</script>

<style scoped>
  /*主要为了卡片内字体居中*/
  .cardCenter{
    background-color: #c4c4c4;
    font-size: 60px;
    color: #f0ffff;
  }
  .card{
    text-align: center;
  }
</style>
