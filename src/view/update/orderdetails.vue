<template>
  <div class='orderde'>
    <ul class="or-list">
      <li class="or-item">
        <div style="width:100px;">
          订单号
        </div>
        <div>
          {{orderDetails.orderNo}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          收货人名称
        </div>
        <div>
          {{orderDetails.contactsName}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          收货人电话
        </div>
        <div>
          {{orderDetails.contactsPhone}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          收货地址
        </div>
        <div>
          {{orderDetails.receivingAddress}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          商品名称
        </div>
        <div>
          {{orderDetails.name}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          颜色分类
        </div>
        <div>
          无
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          数量
        </div>
        <div>
          {{orderDetails.number}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          实付积分
        </div>
        <div>
          {{orderDetails.paymentIntegral}}
        </div>
      </li>
      <li class="or-item" style="margin-top:30px;">
        <div style="width:100px;">
          支付方式
        </div>
        <div>
          {{orderDetails.paymentMethod}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          兑换时间
        </div>
        <div>
          {{orderDetails.exchangeDate}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          成交时间
        </div>
        <div>
          {{orderDetails.closingDate || '----'}}
        </div>
      </li>
      <li class="or-item">
        <div style="width:100px;">
          收款方
        </div>
        <div>
          {{orderDetails.payee}}
        </div>
      </li>
    </ul>
    <div class="or-wuliu">
      <p>物流状态</p>
      <div class="or-ws" v-for="(item, index) in orderDetails.logisticsDto" :key='index'>
        <p style="margin-bottom:5px;">{{item.logistics}}</p>
        <p>{{item.logisticsDate}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {findBackEndOrderById} from "@/api/data"
export default {
  data() {
    return {
      orderDetails: {}
    }
  },
  created() {
    this.findBackEndOrderById();
  },
  methods: {
    findBackEndOrderById() {
      let params = {
        id: this.$route.query.id
      }
      findBackEndOrderById(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.orderDetails = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
ul li {
  list-style: none;
}
.orderde {
  background-color: #fff;
  padding: 20px;
  height: 100%;
}
.or-list .or-item {
  // display: block;
  display: flex; 
  margin-bottom: 5px;
}
.or-wuliu {
  margin-top: 15px;
  >p {
    font-weight: bold;
    margin-bottom: 15px;
  }
  .or-ws {
    color: rgb(56,162,138);
    margin-bottom: 15px;
    max-width: 300px;
  }
}
</style>