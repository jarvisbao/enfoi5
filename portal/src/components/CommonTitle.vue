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
    this.getTitle()
  },
  methods: {
    recursionData(source) {
      for (var key in source) {
        this.menusTags.push(source[key])
        if (source[key].children) {
          this.recursionData(source[key].children)
        }
      }
    },
    getTitle() {
      this.recursionData(this.permission_menus)
      this.menusTags.forEach(item => {
        if (item.path === this.$route.fullPath) {
          this.metaTitle = item.title
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
