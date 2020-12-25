<template>
  <div class="title-nav">
    <span class="title">{{ metaTitle ? metaTitle : title }}</span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      title: '',
      metaTitle: '',
      menusTags: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_menus'
    ])
  },
  created() {
    this.title = this.$route.meta.title
    // this.getTitle()
  },
  methods: {
    recursionData(source) {
      source.child_menus.forEach(item => {
        if (item.children) {
          this.recursionData(item.children)
        } else {
          this.menusTags.push(item)
        }
      })
    },
    getTitle() {
      this.recursionData(this.permission_menus)
      this.menusTags.forEach(item => {
        if (item.uri === this.$route.fullPath) {
          this.metaTitle = item.title
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title-nav {
  display: flex;
  margin-top: -20px;
  margin-bottom: 30px;
  color: #666666;
  border-bottom: 1px solid #eee;
  align-items: center;
  .title {
    position: relative;
    display: inline-block;
    padding: 18px 10px;
    color: #666666;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background: #ff333b;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
