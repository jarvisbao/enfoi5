<template>
  <div class="app-container">
    <div class="action-btn">
      <div id="create" class="btn create-btn" @click="create">
        新建
      </div>
      <div class="btn create-btn delete" @click="RemovePositionUsers">
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
        prop="nickname"
        label="昵称"
      />
      <el-table-column
        prop="full_name"
        label="姓名"
      />
      <el-table-column
        :formatter="sex_convert"
        prop="gender"
        label="性别"
      />
      <el-table-column
        prop="birthday"
        label="生日"
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="RemovePositionUser(scope.row.openid)" />
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
      <org-position-members-add :position_code="position_code" :position_name="position_name" @show="isShow" @refresh="refresh"></org-position-members-add>
    </el-dialog>
  </div>
</template>

<script>
import orgPositionMembersAdd from './components/orgPositionMembersAdd'

export default {
  components: {
    orgPositionMembersAdd
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
      user_ids: [],
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      showPage: false,
      // removePermission: false,
      position_code: null,
      position_name: null
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
    this.position_code = this.$route.query.position_code
    this.position_name = this.$route.query.name
    this.fetchData()
    // this.removePermission = checkPermission(['ns://remove_org_role@identity.orgs'])
  },
  methods: {
    handleSelectionChange(val) {
      this.user_ids = []
      val.forEach(element => {
        this.user_ids.push(element.openid)
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
      this.$Apis.organize.PositionUsers(this.position_code, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    RemovePositionUser(openid) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.user_ids = [openid]
        this.$Apis.organize.RemovePositionUser(this.user_ids, this.position_code).then(response => {
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
    RemovePositionUsers() {
      if (JSON.stringify(this.user_ids) === '[]') {
        this.$alert('请选择要删除的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否删除所选?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.organize.RemovePositionUser(this.user_ids, this.position_code).then(response => {
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
      this.dialogTitle = '新建授权'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    sex_convert: function(row, column, cellValue, index) {
      if (cellValue === 'male') {
        return '男'
      } else if (cellValue === 'female') {
        return '女'
      }
    },
  }
}
</script>

<style scoped>

</style>
