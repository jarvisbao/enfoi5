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
        <!-- 导出 -->
        <export-data
          v-show="can_export"
          :items="items"
          :export-fields="headers"
          :object_id="object_id"
          :ids="ids"
          :is-all="isAll"
          :text="text"
          :pagination="pagination"
          :page_size="page_size"
        />
        <!-- 其他操作 -->
        <top-other-methods
          :object_id="object_id"
          :page_id="page_id"
          :ids="ids"
          :is-all="isAll"
          :new-other-methods="newOtherMethods"
          :selection-data="selectionData"
          :headers_all="headers_all"
          :set_session="set_session"
          :add_script="add_script"
          @showMtdEdit="showMtdEdit"
          @openDialog="openDialog"
          @refresh="refresh"
        />
        <div class="right-btn" style="display: flex; justify-content: flex-end;">
          <!-- 查询 -->
          <set-query ref="setQuery" :object_id="object_id" :page_id="page_id" @getQueryData="getQueryData" />
          <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
        </div>
      </div>
      <table-list
        :loading="loading"
        :is-multiple="isMultiple"
        :can_export="can_export"
        :show-column="showColumn"
        :headers="headers"
        :headers_all="headers_all"
        :items="items"
        :design_select="design_select"
        :object_id="object_id"
        :page_id="page_id"
        :enable_record="enable_record"
        :is-outer-obj="false"
        :set_session="set_session"
        :add_script="add_script"
        @openDialog="openDialog"
        @checkDate="checkDate"
        @refresh="refresh"
        @showMtdEdit="showMtdEdit"
      />
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
          :batch-data="batchData"
          :ids="ids"
          :is-all="isAll"
          :object_id="object_id"
          :mtd_id="mtd_id"
          :page_id="page_id"
          :reload-uri="reloadUri"
          @show="isShow"
          @refresh="refresh"
        />
      </el-dialog>
      <el-dialog v-if="dialogMtd" :visible.sync="dialogMtd" :title="mtdTitle" :close-on-click-modal="false" width="85%" append-to-body>
        <iframe :src="mtd_get_url" width="100%" height="500px" frameborder="0" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import path from 'path'
const Base64 = require('js-base64').Base64
import commonFun from './mixin/commonFun'

export default {
  name: 'PageData',
  components: {
  },
  mixins: [commonFun],
  props: {
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: undefined
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
  data() {
    return {
      items: [],
      headers: [],
      loading: false,
      showColumn: false,
      // object_id: null,
      // page_id: null,
      mtd_id: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      pageFilters: this.filters,
      // create_headers: [],
      // update_headers: [],
      // delete_headers: [],
      headers_all: [],
      // cls_name: null,
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
      is_view: false,
      uselist: false,
      cellBtn: [],
      convert: true,
      design_select: {},
      ids: [],
      isAll: false,
      // pntfk: null,
      // pntid: null,
      // pnt_clsname: null,
      enable_record: false,
      dialogMtd: false,
      mtdTitle: '',
      mtd_get_url: null,
      fileAction: null,
      reloadUri: null
    }
  },
  created() {
    this.get_page_params()
    // this.get_object_id()
    // this.get_page_id()
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
    get_design_select() {
      this.$Apis.object.get_design_select(this.object_id, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.design_select = response.payload
        }
      })
    },
    get_object_info() {
      this.$Apis.object.object_info_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          // this.is_view = response.payload.is_view
          this.design_form = response.payload.design_form
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.repo_id = response.payload.repo_id
          this.class_id = response.payload.class_id
          this.enable_record = response.payload.enable_record
          this.get_all_headers()
          if (!this.page_id) {
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
      this.$Apis.object.page_info(this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
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
          this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.pageFilters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
    operateData() {
      this.loading = true
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.pageFilters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
    create() {
      this.$router.push({ name: 'data_create', query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid, page_id: this.page_id }})
    },
    
    refresh(val) {
      this.pageFilters = val
      this.fetchData()
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
          this.$refs.setQuery.handleReset()
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
