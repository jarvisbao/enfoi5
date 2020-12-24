<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本资料" name="first">
        <userinfo />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second">
        <changepassword />
      </el-tab-pane>
      <el-tab-pane label="用户参数" name="third">
        <userparams />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Userinfo from './components/Userinfo'
import Changepassword from './components/Changepassword'
import Userparams from './components/Userparams'

export default {
  components: {
    Userinfo,
    Changepassword,
    Userparams
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

