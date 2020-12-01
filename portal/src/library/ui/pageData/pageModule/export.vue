<template>
  <div class="data-export">
    <el-button :disabled="isDisable" class="btn create-btn export-btn" @click="export_data">
      导出
    </el-button>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <export-data
        :export-fields="headers"
        :object_id="object_id"
        :ids="ids"
        :is-all="isAll"
        :text="text"
        :pagination="pagination"
        :page_size="page_size"
        @show="isShow"
      />
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
    text: {
      type: String,
      default: null
    },
    pagination: {
      type: Object,
      default: function() {
        return {
          total: 10,
          page: 1
        }
      }
    },
    page_size: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      headers: [],
      ids: [],
      isAll: true,
      isDisable: false,
      dialogVisible: false,
      dialogTitle: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$Utils.EventBus.$on('disable_export_btn', (val) => {
        this.isDisable = val
      })
      this.$Utils.EventBus.$on('get_headers', (val) => {
        this.headers = val
      })
      this.$Utils.EventBus.$on('get_is_all', (val) => {
        this.isAll = val
      })
      this.$Utils.EventBus.$on('get_ids', (val) => {
        this.ids = val
      })
    })
  },
  beforeDestroy() {
    this.$Utils.EventBus.$off('disable_export_btn')
    this.$Utils.EventBus.$off('get_is_all')
    this.$Utils.EventBus.$off('get_ids')
  },
  methods: {
    export_data() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '数据导出'
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    }
  }
}
</script>
