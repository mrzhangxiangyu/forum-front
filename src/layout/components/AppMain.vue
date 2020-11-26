<template>
  <div class="layout-app-container">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-app-container{
  width: 100%;
  @media screen and(max-width: 996px){
    width: 100%;
  }
  height: calc(100vh - 50px);
  overflow: scroll;
  &::-webkit-scrollbar{
    height: 2px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    background-color: #c1c1c2;
  }
}
.app-main {
  /*50 = navbar  */
  width: 1000px;
  @media screen and(max-width: 996px){
    width: 100%;
    padding-bottom: 8vh;
  }
  margin: 0 auto;
  // padding: 0 20%;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
