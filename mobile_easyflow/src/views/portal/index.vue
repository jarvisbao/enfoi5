<template>
  <section>
    <page-header />
    <div class="portal">
      <div class="container">
        <div class="grid">
          <van-grid :border="false" :column-num="5">
            <van-grid-item v-for="(item, index) in permission_menus" :key="index" @click="routeGo(item)">
              <template #icon>
                <i :class="[item.icon, 'color_' + parseInt(Math.random(0, 1) * 3)]" class="iconfont" />
              </template>
              <template #text>
                <div class="text">
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <portal-widget />
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
      if (item.url === '/grid') {
        this.$router.push({ path: item.url, query: { code: item.code }})
      } else {
        this.$router.push({ path: item.url })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.portal {
  min-height: calc(100vh - 58px);
  background: #f3f3f3;

  .container {
    padding-top: 20px;
    .grid {
      margin-bottom: 20px;
    }
    & /deep/ .van-grid-item__content {
      background: transparent;
    }
    .all {
      i {
        color: rgb(182, 182, 182);
      }
    }
  }
}
</style>
