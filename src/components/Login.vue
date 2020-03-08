<template>
  <div class="bg">
    <el-form
      :rules="rules"
      class="login-container"
      label-position="left"
      label-width="0px"
      v-loading="loading"
    >
      <h3 class="login_title">系统登录</h3>
      <el-form-item prop="account">
        <el-input
          type="text"
          v-model="loginForm.username"
          auto-complete="off"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          type="password"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-checkbox
        class="login_remember"
        v-model="checked"
        label-position="left"
      >记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          @click.native.prevent="submitClick"
          style="width: 100%"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postRequest } from '../utils/api'
import { putRequest } from '../utils/api'
export default {
  data() {
    return {
      rules: {
        account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        checkPass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: true,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loading: false
    }
  },
  methods: {
    submitClick: function () {
      var _this = this;
      this.loading = true;
      postRequest('/vetl/login', {
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(resp => {
        _this.loading = false;
        var json = resp.data;
        if (json.code == 200) {
          //成功
          if (json.message == '成功') {
            window.sessionStorage.setItem("token", json.data)
            _this.$router.replace({ path: '/home' });
          } else {
            console.log(json)
            _this.$alert('登录失败!', '失败!');
          }
        } else {
          console.log(json)
          //失败
          _this.$alert('登录失败!', '失败!');
        }
      }, resp => {
        _this.loading = false;
        _this.$alert('找不到服务器⊙﹏⊙∥!', '失败!');
      });
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.login-container {
  border-radius: 15px;
  /* background-clip: padding-box; */
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 10px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
.bg {
  background-image: url(../assets/bg.jpg);
  /* height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  position: absolute;
  margin-top: -50px; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
</style>
