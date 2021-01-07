<template>
  <div class="app-container">
    <common-title />
    <div class="action-btn clearfix">
      <div id="create" v-permission="['ns://create_user@identity.users']" class="btn create-btn" @click="create">
        新建
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="user_delete(openids)">
        注销所选
      </div>
      <div v-if="removePermission" class="btn create-btn delete" @click="active_user(openids)">
        激活所选
      </div>
      <el-dropdown v-role-permission="['superadmin']">
        <div class="btn">
          同步至<i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><span @click="SyncUser('lark')">飞书</span></el-dropdown-item>
          <el-dropdown-item><span @click="SyncUser('dingtalk')">钉钉</span></el-dropdown-item>
          <el-dropdown-item><span @click="SyncUser('wechat')">企业微信</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="right-btn">
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
        <div class="show-by">
          <span v-for="(item, index) in tabs" :key="index" :class="[item, {active:cur==index}]" @click="chechTab(index)" />
        </div>
      </div>
    </div>
    <template v-if="cur==0">
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
          width="150"
        />
        <el-table-column
          prop="full_name"
          label="姓名"
          width="150"
        />
        <el-table-column
          :formatter="sex_convert"
          prop="gender"
          label="性别"
          width="120"
        />
        <el-table-column
          prop="birthday"
          label="生日"
        />
        <!-- <el-table-column
        prop="props"
        label="扩展属性"
        show-overflow-tooltip/> -->
        <el-table-column
          align="right"
        >
          <template slot-scope="scope">
            <i v-if="updatePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="user_update(scope.row.openid)" />
            <i v-if="scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="user_info(scope.row.openid, scope.row.full_name)" />
            <i v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="user_delete(scope.row.openid)" />
            <span v-if="removePermission && scope.row._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_user(scope.row.openid)">激活</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :v-if="showPage"
        :page-size="page_size"
        :layout="layout"
        :total="pagination.total"
        :current-page="pagination.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <user-list-card
      ref="userListCard"
      v-if="cur==1"
      :pagination="pagination"
      :page_size="page_size"
      :text="text"
      :update-permission="updatePermission"
      :remove-permission="removePermission"
      :card-refresh="cardRefresh"
      @user_update="user_update"
      @user_delete="user_delete"
      @user_crad_info="user_crad_info"
      @user_card_deletes="get_card_openids"
      @active_user="active_user"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <user-create v-if="dialogCreate" @show="isShow" @refresh="refresh" />
      <user-update v-if="dialogUpdate" :user="user" @show="isShow" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import userUpdate from './components/userUpdate'
import userCreate from './components/userCreate'
import userListCard from './components/userListCard'
import { instance as Vue } from '@/life-cycle'
const checkPermission = Vue.$Utils.checkPermission
import pageParams from '@/mixin/pageParams'
import paginationHandler from '@/mixin/paginationHandler'

