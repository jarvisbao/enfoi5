<template>
  <div>
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_property@lego.repository.class.property']" class="btn create-btn" @click="create">
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
        prop="prop_name"
        label="属性名"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="prop_decorator"
        label="属性装饰器"
        width="180"
      />
      <el-table-column
        prop="prop_code"
        label="属性的代码"
        width="260"
      />
      <el-table-column
        prop="prop_comment"
        label="属性描述"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="80"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="property_update(repo_name, class_name, scope.row.prop_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="property_delete(repo_name, class_name, scope.row.prop_name)" />
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
      <property-create v-if="dialogShow" :repo_name="repo_name" :class_name="class_name" @show="isShow" @refresh="refresh" />
      <property-update v-else :property="property" :old_prop_name="old_prop_name" :value="value" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import propertyCreate from './propertyCreate'
import propertyUpdate from './propertyUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    propertyCreate,
    propertyUpdate
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
      old_prop_name: null,
      property: {},
      value: '',
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
    this.updatePermission = checkPermission(['ns://update_property@lego.repository.class.property'])
    this.removePermission = checkPermission(['ns://remove_property@lego.repository.class.property'])
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
      this.$Apis.class.property_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
      const repo_name = this.get_repo_name()
      const class_name = this.get_class_name()
      this.loading = true
      this.$Apis.class.property_list(repo_name, class_name, this.text, this.pagination.page, this.page_size, true).then(response => {
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
    property_update(repo_name, class_name, prop_name) {
      this.$Apis.class.property_info(repo_name, class_name, prop_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.property = response.payload
          this.old_prop_name = this.property.prop_name
          this.property.repo_name = this.repo_name
          this.property.class_name = this.class_name
          this.value = this.property.prop_code
          this.dialogVisible = !this.dialogVisible
          this.dialogTitle = '修改对象类属性'
          this.dialogShow = false
        }
      })
    },
    property_delete(repo_name, class_name, prop_name) {
      this.$confirm('是否删除该对象类属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.class.property_delete(repo_name, class_name, prop_name).then(response => {
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
      this.dialogTitle = '新建对象类属性'
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
<style lang="scss">
.validate-tips {
  position: absolute;
  left: 0;
  top: 100%;
  line-height: 1;
  padding-top: 4px;
  color: #f56c6c;
  font-size: 12px;
}
</style>

