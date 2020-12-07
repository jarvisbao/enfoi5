<template>
  <section>
    <van-sticky>
      <header class="main-header">
        盈丰软件
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
      'permission_menus'
    ])
  },
  created() {
  },
  methods: {
    routeGo(item) {
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
