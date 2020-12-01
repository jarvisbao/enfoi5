<template>
  <div class="sub-layout">
    <van-sticky>
      <van-nav-bar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <div class="layout-container">
      <transition name="fade-transform" mode="out-in">
        <router-view ref="childView" :key="$route.fullPath" />
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: ''
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.title = val.query.name ? val.query.name : val.meta.title
      }
    }
  },
  created() {
    this.title = this.$route.query.name ? this.$route.query.name : this.$route.meta.title
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.save-btn {
  color: #409EFF;
}
</style>
