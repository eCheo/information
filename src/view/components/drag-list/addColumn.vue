<template>
    <div>
      <div class="us-box">
          <Input style="width: 200px" v-model="LIKE_name" placeholder="请输入栏目名称"></Input>
          <Button style="margin-left:10px;" type="success" @click="findArticles">搜索</Button>
      </div>
      <div class="ac-bt">
          <div style="margin-bottom:20px;">
              <span>栏目列表</span>
              <Button type="success" style="float:right" @click="modalAdd = true;">添加栏目</Button>
          </div>
          <Table border :loading='loading' :columns="columnList" :data="columnData"></Table>
      </div>
      <Modal v-model="modal" title='修改栏目' @on-ok='addArticlesColumn'>
          <div style="margin-bottom:10px;">
              <p>栏目名称</p>
              <Input v-model="columnInfo.name"> </Input>
          </div>
          <div>
              <p>优先级</p>
              <InputNumber :min="1" :step="1" v-model="columnInfo.sort"></InputNumber>
          </div>
      </Modal>
      <Modal v-model="modalAdd" title='添加栏目' @on-ok='addArticlesColumn'>
          <div style="margin-bottom:10px;">
              <p>栏目名称</p>
              <Input v-model="columnInfo.name"> </Input>
          </div>
          <div>
              <p>优先级</p>
              <InputNumber :min="1" :step="1" v-model="columnInfo.sort"></InputNumber>
          </div>
      </Modal>
    </div>
</template>

<script>
import {findArticles, addArticlesColumn} from '../../../api/data';
export default {
    data() {
        return{
            name: '',
            modalAdd: false,
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
                                    this.columnInfo.name = params.row.name;
                                    this.columnInfo.id = params.row.id;
                                    this.columnInfo.sort = params.row.sort;
                                }
                            }
                        } ,'修改')
                    }
                }
            ],
            columnData: [],
            modal: false,
            columnInfo: {
                name: '',
                id: '',
                sort: 1
            },
            LIKE_name: ''
        }
    },
    created() {
        this.findArticles();
    },
    methods: {
        findArticles() {
            let params = {
                LIKE_name: this.LIKE_name
            }
            this.loading = true;
            findArticles(params).then(res => {
                 if (res.data.code === '200') {
                    this.columnData = res.data.data
                    this.loading = false;
                } else {
                    this.$Message.error(res.data.message);
                    this.loading = false;
                }
            })
        },
        addArticlesColumn() {
            addArticlesColumn(this.columnInfo).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    if (!this.modalAdd) {
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