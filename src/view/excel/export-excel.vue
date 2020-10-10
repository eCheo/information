
<template>
  <div>
    <div class="kf-top">
      <ul class="kf-list">
        <li class="kf-item">
          <span>用户名字</span>
          <Input style="width:200px;"></Input>
        </li>
        <li class="kf-item">
          <span>选择时间</span>
          <DatePicker
            :transfer="true"
            v-model="selectTime"
            @on-change="changeDate"
            format="yyyy年MM月dd日"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </li>
        <li class="kf-item">
          <Button type="success">搜索</Button>
        </li>
      </ul>
    </div>
    <div class="kf-content">
      <p>全部评论</p>
      <div class="kf-acl">
        <ul class="kf-list">
          <li class="kf-item" :class="articleId === item.id ? 'kf-bg' : ''" v-for="(item,index) in articleList" :key="index" @click="articleId = item.id,findBackEndComment(1)">
            <p>{{item.title}}</p>
            <div style="margin-top:10px;">
              <span>{{item.pubDate}}</span>
              <span style="float:right;">{{item.commentCount}}评论</span>
            </div>
          </li>
          <li style="padding: 20px; text-align: center;">
            <Page :page-size='6' :current='page' :total="total" simple @on-change='findBackEndArticle' />
          </li>
        </ul>
        <div v-if="commentList.content.length > 0 && articleId !== ''" style="width:100%;">
          <div class="ex-pl" v-for="(item,index) in commentList.content" :key="index">
            <div>
              <img class="ex-img" :src="item.headImgPath" />
            </div>
            <div class="ex-ct" >
              <p>{{item.nickName}}</p>
              <p>{{item.content}}</p>
              <p>{{item.commentDate}}</p>
            </div>
            <div class="ex-hf">
              <Button type="success" @click="replay(item, 'Reply')">回复</Button>
            </div>
            <div class="ex-more" v-if="item.replyCount > 0">
              <p>当前有<span style="color:#19be6b;">{{item.replyCount}}条</span>回复<span style='cursor:pointer;color:#2d8cf0;' @click="commentInfo = item,findBackEndReplyList(1)">点击查看详情</span></p>
            </div>
          </div>
          <div style="text-align:right;margin-top:20px;">
            <Page :current='commentPage' :page-size='6' :total="commentList.totalElements" simple @on-change='findBackEndComment' />
          </div>
        </div>
        <div class="no-data" v-else-if="commentList.content.length === 0 && articleId !== ''">
          <p>暂无评论</p>
        </div>
      </div>
    </div>
    <Modal v-model="modalShow" :mask-closable='false'>
      <p>回复{{nickName}}</p>
      <Input v-model="replayContent" :maxlength="500" show-word-limit type="textarea" style="width: 200px" />
      <Button type="success" @click="articlesCommentOrReplay">回复</Button>
      <div slot="footer">
        
      </div>
    </Modal>
    <Modal v-model="moreModal" :mask-closable='false' title="回复详情">
      <div class="ex-box">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div class="ex-pl">
          <div>
                <img class="ex-img" :src="commentInfo.headImgPath" />
            </div>
            <div class="ex-ct" style="width:auto;">
                <p>{{commentInfo.nickName}}</p>
                <p>{{commentInfo.content}}</p>
                <p>{{commentInfo.commentDate}}</p>
            </div>
          </div>
        <div class="ex-hhf" style="width:100%;" v-for="(it, index) in replySonList.content" :key="index">
                <span v-if="!it.replyBackEndMemberDto">
                  {{it.memberBackEndDto.nickName}}：{{it.content}}
                </span>
                <span v-else>
                  {{it.memberBackEndDto.nickName}}<a style="color:#05b55c;">回复</a>{{it.replyBackEndMemberDto.nickName}}：{{it.content}}
                </span>
                <Button style="float:right" type="success" @click="replay(it, 'ReplyReply')">回复</Button>
        </div>
      </div>
      <div slot="footer">
        <div style="text-align:right;margin-top:20px;">
            <Page :current='replySonPage' :page-size='6' :total="replySonList.totalElements" simple @on-change='findBackEndReplyList' />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { findBackEndComment, findBackEndArticle, articlesCommentOrReplay, findBackEndReplyList} from "@/api/data";
