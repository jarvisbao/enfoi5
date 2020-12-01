<template>
  <div>
    <el-form ref="form" :model="repoView" :rules="rules" label-width="130px">
      <el-form-item label="类名称" prop="cls_name">
        <el-input id="clsName" v-model="repoView.cls_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="视图名称" prop="cls_table">
        <el-input id="clsView" v-model="repoView.cls_table" :disabled="true" />
      </el-form-item>
      <el-form-item label="视图描述">
        <el-input id="clsComment" v-model="repoView.cls_comment" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
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
    repoView: {
      type: Object,
      default() {
        return {}
      }
    },
    old_view_name: {
      type: String,
      default: null
    },
    repo_name: {
      type: String,
      default: null
    }
  },
  data() {
    var validateClstable = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入视图名称'))
      } else if (value.toLowerCase() !== this.repoView.cls_name.toLowerCase()) {
        callback(new Error('视图名称与类名称不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        cls_name: [{ required: true, message: '请输入类名称', trigger: 'blur' }],
        cls_table: [{ required: true, validator: validateClstable, trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const repo_name = this.repo_name
          const old_view_name = this.old_view_name
          const cls_name = this.repoView.cls_name
          const cls_table = this.repoView.cls_table
          const cls_comment = this.repoView.cls_comment
          this.$Apis.class.class_edit(repo_name, old_view_name, cls_name, cls_table, cls_comment).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
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
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show')
    }
  }
}
</script>
