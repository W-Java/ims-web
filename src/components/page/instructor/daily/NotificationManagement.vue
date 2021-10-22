<template>
  <div>
    <el-tabs v-model="activenote" @tab-click="handleTabClick">
      <el-tab-pane label="新建通知" name="first">
        <el-form :model="noteData" :rules="inputRules" ref="createForm">

          <el-row>
            <el-col :span="12">
              <el-form-item label="通知名称" prop="title">
                <br>
                <el-col :span="20">
                  <el-input v-model="noteData.title"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布对象" prop="member">
                <br>
                <el-col :span="14">
                  <el-radio v-model="noteData.member" label="所有学生">所有学生</el-radio>
                  <el-radio v-model="noteData.member" label="我分管的">我分管的</el-radio>
                </el-col>
                <el-col :span="10">
                  <el-select v-model="noteData.range" @change="dialogChange(noteData.range)">
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
                          <el-select @change="checkStatus_major" v-model="noteData.selectedMajor"
                                     :disabled="majorSelectionDisabled" placeholder="专业选择">
                            <el-option
                              v-for="major in noteData.choice.optionsForMajor"
                              :key="major"
                              :label="major"
                              :value="major">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="6">
                          <!--若未选择专业，班级选项无效-->
                          <el-select v-model="noteData.selectedClass" :disabled="classSelectionDisabled"
                                     placeholder="所有班级">
                            <el-option
                              v-for="_class in noteData.choice.optionsForClass"
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
                      v-for="tag in noteData.single"
                      :key="tag[0]"
                      closable
                      :disable-transitions="false"
                      @close="deleteObject(tag)"
                      type="info">
                      {{tag[1]}}
                    </el-tag>
                    <div>
                      <el-table id="table" :data="noteData.studentsData" style="width: 100%"
                                v-loading="noteData.whileLoading" :stripe="noteData.stripeOn">
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
                            <el-button size="small" :disabled="checkDisabled(scope.row.number)" type="info"
                                       @click="addObjects(scope.row.name,scope.row.number)">添加
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="block">
                        <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="noteData.currentPage"
                          :page-sizes="[20, 50, 100]"
                          :page-size="noteData.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="noteData.recordQuantity">
                        </el-pagination>
                        <el-button type="primary" size="small" @click="checkObjects" class="right"
                                   style="margin-top: -32px">确认
                        </el-button>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                  </el-dialog>
                  <!--添加班级对象-->
                  <el-dialog width="70%" title="添加班级" :visible.sync="dialogClassVisible"
                             v-loading="noteData.whileLoading">
                    <el-tag
                      v-for="tag in noteData.card"
                      :key="tag"
                      closable
                      :disable-transitions="false"
                      @close="deleteClass(tag)"
                      type="info">
                      {{tag}}
                    </el-tag>
                    <el-row>
                      <el-checkbox-group v-model="noteData.card">
                        <el-col :span="4" v-for="(card,index) in noteData.cards" :key="index">
                          <el-checkbox :label="card" :value="card" border></el-checkbox>
                        </el-col>
                      </el-checkbox-group>
                    </el-row>
                    <el-button type="primary" size="small" @click="checkClass" class="right">确认添加</el-button>
                    <div class="clearfix"></div>
                  </el-dialog>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="通知内容" prop="content"></el-form-item>
          <ueditor-wrap v-model="noteData.content" :config="ueditorConfig"></ueditor-wrap>
          <br>
          <el-button @click="submitNote" type="primary" size="small">提交</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="历史通知" name="second">
        <el-table :data="noteTableData">
          <el-table-column label="名称" prop="title"></el-table-column>
          <el-table-column label="发布对象" prop="memmber"></el-table-column>
          <el-table-column label="发布时间" prop="createTime"></el-table-column>
          <el-table-column label="发布人" prop="creatorName"></el-table-column>
          <el-table-column label="通知详情">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handelDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.deleteDisabled" @click="deleteDialog(scope.row.id)" size="small"
                         type="primary">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="删除提示" :visible.sync="deleteDialogVisible">
      <span>确定删除本条记录?</span>
      <span slot='footer' class='dialog-footer'>
        <el-button size="small" type="primary" @click="deleteSubmit">确定</el-button>
      <el-button size="small" @click="deleteDialog">取消</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="详情" width="75%" prop="content"></el-dialog>
  </div>
</template>

