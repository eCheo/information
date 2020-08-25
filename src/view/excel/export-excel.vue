
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
          <li class="kf-item" :class="id === item.id ? 'kf-bg' : ''" v-for="(item,index) in articleList" :key="index" @click="id = item.id">
            <p>{{item.title}}</p>
            <div style="margin-top:10px;">
              <span>{{item.pubDate}}</span>
              <span style="float:right;">{{item.commentCount}}评论</span>
            </div>
          </li>
        </ul>
        <div>
          ssss
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findBackEndComment, findBackEndArticle } from "@/api/data";
export default {
  data() {
    return {
      selectTime: "",
      commentList: [],
      articleList: {},
      id: ''
    };
  },
  created() {
    this.findBackEndArticle();
  },
  methods: {
    changeDate(date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, "-");
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, "-");
      this.userFrom.startTime = starTime.substring(0, starTime.length - 1);
      this.userFrom.endTime = endTime.substring(0, endTime.length - 1);
    },
    findBackEndComment() {
      let params = {
        page: "1",
        size: "10",
        articlesId: this.id
      };
      findBackEndComment().then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.commentList = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    findBackEndArticle() {
      let params = {
        page: "1",
        size: "6"
      };
      findBackEndArticle(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.articleList = res.data.data.content;
        } else {
          this.$Message.error(res.data.message);
        }
      });
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
    width: 250px;
    list-style: none;
    .kf-item {
      width: inherit;
      padding: 30px 15px;
      border: 1px solid #e9e9e9;
      cursor: pointer;
      p {
        font-size: 16px;
        color: #333333;
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
</style>
