<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_org_role@identity.orgs']" class="btn create-btn" @click="create">
        新建
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      :data="items"
      style="width: 100%"
    >
      <el-table-column
        prop="org_code"
        label="组织机构代码"
      />
      <el-table-column
        prop="org_name"
        label="机构名称"
      />
      <el-table-column align="right">
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="role_orgs_delete(scope.row.org_code)" />
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
      <role-orgs-add :role_code="role_code" :role_name="role_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import roleOrgsAdd from './roleOrgsAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    roleOrgsAdd
  },
  data() {
    return {
      items: [{
        org_code: null,
        name: null
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      dialogVisible: false,
      dialogTitle: null,
      role_id: null,
      showPage: false,
      removePermission: false,
      role_name: null
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
    this.removePermission = checkPermission(['ns://remove_org_role@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_role_code() {
      if ('role_code' in this.$route.query) {
        this.role_code = this.$route.query.role_code
        return this.role_code
      } else {
        return null
      }
    },
    get_role_name() {
      if ('name' in this.$route.query) {
        this.role_name = this.$route.query.name
        return this.role_name
      } else {
        return null
      }
    },
    fetchData() {
      this.get_role_name()
      this.loading = true
      var role_code = this.get_role_code()
      this.$Apis.role.role_orgs_list(role_code, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
        }
      })
    },
    operateData() {
      this.loading = true
      var role_code = this.get_role_code()
      this.$Apis.role.role_orgs_list(role_code, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
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
    role_orgs_delete(org_code) {
      this.$confirm('是否删除该所在机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const role_code = [this.get_role_code()]
        this.$Apis.organize.organize_roles_remove(org_code, role_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.fetchData()
          } else {
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
      this.dialogTitle = '添加机构'
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
