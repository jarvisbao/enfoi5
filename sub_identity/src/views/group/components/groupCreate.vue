<template>
  <div class="app-container">
    <el-form ref="form" :model="group" :rules="rules" label-width="130px" tooltip-effect="dark">
      <el-form-item label="组织机构代码" prop="org_code">
        <el-input v-if="isDisabled" v-model="org_name" :disabled="true" />
        <el-select v-else id="orgCode" v-model="group.org_code" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择组织机构">
          <el-option
            v-for="item in organizes"
            :key="item.org_code"
            :label="item.name"
            :value="item.org_code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="群组名称" prop="name">
        <el-input id="groupName" v-model="group.name" />
      </el-form-item>
      <!-- <el-form-item label="组织机构属性">
        <el-input v-model="group.props" type="textarea" show-overflow-tooltip/>
      </el-form-item> -->
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
    org_code: {
      type: String,
      default: ''
    },
    org_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      group: {
        org_code: this.org_code,
        name: '',
        props: null
      },
      organizes: [],
      rules: {
        org_code: {
          required: true,
          message: '请选择组织机构',
          trigger: 'change'
        },
        name: { required: true, message: '请输入群组名称', trigger: 'blur' }
      },
      loading: false,
      isDisabled: false,
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
      if (this.org_code) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const org_code = this.group.org_code
          const name = this.group.name
          const props = this.group.props
          this.loading = true
          this.$Apis.group.group_create(org_code, name, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
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
      this.$Apis.organize.organize_list(null, null, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.organizes = [...this.organizes, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.text = query
        this.pagination.page = 0
        this.organizes = []
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        this.organizes = []
        this.text = null
        this.pagination.page = 1
        this.getList()
      }
    }
  }
}
</script>
