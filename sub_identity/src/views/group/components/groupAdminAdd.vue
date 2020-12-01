<template>
  <div>
    <el-form ref="form" :model="items" :rules="rules" class="demo-form-inline" label-width="100px">
      <el-form-item label="组织机构" prop="org">
        <el-input v-model="org_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="选择群组" prop="group">
        <el-input v-model="group_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="添加管理员" prop="user">
        <el-select id="user" v-model="items.user" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择用户">
          <el-option
            v-for="item in items.users_list"
            :key="item.openid"
            :label="item.full_name"
            :value="item.openid"
          />
        </el-select>
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
    group_id: {
      type: String,
      default: ''
    },
    org_code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        user: '',
        users_list: []
      },
      rules: {
        user: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ]
      },
      // user_id: '',
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
    this.getList()
  },
  methods: {
    get_group_name() {
      if ('name' in this.$route.query) {
        this.group_name = this.$route.query.name
        return this.group_name
      } else {
        return null
      }
    },
    fetchData() {
      this.get_group_name()
      this.$Apis.organize.organize_info(this.org_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.org_name = response.payload.name
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const group_id = this.group_id
          const user_id = this.items.user
          this.$Apis.group.group_admin_add(group_id, user_id).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('添加成功', '提示', {
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
      this.$Apis.user.user_list(this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.items.users_list = [...this.items.users_list, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.items.users_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.items.users_list = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>
