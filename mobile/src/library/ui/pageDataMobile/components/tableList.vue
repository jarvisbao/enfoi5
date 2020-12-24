<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="operateData"
      >
        <van-checkbox-group ref="checkboxGroup" v-model="selectionData" class="list-box" @change="handleSelectionChange">
          <div v-for="(item, index) in items" :key="index" :class="{highlight: index === cellIndex}" class="list-item">
            <van-swipe-cell>
              <div class="list padding" @click="handleCheck(item, index)">
                <div ref="listFlex" class="list_flex">
                  <div v-show="isMultiple || mulBtn" class="mutil-btn">
                    <van-checkbox ref="selectMutil" :name="item" />
                  </div>
                  <div style="flex: 1">
                    <div v-longtap="{handler:long, item: item}" v-for="(header, headerIndex) in headers.slice(0, 2)" :key="headerIndex" class="item">
                      <label>{{ header.label }}:</label>
                      <div>
                        <div v-if="header.data_format && ['image','file', 'html'].indexOf(header.data_format) != -1">
                          <span class="dlink" v-html="item[header.prop]" />
                        </div>
                        <div v-else-if="convert && header.prop in design_select">
                          {{ item[header.prop] | formatterFun(design_select[header.prop].values, design_select[header.prop].labels) }}
                        </div>
                        <div v-else>
                          {{ item[header.prop] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <template #right>
                <div v-for="(btn, btnIndex) in item.buttons.slice(0, 2)" :key="btn.action" style="height: 100%; display:inline-block;">
                  <van-button :color="btnIndex == 1 ? '#e3a436' : '#1480fa'" square type="info" @click="btn.isMtd ? mtdCall(btn.fun, btn, item, index) : fnCall(btn.fun, item, index)">
                    {{ btn.name }}
                  </van-button>
                </div>
                <van-button v-if="item.buttons.length > 2" square color="#969594" text="更多" @click="handleMoreBtn(item, index)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-checkbox-group>
      </van-list>
    </van-pull-refresh>
    <cell-buttons
      :show-all-btn="showAllBtn"
      :cell-all-btns="cellAllBtns"
      :cell-index="cellIndex"
      @cellMtdCall="cellMtdCall"
      @cellFnCall="cellFnCall"
      @close_dialog_cell="closeDialogCell"
    />
    <cell-list
      :dialog-cell="dialogCell"
      :items="cellItem"
      :headers="headers"
      :convert="convert"
      :design_select="design_select"
      @close_dialog_cell="closeDialogCell"
    />
  </div>
</template>
<script>
import cellButtonsFun from '../mixin/cellButtonsFun'

export default {
  name: 'TableList',
  components: {
    cellList: () => import('./cellList'),
    cellButtons: () => import('./cellButtons')
  },
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
  mixins: [cellButtonsFun],
  props: {
    convert: {
      type: Boolean,
      default: true
    },
    isOuterObj: {
      type: Boolean,
      default: false
    },
    mulBtn: { // 显示会选按钮，用于外链子对象
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => ([])
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    headers_all: {
      type: Array,
      default: () => ([])
    },
    design_select: {
      type: Object,
      default: () => ({})
    },
    enable_record: {
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
    add_script: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      refreshing: false,
      finished: false,
      selectionData: [],
      update_headers: [],
      dialogCell: false,
      cellItem: {},
      showAllBtn: false,
      cellAllBtns: [],
      cellIndex: -1,
      ids: [],
      isAll: false,
      isMultiple: false
    }
  },
  beforeDestroy() {
    this.$Utils.EventBus.$off('select-all')
    this.$Utils.EventBus.$off('cancel-all')
    this.$Utils.EventBus.$off('isMultiple')
  },
  mounted() {
    this.$Utils.EventBus.$on('select-all', () => {
      this.selectAll()
    })
    this.$Utils.EventBus.$on('cancel-all', () => {
      this.cancelSelectAll()
    })
    this.$Utils.EventBus.$on('isMultiple', (val) => {
      this.isMultiple = val
    })
  },
  methods: {
    onRefresh() {
      // this.$emit('onRefresh')
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.pagination.page = 1
      this.loading = true
      // this.getData()
      this.operateData()
      this.selectionData = []
      this.$emit('checkDate', { selectionData: this.selectionData, ids: [], isAll: false })
    },
    operateData() {
      setTimeout(() => {
        if (this.refreshing) {
          // this.items = []
          // this.pagination.page = 1
          this.$parent.operateData()
          this.refreshing = false
        }
        this.$parent.getData()
      }, 1000)
    },
    long(event, data, vNode) {
      this.dialogCell = true
      this.cellItem = data
    },
    fnCall(fun, row, index) {
      this[fun](row, index, this.isOuterObj)
    },
    mtdCall(fun, item, row, index) {
      this[fun](item, row, index, this.isOuterObj)
    },
    cellMtdCall(args) {
      const fun = args.fun
      const item = args.item
      const row = args.row
      const index = args.index
      this[fun](item, row, index, this.isOuterObj)
      this.showAllBtn = false
      this.cellIndex = -1
    },
    cellFnCall(args) {
      const fun = args.fun
      const row = args.row
      const index = args.index
      this[fun](row, index, this.isOuterObj)
      this.showAllBtn = false
      this.cellIndex = -1
    },
    handleMoreBtn(item, index) {
      this.showAllBtn = true
      this.cellIndex = index
      this.cellAllBtns = [item]
    },
    selectAll() {
      this.$refs.checkboxGroup.toggleAll(true)
    },
    cancelSelectAll() {
      this.$refs.checkboxGroup.toggleAll(false)
    },
    handleSelectionChange(val) {
      this.selectionData = val
      this.ids = []
      const selectionLength = val.length
      // 判断是否选中当前页所有行
      if (selectionLength === this.items.length) {
        this.isAll = true
      } else {
        this.isAll = false
        val.forEach((item, index) => {
          var filter = []
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                filter.push(element['prop'] + '=="' + element['value'] + '"')
                this.ids.push(element['value'])
                return true
              }
            }
          })
        })
      }
      this.$emit('checkDate', { selectionData: this.selectionData, ids: this.ids, isAll: this.isAll })
    },
    handleCheck(item, index) {
      if (this.isMultiple) {
        this.$refs.selectMutil[index].toggle()
      }
    },
    closeDialogCell(arg) {
      if (arg) {
        this.dialogCell = false
      } else {
        this.showAllBtn = false
        this.cellAllBtns = []
        this.cellIndex = -1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.highlight {
  background: #fff;
  position: relative;
  z-index: 9999;
  ::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255,255,255,.0);
  }
}
</style>
