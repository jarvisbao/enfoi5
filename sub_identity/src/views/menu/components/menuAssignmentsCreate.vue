<template>
  <div>
    <el-form ref="form" :model="assignments" :rules="rules" label-width="130px">
      <el-form-item label="菜单名称" prop="action_label">
        <el-input id="title" v-model="title" :disabled="true" />
      </el-form-item>
      <el-form-item label="选择角色" prop="role">
        <el-select id="role" v-model="assignments.role" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择角色">
          <el-option
            v-for="item in roles_list"
            :key="item.role_code"
            :label="item.role_name"
            :value="item.role_code"
          >
            <span style="float: left">{{ item.role_name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
          </el-option>
        </el-select>
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
    menu_code: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      assignments: {
        role_id: null,
        action_label: null,
        role: null
      },
      roles_list: [],
      rules: {
        role: { required: true, message: '请选择角色', trigger: 'change' }
      },
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      text: null,
      searchLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const menu_code = this.menu_code
          const role_code = this.assignments.role
          this.loading = true
          this.$Apis.menu.menu_assignments(menu_code, role_code).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
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
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    },
    loadMore() {
      this.pagination.page++
      if (this.pagination.page <= this.pageCount) {
        this.getList()
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.role.role_list(null, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.roles_list = [...this.roles_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.roles_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.roles_list = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
