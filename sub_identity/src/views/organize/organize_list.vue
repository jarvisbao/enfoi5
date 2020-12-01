<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn">
      <div id="create" v-permission="['ns://create_organize@identity.orgs']" class="btn create-btn" @click="create">
        新建
      </div>
      <template v-show="cur==0">
        <div v-if="removePermission" class="btn create-btn delete" @click="organize_deletes">
          注销所选
        </div>
        <div v-if="removePermission" class="btn create-btn delete" @click="active_organizes">
          激活所选
        </div>
      </template>
      <el-dropdown v-role-permission="['superadmin']">
        <div class="btn">
          同步至<i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><span @click="syncDept('lark')">飞书</span></el-dropdown-item>
          <el-dropdown-item><span @click="syncDept('dingtalk')">钉钉</span></el-dropdown-item>
          <el-dropdown-item><span @click="syncDept('wechat')">企业微信</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
          prop="org_code"
          label="组织机构代码"
          width="180"
        />
        <el-table-column
          prop="name"
          label="机构名称"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="pinyin_code"
          label="组织机构拼音缩写"
          width="180"
        />
        <el-table-column
          prop="parent_name"
          label="父机构"
          show-overflow-tooltip
        />
        <el-table-column
          prop="children_count"
          label="子机构数量"
        />
        <!-- <el-table-column
          prop="props"
          label="组织机构属性"
          show-overflow-tooltip/> -->
        <el-table-column
          align="right"
        >
          <template slot-scope="scope">
            <i v-if="updatePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="organize_update(scope.row.org_code)" />
            <i v-if="scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="organize_info(scope.row.org_code, scope.row.name)" />
            <i v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="organize_delete(scope.row.org_code)" />
            <span v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_organize(scope.row.org_code)">激活</span>
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
    <organize-tree
      v-if="cur==1"
      :text="text"
      :update-permission="updatePermission"
      :remove-permission="removePermission"
      @organize_update="organize_update($event)"
      @organize_delete="organize_delete($event)"
      @active_organize="active_organize($event)"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <organize-create v-if="dialogShow" :get_parent="parent" :is-disabled="true" :tree_items="tree_items" :show-type="cur" @show="isShow" @refresh="refresh" />
      <organize-update v-else :organize="organize" :show-type="cur" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import organizeCreate from './components/organizeCreate'
import organizeUpdate from './components/organizeUpdate'
import organizeTree from './components/organizeTree'
import { instance as Vue } from '@/life-cycle'
import {mapGetters} from "vuex";
const checkPermission = Vue.$Utils.checkPermission
export default {
  filters: {},
  components: {
    CommonTitle,
    organizeCreate,
    organizeUpdate,
    organizeTree
  },
  data() {
    return {
      items: [
        {
          org_code: '',
          name: '',
          pinyin_code: '',
          parent_id: '',
          props: '',
          parent_name: ''
        }
      ],
      multipleSelection: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogShow: false,
      organize: {},
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      recursive: null,
      cur: 0,
      allItems: [],
      tree_items: [],
      parent: null,
      showPage: false,
      org_codes: [],
      updatePermission: false,
      removePermission: false,
      status: 'all'
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
    this.updatePermission = checkPermission(['ns://update_organize@identity.orgs'])
    this.removePermission = checkPermission(['ns://remove_organize@identity.orgs'])
  },
  methods: {
    checkPermission,
    get_parent_code() {
      if ('parent_code' in this.$route.query) {
        this.parent_code = this.$route.query.parent_code
        return this.parent_code
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
      var parent_code = this.get_parent_code()
      this.$Apis.organize.organize_list(parent_code, this.recursive, this.text, true, this.pagination.page, this.page_size, true, this.status).then(response => {
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
    handleSelectionChange(val) {
      this.org_codes = []
      val.forEach(element => {
        this.org_codes.push(element.org_code)
      })
    },
    operateData() {
      this.loading = true
      var parent_code = this.get_parent_code()
      this.$Apis.organize.organize_list(parent_code, this.recursive, this.text, true, this.pagination.page, this.page_size, true, this.status).then(response => {
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = true
      this.dialogTitle = '新建机构'
    },
    organize_update(org_code) {
      this.dialogVisible = !this.dialogVisible
      this.dialogShow = false
      this.dialogTitle = '更新机构'
      this.$Apis.organize.organize_info(org_code).then(response => {
        this.organize = response.payload
      })
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    organize_info(org_code, name) {
      this.set_session()
      this.$router.push({ name: 'organize_info', query: { org_code: org_code, name: name }})
    },
    organize_delete(org_code) {
      this.$confirm('是否注销该机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.organize.organize_remove_v2(org_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              if (this.cur === 0) {
                this.refresh()
              } else {
                this.$Utils.EventBus.$emit('refreshTree', org_code) // 刷新树形数据
              }
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    active_organize(org_code) {
      this.$confirm('是否激活该机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.organize.active_organize(org_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              if (this.cur === 0) {
                this.refresh()
              } else {
                this.$Utils.EventBus.$emit('refreshTree', org_code) // 刷新树形数据
              }
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    organize_deletes() {
      if (JSON.stringify(this.org_codes) === '[]') {
        this.$alert('请选择要注销的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否注销所选机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.organize.organize_remove_v2(this.org_codes).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.refresh()
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    active_organizes() {
      if (JSON.stringify(this.org_codes) === '[]') {
        this.$alert('请选择要激活的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$confirm('是否激活所选机构?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      })
        .then(() => {
          this.$Apis.organize.active_organize(this.org_codes).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.refresh()
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    get_tree_items(items, tree_items) {
      items.forEach((item, index) => {
        if (item['parent_id'] === null) {
          tree_items.push({
            id: item['org_id'],
            label: item['name'],
            children: []
          })
        }
      })
      function get_children(items, tree_items) {
        if (Array.isArray(tree_items)) {
          tree_items.forEach(tree_item => {
            items.forEach((list_item, index) => {
              if (list_item['parent_id'] === tree_item['id']) {
                tree_item['children'].push({
                  id: list_item['org_id'],
                  label: list_item['name'],
                  children: []
                })
              }
            })
            get_children(items, tree_item['children'])
            if (JSON.stringify(tree_item['children']) === '[]') {
              tree_item['children'] = ''
            }
          })
        }
      }
      get_children(items, tree_items)
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      this.tree_items = []
      this.fetchData()
    },
    syncDept(val) {
      this.$Apis.organize.SyncDept(val).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$alert('同步成功', '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
