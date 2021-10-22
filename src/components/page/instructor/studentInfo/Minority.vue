<template>
    <!--这里写内容-->
    <div>
        <el-table
                ref="classTable"
                :data="managedclasses"
                style="width: 100%"
                v-loading="networkLoading"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection">
            </el-table-column>
            <el-table-column
                    label="班级"
                    prop="name">
            </el-table-column>
            <el-table-column
                    prop="monitor"
                    label="班长">
            </el-table-column>
            <el-table-column
                    prop="leagueSecretary"
                    label="团支书">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="人数">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button @click="checkClassDetail(scope.$index)">详情</el-button>
                        <el-button @click="editeClassCadres(scope.$index)">学生</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-button type="danger" @click="moveDialogVisible = true">移除班级</el-button>
            <el-button @click="addClasses">添加班级</el-button>
        </el-row>
      <!-- 移除班级dialog -->
        <el-dialog
                title="移除班级"
                :visible.sync="moveDialogVisible">
            <el-row>
                <label>是否直接移除:</label>
                <el-select v-model="moveToTeacher" placeholder="请选择">
                    <el-option
                            label="是"
                            :value="true">
                    </el-option>
                    <el-option
                            label="否"
                            :value="false">
                    </el-option>
                </el-select>
            </el-row>
            <el-row>
                <label>目标老师:</label>
                <el-select v-model="targetTeacher" clearable filterable v-bind:disabled="moveToTeacher">
                    <el-option
                      v-for="(val,index) in teacherOption"
                      :key="index"
                      :label="val[1]"
                      :value="val[0]">
                    </el-option>

                </el-select>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="moveDialogVisible=false">取消</el-button>
                <el-button @click="moveClasses">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog width="70%" title="添加班级" :visible.sync="addDialogVisible" v-loading="networkLoading">
            <el-row>
                <el-checkbox-group v-model="classSelected">
                    <el-col :span="4" v-for="item in classOption" :key="item">
                        <el-checkbox :label="item" :value="item" border></el-checkbox>
                    </el-col>
                </el-checkbox-group>
            </el-row>
            <el-row type="flex" justify="end">
                <el-button type="primary" size="small" @click="checkClass">确认添加</el-button>
            </el-row>
            <div class="clearfix"></div>
        </el-dialog>
        <el-dialog :visible.sync="classDetailVisible" v-loading="networkLoading">
            <h2>{{classDetail.name}}:{{classDetail.number}}人</h2>
            <el-form ref="classDetailForm" :model="classDetail" label-position="right" label-width="75px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="班长" prop="monitor">
                            <el-select v-model="classDetail.monitor" clearable filterable placeholder="请选择">
                                <el-option
                                    v-for="item in students"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="副班长" prop="viceMonitor">
                            <el-select v-model="classDetail.viceMonitor" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="团支书" prop="leagueSecretary">
                            <el-select v-model="classDetail.leagueSecretary" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学习委员" prop="studyCommittee">
                            <el-select v-model="classDetail.studyCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="生活委员" prop="lifeCommittee">
                            <el-select v-model="classDetail.lifeCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文体委员" prop="stylisticsCommittee">
                            <el-select v-model="classDetail.stylisticsCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="组织委员" prop="organizationCommittee">
                            <el-select v-model="classDetail.organizationCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="宣传委员" prop="publicityCommittee">
                            <el-select v-model="classDetail.publicityCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="双创委员" prop="doubleCreationCommittee">
                            <el-select v-model="classDetail.doubleCreationCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="心理委员" prop="psychosocialCommittee">
                            <el-select v-model="classDetail.psychosocialCommittee" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="item in students"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="end">
                    <el-button type="primary" @click="updateClassDetail">保存</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>

</template>
<style scoped>

</style>

<script>
    export default {
        name: 'minority',
        data() {
            return {
                moveDialogVisible: false,
                addDialogVisible: false,
                classDetailVisible: false,
                targetTeacher: '',
                networkLoading: false,
                moveToTeacher: true,
                classDetail: '',
                managedclasses: [],
                teacherOption: '',
                classOption: [],
                classSelected: [],
                multipleSelection: [],
                students:[]
            }
        },
        created() {
            this.getTeacherManageClass();
            this.getTeacherOption();
        },
        methods: {
            //获取当辅导员管理的班级的信息
            getTeacherManageClass() {
                this.networkLoading = true;
                this.$axios.get('sm/classManage/class')
                    .then(
                        res => {
                            if (res.data.status === 0) {
                                this.managedclasses = res.data.data;
                                this.networkLoading = false;
                            }
                        }
                    )
            },
            //获取当前辅导员可以转移的老师
            getTeacherOption() {
                this.networkLoading = true;
                this.$axios.get('sm/classManage/peerTeacher')
                    .then(
                        res => {
                            if (res.data.status === 0) {
                              this.teacherOption = res.data.data;
                                this.networkLoading = false;
                            }
                        }
                    )
            },
            //获取复选框的清空
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //点击添加班级后触发的函数，获取无主班级列表
            addClasses() {
                this.addDialogVisible = true;
                this.networkLoading = true;
                this.$axios.get('sm/classManage/restClass')
                    .then(
                        res => {
                            if (res.data.status === 0) {
                                this.classOption = res.data.data;
                                this.networkLoading = false;
                            }
                        }
                    )
            },
            //执行添加班级操作
            checkClass() {
                this.addDialogVisible = false;
                let postData = {};
                postData.classes = this.classSelected;
                console.log(postData);
                this.$axios.post('sm/classManage/class', postData)
                    .then(
                        res => {
                            if (res.data.status === 0) {
                                console.log(res.data.message);
                            }
                        }
                    )
            },
            updateClassDetail() {
                this.classDetailVisible = false;
                let postData=this.classDetail;
                delete postData.major;
                this.$axios.put('sm/classManage/classCadres',postData)
                    .then(
                        res => {
                            if (res.data.status === 0) {
                                console.log(res.data.message);
                            }
                        }
                    )
            },
            moveClasses() {
                this.moveDialogVisible = false;
                let postData = {};
                postData.targetTeacher = this.targetTeacher;
                postData.classes = [];
                let length = this.multipleSelection.length;
                for (let j = 0; j < length; ++j) {
                    postData.classes.push(this.multipleSelection[j].name);
                }
                this.$axios.put('sm/classManage/class', postData)
                    .then(
                        res => {
                            if (res.data.status === 0) {
                                console.log(res.data.message);
                                this.getTeacherManageClass();
                            }
                        }
                    );
            },
            editeClassCadres(index) {
                this.classDetail = this.managedclasses[index];
                let postData={};
                postData.name=this.classDetail.name;
                //获取当前班级的学生列表

                this.$axios.post('sm/getClassStudents',postData).then(
                    res=>{
                        if(res.data.status===0){
                            this.students=res.data.data.students;
                        }
                        console.log(res.data.message);
                    }
                );

                this.classDetailVisible = true;
            },
            checkClassDetail(index) {
                this.$router.push(
                    {
                        name: 'studentinfo',
                        params: {selectedClass: this.managedclasses[index].name, selectedMajor: this.managedclasses[index].major}
                    }
                )
            }

        }
    }
</script>
