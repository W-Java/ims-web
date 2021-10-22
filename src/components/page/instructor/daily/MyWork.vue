<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" id="newWork">
          <div slot="header" class="clearfix"><span>新建工作</span></div>
          <div>
            <el-form :model="newWork" ref="create" :rules="inputRules">
              <el-row :gutter="10">
                <el-col :span="2" class="col-label">工作名称:</el-col>
                <el-col :span="14"><el-form-item prop="name"><el-input v-model="newWork.name"></el-input></el-form-item></el-col>
                <el-col :span="2" class="col-label">标签添加:</el-col>
                <el-col :span="6">
                  <el-form-item prop="labels">
                    <el-select v-model="newWork.labels" multiple placeholder="所有标签类型">
                      <el-option v-for="kind in newWork.createLabelKind"
                                 :key="kind"
                                 :label="kind"
                                 :value="kind">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="2" class="col-label">开始时间:</el-col>
                <el-col :span="3">
                  <div class="block" style="margin-bottom: 22px">
                    <el-date-picker
                      v-model="newWork.createDate"
                      type="date"
                      format="yyyy.MM.dd"
                      value-format="yyyy.MM.dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="block" style="margin-bottom: 22px">
                    <el-time-select
                      v-model="newWork.createTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                      placeholder="选择时间">
                    </el-time-select>
                  </div>
                </el-col>
                <el-col :span="2" class="col-label">结束时间:</el-col>
                <el-col :span="3">
                  <div class="block" style="margin-bottom: 22px">
                    <el-date-picker
                      v-model="newWork.finishDate"
                      type="date"
                      format="yyyy.MM.dd"
                      value-format="yyyy.MM.dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="block" style="margin-bottom: 22px">
                    <el-time-select
                      v-model="newWork.finishTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                      placeholder="选择时间">
                    </el-time-select>
                  </div>
                </el-col>
                <el-col :span="2" class="col-label">工作对象:</el-col>
                <el-col :span="6">
                  <el-radio v-model="newWork.member" label="所有学生">所有学生</el-radio>
                  <el-radio v-model="newWork.member" label="我分管的">我分管的</el-radio><br>
                  <el-select v-model="newWork.range" style="margin: 22px 0;" @change="dialogChange(newWork.range)">
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
                          <el-select @change="handleSelectedMajor" v-model="newWork.selectedMajor"
                                     :disabled="majorSelectionDisabled" placeholder="专业选择">
                            <el-option
                              v-for="major in newWork.choice.optionsForMajor"
                              :key="major"
                              :label="major"
                              :value="major">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="6">
                          <!--若未选择专业，班级选项无效-->
                          <el-select @change="handleSelectedClass" v-model="newWork.selectedClass"
                                     :disabled="classSelectionDisabled"
                                     placeholder="所有班级">
                            <el-option
                              v-for="_class in newWork.choice.optionsForClass"
                              :key="_class"
                              :label="_class"
                              :value="_class">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="8">
                          <el-input @change="sendSingleQuery" v-model="selectedNumber" ref="numberInput"
                                    placeholder="请输入学号"></el-input>
                        </el-col>
                      </el-row>
                    </div>
                    <el-tag
                      v-for="tag in newWork.single"
                      :key="tag"
                      closable
                      :disable-transitions="false"
                      @close="deleteObject(tag)"
                      type="info">
                      {{tag}}
                    </el-tag>
                    <div>
                      <el-table id="table" :data="newWork.studentsData" style="width: 100%" v-loading="newWork.whileLoading" :stripe="newWork.stripeOn">
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
                            <el-button size="small" :disabled="scope.row.disabled" type="info" @click="addObjects(scope.row.name,scope.$index)">添加</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="block">
                        <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="newWork.currentPage"
                          :page-sizes="[20, 50, 100]"
                          :page-size="newWork.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="newWork.recordQuantity">
                        </el-pagination>
                        <el-button type="primary" size="small" @click="checkObjects" class="right" style="margin-top: -32px">确认</el-button>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                  </el-dialog>
                  <!--添加班级对象-->
                  <el-dialog width="70%" title="添加班级" :visible.sync="dialogClassVisible"  v-loading="newWork.whileLoading">
                    <el-tag
                      v-for="tag in newWork.card"
                      :key="tag"
                      closable
                      :disable-transitions="false"
                      @close="deleteClass(tag)"
                      type="info">
                      {{tag}}
                    </el-tag>
                    <el-row>
                      <el-checkbox-group v-model="newWork.card">
                        <el-col :span="4" v-for="(card,index) in newWork.cards" :key="index">
                          <el-checkbox :label="card" :value="card" border></el-checkbox>
                        </el-col>
                      </el-checkbox-group>
                    </el-row>
                    <!--<el-card style="margin: 8%;">-->
                    <!--<div style="text-align: center">-->
                    <!--<el-button type="text" style="color: #3193ff" >{{card}}</el-button>-->
                    <!--<br/>-->
                    <!--<el-button @click.native="addClass(card)">添加</el-button>-->
                    <!--</div>-->
                    <!--</el-card>-->


                    <el-button type="primary" size="small" @click="checkClass" class="right">确认添加</el-button>
                    <div class="clearfix"></div>
                  </el-dialog>

                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="2">工作描述:</el-col>
                <el-col :span="22"><el-form-item prop="description"><el-input type="textarea" :autosize="{minRows:3,maxRows:3}" v-model="newWork.description"></el-input></el-form-item></el-col>
              </el-row>
            </el-form>
            <el-button size="small" @click="dialogAddFormVisible = true">添加工作内容</el-button>
            <el-dialog title="添加工作内容" :visible.sync="dialogAddFormVisible">
              <ueditor-wrap v-model="newWork.content" :config="ueditorConfig"></ueditor-wrap>
              <el-button class="right" type="primary" @click="addContent" size="small" style="margin-top: 22px">保存</el-button>
              <div class="clearfix"></div>
            </el-dialog>
            <el-button type="primary" @click="createWork" size="small">确认建立</el-button>
            <div class="clearfix"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>最近的工作</span></div>
          <div>
            <el-table id="workTable" :data="workData" style="width: 100%">
              <el-table-column label="工作名称">
                <template slot-scope="scope">
                  <el-steps direction="vertical">
                    <el-step @click.native="checkWork(scope.row.id)" :status="scope.row.stepStatus" :title="scope.row.name" :description="scope.row.description" :icon="scope.row.icon"></el-step>
                  </el-steps>
                </template>
              </el-table-column>
              <el-table-column label="开始时间" prop="createDate"></el-table-column>
              <el-table-column label="完成时间" prop="finishDate"></el-table-column>
              <el-table-column label="工作对象">
                <template slot-scope="scope">
                  <el-tag
                    type="primary"
                    disable-transition><span class="el-select__tags-text">{{scope.row.tag[0]}}</span>
                  </el-tag>
                  <el-popover
                    v-if="scope.row.tag.length>1"
                    placement="bottom"
                    width="200"
                    trigger="click"
                    :content="scope.row.tagtext">
                    <el-button size="small" slot="reference">+{{scope.row.tag.length-1}}</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="标签" prop="labels">
                <template slot-scope="scope">
                  <el-tag
                    v-for="tag in scope.row.labeltag"
                    :key="tag"
                    type="warning">
                    {{tag}}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="checkMore">查看更多</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<style scoped>
  .box-card{
    height: 100%;
  }
  .right{
    float: right;
  }
  .clearfix{
    clear: both;
  }
  #newWork .el-select,#newWork .el-date-editor{
    width: 100%;
  }
  .el-tag{
    margin: 20px 10px 0 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

  #workTable thead .cell{
    text-align: center;
  }
  .el-steps--simple{
    background-color: transparent;
  }
  .el-step__icon{
    background-color: transparent;
  }
  .el-checkbox{
    margin: 5px 0;
  }
  .el-step{
    cursor: pointer;
  }
  .col-label{
    margin-top: 5px;
  }
