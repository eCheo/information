<template>
  <div>
    <div class="us-top">
      <div class="us-box">
        <div>
          <span>用户名</span>
          <Input style="width: 200px" v-model="userInfo.LIKE_nickName" placeholder="请输入用户名"></Input>
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
      <div style="text-align:right;">
        <Page
          style="margin-top:10px;"
          :page-size="10"
          :current='userInfo.page'
          :total="userData.totalElements"
          @on-change="findPageByCondition"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { findPageByCondition, setMemberDisable } from '@/api/data'
export default {
  data() {
    return {
      selectTime: '',
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
          render: (h, params) => {
            return h('i-switch', {
              props: {
                  trueColor: '#19be6b',
                  value: params.row.isDisable
              },
              on: {
                'on-change': () => {
                  this.setMemberDisable(params.row);
                }
              }  
            })
          }
        },
      ],
      userData: {},
      userInfo: {
        LIKE_nickName: '',
        GTE_registerDate: '',
        LTE_registerDate: '',
        page: 1,
        size: '10',
        EQ_memberType: 'front'
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
            this.userInfo.GTE_registerDate = starTime.substring(0, starTime.length - 1)
            this.userInfo.LTE_registerDate = endTime.substring(0, endTime.length - 1)
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
    },
    setMemberDisable(row) {
      let params = {
        id: row.id,
        isDisable: !row.isDisable
      }
      setMemberDisable(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          if (!row.isDisable) { 
            this.$Message.success('账户禁用成功');
          } else {
            this.$Message.success('账户启用成功');
          }
          this.findPageByCondition(1);
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
