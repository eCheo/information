<template>
  <div>
    <div class="top">
      <div class="top-item">
        <span>会员名称</span>
        <Input style="width:200px"></Input>
      </div>
      <div class="top-item">
        <span>变更时间</span>
        <DatePicker
          :value="time"
          format="yyyy年MM月dd日"
          type="daterange"
          placement="bottom-end"
          placeholder="Select date"
          style="width: 200px"
        ></DatePicker>
      </div>
      <Button style="height:30px" type="success" icon="ios-search">搜索</Button>
    </div>
    <div class="content">
      <p>积分变更列表</p>
      <hr style="margin:20px 0;" color="#e9e9e9" />
      <Table border :columns="integralList" :data="integralData"></Table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      integralList: [
        {
          title: '会员ID'
        },
        {
          title: '会员名称'
        },
        {
          title: '账户积分余额'
        },
        {
          title: '使用积分累计'
        },
        {
          title: '获取积分累计'
        },
        {
          title: '失效积分累计'
        }
      ],
      integralData: [],
      time: ''
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
