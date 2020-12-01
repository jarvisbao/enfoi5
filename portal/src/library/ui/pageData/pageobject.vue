<template>
  <div>
    <div class="app-container pagedata">
      <div v-show="headers.length > 0" class="action-btn">
        <div v-show="can_create" id="create" class="btn create-btn" @click="create">
          新建
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
      >
        <el-table-column
          v-for="(item, index) in headers"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="item.is_object">
              <i class="el-icon-view" @click="redirect_object(scope.row,scope.row[scope.column.property],scope.column.property)" />
            </div>
            <div v-else-if="item.data_format && ['image','file', 'html'].indexOf(item.data_format) != -1">
              <span class="dlink" v-html="scope.row[scope.column.property]" />
            </div>
            <div v-else>
              {{ scope.row[scope.column.property] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showColumn"
          fixed="right"
          align="right"
          width="80"
        >
          <template slot-scope="scope">
            <i v-show="can_update" class="el-icon-edit" @click="update(scope.row)" />
            <i v-show="can_delete" class="el-icon-delete" @click="remove(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="showPage"
        :page-size="page_size"
        :layout="layout"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { get_headers, object_list, data_delete, page_info } from '@/library/api/object'

export default {
  data() {
    return {
      items: [],
      headers: [],
      loading: false,
      showColumn: false,
      page_code: null,
      proj_code: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      filters: [],
      create_headers: [],
      update_headers: [],
      delete_headers: [],
      headers_all: [],
      cls_name: null,
      currentPage: 1,
      pageSize: 10,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      can_create: false,
      can_update: false,
      can_delete: false,
      design_form: null,
      edit_data: {},
      object_filter: null,
      prev_page: null,
      uselist: false
    }
  },
  computed: {
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
  },
  methods: {
    get_page_code() {
      if ('page_code' in this.$route.query) {
        this.page_code = this.$route.query.page_code
        return this.page_code
      } else {
        return null
      }
    },
    get_proj_code() {
      if ('proj_code' in this.$route.query) {
        this.proj_code = this.$route.query.proj_code
        return this.proj_code
      } else {
        return null
      }
    },
    get_uselist() {
      if ('uselist' in this.$route.query) {
        this.uselist = this.$route.query.uselist
        return this.uselist
      } else {
        return null
      }
    },
    get_filters() {
      if ('filters' in this.$route.query) {
        this.filters = JSON.parse(this.$route.query.filters)
        return this.filters
      } else {
        return null
      }
    },
    get_object_filter() {
      if ('object_filter' in this.$route.query) {
        this.object_filter = this.$route.query.object_filter
        return this.object_filter
      } else {
        return null
      }
    },
    get_prev_page() {
      if ('prev_page' in this.$route.query) {
        this.prev_page = this.$route.query.prev_page
        return this.prev_page
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
    get_page_info(proj_code, page_code) {
      page_info(proj_code, page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.can_create = response.payload.can_create
          this.can_update = response.payload.can_update
          this.can_delete = response.payload.can_delete
          this.design_form = response.payload.design_form
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    get_all_headers(proj_code, page_code) {
      const all_fields = true
      pagedata_get_headers(proj_code, page_code, all_fields).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers_all = response.payload
        }
      })
    },
    fetchData() {
      const page_code = this.get_page_code()
      const proj_code = this.get_proj_code()
      this.get_uselist()
      this.get_filters()
      this.get_object_filter()
      this.get_prev_page()
      this.get_all_headers(proj_code, page_code)
      this.get_page_info(proj_code, page_code)
      this.loading = true
      get_headers(proj_code, page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          pageobject_list(this.proj_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.object_filter, this.prev_page, true).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.items = response.payload.items
              if (!this.uselist && this.items.length === 1) {
                this.can_create = false
              }
              this.can_create = false
              this.pagination = response.payload.pagination
              if (this.pagination.total > 0) {
                this.showPage = true
                this.showColumn = true
              } else {
                this.showPage = false
                this.showColumn = false
              }
              if (this.items.length > 0) {
                this.showColumn = true
              } else {
                this.showColumn = false
              }
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
        this.loading = false
      })
    },
    operateData() {
      this.loading = true
      pageobject_list(this.proj_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.object_filter, this.prev_page, true).then(response => {
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
          if (this.items.length > 0) {
            this.showColumn = true
          } else {
            this.showColumn = false
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
    create() {
      this.$router.push({ name: 'page_data_create', query: { proj_code: this.proj_code, page_code: this.page_code }})
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    update(row) {
      this.filters = []
      // this.update_headers = JSON.parse(JSON.stringify(this.headers))
      this.update_headers = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.forEach(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            this.filters.push(element['prop'] + '=="' + element['value'] + '"')
          }
        }
      })
      this.set_session()
      const filters = JSON.stringify(this.filters)
      this.$router.push({ name: 'page_object_update', query: { proj_code: this.proj_code, page_code: this.page_code, filters: filters }})
    },
    redirect_object(row, next_page, object_filter) {
      this.filters = []
      this.headers_all.forEach(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            this.filters.push(element['prop'] + '=="' + element['value'] + '"')
          }
        }
      })
      this.set_session()
      const filters = JSON.stringify(this.filters)
      const redirect = { path: '/page/object', query: { proj_code: this.proj_code, page_code: next_page, filters: filters, object_filter: object_filter, prev_page: this.page_code }}
      this.$router.push(redirect)
    },
    remove(row) {
      this.filters = []
      // this.delete_headers = JSON.parse(JSON.stringify(this.headers))
      this.headers_all.forEach(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            this.filters.push(element['prop'] + '=="' + element['value'] + '"')
          }
        }
      })
      this.$confirm('是否删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        pagedata_delete(this.proj_code, this.page_code, this.filters).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh([])
            }
          })
          // this.refresh([])
          // this.loading = false
        })
      }).catch(() => {
      })
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh(val) {
      this.filters = val
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
.pagedata /deep/ .scrollbar-container {
  display: flex;
  max-height: 400px;
  .generateform-box {
    width: 100%;
  }
  .handle-btn {
    width: 100%;
    margin-bottom: 5px;
  }
}
.enfo-header-tips {
  float: left;
  margin-right: 12px;
  padding: 8px 18px;
  border-radius: 20px;
  color: #999;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
}
.dlink /deep/ a {
  margin: 0 3px;
  color: #409eff
}
</style>
