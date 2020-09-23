<template>
  <div>
    <Tabs type="card">
        <TabPane label="客服消息">
          <div class="kf-top">
            <ul class="kf-list">
              <li class="kf-item">
                <span>用户名字</span>
                <Input style="width:200px;" v-model="userFrom.nickName"> </Input>
              </li>
              <li class="kf-item">
                <span>选择时间</span>
                <DatePicker
                :transfer='true'
                v-model="selectTime"
                @on-change='changeDate'
                format="yyyy年MM月dd日"
                type="daterange"
                placement="bottom-end"
                placeholder="请选择时间"
                style="width: 200px"
              ></DatePicker>
              </li>
              <li class="kf-item">
                <Button type="success" @click="getChartBackEndRoom(1)">搜索</Button>
              </li>
            </ul>
          </div>
          <div class="kf-tab">
            <p>用户列表</p>
            <Table border :columns="userList" :data="userData.content"></Table>
            <div style="margin-top:10px;text-align:right;">
              <Page :page-size='10' :current='userFrom.page' :total="userData.totalElements" @on-change='getChartBackEndRoom' />
            </div>
          </div>
        </TabPane>
        <TabPane label="系统通知">
          <div class="kf-top">
            <ul class="kf-list">
              <li class="kf-item">
                <span>选择时间</span>
                <DatePicker
                :transfer='true'
                v-model="selectTime"
                @on-change='changeInfoDate'
                format="yyyy年MM月dd日"
                type="daterange"
                placement="bottom-end"
                placeholder="请选择时间"
                style="width: 200px"
              ></DatePicker>
              </li>
              <li class="kf-item">
                <Button type="success" @click="findSystemMessage(1)">搜索</Button>
              </li>
            </ul>
          </div>
          <div class="kf-tab">
            <div style="font-size:16px;margin-bottom:20px;">
              <span>系统通知列表</span>
              <Button type="success" style="float:right;" @click="addModal = true">添加消息</Button>
            </div>
            <Table border :columns="infoList" :data="infoData.content"></Table>
            <div style="margin-top:10px;text-align:right;">
              <Page :page-size='6' :current='infoFrom.page' :total="infoData.totalElements" @on-change='findSystemMessage' />
            </div>
          </div>
        </TabPane>
    </Tabs>
    <Modal v-model="chatModal" :mask-closable='false'>
        <p style="text-align:center;margin-bottom:15px;color:#333333;font-size:16px;">{{chatInfo.nickName}}</p>
          <div class="chat" id="top">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <p style="text-align:center;">{{chatInfo.pubDate}}</p>
            <Scroll :on-reach-top="handleReachEdge" loading-text='加载中' height='367'>
                <div v-for="(item, index) in chatList" :key='index'>
                  <div v-if="!item.whetherOwn" class="ct-left">
                    <img :src="item.headImgPath">
                    <div class="ct-box">
                      {{item.content}}
                    </div>
                  </div>
                  <div v-else class="ct-right">
                    <div class="ct-rbox">
                      {{item.content}}
                    </div>
                    <img :src="item.headImgPath">
                  </div>
                </div>
             </Scroll>
          </div>
        <div slot="footer" style="text-align:left;">
          <Input type="textarea" v-model="chatContent" :rows='2' style="width:86%;margin-right:10px;"></Input>
          <Button type="success" @click="setChat">回复</Button>
        </div>
   </Modal>
   <Modal v-model="addModal" :mask-closable='false' title="添加消息" @on-ok='createSystemMessage'>
     <RadioGroup v-model="pushTargetType">
       <Radio label="ALL">
            <span>全部</span>
        </Radio>
        <Radio label="Android">
            <span>安卓</span>
        </Radio>
        <Radio label="IOS">
            <span>IOS</span>
        </Radio>
     </RadioGroup>
     <div style="margin:20px 0;">
       <p>标题</p>
       <Input v-model="title" style="width:200px;"></Input>
     </div>
      <div>
        <p>通知内容</p>
        <tinymce-editor v-if="addModal" ref="editor" :init='init' v-model="content" @on-change="handleChange"/>
      </div>
   </Modal>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import Editor from "@tinymce/tinymce-vue";
