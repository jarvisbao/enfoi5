<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_attribute@identity.attribute']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="attributes_deletes">
        删除所选
      </div>
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
        prop="attr_name"
        label="属性名称"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="attr_label"
        label="属性显示名称"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="attr_type"
        label="属性类型"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="is_children"
        label="是否为子资源的属性"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="is_self"
        label="是否本级资源的属性"
        width="200"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="props"
        label="属性的保留字段"
        show-overflow-tooltip/> -->
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="attributes_update(scope.row.attr_id)" />
          <i v-if="removePermission" class="el-icon-delete" @click="attributes_delete(scope.row.attr_id)" />
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
      <attributes-create v-if="dialogShow" :namespace="namespace" @show="isShow" @refresh="refresh" />
      <attributes-update v-else :attributes="attributes" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import attributesCreate from './attributesCreate'
import attributesUpdate from './attributesUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  filters: {
  },
  components: {
    attributesCreate,
    attributesUpdate
  },
  data() {
    return {
      items: [{
        attr_name: '',
        attr_label: '',
        attr_type: '',
        is_children: false,
        is_self: false,
        props: ''
      }],
      multipleSelection: [],
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      namespace: null,
      dialogVisible: false,
      dialogTitle: null,
      dialogShow: false,
      attributes: {},
      showPage: false,
      attr_ids: [],
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
    this.updatePermission = checkPermission(['ns://update_attribute@identity.attribute'])
    this.removePermission = checkPermission(['ns://remove_attribute@identity.attribute'])
  },
  methods: {
    checkPermission,
    get_res_namespace() {
      if ('namespace' in this.$route.query) {
        this.namespace = this.$route.query.namespace
        return this.namespace
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var text = this.text
      var namespace = this.get_res_namespace()
      this.$Apis.resource.attributes_list(namespace, text, true, this.pagination.page, this.page_size).then(response => {
        this.items = response.payload.items
        this.pagination = response.payload.pagination
        this.loading = false
        if (this.pagination.total > 0) {
          this.showPage = true
        } else {
          this.showPage = false
        }
      })
    },
    handleSelectionChange(val) {
      this.attr_ids = []
      val.forEach(element => {
        this.attr_ids.push(element.attr_id)
      })
    },
    attributes_update(attr_id) {
      // this.$router.push({ name: 'attributes_update', query: { attr_id: attr_id }})
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.dialogTitle = '更新属性'
      this.$Apis.resource.attributes_info(attr_id).then(response => {
        this.attributes = response.payload
      })
    },
    attributes_delete(attr_id) {
      this.$confirm('是否删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.attributes_remove(attr_id).then(response => {
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
    attributes_deletes() {
      if (JSON.stringify(this.attr_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.resource.attributes_remove(this.attr_ids).then(response => {
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
    operateData() {
      var namespace = this.get_res_namespace()
      this.loading = true
      this.$Apis.resource.attributes_list(namespace, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    bool_to_str(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '添加属性'
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
<style lang="scss" scoped>
</style>
