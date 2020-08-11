<template>
  <div>
    <div v-if="viewType === 'PublishArticle'">
      <Input v-model="title" style="width:500px;margin-bottom: 20px;" placeholder="请输入文章标题"></Input>
      <tinymce-editor ref="editor" :init='init' v-model="content" @on-change="handleChange"/>
      <p style="margin:20px 0;">*封面(必填)</p>
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
                <Button icon="ios-cloud-upload-outline" @click="fileName ='PublishVideo'">Upload files</Button>
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
      <Button type="success" @click="articleAdd('Dismount')" style="margin-right:10px;">保存</Button>
      <Button type="error" @click="articleAdd('Grounding')">上架</Button>
    </div>
  </div>
</template>

<script>
// import Editor from '_c/editor'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import Editor from "@tinymce/tinymce-vue";
import { releaseArticle, findArticles, upload, findArticlesDetails} from '../../../api/data'
import store from '../../../store/module/user'
export default {
  data () {
    return {
      content: '',
      uploadList: [],
      headers: {},
      viewImg: [],
      title: '',
      conditionList: [],
      condiId: '',
      condiIndex: 0,
      viewType: '',
      fileName: '',
      videoImagePath: '',
      viodeUrl: '',
      init: {
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: '/tinymce/skins/ui/oxide',
        height: 430,
        plugins:"link lists image code table colorpicker textcolor wordcount contextmenu",
        toolbar:"bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | link unlink image code | removeformat",
        branding: false,
        menubar: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const file = blobInfo.blob();
          if (file.size > 5242880) {
            this.$Message.error("图片请不要大于 5MB");
          } else {
            try {
             let params = new FormData();
             params.append('filename', file.name);
             params.append('file', file)
              upload(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                  success(res.data.data.viewUrl);
                } else {
                  failure(res.data.message)
                }
              })
            } catch {
              failure('上传图片失败')
            }
          }
        }
     }
    }
  },
  components: {
     "tinymce-editor": Editor
  },
  created () {
    this.getCondition()
    if (Object.keys(this.$route.query).length !== 0) {
      this.viewType = this.$route.query.type;
      if (this.$route.query.id) {
        this.findArticlesDetails();
      }
    }
  },
  mounted () {
    tinymce.init({})
    if (this.$refs.upload.fileList) {
      this.uploadList = this.$refs.upload.fileList
    }
    this.headers = {
      Authorization: sessionStorage.getItem('tokenType') + ' ' + sessionStorage.getItem('token')
    }
  },
  methods: {
    findArticlesDetails() {
      let params = {
        id: this.$route.query.id
      }
      findArticlesDetails({id: this.$route.query.id}).then(res => {
        if (res.data.code === '200') {
          this.content = res.data.data.content;
          this.title = res.data.data.title;
        }
      })
    },
    handleChange (html, text) {
      this.content = html
    },
    articleAdd (status) {
      let params = {}
      if (this.viewType === 'PublishVideo') {
        params = {
          groundingType: status,
          type: 'PublishVideo',
          columnId: this.condiId + '',
          title: this.title,
          videoPath: this.viodeUrl,
          videoImagePath: this.videoImagePath
        }
      } else if (this.viewType === 'PublishArticle') {
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
          this.$Message.success('发布成功');
          this.$router.push('/components/drag/drag_list_page');
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
      if (this.viewType === 'PublishVideo') {
        if (this.fileName === 'PublishVideo') {
          this.viodeUrl = res.data.viewUrl
        } else {
          this.videoImagePath = res.data.viewUrl
        }
      } else {
        file.url = res.data.viewUrl;
        this.viewImg.push(res.data.viewUrl);
        console.log(res.data.viewUrl, this.viewImg);
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
