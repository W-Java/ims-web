<template>
  <div>
<!--    title     -->
    <div align="center">
      <h3>{{grade}}级综合测评实施办法</h3>
    </div>
    <div>
<!--  积分规则  -->
      <integral-rule/>
<!--  底部卡片  -->
      <year-label
        :semester-cards = 'semesterCards'
        :end-time = 'endTime'
        @checkSemester = 'checkSemester'
      />
    </div>

  </div>
</template>

<script>
  import IntegralRule from "./elements/ComprehensiveIndex/IntegralRule.vue";
  import YearLabel from "./elements/ComprehensiveIndex/YearLabel.vue";
  export default {
    name: "comprehensiveIndex",
    components: {
      YearLabel,
      IntegralRule
    },
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

</style>
