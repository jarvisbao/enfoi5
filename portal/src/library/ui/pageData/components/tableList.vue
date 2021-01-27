<template>
  <div class="table-list">
    <el-table
      v-loading="loading"
      :data="items"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isMultiple || can_export"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in headers"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="expanTable.tableAutoWidth[index]"
        :show-overflow-tooltip="expanTable.isTabelOverflow"
      >
        <template slot-scope="scope">
          <div v-if="item.data_format && ['image','file', 'html'].indexOf(item.data_format) != -1">
            <span class="dlink" v-html="scope.row[scope.column.property]" />
          </div>
          <div v-else-if="convert && scope.column.property in design_select">
            {{ scope.row[scope.column.property] | formatterFun(design_select[scope.column.property].values, design_select[scope.column.property].labels) }}
          </div>
          <div v-else>
            {{ scope.row[scope.column.property] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          <div v-for="item in scope.row.buttons.slice(0, 3)" :key="item.action">
            <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)" style="cursor:pointer">
              <i v-if="item.icon" :class="item.icon" :title="item.name" />
              <span v-else>{{ item.name }}</span>
            </span>
          </div>
          <el-dropdown v-if="scope.row.buttons.length > 3" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in scope.row.buttons.slice(3)" :key="index">
                <span @click="item.isMtd ? mtdCall(item.fun, item, scope.row) : fnCall(item.fun, scope.row)" style="display:block">
                  <span v-if="item.icon"><i :class="item.icon" :title="item.name" /> {{ item.name }}</span>
                  <span v-else>{{ item.name }}</span>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import cellButtonsFun from '../mixin/cellButtonsFun'

export default {
  name: 'TableList',
  filters: {
    formatterFun: function (value, values, labels) {
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
    loading: {
      type: Boolean,
      default: false
    },
    convert: {
      type: Boolean,
      default: true
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    can_export: {
      type: Boolean,
      default: false
    },
    showColumn: {
      type: Boolean,
      default: false
    },
    isOuterObj: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: () => []
    },
    headers_all: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    design_select: {
      type: Object,
      default: () => ({})
    },
    object_id: {
      type: String,
      default: null
    },
    page_id: {
      type: String,
      default: null
    },
    enable_record: {
      type: Boolean,
      default: false
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
      isAll: false,
      update_headers: [],
      selectionData: [],
      ids: [],
      expanTable: { //表格展开相关数据
        tableTimerLock: null, // 防死循环锁，用于update周期
        is: false, // 是否展开表格
        isTabelOverflow: true, // 表格是否溢出隐藏
        tableAutoWidth: { // 表格各列的宽度
        }
      }
    }
  },
  watch: {
    'expanTable.is'(newVal) {
      this.tableColAutoWidth(newVal, () => {
        // 锁住且仅锁住下一个update周期，防止此方法导致的组件刷新事件触发下次update钩子中的此方法
        this.expanTable.tableTimerLock = true
        this.$nextTick(() => {
          this.expanTable.tableTimerLock = null
        })
      })
    }
  },
  updated() {
    // 设置页面刷新时自动重算列宽度
    if (!this.expanTable.tableTimerLock) { // 防死循环/重复执行锁
      this.expanTable.tableTimerLock = setTimeout(() => { //等待连续的未知个数的update周期执行结束
        this.tableColAutoWidth(this.expanTable.is, () => {
          // 锁住且仅锁住下一个update周期，防止此方法导致的组件刷新事件触发下次update钩子中的此方法
          this.$nextTick(() => {
            this.expanTable.tableTimerLock = null
          })
        })
      }, 500)
    }
  },
  methods: {
    fnCall(fun, row) {
      this[fun](row, this.isOuterObj) // 如果是外链子对象传 true
    },
    mtdCall(fun, item, row) {
      this[fun](item, row, this.isOuterObj) // 如果是外链子对象传 true
    },
    handleSelectionChange(val) {
      this.selectionData = val
      this.ids = []
      const selectionLength = val.length

      // 判断是否选中当前页所有行
      if (selectionLength === this.items.length) { // selectionLength === this.page_size || selectionLength === this.pagination.total
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
    /**
     * 自动计算列宽度
     * @method tableColAutoWidth
     * @param {Boolean} switchOption 对应switch展开按钮的值
     * @param {Function} callback 用于扩张的回调函数
     */
    tableColAutoWidth(switchOption, callback) {
      if (switchOption) {
        this.expanTable.isTabelOverflow = false
        const lastTabTd = $('.el-table__body .el-table__row')[0].lastElementChild
        var width = [], // 最终要输出的列宽值列表
          len = 0, // 均分剩余宽度的列的数量
          sum = 0, // 所有列宽之和（含checkbox列）
          tbTrs = $('.el-table__body-wrapper').find('.el-table__row'), // 表格体中的tr元素集合
          isThereCheckBox = false, // 定义是否有checkbox
          thTrs = $('.el-table__header .has-gutter').find('tr'), // 表头中的tr元集合
          total = this.$el.offsetWidth,
          /**
           * 获取每个td中文字的渲染宽度并写入width
           * @function getMaxWidth
           * @param {Array} trs 表格的行元素集合
           * @param {String} option 表示当前执行的是表头还是表格体的标识
           */
          getMaxWidth = (trs, option) => {
            var length // 每行参与循环的单元格数量

            trs = [...trs]
            trs.forEach((tr) => {
              const tds = [...tr.children]

              if (option == 'tbody') {
                len = tds.length - 2
                length = tds.length - 2
              } else {
                length = tds.length - 3
              }
              tds.forEach((elem, idx) => {
                if (idx > length) {
                  if (option == 'tbody' && lastTabTd) {
                    width[idx] = lastTabTd.offsetWidth
                  }
                } else if (!$(elem).find('.el-checkbox').length) {
                  var tempElem = document.createElement('div')

                  tempElem.innerHTML = `<span style="font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;white-space:nowrap;visibility:hidden;">${elem.firstChild ? elem.firstChild.innerText : ''}</span>`
                  document.body.appendChild(tempElem)
                  width[idx] = Math.max(tempElem.firstChild.offsetWidth + 22, width[idx] ? width[idx] : 0)
                  this.$nextTick(() => {
                    document.body.removeChild(tempElem)
                  })
                } else {
                  isThereCheckBox = true
                }
              })
            });
          }

        getMaxWidth(thTrs, 'thead')
        getMaxWidth(tbTrs, 'tbody')

        // 如果表格宽度大于所有列之和，则将剩余宽度均分到所有列（除checkbox那一列）
        sum = _.sum(width);
        if (sum < total) {
          width.forEach((item, ind) => {
            width[ind] += Math.floor((total - sum) / len)
          })
        }
        if (isThereCheckBox) { // 如果有checkbox则去掉列表中的首个元素
          width.shift()
        }
        this.expanTable.tableAutoWidth = width //输出结果

        callback()
      } else {
        this.expanTable.isTabelOverflow = true
        this.expanTable.tableAutoWidth = {}
      }
    },
    /**
     * 提供其它组件修改本组件中的expanTable的is属性的接口
     * @method setExpanTableIs
     * @param {Boolen} newVal 接受从其它组件传递而来的expanTable.is的值
     */
    setExpanTableIs(newVal) {
      if (newVal !== undefined) {
        this.expanTable.is = newVal
      }
      return this.expanTable.is
    }
  }
}
</script>
<style lang="scss" scoped>
.dlink /deep/ a {
  margin: 0 3px;
  color: #409eff;
}
[class*=' icon-'],
[class^='icon-'] {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.cell [class*=' icon-'],
.cell [class^='icon-'] {
  margin: 0 3px;
  font-size: 18px;
  cursor: pointer;
  color: #c5c5c5;
}
</style>
