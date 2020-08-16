<template>
  <div>
    <div class="top">
      <p>筛选</p>
      <div class="top-box">
        <div class="top-item">
          <span>商品ID</span>
          <Input v-model="integralFrom.EQ_id" style="width:200px"></Input>
        </div>
        <div class="top-item">
          <span>商品名称</span>
          <Input v-model="integralFrom.LIKE_name" style="width:200px"></Input>
        </div>
        <div class="top-item">
          <span>有效期</span>
          <DatePicker
            :value="time"
            @on-change='changeDate'
            format="yyyy年MM月dd日"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择有效期"
            style="width: 200px"
          ></DatePicker>
        </div>
        <div class="top-item">
          <span>上架状态</span>
          <Select v-model="integralFrom.EQ_goodsGroundingType" style="width:200px">
            <Option
              v-for="item in upStatusList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <Button style="height:30px" type="success" icon="ios-search" @click="findGoodsPage(1)">搜索</Button>
      </div>
    </div>
    <div class="content">
      <div>
        <span>商品列表</span>
        <Button style="float:right" type="success" @click="$router.push('/update/shop/shoppingAdd')">添加商品</Button>
      </div>
      <hr style="margin:20px 0;" color="#e9e9e9" />
      <Table border :loading='tableLoading' :columns="integralList" :data="integralData.content"></Table>
      <Page style="margin-top:10px;float:right;" :page-size='15' :total="integralData.totalElements" @on-change='findGoodsPage' />
    </div>
  </div>
</template>

<script>
import { findGoodsPage, goodsGrounding } from '@/api/data'
export default {
  data () {
    return {
      integralList: [
        {
          title: '商品ID',
          key: 'id'
        },
        {
          title: '商品名称',
          key: 'name'
        },
        {
          title: '兑换积分',
          key: 'integral'
        },
        {
          title: '库存数量',
          key: 'stock'
        },
        {
          title: '商品成本',
          key: 'money'
        },
        {
          title: '有效期',
          key: 'expirationDate',
          render: (h, params) => {
            return h ('p', {}, params.row.startDate+ '—' +params.row.expirationDate)
          }
        },
        {
          title: '上架状态',
          render: (h, params) => {
            return h("span", params.row.type)
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.goodsGrounding(params.row)
                  }
                }
              }, params.row.type === '上架' ? '下架' : '上架'),
              h('span', {
                style: {
                  display: 'inline-block',
                  margin: '0 20px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$router.push({path: '/update/shop/shoppingAdd', query: {id: params.row.id}})
                  }
                }
              }, '编辑'),
              h('span', {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.deleteGoods(params.row);
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      integralData: [],
      time: '',
      upStatusList: [
        {
          label: '上架',
          value: 'Grounding'
        },
        {
          label: '下架',
          value: 'Dismount'
        }
      ],
      integralFrom: {
        GTE_startDate: '',
        LTE_expirationDate: '',
        EQ_goodsGroundingType: '',
        LIKE_name: '',
        EQ_id: '',
        page: '1',
        size: '15'
      },
      tableLoading: true
    }
  },
  created() {
    this.findGoodsPage()
  },
  methods: {
    findGoodsPage(page) {
      this.integralFrom.page = page;
      findGoodsPage(this.integralFrom).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.integralData = res.data.data;
          this.integralData.content.forEach(item => {
            item.type = item.goodsGroundingType.message
          })
          this.tableLoading = false;
        } else {
          this.$Message.error(res.data.message);
          this.tableLoading = false;
        }
      })
    },
    goodsGrounding(row) {
      let params = {
        id: row.id,
        goodsGroundingType: row.type === '上架' ? 'Dismount' : 'Grounding'
      }
      goodsGrounding(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          if (row.type === "Dismount") {
            this.$Message.success("商品上架成功");
          } else {
            this.$Message.success("商品下架成功");
          }
          this.findGoodsPage('1');
        } else {
          this.$Message.error(res.data.message);
          this.tableLoading = false;
        }
      })
    },
    deleteGoods(row) {
      let params = {
        id: row.id
      }
      deleteGoods(params).then(res => {
         if (res.status === 200 && res.data.code === '200') { 
           this.$Message.success('商品删除成功');
           this.findGoodsPage('1');
         } else {
           this.$Message.error(res.data.message);
           this.tableLoading = false;
         }
      })
    },
    changeDate (date) {
      let starTime = date[0].replace(/([^\u0000-\u00FF])/g, '-')
      let endTime = date[1].replace(/([^\u0000-\u00FF])/g, '-')
      this.integralFrom.GTE_startDate = starTime.substring(0, starTime.length - 1)
      this.integralFrom.LTE_expirationDate = endTime.substring(0, endTime.length - 1)
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  background: #fff;
  padding: 20px;
  .top-box {
    display: flex;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    background: #fff;
  }
  .top-item {
    span {
      margin-right: 10px;
    }
  }
  .top-item:nth-child(2) {
    margin: 0 20px;
  }
}
.content {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
}
</style>
