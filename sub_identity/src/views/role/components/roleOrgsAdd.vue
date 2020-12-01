<template>
  <div>
    <el-form ref="form" :model="items" :rules="rules" class="demo-form-inline" label-width="120px">
      <el-form-item label="组织机构" prop="org">
        <el-select id="orgCode" v-model="items.org" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择组织机构">
          <el-option v-for="item in items.organize_list" :key="item.org_code" :label="item.name" :value="item.org_code" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加角色" prop="role">
        <el-input v-model="role_name" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          添加
        </el-button>
        <el-button id="cancel" plain @click="resetForm()">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    role_code: {
      type: String,
      default: ''
    },
    role_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        roles_list: [],
        organize_list: [],
        org: ''
      },
      rules: {
        org: [
          { required: true, message: '选择组织机构', trigger: 'change' }
        ]
      },
      role_codes: [],
      // org_id: '',
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const org_code = this.items.org
          const role_codes = [this.role_code]
          this.$Apis.organize.organize_roles_add(org_code, role_codes).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm()
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
          // this.$alert('error submit', '提示', {
          //   confirmButtonText: '确定'
          // })
          return false
        }
      })
    },
    resetForm() {
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
      this.$Apis.organize.organize_list(null, null, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.items.organize_list = [...this.items.organize_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.items.organize_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.items.organize_list = []
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
