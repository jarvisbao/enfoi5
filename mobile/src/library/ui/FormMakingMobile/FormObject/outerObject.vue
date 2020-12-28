<template>
  <div class="outer-object">
    <!-- <template v-if="!pntid">
      <van-field
        :id="id"
        :ref="widget.model"
        :name="widget.model"
        disabled
      />
    </template>
    <van-field
      v-else
      :id="id"
      :ref="widget.model"
      :name="widget.model"
      readonly
    >
    </van-field> -->
    <div v-if="!pntid" style="margin: 20px">
      新建数据时不支持外链子对象
    </div>
    <div v-if="pntid" class="obj-data">
      <div class="methods-btn">
        <div v-if="can_create && !disabled" @click="create">
          <i class="el-icon-circle-plus-outline" style="color: #2a89ea" />
          新建
        </div>
        <div @click="refresh">
          <i class="el-icon-download" style="color: #02a447" />
          刷新
        </div>
        <!-- 其他操作 -->
        <top-other-methods
          ref="otherMtd"
          :object_id="object_id"
          :page_id="page_id"
          :ids="ids"
          :is-all="isAll"
          :new-other-methods="newOtherMethods"
          :selection-data="selectionData"
          :headers_all="headers_all"
          :add_script="add_script"
          @showMtdEdit="showMtdEdit"
          @openDialog="openDialog"
          @refresh="refresh"
        />
      </div>
      <div class="list-box">
        <!-- 数据列表 -->
        <table-list
          ref="tableList"
          :headers="headers"
          :headers_all="headers_all"
          :items="items"
          :design_select="design_select"
          :object_id="object_id"
          :page_id="page_id"
          :enable_record="enable_record"
          :is-outer-obj="true"
          :mul-btn="mulBtn"
          :add_script="add_script"
          @openDialog="openDialog"
          @checkDate="checkDate"
          @refresh="refresh"
          @showMtdEdit="showMtdEdit"
          @resetItems="resetItems"
          @update="update"
        />
      </div>
    </div>
    <div v-show="pntid" style="height: 50px;">
      <div class="check-all-box">
        <div v-if="mulBtn" :class="{'check-all': isCheckAll}" class="check-btn" @click="selectAll" />
        <div :class="{'after': newOtherMethods.length > 0 && otherMtdBtn}" class="right-btn">
          <div class="box">
            <van-button v-if="can_create && !disabled" type="info" size="small" round @click="create">新建</van-button>
            <van-button type="primary" size="small" round @click="refresh">刷新</van-button>
            <!-- 其他操作 -->
            <top-other-methods
              v-if="otherMtdBtn"
              :object_id="object_id"
              :page_id="page_id"
              :ids="ids"
              :is-all="isAll"
              :new-other-methods="newOtherMethods"
              :selection-data="selectionData"
              :headers_all="headers_all"
              :add_script="add_script"
              @showMtdEdit="showMtdEdit"
              @openDialog="openDialog"
              @refresh="refresh"
            />
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="dialogVisible" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <method-batch-edit
        v-if="batchVisible"
        :batch-data="batchData"
        :ids="ids"
        :is-all="isAll"
        :object_id="object_id"
        :mtd_id="mtd_id"
        :page_id="page_id"
        @show="isShow"
        @refresh="refresh"
      />
    </van-popup>
    <van-popup v-model="dialogCreate" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <template v-if="showForm">
        <object-create
          v-if="isCreate"
          :object_id="object_id"
          :pntfk="pntfk"
          :pntid="pntid"
          :page_id="page_id"
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
          @show="isCreateShow"
          @refresh="refresh"
        />
      </template>
    </van-popup>
    <van-popup v-model="dialogMtd" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="dialogMtd = false"
      />
      <iframe :src="mtd_get_url" width="100%" height="500px" frameborder="0" />
    </van-popup>
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
const Base64 = require('js-base64').Base64
import commonFun from '@/library/ui/pageDataMobile/mixin/commonFun'

