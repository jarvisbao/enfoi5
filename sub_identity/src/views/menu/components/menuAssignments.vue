<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_assign@identity.menus']" class="btn create-btn" @click="create">
        新建
      </div>
      <!-- <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter"/>
      </div> -->
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!--<el-table-column type="selection" width="55"/>-->
      <el-table-column prop="role_code" label="角色编码" width="200" show-overflow-tooltip />
      <el-table-column prop="role_name" label="角色名称" width="220" show-overflow-tooltip />
      <el-table-column prop="category" label="角色分类" width="220" />
      <el-table-column prop="comment" label="角色描述" show-overflow-tooltip />
      <el-table-column align="right">
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="assignments_delete(scope.row.menu_code,scope.row.role_code)" />
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
      <menu-assignments-create :menu_code="menu_code" :title="title" :assignments_list="items" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import menuAssignmentsCreate from './menuAssignmentsCreate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    menuAssignmentsCreate
  },
  data() {
    return {
      items: [],
      multipleSelection: [],
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      action_list: [],
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      menu_code: null,
      title: null,
      showColumn: false,
      showPage: false,
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
    this.removePermission = checkPermission(['ns://remove_assign@identity.menus'])
  },
  methods: {
    checkPermission,
    get_menu_code() {
      if ('menu_code' in this.$route.query) {
        this.menu_code = this.$route.query.menu_code
        return this.menu_code
      } else {
        return null
      }
    },
    get_title() {
      if ('name' in this.$route.query) {
        this.title = this.$route.query.name
        return this.title
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var menu_code = this.get_menu_code()
      this.$Apis.menu.assignments(menu_code, true, this.pagination.page, this.page_size).then(response => {
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
      this.get_title()
    },
    operateData() {
      const menu_code = this.menu_code
      this.loading = true
      this.$Apis.menu.assignments(
        menu_code,
        true,
        this.pagination.page,
        this.page_size
      ).then(response => {
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
    // schfilter() {
    //   this.pagination.page = 1
    //   this.operateData()
    // },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    assignments_delete(menu_code, role_code) {
      this.$confirm('是否删除该授权?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.menu.remove_assignments(menu_code, role_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.refresh()
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加授权'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.items = []
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
