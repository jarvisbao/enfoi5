<template>
  <div>
    <el-button type="text" @click="query" style="margin-right: 10px">
      查询
    </el-button>
    <el-dialog v-if="dialogSearch" :visible.sync="dialogSearch" title="查询" :close-on-click-modal="false" append-to-body style="text-align:left">
      <div v-if="items.length < 1">
        没有可参与查询的字段，请先到业务类中设置
      </div>
      <el-form v-else ref="form" :model="form" label-width="100px">
        <el-form-item v-for="item in items" :key="item.prop" :label="item.label">
          <div style="display: flex; justify-content: space-between;">
            <el-select id="operator" v-model="item.operator" clearable placeholder="请选择" style="width: 35%">
              <el-option
                v-for="opera in operators"
                :key="opera.label"
                :label="opera.label"
                :value="opera.operator"
              >
                <span style="float: left">{{ opera.label }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ opera.operator }}</span>
              </el-option>
            </el-select>
            <el-input v-model="item.queryValue" style="width: 60%;" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button id="submit" :loading="loading" type="danger" @click="handleSubmit">
            确定
          </el-button>
          <el-button id="cancel" plain @click="handleReset">
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'SetQuery',
  props: {
    object_id: {
      type: String,
      default: ''
    },
    page_id: {
      type: String,
      default: null
    },
    isBycode: {
      style: Boolean,
      default: false
    },
    proj_code: {
      type: String,
      default: null
    },
    object_code: {
      type: String,
      default: null
    },
    page_code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      items: [],
      form: {},
      operators: [
        {
          label: '等于',
          operator: '=='
        },
        {
          label: '不等于',
          operator: '!='
        },
        {
          label: '大于',
          operator: '>'
        },
        {
          label: '大于等于',
          operator: '>='
        },
        {
          label: '小于',
          operator: '<'
        },
        {
          label: '小于等于',
          operator: '<='
        },
        {
          label: '类似',
          operator: '.like'
        },
        {
          label: '区间',
          operator: '.in_'
        }
      ],
      loading: false,
      queryparam: [],
      dialogSearch: false
    }
  },
  created() {
  },
  methods: {
    fetchData() {
      if (!this.isBycode) {
        this.$Apis.object.get_headers(this.object_id, true, this.page_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.items = response.payload.filter(item => {
              return item.can_query
            })
            this.items.forEach(item => {
              this.$set(item, 'operator', null)
              this.$set(item, 'queryValue', null)
            })
          }
        })
      } else {
        this.$Apis.object.get_headers_by_code(this.proj_code, this.object_code, this.page_code, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.items = response.payload.filter(item => {
              return item.can_query
            })
            this.items.forEach(item => {
              this.$set(item, 'operator', null)
              this.$set(item, 'queryValue', null)
            })
          }
        })
      }
    },
    query() {
      this.dialogSearch = !this.dialogSearch
      this.fetchData()
    },
    handleSubmit() {
      this.queryparam = []
      this.items.forEach(item => {
        if (item.operator && item.queryValue) {
          let value = item.queryValue
          if (item.operator === '.in_' && value.indexOf(',') !== -1) {
            const arr = value.split(',')
            for (var i in arr) {
              arr[i] = "'" + arr[i] + "'"
            }
            value = '[' + arr.join(',') + ']'
          }
          if (item.operator === '.in_' || item.operator === '.like') {
            value = '(' + value + ')'
          }
          this.queryparam.push({ field: item.prop, operator: item.operator, value: value })
        }
      })
      this.$emit('getQueryData', this.queryparam)
    },
    handleReset() {
      this.dialogSearch = false
    }
  }
}
</script>
