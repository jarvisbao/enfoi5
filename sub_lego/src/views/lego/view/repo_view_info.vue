<template>
  <div class="app-container">
    <common-title />
    <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
    <transition name="tab">
      <component :is="currentTab" :is_view="is_view" />
    </transition>
  </div>
</template>
<script>
import CommonTitle from '@/components/CommonTitle'
import CommonTab from '@/components/commonTab'
import viewSelect from '../view/viewSelect'
import Column from '../components/Column'
import Property from '../components/Property'
import data_list from '../components/data_list'
import classRelationship from '../class/classRelationship'

export default {
  components: {
    CommonTitle,
    CommonTab,
    viewSelect,
    Column,
    Property,
    data_list,
    classRelationship
  },
  props: {
    is_view: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentTab: 'viewSelect',
      textList: [
        {
          name: '查询语句',
          label: 'viewSelect'
        },
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

