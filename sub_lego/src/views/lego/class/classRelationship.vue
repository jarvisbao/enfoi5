<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_relationship@lego.repository.class.relationship']" class="btn create-btn" @click="create">
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
        prop="name"
        label="关系名"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="argument"
        label="被映射的类"
        width="180"
      />
      <el-table-column
        prop="props"
        label="关系的属性"
        width="220"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.props }}
        </template>
      </el-table-column>
      <el-table-column
        :formatter="bool_to_str"
        prop="multiple"
        label="是否为一对多"
        width="180"
      />
      <el-table-column
        prop="comment"
        label="关系描述"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="80"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="relationship_update(repo_name, class_name, scope.row.name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="relationship_delete(repo_name, class_name, scope.row.name)" />
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
      <relationship-create v-if="dialogShow" :class_name="class_name" :repo_name="repo_name" :is_view="is_view" @show="isShow" @refresh="refresh" />
      <relationship-update v-else :relationship="relationship" :class_name="class_name" :repo_name="repo_name" :old_name="old_name" :is_view="is_view" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import relationshipCreate from './relationshipCreate'
import relationshipUpdate from './relationshipUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    relationshipCreate,
    relationshipUpdate
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
      repo_name: null,
      class_name: null,
      old_name: null,
      relationship: {},
      options: [],
      updatePermission: false,
      removePermission: false
    }
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
    this.updatePermission = checkPermission(['ns://update_relationship@lego.repository.class.relationship'])
    this.removePermission = checkPermission(['ns://remove_relationship@lego.repository.class.relationship'])
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
      const repo_name = this.get_repo_name()
      const class_name = this.get_class_name()
      this.loading = true
      this.$Apis.class.relationship_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
      // class_list(repo_id).then(response => {
      //   this.options = response.payload.items
      // })
    },
    bool_to_str(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    operateData() {
      const repo_name = this.get_repo_name()
      const class_name = this.get_class_name()
      this.loading = true
      this.$Apis.class.relationship_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
    relationship_update(repo_name, class_name, name) {
      this.$Apis.class.relationship_info(repo_name, class_name, name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.relationship = response.payload
          this.old_name = this.relationship.name
          this.dialogVisible = !this.dialogVisible
          this.dialogTitle = '修改关系'
          this.dialogShow = false
        }
      })
    },
    relationship_delete(repo_name, class_name, name) {
      this.$confirm('是否删除该关系?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.class.relationship_delete(repo_name, class_name, name).then(response => {
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
      this.dialogTitle = '新建关系'
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
