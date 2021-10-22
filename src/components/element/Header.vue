
<template>
  <!-- 头部组件 -->
  <div>
    <el-menu
      :default-active="$route.name"
      mode="horizontal"
      class="header"
      router
      background-color="#fafafa"
    >
      <div class="brand" @click="backToConsole">
        <img class="logo" src="/static/images/icon.png" alt="Logo" />
        <h2>My School</h2>
      </div>
      <feature-search
        class="feature-search"
        v-if="
          instructor ||
          (this.$store.state.monitorBrowsingStatus === 'monitor' && monitor)
        "
      ></feature-search>
      <el-menu-item
        index="index"
        style="margin-left: 20px"
        v-if="
          (student && !monitor) ||
          (this.$store.state.monitorBrowsingStatus === 'student' && monitor)
        "
      >
        主页
      </el-menu-item>
      <el-menu-item
        index="comprehensiveIndex"
        v-if="
          (student && !monitor) ||
          (this.$store.state.monitorBrowsingStatus === 'student' && monitor)
        "
      >
        综测
      </el-menu-item>
      <el-menu-item
        index="leavemanage"
        v-if="
          (student && !monitor) ||
          (this.$store.state.monitorBrowsingStatus === 'student' && monitor)
        "
      >
        请假
      </el-menu-item>
      <el-menu-item
        index="growingfile"
        v-if="
          (student && !monitor) ||
          (this.$store.state.monitorBrowsingStatus === 'student' && monitor)
        "
      >
        成长档案
      </el-menu-item>
      <div class="right">
        <el-button
          class="monitorPortal"
          style="margin-right: 20px"
          @click="handleMoniorPortal"
          v-if="monitor"
        >
          {{ monitorPortalButtonText }}
        </el-button>
        <div class="ntfPopover" style="position: relative">
          <el-popover
            class="ntfPopover"
            placement="bottom"
            width="500"
            trigger="hover"
            style="margin-right: 20px"
          >
            <p style="margin-bottom: 7px">
              <span
                @click="viewAllNtfs"
                style="font-size: medium; font-weight: bold"
                >系统消息</span
              >
            </p>

            <hr
              style="
                border: 0;
                height: 0;
                border-top: 2px solid rgba(0, 0, 0, 0.1);
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
              "
            />

            <table
              v-for="(sysMsgItem, index) in sysMsgData.sysMsgItems"
              :key="sysMsgItem.sysMsgID"
              cellspacing="0"
            >
              <tr class="ntfRow" style="height: 3em" @click="checkNtf(index)">
                <td :style="rowBottomBorderStyle(index, true)">
                  <div class="circle" v-show="sysMsgItem.unread"></div>
                </td>
                <td :style="rowBottomBorderStyle(index, false)">
                  {{ sysMsgItem.sysMsgTitle }}
                </td>
              </tr>
            </table>

            <hr
              style="
                border: 0;
                height: 0;
                border-bottom: 2px solid rgba(0, 0, 0, 0.1);
                border-top: 2px solid rgba(255, 255, 255, 0.3);
              "
            />

            <div
              style="
                text-align: right;
                margin-top: 7px;
                display: flex;
                align-items: center;
                justify-content: right;
              "
            >
              <div
                class="circle"
                style="
                  border-radius: 100%;
                  background-color: #fb7c9c;
                  width: 6px;
                  height: 6px;
                  margin-right: 5px;
                "
                v-show="sysMsgData.moreUnread"
              ></div>
              <span
                @click="viewAllNtfs"
                style="margin-right: 10px; cursor: pointer; font-size: medium"
                >查看全部>></span
              >
            </div>

            <el-button
              slot="reference"
              class="ntfBtn"
              icon="el-icon-bell"
              round
              type="text"
              style="font-size: larger; color: #606266"
            ></el-button>
          </el-popover>
          <el-badge value="new" class="el-badge" :hidden="hideBadge"></el-badge>
        </div>

        <el-dropdown @command="handleCommand" :show-timeout="0">
          <span class="el-dropdown-link">
            <div class="avatar-name">
              <img
                :src="avatar"
                alt="avatar"
                class="avatar"
                style="cursor: pointer"
                @click="changeAvatar"
              />
              {{ username }}
              <i class="el-icon-arrow-down el-icon-right"></i>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="user-info">{{
              infoManagement
            }}</el-dropdown-item>
            <el-dropdown-item command="accountset">账户设置</el-dropdown-item>
            <el-dropdown-item command="signout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <el-dialog
      :visible.sync="showSysMsgDialog"
      title="系统消息详情"
      width="60%"
    >
      <h2 class="sysMsg">{{ sysMsgTitle }}</h2>
      <p class="sysMsg">建立时间：{{ sysMsgCreateTime }}</p>
      <br />
      <div v-html="sysMsgDialog" class="sysMsgHtml"></div>
    </el-dialog>
    <el-dialog :visible.sync="showAvatarDialog" title="头像" width="25%">
      <el-upload
        :http-request="uploadAvatarToAliyun"
        class="avatar-uploader"
        action="string"
        :show-file-list="false"
        :file-list="fileList"
        style="text-align: center"
        accept=".jpg,.png"
      >
        <img v-if="avatar" :src="avatar" alt="avatar" class="avatarInDialog" />
        <div class="el-upload__tip" slot="tip">点击图片上传头像</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<style scoped>
