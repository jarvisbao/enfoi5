<template>
  <div class="errPage-container">
    <div>
      <img :src="errGif" width="180">
      <h5>你没有{{ role }}权限去该页面，请联系管理员</h5>
      <van-button round type="info" color="#afafaf" style="width: 100px; height: 40px;" @click="back">
        返回
      </van-button>
      <van-button round type="info" to="/" style="width: 140px; height: 40px; margin-left: 12px;">
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      role: []
    }
  },
  created() {
    this.role = this.$route.query.role
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ name: 'index' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    min-height: calc(100vh);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    h5 {
      font-size: 16px;
      color: #969696;
    }
  }
</style>
