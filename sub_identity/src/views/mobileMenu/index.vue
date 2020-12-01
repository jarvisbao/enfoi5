<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" class="btn create-btn" @click="create">
        新建
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="code" label="菜单编码" />
      <el-table-column prop="name" label="菜单名" />
      <el-table-column prop="order" label="菜单顺序" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" class="icon-font" />
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单路由" show-overflow-tooltip />
      <el-table-column align="right">
        <template slot-scope="scope">
          <i id="edit" class="el-icon-edit" @click="edit(scope.row.menu_id)" />
          <i id="view" class="el-icon-view" @click="view(scope.row.code, scope.row.name)" />
          <i id="remove" class="el-icon-delete" @click="remove(scope.row.menu_id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <menu-add-edit :menu-list="items" :menu-info="menuInfo" :menu_id="menu_id" :is-sub="isSub" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import menuAddEdit from './menu_add_edit'

export default {
  components: {
    CommonTitle,
    menuAddEdit
  },
  props: {
    isSub: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      items: [],
      page_size: 10,
      pagination: {
        page: 1,
        total: 10
      },
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      menuInfo: {},
      menu_id: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      const code = this.isSub ? this.$route.query.code : null
      this.$Apis.mobileMenu.menu_list(code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload
          this.loading = false
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
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '新建菜单'
      this.menu_id = null
    },
    edit(menu_id) {
      this.$Apis.mobileMenu.menu_view(menu_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.menuInfo = response.payload
          this.menu_id = menu_id
          this.dialogVisible = !this.dialogVisible
          this.dialogTitle = '编辑菜单'
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    view(code, name) {
      this.$router.push({ name: 'mobile_submenu_list', query: { code: code, name: name }})
    },
    remove(menu_id) {
      this.$confirm('是否删除所选?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.mobileMenu.menu_delete(menu_id).then(response => {
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
    isShow() {
      this.dialogVisible = false
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-font {
  font-family: "iconfont";
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>