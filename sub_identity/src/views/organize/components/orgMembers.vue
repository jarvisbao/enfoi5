<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_org_member@identity.orgs']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="organize_members_delete(org_code, user_ids)">
        删除所选
      </div>
      <div class="right-btn">
        <el-input v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
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
      />
      <el-table-column
        prop="org_name"
        label="机构名称"
      />
      <el-table-column
        prop="nickname"
        label="成员昵称"
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
          <i v-if="removePermission" class="el-icon-delete" @click="organize_members_delete(scope.row.org_code,scope.row.openid)" />
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
      <organize-member-add :org_code="org_code" :org_name="org_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import organizeMemberAdd from './organizeMemberAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    organizeMemberAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
        org_code: '',
        org_name: '',
        nickname: '',
        full_name: '',
        birthday: '',
        props: ''
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      user_ids: [],
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      recursive: null,
      dialogTitle: '',
      org_code: null,
      showPage: false,
      removePermission: false,
      org_name: null
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_org_member@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_org_code() {
      if ('org_code' in this.$route.query) {
        this.org_code = this.$route.query.org_code
        return this.org_code
      } else {
        return null
      }
    },
    get_org_name() {
      if ('name' in this.$route.query) {
        this.org_name = this.$route.query.name
        return this.org_name
      } else {
        return null
      }
    },
    fetchData() {
      this.get_org_name()
      this.loading = true
      var org_code = this.get_org_code()
      this.$Apis.organize.organize_members_list(org_code, this.recursive, this.text, true, this.pagination.page, this.page_size).then(response => {
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
      var org_code = this.get_org_code()
      this.$Apis.organize.organize_members_list(org_code, this.recursive, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    organize_members_delete(org_code, user_id) {
      let tips = '是否删除该机构成员?'
      this.user_ids = [user_id]
      if (Array.isArray(user_id)) {
        if (JSON.stringify(user_id) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选机构成员?'
        this.user_ids = user_id
      }
      this.$confirm('是否删除该机构成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        // this.user_ids = [user_id]
        this.$Apis.organize.organize_members_remove(org_code, this.user_ids).then(response => {
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
      this.dialogTitle = '机构人员添加'
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
