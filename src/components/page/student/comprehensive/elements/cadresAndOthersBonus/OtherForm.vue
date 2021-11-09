<template>
  <div>
    <el-dialog
      title="其他加分"
      :visible.sync = "othersDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="othersForm"
        :model="Form"
        :rules="formRules"
      >
        <el-form-item label="加分项目" prop="itemName">
          <el-input v-model="Form.itemName"/>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model.number="Form.score"/>
        </el-form-item>
        <el-form-item label="上传证明" prop="imgUrl">
          <el-upload
            :on-change="handleFileSelection"
            list-type="picture"
            action="123"
            :auto-upload="false"
            :file-list="fileList"
            accept=".jpg,.png"
          >
            <el-button
              size="small"
              type="primary"
            >选择文件</el-button
            >
            <div slot="tip" class="el-upload-tip">只能上传jpg/png文件,不能超过1MB</div>
          </el-upload>
          <el-progress
            v-show="showProgress"
            :text-inside="true"
            :stroke-width="18"
            :percentage="uploadPercent"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="othersSure"
          type="primary"
          v-loading="buttonDisable"
          :disabled="buttonDisable"
        >确定</el-button
        >
        <el-button
          @click="otherCancel"
        >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [
    'othersDialogVisible',
    'Form',
    'formRules',
    'fileList',
    'showProgress',
    'uploadPercent',
    'buttonDisable'
  ],
  emits: [
    'handleFileSelection',
    'othersSure',
    'otherCancel'
  ]
}
</script>

<style scoped>

</style>
