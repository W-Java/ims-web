<template>
  <div>
    <div>
      <div><h1>学生干部加分</h1></div>
<!--      学生干部加分      -->
      <cadres-bonus
        :cadres-table-data = 'cadresTableData'
        @addItem = 'addItem'
        @deleteItem = 'deleteItem'
      />
      <div><h1>其它加分</h1></div>
<!--      其他加分      -->
      <other-bonus
        :others-table-data = 'othersTableData'
        @addItem = 'addItem'
        @deleteItem = 'deleteItem'
      />
    </div>
<!--    学生干部加分表单    -->
    <cadres-form
      :cadres-dialog-visible = 'cadresDialogVisible'
      :form = 'Form'
      :form-rules = 'formRules'
      :file-list = 'fileList'
      :show-progress = 'showProgress'
      :upload-percent = 'uploadPercent'
      :button-disable = 'buttonDisable'
      @handleFileSelection = 'handleFileSelection'
      @cadresSure = 'cadresSure'
      @cadresCancel = 'cadresCancel'
    />
<!--    其他加分表单    -->
    <other-form
      :others-dialog-visible = 'othersDialogVisible'
      :form = 'Form'
      :form-rules = 'formRules'
      :file-list = 'fileList'
      :show-progress = 'showProgress'
      :upload-percent = 'uploadPercent'
      :button-disable = 'buttonDisable'
      @handleFileSelection = 'handleFileSelection'
      @othersSure = 'othersSure'
      @otherCancel = 'otherCancel'
    />
<!--    返回按钮    -->
    <el-row style="text-align: center; padding-top: 10%;">
      <el-button
        type="primary"
        @click="back"
        >返回</el-button
      >
    </el-row>
  </div>
</template>

<script>
  import CadresBonus from "./elements/CadresBonus.vue";
  import OtherBonus from "./elements/OtherBonus.vue";
  import CadresForm from "./elements/CadresForm.vue";
  import OtherForm from "./elements/OtherForm.vue";
  export default {
    name:"cadresAndOthersBonus",
    components: {
      OtherForm,
      CadresForm,
      OtherBonus,
      CadresBonus
    },
    data(){
      return{
        uploadPercent:0,
        cadresDialogVisible : false,
        othersDialogVisible:false,
        // modifying:false,
        cadresUpdating:false,
        cadresDeleting:false,
        showProgress:false,
        buttonDisable:false,
        cadresTableData:[],
        othersTableData:[],
        currentAcademicYear:'',
        Form:{
          itemName:'',
          score:'',
          imgUrl:''
        },
        fileList:[],
        formRules:{
          itemName:[
            {required:true,message:'请输入加分项名',trigger:'blur'}
          ],
          score:[
            {required:true,message:'请输入分值',trigger:'blur'},
            {type:'number',message:'分数必须为数字'}
          ],
          imgUrl:[
            {required:true,message:'需要添加证明',trigger:'blur'}
          ],
        },
      }
    },
    created(){
      window.vueer = this;
      this.currentAcademicYear = this.$route.query.term;
      this.updateTable();
    },
    methods:{
      addItem(dialog){
        this.showProgress = false;
        this.uploadPercent = 0;
        this.buttonDisable = false;
        if(dialog){
          this.cadresDialogVisible = true;
        }else{
          this.othersDialogVisible = true;
        }
      },
      cleanForm(){
        this.Form = {
          itemName:'',
          score:'',
          imgUrl:{}
        };
        this.fileList = [];
      },
      deleteItem(scope,data){
        console.log(scope.row);
        this.$axios.post('/sm/comprehensive/deleteItem',{id:scope.row.id}).then(res=>{
          console.log(res.data.message);
          data.splice(scope.$index,1);
        })
      },
      handleFileSelection(file,fileList){
        this.fileList.push(file);
        this.fileList = fileList.slice(-1);
        this.Form.imgUrl = file.url;
      },
      cadresCancel(){
        this.cleanForm();
        this.cadresDialogVisible = false;
      },
      otherCancel(){
        this.cleanForm();
        this.othersDialogVisible = false;
      },
      cadresSure(){
        this.$refs.cadresForm.validate((valid)=>{
          if(valid){
            if(this.fileList[0].size/1024/1024 > 4){
              this.$message({
                message:'文件不可超过4MB',
                type:'warning'
              });
              return;
            }
            this.buttonDisable = true;
            this.cadresUpdating = true;
            this.Form.itemType = "学生干部";
            this.uploadRecord();
          }
        });
      },
      othersSure(){
        this.$refs.othersForm.validate((valid)=>{
          if(valid){
            if(this.fileList[0].size/1024/1024 > 4){
              this.$message({
                message:'文件不可超过4MB',
                type:'warning'
              });
              return;
            }
            this.buttonDisable = true;
            this.cadresUpdating = false;
            this.Form.itemType = "其他加分";
            this.uploadRecord();
          }
        });
      },
      back(){
        this.$router.push({
          name:'ComprehensiveDeclare',
          query:{term:this.currentAcademicYear}
        })
      },
      updateTable(){
        this.$axios.post('/sm/comprehensive/cadresAndOthersTable',{currentAcademicYear:this.currentAcademicYear}).then(res=>{
          if(res.data.status === 0){
            this.cadresTableData = res.data.data.cadres;
            this.othersTableData = res.data.data.others;
          }
        })
      },
      //刷新表
      uploadRecord(){
        const file  = this.fileList[0];
        window.vueer.showProgress = true;
        this.$axios.post('/sm/comprehensive/addRecord',{
          itemName:this.Form.itemName,
          itemType:this.Form.itemType,
          score:this.Form.score,
          term:this.currentAcademicYear
        }).then(res=>{
          if(res.data.status === 0){
            console.log(res.data.data.id);
            this.Form.id = res.data.data.id;
            this.uploadToAliyun(file,res.data.data.id);
          }
        })
      },
      uploadToAliyun(file,itemId){
        let fd = new FormData();
        fd.append('file', file.raw);
        fd.append('itemId', itemId);
        let config={headers:{'Content-Type':'multipart/form-data'}};
        this.$axios.post("/sm/img/aliyunOss/upload", fd, config).then(res => {
          if(res.data.status === 400 || res.data.status === 403 || res.data.status === 404){
            console.log(err);
              window.vueer.$message.error('添加失败，请重试');
              // window.vueer.showProgress = false;
              // window.vueer.uploadPercent = 0;
          }else if(res.data.status === 0){
            window.vueer.cadresDialogVisible = false;
            window.vueer.othersDialogVisible = false;
            window.vueer.showProgress = false;
            window.vueer.uploadPercent = 0;

            //这里对判断对哪个表进行更新
            if(window.vueer.cadresUpdating){
              window.vueer.cadresTableData.push(window.vueer.Form);
            }else{
              window.vueer.othersTableData.push(window.vueer.Form);
            }
            window.vueer.cleanForm();
            window.vueer.$message({
              message:'添加成功',
              type:'success'});
          }
          console.log(res);
        }).catch(error=>{
          console.log("阿里云错误："+error);
        }).finally(res=>{
        });
      },
    },
  }
</script>
