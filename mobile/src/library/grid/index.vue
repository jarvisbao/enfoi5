<template>
  <section>
    <van-sticky>
      <header class="main-header">
        {{ title }}
      </header>
    </van-sticky>
    <div class="main-portal">
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
      code: null,
      title: null
    }
  },
  created() {
    this.code = this.$route.query.code || null
    this.title = this.$route.query.label || null
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
        this.$router.push({ path: menu.uri, query: { code: menu.menu_code, label: menu.label }})
      } else {
        this.$router.push({ path: menu.uri })
      }
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>
