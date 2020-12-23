<template>
  <van-sticky v-if="title">
    <van-nav-bar
      :title="title"
      @click-right="clickRight"
    >
      <template #left>
        <div v-if="isMultiple" @click="CancelMultiple" class="van-nav-bar__left">
          <div class="van-nav-bar__left" style="width: 80px">
            <span class="van-nav-bar__text">完成</span>
          </div>
        </div>
        <div v-else-if="isBack">
          <div class="van-nav-bar__left" style="width: 90px" @click="goBack">
            <van-icon name="arrow-left" class="van-nav-bar__arrow" />
            <span class="van-nav-bar__text">返回</span>
          </div>
        </div>
      </template>
      <template #right>
        <div style="position: relative; display: flex;">
          <van-icon name="more-o" size="20" />
          <div v-show="topRight" style="position: absolute; top: 27px; background: #eee; right: -50%; border-radius: 10px; width: 100px;" class="">
            <div v-show="!isMultiple" style="padding: 4px 10px;" @click="RightSelect">
              <label>选择</label>
            </div>
            <div v-show="isMultiple" style="padding: 4px 10px;" @click="RightSelectAll">
              <label>选择全部</label>
            </div>
            <div v-show="isMultiple" style="padding: 4px 10px;" @click="RightCancelSelectAll">
              <label>取消全选</label>
            </div>
          </div>
        </div>
      </template>
    </van-nav-bar>
  </van-sticky>
</template>
<script>
export default {
  name: 'PageNavBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    isBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      topRight: false,
      isMultiple: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    CancelMultiple() {
      this.topRight = false
      this.isMultiple = false
      this.$Utils.EventBus.$emit('isMultiple', false)
      this.RightCancelSelectAll()
    },
    clickRight() {
      this.topRight = !this.topRight
    },
    RightSelect() {
      this.isMultiple = true
      this.topRight = false
      this.$Utils.EventBus.$emit('isMultiple', true)
    },
    RightSelectAll() {
      this.$Utils.EventBus.$emit('select-all')
    },
    RightCancelSelectAll() {
      this.$Utils.EventBus.$emit('cancel-all')
    }
  }
}
</script>
