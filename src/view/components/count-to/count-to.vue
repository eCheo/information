<template>
  <div>
    <div class="tr-head">
      <p class="tr-title">审核筛选</p>
      <div class="tr-from">
        <div>
          <span>申请时间</span>
          <DatePicker
            v-model="selectTime"
            @on-change='changeDate'
            format="yyyy年MM月dd日"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </div>
        <div>
          <span>审核状态</span>
          <RadioGroup v-model="authenFrom.creatorAuditStatusType" type="button">
              <Radio label="">全部</Radio>
              <Radio label="PendingReview">等待审核</Radio>
              <Radio label="Adopt">审核通过</Radio>
              <Radio label="Fail">审核不通过</Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
          <span>申请领域</span>
          <RadioGroup v-model="authenFrom.applyLabelType" type="button">
              <Radio label="ApplyArticlesLabel">全部领域</Radio>
              <!-- <Radio label="ApplyVideoLabel">视频</Radio> -->
          </RadioGroup>
          <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="model1" style="width:200px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div style="margin-left:20px;display:inline-block;">
            <Input style="width:300px;"> </Input>
            <Button type="primary" icon="ios-search">搜索</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <p class="tr-title">申请领域标签列表</p>
      <Table border :columns="authenticationList" :data="authenticationData.content"></Table>
      <Page style="margin-top:10px;float:right;" :page-size='15' :total="authenticationData.totalElements" @on-change='findIntegral' />
    </div>
  </div>
</template>

<script>
import {
  labelReviewPage
} from "@/api/data";
export default {
  name: 'count_to_page',
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
          title: '发布内容',
          render: (h, params) => {
            return h('p', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  
                }
              }
            }, '查看')
          }
        },
        {
          title: '审核状态'
        },
        {
          title: '操作'
        }
      ],
      authenticationData: [],
      authenFrom: {
        startApplyDate: '',
        endApplyDate: '',
        creatorAuditStatusType: '',
        columnId: '',
        applyLabelType: '',
        queryValue: '',
        page: '1',
        size: '10'
      },
      selectTime: '',
      viodeList: [
        
      ]
    }
  },
  created() {
    this.labelReviewPage(1);
  },
  methods: {
    labelReviewPage(page) {
      this.authenFrom.page = page;
      labelReviewPage(this.authenFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.authenticationData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.authenFrom.startApplyDate = starTime.substring(0, starTime.length - 1)
      this.authenFrom.endApplyDate = endTime.substring(0, endTime.length - 1)
    }
  },
  mounted () {
  }
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
    height: 169px;
    box-shadow: 0px 1px 1px 0px #e9e9e9;
  .tr-from {
    display: flex;
    flex-wrap: wrap;
    width: 69%;
  }
}
</style>
