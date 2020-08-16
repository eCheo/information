<template>
    <div>
        <div class="ct-top">
            <div class="ct-box">
                <div>
                    <img :src="userInfo.memberDto.headImgPath">
                </div>
                <div style="margin-left:10px;">
                    <p>{{userInfo.memberDto.nickName}}</p>
                    <p>{{userInfo.applyDate}}(申请时间)</p>
                </div>
            </div>
            <div>
                <p style="text-align:right;font-size:14px;">审核时间:{{userInfo.auditDate}}</p>
                <div>

                </div>
            </div>
        </div>
        <div class="ct-contnet">
            <p style="font-size:16px;margin-bottom:20px">发布列表</p>
            <Table border :loading='tabLoading' :columns="authenticationList" :data="authenticationData.content"></Table>
            <div style="text-align:right;">
                <Page style="margin-top:10px;" :page-size='10' :total="authenticationData.totalElements" @on-change='findBackEndArticlesPageByCondition' />
            </div>
        </div>
    </div>
</template>

<script>
import {findMemberLabelReviewById, findBackEndArticlesPageByCondition} from "@/api/data";
export default {
    data() {
        return {
            userInfo: {},
            authenticationList: [
                {
                    title: '类型'
                },
                {
                    title: '标题'
                },
                {
                    title: '封面'
                },
                {
                    title: '发布时间'
                },
                {
                    title: '发布内容'
                },
                {
                    title: '审核状态'
                },
                {
                    title: '操作'
                }
            ],
            authenticationData: [],
            tabLoading: false
        }
    },
    created() {
        this.findMemberLabelReviewById();
        this.findBackEndArticlesPageByCondition(1);
    },
    methods: {
        findMemberLabelReviewById() {
            let params = {
                id: this.$route.query.id
            }
            findMemberLabelReviewById(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.userInfo = res.data.data
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        findBackEndArticlesPageByCondition(page) {
            let params = {
                EQ_memberId: this.$route.query.id,
                size: '10',
                page: page
            }
            this.tabLoading = true;
            findBackEndArticlesPageByCondition(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.authenticationData = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
                this.tabLoading = false;
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
    .ct-contnet {
        background: #fff;
        padding: 20px;
        margin-top: 20px;
    }
</style>