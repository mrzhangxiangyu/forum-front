<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="Router" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: 'slide-right'
    }
  },
  watch: {
    '$route'(to, from) {
      const isBack = this.$router.isBack // 监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
    }
  }
}
</script>
<style lang="scss" scoped>
#app{
  overflow: hidden;
}
.Router {
  position: absolute;
  width: 100%;
  transition: all .8s ease;
  top: 0px;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
<style lang="scss">
.article-content{
  p{
    margin: 0;
    padding: 0;
    color: #333;
  }
}
// 解决element-ui table 表头错位
body .el-table th.gutter{
    display: table-cell!important;
}
body .el-table colgroup.gutter{
    display: table-cell!important;
}
</style>
