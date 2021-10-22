<template>
  <div>
    <h1>通知中心</h1>
    <el-table
      :data="notificationTableData"
      width="100%"
      @row-click="handleRowClick"
      v-loading="whileLoading"
      :stripe='true'
    >
      <el-table-column width="16">
        <template slot-scope="scope">
          <div class="circle" v-if="scope.row.unread"></div>
        </template>
      </el-table-column>
      <el-table-column prop="title" min-width="800" label="通知"></el-table-column>
      <el-table-column prop="createTime" label="日期" min-width="200" fixed="right"></el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showNotificationDialog"
      title="通知详情"
      width="80%"
      :before-close="handleBeforeClose"
    >
      <h2 class="notification">{{notificationTitle}}</h2>
      <p class="notification">建立时间：{{notificationCreateTime}}</p>
      <br>
      <div v-html="notificationHTML" class="notificationHtml"></div>
    </el-dialog>

    <div class="block" style="float: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordQuantity">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    name: "notifications",
    data() {
      return {
        currentPage: 1,
        pageSize: 20,
        recordQuantity: 0,
        whileLoading: true,
        showNotificationDialog: false,
        notificationHTML: '',
        notificationDialog: '',
        notificationTitle: '',
        notificationCreateTime: '',
        notificationTableData: [
          {notificationTitle: 'haha', date: '2018-7-26', notificationID: 'http://baidu.com', unread: false},
          {notificationTitle: '一二三', date: '2018-7-25', notificationID: 'http://baidu.com', unread: true}
        ],
      }
    },
    methods: {
      handleBeforeClose(done){
        this.notificationTitle = '';
        this.notificationCreateTime = '';
        this.notificationHTML = '';
        done();
      },
      handleRowClick(row, event, column) {
        row.status = '已读';
        this.showNotificationDialog = true;
        let id = row.id;
        this.$axios.post('sm/notice/one', {id: id})
          .then(res => {
              if (res.data.status === 0) {
                this.notificationHTML = res.data.data.content;
                this.notificationTitle = res.data.data.title;
                this.notificationCreateTime = res.data.data.createTime;
              }
              console.log(res.data.message)
            }
          )
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
        this.$axios.post('sm/notice/myNotice',
          {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        )
          .then(res => {
            if (res.data.status === 0) {
              this.recordQuantity = res.data.data.recordQuantity;
              this.notificationTableData = res.data.data.data;
            }
            console.log(res.data.message);
          })
          .finally(() => this.whileLoading = false);
      }
    },
    created() {
      this.sendQuery();
    }
  }
</script>

<style>
  .circle {
    /*z-index: 3;*/
    border-radius: 100%;
    background-color: #fb7c9c;
    width: 6px;
    height: 6px;
    margin-left: auto;
    margin-right: auto;
  }

  .notification {
    text-align: center;
  }

  .notificationHtml {
    margin-left: 120px;
    margin-right: 120px;
  }

</style>
