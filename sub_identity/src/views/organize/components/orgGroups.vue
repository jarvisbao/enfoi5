<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_group@identity.groups']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="group_delete(group_ids)">
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
        prop="name"
        label="群组名称"
        width="120"
      />
      <!-- <el-table-column
        prop="props"
        label="组织机构属性"
        show-overflow-tooltip/> -->
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="group_update(scope.row.group_id)" />
          <i class="el-icon-view" @click="group_info(scope.row.group_id, scope.row.name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="group_delete(scope.row.group_id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <group-create v-if="dialogShow" :org_code="org_code" :org_name="org_name" @show="isShow" @refresh="refresh" />
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
import groupUpdate from '@/views/group/components/groupUpdate'
import groupCreate from '@/views/group/components/groupCreate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import pageParams from '@/mixin/pageParams'
import paginationHandler from '@/mixin/paginationHandler'

export default {
  filters: {
  },
  components: {
    groupUpdate,
    groupCreate
  },
  mixins: [paginationHandler, pageParams],
  data() {
    return {
      items: [{
        name: '',
        props: ''
      }],
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
      org_code: null,
      showPage: false,
      group_ids: [],
      updatePermission: false,
      removePermission: false,
      org_name: null
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_group@identity.groups'])
    this.removePermission = checkPermission(['ns://remove_group@identity.groups'])
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
      this.loading = true
      var org_code = this.get_org_code()
      this.get_org_name()
      this.$Apis.organize.organize_groups_list(org_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
      this.group_ids = []
      val.forEach(element => {
        this.group_ids.push(element.group_id)
      })
    },
    operateData() {
      this.loading = true
      var org_code = this.get_org_code()
      this.$Apis.organize.organize_groups_list(org_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    group_update(group_id) {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.dialogTitle = '更新群组信息'
      this.group_id = group_id
      this.$Apis.group.group_info(group_id).then(response => {
        this.group = response.payload
        this.group_id = group_id
      })
    },
    group_info(group_id, name) {
      sessionStorage.removeItem('label')
      this.set_session()
      var org_code = this.get_org_code()
      this.$router.push({ name: 'organize_group_info', query: { org_code: org_code, group_id: group_id, name: name }})
    },
    group_delete(group_id) {
      let tips = '是否删除该机构群组?'
      if (Array.isArray(group_id)) {
        if (JSON.stringify(group_id) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选机构群组?'
      }
      this.$confirm(tips, '提示', {
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
