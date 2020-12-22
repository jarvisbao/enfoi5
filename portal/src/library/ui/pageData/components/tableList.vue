<template>
  <div class="table-list">
    <el-table
      v-loading="loading"
      :data="items"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isMultiple || can_export"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in headers"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="item.data_format && ['image','file', 'html'].indexOf(item.data_format) != -1">
            <span class="dlink" v-html="scope.row[scope.column.property]" />
          </div>
          <div v-else-if="convert && scope.column.property in design_select">
            {{ scope.row[scope.column.property] | formatterFun(design_select[scope.column.property].values, design_select[scope.column.property].labels) }}
          </div>
          <div v-else>
            {{ scope.row[scope.column.property] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showColumn"
        fixed="right"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          <div v-for="item in scope.row.buttons.slice(0, 3)" :key="item.action">
            <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)">
              <i v-if="item.icon" :class="item.icon" :title="item.name" />
              <span v-else>{{ item.name }}</span>
            </span>
          </div>
          <el-dropdown v-if="scope.row.buttons.length > 3" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in scope.row.buttons.slice(3)" :key="index">
                <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)">
                  <span v-if="item.icon"><i :class="item.icon" :title="item.name" /> {{ item.name }}</span>
                  <span v-else>{{ item.name }}</span>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import cellButtonsFun from '../mixin/cellButtonsFun'

export default {
  name: 'tableList',
  mixins: [cellButtonsFun],
  filters: {
    formatterFun: function(value, values, labels) {
      // if (!value) return value
      let result = value
      const isArray = Array.isArray(value)
      if (value) {
        if (isArray) {
          result = []
          value.forEach(element => {
            const index = values.indexOf(element)
            if (index !== -1) {
              result.push(labels[index])
            }
          })
          result = result.join(',')
        } else {
          const index = values.indexOf(value)
          if (index !== -1) {
            result = labels[index]
          }
        }
      }
      return result
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    convert: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    can_export: {
      type: Boolean,
      default: false
    },
    showColumn: {
      type: Boolean,
      default: false
    },
    isOuterObj: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    headers_all: {
      type: Array,
      default: () => ([])
    },
    items: {
      type: Array,
      default: () => ([])
    },
    design_select: {
      type: Object,
      default: () => ({})
    },
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    },
    enable_record: {
      type: Boolean,
      default: false
    },
    set_session: {
      type: Function,
      default: null
    },
    add_script: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      update_headers: [],
      selectionData: [],
      ids: [],
      isAll: false
    }
  },
  methods: {
    fnCall(fun, row) {
      this[fun](row, this.isOuterObj) // 如果是外链子对象传 true
    },
    mtdCall(fun, item, row) {
      this[fun](item, row, this.isOuterObj) // 如果是外链子对象传 true
    },
    handleSelectionChange(val) {
      this.selectionData = val
      this.ids = []
      const selectionLength = val.length
      // 判断是否选中当前页所有行
      if (selectionLength === this.items.length) { // selectionLength === this.page_size || selectionLength === this.pagination.total
        this.isAll = true
      } else {
        this.isAll = false
        val.forEach((item, index) => {
          var filter = []
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                filter.push(element['prop'] + '=="' + element['value'] + '"')
                this.ids.push(element['value'])
                return true
              }
            }
          })
        })
      }
      this.$emit('checkDate', { selectionData: this.selectionData, ids: this.ids, isAll: this.isAll })
    }
  }
}
</script>
