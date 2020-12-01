<template>
  <div class="app-container">
    <el-form ref="form" :model="items" :rules="rules" class="demo-form-inline" label-width="100px">
      <el-form-item label="组织机构" prop="org">
        <el-input v-model="org_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="选择群组" prop="group">
        <el-input v-model="group_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="添加角色" prop="role">
        <el-select id="role" v-model="items.role" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote multiple placeholder="请选择角色" @focus="handleFocus">
          <el-option
            v-for="item in items.role_list"
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
        <el-button id="cancel" plain @click="resetFrom">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    group_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        role_list: [],
        role: []
      },
      rules: {
        role: [
          { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      role_ids: [],
      show: false,
      role_show: false,
      loading: false,
      org_name: null,
      group_name: null,
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
    // this.getList()
  },
  methods: {
    get_org_code() {
      if ('org_code' in this.$route.query) {
        const org_code = this.$route.query.org_code
        return org_code
      } else {
        return null
      }
    },
    get_group_name() {
      if ('name' in this.$route.query) {
        this.group_name = this.$route.query.name
        return this.group_name
      } else {
        return null
      }
    },
    fetchData() {
      const org_code = this.get_org_code()
      this.get_group_name()
      this.$Apis.organize.organize_info(org_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.org_name = response.payload.name
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var group_id = this.group_id
          var role_ids = this.items.role
          this.$Apis.group.group_role_add(group_id, role_ids).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const count = response.payload.count
              this.$alert('<p>添加角色成功!</p>一共添加了' + count + '个角色', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                callback: action => {
                  this.resetFrom()
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
    resetFrom() {
      this.$emit('show', false)
    },
    handleFocus() {
      this.text = null
      this.getList()
    },
    loadMore() {
      if (this.pagination.page < this.pageCount) {
        this.pagination.page++
        this.getList()
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.role.role_list(null, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.items.role_list = [...this.items.role_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
        }
        // 去重
        var hash = {}
        this.items.role_list = this.items.role_list.reduce(function(item, next) {
          hash[next.role_id] ? '' : hash[next.role_id] = true && item.push(next)
          return item
        }, [])
        this.searchLoading = false
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        // this.items.role_list = []
        this.text = null
        // this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>
