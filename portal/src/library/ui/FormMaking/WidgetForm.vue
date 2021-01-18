<template>
  <div :style="{width: data.config.width, margin: 'auto'}" class="widget-form-container">
    <el-form
      :size="data.config.size"
      :label-position="data.config.labelPosition"
      :label-width="data.config.isLabelWidth ? data.config.labelWidth + 'px' : 'auto'"
      :disabled="data.config.readOnly"
      :class="{
        [data.config && data.config.customClass]: (data.config && data.config.customClass) ? true : false,
      }"
      label-suffix=":"
    >
      <div v-if="data.list.length == 0" class="form-empty">
        {{ $t('enfo.fm.description.containerEmpty') }}
      </div>
      <draggable
        v-model="data.list"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        class=""

        @add="handleWidgetAdd"
        @update="handleWidgetUpdate"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list" v-if="element && element.key">
            <widget-table
              v-if="element.type === 'table'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />

            <widget-object
              v-else-if="element.type === 'innerobject' || element.type === 'outerobject'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />

            <widget-tab-item
              v-else-if="element.type === 'tabs'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />

            <widget-report
              v-else-if="element.type === 'report'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />

            <widget-form-item
              v-else-if="element.type !== 'grid'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />

            <widget-col-item
              v-else
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @select-change="handleSelectChange"
            />
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import WidgetColItem from './WidgetColItem'
import WidgetTable from './WidgetTable'
import WidgetTabItem from './WidgetTabItem'
import WidgetReport from './WidgetReport'
import WidgetObject from './WidgetObject'
import _ from 'lodash'

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetColItem,
    WidgetTable,
    WidgetTabItem,
    WidgetReport,
    WidgetObject
  },
  // props: ['data', 'select'],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    select: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectWidget: this.select || {}
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    this.$Utils.EventBus.$on('on-field-add', item => {
      // console.log('.....')
      // console.log(item, this.data, this.select)
      const key = new Date().getTime() + ''
      const widgetItem = _.cloneDeep({
        ...item,
        options: {
          ...item.options,
          remoteFunc: 'func_' + key
        },
        key,
        model: item.type + '_' + key,
        rules: [],
        name_model: { 'label': eval('item.name'), 'prop': key }
      })

      if (widgetItem.type == 'report') {
        widgetItem.rows = this.$Utils.util.generateKeyToTD(widgetItem.rows)
      }

      if (widgetItem.type == 'grid') {
        widgetItem.columns = this.$Utils.util.generateKeyToCol(widgetItem.columns)
      }

      this._addWidget(this.data.list, widgetItem)
    })
  },
  beforeDestroy () {
    this.$Utils.EventBus.$off('on-field-add')
  },
  methods: {
    _addWidget(list, widget, isTable = false) {
      if (isTable &&
        (widget.type === 'grid' || widget.type === 'table' || widget.type === 'tabs' || widget.type === 'divider' || widget.type == 'report')) {
        this.$message.warning(this.$t('enfo.fm.message.noPut'))
        return false
      }

      if (this.selectWidget && this.selectWidget.key) {
        const index = list.findIndex(item => item.key === this.selectWidget.key)

        if (index >= 0) {
          list.splice(index + 1, 0, widget)

          this.selectWidget = list[index + 1]
          this.$nextTick(() => {
            this.$Utils.EventBus.$emit('on-history-add')
          })
        } else {
          for (let l = 0; l < list.length; l++) {
            let item = list[l]

            if (item.type === 'grid') {
              item.columns.forEach(column => {
                this._addWidget(column.list, widget)
              })
            }
            if (item.type === 'table') {
              if (!this._addWidget(item.tableColumns, widget, true)) {
                return false
              }
            }
            if (item.type === 'tabs') {
              item.tabs.forEach(tab => {
                this._addWidget(tab.list, widget)
              })
            }
            if (item.type === 'report') {

              for (let i = 0; i < item.rows.length; i++) {
                for (let j = 0; j < item.rows[i].columns.length; j++) {
                  if (!this._addWidget(item.rows[i].columns[j].list, widget, false)){
                    return false
                  }
                }
              }
            }
          }
        }
      } else {
        list.push(widget)

        this.selectWidget = list[list.length - 1]
        this.$nextTick(() => {
          this.$Utils.EventBus.$emit('on-history-add')
        })
      }
    },
    handleWidgetUpdate(evt) {
      this.$nextTick(() => {
        this.$Utils.EventBus.$emit('on-history-add')
      })
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex

      this.$set(this.data.list, newIndex, _.cloneDeep(this.data.list[newIndex]))

      // 为拖拽到容器的元素添加唯一 key
      const key = new Date().getTime() + ''
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: this.data.list[newIndex].options.remoteFunc || 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].model ? this.data.list[newIndex].model : this.data.list[newIndex].type + '_' + key,
        rules: this.data.list[newIndex].rules ? [...this.data.list[newIndex].rules] : [],
        name_model: { 'label': eval('this.data.list[newIndex].name'), 'prop': key }
      })

      if (this.data.list[newIndex].type == 'report') {
        this.data.list[newIndex].rows = this.$Utils.util.generateKeyToTD(this.data.list[newIndex].rows)
      }

      if (this.data.list[newIndex].type == 'grid') {
        this.data.list[newIndex].columns = this.$Utils.util.generateKeyToCol(this.data.list[newIndex].columns)
      }

      this.selectWidget = this.data.list[newIndex]
      this.$nextTick(() => {
        this.$Utils.EventBus.$emit('on-history-add')
      })
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
        this.$nextTick(() => {
          this.$Utils.EventBus.$emit('on-history-add')
        })
      })
    },
    handleSelectChange(index) {
      // console.log('select-change', index)
      setTimeout(() => {
        index >= 0 ? (this.selectWidget = this.data.list[index]) : (this.selectWidget = {})
      })
    }
  }
}
</script>

<style lang="scss">
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.3s;
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
</style>
