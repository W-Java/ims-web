<template>
  <div>
    <el-collapse>
      <!--          row1          -->
      <el-collapse-item title="一、计分方法">
        <p>综合素质测评分 ＝ 德育素质分 × 20% ＋ 智育素质分（含体育课程成绩）× 80％ ＋ 综合素质加分</p>
      </el-collapse-item>
      <!--          row2          -->
      <el-collapse-item title="二、智育素质测评">
        <p>智育素质分（含体育课程成绩）由本科生院教务管理系统自动生成</p>
      </el-collapse-item>
      <!--          row3          -->
      <el-collapse-item title="三、德育素质测评">
        <p>本分分数由班级评议小组内部自行评定</p>
      </el-collapse-item>
      <!--          row4          -->
      <el-collapse-item title="四、综合素质加分（上限为3分）">
        <el-collapse>
          <el-collapse-item title="1.突出贡献加分">
            <p>（1）科技、学术、文化、体育等各类竞赛加分</p>
            <p>（2）学年内开发表高水平学术论文和学术作品</p>
            <p>（3）学年内科技作品或创造发明获国家专利授权</p>
          </el-collapse-item>
          <el-collapse-item title="2.先进典型类加分">
            <p>（1）在见义勇为、热心公益、拾金不昧、孝老爱亲等方面有突出事迹并在学校或以上范围宣传报道的</p>
            <p>（2）先进集体类加分</p>
          </el-collapse-item>
          <el-collapse-item title="3.学生干部社会工作加分">
            <p>（1）党支部干部</p>
            <p>（2）团学会干部</p>
            <p>（3）年级会干部</p>
            <p>（4）班委、团支委干部</p>
            <p>（5）校学生会、社团及其他组织干部</p>
          </el-collapse-item>
          <el-collapse-item title="4.其他加分项">
            <p>（1）礼仪、文艺演出</p>
            <p>（2）新闻稿</p>
            <p>（3）新媒体平台宣传推广</p>
          </el-collapse-item>
          <el-collapse-item title="5.减分项">
            <p>（1）上课、政治学习和集体活动中缺勤</p>
            <p>（2）受校、学院（年级）通报批评</p>
            <p>（3）违反校“文明十条”，未按时熄灯被通报批评的寝室成员</p>
            <p>（4）学生干部未及时报告和处理本班或者本寝室的异常情况</p>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: [],
  emits: []
}
</script>

<style scoped>

</style>
