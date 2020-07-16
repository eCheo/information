<template>
  <div>
    <div class="tr-head">
      <p class="tr-title">筛选</p>
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
              <Radio label="PublishArticle">文章</Radio>
              <Radio label="PublishVideo">视频</Radio>
              <Radio label="BrokeTheNews">爆料</Radio>
              <Radio label="Topic">话题</Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
         <Input v-model="authenticationFrom.queryValue" style="width:300px;"> </Input>
        <Button type="primary" icon="ios-search">搜索</Button>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <div style="height:50px;line-height: 50px;">
        <span class="tr-title">文章列表</span>
        <Button style="float:right;" type="success" @click="$router.push({path:'/components/drag/addArticle', query:{type: releaseType}})" v-if="releaseType !== 'BrokeTheNews'">{{releaseBtText}}</Button>
      </div>
      <Table border :columns="authenticationList" :loading='tableLoading' :data="authenticationData.content"></Table>
      <Page style="margin-top:10px;float:right;" :page-size='15' :total="authenticationData.totalElements" @on-change='findArticlesResult' />
    </div>
  </div>
</template>
<script>
import { findArticlesResult, setGroundingType, deleteArticles } from '@/api/data'
export default {
  name: 'drag_list_page',
  // components: {
  //   DragList
  // },
  data () {
    return {
      authenticationList: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '封面',
          render: (h, params) => {
            if (params.row.videoImagePath) {
              return h('img', {
                    style: {
                      maxWidth: '150px'
                    },
                    attrs: {
                      src: params.row.videoImagePath
                    }
                    })
            } else {
              return h('img', {
                    style: {
                      maxWidth: '150px'
                    },
                    attrs: {
                      src: params.row.imagePaths[0]
                    }
                  })
            }
          }
        },
        {
          title: '发布人(昵称)',
          key: 'nickName'
        },
        {
          title: '发布类型',
          render: (h, params) => {
            switch (this.releaseType){
              case 'PublishArticle':
                return h('span', {}, '文章');
                break
              case 'PublishVideo':
                return h('span', {}, '视频');
                break
              case 'BrokeTheNews':
                return h('span', {}, '爆料');
                break
              case 'Topic':
                return h('span', {}, '话题');
                break
              default:
               return h('span', {}, '--')
               break
            }
          }
        },
        {
          title: '栏目类型',
          key: 'columnName'
        },
        {
          title: '发布时间',
          key: 'pubDate'
        },
        {
          title: '审核状态'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {}, '编辑'),
              h('Button', {
                on: {
                  click: () => {
                    this.deleteArticles(params.row.id)
                  }
                }
              }, '删除'),
              h('Button', {
                on: {
                  click: () => {
                    this.setGroundingType(params.row.id)
                  }
                }
              }, params.row.groundingType.name === 'Dismount' ? '上架' : '下架')
            ])
          }
        }
      ],
      authenticationData: [],
      selectTime: '',
      auditStatus: '全部',
      releaseType: 'PublishArticle',
      releaseBtText: '发布文章',
      authenticationFrom: {
        startDate: '',
        endDate: '',
        type: 'PublishArticle',
        queryValue: '',
        page: '1',
        size: '15'
      }
    }
  },
  created() {
    this.findArticlesResult(1)
  },
  methods: {
    releaseTypeChange (label) {
      if (label === 'PublishArticle') {
        this.releaseBtText = '发布文章'
      } else if (label === 'PublishVideo') {
        this.releaseBtText = '发布视频'
      } else if (label === 'Topic') {
        this.releaseBtText = '发布话题'
      }
      this.authenticationFrom.type = label;
      this.findArticlesResult(1);
    },
    findArticlesResult(page) {
      this.authenticationFrom.page = page;
      this.tableLoading = true;
      findArticlesResult(this.authenticationFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.authenticationData = res.data.data;
          this.tableLoading = false;
        } else {
          this.$Message.error(res.data.message);
          this.tableLoading = false;
        }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.authenticationFrom.startDate = starTime.substring(0, starTime.length - 1)
      this.authenticationFrom.endDate = endTime.substring(0, endTime.length - 1)
    },
    setGroundingType(row) {
      let params = {
        groundingType: row.groundingType.name === 'Dismount' ? 'Grounding' : 'Dismount',
        id: row.id
      }
      setGroundingType(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('上架成功');
          this.findArticlesResult(1);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    deleteArticles(id) {
      deleteArticles({id: id}).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('删除成功');
          this.findArticlesResult(1);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  },
  mounted () {}
}
</script>
<style lang="less">

</style>
