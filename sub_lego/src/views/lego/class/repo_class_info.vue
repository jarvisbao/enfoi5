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
import Column from '../components/Column'
import Property from '../components/Property'
import classRelationship from '../class/classRelationship'
import data_list from '../components/data_list'

export default {
  components: {
    CommonTitle,
    CommonTab,
    Column,
    Property,
    classRelationship,
    data_list
  },
  data() {
    return {
      currentTab: 'Column',
      textList: [
        {
          name: '栏目',
          label: 'Column'
        },
        {
          name: '属性',
          label: 'Property'
        },
        {
          name: '关系',
          label: 'classRelationship'
        },
        {
          name: '数据',
          label: 'data_list'
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

