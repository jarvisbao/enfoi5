<template>
  <div class="app-container">
    <el-form ref="form" :model="organize" :rules="rules" label-width="150px">
      <el-form-item label="组织机构代码" prop="org_code">
        <el-input v-model="organize.org_code" :disabled="true" />
      </el-form-item>
      <el-form-item label="组织机构名称" prop="name">
        <el-input id="orgName" v-model="organize.name" />
      </el-form-item>
      <!-- <el-form-item label="组织机构属性">
        <el-input v-model="organize.props" type="textarea"/>
      </el-form-item> -->
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
    organize: {
      type: Object,
      default: function() {
        return {}
      }
    },
    showType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        org_code: { required: true, message: '请输入组织机构代码', trigger: 'blur' },
        name: { required: true, message: '请输入组织机构名称', trigger: 'blur' }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const org_code = this.organize.org_code
          const name = this.organize.name
          const props = this.organize.props
          this.loading = true
          this.$Apis.organize.organize_update(org_code, name, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  // this.$router.go(0)
                  this.resetForm()
                  if (this.showType === 0) {
                    this.$emit('refresh')
                  } else {
                    this.$Utils.EventBus.$emit('refreshTree', org_code) // 刷新树形数据
                  }
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
<style lang="scss" scoped>
.app-container .el-form {
  width: 80%;
}
</style>
