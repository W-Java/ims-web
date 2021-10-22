<template>
  <div>
    <div>
      <el-row>
        <el-col :span="2">
          <el-button v-on:click.native="resetChoice">复位</el-button>
        </el-col>

        <el-col :span="3" v-if="!monitor">
          <el-switch
            style="margin-top: 10px"
            v-model="memberSwitch"
            @change="handleMemberSwitch"
            inactive-color="#e477bb"
            active-color="rgba(227, 120, 188, 0.25)"
            active-text="所有学生"
            inactive-text="我分管的">
          </el-switch>
        </el-col>

        <el-col :span="3" v-if="!monitor">
          <el-select v-model="selectedMajor" placeholder="专业选择" :disabled="majorSelectionDisabled" @change="handleSelectedMajor">
            <el-option
              v-for="major in optionsForMajor"
              :key="major"
              :label="major"
              :value="major">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3" v-if="!monitor">
          <!--若未选择专业，班级选项无效-->
          <el-select v-model="selectedClass" :disabled="classSelectionDisabled"
                     placeholder="班级选择" @change="handleSelectedClass">
            <el-option
              v-for="_class in optionsForClass"
              :key="_class"
              :label="_class"
              :value="_class"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selectedSex" placeholder="性别选择" @change="handleSelectedSex">
            <el-option
              v-for="sex in studentOptions.optionsForSex"
              :key="sex"
              :label="sex"
              :value="sex"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selectedNationality" placeholder="民族选择" @change="handleSelectedNationality">
            <el-option
              v-for="nationality in studentOptions.optionsForNationality"
              :key="nationality"
              :label="nationality"
              :value="nationality"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="selectedHometown" placeholder="籍贯选择" @change="handleSelectedHometown">
            <el-option
              v-for="hometown in studentOptions.optionsForHometown"
              :key="hometown"
              :label="hometown"
              :value="hometown"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="selectedNumber" @change="handleSelectedNumber" ref="numberInput" placeholder="请输入学号或姓名"></el-input>
        </el-col>

      </el-row>
    </div>


    <div>
      <el-table id="table" :data="studentsData" style="width: 100%" v-loading="whileLoading" :stripe="stripeOn"
                @selection-change="tableSelectionChange">
        <el-table-column v-if="mycharge"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="80">
        </el-table-column>
        <!--<el-table-column prop="major" label="专业">-->
        <!--</el-table-column>-->
        <el-table-column prop="_class" label="班级">
        </el-table-column>
        <el-table-column prop="number" label="学号">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="75">
        </el-table-column>
        <el-table-column prop="tel" label="电话">
        </el-table-column>
        <el-table-column prop="nationality" label="民族">
        </el-table-column>
        <el-table-column prop="hometown" label="籍贯">
        </el-table-column>
        <el-table-column prop="building" label="寝室楼栋">
        </el-table-column>
        <el-table-column prop="dorm" label="寝室号">
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="handleDetailedInfo(scope.row.number)">详情</el-button>
            <el-button size="small" type="danger" v-if="mycharge" @click="handleChangeInfo(scope.row.number)">修改</el-button>
            <el-button v-if="deleteUser" size="small" type="danger" @click="deleteStudent(scope.row.number)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-button @click="exportTable()" type="primary" size="small">导出表格</el-button>
        <el-button @click="removeUsers()" v-if="mycharge" type="danger" size="small">学籍调整</el-button>

        <el-dropdown @command="handleCommand" v-if="mycharge">
          <el-button type="primary" size="small">
            添加学生<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="dange">添加单个学生</el-dropdown-item>
            <el-dropdown-item command="piliang">批量导入</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="批量导入" :visible.sync="piliangVisible" width="50%">
          <el-col :span="24">
            <div style="font-size: small;color: #606266">1.黄四郎的替身</div>
            <div style="font-size: small;color: #606266">2.马邦德的麻子</div>
            <div style="font-size: small;color: #606266">3.汤师爷的屁股</div>
            <div style="font-size: small;color: #606266">只能上传xls/xlsx文件,<a href="www.baidu.com">点此下载示例表格</a></div>
            <br><br>
          </el-col>
          <el-upload
            ref="upload"
            action="sm/uploadExcel"
            :before-upload="beforefileupload"
            :on-success="handlesucess"
            :file-list="fileList"
            :auto-upload="true">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认导入</el-button>
            <!--<div  style="font-size: small;color: #606266" >只能上传xls/xlsx文件,<a href="www.baidu.com">点此下载示例表格</a></div>-->
          </el-upload>
        </el-dialog>

        <el-dialog title="添加学生信息" :visible.sync="dialogCreateVisible">
          <el-form ref="studentForm" :model="basicinfo[0]" :rules="studentRules">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="basicinfo[0].name" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="basicinfo[0].sex" placeholder="请选择">
                <el-option value="男" label="男"></el-option>
                <el-option value="女" label="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="nationality">
              <el-select v-model="basicinfo[0].nationality" filterable placeholder="请选择">
                <el-option
                  v-for="item in nationOption"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 暂时去掉照片    <el-form-item prop="avatar">
                     <el-upload
                             drag
                             :on-change="changeImage"
                             :on-remove="removeImage"
                             :multiple="false"
                             :limit="1"
                             :auto-upload="false"
                             name="studentImage"
                             action="">
                         <i class="el-icon-upload"></i>
                         <div class="el-upload__text">将图片拖动到此处，或<em>点击上传</em></div>
                         <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且文件大小不能超过5M</div>
                     </el-upload>
                 </el-form-item> -->
            <!--<el-form-item label="学院" prop="institute" >-->
              <!--<el-input v-model="basicinfo[0].institute" clearable placeholder="请输入学院"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="系" prop="department">-->
            <!--<el-input v-model="basicinfo[0].department" clearable placeholder="请输入系名"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="专业" prop="major">
              <el-select v-model="basicinfo[0].major" filterable placeholder="请选择专业" @change="getAddOptionForClass">
                <el-option
                  v-for="major in addOptionForMajor"
                  :key="major"
                  :value="major"
                  :lable="major">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="_class">
              <el-select v-model="basicinfo[0]._class" filterable placeholder="请选择班级">
                <el-option
                  v-for="_class in addOptionForClass"
                  :key="_class"
                  :value="_class"
                  :lable="_class"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学号" prop="number">
              <el-input v-model="basicinfo[0].number" clearable placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="寝室楼栋" prop="building">
              <el-input v-model="basicinfo[0].building" clearable placeholder="请输入楼栋号">
              </el-input>
            </el-form-item>
            <el-form-item label="寝室号" prop="dorm">
              <el-input v-model.number="basicinfo[0].dorm" clearable placeholder="请输入寝室号"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="tel">
              <el-input v-model.number="basicinfo[0].tel" clearable placeholder="请输入手机号码"></el-input>
            </el-form-item>

            <el-form-item label="省份" prop="province">
              <el-select v-model="basicinfo[0].province" filterable placeholder="请选择所在省份"
                         @change="getCityOption">
                <el-option
                  v-for="item in provinceOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">     <!--为了方便进行市的筛选，此处value为id，在getCityOption中更改province -->
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市" prop="city">
              <el-select v-model="basicinfo[0].city" filterable placeholder="请选择所在城市">
                <el-option
                  v-for="item in cityChoice"
                  :key="item.id"
                  :lable="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="身份证号" prop="idNumber">
              <el-input v-model="basicinfo[0].idNumber" clearable placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item label="QQ号" prop="qq">
              <el-input v-model.number="basicinfo[0].qq" clearable placeholder="请输入qq号"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input v-model="basicinfo[0].address" clearable placeholder="请输入家庭地址"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-input v-model="basicinfo[0].politicalStatus" clearable placeholder="请输入政治面貌"></el-input>
            </el-form-item>
            <el-form-item label="班级职位" prop="classPosition">
              <el-input v-model="basicinfo[0].classPosition" clearable placeholder="请输入班级职位"></el-input>
            </el-form-item>
            <el-form-item label="父亲姓名" prop="father_name">
              <el-input v-model="basicinfo[0].father_name" clearable placeholder="请输入学生父亲的姓名"></el-input>
            </el-form-item>
            <el-form-item label="父亲电话" prop="father_tel">
              <el-input v-model.number="basicinfo[0].father_tel" clearable
                        placeholder="请输入学生父亲的电话号码"></el-input>
            </el-form-item>
            <el-form-item label="母亲姓名" prop="mother_name">
              <el-input v-model="basicinfo[0].mother_name" clearable placeholder="请输入学生母亲的姓名"></el-input>
            </el-form-item>
            <el-form-item label="母亲电话" prop="mother_tel">
              <el-input v-model.number="basicinfo[0].mother_tel" clearable
                        placeholder="请输入学生母亲的电话号码"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input v-model="basicinfo[0].note" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="el-dialog__footer">
            <el-button @click="dialogCreateVisible=false">取消</el-button>
            <el-button type="primary" @click="uploadStudentInfo('studentForm')">提交</el-button>
          </div>
        </el-dialog>
      </el-col>
      <el-col :span="12">
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

  </div>


