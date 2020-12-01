<template>
  <div>
    <el-form ref="form" :model="items" :rules="rules" class="demo-form-inline" label-width="100px">
      <el-form-item label="组织机构" prop="org">
        <el-select id="orgCode" v-model="items.org" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择组织机构" @change="get_group">
          <el-option v-for="item in items.organize_list" :key="item.org_code" :label="item.name" :value="item.org_code" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择群组" prop="group">
        <el-select id="group" v-model="items.group" v-loadmore="loadGroupMore" :remote-method="groupRemoteMethod" :loading="searchLoading" filterable remote placeholder="请选择群组">
          <el-option
            v-for="item in items.group_list"
            :key="item.group_id"
            :label="item.name"
            :value="item.group_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加角色" prop="role">
        <!-- <el-select v-model="role_ids" :disabled="true" multiple placeholder="请选择角色">
          <el-option
            v-for="item in items.role_list"
            :key="item.role_id"
            :label="item.name"
            :value="item.role_id"/>
        </el-select> -->
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
        role_list: [],
        organize_list: [],
        group_list: [],
        org: '',
        group: ''
      },
      rules: {
        org: [
          { required: true, message: '选择组织机构', trigger: 'change' }
        ],
        group: [
          { required: true, message: '请选择群组', trigger: 'change' }
        ]
      },
      // org_id: '',
      // group_id: '',
      role_codes: [],
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
  mounted() {
    this.getList()
  },
  methods: {
    get_group: function(org_code) {
      this.get_org_code = org_code
      this.getGroupList(this.groupPageCount)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          var group_id = this.items.group
          var role_codes = [this.role_code]
          this.$Apis.group.group_role_add(group_id, role_codes).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              if (group_id === '') {
                this.$alert('请选择群组', '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$alert('添加成功!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.resetForm()
                    this.$emit('refresh')
                  }
                })
              }
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
