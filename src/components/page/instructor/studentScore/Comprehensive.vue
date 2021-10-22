<template>
  <!--这里写内容-->
  <div>
    <div>
      <el-row style="padding-right: 3%; box-sizing: padding-box" :gutter="40">
        <el-col
          class="row-col boxx"
          :span="8"
          v-for="(year, index) in years"
          :key="index"
        >
          <el-card class="box-card">
            <div class="buttonBig" type="text">
              <div
                class="text item yearBig"
                style="cursor: pointer"
                @click="checkOne(year)"
              >
                <span>{{ year.substr(0, 4) }}——{{ year.substr(5, 4) }}</span>
              </div>
              <div class="bottomOperate" v-if="newYear !== year">已结束</div>
              <div class="bottomOperate" v-if="newYear === year">
                {{ checkStatus }}
              </div>
              <div class="bottomOperate" v-if="newYear === year">
                <div v-if="instructor && checkNum < 6" style="width: 100%">
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum > 7"
                        @click.native="startComp"
                        type="text"
                        icon="el-icon-time"
                      >
                        修改综测时间
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum > 4"
                        @click.native="setSettingVisibal"
                        type="text"
                        icon="el-icon-location"
                        >设置班级互审
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        @click="importGrades"
                        :disabled="checkNum > 5"
                        type="text"
                        icon="el-icon-upload"
                        >导入成绩
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum !== 5"
                        @click.native="compVerify"
                        type="text"
                        icon="el-icon-edit"
                      >
                        综测审核
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum !== 5"
                        @click.native="moralAudit"
                        type="text"
                        icon="el-icon-edit-outline"
                        >德育分审核
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
                <div
                  v-if="monitor && checkNum < 6"
                  style="width: 100%; text-align: left; margin-top: 20px"
                >
                  <el-row>
                    <el-col :offset="4" :span="6">
                      <el-button
                        :disabled="checkNum < 2"
                        @click.native="manyEvaluate"
                        type="text"
                        icon="el-icon-edit-outline"
                        >打分
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum < 3 || checkNum > 5"
                        @click.native="classVerify"
                        type="text"
                        icon="el-icon-edit"
                        >综测审核
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4" :span="8">
                      <el-button
                        :disabled="checkNum !== 4"
                        @click.native="otherVerify"
                        type="text"
                        icon="el-icon-edit-outline"
                        >综测互审
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 设置开始综测 -->
        <el-col class="row-col boxx" :span="7" v-if="instructor">
          <el-button class="buttonBig add-card" type="text" @click="startComp">
            <i
              class="iconfont sm-plus"
              style="font-size: 200px; height: 550px"
            ></i>
            <p style="color: #c0c4cc">点击“+”发布新学年综测</p>
          </el-button>
        </el-col>
      </el-row>
      <!-- 导入成绩dialog -->
      <el-dialog :visible.sync="importVisible" title="导入提示" width="30%">
        <div style="font-size: small; color: #606266">
          请导入本学年成绩<br />
          <!--<el-col :span="24">-->
          <div style="font-size: small; color: #606266">
            只能上传xls/xlsx文件,
            <a
              href="https://ims-file.oss-cn-shenzhen.aliyuncs.com/%E5%AD%A6%E7%94%9F%E6%88%90%E7%BB%A9%E7%A4%BA%E4%BE%8B%E8%A1%A8%E6%A0%BC.xls"
            >
              <u>点此下载示例表格</u></a
            >
          </div>
          <!--</el-col>-->
        </div>
        <div style="text-align: center">
          <el-upload
            ref="upload"
            action="sm/comprehensive/uploadGrade"
            :before-upload="beforefileupload"
            :file-list="fileList"
            :on-sucess="handlesucess"
            :auto-upload="true"
          >
            <el-button
              slot="trigger"
              style="font-size: small; margin-top: 10px"
              size="small"
              type="primary"
              >导入表格
            </el-button>
          </el-upload>
        </div>
      </el-dialog>
      <!-- 设置班级互审模态框 -->
      <el-dialog
        title="互审班级"
        :visible.sync="setClassVisibal"
        :close-on-click-modal="false"
        width="50%"
      >
        <el-row>
          <p style="color: #c0c4cc">
            *提示：每个专业设置完毕后都要点击“保存此专业设置”按钮进行保存
          </p>
          <br />
        </el-row>
        <el-row>
          <el-col
            :span="6"
            v-for="(major, index) in options.optionsForMajor"
            :key="index"
          >
            <el-radio
              v-model="selectedMajor.major"
              :value="major"
              @change="handleMajorChange"
              :label="major"
            ></el-radio>
          </el-col>
        </el-row>

        <el-form v-model="classSetting" class="classSetForm">
          <el-row
            v-for="(_class, indexx) in options.optionsForClass"
            :key="indexx"
            style="margin: 10px 0"
          >
            <el-col class="center" :span="8">{{ _class }}</el-col>
            <el-col :span="12">
              <el-select v-model="selectedMajor.relation[_class]">
                <el-option
                  v-if="_class !== otherClass"
                  v-for="otherClass in options.optionsForClass"
                  :key="otherClass"
                  :label="otherClass"
                  :value="otherClass"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form>
        <br />
        <el-row>
          <el-col :span="12" :offset="6">
            <el-button
              @click.native="saveOneMajor"
              type="primary"
              style="width: 160px"
              >保存此专业设置
            </el-button>
            <el-button
              @click.native="finishSetting"
              type="primary"
              style="width: 160px"
              >完成</el-button
            >
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.add-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}

