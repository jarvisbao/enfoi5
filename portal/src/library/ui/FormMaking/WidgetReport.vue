<template>
  <div
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    class="widget-report widget-view fm-report-table"
    @click.stop="handleSelectWidget(index)"
  >
    <table class="fm-report-table__table" :style="{
        'border-top-width': element.options.borderWidth + 'px',
        'border-top-color': element.options.borderColor,
        'border-left-width': element.options.borderWidth + 'px',
        'border-left-color': element.options.borderColor,
      }">
      <tr :key="rowIndex" v-for="(row, rowIndex) in element.rows">
        <td :style="{
            'border-right-width': element.options.borderWidth + 'px',
            'border-right-color': element.options.borderColor,
            'border-bottom-width': element.options.borderWidth + 'px',
            'border-bottom-color': element.options.borderColor,
            'width': column.options.width,
            'height': column.options.height
          }"
          v-for="(column, i) in row.columns" :key="rowIndex + '-' + i"
          v-if="!column.options.invisible"
          :colspan="column.options.colspan"
          :rowspan="column.options.rowspan"
          class="widget-report-item fm-report-table__td"
          :class="{
            active: selectWidget.key && selectWidget.key == column.key,
          }"
          @click.stop="handleSelectItemWidget(rowIndex, i)"
          valign="top"
        >
          <draggable
            v-model="column.list"
            v-bind="{group: 'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            :no-transition-on-drag="true"
            @add="handleWidgetItemAdd($event, element, rowIndex, i)"
            @update="handleWidgetItemUpdate"
          >
            <transition-group name="fade" tag="div" class="widget-col-list">
              <template v-for="(c, cindex) in column.list" v-if="c && c.key">
                <widget-tab-item
                  v-if="c.type === 'tabs'"
                  :key="c.key"
                  :element="c"
                  :select.sync="selectWidget"
                  :index="cindex"
                  :data="column"
                  @select-change="handleSelectChange($event, column)"
                />

                <widget-table
                  v-else-if="c.type === 'table'"
                  :key="c.key"
                  :element="c"
                  :select.sync="selectWidget"
                  :index="cindex"
                  :data="column"
                  @select-change="handleSelectChange($event, column)"
                />

                <widget-report
                  v-else-if="c.type === 'report'"
                  :key="c.key"
                  :element="c"
                  :select.sync="selectWidget"
                  :index="cindex"
                  :data="column"
                  @select-change="handleSelectChange($event, column)"
                />

                <widget-form-item 
                  v-else-if="c.type !== 'grid'"
                  :key="c.key"
                  :element="c"
                  :select.sync="selectWidget"
                  :index="cindex"
                  :data="column"
                  @select-change="handleSelectChange($event, column)"
                />

                <widget-col-item
                  v-else
                  :key="c.key"
                  :element="c"
                  :select.sync="selectWidget"
                  :index="cindex"
                  :data="column"
                  @select-change="handleSelectChange($event, column)"
                />
              </template>
            </transition-group>
          </draggable>
          <div v-if="selectWidget.key == column.key" class="widget-view-action widget-col-action">
            <i v-if="showRight" class="iconfont-fm icon-xiangyouhebing" @click.stop="handleRight(column)" title="向右合并" />
            <i v-if="showBottom" class="iconfont-fm icon-xiangxiahebing" @click.stop="handleBottom(column)" title="向下合并" />
            <i v-if="showRemoveRow" class="iconfont-fm icon-shanchuhang" @click.stop="handleRemoveRow" title="删除当前行" />
            <i v-if="showRemoveColumn" class="iconfont-fm icon-shanchulie" @click.stop="handleRemoveColumn" title="删除当前列" />
          </div>
        </td>
      </tr>
    </table>

    <div v-if="selectWidget.key == element.key" class="widget-view-action widget-col-action">
      <i class="iconfont-fm icon--charuhang" @click.stop="handleAddRow(index)" title="插入行" />
      <i class="iconfont-fm icon--charulie" @click.stop="handleAddColumns(index)" title="插入列" />
      <i class="iconfont-fm icon-icon_clone" @click.stop="handleReportClone(index)" title="复制" />
      <i class="iconfont-fm icon-trash" @click.stop="handleWidgetDelete(index)" title="删除" />
    </div>

    <div v-if="selectWidget.key == element.key" class="widget-view-drag widget-col-drag">
      <i class="iconfont-fm icon-drag drag-widget" />
    </div>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import WidgetTable from './WidgetTable'
import Draggable from 'vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '@/library/js/layout-clone.js'

