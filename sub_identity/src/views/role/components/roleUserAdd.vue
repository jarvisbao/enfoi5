<template>
  <div class="myroles-add">
    <el-form ref="form" v-loading="loading" :model="items" :rules="rules" class="demo-form-inline" label-width="120px">
      <el-form-item label="用户" prop="user">
        <el-select id="user" v-model="items.user" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="选择用户">
          <el-option
            v-for="(value, index) in items.users_list"
            :key="index"
            :label="value.full_name"
            :value="value.openid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input v-model="role_name" :disabled="true" />
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
        users_list: [],
        roles_list: [],
        user: ''
      },
      rules: {
        user: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ]
      },
      // role: '',
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const user_id = this.items.user
          const role_code = this.role_code
          this.$Apis.user.user_roles_add(user_id, role_code).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('添加成功!', '提示', {
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
