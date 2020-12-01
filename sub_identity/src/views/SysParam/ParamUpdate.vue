<template>
  <div>
    <el-form ref="form" :model="param" :rules="rules" label-width="120px">
      <el-form-item label="键" prop="sys_key">
        <el-input id="sys_key" v-model="param.sys_key" :disabled="true"/>
      </el-form-item>
      <el-form-item label="值" prop="sys_value">
        <el-input id="sys_value" type="textarea" autosize v-model="param.sys_value" />
      </el-form-item>
      <el-form-item label="说明" prop="summary">
        <el-input id="summary" v-model="param.summary" :disabled="true"/>
      </el-form-item>
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
    param: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param_id = this.param.param_id
          const sys_value = this.param.sys_value
          this.$Apis.sysControl.ParamUpdate(param_id, sys_value).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
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
