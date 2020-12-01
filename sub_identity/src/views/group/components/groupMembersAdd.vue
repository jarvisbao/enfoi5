<template>
  <div class="app-container">
    <el-form ref="form" :model="items" class="demo-form-inline" label-width="100px">
      <el-form-item label="组织机构" prop="org">
        <el-input v-model="org_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="选择群组" prop="group">
        <el-input v-model="group_name" :disabled="true" />
      </el-form-item>
      <!--      <div v-for="(item, index) in users_info" :key="index" class="user-list-add">-->
      <!--        <el-form-item label="添加用户" prop="users">-->
      <!--          <el-select v-loadmore="loadMore" v-model="item.user_id" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择用户">-->
      <!--            <el-option-->
      <!--              v-for="item in items.users_list"-->
      <!--              :key="item.openid"-->
      <!--              :label="item.full_name"-->
      <!--              :value="item.openid"/>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->
      <!--        &lt;!&ndash; <el-form-item label="组织机构属性">-->
      <!--          <el-input v-model="item.props"/>-->
      <!--        </el-form-item> &ndash;&gt;-->
      <!--        <div class="action">-->
      <!--          <span @click="add"><i class="el-icon-circle-plus-outline"/></span>-->
      <!--          <span v-if="index>=1" @click="remove(item)"><i class="el-icon-remove-outline"/></span>-->
      <!--        </div>-->
      <!--      </div>-->
      <el-form-item label="添加用户" prop="users">
        <el-select id="user" v-model="item.user_id" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择用户">
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
    group_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        users_list: [],
        organize_list: [],
        group_list: []
      },
      users_info: [{
        user_id: '',
        props: ''
      }],
      item: {
        user_id: '',
        props: ''
      },
      user_id: '',
      props: null,
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
          const group_id = this.group_id
          // const users_info = this.users_info
          const user_id = this.item.user_id
          const props = this.item.props
          this.$Apis.group.group_members_add(group_id, user_id, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const count = response.payload.count
              this.$alert('新建成功', '提示', {
                dangerouslyUseHTMLString: true,
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
    add() {
      this.users_info.push({
        user_id: '',
        props: ''
      })
    },
    remove(item) {
      var index = this.users_info.indexOf(item)
      if (index !== -1) {
        this.users_info.splice(index, 1)
      }
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
