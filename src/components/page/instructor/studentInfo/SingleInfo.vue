<template>
  <div style="min-width: 1300px">
    <div class="breadcrumb">
      <span role="link" @click="returnStudentInfo" class="el-breadcrumb__inner">信息总览</span>
      <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
      <span class="breadcrumb__sub">信息详情</span>
    </div>

    <!--<span role="link" class="el-breadcrumb__inner">信息详情</span>-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <table id="basic" style="width: 100%">
          <tr><th>姓名</th><td>{{ student.basic.name }}</td><th>学院</th><td>{{ student.basic.institute }}</td><th>院系</th><td>{{ student.basic.faculty }}</td><th>专业</th><td>{{ student.basic.major }}</td><td colspan="2" rowspan="6"><img class="avatar" :src="student.basic.avatar" alt="照片" /></td></tr>
          <tr><th>班级</th><td>{{ student.basic._class }}</td><th>学号</th><td>{{ student.basic.number }}</td><th>性别</th><td>{{ student.basic.sex }}</td><th>民族</th><td>{{ student.basic.nationality }}</td></tr>
          <tr><th>寝室楼</th><td>{{ student.basic.building }}</td><th>寝室</th><td>{{ student.basic.dorm }}</td><th>电话</th><td>{{ student.basic.tel }}</td><th>籍贯</th><td>{{ student.basic.hometown }}</td></tr>
          <tr><th>身份证号</th><td>{{ student.basic.idNumber }}</td><th>QQ号码</th><td>{{ student.basic.qq }}</td><th>家庭住址</th><td>{{ student.basic.address }}</td><th>政治面貌</th><td>{{ student.basic.politicalStatus }}</td></tr>
          <tr><th>班级职务</th><td>{{ student.basic.classPosition }}</td><th>留言</th><td colspan="5">{{ student.basic.note }}</td></tr>
          <tr><th>父亲姓名</th><td>{{ student.basic.fatherName }}</td><th>父亲电话</th><td>{{ student.basic.fatherTel }}</td><th>母亲姓名</th><td>{{ student.basic.motherName }}</td><th>母亲电话</th><td>{{ student.basic.motherTel }}</td></tr>
        </table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>学习成绩</span>
      </div>
      <div>
        <el-table :data="student.grade">
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="cmpGrade" label="综测成绩"></el-table-column>
          <el-table-column prop="cmpRank" label="综测排名"></el-table-column>
          <el-table-column prop="moralGrade" label="德育成绩"></el-table-column>
          <el-table-column prop="weightedGrade" label="加权成绩"></el-table-column>
          <el-table-column prop="weightedRank" label="加权排名"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>课外研学</span>
      </div>
      <div>
        <el-table :data="student.extracurricular">
          <el-table-column label="记录时间">
            <template slot-scope="scope">{{scope.row.time.substr(0,10)}}</template>
          </el-table-column>
          <el-table-column prop="title" label="名称"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>奖励情况</span>
      </div>
      <div>
        <el-table :data="student.award">
          <el-table-column prop="time" label="奖励时间"></el-table-column>
          <el-table-column prop="title" label="奖项名称"></el-table-column>
          <el-table-column prop="institution" label="颁发机构"></el-table-column>
          <el-table-column prop="level" label="奖项等级"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>处分情况</span>
      </div>
      <div>
        <el-table :data="student.punishment">
          <el-table-column prop="time" label="处分日期"></el-table-column>
          <el-table-column prop="title" label="处分名称"></el-table-column>
          <el-table-column prop="institution" label="处分单位"></el-table-column>
          <el-table-column prop="reason" label="处分原因"></el-table-column>
        </el-table>
      </div>
    </el-card>
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
    name: 'singleinfo',
    data() {
      return {
        student: {
          basic: {},
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
      this.temp.page = this.$route.params.page;
      this.temp.size = this.$route.params.size

      this.$axios.post('/sm/singleinfo', {selectedStudent: this.$route.query.number}).then(
        response => {
          if (response.data.status === 0)
            this.student = response.data.data.student;
        }
      )
    },
    methods: {
      returnStudentInfo(){
        // this.$router.push(
        //   {
        //     name: 'studentinfo',
        //     params: {selectedClass: "1601", selectedMajor: "计算机科学"}
        //   }
        // )

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
