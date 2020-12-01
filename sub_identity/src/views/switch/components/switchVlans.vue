<template>
  <div class="app-container" style="padding: 0">
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
    switch: {
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
      vlans: [],
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
      this.$Apis.sysControl.switch_vlans(this.switch.switch_id, this.page, this.pagination.page_index, this.pagination.page_size).then(response => {
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
    }
  }
}
</script>

<style scoped>

</style>
