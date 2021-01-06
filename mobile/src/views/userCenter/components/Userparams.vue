<template>
  <div class="user-params">
    <div class="top-save" @click="submit">
      保存
    </div>
    <van-form ref="forms">
      <van-field
        v-model="user_info.company_title"
        clearable
        name="company_title"
        label="公司名称"
      />
      <van-field
        v-model="user_info.company_logo"
        clearable
        name="company_logo"
        label="公司标志"
        placeholder="请填写该标志在服务器中的路径"
      />
    </van-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      user_info: {}
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  created() {
    this.user_info = this.userinfo
  },
  methods: {
    submit() {
      this.$refs.forms.validate().then(() => {
        this.$Apis.user.user_update_props(null, this.user_info.company_title, this.user_info.company_logo).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.$toast({
              message: '提交成功',
              forbidClick: true,
              onClose: () => {
                this.$Apis.user.param_info_by_key_openid('company_title').then(res => {
                  if (res.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                    if (res.payload) {
                      this.$store.commit('SET_COMPANY_TITLE', res.payload)
                    } else {
                      this.$store.commit('SET_COMPANY_TITLE', '盈丰软件')
                    }
                  }
                })
                this.$Apis.user.param_info_by_key_openid('company_logo').then(res => {
                  if (res.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                    if (res.payload) {
                      this.$store.commit('SET_COMPANY_LOGO', res.payload)
                    } else {
                      this.$store.commit('SET_COMPANY_LOGO', '')
                    }
                  }
                })
              }
            })
          } else {
            this.$dialog.alert({
              message: response.message
            })
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
