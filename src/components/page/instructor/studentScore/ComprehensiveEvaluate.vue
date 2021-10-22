<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
        <el-breadcrumb-item>打分</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row>
        <el-col :span="12">
          <span style="font-size: 12px; color: #c0c4cc;">
            *提示：选中多名学生可进行批量打分（德育分），填写德育分时请按回车实现批量填分。<br>
            请填写班级同学德育分及减分项（减分项分数请填写正数），勾选可进行批量打分操作。此页面提交后不可更改。
          </span>
        </el-col>
      </el-row>
      <!--班长打分：给班级学生打分（德育分、班委加分、减分）-->
      <el-table :data="evaluateData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn"
                @selection-change="handleSelectionChange">
        <el-table-column v-if="!sub" type="selection" width="55"></el-table-column>
        <el-table-column label="姓名"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
        <el-table-column label="学号"><template slot-scope="scope">{{scope.row.number}}</template></el-table-column>
        <el-table-column label="德育分(必填)">
          <template slot-scope="scope">
            <el-input type="number" step="1" max="100" min="0" @change="multipleScore(scope.row.index)"
                      @keyup.enter.native="multipleScore(scope.row.index)" :disabled="sub||scope.row.disabled"
                      v-model="scope.row.moral" required/>
          </template>
        </el-table-column>
        <!--<el-table-column label="班委加分"><template slot-scope="scope"><el-input :disabled="sub||thirdSub" type="number" v-model="scope.row.com_score"/></template></el-table-column>-->
        <el-table-column label="减分分值"><template slot-scope="scope"><el-input :disabled="sub||thirdSub" type="number" v-model="scope.row.sub_score"/></template></el-table-column>
        <el-table-column label="减分说明"><template slot-scope="scope"><el-input :disabled="sub||thirdSub" v-model="scope.row.sub_note"/></template></el-table-column>
        <el-table-column label="备注"><template slot-scope="scope"><el-input :disabled="sub||thirdSub" v-model="scope.row.note"/></template></el-table-column>
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

      <div style="margin-top: 20px">
        <el-row :gutter="40">
          <el-col v-if="!sub" :span="4"><el-button type="primary" @click="save">保存</el-button></el-col>
          <el-col v-if="!sub" :span="4"><el-button type="primary" @click="submit">提交</el-button> </el-col>
          <el-col :span="4"><el-button type="primary" @click="ret">返回</el-button> </el-col>
        </el-row>
      </div>

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
  .el-button{
    width: 100%;
  }
</style>

<script>
    export default {
        name: "comprehensiveevaluate",
        data(){
          return {
            stripeOn: true,
            whileLoading: false,
            pageSize: 50,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
            currentPage: 1,     // 当前页码
            recordQuantity: 0, // 总数据量
            evaluateData:[],
            sub:false,
            selected:[],
            minindex:"",
            checkMapping:"",
            thirdSub:false
          }
        },
      created(){
        this.checkMapping = this.$route.query.status;
        this.sendQuery();
      },
      methods:{
        handleSizeChange(val) {
          this.pageSize = val;
          this.sendQuery();
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.sendQuery();
        },
        // 批量处理德育分
        handleSelectionChange(val){
          if(val.length!==0){
            this.selected=val;
            var minindex = val[0].index;
            for(var i=1;i<val.length;i++){
              if(val[i].index<minindex)
                minindex=val[i].index;
            }
            for(var i=0;i<val.length;i++){
              if(this.evaluateData[val[i].index].index===minindex){
                this.evaluateData[val[i].index].disabled=false;
              }
              else
                this.evaluateData[val[i].index].disabled=true;
            }
            this.minindex = minindex;
          }
          else{
            this.selected=[];
            this.minindex="";
            for(var i=0;i<this.evaluateData.length;i++)
              this.evaluateData[i].disabled=false;
          }
        },
        multipleScore(index){
          if(index===this.minindex){
            for(var i=0;i<this.selected.length;i++){
              this.evaluateData[this.selected[i].index].moral=this.evaluateData[index].moral;
            }
          }
        },

        sendQuery() {
          this.whileLoading = true;
          // 生成条件
          let dict = {};
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          this.$axios.post('sm/comprehensive/evaluateGet',dict).then(response => {
            if (response.data.status === 0) {
              this.recordQuantity = response.data.data.recordQuantity;
              this.evaluateData = response.data.data.students;
              this.whileLoading = false;
              this.status=response.data.data.status;
              for (var i = 0; i < response.data.data.students.length; i++) {
                this.evaluateData[i].index=i%this.pageSize;
                if (this.evaluateData[i].sub_score !== null)
                  this.evaluateData[i].sub_score = Math.abs(this.evaluateData[i].sub_score)
              }
              if (response.data.data.status == "FIRSTPASS")
                this.sub=true;
              else if (this.checkMapping == "THIRDCHECKING") {
                this.thirdSub = true;
                if (response.data.data.status === "saving")
                  this.sub = false;
              }
              else if (this.checkMapping != "FREETIME") {
                this.sub = true;
              }
              else
                this.sub=false;
            }
          })
        },
        save(){
          this.$confirm('是否确认保存评分（保存后仍可修改）', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let dict={};
            dict.evaluateData = this.evaluateData;
            dict.status="saving";
            for (let i = 0; i < this.evaluateData.length; i++) {
              if (this.evaluateData[i].sub_score !== null)
                dict.evaluateData[i].sub_score = -this.evaluateData[i].sub_score;
            }
            this.$axios.post('sm/comprehensive/evaluateSet',dict).then(res => {
              if(res.data.status===0){
                this.$message.success("已保存加分信息");
              }
            })
          }).catch(() => {
            this.$message.info('保存取消')
          });
        },
        submit(){
          this.$confirm('是否确认提交评分（提交后不可修改）', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let dict={};
            dict.evaluateData = this.evaluateData;
            if(this.checkMapping === "THIRDCHECKING")
              dict.status = "modify";
            else
              dict.status="submitted";

            for (var i = 0; i < this.evaluateData.length; i++) {
              if (this.evaluateData[i].moral === null || this.evaluateData[i].moral === "") {
                this.$message.warning("还有学生未填德育分！");
                return;
              }
            }

            for (let i = 0; i < this.evaluateData.length; i++) {
              if (this.evaluateData[i].sub_score !== null)
                dict.evaluateData[i].sub_score = -this.evaluateData[i].sub_score;
            }

            this.$axios.post('sm/comprehensive/evaluateSet',dict).then(res => {
              if(res.data.status===0){
                this.$message.success("已完成评分");
                this.sub=true
              }
            })
          }).catch(() => {
            this.$message.info('提交取消')
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
      },
    }
</script>


