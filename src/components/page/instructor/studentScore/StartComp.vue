<template>
  <div>
    <!--编辑综测时间-->
    <div v-if="edit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
        <el-breadcrumb-item>开始综测</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="text-align: center;font-size: 26px">开始综测</div>
      <el-form :model="compSet" :rules="compRules" ref="compForm" class="demo-form-inline form">
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">自由申报</el-col>
            <el-col :span="4">
              <el-form-item prop="apply_startD">
                <el-date-picker v-model="compSet.apply_startD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="apply_startT">
                <el-time-picker v-model="compSet.apply_startT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">
              <el-form-item prop="apply_endD">
                <el-date-picker v-model="compSet.apply_endD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="apply_endT">
                <el-time-picker v-model="compSet.apply_endT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">班长审核</el-col>
            <el-col :span="4">
              <el-form-item prop="fir_audit_startD">
                <el-date-picker v-model="compSet.fir_audit_startD"
                                format="yyyy-MM-dd"
                                readonly
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="fir_audit_startT">
                <el-time-picker v-model="compSet.fir_audit_startT"
                                format="HH:mm:ss"
                                readonly
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">
              <el-form-item prop="fir_audit_endD">
                <el-date-picker v-model="compSet.fir_audit_endD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="fir_audit_endT">
                <el-time-picker v-model="compSet.fir_audit_endT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">班级互审</el-col>
            <el-col :span="4">
              <el-form-item prop="sec_audit_startD">
                <el-date-picker v-model="compSet.sec_audit_startD"
                                format="yyyy-MM-dd"
                                readonly
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="sec_audit_startT">
                <el-time-picker v-model="compSet.sec_audit_startT"
                                format="HH:mm:ss"
                                readonly
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">
              <el-form-item prop="sec_audit_endD">
                <el-date-picker v-model="compSet.sec_audit_endD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="sec_audit_endT">
                <el-time-picker v-model="compSet.sec_audit_endT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">辅导员审核</el-col>
            <el-col :span="4">
              <el-form-item prop="thi_audit_startD">
                <el-date-picker v-model="compSet.thi_audit_startD"
                                format="yyyy-MM-dd"
                                readonly
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="thi_audit_startT">
                <el-time-picker v-model="compSet.thi_audit_startT"
                                format="HH:mm:ss"
                                readonly
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">
              <el-form-item prop="thi_audit_endD">
                <el-date-picker v-model="compSet.thi_audit_endD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="thi_audit_endT">
                <el-time-picker v-model="compSet.thi_audit_endT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">公示与确认</el-col>
            <el-col :span="4">
              <el-form-item prop="pub_startD">
                <el-date-picker v-model="compSet.pub_startD"
                                format="yyyy-MM-dd"
                                readonly
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="pub_startT">
                <el-time-picker v-model="compSet.pub_startT"
                                format="HH:mm:ss"
                                readonly
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">
              <el-form-item prop="pub_endD">
                <el-date-picker v-model="compSet.pub_endD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="pub_endT">
                <el-time-picker v-model="compSet.pub_endT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">结束</el-col>
            <el-col :span="4">
              <el-form-item prop="end_timeD">
                <el-date-picker v-model="compSet.end_timeD"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="end_timeT">
                <el-time-picker v-model="compSet.end_timeT"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center">
        <el-col :span="4" :offset="5">
          <el-button type="primary" style="width: 160px" @click="publishComp">发布</el-button>
        </el-col>
        <el-col :span="4" :offset="5">
          <el-button type="primary" style="width: 160px" @click="ret">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="!edit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
        <el-breadcrumb-item>已开始综测</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="text-align: center;font-size: 26px">已开始综测</div>
      <el-form class="demo-form-inline form center">
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">自由申报</el-col>
            <el-col :span="4">{{compSet.apply_startD}}</el-col>
            <el-col :span="4">{{compSet.apply_startT}}</el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">{{compSet.apply_endD}}</el-col>
            <el-col :span="4">{{compSet.apply_endT}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">班长审核</el-col>
            <el-col :span="4">{{compSet.fir_audit_startD}}</el-col>
            <el-col :span="4">{{compSet.fir_audit_startT}}</el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">{{compSet.fir_audit_endD}}</el-col>
            <el-col :span="4">{{compSet.fir_audit_endT}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">班级互审</el-col>
            <el-col :span="4">{{compSet.sec_audit_startD}}</el-col>
            <el-col :span="4">{{compSet.sec_audit_startT}}</el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">{{compSet.sec_audit_endD}}</el-col>
            <el-col :span="4">{{compSet.sec_audit_endT}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">辅导员审核</el-col>
            <el-col :span="4">{{compSet.thi_audit_startD}}</el-col>
            <el-col :span="4">{{compSet.thi_audit_startT}}</el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">{{compSet.thi_audit_endD}}</el-col>
            <el-col :span="4">{{compSet.thi_audit_endT}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">公示与确认</el-col>
            <el-col :span="4">{{compSet.pub_startD}}</el-col>
            <el-col :span="4">{{compSet.pub_startT}}</el-col>
            <el-col :span="1" class="center">至</el-col>
            <el-col :span="4">{{compSet.pub_endD}}</el-col>
            <el-col :span="4">{{compSet.pub_endT}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="3">结束</el-col>
            <el-col :span="4">{{compSet.end_timeD}}</el-col>
            <el-col :span="4">{{compSet.end_timeT}}</el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center">
        <el-col :span="4" :offset="5">
          <el-button type="primary" style="width: 160px" @click="function (){edit=true; id=1}">修改</el-button>
        </el-col>
        <el-col :span="4" :offset="5">
          <el-button type="primary" style="width: 160px" @click="ret">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
  .form {
    margin-top: 20px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .center {
    text-align: center;
  }

  .classSetForm .el-select {
    width: 100%;
  }
</style>

<script>
  export default {
    name: "startcomp",
    data() {
      return {
        id: null,
        year_term: '',
        compSet: {
          apply_startD: "",
          apply_startT: "",
          apply_endD: "",
          apply_endT: "",
          fir_audit_startD: "",
          fir_audit_startT: "",
          fir_audit_endD: "",
          fir_audit_endT: "",
          sec_audit_startD: "",
          sec_audit_startT: "",
          sec_audit_endD: "",
          sec_audit_endT: "",
          thi_audit_startD: "",
          thi_audit_startT: "",
          thi_audit_endD: "",
          thi_audit_endT: "",
          pub_startD: "",
          pub_startT: "",
          pub_endD: "",
          pub_endT: "",
          end_timeD: "",
          end_timeT: ""
        },
        compRules: {
          apply_startD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          apply_startT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          apply_endD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          apply_endT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          fir_audit_startD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          fir_audit_startT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          fir_audit_endD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          fir_audit_endT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          sec_audit_startD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          sec_audit_startT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          sec_audit_endD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          sec_audit_endT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          thi_audit_startD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          thi_audit_startT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          thi_audit_endD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          thi_audit_endT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          pub_startD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          pub_startT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          pub_endD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          pub_endT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          end_timeD: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          end_timeT: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        edit: true,
      }
    },
    watch: {
      //自动设置各种结束时间，自动在上一个开始时间的基础上加一分钟
      'compSet.apply_endD': function (val, oldval) {
        let date = this.parseString(val, this.compSet.apply_endT);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.fir_audit_startD = timeObject.date;
        this.compSet.fir_audit_startT = timeObject.time;
      },
      'compSet.apply_endT': function (val, oldval) {
        let date = this.parseString(this.compSet.apply_endD, val);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.fir_audit_startD = timeObject.date;
        this.compSet.fir_audit_startT = timeObject.time;
      },
      'compSet.fir_audit_endD': function (val, oldval) {
        let date = this.parseString(val, this.compSet.fir_audit_endT);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.sec_audit_startD = timeObject.date;
        this.compSet.sec_audit_startT = timeObject.time;
      },
      'compSet.fir_audit_endT': function (val, oldVal) {
        let date = this.parseString(this.compSet.fir_audit_endD, val);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.sec_audit_startD = timeObject.date;
        this.compSet.sec_audit_startT = timeObject.time;
      },
      'compSet.sec_audit_endD': function (val, oldVal) {
        let date = this.parseString(val, this.compSet.sec_audit_endT);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.thi_audit_startD = timeObject.date;
        this.compSet.thi_audit_startT = timeObject.time;
      },
      'compSet.sec_audit_endT': function (val, oldVal) {
        let date = this.parseString(this.compSet.sec_audit_endD, val);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.thi_audit_startD = timeObject.date;
        this.compSet.thi_audit_startT = timeObject.time;
      },
      'compSet.thi_audit_endD': function (val, oldVal) {
        let date = this.parseString(val, this.compSet.thi_audit_endT);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.pub_startD = timeObject.date;
        this.compSet.pub_startT = timeObject.time;
      },
      'compSet.thi_audit_endT': function (val, oldVal) {
        let date = this.parseString(this.compSet.thi_audit_endD, val);
        let timeMap = date.getTime();
        timeMap += 60000;
        let timeObject = this.timeMapToObject(timeMap);
        this.compSet.pub_startD = timeObject.date;
        this.compSet.pub_startT = timeObject.time;
      }
    },
    created() {
      this.setTime();
    },
    methods: {
      /*将时间戳转换为
        {
        date:YY-MM-DD
        time:HH:MM:SS
        }
        形式的代码
       */
      timeMapToObject(val) {
        let date = new Date(val);
        let Y = date.getFullYear() + '-';
        let M = this.addZero(date.getMonth() + 1) + '-';
        let D = this.addZero(date.getDate());
        let h = this.addZero(date.getHours()) + ':';
        let m = this.addZero(date.getMinutes()) + ':';
        let s = this.addZero(date.getSeconds());
        return {
          date: Y + M + D,
          time: h + m + s
        }
      },
      //用于保持00格式
      addZero(val) {
        return val < 10 ? '0' + val : val;
      },
      //解析时间字符串获得Date对象
      parseString(date, time) {
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
        let ss = 0;
        if (time) {
          hh = parseInt(time.substr(0, 2));
          ff = parseInt(time.substr(3, 2));
          ss = parseInt(time.substr(6.2));
        }
        return new Date(year, month, day, hh, ff, ss);
      },
      setTime() {
        let dict = {};
        let date = new Date();
        let nowYear = date.getFullYear();
        let oldYear = nowYear - 1;
        this.year_term = oldYear + '-' + nowYear;
        this.$axios.post('sm/comprehensive/year', {}).then(
          response => {
            if (response.data.data.indexOf(this.year_term) >= 0) {
              this.$axios.post('sm/comprehensive/timeGet', {year_term: this.year_term}).then(res => {
                if (res.data.data !== null) {
                  this.compSet.apply_startD = res.data.data.applyStart.substr(0, 10);
                  this.compSet.apply_startT = res.data.data.applyStart.substr(11, 8);
                  this.compSet.apply_endD = res.data.data.applyEnd.substr(0, 10);
                  this.compSet.apply_endT = res.data.data.applyEnd.substr(11, 8);
                  this.compSet.fir_audit_startD = res.data.data.firAuditStart.substr(0, 10);
                  this.compSet.fir_audit_startT = res.data.data.firAuditStart.substr(11, 8);
                  this.compSet.fir_audit_endD = res.data.data.firAuditEnd.substr(0, 10);
                  this.compSet.fir_audit_endT = res.data.data.firAuditEnd.substr(11, 8);
                  this.compSet.sec_audit_startD = res.data.data.secAuditStart.substr(0, 10);
                  this.compSet.sec_audit_startT = res.data.data.secAuditStart.substr(11, 8);
                  this.compSet.sec_audit_endD = res.data.data.secAuditEnd.substr(0, 10);
                  this.compSet.sec_audit_endT = res.data.data.secAuditEnd.substr(11, 8);
                  this.compSet.thi_audit_startD = res.data.data.thiAuditStart.substr(0, 10);
                  this.compSet.thi_audit_startT = res.data.data.thiAuditStart.substr(11, 8);
                  this.compSet.thi_audit_endD = res.data.data.thiAuditEnd.substr(0, 10);
                  this.compSet.thi_audit_endT = res.data.data.thiAuditEnd.substr(11, 8);
                  this.compSet.pub_startD = res.data.data.pubStart.substr(0, 10);
                  this.compSet.pub_startT = res.data.data.pubStart.substr(11, 8);
                  this.compSet.pub_endD = res.data.data.pubEnd.substr(0, 10);
                  this.compSet.pub_endT = res.data.data.pubEnd.substr(11, 8);
                  this.compSet.end_timeD = res.data.data.endTime.substr(0, 10);
                  this.compSet.end_timeT = res.data.data.endTime.substr(11, 8);
                  this.id = res.data.data.id;
                  this.edit = false;
                }
              });
            }
          }
        );
      },
      publishComp() {
        this.$refs["compForm"].validate((valid) => {
          this.$confirm('是否发布？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (valid) {
              let dict = {};
              dict.applyStart = this.compSet.apply_startD + " " + this.compSet.apply_startT;
              dict.applyEnd = this.compSet.apply_endD + " " + this.compSet.apply_endT;
              dict.firAuditStart = this.compSet.fir_audit_startD + " " + this.compSet.fir_audit_startT;
              dict.firAuditEnd = this.compSet.fir_audit_endD + " " + this.compSet.fir_audit_endT;
              dict.secAuditStart = this.compSet.sec_audit_startD + " " + this.compSet.sec_audit_startT;
              dict.secAuditEnd = this.compSet.sec_audit_endD + " " + this.compSet.sec_audit_endT;
              dict.thiAuditStart = this.compSet.thi_audit_startD + " " + this.compSet.thi_audit_startT;
              dict.thiAuditEnd = this.compSet.thi_audit_endD + " " + this.compSet.thi_audit_endT;
              dict.pubStart = this.compSet.pub_startD + " " + this.compSet.pub_startT;
              dict.pubEnd = this.compSet.pub_endD + " " + this.compSet.pub_endT;
              dict.endTime = this.compSet.end_timeD + " " + this.compSet.end_timeT;
              dict.id = this.id;
              this.$axios.post('sm/comprehensive/timeSet', dict).then(res => {
                if (res.data.status === 0) {
                  this.id = res.data.data;
                  this.$message.success("发布成功！");
                }
                this.edit = false;
              })
            }
            else {
              console.log("error");
              return false;
            }
            this.setTime()
          }).catch(() => {
            return;
          });
        })
      },
      ret(){
        this.$router.push({
          name:'comprehensive',
          params:{
            manage:true
          }
        })
      }
    }
  }
</script>
