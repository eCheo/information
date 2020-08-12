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
            <Button type="success" icon="ios-search">搜索</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <p class="tr-title">申请领域标签列表</p>
      <Table border :columns="authenticationList" :data="authenticationData.content"></Table>
      <Page style="margin-top:10px;float:right;" :page-size='15' :total="authenticationData.totalElements" @on-change='labelReviewPage' />
    </div>
  </div>
</template>

<script>
import {
  labelReviewPage,
  passOrNot
} from "@/api/data";
export default {
  name: 'count_to_page',
  data () {
    return {
      authenticationList: [
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
          key: 'memberId'
        },
        {
          title: '用户昵称',
          key: 'nickName'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '申请领域',
          render: (h, params) => {
            return h('span', {}, params.row.columnName + params.row.applyLabelType.message +'创作者')
          }
        },
        {
          title: '申请时间',
          key: 'applyDate'
        },
        {
          title: '发布内容',
          render: (h, params) => {
            return h('p', {
              style: {
                cursor: 'pointer',
                textDecoration: 'underline'
              },
              on: {
                click: () => {
                  
                }
              }
            }, '查看')
          }
        },
        {
          title: '审核状态',
          render: (h, params) => {
            return h('span', {}, params.row.auditStatusType.message)
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.passOrNot()
                  }
                }
              }, '通过'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.passOrNot()
                  }
                }
              }, '不通过')
            ])
          }
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
    },
    passOrNot() {
      passOrNot().then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('')
        } else {
          this.$Message.error(res.data.message);
        }
      })
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
