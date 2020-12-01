<template>
  <div>
    <el-form ref="form" :model="repoView" :rules="rules" label-width="130px">
      <el-form-item label="类名称" prop="cls_name">
        <el-input id="clsName" v-model="repoView.cls_name" />
      </el-form-item>
      <el-form-item label="视图名称" prop="cls_view">
        <el-input id="clsView" v-model="repoView.cls_view" />
      </el-form-item>
      <el-form-item label="视图描述">
        <el-input id="clsComment" v-model="repoView.cls_comment" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即添加
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
    repo_name: {
      type: String,
      default: ''
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
      repoView: {
        cls_name: null,
        cls_view: null,
        cls_comment: null
      },
      rules: {
        cls_name: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
        cls_view: [{ required: true, validator: validateClstable, trigger: 'blur' }]
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
          const cls_name = this.repoView.cls_name
          const cls_view = this.repoView.cls_view
          const cls_comment = this.repoView.cls_comment
          this.$Apis.class.class_create(repo_name, cls_name, cls_view, cls_comment, true).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('新建成功!', '提示', {
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

