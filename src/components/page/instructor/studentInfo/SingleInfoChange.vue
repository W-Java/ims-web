<template>
  <!--这里写内容-->

  <div style="min-width: 1300px">

    <div class="breadcrumb">
      <span role="link" @click="returnStudent" class="el-breadcrumb__inner">信息总览</span>
      <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
      <span class="breadcrumb__sub">信息修改</span>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改信息</span>
      </div>
      <div>
        <el-form :model="update" ref="update" :rules="updateRules">
          <table id="basic">
            <tr><th>姓名</th><td>{{ student.basic.name }}</td><th>学院</th><td>{{ student.basic.institute }}</td><th>院系</th><td>{{ student.basic.faculty }}</td><th>专业</th><td>{{ student.basic.major }}</td><td colspan="2" rowspan="6"><img class="avatar" :src="student.basic.avatar" alt="照片" /></td></tr>
            <tr><th>班级</th><td>{{ student.basic._class }}</td><th>学号</th><td>{{ student.basic.number }}</td><th>性别</th><td>{{ student.basic.sex }}</td><th>民族</th><td>{{ student.basic.nationality }}</td></tr>
            <tr><th>寝室楼</th><td><el-form-item prop="building"><el-input v-model="update.building"/></el-form-item></td><th>寝室</th><td><el-form-item prop="dorm"><el-input v-model="update.dorm"/></el-form-item></td><th>电话</th><td><el-form-item prop="tel"><el-input v-model="update.tel"/></el-form-item></td><th>政治面貌</th><td><el-form-item prop="politicalStatus"><el-select v-model="update.politicalStatus"><el-option label="共青团员" value="共青团员"></el-option><el-option label="中共党员" value="中共党员"></el-option><el-option label="群众" value="群众"></el-option></el-select></el-form-item></td></tr>
            <tr><th>身份证号</th><td>{{ student.basic.idNumber }}</td><th>QQ号码</th><td>{{ student.basic.qq }}</td><th>家庭住址</th><td>{{ student.basic.address }}</td><th>籍贯</th><td>{{ student.basic.hometown }}</td></tr>
            <tr><th>父亲姓名</th><td>{{ student.basic.fatherName }}</td><th>父亲电话</th><td>{{ student.basic.fatherTel }}</td><th>母亲姓名</th><td>{{ student.basic.motherName }}</td><th>母亲电话</th><td>{{ student.basic.motherTel }}</td></tr>
            <tr>
              <th>班级职务</th>
              <td>{{student.basic.classPosition}}</td>
              <th>留言</th>
              <td colspan="5">
                <el-form-item prop="note">
                  <el-input v-model="update.note"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </el-card>
    <div style="width: 100%">
      <div slot="footer" class="dialog_footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  @import "~theme/theme.scss";
  .box-card{
    margin-top: 10px;
  }
  #basic {
    border-collapse:collapse;
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    th{
      text-align: center;
      color:#909399;
      font-weight:500;
    }
    td{
      padding-left: 6px;
      font-size:14px;
      color:#606266;
    }
    th,td {
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
  .dialog_footer{
    margin-top: 20px;
    float: right;
  }
  .breadcrumb{
      font-size: 14px;
    }
    .breadcrumb__sub{
      color:#606266
    }
</style>

<script>

  export default {
    data() {
        return {
          student: {
            basic:{}
          },
          update:{
            building:'',
            dorm:'',
            tel:'',
            politicalStatus:'',
            note:''
          },
          updateRules: {
            building:[
              { required: true, message: '请输入宿舍楼栋', trigger: 'blur'}
            ],
            dorm:[
              { required: true, message: '请输入寝室号', trigger: 'blur'}
            ],
            tel:[
              { required: true,pattern:/^1[345789]\d{9}$/, message: '请输入中国国内的手机号码'}
            ],
            address:[
              { required: true, message: '请输入家庭地址', trigger: 'blur'}
            ]
          },
          temp: {
            memberSwitch: "",
            major: "",
            class: "",
            sex: "",
            nationality: "",
            hometown: "",
            page:"",
            size:""
          }
        }
      },
    created() {
        this.temp.memberSwitch = this.$route.params.memberSwitch;
        this.temp.major = this.$route.params.major;
        this.temp.class = this.$route.params.class;
        this.temp.sex = this.$route.params.sex;
        this.temp.nationality = this.$route.params.nationality;
        this.temp.hometown = this.$route.params.hometown;
        this.temp.page= this.$route.params.page;
        this.temp.size = this.$route.params.size

        this.$axios.post('/sm/singleinfo', {selectedStudent: this.$route.query.student}).then(
          response => {
            if(response.data.status === 0)
              this.student = response.data.data.student;
              this.update.building = response.data.data.student.basic.building;
              console.log(this.update.building);
              this.update.dorm = response.data.data.student.basic.dorm;
              this.update.tel = response.data.data.student.basic.tel;
              this.update.politicalStatus = response.data.data.student.basic.politicalStatus;
              this.update.note = response.data.data.student.basic.note;
          }
        )
      },
    methods: {
      // 修改学生信息
      updateUser() {
        this.$refs["update"].validate((valid) => {
          if (valid) {
            this.$axios.post('/sm/updateInfo',{selectedStudent: this.student.basic.number, data: this.update}).then(
              response => {
                if(response.data.status === 0){
                  this.$message.success(response.data.message)
                  this.returnStudent();
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
      returnStudent(){
        this.$router.push(
          {
            name: 'studentinfo',
            params: {
              memberSwitch: this.temp.memberSwitch,
              major: this.temp.major,
              class: this.temp.class,
              sex: this.temp.sex,
              nationality: this.temp.nationality,
              hometown: this.temp.hometown,
              page:this.temp.page,
              size:this.temp.size
            }
          }
        );
      }
    }
  }
</script>
