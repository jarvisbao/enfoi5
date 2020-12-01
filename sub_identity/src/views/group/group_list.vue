<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_group@identity.groups']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="group_deletes">
        注销所选
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="active_groups">
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
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="group_name"
        label="群组名称"
      />
      <el-table-column
        prop="org_name"
        label="所属机构"
      />
      <el-table-column
        :formatter="convert"
        prop="active_roles"
        label="角色"
      />
      <!-- <el-table-column
        prop="props"
        label="组织机构属性"
        show-overflow-tooltip/> -->
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="group_update(scope.row.group_id)" />
          <i v-if="scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="group_info(scope.row.org_code, scope.row.group_id, scope.row.group_name)" />
          <i v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="group_delete(scope.row.group_id)" />
          <span v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_group(scope.row.group_id)">激活</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <group-create v-if="dialogShow" @show="isShow" @refresh="refresh" />
      <group-update v-else :group="group" :group_id="group_id" @show="isShow" @refresh="refresh" />
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
import groupCreate from './components/groupCreate'
import groupUpdate from './components/groupUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  filters: {
  },
  components: {
    CommonTitle,
    groupCreate,
    groupUpdate
  },
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
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      group: {},
      group_id: null,
      disable: true,
      showPage: false,
      groupids: [],
      removePermission: false,
      updatePermission: false,
      status: 'all'
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
    this.get_page_params()
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_group@identity.groups'])
    this.updatePermission = checkPermission(['ns://update_group@identity.groups'])
  },
  methods: {
    checkPermission,
    get_page_params() {
      if (sessionStorage.getItem(this.$route.name)) {
        const pageParams = JSON.parse(sessionStorage.getItem(this.$route.name))
        if (this.$route.path === pageParams.path) {
          this.text = pageParams.text
          this.pagination.page = pageParams.page_index
          this.page_size = pageParams.page_size
        }
      }
    },
    fetchData() {
      this.loading = true
      this.$Apis.group.group_list(this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
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
    convert: function(row, column, cellValue, index) {
      if (cellValue) {
        var arr = new Array(0)
        cellValue.map((item, index) => {
          arr.push(item.role_name)
        })
        return String(arr)
      }
    },
    handleSelectionChange(val) {
      this.groupids = []
      val.forEach(element => {
        this.groupids.push(element.group_id)
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.group.group_list(this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
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
      this.$Apis.group.group_list(this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
      })
    },
    group_update(group_id) {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.dialogTitle = '更新群组信息'
      this.$Apis.group.group_info(group_id).then(response => {
        this.group = response.payload
        this.group_id = group_id
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    group_info(org_code, group_id, group_name) {
      this.set_session()
      this.$router.push({ name: 'group_info', query: { org_code: org_code, group_id: group_id, name: group_name }})
    },
    group_delete(group_id) {
      this.$confirm('是否注销该群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.group.group_remove_v2(group_id).then(response => {
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
    active_group(group_id) {
      this.$confirm('是否激活该群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.group.active_group(group_id).then(response => {
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
    group_deletes() {
      if (JSON.stringify(this.groupids) === '[]') {
        this.$alert('请选择要注销的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否注销所选群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.group.group_remove_v2(this.groupids).then(response => {
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
    active_groups() {
      if (JSON.stringify(this.groupids) === '[]') {
        this.$alert('请选择要激活的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否激活所选群组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.group.active_group(this.groupids).then(response => {
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '新建群组'
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
