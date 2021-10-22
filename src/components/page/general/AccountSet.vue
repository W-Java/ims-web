<template>
  <div class="wrap" style="display:flex; justify-content: center;">
    <div class="content" style=" width:40%; ">
      <el-form :model="info" :rules="inputRules">
        <el-form-item label="旧密码" prop="password">
          <el-col>
            <el-input type="password" v-model="info.password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-col>
            <el-input type="password" v-model="info.newPassword"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="confirmPassword">
          <el-col>
            <el-input type="password" v-model="info.confirmPassword"></el-input>
          </el-col>
        </el-form-item>
        <el-button type="primary" size="small" @click="submit" :disabled="submitDisable">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "accountset",
    data() {
      return {
        inputRules: {
          password: [
            {required: true, message: '请输入原始密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'}
          ]
        },
        info: {password: '', newPassword: '', confirmPassword: ''},
      };
    },
    computed: {
      submitDisable() {
        if (this.info.password !== '' && this.info.newPassword !== ''&&
          this.info.confirmPassword !== ''&& this.info.newPassword === this.info.confirmPassword)
          return false;
        return true;
      }
    },
    methods: {
      submit() {
        let dict = {};
        dict.oldPassword = this.info.password;
        dict.newPassword = this.info.confirmPassword;
        this.$axios.post('/sm/modifyPassword', dict).then(res => {
          if (res.data.status === 0) {
            this.$message.success('密码修改成功');
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
