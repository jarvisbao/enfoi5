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
        <router-view v-if="!content" ref="childView" :key="$route.fullPath" />
        <div v-else-if="content" v-html="content" />
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
  props: {
    content: String,
    loading: Boolean
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
