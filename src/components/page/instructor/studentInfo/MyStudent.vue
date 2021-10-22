<template>
  <div>
    <el-row>
      <el-col :span="12">
        <chart :options="chartMain"></chart>
      </el-col>
      <el-col :span="12">
        <chart :options="mapMain" auto-resize></chart>
      </el-col>
    </el-row>
    <!--<chart :options="chinaMap"></chart>-->
    <div v-if="!monitor">
      <h2>您所管理的班级：{{classNumber}}</h2>
      <el-row>
        <el-col :span="4" v-for="(card,index) in cards" :key="index">
          <el-card style="margin: 8%; cursor: pointer;" @click.native="showCharts(index)">
            <div style="text-align: center">
              <el-button type="text" style="color: #e477bb" >{{card}}</el-button>
              <br/>
              <el-button @click.native="toPageStudentInfo(index)">详细</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="infinite-scroll" v-show="loading">
        <span class="infinite-scroll-text">{{tips}}</span>
      </div>
  </div>
  </div>
</template>

<style scoped>
  .echarts {
    height: 10cm;
  }

</style>

<script>
  import chinaMap from '@/assets/china.json';
  import ECharts from 'vue-echarts';
  ECharts.registerMap('china', chinaMap);
  export default {
    data: function () {
      return {
        cards: [],//存储short_name
        major: [],
        class: [],
        arrayHometown: [],
        arrayNumberToNativePlace: [],
        monitor: false,
        classNumber:0,

        //地图

        mapMain: {
          tooltip: {
            trigger: 'item'
          },
          position: ['75%', '50%'],
          grid: {
            top: '1000',
            left: '50',
            right: '10',
            bottom: '20',
            containLabel: true
          },
          visualMap: {
            min: 0,
            max: 100,
            left: 'left',
            top: 'bottom',
            color: ['rgba(19,138,149,0.7)','rgba(22,159,172,0.7)','rgba(25,180,194,0.5)','rgba(43,212,227,0.5)','rgba(210,244,248,0.9)'],
            calculable: true,
            show: false
          },
          series:
            {
              name: '人数' ,
              type: 'map',
              mapType: 'china',
              roam: false,
              itemStyle: {
                normal: {
                  areaColor: 'rgba(210,244,248,0.9)',
                  borderColor: 'rgba(255,255,255,0.95)'
                },
                emphasis: {
                  areaColor: '#1d3d3d'
                }
              },
              label: {
                emphasis: {
                  show: false
                }
              },
              data :[
                { name: '北京', value: 0 },
                { name: '天津', value: 0 },
                { name: '上海', value: 0 },
                { name: '重庆', value: 0 },
                { name: '河北', value: 0 },
                { name: '河南', value: 0 },
                { name: '云南', value: 0 },
                { name: '辽宁', value: 0 },
                { name: '黑龙江', value: 0 },
                { name: '湖南', value: 0 },
                { name: '安徽', value: 0 },
                { name: '山东', value: 0 },
                { name: '新疆', value: 0 },
                { name: '江苏', value: 0 },
                { name: '浙江', value: 0 },
                { name: '江西', value: 0 },
                { name: '湖北', value: 0 },
                { name: '广西', value: 0 },
                { name: '甘肃', value: 0 },
                { name: '山西', value: 0 },
                { name: '内蒙古', value: 0 },
                { name: '陕西', value: 0 },
                { name: '吉林', value: 0 },
                { name: '福建', value: 0 },
                { name: '贵州', value: 0 },
                { name: '广东', value: 0 },
                { name: '青海', value: 0 },
                { name: '西藏', value: 0 },
                { name: '四川', value: 0 },
                { name: '宁夏', value: 0 },
                { name: '海南', value: 0 },
                { name: '台湾', value: 0 },
                { name: '香港', value: 0 },
                { name: '澳门', value: 0 }
              ],
            }

        },

        //饼图
        chartMain: {
          title: {
            text: '人数统计：',
          },
          animation:false,
          series:
        {
          center: ['50%', '50%'],
            type: 'pie',
            data: [
            {
              name: '男生:' + 0, value: 0, itemStyle: {color: '#ffb029'},
              label: {
                normal: {
                  fontSize: 18,
                  textShadowColor: 'rgba(0,0,0,0.2)',
                  textShadowBlur: 4,
                  textShadowOffsetX: 2,
                  textShadowOffsetY: 1
                }
              }
            },
            {
              name: '女生:' + 0, value: 0, itemStyle: {color: '#ff7158'},
              label: {
                normal: {
                  fontSize: 18,
                  textShadowColor: 'rgba(0,0,0,0.2)',
                  textShadowBlur: 4,
                  textShadowOffsetX: 2,
                  textShadowOffsetY: 1
                }
              }
            },
          ],
            selectedMode: 'single',
            itemStyle: {
            shadowOffsetX: 10,
              shadowOffsetY: 10,
              shadowColor: 'rgba(0,0,0,0)',
              emphasis: {
              shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.23)'
            }
          }
        },
      },

      loading: false,
        tips
    :
      '努力加载中...',
        REQUIRE
    :
      true,
    }
  }
  ,
  methods: {
    //跳转到studentInfo页面
    toPageStudentInfo(index)
    {
      this.$router.push(
        {
          name: 'studentinfo',
          params: {selectedClass: this.cards[index], selectedMajor: this.major[index]}
        }
      )
    }
  ,
    showCharts(index)
    {
      //饼图
      //console.log(this.cards[index]);
      this.$axios.post('sm/numanalysis', {shortName: this.cards[index]}).then(
        res => {
          if (res.data.status === 0) {
            let sexNumber = res.data.data.sex[0];
            this.chartMain.series.data[0].name = '男生:' + sexNumber;
            this.chartMain.series.data[0].value = sexNumber;
            sexNumber = res.data.data.sex[1];
            this.chartMain.series.data[1].name = '女生:' + sexNumber;
            this.chartMain.series.data[1].value = sexNumber;
            //地图
            this.chartMain.title.text = '人数统计：'+ (res.data.data.sex[0]+res.data.data.sex[1]);
            this.arrayHometown = Array.from(res.data.data.hometown);
            this.arrayNumberToNativePlace = Array.from(res.data.data.numberToNativePlace);
          }
        });
    }
  ,
  }
  ,
  created()
  {
    if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
      this.mapMain.visualMap.max = 10;
    }
    this.monitor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0;
    //这里需要对一个接口action，返回辅导员管理的所有班级，初始化页面
    this.$axios.post('sm/classcards', {}).then(
      res => {
        if (res.data.status === 0) {
          this.cards = res.data.data.shortName;
          this.class = res.data.data._class;
          this.major = res.data.data.major;
          this.classNumber = this.cards.length;
        }
      });
    this.$axios.post('sm/numanalysis', {}).then(
      res => {
        if (res.data.status === 0) {
          let sexNumber = res.data.data.sex[0];
          this.chartMain.series.data[0].name = '男生:' + sexNumber;
          this.chartMain.series.data[0].value = sexNumber;
          sexNumber = res.data.data.sex[1];
          this.chartMain.series.data[1].name = '女生:' + sexNumber;
          this.chartMain.series.data[1].value = sexNumber;

          this.chartMain.title.text = '人数统计：'+ (res.data.data.sex[0]+res.data.data.sex[1]);
          //地图
          this.arrayHometown = Array.from(res.data.data.hometown);
          this.arrayNumberToNativePlace = Array.from(res.data.data.numberToNativePlace);
          for(let x = 0; x<this.arrayHometown.length;x++) {
            for(let y = 0; y<this.mapMain.series.data.length;y++) {
              if(this.arrayHometown[x] === this.mapMain.series.data[y].name) {
                this.mapMain.series.data[y].value = this.arrayNumberToNativePlace[x];
                break;
              }
            }
          }

        }
      });
  }
  ,
  }


</script>
