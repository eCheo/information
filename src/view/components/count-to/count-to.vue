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
              <Radio label="北京"></Radio>
              <Radio label="上海"></Radio>
              <Radio label="深圳"></Radio>
              <Radio label="杭州"></Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
          <span>申请领域</span>
          <RadioGroup v-model="releaseType" type="button">
              <Radio label="北京"></Radio>
          </RadioGroup>
          <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="margin-top:20px;">
         <Input style="width:300px;"> </Input>
        <Button type="primary" icon="ios-search">搜索</Button>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <p class="tr-title">申请领域标签列表</p>
      <Table border :columns="authenticationList" :data="authenticationData"></Table>
    </div>
  </div>
</template>

<script>
import CountTo from '_c/count-to'
export default {
  name: 'count_to_page',
  components: {
    CountTo
  },
  data () {
    return {
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
          title: '申请领域'
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
  methods: {},
  mounted () {
  }
}
</script>

<style lang="less" scoped>
</style>
