<template>
  <div>
    <el-table
      v-loading="loading"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        v-if="isMultiple || can_export"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in headers"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <!-- <div v-if="item.is_object">
            <i class="el-icon-view" @click="redirect_object(scope.row,scope.row[scope.column.property],scope.column.property)" />
          </div> -->
          <div v-if="item.data_format && ['image','file', 'html'].indexOf(item.data_format) != -1">
            <span class="dlink" v-html="scope.row[scope.column.property]" />
          </div>
          <div v-else-if="convert && scope.column.property in design_select">
            {{ scope.row[scope.column.property] | formatterFun(design_select[scope.column.property].values, design_select[scope.column.property].labels) }}
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
        width="150"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.buttons" :key="item.action">
            <template v-if="index < 3">
              <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)" style="margin-left: 3px; cursor:pointer">
                <i v-if="item.icon" :class="item.icon" />
                <span v-else>{{ item.name }}</span>
              </span>
            </template>
          </div>
          <el-dropdown v-if="scope.row.buttons.length > 3">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in scope.row.buttons.slice(3)" :key="index">
                <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)">
                  <span v-if="item.icon"><i :class="item.icon" /> {{ item.name }}</span>
                  <span v-else>{{ item.name }}</span>
                </span>
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
  </div>
</template>
<script>

