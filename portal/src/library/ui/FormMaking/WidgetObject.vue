<template>
  <el-form-item
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    :label="element.options.hideLabel ? '' : element.name"
    :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : '')"
    class="widget-table widget-view"
    @click.native.stop="handleSelectWidget(index)"
  >
    <div>
      <el-table :data="[{}]" class="widget-table-left" row-class-name="widget-table-row" border style="width: 100%">
        <el-table-column label="#" width="50" fixed>
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column />
      </el-table>
    </div>

    <div v-if="selectWidget.key == element.key" class="widget-view-action widget-col-action">
      <i class="iconfont-fm icon-icon_clone" @click.stop="handleTableClone(index)" title="复制" />
      <i class="iconfont-fm icon-trash" @click.stop="handleWidgetDelete(index)" title="删除" />
    </div>

    <div v-if="selectWidget.key == element.key" class="widget-view-drag widget-col-drag">
      <i class="iconfont-fm icon-drag drag-widget" />
    </div>
  </el-form-item>
</template>
<script>
import _ from 'lodash'
import { CloneLayout } from '@/library/js/layout-clone'
import { EventBus } from '@/library/js/event-bus'

export default {
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select
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
    handleTableClone(index) {
      const cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
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
        EventBus.$emit('on-history-add')
      }, 20)
    }
  }
}
</script>
