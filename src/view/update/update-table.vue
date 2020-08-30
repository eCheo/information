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
              <DatePicker :value='setDate' :disabled="settingTime === 'long'" type="date" format="MM-dd" placeholder="月/日" style="width: 200px" @on-change='test'></DatePicker>清除积分池所有积分
          </Radio>
      </RadioGroup>
    </div>
    <!-- <div>
      <p>到期提醒设置</p>
      <RadioGroup v-model="settingTime">
          <Radio label="long">
              <span>不提醒</span>
          </Radio>
          <Radio label="year">
              <span>提醒</span>
          </Radio>
      </RadioGroup>
    </div> -->
    <div>
    <Button type="primary" @click="updateSchedule">确认</Button>
    <!-- <Button style="margin-left:10px;" @click='clear'>重置</Button> -->
    </div>
  </div>
</template>

<script>
import {updateSchedule, findSchedule} from "@/api/data";
export default {
  name: 'update_table_page',
  data () {
    return {
      settingTime: 'long',
      month: '',
      day: '',
      setDate: ''
    }
  },
  methods: {
    updateSchedule() {
      let params = {};
      if (this.settingTime === 'long') {
         params = {
          isValid: this.settingTime === 'long' ? false : true
        }
      } else {
          params = {
            isValid: this.settingTime === 'long' ? false : true,
            month: this.month,
            day: this.day
        }
      }
      updateSchedule(params).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$Message.success('设置成功');
        } else {
          this.$Message.error(res.data.message);
        }
      })
    },
    test(date){
      this.month = date.substring(0, date.indexOf('-'));
      this.day = date.substring(date.indexOf('-') + 1, date.size);
      this.month = Number(this.month) > 9? this.month : this.month.substring(1,2);
      this.day = Number(this.day) > 9? this.day : this.day.substring(1,2);
    },
    findSchedule() {
      findSchedule().then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.settingTime = res.data.data.isValid ? 'year' : 'long';
          this.month = res.data.data.month;
          this.day = res.data.data.day;
          let m = res.data.data.month > 9 ? res.data.data.month : '0' + res.data.data.month;
          let d = res.data.data.day > 9 ? res.data.data.day : '0' + res.data.data.day;
          this.setDate = m + '-' + d; 
        } else {
          this.$Message.error(res.data.message);
        }
      })
    }
  },
  created() {
    this.findSchedule();
  }
}
</script>

<style>

</style>
