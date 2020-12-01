<template>
  <div>
    <section v-if="!content" class="app-main">
      <div>
        <router-view v-if="isShow" :key="$route.fullPath" />
      </div>
    </section>
    <section v-else class="app-main">
      <div v-if="content" v-html="content" />
    </section>
    <page-footer />
  </div>
</template>

<script>
import PageFooter from '../../library/ui/pageFooter'
export default {
  name: 'Layout',
  components: { PageFooter },
  props: {
    content: String,
    loading: Boolean
  },
  data() {
    return {
      isShow: true
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import url("//at.alicdn.com/t/font_1321656_qrlhtqp5ah.css");
.app-main {
  // min-height: calc(100vh);
}
</style>
