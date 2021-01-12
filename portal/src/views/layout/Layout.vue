<template>
  <div class="master-app-wrapper" :style="{'background': inIframe ? '#fff' : 'transparent'}" v-wechat-title="company_title">
    <div v-if="!inIframe" class="master-topbar-container">
      <router-link :to="{name: 'index'}" class="logo">
        <img v-if="company_logo" :src="require(`@/assets/images/${company_logo}`)" class="company_logo">
        <svg-icon v-else-if="company_title === '盈丰软件'" icon-class="logo" class="logo-svg" />
        {{ company_title }}
      </router-link>
      <topbar />
      <navbar />
    </div>
    <div class="master-main-container">
      <section v-if="!content" class="qk-app-main">
        <div>
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="isShow" :key="$route.fullPath" />
          </transition>
        </div>
      </section>
      <section v-else :class="classObj" class="qk-container">
        <sidebar v-if="!inIframe" class="sidebar-container" />
        <transition name="fade-transform" mode="out-in">
          <div v-if="content" v-html="content" />
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
import { Navbar, Topbar, Sidebar } from './components'
import { mapGetters } from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Topbar,
    Sidebar
  },
  mixins: [ResizeMixin],
  props: {
    content: String,
    loading: Boolean
  },
  data() {
    return {
      isShow: true,
      inIframe: false
    }
  },
  // 提供可注入子组件属性
  provide() {
    return {
      reload: this.reload
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'company_title',
      'company_logo'
    ])
  },
  created() {
    if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
      this.inIframe = true
    }
  },
  methods: {
    reload() {
      this.isShow = false
      this.$nextTick(() => {
        this.isShow = true
      })
    }
    // handleClickOutside() {
    //   this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/library/styles/mixin.scss';
  @import url('//at.alicdn.com/t/font_1321656_qrlhtqp5ah.css');
  .master-app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .qk-container {
    & /deep/ #app .sidebar-container {
      top: 42px;
    }
  }
  .qk-app-main {
    min-height: calc(100vh - 42px);
    position: relative;
    overflow: hidden;
  }
</style>
