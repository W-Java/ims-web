<template>
  <div>

    <el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="selectedOption" @change="handleOption">
          <el-option v-for="selection in optionsForStudyAudit"
                     :key="selection"
                     :label="selection"
                     :value="selection">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="searchKeyWords" @change="handelKeyWords" ref="keyWords" clearable placeholder="搜索关键字">
        </el-input>
      </el-col>
      <el-col style="margin-top: 10px; margin-left: 20px" :span="3">
        <template>
          <el-radio v-if="paperPatentTableVisible" v-model="radio" label="paper" @change="handelRadio">论文</el-radio>
          <el-radio v-if="paperPatentTableVisible" v-model="radio" label="patent" @change="handelRadio">专利
          </el-radio>
        </template>
      </el-col>
    </el-row>

    <div style="margin-top: 10px">
      <el-table @selection-change="handelSelectionChange" header-align="center" id="contestTable" style="width:100%"
                :data="contestTableData"
                :stripe="stripeOn"
                v-loading="commonWhileLoading"
                v-if="contestTableVisible"
                key="contestTable">
        <el-table-column type="selection" width="50%"></el-table-column>
        <el-table-column label="班级" prop="_class"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="比赛名称" prop="contest"></el-table-column>
        <el-table-column label="竞赛级别" prop="level"></el-table-column>
        <el-table-column label="奖励等级" prop="grade"></el-table-column>
        <el-table-column label="获奖时间" prop="time"></el-table-column>
        <el-table-column label="比赛类型" prop="kind"></el-table-column>
        <el-table-column label="指导老师" prop="tutor"></el-table-column>
        <el-table-column label="获奖证书" prop="certificate" width="150px"
                         header-align="center" align="center">
          <template slot-scope="scope">
            <el-popover>
              <img :src="scope.row.certificate" style="max-width: 750px;max-height: 750px;"/>
              <img slot="reference" :src="scope.row.certificate" :alt="scope.row.certificate"
                   style="max-height: 50px;max-width: 130px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核" width="180" prop="audit">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleFail(scope.$index, scope.row)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table @selection-change="handelSelectionChange" header-align="center" id="paperTable" style="width:100%"
                :data="paperTableData"
                :stripe="stripeOn"
                v-loading="commonWhileLoading"
                v-if="paperTableVisible"
                key="paperTable">
        <el-table-column type="selection" width="50%"></el-table-column>
        <el-table-column label="班级" prop="_class"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="论文名称" prop="paper"></el-table-column>
        <el-table-column label="发表期刊" prop="publish"></el-table-column>
        <el-table-column label="发表时间" prop="time"></el-table-column>
        <el-table-column label="收录情况" prop="level"></el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="审核" width="180" prop="audit">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleFail(scope.$index, scope.row)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table @selection-change="handelSelectionChange" header-align="center" id="patentTable"
                style="width:100%;';"
                :data="patentTableData"
                :stripe="stripeOn"
                v-loading="commonWhileLoading"
                v-if="patentTableVisible"
                key="patentTable">
        <el-table-column type="selection" width="50%"></el-table-column>
        <el-table-column label="班级" prop="_class"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="专利名称" prop="patent"></el-table-column>
        <el-table-column label="类别" prop="kind"></el-table-column>
        <el-table-column label="授权号" prop="authorization"></el-table-column>
        <el-table-column label="获批时间" prop="time"></el-table-column>
        <el-table-column label="是否为第一发明人" width="150" prop="level"></el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="审核" width="180" prop="audit">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleFail(scope.$index, scope.row)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table @selection-change="handelSelectionChange" header-align="center" id="socialPracticeTable"
                :data="socialTableData" style="width: 100%"
                :stripe="stripeOn"
                v-loading="commonWhileLoading"
                v-if="socialPracticeTableVisible"
                key="socialPracticeTable">
        <el-table-column type="selection" width="50%"></el-table-column>
        <el-table-column label="班级" prop="_class"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="社会实践名称" prop="social"></el-table-column>
        <el-table-column label="是否立项" prop="status"></el-table-column>
        <el-table-column label="项目负责人" prop="charger"></el-table-column>
        <el-table-column label="工号" prop="chargerNumber"></el-table-column>
        <el-table-column label="实践时间" prop="time"></el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="审核" width="180" prop="audit">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleFail(scope.$index, scope.row)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table @selection-change="handelSelectionChange" header-align="center" id="otherTable"
                :data="otherTableData"
                style="width: 100%"
                :stripe="stripeOn"
                v-loading="commonWhileLoading"
                v-if="otherTableVisible"
                key="otherTable">
        <el-table-column type="selection" width="50%"></el-table-column>
        <el-table-column label="班级" prop="_class"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="名称" prop="other"></el-table-column>
        <el-table-column label="级别" prop="level"></el-table-column>
        <el-table-column label="类型" prop="kind"></el-table-column>
        <el-table-column label="奖励等级" prop="grade"></el-table-column>
        <el-table-column label="获奖时间" prop="time"></el-table-column>
        <el-table-column label="指导老师" prop="tutor"></el-table-column>
        <el-table-column label="证明" prop="certificate" width="150px"
                         header-align="center" align="center">
          <template slot-scope="scope">
            <el-popover>
              <img :src="scope.row.certificate" style="max-width: 750px;max-height: 750px;"/>
              <img slot="reference" :src="scope.row.certificate" :alt="scope.row.certificate"
                   style="max-height: 50px;max-width: 130px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="审核" width="180" prop="audit">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleSuccess(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" size="small" @click="handleFail(scope.$index, scope.row)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <el-button type="success" size="small" @click="handleGroupSuccess"> 批量通过</el-button>
        <el-button type="danger" size="small" @click="handleGroupFail"> 批量不通过</el-button>
      </el-col>
      <el-col :span="12">
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

