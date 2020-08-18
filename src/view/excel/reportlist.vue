<template>
    <div>
        <div class="rp-top">
            <div>
                <span style="margin-right:10px;">举报类型</span>
                <RadioGroup v-model="reportInfo.type" type="button" @on-change='reportChange'>
                    <Radio label="Users">用户</Radio>
                    <Radio label="Article">内容</Radio>
                    <Radio label="Comment">评论</Radio>
                </RadioGroup>
                <span style="margin:0 10px;">选择时间</span>
                <DatePicker
                    v-model="selectTime"
                    @on-change='changeDate'
                    format="yyyy年MM月dd日"
                    type="daterange"
                    placement="bottom-end"
                    placeholder="请选择时间"
                    style="width: 200px"
                ></DatePicker>
            </div>
            <div style="margin-top:20px;">
                <Input v-model="reportInfo.queryValue" placeholder="请输入被举报者的昵称、举报者昵称、举报原因" style="width:80%;"></Input><Button type="success" style="margin-left:10px;" @click="findReportBackEndList(1)">搜索</Button>
            </div>
        </div>
        <div class="rp-bottom">
            <p>举报列表</p>
            <Table border :columns="rtList" :data="reportData.content"></Table>
            <div style="text-align:right;">
                <Page
                style="margin-top:10px;"
                :page-size="10"
                :total="reportData.totalElements"
                @on-change="findReportBackEndList"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {findReportBackEndList, setGroundingType} from "@/api/data"
export default {
    data() {
        return {
            selectTime: '',
            reportInfo: {
                queryValue: '',
                startTime: '',
                endTime: '',
                type: 'Users',
                page: '1',
                size: '10'
            },
            reportData: {},
            reportList: [
                {
                    title: '被举报者(昵称)',
                    key: 'beNickName'
                },
                {
                    title: '举报原因',
                    key: 'reason'
                },
                {
                    title: '举报者(昵称)',
                    key: 'nickName'
                },
                {
                    title: '举报时间',
                    key: 'pubDate'
                },
                {
                    title: '账户禁用',
                    render: (h, params) => {
                        return h('i-switch', {
                        props: {
                            trueColor: '#19be6b',
                            value: params.row.isDisable
                        },
                        on: {
                            'on-change': () => {
                                // this.setMemberDisable(params.row);
                            }
                        }  
                        })
                    }
                }
            ],
            reportListCt: [
                {
                    title: '被举报内容的标题',
                    key: 'title'
                },
                {
                    title: '举报原因',
                    key: 'reason'
                },
                {
                    title: '举报者(昵称)',
                    key: 'nickName'
                },
                {
                    title: '举报时间',
                    key: 'pubDate'
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        if (params.row.groundingType.name === "Dismount") {
                            return h('Button', {
                                props: {
                                    type: 'success'
                                },
                                on: {
                                    click: () => {
                                        this.setGroundingType(params.row);
                                    }
                                }  
                            }, '上架')
                        } else {
                            return h('Button', {
                                props: {
                                    type: 'error'
                                },
                                on: {
                                    click: () => {
                                        this.setGroundingType(params.row);
                                    }
                                }  
                            }, '下架')
                        }
                    }
                }
            ],
            reportListPl: [
                {
                    title: '被举报的评论',
                    key: 'content'
                },
                {
                    title: '举报原因',
                    key: 'reason'
                },
                {
                    title: '举报者(昵称)',
                    key: 'nickName'
                },
                {
                    title: '举报时间',
                    key: 'pubDate'
                },
                {
                    title: '账户禁用',
                    render: (h, params) => {
                        return h('Button', {
                        props: {
                            type: 'error'
                        },
                        on: {
                            click: () => {
                                // this.setMemberDisable(params.row);
                            }
                        }  
                        }, '删除')
                    }
                }
            ],
            rtList: []
        }
    },
    created() {
        this.findReportBackEndList(1);
    },
    methods: {
        changeDate (date) {
            let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
            let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
            this.reportInfo.startTime = starTime.substring(0, starTime.length - 1)
            this.reportInfo.endTime = endTime.substring(0, endTime.length - 1)
        },
        findReportBackEndList(page) {
            this.reportInfo.page = page;
            findReportBackEndList(this.reportInfo).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.reportData = res.data.data;
                } else {    
                    this.$Message.error(res.data.message);
                }
            })
        },
        reportChange(label) {
            this.reportInfo.type = label;
            this.findReportBackEndList(1);
        },
        setGroundingType(row) {
            let params = {
                groundingType:
                row.groundingType.name === "Dismount" ? "Grounding" : "Dismount",
                id: row.id
            };
            setGroundingType(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    if (row.groundingType.name === "Dismount") {
                        this.$Message.success("上架成功");
                    } else {
                        this.$Message.success("下架成功");
                    }
                    this.findReportBackEndList(1);
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        }
    },

    watch: {
        'reportInfo.type': {
            handler() {
                if (this.reportInfo.type === 'Users') {
                    this.rtList = this.reportList;
                } else if (this.reportInfo.type === 'Article') {
                    this.rtList = this.reportListCt;
                } else {
                    this.rtList = this.reportListPl;
                }
            },immediate: true
        }
    }
}
</script>

<style lang="less" scoped>
.rp-top {
    background: #fff;
    padding: 20px;
}
.rp-bottom {
    background: #fff;
    padding: 20px;
    margin-top: 20px;
}
</style>