<template>
  <el-autocomplete placeholder="搜索功能" :fetch-suggestions="querySearch" @select="handleSelect" v-model="inputvalue"></el-autocomplete>
</template>

<script>
export default {
  name: 'featureSearch',
  data() {
    return {
      features: [
        {
          value: '我的学生',
          name: 'mystudent',
          pinyin: 'wodexuesheng'
        },
        {
          value: '信息总览',
          name: 'studentinfo',
          pinyin: 'xinxizonglan'
        },
        {
          value: '班级管理',
          name: 'minority',
          pinyin: 'banjiguanli'
        },
        {
          value: '我的工作',
          name: 'mywork',
          pinyin: 'wodegongzuo'
        },
        {
          value: '综合测评',
          name: 'comprehensive',
          pinyin: 'zongheceping'
        },
        {
          value: '学生成绩',
          name: 'studentgrades',
          pinyin: 'xueshengchengji'
        },
        {
          value: '挂科情况',
          name: 'failsituation',
          pinyin: 'guakeqingkuang'
        },
        {
          value: '统计分析',
          name: 'accountanalysis',
          pinyin: 'tongjifenxi'
        },
        {
          value: '学科竞赛',
          name: 'contest',
          pinyin: 'xuekejingsai'
        },
        {
          value: '创新创业',
          name: 'innovation',
          pinyin: 'chuangxinchuangye'
        },
        {
          value: '论文专利',
          name: 'paperpatent',
          pinyin: 'lunwenzhuanli'
        },
        {
          value: '社会实践',
          name: 'socialpractice',
          pinyin: 'shehuishijian'
        },
        {
          value: '奖学金',
          name: 'scholarship',
          pinyin: 'jiangxuejin'
        },
        {
          value: '助学金',
          name: 'stipend',
          pinyin: 'zhuxuejin'
        },
        {
          value: '助学贷款',
          name: 'studentloan',
          pinyin: 'zhuxuedaikuan'
        },
        {
          value: '勤工助学',
          name: 'parttime',
          pinyin: 'qingongzhuxue'
        },
        {
          value: '信息统计',
          name: 'count',
          pinyin: 'xinxitongji'
        },
      ],
      inputvalue: '',
      privileges: []
    }
  },
  created() {
    this.privileges = JSON.parse(sessionStorage.getItem('user')).privileges;
    for(let i=0; i<this.features.length;) {
      let item = this.features[i];
      if(this.privileges.indexOf(item.value)<0) {
        this.features.splice(i, 1);
      }
      else {
        i++;
      }
    }
  },
  methods: {
    querySearch(queryString, callback) {
      if(!queryString) {
        callback(this.features);
        return;
      }
      let rst = [];
      this.features.forEach(value => {
        let score = this.matchScore(queryString, value);
        if(score>0) {
          rst.push(value);
          rst[rst.length-1].score = score;
        }
      });
      rst.sort((a,b)=>{b.score-a.score});
      callback(rst);
    },
    handleSelect(item) {
      this.$router.push({name: item.name});
      this.inputvalue = '';
    },
    matchScore(queryString, item) {
      let rst = 0;
      let i;
      i=0;
      for(let c in item.name) {
        if(queryString[i]===item.value[c]) {
          i++;
          if(i===queryString.length) {
            break;
          }
        }
      }
      if(i===queryString.length) {
        return 100;
      }
      let d = 0;
      i=0;
      for(let c in item.pinyin) {
        if(queryString[i]===item.pinyin[c]) {
          i++;
          if(i===queryString.length) {
            break;
          }
        }
        else {
          d++;
        }
      }
      if(i===queryString.length) {
        return 100-d;
      }
      return 0;
    }
  }
}
</script>
