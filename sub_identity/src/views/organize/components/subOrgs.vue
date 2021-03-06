<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_organize@identity.orgs']" class="btn create-btn" @click="create">
        新建
      </div>
      <template v-show="cur==0">
        <div v-if="removePermission" class="btn create-btn delete" @click="organize_delete(org_codes)">
          注销所选
        </div>
        <div v-if="removePermission" class="btn create-btn delete" @click="active_organize(org_codes)">
          激活所选
        </div>
      </template>
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
        prop="org_code"
        label="组织机构代码"
        width="180"
      />
      <el-table-column
        prop="name"
        label="机构名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="pinyin_code"
        label="组织机构拼音缩写"
        width="180"
      />
      <el-table-column
        prop="parent_name"
        label="父机构"
        show-overflow-tooltip
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="organize_update(scope.row.org_code)" />
          <i v-if="scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="organize_info(scope.row.org_code, scope.row.name)" />
          <i v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="organize_delete(scope.row.org_code)" />
          <span v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_organize(scope.row.org_code)">激活</span>
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
      <organize-create v-if="dialogShow" :get_parent="parent" :is-disabled="false" :tree_items="tree_items" @show="isShow" @refresh="refresh" />
      <organize-update v-else :organize="organize" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import organizeCreate from './organizeCreate'
import organizeUpdate from './organizeUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import pageParams from '@/mixin/pageParams'
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    organizeCreate,
    organizeUpdate
  },
  mixins: [paginationHandler, pageParams],
  data() {
    return {
      items: [{
        org_code: '',
        name: '',
        pinyin_code: '',
        parent_id: '',
        props: '',
        parent_name: ''
      }],
      organize: {},
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      recursive: null,
      loading: false,
      dialogVisible: false,
      dialogShow: false,
      dialogTitle: null,
      tree_items: null,
      parent: null,
      showPage: false,
      org_codes: [],
      updatePermission: false,
      removePermission: false,
      status: 'all'
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_organize@identity.orgs'])
    this.removePermission = checkPermission(['ns://remove_organize@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_parent_code() {
      if ('org_code' in this.$route.query) {
        // this.parent_id = this.$route.query.org_id
        this.parent_id = this.$route.query.org_code
        return this.parent_id
      } else {
        return null
      }
    },
    get_name() {
      if ('name' in this.$route.query) {
        this.parent = this.$route.query.name
        return this.parent
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var parent_code = this.get_parent_code()
      this.$Apis.organize.organize_list(parent_code, this.recursive, this.text, true, this.pagination.page, this.page_size, true, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
        }
      })
      this.get_name()
    },
    operateData() {
      this.loading = true
      var parent_code = this.get_parent_code()
      this.$Apis.organize.organize_list(parent_code, this.recursive, this.text, true, this.pagination.page, this.page_size, true, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
        }
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    handleSelectionChange(val) {
      this.org_codes = []
      val.forEach(element => {
        this.org_codes.push(element.org_code)
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
    organize_delete(org_code) {
      let tips = '是否删除该机构?'
      if (Array.isArray(org_code)) {
        if (JSON.stringify(org_code) === '[]') {
          this.$alert('请选择要注销的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否注销所选机构?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.organize.organize_remove_v2(org_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.fetchData()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '新建机构'
    },
    organize_update(org_code) {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.dialogTitle = '更新机构'
      this.$Apis.organize.organize_info(org_code).then(response => {
        this.organize = response.payload
      })
    },
    organize_info(org_code, name) {
      this.set_session()
      this.$router.push({ name: 'organize_info', query: { org_code: org_code, name: name }})
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    active_organize(org_code) {
      let tips = '是否激活该机构?'
      if (Array.isArray(org_code)) {
        if (JSON.stringify(org_code) === '[]') {
          this.$alert('请选择要激活的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否激活所选机构?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.organize.active_organize(org_code).then(response => {
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
  }
}
</script>
<style lang="scss">
</style>
