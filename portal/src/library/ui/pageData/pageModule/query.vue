<template>
  <div class="data-query">
    <el-button type="text" @click="query" style="margin-right: 10px">
      查询
    </el-button>
    <el-dialog v-if="dialogSearch" :visible.sync="dialogSearch" title="查询" :close-on-click-modal="false" append-to-body>
      <set-query :object_id="object_id" :page_id="page_id" @show="isShow" @getQueryData="getData" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogSearch: false
    }
  },
  methods: {
    query() {
      this.dialogSearch = !this.dialogSearch
    },
    isShow() {
      this.dialogSearch = !this.dialogSearch
    },
    getData(params) {
      this.$Utils.EventBus.$emit('get-query-data', params)
      this.$nextTick(() => {
        this.isShow()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-query {
  display: inline;
}
</style>
