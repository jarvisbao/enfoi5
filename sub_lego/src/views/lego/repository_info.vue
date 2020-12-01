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
import repositoryClass from './class/repositoryClass'
import repositoryView from './view/repositoryView'

export default {
  components: {
    CommonTitle,
    CommonTab,
    repositoryClass,
    repositoryView
  },
  data() {
    return {
      currentTab: 'repositoryClass',
      textList: [
        {
          name: '数据类',
          label: 'repositoryClass'
        },
        {
          name: '视图',
          label: 'repositoryView'
        }
      ]
    }
  },
  created() {
    if (sessionStorage.getItem('repoLabel')) {
      this.currentTab = sessionStorage.getItem('repoLabel')
    }
  },
  methods: {
    toggleTab($event) {
      this.currentTab = null
      this.$nextTick(() => {
        this.currentTab = $event
        sessionStorage.setItem('repoLabel', $event)
      })
    }
  }
}
</script>

