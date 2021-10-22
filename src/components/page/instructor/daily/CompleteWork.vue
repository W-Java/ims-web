<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 22px">
      <el-breadcrumb-item :to="{ path: 'mywork' }">工作首页</el-breadcrumb-item>
      <el-breadcrumb-item>所有工作记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div>
        <el-row :gutter="10">
          <el-col :span="5">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy.MM.dd"
              value-format="yyyy.MM.dd"
              @change="handleSelectedDate"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-col>
          <el-col :span="3">
            <el-select v-model="selectedLabels"
                       @change="handleSelectedLabels"
                       multiple
                       collapse-tags
                       placeholder="所有标签">
              <el-option v-for="kind in labelKind"
                         :key="kind"
                         :label="kind"
                         :value="kind">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-switch
              v-model="selectedMemberSwitch"
              @change="handleMemberSwitchSelect"
              active-text="所有学生"
              inactive-text="我分管的">
            </el-switch>
            <el-select v-model="selectedRange" @change="handleSelectedRange" placeholder="所有范围">
              <el-option v-for="kind in choice.optionsForRange"
                         :key="kind"
                         :label="kind"
                         :value="kind">
              </el-option>
            </el-select>
            <el-select :disabled="rangeSelectionDisabledSelect" @change="handleSelectedDefinite" filterable v-model="selectedDefinite" multiple collapse-tags placeholder="所有学生">
              <el-option v-for="kind in choice.optionsForDefinite"
                         :key="kind"
                         :label="kind"
                         :value="kind">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model="selectedName" @change="handleSelectedName" placeholder="请输入项目名称"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-table id="table" :data="workData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn"
                @selection-change="tableSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="checkWork(scope.row.id)">查看</el-button>
            <el-button size="small" type="info" @click="handleDeleteWork(scope.row.id,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right;">
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
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button @click="exportTable()" type="primary" size="small">导出表格</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="removeWorks()" v-bind:disabled="selected.length==0" type="danger" size="small">删除工作</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
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

</style>
<style>
  .el-date-editor .el-range-separator{
    width: 24px;
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
    name: 'completework',
    data() {
      return {
        choice:{
          optionsForRange:["个人","班级","全部班长","全部学生"],
          optionsForDefinite:[]
        },
        single:true,
        workData: [],
        selected: [],
//        筛选选项
        dateRange: '',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        selectedMemberSwitch:false,
        selectedRange:'',
        selectedDefinite:[],
        selectedLabels: [],
        labelKind: ["思想引领","安全维稳","心理辅导","学风建设","成长领航"],
        selectedName: '',
        selectedStatus: '',
        stripeOn: true,
        whileLoading: false,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
      };
    },
    created() {
      this.sendQuery()
    },
    methods: {
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        const dict = {};
        if(this.dateRange!=='') {
          dict.dateStart = this.dateRange[0];
          dict.dateEnd = this.dateRange[1];
        }
        if((this.selectedDefinite.join('#')!=='所有学生')&&(this.selectedDefinite.join('#')!=='')) dict.definite=this.selectedDefinite.join('#');
        else if(this.selectedMemberSwitch===false) dict.showAllPeople=false;
        if((this.selectedLabels.length!== 0)&&(this.selectedLabels.length!==5)) dict.labels=this.selectedLabels.join('#');
        if(this.selectedName!=='') dict.name=this.selectedName;
        if(this.selectedStatus!=='') dict.status=this.selectedStatus;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        //发送请求
        this.$axios.post("/sm/work", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.workData =  response.data.data.works;

            var number = response.data.data.recordQuantity;
            for(var i=0;i<number;i++) {
              this.workData[i].tag = this.workData[i].definite ? this.workData[i].definite.split('#') : [];
              this.workData[i].labeltag = this.workData[i].labels ? this.workData[i].labels.split('#') : [];
              this.workData[i].tagtext = this.workData[i].definite ? this.workData[i].definite.split('#').join(',') : '';
            }
            this.whileLoading = false;
          }
        });
      },
      tableSelectionChange(val) {
        this.selected=[];
        const selected =[];
        var length = val.length;
        for(var i=0;i<length;i++){
          selected.push(val[i].name)
        }
        this.selected=selected;
      },
//      分页功能
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
//      删除某条工作
      handleDeleteWork(theId,name){
        var id=[];
        id.push(theId);
        var send={};
        send.id=id;
        this.$confirm('此操作将永久删除编号为：“'+name+'”的记录，是否继续？','提示',{type: 'warning'})
          .then(() => {
            this.$axios.post("/sm/deleteWork",send)
              .then(response => {
                this.$message.success('已删除了名为：“' + name + '”的记录!');
                this.sendQuery()
              })
              .catch(response => {
                this.$message.error('删除失败!');
              })
          })
          .catch(() => {
            this.$message('已取消操作!');
          });
      },
