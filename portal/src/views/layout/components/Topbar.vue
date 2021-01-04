<template>
  <el-menu
    ref="elTopMenu"
    :show-timeout="200"
    text-color="#fff"
    mode="horizontal"
    unique-opened
    class="el-menu-top"
  >
    <template v-for="menu in permission_menus.slice(0, sliceIndex)">
      <router-link :key="menu.menu_code" :to="{path: menu.uri, query: {menu_code: menu.menu_code}}" :menu_code="menu.menu_code" :class="{active: code === menu.menu_code}" exact @click.native="goto(menu)">
        <el-menu-item :index="menu.menu_code">
          {{ menu.label }}
        </el-menu-item>
      </router-link>
    </template>

    <template v-if="sliceIndex < permission_menus.length">
      <el-dropdown>
        <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right" /></span>
        <el-dropdown-menu slot="dropdown" ref="dropdownMenu">
          <el-dropdown-item v-for="(item, index) in permission_menus.slice(sliceIndex)" :key="index">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { access_menus } from '@/library/api/menu.js'

export default {
  data() {
    return {
      menus: [],
      code: null,
      sliceIndex: 20,
      widthList: [],
      totalW: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_menus'
    ])
  },
  watch: {
    $route: {
      handler(val) {
        const parentCode = this.$Utils.util.getParentCode(this.permission_menus, data => data.uri === decodeURI(this.$route.fullPath), [])
        this.code = parentCode[0]
      },
      immediate: true
    }
  },
  created() {
    this.sliceIndex = this.permission_menus.length
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler)
    this.$nextTick(() => {
      this.$refs.elTopMenu.$el.children.forEach(item => {
        this.widthList.push(item.clientWidth)
        this.totalW += item.clientWidth
      })
      this.resizeHandler()
    })
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
    },
    resizeHandler() {
      const clientRect = this.$refs.elTopMenu.$el.getBoundingClientRect().width
      if (this.totalW > clientRect) {
        let allW = 0
        this.widthList.some((item, index) => {
          allW += item
          if (allW >= clientRect) {
            this.sliceIndex = index - 1
            return true
          }
        })
      }
    }
  }
}
</script>
