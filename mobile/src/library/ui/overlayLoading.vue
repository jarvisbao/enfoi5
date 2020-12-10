<template>
  <div class="overlay-loading">
    <van-overlay :show="show" z-index="10000" style="background: rgba(255, 255, 255, 0);">
      <div class="van-toast">
        <van-loading color="#fff" />
        <div class="van-toast__text">
          {{ text }}
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  name: 'OverlayLoading',
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