export default {
  name: 'widget-report',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetColItem: () => import('./WidgetColItem.vue'),
    WidgetTabItem: () => import('./WidgetTabItem.vue')
  },
  props: ['element', 'select', 'index', 'data'],
  data () {
    return {
      selectWidget: this.select || {},
      selectR: -1,
      selectC: -1,
    }
  },
  computed: {
    showRight () {
      const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
      const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan

      if (this.selectC + currentColspan < this.element.rows[this.selectR].columns.length) {
        const nextColumn = this.element.rows[this.selectR].columns[currentColspan + this.selectC]

        if (!nextColumn.options.invisible && currentRowspan === nextColumn.options.rowspan) {
          return true
        }
      }

      return false
    },
    showBottom () {
      const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
      const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan

      if (currentRowspan + this.selectR < this.element.rows.length) {
        const nextColumn = this.element.rows[currentRowspan + this.selectR].columns[this.selectC]

        if (!nextColumn.options.invisible && currentColspan === nextColumn.options.colspan) {
          return true
        }
      }

      return false
    },

    showRemoveRow () {
      if (this.element.rows.length > 1) {
        const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
        if (currentRowspan === 1) {
          return true
        } else {
          let i = 0
          for (; i < this.element.rows[this.selectR].columns.length; i++) {
            if (currentRowspan !== this.element.rows[this.selectR].columns[i].options.rowspan) {
              return false
            }
          }

          if (this.element.rows[this.selectR].columns.length === i) {
            return true
          }
        }
      }
      return false
    },

    showRemoveColumn () {
      if (this.element.rows[this.selectR].columns.length > 1) {
        const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan
        if (currentColspan === 1) {
          return true
        } else {
          let i = 0;
          for (; i < this.element.rows.length; i++) {
            if (currentColspan !== this.element.rows[i].columns[this.selectC].options.colspan) {
              return false
            }
          }

          if (this.element.rows.length === i) {
            return true
          }
        }
      }

      return false
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      deep: true,
      handler (val) {
        this.$emit('update:select', val)
      }
    },
  },
  methods: {
    handlePut (a, b, c) {
      if (c.className.indexOf('widget-col') >= 0 ||
        c.className.indexOf('widget-table') >= 0 ||
        c.className.indexOf('widget-tab') >= 0 ||
        c.className.indexOf('no-put') >= 0 ||
        c.children[0].className.indexOf('no-put') >= 0) {
        return false
      }
      return true
    },
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
    },
    handleSelectItemWidget (rowIndex, colIndex) {
      this.selectWidget = this.data.list[this.index].rows[rowIndex].columns[colIndex]
      this.selectR = rowIndex
      this.selectC = colIndex
    },
    handleWidgetDelete (index) {
      if (this.data.list.length === 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.list.length - 1 === index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }
      
      this.data.list.splice(index, 1)

      setTimeout(() => {
        this.$Utils.EventBus.$emit('on-history-add')
      }, 20)
    },
    handleWidgetItemAdd ($event, element, rowIndex, colIndex) {
      const newIndex = $event.newIndex

      const key = new Date().getTime() + ''

      this.$set(element.rows[rowIndex].columns[colIndex].list, newIndex, {
        ...element.rows[rowIndex].columns[colIndex].list[newIndex],
        options: {
          ...element.rows[rowIndex].columns[colIndex].list[newIndex].options,
          remoteFunc: element.rows[rowIndex].columns[colIndex].list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: element.rows[rowIndex].columns[colIndex].list[newIndex].options.remoteOption || 'option_'+key,
        },
        key,
        model: element.rows[rowIndex].columns[colIndex].list[newIndex].model ? element.rows[rowIndex].columns[colIndex].list[newIndex].model : element.rows[rowIndex].columns[colIndex].list[newIndex].type + '_' + key,
        rules: element.rows[rowIndex].columns[colIndex].list[newIndex].rules ? [...element.rows[rowIndex].columns[colIndex].list[newIndex].rules] : [],
        name_model: { 'label': eval('element.rows[rowIndex].columns[colIndex].list[newIndex].name'), 'prop': key }
      })

      if (element.rows[rowIndex].columns[colIndex].list[newIndex].type == 'report') {
        element.rows[rowIndex].columns[colIndex].list[newIndex].rows = this.$Utils.util.generateKeyToTD(element.rows[rowIndex].columns[colIndex].list[newIndex].rows)
      }

      if (element.rows[rowIndex].columns[colIndex].list[newIndex].type == 'grid') {
        element.rows[rowIndex].columns[colIndex].list[newIndex].columns = this.$Utils.util.generateKeyToCol(element.rows[rowIndex].columns[colIndex].list[newIndex].columns)
      }

      this.$set(element.rows[rowIndex].columns[colIndex].list, newIndex, _.cloneDeep(element.rows[rowIndex].columns[colIndex].list[newIndex]))

      this.selectWidget = element.rows[rowIndex].columns[colIndex].list[newIndex]

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },
    handleWidgetItemUpdate () {
      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },
    handleReportClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
      })
    },
    handleAddRow (index) {
      const columns = this.data.list[index].rows[this.data.list[index].rows.length - 1].columns.length

      this.data.list[index].rows.push({
        columns: Array.from({length: columns}, _ => {
          return {
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
            },
            key: Math.random().toString(36).slice(-8)
          }
        })
      })

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },
    handleAddColumns (index) {
      this.data.list[index].rows.forEach(item => {
        item.columns.push({
          type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
            },
            key: Math.random().toString(36).slice(-8)
        })
      })

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },
    handleRight (column) {
      const currentColspan = column.options.colspan
      const nextC = this.selectC + currentColspan
      const nextColspan = this.element.rows[this.selectR].columns[nextC].options.colspan

      this.$set(column.options, 'colspan', currentColspan + nextColspan)

      this.element.rows[this.selectR].columns[nextC].options.invisible = true

      const tempList = [...this.element.rows[this.selectR].columns[nextC].list]

      this.element.rows[this.selectR].columns[nextC].list = []

      column.list = column.list.concat(tempList)

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },

    handleBottom (column) {
      const currentRowspan = column.options.rowspan
      const nextR = this.selectR + currentRowspan
      const nextRowspan = this.element.rows[nextR].columns[this.selectC].options.rowspan

      this.$set(column.options, 'rowspan', currentRowspan + nextRowspan)

      this.element.rows[nextR].columns[this.selectC].options.invisible = true

      const tempList = [...this.element.rows[nextR].columns[this.selectC].list]

      this.element.rows[nextR].columns[this.selectC].list = []

      column.list = column.list.concat(tempList)

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },

    findPrevRowIndex (rowIndex, colIndex) {
      if (this.element.rows[rowIndex].columns[colIndex].options.invisible) {
        return this.findPrevRowIndex(rowIndex - 1, colIndex)
      } else {
        return rowIndex
      }
    },

    findPrevColIndex (rowIndex, colIndex) {
      if (this.element.rows[rowIndex].columns[colIndex].options.invisible) {
        return this.findPrevRowIndex(rowIndex, colIndex - 1)
      } else {
        return colIndex
      }
    },

    handleRemoveRow () {
      for (let j = 0; j < this.element.rows[this.selectR].columns.length; j++) {
        const currentRowspan = this.element.rows[this.selectR].columns[j].options.rowspan
        const invisible = this.element.rows[this.selectR].columns[j].options.invisible

        if (invisible) {

          const prevIndex = this.findPrevRowIndex(this.selectR - 1, j)

          this.element.rows[prevIndex].columns[j].options.rowspan = this.element.rows[prevIndex].columns[j].options.rowspan - 1

        }else if (currentRowspan > 1) {
          this.element.rows[this.selectR + 1].columns[j].list = [...this.element.rows[this.selectR].columns[j].list]
          this.element.rows[this.selectR + 1].columns[j].options.invisible = false
          this.element.rows[this.selectR + 1].columns[j].options.rowspan = currentRowspan - 1
        } else {
          
        }
      }

      this.element.rows.splice(this.selectR, 1)
    },

    handleRemoveColumn () {
      for (let i = 0; i < this.element.rows.length; i++) {
        const currentColspan = this.element.rows[i].columns[this.selectC].options.colspan
        const invisible = this.element.rows[i].columns[this.selectC].options.invisible

        if (invisible) {
          const prevIndex = this.findPrevColIndex(i, this.selectC - 1)

          this.element.rows[i].columns[prevIndex].options.colspan = this.element.rows[i].columns[prevIndex].options.colspan - 1

        } else if (currentColspan > 1) {
          this.element.rows[i].columns[this.selectC + 1].list = [...this.element.rows[i].columns[this.selectC].list]
          this.element.rows[i].columns[this.selectC + 1].options.invisible = false
          this.element.rows[i].columns[this.selectC + 1].options.colspan = currentColspan - 1
        } else {
        }

        this.element.rows[i].columns.splice(this.selectC, 1)
      }
    },

    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (this.selectWidget = item.list[index]) : (this.selectWidget = this.data.list[this.index])
      })
    }
  }
}
</script>