<template>
  <div class="userparams">
    <el-form ref="form" :model="user_info" :rules="rules" label-width="120px">
      <el-form-item label="公司名称" prop="company_title">
        <el-input id="company_title" v-model="user_info.company_title" />
      </el-form-item>
      <el-form-item label="公司标志" prop="company_logo">
        <el-input id="company_logo" v-model="user_info.company_logo" />
        <div class="tips">
          请填写该标志在服务器中的路径
        </div>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    var validateJson = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!this.$Utils.validate.isJSON(value)) {
        callback(new Error('请输入正确的json格式!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      user_info: {},
      rules: {
        props: [
          { validator: validateJson, trigger: 'blur' }
        ]
      }
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var openid = null
          this.$Apis.user.user_update_props(openid, this.user_info.company_title, this.user_info.company_logo).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('提交成功', '标题名称', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                  this.$Apis.user.param_info_by_key_openid('company_title').then(res => {
                    if (res.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                      if (res.payload) {
                        this.$store.commit('SET_COMPANY_TITLE', res.payload)
                      }else{
                        this.$store.commit('SET_COMPANY_TITLE', '盈丰软件')
                      }
                    }
                  })
                  this.$Apis.user.param_info_by_key_openid('company_logo').then(res => {
                    if (res.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                      if (res.payload) {
                        this.$store.commit('SET_COMPANY_LOGO', res.payload)
                      }else{
                        this.$store.commit('SET_COMPANY_LOGO', '')
                      }
                    }
                  })
                }
              })
            } else {
              this.loading = false
              this.$alert(response.message, '标题名称', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.userparams {
  width: 50%;
  margin: 85px auto 0;
}
</style>
