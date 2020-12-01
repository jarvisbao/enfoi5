<template>
  <div>
    <div class="action-btn">
      <div id="create" class="btn create-btn" @click="create">
        新建
      </div>
      <div class="btn create-btn delete" @click="RemovePositions">
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
        prop="role_name"
        label="部门职位名称"
      />
      <el-table-column
        prop="role_code"
        label="部门职位编码"
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i class="el-icon-view" @click="position_info(scope.row.role_code, scope.row.role_name)" />
          <i class="el-icon-delete" @click="RemovePosition(scope.row.role_code)" />
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
      <org-position-add @show="isShow" @refresh="refresh"></org-position-add>
    </el-dialog>
  </div>
</template>

<script>
import orgPositionAdd from './orgPositionAdd'

export default {
  name: 'OrgPositions',
  components: {
    orgPositionAdd
  },
  data() {
    return {
      items: [{
        role_code: null,
        role_name: null
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      role_codes: [],
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      showPage: false,
      // removePermission: false,
      org_code: null
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
    this.org_code = this.$route.query.org_code
    this.fetchData()
    // this.removePermission = checkPermission(['ns://remove_org_role@identity.orgs'])
  },
  methods: {
    handleSelectionChange(val) {
      this.role_codes = []
      val.forEach(element => {
        this.role_codes.push(element.role_code)
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    },
    fetchData() {
      this.loading = true
      this.$Apis.organize.OrgPositions(this.org_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    RemovePosition(role_code) {
      this.$confirm('是否删除该组织机构职位?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.role_codes = [role_code]
        this.$Apis.organize.RemovePosition(this.role_codes).then(response => {
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
    RemovePositions() {
      if (JSON.stringify(this.role_codes) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选组织机构职位?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.organize.RemovePosition(this.role_codes).then(response => {
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '新建组织机构职位'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    position_info(position_code, name) {
      this.set_session()
      this.$router.push({ name: 'position_members', query: { name: name, position_code: position_code }})
    },
  }
}
</script>

<style scoped>

</style>
