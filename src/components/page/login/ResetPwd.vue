<template>
  <div class="wrapper">
    <TCaptcha></TCaptcha>
    <div class="content">
      <div class="title">重置密码</div>
      <el-form
        :model="resetFormData"
        :rules="resetRules"
        ref="resetForm"
        label-width="8em"
        class="form"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item prop="username" label="学号">
          <el-input
            v-model="resetFormData.username"
            id="username"
            type="text"
            @keyup.enter.native="doReset"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-row>
            <el-col :span="14"
              ><el-input
                v-model="resetFormData.phone"
                id="phone"
                @keyup.enter.native="doReset"
              >
              </el-input
            ></el-col>
            <el-col :span="8" :offset="1">
              <el-button
                data-appid="2062301153"
                data-cbfn="callback"
                id="TencentCaptcha"
                type="primary"
                round
              >
                获取验证码
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="code" label="短信验证码">
          <el-input
            v-model="resetFormData.code"
            type="text"
            @keyup.enter.native="doReset"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password1" label="密码">
          <el-input
            v-model="resetFormData.password1"
            type="password"
            @keyup.enter.native="doReset"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认密码">
          <el-input
            v-model="resetFormData.password2"
            type="password"
            @keyup.enter.native="doReset"
          >
          </el-input>
        </el-form-item>
        <div class="reset-button">
          <el-button type="primary" @click="doReset">确认重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import _this from "../../../main";
import { resetPassWord } from "../../../api/login";

export default {
  name: "ResetPwd",
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetFormData.password1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      resetFormData: {
        username: "",
        phone: "",
        code: "",
        password1: "",
        password2: "",
      },
      resetRules: {
        username: [{ required: true, message: "请输入学号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        password1: [
          { required: true, message: "请输入重置密码", trigger: "blur" },
        ],
        password2: [{ required: true, validator: checkPass, trigger: "blur" }],
      },
    };
  },
  methods: {
    doReset() {
      this.$refs["resetForm"].validate((valid) => {
        if (valid) {
          resetPassWord({
            password: this.resetFormData.password1,
            code: this.resetFormData.code,
          })
            .then((response) => {
              if (!response.status) {
                window.location = "https://www.smartercollege.cn";
              } else {
                this.$message.error("修改失败！");
                this.$refs["resetForm"].resetFields();
              }
            })
            .catch((e) => {
              console.log(e);
              this.$message.error("修改失败！");
              this.$refs["resetForm"].resetFields();
            });
        } else {
          return false;
        }
      });
    },
  },

  components: {
    TCaptcha: {
      render(createElement) {
        return createElement("script", {
          attrs: {
            type: "text/javascript",
            src: "https://ssl.captcha.qq.com/TCaptcha.js",
          },
        });
      },
    },
  },
};

window.callback = function (res) {
  console.log(res);
  // res（未通过验证）= {ret: 1, ticket: null}
  // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}

  if (res.ret === 0) {
    // alert(res.ticket)   // 票据

    res.user = document.getElementById("username").value;
    res.phone = document.getElementById("phone").value;

    _this.$axios
      .post("/sm/user/password", res)
      .then(function (response) {
        console.log(response);
      })
      .catch(() => {
        console.log("网络错误");
      });
  }
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
  text-align: center;
  font-size: 2em;
  margin-bottom: 1em;
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

.reset-button button {
  width: 100%;
}
</style>
