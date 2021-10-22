<!--导航-->
<template>
  <div class="navigation">
    <el-menu
      :default-active="$route.name"
      class="navigation el-menu-vertical-demo"
      style="border: none"
      @open="handleOpen"
      @close="handleClose"
      unique-opened
      router
    >
      <!--主页-->
      <el-menu-item index="index" :route="{ name: 'index' }">
        <span slot="title"><span class="shrink">主页</span></span>
      </el-menu-item>
      <!--学生信息-->
      <el-submenu
        index="student-info"
        v-if="roles.indexOf('班长') >= 0 || roles.indexOf('辅导员') >= 0"
      >
        <template slot="title"><span class="shrink">学生信息</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="mystudent"
            :route="{ name: 'mystudent' }"
            v-if="privileges.indexOf('我的学生') >= 0"
            ><span class="shrink">我的学生</span></el-menu-item
          >
          <el-menu-item
            index="studentinfo"
            :route="{ name: 'studentinfo' }"
            v-if="privileges.indexOf('信息总览') >= 0"
            ><span class="shrink">信息总览</span></el-menu-item
          >
          <el-menu-item
            index="minority"
            :route="{ name: 'minority' }"
            v-if="privileges.indexOf('班级管理') >= 0"
            ><span class="shrink">班级管理</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <!--日常管理-->
      <el-submenu
        index="daily-management"
        v-if="privileges.indexOf('我的工作') >= 0"
      >
        <template slot="title"><span class="shrink">日常管理</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="mywork"
            :route="{ name: 'mywork' }"
            v-if="privileges.indexOf('我的工作') >= 0"
            ><span class="shrink">我的工作</span></el-menu-item
          >

          <el-menu-item index="leaveinfo" :route="{ name: 'leaveinfo' }"
            ><span class="shrink">请假管理</span></el-menu-item
          >
          <el-menu-item
            index="notificationmanagement"
            :route="{ name: 'notificationmanagement' }"
            ><span class="shrink">通知管理</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <!--学生成绩-->
      <el-submenu
        index="student-grade"
        v-if="roles.indexOf('班长') >= 0 || roles.indexOf('辅导员') >= 0"
      >
        <template slot="title"><span class="shrink">学生成绩</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="comprehensive"
            :route="{ name: 'comprehensive' }"
            v-if="privileges.indexOf('综合测评') >= 0"
          >
            <span class="shrink">综合测评</span></el-menu-item
          >
          <el-menu-item
            index="scholarshipsetting"
            :route="{ name: 'scholarshipsetting' }"
            v-if="roles.indexOf('辅导员') >= 0"
          >
            <span class="shrink">奖学金管理</span></el-menu-item
          >
          <el-menu-item
            index="studentgrades"
            :route="{ name: 'studentgrades' }"
            v-if="privileges.indexOf('学生成绩') >= 0"
          >
            <span class="shrink">学生成绩</span></el-menu-item
          >
          <el-menu-item
            index="failsituation"
            :route="{ name: 'failsituation' }"
            v-if="privileges.indexOf('挂科情况') >= 0"
          >
            <span class="shrink">挂科情况</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <!--课外研学-->
      <el-submenu index="extra-study">
        <template slot="title"><span class="shrink">课外研学</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="contest"
            :route="{ name: 'contest' }"
            v-if="privileges.indexOf('学科竞赛') >= 0"
            ><span class="shrink">学科竞赛</span></el-menu-item
          >
          <el-menu-item
            index="innovation"
            :route="{ name: 'innovation' }"
            v-if="privileges.indexOf('创新创业') >= 0"
            ><span class="shrink">创新创业</span></el-menu-item
          >
          <el-menu-item
            index="paperpatent"
            :route="{ name: 'paperpatent' }"
            v-if="privileges.indexOf('论文专利') >= 0"
            ><span class="shrink">论文专利</span></el-menu-item
          >
          <el-menu-item
            index="socialpractice"
            :route="{ name: 'socialpractice' }"
            v-if="privileges.indexOf('社会实践') >= 0"
          >
            <span class="shrink">社会实践</span></el-menu-item
          >
          <el-menu-item
            index="ExtraStudyAudit"
            :route="{ name: 'ExtraStudyAudit' }"
            v-if="privileges.indexOf('审计') >= 0"
          >
            <span class="shrink">审核</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <!--奖勤助贷-->
      <el-submenu index="price-borrow">
        <template slot="title"><span class="shrink">奖勤助贷</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="scholarship"
            :route="{ name: 'scholarship' }"
            v-if="privileges.indexOf('奖学金') >= 0"
            ><span class="shrink">奖学金</span></el-menu-item
          >
          <el-menu-item
            index="stipend"
            :route="{ name: 'stipend' }"
            v-if="privileges.indexOf('助学金') >= 0"
            ><span class="shrink">助学金</span></el-menu-item
          >
          <el-menu-item
            index="studentloan"
            :route="{ name: 'studentloan' }"
            v-if="privileges.indexOf('助学贷款') >= 0"
            ><span class="shrink">助学贷款</span></el-menu-item
          >
          <el-menu-item
            index="parttime"
            :route="{ name: 'parttime' }"
            v-if="privileges.indexOf('勤工助学') >= 0"
            ><span class="shrink">勤工助学</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>

      <!--信息统计-->
      <el-submenu index="count" v-if="privileges.indexOf('统计') >= 0">
        <template slot="title"><span class="shrink">统计</span></template>
        <el-menu-item-group>
          <el-menu-item
            index="newcount"
            :route="{ name: 'newcount' }"
            v-if="privileges.indexOf('新建统计任务') >= 0"
            ><span class="shrink">新建统计任务</span></el-menu-item
          >
          <el-menu-item
            index="countlist"
            :route="{ name: 'countlist' }"
            v-if="privileges.indexOf('已有统计列表') >= 0"
            ><span class="shrink">已有统计列表</span></el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item
        index="leaveinfo"
        :route="{ name: 'leaveinfo' }"
        v-if="privileges.indexOf('我的工作') === -1"
      >
        <span class="shrink">请假管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "navigation",
  data() {
    return {
      privileges: [],
      roles: [],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    this.privileges = JSON.parse(sessionStorage.getItem("user")).privileges;
    this.roles = JSON.parse(sessionStorage.getItem("user")).roles;
  },
};
</script>

<style scoped>
.navigation {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

@media screen and (max-width: 768px) {
  .navigation {
    width: 58px;
  }

  .navigation .shrink {
    display: none;
  }

  .el-submenu .el-menu .el-menu-item-group ul .el-menu-item {
    padding: 0 20px !important;
  }
}
</style>
