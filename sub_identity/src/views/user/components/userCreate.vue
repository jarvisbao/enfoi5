<template>
  <div>
    <el-form ref="form" :model="user" :rules="rules" label-width="120px">
      <el-form-item label="姓" prop="last_name">
        <el-input id="lastName" v-model="user.last_name" />
      </el-form-item>
      <el-form-item label="名" prop="first_name">
        <el-input id="firstName" v-model="user.first_name" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname" auto-complete="off">
        <el-input id="nickname" v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input id="pass" v-model="user.password" :type="pwdType" auto-complete="new-password" @focus="checkType" />
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
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即创建
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
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 5) {
          return callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
    }
    return {
      user: {
        nickname: null,
        password: '',
        first_name: null,
        last_name: null,
        gender: null,
        birthday: null,
        // ssh: null,
        props: null
      },
      rules: {
        password: { required: true, trigger: 'blur', validator: validatePass },
        first_name: { required: true, message: '请输入名', trigger: 'blur' },
        last_name: { required: true, message: '请输入姓', trigger: 'blur' },
        nickname: { required: true, message: '请输入昵称', trigger: 'blur' },
        gender: { required: true, message: '请选择性别', trigger: 'blur' }
        // ssh: {validator: check_shh, trigger: 'blur'}
      },
      loading: false,
      pwdType: 'password'
    }
  },
  created() {
    this.pwdType = 'text'
  },
  methods: {
    checkType() {
      this.pwdType = 'password'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const nickname = this.user.nickname
          const first_name = this.user.first_name
          const last_name = this.user.last_name
          const gender = this.user.gender
          const password = this.user.password
          // let ssh = this.user.ssh
          const props = this.user.props
          const birthday = this.user.birthday
          this.loading = true
          this.$Apis.user.user_create(nickname, first_name, last_name, gender, password, birthday, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
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