</style>

<script>


  var dict={};

  export default {
    name: 'mywork',
    data() {
      return {
        workData:[],
        newWork:{
          name:"",
          labels:[],
          createLabelKind:["思想引领","安全维稳","心理辅导","学风建设","成长领航"],
          description:"",
          content:"",
          createDate:"",
          createTime:"",
          finishDate:"",
          finishTime:"",
//          选择对象
          range:"",
          definite:[],
//          选择对象所用的参数
          member:"所有学生",
          selectedMajor:"所有专业",
          selectedClass:"所有班级",
          studentData:[],
          choice:{
            optionsForMajor:[],
            optionsForClass:[]
          },
          single:[],
          stripeOn: true,
          whileLoading: false,
          pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
          currentPage: 1,     // 当前页码
          recordQuantity: 0, // 总数据量

          cards:[],
          card:[],

        },
        selectedNumber:"",
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        prevStatusOfClassSelection: true,
        choiceForObject:["个人","班级","全部班长","全部学生"],
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
      };
    },
    created() {
      this.sendQuery();
    },
    methods: {
      createWork(){
        let dict={};
        dict.name=this.newWork.name;
        dict.labels=this.newWork.labels.join('#');
        dict.description=this.newWork.description;
        if(this.newWork.content!=="")
          dict.content=this.newWork.content;
        dict.createDate=this.newWork.createDate;
        dict.createTime=this.newWork.createTime;
        dict.finishDate=this.newWork.finishDate;
        dict.finishTime=this.newWork.finishTime;
        dict.range=this.newWork.range;
        if(this.newWork.member==="所有学生")
          dict.showAllPeople=true;
        else
          dict.showAllPeople=false;
        if(this.newWork.range==="个人")
          dict.definite=this.newWork.single.join("#");
        else if(this.newWork.range==="班级")
          dict.definite=this.newWork.card.join("#");
        else if(this.newWork.range==="全部班长")
          dict.definite=this.newWork.definite.join("#");
        this.$refs.create.validate((valid) => {
          if (valid) {
            this.$axios.post('/sm/createWork',dict).then(
              response => {
                if(response.data.status === 0){
                  this.$message.success(response.data.message);
                  this.sendQuery();
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
      sendQuery(){
        this.whileLoading=true;
        const dict={};
        //设置只从后端获取10条工作记录
        dict.currentPage=1;
        dict.pageSize=10;
        dict.showAllPeople=true;
        this.$axios.post("/sm/work", dict).then(response => {
          if (response.data.status === 0) {
//            this.recordQuantity = response.data.data.recordQuantity;
            this.workData =  response.data.data.works;


            var number = response.data.data.recordQuantity;
            for(var i=0;i<number;i++){
              this.workData[i].tag=this.workData[i].definite ? this.workData[i].definite.split('#') : [];
              this.workData[i].labeltag=this.workData[i].labels ? this.workData[i].labels.split('#') : [];
              if(this.workData[i].status==='已完成') {
                this.workData[i].icon = "el-icon-check";
                this.workData[i].stepStatus = "success";
              }
              else{
                this.workData[i].icon = "el-icon-time";
                this.workData[i].stepStatus = "wait";
              }
              this.workData[i].tagtext=this.workData[i].definite ? this.workData[i].definite.split('#').join(',') : '';
            }
            this.whileLoading = false;
          }
        });
      },
//      添加个人时所用的过滤器（和学生管理同一个）
      sendSingleQuery(){
          this.newWork.whileLoading = true;
          // 生成条件
          const dict = {};
        console.log(this.selectedNumber)
          if(this.newWork.member==="所有学生") dict.showAllMembers=true;
          else dict.showAllMembers=false;
          if (this.selectedNumber > 0) dict.number = this.selectedNumber;
          else {
            if (this.newWork.selectedClass !== '所有班级') dict.class = this.newWork.selectedClass;
            if (this.newWork.selectedMajor !== '所有专业') dict.major = this.newWork.selectedMajor;
          }
          dict.currentPage = this.newWork.currentPage;
          dict.pageSize = this.newWork.pageSize;
          //发送请求
          this.$axios.post('/sm/studentinfo', dict).then(response => {
            if (response.data.status === 0) {
              this.newWork.recordQuantity = response.data.data.recordQuantity;
              this.newWork.studentsData = response.data.data.students;
              this.newWork.whileLoading = false;
              for(var i=0;i<response.data.data.recordQuantity;i++){
                for(var j=0;j<this.newWork.single.length;j++){
                  if(response.data.data.students[i].name===this.newWork.single[j]){
                    this.newWork.studentsData[i].disabled=true;
                    break;
                  }
                  else
                    this.newWork.studentsData[i].disabled=false;
                }
              }
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
          this.newWork.whileLoading = true;
          // 生成条件
          this.getOptions_basic();
          let dict = {};
          if(this.newWork.member==="我分管的") dict.showAllMembers=false;
          else dict.showAllMembers=true;
          if (this.newWork.selectedMajor !== '所有专业') dict.major = this.newWork.selectedMajor;
          if (this.newWork.selectedClass !== '所有班级') dict._class = this.newWork.selectedClass;
          dict.currentPage = this.newWork.currentPage;
          console.log('page size', this.newWork.pageSize);
          dict.pageSize = this.newWork.pageSize;
          //发送请求
          this.$axios.post("sm/studentinfo", dict).then(response => {
            if (response.data.status === 0) {
              this.newWork.recordQuantity = response.data.data.recordQuantity;
              this.newWork.studentsData =  response.data.data.students;
              this.newWork.whileLoading = false;
              for(var i=0;i<response.data.data.recordQuantity;i++){
                for(var j=0;j<this.newWork.single.length;j++){
                  if(response.data.data.students[i].name===this.newWork.single[j]){
                    this.newWork.studentsData[i].disabled=true;
                    break;
                  }
                  else
                    this.newWork.studentsData[i].disabled=false;
                }
              }
            }
          });
        }
        else if(value==="班级"){
          this.dialogClassVisible=true;
          this.newWork.whileLoading = true;
          this.$axios.post('sm/classcards', {}).then(
            res => {
              if (res.data.status === 0) {
                this.newWork.cards = res.data.data.shortName;
                this.newWork.whileLoading = false;
              }
            });
        }
        else if(value==="全部班长"){
          let dict={};
          if(this.newWork.range==="所有学生") dict.showAllPeople=true;
          else dict.showAllPeople=false;
          this.$axios.post('/sm/getMonitors',dict)
            .then(response=>{
              if(response.data.status === 0){
                this.newWork.definite=response.data.data.monitors.split('#');

              }
            })        }
        else if(value==="全部学生"){
          this.newWork.definite=["全部学生"];
        }
      },
      // resetPage重置当前页码，顺便发送查询请求
      resetPage() {
        this.newWork.currentPage = 1;
        this.sendSingleQuery();
      },
      // 每当改选班级，会重置页码并自动查询
      handleSelectedClass() {
        this.resetPage();
      },
      // 每当改选专业，会重置页码、班级并自动查询
      handleSelectedMajor() {
        this.resetSelectedClass();
        this.getOptionsForClass();
        this.resetPage();
      },
      resetSelectedClass() {
        this.newWork.currentPage = 1;
        this.newWork.selectedClass = '所有班级';
      },
      handleSelectedScore() {
        this.resetPage();
      },
      handleSizeChange(val) {
        this.newWork.pageSize = val;
        this.sendSingleQuery();
      },
      handleCurrentChange(val) {
        this.newWork.currentPage = val;
        this.sendSingleQuery();
      },

      addObjects(name,i){
        this.newWork.single=this.newWork.single.concat(name);
        this.$set(this.newWork.studentsData[i],'disabled',true);
      },
      deleteObject(name){
        this.newWork.single.splice(this.newWork.single.indexOf(name), 1);
        for(var i=0;i<this.newWork.studentsData.length;i++){
          if(this.newWork.studentsData[i].name===name){
            this.newWork.studentsData[i].disabled=false;
            break
          }
        }
      },
      checkObjects(){
        if(this.newWork.single.length===0)
          this.$message.error("请选择具体工作对象");
        else{
          this.$message.success("选择对象成功");
          this.dialogSingleVisible=false;
        }
      },

      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.newWork.choice.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.newWork.selectedMajor}}).then(
          res => {
            this.newWork.choice.optionsForClass = ['所有班级'].concat(res.data.data);
          });
      },

      deleteClass(name){
        this.newWork.card.splice(this.newWork.card.indexOf(name), 1);
        this.newWork.cards=this.newWork.cards.concat(name);
      },
      checkClass(){
        if(this.newWork.card.length===0)
          this.$message.error("请选择班级");
        else{
          this.$message.success("选择班级成功");
          this.dialogClassVisible=false;
        }
      },
//      查看所有工作记录
      checkMore(){
        this.$router.push(
          {
            name: 'completework',
          }
        )
      },
      checkWork(id){
        this.$router.push({
          name:'onework',
          query:{'work':id}
        })
      }

    },
    asyncComputed:{
      classSelectionDisabled() {
        return this.newWork.selectedMajor === '所有专业';
      },

      // 班级选项
      optionsForClass() {
        let dict = {};
        dict.major = this.newWork.selectedMajor;
        dict._class = this.newWork.selectedClass;
        if (this.newWork.selectedMajor === '所有专业') {
          this.newWork.selectedClass = '所有班级';
          this.newWork.choice.optionsForClass = ['所有班级'];
          delete dict.major;
          delete dict._class;
        }
        else if (this.newWork.selectedClass === '所有班级')
          delete dict._class;
        else {
          this.$store.dispatch('classoptions', {data: {major: this.newWork.selectedMajor}}).then(
            res => {
              this.newWork.choice.optionsForClass = ['所有班级'].concat(res.data.data);
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
