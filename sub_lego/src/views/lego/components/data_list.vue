<template>
  <div class="datalist">
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
          <!-- <i v-if="checkPermission(['ns://update_data@lego.repository.class.data'])" class="el-icon-edit" @click="update(scope.row)"/>
          <i v-if="checkPermission(['ns://remove_data@lego.repository.class.data'])" class="el-icon-delete" @click="remove(scope.row)"/> -->
          <i v-show="!is_view" class="el-icon-edit" @click="update(scope.row)" />
          <i v-show="!is_view" class="el-icon-delete" @click="remove(scope.row)" />
          <!--<span v-show="!is_view" class="assignments-btn" @click="assignment_create(scope.row)">授权</span>-->
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
      <data-create v-if="dialogShow" :headers="create_headers" :repo_name="repo_name" :class_name="class_name" @show="isShow" @refresh="refresh" />
      <data-update v-else :headers="update_headers" :repo_name="repo_name" :class_name="class_name" :filters="filters" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import DataCreate from './DataCreate'
import DataUpdate from './DataUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    DataCreate,
    DataUpdate
  },
  props: {
    is_view: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      headers: [],
      loading: false,
      class_id: null,
      repo_name: null,
      id: null,
      class_name: null,
      dialogVisible: false,
      showColumn: false,
      filters: [],
      create_headers: [],
      update_headers: [],
      delete_headers: [],
      currentPage: 1,
      pageSize: 10,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false
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
    // get_class_id() {
    //   if ('class_id' in this.$route.query) {
    //     this.class_id = this.$route.query.class_id
    //     return this.class_id
    //   } else {
    //     return null
    //   }
    // },
    get_repo_name() {
      if ('repo_name' in this.$route.query) {
        this.repo_name = this.$route.query.repo_name
        return this.repo_name
      } else {
        return null
      }
    },
    get_class_name() {
      if ('name' in this.$route.query) {
        this.class_name = this.$route.query.name
        return this.class_name
      } else if ('view_name' in this.$route.query) {
        this.class_name = this.$route.query.view_name
        return this.class_name
      } else {
        return null
      }
    },
    fetchData() {
      // this.get_class_id()
      this.get_repo_name()
      this.get_class_name()
      // this.get_is_view()
      this.loading = true
      this.$Apis.data.get_headers(this.repo_name, this.class_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.headers = response.payload
          this.$Apis.data.data_list(this.repo_name, this.class_name, this.text, this.pagination.page, this.page_size, true, true).then(response => {
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
            // this.loading = false
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
      this.$Apis.data.data_list(this.repo_name, this.class_name, this.text, this.pagination.page, this.page_size, true, true).then(response => {
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
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
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
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '新建数据'
      this.dialogShow = true
      this.assignmentVisible = false
      this.create_headers = JSON.parse(JSON.stringify(this.headers))
    },
    update(row) {
      this.filters = []
      this.update_headers = JSON.parse(JSON.stringify(this.headers))
      this.update_headers.forEach(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            this.filters.push(this.class_name + '.' + element['prop'] + '=="' + element['value'] + '"')
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
            this.filters.push(this.class_name + '.' + element['prop'] + '=="' + element['value'] + '"')
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
        if (this.filters.length === 0) {
          this.$alert('该业务类下字段没有设置主键，不允许删除', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        this.$Apis.data.delete_data({ 'repo_name': this.repo_name, 'cls_name': this.class_name, 'filters': this.filters }).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh([])
            }
          })
          // this.refresh([])
          this.loading = false
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.datalist /deep/ .scrollbar-container {
  display: flex;
  max-height: 400px;
}
</style>

