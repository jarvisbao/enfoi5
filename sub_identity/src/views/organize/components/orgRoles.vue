<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_org_role@identity.orgs']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="organize_role_delete(org_code, role_codes)">
        删除所选
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
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="org_code"
        label="组织机构代码"
        width="120"
      />
      <el-table-column
        prop="org_name"
        label="机构名称"
      />
      <el-table-column
        prop="role_code"
        label="角色编码"
      />
      <el-table-column
        prop="role_name"
        label="角色名称"
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="organize_role_delete(scope.row.org_code,scope.row.role_code)" />
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
      <organize-roles-add @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import organizeRolesAdd from './organizeRolesAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    organizeRolesAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
        org_code: null,
        org_name: null,
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
      role_codes: [],
      org_code: null,
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      recursive: null,
      dialogTitle: '',
      showPage: false,
      removePermission: false
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_org_role@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_org_code() {
      if ('org_code' in this.$route.query) {
        this.org_code = this.$route.query.org_code
        return this.org_code
      } else {
        this.org_code = null
        return this.org_code
      }
    },
    fetchData() {
      this.loading = true
      var org_code = this.get_org_code()
      this.$Apis.organize.organize_roles_list(org_code, this.recursive, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    handleSelectionChange(val) {
      this.role_codes = []
      val.forEach(element => {
        this.role_codes.push(element.role_code)
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    },
    organize_role_delete(org_code, role_code) {
      let tips = '是否删除该机构角色?'
      this.role_codes = [role_code]
      if (Array.isArray(role_code)) {
        if (JSON.stringify(role_code) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选机构角色?'
        this.role_codes = role_code
      }
      this.$confirm('是否删除该机构角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        // this.role_codes = [role_code]
        this.$Apis.organize.organize_roles_remove(org_code, this.role_codes).then(response => {
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
      this.dialogTitle = '机构角色添加'
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
<style lang="scss" scoped>
</style>
