<template>
  <div class="admin-type">
    <div class="container">
      <div class="type-container">
        <div v-for="(type, index) in types" :key="'type' + index" class="type">
          {{ type.name }}
          <div class="type-hover">
            <!-- <el-button type="primary" size="mini">编辑</el-button> -->
            <el-button type="danger" size="mini" @click="deleteType(type.id)">删除</el-button>
          </div>
        </div>
        <div class="add-type">
          <el-input v-model="addTypeName" placeholder="添加版块" @blur="cancelAddType" />
          <div class="add-type-hover">
            <el-button type="primary" size="normal" @click="addType">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      types: [],
      addTypeName: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$axios({
        url: 'admin/types',
        method: 'get'
      }).then(ret => {
        if (ret.data.meta.status) {
          this.types = ret.data.data
        }
      })
    },
    addType() {
      if (this.addTypeName === '') {
        this.$message.warning('请输入版块名称')
        return
      }
      this.$axios({
        url: 'admin/types',
        method: 'post',
        data: {
          name: this.addTypeName
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('添加成功')
          this.addTypeName = ''
          this.getList()
        } else {
          this.$message(ret.data.meta.info)
        }
      })
    },
    cancelAddType() {
      // this.addTypeName = ''
    },
    deleteType(id) {
      this.$axios({
        url: 'admin/types',
        method: 'delete',
        params: {
          id: id
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message(ret.data.meta.info)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-type{
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 20px 20px;
  position: relative;
}
.container{
  height: 100%;
  width: 100%;
  background-color: #fff;
  overflow: auto;
  padding: 20px;
  &::-webkit-scrollbar{
    height: 2px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    background-color: #c1c1c2;
  }
}
.type-container{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  .type{
    height: 100px;
    width: calc(50% - 10px);
    font-size: 30px;
    color: rgb(163, 163, 163);
    line-height: 100px;
    padding-left: 20px;
    background-color: rgb(241, 241, 241);
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    .type-hover{
      position: absolute;
      width: 60px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      color: #fff;
      top: 36px;
      right: 13px;
      transform: translateX(130%);
      transition-duration: .3s;
    }
    &:hover{
      .type-hover{
        transform: translateX(0px);
      }
    }
  }
  .add-type{
    height: 100px;
    width: calc(50% - 10px);
    padding-left: 20px;
    font-size: 30px;
    background-color: #befcf1;
    position: relative;
    overflow: hidden;
    .el-input{
      margin-top: 30px;
    }
    /deep/.el-input__inner{
      font-size: 26px;
      padding-left: 5px;
      width: calc(100% - 100px);
      background-color: transparent;
      border: none;
      transition: background-color .5s;
    }
    &:hover{
      .add-type-hover{
        transform: translateX(0);
      }
      /deep/.el-input__inner{
        width: calc(100% - 100px);
        background-color: #fff;
        // border: 1px #ccc solid;
      }
    }
    &-hover{
      width: 70px;
      height: 40px;
      position: absolute;
      top: 30px;
      right: 15px;
      line-height:0px;
      transition-duration: .3s;
      transform: translateX(125%);
    }
  }
}
</style>
