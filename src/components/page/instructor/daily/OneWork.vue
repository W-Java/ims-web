<template>
  <!--这里写内容-->

  <div class="workTable">
    <el-form :model="workData" ref="change" :rules="inputRules">
      <el-row>
        <el-col :span="6">工作名称:</el-col>
        <el-col :span="18"><el-form-item prop="name"> <el-input :disabled="!change" v-model="workData.name"></el-input></el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">工作描述:</el-col>
        <el-col :span="18"><el-form-item prop="description"><el-input type="textarea" :disabled="!change" v-model="workData.description"></el-input></el-form-item> </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">标签:</el-col>
        <el-col :span="18">
          <el-form-item prop="labels">
            <el-select v-model="workData.workLabels" multiple :disabled="!change">
              <el-option v-for="kind in labelKind"
                         :key="kind"
                         :label="kind"
                         :value="kind">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">工作对象</el-col>
        <el-col :span="18">
          <el-select v-model="definites" multiple disabled>

          </el-select>
          <el-radio v-model="after" label="所有学生" :class="{'is-display':!change}">所有学生</el-radio>
          <el-radio v-model="after" label="我分管的" :class="{'is-display':!change}">我分管的</el-radio><br>
          <el-select v-model="workData.range"  style="margin-top: 20px" @change="dialogChange(workData.range)" :class="{'is-display':!change}">
            <el-option v-for="kind in choiceForObject"
                       :key="kind"
                       :label="kind"
                       :value="kind">
            </el-option>
          </el-select>
          <!--添加个人对象-->
          <el-dialog width="70%" title="添加个人" :visible.sync="dialogSingleVisible">
            <div>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-select @change="checkStatus_major" v-model="selectedMajor" :disabled="majorSelectionDisabled" placeholder="专业选择">
                    <el-option
                      v-for="major in choice.optionsForMajor"
                      :key="major"
                      :label="major"
                      :value="major">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <!--若未选择专业，班级选项无效-->
                  <el-select v-model="selectedClass" :disabled="classSelectionDisabled"
                             placeholder="所有班级">
                    <el-option
                      v-for="_class in choice.optionsForClass"
                      :key="_class"
                      :label="_class"
                      :value="_class">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="selectedNumber" ref="numberInput" placeholder="请输入学号"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button v-on:click.native="sendSingleQuery">查询</el-button>
                </el-col>
              </el-row>
            </div>

            <el-tag
              v-for="tag in single"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="deleteObject(tag)"
              type="info">
              {{tag}}
            </el-tag>
            <div>
              <el-table id="table" :data="studentData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn">
                <el-table-column prop="name" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="major" label="专业">
                </el-table-column>
                <el-table-column prop="_class" label="班级">
                </el-table-column>
                <el-table-column prop="number" label="学号">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="small" type="info" @click="addObjects(scope.row.name)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[20, 50, 100]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="recordQuantity">
                </el-pagination>
                <el-button type="primary" size="small" @click="checkObjects" class="right" style="margin-top: -32px">确认</el-button>
              </div>
              <div class="clearfix"></div>
            </div>
          </el-dialog>
          <!--添加班级对象-->
          <el-dialog width="70%" title="添加班级" :visible.sync="dialogClassVisible"  v-loading="whileLoading">
            <el-tag
              v-for="tag in card"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="deleteClass(tag)"
              type="info">
              {{tag}}
            </el-tag>
            <el-row>
              <el-checkbox-group v-model="card">
                <el-col :span="4" v-for="(card,index) in cards" :key="index">
                  <el-checkbox :label="card" :value="card" border></el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>

            <el-button type="primary" size="small" @click="checkClass" class="right">确认添加</el-button>
            <div class="clearfix"></div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">开始时间</el-col>
        <el-col :span="9">
          <div class="block">
            <el-date-picker :disabled="!change"
                            v-model="workData.createDate"
                            type="date"
                            format="yyyy.MM.dd"
                            value-format="yyyy.MM.dd"
                            placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="block">
            <el-time-select :disabled="!change"
              v-model="workData.createTime"
              :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
              placeholder="选择时间">
            </el-time-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">结束时间</el-col>
        <el-col :span="9">
          <div class="block">
            <el-date-picker :disabled="!change"
                            v-model="workData.finishDate"
                            type="date"
                            format="yyyy.MM.dd"
                            value-format="yyyy.MM.dd"
                            placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="block">
            <el-time-select :disabled="!change"
              v-model="workData.finishTime"
              :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
              placeholder="选择时间">
            </el-time-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">工作内容:</el-col>
        <el-col :span="18"><ueditor-wrap :disabled="!change" v-model="workData.content" :config="ueditorConfig"></ueditor-wrap></el-col>
      </el-row>
    </el-form>

    <el-button @click="exportOneWork" size="small">导出工作</el-button>
    <el-button @click="changeWork" type="warning" size="small" :disabled="end" :class="{'is-display':change}">修改</el-button>
    <el-button @click="saveWork" type="warning" size="small" :class="{'is-display':!change}">保存</el-button>
    <el-button @click="endWork" type="success" size="small" :class="{'is-display':end}">结束工作</el-button>
  </div>
