<template>
  <div>
    <div class="app-container pagedata">
      <!-- <common-title/> -->
      <div class="title-nav">
        <span class="title">{{ currentName ? currentName : $route.query.name }}</span>
      </div>
      <div v-show="headers.length > 0" class="action-btn">
        <div v-show="can_create&&!is_view" id="create" class="btn create-btn" @click="create">
          新建
        </div>
        <el-button v-show="can_export" :disabled="items.length===0" class="btn create-btn export-btn" @click="export_data">
          导出
        </el-button>
        <template v-for="(item, index) in newOtherMethods">
          <div :key="index" class="btn operate-btn">
            <span v-if="item.operate_type===1" id="plcl" @click="clickType1(item)">{{ item.operate_name }}</span>
            <span v-if="item.operate_type===2" id="plxg" @click="clickType2(item)">{{ item.operate_name }}</span>
            <span v-if="item.operate_type===6" id="plPost" @click="clickType6(item)">{{ item.operate_name }}</span>
            <span v-if="item.operate_type===7" id="plGet" @click="clickType7(item)">{{ item.operate_name }}</span>
            <span v-if="item.operate_type===8" id="clsCreate" @click="clickType8(item)">{{ item.operate_name }}</span>
            <span v-if="item.operate_type===9" id="fileUpload" @click="clickType9(item)">{{ item.operate_name }}</span>
          </div>
        </template>
        <el-upload
          ref="fileUpload"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="changeUpload"
          action=""
          style="display: none"
        />
        <div class="right-btn">
          <el-button type="text" @click="query" style="margin-right: 10px">
            查询
          </el-button>
          <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="items"
        tooltip-effect="dark"
        style="width: 100%"
        border
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
            <!--            <div v-if="item.is_object">-->
            <!--              <i class="el-icon-view" @click="redirect_object(scope.row,scope.row[scope.column.property],scope.column.property)" />-->
            <!--            </div>-->
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
                <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)">
                  <i v-if="item.icon" :class="item.icon" :title="item.name" />
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
                    <span v-if="item.icon"><i :class="item.icon" :title="item.name" /> {{ item.name }}</span>
                    <span v-else>{{ item.name }}</span>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- <i v-show="can_view&&!is_view" class="el-icon-view" @click="info(scope.row)" />
            <i v-show="can_update&&!is_view" class="el-icon-edit" @click="update(scope.row)" />
            <i v-display="[delete_applycondition, scope.row]" v-show="can_delete&&!is_view" class="el-icon-delete" @click="remove(scope.row)" />
            <template v-if="newSingleMethods.length >= 1">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in newSingleMethods" :key="index">
                    <span v-display="[item.apply_condition, scope.row]" v-if="item.operate_type===3" id="rowEdit" @click="clickType3(item, scope.row)">{{ item.operate_name }}</span>
                    <span v-display="[item.apply_condition, scope.row]" v-if="item.operate_type===4" id="rowPost" @click="clickType4(item, scope.row)">{{ item.operate_name }}</span>
                    <span v-display="[item.apply_condition, scope.row]" v-if="item.operate_type===5" id="rowGet" @click="clickType5(item, scope.row)">{{ item.operate_name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template> -->
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
        <!-- <assignments-create v-if="assignmentVisible" :action_id="action_id" :assignments_list="items" @show="isShow" @refresh="refresh"/> -->
        <method-batch-edit
          v-if="batchVisible"
          :batch-data="batchData"
          :ids="ids"
          :is-all="isAll"
          :object_id="object_id"
          :mtd_id="mtd_id"
          @show="isShow"
          @refresh="refresh"
        />
        <export-data
          v-else
          :export-fields="headers"
          :object_id="object_id"
          :ids="ids"
          :is-all="isAll"
          :text="text"
          :pagination="pagination"
          :page_size="page_size"
          @show="isShow"
        />
      </el-dialog>
      <el-dialog v-if="dialogSearch" :visible.sync="dialogSearch" title="查询" :close-on-click-modal="false">
        <set-query :object_id="object_id" :page_id="page_id" @show="isQueryShow" @getQueryData="getQueryData" />
      </el-dialog>
      <el-dialog v-if="dialogMtd" :visible.sync="dialogMtd" :title="mtdTitle" :close-on-click-modal="false" width="85%" append-to-body>
        <iframe :src="mtd_get_url" width="100%" height="500px" frameborder="0" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import path from 'path'
// const proj_code = ''
// const object_code = ''
// const page_code = ''
const Base64 = require('js-base64').Base64

export default {
  name: 'PageData',
  components: {
  },
  props: {
    object_code: {
      type: String,
      default: null
    },
    page_code: {
      type: String,
      default: null
    },
    proj_code: {
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
    },
    pnt_clsname: {
      type: String,
      default: null
    },
    filters: {
      type: Array,
      default: () => { return [] }
    }
  },
  filters: {
    formatterFun: function(value, values, labels) {
      // if (!value) return value
      let result = value
      const isArray = Array.isArray(value)
      if (value) {
        if (isArray) {
          result = []
          value.forEach(element => {
            const index = values.indexOf(element)
            if (index !== -1) {
              result.push(labels[index])
            }
          })
          result = result.join(',')
        } else {
          const index = values.indexOf(value)
          if (index !== -1) {
            result = labels[index]
          }
        }
      }
      return result
    }
  },
  data() {
    return {
      items: [],
      headers: [],
      loading: false,
      showColumn: false,
      object_id: null,
      page_id: null,
      mtd_id: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      // filters: [],
      create_headers: [],
      update_headers: [],
      delete_headers: [],
      headers_all: [],
      cls_name: null,
      currentPage: 1,
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
      can_view: false,
      design_form: null,
      edit_data: {},
      currentName: null,
      delete_applycondition: '',
      batchVisible: false,
      batchData: [],
      single_methods: [],
      other_methods: [],
      methodsItems: [],
      newSingleMethods: [],
      newOtherMethods: [],
      selectionData: [],
      isMultiple: false,
      append_javascript: '',
      can_apply_condition: true,
      repo_id: null,
      class_id: null,
      can_export: false,
      exportFilters: {},
      is_view: false,
      uselist: false,
      dialogSearch: false,
      mtdFilters: [],
      cellBtn: [],
      convert: true,
      design_select: {},
      // proj_code: proj_code,
      // object_code: object_code,
      // page_code: page_code,
      ids: [],
      isAll: false,
      // pntfk: null,
      // pntid: null,
      // pnt_clsname: null,
      enable_record: false,
      params: {},
      dialogMtd: false,
      mtdTitle: '',
      mtd_get_url: null,
      fileAction: null
    }
  },
  computed: {
    allBtns() {
      const { items, cellBtn, newSingleMethods, delete_applycondition } = this
      items.forEach(row => {
        this.$set(row, 'buttons', [...cellBtn, ...newSingleMethods])
        row.buttons.forEach((i, index) => {
          if (i.isMtd && eval(i.apply_condition) === false) {
            this.$set(i, 'disabled', true)
          } else {
            this.$set(i, 'disabled', false)
          }
        })
        row.buttons = row.buttons.filter(i => {
          return !i.disabled
        })
        if (delete_applycondition && !eval(delete_applycondition)) {
          row.buttons = row.buttons.filter(i => {
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
    }
  },
  created() {
    this.get_page_params()
    // this.get_proj_code()
    // this.get_object_code()
    // this.get_page_code()
    // this.get_filters()
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },
  mounted() {
    const _that = this
    window.addEventListener('message', function(e){
      if(e.data.msg === 'closeDialog'){
        _that.closeDialog()
      }
    }, false)
  },
  destroyed() {
    window.removeEventListener('message', this.closeDialog, false)
  },
  methods: {
    closeDialog() {
      this.dialogMtd = false
    },
    fnCall(fun, row) {
      this[fun](row)
    },
    mtdCall(fun, item, row) {
      this[fun](item, row)
    },
    // get_object_code() {
    //   if ('object_code' in this.$route.query) {
    //     this.object_code = this.$route.query.object_code
    //     return this.object_code
    //   }
    // },
    // get_proj_code() {
    //   if ('proj_code' in this.$route.query) {
    //     this.proj_code = this.$route.query.proj_code
    //   }
    // },
    // get_page_code() {
    //   if ('page_code' in this.$route.query) {
    //     this.page_code = this.$route.query.page_code
    //     return this.page_code
    //   }
    // },
    // get_filters() {
    //   if ('filters' in this.$route.query) {
    //     this.filters = this.$route.query.filters
    //     return this.filters
    //   } else {
    //     return null
    //   }
    // },
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
      this.$Apis.object.get_design_select_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    get_object_info() {
      this.$Apis.object.object_info(this.proj_code, this.object_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          // this.is_view = response.payload.is_view
          this.object_id = response.payload.object_id
          this.design_form = response.payload.design_form
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.repo_id = response.payload.repo_id
          this.class_id = response.payload.class_id
          this.enable_record = response.payload.enable_record
          this.get_all_headers()
          if (!this.page_code) {
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
            this.get_method()
            this.fetchData()
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
      this.$Apis.object.page_info_by_code(this.proj_code, this.object_code, this.page_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.page_id = response.payload.page_id
          this.can_create = response.payload.can_create
          this.can_view = response.payload.can_view
          this.can_update = response.payload.can_update
          this.can_delete = response.payload.can_delete
          this.can_export = response.payload.can_export
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
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
          this.get_method()
          this.fetchData()
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
        }
      })
    },
    fetchData() {
      this.loading = true
      // this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
      // this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
      // this.pnt_clsname = this.$route.query.pnt_clsname ? this.$route.query.pnt_clsname : null
      this.$Apis.object.get_headers(this.object_id, false, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
    operateData() {
      this.loading = true
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    create() {
      this.$router.push({ name: 'data_create', query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid }})
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
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
    // redirect_object(row, next_page, object_filter) {
    //   this.filters = []
    //   this.uselist = false
    //   this.headers_all.forEach(element => {
    //     element['value'] = row[element['prop']]
    //     if (element['prop'] === object_filter) {
    //       this.uselist = element['uselist']
    //     }
    //     if (element['is_primary']) {
    //       if (element['value']) {
    //         this.filters.push(element['prop'] + '=="' + element['value'] + '"')
    //       }
    //     }
    //   })
    //   this.set_session()
    //   const filters = JSON.stringify(this.filters)
    //   const redirect = { path: '/page/object', query: { proj_code: this.proj_code, page_code: next_page, filters: filters, object_filter: object_filter, prev_page: this.page_code, uselist: this.uselist }}
    //   this.$router.push(redirect)
    // },
    remove(row) {
      let ids = []
      // this.delete_headers = JSON.parse(JSON.stringify(this.headers))
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
        // var can_delete = true
        // if (this.delete_applycondition) {
        //   if (!eval(this.delete_applycondition)) {
        //     can_delete = false
        //   }
        // }
        // if (!can_delete) {
        //   this.$alert('不满足删除适用条件', '提示', {
        //     confirmButtonText: '确定'
        //   })
        //   return false
        // }
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
    },
    goBack() {
      this.$router.go(-1)
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
    },
    resolvePath(uri) {
      if (!uri) {
        uri = ''
      }
      if (this.$Utils.validate.isExternal(uri)) {
        return uri
      }
      return path.resolve(uri)
    },
    clickType1(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      const classColumn = {}
      let ids = null
      this.headers_all.forEach(element => {
        if (item.edit_prop.includes(element.prop)) {
          classColumn[element['prop']] = item.editval
        }
      })
      if (this.isAll) {
        ids = {}
      } else {
        ids = this.ids.join(',')
      }
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          // 修改批量设置的值
          this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
          this.refresh()
        }).catch(() => {})
      } else {
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.mtd_id)
        this.refresh()
      }
    },
    clickType2(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      this.mtd_id = item.mtd_id
      this.batchData = JSON.parse(JSON.stringify(this.headers_all))
      this.batchData.forEach(element => {
        if (item.view_prop.includes(element.prop)) {
          element['isview'] = true
        }
        if (item.edit_prop.includes(element.prop)) {
          element['isedit'] = true
        }
      })
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.dialogVisible = !this.dialogVisible
          this.batchVisible = true
          this.dialogTitle = '批量修改'
        }).catch(() => {})
      } else {
        this.dialogVisible = !this.dialogVisible
        this.batchVisible = true
        this.dialogTitle = '批量修改'
      }
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
      this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }

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
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
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
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
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
        this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&param=' + Base64.encode(JSON.stringify(this.params))
        } else {
          newUrl = url + '?param=' + Base64.encode(JSON.stringify(this.params))
        }
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else if (item.uriopentype === '1') {
            this.$Utils.util.routerGo(newUrl)
          } else {
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    clickType6(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      let ids = []
      this.selectionData.forEach((item, index) => {
        this.headers_all.some(element => {
          element['value'] = item[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
      })
      ids = ids.join(',')
      this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
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
        this.set_session()
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
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
    clickType7(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const ids = []
        this.selectionData.forEach((item, index) => {
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                ids.push(element['value'])
                return true
              }
            }
          })
        })
        this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&param=' + Base64.encode(JSON.stringify(this.params))
        } else {
          newUrl = url + '?param=' + Base64.encode(JSON.stringify(this.params))
        }
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else if (item.uriopentype === '1') {
            this.$Utils.util.routerGo(newUrl)
          } else {
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
      } else {
        this.set_session()
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    clickType8(item) {
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
      this.params = { r_objectid: this.object_id, r_pntfk: this.pntfk, r_pntid: this.pntid, r_pnt_clsname: this.pnt_clsname }
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
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

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&' + _result.join('&')
        } else {
          newUrl = url + '?' + _result.join('&')
        }
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
            this.$Utils.request({
              url: url,
              method: 'post',
              data: this.params
            }).then((response) => {
              this.$alert(response.payload, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.refresh()
                }
              })
            })
          } else if(item.uriopentype === '1') {
            window.open(newUrl, '_blank')
          } else if (item.uriopentype === '2') {
            this.$Utils.util.routerGo(newUrl)
          } else {
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          this.$Utils.request({
            url: url,
            method: 'post',
            data: this.params
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.refresh()
              }
            })
          })
        } else if(item.uriopentype === '1') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '2') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    clickType9(item) {
      this.fileAction = item
      this.$refs.fileUpload.$children[0].$refs.input.click()
    },
    add_script(code) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = code
      document.head.appendChild(script)
    },
    export_data() {
      this.dialogVisible = !this.dialogVisible
      this.batchVisible = false
      this.dialogTitle = '数据导出'
    },
    query() {
      this.dialogSearch = !this.dialogSearch
    },
    isQueryShow() {
      this.dialogSearch = !this.dialogSearch
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
          this.isQueryShow()
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    changeUpload(file, fileList) {
      const isXls = file.raw.type === 'application/vnd.ms-excel'
      const isXlsx = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const uri = this.fileAction.uri || '/rpcgateway/LegoObjectService/import_excel'

      if (!isXls && !isXlsx) {
        this.$alert('请上传.xls，.xlsx，.csv格式的文件', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return false
          }
        })
      } else {
        const form = new FormData()
        form.append('content', file.raw)
        form.append('object_id', this.fileAction.object_id)
        form.append('mtd_id', this.fileAction.mtd_id)
        form.append('filename', file.name)
        form.append('start_rows_input', this.fileAction.start_rows_input || 1)
        form.append('cols_name_input', this.fileAction.cols_name_input || '')
        this.$Utils.request({
          url: uri,
          method: 'post',
          data: form
        }).then((response) => {
          this.$alert(response.payload, '提示', {
            confirmButtonText: '确定'
          })
          this.refresh()
        })
      }
      fileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
  .title-nav {
    display: flex;
    margin-top: -20px;
    margin-bottom: 30px;
    color: #666666;
    border-bottom: 1px solid #eee;
    align-items: center;
    .title {
      position: relative;
      display: inline-block;
      padding: 18px 10px;
      color: #666666;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #ff333b;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
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
  .col-operate {
    display: flex;
    flex-wrap: wrap;
    .col-operate-btn {
      display: block;
      margin: 2px 4px;
      color: #909399;
      background: #f4f4f5;
      border-color: #d3d4d6;
    }
  }
  .app-container .action-btn .operate-btn {
    padding: 0;
    span {
      display: block;
      padding: 8px 22px;
    }
  }
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
