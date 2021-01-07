<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_role@identity.roles']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="role_delete(rolecodes)">
        注销所选
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="active_role(rolecodes)">
        激活所选
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
      <el-table-column type="selection" width="55" />
      <el-table-column prop="role_code" label="角色编码" width="200" show-overflow-tooltip />
      <el-table-column prop="role_name" label="角色名称" width="220" show-overflow-tooltip />
      <el-table-column prop="category" label="角色分类" width="220" />
      <el-table-column prop="comment" label="角色描述" show-overflow-tooltip />
      <!-- <el-table-column prop="owner" label="角色拥有者" show-overflow-tooltip/> -->
      <!-- <el-table-column prop="props" label="角色属性" show-overflow-tooltip/> -->
      <el-table-column v-if="showColumn" align="right" fixed="right" width="150">
        <template slot-scope="scope">
          <i v-if="updatePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="role_update(scope.row.role_code)" />
          <i v-if="scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="role_info(scope.row.role_code, scope.row.role_name)" />
          <i v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="role_delete(scope.row.role_code)" />
          <span v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_role(scope.row.role_code)">激活</span>
          <span v-if="assignmentPermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="assignments-btn" @click="role_auth(scope.row.role_name, scope.row.role_code)">菜单</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :width="dialog_width" destroy-on-close>
      <role-create v-if="dialogCreate" @show="isShow" @refresh="refresh" />
      <role-update v-else-if="dialogUpdate" :role="role" :old_role_code="old_role_code" @show="isShow" @refresh="refresh" />
      <role-auth v-else :role_code="old_role_code" @show="isShow" />
    </el-dialog>
    <el-pagination
      v-if="showPage"
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import roleUpdate from './components/roleUpdate'
import roleCreate from './components/roleCreate'
import roleAuth from './components/roleAuth'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import pageParams from '@/mixin/pageParams'
import paginationHandler from '@/mixin/paginationHandler'

export default {
  filters: {},
  components: {
    CommonTitle,
    roleUpdate,
    roleCreate,
    roleAuth
  },
  mixins: [paginationHandler, pageParams],
  data() {
    return {
      items: [],
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      dialogCreate: false,
      dialogUpdate: false,
      dialogTitle: '',
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      owner: null,
      role: {},
      showColumn: false,
      showPage: false,
      rolecodes: [],
      updatePermission: false,
      removePermission: false,
      old_role_code: null,
      dialog_width: null,
      assignmentPermission: false,
      status: 'all'
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_role@identity.roles'])
    this.removePermission = checkPermission(['ns://remove_role@identity.roles'])
    this.assignmentPermission = checkPermission(['ns://create_assign@identity.menus'])
  },
  methods: {
    checkPermission,
    fetchData() {
      this.loading = true
      this.$Apis.role.role_list(this.owner, this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
            this.showColumn = true
          } else {
            this.showPage = false
            this.showColumn = false
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
      this.rolecodes = []
      val.forEach(element => {
        this.rolecodes.push(element.role_code)
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.role.role_list(this.owner, this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
            this.showColumn = true
          } else {
            this.showPage = false
            this.showColumn = false
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
    role_update(role_code) {
      this.dialogVisible = !this.dialogVisible
      this.dialogCreate = false
      this.dialogUpdate = true
      this.dialog_width = null
      this.dialogTitle = '更新角色'
      this.$Apis.role.role_info(role_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.role = response.payload
          this.old_role_code = role_code
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    role_info(role_code, name) {
      this.set_session()
      this.$router.push({ name: 'role_info', query: { role_code: role_code, name: name }})
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogCreate = true
      this.dialogUpdate = false
      this.dialog_width = null
      this.dialogTitle = '新建角色'
    },
    role_delete(role_code) {
      let tips = '是否注销该角色?'
      if (Array.isArray(role_code)) {
        if (JSON.stringify(role_code) === '[]') {
          this.$alert('请选择要注销的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否注销所选角色?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.role.role_remove_v2(role_code).then(response => {
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
    active_role(role_code) {
      let tips = '是否激活该角色?'
      if (Array.isArray(role_code)) {
        if (JSON.stringify(role_code) === '[]') {
          this.$alert('请选择要激活的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否激活所选角色?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.role.active_role(role_code).then(response => {
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
    // role_deletes() {
    //   if (JSON.stringify(this.rolecodes) === '[]') {
    //     this.$alert('请选择要注销的条目！', '提示', {
    //       confirmButtonText: '确定'
    //     })
    //     return false
    //   }
    //   this.$confirm('是否注销所选角色?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     confirmButtonClass: 'confirm-button',
    //     cancelButtonClass: 'cancel-button'
    //   }).then(() => {
    //     this.$Apis.role.role_remove_v2(this.rolecodes).then(response => {
    //       if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
    //         this.fetchData()
    //       } else {
    //         this.$alert(response.message, '提示', {
    //           confirmButtonText: '确定'
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //   })
    // },
    // active_roles() {
    //   if (JSON.stringify(this.rolecodes) === '[]') {
    //     this.$alert('请选择要激活的条目！', '提示', {
    //       confirmButtonText: '确定'
    //     })
    //     return false
    //   }
    //   this.$confirm('是否激活所选角色?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     confirmButtonClass: 'confirm-button',
    //     cancelButtonClass: 'cancel-button'
    //   }).then(() => {
    //     this.$Apis.role.active_role(this.rolecodes).then(response => {
    //       if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
    //         this.fetchData()
    //       } else {
    //         this.$alert(response.message, '提示', {
    //           confirmButtonText: '确定'
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //   })
    // },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    role_auth(role_name, role_code) {
      this.dialogVisible = !this.dialogVisible
      this.dialogCreate = false
      this.dialogUpdate = false
      this.dialog_width = '15%'
      this.old_role_code = role_code
      this.dialogTitle = role_name
    }
  }
}
// ["role_id", "role_code", "name", "category", "comment", "owner", "props"]
</script>
