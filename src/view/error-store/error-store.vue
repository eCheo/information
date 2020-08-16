<template>
  <div>
    <div class="us-top">
      <div class="us-box">
        <div>
          <span>用户名</span>
          <Input style="width: 200px" v-model="userName" placeholder="请输入用户名"></Input>
        </div>
        <div>
          <span>选择时间</span>
          <DatePicker
              :transfer="true"
              v-model="selectTime"
              @on-change="changeDate"
              format="yyyy年MM月dd日"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择时间"
              style="width: 200px"
            ></DatePicker>
        </div>
        <div>
          <Button style="margin-left:10px;" type="success" icon="ios-search" @click="findPageByCondition('1')">搜索</Button>
        </div>
      </div>
    </div>
    <div class="us-bottom">
      <p>用户列表</p>
      <hr size='1' color='#e9e9e9' style="margin:10px 0;" />
      <Table border :columns="userList" :data="userData.content"></Table>
    </div>
  </div>
</template>

<script>
import { findPageByCondition } from '@/api/data'
export default {
  data() {
    return {
      selectTime: '',
      userName: '',
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
          title: '用户ID',
          key: 'id'
        },
        {
          title: "用户昵称",
          key: 'nickName'
        },
        {
          title: '性别',
          render: (h, params) => {
            return h('p', {}, params.row.sex === null ? '---' : params.row.sex.message)
          }
        },
        {
          title: '区域',
          key: 'address',
          render: (h, params) => {
            return h('p', {}, params.row.address === null ? '---' : params.row.address)
          }
        },
        {
          title: '注册时间',
          key: 'registerDate'
        },
        {
          title: '账户禁用',
          key: ''
        },
      ],
      userData: {},
      userInfo: {
        userName: '',
        startDate: '',
        endDate: '',
        page: '1',
        size: '10'
      }
    }
  },
  created() {
    this.findPageByCondition('1');
  },
  methods: {
    changeDate (date) {
            let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
            let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
            this.orderSeach.startDate = starTime.substring(0, starTime.length - 1)
            this.orderSeach.endDate = endTime.substring(0, endTime.length - 1)
    },
    findPageByCondition(page) {
      this.userInfo.page = page;
      findPageByCondition(this.userInfo).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.userData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .us-top {
    background: #fff;
    padding: 20px;
    .us-box {
      display: flex;
      justify-content: space-between;
      max-width: 1366px;
      span {
        margin-right: 15px;
      }
    }
  }
  .us-bottom {
    background: #fff;
    margin-top: 30px;
    padding: 20px;
    > p {
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
