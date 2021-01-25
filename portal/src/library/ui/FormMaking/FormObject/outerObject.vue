<template>
  <div :class="{'is-disabled': !pntid}" class="outer-object">
    <div class="action-btn">
      <el-button v-if="can_create && !disabled" id="create" type="primary" plain @click="create">
        新建
      </el-button>
      <el-button id="refresh" type="primary" plain @click="refresh">
        刷新
      </el-button>
      <el-button id="open_blank" type="primary" plain @click="openBlank">
        跳取当前页面
      </el-button>
      <top-other-methods
        :is-outer-obj="true"
        :object_id="object_id"
        :page_id="page_id"
        :ids="ids"
        :is-all="isAll"
        :new-other-methods="newOtherMethods"
        :selection-data="selectionData"
        :headers_all="headers_all"
        :set_session="set_session"
        :add_script="add_script"
        class="method-btn"
        @showMtdEdit="showMtdEdit"
        @openDialog="openDialog"
        @refresh="refresh"
        @mtdCreate="mtdCreate"
      />
      <div class="right-btn" style="display: flex; justify-content: flex-end;">
        <!-- 查询 -->
        <set-query ref="setQuery" v-if="widget.options.query" :proj_code="proj_code" :object_code="object_code" :page_code="page_code" :is-bycode="true" @getQueryData="getQueryData" />
        <el-input id="search" v-if="widget.options.search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
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
      :is-outer-obj="true"
      :set_session="set_session"
      :add_script="add_script"
      @openDialog="openDialog"
      @checkDate="checkDate"
      @update="update"
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

    <el-dialog v-if="dialogCreate" :visible.sync="dialogCreate" :title="objTitle" :close-on-click-modal="false" append-to-body>
      <object-create
        v-if="isCreate"
        :object_id="object_id"
        :pntfk="pntfk"
        :pntid="pntid"
        :page_id="page_id"
        :reload-uri="reloadUri"
        @show="isCreateShow"
        @refresh="refresh"
      />
      <object-update
        v-else
        :object_id="object_id"
        :objid="objid"
        :mtd_id="mtd_id"
        :edit="isEdit"
        :page_id="page_id"
        :reload-uri="reloadUri"
        @show="isCreateShow"
        @refresh="refresh"
      />
    </el-dialog>
    <el-dialog v-if="dialogMtd" :visible.sync="dialogMtd" :title="mtdTitle" :close-on-click-modal="false" width="85%" append-to-body>
      <iframe :src="mtd_get_url" width="100%" height="500px" frameborder="0" />
    </el-dialog>
    <el-dialog :visible.sync="dialogMtdCreate" :close-on-click-modal="false" append-to-body title="新建">
      <obj-mtd-create
        :params="mtdParams"
        :pntfk="pntfk"
        :pntid="pntid"
        :page_id="page_id"
        @show="isMtdShow"
        @refresh="refresh"
      />
    </el-dialog>
  </div>
</template>
<script>
import path from 'path'
import objectCreate from './objCreate'
import objectUpdate from './objUpdate'
const Base64 = require('js-base64').Base64
import commonFun from '@/library/ui/pageData/mixin/commonFun'

