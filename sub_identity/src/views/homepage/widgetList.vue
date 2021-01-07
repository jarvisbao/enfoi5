<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_wdget@identity.wdget']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="remove(wdgt_ids)">
        删除所选
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
        :selectable="checkSelectable"
        type="selection"
        width="55"
      />
      <el-table-column
        prop="wdgt_title"
        label="标题"
        width="220"
      />
      <el-table-column
        prop="wdgt_type"
        label="类型"
        width="220"
      />
      <el-table-column
        prop="content_url"
        label="数据来源URL"
      />
      <el-table-column
        v-if="showColumn"
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="update(scope.row.wdgt_id)" />
          <template v-if="scope.row.wdgt_type !=='0' && scope.row.wdgt_type !=='1'">
            <i v-if="removePermission" class="el-icon-delete" @click="remove(scope.row.wdgt_id)" />
          </template>
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
import CommonTitle from '@/components/CommonTitle'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    CommonTitle
  },
  mixins: [paginationHandler],
  data() {
    return {
      loading: false,
      items: [],
      text: '',
      page_size: 10,
      pagination: {
        total: 10,
        page: 1
      },
      layout: 'sizes, prev, pager, next',
      wdgt_ids: [],
      updatePermission: false,
      removePermission: false,
      showPage: false,
      showColumn: false
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_wdget@identity.wdget'])
    this.removePermission = checkPermission(['ns://remove_wdget@identity.wdget'])
  },
  methods: {
    checkPermission,
    fetchData() {
      this.loading = true
      this.$Apis.widget.widget_list(this.text, true, this.pagination.page, this.page_size).then(response => {
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
      this.$Apis.widget.widget_list(this.text, true, this.pagination.page, this.page_size).then(response => {
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
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
        }
      })
    },
    schfilter() {
      this.pagination.pag = 1
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
    handleSelectionChange(val) {
      this.wdgt_ids = []
      val.forEach(element => {
        this.wdgt_ids.push(element.wdgt_id)
      })
    },
    checkSelectable(row, index) {
      if (row.wdgt_type === '0' || row.wdgt_type === '1') {
        return false
      } else {
        return true
      }
    },
    create() {
      this.$router.push({ name: 'widget_create' })
    },
    update(wdgt_id) {
      this.$router.push({ name: 'widget_edit', query: { wdgt_id: wdgt_id }})
    },
    remove(wdgt_id) {
      let tips = '是否删除该组件?'
      if (Array.isArray(wdgt_id)) {
        if (JSON.stringify(wdgt_id) === '[]') {
          this.$alert('请选择要删除的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否删除所选组件?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.widget.widget_remove(wdgt_id).then(response => {
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
    }
  }
}
</script>

