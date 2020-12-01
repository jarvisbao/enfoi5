<template>
  <div>
    <el-form ref="form" :model="assignments" :rules="rules" label-width="130px">
      <el-form-item label="动作名称" prop="action_label">
        <el-input v-model="assignments.action_label" :disabled="true" />
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
      <el-form-item label="资源" prop="res">
        <div style="display: flex;">
          <el-select
            v-for="(arrItem, key) in selectList"
            :id="'res'+key"
            :key="key"
            v-model="assignments.namespace[key]"
            v-loadmore="resLoadMore"
            :remote-method="resRemoteMethod"
            :loading="searchLoading"
            filterable
            remote
            placeholder="请选择"
            @change="handleChange"
            @focus="position=key"
          >
            <el-option
              v-for="item in arrItem"
              :key="item.namespace"
              :label="item.text"
              :value="item.namespace"
            />
          </el-select>
        </div>
        <!-- <el-cascader
          v-model="assignments.res_id"
          :show-all-levels="true"
          :props="prop"
          :emit-path="false"
          filterable
          clearable
          style="width: 100%;"/> -->
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
    action_id: {
      type: String,
      default: ''
    },
    action_name: {
      type: String,
      default: ''
    },
    action_label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      assignments: {
        action_id: this.action_id,
        role_id: null,
        expire_at: null,
        namespace: [],
        action_label: this.action_label,
        action_name: this.action_name,
        role: null
      },
      roles_list: [],
      resource_list: [],
      show: false,
      rules: {
        role_code: {
          required: true,
          message: '请输入角色代码',
          trigger: 'blur'
        },
        role: { required: true, message: '请选择角色', trigger: 'change' }
      },
      // tree_items: [],
      // prop: { value: 'id', label: 'label', children: 'children' },
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      text: null,
      searchLoading: false,
      resPtext: null,
      resPagination: {
        total: 10,
        page: 1
      },
      resPageCount: 1,
      parentId: null,
      position: null,
      selectList: [[]],
      childPagination: 1,
      childPageCount: 1,
      namespace: null
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.getList()
    this.resGetList()
    this.get_res_namespace()
  },
  methods: {
    get_res_namespace() {
      if ('namespace' in this.$route.query) {
        this.namespace = this.$route.query.namespace
        return this.namespace
      } else {
        return null
      }
    },
    fetchData() {
      if (!this.assignments.action_name) {
        const action_id = this.action_id
        this.$Apis.resource.actions_info(action_id).then(response => {
          this.assignments.action_label = response.payload.action_label
          this.assignments.action_name = response.payload.action_name
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const action_id = this.action_id
          const role_code = this.assignments.role
          var namespace = this.namespace
          if (this.assignments.namespace instanceof Array && this.assignments.namespace.length > 0) {
            namespace = this.assignments.namespace[this.assignments.namespace.length - 1]
          }
          const expire_at = this.assignments.expire_at
          this.loading = true
          this.$Apis.resource.assignments_create(action_id, namespace, role_code, expire_at).then(response => {
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
    },
    handleChange(val) {
      const index = this.position + 1
      if (!this.position) {
        this.assignments.namespace.splice(1, this.assignments.namespace.length - 1)
        this.selectList.splice(1, this.selectList.length - 1)
      } else {
        this.assignments.namespace.splice(index, this.assignments.namespace.length - 1)
        this.selectList.splice(index, this.selectList.length - 1)
      }
      this.parentId = val
      this.childPagination = 1
      this.$Apis.resource.resource_list(this.parentId, this.resPtext, true, this.childPagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          if (_res.length > 0) {
            this.selectList.push([])
            this.selectList[index].push(..._res)
            this.childPageCount = response.payload.pagination.pages // 总页数
          }
        } else {
          if (this.selectList.length > 1) {
            this.selectList.splice(index, this.selectList.length - 1)
          }
        }
      })
    },
    resLoadMore() {
      if (!this.position) {
        this.resPagination.page++
        if (this.resPagination.page <= this.resPageCount) {
          this.getList()
        }
      } else {
        this.childPagination++
        if (this.childPagination <= this.childPageCount) {
          this.getChildList()
        }
      }
    },
    resGetList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.resource.resource_list(null, this.resPtext, true, this.resPagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.selectList[0].push(..._res)
          this.resPageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getChildList() {
      this.$Apis.resource.resource_list(this.parentId, this.resPtext, true, this.childPagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.selectList[this.position].push(..._res)
          this.searchLoading = false
        }
      })
    },
    resRemoteMethod(query) {
      if (query !== '') {
        this.resPtext = query
        if (!this.position) {
          this.resPagination.page = 0
          this.selectList[0] = []
        } else {
          this.childPagination = 0
          this.selectList[this.position] = []
        }
        this.searchLoading = true
        setTimeout(() => {
          this.resLoadMore()
        }, 200)
      } else {
        this.resPtext = null
        if (!this.position) {
          this.resPagination.page = 1
          // this.selectList[0] = []
          this.selectList[0].splice(0, this.selectList[0].length)
          this.getList()
        } else {
          this.childPagination = 1
          // this.selectList[this.position].splice(0, this.selectList[this.position].length)
          this.selectList[this.position] = []
          this.getChildList()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-res {
  display: block;
  cursor: pointer;
  i {
    margin-right: 6px;
    font-size: 18px;
    color: #409eff;
  }
}
</style>
