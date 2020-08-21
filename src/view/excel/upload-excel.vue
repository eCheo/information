<template>
  <div>
    <Tabs type="card">
        <TabPane label="客服消息">
          <div class="kf-top">
            <ul class="kf-list">
              <li class="kf-item">
                <span>用户名字</span>
                <Input style="width:200px;"> </Input>
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
            <Page style="margin-top:10px;float:right;" :page-size='15' :current='userFrom.page' :total="userData.totalElements" @on-change='getChartBackEndRoom' />
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
            <p>用户列表</p>
            <Table border :columns="infoList" :data="infoData.content"></Table>
            <Page style="margin-top:10px;float:right;" :page-size='15' :current='infoFrom.page' :total="infoData.totalElements" @on-change='findSystemMessage' />
          </div>
        </TabPane>
    </Tabs>
    <Modal v-model="chatModal">
        <p>时间</p>
        <div class="chat">

        </div>
   </Modal>
  </div>
</template>
<script>
import {getChartBackEndRoom, findSystemMessage} from "@/api/data"
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
          title: '发布内容',
          key: 'content'
        },
        {
          title: '发送时间',
          key: 'pubDate'
        },
        {
          title: '状态',
          render: (h, params) => {
            if (params.row.readType) {
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
              }, '待回复')
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
        page: '1',
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
          key: 'content'
        },
        {
          title: '发送时间',
          key: 'pubDate'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h( 'Button', {
              props: {
                type: 'success'
              }
            }, '删除')
          }
        }
      ],
      infoData: {},
      infoFrom: {
        GTE_pubDate: '',
        LTE_pubDate: '',
        page: '1',
        size: '15'
      }
    }
  },
  methods: {
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
    }
  },
  created () {
    this.getChartBackEndRoom(1);
    this.findSystemMessage(1);
  },
  mounted () {

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
</style>
