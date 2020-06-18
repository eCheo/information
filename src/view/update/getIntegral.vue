<template>
  <div>
    <p>活动列表</p>
    <hr style="margin:40px 0 30px 0;" color="#e9e9e9" />
    <Table border :columns="integralList" :data="integralData"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      integralList: [
        {
          title: '活动编号',
          key: 'no'
        },
        {
          title: '活动名称',
          key: 'name'
        },
        {
          title: '限制',
          key: 'limit'
        },
        {
          title: '最多可获取积分',
          key: 'limitInte'
        }
      ],
      integralData: [
        {
          no: '0035432',
          name: '绑定手机号',
          limit: '1次',
          limitInte: '+163积分'
        }
      ]
    }
  },
  created() {
    console.log(this.$store.state.user)
  }
}
</script>
