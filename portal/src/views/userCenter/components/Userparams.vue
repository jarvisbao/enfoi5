<template>
  <div class="userparams">
    <el-form ref="form" :model="userinfo" :rules="rules" label-width="120px">
      <el-form-item label="用户参数" prop="props">
        <el-input id="props" v-model="userinfo.props" type="textarea" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" type="danger" @click="submitForm('form')">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { user_update_props } from '@/library/api/user'
import { getInfo } from '@/library/api/login'
import { isJSON } from '@/library/js/validate'

export default {
  data() {
    var validateJson = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isJSON(value)) {
        callback(new Error('请输入正确的json格式!'))
      } else {
        callback()
      }
    }
    return {
      userinfo: {},
      rules: {
        props: [
          { validator: validateJson, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getInfo().then(response => {
      if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
        this.userinfo = response.payload
      }
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var openid = null
          user_update_props(openid, this.userinfo.props).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('提交成功', '标题名称', {
                confirmButtonText: '确定'
              })
            } else {
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
