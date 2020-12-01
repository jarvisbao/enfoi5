<template>
  <div class="qk-navbar">
    <!-- <theme-picker/> -->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div class="user-avatar">
          <img :src="avatar">
        </div>
        <span class="name">{{ name }}</span>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" :to="{name: 'user-center'}">
          <el-dropdown-item>
            <svg-icon icon-class="user_center" />个人中心
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" :to="{name: 'widget_index'}">
          <el-dropdown-item>
            <svg-icon icon-class="home" />管理主页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item>
          <div @click="clear_cache">
            <i class="el-icon-refresh" style="margin-right: 12px;font-size: 20px;vertical-align: -3px;" />清理缓存
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <div @click="logout">
            <svg-icon icon-class="logout" />退出
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import themePicker from '@/components/themePicker'

export default {
  // components: {
  //   themePicker
  // },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    clear_cache() {
      this.$store.dispatch('ClearCache')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qk-navbar {
  display: flex;
  align-items: center;
  .avatar-container {
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      line-height: initial;
      display: flex;
      align-items: center;
      .user-avatar {
        width: 35px;
        height: 35px;
        margin-right: 10px;
        background: #fff;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
        }
      }
      .name {
        color: #ecf0f5;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.user-dropdown .el-dropdown-menu__item {
  padding: 0 40px 0 20px;
  color: #666;
  .svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    vertical-align: -5px;
  }
}
.user-dropdown .el-dropdown-menu__item--divided {
  border-color: #eee;
  &:before {
    margin: 0 -40px 0 -20px;
  }
}
</style>

