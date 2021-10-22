<template>
  <div>
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
        <el-breadcrumb-item>德育分审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <div v-if="instructor">
        <el-col :span="3">
          <el-select v-model="selectedMajor"
                     @change="handleSelectedMajor"
                     placeholder="专业选择"
                     style="width: 100%;">
            <el-option v-for="major in optionsForMajor"
                       :key="major"
                       :label="major"
                       :value="major">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedClass"
                     :disabled="classSelectionDisabled"
                     @change="handleSelectedClass"
                     placeholder="所有班级"
                     style="width: 100%;">
            <el-option v-for="_class in optionsForClass"
                       :key="_class"
                       :label="_class"
                       :value="_class">
            </el-option>
          </el-select>
        </el-col>
      </div>
      <div v-if="monitor">
        {{targetClass}}
      </div>
    </el-row>

    <el-row style="margin-top: 10px" :gutter="10">
      <el-col :span="3">
        <el-button type="danger" style="width: 100%;" :disabled="rejectionDisabled" @click="handleRejection">驳回
        </el-button>
      </el-col>
      <el-col :span="21">
        <el-input v-model="rejectionReason" placeholder="驳回理由（点击驳回前请先填写驳回理由）"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-table :data="moralGradeTableData" :stripe="true" :span-method="objectSpanMethod" v-loading="whileLoading">
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="班级" prop="shortName"></el-table-column>
        <el-table-column label="德育分" prop="moralGrade"></el-table-column>
        <el-table-column label="区间比例" prop="sectionRatio"></el-table-column>
        <el-table-column label="规则比例" prop="normalRatio"></el-table-column>
      </el-table>
    </el-row>

    <!--<el-row :gutter="10" style="margin-top: 10px">-->
    <!--<el-col :span="3">-->
    <!--<el-button v-if="monitor" type="success" style="width: 100%;" :disabled="acceptDisabled" @click="handleAccept">-->
    <!--通过-->
    <!--</el-button>-->
    <!--</el-col>-->
    <!--<el-col :span="24">-->
    <!--<div class="block" style="float: right;">-->
    <!--<el-pagination-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="currentPage"-->
    <!--:page-sizes="[20,50,100]"-->
    <!--:page-size="pageSize"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="recordQuantity">-->
    <!--</el-pagination>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  export default {
    name: "moralAudit",
    data() {
      return {
        pageSize: 2000,          // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,        // 当前页码
        recordQuantity: 0,     // 总数据量
        instructor: false,
        monitor: false,
        rejectionReason: '',
        selectedClass: '',
        selectedMajor: '',
        moralGradeStat: {},
        // moralGradeTableData: [],
        optionsForMajor: [],
        optionsForClass: [],
        targetClass: '',
        whileLoading: false,
      }
    },
    created() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.instructor = user.roles.indexOf('辅导员') >= 0;
      this.monitor = user.roles.indexOf('班长') >= 0;
      if (this.instructor)
        this.getMajorOptions();
      else if (this.monitor) {
        this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
          res => {
            console.log(res.data.message);
            this.targetClass = res.data.data[0];
          }
        );
      }
    },
    methods: {
      resetSelectedClass() {
        this.selectedClass = '';
      },
      resetPage() {
        this.currentPage = 1;
      },
      handleSelectedMajor() {
        this.resetSelectedClass();
        this.resetPage();
        // this.sendQuery();
      },
      handleSelectedClass() {
        this.resetPage();
        this.sendQuery();
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex < 4) {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
        if (columnIndex === 4 || columnIndex === 5) { // 区间比例、规则比例
          if (rowIndex === 0) {
            return {
              rowspan: this.moralGradeStat.top,
              colspan: 1
            };
          }
          if (rowIndex === this.moralGradeStat.top)
            return {
              rowspan: this.moralGradeStat.medium,
              colspan: 1
            };
          if (rowIndex === this.moralGradeStat.top + this.moralGradeStat.medium)
            return {
              rowspan: this.moralGradeStat.tail,
              colspan: 1
            }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      },
      handleRejection() {
        this.$confirm('驳回后无法撤销，需要班长再次提交表单', '驳回确认', {
          cancelButtonText: '取消',
          confirmButtonText: '确认驳回',
          type: 'warning'
        }).then(() => {
          this.$axios.post('sm/comprehensive/moralrejection', {shortName: this.selectedClass}).then(res => {
            if (res.data.status === 0)
              this.$message({
                type: 'success',
                message: '已驳回'
              })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '驳回不成功'
            })
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回'
          })
        })
      },
      getMajorOptions() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.optionsForMajor = [].concat(res.data.data);
          }
        );
      },
      sendQuery() {
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
      handleAccept() {
        this.$axios.post('sm/comprehensive/moralauditaccept', {'shortName': this.selectedClass}).then(
          res => {
            if (res.data.status === 0) {
              console.log(res.data.message);
              this.$message({
                type: 'success',
                message: '已通过'
              })
            }
          }
        ).catch(() => {
          this.$message({
            type: 'error',
            message: '未成功通过'
          })
        })
      },
    },
    asyncComputed: {
      moralGradeTableData() {
        let dict = {};
        dict.shortName = this.selectedClass;      // 选择的班级
        dict.selectedMajor = this.selectedMajor;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        if (this.selectedClass !== '') {
          this.whileLoading = true;
          return this.$axios.post('sm/comprehensive/moralaudittable', dict).then(
            res => {
              if (res.data.status === 0) {
                console.log(res.data.message);
                this.recordQuantity = res.data.data.recordQuantity;
                this.moralGradeStat.top = res.data.data.top;
                this.moralGradeStat.medium = res.data.data.medium;
                this.moralGradeStat.tail = res.data.data.tail;
                let mgtd = res.data.data.data;
                let total = this.moralGradeStat.top + this.moralGradeStat.medium + this.moralGradeStat.tail;
                let topRatio = Math.round(this.moralGradeStat.top / total * 100);
                let mediumRatio = Math.round(this.moralGradeStat.medium / total * 100);
                let tailRatio = 100 - topRatio - mediumRatio;
                // 处理某一档成绩没有记录的情况
                if (this.moralGradeStat.top === 0) {
                  mgtd.splice(0, 0, {number: '无', name: '无', shortName: '无', moralGrade: '无'});
                  this.moralGradeStat.top++;
                }
                if (this.moralGradeStat.medium === 0) {
                  mgtd.splice(this.moralGradeStat.top, 0, {number: '无', name: '无', shortName: '无', moralGrade: '无'});
                  this.moralGradeStat.medium++;
                }
                if (this.moralGradeStat.tail === 0) {
                  mgtd.splice(this.moralGradeStat.top + this.moralGradeStat.medium, 0, {
                    number: '无',
                    name: '无',
                    shortName: '无',
                    moralGrade: '无'
                  });
                  this.moralGradeStat.tail++;
                }
                // 结束处理
                for (let i = 0; i < mgtd.length; i++) {
                  if (i < this.moralGradeStat.top) {
                    mgtd[i].sectionRatio = topRatio + '%';
                    mgtd[i].normalRatio = '25%';
                  }
                  else if (i < this.moralGradeStat.top + this.moralGradeStat.medium) {
                    mgtd[i].sectionRatio = mediumRatio + '%';
                    mgtd[i].normalRatio = '50%';
                  }
                  else {
                    mgtd[i].sectionRatio = tailRatio + '%';
                    mgtd[i].normalRatio = '25%';
                  }
                  // console.log(mgtd[i].name + ' ' + mgtd[i].sectionRatio);
                }
                return mgtd;
              }
              return [];
            }
          ).finally(() => {
            this.whileLoading = false;
          });
        }
        return [];
      },
      acceptDisabled() {
        return this.selectedClass === '';
      },
      optionsForClass() {
        if (this.selectedMajor !== '') {
          return this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              console.log(res.data.message);
              return [].concat(res.data.data);
            }
          );
        }
      },
      rejectionDisabled() {
        return this.rejectionReason.trim().length === 0;
      },
      classSelectionDisabled() {
        return this.selectedMajor === '';
      },

    },
  }
</script>

<style scoped>

</style>
