<template>
  <div>
    <el-form ref="form" :model="copy_data" label-width="130px">
      <el-form-item label="新对象名称" prop="cls_name">
        <el-input id="pageName" v-model="copy_data.new_object_name" />
      </el-form-item>
      <el-form-item label="新对象代码" prop="cls_table">
        <el-input id="pageCode" v-model="copy_data.new_object_code" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          确定
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
    copy_data: {
      type: Object,
      default: function() {
        return {
          new_object_code: null,
          new_object_name: null,
          object_code: null,
          proj_code: null
        }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const proj_code = this.copy_data.proj_code
          const new_object_code = this.copy_data.new_object_code
          const new_object_name = this.copy_data.new_object_name
          const object_code = this.copy_data.object_code
          this.$Apis.object.object_copy(proj_code, object_code, new_object_name, new_object_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('复制成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                }
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

