<template>
  <div>
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_organize@identity.orgs']" class="btn create-btn" @click="create">
        新建
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
      <el-table-column label="机构代码" prop="org_code" />
      <el-table-column label="机构名称" prop="org_name" />
      <el-table-column label="成员别名" prop="title" />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <i v-if="removePermission" class="el-icon-delete" @click="remove(scope.row.org_code)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage"
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <my-orgs-add :openid="openid" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import myOrgsAdd from './myOrgsAdd'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import paginationHandler from '@/mixin/paginationHandler'

export default {
  components: {
    myOrgsAdd
  },
  mixins: [paginationHandler],
  data() {
    return {
      items: [{
        org_code: null,
        org_name: null,
        title: null
      }],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      loading: false,
      dialogVisible: false,
      dialogTitle: null,
      openid: null,
      showPage: false,
      myorgsList: [],
      removePermission: false
    }
  },
  created() {
    this.fetchData()
    this.removePermission = checkPermission(['ns://remove_org_member@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_openid() {
      if ('openid' in this.$route.query) {
        this.openid = this.$route.query.openid
        var openid = this.$route.query.openid
        return openid
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      var openid = this.get_openid()
      this.$Apis.user.user_myorgs(openid, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    operateData() {
      var openid = this.get_openid()
      this.loading = true
      this.$Apis.user.user_myorgs(openid, this.text, true, this.pagination.page, this.page_size).then(response => {
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
    handleSelectionChange() {

    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加机构'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.fetchData()
    },
    remove(org_code) {
      this.$confirm('是否删除该机构下的用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.organize.organize_members_remove(org_code, [this.openid]).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.fetchData()
          } else {
            alert(response.message)
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
