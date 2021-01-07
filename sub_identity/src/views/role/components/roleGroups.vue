<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_group_role@identity.groups']" class="btn create-btn" @click="create">
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
        prop="group_name"
        label="群组名称"
      />
      <el-table-column
        prop="org_name"
        label="所属机构"
      />
      <el-table-column align="right">
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="role_groups_delete(scope.row.group_id)" />
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
      <role-groups-add :role_code="role_code" :role_name="role_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import roleGroupsAdd from './roleGroupsAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    roleGroupsAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
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
      role_code: null,
      showPage: false,
      removePermission: false,
      role_name: null
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_group_role@identity.groups'])
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
      this.$Apis.role.role_groups_list(role_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
      this.$Apis.role.role_groups_list(role_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加群组'
    },
    role_groups_delete(group_id) {
      this.$confirm('是否删除该所在群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const role_code = [this.get_role_code()]
        this.$Apis.group.group_role_remove(group_id, role_code).then(response => {
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
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
