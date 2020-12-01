<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :default-active="$route.path"
      :default-openeds="openeds"
      mode="vertical"
      unique-opened
      class="sidebar-menu"
    >
      <sidebar-item v-for="menu in permission_child_menus" :key="menu.menu_code" :item="menu" :base-path="menu.uri" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/library/styles/variables.scss'
import SidebarItem from './SidebarItem'
import { access_menus } from '@/library/api/menu.js'

export default {
  components: { SidebarItem },
  data() {
    return {
      openeds: [],
      menu_code: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_child_menus',
      'permission_menus'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.fullPath !== '/' && val.query.menu_code) {
          const menu_code = val.query.menu_code
          this.getChildMenu(menu_code)
        }
      }
    },
    permission_menus: {
      handler(val) {
        if (val.length > 0) {
          const menu_code = sessionStorage.getItem('menu_code')
          if (menu_code === null) {
            this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
          } else {
            this.getChildMenu(menu_code)
          }
        }
      }
    }
  },
  methods: {
    getChildMenu(menu_code) {
      if (this.permission_child_menus.length < 1) {
        this.permission_menus.forEach(item => {
          if (item.menu_code === menu_code && item.children) {
            this.$store.commit('SET_CHILD_MENUS', item.children)
          }
        })
        if (this.permission_child_menus.length < 1) {
          this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
          this.openeds = []
        } else {
          this.$store.dispatch('OpenSidebar', { withoutAnimation: true })
          // this.openeds.push(this.permission_child_menus[0].menu_code)
        }
      } else {
        this.$store.dispatch('OpenSidebar', { withoutAnimation: true })
        // this.openeds.push(this.permission_child_menus[0].menu_code)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar-menu {
  & /deep/ .el-submenu__title {
    background: #383d41 !important;
  }
}
</style>
