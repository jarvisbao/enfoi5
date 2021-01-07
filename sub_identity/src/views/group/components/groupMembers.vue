<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_group_member@identity.groups', 'ref://create_group_member@{'+group_id+'}']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-permission="['ns://remove_group_member@identity.groups', 'ref://remove_group_member@{'+group_id+'}']" class="btn create-btn delete" @click="group_members_delete(user_ids)">
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
          <i class="el-icon-delete" @click="group_members_delete(scope.row.openid)" />
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
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" title="添加群组成员">
      <group-members-add :group_id="group_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import groupMembersAdd from './groupMembersAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    groupMembersAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [],
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
      group_id: null,
      showPage: false,
      loading: false
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
        return this.group_id
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var group_id = this.get_group_id()
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
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
      this.user_ids = []
      val.forEach(element => {
        this.user_ids.push(element.openid)
      })
    },
    operateData() {
      this.loading = true
      var group_id = this.get_group_id()
      this.$Apis.group.group_members_list(group_id, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    group_members_delete(user_id) {
      let tips = '是否删除该群组成员?'
      let user_ids = [user_id]
      if (Array.isArray(user_id)) {
        if (JSON.stringify(user_id) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选群组成员?'
        user_ids = user_id
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        const group_id = this.get_group_id()
        // this.user_ids = [user_id]
        this.$Apis.group.group_members_remove(group_id, user_ids).then(response => {
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
