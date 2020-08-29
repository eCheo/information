
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
          <li class="kf-item" :class="articleId === item.id ? 'kf-bg' : ''" v-for="(item,index) in articleList" :key="index" @click="findBackEndComment(1,item.id)">
            <p>{{item.title}}</p>
            <div style="margin-top:10px;">
              <span>{{item.pubDate}}</span>
              <span style="float:right;">{{item.commentCount}}评论</span>
            </div>
          </li>
          <li style="padding: 20px; text-align: center;">
            <Page :current='page' :total="total" simple @on-change='findBackEndArticle' />
          </li>
        </ul>
        <div v-if="commentList.content.length > 0 && articleId !== ''" style="width:100%;">
          <div class="ex-pl" v-for="(item,index) in commentList.content" :key="index">
            <div>
              <img class="ex-img" :src="item.headImgPath" />
            </div>
            <div class="ex-ct">
              <p>{{item.nickName}}</p>
              <p>{{item.content}}</p>
              <p>{{item.commentDate}}</p>
            </div>
            <div class="ex-hf">
              <Button type="success" @click="replay(item, 'Reply')">回复</Button>
            </div>
            <div class="ex-hhf" style="width:100%;" v-for="(it, index) in replySonList" :key="index">
              <span v-if="!it.replyBackEndMemberDto">
                <!-- <img class="ex-img" :src="it.memberBackEndDto.headImgPath" /> -->
                {{it.memberBackEndDto.nickName}}：{{it.content}}
              </span>
              <span v-else>
                <!-- <img class="ex-img" :src="it.replyBackEndMemberDto.headImgPath" /> -->
                {{it.memberBackEndDto.nickName}}<a style="color:#05b55c;">回复</a>{{it.replyBackEndMemberDto.nickName}}：{{it.content}}
              </span>
              <Button style="float:right" type="success" @click="replay(it, 'ReplyReply')">回复</Button>
            </div>
          </div>
          <div style="text-align:right;margin-top:20px;">
            <Page :current='commentPage' :total="commentList.totalElements" simple @on-change='findBackEndComment(commentPage, this.articleId)' />
          </div>
        </div>
        <div class="no-data" v-else-if="commentList.content.length === 0 && articleId !== ''">
          <p>暂无聊天记录</p>
        </div>
      </div>
    </div>
    <Modal v-model="modalShow">
      <p>回复{{nickName}}</p>
      <Input v-model="replayContent" :maxlength="500" show-word-limit type="textarea" style="width: 200px" />
      <Button type="success" @click="articlesCommentOrReplay">回复</Button>
      <div slot="footer">
        
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
      replySonList: [],
      articleId: '',
      total: 0,
      page: 1,
      modalShow: false,
      nickName: '',
      replayOneInfo: {},
      replayContent: '',
      commentId: '',
      commentPage: 1
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
    findBackEndComment(page,id) {
      this.articleId = id;
      this.commentPage = page;
      let params = {
        page: page,
        size: "5",
        articlesId: this.articleId
      };
      findBackEndComment(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.commentList = res.data.data;
          this.commentList.content.forEach(item => {
            this.findBackEndReplyList(1,item.id);
          })
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
        size: "6"
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
          this.findBackEndComment(this.page, this.articleId)
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    // 查询子评论
    findBackEndReplyList(page,id) {
      let params = {
        page: 1,
        size: '5',
        EQ_parentId: id
      }
      findBackEndReplyList(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.replySonList = res.data.data.content;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    replay(item, type) {
      this.modalShow = true;
      this.replayContent = '';
      this.replayOneInfo = item;
      this.replayOneInfo.type = type;
      this.nickName = type === 'ReplyReply' ? item.replyBackEndMemberDto ? item.replyBackEndMemberDto.nickName :  item.memberBackEndDto.nickName : item.nickName;
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
  .ex-hhf {
    padding: 10px 36px 0 0;
    color: #666666;
    margin:0 0 15px 69px;
    border-top: 1px solid #e9e9e9;
  }
}
</style>
