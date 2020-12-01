<template>
  <div class="app-container">
    <el-form ref="form" :model="item" :rules="rules" class="demo-form-inline" label-width="auto">
      <el-form-item label="组织机构职位名称" prop="role_name">
        <el-input v-model="item.role_name" id="postName"/>
      </el-form-item>
      <el-form-item label="组织机构职位编码" prop="code">
        <el-input v-model="item.code" id="postCode"/>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          添加
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
  },
  data() {
    return {
      item: {
        role_name: null,
        code: null
      },
      rules: {
        role_name: [
          { required: true, message: '请输入组织机构职位名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入组织机构职位编码名称', trigger: 'blur' }
        ]
      },
      org_code: null,
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
    }
  },
  created() {
    this.org_code = this.$route.query.org_code
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$Apis.organize.CreatePosition(this.org_code, this.item.role_name, this.item.code).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功', '提示', {
                dangerouslyUseHTMLString: true,
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
