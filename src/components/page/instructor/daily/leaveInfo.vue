<template>
  <div>
    <!-- **** 筛选文本框和日期选择器 **** -->

    <!-- **** 筛选文本框和日期选择器 **** -->


    <el-row>
      <el-col :span="4">
        <el-switch
          v-model="infoSwitch"
          inactive-color="#e477bb"
          active-color="rgba(227, 120, 188, 0.25)"
          @change="handleInfoSwitch"
          active-text="历史记录"
          inactive-text="待审核"
          style="margin-top: 10px; margin-bottom: 10px">
        </el-switch>
      </el-col>
      <!--筛选文本框-->
      <el-col :span="4">
        <el-autocomplete
          style="width: 100%;"
          v-model="nameAndNumberInput"
          placeholder="按姓名/学号筛选"
          :fetch-suggestions="fetchSuggestions"
          :trigger-on-focus="false"
          clearable
        ></el-autocomplete>
      </el-col>
      <!--日期选择器-->
      <el-col :span="4">
        <el-date-picker
          v-model="selectedDate"
          style="width: 100%;"
          type="date"
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
          placeholder="按离校/返校日期筛选">
        </el-date-picker>
      </el-col>
      <!--查询按钮-->
      <el-col :span="2">
        <el-button style="width: 100%;">查询</el-button>
      </el-col>
    </el-row>
    <!-- **** 筛选文本框和日期选择器 **** -->
    <!-- **** 筛选文本框和日期选择器 **** -->
    <el-row :gutter="10">
      <!--筛选文本框-->
      <el-col :span="4">
        <el-autocomplete
          style="width: 100%;"
          v-model="nameAndNumberInput"
          placeholder="按姓名/学号筛选"
          :fetch-suggestions="fetchSuggestions"
          :trigger-on-focus="false"
          clearable
        ></el-autocomplete>
      </el-col>
      <!--日期选择器-->
      <el-col :span="4">
        <el-date-picker
          v-model="selectedDate"
          style="width: 100%;"
          type="date"
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
          placeholder="按离校/返校/申请日期筛选">
        </el-date-picker>
      </el-col>
      <!--查询按钮-->
      <el-col :span="2">
        <el-button style="width: 100%;" @click="handleQueryClick">查询</el-button>
      </el-col>

      <el-col :span="4">
        <el-select v-if="!monitor && infoSwitch" @change="leaveInfoChange" v-model="leaveValue" placeholder="请假状态查询">
          <el-option
            v-for="item in optionsForLeave"
            :key="item.leaveValue"
            :label="item.leaveLabel"
            :value="item.leaveValue">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-table v-if="!infoSwitch" @selection-change="handelSelectionChange" header-align="center" id="leaveInfoTable"
                style="width:100%"
                :data="leaveTableData"
                :stripe="true"
                v-loading="whileLoading"
                key="leaveInfoTable">
        <el-table-column type="selection" width="50%" v-if="instructor" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="学号" width="100" prop="stuId"></el-table-column>
        <el-table-column label="姓名" width="100" prop="stuName"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="外出地址" prop="address"></el-table-column>
        <el-table-column label="紧急联系人" prop="emergencyPerson"></el-table-column>
        <el-table-column label="紧急联系方式" prop="emergencyContact"></el-table-column>
        <el-table-column label="离校时间" prop="leaveTime"></el-table-column>
        <el-table-column label="返校时间" prop="returnTime"></el-table-column>
        <el-table-column label="请假事由" prop="reason"></el-table-column>
        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <!--在有备注的情况下显示备注-->
            <div v-if="scope.row.note !== '无'">
              {{scope.row.note}}
              <!--<el-popover>-->
              <!--<img :src="scope.row.note" style="max-width: 750px;max-height: 750px;"/>-->
              <!--<img slot="reference" :src="scope.row.note" :alt="scope.row.note"-->
              <!--style="max-height: 50px;max-width: 130px">-->

              <!--</el-popover>-->
            </div>
            <!--备注为 “无” 时显示 “无” -->
            <div v-else>
              {{scope.row.note}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!--在state为 “UNCHECKED” 时，才显示审批按钮-->
            <div v-if="(monitor && scope.row.state === '未审核') || (instructor && scope.row.state === '班长通过')">
              <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
              <el-button type="danger" size="small" @click="handleDialog">不通过</el-button>
              <el-dialog title="提示" width="50%" :visible.sync="dialogVisible">
                <div style="font-size: small;color: #606266">请输入驳回理由</div>
                <br>
                <el-input placeholder="请输入内容" v-model="failReason" type="textarea" :autosize="{minRows:5}"></el-input>
                <el-button size="small" type="primary" :disabled="dialogDisabled"
                           @click="handleFail(scope.$index, scope.row)">确认提交
                </el-button>
              </el-dialog>
            </div>
            <!--其他情况下显示实时状态-->
            <div v-else>
              {{scope.row.state}}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else header-align="center" id="historyInfoTable" style="width:100%"
                :data="historyTableData"
                :stripe="true"
                v-loading="whileLoading"
                key="historyInfoTable">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="学号">
                <span>{{ props.row.stuId }}</span>
              </el-form-item>
              <el-form-item label="姓名">
                <span>{{ props.row.stuName }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="外出地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="紧急联系人">
                <span>{{ props.row.emergencyPerson }}</span>
              </el-form-item>
              <el-form-item label="紧急联系方式">
                <span>{{ props.row.emergencyContact }}</span>
              </el-form-item>
              <el-form-item label="离校时间">
                <span>{{ props.row.leaveTime }}</span>
              </el-form-item>
              <el-form-item label="返校时间">
                <span>{{ props.row.returnTime }}</span>
              </el-form-item>
              <el-form-item label="请假事由">
                <span>{{ props.row.reason }}</span>
              </el-form-item>
              <el-form-item label="提交时间">
                <span>{{ props.row.submitTime }}</span>
              </el-form-item>
              <el-form-item label="审核状态">
                <span>{{ props.row.state }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="学号" width="100" prop="stuId"></el-table-column>
        <el-table-column label="姓名" width="100" prop="stuName"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="外出地址" prop="address"></el-table-column>
        <el-table-column label="离校时间" prop="leaveTime"></el-table-column>
        <el-table-column label="返校时间" prop="returnTime"></el-table-column>
        <el-table-column label="请假事由" prop="reason"></el-table-column>
      </el-table>
    </el-row>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="paginationSpan">
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
      </el-col>
    </el-row>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  export default {
    name: "leaveInfo",
    data() {
      return {
        optionsForLeave: [{
          leaveValue: 'notStarted',
          leaveLabel: '未到请假时间'
        }, {
          leaveValue: 'started',
          leaveLabel: '正在请假'
        }, {
          leaveValue: 'finished',
          leaveLabel: '请假结束'
        }],
        leaveValue: '',
        inputType: '',
        nameAndNumberInput: '',
        selectedDate: '',
        instructor: false,
        monitor: false,
        pageSize: 20,
        currentPage: 1,
        recordQuantity: 0,
        whileLoading: false,
        multipleSelection: [],
        failReason: "",
        dialogVisible: false,
        updateTableDataNow: false,
        infoSwitch: false,
      }
    },
    created() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.instructor = user.roles.indexOf('辅导员') >= 0;
      this.monitor = user.roles.indexOf('班长') >= 0;
      this.updateTableDataNow = true;
    },
    asyncComputed: {
      dialogDisabled() {
        return !(this.failReason !== '');
      },
      groupOpSpan() {
        return this.instructor ? 12 : 0;
      },
      paginationSpan() {
        return this.instructor ? 12 : 24;
      },
      historyTableData() {//历史记录！！！！
        this.whileLoading = true;
        if (this.infoSwitch === true) {
          let queryOption = 'tableData'; // 欲返回的结果
          let tableName = 'audited'; // 确定查询的是那张表的数据
          let dict = {};
          dict.pageSize = this.pageSize;
          dict.currentPage = this.currentPage;
          dict.queryOption = queryOption;
          dict.queryType = tableName;
          if (this.updateTableDataNow) {
            this.updateTableDataNow = false;
            return this.$axios.post('/sm/showCheckInfo', dict).then(
              res => {
                if (res.data.status === 0) {
                  this.recordQuantity = res.data.data.recordQuantity;
                  console.log(res.data.message);
                  for (let i = 0; i < res.data.data.recordItem.length; i++) {
                    if (res.data.data.recordItem[i].state === 'SECONPASS') {
                      res.data.data.recordItem[i].state = '辅导员通过';
                    } else if (res.data.data.recordItem[i].state === 'FIRSTPASS') {
                      res.data.data.recordItem[i].state = '班长通过';
                    } else if (res.data.data.recordItem[i].state === 'UNCHECKED') {
                      res.data.data.recordItem[i].state = '未审核';
                    } else if (res.data.data.recordItem[i].state === 'FAILED') {
                      res.data.data.recordItem[i].state = '驳回';
                    }
                  }
                  return res.data.data.recordItem;
                }
              }
            ).finally(() => {
              this.whileLoading = false;
            })
          }
        }
      },
      leaveTableData() {                 //审核假条表！！！！
        this.whileLoading = true;
        if (this.infoSwitch === false) {
          let queryOption = 'tableData'; // 欲返回的结果
          let tableName = 'toAudit'; // 确定查询的是那张表的数据
          let dict = {};
          dict.pageSize = this.pageSize;
          dict.currentPage = this.currentPage;
          dict.queryOption = queryOption;
          dict.queryType = tableName;
          if (this.updateTableDataNow) {
            this.updateTableDataNow = false;
            return this.$axios.post('/sm/showCheckInfo', dict).then(
              res => {
                if (res.data.status === 0) {
                  this.recordQuantity = res.data.data.recordQuantity;
                  console.log(res.data.message);
                  for (let i = 0; i < res.data.data.recordItem.length; i++) {
                    if (res.data.data.recordItem[i].state === 'SECONPASS') {
                      res.data.data.recordItem[i].state = '辅导员通过';
                    } else if (res.data.data.recordItem[i].state === 'FIRSTPASS') {
                      res.data.data.recordItem[i].state = '班长通过';
                    } else if (res.data.data.recordItem[i].state === 'UNCHECKED') {
                      res.data.data.recordItem[i].state = '未审核';
                    } else if (res.data.data.recordItem[i].state === 'FAILED') {
                      res.data.data.recordItem[i].state = '驳回';
                    }
                  }
                  return res.data.data.recordItem;
                }
              }
            ).finally(() => {
              this.whileLoading = false;
              // this.updateTableDataNow = false;
            })
          }
        }
      },
    },
    watch: {
      nameAndNumberInput(curVal, oldVal) {
        // console.log(queryString);
        console.log(curVal);
        let str = curVal.trim();
        let reg = /^[\u4E00-\u9FA5]{1,4}$/;
        /*定义验证表达式*/
        let ChnName = reg.test(str);
        /*验证中文名*/
        reg = /^[a-z\s.]+$/i;
        let EngName = reg.test(str);
        /*验证英文名*/
        reg = /^[0-9]+$/;
        let num = reg.test(str.trim());
        /*验证学号*/
        // console.log('Chn', ChnName);
        // console.log('Eng', EngName);
        // console.log('Num', num);
        // 设置学号标记
        if (num) {
          this.inputType = 'number';
        }
        // 设置姓名标记
        else if (ChnName || EngName) {
          this.inputType = 'name';
        }
        else {
          this.inputType = '';
        }
      }
    },
    //filterCheckInfo
    methods: {
      leaveInfoChange(){
        this.currentPage = 1;
        this.pageSize=20;
        console.log(this.leaveValue);
        this.whileLoading = true;
        this.$axios.post('/sm/filterCheckInfo',{
          'currentPage':this.currentPage,
          'pageSize':this.pageSize,
          'filter':this.leaveValue,
        }).then(res => {
          if (res.data.status === 0) {
            this.recordQuantity = res.data.data.recordQuantity;
            console.log(res.data.message);
            for (let i = 0; i < res.data.data.recordItem.length; i++) {
              if (res.data.data.recordItem[i].state === 'SECONPASS') {
                res.data.data.recordItem[i].state = '辅导员通过';
              } else if (res.data.data.recordItem[i].state === 'FIRSTPASS') {
                res.data.data.recordItem[i].state = '班长通过';
              } else if (res.data.data.recordItem[i].state === 'UNCHECKED') {
                res.data.data.recordItem[i].state = '未审核';
              } else if (res.data.data.recordItem[i].state === 'FAILED') {
                res.data.data.recordItem[i].state = '驳回';
              }
            }
            this.historyTableData = res.data.data.recordItem;
          }
        }).finally(()=>{
          this.whileLoading = false;
        })
      },
      suggestionRequest(cb) { // 用来返回自动补全列表
        this.$axios.post('sm/fuzzyQuery', {
          // 'queryOption': 'autoComplete',
          'inputType': this.inputType,
          'nameAndNumberInput': this.nameAndNumberInput
        }).then(
          res => {
            if (res.data.status === 0) {
              console.log(res.data.message);
              let ac = [];
              for (let i of res.data.data)
                ac.push({'value': '' + i});
              cb(ac);
            }
            else {
              cb([]);
            }
          }
        ).catch(() => {
          console.log('e');
          cb([]);
        })
      },
      fetchSuggestions(queryString, cb) {
        if (this.inputType === 'number' || this.inputType === 'name')
          this.suggestionRequest(cb);
        else
          cb([]);
      },
      // 点击查询按钮，发送查询参数
      handleQueryClick() {
        this.currentPage = 1; // 重置当前页码
        let queryOption = 'tableData'; // 欲返回的结果
        let queryType = this.infoSwitch ? 'audited' : 'toAudit'; // 确定查询的是那张表的数据
        let dict = {
          'queryOption': queryOption,
          'queryType': queryType,
          'pageSize': this.pageSize,
          'currentPage': this.currentPage,
          // 'nameAndNumberInput': this.nameAndNumberInput,
          // 'inputType': this.inputType,
          // 'selectedDate': this.selectedDate,
        };
        if (this.nameAndNumberInput !== '')
          dict.nameAndNumberInput = this.nameAndNumberInput;
        if (this.inputType !== '')
          dict.inputType = this.inputType;
        if (this.selectedDate !== '' && this.selectedDate !== null)
          dict.selectedDate = this.selectedDate;
        this.whileLoading = true;
        this.$axios.post('/sm/showCheckInfo', dict).then(
          res => {
            if (res.data.status === 0) {
              console.log(res.data.message);
              for (let i = 0; i < res.data.data.recordItem.length; i++) {
                if (res.data.data.recordItem[i].state === 'SECONPASS') {
                  res.data.data.recordItem[i].state = '辅导员通过';
                } else if (res.data.data.recordItem[i].state === 'FIRSTPASS') {
                  res.data.data.recordItem[i].state = '班长通过';
                } else if (res.data.data.recordItem[i].state === 'UNCHECKED') {
                  res.data.data.recordItem[i].state = '未审核';
                } else if (res.data.data.recordItem[i].state === 'FAILED') {
                  res.data.data.recordItem[i].state = '驳回';
                }
              }
              if (!this.infoSwitch)
                this.leaveTableData = res.data.data.recordItem;
              else
                this.historyTableData = res.data.data.recordItem;
            }
          }
        ).finally(() => {
            this.whileLoading = false;
          }
        )
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.updateTableDataNow = true;
      },
      handelSelectionChange(val) {
        this.multipleSelection = val;
      },
      checkSelectable(row) {
        // console.log(row.state);
        return (row.state === '未审核' || row.state === '班长通过');
      },
      processAction(dict) {
        this.$axios.post('/sm/updateCheckInfo', dict)
          .then(res => {
            if (res.data.status === 0) {
              console.log(res.data.message);
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }
          }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作不成功'
          })
        }).finally(() => {
          this.updateTableDataNow = true;
        });
      },
      handleSuccess(index, row) {
        console.log(row.number);
        let selectedID = [];
        selectedID.push(row.id);
        this.processAction({'action': 'PASS', 'selectedID': selectedID});
      },
      handleFail(index, row) {
        let selectedID = [];
        selectedID.push(row.id);
        this.processAction({'action': 'UNPASS', 'reason': this.failReason, 'selectedID': selectedID});
        this.failReason = '';
        this.dialogVisible = false;
      },
      handleGroupSuccess() {
        let selectedID = [];
        let length = this.multipleSelection.length;
        for (let i = 0; i < length; i++) {
          selectedID.push(this.multipleSelection[i].id);
        }
        this.processAction({'action': 'PASS', 'selectedID': selectedID});
      },
      handleDialog() {
        this.dialogVisible = true;
      },
      handleInfoSwitch() {  // 点击开关切换表格时，重置当前页码
        this.updateTableDataNow = true;
        // this.nameAndNumberInput = '';
        // this.selectedDate = '';
        this.currentPage = 1;
      },
      // handleGroupFail() {
      //   //全部不通过时 使记录全部清除 且向学生端发送消息
      //   let selectedID = [];
      //   let length = this.multipleSelection.length;
      //   for (let i = 0; i < length; i++) {
      //     selectedID.push(this.multipleSelection[i].id);
      //   }
      //   this.processAction({'action': 'FAIL', 'selectedID': selectedID});
      // },
    }
  }
</script>

<style scoped>

</style>
