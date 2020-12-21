<template>
  <section>
    <van-sticky>
      <header class="main-header">
        <div style="display: flex" @click="goBack">
          <van-icon v-if="isBack" name="arrow-left" color="#1989fa" size="16px" style="margin-right: 6px" />
          {{ title }}
        </div>
      </header>
    </van-sticky>
    <div class="main-portal">
      <div class="container">
        <div class="grid">
          <van-grid :border="false">
            <van-grid-item v-for="(menu, index) in menus" :key="index" @click="routeGo(menu)">
              <template #icon>
                <i :class="[menu.icon || 'el-icon-menu']" />
              </template>
              <template #text>
                <div class="text">
                  <span>{{ menu.label }}</span>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      menus: [],
      code: null,
      title: null,
      isBack: false
    }
  },
  created() {
    this.code = this.$route.query.code || null
    this.title = this.$route.query.label || null
    this.isBack = this.$route.query.back || false
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$Apis.menu.menu_list(this.code, undefined, undefined, undefined, undefined, 'mobile').then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.menus = response.payload.items
        }
      })
    },
    routeGo(menu) {
      if (menu.uri === '/grid') {
        this.$router.push({ path: menu.uri, query: { code: menu.menu_code, label: menu.label, back: true }})
      } else {
        this.$router.push({ path: menu.uri })
      }
    },
    goBack() {
      if (this.isBack) {
        this.$router.go(-1)
      }
    }
  }
}
</script>
