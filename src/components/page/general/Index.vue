<template>
  <div class="page">
    <div>{{ username }}，您好！</div>

    <div
      v-if="student && this.$store.state.monitorBrowsingStatus === 'student'"
    >
      <el-row>
        <template>
          <el-carousel :interval="4000" type="card" height="240px">
            <el-carousel-item
              v-for="(carouselItem, index) in carouselItems.length"
              :key="index"
            >
              <a
                class="carousel_card"
                :href="carouselItems[index].link"
                target="_blank"
              >
                <img
                  :src="carouselItems[index].src"
                  style="width: 100%; height: 240px"
                />
              </a>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-row>

      <el-row :gutter="40" style="text-align: center">
        <!--<el-col :span="2" class="leftSpace">&nbsp</el-col>-->
        <el-col class="middleSpace">
          <el-col :span="5" class="businessCard">
            <el-row>
              <img
                :src="photo"
                v-if="photo"
                style="
                  height: 80%;
                  width: 80%;
                  margin-top: 10px;
                  max-width: 280px;
                "
                title="照片"
              />
            </el-row>
            <el-row :gutter="20" class="businessCard_name">
              <el-col :span="12" style="text-align: right">姓名</el-col>
              <el-col :span="12" style="text-align: left">{{ stuName }}</el-col>
            </el-row>
            <el-row :gutter="20" class="businessCard_sex">
              <el-col :span="12" style="text-align: right">性别</el-col>
              <el-col :span="12" style="text-align: left">{{ stuSex }}</el-col>
            </el-row>
            <el-row :gutter="20" class="businessCard_majorAndClass">
              <el-col :span="12" style="text-align: right">专业班级</el-col>
              <el-col :span="12" style="text-align: left">{{
                stuMajorAndClass
              }}</el-col>
            </el-row>
            <el-row
              :gutter="20"
              class="businessCard_IDNumber"
              style="margin-bottom: 5px"
            >
              <el-col :span="12" style="text-align: right">学号</el-col>
              <el-col :span="12" style="text-align: left">{{
                stuIDNumber
              }}</el-col>
            </el-row>
            <el-row style="margin-top: 60px">
              <el-button
                style="width: 80%; max-width: 280px"
                @click="handleInfoManagement"
                >详细个人信息</el-button
              >
            </el-row>
          </el-col>

          <el-col :span="14" class="middle_container">
            <!--               通知预览框                  -->
            <el-row>
              <el-col class="notificationAndStat">
                <el-row style="margin-top: 10px">
                  <el-col
                    :span="12"
                    style="font-weight: bolder; text-align: left"
                    >&nbsp&nbsp通知</el-col
                  >
                  <el-col :span="12" style="text-align: right">
                    <el-button
                      icon="el-icon-more"
                      style="
                        margin-right: 10px;
                        height: 1.5em;
                        padding-top: 2px;
                      "
                      @click="moreNotifications"
                    >
                      更多
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <template>
                    <el-table
                      :data="notificationTableData"
                      style="width: 98%; margin-left: auto; margin-right: auto"
                      :show-header="false"
                      @row-click="handleNotificationRowClick"
                    >
                      <el-table-column width="16" align="center">
                        <template slot-scope="scope">
                          <div class="circle" v-if="scope.row.unread"></div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="title"
                        min-width="500"
                        align="left"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="createTime"
                        width="200"
                        fixed="right"
                      >
                      </el-table-column>
                    </el-table>
                  </template>
                </el-row>
              </el-col>
            </el-row>

            <!--               统计事件预览框                  -->
            <el-row style="margin-top: 2em">
              <el-col class="notificationAndStat">
                <el-row style="margin-top: 10px">
                  <el-col
                    :span="12"
                    style="font-weight: bolder; text-align: left"
                    >&nbsp&nbsp待办事项</el-col
                  >
                  <el-col :span="12" style="text-align: right">
                    <el-button
                      icon="el-icon-more"
                      style="
                        margin-right: 10px;
                        height: 1.5em;
                        padding-top: 2px;
                      "
                      @click="moreStatList"
                    >
                      更多
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <template>
                    <el-table
                      :data="statTableData"
                      style="width: 98%; margin-left: auto; margin-right: auto"
                      :show-header="false"
                      @row-click="handleStatListRowClick"
                    >
                      <el-table-column prop="name" min-width="200" align="left">
                      </el-table-column>
                      <el-table-column prop="status" min-width="100">
                      </el-table-column>
                      <el-table-column prop="startDate" width="150">
                      </el-table-column>
                      <el-table-column prop="endDate" width="150">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5" class="links">
            <el-row style="margin: 10px 0">
              <el-col :span="12" style="font-weight: bolder; text-align: left"
                >常用链接</el-col
              >
            </el-row>
            <div
              v-for="linkItem in friendlyLinkItems"
              class="listDirection"
              style="text-align: left"
            >
              <a :href="linkItem.link" target="_blank">{{ linkItem.title }}</a>
            </div>

            <!--<el-header>常用链接</el-header>-->
            <!--<dt v-for="linkItem in friendlyLinkItems" style="margin-top: 10px" :key="linkItem.link">-->
            <!--<a :href="linkItem.link" target="_blank">-->
            <!--{{linkItem.title}}-->
            <!--</a>-->
            <!--</dt>-->
          </el-col>
        </el-col>
      </el-row>
    </div>

    <div
      class="work"
      v-if="
        (monitor && this.$store.state.monitorBrowsingStatus === 'monitor') ||
        instructor
      "
    >
      <h2>{{ indexTitle }}</h2>
      <time-line v-for="item in works" :workItem="item" :key="item.id">
        <template slot-scope="{ item }">
          <h3 @click="checkWork(item.id)">{{ item.title }}</h3>
        </template>
      </time-line>
    </div>

    <el-dialog
      :visible.sync="showNotificationDialog"
      title="通知详情"
      width="80%"
      :before-close="handleBeforeClose"
    >
      <h2 class="notification">{{ notificationTitle }}</h2>
      <p class="notification">建立时间：{{ notificationCreateTime }}</p>
      <br />
      <div v-html="notificationHTML" class="notificationHtml"></div>
    </el-dialog>

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
      ></dynamic-form>
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
  </div>
