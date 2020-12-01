<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_assignment@identity.assignment']" class="btn create-btn" @click="create">
        新建
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
      <!-- <el-table-column
        type="selection"
        width="55"/> -->
      <el-table-column
        prop="action_name"
        label="动作代码"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        prop="action_label"
        label="动作显示文本"
        width="180"
      />
      <el-table-column
        prop="role_code"
        label="角色代码"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="role_name"
        label="角色名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="res_code"
        label="资源代码"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="res_text"
        label="资源显示文本"
        width="180"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="expire_at"
        label="授权时间"
        width="180"/> -->
      <el-table-column
        :formatter="bool_to_str"
        prop="available"
        label="是否有效"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        align="right"
        width="45"
      >
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="assignments_delete(scope.row.assignment_id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <assignments-create :action_id="action_id" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import assignmentsCreate from './components/assignmentsCreate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  filters: {
  },
  components: {
    CommonTitle,
    assignmentsCreate
  },
  data() {
    return {
      items: [{
        role_code: '',
        role_name: '',
        action_name: '',
        action_label: '',
        res_code: '',
        res_text: '',
        expire_at: '',
        available: ''
      }],
      multipleSelection: [],
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      action_id: null,
      removePermission: false
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
    this.removePermission = checkPermission(['ns://remove_assignment@identity.assignment'])
  },
  methods: {
    checkPermission,
    get_action_id() {
      if ('action_id' in this.$route.query) {
        this.action_id = this.$route.query.action_id
        return this.action_id
      } else {
        this.action_id = null
        return this.action_id
      }
    },
    get_res_id() {
      if ('res_id' in this.$route.query) {
        var res_id = this.$route.query.res_id
        return res_id
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var text = this.text
      var action_id = this.get_action_id()
      this.$Apis.resource.assignments_list(action_id, text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
      })
    },
    bool_to_str(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    assignments_delete(assignment_id) {
      this.$confirm('是否删除该授权?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.assignments_remove(assignment_id).then(response => {
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
    operateData() {
      var action_id = this.get_action_id()
      this.loading = true
      this.$Apis.resource.assignments_list(action_id, this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加授权'
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
