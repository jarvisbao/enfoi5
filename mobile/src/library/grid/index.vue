<template>
  <section>
    <page-header />
    <div class="portal">
      <div class="container">
        <div class="grid">
          <van-grid :border="false" :column-num="5">
            <van-grid-item v-for="(menu, index) in menus" :key="index" @click="routeGo(menu)">
              <template #icon>
                <i :class="[menu.meta.icon || 'el-icon-menu', 'color_' + parseInt(Math.random(0, 1) * 3)]" />
              </template>
              <template #text>
                <div class="text">
                  <span>{{ menu.meta.title }}</span>
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
      code: null
    }
  },
  created() {
    this.code = this.$route.query.code || null
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
        this.$router.push({ path: menu.uri, query: { code: menu.menu_code }})
      } else {
        this.$router.push({ path: menu.uri })
      }
    }
  }
}
</script>
