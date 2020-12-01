<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_column@lego.repository.class.column']" class="btn create-btn" @click="create">
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
        prop="column_name"
        label="栏目名"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="column_type"
        label="栏目的类型名"
        width="180"
      />
      <el-table-column
        prop="column_type_args"
        label="栏目的类型参数"
        width="260"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.column_type_args }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="column_props"
        label="栏目的属性"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.column_props }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="column_comment"
        label="栏目描述"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="80"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="column_update(repo_name, class_name, scope.row.column_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="column_delete(repo_name, class_name, scope.row.column_name)" />
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
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" top="5vh">
      <column-create v-if="dialogShow" :repo_name="repo_name" :class_name="class_name" @show="isShow" @refresh="refresh" />
      <column-update v-else :class-column="classColumn" :old_column_name="old_column_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import columnCreate from './columnCreate'
import columnUpdate from './columnUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    columnCreate,
    columnUpdate
  },
  data() {
    return {
      items: [],
      loading: false,
      showColumn: false,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      class_name: null,
      repo_name: null,
      classColumn: {},
      old_column_name: null,
      updatePermission: false,
      removePermission: false
    }
  },
  // computed: {
  //   getComment() {
  //     return this.items.forEach((item, key) => {
  //       if (!item['column_comment']) {
  //         item['column_comment'] = item['column_props'].comment
  //       }
  //     })
  //   }
  // },
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
    this.updatePermission = checkPermission(['ns://update_column@lego.repository.class.column'])
    this.removePermission = checkPermission(['ns://remove_column@lego.repository.class.column'])
  },
  methods: {
    checkPermission,
    get_class_name() {
      if ('name' in this.$route.query) {
        this.class_name = this.$route.query.name
        return this.class_name
      } else {
        return null
      }
    },
    get_repo_name() {
      if ('repo_name' in this.$route.query) {
        this.repo_name = this.$route.query.repo_name
        return this.repo_name
      } else {
        return null
      }
    },
    fetchData() {
      const class_name = this.get_class_name()
      const repo_name = this.get_repo_name()
      this.loading = true
      this.$Apis.class.column_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
    operateData() {
      const class_name = this.get_class_name()
      const repo_name = this.get_repo_name()
      this.loading = true
      this.$Apis.class.column_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
    column_update(repo_name, class_name, column_name) {
      this.$Apis.class.column_info(repo_name, class_name, column_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.classColumn = response.payload
          this.old_column_name = this.classColumn.column_name
          this.classColumn.repo_name = this.repo_name
          this.classColumn.class_name = this.class_name
          this.dialogVisible = !this.dialogVisible
          this.dialogTitle = '修改对象类栏目'
          this.dialogShow = false
        }
      })
    },
    column_delete(repo_name, class_name, column_name) {
      this.$confirm('是否删除该对象类栏目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.class.column_delete(repo_name, class_name, column_name).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
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
      this.dialogTitle = '新建对象类栏目'
      this.dialogShow = true
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
