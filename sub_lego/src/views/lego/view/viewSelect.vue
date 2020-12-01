<template>
  <div class="view-container">
    <el-form ref="form" :model="viewSelect">
      <el-form-item v-if="codemirror" prop="view_select">
        <python-codemirror :prop_code="viewSelect.view_select" :code-mode="mode" param-code="view_select" @get_code="get_code($event)" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          提交视图要素
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'

export default {
  components: {
    pythonCodemirror
  },
  data() {
    return {
      viewSelect: {},
      mode: 'sql',
      repo_name: null,
      class_name: null,
      codemirror: false,
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    get_code($event) {
      this.viewSelect.view_select = $event['view_select']
    },
    get_repo_name() {
      if ('repo_name' in this.$route.query) {
        this.repo_name = this.$route.query.repo_name
        return this.repo_name
      } else {
        return null
      }
    },
    get_class_name() {
      if ('name' in this.$route.query) {
        this.class_name = this.$route.query.name
        return this.class_name
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      const repo_name = this.get_repo_name()
      const class_name = this.get_class_name()
      this.$Apis.class.class_info(repo_name, class_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.loading = false
          this.viewSelect = response.payload
          this.viewSelect.view_select = response.payload.view_select ? response.payload.view_select : ''
          this.codemirror = true
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const repo_name = this.repo_name
          const cls_name = this.class_name
          const view_select = this.viewSelect.view_select
          this.$Apis.class.select_edit(repo_name, cls_name, view_select).then(response => {
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
<style lang="scss" scoped>
.el-form {
  width: 100%;
}
.view-container /deep/ .CodeMirror {
  min-height: calc(100vh - 400px)
}
</style>
