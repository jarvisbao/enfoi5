<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="change-box">
      <div class="title">
        {{ item._transaction_operator }} <span>{{ item._transaction_date }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="item.changes"
        border
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="field"
          label="属性"
          show-overflow-tooltip
        />
        <el-table-column
          :formatter="formatterFun"
          prop="old_value"
          label="变动前"
          show-overflow-tooltip
        />
        <el-table-column
          :formatter="formatterFun"
          prop="new_value"
          label="变动后"
          show-overflow-tooltip
        />
      </el-table>
    </div>
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
</template>
<script>

export default {
  data() {
    return {
      items: [],
      object_id: null,
      mtd_id: null,
      loading: false,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      showPage: false,
      objid: null
    }
  },
  created() {
    this.fetchDate()
  },
  methods: {
    get_object_id() {
      if ('object_id' in this.$route.query) {
        this.object_id = this.$route.query.object_id
        return this.object_id
      } else {
        return null
      }
    },
    get_method_id() {
      if ('mtd_id' in this.$route.query) {
        this.mtd_id = this.$route.query.mtd_id
        return this.mtd_id
      } else {
        return null
      }
    },
    fetchDate() {
      this.objid = this.$route.query.objid ? this.$route.query.objid : null
      this.get_object_id()
      this.get_method_id()
      this.loading = true
      this.$Apis.object.get_changes(this.object_id, this.objid, this.mtd_id, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          if (this.pagination.total > 0) {
            this.showPage = true
          } else {
            this.showPage = false
          }
          this.loading = false
        }
      })
    },
    operateData() {
      this.loading = true
      this.$Apis.object.get_changes(this.object_id, this.objid, this.mtd_id, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.items = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    formatterFun(row, column, cellValue, index) {
      if (cellValue === true) {
        return '是'
      } else if (cellValue === false) {
        return '否'
      } else {
        return cellValue
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.change-box {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eaeaea;
  .title {
    margin: -10px -10px 10px -10px;
    padding: 14px 12px 14px 18px;
    background: #ecf5ff;
    border-bottom: 1px solid #eaeaea;
    color: #797979;
    span {
      margin-left: 10px;
      font-size: 13px;
      color: #797979;
    }
  }
  .el-table {
    & /deep/ th,
    & /deep/ td {
      padding: 8px 0;
      background: #fff;
    }
  }
}
</style>

