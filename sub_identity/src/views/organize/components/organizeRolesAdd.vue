<template>
  <div class="app-container">
    <el-form ref="form" :model="items" :rules="rules" class="demo-form-inline" label-width="120px">
      <el-form-item label="组织机构">
        <el-input v-model="org_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="添加角色" prop="role">
        <el-select id="role" v-model="items.role" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote multiple placeholder="请选择角色">
          <el-option
            v-for="item in items.roles_list"
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
    organize_roles_list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      items: {
        roles_list: [],
        organize_info: {},
        role: []
      },
      rules: {
        role: [
          { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      role_codes: [],
      org_code: '',
      loading: false,
      org_name: null,
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
  created() {
    this.fetchData()
  },
  mounted() {
    this.getList()
  },
  methods: {
    get_org_code() {
      if ('org_code' in this.$route.query) {
        this.org_code = this.$route.query.org_code
        return this.org_code
      } else {
        return null
      }
    },
    get_org_name() {
      if ('name' in this.$route.query) {
        this.org_name = this.$route.query.name
        return this.org_name
      } else {
        return null
      }
    },
    fetchData() {
      this.get_org_name()
      this.get_org_code()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const org_code = this.org_code
          const role_codes = this.items.role
          this.$Apis.organize.organize_roles_add(org_code, role_codes).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const count = response.payload.count
              this.$alert('<p>新建成功!</p>一共新建了' + count + '个角色', '提示', {
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
          // this.$alert('error submit', '提示', {
          //   confirmButtonText: '确定'
          // })
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
          this.items.roles_list = [...this.items.roles_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.items.roles_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.items.roles_list = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>
