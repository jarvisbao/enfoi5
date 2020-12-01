<template>
  <div>
    <el-form ref="form" :model="items" class="demo-form-inline" label-width="120px">
      <el-form-item label="组织机构">
        <el-input id="orgName" v-model="org_name" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item label="组织机构" prop="org">
        <el-select v-model="org_id" placeholder="选择组织机构">
          <el-option v-for="item in items.organize_list" :key="item.org_id" :label="item.name" :value="item.org_id"/>
        </el-select>
      </el-form-item> -->
      <!--      <div v-for="(item, index) in users_info" :key="index" class="user-list">-->
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
      <el-form-item label="添加用户">
        <el-select id="user" v-model="item.user_id" v-loadmore="loadMore" :remote-method="remoteMethod" :loading="searchLoading" filterable remote placeholder="请选择用户">
          <el-option
            v-for="item in items.users_list"
            :key="item.openid"
            :label="item.full_name"
            :value="item.openid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成员别名">
        <el-input id="title" v-model="item.title" />
      </el-form-item>
      <el-form-item label="管理员">
        <el-switch
          v-model="item.isadmin"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
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
      items: {
        users_list: [],
        organize_info: {}
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
      searchLoading: false,
      item: {
        isadmin: false,
        title: null,
        user_id: null,
        props: null
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const org_code = this.org_code
          const user_id = this.item.user_id
          const title = this.item.title
          const props = this.item.props
          const isadmin = this.item.isadmin
          this.$Apis.organize.organize_members_add(org_code, user_id, title, isadmin, props).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                callback: action => {
                  // this.$router.go(0)
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
