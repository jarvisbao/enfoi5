<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_group_role@identity.groups']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="group_role_delete(role_codes)">
        删除所选
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="roles"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="role_code"
        label="角色编码"
        width="150"
      />
      <el-table-column
        prop="role_name"
        label="角色名称"
        width="150"
      />
      <el-table-column
        prop="category"
        label="角色分类"
        width="120"
      />
      <el-table-column
        prop="comment"
        label="角色描述"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="props"
        label="角色属性"
        show-overflow-tooltip/> -->
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="group_role_delete(scope.row.role_code)" />
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
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加群组角色">
      <group-role-add :group_id="group_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import groupRoleAdd from './groupRoleAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    groupRoleAdd
  },
  data() {
    return {
      roles: [{
        role_code: '',
        name: '',
        category: '',
        comment: '',
        props: ''
      }],
      multipleSelection: [],
      role_codes: [],
      dialogVisible: false,
      loading: false,
      removePermission: false,
      group_id: null,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_group_role@identity.groups'])
  },
  methods: {
    checkPermission,
    get_group_id() {
      if ('group_id' in this.$route.query) {
        const group_id = this.$route.query.group_id
        return group_id
      } else {
        const group_id = null
        return group_id
      }
    },
    fetchData() {
      this.loading = true
      const group_id = this.get_group_id()
      this.group_id = group_id
      this.$Apis.group.group_role_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.roles = response.payload.items
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
    operateData() {
      this.loading = true
      this.$Apis.group.group_role_list(this.group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.roles = response.payload.items
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
    group_role_delete(role_code) {
      let tips = '是否删除该群组角色?'
      let role_codes = [role_code]
      if (Array.isArray(role_code)) {
        if (JSON.stringify(role_code) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选群组角色?'
        role_codes = role_code
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        // this.role_codes = [role_code]
        this.$Apis.group.group_role_remove(group_id, role_codes).then(response => {
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
