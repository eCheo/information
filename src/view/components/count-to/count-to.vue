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
        <div style="margin-left:20px;">
          <span>审核状态</span>
          <RadioGroup v-model="authenFrom.creatorAuditStatusType" type="button" @on-change='releaseTypeChange'>
              <Radio label="">全部</Radio>
              <Radio label="PendingReview">等待审核</Radio>
              <Radio label="Adopt">审核通过</Radio>
              <Radio label="Fail">审核不通过</Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
          <span>申请领域</span>
          <Select v-model="authenFrom.applyLabelType" style="width:200px;margin:0 20px;">
              <Option v-for="item in articlesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="authenFrom.columnId" style="width:200px">
              <Option v-for="item in conditionList" :value="item.id" :key="item.name">{{ item.name }}</Option>
          </Select>
          <div style="margin-left:20px;display:inline-block;">
            <Input v-model="authenFrom.queryValue" style="width:300px;margin-right:10px;" placeholder="请输入用户ID、昵称、手机号" </Input>
            <Button type="success" icon="ios-search" @click="labelReviewPage(1)">搜索</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <p class="tr-title">申请领域标签列表</p>
      <Table border :loading='tabLoading' :columns="authenticationList" :data="authenticationData.content"></Table>
      <div style="text-align:right;">
         <Page style="margin-top:10px;" :page-size='10' :total="authenticationData.totalElements" @on-change='labelReviewPage' />
      </div>
    </div>
     <Modal
        title="提示"
        v-model="noPass"
        >
        <Input type="textarea" v-model="reason" placeholder="请输入不通过的原因"></Input>
        <div slot="footer">
          <Button type="text" @click='noPass = false'>取消</Button>
          <Button type="success" @click="passOrNot('Fail'),noPass = false" :disabled="reason === '' ? true : false">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import {
  labelReviewPage,
  passOrNot,
  findArticles
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
                  this.$router.push({path: '/components/count/countdetails', query: {id: params.row.id, mId: params.row.memberId}})
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
          width: 200,
          render: (h, params) => {
            let dis = params.row.auditStatusType.code === 'Fail' || params.row.auditStatusType.code === 'Adopt';
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  disabled: dis
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.id = params.row.id;
                    this.$Modal.info({
                      title: '提示',
                      content:'是否通过该用户申请的领域标签？',
                      onOk: () =>{
                        this.passOrNot('Adopt');
                      }
                    })
                  }
                }
              }, '通过'),
              h('Button', {
                props: {
                  type: 'error',
                  disabled: dis
                },
                on: {
                  click: () => {
                    this.id = params.row.id;
                    this.noPass = true;
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
      viodeList: [],
      noPass: false,
      reason: '',
      id: '',
      tabLoading: false,
      btLoading: false,
      articlesList: [
        {
          label: '文章',
          value: 'ApplyArticlesLabel'
        },
        {
          label: '视频',
          value: 'ApplyVideoLabel'
        }
      ],
      conditionList: []
    }
  },
  created() {
    this.labelReviewPage(1);
    this.getCondition();
  },
  methods: {
    releaseTypeChange(label) {
      this.authenFrom.creatorAuditStatusType = label;
      this.labelReviewPage(1);
    },
    labelReviewPage(page) {
      this.authenFrom.page = page;
      this.tabLoading = true;
      labelReviewPage(this.authenFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.authenticationData = res.data.data;
          this.tabLoading = false;
        } else {
          this.$Message.error(res.data.message);
          this.tabLoading = false;
        }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.authenFrom.startApplyDate = starTime.substring(0, starTime.length - 1)
      this.authenFrom.endApplyDate = endTime.substring(0, endTime.length - 1)
    },
    passOrNot(val) {
      let params = {
          id: this.id,
          creatorAuditStatusType: val
      };
      if (val === 'Fail') {
        params = {
          reason: this.reason,
          id: this.id,
          creatorAuditStatusType: val
        }
      }
      passOrNot(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          if (val === 'Fail') { 
            this.$Message.success('该用户申请创作者领域已驳回');
          } else {
            this.$Message.success('该用户申请创作者领域通过成功');
          }
          this.labelReviewPage(1);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    getCondition () {
      findArticles().then(res => {
        if (res.data.code === '200') {
          this.conditionList = res.data.data
        }
      })
    },
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
