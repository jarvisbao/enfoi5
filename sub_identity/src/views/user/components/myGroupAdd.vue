<template>
  <div class="app-container">
    <el-form ref="form" :model="items" class="demo-form-inline" label-width="100px">
      <el-form-item label="组织机构" prop="org">
        <el-select id="orgCode" v-model="org_code" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择组织机构" @change="getGroup(org_code)">
          <el-option v-for="item in items.organize_list" :key="item.org_code" :label="item.name" :value="item.org_code" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择群组" prop="group">
        <el-select id="group" v-model="group_id" v-loadmore="loadGroupMore" :remote-method="groupRemoteMethod" :loading="searchLoading" filterable remote placeholder="请选择群组">
          <el-option
            v-for="item in items.group_list"
            :key="item.group_id"
            :label="item.name"
            :value="item.group_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加用户" prop="users">
        <el-input id="user" v-model="items.user" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          添加
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
    openid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        users_list: [],
        organize_list: [],
        group_list: [],
        user: ''
      },
      users_info: [{
        user_id: '',
        props: ''
      }],
      org_code: '',
      group_id: null,
      user_id: '',
      props: null,
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      text: null,
      groupPagination: {
        total: 10,
        page: 1
      },
      groupText: null,
      groupPageCount: 1,
      get_org_code: '',
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
    fetchData() {
      const openid = this.openid
      this.$Apis.user.user_info(openid).then(response => {
        this.items.user = response.payload.full_name
      })
    },
    getGroup(org_code) {
      this.get_org_code = org_code
      this.items.group_list = []
      this.group_id = null
      this.getGroupList()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const group_id = this.group_id
          // const users_info = this.users_info
          const user_id = this.openid
          const props = this.props
          this.$Apis.group.group_members_add(group_id, user_id, props).then(response => {
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
          this.$alert('error submit', '提示', {
            confirmButtonText: '确定'
          })
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
    loadGroupMore() {
      this.groupPagination.page++
      if (this.groupPagination.page <= this.groupPageCount) {
        this.getGroupList()
      }
    },
    getGroupList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.organize.organize_groups_list(this.get_org_code, this.groupText, true, this.groupPagination.page, this.page_size).then(response => {
        const _res = response.payload.items
        this.items.group_list = [...this.items.group_list, ..._res]
        this.groupPageCount = response.payload.pagination.pages // 总页数
        this.searchLoading = false
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
    },
    groupRemoteMethod(query) {
      if (query !== '') {
        this.groupText = query
        this.groupPagination.page = 0
        this.items.group_list = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadGroupMore()
        }, 200)
      } else {
        this.items.group_list = []
        this.groupText = null
        this.groupPagination.page = 1
        this.getGroupList()
      }
    }
  }
}
</script>
