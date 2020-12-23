<template>
  <div class="top-buttons">
    <div v-for="(method, methodIndex) in newOtherMethods" :key="methodIndex">
      <span v-if="method.operate_type===1" id="plcl" @click="clickType1(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
      <span v-if="method.operate_type===2" id="plxg" @click="clickType2(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
      <span v-if="method.operate_type===6" id="plPost" @click="clickType6(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
      <span v-if="method.operate_type===7" id="plGet" @click="clickType7(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
      <span v-if="method.operate_type===8" id="clsCreate" @click="clickType8(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
      <span v-if="method.operate_type===9" id="fileUplod" @click="clickType9(method)">
        <i :class="[method.icon || 'icon-vehicles']" :style="{color: method.btn_color || '#409eff'}" />
        {{ method.operate_name }}
      </span>
    </div>
    <van-uploader ref="fileUplpad" :before-read="beforeRead" :after-read="afterRead" accept="*" style="display: none;" />
  </div>
</template>
<script>
import topBtnFun from '../mixin/topOtherMtdFun'

export default {
  name: 'TopOtherMethods',
  mixins: [topBtnFun],
  props: {
    isAll: {
      type: Boolean,
      default: false
    },
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    },
    headers_all: {
      type: Array,
      default: () => ([])
    },
    newOtherMethods: {
      type: Array,
      default: () => ([])
    },
    selectionData: {
      type: Array,
      default: () => ([])
    },
    ids: {
      type: Array,
      default: () => ([])
    },
    add_script: {
      type: Function,
      default: () => ([])
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.top-buttons {
  display: flex;
  padding: 0 !important;
  div {
    padding: 10px;
    i {
      display: block;
      height: 25px;
      margin-bottom: 3px;
      font-size: 22px;
    }
  }
}
</style>
