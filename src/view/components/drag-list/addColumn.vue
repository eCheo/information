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
          <div>
              <p style="margin:10px 0;">栏目名称</p>
              <Input v-model="columnInfo.name"> </Input>
          </div>
          <div>
              <p style="margin:10px 0;">优先级</p>
              <InputNumber :min="1" :step="1" v-model="columnInfo.sort"></InputNumber>
          </div>
          <div>
              <p style="margin:10px 0;">是否下架</p>
              <i-switch size="large" true-color="#13ce66" false-color="#ff4949" v-model="columnInfo.isShelf">
                    <span slot="open">下架</span>
                    <span slot="close">上架</span>
              </i-switch>
          </div>
      </Modal>
      <Modal v-model="modalAdd" title='添加栏目' @on-ok='addArticlesColumn'>
          <div>
              <p style="margin:10px 0;">栏目名称</p>
              <Input v-model="columnInfo.name"> </Input>
          </div>
          <div>
              <p style="margin:10px 0;">优先级</p>
              <InputNumber :min="1" :step="1" v-model="columnInfo.sort"></InputNumber>
          </div>
          <div>
              <p style="margin:10px 0;">是否下架</p>
              <i-switch size="large" true-color="#13ce66" false-color="#ff4949"  v-model="columnInfo.isShelf">
                    <span slot="open">下架</span>
                    <span slot="close">上架</span>
              </i-switch>
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
                    title: '状态',
                    render: (h, params) => {
                        let text = !params.row.isShelf ? '上架' : '下架'
                        return h ('p', {}, text)
                    }
                },
                {
                    title: '操作',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    cursor: 'pointer',
                                    color: '#2D8cF0'
                                },
                                on: {
                                    click: () => {
                                        this.modal = true;
                                        this.columnInfo.name = params.row.name;
                                        this.columnInfo.id = params.row.id;
                                        this.columnInfo.sort = params.row.sort;
                                        this.columnInfo.isShelf = params.row.isShelf;
                                    }
                                }
                            } ,'修改')
                        ])
                    }
                }
            ],
            columnData: [],
            modal: false,
            columnInfo: {
                name: '',
                id: '',
                sort: 1,
                isShelf: false
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