.sysMsg {
  text-align: center;
}

.sysMsgHtml {
  margin-left: 120px;
  margin-right: 120px;
}

.avatar-uploader .el-upload {
  border: 10px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  background-color: #409eff;
}

.avatarInDialog {
  width: 100%;
  display: block;
  background: transparent;
}
.avatarInDialog:hover {
  opacity: 0.1;
}
.el-header {
  padding: 0 !important;
}

.el-menu--horizontal {
  border-bottom: solid 1px #ebebeb !important;
}

.header,
.left,
.right,
.avatar-name {
  display: flex;
  align-items: center;
}

.brand {
  display: block;
  height: 60px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.logo {
  height: 2.5em;
  margin-right: 0.5em;
}

.brand h2 {
  font-family: Helvetica, sans-serif;
  font-size: 1.5em;
}

.feature-search {
  margin-left: 1em;
}

.right {
  margin-left: auto;
  margin-right: 30px;
}

.avatar {
  height: 3em;
  width: 3em;
  border-radius: 50%;
  margin-right: 0.5em;
}

.ntfBtn:hover {
  background-color: #c8c8c8;
  opacity: 0.3%;
}

.el-upload__tip {
  font-size: 20px;
}

.circle {
  border-radius: 100%;
  background-color: #fb7c9c;
  width: 6px;
  height: 6px;
  margin-left: auto;
  margin-right: auto;
}

.ntfRow {
  cursor: pointer;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.ntfRow:hover {
  background-color: #f0f0f0;
  border-color: #f0f0f0;
}

.el-badge {
  position: absolute;
  right: 10px;
  top: 0px;
}
</style>

<script>
import FeatureSearch from "./featuresearch";

let vueer;
export default {
  name: "mainHeader",
  inject: ["reload"],
  data() {
    return {
      showSysMsgDialog: false,
      showAvatarDialog: false,
      username: "",
      avatar: "",
      infoManagement: "",
      sysMsgDialog: "",
      sysMsgTitle: "",
      sysMsgCreateTime: "",
      fileList: [],
      monitor: false,
      student: false,
      instructor: false,
    };
  },
  components: {
    FeatureSearch,
  },
  computed: {
    sysMsgData() {
      return this.$store.state.sysMsgData;
    },
    hideBadge() {
      if (this.$store.state.sysMsgData.moreUnread) return false;
      for (let ntfItem of this.$store.state.sysMsgData.sysMsgItems) {
        if (ntfItem.unread) return false;
      }
      return true;
    },
    activeIndex() {
      if (this.$route.name === "user") return "user";
      return "routine";
    },
    monitorPortalButtonText() {
      if (this.$store.state.monitorBrowsingStatus === "student")
        return "班长管理入口";
      return "学生浏览入口";
    },
  },
  methods: {
    //点击左上角图标，回到首页
    backToConsole() {
      this.$router.push({ name: "index" });
    },

    //上传成功的回调
    avatarUploaded(file) {
      this.$message({
        message: "头像上传成功",
        type: "success",
      });
    },
    uploadError() {
      this.$message.error("头像上传失败");
    },
    //自定义上传行为
    uploadAvatarToAliyun(item) {
      let fd = new FormData();
      fd.append("file", item.file);
      let config = { headers: { "Content-Type": "multipart/form-data" } };
      this.$axios
        .post("/sm/img/aliyunOss/avatarUpload", fd, config)
        .then((res) => {
          if (res.data.status === 400 || res.data.status === 403) {
            vueer.uploadError();
          } else if (res.data.status === 0) {
            vueer.avatarUploaded(item.file);
            this.avatar = res.data.data;
          }
          console.log(res);
        });
    },
    changeAvatar() {
      this.showAvatarDialog = true;
    },
    checkNtf(index) {
      let sysMsgData_t = this.$store.state.sysMsgData;
      sysMsgData_t.sysMsgItems[index].unread = false;

      this.showSysMsgDialog = true;
      let id = sysMsgData_t.sysMsgItems[index].sysMsgID;
      // 新建formdata以发送请求
      let fd = new FormData();
      fd.append("messageId", id);
      let config = { headers: { "Content-Type": "multipart/form-data" } };
      this.$axios.post("sm/message/one", fd, config).then((res) => {
        if (res.data.status === 0) {
          this.sysMsgTitle = res.data.data.title;
          this.sysMsgCreateTime = res.data.data.createTime;
          this.sysMsgDialog = res.data.data.text;
        }
        console.log(res.data.message);
      });
    },
    rowBottomBorderStyle(index, pos) {
      let sysMsgData_t = this.$store.state.sysMsgData;
      if (pos) {
        if (index === sysMsgData_t.sysMsgItems.length - 1) return "width: 15px";
        return "width: 15px; border-bottom: 1px solid #f7f7f7";
      } else {
        if (index === sysMsgData_t.sysMsgItems.length - 1)
          return "width: 470px";
        return "width: 470px; border-bottom: 1px solid #f7f7f7";
      }
    },
    viewAllNtfs() {
      this.$router.push({ name: "systemMessages" });
      console.log("view all");
    },
    handleMoniorPortal() {
      if (this.$store.state.monitorBrowsingStatus === "student")
        this.$store.commit("changeMonitorBrowsingStatus", "monitor");
      else this.$store.commit("changeMonitorBrowsingStatus", "student");
      this.$router.push({ name: "index" });
      this.reload();
    },
    handleCommand(command) {
      switch (command) {
        case "signout":
          this.$axios.post("/sm/signout").then((response) => {
            if (response.data.status === 0) {
              sessionStorage.removeItem("user");
              this.$router.push({ name: "login" });
            }
          });
          break;
        case "user-info":
          this.$router.push({ name: "user" });
          break;
        case "accountset":
          this.$router.push({ name: "accountset" });
          break;
      }
    },
  },
  created() {
    console.log("header启动");
    vueer = this;
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.username = user.name;
    this.avatar = user.avatar;
    if (user.roles.indexOf("辅导员") >= 0) this.infoManagement = "修改信息";
    else this.infoManagement = "个人信息";
    this.monitor = user.roles.indexOf("班长") >= 0;
    this.student = user.roles.indexOf("学生") >= 0;
    this.instructor = user.roles.indexOf("辅导员") >= 0;
  },
};
</script>
