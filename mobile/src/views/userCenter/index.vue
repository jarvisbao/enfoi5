<template>
  <div class="user-center-container">
    <div class="userinfo" @click="gotoInfo">
      <div class="avatar">
        <img :src="avatar">
      </div>
      <div class="info">
        <div class="name">
          {{ userinfo.full_name }}
        </div>
        <span class="nickname">{{ userinfo.nickname }}</span>
      </div>
      <van-icon name="arrow" />
    </div>
    <div class="mb8">
      <van-cell title="密码管理" @click="handlePassword" />
      <van-cell title="清理缓存" @click="clear_cache" />
    </div>
    <van-cell title="退出登录" @click="logout" style="text-align: center; color: #F56C6C; font-weight: bold;" />
    <page-footer />
    <van-overlay :show="show" z-index="10000">
      <div class="van-toast">
        <van-loading color="#fff" />
        <div class="van-toast__text">
          清理中...
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userinfo'
    ])
  },
  created() {
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    gotoInfo() {
      this.$router.push({ name: 'user-info' })
    },
    clear_cache() {
      this.show = true
      this.$Apis.user.clear_cache().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.show = false
          this.$toast('缓存清理成功')
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },
    handlePassword() {
      this.$router.push({ name: 'set-password' })
    }
  }
}
</script>

