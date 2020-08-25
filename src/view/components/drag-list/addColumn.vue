<template>
    <div>
      <div class="us-box">
          <Input style="width: 200px" v-model="coloumnInfo.name" placeholder="请输入栏目名称"></Input>
          <Button style="margin-left:10px;" type="success">添加</Button>
      </div>
      <div class="ac-bt">
          <Table border :columns="columnList" :data="columnData"></Table>
      </div>
      <Modal v-model="modal" title='修改栏目'>
          <Input v-model="coloumnInfo.name"> </Input>
      </Modal>
    </div>
</template>

<script>
import {findArticles} from '../../../api/data';
export default {
    data() {
        return{
            name: '',
            columnList: [
                {
                    title: '栏目名称',
                    key: 'name'
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        return h('p', {
                            style: {
                                cursor: 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.modal = true;
                                }
                            }
                        } ,'修改')
                    }
                }
            ],
            columnData: [],
            modal: false,
            coloumnInfo: {
                name: ''
            }
        }
    },
    created() {
        this.findArticles();
    },
    methods: {
        findArticles() {
            findArticles().then(res => {
                 if (res.data.code === '200') {
                    this.columnData = res.data.data
                    // this.condiId = this.conditionList[0].id
                }
            })
        },
        addArticlesColumn() {
            addArticlesColumn(this.coloumnInfo).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    if (this.modal) {
                        this.$Message.success('修改成功');
                    } else {
                        this.$Message.success('添加成功');
                    }
                    this.findArticles();
                } else {
                    this.$Message.error(res.data.message);
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.us-box {
    padding: 20px;
    background-color: #fff;
}
.ac-bt {
    margin-top: 20px;
    background: #fff;
    padding: 20px;
}
</style>