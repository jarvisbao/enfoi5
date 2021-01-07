<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_user_role@identity.users']" class="btn create-btn" @click="create">
        新建
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="角色编码" prop="role_code" show-overflow-tooltip />
      <el-table-column label="角色名称" prop="role_name" />
      <el-table-column label="角色类别" prop="sort" />
      <el-table-column label="角色描述" prop="sort2" />
      <el-table-column align="right">
        <template slot-scope="scope">
          <template v-if="scope.row.sort === 'user'">
            <i v-if="removePermission" class="el-icon-delete" @click="user_roles_delete(scope.row.role_code)" />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage"
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <my-role-add :openid="openid" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import myRoleAdd from './myRoleAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    myRoleAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
        role_code: null,
        role_name: null
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      loading: false,
      user: false,
      dialogVisible: false,
      dialogTitle: null,
      openid: null,
      showPage: false,
      removePermission: false
    }
  },
  watch: {
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_user_role@identity.users'])
  },
  methods: {
    checkPermission,
    get_openid() {
      if ('openid' in this.$route.query) {
        var openid = this.$route.query.openid
        this.openid = openid
        return openid
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var openid = this.get_openid()
      this.$Apis.user.user_roles(openid, this.text, true, this.pagination.page, this.page_size).then(response => {
        this.loading = false
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    operateData() {
      var openid = this.get_openid()
      this.loading = true
      this.$Apis.user.user_roles(openid, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        }
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    handleSelectionChange() {

    },
    user_roles_delete(role_code) {
      const user_id = this.get_openid()
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.user.user_roles_remove(user_id, role_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.fetchData()
          } else {
            alert(response.message)
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '用户角色添加'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