export default {
  filters: {
  },
  components: {
    CommonTitle,
    userUpdate,
    userCreate,
    userListCard
  },
  mixins: [paginationHandler, pageParams],
  data() {
    return {
      items: [],
      openids: [],
      loading: false,
      dialogVisible: false,
      dialogCreate: false,
      dialogUpdate: false,
      dialogTitle: '',
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      text: null,
      user: {},
      cur: 0,
      showPage: false,
      tabs: ['table', 'card'],
      updatePermission: false,
      removePermission: false,
      status: 'all',
      cardRefresh: false
    }
  },
  created() {
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_user@identity.users'])
    this.removePermission = checkPermission(['ns://remove_user@identity.users'])
  },
  methods: {
    checkPermission,
    fetchData() {
      this.loading = true
      this.$Apis.user.user_list(this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.pagination = response.payload.pagination
          this.items = response.payload.items
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
    sex_convert: function(row, column, cellValue, index) {
      if (cellValue === 'male') {
        return '男'
      } else if (cellValue === 'female') {
        return '女'
      }
    },
    handleSelectionChange(val) {
      this.openids = []
      val.forEach((val, index) => {
        this.openids.push(val.openid)
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.user.user_list(this.text, true, this.pagination.page, this.page_size, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.pagination = response.payload.pagination
          this.items = response.payload.items
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
          this.set_session()
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
      if (this.cur === 0) {
        this.operateData()
      } else {
        this.$refs.userListCard.search()
      }
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    user_update(openid) {
      this.dialogVisible = !this.dialogVisible
      this.dialogUpdate = true
      this.dialogCreate = false
      this.dialogTitle = '更新用户信息'
      this.$Apis.user.user_info(openid).then(response => {
        this.user = response.payload
      })
    },
    // set_session() {
    //   sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    // },
    user_info(openid, full_name) {
      this.set_session()
      this.$router.push({ name: 'user_info', query: { openid: openid, name: full_name }})
    },
    create() {
      this.dialogVisible = !this.dialogVisible
      this.dialogCreate = true
      this.dialogUpdate = false
      this.dialogTitle = '新建用户'
    },
    user_delete(openid) {
      let tips = '是否注销该用户?'
      if (Array.isArray(openid)) {
        if (JSON.stringify(openid) === '[]') {
          this.$alert('请选择要注销的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否注销所选用户?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.user.user_remove_v2(openid).then(response => {
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
    active_user(openid) {
      let tips = '是否激活该用户?'
      if (Array.isArray(openid)) {
        if (JSON.stringify(openid) === '[]') {
          this.$alert('请选择要激活的条目！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        tips = '是否激活所选用户?'
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        this.$Apis.user.active_user(openid).then(response => {
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
    // user_deletes() {
    //   if (JSON.stringify(this.openids) === '[]') {
    //     this.$alert('请选择要注销的条目！', '提示', {
    //       confirmButtonText: '确定'
    //     })
    //     return false
    //   }
    //   this.$confirm('是否注销所选用户?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     confirmButtonClass: 'confirm-button',
    //     cancelButtonClass: 'cancel-button'
    //   }).then(() => {
    //     this.$Apis.user.user_remove_v2(this.openids).then(response => {
    //       if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
    //         this.refresh()
    //       } else {
    //         this.$alert(response.message, '提示', {
    //           confirmButtonText: '确定'
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //   })
    // },
    // active_users() {
    //   if (JSON.stringify(this.openids) === '[]') {
    //     this.$alert('请选择要激活的条目！', '提示', {
    //       confirmButtonText: '确定'
    //     })
    //     return false
    //   }
    //   this.$confirm('是否激活所选用户?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     confirmButtonClass: 'confirm-button',
    //     cancelButtonClass: 'cancel-button'
    //   }).then(() => {
    //     this.$Apis.user.active_user(this.openids).then(response => {
    //       if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
    //         this.refresh()
    //       } else {
    //         this.$alert(response.message, '提示', {
    //           confirmButtonText: '确定'
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //   })
    // },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    refresh() {
      if (this.cur === 0) {
        this.fetchData()
      } else {
        this.$refs.userListCard.search()
        this.cardRefresh = true
      }
    },
    user_crad_info($event) {
      const openid = $event[0]
      const full_name = $event[1]
      this.set_session()
      this.$router.push({ name: 'user_info', query: { openid: openid, name: full_name }})
    },
    get_card_openids($event) {
      this.openids = $event
    },
    chechTab(index) {
      this.cur = index
      // if (this.cur === 0) {
      //   const rows = []
      //   this.handleCurrentChange(1)
      //   this.openids.forEach(element => {
      //     this.items.forEach(item => {
      //       if (element === item.openid) {
      //         rows.push(item)
      //       }
      //     })
      //   })
      //   setTimeout(() => {
      //     if (rows) {
      //       rows.forEach(row => {
      //         this.$refs.multipleTable.toggleRowSelection(row)
      //       })
      //     } else {
      //       this.$refs.multipleTable.clearSelection()
      //     }
      //   }, 300)
      // }
    },
    SyncUser(val) {
      this.$Apis.user.SyncUser(val, this.openids).then(response => {
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
