<template>
  <div class="app-container">
    <common-title />
    <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
    <transition name="tab">
      <component :is="currentTab" />
    </transition>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import CommonTab from '@/components/commonTab'
import bizfield from './components/bizfield'
import bizdata from './components/bizdata'

export default {
  components: {
    CommonTitle,
    CommonTab,
    bizfield,
    bizdata
  },
  data() {
    return {
      currentTab: 'bizfield',
      textList: [
        {
          name: '字段',
          label: 'bizfield'
        },
        {
          name: '数据',
          label: 'bizdata'
        }
      ]
    }
  },
  created() {
    if (sessionStorage.getItem('label')) {
      this.currentTab = sessionStorage.getItem('label')
    }
  },
  methods: {
    toggleTab($event) {
      this.currentTab = null
      this.$nextTick(() => {
        this.currentTab = $event
        sessionStorage.setItem('label', $event)
      })
    }
  }
}
</script>

