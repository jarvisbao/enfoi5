<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <template>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="items"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="sys_key"
          label="键"
        />
        <el-table-column
          prop="sys_value"
          label="值"
        />
        <el-table-column
          prop="summary"
          label="说明"
        />
        <el-table-column
          align="right"
        >
          <template slot-scope="scope">
            <i v-if="updatePermission" class="el-icon-edit" @click="param_update(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :v-if="showPage"
        :page-size="page_size"
        :layout="layout"
        :total="pagination.total"
        :current-page="pagination.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <param-update @show="isShow" @refresh="refresh" :param="param" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import ParamUpdate from './ParamUpdate'

export default {
  filters: {
  },
  components: {
    CommonTitle,
    ParamUpdate
  },
  data() {
    return {
      items: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      showPage: false,
      updatePermission: false,
      param: {}
    }
  },
  watch: {
  },
  created() {
    this.updatePermission = checkPermission(['ns://update_param@identity.sysparam'])
    this.fetchData()
  },
  methods: {
    checkPermission,
    fetchData() {
      this.loading = true
      this.$Apis.sysControl.SysParams(this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.pagination = response.payload.pagination
          this.items = response.payload.items
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
    operateData() {
      this.loading = true
      this.$Apis.sysControl.SysParams(this.text, true, this.pagination.page, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.pagination = response.payload.pagination
          this.items = response.payload.items
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
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    param_update(param) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '更新参数'
      this.param = param
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
