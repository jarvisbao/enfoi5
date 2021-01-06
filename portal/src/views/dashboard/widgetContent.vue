<template>
  <div>
    <el-header height="52px" class="widget-header">
      <el-row>
        <el-col>
          <div style="display: flex;">
            <!-- 布局列数： -->
            <el-radio-group v-model="col" size="mini" @change="changeColSpan">
              <el-radio-button label="两列" />
              <el-radio-button label="三列" />
            </el-radio-group>
            <div class="widget-span">
              <div class="title">
                栅格占据的列数：
              </div>
              <div v-for="(element, index) in widgetLayout.list" :key="index" class="span">
                <el-input-number v-model="element.span" size="mini" />
              </div>
              <div class="span-tips">
                设置左右区域的宽度，列数加起来总数为24
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <widget ref="widgetLayout" :data="widgetLayout" :select.sync="handlewidgetSelect" :basic="basic" />
    </el-main>
  </div>
</template>
<script>
import widget from './components/widget'
export default {
  components: {
    widget
  },
  props: {
    widgetLayout: {
      type: Object,
      default: () => {}
    },
    colSpan: {
      type: String,
      default: '两列'
    },
    select: {
      type: Object,
      default: () => {}
    },
    basic: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      col: this.colSpan,
      handlewidgetSelect: this.widgetSelect
    }
  },
  watch: {
    colSpan: {
      handler(val) {
        this.col = val
      }
    }
  },
  methods: {
    changeColSpan(val) {
      this.$emit('changeColSpan', val)
    }
  }
}
</script>
