<template>
  <div>
    <div class="tr-head">
      <p class="tr-title">筛选</p>
      <div class="tr-from">
        <div style="margin-top:20px;">
          <span style="margin-right:10px;">发布类型</span>
          <RadioGroup v-model="releaseType" type="button" @on-change="releaseTypeChange">
            <Radio label="PublishArticle">文章</Radio>
            <Radio label="PublishVideo">视频</Radio>
            <Radio label="BrokeTheNews" v-if="$store.state.user.menberType === 'backend'">爆料</Radio>
            <Radio label="Topic" v-if="$store.state.user.menberType === 'backend'">话题</Radio>
          </RadioGroup>
        </div>
        <div style="margin-top:20px;">
          <Input placeholder="请输入关键字，标题" v-model="authenticationFrom.queryValue" style="width:300px;"></Input>
          <Button style="margin-left:10px;" type="success" icon="ios-search" @click="findArticlesResult(1)">搜索</Button>
        </div>
      </div>
    </div>
    <div class="tr-content">
      <div style="height:50px;line-height: 50px;">
        <span class="tr-title">文章列表</span>
        <Button
          style="float:right;"
          type="success"
          @click="$router.push({path:'/components/drag/addArticle', query:{type: releaseType}})"
          v-if="releaseType !== 'BrokeTheNews' && releaseType !== 'Topic'"
        >{{releaseBtText}}</Button>
        <Button
          style="float:right;"
          type="success"
          @click="$router.push({path:'/components/drag/addArticle', query:{type: releaseType}})"
          v-if="$store.state.user.menberType === 'backend' && releaseType === 'Topic'"
        >发布话题</Button>
      </div>
      <Table border :columns="authenticationList" :loading='tableLoading' :data="authenticationData.content"></Table>
      <div style="text-align:right;">
        <Page style="margin-top:10px;" :page-size='10' :current='authenticationFrom.page' :total="authenticationData.totalElements" @on-change='findArticlesResult' />
      </div>
    </div>
  </div>
