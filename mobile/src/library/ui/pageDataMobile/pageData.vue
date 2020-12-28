<template>
  <div>
    <!-- 顶部导航栏 -->
    <page-nav-bar :title="title" :is-back="isBack" />
    <van-sticky v-if="(can_create && !is_view) || can_export || newOtherMethods.length > 0" :offset-top="46" :z-index="98">
      <div v-show="showTopBtn" class="check-show" @click="handleShowTopBtn">
        点击展开顶部按钮
        <van-icon name="arrow-down" />
      </div>
      <div v-if="!showTopBtn" class="btn-list top-btn-list">
        <div v-show="can_create&&!is_view" id="create" @click="create">
          <i class="el-icon-circle-plus-outline" style="color: #2a89ea" />新建
        </div>
        <!-- <div v-show="can_export" :disabled="items.length===0" @click="export_data">
          <i class="el-icon-download" style="color: #02a447" />
          导出
        </div> -->
        <!-- 其他操作 -->
        <top-other-methods
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
    </van-sticky>
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
      :is-outer-obj="false"
      :add_script="add_script"
      @openDialog="openDialog"
      @checkDate="checkDate"
      @refresh="refresh"
      @showMtdEdit="showMtdEdit"
      @resetItems="resetItems"
    />
    <van-popup v-model="dialogVisible" :overlay="false" position="right" :style="{ height: '100%', width: '100%' }">
      <method-batch-edit
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
    <van-popup v-model="dialogMtd" :overlay="false" closeable position="right" :style="{ height: '100%', width: '100%' }">
      <iframe :src="mtd_get_url" width="100%" height="100%" frameborder="0" style="margin-top: 38px;" />
    </van-popup>
    <overlay-loading :show="showOverlay" :text="loadingText" />
  </div>
</template>
<script>
const Base64 = require('js-base64').Base64
import commonFun from './mixin/commonFun'

export default {
  name: 'PageData',
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
    },
    isBack: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: [],
      headers: [],
      loading: true,
      mtd_id: null,
      dialogVisible: false,
      // update_headers: [],
      headers_all: [],
      text: null,
      pagination: {
        total: 10,
        page: 1,
        pages: 1
      },
      page_size: 10,
      can_create: false,
      can_update: false,
      can_delete: false,
      can_view: false,
      design_form: null,
      // edit_data: {},
      // currentName: null,
      delete_applycondition: '',
      batchData: [],
      single_methods: [],
      other_methods: [],
      methodsItems: [],
      newSingleMethods: [],
      newOtherMethods: [],
      selectionData: [],
      // isMultiple: false,
      // append_javascript: '',
      // can_apply_condition: true,
      repo_id: null,
      class_id: null,
      can_export: false,
      exportFilters: {},
      is_view: false,
      // uselist: false,
      // dialogSearch: false,
      // mtdFilters: [],
      cellBtn: [],
      convert: true,
      design_select: {},
      ids: [],
      isAll: false,
      enable_record: false,
      // params: {},
      // refreshing: false,
      // finished: false,
      // topRight: false,
      showTopBtn: false,
      dialogMtd: false,
      mtd_get_url: null,
      showOverlay: false,
      loadingText: null,
      // showAllBtn: false,
      // cellAllBtns: [],
      // dialogCell: false,
      // cellItem: {},
      pageFilters: this.filters
      // cellIndex: 0
    }
  },
  computed: {
    title() {
      return this.name ? this.name : ''
    }
  },
  watch: {
    filters: {
      handler(val) {
        this.pageFilters = val
      }
    }
  },
  created() {
    this.get_object_info()
    if (this.convert) {
      this.get_design_select()
    }
  },

  methods: {
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
          this.$dialog.alert({
            message: response.message
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
      // this.loading = true
      if (this.$refs.tableList) {
        this.$refs.tableList.loading = true
      }
      this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, this.pageFilters, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
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
      // this.pntfk = this.$route.query.pntfk ? this.$route.query.pntfk : null
      // this.pntid = this.$route.query.pntid ? this.$route.query.pntid : null
      // this.pnt_clsname = this.$route.query.pnt_clsname ? this.$route.query.pnt_clsname : null
      this.$Apis.object.get_headers(this.object_id, false, this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.getData()
        } else {
          this.$dialog.alert({
            message: response.message
          })
        }
      })
    },

    operateData() {
      // setTimeout(() => {
      //   if (this.refreshing) {
      //     this.items = []
      //     this.pagination.page = 1
      //     this.refreshing = false
      //   }
      //   this.getData()
      // }, 1000)
      this.items = []
      this.pagination.page = 1
    },
    create() {
      this.$router.push({ name: 'data_create', query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid, page_id: this.page_id }})
    },
    refresh(val) {
      this.pageFilters = val
      if (this.$refs.tableList) {
        this.$refs.tableList.refreshing = true
        this.$refs.tableList.loading = true
        this.$refs.tableList.operateData()
      }
      this.selectionData = []
    }
  }
}
</script>
<style lang="scss" scoped>
  .check-show {
    padding: 5px 0;
    text-align: center;
    font-size: 12px;
    color: #969696;
    // background: #fff;
    background: linear-gradient(#efefef, rgba(255,255,255,.8));
  }
  .btn-list {
    display: -webkit-box;
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
    // .button {
    //   padding: 6px 12px;
    //   color: #409EFF;
    //   background: #ecf5ff;
    //   border: 1px solid #b3d8ff;
    //   border-radius: 4px;
    //   & + .button {
    //     margin-left: 12px;
    //   }
    // }
    &.top-btn-list {
      div {
        padding: 10px 10px;
        text-align: center;
        white-space: nowrap;
      }
      i {
        display: block;
        height: 25px;
        margin-bottom: 3px;
        font-size: 22px;
      }
    }
  }
</style>
