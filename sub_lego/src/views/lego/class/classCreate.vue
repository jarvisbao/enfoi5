<template>
  <div>
    <el-form ref="form" :model="repoClass" :rules="rules" label-width="130px">
      <el-form-item label="类名称" prop="cls_name">
        <el-input id="clsName" v-model="repoClass.cls_name" />
      </el-form-item>
      <el-form-item label="表名称" prop="cls_table">
        <el-input id="clsTabel" v-model="repoClass.cls_table" />
      </el-form-item>
      <el-form-item label="表描述">
        <el-input id="clsComment" v-model="repoClass.cls_comment" type="textarea" />
      </el-form-item>
      <el-form-item label="版本控制">
        <el-switch v-model="repoClass.versioned" />
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
        callback(new Error('请输入表名称'))
      } else if (value.toLowerCase() !== this.repoClass.cls_name.toLowerCase()) {
        callback(new Error('表名称与类名称不一致!'))
      } else {
        callback()
      }
    }
    return {
      repoClass: {
        cls_name: null,
        cls_table: null,
        cls_comment: null,
        props: null,
        versioned: false
      },
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
          const cls_name = this.repoClass.cls_name
          const cls_table = this.repoClass.cls_table
          const cls_comment = this.repoClass.cls_comment
          const props = this.repoClass.props
          const versioned = this.repoClass.versioned
          this.$Apis.class.class_create(repo_name, cls_name, cls_table, cls_comment, false, props, versioned).then(response => {
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

