<template>
  <div class="overlay-loading">
    <van-overlay :show="show" z-index="10000" style="background: rgba(255, 255, 255, 0);">
      <div class="van-toast">
        <van-loading color="#fff" />
        <div class="van-toast__text">
          <!-- 处理中... -->
          {{ text }}
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    }
  }
}
</script>