.buttonBig {
  width: 100%;
  height: 100%;
  padding: 0;
  color: #000;
  text-align: center;
}

.yearBig {
  text-align: center;
  font-size: 35px;
  font-weight: bolder;
  margin: 80px 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.yearBig span {
  margin: 40px 0;
}

.boxx {
  height: 600px;
}

.box-card {
  height: 100%;
}

/*.el-card{*/
/*background: #ff91a9;*/
/*color: #fff;*/
/*}*/
.bottomOperate {
  font-size: 24px;
  font-weight: bold;
  margin: 40px;
  display: flex;
  justify-content: center;
}

.bottomOperate .el-button {
  font-size: 20px;
}

.row-col .el-card__body {
  text-align: center;
}

.row-col {
  margin-top: 10px;
}

.buttons .el-button {
  width: 100%;
  margin: 40px 0;
}
</style>

<script>
var dict = {};
export default {
  name: "comprehensive",
  data() {
    return {
      fileList: [],
      majors: [],
      monitor: false,
      instructor: false,
      years: [],
      newYear: "2020-2021",
      stateMapping: "",
      checkStatus: "",
      checkNum: 0,
      setClassVisibal: false,
      options: {
        optionsForMajor: [],
        optionsForClass: [],
      },
      selectedMajor: {
        major: "",
        relation: {},
      },
      selectedOtherClass: [],
      majorsSetting: {},
      classSetting: {}, //只是一个model的占用，无实际作用
      importVisible: false,
    };
  },
  created() {
    let date = new Date();
    let nowYear = date.getFullYear();
    let oldYear = nowYear - 1;
    this.newYear = oldYear + "-" + nowYear;
    if (JSON.parse(sessionStorage.getItem("user")).roles.indexOf("班长") >= 0) {
      this.monitor = true;
    }
    if (
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("辅导员") >= 0
    ) {
      this.instructor = true;
    }
    let dict = {};
    this.$axios.post("sm/comprehensive/year", dict).then((res) => {
      this.years = res.data.data;
      if (this.years.indexOf(this.newYear) >= 0) {
        this.$axios
          .get("sm/comprehensive/yearStatus/" + this.newYear)
          .then((res) => {
            this.stateMapping = res.data.data;
            switch (this.stateMapping) {
              case "NOTSTARTED":
                this.checkStatus = "未开始";
                this.checkNum = 1;
                break;
              case "FREETIME":
                this.checkStatus = "自由申报";
                this.checkNum = 2;
                break;
              case "FIRSTCHECKING":
                this.checkStatus = "班长审核中 ";
                this.checkNum = 3;
                break;
              case "SECONDCHECKING":
                this.checkStatus = "班级互审中";
                this.checkNum = 4;
                break;
              case "THIRDCHECKING":
                this.checkStatus = "辅导员审核中";
                this.checkNum = 5;
                break;
              case "PUBLICING":
                this.checkStatus = "公示中 ";
                this.checkNum = 6;
                break;
              case "CLOSED":
                this.checkStatus = "已结束 ";
                this.checkNum = 7;
                break;
            }
          });
      }
    });
  },

  methods: {
    getClassSetting() {
      //获取专业和班级选项
      this.$store.dispatch("majoroptions", {}).then((res) => {
        this.options.optionsForMajor = [].concat(res.data.data);
        let dict = {};
        this.$axios
          .post("sm/comprehensive/classSettingGet", dict)
          .then((res) => {
            this.majorsSetting = res.data.data;
          });
      });
    },
    setSettingVisibal() {
      this.getClassSetting();
      this.selectedMajor.major = "";
      this.options.optionsForClass = [];
      this.selectedMajor.relation = {};
      this.setClassVisibal = true;
    },
    finishSetting() {
      for (let i = 0; i < this.options.optionsForMajor.length; i++) {
        if (this.majorsSetting[this.options.optionsForMajor[i]] === undefined) {
          this.$confirm("存在班级未设置互审班级，是否继续填写？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {})
            .catch(() => {
              this.setClassVisibal = false;
            });
          return;
        }
      }
      this.$message.success("所有专业互审班级设置成功！");
      this.setClassVisibal = false;
    },
    saveOneMajor() {
      let classes = this.options.optionsForClass;
      for (let i = 0; i < classes.length; i++) {
        if (this.selectedMajor.relation[classes[i]] === undefined) {
          this.$message.warning("还有班级未设置审核班级！");
          return;
        } else {
          for (let j = 0; j < classes.length, j !== i; j++) {
            if (
              this.selectedMajor.relation[classes[i]] ===
              this.selectedMajor.relation[classes[j]]
            ) {
              this.$message.warning("存在班级互审班级重复！");
              return;
            }
          }
        }
      }
      this.$axios
        .post("sm/comprehensive/classSetting", this.selectedMajor)
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success("保存专业设置成功！");
            this.majorsSetting[this.selectedMajor.major] = this.selectedMajor;
            this.selectedMajorState = true;
          } else {
            this.$message.error("保存专业设置失败！");
          }
        });
    },
    handleMajorChange() {
      this.$axios
        .post("sm/classoptions", { major: this.selectedMajor.major })
        .then((response) => {
          if (response.data.status === 0) {
            this.options.optionsForClass = response.data.data;
          }
        });
      if (this.edit === false) {
        this.selectedMajorState = true;
      } else {
        this.selectedMajorState = false;
      }
      if (this.majorsSetting[this.selectedMajor.major] !== undefined) {
        this.selectedMajor.relation = JSON.parse(
          this.majorsSetting[this.selectedMajor.major]
        ).relation;
        this.selectedMajorState = true;
      } else {
        this.selectedMajor.relation = {};
      }
    },
    handlesucess(res, file, filelist) {
      filelist.concat({ name: file.name });
      console.log(filelist);
      if (res.data.status === 0) {
        this.$message({
          message: res.data.message,
          type: "success",
        });
      } else if (res.data.status === 250) {
        this.$confirm({
          message: res.data.message,
          type: "wrong",
        });
      } else {
        this.$message({
          message: res.data.message,
          type: "fail",
        });
      }
    },

    moralAudit() {
      this.$router.push({ name: "moralaudit" });
    },
    // 辅导员、班长查看往年综测
    checkOne(year) {
      console.log("year" + year);
      // 如果选择新学年正在进行综测的年份，则不能点击
      if (this.instructor) {
        if (year === this.newYear) {
          if (this.checkNum < 5) {
            this.$message.info("未到辅导员审核阶段，无法查看学生综测记录");
            return;
          } else {
            this.$router.push({
              name: "onemajor",
              query: {
                year: year,
                status: this.stateMapping,
              },
            });
          }
        } else {
          this.$router.push({
            name: "onemajor",
            query: {
              year: year,
              status: "CLOSED",
            },
          });
        }
      } else {
        if (year == this.newYear) {
          if (this.checkNum < 3) {
            this.$message.info("未到班级综测审核，无法查看学生综测记录");
            return;
          } else {
            this.$router.push({
              name: "onemajor",
              query: {
                year: year,
                status: this.stateMapping,
              },
            });
          }
        } else {
          this.$router.push({
            name: "onemajor",
            query: {
              year: year,
              status: "CLOSED",
            },
          });
        }
      }
    },
    // 辅导员：设置开始综测评定
    startComp() {
      this.$router.push({
        name: "startcomp",
      });
    },
    // 辅导员：导入成绩
    importGrades() {
      this.importVisible = true;
    },
    // 辅导员：综测审核
    compVerify() {
      this.$router.push({
        name: "onemajor",
        query: {
          year: "2020-2021",
          status: this.stateMapping,
        },
      });
    },
    // 辅导员：德育分审核
    moralVerify() {
      this.$router.push({
        name: "",
        query: {
          year: "2020-2021",
          status: this.stateMapping,
        },
      });
    },
    // 班长：德育、减分项
    manyEvaluate() {
      this.$router.push({
        name: "comprehensiveevaluate",
        query: { status: this.stateMapping },
      });
    },
    // 班长：班级综测审核
    classVerify() {
      this.$router.push({
        name: "comprehensiveverify",
        query: { status: this.stateMapping },
        params: {
          myclass: true,
        },
      });
    },
    // 班长：班级综测互审
    otherVerify() {
      this.$router.push({
        name: "onemajor",
        query: {
          year: "2020-2021",
          identity: false,
          status: this.stateMapping,
        },
      });
    },
    beforefileupload(file) {
      let Xls = file.name.split(".");
      if (Xls[1] === "xls" || Xls[1] === "xlsx") {
        let fd = new FormData();
        fd.append("file", file);
        let config = { headers: { "Content-Type": "multipart/form-data" } };
        console.log("准备上传");
        this.$axios
          .post("sm/comprehensive/uploadGrade", fd, config)
          .then((res) => {
            console.log("data1" + res.data.message);
            if (res.data.status === 0) {
              this.$message({
                type: "success",
                message: res.data.message,
              });
            }
          })
          .catch((ex) => {
            console.log(ex);
          });
      } else {
        this.$message.error("上传文件只能是 xls/xlsx 格式!");
      }
      return false;
    },
  },
};
</script>
