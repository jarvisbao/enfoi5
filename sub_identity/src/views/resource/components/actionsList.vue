<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_action@identity.action']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="actions_delete(action_ids)">
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
        prop="action_name"
        label="动作代码"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="action_label"
        label="动作显示文本"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="convert"
        prop="attributes"
        label="所包含的属性列表"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="default_roles"
        label="角色代码列表"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="is_children"
        width="180"
        label="是否为子资源的动作"
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="is_self"
        width="180"
        label="是否本级资源的动作"
      />
      <el-table-column
        :formatter="parent_namespace"
        prop="from_parent"
        width="200"
        label="所属资源"
      />
      <el-table-column
        prop="privilege"
        label="权限代码"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="props"
        label="动作的属性字段"
        show-overflow-tooltip/> -->
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="170"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="actions_update(scope.row.action_id)" />
          <i class="el-icon-view" @click="assignments_list(scope.row.action_id, scope.row.action_label)" />
          <i v-if="removePermission" class="el-icon-delete" @click="actions_delete(scope.row.action_id)" />
          <span v-if="assignPermission" class="assignments-btn" @click="assignment_create(scope.row)">授权</span>
          <!-- <div v-permission="['ns://create_assignment@identity.assignment']" class="btn create-btn" @click="create">新建</div> -->
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
      <actions-create v-if="dialogShow" :namespace="namespace" @show="isShow" @refresh="refresh" />
      <assignments-create v-else-if="assignmentVisible" :action_id="action_id" :action_name="action_name" :action_label="action_label" @show="isShow" @refresh="refresh" />
      <actions-update v-else :actions="actions" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import actionsCreate from './actionsCreate'
import actionsUpdate from './actionsUpdate'
import assignmentsCreate from './assignmentsCreate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    actionsCreate,
    actionsUpdate,
    assignmentsCreate
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
        action_name: '',
        action_label: '',
        attributes: '',
        default_roles: '',
        is_children: false,
        is_self: false,
        privilege: 0,
        props: ''
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
      namespace: null,
      dialogVisible: false,
      assignmentVisible: false,
      dialogTitle: null,
      dialogShow: false,
      actions: {},
      showColumn: false,
      showPage: false,
      action_id: null,
      action_name: null,
      action_label: null,
      action_ids: [],
      updatePermission: false,
      removePermission: false,
      assignPermission: false
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_action@identity.action'])
    this.removePermission = checkPermission(['ns://remove_action@identity.action'])
    this.assignPermission = checkPermission(['ns://create_assignment@identity.assignment'])
  },
  methods: {
    checkPermission,
    get_res_namespace() {
      if ('namespace' in this.$route.query) {
        this.namespace = this.$route.query.namespace
        return this.namespace
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var text = this.text
      var namespace = this.get_res_namespace()
      this.$Apis.resource.actions_list(namespace, text, true, this.pagination.page, this.page_size).then(response => {
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
      })
    },
    bool_to_str: function(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    parent_namespace: function(row, column, cellValue, index) {
      if (cellValue) {
        return row['namespace']
      } else {
        return '当前资源'
      }
    },
    handleSelectionChange(val) {
      this.action_ids = []
      val.forEach(element => {
        this.action_ids.push(element.action_id)
      })
    },
    actions_update(action_id) {
      // this.$router.push({ name: 'actions_update', query: { action_id: action_id }})
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.assignmentVisible = false
      this.dialogTitle = '更新动作'
      this.$Apis.resource.actions_info(action_id).then(response => {
        this.actions = response.payload
      })
    },
    assignments_list(action_id, action_label) {
      var namespace = this.get_res_namespace()
      this.$router.push({ name: 'assignments_list', query: { namespace: namespace, action_id: action_id, name: action_label }})
    },
    actions_delete(action_id) {
      let tips = '是否删除该动作?'
      if (Array.isArray(action_id)) {
        if (JSON.stringify(action_id) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选动作?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.actions_remove(action_id).then(response => {
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
      var namespace = this.get_res_namespace()
      this.loading = true
      this.$Apis.resource.actions_list(namespace, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.assignmentVisible = false
      this.dialogTitle = '添加动作'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    assignment_create(row) {
      // this.dialogVisible2 = !this.dialogVisible2
      this.dialogVisible = !this.dialogVisible
      this.assignmentVisible = true
      this.dialogShow = false
      this.dialogTitle = '添加授权'
      this.action_id = row.action_id
      this.action_name = row.action_name
      this.action_label = row.action_label
    },
    convert(row, column, cellValue, index) {
      return String(cellValue)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
