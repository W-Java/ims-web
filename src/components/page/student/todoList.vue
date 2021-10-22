<template>
  <div>
    <h1>我的待办事项</h1>
    <el-table
      :data="todoListTableData"
      width="100%"
      @row-click="handleRowClick"
      v-loading="whileLoading"
      :stripe='true'
    >
      <el-table-column prop="name" min-width="800" label="待办事项"></el-table-column>
      <el-table-column prop="status" min-width="100" label="状态"></el-table-column>
      <el-table-column prop="startDate" label="创建日期" min-width="200" fixed="right"></el-table-column>
      <el-table-column prop="endDate" label="截止日期" min-width="200"></el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showTodoListDialog"
      title="待办事项详情"
      width="80%"
    >
      <dynamic-form :disabled="disabledData" ref="countForm" v-model="countData"></dynamic-form>
      <el-row type="flex">
        <el-col :span="6" :offset="18">
          <el-button @click="showTodoListDialog=false">取消</el-button>
          <el-button v-if="!disabledData" type="primary" @click="submitCountData('countForm')">确认</el-button>
          <el-button v-if="disabledData" type="primary" @click="canEdite">修改</el-button>
        </el-col>
      </el-row>
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
  import dynamicForm from '@/components/element/dynamicForm';

  export default {
    name: "todolist",
    components: {
      dynamicForm
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 20,
        recordQuantity: 0,
        whileLoading: false,
        showTodoListDialog: false,
        todoListTableData: [],
        countData: {},
        disabledData: false,
        statsID: '',
        fillStatus: 'save'
      }
    },
    methods: {
      canEdite() {
        this.disabledData = false;
        this.fillStatus = 'modify';
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
      submitCountData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
              data[headerItem.key] = this.countData.statsData[i].projectRules.value;
            }

            postData.header = JSON.stringify(header);
            postData.data = JSON.stringify(data);
            postData.id = this.statsID;
            postData.status = this.fillStatus;
            //变量复原
            this.disabledData = false;
            this.fillStatus = 'save';
            this.$axios.post('sm/fillStats', postData)
              .then(
                response => {
                  if (response.data.status === 0) {
                    this.$message({
                      message: "信息提交成功",
                      type: 'success'
                    });
                    this.showTodoListDialog = false;
                  }
                }
              )
          } else {
            console.log('error submit');
            return false;
          }
        });
      },
      handleRowClick(row) {
        if (row.status === '暂未开始') {
          this.$message.warning('还没到时间哦，请再等一下');
          return;
        } else if (row.status === '已结束') {
          this.$message.warning('时间已经过了哦');
          return;
        }
        this.showTodoListDialog = true;
        let id = row.id;
        this.statsID = id;
        this.whileLoading = true;
        let postData = {};
        postData.id = id;
        this.$axios.post('sm/getStats', postData)
          .then(
            response => {
              if (response.data.status === 0) {
                this.countData = response.data.data;
                this.countData.statsData = JSON.parse(this.countData.statsData);
                this.$axios.post('sm/statsDetail', {id: row.id}).then(
                  response => {
                    if (response.data.status === 0 && response.data.data) {
                      this.disabledData = true;
                      let data = JSON.parse(response.data.data);
                      let loopTimes = this.countData.statsData.length;
                      for (let i = 0; i < loopTimes; i++) {
                        this.countData.statsData[i].projectRules.value = data[this.countData.statsData[i].projectName];
                      }
                    }
                    else {
                      this.disabledData = false;
                    }
                  }
                )
              }
            }
          ).finally(() => this.whileLoading = false);
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
        this.$axios.post('sm/StatsList',
          {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
              status: 'submit',
            identity: 'student'
          }
        ).then(res => {
          if (res.data.status === 0) {
            this.recordQuantity = res.data.data.recordQuantity;
            this.todoListTableData = res.data.data.countList;
            let loopTimes = this.todoListTableData.length;
            for (let i = 0; i < loopTimes; i++) {
              let startDate = this.parseToDate(this.todoListTableData[i].startDate, this.todoListTableData[i].startTime);
              let endDate = this.parseToDate(this.todoListTableData[i].endDate, this.todoListTableData[i].endTime);
              let nowDate = new Date();
              let countStatus = '';
              if (nowDate < startDate) {
                countStatus = '暂未开始';
              } else if (nowDate <= endDate) {
                countStatus = '进行中';
              } else {
                countStatus = '已结束';
              }
              this.todoListTableData[i].status = countStatus;
            }
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

<style scoped>

</style>
