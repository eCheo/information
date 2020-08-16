<template>
  <div>
    <p>活动列表</p>
    <hr style="margin:40px 0 30px 0;" color="#e9e9e9" />
    <Table border :columns="integralList" :data="integralData"></Table>
  </div>
</template>

<script>
import { findBackEndIntegralAcquisition } from "@/api/data";
export default {
  data () {
    return {
      integralList: [
        {
          title: '活动编号',
          key: 'id'
        },
        {
          title: '活动名称',
          render: (h, params) => {
            return h('p', {}, params.row.integralType.message)
          }
        },
        {
          title: '限制',
          key: 'limit',
          render: (h, params) => {
            return h('p', {}, params.row.limit === null ? '---' : params.row.limit)
          }
        },
        {
          title: '最多可获取积分',
          key: 'limitInte',
          render: (h, params) => {
            return h('p', {}, params.row.highestAvailable === null ? '---' : params.row.highestAvailable)
          }
        }
      ],
      integralData: []
    }
  },
  created () {
    this.findBackEndIntegralAcquisition();
  },
  methods: {
    findBackEndIntegralAcquisition() {
      let params = {
         sort: 'id,asc'
      }
      findBackEndIntegralAcquisition(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.integralData = res.data.data;
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  }
}
</script>
