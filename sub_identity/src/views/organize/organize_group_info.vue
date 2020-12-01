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
import orgGroupMembers from './components/orgGroupMembers'
import orgGroupRoles from './components/orgGroupRoles'

export default {
  components: {
    CommonTitle,
    CommonTab,
    orgGroupMembers,
    orgGroupRoles
  },
  data() {
    return {
      currentTab: 'orgGroupMembers',
      items: [],
      textList: [
        {
          name: '成员',
          label: 'orgGroupMembers'
        },
        {
          name: '角色',
          label: 'orgGroupRoles'
        }
      ]
    }
  },
  created() {
    this.fetchData()
    if (sessionStorage.getItem('label')) {
      this.currentTab = sessionStorage.getItem('label')
    }
  },
  methods: {
    get_org_id() {
      if ('org_code' in this.$route.query) {
        var org_code = this.$route.query.org_code
        return org_code
      } else {
        return null
      }
    },
    get_name() {
      if ('group_name' in this.$route.query) {
        this.groupName = this.$route.query.group_name
        return this.groupName
      } else {
        return null
      }
    },
    fetchData() {
      this.get_org_name()
      this.get_name()
    },
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
