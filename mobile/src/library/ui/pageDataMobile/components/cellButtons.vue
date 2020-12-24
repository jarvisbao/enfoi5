<template>
  <van-popup v-model="showAllBtn" :close-on-click-overlay="false" position="bottom" :overlay-style="{background: 'rgba(0, 0, 0, .4)'}" @click-overlay="clickOverlay">
    <div class="cell-more-btn">
      <div v-for="(item, index) in cellAllBtns" :key="index">
        <span v-for="btn in item.buttons" :key="btn.action" @click="btn.isMtd ? mtdCall(btn.fun, btn, item) : fnCall(btn.fun, item)">{{ btn.name }}</span>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  props: {
    showAllBtn: {
      type: Boolean,
      default: false
    },
    cellAllBtns: {
      type: Array,
      default: () => ([])
    },
    cellIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    mtdCall(fun, item, row) {
      this.$emit('cellMtdCall', { fun: fun, item: item, row: row, index: this.cellIndex })
    },
    fnCall(fun, row) {
      this.$emit('cellFnCall', { fun: fun, row: row, index: this.cellIndex })
    },
    clickOverlay() {
      this.$emit('close_dialog_cell', false)
    }
  }
}
</script>
