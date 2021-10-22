<template>
  <div>
    <el-tabs tab-position="left" @tab-click="handleTabClick">
      <el-tab-pane label="请假申请">
        <el-form :model="leaveData" ref="data" :rules="inputRules">
          <el-form-item label="本人联系方式" prop="phone">
            <br>
            <el-col :span="10">
              <el-input placeholder="请输入联系方式" v-model="leaveData.phone"></el-input>
            </el-col>
          </el-form-item>

          <!--<el-form-item>-->
          <!--<el-row :gutter="20">-->
          <!--<el-col :span="10">紧急联系人姓名</el-col>-->
          <!--<el-col :span="10">紧急联系方式</el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20">-->
          <!--<el-col :span="10">-->
          <!--<el-input placeholder="请输入紧急联系人姓名" v-model="leaveData.emergencyPerson"></el-input>-->
          <!--</el-col>-->
          <!--<el-col :span="10">-->
          <!--<el-input placeholder="请输入紧急联系人方式" v-model="leaveData.emergencyContact"></el-input>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!--</el-form-item>-->
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="紧急联系人姓名" prop="emergencyPerson">
                <el-input placeholder="请输入紧急联系人姓名" v-model="leaveData.emergencyPerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="this.leaveData.emergencyPerson !== ''">
              <el-form-item label="紧急联系方式" prop="emergencyContact">
                <el-input placeholder="请输入紧急联系人方式" v-model="leaveData.emergencyContact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="address" label="外出地址">
            <br>
            <el-row :gutter="20">
              <el-col :span="20">
                <el-input placeholder="请输入外出地址" v-model="leaveData.address"></el-input>
              </el-col>
            </el-row>
          </el-form-item>


          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="leaveDate" label="离校时间">
                <br>
                <el-row>
                  <el-col :span="12">
                    <div class="block" style="margin-bottom: 22px">
                      <el-date-picker
                        v-model="leaveData.leaveDate"
                        :picker-options="leaveDatePickerOptions"
                        @change="leaveDataChange"
                        type="date"
                        format="yyyy.MM.dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择离校日期">
                      </el-date-picker>
                    </div>
                  </el-col>

                  <el-col :span="12">
                    <div class="block" style="margin-bottom: 22px">
                      <el-time-select
                        v-model="leaveData.leaveTime"
                        :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00'
                      }"
                        placeholder="选择离校时间">
                      </el-time-select>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="returnDate" label="回校时间">
                <br>
                <el-row>
                  <el-col :span="12">
                    <div class="block" style="margin-bottom: 22px">
                      <el-date-picker
                        v-model="leaveData.returnDate"
                        :picker-options="returnDatePickerOptions"
                        @change="returnDataChange"
                        type="date"
                        format="yyyy.MM.dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择回校日期">
                      </el-date-picker>
                    </div>
                  </el-col>

                  <el-col :span="12">
                    <div class="block" style="margin-bottom: 22px">
                      <el-time-select
                        v-model="leaveData.returnTime"
                        :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00'
                      }"
                        placeholder="选择回校时间">
                      </el-time-select>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <br>

          <el-form-item prop="reason" label="请假事由">
            <br>
            <el-row :gutter="20">
              <el-col :span="22">
                <el-input placeholder="请输入请假事由" prop="reason" type="textarea" v-model="leaveData.reason"
                          :autosize="{minRows:5}"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <br>

          <div style="text-align:center">
            <el-button type="primary" center="true" ref="submitButton" @click="submitRequest"
                       :disabled="submitDisabled">提交<i
              class="el-icon-upload2 el-icon--right"></i></el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="申请记录">
        <el-table :data="recordTableData" id="recordTable" key="recordTable" header-align="center" stripe
                  style="width: 100%">
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="address" label="外出地址"></el-table-column>
          <el-table-column prop="emergencyPerson" label="紧急联系人"></el-table-column>
          <el-table-column prop="emergencyContact" label="紧急联系方式"></el-table-column>
          <el-table-column prop="leaveTime" label="离校时间"></el-table-column>
          <el-table-column prop="returnTime" label="返校时间"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <el-table-column prop="submitTime" label="提交时间"></el-table-column>
          <el-table-column prop="state" label="审核状态"></el-table-column>
          <el-table-column prop="note" label="下载/理由">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state!=='驳回'" type="success" @click="downloadRequest(scope.row)"
                         :disabled="scope.row.downloadable">假条下载<i
                class="el-icon-download2 el-icon--right"></i></el-button>
              <div v-else>
                {{scope.row.note}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>

</style>

<script>
  var saveNote;
  var saveArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
      var blob = new Blob(data, {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.click();
      // window.URL.revokeObjectURL(url);
    };
  }());

  var today = new Date();
  var gLeaveDate, gReturnDate;
  export default {
    name: 'leavemanage',
    data() {
      return {
        // todo 设置离开日期now，返回日期9999年   离开时间00:00， 返回时间23：:59
        returnDatePickerOptions: {
          // disabledDate(time) {
          //   return (time.getTime() < Date.now() - 8.64e7 || time.getTime() < gLeaveDate - 8.64e7);
          // }
        },
        leaveDatePickerOptions: {
          // disabledDate(time) {
          //   return (time.getTime() < Date.now() - 8.64e7 || time.getTime() > gReturnDate);
          // }
        },
        leaveData: {
          stuName: "",
          stuId: "",
          stuClass: "",
          phone: "",
          emergencyPerson: "",
          emergencyContact: "",
          address: "",
          leaveTime: today.getHours() + ':00',
          leaveDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
          returnDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1),
          returnTime: "12:00",
          reason: "",
          submitTime: "",
        },
        inputRules: {
          phone: [
            {required: true, pattern: /^1[345789]\d{9}$/, message: '请输入中国国内的手机号码', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          emergencyContact: [
            {required: true, pattern: /^1[345789]\d{9}$/, message: '请输入中国国内的手机号码', trigger: 'blur'}
          ],
          leaveDate: [
            {required: true, message: '请选择离校日期', trigger: 'blur'}
          ],
          // leaveTime: [
          //   {required: true, message: '请选择离校时间', trigger: 'blur'}
          // ],
          returnDate: [
            {required: true, message: '请选择回校日期', trigger: 'blur'}
          ],
          // returnTime: [
          //   {required: true, message: '请选择回校时间', trigger: 'blur'}
          // ],
          reason: [
            {required: true, message: '请输入申请理由', trigger: 'blur'}
          ]
        },
        clickable: false,
        currentPage: 1,
        pageSize: 20,
        recordQuantity: 0,
        selectedTab: '',
      };
    },
    created() {
      let date = this.leaveData.leaveDate.split('-');
      // console.log(date);
      gLeaveDate = new Date().setFullYear(date[0], date[1] - 1, date[2]);
      date = this.leaveData.returnDate.split('-');
      gReturnDate = new Date().setFullYear(date[0], date[1] - 1, date[2]);
      console.log('created gleavedate: ' + gLeaveDate);
      console.log('created greturndate: ' + gReturnDate);
      // this.leaveData.leaveDate = Date.now();
      // console.log(new Date().getMonth());
      // today = new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDay());
    },
    asyncComputed: {
      recordTableData() {
        let dict = {};
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        if (this.selectedTab === '申请记录')
          return this.$axios.post('/sm/showLeaveInfo', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            // console.log("length: "+res.data.data.data.length);
            for (let i = 0; i < res.data.data.data.length; i++) {
              // console.log('loop '+i);
              let returnTime = res.data.data.data[i].returnTime;
              if (returnTime !== null || returnTime.length === 19) {
                let returnDate = returnTime.split(' ')[0].split('-');
                let dueYear = parseInt(returnDate[0]);
                let dueMonth = parseInt(returnDate[1]);
                let dueDay = parseInt(returnDate[2]);
                let today = new Date(), dueDate = new Date().setFullYear(dueYear, dueMonth, dueDay);
                console.log('************state: ' + res.data.data.data[i].state);
                res.data.data.data[i].downloadable = !(res.data.data.data[i].state === 'SECONPASS' && today <= dueDate + 3); // 放假结束三天内仍可下载pdf
                // console.log('record ' + i + ' : ' + res.data.data.data[i].downloadable);
              }
              else {
                res.data.data.data[i].downloadable = !(false);
                // console.log('disable!');
              }
            }
            for (let i = 0; i < res.data.data.data.length; i++) {
              if (res.data.data.data[i].state === 'SECONPASS') {
                res.data.data.data[i].state = '辅导员通过';
              } else if (res.data.data.data[i].state === 'FIRSTPASS') {
                res.data.data.data[i].state = '班长通过';
              } else if (res.data.data.data[i].state === 'UNCHECKED') {
                res.data.data.data[i].state = '未审核';
              } else if (res.data.data.data[i].state === 'FAILED') {
                res.data.data.data[i].state = '驳回';
              }
            }
            console.log(res.data.data.data);
            return res.data.data.data;
          }).catch(ex => {
            console.log(ex);
          });
      },
      submitDisabled() {
        if (this.leaveData.leaveDate == null || this.leaveData.returnDate == null) {
          return true;
        }
        // 获得日期字符串
        let strLeaveDate = this.leaveData.leaveDate.split(' ')[0],
          strReturnDate = this.leaveData.returnDate.split(' ')[0];
        // 实例化Date对象
        let dateLeaveDate = new Date(strLeaveDate),
          dateReturnDate = new Date(strReturnDate);
        let dateReturnDateMax = new Date(dateLeaveDate);
        // 设置最晚回校时间
        dateReturnDateMax.setDate(dateLeaveDate.getDate() + 15);
        // 判断回校时间是否合规
        let submitOK = dateReturnDate <= dateReturnDateMax && dateLeaveDate <= dateReturnDate;
        if (dateReturnDate > dateReturnDateMax)
          this.$message({
            type: 'info',
            message: '回校日期不得晚于 ' + dateReturnDateMax.toLocaleDateString() + '（请假时间最长十五日）'
          });
        // 判断紧急联系方式是否正确填写
        // 如果无紧急联系人，直接认为紧急联系方式正确
        // 如果有紧急联系人，紧急联系方式必须为合理的电话号码
        let emergencyContactOK = this.leaveData.emergencyPerson === '' ?
          true : this.checkPhoneNumberSyntax(this.leaveData.emergencyContact);
        return !(submitOK
          && this.leaveData.phone !== ''
          && this.leaveData.address !== ''
          && this.leaveData.reason !== ''
          && emergencyContactOK);
      }
    },
    methods: {
      /**
       * 检查输入的手机号码是中国大陆手机号码
       * @param phoneNumber 手机号码
       * @returns {boolean} 号码是否是大陆号码
       */
      checkPhoneNumberSyntax(phoneNumber) {
        let phonePattern = /^1[345789]\d{9}$/;
        let n = phoneNumber.search(phonePattern);
        return n === 0;
      },
      leaveDataChange(val) {
        if (val !== '' && val !== null) {
          let date = val.split('-');
          gLeaveDate = new Date().setFullYear(date[0], date[1] - 1, date[2]);
          console.log('@change leavedate: ' + gLeaveDate);
        }
      },
      returnDataChange(val) {
        if (val !== '' && val !== null) {
          let date = val.split('-');
          gReturnDate = new Date().setFullYear(date[0], date[1] - 1, date[2]);
          console.log('@change returndate: ' + gReturnDate);
        }
      },
      handleTabClick(evt) {
        this.selectedTab = evt.label;
      },
      submitRequest() {
        // 点击即禁用按钮，若请求失败，会再次启用
        this.$refs.submitButton.disabled = true;
        let dict = {};
        // dict.name=
        dict.phone = this.leaveData.phone;
        // if (dict.emergencyPerson !== '')
        //   this.leaveData.emergencyContact = '';  // 如果不填紧急联系人，则不发送紧急联系方式
        dict.emergencyPerson = this.leaveData.emergencyPerson;
        dict.emergencyContact = this.leaveData.emergencyContact;
        dict.address = this.leaveData.address;
        dict.leaveTime = this.leaveData.leaveDate + " " + this.leaveData.leaveTime + ":00";
        dict.returnTime = this.leaveData.returnDate + " " + this.leaveData.returnTime + ":00";
        dict.reason = this.leaveData.reason;
        this.$axios.post('/sm/addLeaveInfo', dict).then(
          response => {
            if (response.data.status === 0) {
              this.$message.success({
                type: 'success',
                message: '操作成功'
              });
              this.cleanSubmit();
            }
          }).catch(() => {
          this.$refs.submitButton.disabled = false;
          this.$message.error({
            type: 'error',
            message: '操作失败'
          });
        })
      },
      cleanSubmit() {
        this.leaveData.phone = '';
        this.leaveData.emergencyPerson = '';
        this.leaveData.emergencyContact = '';
        this.leaveData.address = '';
        this.leaveData.leaveDate = '';
        this.leaveData.leaveTime = '';
        this.leaveData.returnDate = '';
        this.leaveData.returnTime = '';
        this.leaveData.reason = '';
      },
      downloadRequest(row) {
        this.$axios.post('/sm/downloadLeaveNote/' + row.id, {}, {responseType: 'blob'}).then(res => {
          saveNote = res.data;
          console.log(res.headers['content-disposition']);
          saveArray([saveNote], '请假条' + res.headers['content-disposition'] + '.pdf');
        })
      },
      // handleSubmit(){
      //   if(){
      //     this.clickable=true;
      //   }
      // }
    }
  }
</script>
