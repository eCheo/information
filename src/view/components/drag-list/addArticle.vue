<template>
  <div>
    <div v-if="viewType === 'PublishArticle'">
      <Input v-model="title" style="width:500px;margin-bottom: 20px;" placeholder="请输入文章标题"></Input>
      <tinymce-editor ref="editor" :init="init" v-model="content" @on-change="handleChange" />
      <p style="margin:20px 0;">*封面(必填)</p>
      <p>只能上传jgp/png文件，且不超过5M</p>
      <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
          <img :src="item.url" style="width:250px;height:250px;" />
          <div class="demo-upload-list-cover">
            <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
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
    <div style="width:860px;" v-else-if="viewType === 'PublishVideo'">
      <div>
        <p>
          *上传视频
          <span>请上传时长10-30分钟,支持主流的视频格式，超出限制的视频请到腾讯视频上传</span>
        </p>
        <Upload
          ref="upload"
          :show-upload-list="true"
          :on-success="handleSuccessfm"
          :default-file-list="vidoeList"
          :format="['avi','mp4']"
          :max-size="10240"
          :on-format-error="handleFormatErrorfm"
          :on-exceeded-size="handleMaxSize"
          :before-upload='handleBeforeUploadfm'
          :headers="headers"
          type="drag"
          action="http://47.56.186.16:8089/api/obs/upload.json"
          style="width:200px;border: none;"
        >
          <Button icon="ios-cloud-upload-outline" @click="fileName ='PublishVideo'">上传文件</Button>
        </Upload>
      </div>
      <div>
        <p>封面</p>
        <div class="demo-upload-list" v-for="(item, index) in fmUploadList" :key="index">
          <template v-if="item.status === 'finished'">
            <img :src="item.response.data.viewUrl" style="width:250px;height:250px;" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemovefm(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref="fmUpload"
          :show-upload-list="false"
          :on-success="handleSuccessfm"
          :format="['jpg','png']"
          :max-size="5042"
          :before-upload='handleBeforeUploadfm'
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSizefm"
          multiple
          :headers="headers"
          type="drag"
          action="http://47.56.186.16:8089/api/obs/upload.json"
          style="display: inline-block;width:58px;"
          v-if="uploadList.length < 4"
        >
          <div
            style="width: 58px;height:58px;line-height: 58px;"
            @click="fileName = 'PublishVideoImag'"
          >
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
      <div>
        <span>标题</span>
        <Input class="video-input" v-model="title"></Input>
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
      <Input style="margin-bottom: 20px;" v-model="title" placeholder="请输入标题"></Input>
      <tinymce-editor ref="editor" :init="init" v-model="content" @on-change="handleChange" />
      <p>*问题 给话题制造问题，给出两个对立的观点，让读者参与到话题的投票中，进行阅读的互动</p>
      <div class="top-box">
        <div>
          <span>问题标题</span>
          <Input v-model="topicData.title"></Input>
        </div>
        <div>
          <span>观点一</span>
          <Input v-model="topicData.viewpointOne"></Input>
        </div>
        <div>
          <span>肯定选项</span>
          <Input v-model="topicData.optionOne"></Input>
        </div>
        <div>
          <span>观点二</span>
          <Input v-model="topicData.viewpointTwo"></Input>
        </div>
        <div>
          <span>否定选项</span>
          <Input v-model="topicData.optionTwo"></Input>
        </div>
      </div>
      <p>*封面 只能上传jgp/png文件，且不超过5M，封面的内容设计要与话题相符</p>
      <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
          <img :src="item.url" style="width:250px;height:250px;" />
          <div class="demo-upload-list-cover">
            <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
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
    </div>
    <div v-else-if="viewType === 'BrokeTheNews'">
      <div style="background:#fff;padding:20px;">
        <p style="font-size:16px;color:#333333;font-weight: bold;">{{title}}</p>
        <div class="ex-pl" style="margin-bottom:20px;">
          <div>
            <img class="ex-img" :src="memberDto.headImgPath" />
          </div>
          <div class="ex-ct" style="width:auto;">
            <p>{{memberDto.nickName}}</p>
            <p>{{newsData.pubDate}}<span style="margin:0 6px;font-size:19px;">·</span><span>{{memberDto.videoAuthName || memberDto.articlesAuthName}}</span></p>
          </div>
        </div>
        <div v-html="content"></div>
      </div>
        <div class="vd-bottom">
          <div>
            <ul class="th-list">
              <li class="th-item">用户ID</li>
              <li class="th-item">发布类型</li>
              <li class="th-item">联系人</li>
              <li class="th-item">联系方式</li>
              <li class="th-item">邮箱</li>
              <li class="th-item">审核状态</li>
            </ul>
            <ul class="td-list">
              <li class="td-item">{{newsData.memberId || '---'}}</li>
              <li class="td-item">{{newsData.type.message}}</li>
              <li class="td-item">{{newsData.contacts}}</li>
              <li class="td-item">{{newsData.contactInformation}}</li>
              <li class="td-item">{{newsData.email}}</li>
              <li class="td-item">{{newsData.status.message}}</li>
            </ul>
          </div>
          <div style="margin-top:15px;text-align:center;">
            <Button style="margin-right:10px;" type='success' :disabled="newsData.status.name === 'Approved' || newsData.status.name === 'AuditFailed'" @click="informationExamine(newsData, 'Approved')">通过</Button>
            <Button type="error" :disabled="newsData.status.name === 'Approved' || newsData.status.name === 'AuditFailed'" @click="informationExamine(newsData, 'AuditFailed')">不通过</Button>
          </div>
        </div>
    </div>
    <div v-if="viewType !== 'BrokeTheNews'">
      <Button type="success" @click="articleAdd('Dismount')" style="margin-right:10px;">保存</Button>
      <Button type="error" @click="articleAdd('Grounding')">上架</Button>
    </div>
  </div>
</template>

<script>
// import Editor from '_c/editor'
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import Editor from "@tinymce/tinymce-vue";
import {
  releaseArticle,
  findArticles,
  upload,
  findArticlesDetails,
  informationExamine
} from "../../../api/data";
import store from "../../../store/module/user";
export default {
  data() {
    return {
      content: "",
      uploadList: [],
      headers: {},
      viewImg: [],
      title: "",
      conditionList: [],
      condiId: "",
      condiIndex: 0,
      viewType: "",
      fileName: "",
      videoImagePath: "",
      viodeUrl: "",
      init: {
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        height: 430,
        plugins:
          "link lists image code table colorpicker textcolor wordcount contextmenu",
        toolbar:
          "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | link unlink image code | removeformat",
        branding: false,
        menubar: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const file = blobInfo.blob();
          if (file.size > 5242880) {
            this.$Message.error("图片请不要大于 5MB");
          } else {
            try {
              let params = new FormData();
              params.append("filename", file.name);
              params.append("file", file);
              upload(params).then(res => {
                if (res.status === 200 && res.data.code === "200") {
                  success(res.data.data.viewUrl);
                } else {
                  failure(res.data.message);
                }
              });
            } catch {
              failure("上传图片失败");
            }
          }
        }
      },
      topicData: {
        title: "",
        viewpointOne: "",
        optionOne: "",
        viewpointTwo: "",
        optionTwo: ""
      },
      fmUploadList: [],
      vidoeList: [],
      memberDto: {},
      newsData: {}
    };
  },
  components: {
    "tinymce-editor": Editor
  },
  created() {
    this.getCondition();
    if (Object.keys(this.$route.query).length !== 0) {
      this.viewType = this.$route.query.type;
      if (this.$route.query.id) {
        this.findArticlesDetails(this.$route.query.id);
      }
    }
  },
  mounted() {
    tinymce.init({});
    this.headers = {
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("token")
    };
    if (this.$refs.upload.fileList) {
      this.uploadList = this.$refs.upload.fileList;
    }
    if (this.$refs.fmUpload.fileList) {
      this.fmUploadList = this.$refs.fmUpload.fileList;
    }
    
  },
  methods: {
    handleChange(html, text) {
      this.content = html;
    },
    articleAdd(status) {
      let params = {};
      if (this.viewType === "PublishVideo") {
        params = {
          groundingType: status,
          type: "PublishVideo",
          columnId: this.condiId + "",
          title: this.title,
          videoPath: this.viodeUrl,
          videoImagePath: this.videoImagePath,
          id: this.$route.query.id
        };
      } else if (this.viewType === "PublishArticle") {
        params = {
          title: this.title,
          content: this.content,
          columnId: this.condiId + "",
          type: "PublishArticle",
          imagePaths: this.viewImg,
          groundingType: status,
          id: this.$route.query.id
        };
      } else if (this.viewType === "Topic") {
        params = {
          problem: this.topicData.title,
          orthodoxView: this.topicData.viewpointOne,
          opposingView: this.topicData.viewpointTwo,
          orthodoxButtonText: this.topicData.optionOne,
          opposingButtonText: this.topicData.optionTwo,
          content: this.content,
          title: this.title,
          imagePaths: this.viewImg,
          type: "Topic",
          id: this.$route.query.id
        };
      }
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      releaseArticle(params).then(res => {
        if (res.data.code === "200") {
          if (status === "Dismount") {
            this.$Message.success("保存成功");
          } else {
            this.$Message.success("发布成功");
          }
          this.$router.push("/components/drag/drag_list_page");
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    getCondition() {
      findArticles().then(res => {
        if (res.data.code === "200") {
          this.conditionList = res.data.data;
          this.condiId = this.conditionList[0].id;
        }
      });
    },
    findArticlesDetails(id) {
      let params = {
        id: id
      };
      findArticlesDetails(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.content = res.data.data.content;
          this.title = res.data.data.title;
          this.topicData.title = res.data.data.problem;
          this.newsData = res.data.data;
          this.memberDto = res.data.data.memberDto;
          this.topicData.viewpointOne = res.data.data.orthodoxView;
          this.topicData.optionOne = res.data.data.orthodoxButtonText;
          this.topicData.viewpointTwo = res.data.data.opposingView;
          this.topicData.optionTwo = res.data.data.opposingButtonText;
          if (this.viewType === "PublishVideo") {
            this.videoImagePath = res.data.data.videoImagePath;
            this.viodeUrl = res.data.data.videoPath;
            let name = res.data.data.videoPath.substring(
              res.data.data.videoPath.lastIndexOf("/") + 1,
              res.data.data.videoPath.length
            );
            this.vidoeList.push({ url: res.data.data.videoPath, name: name });
            this.fmUploadList.push({
              url: res.data.data.videoImagePath,
              status: "finished"
            });
          }
          if (res.data.data.imagePaths.length > 0) {
            res.data.data.imagePaths.forEach(item => {
              this.uploadList.push({
                url: item,
                status: "finished"
              });
            });
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    getId(item, index) {
      this.condiIndex = index;
      this.condiId = item.id;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList || [];
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      if (this.viewType === "PublishVideo") {
        this.viodeUrl = "";
      }
    },
    handleSuccess(res, file) {
      if (this.viewType === "PublishVideo") {
        if (this.fileName === "PublishVideo") {
          this.viodeUrl = res.data.viewUrl;
        } else if (this.fileName === "PublishVideoImag") {
          this.videoImagePath = res.data.viewUrl;
        } else {
          this.videoImagePath = res.data.viewUrl;
        }
      } else {
        file.url = res.data.viewUrl;
        this.viewImg.push(res.data.viewUrl);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc:
          "暂不支持该文件" +
          file.name +
          " 类型"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 9;
      if (this.viewType === "Topic" && this.uploadList.length === 1) {
         this.$Notice.warning({
          title: "话题封面只能上传一张"
        });
        return false;
      }
      if (!check) {
        this.$Notice.warning({
          title: "图片最多上传九张"
        });
      }
      return check;
    },
    handleSuccessfm(res, file) {
      if (this.viewType === "PublishVideo") {
        if (this.fileName === "PublishVideo") {
          this.viodeUrl = res.data.viewUrl;
        } else if (this.fileName === "PublishVideoImag") {
          this.videoImagePath = res.data.viewUrl;
        } else {
          this.videoImagePath = res.data.viewUrl;
        }
      } else {
        file.url = res.data.viewUrl;
        this.viewImg.push(res.data.viewUrl);
      }
    },
    handleRemovefm(file) {
      const fileList = this.$refs.fmUpload.fileList || [];
      this.$refs.fmUpload.fileList.splice(fileList.indexOf(file), 1);
      this.videoImagePath = "";
    },
    handleFormatErrorfm(file) {
      this.$Notice.warning({
        title: "格式错误",
        desc: "视频暂时只支持 avi or mp4."
      });
    },
    handleBeforeUploadfm() {
      if (this.fileName === 'PublishVideoImag' && this.fmUploadList.length === 1) {
         this.$Notice.warning({
          title: "视频封面只能上传一张"
        });
        return false;
      } else if(this.fileName === 'PublishVideo' && this.uploadList.length === 1) {
        this.$Notice.warning({
          title: "视频只能上传一个"
        });
        return false;
      }
    },
    handleMaxSizefm(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 10M."
      });
    },
    informationExamine(row, status) {
      let params = {
        id: row.id,
        status: status
      }
      informationExamine(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          if (status === 'Approved') {
            this.$Message.success('爆料通过成功');
          } else {
            this.$Message.success('爆料拒绝成功');
          }
          this.$router.push('/components/drag/drag_list_page')
        } else {  
          this.$Message.error(res.data.message);
        }
      })
    },
  },
  watch: {
    uploadList: {
      handler(val, oldVal) {
        if (this.uploadList.length > 0) {
          this.uploadList.forEach(item => {
            if (item.status === "finished") {
              this.viewImg.push(item.url);
            }
          });
        } else {
          this.viewImg = [];
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
ul li {
  list-style: none;
}
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
.top-box {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  width: 890px;
}
.demo-upload-list {
  display: inline-block;
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  // border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.video-input .ivu-input {
  height: 76px;
}
.ex-pl {
  display: flex;
  padding: 5px 20px 15px 20px;
  flex-wrap: wrap;
  .ex-img {
    border-radius: 50%;
    width: 58px;
    height: 58px;
  }
  .ex-ct {
    font-size: 14px;
    width: 87%;
    margin-left: 15px;
    p {
      color: #666666;
    }
    p:nth-child(2) {
      color: #333333;
    }
  }
  .ex-hf {
    line-height: 69px;
  }
  .ex-more {
    width: 100%;
    text-align: center;
    font-size: 14px;
  }
}
.vd-bottom {
    padding:20px;
    background: #fff;
    margin-top:15px;
}
.th-list {
  background: #e9e9e9;
  width: 100%;
  margin: 0;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  .th-item {
    padding: 20px;
    min-width: 150px;
    box-sizing: border-box;
  }
}
.td-list {
  width: 100%;
  margin: 0;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  border-left: 1px solid #e9e9e9;
  .td-item {
    padding: 20px;
    min-width: 150px;
    box-sizing: border-box;
  }
}
</style>