import {getChartBackEndRoom, findSystemMessage, upload, createSystemMessage, findChatRecordPageByCondition} from "@/api/data"
export default {
  data () {
    return {
      userList: [
        {
          title: '头像',
          align: 'center',
          render: (h, params) => {
            return h('img', {
              style: {
                width: '50px',
                height: '50px',
                borderRadius: '50%'
              },
              attrs: {
                  src: params.row.headImgPath
              }
            })
          }
        },
        {
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '发送内容',
          key: 'content'
        },
        {
          title: '发送时间',
          key: 'pubDate'
        },
        {
          title: '状态',
          render: (h, params) => {
            if (params.row.readType.code === 'Read') {
              return h('span', {
                style: {
                  color: '#19be6b'
                }
              }, '已回复')
            } else {
              return h('span', {
                style: {
                  color: '#ed4014'
                }
              }, '待回复'+ params.row.unReadCount + '条消息')
            }
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'success'
              },
              on: {
                click: () => {
                  this.chatModal = true;
                  this.chatInfo = params.row;
                  this.chatPage = 1;
                  this.findChatRecordPageByCondition(this.chatPage);
                }
              }
            }, '回复')
          }
        }
      ],
      userData: {},
      userFrom: {
        nickName: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: '10'
      },
      selectTime: '',
      chatModal: false,
      chatInfo: {},
      infoList: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '通知内容',
          key: 'content',
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: params.row.content
              }
            })
          }
        },
        {
          title: '发送时间',
          key: 'pubDate'
        }
        // {
        //   title: '操作',
        //   render: (h, params) => {
        //     return h( 'Button', {
        //       props: {
        //         type: 'error'
        //       },
        //       on: {
        //         click: ()=> {
        //           this.deleteComment(params.row.id);
        //         }
        //       }
        //     }, '删除')
        //   }
        // }
      ],
      infoData: {},
      infoFrom: {
        GTE_pubDate: '',
        LTE_pubDate: '',
        page: 1,
        size: '10'
      },
      content: '',
      title: '',
      pushTargetType: 'ALL',
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
      },
      addModal: false,
      chatContent: '',
      chatList: [],
      spinShow: false,
      chatPage: 1,
      maxPage: 1,
      setUserId: ''
    }
  },
  components: {
     "tinymce-editor": Editor
  },
  created() {
    this.getChartBackEndRoom(1);
    this.findSystemMessage(1);
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    handleChange (html, text) {
      this.content = html
    },
    getChartBackEndRoom(page) {
      this.userFrom.page = page;
      getChartBackEndRoom(this.userFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.userData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.userFrom.startTime = starTime.substring(0, starTime.length - 1)
      this.userFrom.endTime = endTime.substring(0, endTime.length - 1)
    },
    findSystemMessage(page) {
      this.infoFrom.page = page;
      findSystemMessage(this.infoFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.infoData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    changeInfoDate(date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.infoFrom.GTE_pubDate = starTime.substring(0, starTime.length - 1)
      this.infoFrom.LTE_pubDate = endTime.substring(0, endTime.length - 1)
    },
    createSystemMessage() {
      let params = {
        title: this.title,
        content: this.content,
        pushTargetType: this.pushTargetType
      }
      createSystemMessage(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.findSystemMessage(1);
          this.$Message.success('添加系统通知成功');
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    // 获取聊天记录
    findChatRecordPageByCondition(page) {
      if (page === 1) {
        this.chatList = [];
      }
      this.chatPage = page;
      let params = {
        EQ_chatRoomId: this.chatInfo.id,
        page: page,
        size: '6',
        sort: 'pubDate,desc'
      }
      this.spinShow = true;
      findChatRecordPageByCondition(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          let info = {};
          this.maxPage = res.data.data.totalPages;
          res.data.data.content.forEach(item => {
            if (item.whetherOwn) {
                info = {
                headImgPath: item.headImgPath,
                content: item.content,
                whetherOwn: true
              }
              this.chatList.unshift(info);
              //  setTimeout(() => {
              //   document.getElementById('top').scrollTop = document.getElementById('top').scrollHeight;
              // }, 200);
            } else {
              info = {
                headImgPath: item.headImgPath,
                content: item.content
              }
              this.chatList.unshift(info);
              //  setTimeout(() => {
              //   document.getElementById('top').scrollTop = document.getElementById('top').scrollHeight;
              // }, 200);
            }
          })
          this.spinShow = false;
        } else {
          this.spinShow = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    // 聊天
    setChat() {
      if (this.chatContent === '') {
        this.$Message.error('请输入回复内容');
        return
      }
      const ws = new WebSocket('ws://47.56.186.16:8099/ws?=' + this.token);
      let _that = this;
      ws.onopen = function(evt) {
        let params = {
          receiverMemberId: _that.chatInfo.memberId,
          content: _that.chatContent,
          chatType: 'Txt',
          actionType: 'Chat'
        }
        ws.send(JSON.stringify(params))
      };
      ws.onclose = function(evt) {
          // onClose(evt)
      };
      ws.onmessage = function(evt) {
          let data = JSON.parse(evt.data);
          if (data.code === '200') {
            if (data.data.pushType === 'Other' && data.data.actionType === 'Chat') {
              let info = {
                headImgPath: data.data.headImgPath,
                content: data.data.content
              }
              _that.chatList.push(info);
              // setTimeout(() => {
              //   document.getElementById('top').scrollTop = document.getElementById('op').scrollHeight;
              // }, 200);
            } else {
              let info = {
                headImgPath: _that.$store.state.user.avatorImgPath,
                content: _that.chatContent,
                whetherOwn: true
              }
              _that.chatList.push(info);
              _that.chatContent = '';
              // setTimeout(() => {
              //   document.getElementById('top').scrollTop = document.getElementById('op').scrollHeight;
              // }, 200);
            }
          }
      };
      ws.onerror = function(evt) {
            // onError(evt)
      };
    },
    handleReachEdge (dir) {
                return new Promise(resolve => {
                    setTimeout(() => {
                      if (this.chatPage > this.maxPage) return;
                        this.findChatRecordPageByCondition(++this.chatPage)
                        resolve();
                    }, 2000);
                });
            }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    }
  }
}
</script>

<style lang="less" scoped>
.kf-top {
  padding: 20px;
  background: #fff;
}
.kf-list {
  .kf-item {
    list-style: none;
    display: inline-block;
    margin-right: 20px;
    > span {
      margin-right: 10px;
    }
  }
}
.kf-tab {
  background-color: #fff;
  margin-top: 20px;
  padding: 15px;
}
.chat {
  background-color: #e9e9e9;
  width:100%;
  height: 400px;
  padding: 10px 20px;
  .ct-left {
    width: 100%;
    margin-top: 20px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 4px;
    }
    .ct-box {
      background-color: #ffffff;
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;
      padding: 10px;
      border-radius: 4px;
      max-width: 272px;
    }
  }
  .ct-right {
    width: 100%;
    text-align: right;
    margin-top: 20px;
    .ct-rbox {
      background-color: #2d8cf0;
      margin-right: 10px;
      display: inline-block;
      vertical-align: top;
      padding: 10px;
      border-radius: 4px;
      color: #fff;
      max-width: 272px;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 4px;
    }
  }
}
</style>
