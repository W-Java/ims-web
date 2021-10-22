<template>
  <div>

    <div v-if="!hasSet">
      <h3>设置学年奖学金比例</h3>
      <div class="setting">
        <el-row :gutter="10">
          <el-col :span="2" class="right">特等奖：</el-col>
          <el-col :span="3">
            <el-input type="number" v-model="scholarship.特等奖"></el-input>
          </el-col>
          <el-col :span="1" class="left">%</el-col>
          <el-col :span="2" class="right">一等奖：</el-col>
          <el-col :span="3">
            <el-input type="number" v-model="scholarship.一等奖"></el-input>
          </el-col>
          <el-col :span="1" class="left">%</el-col>
          <el-col :span="2" class="right">二等奖：</el-col>
          <el-col :span="3">
            <el-input type="number" v-model="scholarship.二等奖"></el-input>
          </el-col>
          <el-col :span="1" class="left">%</el-col>
          <el-col :span="2" class="right">三等奖：</el-col>
          <el-col :span="3">
            <el-input type="number" v-model="scholarship.三等奖"></el-input>
          </el-col>
          <el-col :span="1" class="left">%</el-col>
        </el-row>
      </div>
      <el-button style="margin-top: 20px;float: right" type="primary" @click="setProption">确定</el-button>
    </div>
    <div v-if="hasSet">
      <h3>学年奖学金比例</h3>
      <div class="setting">
        <el-row :gutter="10">
          <el-col :span="6" class="left">特等奖：{{scholarship["特等奖"]}}%</el-col>
          <el-col :span="6" class="left">一等奖：{{scholarship["一等奖"]}}%</el-col>
          <el-col :span="6" class="left">二等奖：{{scholarship["二等奖"]}}%</el-col>
          <el-col :span="6" class="left">三等奖：{{scholarship["三等奖"]}}%</el-col>
        </el-row>
      </div>
      <el-button style="margin-top: 20px;float: right" type="primary" @click="resetProption">修改</el-button>
    </div>
    <div v-if="hasSet" class="scholarList">
      <h3>奖学金列表</h3>
      <el-select style="margin-top: 20px" v-model="selectedMajor"
                 @change="handleSelectedMajor"
                 placeholder="请选择专业">
        <el-option v-for="major in choice.optionsForMajor"
                   :key="major"
                   :label="major"
                   :value="major">
        </el-option>
      </el-select>
      <el-table :data="studentList" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
        <el-table-column label="班级" width="200" prop="stuClass"></el-table-column>
        <el-table-column label="学号" width="200" prop="stuId"></el-table-column>
        <el-table-column label="姓名" width="100" prop="stuName"></el-table-column>
        <el-table-column label="挂数科" width="100" prop="failNum"></el-table-column>
        <el-table-column label="加权平均分" width="100" prop="grade"></el-table-column>
        <el-table-column label="加权排名" width="100" prop="majorRank"></el-table-column>
        <el-table-column label="综测分数" width="100" prop="allGrade"></el-table-column>
        <el-table-column label="综测排名" width="100" prop="compreRank"></el-table-column>
        <el-table-column label="等级" width="100" prop="level"></el-table-column>
        <el-table-column label="操作" v-if="!majorHasSet">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="changeScholarship(scope.row)">修改奖项</el-button>
            <el-button type="danger" size="small" @click="cancleScholarship(scope.row)">取消资格</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="noteInfo"></el-table-column>
      </el-table>
      <div v-if="selectedMajor!==''">
        {{selectedMajor}}的各奖项实际人数<br/>
        <el-row>
          <el-col :span="6">特等奖：{{proption.特等奖}}</el-col>
          <el-col :span="6">一等奖：{{proption.一等奖}}</el-col>
          <el-col :span="6">二等奖：{{proption.二等奖}}</el-col>
          <el-col :span="6">三等奖：{{proption.三等奖}}</el-col>
        </el-row>
      </div>
      <el-button v-if="!majorHasSet" style="float: right;margin-top: 20px" type="primary" @click="summitScholarship">
        提交
      </el-button>
      <el-button v-if="!majorHasSet" style="float: right;margin-top: 20px;margin-right: 20px" @click="addStudent">添加学生
      </el-button>
    </div>

    <el-dialog
      title="修改奖项"
      :visible.sync="change"
      style="width: 800px;margin: 0 auto"
      :close-on-click-modal="false">
      {{selectedStudent.stuName}}的成绩为<br/><br/>
      加权成绩：{{selectedStudent.grade}}<br/><br/>
      加权排名：{{selectedStudent.majorRank}}<br/><br/>
      综测成绩：{{selectedStudent.allGrade}}<br/><br/>
      综测排名：{{selectedStudent.compreRank}}<br/><br/>
      原奖项:{{selectedStudent.level}}<br/><br/>
      修&nbsp;改&nbsp;为&nbsp;：
      <el-select style="width: 200px" size="small" v-model="changeLevel">
        <el-option v-for="level in choice.optionsForLevel"
                   :key="level"
                   :label="level"
                   :value="level">
        </el-option>
      </el-select>
      <br/><br/>
      修改原因：
      <el-input size="small" style="width: 200px" v-model="reason"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleChange">取消</el-button>
          <el-button type="danger" size="small" @click="checkChange">确认修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加奖学金"
      :visible.sync="add"
      width="80%"
      :close-on-click-modal="false">
      <el-table :data="addStudentList">
        <el-table-column label="班级" width="200" prop="_class"></el-table-column>
        <el-table-column label="学号" width="200" prop="number"></el-table-column>
        <el-table-column label="姓名" width="100" prop="name"></el-table-column>
        <el-table-column label="挂数科" width="100" prop="failNum"></el-table-column>
        <el-table-column label="加权平均分" width="100" prop="grade"></el-table-column>
        <el-table-column label="加权排名" width="100" prop="majorRank"></el-table-column>
        <el-table-column label="综测分数" width="100" prop="allGrade"></el-table-column>
        <el-table-column label="综测排名" width="100" prop="compreRank"></el-table-column>
        <el-table-column label="操作" v-if="!majorHasSet">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="addThisStudent(scope.row)">添加学生</el-button>
          </template>
        </el-table-column>
      </el-table>
      已选学生：{{selectedStudent.name}}<br/><br/>
      添加级别：
      <el-select style="width: 200px" size="small" v-model="changeLevel">
        <el-option v-for="level in choice.optionsForLevel"
                   :key="level"
                   :label="level"
                   :value="level">
        </el-option>
      </el-select>
      <br/><br/>
      添加原因：
      <el-input size="small" style="width: 200px" v-model="reason"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleChange">取消</el-button>
          <el-button type="danger" size="small" @click="checkAdd">确认添加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "ScholarshipSetting",
    data() {
      return {
        choice: {
          optionsForMajor: [],
          optionsForLevel: ["特等奖", "一等奖", "二等奖", "三等奖"]
        },
        selectedMajor: "",
        scholarship: {
          特等奖: 0,
          一等奖: 0,
          二等奖: 0,
          三等奖: 0
        },
        studentList: [],
        addStudentList: [],
        hasSet: false,
        whileLoading: false,
        stripeOn: true,
        majorHasSet: false,
        change: false,
        selectedStudent: {},
        changeLevel: "",
        reason: "",
        add: false,
        proption: {
          特等奖: 0,
          一等奖: 0,
          二等奖: 0,
          三等奖: 0
        }
      }
    },
    created() {
      this.$axios.get('/sm/scholarShipScale').then(res => {
        if (res.data.status === 0) {
          if (res.data.data !== null) {
            this.scholarship = res.data.data;
            this.hasSet = true;
          }
          else {
            this.hasSet = false;
          }
        }
      });
      this.getOptions_basic();
    },
    methods: {
      setProption() {
        let dict = {};
        dict["特等奖"] = parseInt(this.scholarship.特等奖);
        dict["一等奖"] = parseInt(this.scholarship.一等奖);
        dict["二等奖"] = parseInt(this.scholarship.二等奖);
        dict["三等奖"] = parseInt(this.scholarship.三等奖);
        this.$axios.post('/sm/scholarShipScale', dict).then(res => {
          if (res.data.status === 0) {
            this.hasSet = true;
          }
        })
      },
      resetProption() {
        this.$confirm('是否确认要修改比例（若确认则需对每个专业重新设置，已提交专业无法重置）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.hasSet = false;
          this.selectedMajor = "";
          this.studentList = [];
        }).catch(() => {
          this.$message.info('取消修改');
        });
      },
      handleSelectedMajor() {
        let dict = {};
        dict.major = this.selectedMajor;
        this.whileLoading = true;
        //先判断是否已提交，若已提交获取的数据为[]，则去请求未提交的，若未提交也为[]，说明生成，生成之后再调用接口，若未提交不为[]，则直接赋数据
        this.$axios.get('sm/scholarShip', {params: {'major': this.selectedMajor, 'tempFlag': false}}).then(res1 => {
          if (res1.data.status === 0) {
            //说明该专业未提交
            if (res1.data.data.length === 0) {
              this.$axios.get('sm/scholarShip', {
                params: {
                  'major': this.selectedMajor,
                  'tempFlag': true
                }
              }).then(res2 => {
                if (res2.data.status === 0) {
                  // 说明该专业未生成名单
                  if (res2.data.data.length === 0) {
                    this.$axios.post('sm/scholarShipGenerate', {'major': this.selectedMajor}).then(response => {
                      if (response.data.status === 0) {
                        this.$axios.get('sm/scholarShip', {params: {'major': this.selectedMajor}}).then(res3 => {
                          if (res3.data.status === 0) {
                            this.studentList = res3.data.data;
                            this.proptionSet();
                            this.majorHasSet = false;
                          }
                        })
                      }
                    })
                  }
                  //该专业已生成名单，但是未提交
                  else {
                    this.studentList = res2.data.data;
                    this.proptionSet();
                    this.majorHasSet = false;
                  }
                }
              })
            }
            // 说明该专业已提交
            else {
              this.studentList = res1.data.data;
              this.proptionSet();
              this.majorHasSet = true;
            }
          }
        });
        // this.majorHasSet = false;
        this.whileLoading = false;
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(res => {
          this.choice.optionsForMajor = res.data.data;
        })
      },
      cancleScholarship(student) {
        this.$confirm('是否确认取消该学生奖学金资格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.id = student.id;
          dict.level = "无";
          dict.note = "取消资格";
          this.$axios.put('sm/scholarShip', dict).then(res => {
            if (res.data.status === 0) {
              this.$message.success("取消资格成功");
              this.handleSelectedMajor();
            }
            else {
              this.$message.error("取消资格失败");
            }
          })

        }).catch(() => {
          this.$message.info('取消资格撤销');
        });
      },
      changeScholarship(student) {
        this.selectedStudent = student;
        this.changeLevel = student.level;
        this.change = true;
      },
      proptionSet() {
        let number = [0, 0, 0, 0];
        for (let i of this.studentList) {
          switch (i.level) {
            case "特等奖":
              number[0]++;
              break;
            case "一等奖":
              number[1]++;
              break;
            case "二等奖":
              number[2]++;
              break;
            case "三等奖":
              number[3]++;
              break;
          }
        }
        this.proption.特等奖 = number[0];
        this.proption.一等奖 = number[1];
        this.proption.二等奖 = number[2];
        this.proption.三等奖 = number[3];

        // this.proption.特等奖 = (number[0] * 100 / this.studentList.length).toFixed(1);
        // this.proption.一等奖 = (number[1] * 100 / this.studentList.length).toFixed(1);
        // this.proption.二等奖 = (number[2] * 100 / this.studentList.length).toFixed(1);
        // this.proption.三等奖 = (number[3] * 100 / this.studentList.length).toFixed(1);
      },
      cancleChange() {
        this.selectedStudent = {};
        this.changeLevel = "";
        this.change = false;
        this.add = false;
      },
      checkChange() {
        let dict = {};
        dict.id = this.selectedStudent.id;
        dict.level = this.changeLevel;
        dict.note = this.reason;
        this.$axios.put('sm/scholarShip', dict).then(res => {
          if (res.data.status === 0) {
            this.change = false;
            this.handleSelectedMajor();
            this.selectedStudent = {};
            this.reason = "";
            this.changeLevel = "";
          }
        });
      },
      addStudent() {
        this.add = true;
        this.$axios.get('sm/comprehensive/topStudents', {
          params: {
            'major': this.selectedMajor,
            'number': 100
          }
        }).then(res => {
          if (res.data.status === 0) {
            this.addStudentList = res.data.data;
          }
        })
      },
      addThisStudent(student) {
        this.selectedStudent = student;
      },
      checkAdd() {
        let dict = {};
        dict.stuId = this.selectedStudent.number;
        dict.level = this.changeLevel;
        dict.note = this.reason;
        this.$axios.post('sm/scholarShip', dict).then(res => {
          if (res.data.status === 0) {
            this.$message.success("添加成功");
            this.handleSelectedMajor();
            this.add = false;
            this.selectedStudent = {};
            this.reason = "";
            this.changeLevel = "";
          }
        })
      },
      summitScholarship() {
        this.$confirm('是否确认提交' + this.selectedMajor + '的奖学金名单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('sm/scholarShipCommit', {params: {'major': this.selectedMajor}}).then(res => {
            if (res.data.status === 0) {
              this.$message.success("提交成功");
              this.majorHasSet = true;
            }
            else {
              this.$message.error("提交失败");
            }
          })

        }).catch(() => {
          this.$message.info('提交撤销');
        });
      }
    }
  }
</script>

<style scoped>
  .right {
    text-align: right;
    padding: 10px;
  }

  .left {
    text-align: left;
    padding: 10px;
  }

  .scholarList {
    margin-top: 20px;
  }
</style>
