<template>
  <div style="width:100%;height:100%;">
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :simplify="true" :unit="unit2" :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20">
      <div class="hm-wapper">
        <div class="hm-count-box">
          <p class="hm-title">概览</p>
          <ul class="hm-list">
            <li class="hm-item">
              <p class="hm-sub-title">今日新增用户</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
            <li class="hm-item">
              <p class="hm-sub-title">本周新增用户</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
            <li class="hm-item">
              <p class="hm-sub-title">总用户数</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
          </ul>
        </div>
        <div class="hm-count-box">
          <p class="hm-title">活跃用户</p>
          <ul class="hm-list">
            <li class="hm-item">
              <p class="hm-sub-title">日活跃数(近七天平均值)</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
            <li class="hm-item">
              <p class="hm-sub-title">月活跃数(近30天)</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
            <li class="hm-item">
              <p class="hm-sub-title">季活跃数(近90天)</p>
              <count-to :simplify="true" :unit="unit2" :end="111" count-class="hm-sub-num" />
            </li>
          </ul>
        </div>
      </div>
    </Row>
    
    <!-- <img style="width:100%;height:100%;" src="../../../assets/images/home.png" /> -->
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import route from "../../../router/routers";
export default {
  name: "home",
  data() {
    return {
      inforCardData: [
        { title: "阅读量", icon: "md-book", count: 142, color: "#ff9900" },
        {
          title: "评论数",
          icon: "ios-chatboxes",
          count: 657,
          color: "#ed3f14"
        },
        { title: "点赞数", icon: "md-thumbs-up", count: 12, color: "#E46CBB" },
        { title: "视频浏览量", icon: "md-play", count: 14, color: "#9A66E4" }
      ],
      unit2: [
        [4, "万多"],
        [5, "十万多"],
        [6, "百万多"],
        [7, "千万多"],
        [8, "亿多"]
      ]
    };
  },
  components: {
    InforCard,
    CountTo
  },
  mounted() {}
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
.hm-sub-num {
  font-size: 20px;
  color: rgb(100, 100, 100);
}
ul {
  padding: 0px;
  margin: 0;
}
ul li {
  list-style: none;
}
</style>
<style lang="less" scoped>
.hm-wapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 10px;
  margin-bottom: 20px;
}
.hm-count-box {
  padding: 20px 50px 50px 50px;
  width: 46%;
  min-width: 700px;
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 1px 3px 1px 1px rgba(197, 194, 194, 0.1);
  .hm-title {
    font-size: 26px;
    font-weight: bold;
    color: #111;
  }
  .hm-list {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    .hm-item {
      text-align: center;
      .hm-sub-title {
        margin-bottom: 15px;
        font-size: 20px;
        color: rgb(82, 82, 82);
      }
    }
  }
}
</style>