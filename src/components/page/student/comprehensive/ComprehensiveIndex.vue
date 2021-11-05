<template>
<!--  综测首页  -->
  <div>
    <div align="center">
    <h3>{{grade}}级综合测评实施办法</h3>
    </div>
    <div>
      <div>
<!--        详细的积分规则       -->
        <el-collapse>
          <el-collapse-item title="一、计分方法">
            <p>综合素质测评分 ＝ 德育素质分 × 20% ＋ 智育素质分（含体育课程成绩）× 80％ ＋ 综合素质加分</p>
          </el-collapse-item>
          <el-collapse-item title="二、智育素质测评">
            <p>智育素质分（含体育课程成绩）由本科生院教务管理系统自动生成</p>
          </el-collapse-item>
          <el-collapse-item title="三、德育素质测评">
            <p>本分分数由班级评议小组内部自行评定</p>
          </el-collapse-item>
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

      <div>
        <el-row :gutter="200" class="card">
          <el-col :span="8" v-for="(card,index) in semesterCards" :key="index">
            <el-card :body-style="{padding: '0px'}" shadow="hover" style="cursor: pointer;margin: 5%;" @click.native="checkSemester($event,index)">
              <div class="top" style="padding: 5%; background-color: rgba(255,255,255,0.47)">
                <p style="text-align: left; ">综合测评</p>
              </div>
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
              <div class="bottom" style="padding: 3%">
                <el-row>
                  <el-col :span="12" id="status"><p>{{card.status}}</p></el-col>
                  <el-col :span="12" id="operation"><p>{{card.operator}}</p></el-col>
                </el-row>
              </div>
              <div  v-if="index === semesterCards.length - 1" style="color: #ff4034">
                <el-row>状态持续到</el-row>
                <el-row>{{endTime}}</el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "comprehensiveIndex",
    data() {
      return {
        student: false,
        semesterCards: [],
        endTime:'',
        funcMapWords: {
          "已结束": 'comprehensiveconfirm',
          "公示中": 'comprehensiveconfirm',
          "已开始": 'ComprehensiveDeclare',
          "班长审核中": 'comprehensivereviewing',
          "班级互审中": 'comprehensivereviewing',
          "辅导员审核中": 'comprehensivereviewing',
          "公示结束": 'comprehensiveconfirm'
        },
        grade:'',
        dict : {
          "已结束": "查看详情",
          "已开始": "自由申报",
          "公示中": "结果确认",
          "班长审核中": "查看详情",
          '班级互审中':"查看详情",
          '辅导员审核中':"查看详情",
          "公示结束": "查看详情"
        },
        compreStatus:{
          'NOTSTATED':'未开始',
          'FREETIME':'已开始',
          'FIRSTCHECKING':'班长审核中',
          'SECONDCHECKING':'班级互审中',
          'THIRDCHECKING':'辅导员审核中',
          'PUBLICING':'公示中',
          'CLOSED':'已结束',
        }
      }
    },
    created() {
      this.student = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('学生') >= 0;
      this.$axios.post('/sm/comprehensive/semesterCards', {}).then(
        res => {
          this.semesterCards = res.data.data.semesterCards;
          //this.semesterCards.status =
          for(let card of this.semesterCards){
            card.realStatus = card.status;
            card.status = this.compreStatus[card.status];
          }
          this.grade = res.data.data.grade;
          for (let obj of this.semesterCards) {
            obj.operator = this.dict[obj.status];
          }
          let param = [];
          param.push({
            'year-term':this.semesterCards[this.semesterCards.length - 1].semester,
            'status':this.semesterCards[this.semesterCards.length - 1].realStatus});
          this.$axios.post('/sm/comprehensive/endTime',param).then(
            res=>{
              if(res.data.status === 0){
                this.endTime = res.data.data[0];
              }
          })
        });

      //console.log("response"+window.frame);
    },

    computed:{

    },

    methods: {
      checkSemester(event, index) {
        let cardWords = event.currentTarget.textContent.toString().split(' ');
        let pushRouter = {name: '', query: ''};
        pushRouter.name = this.funcMapWords[cardWords[4]];
        pushRouter.query = {term: this.semesterCards[index].semester};
        this.$router.push(pushRouter);
      },
      check(){
        console.log(window.frames[0].element)
      },
      download(){
        window.open('https://ims-file.oss-cn-shenzhen.aliyuncs.com/%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A22016%E7%BA%A7%E7%BB%BC%E5%90%88%E6%B5%8B%E8%AF%84%E5%AE%9A%E7%A8%BF2018%E5%B9%B4%E7%89%88.docx');
      }
    }
  }


</script>

<style lang="scss" scoped>
  //主要为了卡片内字体居中
  .cardCenter{
    background-color: #c4c4c4;
    font-size: 60px;
    color: #f0ffff;
  }
  .card{
    text-align: center;
  }
</style>
