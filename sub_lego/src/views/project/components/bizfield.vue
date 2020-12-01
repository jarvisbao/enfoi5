<template>
  <div class="bizfield-container">
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_bizfield@lego.project.'+proj_code+'.bizclass']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="bizfield_deletes">
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
        type="selection"
        width="55"
      />
      <el-table-column
        prop="field_name"
        label="字段显示名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="field_code"
        label="字段代码"
        show-overflow-tooltip
      />
      <el-table-column
        prop="field_format"
        label="字段取值格式"
        show-overflow-tooltip
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="can_query"
        label="是否参与查询"
      />
      <el-table-column
        :formatter="bool_to_str"
        prop="field_is_object"
        label="是否为关联对象"
      />
      <!--      <el-table-column-->
      <!--        prop="object_name"-->
      <!--        label="关联界面"-->
      <!--        show-overflow-tooltip-->
      <!--      />-->
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="130"
      >
        <template slot-scope="scope">
          <i v-if="updatePermission" class="el-icon-edit" @click="bizfield_update(scope.row.field_id, scope.row.object_name)" />
          <i v-if="removePermission" class="el-icon-delete" @click="bizfield_delete(scope.row.field_id)" />
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
      <bizfield-create v-if="dialogShow" :proj_code="proj_code" :biz_code="biz_code" :options="options" @show="isShow" @refresh="refresh" />
      <bizfield-update v-else :bizfield="bizfield" :proj_code="proj_code" :options="options" :object_name="object_name" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import bizfieldCreate from './bizfieldCreate'
import bizfieldUpdate from './bizfieldUpdate'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
export default {
  components: {
    bizfieldCreate,
    bizfieldUpdate
  },
  data() {
    return {
      items: [],
      text: null,
      loading: false,
      showColumn: false,
      showPage: false,
      pagination: {
        total: 10,
        page: 1
      },
      bizfield_format: [],
      options: [],
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      proj_code: null,
      biz_code: null,
      bizfield: {},
      field_ids: [],
      updatePermission: false,
      removePermission: false,
      object_name: null
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
    this.updatePermission = checkPermission(['ns://update_bizfield@lego.project.' + this.proj_code + '.bizclass'])
    this.removePermission = checkPermission(['ns://remove_bizfield@lego.project.' + this.proj_code + '.bizclass'])
  },
  methods: {
    checkPermission,
    get_biz_code() {
      if ('biz_code' in this.$route.query) {
        this.biz_code = this.$route.query.biz_code
        return this.biz_code
      } else {
        return null
      }
    },
    get_proj_code() {
      if ('proj_code' in this.$route.query) {
        this.proj_code = this.$route.query.proj_code
        return this.proj_code
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      const proj_code = this.get_proj_code()
      const biz_code = this.get_biz_code()
      this.$Apis.bizclass.bizfield_list(proj_code, biz_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    operateData() {
      this.loading = true
      const proj_code = this.get_proj_code()
      const biz_code = this.get_biz_code()
      this.$Apis.bizclass.bizfield_list(proj_code, biz_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showColumn = true
            this.showPage = true
          } else {
            this.showColumn = false
            this.showPage = false
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
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    handleSelectionChange(val) {
      this.field_ids = []
      val.forEach(element => {
        this.field_ids.push(element.field_id)
      })
    },
    bool_to_str(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    create() {
      this.getOptions(this.proj_code, this.biz_code).then(() => {
        this.$nextTick(() => {
          this.dialogVisible = !this.dialogVisible
          this.dialogShow = true
          this.dialogTitle = '新建业务类字段'
        })
      })
    },
    bizfield_update(field_id, object_name) {
      this.getOptions(this.proj_code, this.biz_code).then(() => {
        this.object_name = object_name
        this.$Apis.bizclass.bizfield_info(field_id, this.proj_code).then(response => {
          this.bizfield = response.payload
          this.dialogVisible = !this.dialogVisible
          this.dialogShow = false
          this.dialogTitle = '更新业务类字段'
        })
      })
    },
    bizfield_delete(field_id) {
      this.$confirm('是否删除该字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.bizclass.bizfield_delete(field_id, this.proj_code).then(response => {
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
    bizfield_deletes() {
      if (JSON.stringify(this.field_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.bizclass.bizfield_delete(this.field_ids, this.proj_code).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            if (this.items.length === 1 && this.pagination.page > 1) {
              this.pagination.page -= 1
            }
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
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    getOptions(proj_code, biz_code) {
      return this.$Apis.bizclass.biz_field_format(proj_code, biz_code).then(response => {
        this.options = response.payload
      })
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
