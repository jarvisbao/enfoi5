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
import roleOrgs from './components/roleOrgs'
import roleGroups from './components/roleGroups'
import roleUsers from './components/roleUsers'

export default {
  components: {
    CommonTitle,
    CommonTab,
    roleOrgs,
    roleGroups,
    roleUsers
  },
  data() {
    return {
      currentTab: 'roleOrgs',
      items: [],
      textList: [
        {
          name: '机构',
          label: 'roleOrgs'
        },
        {
          name: '群组',
          label: 'roleGroups'
        },
        {
          name: '用户',
          label: 'roleUsers'
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
    get_role_id() {
      if ('role_code' in this.$route.query) {
        var role_code = this.$route.query.role_code
        return role_code
      } else {
        return null
      }
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
<style lang="scss" scoped>
</style>
