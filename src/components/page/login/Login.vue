<template>
  <div class="wrapper">
    <div class="content">
      <div class="title">
        <img class="logo" src="/static/images/icon.png" alt="Logo" />
        欢迎来到My School
      </div>
      <el-form
        :model="loginFormData"
        :rules="rules"
        ref="loginForm"
        label-width="5em"
        class="form"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginFormData.username"
            @keyup.enter.native="submit"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginFormData.password"
            type="password"
            @keyup.enter.native="submit"
          >
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item prop="verification" label="验证码">
              <el-input
                v-model="loginFormData.verification"
                @keyup.enter.native="submit"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <img
              :src="verificationImg"
              alt="verification-img"
              @click="getVerificationCode"
            />
          </el-col>
        </el-row>
        <div class="login-button">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-button type="primary" @click="submit">登录</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="text" @click="resetPwd">忘记密码</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <a
      href="http://www.beian.miit.gov.cn/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      style="
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: #ffffff;
        text-align: center;
      "
      >湘ICP备18007426号-1 | 工信部</a
    >
  </div>
</template>

<script>
import {
  checkLogin,
  submitLogin,
  getVerificationCode,
} from "../../../api/login";

export default {
  name: "login",
  data() {
    return {
      loginFormData: {
        username: "",
        password: "",
        verification: "",
      },
      verificationImg: "",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verification: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          submitLogin(this.loginFormData)
            .then((response) => {
              console.log(response);
              if (response.data) {
                // 后端未发送头像时使用默认头像
                response.data.avatar =
                  response.data.avatar || "/static/images/head.png";
                response.data.IDNumber = this.loginFormData.username;
                sessionStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("user", JSON.stringify(response.data));
                this.$router.push(
                  this.$route.query.redirect
                    ? { path: this.$route.query.redirect }
                    : { name: "index" }
                );
                this.$refs["loginForm"].$el.submit(); //触发浏览器的保存密码功能
              } else {
                this.loginFormData.password = "";
                this.loginFormData.verification = "";
                this.getVerificationCode();
              }
            })
            .catch(() => {
              this.loginFormData.password = "";
              this.loginFormData.verification = "";
              this.getVerificationCode();
            });
        } else {
          return false;
        }
      });
    },
    getVerificationCode() {
      getVerificationCode().then((response) => {
        this.verificationImg = response.data.vercodeimg;
      });
    },
    checkLogin() {
      checkLogin().then((response) => {
        //状态不为0表示已经登录
        if (!response.status) {
          sessionStorage.setItem("user", localStorage.getItem("user"));
          this.$router.push({ name: "index" });
        } else {
          this.getVerificationCode();
        }
      });
    },
    resetPwd() {
      this.$router.push({ name: "resetPwd" });
    },
  },
  created() {
    this.checkLogin();
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrapper::before {
  background-image: url(/static/images/background.jpg);
  background-size: cover;
  filter: blur(10px);
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transform: scale(1.1);
}

.title {
  font-size: 2em;
  margin-bottom: 0.3em;
  z-index: 2;
}

.logo {
  height: 1.5em;
  vertical-align: middle;
  margin-bottom: 0.3em;
}

.content {
  width: 30em;
  max-width: 100%;
  padding: 2em;
  border-radius: 1em;
  box-shadow: 0 0 0.3em;
  background-color: white;
  z-index: 2;
}

.login-button button {
  width: 100%;
}

.form img {
  width: 100%;
  height: 40px;
}
</style>
