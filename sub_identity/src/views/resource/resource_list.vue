<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_resource@identity.resource']" class="btn create-btn" @click="create">
        新建
      </div>
      <template v-show="cur==0">
        <div v-if="removePermission" class="btn create-btn delete" @click="resource_deletes">
          删除所选
        </div>
      </template>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
        <div class="show-by">
          <span :class="{active:cur==0}" class="list" @click="cur=0" />
          <span :class="{active:cur==1}" class="tree" @click="cur=1" />
        </div>
      </div>
    </div>
    <div v-if="cur==0" class="show-list">
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
          prop="res_code"
          label="资源代码"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="text"
          label="资源显示文本"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="namespace"
          label="资源命名空间"
          width="220"
          show-overflow-tooltip
        />
        <!-- <el-table-column
          prop="ref_id"
          label="对应对象ID"
          width="180"
          show-overflow-tooltip/> -->
        <el-table-column
          prop="parent_text"
          width="180"
          label="父资源"
        />
        <el-table-column
          prop="level"
          label="级别"
        />
        <!-- <el-table-column
        prop="props"
        label="资源属性"
        show-overflow-tooltip/> -->
        <el-table-column
          v-if="showColumn"
          fixed="right"
          align="right"
          width="100"
        >
          <template slot-scope="scope">
            <i v-if="updatePermission" class="el-icon-edit" @click="resource_update(scope.row.res_id)" />
            <i class="el-icon-view" @click="resource_info(scope.row.namespace, scope.row.text)" />
            <i v-if="removePermission" class="el-icon-delete" @click="resource_delete(scope.row.res_id)" />
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
    <resource-tree
      v-if="cur==1"
      :update-permission="updatePermission"
      :remove-permission="removePermission"
      @resource_update="resource_update($event)"
      @resource_delete="resource_delete($event)"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <resource-create v-if="dialogShow" :get_parent_namespace="parent_namespace" :is-disabled="true" :show-type="cur" @show="isShow" @refresh="refresh" />
      <resource-update v-else :resource="resource" :show-type="cur" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import resourceCreate from './components/resourceCreate'
import resourceUpdate from './components/resourceUpdate'
import resourceTree from './resource_tree'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
const EventBus = Vue.$Utils.EventBus
export default {
  filters: {
  },
  components: {
    CommonTitle,
    resourceCreate,
    resourceUpdate,
    resourceTree
  },
  data() {
    return {
      items: [{
        res_code: '',
        text: '',
        ref_id: '',
        level: '',
        props: '',
        parent_text: '',
        namespace: ''
      }],
      allItems: [],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      resource: {},
      cur: 0,
      tree_items: [],
      parent_namespace: null,
      showColumn: false,
      showPage: false,
      res_ids: [],
      treeItems: [],
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
    this.get_page_params()
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_resource@identity.resource'])
    this.removePermission = checkPermission(['ns://remove_resource@identity.resource'])
  },
  methods: {
    checkPermission,
    get_parent_namespace() {
      if ('namespace' in this.$route.query) {
        var parent_namespace = this.$route.query.namespace
        return parent_namespace
      } else {
        return null
      }
    },
    get_page_params() {
      if (sessionStorage.getItem(this.$route.name)) {
        const pageParams = JSON.parse(sessionStorage.getItem(this.$route.name))
        if (this.$route.path === pageParams.path) {
          this.text = pageParams.text
          this.pagination.page = pageParams.page_index
          this.page_size = pageParams.page_size
        }
      }
    },
    fetchData() {
      this.loading = true
      var parent_namespace = this.get_parent_namespace()
      this.$Apis.resource.resource_list(parent_namespace, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    handleSelectionChange(val) {
      this.res_ids = []
      val.forEach(element => {
        this.res_ids.push(element.res_id)
      })
    },
    operateData() {
      this.loading = true
      var parent_namespace = this.get_parent_namespace()
      this.$Apis.resource.resource_list(parent_namespace, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    resource_update(res_id) {
      // this.$router.push({ name: 'resource_update', query: { res_id: res_id }})
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '更新资源'
      this.dialogShow = false
      this.$Apis.resource.resource_info(res_id).then(response => {
        this.resource = response.payload
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    resource_info(namespace, text) {
      this.set_session()
      this.$router.push({ name: 'resource_info', query: { namespace: namespace, name: text }})
    },
    resource_delete(res_id) {
      this.$confirm('是否删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.resource_remove(res_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            if (this.cur === 0) {
              this.refresh()
            } else {
              EventBus.$emit('delete-refresh', res_id) // 刷新树形数据
            }
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    },
    resource_deletes() {
      if (JSON.stringify(this.res_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.resource_remove(this.res_ids).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.refresh()
            EventBus.$emit('refreshTree') // 刷新树形数据
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
      this.dialogTitle = '创建资源'
      this.dialogShow = true
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      // this.treeItems = []
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
