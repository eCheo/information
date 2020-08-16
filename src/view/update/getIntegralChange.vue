<template>
  <div>
    <div class="top">
      <div class="top-item">
        <span>会员名称</span>
        <Input v-model="integralFrom.nikeName" style="width:200px"></Input>
      </div>
      <div class="top-item">
        <span>变更时间</span>
         <DatePicker @on-change='changeDate' :value="time" format="yyyy年MM月dd日" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </div>
      <Button style="height:30px" type="success" icon="ios-search" @click="findIntegral(1)">搜索</Button>
    </div>
    <div class="content">
      <p>积分变更列表</p>
      <hr style="margin:20px 0;" color="#e9e9e9" />
      <Table border :columns="integralList" :data="integralData.content"></Table>
      <div style="text-align:right;">
        <Page style="margin-top:10px;" :page-size='10' :total="integralData.totalElements" @on-change='findIntegral' />
      </div>
    </div>
  </div>
</template>

<script>
import { findIntegral } from '@/api/data'
export default {
  data () {
    return {
      integralList: [
        {
          title: '会员ID',
          key: 'memberId'
        },
        {
          title: '会员名称',
          key: 'nikeName'
        },
        {
          title: '变更时间',
          key: 'integralDate'
        },
        {
          title: '积分变更',
          key: 'integral'
        },
        {
          title: '变更原因',
          key: 'desc'
        }
      ],
      integralData: {},
      time: '',
      integralFrom: {
        nikeName: '',
        startTime: '',
        endTime: '',
        page: '1',
        size: '10'
      }
    }
  },
  created() {
    this.findIntegral(1)
  },
  methods: {
    findIntegral(page) {
      this.integralFrom.page = page;
      findIntegral(this.integralFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.integralData = res.data.data;
          this.integralData.content.forEach(item => {
            item.desc = item.integralType.message;
            item.key = item.integralType.name;
          })
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.integralFrom.startTime = starTime.substring(0, starTime.length - 1)
      this.integralFrom.endTime = endTime.substring(0, endTime.length - 1)
    }
  }
}
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
