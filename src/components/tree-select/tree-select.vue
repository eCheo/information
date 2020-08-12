<template>
  <div>
    <div class="tr-head">
      <p class="tr-title">审核筛选</p>
      <div class="tr-from">
        <div>
          <span>申请时间</span>
          <DatePicker
            v-model="selectTime"
            format="yyyy年MM月dd日"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </div>
        <div>
          <span>审核状态</span>
          <RadioGroup v-model="auditStatus" type="button">
            <Radio label="全部"></Radio>
            <Radio label="等待审核"></Radio>
            <Radio label="审核通过"></Radio>
            <Radio label="审核不通过"></Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
          <span>发布类型</span>
          <RadioGroup v-model="releaseType" type="button">
              <Radio label="全部">全部</Radio>
              <Radio label="PublishArticle">文章</Radio>
              <Radio label="PublishVideo">视频</Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
         <Input style="width:300px;"> </Input>
        <Button type="success" icon="ios-search" style="margin-left:10px;">搜索</Button>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <p class="tr-title">申请认证列表</p>
      <Table border :columns="authenticationList" :data="authenticationData"></Table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TreeSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    loadData: Function
  },
  data () {
    return {
      selectTime: '',
      auditStatus: '',
      releaseType: '',
      authenticationList: [
        {
          title: '头像'
        },
        {
          title: '用户ID'
        },
        {
          title: '用户昵称'
        },
        {
          title: '手机号'
        },
        {
          title: '发布类型'
        },
        {
          title: '申请时间'
        },
        {
          title: '发布内容'
        },
        {
          title: '审核状态'
        },
        {
          title: '操作'
        }
      ],
      authenticationData: []
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.tr-title {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 20px;
}
.tr-head {
    background-color: #fff;
    height: 169px;
    box-shadow: 0px 1px 1px 0px #e9e9e9;
    padding: 20px;
  .tr-from {
    display: flex;
    flex-wrap: wrap;
    width: 69%;
  }
}
.tr-content {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;
}
</style>
