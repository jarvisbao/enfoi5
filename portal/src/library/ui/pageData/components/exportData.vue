<template>
  <div class="export-box">
    <el-button :disabled="items.length===0" class="btn create-btn export-btn" @click="export_data">
      导出
    </el-button>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-table
        :data="[]"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in headers"
          :key="index"
          :label="item.label"
        />
      </el-table>
      <el-checkbox-group v-model="checkboxFields" size="small" @change="hanldChange">
        <el-checkbox-button v-for="item in exportFields" :key="item.prop" :label="item.prop">
          {{ item.label }}
        </el-checkbox-button>
      </el-checkbox-group>
      <div class="btn-box">
        <el-button plain size="medium" @click="checkAll">
          全选
        </el-button>
        <el-button plain size="medium" @click="reset">
          重置
        </el-button>
        <el-button type="danger" size="medium" @click="exportData">
          导出
        </el-button>
        <el-button plain size="medium" @click="cancel">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveAs } from 'file-saver'

export default {
  name: 'ExportData',
  props: {
    exportFields: {
      type: Array,
      default: () => []
    },
    object_id: {
      type: String,
      default: null
    },
    ids: {
      type: Array,
      default: () => []
    },
    isAll: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    page_size: {
      type: Number,
      default: 10
    },
    page_id: {
      type: String,
      default: undefined
    },
    items: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // items: [],
      headers: this.exportFields,
      checkboxFields: [],
      dialogVisible: false,
      dialogTitle: '数据导出'
    }
  },
  watch: {
    exportFields: {
      handler(val) {
        this.headers = val
        this.exportFields.forEach(item => {
          this.checkboxFields.push(item.prop)
        })
      },
      immediate: true
    }
  },
  created() {
    // this.exportFields.forEach(item => {
    //   this.checkboxFields.push(item.prop)
    // })
  },
  methods: {
    export_data() {
      this.dialogVisible = !this.dialogVisible
    },
    hanldChange(val) {
      this.headers = []
      val.forEach(element => {
        this.exportFields.forEach(item => {
          if (element === item.prop) {
            this.headers.push(item)
          }
        })
      })
    },
    checkAll() {
      this.checkboxFields = []
      this.exportFields.forEach(item => {
        this.checkboxFields.push(item.prop)
      })
      this.headers = this.exportFields
    },
    reset() {
      this.checkboxFields = []
      this.headers = []
    },
    exportData() {
      var isFileSaverSupported = false
      let ids = null
      try {
        isFileSaverSupported = !!new Blob()
      } catch (e) {}
      if (this.isAll) {
        ids = {}
        this.$Apis.object.export_data(this.object_id, this.checkboxFields, ids, this.text, this.pagination.page, this.page_size, true, this.page_id).then(response => {
          if (response.code === undefined) {
            var data = response
            var fileDownload = require('js-file-download')
            var blob = new Blob([data])
            if (isFileSaverSupported) {
              saveAs(blob, 'export.xls')
            } else {
              fileDownload(blob, 'export.xls')
            }
            this.$emit('show')
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      } else {
        ids = this.ids.join(',')
        this.$Apis.object.export_data(this.object_id, this.checkboxFields, ids, undefined, undefined, undefined, undefined, this.page_id).then(response => {
          if (response.code === undefined) {
            var data = response
            var fileDownload = require('js-file-download')
            try {
            } catch (e) {}
            var blob = new Blob([data], { type: data.type })
            if (isFileSaverSupported) {
              saveAs(blob, 'export.xls')
            } else {
              fileDownload(blob, 'export.xls')
            }
            this.cancel()
          } else {
            this.$alert(response.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      }
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.export-box {
  .el-table {
    margin-bottom: 15px;
    & /deep/ .el-table__header-wrapper {
      height: 48px;
      background: #fdf7f7;
      overflow: hidden;
    }
  }
  & /deep/ .el-table__empty-block {
    display: none;
  }
  .btn-box {
    margin-top: 30px;
    text-align: right;
  }
}
</style>