<script>

  export default {
    name: "notificationmanagement",
    data() {
      return {
        activenote: 'first',
        inputRules: {
          title: [
            {required: true, message: '请输入通知名称', trigger: 'blur'}
          ],
          member: [
            {required: true, message: '请输入通知名称', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入通知名称', trigger: 'blur'}
          ],
        },
        noteData: {
          title: "",
          member: "所有学生",
          selectedMajor: "所有专业",
          selectedClass: "所有班级",
          range: "",
          content: '',
          single: [],
          studentData: [],
          choice: {
            optionsForMajor: [],
            optionsForClass: []
          },
          pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
          currentPage: 1,     // 当前页码
          recordQuantity: 0, // 总数据量
          whileLoading: false,
          cards: [],
          card: [],
          stripeOn: true,
        },
        updateMyNotice: true,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
        whileLoading: false,

        selectedNumber: "",
        choiceForObject: ["个人", "班级", "全部班级", "全部学生"],
        dialogVisible: false,
        dialogSingleVisible: false,
        dialogClassVisible: false,
        classSelectionDisabled: true,
        majorSelectionDisabled: false,
        deleteDialogVisible: false,
        toBeDeleted: '',
        ueditorConfig: {
          // UEditor资源存放的路径，相对于打包后的index.html
          UEDITOR_HOME_URL: '/static/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 200,
          // 初始容器宽度
          initialFrameWidth: '100%',
          zIndex: 0,
        },
      }
    },
    asyncComputed: {
      noteTableData() {
        let dict = {};
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        if (this.updateMyNotice) {
          this.updateMyNotice = false;
          return this.$axios.post('sm/notice/myCreated', dict).then(res => {
            this.recordQuantity = res.data.data.recordQuantity;
            for (let i = 0; i < res.data.data.data.length; i++) {
              if (res.data.data.data[i].creatorName === JSON.parse(sessionStorage.getItem('user')).name) {
                res.data.data.data[i].deletedisabled = false;
              } else {
                res.data.data.data[i].deletedisabled = true;
              }
              return res.data.data.data;
            }
          })
        }
      },
    },
    methods: {
      handleTabClick(evt) {
        if (evt.label === '历史通知')
          this.updateMyNotice = true;
      },
      checkDisabled(number) {
        for (let i of this.noteData.single)
          if (i[0] === number)
            return true;
        return false;
      },
      deleteDialog(id) {
        if (this.deleteDialogVisible === true)
          this.deleteDialogVisible = false;
        else this.deleteDialogVisible = true;
        this.toBeDeleted = id;
      },
      deleteSubmit() {
        let dict = {};
        dict.id = this.toBeDeleted;
        this.toBeDeleted = '';
        this.$axios.post('sm/notice/delete', dict).then(res => {
          if (res.data.status === 0)
            this.$message.success(res.data.message);
          else
            this.$message.error(res.data.message);
        });
        this.deleteDialogVisible = false;
      },
      dialogChange(value) {
        if (value === "个人") {
          this.dialogSingleVisible = true;
          this.noteData.whileLoading = true;
          // 生成条件
          this.getOptions_basic();
          let dict = {};
          if (this.noteData.member === "我分管的") dict.showAllMembers = false;
          else dict.showAllMembers = true;
          if (this.noteData.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
          if (this.noteData.selectedClass !== '所有班级') dict._class = this.selectedClass;
          dict.currentPage = this.noteData.currentPage;
          console.log('page size', this.noteData.pageSize);
          dict.pageSize = this.noteData.pageSize;
          //发送请求
          this.$axios.post("sm/studentinfo", dict).then(response => {
            if (response.data.status === 0) {
              this.noteData.recordQuantity = response.data.data.recordQuantity;
              this.noteData.studentsData = response.data.data.students;
              this.noteData.whileLoading = false;
              for (let i = 0; i < response.data.data.recordQuantity; i++) {
                for (let j = 0; j < this.noteData.single.length; j++) {
                  if (response.data.data.students[i].name === this.noteData.single[j][1]) {
                    this.noteData.studentsData[i].disabled = true;
                    break;
                  }
                  else
                    this.noteData.studentsData[i].disabled = false;
                }
              }
            }
          });
        }
        else if (value === "班级") {
          this.dialogClassVisible = true;
          this.noteData.whileLoading = true;
          this.$axios.post('sm/classcards', {}).then(
            res => {
              if (res.data.status === 0) {
                this.noteData.cards = res.data.data.shortName;
                this.noteData.whileLoading = false;
              }
            });
        }
        else if (value === "全部班长") {
          let dict = {};
          if (this.noteData.range === "所有学生") dict.showAllPeople = true;
          else dict.showAllPeople = false;
          this.$axios.post('/sm/getMonitors', dict)
            .then(response => {
              if (response.data.status === 0) {
                this.noteData.definite = response.data.data.monitors.split('#');
              }
            })
        }
        else if (value === "全部学生") {
          this.noteData.definite = ["全部学生"];
        }
      },
      submitNote() {
        this.$refs.createForm.validate((valid) => {
          if (valid) {
            let dict = {};
            dict.target = {};
            dict.title = this.noteData.title;
            dict.content = this.noteData.content;
            dict.target.mine = this.noteData.member === "我分管的";
            if (this.noteData.range === "个人") {
              dict.target.type = 0;
              dict.target.members = this.noteData.single;
            } else if (this.noteData.range === "班级") {
              dict.target.type = 1;
              dict.target.members = this.noteData.card;
            } else if (this.noteData.range === "全部学生")
              dict.target.type = 3;
            else
              dict.target.type = 2;
            console.log(dict);
            this.$axios.post('sm/notice/new', dict).then(res => {
              if (res.data.status === 0) {
                this.$message.success('提交成功');
              }
            })
          } else {
            console.log('erro submit');
            return false;
          }
        });
      },
      addObjects(name, i) {
        this.noteData.single = this.noteData.single.concat([[i, name]]);
        // this.$set(this.noteData.studentsData[i],'disabled',true);
      },
      deleteObject(name) {
        this.noteData.single.splice(this.noteData.single.indexOf(name), 1);
        for (let i = 0; i < this.noteData.studentsData.length; i++) {
          if (this.noteData.studentsData[i].name === name) {
            this.noteData.studentsData[i].disabled = false;
            break
          }
        }
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.noteData.choice.optionsForMajor = ['所有专业'].concat(res.data.data);
          }
        );
      },
      checkStatus_major() {
        if (this.noteData.selectedMajor === '所有专业')
          this.classSelectionDisabled = true;
        else {
          this.classSelectionDisabled = false;
          this.getOptionsForClass();
        }
      },
      //      添加个人时所用的过滤器（和学生管理同一个）
      sendSingleQuery() {
        this.noteData.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.noteData.member === "所有学生") dict.showAllMembers = true;
        else dict.showAllMembers = false;
        if (this.selectedNumber > 0) dict.number = this.selectedNumber;
        else {
          if (this.noteData.selectedClass !== '所有班级') dict.class = this.noteData.selectedClass;
          if (this.noteData.selectedMajor !== '所有专业') dict.major = this.noteData.selectedMajor;
        }
        dict.currentPage = this.noteData.currentPage;
        dict.pageSize = this.noteData.pageSize;
        //发送请求
        this.$axios.post('/sm/studentinfo', dict).then(response => {
          if (response.data.status === 0) {
            this.noteData.recordQuantity = response.data.data.recordQuantity;
            this.noteData.studentsData = response.data.data.students;
            this.noteData.whileLoading = false;
            for (var i = 0; i < response.data.data.recordQuantity; i++) {
              console.log("2333");
              for (var j = 0; j < this.noteData.single.length; j++) {
                if (response.data.data.students[i].name === this.noteData.single[j]) {
                  this.noteData.studentsData[i].disabled = true;
                  break;
                }
                else
                  this.noteData.studentsData[i].disabled = false;

              }
              console.log(this.noteData.studentsData[i].disabled)
            }
          }
        });
      },
      checkObjects() {
        if (this.noteData.single.length === 0)
          this.$message.error("请选择具体通知对象");
        else {
          this.$message.success("选择对象成功");
          this.dialogSingleVisible = false;
        }
      },
      checkClass() {
        if (this.noteData.card.length === 0)
          this.$message.error("请选择班级");
        else {
          this.$message.success("选择班级成功");
          this.dialogClassVisible = false;
        }
      },
      // handelDetail() {
      //
      // },
      handleSizeChange(val) {
        this.noteData.pageSize = val;
        this.sendSingleQuery();
      },
      handleCurrentChange(val) {
        this.noteData.currentPage = val;
        this.sendSingleQuery();
      },
    },

  }
</script>

<style scoped>

</style>
