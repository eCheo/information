<template>
    <div>
        <div v-if="titleDetails.type.name === 'PublishVideo'">
            <div class="vd-top">
                <div id="dplayer" style="width:800px;height:400px;margin:0 auto;"></div>
                <div style="width:800px;margin:0 auto;">
                    <p style="font-size:18px;margin:20px 0 10px 0;color:#333333;font-weight: bold;">{{titleData.title}}</p>
                    <div class="ex-pl">
                        <div>
                            <img class="ex-img" :src="memberDto.headImgPath" />
                        </div>
                        <div class="ex-ct" >
                            <p>{{memberDto.nickName}}</p>
                            <p>{{titleData.nowDate}}<span style="margin:0 6px;font-size:19px;">·</span><span>{{memberDto.videoAuthName}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="vd-bottom">
                <div>
                    <p style="text-align:right;font-size:14px;">审核时间:{{titleDetails.auditDate}}</p>
                        <div>
                            <ul class="th-list">
                            <li class="th-item">用户ID</li>
                            <li class="th-item">手机号</li>
                            <li class="th-item">发布类型</li>
                            <li class="th-item">栏目类型</li>
                            </ul>
                            <ul class="td-list">
                            <li class="td-item">{{titleData.memberDto.memberId || '---'}}</li>
                            <li class="td-item">{{titleData.memberDto.phone}}</li>
                            <li class="td-item">{{titleData.columnName}}</li>
                            <li class="td-item">{{titleData.auditStatusType.message}}</li>
                            </ul>
                        </div>
                    </div>
            </div> -->
        </div>
        <div v-if="titleDetails.type.name === 'PublishArticle'">
            <div class="vd-top">
                <p style="font-size:18px;margin:20px 0 10px 0;color:#333333;font-weight: bold;">{{titleData.title}}</p>
                    <div class="ex-pl">
                        <div>
                            <img class="ex-img" :src="memberDto.headImgPath" />
                        </div>
                        <div class="ex-ct" >
                            <p>{{memberDto.nickName}}</p>
                            <p>{{titleData.nowDate}}<span style="margin:0 6px;font-size:19px;">·</span><span>{{memberDto.videoAuthName}}</span></p>
                        </div>
                    </div>
                    <div v-html="titleData.content" style="margin-top:20px;">

                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import {findArticlesDetails} from "@/api/data";
import DPlayer from 'dplayer'
export default {
    data() {
        return {
            titleDetails: JSON.parse(sessionStorage.getItem('titleObj')),
            titleData: {},
            memberDto: {},
            dp: null
        }
    },
    created() {
        this.findArticlesDetails();
    },
    methods: {
        findArticlesDetails() {
            let params = {
                id: this.titleDetails.id
            }
            findArticlesDetails(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.titleData = res.data.data;
                    this.memberDto = res.data.data.memberDto;
                    if (this.titleDetails.type.name === 'PublishVideo') {
                        let _that = this;
                        const dplayer = new DPlayer({
                            container: document.getElementById('dplayer'),
                            lang: 'zh-cn',
                            autoplay: false,
                            loop: false,
                            video: {
                                url: _that.titleData.videoPath,
                                pic: _that.titleData.videoImagePath
                            }
                        });
                        this.dp = dplayer;
                    }
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        }
    },
    destroyed() {
        sessionStorage.removeItem('titleObj');
        if (this.titleDetails.type.name === 'PublishVideo') { 
            this.dp.destroy()
        }
    }
}
</script>

<style lang="less" scoped>
    .vd-top {
        padding:20px;
        background: #fff;
    }
    .vd-bottom {
        padding:20px;
        background: #fff;
        margin-top:15px;
    }
    .ex-pl {
  display: flex;
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