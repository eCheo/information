<template>
  <div>
    <div class="top">
      <div class="top-item">
        <span>会员名称</span>
        <Input style="width:200px;margin:0 10px;"></Input>
      </div>
      <!-- <div class="top-item">
        <span>变更时间</span>
        <DatePicker
          :value="time"
          @on-change='changeDate'
          format="yyyy年MM月dd日"
          type="daterange"
          placement="bottom-end"
          placeholder="Select date"
          style="width: 200px"
        ></DatePicker>
      </div> -->
      <Button style="height:30px" type="success" icon="ios-search" @click="findIntegralDetailed(1)">搜索</Button>
    </div>
    <div class="content">
      <p>积分变更列表</p>
      <hr style="margin:20px 0;" color="#e9e9e9" />
      <Table border :columns="integralList" :data="integralData.content"></Table>
      <Page style="margin-top:10px;float:right;" :page-size='15' :total="integralData.totalElements" @on-change='findIntegralDetailed' />
    </div>
  </div>
</template>

<script>
import { findIntegralDetailed } from '@/api/data'
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
          title: '账户积分余额',
          key: 'integral'
        },
        {
          title: '使用积分累计',
          key: 'cumulativeUse'
        },
        {
          title: '获取积分累计',
          key: 'cumulativeGain'
        },
        {
          title: '失效积分累计',
          key: 'invalidIntegral'
        }
      ],
      integralData: {},
      time: '',
      integralFrom: {
        nikeName: '',
        page: '1',
        size: '15'
      }
    }
  },
  created() {
    this.findIntegralDetailed(1);
  },
  methods: {
    findIntegralDetailed(page) {
      this.integralFrom.page = page;
      findIntegralDetailed(this.integralFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') { 
          this.integralData = res.data.data;
        } else {
          this.$Message.error(res.data.message)
        }
      })
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
