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
import bizclass from './bizclass'
import object_list from '@/views/object/object_list'

export default {
  components: {
    CommonTab,
    bizclass,
    object_list
  },
  data() {
    return {
      currentTab: 'bizclass',
      textList: [
        {
          name: '业务类',
          label: 'bizclass'
        },
        {
          name: '业务对象',
          label: 'object_list'
        }
      ]
    }
  },
  created() {
    if (sessionStorage.getItem('bizLabel')) {
      this.currentTab = sessionStorage.getItem('bizLabel')
    }
  },
  methods: {
    toggleTab($event) {
      sessionStorage.removeItem(this.$route.name)
      this.currentTab = null
      this.$nextTick(() => {
        this.currentTab = $event
        sessionStorage.setItem('bizLabel', $event)
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
