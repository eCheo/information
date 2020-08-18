<template>
    <div>
      <div class="us-box">
          <Input style="width: 200px" v-model="name" placeholder="请输入栏目名称"></Input>
          <Button style="margin-left:10px;" type="success">添加</Button>
      </div>
      <div class="ac-bt">

      </div>
    </div>
</template>

<script>
import {findArticles} from '../../../api/data';
export default {
    data() {
        return{
            name: ''
        }
    },
    created() {

    },
    methods: {
        findArticles() {
            findArticles().then(res => {
                 if (res.data.code === '200') {
                    this.conditionList = res.data.data
                    this.condiId = this.conditionList[0].id
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