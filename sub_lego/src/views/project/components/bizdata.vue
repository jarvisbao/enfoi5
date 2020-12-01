<template>
  <div class="bizdata">
    <div v-show="headers.length > 0" class="action-btn">
      <div v-show="!is_view" id="create" class="btn create-btn" @click="create">
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
        v-if="!item.is_object"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          <!-- <i v-if="checkPermission(['ns://update_bizdata@lego.project.bizclass.bizdata'])" class="el-icon-edit" @click="update(scope.row)"/>
          <i v-if="checkPermission(['ns://remove_bizdata@lego.project.bizclass.bizdata'])" class="el-icon-delete" @click="remove(scope.row)"/> -->
          <i class="el-icon-edit" @click="update(scope.row)" />
          <i class="el-icon-delete" @click="remove(scope.row)" />
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
      <bizdata-create v-if="dialogShow" :headers="create_headers" :proj_code="proj_code" :biz_code="biz_code" :repo_id="repo_id" :class_id="class_id" @show="isShow" @refresh="refresh" />
      <bizdata-update v-else :headers="update_headers" :proj_code="proj_code" :biz_code="biz_code" :repo_id="repo_id" :class_id="class_id" :filters="filters" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import bizdataCreate from './bizdataCreate'
import bizdataUpdate from './bizdataUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    bizdataCreate,
    bizdataUpdate
  },
  data() {
    return {
      items: [],
      headers: [],
      loading: false,
      showColumn: false,
      proj_code: null,
      biz_code: null,
      repo_id: null,
      class_id: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      filters: [],
      create_headers: [],
      update_headers: [],
      delete_headers: [],
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
      is_view: false
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
    this.fetchData()
  },
  methods: {
    checkPermission,
    get_proj_code() {
      if ('proj_code' in this.$route.query) {
        this.proj_code = this.$route.query.proj_code
        return this.proj_code
      } else {
        return false
      }
    },
    get_biz_code() {
      if ('biz_code' in this.$route.query) {
        this.biz_code = this.$route.query.biz_code
        return this.biz_code
      } else {
        return false
      }
    },
    fetchData() {
      const biz_code = this.get_biz_code()
      const proj_code = this.get_proj_code()
      this.loading = true
      this.$Apis.bizdata.bizdata_get_headers(proj_code, biz_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.$Apis.bizdata.bizdata_list(proj_code, biz_code, this.text, this.pagination.page, this.page_size, true, true).then(response => {
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
          this.$Apis.bizclass.find_bizclass_by_code(proj_code, biz_code).then(response => {
            this.repo_id = response.payload.repo_id
            this.class_id = response.payload.legoclass_id
            this.is_view = response.payload.is_view
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
      this.$Apis.bizdata.bizdata_list(this.proj_code, this.biz_code, this.text, this.pagination.page, this.page_size, true, true).then(response => {
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
      const create_headers_all = JSON.parse(JSON.stringify(this.headers))
      this.create_headers = []
      create_headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.create_headers.push(element)
        }
      })
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '新建数据'
    },
    update(row) {
      const update_headers_all = JSON.parse(JSON.stringify(this.headers))
      this.filters = []
      this.update_headers = []
      update_headers_all.forEach(element => {
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
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '修改数据'
      this.dialogShow = false
    },
    remove(row) {
      this.filters = []
      this.delete_headers = JSON.parse(JSON.stringify(this.headers))
      this.delete_headers.forEach(element => {
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
        this.$Apis.bizdata.bizdata_delete(this.proj_code, this.biz_code, this.filters).then(response => {
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
.bizdata /deep/ .scrollbar-container {
  display: flex;
  max-height: 400px;
}
</style>
