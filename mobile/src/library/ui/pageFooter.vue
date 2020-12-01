<template>
  <footer class="footer">
    <van-tabbar route placeholder>
      <van-tabbar-item replace to="/" icon="home-o">
        首页
      </van-tabbar-item>
      <template v-for="(menu, index) in permission_menus">
        <template v-if="index < 3">
          <van-tabbar-item :key="index" replace :to="{ path: menu.uri, query: { code: menu.menu_code } }">
            {{ menu.meta.title }}
            <template #icon>
              <i :class="menu.meta.icon || 'el-icon-menu'" />
            </template>
          </van-tabbar-item>
        </template>
      </template>
      <van-tabbar-item replace :to="{ name: 'user-center' }" icon="contact">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </footer>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageFooter',
  computed: {
    ...mapGetters([
      'permission_menus'
    ])
  }
}
</script>
<style lang="scss" scoped>
// footer {
//   height: 50px;
// }
</style>
