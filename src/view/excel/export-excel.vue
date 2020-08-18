
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
  </div>
</template>
<script>
import { findBackEndComment, findBackEndArticle } from "@/api/data";
export default {
  data() {
    return {
      selectTime: "",
      commentList: [],
      articleList: {}
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
        size: "10"
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
          this.articleList = res.data.data;
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
}
.kf-list {
  .kf-item {
    list-style: none;
    display: inline-block;
    margin-right: 20px;
  }
}
.kf-tab {
  background-color: #fff;
  margin-top: 20px;
  padding: 15px;
}
</style>