</template>
<script>
import {
  findArticlesResult,
  setGroundingType,
  deleteArticles,
  informationExamine,
  cancelArticlesTop,
  setArticlesTop,
  pushAll
} from "@/api/data";
// import $store from 'vuex'
export default {
  name: "drag_list_page",
  // components: {
  //   DragList
  // },
  data() {
    return {
      authenticationList: [
        {
          title: "标题",
          key: "title",
          render: (h, params)=> {
            return h('div', {
              style: {
                cursor: this.releaseType === 'BrokeTheNews' ? 'pointer' :''
              },
              on: {
                click: () => {
                  if (this.releaseType !== 'BrokeTheNews') return;
                  this.$router.push({path:'/components/drag/addArticle', query:{type: this.releaseType, id: params.row.id}})
                }
              }
            }, params.row.title)
          }
        },
        {
          title: "封面",
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
          title: "发布人(昵称)",
          key: "nickName"
        },
        {
          title: "发布类型",
          render: (h, params) => {
            switch (this.releaseType) {
              case "PublishArticle":
                return h("span", {}, "文章");
                break;
              case "PublishVideo":
                return h("span", {}, "视频");
                break;
              case "BrokeTheNews":
                return h("span", {}, "爆料");
                break;
              case "Topic":
                return h("span", {}, "话题");
                break;
              default:
                return h("span", {}, "--");
                break;
            }
          }
        },
        {
          title: "栏目类型",
          key: "columnName",
          render: (h, params) => {
            return h('p', {}, params.row.columnName === null ? '---' : params.row.columnName)
          }
        },
        {
          title: "发布时间",
          key: "pubDate"
        },
        {
          title: "审核状态",
          key: 'status',
          render: (h, params) => {
            return h('p', {}, params.row.status === null ? '---' : params.row.status.message)
          }
        },
        {
          title: '是否置顶',
          key: 'whetherTop',
          render: (h, params) => {
            let te = params.row.whetherTop ? '是':'否';
            let text = this.releaseType === 'PublishArticle' ? te : '---';
            return h('p', {}, text)
          }
        },
        {
          title: "操作",
          width: 250,
          render: (h, params) => {
            if (this.releaseType === 'BrokeTheNews') {
              let isDis = params.row.status.name === 'Approved' || params.row.status.name === 'AuditFailed';
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    disabled: isDis
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.informationExamine(params.row, 'Approved');
                    }
                  }
                }, '通过'),
                h('Button', {
                  props: {
                    type: 'error',
                    disabled: isDis
                  },
                  on: {
                    click: () => {
                      this.informationExamine(params.row, 'AuditFailed');
                    }
                  }
                }, '不通过')
              ])
            } else {
            return h("div", {
              style: {
                padding: '5px 0'
              }
            }, [
              h("Button", {
                props: {
                  type: 'success'
                },
                on: {
                  click: () => {
                    this.$router.push({path:'/components/drag/addArticle', query:{type: this.releaseType, id: params.row.id}})
                  }
                }
              }, "编辑"),
              h(
                "Button",
                {
                  style: {
                    margin: '0 10px',
                    display: this.$store.state.user.menberType === 'front' ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      let text = this.releaseType === 'PublishArticle' ? '文章' : this.releaseType === 'PublishVideo' ? '视频' : '话题' 
                      this.$Modal.confirm({
                        title: '提示',
                        content: `是否要删除该${text}？`,
                        onOk: () => {
                          this.deleteArticles(params.row.id);
                        }
                      })
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    loading: params.row.loading,
                    type: 'error'
                  },
                  style: {
                    display: this.$store.state.user.menberType === 'front' ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.setGroundingType(params.row);
                    }
                  }
                },
                params.row.groundingType.name === "Dismount" ? "上架" : "下架"
              ),
              h(
                "Button",
                {
                  props: {
                    loading: params.row.loading,
                    type: 'success',
                    disabled: params.row.isPushAll || params.row.groundingType.name === "Dismount"
                  },
                  style: {
                    display: (this.releaseType !== 'PublishArticle' && this.releaseType !== 'PublishVideo') || this.$store.state.user.menberType === 'front' ? 'none' : 'inline-block',
                    marginRight: '10px',
                    marginTop: this.releaseType === 'PublishVideo' ? '10px' : '0'                    
                  },
                  on: {
                    click: () => {
                      this.pushAll(params.row);
                    }
                  }
                }, '推送'),
              h('div', {
                  style: {
                    display: this.releaseType === 'PublishArticle' ? 'inline-block' : 'none',
                    marginTop: '10px'
                  }
                },[
                h(
                "Button",
                {
                  props: {
                    loading: params.row.loading,
                    type: 'success',
                    disabled: params.row.whetherTop
                  },
                  style: {
                    marginRight: '10px',
                    display: this.$store.state.user.menberType === 'front' ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.setArticlesTop(params.row.id);
                    }
                  }
                }, '置顶'),
                h(
                "Button",
                {
                  props: {
                    loading: params.row.loading,
                    type: 'error',
                    disabled: !params.row.whetherTop
                  },
                  style: {
                    display: this.$store.state.user.menberType === 'front' ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.cancelArticlesTop(params.row.id);
                    }
                  }
                }, '取消置顶')
              ])
            ]);
            }
          }
        }
      ],
      authenticationData: [],
      selectTime: "",
      releaseType: "PublishArticle",
      releaseBtText: "发布文章",
      authenticationFrom: {
        startDate: "",
        endDate: "",
        type: "PublishArticle",
        queryValue: "",
        page: 1,
        size: "10"
      },
      tableLoading: false
    };
  },
  created() {
    this.findArticlesResult(1);
  },
  methods: {
    releaseTypeChange(label) {
      if (label === "PublishArticle") {
        this.releaseBtText = "发布文章";
      } else if (label === "PublishVideo") {
        this.releaseBtText = "发布视频";
      } else if (label === "Topic") {
        this.releaseBtText = "发布话题";
      }
      this.authenticationFrom.type = label;
      this.findArticlesResult(1);
    },
    findArticlesResult(page) {
      this.authenticationFrom.page = page;
      this.tableLoading = true;
      findArticlesResult(this.authenticationFrom).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.authenticationData = res.data.data;
          this.tableLoading = false;
        } else {
          this.$Message.error(res.data.message);
          this.tableLoading = false;
        }
      });
    },
    changeDate(date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, "-");
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, "-");
      this.authenticationFrom.startDate = starTime.substring(
        0,
        starTime.length - 1
      );
      this.authenticationFrom.endDate = endTime.substring(
        0,
        endTime.length - 1
      );
    },
    setGroundingType(row) {
      let params = {
        groundingType:
          row.groundingType.name === "Dismount" ? "Grounding" : "Dismount",
        id: row.id
      };
      this.$set(row, 'loading', true);
      setGroundingType(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          if (row.groundingType.name === "Dismount") {
            this.$Message.success("上架成功");
          } else {
            this.$Message.success("下架成功");
          }
          this.$set(row, 'loading', false);
          this.findArticlesResult(1);
        } else {
          this.$set(row, 'loading', false);
          this.$Message.error(res.data.message);
        }
      });
    },
    deleteArticles(id) {
      deleteArticles({ id: id }).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.$Message.success("删除成功");
          this.findArticlesResult(this.authenticationFrom.page);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    informationExamine(row, status) {
      let params = {
        id: row.id,
        status: status
      }
      informationExamine(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          if (status === 'Approved') {
            this.$Message.success('爆料通过成功');
          } else {
            this.$Message.success('爆料拒绝成功');
          }
            this.findArticlesResult(this.authenticationFrom.page);
        } else {  
          this.$Message.error(res.data.message);
        }
      })
    },
    setArticlesTop(id) {
      let params = {
        id: id
      }
      setArticlesTop(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('置顶成功');
          this.findArticlesResult(this.authenticationFrom.page);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    cancelArticlesTop(id) {
      let params = {
        id: id
      }
      cancelArticlesTop(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('取消置顶成功');
          this.findArticlesResult(this.authenticationFrom.page);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    pushAll(data) {
      let params = {
        isPushAll: !data.isPushAll,
        id: data.id
      }
      pushAll(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('推送成功');
          this.findArticlesResult(this.authenticationFrom.page);
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  },
  mounted() {},
  watch: {
    '$route': {
      handler(val, onl) {
        this.findArticlesResult(1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tr-head {
    height: 169px;
    box-shadow: 0px 1px 1px 0px #e9e9e9;
    padding: 20px;
    background-color: #fff;
  .tr-from {
    display: flex;
    flex-wrap: wrap;
    width: 69%;
    >div {
      width: 400px;
    }
  }
}
.tr-title {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 20px;
}

.tr-content {
  background-color: #fff;
  margin-top: 20px;
  padding:0 20px;
}
</style>
