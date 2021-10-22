<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
        <el-breadcrumb-item>综测审核</el-breadcrumb-item>
      </el-breadcrumb>

      <p style="font-size: 12px; color: #c0c4cc;">
        *提示：在班长审核阶段内班长可随时修改本班综测审核结果，班长审核阶段过后本班综测结果将提交给互审班长和辅导员。若有加分项被互审班长或辅导员驳回，您需要在此页面进行修改。
      </p><br>

      <el-row>
        <el-col :span="4">
          <el-input v-model="selectedPerson" @change="handleNumberInput" placeholder="请输入姓名或学号"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0" v-if="checkMapping==='FIRSTCHECKING'">
        <el-col :span="12">
          <el-button type="success" size="small" @click="multiPass">批量通过</el-button>
          <el-button type="danger" size="small" @click="notPassMulti">批量不通过</el-button>
        </el-col>
      </el-row>
      <el-table :data="verifyData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn" @selection-change="handleSelectionChange">
        <el-table-column type="selection" v-if="checkMapping==='FIRSTCHECKING'" width="55"></el-table-column>
        <el-table-column width="80" v-if="checkMapping!=='FIRSTCHECKING'">
          <template slot-scope="scope">
            <span class="daishenhe">{{scope.row.stateName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="100"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
        <el-table-column label="学号" width="100"><template slot-scope="scope">{{scope.row.number}}</template></el-table-column>
        <el-table-column label="加分类别" width="200" prop="score_kind"></el-table-column>
        <el-table-column label="加分明细">
          <template slot-scope="scope">
            <span v-if="scope.row.contest_kind!==null">{{scope.row.contest_kind}}</span>
            <span v-if="scope.row.contest_level!==null">{{scope.row.contest_level}}</span>
            <span v-if="scope.row.grade_level!==null">{{scope.row.grade_level}}</span>
            {{scope.row.score_name}}
          </template>
        </el-table-column>
        <el-table-column width="100" label="分值">
          <template slot-scope="scope">
            <el-input v-if="scope.row.score_kind==='减分项'" :disabled="!scope.row.edit" max="0" type="number" step="0.1"
                      v-model="scope.row.score"/>
            <el-input v-else :disabled="!scope.row.edit" min="0" max="3" type="number" step="0.1"
                      v-model="scope.row.score"/>
          </template>
        </el-table-column>
        <el-table-column width="200" label="加分证明">
          <template slot-scope="scope">
            <span v-if="scope.row.image_id===null">暂无证明</span>
            <img v-else class="scoreImg" @click="checkPic(scope.row.image_id)" v-bind:src="scope.row.image_id"/>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <div v-if="checkMapping==='FIRSTCHECKING'||scope.row.state==='UNCHECKED'||scope.row.state==='modified'">
              <el-radio-group v-if="!scope.row.edit&&checkMapping==='FIRSTCHECKING'" v-model="scope.row.state"
                              size="small">
                <el-radio-button @click.native="passOne(scope.row)" label="FIRSTPASS">通过</el-radio-button>
                <el-radio-button @click.native="notPassOne(scope.row)" label="FAILED">不通过</el-radio-button>
              </el-radio-group>

              <el-button v-if="!scope.row.edit&&checkMapping!=='FIRSTCHECKING'" type="success" size="small"
                         @click="passOne(scope.row)">通过
              </el-button>
              <el-button v-if="!scope.row.edit&&checkMapping!=='FIRSTCHECKING'" type="danger" size="small"
                         @click="notPassOne(scope.row)">不通过
              </el-button>
              <el-button v-if="scope.row.edit" type="success" size="small" @click="changeOne(scope.row)">保存并通过</el-button>
              <el-button v-if="scope.row.edit" type="info" size="small" @click="cancleChange()">取消</el-button>
              <el-button v-if="!scope.row.edit" type="warning" size="small" @click="changeVisible(scope.row)">修改</el-button>
              <span v-if="scope.row.state==='UNCHECKED'&&checkMapping!=='FIRSTCHECKING'"
                    class="reason">&nbsp;&nbsp;&nbsp;驳回理由：{{scope.row.reason}}</span>
            </div>
            <div v-if="checkMapping!=='FIRSTCHECKING'&&scope.row.state!=='UNCHECKED'&&scope.row.state!=='modified'">
              <span class="daishenhe">{{scope.row.checkName}}<span v-if="scope.row.state==='UNCHECKED'" class="reason">&nbsp;&nbsp;&nbsp;驳回理由：{{scope.row.reason}}</span></span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12" :offset="12">
          <div class="block">
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
      <el-button style="width: 120px;float: right;margin-top: 20px" type="primary" @click="ret">返回</el-button>
      <el-dialog
        title="查看证明"
        :visible.sync="checkBig"
        width="50%">
        <img class="bigPic" v-bind:src="checkPicId">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkBig = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 20px;
  }
  .block{
    float: right;
  }
  .clearfix{
    clear: both;
  }
  /*.el-button{*/
    /*width: 100%;*/
  /*}*/
  .scoreImg{
    width: 150px;
    height: 100px;
  }
  .bigPic{
    width: 100%;
  }
  .reason{
    font-weight: bold;
  }

  .daishenhe {
    color: #ff6224;
  }
</style>

<script>
    export default {
      name: "comprehensiveverify",
      data(){
        return{
          stripeOn: true,
          whileLoading: false,
          pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
          currentPage: 1,     // 当前页码
          recordQuantity: 0, // 总数据量
          verifyData:[],
          selectedPerson:"",
          checkBig:false,
          checkPicId:"",
          selected:[],
          checkMapping:""  //此时的审核阶段(区别于每条记录的stateMapping)
        }
      },
      created(){
        this.checkMapping = this.$route.query.status;
        console.log(this.checkMapping);
        this.sendQuery()
      },
      methods:{
        handleSelectionChange(val){
          this.selected=val;
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.sendQuery();
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.sendQuery();
        },

        checkPic(img){
          this.checkPicId=img;
          this.checkBig=true
        },
        // 学号或姓名搜索
        handleNumberInput(){
          this.sendQuery();
        },

        // 单条记录处理
        passOne(student){
          if (this.checkMapping === "FIRSTCHECKING") {
            if (student.state !== "FIRSTPASS") {
              let dict = {};
              dict.state = "FIRSTPASS";
              dict.ids = [].concat(student.id);
              this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
                if (response.data.status === 0) {
                  this.$message.success('通过成功！');
                  student.stateName = "";
                  student.state = 'FIRSTPASS';
                }
                else {
                  this.$message.error('通过失败！')
                }
              })
            }
          }
          else {
            this.$confirm('是否确认通过此条记录', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let dict = {};
              if (this.checkMapping === "SECONDCHECKING")
                dict.state = 'FIRSTPASS';
              else if (this.checkMapping === "THIRDCHECKING")
                dict.state = 'SECONDPASS';
              dict.ids = [].concat(student.id);
              this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
                if (response.data.status === 0) {
                  this.$message.success('通过成功！');
                  student.stateName = "";
                  if (this.checkMapping === "SECONDCHECKING") {
                    student.state = "FIRSTPASS";
                    student.checkName = "班级审核通过";
                  }
                  else if (this.checkMapping === "THIRDCHECKING") {
                    student.state = 'SECONDPASS';
                    student.checkName = "班级互审通过";
                  }
                }
                else {
                  this.$message.error('通过失败！')
                }
              })
            }).catch(() => {
              this.$message.info('通过取消')
            });
          }
        },

        notPassOne(student){
          if (this.checkMapping === "FIRSTCHECKING") {
            let dict = {};
            dict.state = "FAILED";
            dict.ids = [].concat(student.id);
            this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
              if (response.data.status === 0) {
                this.$message.success('不通过成功');
                student.state = "FAILED";
                student.checkName = "班级审核不通过";
                student.stateName = "";
              }
              else {
                this.$message.error('不通过失败')
              }
            })
          }
          else {
            this.$confirm('是否确认不通过此条记录', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let dict = {};
              dict.state = "FAILED";
              dict.ids = [].concat(student.id);
              this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
                if (response.data.status === 0) {
                  this.$message.success('不通过成功');
                  student.state = "FAILED";
                  student.checkName = "班级审核不通过";
                  student.stateName = "";
                }
                else {
                  this.$message.error('不通过失败')
                }
              })
            }).catch(() => {
              this.$message.info('不通过取消')
            });
          }
        },

        notPassMulti(){
          let dict={};
          dict.ids=[];
          for(let i=0;i<this.selected.length;i++){
            if ((this.checkMapping === 'FIRSTCHECKING' && this.selected[i].state !== "FAILED") || (this.checkMapping !== 'FIRSTCHECKING' && this.selected[i].state === 'UNCHECKED'))
              dict.ids.push(this.selected[i].id)
          }
          dict.state = "FAILED";
          this.$confirm('是否确认不通过此'+this.selected.length+'条记录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('sm/comprehensive/handleRecords',dict).then(response=>{
              if(response.data.status===0){
                this.$message.success('批量不通过成功!');
                this.sendQuery();
              }
              else{
                this.$message.error('批量不通过失败！')
              }
            })
          }).catch(() => {
            this.$message.info('批量不通过取消')
          });
        },

        // 修改单条记录
        changeVisible(student){
          console.log(student);
          student.edit=true;
          student.state = "modified";                      //状态"FAILED"存放修改状态，不会发送给后端
        },
        // 修改记录
        changeOne(student){
          let dict = {};
          dict.scoreKind=student.score_kind;
          dict.score=student.score;
          dict.scoreName = student.score_name;
          if (this.checkMapping === 'FIRSTCHECKING' || this.checkMapping === 'SECONDCHECKING')
            dict.status = 'FIRSTPASS';
          else
            dict.status = 'SECONDPASS';
          dict.id = student.id;
          this.$axios.post("sm/comprehensive/modify",dict).then(res => {
            if(res.data.status===0){
            }
            else{
              this.$message.error("修改失败");
            }
            this.sendQuery()
          }).catch(() => {
            this.$message.info('修改失败');
            this.sendQuery()
          });
        },
        cancleChange(){
          this.sendQuery()
        },
        // 批量处理记录
        multiPass(){
          if(this.selected.length!==0){
            let dict={};
            if (this.checkMapping === "FIRSTCHECKING")
              dict.state = 'FIRSTPASS';
            else
              dict.state = 'SECONDPASS';
            dict.ids=[];
            for(let i=0;i<this.selected.length;i++){
              if ((this.checkMapping === 'FIRSTCHECKING' && this.selected[i].state !== 'FIRSTPASS') || (this.checkMapping !== 'FIRSTCHECKING' && this.selected[i].state === 'UNCHECKED'))
                dict.ids.push(this.selected[i].id)
            }
            this.$confirm('是否确认通过此'+this.selected.length+'条记录', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('sm/comprehensive/handleRecords',dict).then(response=>{
                if(response.data.status===0){
                  this.$message.success('批量通过成功!');
                  this.sendQuery();
                }
                else{
                  this.$message.error('批量通过失败！')
                }
              })
            }).catch(() => {
              this.$message.info('批量通过取消')
            });
          }
          else{
            this.$message.warning("请选择学生");
          }
        },

        sendQuery() {
          this.whileLoading = true;
          // 生成条件
          let dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;

          if(this.selectedPerson.length!==0){
            var start = new RegExp(/^\d+/);
            if(start.exec(this.selectedPerson)===null){
              dict.stuName=this.selectedPerson;
            }
            else{
              dict.number = this.selectedPerson;
            }
          }
          dict.identity=this.myclass;
          this.$axios.post("sm/comprehensive/records", dict).then(response => {
            if (response.data.status === 0) {
              this.recordQuantity = response.data.data.recordQuantity;
              this.verifyData = response.data.data.studentsCompreData;
              for(var i=0;i<this.verifyData.length;i++){
                this.verifyData[i].edit=false;
                this.verifyData[i].index=i;

                if (this.verifyData[i].score_kind === "减分项")
                  this.verifyData[i].score = -Math.abs(this.verifyData[i].score);
                if (this.verifyData[i].state === 'UNCHECKED')
                  this.verifyData[i].stateName = "待审核";
                else {
                  this.verifyData[i].stateName = "";
                  if (this.checkMapping !== 'FIRSTCHECKING') {
                    switch (this.verifyData[i].state) {
                      case "FIRSTPASS":
                        this.verifyData[i].checkName = "班级审核通过";
                        break;
                      case "FAILED":
                        this.verifyData[i].checkName = "班级审核不通过";
                        break;
                      case "SECONDPASS":
                        this.verifyData[i].checkName = "班级互审通过";
                        break;
                      case "PASS":
                        this.verifyData[i].checkName = "辅导员审核通过";
                        break;
                    }
                  }
                }
              }
              this.whileLoading = false;
            }
          });
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


