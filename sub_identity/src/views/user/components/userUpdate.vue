<template>
  <div>
    <el-form ref="form" :model="user" :rules="rules" label-width="120px">
      <el-form-item label="姓" prop="last_name">
        <el-input id="lastName" v-model="user.last_name" />
      </el-form-item>
      <el-form-item label="名" prop="first_name">
        <el-input id="firstName" v-model="user.first_name" />
      </el-form-item>
      <el-form-item label="出生日期">
        <el-col>
          <el-date-picker id="birth" v-model="user.birthday" type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" />
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="身份证号码" prop='ssh'>
        <el-input v-model="user.ssh"></el-input>
      </el-form-item> -->
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="user.gender">
          <el-radio id="male" label="male">
            男
          </el-radio>
          <el-radio id="female" label="female">
            女
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="扩展属性">
        <el-input v-model="user.props" type="textarea"/>
      </el-form-item> -->
      <el-form-item>
        <el-button id="submit" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('form')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        first_name: { required: true, message: '请输入名', trigger: 'blur' },
        last_name: { required: true, message: '请输入姓', trigger: 'blur' },
        gender: { required: true, message: '请选择性别', trigger: 'blur' }
        // ssh: {validator: check_shh, trigger: 'blur'}
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const openid = this.user.openid
          const first_name = this.user.first_name
          const last_name = this.user.last_name
          const gender = this.user.gender
          // let ssh = this.user.ssh
          const props = this.user.props
          const birthday = this.user.birthday
          this.$Apis.user.user_update(openid, gender, birthday, last_name, first_name, props).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  // this.$router.go(0)
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          this.$alert('error submit!!', '提示', {
            confirmButtonText: '确定'
          })
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
