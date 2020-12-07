<template>
  <div class="main-container noMargin">
    <div v-if="showRecord" class="top-save" @click="handleRecord">
      {{ text }}
    </div>

    <keep-alive>
      <component :is="currentTab" :edit="edit" />
    </keep-alive>
  </div>
</template>
<script>
import basic from './pageDataUpdate'
import change_record from './components/change_record'

export default {
  components: {
    basic,
    change_record
  },
  props: {
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentTab: 'basic',
      showRecord: false,
      text: '变动记录'
    }
  },
  created() {
    this.showRecord = this.$route.query.record ? JSON.parse(this.$route.query.record) : false
  },
  mounted() {
    // 设置底部标签栏状态为 false
    this.$store.commit('SET_TABBAR', false)
  },
  destroyed() {
    this.$store.commit('SET_TABBAR', true)
  },
  methods: {
    handleRecord() {
      if (this.text === '变动记录') {
        this.currentTab = 'change_record'
        this.text = '基本要素'
      } else if (this.text === '基本要素') {
        this.currentTab = 'basic'
        this.text = '变动记录'
      }
    }
  }
}
</script>
