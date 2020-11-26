<template>
  <div class="main">
    <input ref="img" type="file" style="position:absolute; top:-100%" @change="chooseImg">
    <div class="upload-img" @click="uploadImg">
      <div class="shade">
        <i class="el-icon-camera-solid" />
        <div><p>添加图片</p></div>
      </div>
      <img v-if="imgUrl !== ''" :src="imgUrl" width="100%" height="100%">
    </div>
    <span class="deepInput"><el-input v-model="title" placeholder="请输入标题" /></span>
    <span class="deepSelect">
      <el-select v-model="type" placeholder="请选择版块">
        <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </span>
    <div id="test1" class="editorMenu" />
    <div id="test2" class="editorContent">
      <p>请输入内容</p>
    </div>
    <span class="deepButton">
      <el-button type="primary" @click="publish">发&emsp;表</el-button>
    </span>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'Write',
  data() {
    return {
      types: [],
      type: '',
      title: '',
      imgBase64: '',
      imgUrl: '',
      editor1: new E('#test1', '#test2') // 两个参数也可以传入 elem 对象，class 选择器
    }
  },
  mounted() {
    this.getTypes()
    // 编辑菜单配置
    this.editor1.customConfig.menus = this.$store.state.app.device === 'desktop' ? [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      // 'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      // 'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ] : [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'underline', // 下划线
      'strikeThrough', // 删除线
      'undo', // 撤销
      'redo' // 重复
    ]
    // this.editor1.customConfig.onchange = (html) => {
    //   // html 即变化之后的内容
    //   console.log(html)
    // }
    this.editor1.customConfig.zIndex = 1
    this.editor1.create()
    this.editor1.txt.html('<p>请输入内容</p>')
  },
  methods: {
    getTypes() {
      this.$axios({
        url: 'admin/types',
        method: 'get'
      }).then(ret => {
        if (ret.data.meta.status) {
          this.types = ret.data.data
        }
      })
    },
    publish() {
      let content = this.editor1.txt.html()
      console.log(content)
      let judge = true
      let num = 0
      while (judge && num < 10) {
        if (content.endsWith('<p><br></p>')) {
          content = content.slice(0, -11)
          console.log(content)
          num++
        } else {
          judge = false
        }
      }
      if (this.title === '') {
        this.$message.warning('请填写标题')
        return
      } else if (content === '' || content === '<p data-v-b33ca248="">请输入内容</p><p><br></p>') {
        this.$message.warning('请填写正文')
        return
      } else if (this.type === '') {
        this.$message.warning('请选择版块')
        return
      }
      this.$axios({
        url: 'article',
        method: 'post',
        data: {
          imgBase64: this.imgBase64,
          title: this.title,
          content: content,
          userId: this.$store.getters.userId,
          typeId: this.type
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          this.$message.success('发表成功')
          this.editor1.txt.html('<p>请输入内容</p>')
          this.imgBase64 = ''
          this.imgUrl = ''
          this.title = ''
          this.type = ''
        }
      })
    },
    chooseImg() {
      this.base64(this.$refs.img.files[0]).then((result) => {
        const base64 = result.split(',')[1]
        this.imgUrl = result
        this.imgBase64 = base64
      })
    },
    test() {
      console.log(this.editor1.txt.html())
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
    uploadImg() {
      this.$refs.img.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 30px;
  padding-top: 10px;
}
.upload-img{
  position: relative;
  width: 100%;
  border: 1px #ccc solid;
  border-radius: 5px;
  z-index: 1;
  background-color: rgba(221, 221, 221, 0.3);
  margin-bottom: 5px;
  &::before{
    content: '';
    display: block;
    padding-top: 50%;
  }
  img{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
  }
  .shade{
    position: absolute;
    z-index: 3;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    transition-duration: .8s;
    color: rgb(185, 185, 185);
    background-color: rgba(0, 0, 0, 0);
    i{
      font-size: 40px;
      color: rgb(185, 185, 185);
      transform: translateX(32px);
      transition-duration: .4s;
    }
    div{
      overflow: hidden;
    }
    p{
      transform: translateX(-70px);
      transition-duration: .4s;
    }
    &:hover{
      i{
        transform: translateX(0px);
      }
      p{
        transform: translateX(0px);
      }
    }
  }
}
.editorMenu{
  width:100%;
  border: 1px #ccc solid;
  border-bottom: none;
}
.editorContent{
  min-height: 300px;
  width: 100%;
  border: 1px #ccc solid;
  border-radius: 0px 0px 5px 5px;
  /deep/.w-e-text{
    overflow: auto;
  }
}
.deepInput{
  /deep/.el-input__inner{
    border-bottom: none;
    border-radius: 5px 5px 0px 0px;
  }
  /deep/input{
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input::-webkit-input-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input:-moz-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input:-ms-input-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
}
.deepSelect{
  display: block;
  width: 100%;
  .el-select{
    width: 100%;
  }
  /deep/.el-select .el-input.is-focus .el-input__inner{
    border-color: #d1d1d1;
  }
  /deep/.el-select .el-input__inner:focus{
    border-color: #d1d1d1;
  }
  /deep/.el-input__inner{
    border-bottom: none;
    border-radius: 0;
  }
  /deep/input{
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input::-webkit-input-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input:-moz-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
  /deep/input:-ms-input-placeholder {
    font-weight: 600;
    font-size: 20px;
  }
}
.deepButton{
  display: block;
  margin-top: 10px;
  width: 100%;
  /deep/button{
    width: 100%;
    height: 40px;
    font-size: 20px;
    padding: 10px 20px;
  }
  /deep/.el-button--primary{
    border: 1px #409EFF solid;
  }
}
</style>
