<template>
  <div>
    <el-form ref="form" :model="items" class="demo-form-inline" label-width="120px">
      <el-form-item label="组织机构" prop="org">
        <el-select id="orgCode" v-model="items.org_code" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择组织机构">
          <el-option v-for="item in items.organize_list" :key="item.org_code" :label="item.name" :value="item.org_code" />
        </el-select>
      </el-form-item>
      <el-form-item label="成员别名" prop="title">
        <el-input id="title" v-model="items.title" />
      </el-form-item>
      <el-form-item label="管理员" prop="isadmin">
        <el-switch
          id="isadmin"
          v-model="items.isadmin"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
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
        org_code: null,
        user: '',
        title: null,
        isadmin: false,
        props: null
      },
      users_info: [{
        user_id: '',
        props: ''
      }],
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const org_code = this.items.org_code
          const openid = this.openid
          const title = this.items.title
          const props = this.items.props
          const isadmin = this.items.isadmin
          this.$Apis.organize.organize_members_add(org_code, openid, title, isadmin, props).then(response => {
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
.el-form {
  width: 90%;
}
.user-list {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  .el-form-item {
    flex: 1;
    // margin-right: 20px;
    margin-bottom: 0;
  }
  .action {
    position: absolute;
    right: -80px;
    width: 70px;
    font-size: 24px;
    i {
      margin: 0 3px;
      cursor: pointer;
      color: #b6b6b6;
      &:hover {
        color: #ea2323;
      }
    }
  }
}
</style>
