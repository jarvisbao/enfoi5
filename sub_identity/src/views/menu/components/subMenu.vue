<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_menu@identity.menus']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="menu_deletes">
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
        prop="menu_code"
        label="菜单编码"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="label"
        label="菜单显示文本"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="number"
        label="菜单顺序"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="uri"
        label="菜单路由"
        width="260"
        show-overflow-tooltip
      />
      <el-table-column
        prop="icon"
        label="图标"
      >
        <template slot-scope="scope">
          <i :class="scope.row.icon" class="menu-icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="子菜单个数"
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="170"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="menu_update(scope.row.menu_code)" />
          <i class="el-icon-view" @click="menu_info(scope.row.menu_code, scope.row.label)" />
          <i v-if="removePermission" class="el-icon-delete" @click="menu_delete(scope.row.menu_id)" />
          <span v-if="assignPermission" class="assignments-btn" @click="menu_assignments(scope.row.menu_code, scope.row.label)">授权</span>
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
      <menu-create v-if="dialogShow" :is-disabled="false" :parent-menu="parentMenu" @show="isShow" @refresh="refresh" :device="device" />
      <menu-update v-else-if="dialogUpdate" :menu="menu" @show="isShow" @refresh="refresh" :device="device" />
      <menu-assignments-create v-else :menu_code="menu_code" :title="title" :assignments_list="assignments_items" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import menuCreate from './menuCreate'
import menuUpdate from './menuUpdate'
import menuAssignmentsCreate from './menuAssignmentsCreate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  props: {
    device: {
      type: String,
      default: undefined
    }
  },
  components: {
    menuCreate,
    menuUpdate,
    menuAssignmentsCreate
  },
  data() {
    return {
      items: [
        {
          menu_code: '',
          label: '',
          uri: '',
          number: null,
          icon: null
        }
      ],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      loading: false,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      dialogUpdate: false,
      menu: {},
      menu_code: null,
      action_id: null,
      title: null,
      assignments_items: [],
      namespace: null,
      parentMenu: null,
      action_list: [],
      showColumn: false,
      showPage: false,
      menu_ids: [],
      updatePermission: false,
      removePermission: false,
      assignPermission: false
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
    this.updatePermission = checkPermission(['ns://update_menu@identity.menus'])
    this.removePermission = checkPermission(['ns://remove_menu@identity.menus'])
    this.assignPermission = checkPermission(['ns://create_assign@identity.menus'])
  },
  methods: {
    checkPermission,
    get_menu_code() {
      if ('menu_code' in this.$route.query) {
        var menu_code = this.$route.query.menu_code
        return menu_code
      } else {
        return null
      }
    },
    get_title() {
      if ('name' in this.$route.query) {
        this.parentMenu = this.$route.query.name
        return this.parentMenu
      } else {
        return null
      }
    },
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
    handleSelectionChange(val) {
      this.menu_ids = []
      val.forEach(element => {
        this.menu_ids.push(element.menu_id)
      })
    },
    fetchData() {
      const menu_code = this.get_menu_code()
      this.$Apis.menu.menu_list(menu_code, this.text, true, this.pagination.page, this.page_size, this.device).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
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
      var menu_code = this.get_menu_code()
      this.$Apis.menu.menu_list(
        menu_code,
        this.text,
        true,
        this.pagination.page,
        this.page_size,
        this.device
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
      this.dialogTitle = '创建菜单'
      this.dialogShow = true
      this.dialogUpdate = false
    },
    menu_update(menu_code) {
      this.$Apis.menu.menu_info(menu_code).then(response => {
        this.menu = response.payload
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '更新菜单'
        this.dialogShow = false
        this.dialogUpdate = true
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    menu_info(menu_code, title) {
      this.set_session()
      let menu_name = 'menu_info'
      if (this.device) {
        menu_name = 'mobile_menu_info'
      }
      this.$router.push({ name: menu_name, query: { menu_code: menu_code, name: title }})
    },
    menu_delete(menu_id) {
      this.$confirm('是否删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.menu.menu_remove(menu_id).then(response => {
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
    menu_deletes() {
      if (JSON.stringify(this.menu_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.menu.menu_remove(this.menu_ids).then(response => {
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
    menu_assignments(menu_code, title) {
      this.menu_code = menu_code
      this.title = title
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加授权'
      this.dialogShow = false
      this.dialogUpdate = false
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

