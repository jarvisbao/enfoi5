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
import subOrgs from './components/subOrgs'
import orgGroups from './components/orgGroups'
import orgMembers from './components/orgMembers'
import orgRoles from './components/orgRoles'
import orgPositions from './components/orgPositions'

export default {
  components: {
    CommonTitle,
    CommonTab,
    subOrgs,
    orgGroups,
    orgMembers,
    orgRoles,
    orgPositions
  },
  data() {
    return {
      currentTab: 'subOrgs',
      textList: [
        {
          name: '子机构',
          label: 'subOrgs'
        },
        {
          name: '群组',
          label: 'orgGroups'
        },
        {
          name: '人员',
          label: 'orgMembers'
        },
        {
          name: '角色',
          label: 'orgRoles'
        },
        {
          name: '组织机构职位',
          label: 'orgPositions'
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
