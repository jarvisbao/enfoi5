<template>
  <div>
    <el-form-item
      v-if="element && element.key && element.type != 'divider'"
      :class="{active: selectWidget.key == element.key, 'is_req': element.options.required, 'is_hidden': element.options.hidden}"
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : '')"
      class="widget-view "
      @click.native.stop="handleSelectWidget(index)"
    >
      <widget-element-item :element="element" :is-table="false" :key="element.key" />

      <div v-if="selectWidget.key == element.key" class="widget-view-action">
        <i class="iconfont-fm icon-icon_clone" @click.stop="handleWidgetClone(index)" title="复制" />
        <i class="iconfont-fm icon-trash" @click.stop="handleWidgetDelete(index)" title="删除" />
      </div>

      <div v-if="selectWidget.key == element.key" class="widget-view-drag">
        <i class="iconfont-fm icon-drag drag-widget" />
      </div>
      <div class="widget-view-model" v-if="element.options.dataBind">
        <span>{{ element.model }}</span>
      </div>
      <div class="tips" :style="{color: element.options.textColor}">
        {{ element.options.fieldTips }}
      </div>
    </el-form-item>

    <div
      v-if="element && element.key && element.type == 'divider'"
      :class="{active: selectWidget.key == element.key, 'is_hidden': element.options.hidden}"
      class="widget-view no-put"
      style="padding-bottom: 0;"
      @click.stop="handleSelectWidget(index)"
    >
      <el-divider :content-position="element.options.contentPosition">
        {{ element.name }}
      </el-divider>

      <div v-if="selectWidget.key == element.key" class="widget-view-action">
        <i class="iconfont-fm icon-icon_clone" @click.stop="handleWidgetClone(index)" title="复制" />
        <i class="iconfont-fm icon-trash" @click.stop="handleWidgetDelete(index)" title="删除" />
      </div>

      <div v-if="selectWidget.key == element.key" class="widget-view-drag">
        <i class="iconfont-fm icon-drag drag-widget" />
      </div>
      <div class="widget-view-model" v-if="element.options.dataBind">
        <span>{{ element.model }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import WidgetElementItem from './WidgetElementItem'
import _ from 'lodash'
import { EventBus } from '@/library/js/event-bus'

export default {
  components: {
    WidgetElementItem
  },
  props: ['element', 'select', 'index', 'data'],
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

  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
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

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
        setTimeout(() => {
          EventBus.$emit('on-history-add')
        }, 20)
      })
    },
    handleWidgetClone(index) {
      const key = new Date().getTime() + ''
      const cloneData = {
        ..._.cloneDeep(this.data.list[index]),
        key,
        model: this.data.list[index].type + key
      }

      this.data.list.splice(index + 1, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    }
  }
}
</script>
