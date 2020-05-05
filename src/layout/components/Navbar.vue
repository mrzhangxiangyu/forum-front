<template>
  <div class="navbar">
    <div class="navMain">
      <div class="left-menu">
        <img src="../../assets/imgs/title1.png" width="95px" height="50px;">
        <div :class="navMenu === 1 ? 'bottom-border' : ''" @click="navClick(1)">
          <svg-icon icon-class="home" />
          首页
        </div>
        <div :class="navMenu === 2 ? 'bottom-border' : ''" @click="navClick(2)">
          <svg-icon icon-class="hot" />
          热点
        </div>
        <div :class="navMenu === 3 ? 'bottom-border' : ''" @click="navClick(3)">
          <svg-icon icon-class="write" />
          写文章
        </div>
        <div class="deep-input">
          <el-input v-model="searchTxt" @keydown.enter.native="search">
            <i slot="suffix" class="el-icon-search el-input__icon icon-search" @click="search" />
          </el-input>
        </div>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" :show-timeout="0">
          <div class="avatar-wrapper">
            <img v-if="$store.getters.avatar === null || $store.getters.avatar === ''" src="../../assets/imgs/default.jpg" class="user-avatar">
            <img v-else :src="baseUrl + $store.getters.avatar" class="user-avatar">
          </div>
          <el-dropdown-menu slot="dropdown" style="margin-top: -10px">
            <router-link to="/MyHome">
              <el-dropdown-item>
                我的主页
              </el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">退出</span>
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      baseUrl: window.$api.imgUrl,
      navMenu: 1,
      searchTxt: ''
    }
  },
  watch: {
    '$route.path': function() {
      this.resetNavMenu()
      this.resetSearchTxt()
    }
  },
  mounted() {
    this.resetNavMenu()
  },
  methods: {
    resetNavMenu() {
      const name = this.$router.currentRoute.name
      this.navMenu = name === 'Home' ? 1 : name === 'HotArticle' ? 2 : name === 'WriteArticle' ? 3 : 0
    },
    resetSearchTxt() {
      const name = this.$router.currentRoute.name
      this.searchTxt = name === 'Search' ? this.searchTxt : ''
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    navClick(e) {
      switch (e) {
        case 1: {
          this.navMenu = 1
          this.$router.push({ name: 'Home' })
          break
        }
        case 2: {
          this.navMenu = 2
          this.$router.push({ name: 'HotArticle' })
          break
        }
        case 3: {
          this.navMenu = 3
          this.$router.push({ name: 'WriteArticle' })
          break
        }
        default: {
          break
        }
      }
    },
    search() {
      this.$router.push({
        path: 'search',
        query: { txt: this.searchTxt }
      })
      this.$store.dispatch('app/clickSearch', this.searchTxt)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .navMain{
    width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  .left-menu{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 87.5%;
    span{
      font-size: 30px;
      line-height: 50px;
      color: #a0ddf5;
    }
    div{
      height: 50px;
      line-height: 50px;
      cursor: default;
    }
    .deep-input{
      /deep/.el-input__inner{
        height: 30px;
        width: 400px;
      }
    }
  }
  .bottom-border{
    border-bottom: 3px rgb(119, 213, 241) solid;
  }
  .right-menu {
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .icon-search{
    &:hover{
      color:#409eff;
    }
  }
}
</style>
