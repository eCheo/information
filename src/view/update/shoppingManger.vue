<template>
  <div>
    <div class="top">
      <p>筛选</p>
      <div class="top-box">
        <div class="top-item">
          <span>商品ID</span>
          <Input style="width:200px"></Input>
        </div>
        <div class="top-item">
          <span>商品名称</span>
          <Input style="width:200px"></Input>
        </div>
        <div class="top-item">
          <span>有效期</span>
          <DatePicker
            :value="time"
            format="yyyy年MM月dd日"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </div>
        <div class="top-item">
          <span>上架状态</span>
          <Select v-model="upStatus" style="width:200px">
            <Option
              v-for="item in upStatusList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <Button style="height:30px" type="success" icon="ios-search">搜索</Button>
      </div>
    </div>
    <div class="content">
      <p>商品列表</p>
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
          title: '商品ID'
        },
        {
          title: '商品名称'
        },
        {
          title: '兑换积分'
        },
        {
          title: '库存数量'
        },
        {
          title: '商品成本'
        },
        {
          title: '有效期'
        },
        {
          title: '上架状态'
        },
        {
          title: '操作'
        }
      ],
      integralData: [],
      time: '',
      upStatus: '',
      upStatusList: []
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  background: #fff;
  padding: 20px;
  .top-box {
    display: flex;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    background: #fff;
  }
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