</template>

<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 0 50px;
  }

  .el-table__expanded-cell {
    padding: 0;
  }

  .el-form-item__content {
    width: 100%;
  }

  .block {
    float: right;
    width: 100%;
  }
  .el-date-editor{
    width: 100%;
  }
  .is-display{
    display:none
  }
  .workTable .el-row{
    margin: 20px 0;
  }
  .workTable .el-select{
    width: 100%;
  }
  .workTable .el-select__tags{
    width: 100%;
  }
  .tableName{
    border: none;
    background-color: transparent;
  }
  .tableName:hover{
    border: none;
    background-color: transparent;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .is-display{
    display: none;
  }
  .edui-editor{
    z-index: 1;
  }
  .el-radio{
    margin-top: 22px;
  }
</style>

<script>


  export default {
    name: 'onework',
    data() {
      return {
        workData:{},
        inputRules:{
          name:[
            { required: true, message: '请输入工作名称', trigger: 'blur'}
          ],
          description:[
            { required: true, message: '请输入工作描述', trigger: 'blur'}
          ],
          labels:[
            { required: true, message: '请选择合适的标签', trigger: 'blur'}
          ]
        },
//        是否为修改状态
        change:false,
        end:false,

//          选择对象所用的参数
        definites:[],
//        个人所用到的参数
        single:[],
        after:"所有学生",
        selectedNumber:"",
        selectedMajor:"所有专业",
        selectedClass:"所有班级",
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        prevStatusOfClassSelection: true,
        studentData:[],
        choice:{
          optionsForMajor:[],
          optionsForClass:[]
        },
        stripeOn: true,
        whileLoading: false,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
//        班级所用到的参数
        cards:[],
        card:[],

        labelKind: ["思想引领","安全维稳","心理辅导","学风建设","成长领航"],
        choiceForObject:["个人","班级","全部班长","全部学生"],
        //        添加对象模态框
        dialogSingleVisible:false,
        dialogClassVisible:false,
//        添加工作内容的模态框
        dialogAddFormVisible:false,
        ueditorConfig:{
          // UEditor资源存放的路径，相对于打包后的index.html
          UEDITOR_HOME_URL: '/static/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 200,
          // 初始容器宽度
          initialFrameWidth: '100%'
        },
      }
    },
    created() {
      this.$axios.post('/sm/getwork', {id: this.$route.query.work}).then(
        response => {
          if(response.data.status === 0){
            this.workData = response.data.data.work;
            this.workData.workLabels=this.workData.labels.split("#");
            if(this.workData.showAllPeople===true) this.workData.member="所有学生";
            else this.workData.member="我分管的";
            this.definites=this.workData.definite.split("#");
            this.after=this.workData.member;
            if(this.workData.status==="进行中") this.end=false;
            else this.end=true;
            if(this.workData.range==="个人"||this.workData.range==="全部班长") this.single=this.workData.definite.split("#");
            else if(this.workData.range==="班级") this.card=this.workData.definite.split("#");
          }

        }
      )
    },
    methods: {
      checkStatus_major() {
        if (this.selectedMajor === '所有专业')
          this.classSelectionDisabled = true;
        else {
          this.classSelectionDisabled = false;
//          this.getOptionsForClass();
        }
      },
      exportOneWork(){
      },
      changeWork(){
        this.change=true;
      },
      saveWork(){
        let dict={};
        dict.id=this.workData.id;
        dict.name=this.workData.name;
        dict.labels=this.workData.workLabels.join("#");
        dict.description=this.workData.description;
        if(this.workData.content!=="")
          dict.content=this.workData.content;
        dict.createDate=this.workData.createDate;
        dict.createTime=this.workData.createTime;
        dict.finishDate=this.workData.finishDate;
        dict.finishTime=this.workData.finishTime;
        dict.range=this.workData.range;
        if(this.workData.member==="所有学生")
          dict.showAllPeople=true;
        else
          dict.showAllPeople=false;
        if(this.workData.range!=="全部学生")
          dict.definite=this.definites.join("#");
        this.$refs.change.validate((valid) => {
          if (valid) {
            this.$axios.post('/sm/changeWork',dict).then(
              response => {
                if(response.data.status === 0){
                  this.$message.success(response.data.message);
                  this.change=false;
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
      endWork(){
        let dict={};
        dict.id=this.workData.id;
        dict.name=this.workData.name;
        dict.labels=this.workData.workLabels.join("#");
        dict.description=this.workData.description;
        if(this.workData.content!=="")
          dict.content=this.workData.content;
        dict.createDate=this.workData.createDate;
        dict.createTime=this.workData.createTime;
        dict.finish=true;
        dict.range=this.workData.range;
        if(this.workData.member==="所有学生")
          dict.showAllPeople=true;
        else
          dict.showAllPeople=false;
        if(this.workData.range!=="全部学生")
          dict.definite=this.definites.join("#");
        this.$refs.change.validate((valid) => {
          if (valid) {
            this.$axios.post('/sm/endWork',dict).then(
              response => {
                if(response.data.status === 0){
                  this.$message.success(response.data.message);
                  this.change=false;
                  this.end=true;
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

      //      添加个人时所用的过滤器（和学生管理同一个）
      sendSingleQuery(){
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.workData.member==="所有学生") dict.showAllMembers=true;
        else dict.showAllMembers=false;
        if (this.selectedNumber > 0) dict.number = this.selectedNumber;
        else {
          if (this.selectedClass !== '所有班级') dict.class = this.selectedClass;
          if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        }
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post('/sm/studentinfo', dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.studentData = response.data.data.students;
            this.whileLoading = false;
          }
        });
      },

      addContent(){
        this.$message({
          message:"保存内容成功",
          type:"success"
        })
        this.dialogAddFormVisible=false;
      },


      dialogChange(value){
        if(value==="个人"){
          this.dialogSingleVisible=true;
          this.whileLoading = true;
          // 生成条件
          this.getOptions_basic();
          let dict = {};
          if(this.member==="我分管的") dict.showAllMembers=false;
          else dict.showAllMembers=true;
          if(this.selectedMajor!=='所有专业') dict.major=this.selectedMajor;
          if(this.selectedClass!=='所有班级') dict._class=this.selectedClass;
          dict.currentPage = this.currentPage;
          dict.pageSize = this.pageSize;
          //发送请求
          this.$axios.post("sm/studentinfo", dict).then(response => {
            if (response.data.status === 0) {
              this.recordQuantity = response.data.data.recordQuantity;
              this.studentData =  response.data.data.students;
              this.whileLoading = false;
            }
          });
        }
        else if(value==="班级"){
          this.dialogClassVisible=true;
          this.whileLoading = true;
          this.$axios.post('sm/classcards', {}).then(
            res => {
              if (res.data.status === 0) {
                this.cards = res.data.data.shortName;
                this.whileLoading = false;
              }
            });
        }
        else if(value==="全部班长"){
          let dict={};
          if(this.range==="所有学生") dict.showAllPeople=true;
          else dict.showAllPeople=false;
          this.$axios.post('/sm/getMonitors',dict)
            .then(response=>{
              if(response.data.status === 0){
                this.definites=response.data.data.monitors.split('#');

              }
            })        }
        else if(value==="全部学生"){
          this.definites=["全部学生"];
        }
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendSingleQuery()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendSingleQuery();
      },
      addObjects(name){
        this.single=this.single.concat(name);
      },
      deleteObject(name){
        this.single.splice(this.single.indexOf(name), 1);
      },
      checkObjects(){
        if(this.single.length===0)
          this.$message.error("请选择具体工作对象");
        else{
          this.definites=this.single;
          this.$message.success("选择对象成功");
          this.dialogSingleVisible=false;
          console.log(this.definites);
        }
      },
      //选择专业后拉取该专业下的班级
      checkStatus_major() {
        if (this.selectedMajor === '所有专业')
          this.classSelectionDisabled = true;
        else {
          this.classSelectionDisabled = false;
          this.getOptionsForClass();
        }
      },

      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.choice.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
          res => {
            this.choice.optionsForClass = ['所有班级'].concat(res.data.data);
          });
      },

      deleteClass(name){
        this.card.splice(this.card.indexOf(name), 1);
        this.cards=this.cards.concat(name);
      },
      checkClass(){
        if(this.card.length===0)
          this.$message.error("请选择班级");
        else{
          this.definites=this.card;
          this.$message.success("选择班级成功");
          this.dialogClassVisible=false;
          console.log(this.definites);
        }
      },
    },
    asyncComputed:{
      classSelectionDisabled() {
        return this.selectedMajor === '所有专业';
      },

      // 班级选项
      optionsForClass() {
        let dict = {};
        dict.major = this.selectedMajor;
        dict._class = this.selectedClass;
        if (this.selectedMajor === '所有专业') {
          this.selectedClass = '所有班级';
          this.choice.optionsForClass = ['所有班级'];
          delete dict.major;
          delete dict._class;
        }
        else if (this.selectedClass === '所有班级')
          delete dict._class;
        else {
          this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              this.choice.optionsForClass = ['所有班级'].concat(res.data.data);
            }
          );
        }
      }
    },
    watch:{
      //限制学号只能输入数字
      selectedNumber(newVal,oldVal) {
        this.selectedNumber = newVal.replace(/[\D]/g, '');
        this.$refs['numberInput'].currentValue = this.selectedNumber;
        if (oldVal.length === 0) {
          this.prevStatusOfClassSelection = this.classSelectionDisabled; // 记录输入学号前的班级下拉菜单禁用状态
          this.classSelectionDisabled = true;
          this.majorSelectionDisabled = true;
          console.log('major: ' + this.majorSelectionDisabled);
        }
        if (newVal.length === 0) {
          this.classSelectionDisabled = this.prevStatusOfClassSelection;
          this.majorSelectionDisabled = false;
        }
      }
    }
  }
</script>
