<template>
  <div class="main-container noMargin">
    <div v-if="showRecord" class="top-save" @click="handleRecord">
      {{ text }}
    </div>

    <transition name="tab">
      <component :is="currentTab" :edit="edit" />
    </transition>
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
