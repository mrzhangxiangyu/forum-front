<template>
  <div class="container">
    <div class="header">
      <div class="header-bg" />
      <div class="header-content">
        <div class="header-content-avatar">
          <img v-if="userInfo.avatar === null || userInfo.avatar === '' || userInfo.avatar === undefined" src="../../assets/imgs/default.jpg" height="160px" width="160px">
          <img v-else :src="baseUrl + userInfo.avatar" height="160px" width="160px">
          <div class="hover" @click="uploadImg">
            <i class="el-icon-camera-solid" />
          </div>
          <input ref="img" type="file" accept=".jpg,.jpeg,.png" style="position:absolute; top:-10000px" @change="chooseImg">
        </div>
        <div style="width: 230px; height: 100px" />
        <div class="header-content-right">
          <div class="nickname">
            <span> {{ userInfo.nickname }} </span>
            <span> {{ userInfo.signatrue || '暂无签名' }} </span>
          </div>
          <el-collapse-transition>
            <div v-if="isOpen" class="info">
              <div class="list">
                <div class="label">登录名<span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.account }}
                </div>
                <div v-else class="input">
                  <el-input v-model="userInfo.account" />
                </div>
              </div>
              <div class="list">
                <div class="label">密码 <span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.password }}
                </div>
                <div v-else class="input">
                  <el-input v-model="userInfo.password" />
                </div>
              </div>
              <div class="list">
                <div class="label">昵称 <span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.nickname }}
                </div>
                <div v-else class="input">
                  <el-input v-model="userInfo.nickname" type="text" maxlength="10" show-word-limit />
                </div>
              </div>
              <div class="list">
                <div class="label">性别 <span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.gender }}
                </div>
                <div v-else class="input">
                  <el-radio-group v-model="userInfo.gender" style="padding-left: 30px">
                    <el-radio label="男" value="男" />
                    <el-radio label="女" value="女" />
                  </el-radio-group>
                </div>
              </div>
              <div class="list">
                <div class="label">生日 <span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.birth }}
                </div>
                <div v-else class="input">
                  <span class="date-picker">
                    <el-date-picker
                      v-model="userInfo.birth"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </span>
                </div>
              </div>
              <div class="list">
                <div class="label">签名 <span /></div>:
                <div v-if="!isEdit" class="content">
                  {{ userInfo.signatrue }}
                </div>
                <div v-else class="input">
                  <el-input
                    v-model="userInfo.signatrue"
                    type="text"
                    maxlength="20"
                    show-word-limit
                  />
                </div>
              </div>
            </div>
          </el-collapse-transition>
          <div class="bottom">
            <span @click="openOrClose">
              <i v-if="!isOpen" class="el-icon-arrow-down" />
              <i v-else class="el-icon-arrow-up" />
              {{ isOpen ? '收起' : '查看' }}详细资料
            </span>
            <span class="button">
              <el-button v-if="!isEdit" plain size="small" @click="isEdit = isOpen = true">编辑资料</el-button>
              <el-button v-if="isEdit" plain size="small" @click="updateUserInfo">提交</el-button>
              <el-button v-if="isEdit" plain size="small" @click="cancelUpdate">取消</el-button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="tabName" @tab-click="tabClick">
        <el-tab-pane label="我的帖子" name="1">
          <div class="content-1">
            <div v-for="(article, index) in articleList" :key="'article' + index" :class="index === 0 ? 'article' : 'article border-top'">
              <div class="title">
                {{ article.title }}
                <el-button type="danger" size="mini" icon="el-icon-delete" plain circle style="float:right" @click="deleteArticle(1, article)" />
              </div>
              <div class="content">
                <img v-if="article.imgUrl !== ''" :src="baseUrl + article.imgUrl">
                <div class="article-content" v-html="article.content" />
              </div>
              <div class="footer flex-between">
                <div class="flex-start">
                  <div class="flex-between">
                    <svg-icon icon-class="like" :style="article.liked ? 'color: #cc5f60' : 'color: #ccc'" @click="clickLike(article)" />
                    <div class="text">{{ article.likeNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between">
                    <svg-icon icon-class="favorite" :style="article.favorited ? 'color: #cc5f60' : 'color: #ccc'" @click="clickFavorite(article)" />
                    <div class="text">{{ article.favoriteNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between" @click="clickComment(article, index)">
                    <svg-icon icon-class="comment" style="color: #ccc" />
                    <div class="text">{{ article.openComment ? '收起评论' : (article.commentNum + '条评论') }}</div>
                  </div>
                </div>
                <div style="color: #ccc">
                  <span>{{ article.time }}</span>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="article.openComment" class="comment">
                  <div class="header flex-between">
                    <img v-if="$store.getters.avatar === null || $store.getters.avatar === ''" src="../../assets/imgs/default.jpg" class="user-avatar">
                    <img v-else :src="baseUrl + $store.getters.avatar" class="user-avatar">
                    <div class="deep-textarea">
                      <el-input
                        v-model="article.commentContent"
                        type="textarea"
                        autosize
                        placeholder="请输入内容"
                      />
                    </div>
                  </div>
                  <div class="comment-button flex-end">
                    <el-button size="mini" @click="submitComment(article)">评论</el-button>
                  </div>
                  <div v-if="article.comments.length > 0" class="comments">
                    <div v-for="(comment, i) in article.comments" :key="'comment' + i" class="flex-between comments-item">
                      <img v-if="comment.avatar === null || comment.avatar === ''" src="../../assets/imgs/default.jpg" class="comments-avatar">
                      <img v-else :src="baseUrl + comment.avatar" class="comments-avatar">
                      <div class="item-right">
                        <div class="flex-between">
                          <span class="nickname">{{ comment.userNickname }}</span>
                          <span class="time">{{ comment.time }}</span>
                        </div>
                        <div class="content break">{{ '  ' + comment.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="comments">
                    暂无评论
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的评论" name="2">
          <div class="content-1">
            <div v-for="(comment, index) in commentList" :key="'comment' + index" :class="index === 0 ? 'article' : 'article border-top'">
              <div class="my-comment flex-between">
                <span class="flex-between">
                  <span>我的评论：</span>
                  <div class="my-comment-content">
                    {{ comment.content }}
                  </div>
                </span>
                <el-button type="danger" size="mini" icon="el-icon-delete" plain circle @click="deleteComment(1, comment)" />
              </div>
              <div class="title">
                {{ comment.article.title }}
              </div>
              <div v-if="comment.article.status === 1" class="content">
                <img v-if="comment.article.imgUrl !== ''" :src="baseUrl + comment.article.imgUrl">
                <div class="article-content" v-html="comment.article.content" />
              </div>
              <div v-else class="delete">
                作者已删除
              </div>
              <div class="footer flex-between">
                <div class="flex-start">
                  <div class="flex-between">
                    <svg-icon icon-class="like" :style="comment.article.liked ? 'color: #cc5f60' : 'color: #ccc'" @click="clickLike(comment.article)" />
                    <div class="text">{{ comment.article.likeNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between">
                    <svg-icon icon-class="favorite" :style="comment.article.favorited ? 'color: #cc5f60' : 'color: #ccc'" @click="clickFavorite(comment.article)" />
                    <div class="text">{{ comment.article.favoriteNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between" @click="clickComment(comment.article, index)">
                    <svg-icon icon-class="comment" style="color: #ccc" />
                    <div class="text">{{ comment.article.openComment ? '收起评论' : (comment.article.commentNum + '条评论') }}</div>
                  </div>
                </div>
                <div style="color: #ccc">
                  <span>{{ comment.article.time }}</span>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="comment.article.openComment" class="comment">
                  <div class="header flex-between">
                    <img v-if="$store.getters.avatar === null || $store.getters.avatar === ''" src="../../assets/imgs/default.jpg" class="user-avatar">
                    <img v-else :src="baseUrl + $store.getters.avatar" class="user-avatar">
                    <div class="deep-textarea">
                      <el-input
                        v-model="comment.article.commentContent"
                        type="textarea"
                        autosize
                        placeholder="请输入内容"
                      />
                    </div>
                  </div>
                  <div class="comment-button flex-end">
                    <el-button size="mini" @click="submitComment(comment.article)">评论</el-button>
                  </div>
                  <div v-if="comment.article.comments.length > 0" class="comments">
                    <div v-for="(item, i) in comment.article.comments" :key="'comment' + i" class="flex-between comments-item">
                      <img v-if="item.avatar === null || item.avatar === ''" src="../../assets/imgs/default.jpg" class="comments-avatar">
                      <img v-else :src="baseUrl + item.avatar" class="comments-avatar">
                      <div class="item-right">
                        <div class="flex-between">
                          <span class="nickname">{{ item.userNickname }}</span>
                          <span class="time">{{ item.time }}</span>
                        </div>
                        <div class="content break">{{ '  ' + item.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="comments">
                    暂无评论
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="3">
          <div class="content-1">
            <div v-for="(article, index) in favoriteList" :key="'favorite' + index" :class="index === 0 ? 'article' : 'article border-top'">
              <div class="title"> {{ article.title }} </div>
              <div v-if="article.status === 1" class="content">
                <img v-if="article.imgUrl !== ''" :src="baseUrl + article.imgUrl">
                <div class="article-content" v-html="article.content" />
              </div>
              <div v-else class="delete">
                作者已删除
              </div>
              <div class="footer flex-between">
                <div class="flex-start">
                  <div class="flex-between">
                    <svg-icon icon-class="like" :style="article.liked ? 'color: #cc5f60' : 'color: #ccc'" @click="clickLike(article)" />
                    <div class="text">{{ article.likeNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between">
                    <svg-icon icon-class="favorite" :style="article.favorited ? 'color: #cc5f60' : 'color: #ccc'" @click="clickFavorite(article)" />
                    <div class="text">{{ article.favoriteNum }}</div>
                  </div>
                  <div style="margin-left:20px" class="flex-between" @click="clickComment(article, index)">
                    <svg-icon icon-class="comment" style="color: #ccc" />
                    <div class="text">{{ article.openComment ? '收起评论' : (article.commentNum + '条评论') }}</div>
                  </div>
                </div>
                <div style="color: #ccc">
                  <span>{{ article.time }}</span>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="article.openComment" class="comment">
                  <div class="header flex-between">
                    <img v-if="$store.getters.avatar === null || $store.getters.avatar === ''" src="../../assets/imgs/default.jpg" class="user-avatar">
                    <img v-else :src="baseUrl + $store.getters.avatar" class="user-avatar">
                    <div class="deep-textarea">
                      <el-input
                        v-model="article.commentContent"
                        type="textarea"
                        autosize
                        placeholder="请输入内容"
                      />
                    </div>
                  </div>
                  <div class="comment-button flex-end">
                    <el-button size="mini" @click="submitComment(article)">评论</el-button>
                  </div>
                  <div v-if="article.comments.length > 0" class="comments">
                    <div v-for="(comment, i) in article.comments" :key="'comment' + i" class="flex-between comments-item">
                      <img v-if="comment.avatar === null || comment.avatar === ''" src="../../assets/imgs/default.jpg" class="comments-avatar">
                      <img v-else :src="baseUrl + comment.avatar" class="comments-avatar">
                      <div class="item-right">
                        <div class="flex-between">
                          <span class="nickname">{{ comment.userNickname }}</span>
                          <span class="time">{{ comment.time }}</span>
                        </div>
                        <div class="content break">{{ '  ' + comment.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="comments">
                    暂无评论
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog1"
      width="30%"
    >
      <span>确认删除文章《{{ deleteInfo.txt }}》？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog1 = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticle(2)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog2"
      width="30%"
    >
      <span>确认删除评论“{{ deleteInfo.txt }}”？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="deleteComment(2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'MyHome',
  data() {
    return {
      deleteDialog1: false,
      deleteDialog2: false,
      deleteInfo: {
        id: null,
        txt: ''
      },
      favoriteList: [],
      commentList: [],
      articleList: [],
      tabName: '1',
      baseUrl: window.$api.imgUrl,
      isEdit: false,
      isOpen: false,
      userInfo: {},
      defaultInfo: {} // 修改之前的用户信息，备份
    }
  },
  watch: {
    'isEdit': function() {
      if (this.isEdit) {
        this.defaultInfo = { ...this.userInfo }
      }
    }
  },
  created() {
    // this.getUserInfo()
  },
  mounted() {
    this.getUserInfo().then(() => {
      this.getArticle()
      this.getComment()
      this.getFavorite()
    })
  },
  methods: {
    getUserInfo() {
      return new Promise((resolve, reject) => {
        this.$axios({
          url: 'user',
          method: 'get',
          params: {
            userId: this.$store.getters.userId
          }
        }).then(ret => {
          if (ret.data.meta.status) {
            this.userInfo = ret.data.data
          } else {
            this.$message.warning('获取用户信息失败')
          }
          resolve()
        })
      })
    },
    getArticle() {
      this.$axios({
        url: 'user/article',
        method: 'get',
        params: {
          id: this.userInfo.publishId
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          const data = ret.data.data
          const userId = this.$store.getters.userId.toString()
          for (let i = 0; data[i] !== undefined; i++) {
            if (data[i].likedId.indexOf(userId) > -1) {
              data[i].liked = true
            } else {
              data[i].liked = false
            }
            if (data[i].favoritedId.indexOf(userId) > -1) {
              data[i].favorited = true
            } else {
              data[i].favorited = false
            }
            data[i].openComment = false
            data[i].commentContent = ''
          }
          this.articleList = this.$_.cloneDeep(data)
        }
      })
    },
    getComment() {
      this.$axios({
        url: 'user/comment',
        method: 'get',
        params: {
          id: this.userInfo.commentId
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          const data = ret.data.data
          const userId = this.$store.getters.userId.toString()
          for (let i = 0; data[i] !== undefined; i++) {
            if (data[i].article.likedId.indexOf(userId) > -1) {
              data[i].article.liked = true
            } else {
              data[i].article.liked = false
            }
            if (data[i].article.favoritedId.indexOf(userId) > -1) {
              data[i].article.favorited = true
            } else {
              data[i].article.favorited = false
            }
            data[i].article.openComment = false
            data[i].article.commentContent = ''
          }
          this.commentList = data
        }
      })
    },
    getFavorite() {
      this.$axios({
        url: 'user/favorite',
        method: 'get',
        params: {
          id: this.userInfo.favoritedId
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          const data = ret.data.data
          const userId = this.$store.getters.userId.toString()
          for (let i = 0; data[i] !== undefined; i++) {
            if (data[i].likedId.indexOf(userId) > -1) {
              data[i].liked = true
            } else {
              data[i].liked = false
            }
            if (data[i].favoritedId.indexOf(userId) > -1) {
              data[i].favorited = true
            } else {
              data[i].favorited = false
            }
            data[i].openComment = false
            data[i].commentContent = ''
          }
          this.favoriteList = this.$_.cloneDeep(data)
        }
      })
    },
    openOrClose() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        this.isEdit = false
      }
    },
    updateUserInfo() {
      const data = {
        userId: this.userInfo.userId,
        account: this.userInfo.account,
        password: this.userInfo.password,
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        birth: this.userInfo.birth,
        signatrue: this.userInfo.signatrue
      }
      this.$axios({
        url: 'user',
        method: 'put',
        data
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('修改成功')
          this.$store.dispatch('user/getInfo')
          this.isEdit = false
        } else {
          this.$message.warning('保存失败')
        }
      })
    },
    cancelUpdate() {
      this.isEdit = false
      this.userInfo = { ...this.defaultInfo }
    },
    uploadImg() {
      this.$refs.img.value = ''
      this.$refs.img.click()
    },
    chooseImg() {
      this.base64(this.$refs.img.files[0]).then((result) => {
        const base64 = result.split(',')[1]
        this.$axios({
          url: 'user/avatar',
          method: 'put',
          data: {
            userId: this.userInfo.userId,
            base64: base64
          }
        }).then(ret => {
          if (ret.data.meta.status) {
            this.$message.success('上传成功')
            this.userInfo.avatar = ret.data.data
            this.$store.dispatch('user/getInfo')
          }
        })
      })
    },
    base64(upload_file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(upload_file)
        reader.onload = function(ev) {
          const result = ev.target.result
          resolve(result)
        }
      })
    },
    tabClick(e) {
      e.name === '1' ? this.getArticle() : e.name === '2' ? this.getComment() : this.getFavorite()
    },
    clickLike(item) {
      const like = (type) => {
        this.$axios({
          url: 'article/like',
          method: 'put',
          data: {
            id: item.id,
            userId: this.$store.getters.userId,
            type: type // 1是点赞 2是取消点赞
          }
        })
      }
      if (item.hasLike === undefined || !item.hasLike) {
        // 控制用户频繁点击
        item.hasLike = true
        setTimeout(() => {
          item.hasLike = false
        }, 2000)
        item.liked = !item.liked
        if (item.liked) {
          item.likeNum++
          like(1)
        } else {
          item.likeNum--
          like(2)
        }
      } else if (item.hasLike) {
        this.$message.warning('操作过于频繁，请稍后再试')
      }
    },
    clickFavorite(item) {
      const favorite = (type) => {
        return new Promise((res, rej) => {
          this.$axios({
            url: 'article/favorite',
            method: 'put',
            data: {
              id: item.id,
              userId: this.$store.getters.userId,
              type: type // 1是收藏 2是取消收藏
            }
          }).then(() => {
            res()
          })
        })
      }
      if (item.hasFavorite === undefined || !item.hasFavorite) {
        item.hasFavorite = true
        setTimeout(() => {
          item.hasFavorite = false
        }, 2000)
        item.favorited = !item.favorited
        if (item.favorited) {
          item.favoriteNum++
          favorite(1).then(() => {
            this.getUserInfo()
          })
        } else {
          item.favoriteNum--
          favorite(2).then(() => {
            this.getUserInfo()
          })
        }
      } else if (item.hasFavorite) {
        this.$message.warning('操作过于频繁，请稍后再试')
      }
    },
    clickComment(item) {
      item.openComment = !item.openComment
    },
    submitComment(article) {
      const data = {
        articleId: article.id,
        userId: this.$store.getters.userId,
        content: article.commentContent
      }
      this.$axios({
        url: 'article/comment',
        method: 'post',
        data: data
      }).then(ret => {
        if (ret.data.meta.status) {
          const data = ret.data.data
          this.$message.success('评论成功')
          article.commentContent = ''
          article.commentId = data.commentId
          data.userNickname = this.$store.getters.nickname
          data.avatar = this.$store.getters.avatar
          article.comments.splice(0, 0, data)
          article.commentNum++
          this.getUserInfo()
        } else {
          this.$message('评论失败')
        }
      })
    },
    deleteArticle(e, article) {
      if (e === 1) {
        this.deleteDialog1 = true
        this.deleteInfo.id = [article.id]
        this.deleteInfo.txt = article.title
      } else {
        this.$axios({
          url: 'article',
          method: 'delete',
          params: {
            id: JSON.stringify(this.deleteInfo.id)
          }
        }).then(ret => {
          this.getUserInfo().then(() => {
            this.getArticle()
            this.deleteDialog1 = false
            this.$message.success('删除成功')
          })
          this.deleteInfo = {
            id: null,
            txt: ''
          }
        })
      }
    },
    deleteComment(e, comment) {
      if (e === 1) {
        this.deleteDialog2 = true
        this.deleteInfo.id = comment.id
        this.deleteInfo.articleId = comment.articleId
        this.deleteInfo.txt = comment.content
      } else {
        this.$axios({
          url: 'user/comment',
          method: 'delete',
          params: {
            id: this.deleteInfo.id,
            userId: this.$store.getters.userId,
            articleId: this.deleteInfo.articleId
          }
        }).then(ret => {
          this.getUserInfo().then(() => {
            this.getComment()
            this.deleteDialog2 = false
            this.$message.success('删除成功')
          })
          this.deleteInfo = {
            id: null,
            txt: ''
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-between{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.flex-start{
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}
.flex-end{
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}
.container{
  margin-top: 10px;
  width: 100%;
}
.header{
  height: auto;
  width: 100%;
  position:relative;
  &-bg{
    height: 130px;
    width: 100%;
    background-color: #999;
    border-radius: 3px 3px 0 0;
  }
  &-content{
    width: 100%;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    background-color: #fff;
    border-radius: 0 0 3px 3px;
    padding-bottom: 30px;
    &-avatar{
      position: absolute;
      height: 168px;
      width: 168px;
      left: 20px;
      top: -74px;
      border: 4px #fff solid;
      background-color: #ccc;
      border-radius: 8px;
      img{
        border-radius: 4px;
      }
      &:hover{
        .hover{
          opacity: 100;
        }
      }
      .hover{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        font-size: 30px;
        color: rgb(224, 224, 224);
        line-height: 160px;
        text-align: center;
        border-radius: 4px;
        background-color: rgba(0,0,0,.4);
        opacity: 0;
        transition-duration: .3s;
      }
    }
    &-right{
      width: 770px;
      .nickname{
        width: 100%;
        height: 60px;
        padding-top: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        span:nth-child(1){
          font-size: 26px;
          font-weight: 600;
        }
        span:nth-child(2){
          margin-left: 12px;
          font-size: 18px;
        }
      }
      .info{
        width: 100%;
        padding-left: 20px;
        .list{
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
          height: 40px;
          line-height: 40px;
          .label{
            width: 50px;
            text-align: justify;
            span{
              display: inline-block;
              padding-left: 100%;
            }
          }
          .content{
            padding-left: 30px;
            line-height: 23px;
          }
          .input{
            padding-left: 10px;
            /deep/.el-input__inner{
              border: none;
              height: 30px;
              width: 500px;
              padding-left: 30px;
              border-bottom: 1px rgb(238, 238, 238) solid;
              border-radius: 0;
            }
            .date-picker{
              /deep/.el-input__inner{
                padding-left: 50px;
              }
              /deep/.el-input__prefix{
                padding-left: 20px;
              }
            }
          }
        }
      }
      .bottom{
        height: 40px;
        position: relative;
        line-height: 45px;
        color: #ccc;
        width: 100%;
        cursor: default;
        .button{
          position: absolute;
          top: -5px;
          right: 10px;
        }
      }
    }
  }
}
.border-top{
  border-top: 1px rgb(240, 240, 240) solid;
}
.content{
  margin-top: 10px;
  background-color: #fff;
  border-radius: 3px;
  /deep/.el-tabs__nav-scroll{
    padding-left: 10px;
  }
  /deep/.el-tabs__nav-wrap::after{
    height: 1px;
    background-color: rgb(235, 235, 235);
  }
  &-1{
    padding: 10px;
    .my-comment{

    }
  }
  .delete{
    height: 100px;
    line-height: 100px;
    color: rgb(182, 54, 54);
    font-size: 30px;
  }
  .article{
    padding: 20px;
    .title{
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .content{
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      img{
        width: 150px;
        height: 100px;
        display: block;
        border-radius: 5px;
      }
      .article-content{
        display: block;
        width: calc(100% - 160px);
        white-space: normal;
        word-break: break-all;
      }
    }
    .footer{
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      cursor: default;
      .svg-icon{
        font-size: 20px;
        margin-top: 5px;
      }
      .text{
        color: #ccc;
        margin-left: 10px;
        user-select: none;
      }
    }
    .comment{
      width: 100%;
      transition-duration: .4s;
      border-radius: 3px;
      .header{
        height: auto;
        width: 100%;
        line-height: 40px;
        .user-avatar{
          width: 30px;
          height: 30px;
          border-radius: 15px;
          margin-top: 8px;
        }
        .deep-textarea{
          width: calc(100% - 40px);
          /deep/input{
            width: 100%;
          }
        }
      }
      &-button{
        padding: 5px 0px;
      }
      .comments{
        width: 100%;
        padding: 5px 10px;
        border-top: 1px rgb(240,240,240) solid;
        &-item{
          padding: 5px 0;
          width: 100%;
        }
        &-avatar{
          width: 30px;
          height: 30px;
          border-radius: 15px;
        }
        .item-right{
          width: calc(100% - 30px);
        }
        .break{
          white-space: normal;
          word-break: break-all;
        }
        .nickname{
          padding-left: 5px;
          color: rgb(95, 95, 95);
          font-size: 14px;
        }
        .content{
          padding-left: 5px;
          color: rgb(146, 146, 146);
          font-size: 15px;
        }
        .time{
          padding-left: 3px;
          color: #ccc;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
