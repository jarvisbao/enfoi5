<template>
  <div>
    <div class="app-container">
      <common-title />
      <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
      <transition name="tab">
        <component :is="currentTab" :device="device" />
      </transition>
    </div>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import CommonTab from '@/components/commonTab'
import subMenu from './components/subMenu'
import menuAssignments from './components/menuAssignments'

export default {
  props: {
    device: {
      type: String,
      default: undefined
    }
  },
  components: {
    CommonTitle,
    CommonTab,
    subMenu,
    menuAssignments
  },
  data() {
    return {
      currentTab: 'subMenu',
      textList: [
        {
          name: '子菜单',
          label: 'subMenu'
        },
        {
          name: '授权',
          label: 'menuAssignments'
        }
      ],
      items: []
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

