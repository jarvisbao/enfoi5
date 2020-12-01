<template>
  <div>
    <el-form ref="form" v-loading="loading" :model="attributes" :rules="rules" label-width="180px">
      <el-form-item label="属性名称" prop="attr_name">
        <el-input id="attrName" v-model="attributes.attr_name" />
      </el-form-item>
      <el-form-item label="属性显示名" prop="attr_label">
        <el-input id="attrLabel" v-model="attributes.attr_label" />
      </el-form-item>
      <el-form-item label="属性类型" prop="attr_type">
        <el-input id="attrType" v-model="attributes.attr_type" />
      </el-form-item>
      <el-form-item label="是否为子资源的属性" prop="is_children">
        <el-switch v-model="attributes.is_children" />
      </el-form-item>
      <el-form-item label="是否为本资源的属性" prop="is_self">
        <el-switch v-model="attributes.is_self" />
      </el-form-item>
      <el-form-item label="属性的保留字段">
        <el-input v-model="attributes.props" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    attributes: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        attr_name: { required: true, message: '请输入属性名称', trigger: 'blur' },
        attr_label: { required: true, message: '请输入属性显示名', trigger: 'blur' }
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const attr_name = this.attributes.attr_name
          const attr_label = this.attributes.attr_label
          const attr_type = this.attributes.attr_type
          const is_children = this.attributes.is_children
          const is_self = this.attributes.is_self
          const props = this.attributes.props
          const attr_id = this.attributes.attr_id
          this.loading = true
          this.$Apis.resource.attributes_update(attr_id, attr_name, attr_label, attr_type, is_children, is_self, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  // this.$router.go(0)
                  this.$emit('refresh', true)
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
    resetForm() {
      this.$emit('show', false)
    }
  }
}
</script>
