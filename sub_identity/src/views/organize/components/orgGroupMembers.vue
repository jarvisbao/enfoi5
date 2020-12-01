<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_group_member@identity.groups.'+group_id]" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-permission="'ref://remove_group_member@{'+group_id+'}'" class="btn create-btn delete" @click="group_members_deletes">
        删除所选
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      ref="multipleTable"
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
        prop="nickname"
        label="成员昵称"
        width="120"
      />
      <el-table-column
        prop="full_name"
        label="成员姓名"
      />
      <el-table-column
        prop="birthday"
        label="成员生日"
      />
      <!-- <el-table-column
        prop="props"
        label="成员属性"
        show-overflow-tooltip/> -->
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.permission_can_delete" class="el-icon-delete" @click="group_members_delete(scope.row.openid)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加群组成员">
      <group-members-add :group_members_list="items" :group_id="group_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import groupMembersAdd from '@/views/group/components/groupMembersAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    groupMembersAdd
  },
  data() {
    return {
      items: [{
        nickname: null,
        full_name: null,
        birthday: null,
        props: null
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      multipleSelection: [],
      user_ids: [],
      dialogVisible: false,
      group_id: null
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
  },
  methods: {
    checkPermission,
    get_group_id() {
      if ('group_id' in this.$route.query) {
        this.group_id = this.$route.query.group_id
        const group_id = this.$route.query.group_id
        return group_id
      } else {
        const group_id = null
        return group_id
      }
    },
    fetchData() {
      this.listLoading = true
      var group_id = this.get_group_id()
      this.group_id = group_id
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.user_ids = []
      val.forEach(element => {
        this.user_ids.push(element.openid)
      })
    },
    schfilter() {
      var group_id = this.get_group_id()
      this.pagination.page = 1
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page_size = val
      var group_id = this.get_group_id()
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      var group_id = this.get_group_id()
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
      })
    },
    group_members_delete(user_id) {
      this.$confirm('是否删除该群组成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        this.user_ids = [user_id]
        this.$Apis.group.group_members_remove(group_id, this.user_ids).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            // this.$router.go(0)
            this.items = this.fetchData()
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
    group_members_deletes() {
      if (JSON.stringify(this.user_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选群组成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        this.$Apis.group.group_members_remove(group_id, this.user_ids).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            // this.$router.go(0)
            this.items = this.fetchData()
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
      this.items = this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