export default {
  components: {
    objectCreate,
    objectUpdate,
    objMtdCreate: () => import('./objMtdCreate')
  },
  mixins: [commonFun],
  props: ['value', 'models', 'remote', 'blanks', 'disabled', 'widget', 'helpers', 'designFields', 'formValue'],
  data() {
    return {
      loading: false,
      items: [],
      headers: [],
      headers_all: [],
      update_headers: [],
      selectionData: [],
      object_id: null,
      page_id: undefined,
      proj_code: this.widget.options.proj_code,
      object_code: this.widget.options.object_code,
      page_code: this.widget.options.page_code,
      pntfk: this.widget.name_model.format,
      pnt_clsname: this.widget.name_model.cls_name,
      pntid: null,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      showColumn: false,
      filters: [],
      convert: true,
      design_select: {},
      methodsItems: [],
      single_methods: [],
      other_methods: [],
      newOtherMethods: [],
      newSingleMethods: [],
      can_export: false,
      is_view: false,
      can_create: false,
      can_view: false,
      can_update: false,
      can_delete: false,
      design_form: null,
      cellBtn: [],
      delete_applycondition: '',
      isMultiple: false,
      dialogSearch: false,
      dialogVisible: false,
      dialogTitle: '',
      batchVisible: false,
      batchData: [],
      isAll: false,
      ids: [],
      enable_record: false,
      dialogCreate: false,
      objTitle: '',
      isCreate: false,
      mtd_id: null,
      objid: null,
      isEdit: false,
      params: {},
      dialogMtd: false,
      mtdTitle: '',
      mtd_get_url: null,
      fileAction: null,
      reloadUri: null,
      dialogMtdCreate: false,
      mtdParams: null
    }
  },
  created() {
    this.designFields.some(item => {
      if (item.is_primary) {
        const prop = item.prop
        if (prop in this.formValue && !!(this.formValue[prop])) {
          this.pntid = this.formValue[prop]
          return true
        }
      }
    })
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },
  mounted() {
    const _that = this
    window.addEventListener('message', function(e){
      if (e.data.msg === 'closeDialog'){
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

    fetchData() {
      this.loading = true
      this.$Apis.object.get_headers_by_code(this.proj_code, this.object_code, this.page_code, false).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          if (!this.pntid) {
            this.loading = false
            return
          }
          this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
              this.loading = false
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
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
          this.object_id = response.payload.object_id
          this.is_view = response.payload.is_view
          // this.innerObjData = JSON.parse(response.payload.design_form)
          this.delete_applycondition = response.payload.delete_applycondition
          this.single_methods = response.payload.single_methods
          this.other_methods = response.payload.other_methods
          this.enable_record = response.payload.enable_record
          this.get_all_headers()
          if (!this.page_code) {
            this.can_create = response.payload.can_create
            this.can_view = response.payload.can_view
            this.can_update = response.payload.can_update
            this.can_delete = response.payload.can_delete
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
          this.can_create = response.payload.can_create
          this.page_id = response.payload.page_id
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

    create() {
      // this.$router.push({ name: 'data_create', query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid }})
      this.dialogCreate = !this.dialogCreate
      this.isCreate = true
      this.objTitle = '新建'
    },
    isCreateShow() {
      this.dialogCreate = !this.dialogCreate
    },
    operateData() {
      this.loading = true
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    refresh() {
      this.fetchData()
    },
    getQueryData(params) {
      const queryparam = []
      params.forEach(item => {
        queryparam.push(Object.values(item).join(''))
      })
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, false, this.filters, true, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
        this.loading = true
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.loading = false
          this.$refs.setQuery.handleReset()
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    update(args) {
      this.objid = args.objid
      this.mtd_id = args.mtd_id
      this.dialogCreate = !this.dialogCreate
      this.isCreate = false
      this.objTitle = args.objTitle
      this.isEdit = args.isEdit
      this.reloadUri = args.reloadUri
    },
    openBlank() {
      const route = this.$router.resolve({
        name: 'dataByCode',
        query: {
          proj_code: this.proj_code,
          object_code: this.object_code,
          page_code: this.page_code,
          pntfk: this.pntfk,
          pntid: this.pntid,
          pnt_clsname: this.pnt_clsname,
          filters: this.filters,
          name: this.widget.name
        }
      })
      window.open(route.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.outer-object {
  &.is-disabled::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: no-drop;
    background: rgba(255,255,255,.5);
    z-index: 100;
  }
  & ::v-deep.el-form-item {
    margin-bottom: 22px;
  }
  .action-btn {
    .el-button.is-plain:hover,
    .el-button.is-plain:focus {
      border-color: #409eff;
      color: #fff;
    }
  }
  & ::v-deep.el-table thead tr th {
    background: #f5f7fa !important;
    color: #909399;
  }
  .action-btn {
    .method-btn {
      ::v-deep.btn {
        margin-left: 10px;
        margin-right: 0;
        border-radius: 3px;
        line-height: 1;
        font-size: 12px;
        span {
          padding: 9px 15px;
        }
        &:hover, &:focus {
          color: #409EFF;
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
      }
    }
  }
}
</style>