export default {
  components: {
    objectCreate: () => import('./objCreate'),
    objectUpdate: () => import('./objUpdate')
  },
  mixins: [commonFun],
  props: ['value', 'models', 'remote', 'blanks', 'disabled', 'widget', 'helpers', 'designFields', 'formValue', 'id'],
  data() {
    return {
      // loading: true,
      // finished: false,
      items: [],
      headers: [],
      headers_all: [],
      // update_headers: [],
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
      filters: [],
      convert: true,
      design_select: {},
      methodsItems: [],
      single_methods: [],
      other_methods: [],
      newOtherMethods: [],
      newSingleMethods: [],
      is_view: false,
      can_create: false,
      can_view: false,
      can_update: false,
      can_delete: false,
      design_form: null,
      cellBtn: [],
      delete_applycondition: '',
      // isMultiple: false,
      dialogVisible: false,
      dialogTitle: '',
      batchVisible: false,
      batchData: [],
      isAll: false,
      ids: [],
      // mtdFilters: [],
      enable_record: false,
      dialogCreate: false,
      objTitle: '',
      isCreate: false,
      mtd_id: null,
      objid: null,
      isEdit: false,
      // params: {},
      dialogMtd: false,
      mtdTitle: '',
      mtd_get_url: null,
      showForm: false,
      showTopBtn: false,
      showOverlay: false,
      loadingText: null,
      isCheckAll: false,
      // showAllBtn: false,
      // cellAllBtns: [],
      dialogCell: false,
      cellItem: {},
      isOuterObj: true,
      mulBtn: false,
      offsetTop: 0,
      otherMtdBtn: false
    }
  },
  watch: {
    dialogCreate(val) {
      if (!val) {
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
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
    this.offsetTop = this.$refs.otherMtd.$el.getBoundingClientRect().top
  },
  methods: {
    handleScroll() {
      if (this.newOtherMethods.length > 0) {
        const scorllTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scorllTop > this.offsetTop) {
          this.otherMtdBtn = true
        } else {
          this.otherMtdBtn = false
        }
      }
    },
    selectAll() {
      if (this.selectionData.length === this.items.length) {
        this.$refs.tableList.cancelSelectAll()
        this.isCheckAll = false
      } else {
        this.$refs.tableList.selectAll()
        this.isCheckAll = true
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
          this.$dialog.alert({
            message: response.message
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
          this.$dialog.alert({
            message: response.message
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
    getData() {
      if (this.$refs.tableList) {
        this.$refs.tableList.loading = true
      }
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          if (response.payload.items.length === 0 && this.$refs.tableList) {
            this.$refs.tableList.finished = true
          }
          this.items = [...this.items, ...response.payload.items]
          this.pagination = response.payload.pagination
          if (this.pagination.page === this.pagination.pages && this.$refs.tableList) {
            this.$refs.tableList.finished = true
          } else {
            this.pagination.page += 1
          }
        } else {
          if (this.$refs.tableList) {
            this.$refs.tableList.finished = true
          }
          this.$dialog.alert({
            message: response.message
          })
        }
        if (this.$refs.tableList) {
          this.$refs.tableList.loading = false
        }
      })
    },
    fetchData() {
      if (this.pntid) {
        this.$Apis.object.get_headers_by_code(this.proj_code, this.object_code, this.page_code, false).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.headers = response.payload
            this.getData()
          }
        })
      }
    },
    operateData() {
      this.items = []
      this.pagination.page = 1
    },
    create() {
      this.dialogCreate = !this.dialogCreate
      this.isCreate = true
      this.objTitle = '新建'
    },
    isCreateShow() {
      this.dialogCreate = !this.dialogCreate
    },
    refresh() {
      if (this.$refs.tableList) {
        this.$refs.tableList.finished = false
        this.$refs.tableList.loading = true
      }
      this.items = []
      this.pagination.page = 1
      this.fetchData()
      this.selectionData = []
    },
    update(args) {
      this.objid = args.objid
      this.mtd_id = args.mtd_id
      this.dialogCreate = !this.dialogCreate
      this.isCreate = false
      this.objTitle = args.objTitle
      this.isEdit = args.isEdit
      this.reloadUri = args.reloadUri
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
  & ::v-deep .el-form-item {
    margin-bottom: 22px;
  }
  .action-btn {
    .el-button.is-plain:hover,
    .el-button.is-plain:focus {
      border-color: #409eff;
      color: #fff;
    }
  }
  & ::v-deep .el-table thead tr th {
    background: #f5f7fa;
    color: #909399;
  }
}
</style>
