<template>
  <div class="bind-email">
    <el-form ref="bindemail" :model="email" :rules="rules" label-width="120px">
      <el-form-item label="邮箱" prop="email">
        <el-input id="email" v-model="email.email" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input id="code" v-model="email.code" />
        <el-button id="send" :disabled="sendCode.disabled" class="send-btn" @click="send">
          <template v-if="sendCode.sending">
            发送验证码
          </template>
          <template v-else>
            {{ sendCode.second }}秒后可重试
          </template>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('bindemail')">
          绑定
        </el-button>
        <el-button id="cancel" plain @click.stop="resetForm('bindemail')">
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
      email: {
        email: '',
        code: null
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ]
      }
    }
  },
  methods: {
    send() {
      this.$refs.bindemail.validateField('email', valid => {
        if (valid) {
          this.$alert(valid, '标题名称', {
            confirmButtonText: '确定'
          })
        } else {
          this.sendCode.sending = false
          this.sendCode.disabled = true
          this.$emit('timeDown')
          this.$Apis.email.security_captcha_send2email(this.email.email).then(response => {
            if (response.code !== this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert(response.message, '标题名称', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const captcha = this.email.code
          this.$Apis.security.captcha_test(captcha).then(response => {
            var data = response
            if (data.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              if (data['payload']['test']) {
                this.$Apis.email.user_loginid_create_email(this.email.email).then(response => {
                  if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                    this.$emit('setEmail', this.email.email)
                    this.resetForm('bindemail')
                  } else {
                    this.$alert(response.message, '标题名称', {
                      confirmButtonText: '确定'
                    })
                  }
                })
              }
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
