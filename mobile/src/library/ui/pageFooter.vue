<template>
  <footer class="footer">
    <van-tabbar v-model="active" placeholder>
      <van-tabbar-item replace to="/" icon="home-o" name="home" @click="handleClick('home')">
        首页
      </van-tabbar-item>
      <template v-for="(menu, index) in permission_menus">
        <van-tabbar-item :key="index" replace :to="{ path: menu.uri, query: { code: menu.menu_code, label: menu.label } }" :name="menu.menu_code" @click="handleClick(menu.menu_code)">
          {{ menu.meta.title }}
          <template #icon>
            <i :class="menu.meta.icon || 'el-icon-menu'" />
          </template>
        </van-tabbar-item>
      </template>
      <van-tabbar-item replace :to="{ name: 'user-center' }" icon="contact" name="user" @click="handleClick('user')">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </footer>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageFooter',
  data() {
    return {
      active: 'home'
    }
  },
  computed: {
    ...mapGetters([
      'permission_menus',
      'tabbar_active'
    ])
  },
  watch: {
    tabbar_active: {
      handler(val) {
        this.active = val
      }
    }
  },
  created() {
    this.active = this.tabbar_active
  },
  methods: {
    handleClick(name) {
      this.$store.commit('SET_TABBER_ACTIVE', name)
    }
  }
}
</script>
<style lang="scss" scoped>
// footer {
//   height: 50px;
// }
</style>
