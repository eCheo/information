<template>
  <div>
    <div class="tr-head">
      <p class="tr-title">筛选</p>
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
          <RadioGroup v-model="releaseType" type="button" @on-change='releaseTypeChange'>
              <Radio label="文章"></Radio>
              <Radio label="视频"></Radio>
              <Radio label="爆料"></Radio>
              <Radio label="话题"></Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
         <Input style="width:300px;"> </Input>
        <Button type="primary" icon="ios-search">搜索</Button>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <div style="height:50px;line-height: 50px;">
        <span class="tr-title">文章列表</span>
        <Button style="float:right;" type="success" @click="$router.push({path:'/components/drag/addArticle', query:{type: queryType}})" v-if="releaseType !== '爆料'">{{releaseBtText}}</Button>
      </div>
      <Table border :columns="authenticationList" :data="authenticationData"></Table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'drag_list_page',
  // components: {
  //   DragList
  // },
  data () {
    return {
      authenticationList: [],
      authenticationData: [],
      selectTime: '',
      auditStatus: '全部',
      releaseType: '文章',
      releaseBtText: '发布文章',
      queryType: 'wz'
    }
  },
  methods: {
    releaseTypeChange (label) {
      if (label === '文章') {
        this.queryType = 'wz'
        this.releaseBtText = '发布文章'
      } else if (label === '视频') {
        this.queryType = 'sp'
        this.releaseBtText = '发布视频'
      } else if (label === '话题') {
        this.queryType = 'ht'
        this.releaseBtText = '发布话题'
      }
    }
  },
  mounted () {}
}
</script>
<style lang="less">

</style>
