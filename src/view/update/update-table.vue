<template>
  <div>
    <div>
      <p>到期设置</p>
      <RadioGroup v-model="settingTime">
          <Radio label="long">
              <span>永久有效</span>
          </Radio>
          <Radio label="year">
              <span>每年</span>
              <Input placeholder="月/日"></Input>清除积分池所有积分
          </Radio>
      </RadioGroup>
    </div>
    <div>
      <p>到期提醒设置</p>
      <RadioGroup v-model="settingTime">
          <Radio label="long">
              <span>不提醒</span>
          </Radio>
          <Radio label="year">
              <span>提醒</span>
          </Radio>
      </RadioGroup>
    </div>
    <div>
    <Button type="primary">确认</Button>
    <Button style="margin-left:10px;">重置</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'update_table_page',
  data () {
    return {
      settingTime: 'long'
    }
  },
  methods: {
  },
  created() {
    console.log(this.$store.state.setUserName)
  }
}
</script>

<style>

</style>
