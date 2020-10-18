<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form :logLoading='logLoading' @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      logLoading: false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ account, passWord, loginType }) {
      this.logLoading = true;
      this.handleLogin({ account, passWord, loginType }).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.getUserInfo().then(res => {
              this.logLoading = false;
              this.$router.push({
                name: this.$config.homeName
              })
              this.heartbeat();
          })
        } else {
          this.$Message.error(res.data.message)
          this.logLoading = false;
        }
      })
    },
    heartbeat() {
     let head = setTimeout(() => {
        this.heartbeat()
      }, 480000);
      this.$ws('ws://47.56.186.16:8099/ws?token=' + this.$store.state.user.token);
      if (!sessionStorage.getItem('token')) {
        ws.close();
        clearTimeout(head);
      }
    }
  }
}
</script>

<style>

</style>
