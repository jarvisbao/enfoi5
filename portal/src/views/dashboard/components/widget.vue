<template>
  <div class="widget-main">
    <el-row :gutter="30">
      <el-col v-for="(element, index) in data.list" :key="index" :span="element.span ? element.span : 0">
        <draggable
          v-model="element.list"
          :no-transition-on-drag="true"
          v-bind="{group:'people', ghostClass: 'ghost', animation: 200, handle: '.drag-widget'}"
          @end="handleMoveEnd"
          @add="handleWidgetAdd($event, element)"
        >
          <transition-group name="fade" tag="div" class="grid-content">
            <widget-item
              v-for="(el, i) in element.list"
              v-if="el.wdgt_id"
              :key="el.wdgt_id"
              :index="i"
              :element="el"
              :select.sync="selectWidget"
              :data="element"
              :basic="basic"
            />
          </transition-group>
        </draggable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import widgetItem from './widgetItem'

export default {
  components: {
    Draggable,
    widgetItem
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    select: {
      type: Object,
      default() {
        return {}
      }
    },
    basic: {
      type: Array,
      default() {
        return []
      }
    }
  },
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
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd() {},
    handleWidgetAdd($event, row) {
      // console.log('coladd', row)
      const newIndex = $event.newIndex

      this.$set(row.list, newIndex, {
        ...row.list[newIndex]
      })
      this.selectWidget = row.list[newIndex]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
