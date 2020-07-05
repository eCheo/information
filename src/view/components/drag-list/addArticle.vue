<template>
  <div>
    <div v-if="viewType === 'PublishArticle'">
      <Input v-model="title" placeholder="请输入文章标题"></Input>
      <editor ref="editor" :value="content" @on-change="handleChange" />
      <p>*封面(必填)</p>
      <p>只能上传jgp/png文件，且不超过5M</p>
      <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
          <img :src="item.url" style="width:250px;height:250px;" />
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','png']"
        :max-size="5042"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        :headers="headers"
        type="drag"
        action="http://47.56.186.16:8089/api/obs/upload.json"
        style="display: inline-block;width:58px;"
      >
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
      <div>
        <p>*选择所属栏目类型（单选/必选）</p>
        <p>选择与文章内容相符的栏目有利于提高文章的通过率</p>
        <div style="margin:20px 0;">
          <div
            class="lm-list"
            :class="condiIndex === index ? 'lm-bg' : ''"
            v-for="(item, index) in conditionList"
            :key="index"
            @click="getId(item,index)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
    <div v-else-if="viewType === 'PublishVideo'">
        <div>
            <p>上传视频<span>请上传时长10-30分钟,支持主流的视频格式，超出限制的视频请到腾讯视频上传</span></p>
            <Upload
                ref="upload"
                :show-upload-list="true"
                :on-success="handleSuccess"
                :format="['avi','mp4']"
                :max-size="10240"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                :headers="headers"
                type="drag"
                action="http://47.56.186.16:8089/api/obs/upload.json"
                style="width:200px;"
            >
                <Button icon="ios-cloud-upload-outline" @click="fileName ='sp'">Upload files</Button>
            </Upload>
        </div>
        <div>
            <p>封面</p>
            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                <template v-if="item.status === 'finished'">
                <img :src="item.url" style="width:250px;height:250px;" />
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
                </template>
                <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','png']"
                :max-size="5042"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                :headers="headers"
                type="drag"
                action="http://47.56.186.16:8089/api/obs/upload.json"
                style="display: inline-block;width:58px;"
            >
                <div style="width: 58px;height:58px;line-height: 58px;" @click="fileName = 'tp'">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
        </div>
        <div>
            <span>标题</span>
            <Input v-model="title"></Input>
        </div>
        <div style="margin:20px 0;">
        <span>栏目类型</span>
          <div
            class="lm-list"
            :class="condiIndex === index ? 'lm-bg' : ''"
            v-for="(item, index) in conditionList"
            :key="index"
            @click="getId(item,index)"
          >{{item.name}}</div>
        </div>
    </div>
    <div v-else-if="viewType === 'Topic'">

    </div>
    <div>
      <Button type="success" @click="articleAdd('Dismount')">保存</Button>
      <Button type="error" @click="articleAdd('Grounding')">上架</Button>
    </div>
  </div>
</template>

<script>
import Editor from '_c/editor'
import { releaseArticle, findArticles} from '../../../api/data'
import store from '../../../store/module/user'
export default {
  data () {
    return {
      content: '',
      uploadList: [],
      headers: {},
      viewImg: [
        'https://jznews.oss-cn-hongkong.aliyuncs.com/image/3db69f7c-7e8f-478e-9e67-fa9e6335defb.jpg'
      ],
      title: '',
      conditionList: [],
      condiId: '',
      condiIndex: 0,
      viewType: '',
      fileName: '',
      videoImagePath: 'https://jznews.oss-cn-hongkong.aliyuncs.com/image/3db69f7c-7e8f-478e-9e67-fa9e6335defb.jpg',
      viodeUrl: 'https://jznews.oss-cn-hongkong.aliyuncs.com/video/de350529-87db-41a8-98cc-50d2fc928211.mp4'
    }
  },
  components: {
    Editor
  },
  created () {
    this.getCondition()
    if (Object.keys(this.$route.query).length !== 0) {
      this.viewType = this.$route.query.type
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    this.headers = {
      Authorization: store.state.tokenType + ' ' + store.state.token
    }
  },
  methods: {
    handleChange (html, text) {
      this.content = html
    },
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    },
    articleAdd (status) {
      let params = {}
      if (this.viewType === 'sp') {
        params = {
          groundingType: status,
          type: 'PublishVideo',
          columnId: this.condiId + '',
          title: this.title,
          videoPath: this.viodeUrl,
          videoImagePath: this.videoImagePath
        }
      } else if (this.viewType === 'wz') {
        params = {
          title: this.title,
          content: this.content,
          columnId: this.condiId + '',
          type: 'PublishArticle',
          imagePaths: this.viewImg,
          groundingType: status
        }
      }
      releaseArticle(params).then(res => {
        if (res.data.code === '200') {
          this.$Message.success('发布成功')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    getCondition () {
      findArticles().then(res => {
        if (res.data.code === '200') {
          this.conditionList = res.data.data
          this.condiId = this.conditionList[0].id
        }
      })
    },
    getId (item, index) {
      this.condiIndex = index
      this.condiId = item.id
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (this.viewType === 'sp') {
        if (this.fileName === 'sp') {
          this.viodeUrl = res.data.viewUrl
        } else {
          this.videoImagePath = res.data.viewUrl
        }
      } else {
        file.url = res.data.viewUrl
        this.viewImg.push(res.data.viewUrl)
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  }
}
</script>

<style lang="less" scoped>
.lm-list {
  min-width: 70px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #333333;
  font-size: 12px;
  border: 1px solid #000;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
  margin-right: 10px;
}
.lm-list:last-child {
  margin-right: 0px;
}
.lm-bg {
  border: 1px solid #19be6b;
  background-color: #19be6b;
  color: #fff;
}
</style>