</template>

<style scoped>
  .block {
    float: right;
  }
</style>

<script>

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
    name: 'studentinfo',
    data() {
      return {
        studentsData: [],
        // choice: {
        //   optionsForMajor: [],
        //   optionsForClass: [],
        //   optionsForSex: [],
        //   optionsForNationality: [],
        //   optionsForHometown: [],
        //   optionsForBuilding: []
        // },
        mycharge:true,
        monitor:false,
        deleteUser:false,
        monitorMajor:"",
        monitorClass:"",
        majorSelectionDisabled: false,
        classSelectionDisabled: true,
        prevStatusOfClassSelection: true,
        selectedNumber: '',
        optionsForMajor: [],
        optionsForClass: [],
        studentOptions: {},
        selectedMajor: '所有专业',
        selectedClass: '所有班级',
        selectedSex: '所有性别',
        selectedNationality: '所有民族',
        selectedHometown: '所有籍贯',
        selectedBuilding: '所有寝室楼栋',
        memberSwitch: false,
        stripeOn: true,
        whileLoading: false,
        pageSize: 20,     // 每页显示条目数  ---将它保存在cookie中，以便下次还是这么多
        currentPage: 1,     // 当前页码
        recordQuantity: 0, // 总数据量
        addOptionForClass:'',
        selected: [],//判断是否有行选中
        namesThatRhyme: [],
        statementIsTrue: true,
        piliangVisible: false,
        //需要显示的数据放在filter
        list: [],
        total_rows: 0,
        fileList: [],
        dialogCreateVisible: false,
        basicinfo: [{
          institute: '',
          department: '',
          number: '',
          name: '',
          sex: '',
          nationality: '',
          _class: '',
          major: '',
          building: '',
          dorm: '',
          tel: '',
          province: '',
          city: '',
          idNumber: '',
          qq: '',
          address: '',
          politicalStatus: '',
          classPosition: '',
          father_name: '',
          father_tel: '',
          mother_name: '',
          mother_tel: '',
          note: '',
          avatar: ''
        }],
        nationOption: [
          {value: "汉族",},
          {value: "蒙古族",},
          {value: "回族",},
          {value: "藏族",},
          {value: "维吾尔族",},
          {value: "苗族",},
          {value: "彝族",},
          {value: "壮族",},
          {value: "布依族",},
          {value: "朝鲜族",},
          {value: "满族",},
          {value: "侗族",},
          {value: "瑶族",},
          {value: "白族",},
          {value: "土家族",},
          {value: "哈尼族",},
          {value: "哈萨克族",},
          {value: "傣族",},
          {value: "黎族",},
          {value: "傈僳族",},
          {value: "佤族",},
          {value: "畲族",},
          {value: "拉祜族",},
          {value: "水族",},
          {value: "东乡族",},
          {value: "纳西族",},
          {value: "景颇族",},
          {value: "柯尔克孜族",},
          {value: "土族",},
          {value: "达斡尔族",},
          {value: "仫佬族",},
          {value: "羌族",},
          {value: "布朗族",},
          {value: "撒拉族",},
          {value: "毛南族",},
          {value: "仡佬族",},
          {value: "锡伯族",},
          {value: "阿昌族",},
          {value: "普米族",},
          {value: "塔吉克族",},
          {value: "怒族",},
          {value: "乌兹别克族",},
          {value: "俄罗斯族",},
          {value: "鄂温克族",},
          {value: "德昂族",},
          {value: "保安族",},
          {value: "裕固族",},
          {value: "京族",},
          {value: "塔塔尔族",},
          {value: "独龙族",},
          {value: "鄂伦春族",},
          {value: "赫哲族",},
          {value: "门巴族",},
          {value: "珞巴族",},
          {value: "基诺族",},
          {value: "高山族",}
        ],
        provinceOption: [{
          "name": "北京市",
          "id": "110000"
        }, {
          "name": "天津市",
          "id": "120000"
        }, {
          "name": "河北省",
          "id": "130000"
        }, {
          "name": "山西省",
          "id": "140000"
        }, {
          "name": "内蒙古自治区",
          "id": "150000"
        }, {
          "name": "辽宁省",
          "id": "210000"
        }, {
          "name": "吉林省",
          "id": "220000"
        }, {
          "name": "黑龙江省",
          "id": "230000"
        }, {
          "name": "上海市",
          "id": "310000"
        }, {
          "name": "江苏省",
          "id": "320000"
        }, {
          "name": "浙江省",
          "id": "330000"
        }, {
          "name": "安徽省",
          "id": "340000"
        }, {
          "name": "福建省",
          "id": "350000"
        }, {
          "name": "江西省",
          "id": "360000"
        }, {
          "name": "山东省",
          "id": "370000"
        }, {
          "name": "河南省",
          "id": "410000"
        }, {
          "name": "湖北省",
          "id": "420000"
        }, {
          "name": "湖南省",
          "id": "430000"
        }, {
          "name": "广东省",
          "id": "440000"
        }, {
          "name": "广西壮族自治区",
          "id": "450000"
        }, {
          "name": "海南省",
          "id": "460000"
        }, {
          "name": "重庆市",
          "id": "500000"
        }, {
          "name": "四川省",
          "id": "510000"
        }, {
          "name": "贵州省",
          "id": "520000"
        }, {
          "name": "云南省",
          "id": "530000"
        }, {
          "name": "西藏自治区",
          "id": "540000"
        }, {
          "name": "陕西省",
          "id": "610000"
        }, {
          "name": "甘肃省",
          "id": "620000"
        }, {
          "name": "青海省",
          "id": "630000"
        }, {
          "name": "宁夏回族自治区",
          "id": "640000"
        }, {
          "name": "新疆维吾尔自治区",
          "id": "650000"
        }, {
          "name": "台湾省",
          "id": "710000"
        }, {
          "name": "香港特别行政区",
          "id": "810000"
        }, {
          "name": "澳门特别行政区",
          "id": "820000"
        }],
        cityOption: {
          "110000": [
            {
              "province": "北京市",
              "name": "市辖区",
              "id": "110100"
            }
          ],
          "120000": [
            {
              "province": "天津市",
              "name": "市辖区",
              "id": "120100"
            }
          ],
          "130000": [
            {
              "province": "河北省",
              "name": "石家庄市",
              "id": "130100"
            },
            {
              "province": "河北省",
              "name": "唐山市",
              "id": "130200"
            },
            {
              "province": "河北省",
              "name": "秦皇岛市",
              "id": "130300"
            },
            {
              "province": "河北省",
              "name": "邯郸市",
              "id": "130400"
            },
            {
              "province": "河北省",
              "name": "邢台市",
              "id": "130500"
            },
            {
              "province": "河北省",
              "name": "保定市",
              "id": "130600"
            },
            {
              "province": "河北省",
              "name": "张家口市",
              "id": "130700"
            },
            {
              "province": "河北省",
              "name": "承德市",
              "id": "130800"
            },
            {
              "province": "河北省",
              "name": "沧州市",
              "id": "130900"
            },
            {
              "province": "河北省",
              "name": "廊坊市",
              "id": "131000"
            },
            {
              "province": "河北省",
              "name": "衡水市",
              "id": "131100"
            },
            {
              "province": "河北省",
              "name": "省直辖县级行政区划",
              "id": "139000"
            }
          ],
          "140000": [
            {
              "province": "山西省",
              "name": "太原市",
              "id": "140100"
            },
            {
              "province": "山西省",
              "name": "大同市",
              "id": "140200"
            },
            {
              "province": "山西省",
              "name": "阳泉市",
              "id": "140300"
            },
            {
              "province": "山西省",
              "name": "长治市",
              "id": "140400"
            },
            {
              "province": "山西省",
              "name": "晋城市",
              "id": "140500"
            },
            {
              "province": "山西省",
              "name": "朔州市",
              "id": "140600"
            },
            {
              "province": "山西省",
              "name": "晋中市",
              "id": "140700"
            },
            {
              "province": "山西省",
              "name": "运城市",
              "id": "140800"
            },
            {
              "province": "山西省",
              "name": "忻州市",
              "id": "140900"
            },
            {
              "province": "山西省",
              "name": "临汾市",
              "id": "141000"
            },
            {
              "province": "山西省",
              "name": "吕梁市",
              "id": "141100"
            }
          ],
          "150000": [
            {
              "province": "内蒙古自治区",
              "name": "呼和浩特市",
              "id": "150100"
            },
            {
              "province": "内蒙古自治区",
              "name": "包头市",
              "id": "150200"
            },
            {
              "province": "内蒙古自治区",
              "name": "乌海市",
              "id": "150300"
            },
            {
              "province": "内蒙古自治区",
              "name": "赤峰市",
              "id": "150400"
            },
            {
              "province": "内蒙古自治区",
              "name": "通辽市",
              "id": "150500"
            },
            {
              "province": "内蒙古自治区",
              "name": "鄂尔多斯市",
              "id": "150600"
            },
            {
              "province": "内蒙古自治区",
              "name": "呼伦贝尔市",
              "id": "150700"
            },
            {
              "province": "内蒙古自治区",
              "name": "巴彦淖尔市",
              "id": "150800"
            },
            {
              "province": "内蒙古自治区",
              "name": "乌兰察布市",
              "id": "150900"
            },
            {
              "province": "内蒙古自治区",
              "name": "兴安盟",
              "id": "152200"
            },
            {
              "province": "内蒙古自治区",
              "name": "锡林郭勒盟",
              "id": "152500"
            },
            {
              "province": "内蒙古自治区",
              "name": "阿拉善盟",
              "id": "152900"
            }
          ],
          "210000": [
            {
              "province": "辽宁省",
              "name": "沈阳市",
              "id": "210100"
            },
            {
              "province": "辽宁省",
              "name": "大连市",
              "id": "210200"
            },
            {
              "province": "辽宁省",
              "name": "鞍山市",
              "id": "210300"
            },
            {
              "province": "辽宁省",
              "name": "抚顺市",
              "id": "210400"
            },
            {
              "province": "辽宁省",
              "name": "本溪市",
              "id": "210500"
            },
            {
              "province": "辽宁省",
              "name": "丹东市",
              "id": "210600"
            },
            {
              "province": "辽宁省",
              "name": "锦州市",
              "id": "210700"
            },
            {
              "province": "辽宁省",
              "name": "营口市",
              "id": "210800"
            },
            {
              "province": "辽宁省",
              "name": "阜新市",
              "id": "210900"
            },
            {
              "province": "辽宁省",
              "name": "辽阳市",
              "id": "211000"
            },
            {
              "province": "辽宁省",
              "name": "盘锦市",
              "id": "211100"
            },
            {
              "province": "辽宁省",
              "name": "铁岭市",
              "id": "211200"
            },
            {
              "province": "辽宁省",
              "name": "朝阳市",
              "id": "211300"
            },
            {
              "province": "辽宁省",
              "name": "葫芦岛市",
              "id": "211400"
            }
          ],
          "220000": [
            {
              "province": "吉林省",
              "name": "长春市",
              "id": "220100"
            },
            {
              "province": "吉林省",
              "name": "吉林市",
              "id": "220200"
            },
            {
              "province": "吉林省",
              "name": "四平市",
              "id": "220300"
            },
            {
              "province": "吉林省",
              "name": "辽源市",
              "id": "220400"
            },
            {
              "province": "吉林省",
              "name": "通化市",
              "id": "220500"
            },
            {
              "province": "吉林省",
              "name": "白山市",
              "id": "220600"
            },
            {
              "province": "吉林省",
              "name": "松原市",
              "id": "220700"
            },
            {
              "province": "吉林省",
              "name": "白城市",
              "id": "220800"
            },
            {
              "province": "吉林省",
              "name": "延边朝鲜族自治州",
              "id": "222400"
            }
          ],
          "230000": [
            {
              "province": "黑龙江省",
              "name": "哈尔滨市",
              "id": "230100"
            },
            {
              "province": "黑龙江省",
              "name": "齐齐哈尔市",
              "id": "230200"
            },
            {
              "province": "黑龙江省",
              "name": "鸡西市",
              "id": "230300"
            },
            {
              "province": "黑龙江省",
              "name": "鹤岗市",
              "id": "230400"
            },
            {
              "province": "黑龙江省",
              "name": "双鸭山市",
              "id": "230500"
            },
            {
              "province": "黑龙江省",
              "name": "大庆市",
              "id": "230600"
            },
            {
              "province": "黑龙江省",
              "name": "伊春市",
              "id": "230700"
            },
            {
              "province": "黑龙江省",
              "name": "佳木斯市",
              "id": "230800"
            },
            {
              "province": "黑龙江省",
              "name": "七台河市",
              "id": "230900"
            },
            {
              "province": "黑龙江省",
              "name": "牡丹江市",
              "id": "231000"
            },
            {
              "province": "黑龙江省",
              "name": "黑河市",
              "id": "231100"
            },
            {
              "province": "黑龙江省",
              "name": "绥化市",
              "id": "231200"
            },
            {
              "province": "黑龙江省",
              "name": "大兴安岭地区",
              "id": "232700"
            }
          ],
          "310000": [
            {
              "province": "上海市",
              "name": "市辖区",
              "id": "310100"
            }
          ],
          "320000": [
            {
              "province": "江苏省",
              "name": "南京市",
              "id": "320100"
            },
            {
              "province": "江苏省",
              "name": "无锡市",
              "id": "320200"
            },
            {
              "province": "江苏省",
              "name": "徐州市",
              "id": "320300"
            },
            {
              "province": "江苏省",
              "name": "常州市",
              "id": "320400"
            },
            {
              "province": "江苏省",
              "name": "苏州市",
              "id": "320500"
            },
            {
              "province": "江苏省",
              "name": "南通市",
              "id": "320600"
            },
            {
              "province": "江苏省",
              "name": "连云港市",
              "id": "320700"
            },
            {
              "province": "江苏省",
              "name": "淮安市",
              "id": "320800"
            },
            {
              "province": "江苏省",
              "name": "盐城市",
              "id": "320900"
            },
            {
              "province": "江苏省",
              "name": "扬州市",
              "id": "321000"
            },
            {
              "province": "江苏省",
              "name": "镇江市",
              "id": "321100"
            },
            {
              "province": "江苏省",
              "name": "泰州市",
              "id": "321200"
            },
            {
              "province": "江苏省",
              "name": "宿迁市",
              "id": "321300"
            }
          ],
          "330000": [
            {
              "province": "浙江省",
              "name": "杭州市",
              "id": "330100"
            },
            {
              "province": "浙江省",
              "name": "宁波市",
              "id": "330200"
            },
            {
              "province": "浙江省",
              "name": "温州市",
              "id": "330300"
            },
            {
              "province": "浙江省",
              "name": "嘉兴市",
              "id": "330400"
            },
            {
              "province": "浙江省",
              "name": "湖州市",
              "id": "330500"
            },
            {
              "province": "浙江省",
              "name": "绍兴市",
              "id": "330600"
            },
            {
              "province": "浙江省",
              "name": "金华市",
              "id": "330700"
            },
            {
              "province": "浙江省",
              "name": "衢州市",
              "id": "330800"
            },
            {
              "province": "浙江省",
              "name": "舟山市",
              "id": "330900"
            },
            {
              "province": "浙江省",
              "name": "台州市",
              "id": "331000"
            },
            {
              "province": "浙江省",
              "name": "丽水市",
              "id": "331100"
            }
          ],
          "340000": [
            {
              "province": "安徽省",
              "name": "合肥市",
              "id": "340100"
            },
            {
              "province": "安徽省",
              "name": "芜湖市",
              "id": "340200"
            },
            {
              "province": "安徽省",
              "name": "蚌埠市",
              "id": "340300"
            },
            {
              "province": "安徽省",
              "name": "淮南市",
              "id": "340400"
            },
            {
              "province": "安徽省",
              "name": "马鞍山市",
              "id": "340500"
            },
            {
              "province": "安徽省",
              "name": "淮北市",
              "id": "340600"
            },
            {
              "province": "安徽省",
              "name": "铜陵市",
              "id": "340700"
            },
            {
              "province": "安徽省",
              "name": "安庆市",
              "id": "340800"
            },
            {
              "province": "安徽省",
              "name": "黄山市",
              "id": "341000"
            },
            {
              "province": "安徽省",
              "name": "滁州市",
              "id": "341100"
            },
            {
              "province": "安徽省",
              "name": "阜阳市",
              "id": "341200"
            },
            {
              "province": "安徽省",
              "name": "宿州市",
              "id": "341300"
            },
            {
              "province": "安徽省",
              "name": "六安市",
              "id": "341500"
            },
            {
              "province": "安徽省",
              "name": "亳州市",
              "id": "341600"
            },
            {
              "province": "安徽省",
              "name": "池州市",
              "id": "341700"
            },
            {
              "province": "安徽省",
              "name": "宣城市",
              "id": "341800"
            }
          ],
          "350000": [
            {
              "province": "福建省",
              "name": "福州市",
              "id": "350100"
            },
            {
              "province": "福建省",
              "name": "厦门市",
              "id": "350200"
            },
            {
              "province": "福建省",
              "name": "莆田市",
              "id": "350300"
            },
            {
              "province": "福建省",
              "name": "三明市",
              "id": "350400"
            },
            {
              "province": "福建省",
              "name": "泉州市",
              "id": "350500"
            },
            {
              "province": "福建省",
              "name": "漳州市",
              "id": "350600"
            },
            {
              "province": "福建省",
              "name": "南平市",
              "id": "350700"
            },
            {
              "province": "福建省",
              "name": "龙岩市",
              "id": "350800"
            },
            {
              "province": "福建省",
              "name": "宁德市",
              "id": "350900"
            }
          ],
          "360000": [
            {
              "province": "江西省",
              "name": "南昌市",
              "id": "360100"
            },
            {
              "province": "江西省",
              "name": "景德镇市",
              "id": "360200"
            },
            {
              "province": "江西省",
              "name": "萍乡市",
              "id": "360300"
            },
            {
              "province": "江西省",
              "name": "九江市",
              "id": "360400"
            },
            {
              "province": "江西省",
              "name": "新余市",
              "id": "360500"
            },
            {
              "province": "江西省",
              "name": "鹰潭市",
              "id": "360600"
            },
            {
              "province": "江西省",
              "name": "赣州市",
              "id": "360700"
            },
            {
              "province": "江西省",
              "name": "吉安市",
              "id": "360800"
            },
            {
              "province": "江西省",
              "name": "宜春市",
              "id": "360900"
            },
            {
              "province": "江西省",
              "name": "抚州市",
              "id": "361000"
            },
            {
              "province": "江西省",
              "name": "上饶市",
              "id": "361100"
            }
          ],
          "370000": [
            {
              "province": "山东省",
              "name": "济南市",
              "id": "370100"
            },
            {
              "province": "山东省",
              "name": "青岛市",
              "id": "370200"
            },
            {
              "province": "山东省",
              "name": "淄博市",
              "id": "370300"
            },
            {
              "province": "山东省",
              "name": "枣庄市",
              "id": "370400"
            },
            {
              "province": "山东省",
              "name": "东营市",
              "id": "370500"
            },
            {
              "province": "山东省",
              "name": "烟台市",
              "id": "370600"
            },
            {
              "province": "山东省",
              "name": "潍坊市",
              "id": "370700"
            },
            {
              "province": "山东省",
              "name": "济宁市",
              "id": "370800"
            },
            {
              "province": "山东省",
              "name": "泰安市",
              "id": "370900"
            },
            {
              "province": "山东省",
              "name": "威海市",
              "id": "371000"
            },
            {
              "province": "山东省",
              "name": "日照市",
              "id": "371100"
            },
            {
              "province": "山东省",
              "name": "莱芜市",
              "id": "371200"
            },
            {
              "province": "山东省",
              "name": "临沂市",
              "id": "371300"
            },
            {
              "province": "山东省",
              "name": "德州市",
              "id": "371400"
            },
            {
              "province": "山东省",
              "name": "聊城市",
              "id": "371500"
            },
            {
              "province": "山东省",
              "name": "滨州市",
              "id": "371600"
            },
            {
              "province": "山东省",
              "name": "菏泽市",
              "id": "371700"
            }
          ],
          "410000": [
            {
              "province": "河南省",
              "name": "郑州市",
              "id": "410100"
            },
            {
              "province": "河南省",
              "name": "开封市",
              "id": "410200"
            },
            {
              "province": "河南省",
              "name": "洛阳市",
              "id": "410300"
            },
            {
              "province": "河南省",
              "name": "平顶山市",
              "id": "410400"
            },
            {
              "province": "河南省",
              "name": "安阳市",
              "id": "410500"
            },
            {
              "province": "河南省",
              "name": "鹤壁市",
              "id": "410600"
            },
            {
              "province": "河南省",
              "name": "新乡市",
              "id": "410700"
            },
            {
              "province": "河南省",
              "name": "焦作市",
              "id": "410800"
            },
            {
              "province": "河南省",
              "name": "濮阳市",
              "id": "410900"
            },
            {
              "province": "河南省",
              "name": "许昌市",
              "id": "411000"
            },
            {
              "province": "河南省",
              "name": "漯河市",
              "id": "411100"
            },
            {
              "province": "河南省",
              "name": "三门峡市",
              "id": "411200"
            },
            {
              "province": "河南省",
              "name": "南阳市",
              "id": "411300"
            },
            {
              "province": "河南省",
              "name": "商丘市",
              "id": "411400"
            },
            {
              "province": "河南省",
              "name": "信阳市",
              "id": "411500"
            },
            {
              "province": "河南省",
              "name": "周口市",
              "id": "411600"
            },
            {
              "province": "河南省",
              "name": "驻马店市",
              "id": "411700"
            },
            {
              "province": "河南省",
              "name": "省直辖县级行政区划",
              "id": "419000"
            }
          ],
          "420000": [
            {
              "province": "湖北省",
              "name": "武汉市",
              "id": "420100"
            },
            {
              "province": "湖北省",
              "name": "黄石市",
              "id": "420200"
            },
            {
              "province": "湖北省",
              "name": "十堰市",
              "id": "420300"
            },
            {
              "province": "湖北省",
              "name": "宜昌市",
              "id": "420500"
            },
            {
              "province": "湖北省",
              "name": "襄阳市",
              "id": "420600"
            },
            {
              "province": "湖北省",
              "name": "鄂州市",
              "id": "420700"
            },
            {
              "province": "湖北省",
              "name": "荆门市",
              "id": "420800"
            },
            {
              "province": "湖北省",
              "name": "孝感市",
              "id": "420900"
            },
            {
              "province": "湖北省",
              "name": "荆州市",
              "id": "421000"
            },
            {
              "province": "湖北省",
              "name": "黄冈市",
              "id": "421100"
            },
            {
              "province": "湖北省",
              "name": "咸宁市",
              "id": "421200"
            },
            {
              "province": "湖北省",
              "name": "随州市",
              "id": "421300"
            },
            {
              "province": "湖北省",
              "name": "恩施土家族苗族自治州",
              "id": "422800"
            },
            {
              "province": "湖北省",
              "name": "省直辖县级行政区划",
              "id": "429000"
            }
          ],
          "430000": [
            {
              "province": "湖南省",
              "name": "长沙市",
              "id": "430100"
            },
            {
              "province": "湖南省",
              "name": "株洲市",
              "id": "430200"
            },
            {
              "province": "湖南省",
              "name": "湘潭市",
              "id": "430300"
            },
            {
              "province": "湖南省",
              "name": "衡阳市",
              "id": "430400"
            },
            {
              "province": "湖南省",
              "name": "邵阳市",
              "id": "430500"
            },
            {
              "province": "湖南省",
              "name": "岳阳市",
              "id": "430600"
            },
            {
              "province": "湖南省",
              "name": "常德市",
              "id": "430700"
            },
            {
              "province": "湖南省",
              "name": "张家界市",
              "id": "430800"
            },
            {
              "province": "湖南省",
              "name": "益阳市",
              "id": "430900"
            },
            {
              "province": "湖南省",
              "name": "郴州市",
              "id": "431000"
            },
            {
              "province": "湖南省",
              "name": "永州市",
              "id": "431100"
            },
            {
              "province": "湖南省",
              "name": "怀化市",
              "id": "431200"
            },
            {
              "province": "湖南省",
              "name": "娄底市",
              "id": "431300"
            },
            {
              "province": "湖南省",
              "name": "湘西土家族苗族自治州",
              "id": "433100"
            }
          ],
          "440000": [
            {
              "province": "广东省",
              "name": "广州市",
              "id": "440100"
            },
            {
              "province": "广东省",
              "name": "韶关市",
              "id": "440200"
            },
            {
              "province": "广东省",
              "name": "深圳市",
              "id": "440300"
            },
            {
              "province": "广东省",
              "name": "珠海市",
              "id": "440400"
            },
            {
              "province": "广东省",
              "name": "汕头市",
              "id": "440500"
            },
            {
              "province": "广东省",
              "name": "佛山市",
              "id": "440600"
            },
            {
              "province": "广东省",
              "name": "江门市",
              "id": "440700"
            },
            {
              "province": "广东省",
              "name": "湛江市",
              "id": "440800"
            },
            {
              "province": "广东省",
              "name": "茂名市",
              "id": "440900"
            },
            {
              "province": "广东省",
              "name": "肇庆市",
              "id": "441200"
            },
            {
              "province": "广东省",
              "name": "惠州市",
              "id": "441300"
            },
            {
              "province": "广东省",
              "name": "梅州市",
              "id": "441400"
            },
            {
              "province": "广东省",
              "name": "汕尾市",
              "id": "441500"
            },
            {
              "province": "广东省",
              "name": "河源市",
              "id": "441600"
            },
            {
              "province": "广东省",
              "name": "阳江市",
              "id": "441700"
            },
            {
              "province": "广东省",
              "name": "清远市",
              "id": "441800"
            },
            {
              "province": "广东省",
              "name": "东莞市",
              "id": "441900"
            },
            {
              "province": "广东省",
              "name": "中山市",
              "id": "442000"
            },
            {
              "province": "广东省",
              "name": "潮州市",
              "id": "445100"
            },
            {
              "province": "广东省",
              "name": "揭阳市",
              "id": "445200"
            },
            {
              "province": "广东省",
              "name": "云浮市",
              "id": "445300"
            }
          ],
          "450000": [
            {
              "province": "广西壮族自治区",
              "name": "南宁市",
              "id": "450100"
            },
            {
              "province": "广西壮族自治区",
              "name": "柳州市",
              "id": "450200"
            },
            {
              "province": "广西壮族自治区",
              "name": "桂林市",
              "id": "450300"
            },
            {
              "province": "广西壮族自治区",
              "name": "梧州市",
              "id": "450400"
            },
            {
              "province": "广西壮族自治区",
              "name": "北海市",
              "id": "450500"
            },
            {
              "province": "广西壮族自治区",
              "name": "防城港市",
              "id": "450600"
            },
            {
              "province": "广西壮族自治区",
              "name": "钦州市",
              "id": "450700"
            },
            {
              "province": "广西壮族自治区",
              "name": "贵港市",
              "id": "450800"
            },
            {
              "province": "广西壮族自治区",
              "name": "玉林市",
              "id": "450900"
            },
            {
              "province": "广西壮族自治区",
              "name": "百色市",
              "id": "451000"
            },
            {
              "province": "广西壮族自治区",
              "name": "贺州市",
              "id": "451100"
            },
            {
              "province": "广西壮族自治区",
              "name": "河池市",
              "id": "451200"
            },
            {
              "province": "广西壮族自治区",
              "name": "来宾市",
              "id": "451300"
            },
            {
              "province": "广西壮族自治区",
              "name": "崇左市",
              "id": "451400"
            }
          ],
          "460000": [
            {
              "province": "海南省",
              "name": "海口市",
              "id": "460100"
            },
            {
              "province": "海南省",
              "name": "三亚市",
              "id": "460200"
            },
            {
              "province": "海南省",
              "name": "三沙市",
              "id": "460300"
            },
            {
              "province": "海南省",
              "name": "儋州市",
              "id": "460400"
            },
            {
              "province": "海南省",
              "name": "省直辖县级行政区划",
              "id": "469000"
            }
          ],
          "500000": [
            {
              "province": "重庆市",
              "name": "市辖区",
              "id": "500100"
            },
            {
              "province": "重庆市",
              "name": "县",
              "id": "500200"
            }
          ],
          "510000": [
            {
              "province": "四川省",
              "name": "成都市",
              "id": "510100"
            },
            {
              "province": "四川省",
              "name": "自贡市",
              "id": "510300"
            },
            {
              "province": "四川省",
              "name": "攀枝花市",
              "id": "510400"
            },
            {
              "province": "四川省",
              "name": "泸州市",
              "id": "510500"
            },
            {
              "province": "四川省",
              "name": "德阳市",
              "id": "510600"
            },
            {
              "province": "四川省",
              "name": "绵阳市",
              "id": "510700"
            },
            {
              "province": "四川省",
              "name": "广元市",
              "id": "510800"
            },
            {
              "province": "四川省",
              "name": "遂宁市",
              "id": "510900"
            },
            {
              "province": "四川省",
              "name": "内江市",
              "id": "511000"
            },
            {
              "province": "四川省",
              "name": "乐山市",
              "id": "511100"
            },
            {
              "province": "四川省",
              "name": "南充市",
              "id": "511300"
            },
            {
              "province": "四川省",
              "name": "眉山市",
              "id": "511400"
            },
            {
              "province": "四川省",
              "name": "宜宾市",
              "id": "511500"
            },
            {
              "province": "四川省",
              "name": "广安市",
              "id": "511600"
            },
            {
              "province": "四川省",
              "name": "达州市",
              "id": "511700"
            },
            {
              "province": "四川省",
              "name": "雅安市",
              "id": "511800"
            },
            {
              "province": "四川省",
              "name": "巴中市",
              "id": "511900"
            },
            {
              "province": "四川省",
              "name": "资阳市",
              "id": "512000"
            },
            {
              "province": "四川省",
              "name": "阿坝藏族羌族自治州",
              "id": "513200"
            },
            {
              "province": "四川省",
              "name": "甘孜藏族自治州",
              "id": "513300"
            },
            {
              "province": "四川省",
              "name": "凉山彝族自治州",
              "id": "513400"
            }
          ],
          "520000": [
            {
              "province": "贵州省",
              "name": "贵阳市",
              "id": "520100"
            },
            {
              "province": "贵州省",
              "name": "六盘水市",
              "id": "520200"
            },
            {
              "province": "贵州省",
              "name": "遵义市",
              "id": "520300"
            },
            {
              "province": "贵州省",
              "name": "安顺市",
              "id": "520400"
            },
            {
              "province": "贵州省",
              "name": "毕节市",
              "id": "520500"
            },
            {
              "province": "贵州省",
              "name": "铜仁市",
              "id": "520600"
            },
            {
              "province": "贵州省",
              "name": "黔西南布依族苗族自治州",
              "id": "522300"
            },
            {
              "province": "贵州省",
              "name": "黔东南苗族侗族自治州",
              "id": "522600"
            },
            {
              "province": "贵州省",
              "name": "黔南布依族苗族自治州",
              "id": "522700"
            }
          ],
          "530000": [
            {
              "province": "云南省",
              "name": "昆明市",
              "id": "530100"
            },
            {
              "province": "云南省",
              "name": "曲靖市",
              "id": "530300"
            },
            {
              "province": "云南省",
              "name": "玉溪市",
              "id": "530400"
            },
            {
              "province": "云南省",
              "name": "保山市",
              "id": "530500"
            },
            {
              "province": "云南省",
              "name": "昭通市",
              "id": "530600"
            },
            {
              "province": "云南省",
              "name": "丽江市",
              "id": "530700"
            },
            {
              "province": "云南省",
              "name": "普洱市",
              "id": "530800"
            },
            {
              "province": "云南省",
              "name": "临沧市",
              "id": "530900"
            },
            {
              "province": "云南省",
              "name": "楚雄彝族自治州",
              "id": "532300"
            },
            {
              "province": "云南省",
              "name": "红河哈尼族彝族自治州",
              "id": "532500"
            },
            {
              "province": "云南省",
              "name": "文山壮族苗族自治州",
              "id": "532600"
            },
            {
              "province": "云南省",
              "name": "西双版纳傣族自治州",
              "id": "532800"
            },
            {
              "province": "云南省",
              "name": "大理白族自治州",
              "id": "532900"
            },
            {
              "province": "云南省",
              "name": "德宏傣族景颇族自治州",
              "id": "533100"
            },
            {
              "province": "云南省",
              "name": "怒江傈僳族自治州",
              "id": "533300"
            },
            {
              "province": "云南省",
              "name": "迪庆藏族自治州",
              "id": "533400"
            }
          ],
          "540000": [
            {
              "province": "西藏自治区",
              "name": "拉萨市",
              "id": "540100"
            },
            {
              "province": "西藏自治区",
              "name": "日喀则市",
              "id": "540200"
            },
            {
              "province": "西藏自治区",
              "name": "昌都市",
              "id": "540300"
            },
            {
              "province": "西藏自治区",
              "name": "林芝市",
              "id": "540400"
            },
            {
              "province": "西藏自治区",
              "name": "山南市",
              "id": "540500"
            },
            {
              "province": "西藏自治区",
              "name": "那曲地区",
              "id": "542400"
            },
            {
              "province": "西藏自治区",
              "name": "阿里地区",
              "id": "542500"
            }
          ],
          "610000": [
            {
              "province": "陕西省",
              "name": "西安市",
              "id": "610100"
            },
            {
              "province": "陕西省",
              "name": "铜川市",
              "id": "610200"
            },
            {
              "province": "陕西省",
              "name": "宝鸡市",
              "id": "610300"
            },
            {
              "province": "陕西省",
              "name": "咸阳市",
              "id": "610400"
            },
            {
              "province": "陕西省",
              "name": "渭南市",
              "id": "610500"
            },
            {
              "province": "陕西省",
              "name": "延安市",
              "id": "610600"
            },
            {
              "province": "陕西省",
              "name": "汉中市",
              "id": "610700"
            },
            {
              "province": "陕西省",
              "name": "榆林市",
              "id": "610800"
            },
            {
              "province": "陕西省",
              "name": "安康市",
              "id": "610900"
            },
            {
              "province": "陕西省",
              "name": "商洛市",
              "id": "611000"
            }
          ],
          "620000": [
            {
              "province": "甘肃省",
              "name": "兰州市",
              "id": "620100"
            },
            {
              "province": "甘肃省",
              "name": "嘉峪关市",
              "id": "620200"
            },
            {
              "province": "甘肃省",
              "name": "金昌市",
              "id": "620300"
            },
            {
              "province": "甘肃省",
              "name": "白银市",
              "id": "620400"
            },
            {
              "province": "甘肃省",
              "name": "天水市",
              "id": "620500"
            },
            {
              "province": "甘肃省",
              "name": "武威市",
              "id": "620600"
            },
            {
              "province": "甘肃省",
              "name": "张掖市",
              "id": "620700"
            },
            {
              "province": "甘肃省",
              "name": "平凉市",
              "id": "620800"
            },
            {
              "province": "甘肃省",
              "name": "酒泉市",
              "id": "620900"
            },
            {
              "province": "甘肃省",
              "name": "庆阳市",
              "id": "621000"
            },
            {
              "province": "甘肃省",
              "name": "定西市",
              "id": "621100"
            },
            {
              "province": "甘肃省",
              "name": "陇南市",
              "id": "621200"
            },
            {
              "province": "甘肃省",
              "name": "临夏回族自治州",
              "id": "622900"
            },
            {
              "province": "甘肃省",
              "name": "甘南藏族自治州",
              "id": "623000"
            }
          ],
          "630000": [
            {
              "province": "青海省",
              "name": "西宁市",
              "id": "630100"
            },
            {
              "province": "青海省",
              "name": "海东市",
              "id": "630200"
            },
            {
              "province": "青海省",
              "name": "海北藏族自治州",
              "id": "632200"
            },
            {
              "province": "青海省",
              "name": "黄南藏族自治州",
              "id": "632300"
            },
            {
              "province": "青海省",
              "name": "海南藏族自治州",
              "id": "632500"
            },
            {
              "province": "青海省",
              "name": "果洛藏族自治州",
              "id": "632600"
            },
            {
              "province": "青海省",
              "name": "玉树藏族自治州",
              "id": "632700"
            },
            {
              "province": "青海省",
              "name": "海西蒙古族藏族自治州",
              "id": "632800"
            }
          ],
          "640000": [
            {
              "province": "宁夏回族自治区",
              "name": "银川市",
              "id": "640100"
            },
            {
              "province": "宁夏回族自治区",
              "name": "石嘴山市",
              "id": "640200"
            },
            {
              "province": "宁夏回族自治区",
              "name": "吴忠市",
              "id": "640300"
            },
            {
              "province": "宁夏回族自治区",
              "name": "固原市",
              "id": "640400"
            },
            {
              "province": "宁夏回族自治区",
              "name": "中卫市",
              "id": "640500"
            }
          ],
          "650000": [
            {
              "province": "新疆维吾尔自治区",
              "name": "乌鲁木齐市",
              "id": "650100"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "克拉玛依市",
              "id": "650200"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "吐鲁番市",
              "id": "650400"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "哈密市",
              "id": "650500"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "昌吉回族自治州",
              "id": "652300"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "博尔塔拉蒙古自治州",
              "id": "652700"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "巴音郭楞蒙古自治州",
              "id": "652800"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "阿克苏地区",
              "id": "652900"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "克孜勒苏柯尔克孜自治州",
              "id": "653000"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "喀什地区",
              "id": "653100"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "和田地区",
              "id": "653200"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "伊犁哈萨克自治州",
              "id": "654000"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "塔城地区",
              "id": "654200"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "阿勒泰地区",
              "id": "654300"
            },
            {
              "province": "新疆维吾尔自治区",
              "name": "自治区直辖县级行政区划",
              "id": "659000"
            }
          ]
        },
        cityChoice: '',
        studentRules: {
          name: [
            {required: true, message: '请输入学生姓名', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择学生性别', trigger: 'blur'}
          ],
          nationality: [
            {required: true, message: '请选择学生民族', trigger: 'blur'}
          ],
          // avatar: [
          //     {required: true, message: '请选择学生照片', trigger: 'blur'}
          // ],
          institute: [
            {required: true, message: '请输入学院名', trigger: 'blur'}
          ],
          // department: [
          //     {required: true, message: '请输入系名', trigger: 'blur'}
          // ],
          major: [
            {required: true, message: '请输入专业名', trigger: 'blur'}
          ],
          _class: [
            {required: true, message: '请输入班级', trigger: 'blur'},
          ],
          number: [
            {required: true, message: '请输入学号', trigger: 'blur'}
          ],
          building: [
            {required: true, message: '请填写学生楼栋', trigger: 'blur'}
          ],
          dorm: [
            {required: true, message: '请输入学生寝室号', trigger: 'blur'},
            {type: 'number', message: '寝室号必须为数字', trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '请输入学生的电话号码', trigger: 'blur'},
            {type: 'number', message: '你的输入不符合规范', trigger: 'blur'}
          ],
          idNumber: [
            {required: true, message: '请输入学生的身份证号码', trigger: 'blur'},
            {max: 18, message: '身份证号最长为18位', trigger: 'blur'}
          ],
          qq: [
            {required: true, message: '请输入学生的QQ号', trigger: 'blur'},
            {type: 'number', message: 'QQ号必须为数字', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入学生的家庭住址', trigger: 'blur'}
          ],
          politicalStatus: [
            {required: true, message: '请输入学生的政治面貌', trigger: 'blur'}
          ],
          classPosition: [
            {required: true, message: '请输入学生的班级职位', trigger: 'blur'}
          ],
          father_name: [
            {required: true, message: '请输入学生父亲的姓名', trigger: 'blur'}
          ],
          father_tel: [
            {required: true, message: '请输入学生父亲的电话', trigger: 'blur'},
            {type: 'number', message: '你的输入不符合规范', trigger: 'blur'}
          ],
          mother_name: [
            {required: true, message: '请输入学生母亲的姓名', trigger: 'blur'}
          ],
          mother_tel: [
            {required: true, message: '请输入学生母亲的电话', trigger: 'blur'},
            {type: 'number', message: '你的输入不符合规范', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择所在省份', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择所在城市', trigger: 'blur'}
          ]
        }
      }
    },

    created() {
      //获得基本选项
      if(JSON.parse(sessionStorage.getItem('user')).roles.indexOf('班长')>=0){
        this.monitor=true;
        this.memberSwitch=true;
      }
      else{
        this.getOptions_basic();
      }
      //判断是否是由myStudents跳转而来
      if (this.$route.params.selectedClass !== undefined && this.$route.params.selectedMajor !== undefined) {
        console.log('selectedClass and selectedMajor are set');
        this.selectedClass = this.$route.params.selectedClass;
        this.selectedMajor = this.$route.params.selectedMajor;
      }
      //判断是否是由singleinfo或者singleinfochange跳转而来
      if (this.$route.params.major !== undefined) {
        this.memberSwitch =this.$route.params.memberSwitch;
        this.selectedClass = this.$route.params.class;
        this.selectedMajor = this.$route.params.major;
        this.selectedSex = this.$route.params.sex;
        this.selectedNationality = this.$route.params.nationality;
        this.selectedHometown = this.$route.params.hometown;
        this.currentPage = this.$route.params.page;
        this.pageSize = this.$route.params.size;
        console.log(this.$route.params.page)
      }
      this.sendQuery();
    },

    methods: {
      deleteStudent(number){
        this.$confirm('请确认是否删除该学生账户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/sm/deleteStudent',{stuId:number}).then(res=>{
            if(res.data.status === 0){
              this.$message({
                message:res.message,
                type:'success'
              })
            }
          }).catch(error=>{
            this.$message.error('删除失败');
          });
        }).catch(() => {
        });
      },
      resetPage() {
        this.currentPage = 1;
        this.sendQuery();
      },
      resetClass(){
        this.selectedClass = '所有班级';
      },
      handleSelectedMajor() {
        this.resetClass();
        this.resetPage();
      },
      handleSelectedClass() {
        this.resetPage();
      },
      handleSelectedSex() {
        this.resetPage();
      },
      handleSelectedNationality() {
        this.resetPage();
      },
      handleSelectedHometown() {
        this.resetPage();
      },
      handleSelectedNumber(){
        this.sendQuery();
      },
      tableSelectionChange(val) {
        console.log(val);
        this.selected = val;
      },

      //从后端获得基本选项
      getOptions_basic() {
        if(this.monitor===false){
          let dict ={};
          dict.showAllMembers=this.memberSwitch;
          this.$store.dispatch('majoroptions', {data:dict}).then(
            res => {
              this.optionsForMajor = ["占位","所有专业"].concat(res.data.data);
            }
          );
        }
      },
      //一旦切换“所有学生、我分管的”开关的状态，就会触发复位，并重新拉取基本选项
      handleMemberSwitch() {
        this.getOptions_basic();
        this.resetChoice();
      },
      //跳转到学生的详细信息页面
      handleDetailedInfo(student) {
        console.log(student);
        this.$router.push(
          {
            name: 'singleinfo',
            params: {
              memberSwitch:this.memberSwitch,
              major:this.selectedMajor,
              class:this.selectedClass,
              sex:this.selectedSex,
              nationality:this.selectedNationality,
              hometown:this.selectedHometown,
              page:this.currentPage,
              size:this.pageSize
            },
            query: {
              number: student,
            }
          }
        );
      },
      //重置过滤选项
      resetChoice() {
        this.selectedNumber = '';
        if(this.monitor===true){
          this.selectedMajor=this.monitorMajor;
        }
        else{
          this.selectedMajor = '所有专业';
        }
        this.selectedSex = '所有性别';
        this.selectedNationality = '所有民族';
        this.selectedHometown = '所有籍贯';
        this.sendQuery(); //重置后获取一次数据
      },
      sendQuery() {
        this.whileLoading = true;
        // 生成条件
        let dict = {};
        if (this.selectedNumber.length!== 0){

          var start = new RegExp(/^\d+/);
          if(start.exec(this.selectedNumber)===null){
            dict.stuName=this.selectedNumber;
          }
          else{
            dict.number = this.selectedNumber;
          }
          if(this.monitor===true){
            dict._class=this.selectedClass;
            dict.major=this.selectedMajor;
          }
        }
        else {
          if (this.selectedClass !== '所有班级') dict._class = this.selectedClass;
          if (this.selectedMajor !== '所有专业') dict.major = this.selectedMajor;
        }
        if (this.selectedSex !== '所有性别') dict.sex = this.selectedSex;
        if (this.selectedNationality !== '所有民族') dict.nationality = this.selectedNationality;
        if (this.selectedHometown !== '所有籍贯') dict.hometown = this.selectedHometown;
        dict.currentPage = this.currentPage;
        dict.pageSize = this.pageSize;
        dict.showAllMembers = this.memberSwitch;
        //发送请求
        this.$axios.post("sm/studentinfo", dict).then(response => {
          if (response.data.status === 0) {
            this.recordQuantity = response.data.data.recordQuantity;
            this.studentsData = response.data.data.students;
            this.whileLoading = false;
            if(this.memberSwitch===true)
              this.mycharge=false;
            else
              this.mycharge=true;
          }
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
      exportTable() {
        this.whileLoading =  true;
        // 生成条件
        let dict = {};
        if(this.selectedMajor!=='所有专业') dict.major=this.selectedMajor;
        if(this.selectedClass!=='所有班级') dict._class=this.selectedClass;
        if(this.selectedSex!=='所有性别') dict.sex=this.selectedSex;
        if(this.selectedNationality!=='所有民族') dict.nationality=this.selectedNationality;
        if(this.selectedHometown!=='所有籍贯') dict.hometown=this.selectedHometown;
        dict.showAllMembers = this.memberSwitch;
        //发送请求
        this.$axios.post("/sm/info/export-info", dict,{responseType:'blob'}).then(response => {
          saveBytes = response.data;
          saveByteArray([saveBytes], '学生信息.xlsx');
          this.whileLoading=false;
        })
      },

      //信息管理部分
      //添加学生
      //选择省份后的市
      getCityOption() {
        let id = this.basicinfo[0].province;
        this.basicinfo[0].province = this.cityOption[id][0].province;
        this.citySelectionDisabled = false;
        this.cityChoice = this.cityOption[id];
      },
      //添加学生时选择完专业后获取对应的班级
      getAddOptionForClass(){
        this.$store.dispatch('classoptions', {data: {major: this.basicinfo[0].major}}).then(
          res => {
            this.addOptionForClass = ['所有班级'].concat(res.data.data);
            this.addOptionForClass.shift();
          });
      },
      // 点击表格行
      handleSizeChange(val) {
        this.pageSize = val;
        this.sendQuery();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sendQuery();
      },
      //修改学生信息
      handleChangeInfo(student) {
        console.log(student);
        this.$router.push(
          {
            name: 'singleinfochange',
            params: {
              memberSwitch:this.memberSwitch,
              major:this.selectedMajor,
              class:this.selectedClass,
              sex:this.selectedSex,
              nationality:this.selectedNationality,
              hometown:this.selectedHometown,
              page:this.currentPage,
              size:this.pageSize
            },
            query: {"student": student}
          }
        );
      },
      tableSelectionChange(val) {
        console.log(val);
        this.selected = val;
      },
      //添加学生
      handleCommand(command) {
        if (command === "dange") {
          this.dialogCreateVisible = true;
        }
        if (command === "piliang") {
          this.piliangVisible = true;
        }
      },
      //批量导入文件
      submitUpload() {
        this.$refs.upload.submit();
      },
      handlesucess(res,file,filelist){
        filelist.concat({name:file.name});
        console.log(filelist);
        if(res.status===1){
          this.$message({
            message:'上传成功',
            type:'success'
          });
        }
        else if(res.status===250){
          this.$message({
            message:'部分传输出错，请接收出错部分并重新传输:',
            type:'wrong'
          });
          this.$axios.post("sm/downloadFailedData", dict, {responseType: 'blob'}).then(response => {
            saveBytes = response.data;
            saveByteArray([saveBytes], '失败信息.xlsx');
          })
        }else{
          this.$message({
            message:'其他错误',
            type:'fail'
          });
        }
      },
      beforefileupload(file){
        let Xls = file.name.split('.');
        console.log(Xls[1] === 'xls'||Xls[1] === 'xlsx');
        if(Xls[1] === 'xls'||Xls[1] === 'xlsx'){
          let fd = new FormData();
          fd.append('file', file);
          fd.append('tableType', 'student grades');
          fd.append('para', this.selectedTerm);
          let config={headers:{'Content-Type':'multipart/form-data'}};
          this.$axios.post("sm/uploadExcel", fd, config).then(res => {
            console.log(res);
          })
          // uploadfiledata.action="studentgrades";
          // uploadfiledata.para=this.selectedTerm;
          return false
        }else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!')
          return false
        }
      },
      removeUsers(){
        this.deleteUser = !(this.deleteUser === true);
      },
      //删除多个用户
      // removeUsers() {
      //   this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个学生, 是否继续?', '提示', {type: 'warning'})
      //     .then(() => {
      //       console.log(this.selected);
      //       var numbers = [];
      //
      //       //提取选中项的学号number
      //       $.each(this.selected, (i, user) => {
      //         numbers.push(user.number);
      //       });
      //
      //       // 向请求服务端删除
      //       this.$store.dispatch("deleteStudent", {'data': {numbers: numbers.join(",")}, 'vm': this})
      //         .then(response => {
      //           this.$message.success('删除了' + this.selected.length + '个学生!');
      //         })
      //         .catch(response => {
      //           this.$message.error('删除失败!');
      //         })
      //     })
      //     .catch(() => {
      //       this.$message('已取消操作!');
      //     });
      // },
      changeImage(thefile, fileList) {
        let flInput = document.getElementsByName("studentImage")
        if (flInput[0].files.length > 0) {
          let file = flInput[0].files[0]
          const isJPG = file.type === 'image/jpeg'
          const isPNG = file.type === 'image/png'
          const isLT5M = file.size / 1024 / 1024 < 5
          if (!(isJPG || isPNG)) {
            this.$message.error('上传的照片只能是JPG或者PNG格式！')
          }
          if (!isLT5M) {
            this.$message.error('上传头像图片不能超过5MB！')
          }
          if ((isPNG || isJPG) && isLT5M) {
            stu_image = this
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function (ev) {
              stu_image.basicinfo[0].avatar = ev.target.result
            }
          }
        }
      },
      removeImage(file, fileList) {
        this.basicinfo[0].avatar = ''
      },
      uploadStudentInfo(formName) {
        console.log(this.basicinfo)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('sm/studentinfo', this.basicinfo)
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                console.log(error)
              })
            this.dialogCreateVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
    },
    asyncComputed: {
      // 班级可选
      classSelectionDisabled() {
        if(this.monitor===false)
          return this.selectedMajor === '所有专业'
      },
      // 班级选项
      optionsForClass() {
        if (this.selectedMajor === '所有专业') {
          this.selectedClass = '所有班级';
          return ['所有班级'];
        }
        else {
          if(this.monitor===false){
            let dict={};
            dict.showAllMembers=this.memberSwitch;
            dict.major=this.selectedMajor;
            return this.$store.dispatch('classoptions', {data: dict}).then(
              res => {
                return ['所有班级'].concat(res.data.data);
              }
            );
          }
        }
      },
      addOptionForMajor() {
        let temp = this.optionsForMajor;
        temp.shift();
        return temp;
      },
      _studentOptions() {
        let dict = {};
        if (this.selectedMajor !== '所有专业') dict.selectedMajor = this.selectedMajor;
        if (this.selectedClass !== '所有班级') dict.selectedClass = this.selectedClass;
        dict.showAllMembers = this.memberSwitch;
        this.$axios.post('sm/studentoptions', dict).then(
          res => {

            this.studentOptions.optionsForSex = ['所有性别'].concat(res.data.data.choice.optionsForSex);
            this.studentOptions.optionsForNationality = ['所有民族'].concat(res.data.data.choice.optionsForNationality);
            this.studentOptions.optionsForHometown = ['所有籍贯'].concat(res.data.data.choice.optionsForHometown);

          }
        );
      },

    },
    watch:{
      selectedNumber(newVal, oldVal) {
        if (oldVal.length === 0) {
          this.prevStatusOfClassSelection = this.classSelectionDisabled; // 记录输入学号前的班级下拉菜单禁用状态
          this.classSelectionDisabled = true;
          this.majorSelectionDisabled = true;
        }
        if (newVal.length === 0) {
          this.classSelectionDisabled = this.prevStatusOfClassSelection;
          this.majorSelectionDisabled = false;
        }
      }
    }
  }


</script>
