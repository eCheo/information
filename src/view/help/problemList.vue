<template>
<div>
    <div class="rp-top">
        <Input v-model="problemInfo.LIKE_name" style="width:300px;margin-right:10px;" placeholder="请输入问题名称"></Input>
        <Button type="success" @click="findProblemTypeListByCondition">查询</Button>
    </div>
    <div class="rp-bottom">
        <div style="height:50px;margin-bottom:2px;">
                <span>问题列表</span>
                <Button style="float:right;" type="success" @click="addModal = true">添加问题类型</Button>
        </div>
        <Table border :columns="problemList" :data="problemData"></Table>
    </div>
    <Modal v-model="addModal" :mask-closable='false' :title="problemAdd.id === '' ? '添加问题类型' : '修改问题类型'">
        <p>问题名称</p>
        <Input v-model="problemAdd.name" placeholder="请输入问题名称"></Input>
        <div slot="footer">
            <Button type="text" @click="addModal = false">取消</Button>
            <Button type="success" @click="createOrUpdateProblem">确定</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import {findProblemTypeListByCondition, createOrUpdateProblem} from '@/api/data'
export default {
    data () {
        return {
            problemList: [
                {
                    title: 'id',
                    key: 'id'
                },
                {
                    title: '问题名称',
                    key: 'name'
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        return h('p', {
                            style: {
                                cursor: 'pointer',
                                color: '#2D8cF0',
                                textDecoration: 'underline'
                            },
                            on: {
                                click: () => {
                                    this.addModal = true;
                                    this.problemAdd = params.row;
                                }
                            }
                        }, '修改')
                    }
                }
            ],
            problemData: [],
            problemInfo: {
                LIKE_name: ''
            },
            problemAdd: {
                name: '',
                id: ''
            },
            addModal: false
        }
    },
    created() {
        this.findProblemTypeListByCondition();
    },
    methods: {
        findProblemTypeListByCondition() {
            findProblemTypeListByCondition(this.problemInfo).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.problemData = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        createOrUpdateProblem() {
            createOrUpdateProblem(this.problemAdd).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    if (this.problemAdd.id === '') {
                        this.$Message.success('添加成功');
                    } else {
                        this.$Message.success('修改成功');
                        this.problemAdd.id = '';
                    }
                    this.addModal = false;
                    this.findProblemTypeListByCondition();
                } else {
                    this.$Message.error(res.data.message);
                    this.addModal = false;
                }
            })
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