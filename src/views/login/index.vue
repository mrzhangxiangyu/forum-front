<template>
  <div class="login-container">
    <div id="myBg" class="backgroung">
      <!-- <canvas id="canvas" ref="myBg" /> -->
    </div>
    <div class="login">
      <div class="line" />
      <div class="login-form">
        <div>
          <img src="../../assets/imgs/title1.png" width="100px">
        </div>
        <div>
          <el-input
            v-model="loginForm.account"
            placeholder="登录账号"
            type="text"
            tabindex="1"
          >
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </div>
        <div>
          <el-input
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="登录密码"
            tabindex="2"
            @keydown.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" />
            <span slot="suffix" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-input>
        </div>
        <div id="nickname">
          <div id="nickname-div">
            <el-input
              v-model="loginForm.nickname"
              type="text"
              placeholder="用户昵称"
              tabindex="3"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" class="el-icon-s-promotion" style="font-size:16px" />
            </el-input>
          </div>
        </div>
        <div>
          <el-button v-if="!isRegist" :loading="loginloading" type="primary" @click="handleLogin">登录</el-button>
          <el-button v-if="!isRegist" @focus="blur()" @click="handleRegist">注册</el-button>
          <el-button v-if="isRegist" :loading="registloading" type="primary" @click="submitRegist">提交</el-button>
          <el-button v-if="isRegist" @click="cancelRegist">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isRegist: false,
      loginForm: {
        account: '',
        password: '',
        nickname: ''
      },
      loginloading: false,
      registloading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // const that = this
    // that.$refs.myBg.width = document.body.clientWidth
    // that.$refs.myBg.height = document.body.clientHeight
    // window.onresize = () => {
    //   that.$refs.myBg.width = document.body.clientWidth
    //   that.$refs.myBg.height = document.body.clientHeight
    // }
    // var canvas = this.$refs.myBg
    // var ctx = canvas.getContext('2d')
    // ctx.fillStyle = '#FF0000'
    // ctx.fillRect(0, 0, 80, 100)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loginloading = true
      this.$axios({
        url: 'user/login',
        method: 'post',
        data: {
          account: this.loginForm.account,
          password: this.loginForm.password
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$store.dispatch('user/saveUser', ret.data.data).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loginloading = false
          }).catch(() => {
            this.loginloading = false
          })
        } else {
          this.$message.warning(ret.data.meta.info)
          this.loginloading = false
        }
      })
    },
    async handleRegist() {
      this.isRegist = true
      let i = 0
      while (i < 35) {
        await this.setHeight((i + 1) * 2)
        i++
      }
    },
    setHeight(e) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          document.getElementById('nickname').style.height = e + 'px'
          resolve()
        }, 10)
      })
    },
    submitRegist() {
      this.registloading = true
      this.$axios({
        url: 'user',
        method: 'post',
        data: this.loginForm
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('注册成功')
          this.cancelRegist()
        } else {
          this.$message(ret.data.meta.info)
        }
        this.registloading = false
      })
    },
    async cancelRegist() {
      this.isRegist = false
      let i = 35
      while (i > 0) {
        await this.setHeight((i + 1) * 2)
        i--
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$bg:#80d0f5;
$dark_gray:#889aa4;
$light_gray:#333;
canvas {
  display: block;
  background: #D6F8FF;
}
.login-container{
  min-height: 100%;
  width: 100%;
  // background-image: url('../../assets/imgs/bg1.jpg');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background-color: $bg;
  overflow: hidden;
  position: relative;
}
.backgroung{
  position: absolute;
  background-color: #D6F8FF;
  width: 100%;
  height: 100%;
  z-index: -1;
  .bgDiv{
    display: inline-block;
    height: 5vw;
    width: 5vw;
    margin: 0!important;
    padding: 0;
    z-index: -1;
  }
}
.login {
  position: relative;
  width: 400px;
  @media screen and (max-width: 996px) {
    width: 80vw;
  }
  margin: 0 auto;
  top: 0vh;
  .line{
    height: 20vh;
    margin: 0 auto;
    width: 2px;
    // border: 1px rgb(223, 211, 211) solid;
    background-color: #fff;
    box-shadow: 0px 0px 2px rgb(211, 205, 205);
    z-index: 1;
  }
  .login-form {
    width:100%;
    box-shadow: 0px 0px 10px rgb(204, 189, 189);
    padding: 10px;
    background-color: #fff;
    border-radius: 3px;
    z-index: 0;
    #nickname{
      position: relative;
      overflow: hidden;
      padding-bottom: 0px;
      &-div{
        width: 100%;
        position: absolute;
        bottom: 30px;
        padding-bottom: 0px;
      }
    }
    div{
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items:center;
      padding-bottom: 30px;
      /deep/.el-input{
        width: 90%;
        height: 40px;
        padding-left: 20px;
        padding-bottom: 0;
        border-bottom: 1px rgb(228, 228, 228) solid;
        input{
          height: 40px;
        }
      }
      /deep/.el-button{
        width: calc(45% - 6px);
        margin-top:10px;
      }
      /deep/.el-input__prefix{
        line-height: 40px;
      }
      /deep/.el-input__suffix{
        line-height: 40px;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:rgb(31, 31, 31);
$cursor: rgb(44, 44, 44);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(114, 114, 114, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
