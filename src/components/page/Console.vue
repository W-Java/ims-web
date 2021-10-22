<template>
  <el-container class="wrapper">
    <el-header>
      <main-header/>
    </el-header>
    <el-container class="bottom">
      <el-aside width="200px" v-if="(monitor&& this.$store.state.monitorBrowsingStatus==='monitor' || instructor) ">
        <navigation/>
      </el-aside>
      <el-main>
        <transition name="el-fade-in" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import mainHeader from '@/components/element/Header'
  import navigation from '@/components/element/Navigation'

  export default {
    name: 'console',
    data() {
      return {
        student: false,
        monitor: false,
        instructor: false,
        OKToPopOut: false,
        tbpo: [],
      }
    },
    created() {
      if (sessionStorage.getItem('monitorBrowsingStatus') !== null)
        this.$store.commit('changeMonitorBrowsingStatus', sessionStorage.getItem('monitorBrowsingStatus'));
      else
        this.$store.commit('changeMonitorBrowsingStatus', 'student');
      this.OKToPopOut = true;
      this.tbpo = this.$store.state.toBePoppedOut;
      this.$webSocket.setWebSocket(JSON.parse(sessionStorage.getItem('user')).token);
      this.student = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('学生') >= 0;
      this.monitor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0;
      this.instructor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('辅导员') >= 0;
    },
    components: {
      mainHeader,
      navigation
    },
    watch: {
      tbpo(newVal, oldVal) {
        if (newVal.length > 0 && this.OKToPopOut)
          this.showOnePopOutNotification(newVal[0]);
        console.log('消息弹窗');
      }
    },
    methods: {
      showOnePopOutNotification(sysMsgItem) {
        this.OKToPopOut = false;
        this.$notify({
          title: '收到新通知',
          type: sysMsgItem.type,
          message: sysMsgItem.sysMsgTitle,
          offset: 80
        });
        this.$store.commit('popFrontTBPO');
        setTimeout(5000);
        this.OKToPopOut = true;
      }
    }
  }
</script>

<style scoped>
  .el-header {
    height: 60px !important;
    padding: 0px !important;
  }

  .wrapper {
    width: 100%;
    height: 100%;
  }

  .bottom {
    margin-top: 1px;
    overflow: auto;
  }
</style>
