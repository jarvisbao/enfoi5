<template>
  <div class="top-buttons">
    <template v-for="(item, index) in newOtherMethods">
      <div :key="index" class="btn operate-btn">
        <span v-if="item.operate_type===1" id="plcl" @click="clickType1(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===2" id="plxg" @click="clickType2(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===6" id="plPost" @click="clickType6(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===7" id="plGet" @click="clickType7(item)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===8" id="clsCreate" @click="clickType8(item, isOuterObj)">{{ item.operate_name }}</span>
        <span v-if="item.operate_type===9" id="fileUpload" @click="clickType9(item)">{{ item.operate_name }}</span>
      </div>
    </template>
    <el-upload
      ref="fileUpload"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="changeUpload"
      action=""
      style="display: none"
    />
  </div>
</template>
<script>
import topBtnFun from '../mixin/topOtherMtdFun'

export default {
  name: 'topOtherMethods',
  mixins: [topBtnFun],
  props: {
    isOuterObj: {
      type: Boolean,
      default: false
    },
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
    ids: {
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
    headers_all: {
      type: Array,
      default: () => ([])
    },
    set_session: {
      type: Function,
      default: null
    },
    add_script: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      flag: true // 防止重复点击
    }
  }
}
</script>
<style lang="scss" scoped>
.operate-btn {
  padding: 0 !important;
  span {
    display: block;
    padding: 8px 22px;
  }
}
</style>