export default {
  props: {
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    },
    pageFilters: {
      type: Array,
      default: () => []
    },
    searchText: {
      type: String,
      default: null
    },
    add_script: {
      type: Function,
      default: null
    },
    set_session: {
      type: Function,
      default: null
    },
    isBycode: {
      type: Boolean,
      default: false
    },
    proj_code: {
      type: String,
      default: null
    },
    object_code: {
      type: String,
      default: null
    },
    page_code: {
      type: String,
      default: null
    },
    pntfk: {
      type: String,
      default: null
    },
    pntid: {
      type: String,
      default: null
    }
  },
  filters: {
    formatterFun: function(value, values, labels) {
      if (!value) return value
      const index = values.indexOf(value)
      if (index !== -1) {
        return labels[index]
      }
    }
  },
  data() {
    return {
      loading: false,
      text: this.searchText,
      items: [],
      headers: [],
      headers_all: [],
      filters: this.pageFilters,
      convert: true,
      design_select: {},
      selectionData: [],
      isAll: true,
      ids: [],
      update_headers: [],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      showColumn: false,
      isMultiple: false,
      design_form: null,
      delete_applycondition: '',
      single_methods: [],
      other_methods: [],
      methodsItems: [],
      newOtherMethods: [],
      newSingleMethods: [],
      enable_record: false,
      can_create: false,
      can_view: false,
      can_update: false,
      can_delete: false,
      can_export: false,
      is_view: false,
      cellBtn: [],
      mtdFilters: [],
      exportFilters: {}
    }
  },
  computed: {
    allBtns() {
      const { items, cellBtn, newSingleMethods, delete_applycondition } = this
      items.forEach(item => {
        const row = item
        this.$set(item, 'buttons', [])
        item.buttons.push(...cellBtn, ...newSingleMethods)
        item.buttons.forEach((i, index) => {
          if (i.isMtd && eval(i.apply_condition) === false) {
            item.buttons.splice(index, 1)
          }
        })
        if (delete_applycondition && !eval(delete_applycondition)) {
          item.buttons = item.buttons.filter(i => {
            return i.action !== 'remove'
          })
        }
      })
      return items
    }
  },
  watch: {
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    },
    allBtns: {
      handler(val) {}
    },
    items: {
      handler(val) {
        if (val.length < 1) {
          this.$Utils.EventBus.$emit('disable_export_btn', true)
        } else {
          this.$Utils.EventBus.$emit('disable_export_btn', false)
        }
      }
    },
    pagination: {
      handler(val) {
        this.$emit('pagination', val)
      }
    },
    page_size: {
      handler(val) {
        this.$emit('pageSize', val)
      }
    },
    searchText: {
      handler(val) {
        this.text = val
      }
    }
  },
  created() {
    this.get_page_params()
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$Utils.EventBus.$on('refresh', () => {
        this.refresh()
      })
      this.$Utils.EventBus.$on('get-query-data', (params) => {
        this.getQueryData(params)
      })
    })
  },
  beforeDestroy() {
    this.$Utils.EventBus.$off('refresh')
    this.$Utils.EventBus.$off('get-query-data')
  },
  methods: {
    fnCall(fun, row) {
      this[fun](row)
    },
    mtdCall(fun, item, row) {
      this[fun](item, row)
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
    get_design_select() {
      let design_select = ''
      if (!this.isBycode) {
        design_select = this.$Apis.object.get_design_select(this.object_id, this.page_id)
      } else {
        design_select = this.$Apis.object.get_design_select_by_code(this.proj_code, this.object_code, this.page_code)
      }
      design_select.then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    get_object_info() {
      let object_info = ''
      if (!this.isBycode) {
        object_info = this.$Apis.object.object_info_by_id(this.object_id)
      } else {
        object_info = this.$Apis.object.object_info(this.proj_code, this.object_code)
      }
      object_info.then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          // this.is_view = response.payload.is_view
          this.design_form = response.payload.design_form
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.enable_record = response.payload.enable_record
          if (this.isBycode) {
            this.object_id = response.payload.object_id
            this.$emit('obj_id', this.object_id)
          }
          this.get_all_headers()
          this.get_method()
          if (!this.page_id && !this.page_code) {
            this.can_create = response.payload.can_create
            this.can_view = response.payload.can_view
            this.can_update = response.payload.can_update
            this.can_delete = response.payload.can_delete
            this.can_export = response.payload.can_export
            if (this.can_view && !this.is_view) {
              this.cellBtn.push({
                name: '查看',
                action: 'view',
                icon: 'el-icon-view',
                fun: 'info'
              })
            }
            if (this.can_update && !this.is_view) {
              this.cellBtn.push({
                name: '更新',
                action: 'update',
                icon: 'el-icon-edit',
                fun: 'update'
              })
            }
            if (this.can_delete && !this.is_view) {
              this.cellBtn.push({
                name: '删除',
                action: 'remove',
                icon: 'el-icon-delete',
                fun: 'remove'
              })
            }
            this.fetchData()
            this.$emit('can_create', this.can_create)
            this.$emit('is_view', this.is_view)
            this.$emit('can_export', this.can_export)
          } else {
            this.get_page_info()
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    get_page_info() {
      let page_info = ''
      if (!this.isBycode) {
        page_info = this.$Apis.object.page_info(this.page_id)
      } else {
        page_info = this.$Apis.object.page_info_by_code(this.proj_code, this.object_code, this.page_code)
      }
      page_info.then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.can_create = response.payload.can_create
          this.can_view = response.payload.can_view
          this.can_update = response.payload.can_update
          this.can_delete = response.payload.can_delete
          this.can_export = response.payload.can_export
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          if (this.isBycode) {
            this.page_id = response.payload.page_id
            this.$emit('page_id', this.page_id)
          }
          if (this.can_view) {
            this.cellBtn.push({
              name: '查看',
              action: 'view',
              icon: 'el-icon-view',
              fun: 'info'
            })
          }
          if (this.can_update) {
            this.cellBtn.push({
              name: '更新',
              action: 'update',
              icon: 'el-icon-edit',
              fun: 'update'
            })
          }
          if (this.can_delete) {
            this.cellBtn.push({
              name: '删除',
              action: 'remove',
              icon: 'el-icon-delete',
              fun: 'remove'
            })
          }
          this.fetchData()
          this.$emit('can_create', this.can_create)
          this.$emit('is_view', this.is_view)
          this.$emit('can_export', this.can_export)
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    get_all_headers() {
      this.$Apis.object.get_headers(this.object_id, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers_all = response.payload
          this.$Utils.EventBus.$emit('get_headers_all', this.headers_all)
        }
      })
    },
    fetchData() {
      this.loading = true
      this.$Apis.object.get_headers(this.object_id, false, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.items = response.payload.items
              this.pagination = response.payload.pagination
              if (this.pagination.total > 0) {
                this.showPage = true
                this.showColumn = true
              } else {
                this.showPage = false
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
        // this.$store.commit('SET_HEADERS', this.headers)
        this.$Utils.EventBus.$emit('get_headers', this.headers)
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert).then(response => {
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
            confirmButtonText: '确定'
          })
        }
      })
    },
    get_method() {
      this.$Apis.object.method_list_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.loading = false
          this.methodsItems = response.payload.items
          this.get_new_other()
          this.get_new_single()
          if (JSON.stringify(this.newOtherMethods) !== '[]') {
            this.isMultiple = true
          } else {
            this.isMultiple = false
          }
        }
      })
    },
    get_new_other() {
      if (this.other_methods !== null) {
        this.other_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.newOtherMethods.push(item)
            }
          })
        })
        this.$Utils.EventBus.$emit('get_other_methods', this.newOtherMethods)
      }
    },
    get_new_single() {
      if (this.single_methods !== null) {
        this.single_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.$set(item, 'name', item.operate_name)
              this.$set(item, 'fun', 'clickType' + item.operate_type)
              this.$set(item, 'isMtd', true)
              this.newSingleMethods.push(item)
            }
          })
        })
      }
    },
    handleSelectionChange(val) {
      this.selectionData = val

      this.exportFilters = {}
      this.mtdFilters = []
      this.ids = []
      const selectionLength = val.length
      // 判断是否选中当前页所有行
      if (selectionLength === this.page_size || selectionLength === this.pagination.total) {
        this.exportFilters = {}
        this.isAll = true
      } else {
        this.isAll = false
        val.forEach((item, index) => {
          var filter = []
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                filter.push(element['prop'] + '=="' + element['value'] + '"')
                this.mtdFilters.push(element['prop'] + '=="' + element['value'] + '"')
                this.ids.push(element['value'])
                return true
              }
            }
          })
          this.exportFilters[index] = filter
        })
      }
      this.$Utils.EventBus.$emit('get_select_data', this.selectionData)
      this.$Utils.EventBus.$emit('get_is_all', this.isAll)
      this.$Utils.EventBus.$emit('get_ids', this.ids)
    },
    schfilter(val) {
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
    refresh(val) {
      this.filters = val
      this.fetchData()
    },
    update(row) {
      let ids = []
      this.update_headers = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      this.set_session()
      ids = ids.join(',')
      this.$router.push({ name: 'data_update', query: { object_id: this.object_id, objid: ids, record: this.enable_record }})
    },
    info(row) {
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      this.set_session()
      ids = ids.join(',')
      this.$router.push({ name: 'data_info', query: { object_id: this.object_id, page_id: this.page_id, objid: ids, record: this.enable_record }})
    },
    remove(row) {
      let ids = []
      this.headers_all.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.$confirm('是否删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        if (!ids) {
          this.$alert('该业务类下字段没有设置主键，不允许删除', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        this.$Apis.object.data_delete(this.object_id, ids).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh([])
            }
          })
        })
      }).catch(() => {
      })
    },
    clickType3(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      this.set_session()
      ids = ids.join(',')
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record }})
        }).catch(() => {})
      } else {
        this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record }})
      }
    },
    clickType4(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      const update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          update_headers.push(element)
        }
      })
      update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.set_session()
      const params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.$Utils.request({
            url: url,
            method: 'post',
            data: params
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refresh()
              }
            })
          })
        }).catch(() => {})
      } else {
        this.$Utils.request({
          url: url,
          method: 'post',
          data: params
        }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refresh()
              }
            })
          })
      }
    },
    clickType5(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const update_headers = []
        let ids = []
        this.headers_all.forEach(element => {
          if (!element['is_property'] && !element['is_object']) {
            update_headers.push(element)
          }
        })
        update_headers.some(element => {
          element['value'] = row[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
        ids = ids.join(',')
        const params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }
        var _result = []
        for (var key in params) {
          var value = params[key]
          if (Array.isArray(value)) {
            value.forEach(function(_value) {
              _result.push(key + '=' + _value)
            })
          } else if (value === null) {
            _result.push(key + '=')
          } else {
            _result.push(key + '=' + value)
          }
        }
        newUrl = url + '?' + _result.join('&')
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else {
            this.set_session()
            this.$Utils.util.routerGo(newUrl)
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else {
          this.set_session()
          this.$Utils.util.routerGo(newUrl)
        }
      }
    },
    getQueryData(params) {
      const queryparam = []
      params.forEach(item => {
        queryparam.push(Object.values(item).join(''))
      })
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, queryparam, this.convert).then(response => {
        this.loading = true
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dlink /deep/ a {
  margin: 0 3px;
  color: #409eff;
}
[class*=" icon-"], [class^=icon-] {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.cell [class*=" icon-"], .cell [class^=icon-] {
  margin: 0 3px;
  font-size: 18px;
  cursor: pointer;
  color: #c5c5c5;
}
</style>
