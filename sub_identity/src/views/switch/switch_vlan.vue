<template>
  <div class="app-container">
    <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
    <transition name="tab">
      <component :is="currentTab" />
    </transition>
  </div>
</template>
<script>
import CommonTab from '@/components/commonTab'
import switches from './components/switches'
import vlans from './components/vlans'

export default {
  components: {
    CommonTab,
    switches,
    vlans
  },
  data() {
    return {
      currentTab: 'switches',
      textList: [
        {
          name: 'switch',
          label: 'switches'
        },
        {
          name: 'vlan',
          label: 'vlans'
        }
      ]
    }
  },
  created() {
    if (sessionStorage.getItem('SwitchLabel')) {
      this.currentTab = sessionStorage.getItem('SwitchLabel')
    }
  },
  methods: {
    toggleTab($event) {
      sessionStorage.removeItem('SwitchLabel')
      this.currentTab = null
      this.$nextTick(() => {
        this.currentTab = $event
        sessionStorage.setItem('SwitchLabel', $event)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container /deep/ .el-cascader {
    width: 100%;
  }
</style>
