<template>
  <div class="app-container object-update">
    <div class="link-btn">
      <div>
        <span v-for="(item, index) in textList" v-if="item.show" :key="index" :class="{active: currentTab == item.label}" @click="toggleTab(item.label)">
          {{ item.name }}
        </span>
      </div>
    </div>
    <transition name="tab">
      <component :is="currentTab" :edit="edit" />
    </transition>
  </div>
</template>
<script>
import CommonTab from '../commonTab'
import basic from './pageDataUpdate'
import change_record from './components/change_record'

export default {
  components: {
    CommonTab,
    basic,
    change_record
  },
  props: {
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentTab: 'basic',
      currentName: null,
      visibleRefObj: false,
      textList: [
        {
          name: '基本要素',
          label: 'basic',
          show: true
        },
        {
          name: '变动记录',
          label: 'change_record',
          show: true
        }
      ],
      showRecord: false
    }
  },
  created() {
    this.get_name()
    if (sessionStorage.getItem('label')) {
      this.currentTab = sessionStorage.getItem('label')
    }
    this.get_enable_record()
  },
  methods: {
    get_name() {
      if ('name' in this.$route.query) {
        this.currentName = this.$route.query.name
        return this.currentName
      }
    },
    toggleTab(label) {
      this.currentTab = null
      this.$nextTick(() => {
        this.currentTab = label
        sessionStorage.setItem('label', label)
      })
    },
    get_enable_record() {
      this.showRecord = this.$route.query.record ? JSON.parse(this.$route.query.record) : false
      this.textList.forEach(item => {
        if (item.label === 'change_record') {
          item.show = this.showRecord
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$color: #dd6161;
.link-btn {
  margin-bottom: 20px;
  font-size: 0;
  border-bottom: 1px solid #e4e7ed;
  div {
    display: inline-block;
    border-radius: 5px 5px 0 0;
    border: 1px solid #ddd;
    border-bottom-width: 0;
    background: #fff;
    span {
      display: inline-block;
      padding: 10px 25px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      border-right: 1px solid #ddd;
      position: relative;
      top: 1px;
      &:last-of-type {
        border-right: none;
      }
      &:hover {
        color: $color;
      }
      &.active {
        color: $color;
        border-bottom: 1px solid #fff;
      }
    }
  }
}
.enfo-header-tips {
  background: #fff;
}
</style>
