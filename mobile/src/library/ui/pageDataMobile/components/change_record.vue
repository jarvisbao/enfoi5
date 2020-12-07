<template>
  <div>
    <van-sticky>
      <van-nav-bar
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="operateData"
      >
        <div class="list-box">
          <div v-for="(item, index) in items" :key="index" class="list-item">
            <div class="list padding">
              <div class="item">
                <label>操作人:</label>
                <div>{{ item._transaction_operator }}</div>
              </div>
              <div class="item">
                <label>更改时间:</label>
                <div>{{ item._transaction_date }}</div>
              </div>
              <div class="item">
                <label>属性:</label>
                <div>{{ item.changes.field }}</div>
              </div>
              <div class="item">
                <label>变动前:</label>
                <div>{{ item.changes.old_value | formatterFun }}</div>
              </div>
              <div class="item">
                <label>变动后:</label>
                <div>{{ item.changes.new_value | formatterFun }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>

export default {
  filters: {
    formatterFun(cellValue) {
      if (cellValue === true) {
        return '是'
      } else if (cellValue === false) {
        return '否'
      } else {
        return cellValue
      }
    }
  },
  data() {
    return {
      items: [],
      object_id: null,
      mtd_id: null,
      loading: true,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      objid: null,
      finished: false,
      refreshing: false
    }
  },
  created() {
    this.get_object_id()
    this.get_method_id()
    this.objid = this.$route.query.objid ? this.$route.query.objid : null
    this.getData()
  },
  methods: {
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.pagination.page = 1
      this.loading = true
      // this.getData()
      this.operateData()
    },
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
    getData() {
      this.loading = true
      this.$Apis.object.get_changes(this.object_id, this.objid, this.mtd_id, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          if (response.payload.items.length === 0) {
            this.finished = true
          }
          this.items = [...this.items, ...response.payload.items]
          this.pagination = response.payload.pagination
          if (this.pagination.page === this.pagination.pages) {
            this.finished = true
          } else {
            this.pagination.page += 1
          }
        } else {
          this.finished = true
          this.$dialog.alert({
            message: response.message
          })
        }
        this.loading = false
      })
    },
    operateData() {
      setTimeout(() => {
        if (this.refreshing) {
          this.items = []
          this.pagination.page = 1
          this.refreshing = false
        }
        this.getData()
      }, 1000)
    },
    onClickLeft() {
      this.$router.go(-1)
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