<script>
  import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";

  export default {
    name: "ExtraStudyAudit",
    components: {ElSelectDropdown},
    data() {
      return {
        moralScoreStat: {},
        optionsForMajor: [],
        multipleSelection: [],
        selectedOption: '学科竞赛',
        optionsForStudyAudit: ["学科竞赛", "论文专利", "社会实践", "其他获奖"],
        searchKeyWords: '',
        stripeOn: '',
        commonWhileLoading: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
        contestTableVisible: true,
        paperTableVisible: false,
        patentTableVisible: false,
        paperPatentTableVisible: false,
        socialPracticeTableVisible: false,
        otherTableVisible: false,
        radio: "paper",
      }
    },
    created() {
    },
    asyncComputed: {
      otherTableData() {
        if (this.selectedOption === '其他获奖') {
          this.commonWhileLoading = true;
          var dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          dict.showAllMembers = this.memberSwitch;
          return this.$axios.post('/sm/other', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            return res.data.data.students
          }).finally(() => {
            this.commonWhileLoading = false;
          });
        }
      },
      paperTableData() {
        if (this.selectedOption === '论文专利' && this.radio === 'paper') {
          this.commonWhileLoading = true;
          var dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          dict.showAllMembers = this.memberSwitch;
          return this.$axios.post('/sm/paper', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            return res.data.data.students
          }).finally(() => {
            this.commonWhileLoading = false;
          });
        }
      },
      patentTableData() {
        if (this.selectedOption === '论文专利' && this.radio === 'patent') {
          this.commonWhileLoading = true;
          var dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          dict.showAllMembers = this.memberSwitch;
          return this.$axios.post('/sm/patent', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            return res.data.data.students
          }).finally(() => {
            this.commonWhileLoading = false;
          });
        }
      },
      contestTableData() {
        if (this.selectedOption === '学科竞赛') {
          this.commonWhileLoading = true;
          var dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          dict.showAllMembers = this.memberSwitch;
          return this.$axios.post('/sm/contest', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            return res.data.data.students
          }).finally(() => {
            this.commonWhileLoading = false;
          });
        }
      },
      socialTableData() {
        if (this.selectedOption === '社会实践') {
          this.commonWhileLoading = true;
          var dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          dict.showAllMembers = this.memberSwitch;
          return this.$axios.post('/sm/social', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            return res.data.data.students
          }).finally(() => {
            this.commonWhileLoading = false;
          });
        }
      },
    },
    methods: {
      resetPage() {
        this.currentPage = 1;
      },
      handleOption() {
        this.resetPage();
        if (this.selectedOption === '学科竞赛') {
          this.contestTableVisible = true;
          this.paperTableVisible = false;
          this.socialPracticeTableVisible = false;
          this.otherTableVisible = false;
          this.paperPatentTableVisible = false;
          this.patentTableVisible = false;
        } else if (this.selectedOption === '论文专利') {
          this.paperPatentTableVisible = true;
          this.paperTableVisible = true;
          this.patentTableVisible = false;
          this.contestTableVisible = false;
          this.socialPracticeTableVisible = false;
          this.otherTableVisible = false;
        } else if (this.selectedOption === '社会实践') {
          this.socialPracticeTableVisible = true;
          this.contestTableVisible = false;
          this.paperTableVisible = false;
          this.otherTableVisible = false;
          this.paperPatentTableVisible = false;
          this.patentTableVisible = false;
        } else {
          this.otherTableVisible = true;
          this.contestTableVisible = false;
          this.paperTableVisible = false;
          this.socialPracticeTableVisible = false;
          this.paperPatentTableVisible = false;
          this.patentTableVisible = false;
        }
        //this.sendQuery({});
      },
      handelRadio() {
        if (this.radio === "paper") {
          this.paperTableVisible = true;
          this.patentTableVisible = false;
        }
        else {
          this.paperTableVisible = false;
          this.patentTableVisible = true;
        }
        //this.sendQuery({});
      },
      // /**
      //  * 为审核按钮设置的函数
      //  * @param type 'success'表示通过，'fail'表示不通过
      //  * @param selectedId 需要操作的学号列表
      //  */
      // processAudit(type, selectedId){
      //   this.$axios.post('sm/processauditlist', {'type':type, 'selectedID': selectedId}).then(
      //     res=>{
      //       if (res.data.status === 0){
      //         this.$message({
      //           type:'success',
      //           message: '已通过'
      //         })
      //       }
      //     }
      //   ).catch(()=>{
      //     this.$message({
      //       type:'error',
      //       message:'未成功通过'
      //     })
      //   })
      // },
      // todo 测试单个通过按钮点击时是否选中学号
      handleSuccess(index, row) {
        console.log(row.number);
        let selectedID = [];
        selectedID.push(row.id);
        this.processAudit({'action': 'success', 'selectedID': selectedID});
      },
      handleFail(index, row) {
        let selectedID = [];
        selectedID.push(row.id);
        this.processAudit({'action': 'fail', 'selectedID': selectedID});
      },
      handleGroupSuccess() {
        let selectedID = [];
        let length = this.multipleSelection.length;
        for (let i = 0; i < length; i++) {
          selectedID.push(this.multipleSelection[i].id);
        }
        this.processAudit({'action': 'success', 'selectedID': selectedID});
      },
      handleGroupFail() {
        //全部不通过时 使记录全部清除 且向学生端发送消息
        let selectedID = [];
        let length = this.multipleSelection.length;
        for (let i = 0; i < length; i++) {
          selectedID.push(this.multipleSelection[i].id);
        }
        this.processAudit({'action': 'fail', 'selectedID': selectedID});
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      processAudit(dict) {
        if (this.selectedOption === '学科竞赛') {
          this.$axios.post('sm/Audit/contest', dict)
            .then(res => {
              if (res.data.status === 0||res.data.status === 400) {
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
          });
        } else if (this.selectedOption === '论文专利') {
          if (this.paperTableVisible) {
            this.$axios.post('sm/Audit/paper', dict)
              .then(res => {
                if (res.data.status === 0||res.data.status === 400) {
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
            });
          }
          else {
            this.$axios.post('sm/Audit/patent', dict)
              .then(res => {
                if (res.data.status === 0||res.data.status === 400) {
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
            });
          }
        } else if (this.selectedOption === '社会实践') {
          this.$axios.post('sm/Audit/social', dict)
            .then(res => {
              if (res.data.status === 0||res.data.status === 400) {
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
          });
        } else {
          this.$axios.post('sm/Audit/other', dict)
            .then(res => {
              if (res.data.status === 0||res.data.status === 400) {
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
          });
        }
      },
      handelSelectionChange(val) {
        this.multipleSelection = val;
      },
      // todo 完善这个搜索功能（debounce）
      handelKeyWords() {
        let dict = {};
        if (this.searchKeyWords.length !== 0) {
          let start = new RegExp(/^\d+/);
          if (start.exec(this.searchKeyWords) === null) {
            dict.text = this.searchKeyWords;
          }
          else {
            dict.number = this.searchKeyWords;
          }
          // this.sendQuery(dict);
        }
      },
    },
  }
</script>

