<template>
  <van-popup v-model="dialogCell" :overlay="false" position="right" :style="{ height: '100%', width: '100%', 'z-index': '10000' }">
    <van-sticky>
      <van-nav-bar @click-left="onClickLeft">
        <template #left>
          <van-icon name="cross" size="22px" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="list-box">
      <div class="list-item">
        <div class="list padding">
          <div v-for="(header, headerIndex) in headers" :key="headerIndex" class="item">
            <label>{{ header.label }}:</label>
            <div>
              <div v-if="header.data_format && ['image','file', 'html'].indexOf(header.data_format) != -1">
                <span class="dlink" v-html="items[header.prop]" />
              </div>
              <div v-else-if="convert && header.prop in design_select">
                {{ items[header.prop] | formatterFun(design_select[header.prop].values, design_select[header.prop].labels) }}
              </div>
              <div v-else>
                {{ items[header.prop] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  filters: {
    formatterFun: function(value, values, labels) {
      // if (!value) return value
      let result = value
      const isArray = Array.isArray(value)
      if (value) {
        if (isArray) {
          result = []
          value.forEach(element => {
            const index = values.indexOf(element)
            if (index !== -1) {
              result.push(labels[index])
            }
          })
          result = result.join(',')
        } else {
          const index = values.indexOf(value)
          if (index !== -1) {
            result = labels[index]
          }
        }
      }
      return result
    }
  },
  props: {
    dialogCell: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object,
      default: () => ({})
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    convert: {
      type: Boolean,
      default: true
    },
    design_select: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onClickLeft() {
      this.$emit('close_dialog_cell', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-box {
  max-height: calc(100vh - 46px);
  overflow-y: auto;
}
</style>
