<template>
  <div :style="styleBorder" :class="classObject" class="widget-item" @click.stop="handleSelectWidget(index)">
    <div :style="styleObject" class="title-bar">
      <div class="name">
        <i v-if="element.wdgt_icon" :class="element.wdgt_icon" />{{ element.wdgt_title }}
      </div>
      <div class="widget-action">
        <i :id="'wdgt_edit_'+element.wdgt_id" class="el-icon-edit" @click.stop="handleWidgetUpdate(element.wdgt_id)" />
        <i class="el-icon-rank drag-widget" />
        <i :id="'wdgt_remove_'+element.wdgt_id" class="el-icon-delete" @click.stop="handleWidgetDelete(index)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    element: {
      type: Object,
      default() {
        return {}
      }
    },
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
    index: {
      type: Number,
      required: true
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
  computed: {
    classObject: {
      get() {
        if (this.element.content_config !== null && JSON.parse(this.element.content_config).border) {
          return {
            hasColor: JSON.parse(this.element.content_config).border === 'obvious' ? this.element.wdgt_color : ''
          }
        } else {
          return {
            hasColor: this.element.wdgt_color ? this.element.wdgt_color : ''
          }
        }
      }
    },
    styleBorder: function() {
      if (this.element.wdgt_type !== '0' && this.element.wdgt_type !== '1') {
        return {
          borderColor: JSON.parse(this.element.content_config).border === 'obvious' ? this.element.wdgt_color : ''
        }
      } else {
        return {
          borderColor: this.element.wdgt_color ? this.element.wdgt_color : ''
        }
      }
    },
    styleObject: function() {
      if (this.element.wdgt_type !== '0' && this.element.wdgt_type !== '1') {
        return {
          borderColor: JSON.parse(this.element.content_config).border === 'obvious' ? this.element.wdgt_color : '',
          background: JSON.parse(this.element.content_config).border === 'obvious' ? this.element.wdgt_color : ''
        }
      } else {
        return {
          borderColor: this.element.wdgt_color ? this.element.wdgt_color : '',
          background: this.element.wdgt_color ? this.element.wdgt_color : ''
        }
      }
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
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
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
      })
      this.basic.push(this.data.list[index])
    },
    handleWidgetUpdate(wdgt_id) {
      this.$router.push({ name: 'widget_edit', query: { wdgt_id: wdgt_id }})
    }
  }
}
</script>
