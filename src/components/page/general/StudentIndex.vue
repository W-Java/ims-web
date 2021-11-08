<template>
  <div>
    <el-row>
    <!--      添加图片滚动效果      -->
      <Carousel :carouselItems="carouselItems" />
    </el-row>

    <el-row :gutter="40" style="text-align: center">
      <!--<el-col :span="2" class="leftSpace">&nbsp</el-col>-->
      <el-col class="middleSpace">
        <!--        个人名片BusinessCard.vue        -->
        <BusinessCard
          :photo="studentInfo.photo"
          :name="studentInfo.name"
          :sex="studentInfo.sex"
          :majorAndClass="studentInfo._class"
          :IDNumber="studentInfo.number"
          @info="handleInfoManagement"
        />
        <el-col :span="14" class="middle_container">
        <!--        通知预览框Notification.vue           -->
          <el-row>
            <Notification
              :notificationTableData="notificationTableData"
              @handleNotificationRowClick="handleNotificationRowClick"
              @moreNotifications="moreNotifications"
            />
          </el-row>
        <!--        代办事项预览框Todos.vue           -->
          <el-row style="margin-top: 2em">
            <Todos
              :statTableData="statTableData"
              @moreStatList="moreStatList"
              @handleStatListRowClick="handleStatListRowClick"
            />
          </el-row>
        </el-col>
        <Links :friendlyLinkItems="friendlyLinkItems" />
      </el-col>
    </el-row>

<!--    待办事项详情    -->
    <el-dialog
      :visible.sync="showTodoListDialog"
      title="待办事项详情"
      :v-loading="whileLoading"
      width="80%"
    >
      <dynamic-form
        :disabled="disabledData"
        ref="countForm"
        v-model="countData"
      />
      <el-row type="flex">
        <el-col :span="6" :offset="18">
          <el-button @click="showTodoListDialog = false">取消</el-button>
          <el-button
            v-if="!disabledData"
            type="primary"
            @click="submitCountData('countForm')"
            >确认</el-button
          >
          <el-button v-if="disabledData" type="primary" @click="canEdite"
            >修改</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>

<!--    通知详情   （点开某条具体的显示的一个通知栏） -->
    <el-dialog
      :visible.sync="showNotificationDialog"
      title="通知详情"
      width="80%"
      :before-close="handleBeforeClose"
    >
<!--      通知的名称       -->
      <h2 class="notification">{{ notificationData.title }}</h2>
<!--      通知的建立时间       -->
      <p class="notification">建立时间：{{ notificationData.createTime }}</p>
      <br />
      <div v-html="notificationData.html" class="notificationHtml"></div>
    </el-dialog>
  </div>
</template>
<script>
import { getCarousel, getNotice, getStatsList, getStudentInfo, getNotificationById, getStats, getStatsDetail, fillStats } from '../../../api/general.index';
import Carousel from "./elements/Carousel.vue";
import BusinessCard from "./elements/BusinessCard";
import Notification from "./elements/Notification.vue";
import Links from "./elements/Links.vue";
import Todos from "./elements/Todos.vue";

