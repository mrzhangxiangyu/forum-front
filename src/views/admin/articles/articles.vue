<template>
  <div class="admin-article">
    <div class="container">
      <div class="flex-between header">
        <span class="header-input">
          <el-input
            v-model="searchTxt"
            placeholder="请输入关键词"
            style="margin-right:10px;"
            @keyup.enter.native="searchArticle"
          >
            <svg-icon slot="prefix" style="font-size:20px;" icon-class="search" @click="searchArticle" />
          </el-input>
        </span>
        <span>
          <el-button @click="deleteArticle">批量删除</el-button>
        </span>
      </div>
      <div class="main">
        <el-table
          :data="searchList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            prop="id"
            label="id"
          />
          <el-table-column
            label="用户id"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.userId }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.userId" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="图片名"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.imgUrl }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.imgUrl" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.title }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.title" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="正文"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.content }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.content" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="点赞数"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.likeNum }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.likeNum" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="收藏数"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.favoriteNum }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.favoriteNum" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="评论数"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.commentNum }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.commentNum" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="评论id"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.commentId }}</span>
              <span v-if="scope.row.edit" class="deepInput">
                <el-input v-model="scope.row.commentId" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </span>
              <span v-if="scope.row.edit">
                <el-button
                  size="mini"
                  @click="submitEdit(scope.$index, scope.row)"
                >
                  提交
                </el-button>
                <el-button
                  size="mini"
                  @click="cancelEdit(scope.$index, scope.row)"
                >
                  取消
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addUserData: {
        account: '',
        password: '',
        nickname: ''
      },
      addUserVisible: false,
      editData: {},
      deleteList: [], // 选中的list
      articleList: [], // 表格数据
      searchTxt: '', // 搜索的关键词
      searchList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$axios({
        url: 'admin/articles',
        method: 'get'
      }).then(ret => {
        if (ret.data.meta.status) {
          const list = ret.data.data
          if (list.length > 0) {
            list.map(item => {
              item.edit = false
            })
          }
          this.articleList = ret.data.data
          this.searchList = this.$_.cloneDeep(this.articleList)
        }
      })
    },
    handleEdit(index, e) {
      e.edit = true
      this.editData = this.$_.cloneDeep(e)
    },
    handleDelete(index, e) {
      this.deleteList = [e.id]
      this.deleteArticle()
    },
    submitEdit(index, e) {
      e.edit = false
      this.$axios({
        url: 'article',
        method: 'put',
        data: {
          id: e.id,
          userId: e.userId,
          imgUrl: e.imgUrl,
          title: e.title,
          content: e.content,
          likeNum: e.likeNum,
          favoriteNum: e.favoriteNum,
          commentNum: e.commentNum,
          commentId: e.commentId === null ? '' : e.commentId
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('修改成功')
          e.edit = false
        } else {
          this.$message(ret.data.meta.info)
        }
      })
    },
    cancelEdit(index, e) {
      e.account = this.editData.account
      e.password = this.editData.password
      e.nickname = this.editData.nickname
      e.edit = false
    },
    handleSelectionChange(e) {
      const data = e
      const list = []
      if (data.length > 0) {
        data.map(item => {
          list.push(item.id)
        })
        this.deleteList = list
      } else {
        this.deleteList = []
      }
    },
    searchArticle() {
      this.searchList = []
      this.articleList.map(item => {
        let value = false
        if (item.id.toString().indexOf(this.searchTxt) !== -1) {
          value = true
        } else if (item.imgUrl.toString().indexOf(this.searchTxt) !== -1) {
          value = true
        } else if (item.title.toString().indexOf(this.searchTxt) !== -1) {
          value = true
        } else if (item.content.toString().indexOf(this.searchTxt) !== -1) {
          value = true
        }
        if (value) {
          this.searchList.push(item)
        }
      })
    },
    deleteArticle() {
      if (this.deleteList.length > 0) {
        console.log(this.deleteList)
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: 'article',
            method: 'delete',
            params: {
              id: JSON.stringify(this.deleteList)
            }
          }).then(ret => {
            if (ret.data.meta.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            } else {
              this.$message(ret.data.meta.info)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.warning('未选中数据！')
      }
    },
    addUserClose() {
      this.addUserVisible = false
      this.$message('取消添加')
      this.addUserData = {
        account: '',
        password: '',
        nickname: ''
      }
    },
    addUserSubmit() {
      this.$axios({
        url: 'admin/users',
        method: 'post',
        data: this.addUserData
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('添加成功')
          this.getList()
          this.addUserVisible = false
          this.addUserData = {
            account: '',
            password: '',
            nickname: ''
          }
        } else {
          this.$message(ret.data.meta.info)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-article{
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
  padding: 10px;
  &::-webkit-scrollbar{
    height: 2px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    background-color: #c1c1c2;
  }
}
.deepInput{
  /deep/input{
    height: 23px;
    padding: 0;
    border: none;
    border-radius: 0;
    border-bottom: 1px #ebeef5 solid;
    background-color: transparent;
  }
}
.flex-between{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.header{
  padding-top: 8vh;
  padding-bottom: 20px;
  width: 100%;
  background-color: #fff;
  .header-input{
    width: calc(100% - 114px);
    /deep/.el-input__inner{
      &:focus{
        border: 1px #ffd04b solid!important;
      }
    }
    /deep/.el-input__prefix{
      line-height: 45px;
    }
  }
}
.main{
}
</style>
