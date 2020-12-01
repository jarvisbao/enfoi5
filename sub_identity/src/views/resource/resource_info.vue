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
import subResource from './components/subResource'
import attributesList from './components/attributesList'
import actionsList from './components/actionsList'

export default {
  components: {
    CommonTitle,
    CommonTab,
    subResource,
    attributesList,
    actionsList
  },
  data() {
    return {
      currentTab: 'subResource',
      textList: [
        {
          name: '子资源',
          label: 'subResource'
        },
        {
          name: '属性',
          label: 'attributesList'
        },
        {
          name: '动作',
          label: 'actionsList'
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
