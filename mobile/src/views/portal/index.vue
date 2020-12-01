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
                <i v-if="item.icon" :class="[item.icon, 'color_' + parseInt(Math.random(0, 1) * 3)]" />
                <i v-else class="el-icon-menu" />
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
      // if (item.url === '/grid') {
      //   this.$router.push({ path: item.url, query: { code: item.code }})
      // } else {
      //   this.$router.push({ path: item.url })
      // }
      this.$router.push({ path: item.uri })
    }
  }
}
</script>
