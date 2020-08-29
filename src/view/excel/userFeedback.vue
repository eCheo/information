<template>
  <div>
    <div class="top">
      <div class="top-item">
        <span>用户名</span>
        <Input v-model="feedbackInfo.nikeName" style="width:200px"></Input>
      </div>
      <div class="top-item">
        <span>选择时间</span>
        <DatePicker
          @on-change="changeDate"
          :value="time"
          format="yyyy年MM月dd日"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择时间"
          style="width: 200px"
        ></DatePicker>
      </div>
      <Button style="height:30px" type="success" icon="ios-search" @click="findByNickName(1)">搜索</Button>
    </div>
    <div class="content">
      <p>反馈列表</p>
      <hr style="margin:20px 0;" color="#e9e9e9" />
      <Table border :columns="feedbackList" :data="feedbackData.content"></Table>
      <div style="text-align:right;">
        <Page style="margin-top:10px;" :page-size='10' :current='feedbackInfo.page' :total="feedbackData.totalElements" @on-change='findByNickName' />
      </div>
    </div>
  </div>
</template>

<script>
import {findByNickName} from '@/api/data'
export default {
  data() {
    return {
        time: '',
        feedbackInfo: {
            nickName: '',
            startTime: '',
            endTime: '',
            page: 1,
            size: '10'
        },
        feedbackList: [
            {
                title: '头像',
                render: (h, params) => {
                    if (params.row.headImgPath === null) {
                        return h('p', {}, '----')
                    } else {
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
                }
            },
            {
                title: '昵称',
                render: (h, params) => {
                    return h('p', {}, params.row.nickName === null ? '---' : params.row.nickName)
                }
            },
            {
                title: '反馈类型',
                render: (h, params) => {
                    return h('p', {}, params.row.feedBackType.message)
                }
            },
            {
                title: '反馈时间',
                render: (h, params) => {
                    return h('p', {}, params.row.pubDate === null ? '---' : params.row.pubDate)
                }
            },
            {
                title: '详情',
                render: (h, params) => {
                    return h('p', {
                        style: {
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        },
                        on: {
                          click: ()=> {
                            this.$router.push('/excel/user/userfeeddetails/');
                            sessionStorage.setItem('ufeedId', params.row.id);
                          }
                        }
                    }, '查看')
                }
            }
        ],
        feedbackData: []
    };
  },
  created() {
      this.findByNickName(1);
  },
  methods: {
    findByNickName(page) {
        this.feedbackInfo.page = page;
        findByNickName(this.feedbackInfo).then(res => {
            if (res.status === 200 && res.data.code === '200') {
                this.feedbackData = res.data.data;
            } else {
                this.$Message.error(res.data.message);
            }
        })
    },
    changeDate (date) {
        let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
        let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
        this.feedbackInfo.startTime = starTime.substring(0, starTime.length - 1)
        this.feedbackInfo.endTime = endTime.substring(0, endTime.length - 1)
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  width: 100%;
  height: 100px;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .top-item {
    span {
      margin-right: 10px;
    }
  }
  .top-item:nth-child(2) {
    margin: 0 20px;
  }
}
.content {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
}
</style>