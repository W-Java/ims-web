<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="24">
        <!---- 综合测评卡片 ---->
        <h4 id="comprehensive">综合测评</h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between"  :gutter="18">
              <el-col :span="3"><span>学期</span></el-col>
              <el-col :span="3" style="text-align: center"><span>加权成绩</span></el-col>
              <el-col :span="3" style="text-align: center"><span>加分</span></el-col>
              <el-col :span="3" style="text-align: center"><span>减分</span></el-col>
              <el-col :span="3" style="text-align: center"><span>最终排名</span></el-col>
              <el-col :span="3" style="text-align: center"><span>排名</span></el-col>
            </el-row>
          </div>
          <div v-for="info in comprehensive" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="3"><span>{{info.term}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.weightedGrade}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.add_points}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.minus_points}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.final_rank}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.rank}}</span></el-col>
            </el-row>
          </div>
        </el-card>

        <!---- 奖学金卡片 ---->
        <h4 id="scholarship">奖学金</h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>奖励名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>等级</span></el-col>
              <el-col :span="4" style="text-align: center"><span>金额</span></el-col>
              <el-col :span="4" style="text-align: center"><span>时间</span></el-col>
              <el-col :span="4" style="text-align: center"><span>总金额</span></el-col>
            </el-row>
          </div>
          <div v-for="info in scholarship" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.amount}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.awardTime}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.totalAward }}</span></el-col>
            </el-row>
          </div>
        </el-card>

        <!---- 创新创业卡片 ---->
        <h4 id="innovation">创新创业</h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>项目名称</span></el-col>
              <el-col :span="3" style="text-align: center"><span>等级</span></el-col>
              <el-col :span="3" style="text-align: center"><span>类别</span></el-col>
              <el-col :span="2" style="text-align: center"><span>立项年份</span></el-col>
              <el-col :span="3" style="text-align: center"><span>负责人</span></el-col>
              <el-col :span="3" style="text-align: center"><span>指导老师</span></el-col>
              <el-col :span="3" style="text-align: center"><span>状态</span></el-col>
            </el-row>
          </div>
          <div v-for="info in innovation" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.kind}}</span></el-col>
              <el-col :span="2" style="text-align: center"><span>{{info.year}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.charger}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.tutor}}</span></el-col>
              <el-col :span="3" style="text-align: center"><span>{{info.status}}</span></el-col>
            </el-row>
          </div>
        </el-card>

        <!---- 学科竞赛卡片 ---->
        <h4 id="contest"><span>学科竞赛</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>比赛名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>竞赛级别</span></el-col>
              <el-col :span="4" style="text-align: center"><span>奖励等级</span></el-col>
              <el-col :span="4" style="text-align: center"><span>获奖时间</span></el-col>
              <el-col :span="4" style="text-align: center"><span>指导老师</span></el-col>
            </el-row>
          </div>
          <div v-for="info in contest" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.grade}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.time}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.tutor}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">查看-->
        <!--</el-button>-->
        <el-button @click="initAddContest" size="medium" style="float: right; margin: 1px 5px 2px 0px;" type="primary">
          添加
        </el-button>

        <!---- 论文卡片 ---->
        <h4 id="paper"><span>论文</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>论文名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>发表期刊</span></el-col>
              <el-col :span="4" style="text-align: center"><span>发表时间</span></el-col>
              <el-col :span="4" style="text-align: center"><span>第几作者</span></el-col>
              <el-col :span="4" style="text-align: center"><span>收录情况</span></el-col>
            </el-row>
          </div>
          <div v-for="info in paper" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.publish}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.time}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.kind}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">查看-->
        <!--</el-button>-->
        <el-button @click="addPaperButton = true" size= "medium" style="float: right; margin: 1px 5px 2px 0px;" type="primary">添加</el-button>

        <!---- 专利卡片 ---->
        <h4 id="patent"><span>专利</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>专利名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>类别</span></el-col>
              <el-col :span="4" style="text-align: center"><span>授权号</span></el-col>
              <el-col :span="4" style="text-align: center"><span>获批时间</span></el-col>
              <el-col :span="6" style="text-align: center"><span>作者排序</span></el-col>
            </el-row>
          </div>
          <div v-for="info in patent" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.kind}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.authorization}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.time}}</span></el-col>
              <el-col :span="6" style="text-align: center"><span>{{info.level}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">查看-->
        <!--</el-button>-->
        <el-button @click="addPatentButton = true" size= "medium" style="float: right; margin: 1px 5px 2px 0px;" type="primary">添加</el-button>

        <!---- 社会实践卡片 ---->
        <h4 id="practice"><span>社会实践</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>是否立项</span></el-col>
              <el-col :span="4" style="text-align: center"><span>项目负责人</span></el-col>
              <el-col :span="4" style="text-align: center"><span>工号</span></el-col>
              <el-col :span="4" style="text-align: center"><span>实践时间</span></el-col>
            </el-row>
          </div>
          <div v-for="info in practice" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18" style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.status}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.charger}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.chargerid}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.time}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">查看-->
        <!--</el-button>-->
        <el-button @click="addPracticeButton = true" size= "medium" style="float: right; margin: 1px 5px 2px 0px;" type="primary">添加</el-button>

        <!---- 先进典型卡片 ---->
        <h4 id="advanced"><span>先进典型</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="8"><span>名称</span></el-col>
              <el-col :span="8" style="text-align: center"><span>获奖等级</span></el-col>
              <el-col :span="8" style="text-align: center"><span>获奖时间</span></el-col>
            </el-row>
          </div>
          <div v-for="info in advanced" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18"
                    style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="8"><span>{{info.name}}</span></el-col>
              <el-col :span="8" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="8" style="text-align: center"><span>{{info.time}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">-->
          <!--查看-->
        <!--</el-button>-->
        <el-button @click="addAdvancedButton = true" size="medium" style="float: right; margin: 1px 5px 2px 0px;"
                   type="primary">添加
        </el-button>


        <!---- 其他获奖卡片 ---->
        <h4 id="other_award"><span>其他获奖</span></h4>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between" :gutter="18">
              <el-col :span="4"><span>名称</span></el-col>
              <el-col :span="4" style="text-align: center"><span>级别</span></el-col>
              <el-col :span="4" style="text-align: center"><span>奖励等级</span></el-col>
              <el-col :span="4" style="text-align: center"><span>获奖时间</span></el-col>
              <el-col :span="4" style="text-align: center"><span>指导老师</span></el-col>
            </el-row>
          </div>
          <div v-for="info in other_award" class="text item">
            <el-row type="flex" justify="space-between" :gutter="18"
                    style="border-bottom: 1px solid rgba(0,0,0,0.1);padding-bottom: 4px;">
              <el-col :span="4"><span>{{info.name}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.level}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.awardLevel}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.time}}</span></el-col>
              <el-col :span="4" style="text-align: center"><span>{{info.tutor}}</span></el-col>
            </el-row>
          </div>
        </el-card>
        <!--<el-button @click="seeUploadData()" size="medium" style="float: right; margin: 1px 1px 2px 0px;"-->
                   <!--type="primary">查看-->
        <!--</el-button>-->
        <el-button @click="addOtherAwardButton = true" size= "medium" style="float: right; margin: 1px 5px 2px 0px;" type="primary">添加</el-button>
      </el-col>
      <!--<el-col :span="4">-->
      <!--<el-menu-->
      <!--:default-active="menuIndex"-->
      <!--class="el-menu-vertical-demo"-->
      <!--background-color="#fff"-->
      <!--text-color="#000"-->
      <!--active-text-color="#FB7299">-->

      <!--<el-menu-item index="1" @click="menuLocate('#comprehensive')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title">综合测评</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="2" @click="menuLocate('#scholarship')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title">奖学金</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="3" @click="menuLocate('#innovation')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title">创新创业</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="4" @click="menuLocate('#contest')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title">学科竞赛</span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="5" @click="menuLocate('#paper')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title"><a href="#paper">论文</a></span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="6" @click="menuLocate('#patent')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title"><a href="#patent">专利</a></span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="7" @click="menuLocate('#practice')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title"><a href="#practice">社会实践</a></span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="8" @click="menuLocate('#advanced')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title"><a href="#advanced">先进典型</a></span>-->
      <!--</el-menu-item>-->
      <!--<el-menu-item index="9" @click="menuLocate('#other_award')">-->
      <!--<i class="el-icon-location"></i>-->
      <!--<span slot="title"><a href="#other_award">其他获奖</a></span>-->
      <!--</el-menu-item>-->
      <!--</el-menu>-->
      <!--</el-col>-->
    </el-row>

    <!---- 添加竞赛按钮对话框 ---->
    <el-dialog title="" :visible.sync="addContestButton" width="40%">
      <el-form ref="Contest" :rules="contestRules" :model="addContest" label-weight="130px"
               style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="比赛名称" prop="name">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addContest.name" placeholder="请输入竞赛名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="竞赛级别" prop="level">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addContest.level" placeholder="请选择竞赛级别">
                <el-option label="学院（年级）" value="学院（年级）"></el-option>
                <el-option label="校级" value="校级"></el-option>
                <el-option label="部省市级" value="部省市级"></el-option>
                <el-option label="国家级及以上" value="国家级及以上"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="奖励等级" prop="grade">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addContest.grade" placeholder="请选择奖励等级">
                <el-option label="一等奖" value="一等奖"></el-option>
                <el-option label="二等奖" value="二等奖"></el-option>
                <el-option label="三等奖" value="三等奖"></el-option>
                <el-option label="优胜奖" value="优胜奖"></el-option>
                <el-option label="第一名" value="第一名"></el-option>
                <el-option label="第二名" value="第二名"></el-option>
                <el-option label="第三名" value="第三名"></el-option>
                <el-option label="第四名" value="第四名"></el-option>
                <el-option label="第五名" value="第五名"></el-option>
                <el-option label="第六名" value="第六名"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="比赛类型" prop="contestKind">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addContest.contestKind" placeholder="请选择比赛类型">
                <el-option label="个人" value="个人"></el-option>
                <el-option label="集体" value="集体"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="获奖时间" prop="time">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addContest.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="指导老师" prop="tutor">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addContest.tutor" placeholder="请输入指导老师"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上传证明" prop="upload">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-upload
                :on-change="handleFileSelection"
                :on-remove="removeFile"
                list-type="picture"
                action="123"
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg,.png">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
              </el-upload>
              <el-progress v-show="showProgress" :text-inside="true" :stroke-width="18"
                           :percentage="uploadPercent"></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-row type="flex" >
          <el-col :span="4"  :offset=14>
            <el-button @click="cancel('Contest','addContestButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="uploadButtonDisabled" :disabled="uploadButtonDisabled"
                       @click="uploadRecord('Contest',true,'addContestButton')">确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 添加论文按钮对话框 ---->
    <el-dialog title="" :visible.sync="addPaperButton" width="40%">
      <el-form ref="Paper" :rules="paperRules" :model="addPaper" label-weight="130px"
               style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="论文名称" prop="name">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addPaper.name" placeholder="请输入论文名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="发表期刊" prop="publish">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addPaper.publish" placeholder="请输入发表期刊"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="发表时间" prop="time">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addPaper.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="第几作者" prop="level">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addPaper.level" placeholder="请选择">
                <el-option label="第一作者" value="第一作者"></el-option>
                <el-option label="第二作者" value="第二作者"></el-option>
                <el-option label="第三作者" value="第三作者"></el-option>
                <el-option label="第四作者及以后" value="第四作者及以后"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="收录情况" prop="kind">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addPaper.kind" placeholder="请选择">
                <el-option label="SCI/EI" value="SCI/EI"></el-option>
                <el-option label="CSCD" value="CSCD"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上传证明" prop="upload">
          <el-row type="flex">
            <el-col class="select" :span="23" :offset=1>
              <el-upload
                :on-change="handleFileSelection"
                list-type="picture"
                action="123"
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg,.png">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
              </el-upload>
              <el-progress v-show="showProgress" :text-inside="true" :stroke-width="18"
                           :percentage="uploadPercent"></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" >
          <el-col :span="4"  :offset=14>
            <el-button @click="cancel('Paper','addPaperButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="uploadButtonDisabled" :disabled="uploadButtonDisabled"
                       @click="uploadRecord('Paper',true,'addPaperButton')">确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 添加专利按钮对话框 ---->
    <el-dialog title="" :visible.sync="addPatentButton" width="40%">
      <el-form :label-position="labelPosition" ref="Patent" :rules="patentRules" :model="addPatent"
               label-weight="120px" style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="专利名称" prop="name">
          <el-row type="flex">
            <el-col class="select_special1" :offset=3>
              <el-input v-model="addPatent.name" placeholder="请输入专利名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="专利类别" prop="kind">
          <el-row type="flex">
            <el-col :span="23" :offset=3>
              <el-select class="select_special1" v-model="addPatent.kind" placeholder="请选择专利类别">
                <el-option label="发明专利" value="发明专利"></el-option>
                <el-option label="实用新型专利" value="实用新型专利"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="作者排序" prop="level">
          <el-row type="flex">
            <el-col :span="23" :offset=3>
              <el-select class="select_special1" v-model="addPatent.level" placeholder="请选择">
                <el-option label="第一名" value="第一名"></el-option>
                <el-option label="第二名" value="第二名"></el-option>
                <el-option label="第三名" value="第三名"></el-option>
                <el-option label="第四名及以后" value="第四名及以后"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="获批时间" prop="time">
          <el-row type="flex">
            <el-col class="select_special1" :offset=3>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addPatent.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="授权号" prop="authorization">
          <el-row type="flex">
            <el-col class="select_special2" :offset=3>
              <el-input v-model="addPatent.authorization" placeholder="请输入授权号"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上传证明" prop="upload">
          <el-row type="flex">
            <el-col :span="23" :offset=3 class="select_special1">
              <el-upload
                :on-change="handleFileSelection"
                list-type="picture"
                action="123"
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg,.png">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
              </el-upload>
              <el-progress v-show="showProgress" :text-inside="true" :stroke-width="18"
                           :percentage="uploadPercent"></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" >
          <el-col :span="4"  :offset=14>
            <el-button @click="cancel('Patent','addPatentButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="uploadButtonDisabled" :disabled="uploadButtonDisabled"
                       @click="uploadRecord('Patent',true,'addPatentButton')">确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 添加社会实践按钮对话框 ---->
    <el-dialog title="" :visible.sync="addPracticeButton" width="40%">
      <el-form ref="Practice" :rules="practiceRules" :model="addPractice" label-weight="130px"
               style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="实践名称" prop="name">
          <el-row type="flex">
            <el-col class="select_special4" :offset=1>
              <el-input v-model="addPractice.name" placeholder="请输入实践名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="项目负责人" prop="charger">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addPractice.charger" placeholder="请输入项目负责人名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="负责人工号" prop="chargerid">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addPractice.chargerid" placeholder="请输入项目负责人工号"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="实践时间" prop="time">
          <el-row type="flex">
            <el-col class="select_special4" :offset=1>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addPractice.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否立项" prop="status">
          <el-row type="flex">
            <el-col  :span="23" :offset=1>
              <el-select class="select_special4" v-model="addPractice.status" placeholder="请选择">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-row type="flex" >
          <el-col :span="4"  :offset=14>
            <el-button @click="cancel('Practice','addPracticeButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="uploadRecord('Practice',false,'addPracticeButton')">确认</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 添加其他获奖按钮对话框 ---->
    <el-dialog title="" :visible.sync="addOtherAwardButton" width="40%">
      <el-form ref="OtherAward" :rules="otherAwardRules" :model="addOtherAward" label-weight="130px"
               style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="名称" prop="name">
          <el-row type="flex">
            <el-col class="select_special5" :offset=1>
              <el-input v-model="addOtherAward.name" placeholder="请输入获奖名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-row type="flex">
            <el-col  :span="23" :offset=1>
              <el-select class="select_special5" v-model="addOtherAward.level" placeholder="请选择获奖级别">
                <el-option label="学院（年级）" value="学院（年级）"></el-option>
                <el-option label="校级" value="校级"></el-option>
                <el-option label="部省市级" value="部省市级"></el-option>
                <el-option label="国家级及以上" value="国家级及以上"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="获奖时间" prop="time">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addOtherAward.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="奖励等级" prop="awardLevel">
          <el-row type="flex">
            <el-col  :span="23" :offset=1>
              <el-select class="select" v-model="addOtherAward.awardLevel" placeholder="请选择奖励等级">
                <el-option label="一等奖" value="一等奖"></el-option>
                <el-option label="二等奖" value="二等奖"></el-option>
                <el-option label="三等奖" value="三等奖"></el-option>
                <el-option label="优胜奖" value="优胜奖"></el-option>
                <el-option label="第一名" value="第一名"></el-option>
                <el-option label="第二名" value="第二名"></el-option>
                <el-option label="第三名" value="第三名"></el-option>
                <el-option label="第四名" value="第四名"></el-option>
                <el-option label="第五名" value="第五名"></el-option>
                <el-option label="第六名" value="第六名"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="比赛类型" prop="contestKind">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select" v-model="addOtherAward.contestKind" placeholder="请选择比赛类型">
                <el-option label="个人" value="个人"></el-option>
                <el-option label="集体" value="集体"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="指导老师" prop="tutor">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-input v-model="addOtherAward.tutor" placeholder="请输入指导老师"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上传证明" prop="upload">
          <el-row type="flex">
            <el-col class="select" :offset=1>
              <el-upload
                :on-change="handleFileSelection"
                list-type="picture"
                action="123"
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg,.png">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
              </el-upload>
              <el-progress v-show="showProgress" :text-inside="true" :stroke-width="18"
                           :percentage="uploadPercent"></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" >
          <el-col :span="4"  :offset=14>
            <el-button @click="cancel('OtherAward','addOtherAwardButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="uploadButtonDisabled" :disabled="uploadButtonDisabled"
                       @click="uploadRecord('OtherAward',true,'addOtherAwardButton')">确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 添加先进典型按钮对话框 ---->
    <el-dialog title="" :visible.sync="addAdvancedButton" width="40%">
      <el-form ref="Advanced" :rules="advancedRules" :model="addAdvanced" label-weight="130px"
               style="margin-left: 40px; margin-right: 35px;">
        <el-form-item label="名称" prop="name">
          <el-row type="flex">
            <el-col :span="23" :offset=3>
              <el-select class="select_special7" v-model="addAdvanced.name" placeholder="请选择">
                <el-option label="先进班集体" value="先进班集体"></el-option>
                <el-option label="文明寝室" value="文明寝室"></el-option>
                <el-option label="优秀团支部" value="优秀团支部"></el-option>
                <el-option label="百佳班级" value="百佳班级"></el-option>
                <el-option label="百佳寝室" value="百佳寝室"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="获奖等级" prop="level">
          <el-row type="flex">
            <el-col :span="23" :offset=1>
              <el-select class="select_special4" v-model="addAdvanced.level" placeholder="请选择">
                <el-option label="学院（年级）" value="学院（年级）"></el-option>
                <el-option label="校级" value="校级"></el-option>
                <el-option label="部省市级" value="部省市级"></el-option>
                <el-option label="国家级及以上" value="国家级及以上"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="获奖时间" prop="time">
          <el-row type="flex">
            <el-col class="select_special4" :offset=1>
              <el-date-picker type="date" placeholder="注：9月1日之后的计入下一次综测" v-model="addAdvanced.time"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="上传证明" prop="upload">
          <el-row type="flex">
            <el-col class="select_special4" :offset=1>
              <el-upload
                :on-change="handleFileSelection"
                list-type="picture"
                action="123"
                :auto-upload="false"
                :file-list="fileList"
                accept=".jpg,.png">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
              </el-upload>
              <el-progress v-show="showProgress" :text-inside="true" :stroke-width="18"
                           :percentage="uploadPercent"></el-progress>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-row type="flex">
          <el-col :span="4" :offset=14>
            <el-button @click="cancel('Advanced','addAdvancedButton')">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="uploadButtonDisabled" :disabled="uploadButtonDisabled"
                       @click="uploadRecord('Advanced',true,'addAdvancedButton')">确认
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!---- 查看按钮对话框 ---->
    <!--<el-dialog title="成长档案添加纪录" :visible.sync="seeButton" width="55%" :center="true">-->
      <!--<el-table-->
        <!--:data="growing"-->
        <!--style="width: 100%">-->
        <!--<el-table-column-->
        <!--type="index">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="kind"-->
        <!--label="类别">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="名称"-->
          <!--width="300">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="situation"-->
          <!--label="审核状态"-->
          <!--width="200">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="证明"-->
          <!--width="200">-->
          <!--<template slot-scope="scope">-->
            <!--<el-popover placement="right" trigger="hover">-->
              <!--<img :src="scope.row.imgUrl" alt="" style="max-width: 1000px; max-height: 1000px;">-->
              <!--<img slot="reference" :src="scope.row.imgUrl" alt="" style="width: 50px; height: 50px;">-->
            <!--</el-popover>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<div slot="footer" class="dialog-footer footer">-->
        <!--<el-row type="flex" >-->
          <!--<el-col :span="4" :offset=10>-->
            <!--<el-button @click="seeButton = false">返回</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  let theVue={};
  export default {
    name: "GrowingFile",
    data() {
      var nowDate = new Date();
      var checkTime = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('必填项'));
        }
        //如果需要限制时间的话可以用以下的代码
        // else if((value.getFullYear()>nowDate.getFullYear())||((value.getFullYear()==nowDate.getFullYear())&&(value.getMonth()>=8))) {
        //   return callback(new Error('不能添加9月1日之后的'));
        // }
        else {
          callback();
        }
      };
      return {
        menuIndex: '1',
        labelPosition: 'right',
        //上传文件部分变量
        showProgress: false,
        uploadPercent: 0,
        fileList: [],
        uploadButtonDisabled: false,

        addContest: {
          name: '',
          time: '',
          tutor: '',
          level: '',
          grade: '',
          contestKind: '',
          upload: ''
        },
        addPaper: {
          name: '',
          publish: '',
          time: '',
          kind: '',
          level: '',
          upload: ''
        },
        addPatent: {
          name: '',
          kind: '',
          level: '',
          time: '',
          authorization: '',
          upload: ''
        },
        addPractice: {
          name: '',
          charger: '',
          chargerid: '',
          time: '',
          status: '',
        },
        addOtherAward: {
          name: "",
          level: '',
          time: "",
          awardLevel: '',
          contestKind: "",
          tutor: "",
          upload: ''
        },
        addAdvanced: {
          name: '',
          level: '',
          time: '',
          upload: ''
        },
        addContestButton: false,
        addPaperButton: false,
        addPatentButton: false,
        addPracticeButton: false,
        addOtherAwardButton: false,
        addAdvancedButton: false,
        seeButton: false,
        seePaperButton: false,
        seePatentButton: false,
        seePracticeButton: false,
        seeOtherAwardButton: false,
        seeAdvancedButton: false,
        growing: [],
        comprehensive: [],
        scholarship: [],
        innovation: [],
        contest: [],
        paper: [],
        patent:[],
        practice: [],
        other_award: [],
        advanced: [],
        contestRules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          grade: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          contestKind: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          tutor: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          time: [
            {type: 'date', required: true, validator: checkTime, trigger: 'change'}
          ],
          upload: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
        },
        paperRules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          publish: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          time: [
            {type: 'date', required: true, message: '必填项', trigger: 'change'}
          ],
          kind: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          level: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          upload: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
        },
        patentRules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          kind: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          time: [
            {type: 'date', required: true, message: '必填项', trigger: 'change'}
          ],
          authorization: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          upload: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
        },
        practiceRules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          charger: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          chargerid: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          time: [
            {type: 'date', required: true, message: '必填项', trigger: 'change'}
          ],
          status: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
        },
        otherAwardRules: {
          name: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 1, message: '', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          awardLevel: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          contestKind: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          time: [
            {type: 'date', required: true, message: '必填项', trigger: 'change'}
          ],
          tutor: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
          upload: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
        },
        advancedRules: {
          name: [
            {required: true, message: '必填项', trigger: 'change'},
          ],
          level: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          time: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          upload: [
            {required: true, message: '必填项', trigger: 'blur'}
          ],
        },
      }
    },
    created: function() {
      this.$message({
        showClose:true,
        message:'已添加的数据可在当年综测卡片中的“加分项管理”查看',
        duration:8000
      });
      this.renderData();
      theVue = this;
    },
    watch: {
      addContestButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addPaperButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addContestButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addPatentButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addPracticeButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addOtherAwardButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
      addAdvancedButton: function (val) {
        if (val === true)
          this.fileList = [];
      },
    },
    methods: {
      initAddContest() {
        this.addContestButton = true;
        this.showProgress = false;
        this.uploadPercent = 0;
      },

      //有心杀敌，无力回天了
      // //导航栏跳转（删除了之前冗余代码）
      // menuLocate(location) {
      //   window.location.hash = location;
      // },
      //发送请求渲染主界面数据
      renderData: function() {
        let dict={};
        this.$axios.post("sm/growingfile", dict).then(response => {
          if (response.data.status === 0) {
            this.comprehensive = response.data.data.comprehensive;
            this.scholarship = response.data.data.scholarship;
            this.innovation = response.data.data.innovation;
            this.contest = response.data.data.contest;
            this.paper = response.data.data.paper;
            this.patent = response.data.data.patent;
            this.practice = response.data.data.practice;
            this.other_award = response.data.data.other_award;
            this.advanced = response.data.data.advanced;
          }
        });
      },

      //取消按钮后重置表单
      cancel: function (formName, flag) {
        this[flag] = false;
        this.$refs[formName].resetFields();
      },

      //上传仅此一处，删除多余代码
      uploadRecord(tableName,withCertification,dialogVisible){
        if (this.fileList.length > 0) {
          this['add' + tableName].upload = 1;
        } else {
          this['add' + tableName].upload = '';
        }
        this.$refs[tableName].validate((valid) => {
          if (valid) {
            if(withCertification && this.fileList[0].size/1024/1024 > 4){
              this.$message({
                message:'文件不可超过4MB',
                type:'warning'
              });
              return;
            }
            let tableNameString = tableName.toLocaleString();
            this.uploadButtonDisabled = true;
            let dict = JSON.parse(JSON.stringify(this.$refs[tableName]._props.model));
            dict.time = dict.time.substring(0, 10);
            this.$axios.post('sm/growing'+tableNameString.toLowerCase(),dict)
              .then(function (response) {
                let id = response.data.data.id;
                let file = theVue.fileList[0];
                if(withCertification)
                  theVue.uploadCertificationToAliyun(file, tableName, id,dialogVisible);
              })
              .catch(function (error) {
                console.log(error)
              }).finally(() => {
              //
              if(!withCertification){
                this.$refs[tableName].resetFields();
                this[dialogVisible] = false;
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //移除文件时进行的动作
      removeFile(file, fileList) {
        this.fileList = [];
      },
      //上传文件部分代码
      handleFileSelection(file, fileList) {
        this.fileList.push(file);
        this.fileList = fileList.slice(-1);
      },
      uploadCertificationToAliyun(file, tableName, id,dialog){
        let fd = new FormData();
        fd.append('file', file.raw);
        fd.append('tableName', tableName.toLocaleString().toUpperCase());
        fd.append('id', id);
        let config={headers:{'Content-Type':'multipart/form-data'}};
        this.$axios.post("/sm/img/aliyunOss/growth-file-upload", fd, config).then(res => {
          if(res.data.status === 400 || res.data.status === 403 || res.data.status === 404){
            theVue.$message.warning("图片上传出错了,请重试");
            theVue.uploadButtonDisabled = false;
          }else if(res.data.status === 0){
            theVue.basicSet();
            theVue.fileList = [];
            theVue[dialog] = false;
            theVue.$refs[tableName].resetFields();
            theVue.$message({
              message:'添加成功',
              type:'success'});
          }
          console.log(res);
        })
      },
      basicSet(){
        this.uploadPercent = 0;
        this.showProgress = false;
        this.uploadButtonDisabled = false;
      },

      //查看添加的项
      seeUploadData: function () {
        this.seeButton = true;
        this.$axios.post("sm/seegrowing", {}).then(response => {
          if (response.data.status === 0) {
            this.growing = response.data.data.growing;
          }
        });
      }
    },
  }
</script>

<style scoped>
  .box-card {
    font-size: 16px;
  }
  .seeButton {
    margin-top: -10px;
    margin-bottom: -12px;
    border-shadow: none;
  }
  .el-menu-vertical-demo {
    position: fixed;
    top: 61px;
    right: 15px;
    height: 100%;
    width: 235px;
    overflow: hidden;
  }

  el-menu-item {
    border-radius: 8px;
  }
  .text {
    font-size: 16px;
  }

  .item {
    margin-bottom: 18px;
  }

  a {
    text-decoration: none;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    padding-right: 5px;
  }

  h4 {
    margin-top: 50px;
    margin-bottom: 10px;
  }
  .select{
    width: 100%;
    padding-right: 13px;
  }

  .footer {
    margin-top: -5px;
    margin-bottom: -3px;
  }
  /*  为了处理表单中的label对不齐的问题   */

  /*  以下规则是专利弹框中的  */
  .select_special1 {
    width: 100%;
    padding-left: 8px;
    padding-right: 13px;
  }

  .select_special2 {
    width: 100%;
    padding-left: 20px;
    padding-right: 13px;
  }

  .select_special3 {
    width: 100%;
    padding-right: 13px;
  }


  /*  以下规则是社会实践弹框中的  */
  .select_special4 {
    width: 100%;
    padding-left: 13px;
    padding-right: 13px;
  }

  /*  以下规则是其他获奖弹框中的  */
  .select_special5 {
    width: 100%;
    padding-left: 27px;
    padding-right: 13px;
  }

  .select_special6 {
    width: 100%;
    padding-left: 9px;
    padding-right: 0px;
  }

  /*  以下规则是先进典型弹框中的  */
  .select_special7 {
    width: 100%;
    padding-left: 3px;
    padding-right: 13px;
  }
</style>