</template>

<script>
import timeLine from "@/components/element/timeline";
import dynamicForm from "@/components/element/dynamicForm";

export default {
  name: "index",
  components: {
    timeLine,
    dynamicForm,
  },
  data() {
    return {
      statsID: "",
      photo: "",
      whileLoading: false,
      countData: {},
      disabledData: false,
      fillStatus: "save",
      showNotificationDialog: false,
      showTodoListDialog: false,
      notificationHTML: "",
      notificationCreateTime: "",
      notificationTitle: "",
      indexTitle: "",
      username: "",
      instructor: false,
      student: false,
      monitor: false,
      item: [],
      carouselItems: [],
      works: [],
      notificationTableData: [],
      stuName: "",
      stuSex: "",
      stuMajorAndClass: "",
      stuIDNumber: "",
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
      statTableData: [],
    };
  },
  computed: {},
  methods: {
    canEdite() {
      this.disabledData = false;
      this.fillStatus = "modify";
    },
    //解析时间字符串获得Date对象
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
    moreStatList() {
      this.$router.push({ name: "todoList" });
    },
    moreNotifications() {
      this.$router.push({ name: "notifications" });
    },
    submitCountData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("结果是", valid);
          let postData = {};
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

          postData.header = JSON.stringify(header);
          postData.data = JSON.stringify(data);
          postData.id = this.statsID;
          postData.status = this.fillStatus;
          //变量复原
          this.disabledData = false;
          this.fillStatus = "save";
          this.$axios.post("sm/fillStats", postData).then((response) => {
            if (response.data.status === 0) {
              this.$message({
                message: "信息提交成功",
                type: "success",
              });
              this.showTodoListDialog = false;
            }
          });
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    checkWork(id) {
      this.$router.push({
        name: "onework",
        query: { work: id },
      });
    },
    handleInfoManagement() {
      this.$router.push({ name: "user" });
    },
    handleNotificationRowClick(row) {
      console.log(row.link);
      row.unread = false;
      this.showNotificationDialog = true;
      let id = row.id;
      this.$axios.post("sm/notice/one", { id: id }).then((res) => {
        if (res.data.status === 0) {
          this.notificationHTML = res.data.data.content;
          this.notificationCreateTime = res.data.data.createTime;
          this.notificationTitle = res.data.data.title;
        }
        console.log(res.data.message);
      });
    },
    handleStatListRowClick: function (row) {
      if (row.status === "暂未开始") {
        this.$message.warning("还没到时间哦，请再等一下");
        return;
      } else if (row.status === "已结束") {
        this.$message.warning("时间已经过了哦");
        return;
      }
      this.showTodoListDialog = true;
      this.statsID = row.id;
      let id = row.id;
      this.whileLoading = true;
      let postData = {};
      postData.id = id;
      this.$axios
        .post("sm/getStats", postData)
        .then((response) => {
          if (response.data.status === 0) {
            this.countData = response.data.data;
            this.countData.statsData = JSON.parse(this.countData.statsData);
            this.$axios
              .post("sm/statsDetail", { id: row.id })
              .then((response) => {
                if (response.data.status === 0 && response.data.data) {
                  this.disabledData = true;
                  let data = JSON.parse(response.data.data);
                  let loopTimes = this.countData.statsData.length;
                  for (let i = 0; i < loopTimes; i++) {
                    this.countData.statsData[i].projectRules.value =
                      data[this.countData.statsData[i].projectName];
                  }
                } else {
                  this.disabledData = false;
                }
              });
          }
        })
        .finally(() => (this.whileLoading = false));
    },
    getInstructorIndex() {
      this.indexTitle = "我的计划工作";
      this.$axios.post("sm/index/work", {}).then((ref) => {
        if (ref.data.status === 0) {
          this.works = ref.data.data.work;
        }
        console.log(ref.data.message);
      });
    },
    getStudentIndex() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      console.log(user.IDNumber);
      this.$axios
        .post("sm/singleinfo", { selectedStudent: user.IDNumber })
        .then((res) => {
          if (res.data.status === 0) {
            this.stuName = res.data.data.student.basic.name;
            this.stuSex = res.data.data.student.basic.sex;
            this.stuMajorAndClass = res.data.data.student.basic._class;
            this.stuIDNumber = res.data.data.student.basic.number;
          }
          console.log(res.data.message);
        });
      this.$axios
        .post("sm/notice/myNotice", { currentPage: 1, pageSize: 4 })
        .then((res) => {
          if (res.data.status === 0) {
            this.notificationTableData = res.data.data.data;
          }
          console.log(res.data.message);
        });
      let postData = {
        currentPage: 1,
        pageSize: 4,
        status: "submit",
        identity: "student",
      };
      this.$axios.post("sm/StatsList", postData).then((res) => {
        if (res.data.status === 0) {
          this.statTableData = res.data.data.countList;
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
            this.statTableData[i].endDate =
              "截止:" + this.statTableData[i].endDate;
          }
        }
        console.log(res.data.message);
      });
      this.$axios.post("sm/index/carousel", {}).then((res) => {
        if (res.data.status === 0) {
          this.carouselItems = res.data.data.carouselItems;
        }
        console.log(res.data.message);
      });
    },
  },
  created() {
    this.username = JSON.parse(sessionStorage.getItem("user")).name;
    this.instructor =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("辅导员") >= 0;
    this.monitor =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("班长") >= 0;
    this.student =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("学生") >= 0;
    if (this.instructor) this.getInstructorIndex();
    if (this.student) {
      this.getStudentIndex();
      if (!this.monitor)
        this.$store.commit("changeMonitorBrowsingStatus", "student");
    }
  },
};
</script>

<style lang="scss" scoped>
$gutter: 30px;
$border-width: 4px;
$dot-diameter: 8px;

.notification {
  text-align: center;
}

.notificationHtml {
  margin-left: 120px;
  margin-right: 120px;
}

.work {
  h2 {
    font-family: "Microsoft Yahei UI";
    font-weight: normal;
    text-align: center;
  }
}

.el-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel_card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-carousel__item h3 {
  color: #db6386;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #fb7299;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: rgb(255, 203, 220);
}

.businessCard {
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  height: 500px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.businessCard:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}

.notificationAndStat {
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  height: 234px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.notificationAndStat:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}

.links {
  height: 500px;
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.links:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}

.circle {
  /*z-index: 3;*/
  border-radius: 100%;
  background-color: #fb7c9c;
  width: 6px;
  height: 6px;
  margin-left: auto;
  margin-right: auto;
}

.listDirection {
  padding: 10px;
  box-sizing: padding-box;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.listDirection:hover {
  -moz-box-shadow: 2px 2px 5px #000000;
  -webkit-box-shadow: 2px 2px 5px #000000;
  box-shadow: 2px 2px 5px #000000;
}
</style>
