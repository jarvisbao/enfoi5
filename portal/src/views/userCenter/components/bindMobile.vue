<template>
  <div class="bind-email">
    <el-form ref="bindmobile" :model="mobile" :rules="rules" label-width="120px">
      <el-form-item label="手机号" prop="mobile">
        <el-input id="mobile" v-model="mobile.mobile" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('bindmobile')">
          绑定
        </el-button>
        <el-button id="cancel" plain @click.stop="resetForm('bindmobile')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    timeDown: {
      type: Function,
      default: null
    },
    sendCode: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      mobile: {
        mobile: '',
        code: null
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // send() {
    //   this.$refs.bindemail.validateField('email', valid => {
    //     if (valid) {
    //       this.$alert(valid, '标题名称', {
    //         confirmButtonText: '确定'
    //       })
    //     } else {
    //       this.sendCode.sending = false
    //       this.sendCode.disabled = true
    //       this.$emit('timeDown')
    //       security_captcha_send2email(this.email.email).then(response => {
    //         if (response.code !== this.$Utils.Constlib.ERROR_CODE_OK) {
    //           this.$alert(response.message, '标题名称', {
    //             confirmButtonText: '确定'
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$Apis.user.user_loginid_create_mobile(this.mobile.mobile).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$emit('setMobile', this.mobile.mobile)
              this.resetForm('bindmobile')
              this.loading = false
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #4a9ff8;
$bg_disabled: #bed5ed;
.bind-email .el-form {
  width: 90%;
  .send-btn {
    width: 160px;
    margin-left: 20px;
    padding: 0;
    background: $bg;
    border-color: $bg;
    color: #fff;
    &:disabled {
      background: $bg_disabled;
      border-color: $bg_disabled;
    }
  }
}
</style>
