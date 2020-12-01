<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_group_admin@identity.groups']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="group_admin_deletes">
        删除所选
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
        prop="full_name"
        label="管理员名称"
      />
      <el-table-column
        prop="nickname"
        label="管理员昵称"
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="group_admin_delete(scope.row.openid)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <group-admin-add :org_code="org_code" :group_id="group_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import groupAdminAdd from './groupAdminAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    groupAdminAdd
  },
  data() {
    return {
      items: [],
      org_code: null,
      group_id: null,
      text: null,
      loading: false,
      dialogVisible: false,
      dialogTitle: null,
      group_list: [],
      groupItems: [],
      user_ids: [],
      removePermission: false
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_group_admin@identity.groups'])
  },
  methods: {
    checkPermission,
    get_group_id() {
      if ('group_id' in this.$route.query) {
        this.group_id = this.$route.query.group_id
        return this.group_id
      } else {
        this.group_id = null
        return this.group_id
      }
    },
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
      this.get_org_code()
      const group_id = this.get_group_id()
      this.loading = true
      this.$Apis.group.group_admin_list(group_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.loading = false
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
      this.user_ids = []
      val.forEach(element => {
        this.user_ids.push(element.openid)
      })
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加群组管理员'
    },
    group_admin_delete(openid) {
      this.$confirm('是否删除该群组管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        const user_id = openid
        this.$Apis.group.group_admin_remove(group_id, user_id).then(response => {
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
    group_admin_deletes() {
      if (JSON.stringify(this.user_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选群组管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        this.$Apis.group.group_admin_remove(group_id, this.user_ids).then(response => {
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

