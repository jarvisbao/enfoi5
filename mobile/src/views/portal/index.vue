<template>
  <section>
    <van-sticky>
      <header class="main-header">
        {{ company_title }}
      </header>
    </van-sticky>
    <div class="main-portal">
      <div class="container">
        <div v-if="permission_menus && permission_menus.length > 0" class="grid">
          <van-grid :border="false" :column-num="5">
            <van-grid-item v-for="(item, index) in permission_menus" :key="index" @click="routeGo(item)">
              <template #icon>
                <i :class="[item.icon || 'el-icon-menu', 'color_' + parseInt(Math.random(0, 1) * 3)]" />
              </template>
              <template #text>
                <div class="text">
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <!-- <portal-widget /> -->
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      text: null,
      active: null
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'permission_menus',
      'company_title'
    ])
  },
  created() {
  },
  methods: {
    routeGo(item) {
      this.$store.commit('SET_TABBER_ACTIVE', item.menu_code)
      if (item.uri === '/grid') {
        this.$router.push({ path: item.uri, query: { code: item.menu_code, label: item.label }})
      } else {
        this.$router.push({ path: item.uri })
      }
      // this.$router.push({ path: item.uri })
    }
  }
}
</script>
