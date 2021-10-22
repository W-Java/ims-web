<template>
  <div class="wrap" v-if="!instructor">
    <div class="content">
      <el-form :model="info" label-position="left" label-width="5em">
        <el-form-item label="新密码">
          <el-input type="password" v-model="info.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="寝室楼栋">
          <el-input v-model="info.building"></el-input>
        </el-form-item>
        <el-form-item label="寝室号">
          <el-input v-model="info.room"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="info.phone"></el-input>
        </el-form-item>
        <el-form-item label="QQ号">
          <el-input v-model="info.qq"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-input v-model="info.politicalStatus"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="info.position"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form>
    </div>
  </div>
  <div style="min-width: 1300px" v-else>

    <div class="breadcrumb">
      <span role="link" @click="returnMainPage" style="cursor: pointer" class="el-breadcrumb__inner">主页</span>
      <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
      <span class="breadcrumb__sub">个人信息</span>
    </div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <div>
        <el-form :model="update" ref="update" :rules="updateRules">
          <table id="basic" style="width: 100%">
            <tr>
              <th>姓名</th>
              <td>{{ student.basic.name }}</td>
              <th>学院</th>
              <td>{{ student.basic.institute }}</td>
              <th>专业</th>
              <td>{{ student.basic.major }}</td>
              <th>班级职务</th>
              <td>
                <span v-if="student.basic.classPosition===''">暂无职位</span>
                <span v-else>{{student.basic.classPosition}}</span>
              </td>
              <td colspan="2" rowspan="6"><img class="avatar" :src="student.basic.avatar" v-if="student.basic.avatar" alt="照片"/></td>
            </tr>
            <tr>
              <th>班级</th>
              <td>{{ student.basic._class }}</td>
              <th>学号</th>
              <td>{{ student.basic.number }}</td>
              <th>性别</th>
              <td>{{ student.basic.sex }}</td>
              <th>民族</th>
              <td>{{ student.basic.nationality }}</td>
            </tr>
            <tr>
              <th>寝室楼</th>
              <td><el-form-item prop="building"><el-input :disabled="!modifyVisible" v-model="update.building"></el-input></el-form-item></td>

              <th>寝室</th>
              <td>
                <el-form-item prop="dorm">
                  <el-input :disabled="!modifyVisible" v-model="update.dorm"></el-input>
                </el-form-item>
              </td>

              <th>电话</th>
              <td>
                <el-form-item prop="tel">
                  <el-input :disabled="!modifyVisible" v-model="update.tel"></el-input>
                </el-form-item>
              </td>

              <th>籍贯</th>
              <td>{{ student.basic.hometown }}</td>
            </tr>
            <!--<tr>-->
              <!--<th>身份证号</th>-->
              <!--<td>{{ student.basic.idNumber }}</td>-->
              <!--<th>QQ号码</th>-->
              <!--<td>{{ student.basic.qq }}</td>-->
              <!--<th>家庭住址</th>-->
              <!--<td>{{ student.basic.address }}</td>-->
              <!--<th>政治面貌</th>-->
              <!--<td>{{ student.basic.politicalStatus }}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<th>父亲姓名</th>-->
              <!--<td>{{ student.basic.fatherName }}</td>-->
              <!--<th>父亲电话</th>-->
              <!--<td>{{ student.basic.fatherTel }}</td>-->
              <!--<th>母亲姓名</th>-->
              <!--<td>{{ student.basic.motherName }}</td>-->
              <!--<th>母亲电话</th>-->
              <!--<td>{{ student.basic.motherTel }}</td>-->
            <!--</tr>-->
            <tr>
              <th>辅导员留言</th>
              <td colspan="12" rowspan="3">{{ student.basic.note }}</td>
            </tr>
          </table>
        </el-form>
      </div>

      <div style="text-align:center">
        <el-button type="primary" size="small" @click="handleModify">修改个人信息</el-button>
        <el-button type="primary" @click="handleSubmit" size="small" :disabled="!modifyVisible" >提交</el-button>
      </div>

      <el-dialog title="提交确认" width="50%" :visible.sync="updateDialogVisible">
        <div style="text-align:center">确认提交本次编辑的全部信息?</div><br><br>
        <div style="text-align:center">
          <el-button @click="handleUpdate" type="primary" size="small">确认</el-button>
          <el-button @click="handleSubmit" type="primary" size="small">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
  @import "~theme/theme.scss";

  .box-card {
    margin-top: 10px;
  }

  #basic {
    border-collapse: collapse;
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    th {
      text-align: center;
      color: #909399;
      font-weight: 400;
    }
    td {
      padding-left: 6px;
      font-size: 14px;
      color: #606266;
    }
    th, td {
      border: 1px solid #ebeef5;
    }
  }

  table {
    width: 100%;
    text-align: left;
    line-height: $--font-size-base*3;
    caption {
      text-align: left;
      font-size: $--font-size-large;
    }
    .avatar {
      max-height: $--font-size-base*18;
    }
    .pic{
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .breadcrumb{
    font-size: 14px;
  }
  .breadcrumb__sub{
    color:#606266
  }
  .shade {
    position: absolute;
    display: inline-table;
    background-color: #ffffff;
    opacity: 0.3;
    width: 100%;
    height: 100%;
  }

  .spinner {
    width: 80px;
    height: 80px;
    background-color: #fb7299;
    position: absolute;
    border-radius: 100%;
    -webkit-animation: scaleout 1.0s infinite ease-in-out;
    animation: scaleout 1.0s infinite ease-in-out;
  }

  @-webkit-keyframes scaleout {
    0% {
      -webkit-transform: scale(0.0)
    }
    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }

  @keyframes scaleout {
    0% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    }
    100% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }
</style>

<script>
  export default {
    name: 'user',
    data() {
      return {
        info: {},
        student: {
          basic: {},
        },
        update: {
          building: '',
          dorm: '',
          tel: '',
          politicalStatus: '',
          note: ''
        },
        updateRules: {
          building: [
            {required: true, message: '请输入宿舍楼栋', trigger: 'blur'}
          ],
          dorm: [
            {required: true, message: '请输入寝室号', trigger: 'blur'}
          ],
          tel: [
            {required: true, pattern: /^1[345789]\d{9}$/, message: '请输入中国国内的手机号码'}
          ],
          address: [
            {required: true, message: '请输入家庭地址', trigger: 'blur'}
          ]
        },
        instructor: false,
        modifyVisible: false,
        updateDialogVisible:false
      } ;
    },
    created() {
      //获得基本选项
      if (JSON.parse(sessionStorage.getItem('user')).roles.indexOf('学生') >= 0) {
        this.instructor = true;
        console.log(JSON.parse(sessionStorage.getItem('user')).IDNumber);
        this.$axios.post('/sm/singleinfo', {selectedStudent: JSON.parse(sessionStorage.getItem('user')).IDNumber}).then(
          response => {
            if (response.data.status === 0)
              this.student = response.data.data.student;
              this.update.building=response.data.data.student.basic.building;
              this.update.dorm=response.data.data.student.basic.dorm;
              this.update.tel=response.data.data.student.basic.tel;
          }
        )

      }
    },
    methods: {

      handleUpdate() {
        this.$refs["update"].validate((valid) => {
          if (valid) {
            this.$axios.post('/sm/updateInfo', {selectedStudent: this.student.basic.number, data: this.update}).then(
              response => {
                if (response.data.status === 0) {
                  this.$message.success(response.data.message);
                  this.updateDialogVisible=false;
                }
                else {
                  this.$message.error(response.data.message)
                }
              }
            )
          }
          else {
            this.$message.error('存在输入校验错误!');
            return false;
          }
        });
      },
      submit() {
        this.$prompt('请输入当前密码', {
          inputType: 'password'
        }).then(password => {
          console.log(this.info);
        })
      },
      handleModify() {
        if (this.modifyVisible === false) {
          this.modifyVisible = true;
        }else
          this.modifyVisible=false;
      },
      handleSubmit(){
        if(this.updateDialogVisible===false){
          this.updateDialogVisible=true;
        }else{
          this.updateDialogVisible=false;
          this.modifyVisible = false;
        }
      },
      returnMainPage(){
        this.$router.push(
          {
            name: 'index',
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .wrap {
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 30em;
  }
</style>
