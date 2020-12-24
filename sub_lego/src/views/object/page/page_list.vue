<template>
  <div class="app-container">
    <!-- <common-title/> -->
    <div class="action-btn">
      <div id="create" class="btn create-btn" @click="create">
        新建
      </div>
      <div class="btn create-btn delete" @click="page_removes">
        删除所选
      </div>
      <div id="object" class="btn" @click="goObject">
        对象定义
      </div>
      <div class="btn mtd-btn" @click="goMethod">
        操作定义
      </div>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
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
        prop="page_name"
        label="页面名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="page_code"
        label="页面代码"
        show-overflow-tooltip
      />
      <el-table-column
        prop="description"
        label="用途描述"
        show-overflow-tooltip
      />
      <el-table-column
        prop="fields"
        label="页面显示字段"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.fields }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="page_update(scope.row.page_id)" />
          <i class="el-icon-view" @click="page_info(scope.row.page_id)" />
          <i class="el-icon-delete" @click="page_remove(scope.row.page_id)" />
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span id="row-running" @click="data_view(scope.row)"><i class="font-icon icon-jiedianguanli" />运行</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="createMenuPermission" divided>
                <span id="row-menu" @click="create_menu(scope.row)"><i class="font-icon icon-leimu" />生成菜单</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      <menu-create :menu="menu_data" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import { instance as Vue } from '@/life-cycle'
import menuCreate from '../components/menuCreate'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    menuCreate
  },
  data() {
    return {
      items: [],
      text: null,
      loading: false,
      showColumn: false,
      showPage: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      page: {},
      options: [],
      biz_id: [],
      fields: [],
      object_id: null,
      page_ids: [],
      datas: [],
      menu_list: [],
      removePermission: false,
      menu_data: {
        code: null,
        text: null,
        parent: null,
        url: null,
        number: '',
        icon: null
      },
      createMenuPermission: false,
      proj_code: null,
      biz_code: null
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
    this.get_object_id()
    this.fetchData()
    this.createMenuPermission = checkPermission(['ns://create_menu@identity.menus'])
    // this.removePermission = checkPermission(['ns://remove_page@lego.project.' + this.proj_code + '.page'])
    this.proj_code = this.$route.query.proj_code ? this.$route.query.proj_code : null
    this.biz_code = this.$route.query.biz_code ? this.$route.query.biz_code : null
  },
  methods: {
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
    get_object_id() {
      if ('object_id' in this.$route.query) {
        this.object_id = this.$route.query.object_id
        return this.object_id
      } else {
        return null
      }
    },
    fetchData() {
      const object_id = this.get_object_id()
      this.loading = true
      this.$Apis.object.page_list(object_id, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.object.page_list(this.object_id, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
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
      this.$router.push({ name: 'page_create', query: { object_id: this.object_id }})
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    page_update(page_id) {
      this.set_session()
      this.$router.push({ name: 'page_update', query: { page_id: page_id }})
    },
    page_info(page_id) {
      this.set_session()
      this.$router.push({ name: 'page_info', query: { page_id: page_id }})
    },
    page_remove(page_id) {
      this.$confirm('是否删除该页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.page_delete(page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    page_removes() {
      if (JSON.stringify(this.page_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.object.page_delete(this.page_ids).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    data_view(row) {
      this.set_session()
      this.$router.push({ name: 'data', query: { object_id: row.object_id, page_id: row.page_id, name: row.page_name }})
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.page_ids = []
      val.forEach(element => {
        this.page_ids.push(element.page_id)
      })
    },
    create_menu(row) {
      this.menu_data.menu_code = row.page_code
      this.menu_data.label = row.page_name
      this.menu_data.uri = '/data?object_id=' + this.object_id + '&page_id=' + row.page_id + '&name=' + row.page_name
      this.menu_data = JSON.parse(JSON.stringify(this.menu_data))
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '创建菜单'
    },
    goObject() {
      this.$Apis.object.object_info_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const proj_code = response.payload.proj_code
          const object_code = response.payload.object_code
          const name = response.payload.object_name
          this.$router.push({ name: 'object_update', query: { proj_code: proj_code, object_code: object_code, name: name }})
        }
      })
    },
    goMethod() {
      this.$router.push({ name: 'operate', query: { object_id: this.object_id, name: this.$route.query.name }})
    }
  }
}
</script>
