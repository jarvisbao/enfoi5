<template>
  <div
    class="widget-col widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
  >
    <el-row
      :type="element.options.flex ? 'flex' : ''"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
    >
      <el-col
        v-for="(item, i) in element.columns"
        :key="item.key"
        :class="{
          active: selectWidget.key && selectWidget.key == item.key,
        }"
        :xs="item.options ? (element.options.responsive ? item.options.xs || 0 : item.options.span || 0) : (element.options.responsive ? item.xs || 0 : item.span || 0)"
        :sm="item.options ? (element.options.responsive ? item.options.sm || 0 : item.options.span || 0) : (element.options.responsive ? item.sm || 0 : item.span || 0)"
        :md="item.options ? (element.options.responsive ? item.options.md || 0 : item.options.span || 0) : (element.options.responsive ? item.md || 0 : item.span || 0)"
        :lg="item.options ? (element.options.responsive ? item.options.lg || 0 : item.options.span || 0) : (element.options.responsive ? item.lg || 0 : item.span || 0)"
        :xl="item.options ? (element.options.responsive ? item.options.xl || 0 : item.options.span || 0) : (element.options.responsive ? item.xl || 0 : item.span || 0)"
        :offset="item.options ? item.options.offset : 0"
        :push="item.options ? item.options.push : 0"
        :pull="item.options ? item.options.pull : 0"
        class="widget-col-item"
        @click.stop.native="handleSelectItemWidget(i)"
      >
        <draggable
          v-model="item.list"
          v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetColAdd($event, element, i)"
          @update="handleWidgetColUpdate"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(col, colindex) in item.list" v-if="col && col.key">
              <widget-col-item
                v-if="col.type === 'grid'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-tab-item
                v-else-if="col.type === 'tabs'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-report
                v-else-if="col.type === 'report'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget" 
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)" 
              />

              <widget-table
                v-else-if="col.type === 'table'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-form-item
                v-else
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />
            </template>
          </transition-group>
        </draggable>
        <div class="widget-view-action widget-col-action" v-if="selectWidget.key == item.key">
          <i class="iconfont-fm icon-icon_clone" @click.stop="handleColItemClone(index, i)" title="复制"></i>
          <i class="iconfont-fm icon-trash" @click.stop="handleColItemDelete(index, i)" v-if="element.columns.length > 1" title="删除"></i>
        </div>
      </el-col>
    </el-row>

    <div v-if="selectWidget.key == element.key" class="widget-view-action widget-col-action">
      <i class="iconfont-fm icon-tianjiazengjiajia" @click.stop="handleAddCol(index)" title="添加列"></i>
      <i class="iconfont-fm icon-icon_clone" @click.stop="handleColClone(index)" title="复制" />
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
import WidgetTabItem from './WidgetTabItem'
import Draggable from 'vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '@/library/js/layout-clone.js'

export default {
  name: 'WidgetColItem',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetTabItem,
    WidgetReport: () => import('./WidgetReport.vue')
  },
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select || {},
      selectIndex: -1
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      deep: true,
      handler(val) {
        this.$emit('update:select', val)
      }
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handleSelectItemWidget (i) {
      this.selectWidget = this.data.list[this.index].columns[i]

      this.selectIndex = i
    },
    handleWidgetDelete(index) {
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

    handleColItemDelete (index, i) {
      this.data.list[index].columns.splice(i, 1)

      if (i == 0) {
        this.selectWidget = this.data.list[index].columns[0]
      } else {
        this.selectWidget = this.data.list[index].columns[i - 1]
      }

      setTimeout(() => {
        this.$Utils.EventBus.$emit('on-history-add')
      }, 20)
    },

    handleAddCol (index) {
      this.data.list[index].columns.push({
        type: 'col',
        options: {
          span: 24,
          offset: 0,
          push: 0,
          pull: 0,
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
          customClass: ''
        },
        list: [],
        key: Math.random().toString(36).slice(-8)
      })

      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },

    handleColClone(index) {
      const cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
        this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
      })
    },

    handleColItemClone (index, i) {
      let cloneData = _.cloneDeep(this.data.list[index].columns[i])

      this.data.list[index].columns.splice(i + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index].columns[i + 1]

        this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
      })
    },

    handleWidgetColUpdate(evt) {
      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },

    handleWidgetColAdd($event, row, colIndex) {
      const newIndex = $event.newIndex

      const key = new Date().getTime() + ''
      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: row.columns[colIndex].list[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption: row.columns[colIndex].list[newIndex].options.remoteOption || 'option_'+key
        },
        novalid: {
          ...row.columns[colIndex].list[newIndex].novalid
        },
        key,
        model: row.columns[colIndex].list[newIndex].model ? row.columns[colIndex].list[newIndex].model : row.columns[colIndex].list[newIndex].type + '_' + key,
        rules: row.columns[colIndex].list[newIndex].rules ? [...row.columns[colIndex].list[newIndex].rules] : [],
        name_model: { 'label': eval('row.columns[colIndex].list[newIndex].name'), 'prop': key }
      })

      if (row.columns[colIndex].list[newIndex].type == 'report') {
        row.columns[colIndex].list[newIndex].rows = this.$Utils.util.generateKeyToTD(row.columns[colIndex].list[newIndex].rows)
      }

      if (row.columns[colIndex].list[newIndex].type == 'grid') {
        row.columns[colIndex].list[newIndex].columns = this.$Utils.util.generateKeyToCol(row.columns[colIndex].list[newIndex].columns)
      }

      this.$set(row.columns[colIndex].list, newIndex, _.cloneDeep(row.columns[colIndex].list[newIndex]))

      this.selectWidget = row.columns[colIndex].list[newIndex]
      this.$nextTick(() => { this.$Utils.EventBus.$emit('on-history-add') })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0 ? (this.selectWidget = item.list[index]) : (this.selectWidget = {})
      })
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
