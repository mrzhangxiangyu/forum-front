<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <div v-if="articleList.length > 0" class="dashboard-text">
      <div v-for="(article, index) in articleList" :key="'article' + index" :class="index === 0 ? 'article' : 'article border-top'">
        <div class="title"> {{ article.title }} </div>
        <div class="content">
          <img v-if="article.imgUrl !== ''" :src="imgUrl + article.imgUrl">
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
              <img v-else :src="imgUrl + $store.getters.avatar" class="user-avatar">
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
                <img v-else :src="imgUrl + comment.avatar" class="comments-avatar">
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
    <div v-else style="text-align:center">
      无搜索结果
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      loading: false,
      activeName: '',
      types: [],
      articleList: [],
      imgUrl: window.$api.imgUrl
    }
  },
  watch: {
    '$store.getters.search': function() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.$store.getters.search)
      this.loading = true
      this.$axios({
        url: 'article/search',
        method: 'get',
        params: {
          txt: this.$store.getters.search
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
        this.loading = false
      })
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
        this.$axios({
          url: 'article/favorite',
          method: 'put',
          data: {
            id: item.id,
            userId: this.$store.getters.userId,
            type: type // 1是收藏 2是取消收藏
          }
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
          favorite(1)
        } else {
          item.favoriteNum--
          favorite(2)
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
        } else {
          this.$message('评论失败')
        }
      })
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
.dashboard {
  &-container {
    margin: 10px 0;
    background-color: #fff;
    box-shadow: 0px 0px 2px 0px rgb(231, 231, 231);
    border-radius: 3px;
    padding: 10px;
  }
}
.deep-tabs{
  display: block;
  width: 100%;
  padding: 0 20px;
}
.border-top{
  border-top: 1px rgb(240, 240, 240) solid;
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
</style>
