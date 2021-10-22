<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tabs type="border-card" @tab-click="tabChange" :value="tabsValue">
          <el-tab-pane label="添加任务" name="add">
            <div>
              <el-form :model="newcount" ref="create" :rules="inputRules">
                <el-row :gutter="10">
                  <el-col :span="2">标题</el-col>
                  <el-col :span="22">
                    <el-form-item prop="name">
                      <el-input v-model="newcount.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="2" class="col-label">开始时间</el-col>
                  <el-col :span="5">
                    <div class="block" style="margin-bottom: 22px">
                      <el-form-item prop="createDate">
                        <el-date-picker
                          v-model="newcount.createDate"
                          type="date"
                          format="yyyy.MM.dd"
                          value-format="yyyy.MM.dd"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div class="block" style="margin-bottom: 22px">
                      <el-form-item prop="=createTime">
                        <el-time-select
                          v-model="newcount.createTime"
                          :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                          placeholder="选择时间">
                        </el-time-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="2" class="col-label">结束时间</el-col>
                  <el-col :span="5">
                    <div class="block" style="margin-bottom: 22px">
                      <el-form-item prop="finishDate">
                        <el-date-picker
                          v-model="newcount.finishDate"
                          type="date"
                          format="yyyy.MM.dd"
                          value-format="yyyy.MM.dd"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div class="block" style="margin-bottom: 22px">
                      <el-form-item prop="finishTime">
                        <el-time-select
                          v-model="newcount.finishTime"
                          :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }"
                          placeholder="选择时间">
                        </el-time-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="2" class="col-label">特权用户</el-col>
                  <el-col :span="6">
                    <el-select v-if="instructor" v-model="prioritySelected"
                               @change="priorityDialogChange(prioritySelected)">
                      <el-option v-for="(kind,index) in ChoiceForPriority"
                                 :key="index"
                                 :label="kind"
                                 :value="kind">
                      </el-option>
                    </el-select>
                    <el-button v-if="monitor" @click="priorityDialogChange('个人')">添加</el-button>
                  </el-col>
                  <el-col :span="2" class="col-label">统计对象</el-col>
                  <el-col :span="14">
                    <el-col v-if="instructor" :span="4">
                      <el-radio v-model="objectRange" label="所有学生">所有学生</el-radio>
                    </el-col>
                    <el-col v-if="instructor" :span="4">
                      <el-radio v-model="objectRange" label="我分管的">我分管的</el-radio>
                    </el-col>
                    <el-col :span="6">
                      <el-select v-if="instructor" v-model="memberSelected"
                                 @change="memberDialogChange(memberSelected)">
                        <el-option v-for="(kind,index) in ChoiceForRange"
                                   :key="index"
                                   :label="kind"
                                   :value="kind">
                        </el-option>
                      </el-select>
                      <el-button v-if="monitor" @click="memberDialogChange('个人')">添加</el-button>
                    </el-col>
                    <!-- 添加个人dialog -->
                    <el-dialog width="70%" title="添加个人" :visible.sync="dialogSingleVisible" v-loading="whileLoading">
                      <div>
                        <el-row :gutter="10">
                          <el-col :span="6" v-if="instructor">
                            <el-select @change="checkStatus_major"
                                       v-model="signalSelect.selectedMajor"
                                       placeholder="专业选择">
                              <el-option
                                v-for="(major,index) in signalSelect.choice.optionsForMajor"
                                :key="index"
                                :label="major"
                                :value="major">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="6" v-if="instructor">
                            <!--若未选择专业，班级选项无效-->
                            <el-select v-model="signalSelect.selectedClass"
                                       placeholder="班级选择">
                              <el-option
                                v-for="(_class,index) in signalSelect.choice.optionsForClass"
                                :key="index"
                                :label="_class"
                                :value="_class">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="signalSelect.selectedName"
                                      ref="numberInput"
                                      placeholder="请输入姓名"></el-input>
                          </el-col>
                          <el-col :span="4">
                            <el-button v-on:click.native="sendSingleQuery">查询</el-button>
                          </el-col>
                          <el-col :span="4" v-if="monitor">
                            <el-button @click="addAllStu" type="primary">全选</el-button>
                          </el-col>
                        </el-row>
                      </div>
                      <el-tag
                        v-for="(val,index) in signalSelect.selectedSingle"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="deleteObject(index,val[0])"
                        type="info">
                        {{val[1]}}
                      </el-tag>
                      <div>
                        <el-table id="table" :data="signalSelect.studentsData"
                                  style="width: 100%"
                                  v-loading="whileLoading" :stripe="true">
                          <el-table-column prop="stuName" label="姓名" width="100">
                          </el-table-column>
                          <el-table-column prop="major" label="专业">
                          </el-table-column>
                          <el-table-column prop="shortName" label="班级">
                          </el-table-column>
                          <el-table-column prop="stuId" label="学号">
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button size="small" :disabled="scope.row.disabled"
                                         type="info"
                                         @click="addObjects(scope.row.stuId,scope.row.stuName,scope.$index)">
                                添加
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-row>
                          <el-col :offset="20" :span="4">
                            <el-button type="primary" size="small" @click="checkObjects">确认
                            </el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </el-dialog>
                    <!-- 添加班级或者班长dialog -->
                    <el-dialog width="70%" title="添加班级" :visible.sync="dialogClassVisible"
                               v-loading="whileLoading">
                      <el-row>
                        <el-checkbox-group v-model="classSelect.classSelected">
                          <el-col :span="4" v-for="(card,index) in classSelect.classOption"
                                  :key="index">
                            <el-checkbox :label="card" :value="card" border></el-checkbox>
                          </el-col>
                        </el-checkbox-group>
                      </el-row>
                      <el-button type="primary" size="small" @click="checkClass" class="right">
                        确认添加
                      </el-button>
                      <div class="clearfix"></div>
                    </el-dialog>
                    <!-- 添加辅导员管理员dialog -->
                    <el-dialog width="70%" title="添加辅导员" :visible.sync="dialogTeacherVisible"
                               v-loading="whileLoading">
                      <el-row>
                        <el-checkbox-group v-model="teacherSelect.teacherSelected">
                          <el-col :span="4"
                                  v-for="(val,index) in teacherSelect.teacherOption"
                                  :key="index">
                            <el-checkbox :label="val[0]" border>{{val[1]}}</el-checkbox>
                          </el-col>
                        </el-checkbox-group>
                      </el-row>
                      <el-button type="primary" size="small" @click="checkTeacher" class="right">
                        确认添加
                      </el-button>
                      <div class="clearfix"></div>
                    </el-dialog>
                  </el-col>
                </el-row>
                <br><br>
                <el-row :gutter="10">
                  <el-col :span="2">注意事项</el-col>
                  <el-col :span="22">
                    <el-form-item prop="intention">
                      <el-input type="textarea" :autosize="{minRows:5,maxRows:7}"
                                v-model="newcount.intention"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <br><br>
            <div>
              <el-row>
                快捷选项：
              </el-row>
              <el-row>
                <el-button type="primary" plain size="small" v-for="(item,index) in fastOption"
                           @click="addFastOption(item.name,item.realName)" :key="index">{{item.name}}
                </el-button>
              </el-row>
            </div>
            <br><br>
            <div>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-table id="countTable" :data="allCoutData" style="width: 100%"
                            v-loading="whileLoading"
                            :stripe="true" @selection-change="tableSelectionChange">
                    <el-table-column label="序号" type="index" width="50"></el-table-column>
                    <el-table-column label="项目名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.projectName" :disabled="scope.row.isHave"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="项目说明" prop="projectDescription">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.projectDescription" :disabled="scope.row.isHave"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="项目规则">
                      <template slot-scope="scope">
                        <el-button @click="addProjectRules(scope.$index)">添加规则</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="必填项" type="selection" width="55"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="small" type="info" circle icon="el-icon-plus" title="添加"
                                   @click="Addcol(scope.row,scope.$index)"></el-button>
                        <el-button size="small" type="info" circle icon="el-icon-minus" title="删除"
                                   @click="handleDeleteCol(scope.$index)"></el-button>
                        <el-button size="small" type="info" circle icon="el-icon-tickets" title="复制"
                                   @click="handleDuplicateCol(scope.row)"></el-button>
                        <el-button size="small" type="info" circle icon="el-icon-document" title="粘贴"
                                   @click="handlePasteCol(scope.$index)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-button circle class="el-icon-plus" @click="addEmptyCol()"></el-button>
              </el-row>
            </div>

            <el-row :gutter="20">
              <el-col :span="2">
                <el-button size="small" type="primary" @click="Save('create',false)">存为草稿</el-button>
              </el-col>
              <el-col :span="2">
                <el-button size="small" type="primary" @click="Save('create',true)">发布任务</el-button>
              </el-col>
              <el-col :span="2">
                <el-button size="small" type="primary" @click="handleCommand">预 览</el-button>
                <el-dialog title="预览" :visible.sync="previewvisible" width="70%">
                  <dynamic-form :questionnaire="newcount"></dynamic-form>
                </el-dialog>
              </el-col>
            </el-row>
            <div>
              <el-dialog
                title=""
                :visible.sync="dialogVisible"
                width="40%">
                <el-form ref="form_test" :model="select" label-width="130px">

                  <!----  上方的选项  ---->

                  <el-form-item label="选择类型">
                    <el-radio-group v-model="select.type">
                      <el-row type="flex" justify="space-between">
                        <el-col :span="6">
                          <el-radio label="文本" value="文本"></el-radio>
                        </el-col>
                        <el-col :span="6" :offset=1>
                          <el-radio label="单选" value="单选"></el-radio>
                        </el-col>
                        <el-col :span="6" :offset=1>
                          <el-radio label="多选" value="多选"></el-radio>
                        </el-col>
                        <el-col :span="3" :offset=1>
                          <el-radio label="多级下拉菜单" value="多级下拉菜单"></el-radio>
                        </el-col>
                      </el-row>
                    </el-radio-group>
                  </el-form-item>

                  <!----  下方的选项  ---->

                  <!--  选中文本时呈现  -->
                  <el-form-item label="其他规则" v-if="txt_visible">
                    <el-row type="flex">
                      <el-col :span="6">
                        <el-radio v-model="select.otherRule" label="必须填数字" name="rule"></el-radio>
                      </el-col>
                      <el-col :span="6">
                        <el-radio v-model="select.otherRule" label="必须填整数" name="rule"></el-radio>
                      </el-col>
                      <el-col :span="5">
                        <el-radio v-model="select.otherRule" label="必须填数字或字母" name="rule"></el-radio>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="txt_visible && select.otherRule!=='必须填数字'&& select.otherRule!=='必须填整数'">
                    <el-row type="flex">
                      <el-col :span="4">
                        <el-checkbox v-model="select.checked1">最大长度</el-checkbox>
                      </el-col>
                      <el-col :span="13" :offset=2>
                        <el-input v-model.number="select.input1" placeholder=""
                                  :disabled="max_length"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="txt_visible && select.otherRule!=='必须填数字'&& select.otherRule!=='必须填整数'">
                    <el-row type="flex">
                      <el-col :span="4">
                        <el-checkbox v-model="select.checked2">最小长度</el-checkbox>
                      </el-col>
                      <el-col :span="13" :offset=2>
                        <el-input v-model.number="select.input2" placeholder=""
                                  :disabled="min_length"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="txt_visible && (select.otherRule==='必须填数字'||select.otherRule==='必须填整数')">
                    <el-row type="flex">
                      <el-col :span="4">
                        <el-checkbox v-model="select.checked3">最大数值</el-checkbox>
                      </el-col>
                      <el-col :span="13" :offset=2>
                        <el-input v-model.number="select.input3" placeholder=""
                                  :disabled="max_num"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="txt_visible && (select.otherRule==='必须填数字'||select.otherRule==='必须填整数')">
                    <el-row type="flex">
                      <el-col :span="4">
                        <el-checkbox v-model="select.checked4">最小数值</el-checkbox>
                      </el-col>
                      <el-col :span="13" :offset=2>
                        <el-input v-model.number="select.input4" placeholder=""
                                  :disabled="min_num"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!--  选中单选时呈现  -->
                  <el-form-item label="添加选项" v-if="radio_visible">
                    <el-row type="flex">
                      <el-col :span="19">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}"
                                  placeholder="请输入选项"
                                  v-model="select.radio_textarea"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!--  选中多选时呈现  -->
                  <el-form-item label="添加选项" v-if="checkbox_visible">
                    <el-row type="flex">
                      <el-col :span="19">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}"
                                  placeholder="请输入选项"
                                  v-model="select.checkbox_textarea"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!--  选中多级菜单时呈现  -->
                  <el-form-item label="选项级数" v-if="menu_visible">
                    <el-row type="flex">
                      <el-col :span="6" :offset=1>
                        <el-select v-model="select.menu_level" placeholder="2级">
                          <el-option v-for="(item,index) in options" :key="index"
                                     :label="item.label" :value="item.value" @change="selcetedLevelChange">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="menu_visible">
                    <el-row type="flex">
                      <el-col :span="18" :offset=1>
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                                  placeholder="请输入一级选项"
                                  v-model="select.menu1_textarea" @blur="handleFirstLevel"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item label="一级选项" v-if="menu_visible">
                    <el-row type="flex">
                      <el-col :span="6" :offset=1>
                        <el-select v-model="select.firstLevelSelected" placeholder="请选择" @change="firstLevelChange">
                          <el-option
                            v-for="(option,index) in firstLevel"
                            :label="option"
                            :value="option"
                            :key="index">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="menu_visible">
                    <el-row type="flex">
                      <el-col :span="18" :offset=1>
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                                  placeholder="请输入二级选项"
                                  v-model="select.menu2_textarea" @blur="handleSecondLevel"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="二级选项" v-if="three_menu_visible">
                    <el-row type="flex">
                      <el-col :span="6" :offset=1>
                        <el-select v-model="select.secondLevelSelected" placeholder="请选择" @change="secondLevelChange">
                          <el-option
                            v-for="(option,index) in secondLevel"
                            :label="option"
                            :value="option"
                            :key="index">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="" v-if="three_menu_visible">
                    <el-row type="flex">
                      <el-col :span="18" :offset=1>
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                                  placeholder="请输入选项对应的三级选项"
                                  v-model="select.menu3_textarea" @blur="handleThirdLevel"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-row type="flex">
                    <el-col :span="3" :offset=13>
                      <el-button @click="cancelDialog">取 消</el-button>
                    </el-col>
                    <el-col :span="3" :offset=1>
                      <el-button type="primary" @click="submit">确 定</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-dialog>
            </div>
          </el-tab-pane>
          <el-tab-pane label="草稿" name="draft">
            <el-table :data="countList.data" style="width:100%;" :stripe="true" :v-loading="whileLoading">
              <el-table-column
                label="统计任务名称">
                <template slot-scope="scope">
                  <a @click="reWrite(scope.row.id)">{{scope.row.name}}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="开始时间">
              </el-table-column>
              <el-table-column
                prop="endTime"
                label="结束时间">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="deleteDraft(scope.$index,scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleCountListSizeChange"
              @current-change="handleCountListCurrentChange"
              :current-page="countList.currentPage"
              :page-sizes="[20, 50, 100]"
              :page-size="countList.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="countList.recordQuantity">
            </el-pagination>

          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dynamicForm from "@/components/element/dynamicForm"

  export default {
    name: "newcount",
    components: {
      dynamicForm
    },
    data() {
      return {
        instructor: false,
        monitor: false,
        tabsValue: 'add',
        countList: {
          currentPage: 1,
          pageSize: 20,
          recordQuantity: 0,
          data: []
        },
        memberSelected: '全部学生',
        prioritySelected: '',
        objectRange: '我分管的',
        //用于标记是由特权用户还是统计对象出发的dialog
        isPriorityDialog: true,
        newcount: {
          name: "",
          createDate: "",
          createTime: "",
          finishDate: "",
          finishTime: "",
          intention: "",
          priorityUsers: {},//特权用户
          statsObjects: {},
          statsData: [],
          preSetMessage: []
        },

        inputRules: {
          name: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          createDate: [{
            required: true, message: '请选择开始日期', trigger: 'blur'
          }],
          createTime: [{
            required: true, message: '请选择开始时间', trigger: 'blur'
          }],
          finishDate: [
            {required: true, message: '请选择结束日期', trigger: 'blur'}
          ],
          finishTime: [{
            required: true, message: '请选择开始时间', trigger: 'blur'
          }],
          labels: [
            {required: true, message: '请选择合适的标签', trigger: 'blur'}
          ]
        },

        allCoutData: [],

        signalSelect: {
          selectedMajor: '',
          selectedClass: '',
          choice: {
            optionsForMajor: [],
            optionsForClass: []
          },
          studentsData: [],
          selectedSingle: [],
          selectedName: "",
        },
        classSelect: {
          classOption: [],
          classSelected: []
        },
        teacherSelect: {
          teacherOption: [],
          teacherSelected: []
        },
        //复制的项目名称
        copyCount: "",
        fastOption: [
          {realName: "stu_class", name: "班级"},
          {realName: "stu_id", name: "学号"},
          {realName: "stu_name", name: "姓名",},
          {realName: "sex", name: "性别",},
          {realName: "phone", name: "电话",},
          {realName: "nation", name: "民族",},
          {realName: "province", name: "省份",},
          {realName: "hometown", name: "籍贯",},
          {realName: "dorm", name: "寝室楼栋",},
          {realName: "door", name: "宿舍号",},
          {realName: "major", name: "专业",},
          {realName: "id_card_no", name: "身份证号码",},
          {realName: "qq", name: "QQ号",},
          {realName: "home_add", name: "家庭住址",},
          {realName: "dad_name", name: "父亲姓名",},
          {realName: "dad_phone", name: "父亲电话",},
          {realName: "mom_name", name: "母亲姓名",},
          {realName: "mom_phone", name: "母亲电话",},
          {realName: "po_status", name: "政治面貌",},
          {realName: "cadre", name: "班级干部"}
        ],
        dialogVisible: false,
        editeRulesIndex: "",//正在编辑的规则的编号
        txt_visible: true,
        radio_visible: false,
        menu_visible: false,
        three_menu_visible: false,
        checkbox_visible: false,
        type_txt: true,
        type_radio: false,
        type_checkbox: false,
        type_menu: false,
        max_length: true,
        min_length: true,
        max_num: true,
        min_num: true,
        options: [{
          value: '2级',
          label: '2级'
        }, {
          value: '3级',
          label: '3级'
        }],

        select: {
          type: "文本",
          otherRule: "",
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
          input1: '',
          input2: '',
          input3: '',
          input4: '',
          firstLevelSelected: "",
          secondLevelSelected: "",
          radio_textarea: '',
          checkbox_textarea: '',
          menu1_textarea: '',
          menu2_textarea: '',
          menu3_textarea: '',
          menu_level: '2级',
          questionOption: [],
        },
        previewvisible: false,
        whileLoading: false,
        selectedName: "",
        ChoiceForRange: ["个人", "班级", "全部班长", "全部学生"],
        ChoiceForPriority: ["个人", "所有班长", "班长", "辅导员"],
        //        添加对象模态框
        dialogSingleVisible: false,
        dialogClassVisible: false,
        dialogTeacherVisible: false,
      }
    },
    computed: {
      firstLevel() {
        let string = this.select.menu1_textarea;
        string.trim();
        return string.split("\n");
      },
      secondLevel() {
        let string = this.select.menu2_textarea;
        string.trim();
        return string.split("\n");
      },
    },
    created() {
      this.instructor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('辅导员') >= 0;
      this.monitor = JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0;
      //提前获取专业，班级信息
      if (this.instructor) {
        this.getOptions_basic();
      }
    },
    methods: {
      deleteDraft(index, id) {
        console.log(index);
        this.$axios.post('sm/statsDelete', {taskId: id})
          .then(
            response => {
              if (response.data.status === 0) {

                this.countList.data.splice(index, 1);
                this.$message.success("删除统计任务成功");
              } else {
                this.$message.error("出现了一些奇怪的问题，请稍后再试");
              }
            }
          )
      },
      handleCountListSizeChange(val) {
        this.countList.pageSize = val;
        this.sendCountDataQuery();
      },
      handleCountListCurrentChange(val) {
        this.countData.pageSize = val;
        this.sendCountDataQuery();
      },
      Save(fromName, value) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            //判断统计对象是否为空
            if (!this.memberSelected && value) {
              this.$message.warning('请选择统计对象');
              return
            }
            //判断项目是否为空
            if (!this.allCoutData.length && value) {
              this.$message.warning('不能发表空的统计任务');
              return
            }
            this.newcount.preSetMessage = [];
            this.newcount.statsData = [];
            let loopTimes = this.allCoutData.length;
            for (let i = 0; i < loopTimes; ++i) {
              if (this.allCoutData[i].isHave) {
                this.newcount.preSetMessage.push(this.allCoutData[i].realName)
              } else {
                this.newcount.statsData.push(this.allCoutData[i]);
              }
            }
            //清空现有统计列表
            this.allCoutData = [];

            //判断发送对象的type
            switch (this.memberSelected) {
              case '个人':
                this.newcount.statsObjects.type = 0;
                break;
              case '班级':
                this.newcount.statsObjects.type = 1;
                break;
              case '全部班长':
                this.newcount.statsObjects = {};
                this.newcount.statsObjects.type = 2;
                this.newcount.statsObjects.members = [];
                break;
              case '全部学生':
                this.newcount.statsObjects = {};
                this.newcount.statsObjects.type = 3;
                this.newcount.statsObjects.members = [];
                break;
              default:
                this.newcount.statsObjects.members = [];
            }
            //清空统计对象
            this.memberSelected = '';
            //统计队伍不存在辅导员
            this.newcount.statsObjects.insIds = [];

            switch (this.prioritySelected) {
              case '个人':
                this.newcount.priorityUsers.type = 0;
                break;
              case '班长':
                this.newcount.priorityUsers.type = 1;
                break;
              case '所有班长':
                this.newcount.priorityUsers = {};
                this.newcount.priorityUsers.type = 2;
                this.newcount.priorityUsers.members = [];
                break;
              default:
                this.newcount.priorityUsers.members = [];
            }
            //清空特权用户
            this.prioritySelected = '';

            if (!this.newcount.priorityUsers.insIds) {
              this.newcount.priorityUsers.insIds = [];
            }

            //特权用户不存在选择范围
            this.newcount.priorityUsers.mine = '';

            //判断统计对象选择的范围
            this.newcount.statsObjects.mine = this.objectRange !== '所有学生';

            this.objectRange = '所有学生';

            let postData = this.newcount;
            //将newCount进行重置
            this.newcount = {
              name: "",
              createDate: "",
              createTime: "",
              finishDate: "",
              finishTime: "",
              intention: "",
              priorityUsers: {},//特权用户
              statsObjects: {},
              statsData: [],
              preSetMessage: []
            };
            postData.statsData = JSON.stringify(postData.statsData);
            if (value) {
              if (postData.taskId) {
                postData.status = 'modifiedSubmit';
              } else {
                postData.status = 'submit';
              }
            } else {
              if (postData.taskId) {
                postData.status = 'modifiedSaving';
              } else {
                postData.status = 'saving';
              }
            }
            this.$axios.post("sm/newStats", postData)
              .then(
                response => {
                  if (response.data.status === 0) {
                    this.$message.success('创建统计任务成功');
                  }
                  console.log(response.data.message);
                }
              )
          } else {
            console.log('error submit');
            return false;
          }
        });
      },

      //根据获取到的信息重现统计任务
      reWrite(id) {
        this.$axios.post('sm/getStats', {id: id}).then(
          response => {
            if (response.data.status === 0) {
              let countData = response.data.data;
              //复原时间
              this.newcount.createDate = countData.createDate;
              this.newcount.createTime = countData.createTime;
              this.newcount.finishDate = countData.finishDate;
              this.newcount.finishTime = countData.finishTime;
              //复原注意事项
              this.intention = countData.intention;

              countData.statsData = JSON.parse(countData.statsData);
              countData.statsObjects = JSON.parse(countData.statsObjects);
              countData.priorityUsers = JSON.parse(countData.priorityUsers);

              this.objectRange = countData.statsObjects.mine ? '我分管的学生' : '所有学生';
              //复原特权用户选择
              switch (countData.priorityUsers.type) {
                case 0:
                  this.prioritySelected = '个人';
                  break;
                case 1:
                  this.prioritySelected = '班长';
                  break;
                case 2:
                  this.prioritySelected = '所有班长';
                  break;
                default:
                  this.prioritySelected = '';
              }

              if (countData.priorityUsers.insIds && countData.priorityUsers.insIds.length > 0) {
                this.prioritySelected = '辅导员';
              }
              //复原统计对象选择
              switch (countData.statsObjects.type) {
                case 0:
                  this.memberSelected = '个人';
                  break;
                case 1:
                  this.memberSelected = '班级';
                  break;
                case 2:
                  this.memberSelected = '全部班级';
                  break;
                case 3:
                  this.memberSelected = '全部学生';
                  break;
                default:
                  this.memberSelected = '';
              }

              this.allCoutData = countData.statsData;
              countData.preSetMessage = countData.preSetMessage ? countData.preSetMessage.split(',') : '';
              let loopTimes = countData.preSetMessage.length;
              for (let i = 0; i < loopTimes; ++i) {
                this.allCoutData.push({
                  projectName: countData.preSetMessage[i],
                  projectDescription: countData.preSetMessage[i],
                  projectRules: {
                    rules: [],
                    type: "text",
                    value: ""
                  },
                  required: false,
                  isHave: true,
                });
              }
              this.newcount = countData;
              delete this.newcount.id;
              this.newcount.taskId = id;
              this.tabsValue = 'add';
            } else {
              this.$message.error('查询数据时出现了一些问题，请稍后重试');
            }
          }
        )
      },
      sendCountListQuery() {
        this.whileLoading = true;
        let postData = {};
        postData.currentPage = this.countList.currentPage;
        postData.pageSize = this.countList.pageSize;
        postData.status = 'saving';
        if (this.monitor) {
          postData.identity = 'monitor';
        }
        this.$axios.post("sm/StatsList", postData)
          .then(
            response => {
              if (response.data.status === 0) {
                this.countList.recordQuantity = response.data.data.recordQuantity;
                this.countList.data = [];
                let loopTime = response.data.data.countList.length;
                for (let i = 0; i < loopTime; i++) {
                  let item = {
                    id: response.data.data.countList[i].id,
                    name: response.data.data.countList[i].name,
                    status: response.data.data.countList[i].status,
                    startTime: response.data.data.countList[i].startDate + " " + response.data.data.countList[i].startTime,
                    endTime: response.data.data.countList[i].endDate + " " + response.data.data.countList[i].endTime
                  };
                  this.countList.data.push(item);
                }
              }
              this.whileLoading = false;
            }
          )
      },
      tabChange(val) {
        if (val.name === 'draft') {
          this.tabsValue = val.name;
          this.sendCountListQuery();
        }
      },
      selcetedLevelChange(value) {
        if (value === "2级") {
          let loopTimes = this.select.questionOption.length;
          for (let i = 0; i < loopTimes; ++i) {
            let loopTimes = this.slect.questionOption[i].children.length;
            for (let j = 0; j < loopTimes; ++j) {
              this.select.questionOption[i].children[j].children = [];
            }
          }
        }
      },
      firstLevelChange(value) {
        let loopTimes = this.select.questionOption.length;
        for (let i = 0; i < loopTimes; ++i) {
          if (this.select.questionOption[i].label === value) {
            let children = this.select.questionOption[i].children;
            let loopTimes = children.length;
            let string = "";
            for (let j = 0; j < loopTimes; ++j) {
              string = string + children[j].value + "\n";
            }
            this.select.menu2_textarea = string;
            return;
          }
        }
      },
      secondLevelChange(value) {
        let loopTimes = this.select.questionOption.length;
        for (let i = 0; i < loopTimes; ++i) {
          if (this.select.questionOption[i].label === this.select.firstLevelSelected) {
            let loopTimes = this.select.questionOption[i].children.length;
            for (let j = 0; j < loopTimes; ++j) {
              if (this.select.questionOption[i].children[j].label === value) {
                let children = this.select.questionOption[i].children[j].children;
                let loopTimes = children.length;
                let string = "";
                for (let k = 0; k < loopTimes; ++k) {
                  string = string + children[k].value + "\n";
                }
                this.select.menu3_textarea = string;
                return;
              }
            }
          }
        }
      },
      handleFirstLevel() {
        this.select.menu1_textarea.trim();
        let firstLevelOption = this.select.menu1_textarea.split("\n");
        let loopTimes = firstLevelOption.length;
        for (let i = 0; i < loopTimes; ++i) {
          let option = {
            value: firstLevelOption[i],
            label: firstLevelOption[i],
          };
          this.select.questionOption.push(option);
        }
      },
      handleSecondLevel() {

        let loopTimes = this.select.questionOption.length;
        for (let i = 0; i < loopTimes; ++i) {
          if (this.select.firstLevelSelected === this.select.questionOption[i].value) {
            this.select.menu1_textarea.trim();
            let secondLevelOption = this.select.menu2_textarea.split("\n");
            let loopTimes = secondLevelOption.length;
            this.select.questionOption[i].children = [];
            for (let j = 0; j < loopTimes; ++j) {
              let option = {
                value: secondLevelOption[j],
                label: secondLevelOption[j],
              };
              this.select.questionOption[i].children.push(option);
            }
            return;
          }
        }
      },
      handleThirdLevel() {
        let loopTimes = this.select.questionOption.length;
        for (let i = 0; i < loopTimes; ++i) {
          if (this.select.firstLevelSelected === this.select.questionOption[i].value) {
            let loopTimes = this.select.questionOption[i].children.length;
            for (let j = 0; j < loopTimes; ++j) {
              if (this.select.secondLevelSelected === this.select.questionOption[i].children[j].value) {
                this.select.menu3_textarea.trim();
                let thirdLevelOption = this.select.menu3_textarea.split("\n");
                let loopTimes = thirdLevelOption.length;
                this.select.questionOption[i].children[j].children = [];
                for (let k = 0; k < loopTimes; ++k) {
                  let option = {
                    value: thirdLevelOption[k],
                    label: thirdLevelOption[k],
                  };
                  this.select.questionOption[i].children[j].children.push(option);
                }
                return;
              }
            }
          }
        }
      },

      addFastOption(name, realName) {
        let item = {
          projectName: name,
          realName: realName,
          projectDescription: "请输入" + name,
          projectRules: [],
          isHave: true
        };
        this.allCoutData.push(item);
      },
      addObjects(number, name, i) {
        if (!Array.isArray(this.signalSelect.selectedSingle)) {
          this.signalSelect.selectedSingle = [];
        }
        this.signalSelect.selectedSingle.push([number, name]);
        this.signalSelect.studentsData[i].disabled = true;

      },

      //班长全选班级所有学生
      addAllStu() {
        this.signalSelect.selectedSingle = [];
        for (let i = 0; i < this.signalSelect.studentsData.length; i++) {
          this.addObjects(this.signalSelect.studentsData[i].stuId, this.signalSelect.studentsData[i].stuName, i);
        }
      },
      deleteObject(index, id) {
        this.signalSelect.selectedSingle.splice(index, 1);
        for (let i = 0; i < this.signalSelect.studentsData.length; i++) {
          if (this.signalSelect.studentsData[i].stuId === id) {
            this.signalSelect.studentsData[i].disabled = false;
            break
          }
        }
      },
      sendSingleQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        dict.major = this.signalSelect.selectedMajor;
        dict.shortName = this.signalSelect.selectedClass;
        dict.stuName = this.signalSelect.selectedName;

        //发送请求
        this.$axios.post('/sm/stuInfoGet', dict).then(response => {
          if (response.data.status === 0) {
            this.signalSelect.studentsData = response.data.data;
            let arrayLength = this.signalSelect.selectedSingle.length;
            for (let i = 0; i < response.data.data.length; i++) {
              this.$set(this.signalSelect.studentsData[i], 'disabled', false);
              for (let j = 0; j < arrayLength; j++) {
                if (response.data.data[i].stuId === this.signalSelect.selectedSingle[j][0]) {
                  this.signalSelect.studentsData[i].disabled = true;
                  break;
                }

              }
            }
          }
        }).finally(() => {
          this.whileLoading = false;
        });
      },

      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(
          res => {
            this.signalSelect.choice.optionsForMajor = res.data.data;
            this.signalSelect.selectedMajor = this.signalSelect.choice.optionsForMajor[0];
            this.getOptionsForClass();
          }
        );
      },

      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.signalSelect.selectedMajor}}).then(
          res => {
            this.signalSelect.choice.optionsForClass = res.data.data;
            this.signalSelect.selectedClass = this.signalSelect.choice.optionsForClass[0];
          });
      },

      //显示个人选择dialog
      showSingleDialog() {
        this.dialogSingleVisible = true;
        this.whileLoading = true;
        let postData = {};
        postData.major = this.signalSelect.selectedMajor;
        postData.shortName = this.signalSelect.selectedClass;
        postData.stuName = '';
        if (this.isPriorityDialog) {
          this.signalSelect.selectedSingle = this.newcount.priorityUsers.members ? this.newcount.priorityUsers.members : [];
        }
        else {
          this.signalSelect.selectedSingle = this.newcount.statsObjects.members ? this.newcount.statsObjects.members : [];
        }

        //发送请求
        this.$axios.post("sm/stuInfoGet", postData)
          .then(
            ref => {
              if (ref.data.status === 0) {
                this.signalSelect.studentsData = ref.data.data;
                let arrayLength = this.signalSelect.selectedSingle.length;
                for (let i = 0; i < ref.data.data.length; ++i) {
                  this.$set(this.signalSelect.studentsData[i], 'disabled', false);
                  for (let j = 0; j < arrayLength; ++j) {
                    if (ref.data.data[i].stuId === this.signalSelect.selectedSingle[j][0]) {
                      this.signalSelect.studentsData[i].disabled = true;
                      break;
                    }
                  }
                }
              }
            }
          ).catch(
          err => {
            console.error(err);
          }
        ).finally(() => this.whileLoading = false);
      },

      //显示班级选择dialog
      showClassDialog() {
        this.dialogClassVisible = true;
        this.whileLoading = true;
        this.$axios.post('sm/classcards', {}).then(
          res => {
            if (res.data.status === 0) {
              this.classSelect.classOption = res.data.data.shortName;
              this.whileLoading = false;
            }
          }).catch(err => {
          console.error(err);
        }).finally(() => this.whileLoading = false);
      },

      //显示辅导员选择dialog
      showCounselorDialog() {
        this.dialogTeacherVisible = true;
        this.whileLoading = true;
        this.$axios.get('sm/classManage/peerTeacher').then(
          res => {
            if (res.data.status === 0) {
              this.teacherSelect.teacherOption = res.data.data;
              let IDNumber = JSON.parse(sessionStorage.getItem("user")).IDNumber;
              for (let i = 0; i < this.teacherSelect.teacherOption.length; i++) {
                if (this.teacherSelect.teacherOption[i][0] === IDNumber) {
                  this.teacherSelect.teacherOption.splice(i, 1);
                  break;
                }
              }
            }
          }).catch(err => {
          console.error(err);
        }).finally(() => this.whileLoading = false);
      },

      //统计对象选择变化后调用不同的dialog
      memberDialogChange: function (value) {
        this.memberSelected = value;
        this.isPriorityDialog = false;
        if (value === "个人") {
          this.showSingleDialog();
        } else if (value === "班级") {
          this.showClassDialog();
        }
      },
      //特权用户选择变化后调用不同的dialog
      priorityDialogChange(value) {
        this.prioritySelected = value;
        this.isPriorityDialog = true;
        if (value === "个人") {
          this.showSingleDialog();
        } else if (value === "班长") {
          this.showClassDialog();
        } else if (value === "辅导员") {
          this.showCounselorDialog();
        }
      },


      addProjectRules(index) {
        //重现统计规则
        let projectRules = this.allCoutData[index].projectRules;
        if (projectRules.type === 'text') {
          this.select.type = '文本';
          for (let i = 0; i < projectRules.rules.length; i++) {
            if (projectRules.rules[i].type === 'number') {
              this.select.otherRule = '必须填数字';
            } else if (projectRules.rules[i].type === 'int') {
              this.select.otherRule = '必须填整数';
            } else if (projectRules.rules[i].type === 'numberOrLetter') {
              this.select.otherRule = '必须填数字或字母';
            } else {
              if (projectRules.rules[i].message) {
                if (projectRules.rules[i].message.indexOf('最大输入长度为') >= 0) {
                  let maxLength = parseInt(projectRules.rules[i].message.replace(/[^0-9]/ig, ""));
                  this.select.checked1 = true;
                  this.select.input1 = maxLength;
                } else if (projectRules.rules[i].message.indexOf('最小输入长度为') >= 0) {
                  let minLength = parseInt(projectRules.rules[i].message.replace(/[^0-9]/ig, ""));
                  this.select.checked2 = true;
                  this.select.input2 = minLength;
                }
              } else {
                if (projectRules.rules[i].type === 'maxNumber') {
                  this.select.input3 = projectRules.rules[i].maxNumber;
                  this.select.checked3 = true;
                } else if (projectRules.rules[i].type === 'minNumber') {
                  this.select.input4 = projectRules.rules[i].minNumber;
                  this.select.checked4 = true;
                }
              }
            }
          }
        } else if (projectRules.type === 'radio') {
          this.select.type = '单选';
          this.select.radio_textarea = projectRules.questionOption.join("\n");
        } else if (projectRules.type === 'checkbox') {
          this.select.type = '多选';
          this.select.checkbox_textarea = projectRules.questionOption.join("\n");
        } else if (projectRules.type === 'cascader') {
          this.select.type = '多级下拉菜单';
          this.select.questionOption = projectRules.questionOption;
        }

        this.dialogVisible = true;
        this.editeRulesIndex = index;
      },


      //加一行
      Addcol(row, index) {
        this.allCoutData.splice(index + 1, 0, JSON.parse(JSON.stringify(row)));
      },
      //添加空白行
      addEmptyCol() {
        let item = {
          projectName: "",
          projectDescription: "",
          projectRules: {
            rules: [],
            type: "text",
            value: ""
          },
          required: false,
          isHave: false,
        };
        this.allCoutData.push(item);
      },
      handleDeleteCol(index) {
        this.allCoutData.splice(index, 1);
      },
      handleDuplicateCol(row) {
        this.copyCount = JSON.parse(JSON.stringify(row));
      },
      handlePasteCol(index) {
        this.allCoutData.splice(index + 1, 0, this.copyCount);
      },

      //选择专业后拉取该专业下的班级
      checkStatus_major() {
        this.getOptionsForClass();
      },
      //检测并保存个人选择结果
      checkObjects() {
        if (this.signalSelect.selectedSingle.length === 0)
          this.$message.error("请选择具体统计对象");
        else {
          this.$message.success("选择对象成功");
          if (this.isPriorityDialog) {
            this.newcount.priorityUsers.members = this.signalSelect.selectedSingle;
          } else {
            this.newcount.statsObjects.members = this.signalSelect.selectedSingle;
          }
          this.dialogSingleVisible = false;
        }
      },
      //检测并保存班级班长选择结果
      checkClass() {
        if (this.classSelect.classSelected.length === 0)
          this.$message.error("请选择班级");
        else {
          if (this.isPriorityDialog) {
            this.newcount.priorityUsers.members = this.classSelect.classSelected;
          } else {
            this.newcount.statsObjects.members = this.classSelect.classSelected;
          }
          this.$message.success("选择班级成功");
          this.dialogClassVisible = false;
        }
      },
      //检测并选择辅导员选择结果
      checkTeacher() {
        if (this.teacherSelect.teacherSelected.length === 0)
          this.$message.error("请选择辅导员");
        else {
          this.newcount.priorityUsers.insIds = this.teacherSelect.teacherSelected;
          console.dir(this.newcount.priorityUsers.insIds);
          this.$message.success("选择辅导员成功");
          this.dialogTeacherVisible = false;
        }
      },
      tableSelectionChange(selection) {
        let selectLength = selection.length;
        let countLength = this.allCoutData.length;
        for (let i = 0; i < selectLength; ++i) {
          for (let j = 0; j < countLength; ++j) {
            this.allCoutData[j].required = selection[i] === this.allCoutData[j];
          }
        }
        console.log(this.allCoutData);
      },
      // handleRemove(file, fileList) {
      //   console.log(file, fileList);
      // },
      // handlePreview(file) {
      //   console.log(file);
      // },
      handleCommand() {
        this.newcount.preSetMessage = [];
        this.newcount.statsData = [];
        let loopTimes = this.allCoutData.length;
        for (let i = 0; i < loopTimes; ++i) {
          if (this.allCoutData[i].isHave) {
            this.newcount.preSetMessage.push(this.allCoutData[i].realName)
          } else {
            this.newcount.statsData.push(this.allCoutData[i]);
          }
        }
        // console.log(this.newcount);
        // console.log(this.allCoutData);
        this.previewvisible = true;
      },
      //取消设置表单规则
      cancelDialog() {
        //重置设置规则dialog
        this.select = {
          type: "文本",
          otherRule: "",
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
          input1: '',
          input2: '',
          input3: '',
          input4: '',
          firstLevelSelected: "",
          secondLevelSelected: "",
          radio_textarea: '',
          checkbox_textarea: '',
          menu1_textarea: '',
          menu2_textarea: '',
          menu3_textarea: '',
          menu_level: '2级',
          questionOption: [],
        };
        this.txt_visible = true;
        this.radio_visible = false;
        this.menu_visible = false;
        this.three_menu_visible = false;
        this.checkbox_visible = false;
        this.type_txt = true;
        this.type_radio = false;
        this.type_checkbox = false;
        this.type_menu = false;
        this.max_length = true;
        this.min_length = true;
        this.max_num = true;
        this.min_num = true;
        this.dialogVisible = false;
      },
      //根据选择设置表单规则
      submit: function () {
        let projectRules = this.allCoutData[this.editeRulesIndex].projectRules;
        let type = this.select.type;
        if ("文本" === type) {
          projectRules.type = "text";
          projectRules.value = "";
          let rules = [];
          if ("必须填数字" === this.select.otherRule) {
            let rule = {type: 'number', message: '必须输入数字', trigger: 'blur'};
            rules.push(rule);
          } else if ("必须填整数" === this.select.otherRule) {
            rule = {
              type: 'int'
            };
            rules.push(rule);
          } else if ("必须填数字或字母" === this.select.otherRule) {
            let rule = {
              type: 'numberOrLetter'
            };
            rules.push(rule);
          }
          if (this.select.checked1) {
            let rule = {max: this.select.input1, message: '最大输入长度为' + this.select.input1, trigger: 'blur'};
            rules.push(rule);
          }
          if (this.select.checked2) {
            let rule = {min: this.select.input2, message: '最小输入长度为' + this.select.input2, trigger: 'blur'};
            rules.push(rule);
          }
          if (this.select.checked3) {
            let rule = {
              type: 'maxNumber',
              maxNumber: this.select.input3
            };
            rules.push(rule);
          }
          if (this.select.checked4) {
            let rule = {
              type: 'minNumber',
              minNumber: this.select.input4
            };
            rules.push(rule);
          }
          projectRules.rules = rules;
        } else if ("单选" === type) {
          projectRules.type = "radio";
          projectRules.questionOption = this.select.radio_textarea.split("\n");
          projectRules.value = "";
          projectRules.rules = [];
        } else if ("多选" === type) {
          projectRules.type = "checkbox";
          projectRules.questionOption = this.select.checkbox_textarea.split("\n");
          projectRules.value = [];
          projectRules.rules = [];
        } else if ("多级下拉菜单" === type) {
          projectRules.type = "cascader";
          projectRules.questionOption = this.select.questionOption;
          projectRules.rules = [];
        }
        //重置设置规则dialog
        this.cancelDialog();
      }

    },
    watch: {
      'select.type': function (value) {
        switch (value) {
          case "文本": {
            this.txt_visible = true;
            this.radio_visible = false;
            this.checkbox_visible = false;
            this.menu_visible = false;
            this.three_menu_visible = false;
            break;
          }
          case "单选": {
            this.txt_visible = false;
            this.radio_visible = true;
            this.checkbox_visible = false;
            this.menu_visible = false;
            this.three_menu_visible = false;
            break;
          }
          case "多选": {
            this.txt_visible = false;
            this.radio_visible = false;
            this.checkbox_visible = true;
            this.menu_visible = false;
            this.three_menu_visible = false;
            break;
          }
          case "多级下拉菜单": {
            this.txt_visible = false;
            this.radio_visible = false;
            this.checkbox_visible = false;
            this.menu_visible = true;
            this.three_menu_visible = (this.select.menu_level !== "2级");
            break;
          }
        }
      },
      'select.menu_level': function (level) {
        this.three_menu_visible = level !== "2级";
      },
      'select.checked1': function (value) {
        if (value === true) {
          this.max_length = false;
        }
        else {
          this.select.input1 = "";
          this.max_length = true;
        }
      },
      'select.checked2': function (value) {
        if (value === true) {
          this.min_length = false;
        }
        else {
          this.select.input2 = "";
          this.min_length = true;
        }
      },
      'select.checked3': function (value) {
        if (value === true) {
          this.max_num = false;
        }
        else {
          this.select.input3 = "";
          this.max_num = true;
        }
      },
      'select.checked4': function (value) {
        if (value === true) {
          this.min_num = false;
        }
        else {
          this.select.input4 = "";
          this.min_num = true;
        }
      }
    }
  }
</script>

<style scoped>
  .block {
    float: right;
  }
</style>
