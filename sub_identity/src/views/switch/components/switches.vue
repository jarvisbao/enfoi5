<template>
  <div>
    <el-table
      v-loading="loading"
      :data="switches"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="host"
        label="主机IP"
        show-overflow-tooltip
      />
      <el-table-column
        prop="port"
        label="端口"
        show-overflow-tooltip
      />
      <el-table-column
        prop="join_time"
        label="上线时间"
        show-overflow-tooltip
      />
      <el-table-column
        prop="vlan_count"
        label="vlan数量"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span @click="switch_info(scope.row)" style="color: #409eff; cursor: pointer">{{ scope.row.vlan_count }}</span>
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
      <switch-vlans :switch="switc" />
    </el-dialog>
  </div>
</template>

<script>
// import { instance as Vue } from '@/life-cycle'
// const checkPermission = Vue.$Utils.checkPermission
import switchVlans from './switchVlans'
export default {
  components: {
    switchVlans
  },
  data() {
    return {
      pagination: {
        page_index: 1,
        page_size: 10
      },
      page: true,
      switches: [],
      showPage: false,
      loading: false,
      layout: 'sizes, prev, pager, next',
      dialogVisible: false,
      dialogTitle: '',
      switc: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$Apis.sysControl.switches(this.page, this.pagination.page_index, this.pagination.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.switches = response.payload.items
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
    switch_info(row) {
      this.switc = row
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = row.switch_name
    }
  }
}
</script>

<style scoped>

</style>