export default {
  components: {
    BusinessCard,
    Notification,
    Todos,
    Links,
    Carousel,
  },
  created(){
      this.getStudentIndex();
  },
  data() {
    return {
    //control status
      showNotificationDialog: false,
      showTodoListDialog: false,
      whileLoading: false,
      disabledData: false,
      notificationData: {
        html:'',
        createTime:'',
        title:''
      },
      indexTitle: "",
      fillStatus: "save",
    //data
      countData: {},
      statsID: "",
      carouselItems: [],
      studentInfo: {
        //test example, remember to remove it
        // 用户头像
        photo: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/cc11728b4710b9122e5c210ec3fdfc03934522a5.jpg',
        name: "",
        sex: "",
        _class: "",
        number: "",
      },
      notificationTableData: [],
      statTableData: [],
      //refact it as json file?
      friendlyLinkItems: [
        { link: "http://bksy.csu.edu.cn/", title: "本科生院" },
        { link: "http://my.csu.edu.cn", title: "信息门户" },
        { link: "http://tz.its.csu.edu.cn/", title: "校内通知" },
        { link: "http://csujwc.its.csu.edu.cn/", title: "本科教务管理系统" },
        { link: "http://ecard.csu.edu.cn/", title: "校园卡电子服务平台" },
        { link: "http://jf.csu.edu.cn/xysf/", title: "统一支付平台" },
        { link: "http://award.csu.edu.cn/", title: " 奖助学金系统" },
        {
          link: "http://classroom.csu.edu.cn/",
          title: "学生学习行为信息系统查询平台",
        },
        { link: "http://ca.its.csu.edu.cn/", title: "统一身份认证平台" },
        { link: "http://hqlx.csu.edu.cn/", title: "网上报修平台" },
      ],
    };
  },
  methods: {
    canEdite() {
      this.disabledData = false;
      this.fillStatus = "modify";
    },
    parseToDate(date, time) {
      let year = 0;
      let month = 0;
      let day = 0;
      if (date) {
        year = parseInt(date.substr(0, 4));
        month = parseInt(date.substr(5, 2)) - 1;
        day = parseInt(date.substr(8, 2));
      }
      let hh = 0;
      let ff = 0;
      if (time) {
        hh = parseInt(time.substr(0, 2));
        ff = parseInt(time.substr(3, 2));
      }
      return new Date(year, month, day, hh, ff);
    },
    handleBeforeClose(done) {
      this.notificationTitle = "";
      this.notificationCreateTime = "";
      this.notificationHTML = "";
      done();
    },
    async getStudentIndex() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      this.studentInfo = {...this.studentInfo,...await getStudentInfo(user)};
      this.notificationTableData = await getNotice();
      const statsListRes = await getStatsList();
      this.generateStatsList(statsListRes.data.countList);
      const carouselRes = await getCarousel();
      this.carouselItems = carouselRes.data.carouselItems;
    },
    generateStatsList(statTableData){
      this.statTableData = statTableData //res.data.data.countList;
      for (let i = 0; i < this.statTableData.length; i++) {
        let startDate = this.parseToDate(
          this.statTableData[i].startDate,
          this.statTableData[i].startTime
        );
        let endDate = this.parseToDate(
          this.statTableData[i].endDate,
          this.statTableData[i].endTime
        );
        let nowDate = new Date();
        let countStatus = "";
        if (nowDate < startDate) {
          countStatus = "暂未开始";
        } else if (nowDate <= endDate) {
          countStatus = "进行中";
        } else {
          countStatus = "已结束";
        }
        this.statTableData[i].status = countStatus;
        this.statTableData[i].startDate =
          "创建:" + this.statTableData[i].startDate;
        this.statTableData[i].endDate = "截止:" + this.statTableData[i].endDate;
      }
    },
    handleInfoManagement() {
      this.$router.push({ name: "user" });
    },
    async handleNotificationRowClick(row) {
      console.log(row.link);
      row.unread = false;
      this.showNotificationDialog = true;
      const res = await getNotificationById(row.id);
      this.notificationData.html = res.data.content;
      this.notificationData.createTime = res.data.createTime;
      this.notificationData.title = res.data.title;
    },
    moreNotifications() {
      this.$router.push({ name: "notifications" });
    },
    moreStatList() {
      this.$router.push({ name: "todoList" });
    },
    //未测试
    async handleStatListRowClick(row) {
      if (row.status === "暂未开始") {
        this.$message.warning("还没到时间哦，请再等一下");
        return;
      } else if (row.status === "已结束") {
        this.$message.warning("时间已经过了哦");
        return;
      }
      this.showTodoListDialog = true;
      this.statsID = row.id;
      this.whileLoading = true;
      const statsRes = await getStats(row.id);
      this.countData = statsRes.data;
      this.countData.statsData = JSON.parse(this.countData.statsData);
      const detailRes = await getStatsDetail(row.id);
      if(detailRes){
        this.disabledData = true;
        let data = JSON.parse(detailRes.data);
        let loopTimes = this.countData.statsData.length;
        for (let i = 0; i < loopTimes; i++) {
          this.countData.statsData[i].projectRules.value =
          data[this.countData.statsData[i].projectName];
        }
      }else{
        this.disabledData = false;
      }
      this.whileLoading = false;
    },
    // not test yet
    async submitCountData(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log("结果是", valid);
          let header = [];
          let data = {};
          let loopTimes = this.countData.statsData.length;
          for (let i = 0; i < loopTimes; i++) {
            let headerItem = {
              type: this.countData.statsData[i].projectRules.type,
              key: this.countData.statsData[i].projectName,
            };
            header.push(headerItem);
            data[headerItem.key] =
              this.countData.statsData[i].projectRules.value;
          }
          const res = await fillStats(header,data,this.statsID,this.fillStatus);
          if(res){
            this.$message({
                message: "信息提交成功",
                type: "success",
            })
          }else{
            this.showTodoListDialog = false;
          }
        }else{
          // not valid
        }
      });
    },
  }
};
</script>
<style lang="scss">
.notification {
  text-align: center;
}

.notificationHtml {
  margin-left: 120px;
  margin-right: 120px;
}

</style>
