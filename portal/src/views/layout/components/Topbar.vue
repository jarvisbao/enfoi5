<template>
  <el-menu
    :show-timeout="200"
    text-color="#fff"
    mode="horizontal"
    unique-opened
    class="el-menu-top"
  >
    <template v-for="menu in permission_menus">
      <router-link :key="menu.menu_code" :to="{path: menu.uri, query: {menu_code: menu.menu_code}}" :menu_code="menu.menu_code" exact @click.native="goto(menu)">
        <el-menu-item :index="menu.menu_code">
          {{ menu.label }}
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { access_menus } from '@/library/api/menu.js'

export default {
  data() {
    return {
      menus: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_menus'
    ])
  },
  methods: {
    goto(menu) {
      sessionStorage.setItem('menu_code', menu.menu_code)
      if (menu.children) {
        this.$store.commit('SET_CHILD_MENUS', menu.children)
        if (menu.children.length < 1) {
          this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
        } else {
          this.$store.dispatch('OpenSidebar', { withoutAnimation: true })
        }
      } else {
        this.$store.commit('SET_CHILD_MENUS', [])
        this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
      }
    }
  }
}
</script>
