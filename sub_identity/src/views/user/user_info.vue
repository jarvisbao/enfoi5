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
import userinfo from './components/userinfo'
import myorgs from './components/myorgs'
import mygroups from './components/mygroups'
import myroles from './components/myroles'

export default {
  components: {
    CommonTitle,
    CommonTab,
    userinfo,
    myorgs,
    mygroups,
    myroles
  },
  data() {
    return {
      currentTab: 'userinfo',
      textList: [
        {
          name: '基本信息',
          label: 'userinfo'
        },
        {
          name: '机构',
          label: 'myorgs'
        },
        {
          name: '群组',
          label: 'mygroups'
        },
        {
          name: '角色',
          label: 'myroles'
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
<style lang="scss" scoped>
</style>
