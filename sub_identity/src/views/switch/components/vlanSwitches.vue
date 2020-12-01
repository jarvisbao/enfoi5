<template>
  <div class="app-container" style="padding: 0">
    <el-table
      v-loading="loading"
      :data="switchs"
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
        prop="peer_count"
        label="peer数量"
        show-overflow-tooltip
      />
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
  </div>
</template>

<script>
export default {
  props: {
    vlan: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      pagination: {
        page_index: 1,
        page_size: 10
      },
      page: true,
      switchs: [],
      showPage: false,
      loading: false,
      layout: 'sizes, prev, pager, next'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$Apis.sysControl.vlan_switches(this.vlan.vlan_name, this.page, this.pagination.page_index, this.pagination.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.switchs = response.payload.items
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
    }
  }
}
</script>

<style scoped>

</style>
