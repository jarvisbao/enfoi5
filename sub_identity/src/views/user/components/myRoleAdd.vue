<template>
  <div class="myroles-add">
    <el-form ref="form" v-loading="loading" :model="items" :rules="rules" class="demo-form-inline" label-width="120px">
      <el-form-item label="用户" prop="user">
        <el-input id="user" v-model="items.user" :disabled="true" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select id="role" v-model="items.role" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择角色">
          <el-option
            v-for="(value, index) in items.roles_list"
            :key="index"
            :label="value.role_name"
            :value="value.role_code"
          >
            <span style="float: left">{{ value.role_name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ value.category }}</span>
          </el-option>
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
    openid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: {
        users_list: [],
        roles_list: [],
        role: '',
        user: ''
      },
      rules: {
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      user_id: this.openid,
      // role_id: '',
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
      this.$Apis.user.user_info(this.openid).then(response => {
        this.items.user = response.payload.full_name
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const user_id = this.user_id
          const role_code = this.items.role
          this.$Apis.user.user_roles_add(user_id, role_code).then(response => {
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
