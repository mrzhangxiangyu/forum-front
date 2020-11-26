<template>
  <div class="admin">
    <el-carousel ref="admin" height="100%" :autoplay="false" indicator-position="none">
      <!-- 登录页面 -->
      <el-carousel-item v-if="showLogin">
        <div class="admin-login">
          <div class="login">
            <div>
              <img src="../../assets/imgs/title.png" width="100px">
              <span style="font-size:30px;color:#ccc;">&nbsp;后&nbsp;台&nbsp;管&nbsp;理</span>
            </div>
            <div>
              <el-input v-model="adminAccount" placeholder="账号">
                <svg-icon slot="prefix" icon-class="login-user" />
              </el-input>
            </div>
            <div>
              <el-input v-model="adminPassword" placeholder="密码" @keyup.enter.native="adminLogin">
                <svg-icon slot="prefix" icon-class="login-password" />
              </el-input>
            </div>
            <div>
              <el-button v-loading="loginLoading" type="primary" @click="adminLogin">登录</el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <!-- 内容页面 -->
      <el-carousel-item v-show="showContent">
        <div class="admin-content">
          <div class="menu">
            <div class="menu-title">
              <img src="../../assets/imgs/title.png" width="60%">
            </div>
            <div class="menu-item">
              <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
              >
                <el-menu-item index="1">
                  <!-- <i class="el-icon-location" /> -->
                  <span class="menu-icon">
                    <svg-icon v-if="activeIndex === '1'" icon-class="admin-user-active" />
                    <svg-icon v-else icon-class="admin-user" />
                  </span>
                  <span>用户管理</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <!-- <i class="el-icon-menu" /> -->
                  <span class="menu-icon">
                    <svg-icon v-if="activeIndex === '2'" icon-class="admin-article-active" />
                    <svg-icon v-else icon-class="admin-article" />
                  </span>
                  <span slot="title">帖子管理</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <!-- <i class="el-icon-menu" /> -->
                  <span class="menu-icon">
                    <svg-icon icon-class="admin-type" :style="activeIndex === '3' ? 'color: ffd04b' : 'color: #fff'" />
                  </span>
                  <span slot="title">版块管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <!-- <i class="el-icon-menu" /> -->
                  <span class="menu-icon">
                    <svg-icon v-if="activeIndex === '4'" icon-class="admin-logout-active" />
                    <svg-icon v-else icon-class="admin-logout" />
                  </span>
                  <span slot="title">退出账户</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
          <div class="content">
            <el-carousel
              ref="content"
              height="100%"
              direction="vertical"
              :autoplay="false"
              :loop="false"
              indicator-position="none"
            >
              <el-carousel-item>
                <User ref="user" />
              </el-carousel-item>
              <el-carousel-item>
                <Article ref="article" />
              </el-carousel-item>
              <el-carousel-item>
                <Type ref="type" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import User from './users/users'
import Article from './articles/articles'
import Type from './types/types'
import { setAdminLogin, getAdminLogin } from '../../utils/auth'
export default {
  components: {
    User,
    Article,
    Type
  },
  data() {
    return {
      loginLoading: false,
      showLogin: true,
      showContent: false,
      adminAccount: '',
      adminPassword: '',
      activeIndex: '1'
    }
  },
  created() {
    console.log(getAdminLogin())
    if (getAdminLogin() === 'true') {
      this.showLogin = false
      this.showContent = true
    } else {
      this.showLogin = true
      this.showContent = false
    }
  },
  methods: {
    adminLogin() {
      this.loginLoading = true
      this.$axios({
        url: 'admin/login',
        method: 'get',
        params: {
          account: this.adminAccount,
          password: this.adminPassword
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.showContent = true
          this.activeIndex = '1'
          this.$refs.content.setActiveItem(0)
          setAdminLogin(true)
          setTimeout(() => {
            this.$refs.admin.next()
          }, 100)
          setTimeout(() => {
            this.showLogin = false
          }, 1200)
        } else {
          this.$message.warning(ret.data.meta.info)
        }
        this.loginLoading = false
      })
    },
    handleSelect(e) {
      if (e === 4 || e === '4') {
        this.activeIndex = '4'
        this.showLogin = true
        setAdminLogin(false)
        setTimeout(() => {
          this.$refs.admin.prev()
        }, 100)
      } else {
        if (this.activeIndex !== e.toString()) {
          this.activeIndex = e.toString()
          if (e === 1 || e === '1') {
            this.$refs.content.setActiveItem(0)
            this.$refs.user.getList()
          } else if (e === 2 || e === '2') {
            this.$refs.content.setActiveItem(1)
            this.$refs.article.getList()
          } else {
            this.$refs.content.setActiveItem(2)
            this.$refs.type.getList()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.admin{
  width: 100vw;
  height: 100vh;
  .el-carousel{
    height: 100%;
    width: 100%;
  }
  /deep/.el-carousel__arrow--left{
    display: none!important;
  }
  /deep/.el-carousel__arrow--right{
    display: none!important;
  }
  /deep/.el-carousel__item.is-animating{
    transition: transform 1s ease-in-out, -webkit-transform 1s ease-in-out;
  }
}
.admin-login{
  width: 100%;
  height: 100%;
  background-color: #545c64;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  .login{
    width: 400px;
    height: 250px;
    margin-top: 25vh;
    padding-top: 10px;
    border-radius: 3px;
    box-shadow: 0 0 5px 5px rgb(255, 255, 255);
    div{
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items:center;
      padding-bottom: 10px;
      /deep/.el-input{
        width: 350px;
      }
      /deep/.el-button{
        width: 350px;
      }
      /deep/.el-input__prefix{
        line-height: 40px;
      }
    }
  }
}
.admin-content{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
}
.menu{
  width: 200px!important;
  height: 100vh!important;
  background-color: #545c64;
  .menu-item{
    margin-top:7vh;
    /deep/.el-menu{
      border:none;
      .el-menu-item{
        height: 100px;
        line-height: 100px;
      }
    }
    .menu-icon{
      display: inline-block;
      padding-left: 10px;
      width: 30px;
    }
  }
  .menu-title{
    padding-top:10vh;
    padding-left: 20px;
  }
}
.content{
  width: calc(100% - 200px)!important;
  height: 100vh;
  .el-carousel{
    width: 100%;
    height: 100%;
  }
  /deep/.el-carousel__arrow--left{
    display: none!important;
  }
  /deep/.el-carousel__arrow--right{
    display: none!important;
  }
  /deep/.el-carousel__item.is-animating{
    transition: transform .8s ease-in-out, -webkit-transform .8s ease-in-out;
  }
}
</style>
