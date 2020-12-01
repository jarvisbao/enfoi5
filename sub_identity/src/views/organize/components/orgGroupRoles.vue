<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_group_role@identity.groups']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="group_role_deletes">
        删除所选
      </div>
    </div>
    <el-table
      ref="multipleTable"
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
        width="180"
      />
      <el-table-column
        prop="name"
        label="角色名称"
        width="180"
      />
      <el-table-column
        prop="category"
        label="角色分类"
        width="180"
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
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加群组角色">
      <group-role-add :group_id="group_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import groupRoleAdd from '@/views/group/components/groupRoleAdd'
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
      removePermission: false,
      group_id: null
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
        this.group_id = this.$route.query.group_id
        return this.group_id
      } else {
        this.group_id = null
        return this.group_id
      }
    },
    fetchData() {
      this.listLoading = true
      const group_id = this.get_group_id()
      this.$Apis.group.group_role_list(group_id).then(response => {
        this.roles = response.payload.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.role_codes = []
      val.forEach(element => {
        this.role_codes.push(element.role_code)
      })
    },
    group_role_delete(role_code) {
      this.$confirm('是否删除该群组角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        this.role_codes = [role_code]
        this.$Apis.group.group_role_remove(group_id, this.role_codes).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            // this.$router.go(0)
            this.roles = this.fetchData()
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
    group_role_deletes() {
      if (JSON.stringify(this.role_codes) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选群组角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        this.$Apis.group.group_role_remove(group_id, this.role_codes).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            // this.$router.go(0)
            this.roles = this.fetchData()
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
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.roles = this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