export default {
  data() {
    return {
      selectTime: "",
      commentList: {
        content: []
      },
      articleList: {},
      replySonList: {},
      articleId: '',
      total: 0,
      page: 1,
      modalShow: false,
      nickName: '',
      replayOneInfo: {},
      replayContent: '',
      commentId: '',
      commentPage: 1,
      moreModal: false,
      spinShow: false,
      replySonPage: 1,
      commentInfo: {}
    };
  },
  created() {
    this.findBackEndArticle(1);
  },
  methods: {
    changeDate(date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, "-");
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, "-");
      this.userFrom.startTime = starTime.substring(0, starTime.length - 1);
      this.userFrom.endTime = endTime.substring(0, endTime.length - 1);
    },
    // 查询文章评论
    findBackEndComment(page) {
      this.commentPage = page;
      let params = {
        page: page,
        size: "5",
        articlesId: this.articleId
      };
      findBackEndComment(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.commentList = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    // 查询文章
    findBackEndArticle(page) {
      this.page = page;
      let params = {
        page: page,
        size: "6",
        EQ_isDelete: 'false',
        EQ_groundingType: 'Grounding'
      };
      findBackEndArticle(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.articleList = res.data.data.content;
          this.total = res.data.data.totalElements;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    articlesCommentOrReplay() {
      let params = {
        articlesId: this.articleId,
        content: this.replayContent,
        type: this.replayOneInfo.type,
        commentId: this.replayOneInfo.id
      }
      articlesCommentOrReplay(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('回复成功');
          this.findBackEndComment(this.commentPage, this.articleId);
          if (this.moreModal) {
            this.findBackEndReplyList(1);
          }
          this.modalShow = false;
        } else {
          this.$Message.error(res.data.message);
          this.modalShow = false;
        }
      })
    },
    // 查询子评论
    findBackEndReplyList(page) {
      this.moreModal = true;
      this.spinShow = true;
      // this.commentId = this.commentInfo.id;
      this.replySonPage = page;
      let params = {
        page: this.replySonPage,
        size: '5',
        EQ_parentId: this.commentInfo.id
      }
      findBackEndReplyList(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.replySonList = res.data.data;
          this.spinShow = false;
        } else {
          this.$Message.error(res.data.message);
          this.spinShow = false;
        }
      })
    },
    replay(item, type) {
      this.modalShow = true;
      this.replayContent = '';
      this.replayOneInfo = item;
      this.replayOneInfo.type = type;
      this.nickName = type === 'ReplyReply' &&  item.replyBackEndMemberDto.nickName ? item.memberBackEndDto.nickName : item.nickName;
    }
  }
};
</script>

<style lang="less" scoped>
.kf-top {
  padding: 20px;
  background: #fff;

.kf-list {
  .kf-item {
    list-style: none;
    display: inline-block;
    margin-right: 20px;
    span {
      margin-right: 10px;
    }
  }
}
}
.kf-tab {
  background-color: #fff;
  margin-top: 20px;
  padding: 15px;
}
.kf-content {
  background-color: #fff;
  padding: 20px;
  margin-top: 30px;
}
.kf-acl {
  display: flex;
  .kf-list {
    width: 265px;
    list-style: none;
    .kf-item {
      width: inherit;
      padding: 30px 15px;
      border: 1px solid #e9e9e9;
      cursor: pointer;
      p {
        font-size: 16px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        color: #666666;
      }
    }
    .kf-bg {
      background-color: #e9e9e9;
    }
    .kf-item:hover {
      background-color: #e9e9e9;
    }
  }
}
.no-data {
    margin: 46px 0 0 20px;
    text-align: center;
    font-size: 16px;
}
.ex-pl {
  display: flex;
  padding: 5px 20px 15px 20px;
  border: 1px solid #e9e9e9;
  flex-wrap: wrap;
  .ex-img {
      border-radius: 50%;
      width: 58px;
      height: 58px;
  }
  .ex-ct {
    font-size: 14px;
    width: 87%;
    margin-left: 15px;
    p {
      color: #666666;
    }
    p:nth-child(2) {
      color: #333333;
    }
  }
  .ex-hf {
    line-height: 69px;
  }
  .ex-more {
    width: 100%;
    text-align: center;
    font-size: 14px;
  }
}
.ex-box {
  position: relative;
}
 .ex-hhf {
    padding: 10px 36px 20px 0;
    color: #666666;
    margin:0 0 15px 0;
    border-bottom: 1px solid #e9e9e9;
  }
</style>
