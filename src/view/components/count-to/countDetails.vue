<template>
  <div>
    <div>
      <div class="ct-top">
        <div style="text-align:right;">
        <Button @click="handleCloseTag">返回</Button>
      </div>
        <div class="ct-box">
          <div>
            <img :src="userInfo.memberDto.headImgPath" />
          </div>
          <div style="margin-left:10px;">
            <p>{{userInfo.memberDto.nickName}}</p>
            <p>{{userInfo.applyDate}}(申请时间)</p>
          </div>
        </div>
        <div>
          <p style="text-align:right;font-size:14px;">审核时间:{{userInfo.auditDate}}</p>
          <div>
            <ul class="th-list">
              <li class="th-item">用户ID</li>
              <li class="th-item">手机号</li>
              <li class="th-item">申请领域</li>
              <li class="th-item">审核状态</li>
            </ul>
            <ul class="td-list">
              <li class="td-item">{{userInfo.memberDto.memberId || '---'}}</li>
              <li class="td-item">{{userInfo.memberDto.phone}}</li>
              <li class="td-item">{{userInfo.columnName}}</li>
              <li class="td-item">{{userInfo.auditStatusType.message}}</li>
            </ul>
          </div>
          <div style="text-align:center;margin-top:20px;">
            <Button type="success" :disabled="isDis" @click="passOrNot('Adopt')">通过</Button>
            <Button
              type="error"
              :disabled="isDis"
              @click="resonModal = true"
              style="margin-left:10px;"
            >不通过</Button>
          </div>
        </div>
      </div>
      <div class="ct-contnet">
        <p style="font-size:16px;margin-bottom:20px">发布列表</p>
        <Table
          border
          :loading="tabLoading"
          :columns="authenticationList"
          :data="authenticationData.content"
        ></Table>
        <div style="text-align:right;">
          <Page
            style="margin-top:10px;"
            :page-size="10"
            :current="page"
            :total="authenticationData.totalElements"
            @on-change="findBackEndArticlesPageByCondition"
          />
        </div>
      </div>
    </div>
    <router-view></router-view>
    <Modal v-model="resonModal" :mask-closable="false" title="拒绝原因">
      <Input type="textarea" v-model="reason" :row="4" placeholder="请输入拒绝原因"></Input>
      <div slot="footer">
        <Button type="text" @click="resonModal = false">取消</Button>
        <Button type="success" @click="passOrNot('Fail')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  findMemberLabelReviewById,
  findBackEndArticlesPageByCondition,
  passOrNot
} from "@/api/data";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      userInfo: {},
      authenticationList: [
        {
          title: "类型",
          render: (h, params) => {
            return h("p", {}, params.row.type.message);
          }
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "封面",
          render: (h, params) => {
            if (
              params.row.videoImagePath !== null &&
              params.row.type.name === "PublishVideo"
            ) {
              return h("img", {
                style: {
                  maxWidth: "150px"
                },
                attrs: {
                  src: params.row.videoImagePath
                }
              });
            } else if (
              params.row.imagePaths !== null &&
              params.row.type.name === "PublishArticle"
            ) {
              return h("img", {
                style: {
                  maxWidth: "150px"
                },
                attrs: {
                  src: params.row.imagePaths[0]
                }
              });
            } else {
              return h("p", {}, "---");
            }
          }
        },
        {
          title: "发布时间",
          key: "pubDate"
        },
        {
          title: "发布内容",
          render: (h, params) => {
            return h(
              "p",
              {
                style: {
                  cursor: "pointer",
                  textDecoration: "underline"
                },
                on: {
                    click: () => {
                        this.$router.push('/components/count/acldetails');
                        sessionStorage.setItem('titleObj', JSON.stringify(params.row))
                    }
                }
              },
              "查看详情"
            );
          }
        }
      ],
      authenticationData: [],
      tabLoading: false,
      page: 1,
      resonModal: false,
      reason: ""
    };
  },
  created() {
    this.findMemberLabelReviewById();
    this.findBackEndArticlesPageByCondition(1);
  },
  methods: {
    ...mapMutations(["closeTag"]),
    handleCloseTag() {
      let route = {
        meta: this.$route.meta,
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      };
      this.closeTag(route);
      this.$router.push("/components/count/count_to_page");
    },
    findMemberLabelReviewById() {
      let params = {
        id: this.$route.query.id
      };
      findMemberLabelReviewById(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.userInfo = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    findBackEndArticlesPageByCondition(page) {
      this.page = page;
      let params = {
        EQ_memberId: this.$route.query.mId,
        size: "10",
        page: page,
        sort: "pubDate,desc",
        EQ_isDelete: "false",
        IN_type: "PublishArticle,PublishVideo"
      };
      this.tabLoading = true;
      findBackEndArticlesPageByCondition(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.authenticationData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
        this.tabLoading = false;
      });
    },
    passOrNot(val) {
      let params = {
        id: this.$route.query.id,
        creatorAuditStatusType: val
      };
      if (val === "Fail") {
        params = {
          reason: this.reason,
          id: this.$route.query.id,
          creatorAuditStatusType: val
        };
      }
      passOrNot(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          if (val === "Fail") {
            this.$Message.success("该用户申请创作者领域已驳回");
          } else {
            this.$Message.success("该用户申请创作者领域通过成功");
          }
          this.labelReviewPage(1);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  },
  computed: {
    isDis() {
      return (
        this.userInfo.auditStatusType.name === "Adopt" ||
        this.userInfo.auditStatusType.name === "Fail"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.ct-top {
  background: #fff;
  padding: 20px;
  .ct-box {
    display: flex;
    justify-content: start;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 20px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    p {
      font-size: 16px;
    }
  }
}
.ct-contnet {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
}
ul li {
  list-style: none;
}
.th-list {
  background: #e9e9e9;
  width: 100%;
  margin: 0;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  .th-item {
    padding: 20px;
    min-width: 150px;
    box-sizing: border-box;
  }
}
.td-list {
  width: 100%;
  margin: 0;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  border-left: 1px solid #e9e9e9;
  .td-item {
    padding: 20px;
    min-width: 150px;
    box-sizing: border-box;
  }
}
</style>