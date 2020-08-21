<template>
  <div>
    <div>
      <div></div>
    </div>
  </div>
</template>

<script>
import {findBackEndOrderById} from "@/api/data"
export default {
  data() {
    return {

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

        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  }
}
</script>

<style>

</style>