<template>
    <div>
        <div class="ct-top">
            <div class="ct-box">
                <div>
                    <img :src="userInfo.headImgPath">
                </div>
                <div style="margin-left:10px;">
                    <p>{{userInfo.nickName}}</p>
                    <p>{{userInfo.pubDate}}</p>
                </div>
            </div>
            <div style="margin-top:20px;">
                <span style="margin-right:30px;">类型:{{userInfo.feedBackType.message}}</span>
                <span>联系方式:{{userInfo.contactInformation}}</span>
                <p style="margin:20px 0;">{{userInfo.suggestions}}</p>
                <div v-for="(item,index) in userInfo.imagesList" :key="index">
                    <img :src='item'>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {findById} from '@/api/data'
export default {
    data() {
        return {
            userInfo: {}
        }
    },
    created() {
        this.findById()
    },
    methods: {
        findById() {
            let params = {
                id: sessionStorage.getItem('ufeedId')
            }
            findById(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.userInfo = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        }
    }
}
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
</style>