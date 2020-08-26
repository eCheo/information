<template>
  <div style="height:100%;">
    <div class="xt-top">
      系统设置
    </div>
    <div class="xt-bottom">
      <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                <div class="progress" v-if="item.status !== 'finished'">
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </div>
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
                style="display: inline-block;width:250px;"
            >
                <img style="width:250px;height:250px;border-radius:50%;" :src='userInfo.avatorImgPath' />
            </Upload>
            <div>
              <Input v-model="name" style="width:200px;"> </Input><span style="margin-left:10px;cursor:pointer;" @click="userUpdate">修改</span>
            </div>
    </div>
  </div>
</template>

<script>
import { userUpdate } from "@/api/data";
export default {
  data () {
    return {
      uploadList: '',
      headers: {},
      name: ''
    }
  },
  mounted() {
    if (this.$refs.upload.fileList) {
      this.uploadList = this.$refs.upload.fileList
    }
    this.headers = {
      Authorization: sessionStorage.getItem('tokenType') + ' ' + sessionStorage.getItem('token')
    }
    this.name = this.userInfo.userName;
  },
  methods: {
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList || [];
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      let params = {
        headImgPath: res.data.viewUrl
      }
      userUpdate(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$store.dispatch('getUserInfo');
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '格式错误',
        desc: '请上传jpg和png类型的图片'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '提示',
        desc: '请上传小于5mb的图片'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一张图片'
        })
      }
      return check
    },
    userUpdate() {
      let params = {
        nickName: this.name
      }
      userUpdate(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('修改成功');
          this.$store.dispatch('getUserInfo');
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    }
  }
}
</script>

<style lang='less' scoped>
.xt-top {
  background: #fff;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
}
.xt-bottom {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  height: calc(100% - 20px);
  text-align: center;
}
.ivu-upload-drag { 
  border: none;
}
.demo-upload-list {
  position: relative;
  .progress {
    position: absolute;
    width: 250px;
    height: 257px;
    line-height: 257px;
    left: 42%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.38);
  }
}
</style>
