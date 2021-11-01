<template>
  <div>
    <h1>系统消息中心</h1>
    <el-table
      :data="sysMsgTableData"
      width="100%"
      @row-click="handleRowClick"
      v-loading="whileLoading"
      :stripe="true"
    >
      <el-table-column width="16">
        <template slot-scope="scope">
          <div class="circle" v-if="scope.row.status === '未读'"></div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="sysMsgTitle" min-width="800" label="消息"></el-table-column>-->
      <!--<el-table-column prop="date" label="日期" min-width="200" fixed="right"></el-table-column>-->
      <el-table-column
        prop="title"
        min-width="400"
        label="消息"
      ></el-table-column>
      <el-table-column
        prop="kind"
        min-width="100"
        label="类别"
        fixed="right"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="日期"
        min-width="100"
        fixed="right"
      ></el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showSysMsgDialog"
      title="系统消息详情"
      width="60%"
      :before-close="handleBeforeClose"
    >
      <h2 class="sysMsg">{{ sysMsgTitle }}</h2>
      <p class="sysMsg">建立时间：{{ sysMsgCreateTime }}</p>
      <br />
      <div v-html="sysMsgDialog" class="sysMsgHtml"></div>
    </el-dialog>

    <div class="block" style="float: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordQuantity"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "systemMessages",
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      recordQuantity: 0,
      whileLoading: true,
      showSysMsgDialog: false,
      sysMsgDialog: "",
      sysMsgTitle: "",
      sysMsgCreateTime: "",
      sysMsgTableData: [],
    };
  },
  methods: {
    handleBeforeClose(done) {
      this.sysMsgDialog = "";
      done();
    },
    handleRowClick(row, event, column) {
      row.status = "已读";
      this.showSysMsgDialog = true;
      let id = row.id;
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.sendQuery();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.sendQuery();
    },
    sendQuery() {
      this.whileLoading = true;
      this.$axios
        .post("sm/message/all", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.status === 0) {
            this.recordQuantity = res.data.data.recordQuantity;
            this.sysMsgTableData = res.data.data.data;
          }
          console.log(res.data.message);
        })
        .finally(() => (this.whileLoading = false));
    },
  },
  created() {
    this.sendQuery();
  },
};
</script>

<style scoped>
.sysMsg {
  text-align: center;
}

.sysMsgHtml {
  margin-left: 120px;
  margin-right: 120px;
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
</style>
