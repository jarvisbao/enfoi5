<template>
  <div>
    <el-table
      v-loading="loading"
      :data="vlans"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="vlan_name"
        label="vlan名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="switch_count"
        label="switch数量"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span @click="vlan_info(scope.row)" style="color: #409eff; cursor: pointer">{{ scope.row.switch_count }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage"
      :page-size="pagination.page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <vlan-switches :vlan="vlan" />
    </el-dialog>
  </div>
</template>

<script>
// import { instance as Vue } from '@/life-cycle'
// const checkPermission = Vue.$Utils.checkPermission
import vlanSwitches from './vlanSwitches'
export default {
  components: {
    vlanSwitches
  },
  data() {
    return {
      pagination: {
        page_index: 1,
        page_size: 10
      },
      page: true,
      vlans: [],
      showPage: false,
      loading: false,
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      vlan: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$Apis.sysControl.vlans(this.page, this.pagination.page_index, this.pagination.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.vlans = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page_index = val
      this.fetchData()
    },
    vlan_info(row) {
      this.vlan = row
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = row.vlan_name
    }
  }
}
</script>

<style scoped>

</style>