//      点击修改某项工作
      handleChangeWork(id){
        var send={};
        send.id=id;
        this.display=[true,true,false,true];
        this.$axios.post('/sm/getWork',send).then(
          response => {
            if(response.data.status === 0){
              this.changeWork.workData = response.data.data.work;
              this.changeWork.changeWorkLabels = this.changeWork.workData.labels.split('#');
              this.changeWork.changeWorkDefinite = this.changeWork.workData.definite.split('#');
            }
          }
        )
      },
//      查看一条工作的具体内容
      checkWork(id){
        this.$router.push({
          name:'onework',
          query:{'work':id}
        })
      },
      exportOneWork(){
        var send={};
        send.name=this.changeWork.workData.name;
        this.$axios.post('/sm/exportOneWork',send).then(
          response=>{
            if(response.data.status===0)
              this.$message.success(response.data.message);
            else
              this.$message.error(response.data.message)
          }
        )
      },
//      批量删除工作
      removeWorks(){
        this.$confirm('此操作将永久删除 ' + this.selected.length + ' 条工作记录, 是否继续?', '提示', {type: 'warning'})
          .then(() => {
            var send={};
            send.names=this.selected;
            // 向请求服务端删除
            this.$axios.post("/sm/deleteWork", send.names)
              .then(response => {
                this.$message.success('删除了' + this.selected.length + '条记录!');
              })
              .catch(response => {
                this.$message.error('删除失败!');
              })
          })
          .catch(() => {
            this.$message('已取消操作!');
          });
      },
//      批量导出工作
      exportTable(){
        this.$confirm('此操作将导出所筛选的工作记录, 是否继续?', '提示', {type: 'warning'})
          .then(() => {
            console.log("export table confirm");
            // 向请求服务端导出记录
            this.whileLoading = true;
            // 生成条件
            const dict = {};
            if(this.dateRange!=='') {
              dict.dateStart = this.dateRange[0];
              dict.dateEnd = this.dateRange[1];
            }
            if((this.selectedDefinite.join('#')!=='所有学生')&&(this.selectedDefinite.join('#')!=='')) dict.definite=this.selectedDefinite.join('#');
            else if(this.selectedMemberSwitch===false) dict.showAllPeople=false;
            if((this.selectedLabels.length!== 0)&&(this.selectedLabels.length!==5)) dict.labels=this.selectedLabels.join('#');
            if(this.selectedName!=='') dict.name=this.selectedName;
            if(this.selectedStatus!=='') dict.status=this.selectedStatus;
            //发送请求
            console.log('before send /work/exportWork');
            this.$axios.post("/sm/work/exportWork", dict, {responseType:'blob'}).then(response => {
              saveBytes = response.data;
              saveByteArray([saveBytes], '工作记录.xlsx');
              this.whileLoading=false;
            })

        })
      },


      setMonitorSelect(){
        let dict={};
        if(this.selectedMemberSwitch===false) dict.showAllPeople=false;
        this.$axios.post('/sm/getMonitors',dict)
          .then(response=>{
            if(response.data.status === 0){
              this.selectedDefinite=response.data.data.monitors.split('#');

            }
          })
      },

      resetPage(){
        this.currentPage=1;
        this.sendQuery();
      },
      handleMemberSwitchSelect(){
        this.resetPage();
      },
      handleSelectedRange(){
        if(this.selectedRange==="全部班长")
          this.setMonitor();
        else if(this.selectedRange==="全部学生"){
          this.selectedDefinite=["全部学生"];
          this.sendQuery();
        }

        else
          this.resetDefinite();
      },
      handleSelectedDate(){
        this.resetPage();
      },
      handleSelectedLabels(){
        this.resetPage();
      },
      handleSelectedName(){
        this.resetPage();
      },
      handleSelectedDefinite(){
        this.resetPage();
      },
      resetDefinite(){
        this.selectedDefinite=[]
      },
        //      设置筛选项为班长
      setMonitor(){
          let dict={};
          if(this.selectedMemberSwitch===false) dict.showAllPeople=false;
          this.$axios.post('/sm/getMonitors',dict)
            .then(response=>{
              if(response.data.status === 0){
                this.selectedDefinite=response.data.data.monitors.split('#');

              }
            })
        },

    },
    asyncComputed:{
      rangeSelectionDisabledSelect(){
        return this.selectedRange==='全部学生';
      },
      specialChoiceSelect(){
        let temp={};
        temp.showAllPeople=this.selectedMemberSwitch;
        temp.range=this.selectedRange;
        if((this.selectedRange==='全部学生')||(this.selectedRange==='')){
          this.selectedDefinite=['所有学生'];
          this.choice.optionsForDefinite = ["所有学生"];
          delete temp.range;
        }
        else {
          if(this.selectedRange==='个人')
            this.single=false;
          else
            this.single=true;
          this.$axios.post('/sm/definiteOptions', temp).then(
            res => {
              this.choice.optionsForDefinite = res.data.data.optionsForDefinite;
            }
          );
        }
      }
    },

  }
</script>
