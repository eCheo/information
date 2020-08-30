<template>
    <div>
        <div class="content">
            <p>客服列表</p>
            <hr style="margin:20px 0;" color="#e9e9e9" />
            <Table border :loading='loading' :columns="customerList" :data="customerData"></Table>
        </div>
        <Modal v-model="cusModel" title="修改客服信息" :mask-closable='false'>
            <div>
                <p>管理员名字</p>
                <Select v-model="custUpdateId">
                    <Option v-for="item in custUpdateList" :value="item.memberId" :key="item.memberId">{{ item.nickName }}</Option>
                </Select>
            </div>
            <div style="margin:10px 0;">
                <p>客服电话</p>
                <Input v-model="custInfo.customerTel" ></Input>
            </div>
            <div>
                <p>私信推送消息</p>
                <Input type="textarea" :rows='4' v-model="custInfo.message"></Input>
            </div>
            <div slot="footer">
                <Button type="text" @click="cusModel = false">取消</Button>
                <Button type="success" @click="updateCustomer">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {findCustomerListByCondition, updateCustomer, getBackEndCustomer} from "@/api/data";
export default {
    data () {
        return {
            customerList: [
                {
                    title: '客服Id',
                    key: 'customerId'
                },
                {
                    title: '客服电话',
                    key: 'customerTel'
                },
                {
                    title: '私信推送消息',
                    key: 'message',
                    render: (h, params) => {
                        return h('div', {
                            domProps: {
                                innerHTML: params.row.message
                            }
                        })
                    }
                },
                {
                    title: '客服名称',
                    key: 'customerName'
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
                                    this.cusModel = true;
                                    this.custInfo.customerTel = params.row.customerTel;
                                    this.custInfo.message = params.row.message;
                                    this.custUpdateId = params.row.customerId;
                                }
                            }
                        }, '修改')
                    }
                }
            ],
            customerData: [
                {
                    customerId: '123123123',
                    customerTel: '1545451545',
                    message: '哇哈哈哈',
                    customerName: '打左边来了个喇嘛'
                }
            ],
            cusModel: false,
            custInfo: {
                customerTel: '',
                message: '',
                id: this.custUpdateId
            },
            loading: false,
            custUpdateList: [],
            custUpdateId: ''
        }
    },
    created() {
        this.findCustomerListByCondition();
        this.getBackEndCustomer();
    },
    methods: {
        findCustomerListByCondition() {
            this.loading = true;
            findCustomerListByCondition().then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.customerData = res.data.data;
                    this.loading = false;
                } else {
                    this.$Message.error(res.data.message);
                    this.loading = false;
                }
            })
        },
        updateCustomer() {
            updateCustomer(this.custInfo).then(res => {
                 if (res.status === 200 && res.data.code === '200') {
                    this.$Message.success('修改客服信息成功');
                    this.cusModel = false;
                    this.findCustomerListByCondition();
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        },
        getBackEndCustomer() {
            getBackEndCustomer().then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.custUpdateList = res.data.data;
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .content {
        background-color: #fff;
        padding: 20px;
        margin-top: 20px;
        box-sizing: border-box;
    }
</style>