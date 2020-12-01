<template>
  <div class="widget-main">
    <div v-for="(element, index) in data.list" :key="index" class="widget-list">
      <generate-item v-for="(el) in element.list" :key="el.wdgt_id" :el="el" />
    </div>
    <!-- <el-row :gutter="30">
      <el-col v-for="(element, index) in data.list" :key="index" :span="element.span ? element.span : 0">
        <div class="grid-content">
          <generate-item v-for="(el) in element.list" :key="el.wdgt_id" :el="el" />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import generateItem from './generateItem'

export default {
  components: {
    generateItem
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
  }
}
</script>
