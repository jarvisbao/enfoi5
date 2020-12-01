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
import groupAdmin from './components/groupAdmin'
import groupMembers from './components/groupMembers'
import groupRoles from './components/groupRoles'

export default {
  components: {
    CommonTitle,
    CommonTab,
    groupAdmin,
    groupMembers,
    groupRoles
  },
  data() {
    return {
      currentTab: 'groupAdmin',
      textList: [
        {
          name: '管理员',
          label: 'groupAdmin'
        },
        {
          name: '成员',
          label: 'groupMembers'
        },
        {
          name: '角色',
          label: 'groupRoles'
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
