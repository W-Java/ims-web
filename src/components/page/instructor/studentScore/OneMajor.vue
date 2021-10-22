<template>
  <!--这里写内容-->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'comprehensive'}">综合测评</el-breadcrumb-item>
      <el-breadcrumb-item>{{selectedYear}}<span v-if="!myclass">班级互审</span></el-breadcrumb-item>
    </el-breadcrumb>
    <p style="color: #c0c4cc;" v-if="!monitor">*提示：点击“不通过”将加分项驳回给班长，班长修改、提交后需要您进行再次审核；驳回记录可在“不通过记录”中查看。</p><br>
    <p style="color: #c0c4cc;" v-if="monitor">*提示：点击“不通过”按钮将加分项驳回给原班班长，原班班长修改后需要您进行再次审核。</p><br>
    <!--筛选-->
    <div>
      <el-row>
        <el-col :span="4" v-if="!monitor">
          <el-select v-model="selectedMajor"
                     @change="handleSelectedMajor"
                     placeholder="专业选择">
            <el-option v-for="major in choice.optionsForMajor"
                       :key="major"
                       :label="major"
                       :value="major">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="!monitor">
          <el-select v-model="selectedClass"
                     :disabled="classSelectionDisabled"
                     @change="handleSelectedClass"
                     placeholder="所有班级">
            <el-option v-for="_class in optionsForClass"
                       :key="_class"
                       :label="_class"
                       :value="_class">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="checkMapping!=='SECONDCHECKING'&&checkMapping!=='THIRDCHECKING'">
          <el-container>
            <el-input :disabled="classSelectionDisabled" v-model="scoreLowerBound" @change="handleSelectedScore"
                      placeholder="综测分数下界" ref="inputLowerBound"></el-input>
            <div style="align-items: center;line-height: 240%;">
              <i class="el-icon-minus"></i>
            </div>
            <el-input :disabled="classSelectionDisabled" v-model="scoreUpperBound" @change="handleSelectedScore"
                      placeholder="综测分数上界" ref="inputUpperBound"></el-input>
          </el-container>
        </el-col>
        <el-col :span="4" v-if="checkMapping!=='SECONDCHECKING'&&checkMapping!=='THIRDCHECKING'">
          <el-select :disabled="classSelectionDisabled" v-model="selectedScoreSegment" @change="setScoreSegment"
                     placeholder="综测分数段选择">
            <el-option v-for="segment in scoreSegment"
                       :key="segment"
                       :label="segment"
                       :value="segment">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="!monitor&&newYear&&checkMapping!=='PUBLICING'">
          <el-button type="primary" @click="checkNotPass">不通过记录</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table ref="bigTable" id="table"
              :data="comprehensiveData"
              style="width: 100%"
              v-loading="whileLoading"
              :stripe="stripeOn"
              @selection-change="handleSelectionChange"
              @sort-change="sortGrades">
      <el-table-column v-if="((newYear&&!monitor)||!myclass)&&checkMapping!=='PUBLICING'&&checkMapping!=='CLOSED'"
                       type="selection"
                       width="45"></el-table-column>
      <el-table-column v-if="((newYear&&!monitor)||!myclass)&&checkMapping!=='PUBLICING'" width="80">
        <template slot-scope="scope">
          <span class="daishenhe">{{scope.row.state}}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item style="width: 100%">
              <!--班长看自己班的同学综测+辅导员查看（操作）-->
              <el-table v-if="myclass" :data="comprehensiveData[props.$index].addGroup" style="width: 100%">
                <!--<el-table-column v-if="newYear" type="selection" width="45"></el-table-column>-->
                <el-table-column v-if="newYear&&!monitor" width="80">
                  <template slot-scope="scope">
                    <span class="daishenhe">{{scope.row.stateName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score_kind" width="180" label="加分类别"></el-table-column>
                <el-table-column label="加分名称">
                  <template slot-scope="scope">
                    <div style="cursor:pointer;" @click="changeVisible(scope.row)">
                      <div v-for="name in scope.row.names">{{name}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="80" label="分值" prop="score"></el-table-column>
                <el-table-column v-if="newYear&&!monitor&&checkMapping!=='PUBLICING'">
                  <template slot-scope="scope">
                    <div v-if="scope.row.states">
                      <el-button type="success" size="small"
                                 @click="passOneKind(scope.row)">通过
                      </el-button>
                      <el-button type="danger" size="small" @click="notPassOne(scope.row)">不通过</el-button>
                      <el-button type="warning" size="small" @click="changeVisible(scope.row)">修改</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!--班级互审-->
              <el-table class="no-header" v-else :data="comprehensiveData[props.$index].addGroup" style="width: 100%">
                <el-table-column label="类别" width="120" prop="score_kind"></el-table-column>
                <el-table-column label="分值" width="50" prop="all_score"></el-table-column>
                <el-table-column label="项目">
                  <template slot-scope="scope">
                    <el-table :data="scope.row.records">
                      <el-table-column width="80">
                        <template slot-scope="scope">
                          <span class="daishenhe" v-if="scope.row.status==='FIRSTPASS'">待审核</span>
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template slot-scope="scope">
                          <span v-if="scope.row.contestKind!=='null'&&scope.row.contestKind!==null">{{scope.row.contestKind}}</span>
                          <span v-if="scope.row.contestLevel!=='null'&&scope.row.contestLevel!==null">{{scope.row.contestLevel}}</span>
                          <span
                            v-if="scope.row.itemLevel!=='null'&&scope.row.itemLevel!==null">{{scope.row.itemLevel}}</span>
                          {{scope.row.itemName}}
                        </template>
                      </el-table-column>
                      <el-table-column width="50" prop="score"></el-table-column>
                      <el-table-column width="200">
                        <template slot-scope="scope">
                          <span v-if="scope.row.imgUrl===null">暂无证明</span>
                          <img v-else class="scoreImg" @click="checkPic(scope.row.imgUrl)"
                               v-bind:src="scope.row.imgUrl"/>
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template slot-scope="scope">
                          <div v-if="scope.row.status==='FIRSTPASS'">
                            <el-button type="success" size="small"
                                       @click="passOneKind(scope.row)">通过
                            </el-button>
                            <el-button type="danger" size="small" @click="notPassOne(scope.row)">不通过</el-button>
                          </div>
                          <div class="state" v-else><span>{{scope.row.stateName}}</span><span
                            v-if="scope.row.status==='UNCHECKED'">&nbsp;&nbsp;&nbsp;驳回理由：{{scope.row.reason}}</span>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="myclass&&(checkMapping==='PUBLICING'||checkMapping==='CLOSED')" label="综测专业排名"
                       prop="compreRank"></el-table-column>
      <el-table-column v-if="myclass&&(checkMapping==='PUBLICING'||checkMapping==='CLOSED')" label="裸分专业排名"
                       prop="majorRank"></el-table-column>
      <el-table-column v-if="!monitor" label="班级" prop="_class"></el-table-column>
      <el-table-column label="学号" prop="number"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column v-if="checkMapping==='SECONDCHECKING'||checkMapping==='THIRDCHECKING'" label="裸分"
                       prop="grade"></el-table-column>
      <el-table-column v-else label="裸分" prop="grade" sortable="custom"></el-table-column>
      <el-table-column label="德育分" prop="moral"></el-table-column>
      <el-table-column label="加分" prop="addGrade"></el-table-column>
      <el-table-column v-if="checkMapping==='SECONDCHECKING'||checkMapping==='THIRDCHECKING'" label="总分"
                       prop="allGrade"></el-table-column>
      <el-table-column v-else label="总分" sortable="custom" prop="allGrade"></el-table-column>
      <el-table-column v-if="newYear && checkMapping==='PUBLICING'">
        <template slot-scope="scope">
          <span :class="{daishenhe:!scope.row.acknowledge}">{{scope.row.checkStatus}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--不通过单类时填写原因-->
    <el-dialog
      title="填写不通过原因"
      :visible.sync="notPassVisible"
      width="30%"
      :close-on-click-modal="false">
      <el-input v-model="notPassReason"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="notPassOneKind(notPassKind)">确 定</el-button>
      </span>
    </el-dialog>

    <!--详细/修改时修改单条记录-->
    <el-dialog
      title="详细记录"
      :visible.sync="changeKindVisible"
      width="80%"
      :close-on-click-modal="false">
      <el-table :data="selectedChangeKind.records" style="width: 100%">
        <el-table-column prop="itemType" label="加分类别"></el-table-column>
        <el-table-column prop="name" label="加分明细">
          <template slot-scope="scope">
            <span v-if="scope.row.contestKind!=='null'&&scope.row.contestKind!==null">{{scope.row.contestKind}}</span>
            <span
              v-if="scope.row.contestLevel!=='null'&&scope.row.contestLevel!==null">{{scope.row.contestLevel}}</span>
            <span v-if="scope.row.itemLevel!=='null'&&scope.row.itemLevel!==null">{{scope.row.itemLevel}}</span>
            {{scope.row.itemName}}
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分值">
          <template slot-scope="scope">
            <el-input :disabled="!newYear||monitor||checkMapping==='PUBLICING'" type="number" step="0.1" min="0" max="3"
                      v-model="scope.row.score"/>
          </template>
        </el-table-column>
        <el-table-column width="200" label="加分证明">
          <template slot-scope="scope">
            <span v-if="scope.row.imgUrl===null">暂无证明</span>
            <img v-else class="scoreImg" @click="checkPic(scope.row.imgUrl)" v-bind:src="scope.row.imgUrl"/>
          </template>
        </el-table-column>
        <el-table-column v-if="newYear&&!monitor&&checkMapping!=='PUBLICING'">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='SECONDPASS'">
              <el-button type="danger" size="small" @click="notPassRecord(scope.row)">不通过</el-button>
              <el-button type="warning" size="small" @click="changeRecord(scope.row)">修改并通过</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeKindVisible = false">完 成</el-button>
      </span>
    </el-dialog>
    <!--查看证明-->
    <el-dialog
      title="查看证明"
      :visible.sync="checkBig"
      width="50%">
      <img class="bigPic" v-bind:src="checkPicId">
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkBig = false">确 定</el-button>
        </span>
    </el-dialog>

    <!--不通过单条时填写原因-->
    <el-dialog
      title="填写不通过原因"
      :visible.sync="notPassOneVisible"
      width="30%"
      :close-on-click-modal="false">
      <el-input v-model="notPassReason"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notPassOneVisible = false">取 消</el-button>
        <el-button type="primary" @click="notPassOneRecord(notPassOneRecordd)">确 定</el-button>
      </span>
    </el-dialog>

    <!--不通过学生时填写原因-->
    <el-dialog
      title="填写不通过原因"
      :visible.sync="notPassStudentVisible"
      width="30%"
      :close-on-click-modal="false">
      <el-input v-model="notPassReason"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notPassStudentVisible = false">取 消</el-button>
        <el-button type="primary" @click="multiNotPass()">确 定</el-button>
      </span>
    </el-dialog>

    <!--不通过记录的列表-->
    <el-dialog
      title="不通过记录列表"
      :visible.sync="checkNotPassVisible"
      width="80%">
      <p style="color: #c0c4cc;">此处显示您的驳回记录。</p><br>
      <!--筛选-->
      <div>
        <el-row>
          <el-col :span="4">
            <el-select v-model="nott.selectedMajor"
                       @change="handleSelectedMajorNot"
                       placeholder="专业选择">
              <el-option v-for="major in nott.choice.optionsForMajor"
                         :key="major"
                         :label="major"
                         :value="major">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="nott.selectedClass"
                       :disabled="classSelectionDisabledNot"
                       @change="handleSelectedClassNot"
                       placeholder="所有班级">
              <el-option v-for="_class in optionsForClassNot"
                         :key="_class"
                         :label="_class"
                         :value="_class">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <el-table :data="notPassData">
        <el-table-column prop="short_name" label="班级"></el-table-column>
        <el-table-column prop="number" label="学号"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="score_kind" label="加分类别"></el-table-column>
        <el-table-column prop="score_name" label="加分明细"></el-table-column>
        <el-table-column prop="score" width="50" label="分值"></el-table-column>
        <el-table-column label="证明">
          <template slot-scope="scope">
            <img v-if="scope.row.imageId!==null" class="scoreImg" v-bind:src="scope.row.imageId"/>
            <span v-else>暂无证明</span>
          </template>
        </el-table-column>
        <el-table-column label="驳回理由" prop="reason"></el-table-column>
        <!--<el-table-column>-->
        <!--<template slot-scope="scope">-->
        <!--<el-button @click="backState(scope.$index,scope.row)" type="warning">恢复</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>

      <div class="block" style="float: right">
        <el-pagination
          @size-change="handleSizeChangeNot"
          @current-change="handleCurrentChangeNot"
          :current-page="nott.currentPage"
          :page-sizes="[20,50,100]"
          :page-size="nott.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="nott.recordQuantity">
        </el-pagination>
      </div>
      <div class="clearfix"></div>

    </el-dialog>

    <el-row style="margin: 0 0 20px 0">
      <el-col :span="12" v-if="(newYear&&!monitor)||!myclass">
        <el-button type="success" size="small" @click="multiPass">批量通过</el-button>
        <el-button type="danger" size="small" @click="multiNotPassRea">批量不通过</el-button>
      </el-col>
      <el-col :span="12" v-if="(!newYear||monitor)&&myclass">
        <el-button @click="exportTable()" type="primary" size="small">导出表格</el-button>
      </el-col>
      <div class="block" style="float: right">
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
    </el-row>

  </div>
</template>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
  }

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

  .el-table__expanded-cell {
    padding: 0;
  }

  .el-form-item img {
    width: 500px;
    height: 200px;
  }

  .block {
    float: right;
  }

  .reason {
    margin-left: 20px;
    font-weight: bold;
  }

  .scoreImg {
    width: 150px;
    height: 100px;
  }

  .no-header .scoreImg {
    width: 50px;
    height: 50px;
  }

  .bigPic {
    width: 100%;
  }

  .daishenhe {
    color: #ff6224;
  }

  .state {
    color: #bdbdbd;
  }

  .clearfix {
    clear: both;
  }

  .no-header .el-table__header-wrapper {
    display: none;
  }


</style>
<style>
  .el-form--inline .el-form-item__content {
    width: 100%;
  }
</style>

<script>

  var dict = {};
  var saveBytes;
  var saveByteArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
      var blob = new Blob(data, {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }());

  export default {
    name: 'onemajor',
    data() {
      return {
        monitor: false,
        comprehensiveData: [],
        choice: {
          optionsForMajor: [],
          optionsForKind: ["突出贡献", "先进典型", "学生干部", "'其他加分"]
        },
        optionsForClass: [],
        selectedMajor: '',
        selectedClass: '所有班级',
        selectedScore: '',
        selectedYear: '',
        selectedScoreSegment: undefined,
        selectedSort: '',
        selectedSortKind: '',
        symptomScoreSegment: ["91-100", "81-90", "71-80", "61-70", "51-60", "41-50", "31-40", "21-30", "11-20", "0-10"],
        scoreUpperBound: undefined,
        scoreLowerBound: undefined,
        statementIsTrue: true,
        stripeOn: true,
        whileLoading: false,
        classSelectionDisabled: false,
        pageSize: 20,
        currentPage: 1,
        recordQuantity: 0,
        newYear: false,
        notPassVisible: false,
        notPassKind: {},
        notPassReason: "",
        notPassRange: 0,
        notPassOneVisible: false,
        notPassStudentVisible: false,
        notPassOneRecordd: {},
        checkBig: false,
        checkPicId: "",
        changeKindVisible: false,
        selectedChangeKind: {},
        multiSelected: [],
        checkNotPassVisible: false,
        notPassData: [],
        nott: {
          selectedMajor: '',
          selectedClass: '所有班级',
          pageSize: 20,
          currentPage: 1,
          recordQuantity: 0,
          choice: {
            optionsForMajor: [],
          },
        },
        optionsForClassNot: [],
        classSelectionDisabledNot: true,
        stateMapping: [
          'UNCHECKED',
          'FIRSTPASS',
          'SECONDPASS',
          'PASS',
          'FAILED'
        ],
        checkMapping: "",
        myclass: true
      }
    },
    created() {
      this.checkMapping = this.$route.query.status;
      if (this.$route.query.identity !== undefined)
        this.myclass = this.$route.query.identity;
      //获得基本选项
      this.selectedYear = this.$route.query.year;
      var thisYear = new Date().getFullYear() - 1;
      var year = this.selectedYear.substr(0, 4);
      console.log(year)
      console.log(thisYear)
      if (year == thisYear)
        this.newYear = true;
      else {
        this.newYear = false
      }
      if (JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长') >= 0) {
        this.monitor = true;
        this.selectedMajor = "已选班级";
        this.sendQuery();
      }
      else {
        this.monitor = false;
        this.getOptions_basic();
      }
      console.log(this.newYear);
      console.log(this.monitor);
      console.log(this.checkMapping);
    },
    asyncComputed: {
      classSelectionDisabled() {
        return this.selectedMajor === "";
      },
      classSelectionDisabledNot() {
        return this.nott.selectedMajor === "";
      },
      // 班级选项
      optionsForClass() {
        if (this.selectedMajor !== '')
          return this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(
            res => {
              return ['所有班级'].concat(res.data.data);
            }
          );
        return ['所有班级'];
      }
    },
    methods: {
      sendQuery: function () {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedSort !== null && this.selectedSort !== "") {
          dict.sort = this.selectedSort;
          dict.kind = this.selectedSortKind;
        }
        if (this.selectedMajor !== '' && this.selectedMajor !== "已选班级") dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        dict.year = this.selectedYear;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        if (this.scoreUpperBound !== "")
          dict.scoreUpperBound = this.scoreUpperBound;
        if (this.scoreLowerBound !== "")
          dict.scoreLowerBound = this.scoreLowerBound;
        if (this.monitor) {
          dict.identity = this.myclass;
        }
        if (parseInt(this.scoreLowerBound) > parseInt(this.scoreUpperBound)) {
          this.$message("分数下界不能大于分数上界");
          return;
        }
        //发送请求
        // this.$axios.post('/sm/grades',dict).then(response => {
        this.$axios.post('/sm/comprehensive/studentRecords', dict).then(
          response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.comprehensiveData = response.data.data.students;
            console.log(this.comprehensiveData);
            for (let i of this.comprehensiveData) {
              if (i.addGroup !== null) {
                for (let j of i.addGroup) {
                  if (j.score_kind === '减分项') {
                    for (let k of j.records) {
                      k.score = -Math.abs(k.score)
                    }
                  }
                }
              }
            }
            if (this.checkMapping === "PUBLICING") {
              for (let i of this.comprehensiveData) {
                switch (i.acknowledge) {
                  case true:
                    i.checkStatus = "已确认";
                    break;
                  case false:
                    i.checkStatus = "等待确认";
                    break;
                }
              }
            }

            // 辅导员查看学生记录/班长查看本班学生记录
            if (this.myclass) {
              for (let i of this.comprehensiveData) {
                // 辅导员需要操作所以进行状态判断
                var firState = this.stateMapping[3];
                let addGrade = 0;
                if (i.addGroup !== null) {
                  for (let j of i.addGroup) {
                    var tempName = [];
                    let tempScore = 0;
                    //用于表示某一加分类总的编辑状态，只有都为二审通过（从辅导员这边打回以后重新申请的）总的通过与不通过修改
                    let canEdit = false;
                    if (j.score_kind === "学生干部") {
                      for (let k of j.records) {
                        if (k.score > tempScore)
                          tempScore = k.score;
                        if (k.contestKind === "null" || k.contestKind === null)
                          k.contestKind = "";
                        if (k.contestLevel === "null" || k.contestLevel === null)
                          k.contestLevel = "";
                        if (k.itemLevel === "null" || k.itemLevel === null)
                          k.itemLevel = "";
                        let tempp = k.contestKind + " " + k.contestLevel + " " + k.itemLevel + " " + k.itemName + " " + k.score;
                        tempName = tempName.concat(tempp);
                        if (k.status === this.stateMapping[2]) {
                          canEdit = true;
                        }
                      }
                    }
                    else {
                      for (let k of j.records) {
                        if (k.contestKind === "null" || k.contestKind === null)
                          k.contestKind = "";
                        if (k.contestLevel === "null" || k.contestLevel === null)
                          k.contestLevel = "";
                        if (k.itemLevel === "null" || k.itemLevel === null)
                          k.itemLevel = "";
                        let tempp = k.contestKind + " " + k.contestLevel + " " + k.itemLevel + " " + k.itemName + " " + k.score;
                        tempName = tempName.concat(tempp);
                        tempScore += k.score;
                        if (k.status === this.stateMapping[2]) {
                          canEdit = true;
                        }
                      }
                    }

                    if (canEdit === true) {
                      j.stateName = "待审核";
                      firState = this.stateMapping[2];
                    }
                    j.names = tempName;
                    j.score = tempScore.toFixed(2);
                    j.states = canEdit;
                    addGrade += tempScore;
                  }
                  if (firState === this.stateMapping[2])
                    i.state = "待审核";
                }
                if (addGrade > 3)
                  addGrade = 3;
                // 当处于一审、二审和三审阶段，综测分数需要计算得出
                if (this.checkMapping === "FIRSTCHECKING" || this.checkMapping === "SECONDCHECKING" || this.checkMapping === "THIRDCHECKING") {
                  let allGrade = (i.grade * 0.80 + i.moral * 0.20 + addGrade).toFixed(2);
                  i.addGrade = addGrade.toFixed(2);
                  i.allGrade = allGrade;
                }
              }
            }
            // 班级互审时班长的页面
            else {
              for (let i of this.comprehensiveData) {
                let addGrade = 0;
                let firState = this.stateMapping[2];
                if (i.addGroup !== null) {
                  for (let j of i.addGroup) {
                    var score = 0;
                    if (j.score_kind === "学生干部") {
                      for (let k of j.records) {
                        if (k.score > score && k.status !== "UNCHECKED") {
                          score = k.score;
                        }
                        switch (k.status) {
                          case "UNCHECKED":
                            k.stateName = "已驳回";
                            break;
                          case "SECONDPASS":
                            k.stateName = "已通过";
                            break;
                          case "FIRSTPASS":
                            firState = this.stateMapping[1];
                            break;
                        }
                      }
                    }
                    else {
                      for (let k of j.records) {
                        if (k.status !== "UNCHECKED")
                          score += k.score;
                        switch (k.status) {
                          case "UNCHECKED":
                            k.stateName = "已驳回";
                            break;
                          case "SECONDPASS":
                            k.stateName = "已通过";
                            break;
                          case "FIRSTPASS":
                            firState = this.stateMapping[1];
                            break;
                        }
                      }
                    }

                    j.all_score = score.toFixed(2);
                    addGrade += score;
                  }
                  if (firState === this.stateMapping[1])
                    i.state = "待审核";
                  else
                    i.state = '';
                }
                if (addGrade > 3)
                  addGrade = 3;
                i.allGrade = (i.grade * 0.80 + i.moral * 0.20 + addGrade).toFixed(2);
                i.addGrade = addGrade.toFixed(2);

              }
            }
          }
        }
        ).finally(()=>{
          this.whileLoading = false;
        });
      },
      getOptions_basic() {
        this.$store.dispatch('majoroptions', {}).then(res => {
          this.choice.optionsForMajor = res.data.data;
          this.selectedMajor = this.choice.optionsForMajor[0];
          this.whileLoading = true;
          this.sendQuery()
        })
      },
      getOptionsForClass() {
        this.$store.dispatch('classoptions', {data: {major: this.selectedMajor}}).then(res => {
          res.data.data = ['所有班级'].concat(res.data.data);
          this.choice.optionsForClass = res.data.data;
        });
      },

      setScoreSegment() {
        let lowerBound = (9 - this.symptomScoreSegment.indexOf(this.selectedScoreSegment)) * 10;
        this.scoreLowerBound = (lowerBound === 0 ? '0' : '' + (lowerBound + 1));
        this.scoreUpperBound = '' + (lowerBound + 10);
        this.resetPage();
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery()
      },
      exportTable() {

        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if (this.selectedMajor !== '') dict.major = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
        dict.year = this.selectedYear;
        dict.scoreUpperBound = this.scoreUpperBound;
        dict.scoreLowerBound = this.scoreLowerBound;
        if (parseInt(this.scoreLowerBound) > parseInt(this.scoreUpperBound)) {
          this.$message("分数下界不能大于分数上界");
          return;
        }
//       发送请求
        this.$axios.post("/sm/comprehensive/export-comprehensive", dict, {responseType: 'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '综测成绩.xlsx');
          this.whileLoading = false;
        })

      },

      // resetPage重置当前页码，顺便发送查询请求
      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },
      // 每当改选班级，会重置页码并自动查询
      handleSelectedClass() {
        this.resetPage();
      },
      // 每当改选专业，会重置页码、班级并自动查询
      handleSelectedMajor() {
        this.resetSelectedClass();
        this.resetPage();
      },
      resetSelectedClass() {
        this.currentPage = 1;
        this.selectedClass = '所有班级';
      },
      handleSelectedScore() {
        this.resetPage();
      },

      // 成绩按总分排序
      sortGrades: function (column) {
        var order = column.order;
        var newSelected = column.prop;
        if (newSelected === "allGrade")
          newSelected = "comp";
        if (order === "descending")
          this.selectedSortKind = "desc";
        else if (order === "ascending")
          this.selectedSortKind = "asc";
        else if (order === null)
          this.selectedSortKind = null;
        if (newSelected !== this.selectedSort) {
          this.selectedSort = newSelected;
        }
        if (this.selectedSort === 'allGrade')
          this.selectedSort = "comp";
        this.sendQuery()
      },

      // 审核学生单类综测记录
      passOneKind(kind) {
        this.$confirm('是否确认通过此记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};

          if (this.monitor) {
            dict.state = "SECONDPASS";
          }
          else
            dict.state = 'PASS';
          dict.ids = [];
          if (this.monitor)
            dict.ids = dict.ids.concat(kind.id);
          else {
            for (let i = 0; i < kind.records.length; i++) {
              if (kind.records[i].status === "SECONDPASS")
                dict.ids = dict.ids.concat(kind.records[i].id);
            }
          }
          this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('通过成功！');
              this.sendQuery();
            }
            else {
              this.$message.error('通过失败！');
            }
          })
        }).catch(() => {
          this.$message.info('通过取消');
        });
      },
      notPassOne(kind) {
        this.notPassVisible = true;
        this.notPassKind = kind;
        this.notPassReason = "";
      },
      notPassOneKind(kind) {
        this.notPassVisible = false;
        this.$confirm('是否确认不通过此记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.state = 'UNCHECKED';
          dict.ids = [];
          if (this.monitor)
            dict.ids = dict.ids.concat(kind.id)
          else
            for (let i = 0; i < kind.records.length; i++) {
              if (kind.records[i].status === "SECONDPASS")
                dict.ids = dict.ids.concat(kind.records[i].id);
            }
          dict.reason = this.notPassReason;
          this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('不通过成功！');
              this.sendQuery();
            }
            else {
              this.$message.error('不通过失败！');
            }
          })
        }).catch(() => {
          this.$message.info('不通过取消');
        });
      },

      changeVisible(kind) {
        this.changeKindVisible = true;
        for (let i = 0; i < kind.records.length; i++) {
        }
        this.selectedChangeKind = kind;
      },
      changeRecord(record) {
        this.$confirm('是否确认修改并通过此条记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.scoreKind = record.itemType;
          dict.scoreName = record.itemName;
          dict.status = 'PASS';
          dict.id = record.id;
          dict.score = parseFloat(record.score);
          this.$axios.post('sm/comprehensive/modify', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('保存并通过成功！');
              this.sendQuery();
              this.changeKindVisible = false;
            }
            else {
              this.$message.error('保存并通过失败！');
            }
          })
        }).catch(() => {
          this.$message.info('保存并通过取消');
        });
      },
      notPassRecord(record) {
        this.notPassOneVisible = true;
        this.notPassOneRecordd = record;
        this.notPassReason = "";
      },

      checkPic(img) {
        this.checkPicId = img;
        this.checkBig = true
      },

      notPassOneRecord(record) {
        this.notPassOneVisible = false;
        this.$confirm('是否确认不通过此条记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.state = 'UNCHECKED';
          dict.ids = [].concat(record.id);
          dict.reason = this.notPassReason;
          this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('不通过成功！');
              this.sendQuery();
            }
            else {
              this.$message.error('不通过失败！');
            }
            this.notPassOneVisible = false;
          })
        }).catch(() => {
          this.$message.info('不通过取消');
        });
      },

      // 管理综测时多选学生进行操作
      handleSelectionChange(val) {
        this.multiSelected = val;
      },

      multiPass() {

        if (this.multiSelected.length === 0) {
          this.$message.error("请先选择学生");
        }
        else {
          this.$confirm('是否确认通过此' + this.multiSelected.length + '名学生的记录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let dict = {};
            if (this.monitor)
              dict.state = "SECONDPASS";
            else
              dict.state = 'PASS';
            dict.ids = [];
            // 互审批量通过
            if (this.monitor) {
              for (let i = 0; i < this.multiSelected.length; i++) {
                if (this.multiSelected[i].addGroup !== null) {
                  for (let j = 0; j < this.multiSelected[i].addGroup.length; j++) {
                    for (let k = 0; k < this.multiSelected[i].addGroup[j].records.length; k++) {
                      if (this.multiSelected[i].addGroup[j].records[k].status === "FIRSTPASS")
                        dict.ids = dict.ids.concat(this.multiSelected[i].addGroup[j].records[k].id)
                    }
                  }
                }
              }
            }
            // 辅导员批量通过
            else {
              for (let i = 0; i < this.multiSelected.length; i++) {
                if (this.multiSelected[i].addGroup !== null) {
                  for (let j = 0; j < this.multiSelected[i].addGroup.length; j++) {
                    for (let k = 0; k < this.multiSelected[i].addGroup[j].records.length; k++) {
                      if (this.multiSelected[i].addGroup[j].records[k].status === 'SECONDPASS')
                        dict.ids = dict.ids.concat(this.multiSelected[i].addGroup[j].records[k].id);
                    }
                  }
                }
              }
            }
            this.whileLoading = true;
            this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
              if (response.data.status === 0) {
                this.$message.success('通过成功！');
                this.sendQuery();
              }
              else {
                this.$message.error('通过失败！');
              }
              this.whileLoading = false;
            })
          }).catch(() => {
            this.$message.info('通过取消');
          });
        }
      },

      multiNotPassRea() {
        this.notPassReason = "";
        this.notPassStudentVisible = true;
      },

      multiNotPass() {
        this.notPassStudentVisible = false;
        if (this.multiSelected.length === 0)
          this.$message.error("请先选择学生");
        this.$confirm('是否确认不通过此' + this.multiSelected.length + '名学生的记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dict = {};
          dict.state = 'UNCHECKED';
          dict.ids = [];
          dict.reason = this.notPassReason;
          // 互审批量不通过
          if (this.monitor) {
            for (let i = 0; i < this.multiSelected.length; i++) {
              if (this.multiSelected[i].addGroup !== null) {
                for (let j = 0; j < this.multiSelected[i].addGroup.length; j++) {
                  for (let k = 0; k < this.multiSelected[i].addGroup[j].records.length; k++)
                    if (this.multiSelected[i].addGroup[j].records[k].status === "FIRSTPASS")
                      dict.ids.push(this.multiSelected[i].addGroup[j].records[k].id)
                }
              }
            }
          }
          // 辅导员批量不通过
          else {
            for (let i = 0; i < this.multiSelected.length; i++) {
              if (this.multiSelected[i].addGroup !== null) {
                for (let j = 0; j < this.multiSelected[i].addGroup.length; j++) {
                  for (let k = 0; k < this.multiSelected[i].addGroup[j].records.length; k++) {
                    if (this.multiSelected[i].addGroup[j].records[k].status === 'SECONDPASS')
                      dict.ids = dict.ids.concat(this.multiSelected[i].addGroup[j].records[k].id);
                  }
                }
              }
            }
          }
          this.$axios.post('sm/comprehensive/handleRecords', dict).then(response => {
            if (response.data.status === 0) {
              this.$message.success('不通过成功！');
              this.sendQuery();
            }
            else {
              this.$message.error('不通过失败！');
            }
          })
        }).catch(() => {
          this.$message.info('不通过取消');
        });
      },


      // 查看不通过的记录，不可恢复，为了使学生的表显示合理，把不通过的拎出来
      checkNotPass() {
        this.checkNotPassVisible = true;
        this.getOptions_basicNot();
        this.sendQueryNot();
      },

      sendQueryNot: function () {
        const dict = {};
        if (this.nott.selectedMajor !== '') dict.major = this.nott.selectedMajor;
        if (this.nott.selectedClass !== '所有班级') dict._class = this.nott.selectedClass;
        dict.currentPage = this.nott.currentPage;
        dict.pageSize = this.nott.pageSize;
        //发送请求
        this.$axios.post('sm/comprehensive/notPassGet', dict).then(res => {
          if (res.data.status === 0) {
            this.nott.recordQuantity = res.data.data.recordQuantity;
            this.notPassData = res.data.data.records;
          }
        })
      },

      getOptions_basicNot() {
        this.$store.dispatch('majoroptions', {}).then(res => {
          this.nott.choice.optionsForMajor = res.data.data;
        })
      },

      getOptionsForClassNot() {
        this.$store.dispatch('classoptions', {data: {major: this.nott.selectedMajor}}).then(res => {
          res.data.data = ['所有班级'].concat(res.data.data);
          this.optionsForClassNot = res.data.data;
        });
      },


      handleSizeChangeNot(val) {
        this.nott.pageSize = val;
        this.sendQueryNot()
      },
      handleCurrentChangeNot(val) {
        this.nott.currentPage = val;
        this.sendQueryNot()
      },
      // 每当改选专业，会重置页码、班级并自动查询
      handleSelectedMajorNot() {
        this.resetSelectedClassNot();
        this.getOptionsForClassNot();
        this.resetPageNot();
      },
      resetSelectedClassNot() {
        this.nott.currentPage = 1;
        this.nott.selectedClass = '所有班级';
      },
      // resetPage重置当前页码，顺便发送查询请求
      resetPageNot() {
        this.nott.currentPage = 1;
        this.sendQueryNot();
      },
      // 每当改选班级，会重置页码并自动查询
      handleSelectedClassNot() {
        this.resetPageNot();
      },
    },
    watch: {
      scoreLowerBound(newVal, oldVal) {
        this.scoreLowerBound = newVal.replace(/[\D]/g, '');
        let lowerBound = parseInt(this.scoreLowerBound);
        if (lowerBound < 0 || lowerBound > 100)
          this.scoreLowerBound = oldVal;
        this.$refs['inputLowerBound'].currentValue = this.scoreLowerBound;
      },
      scoreUpperBound(newVal, oldVal) {
        this.scoreUpperBound = newVal.replace(/[\D]/g, '');
        let upperBound = parseInt(this.scoreUpperBound);
        if (upperBound < 0 || upperBound > 100)
          this.scoreUpperBound = oldVal;
        this.$refs['inputUpperBound'].currentValue = this.scoreUpperBound;
      },
    },
  }
</script>
