<template>
  <div class="app-container">
    <div class="action-btn">
      <div class="right-btn" style="display: flex; justify-content: flex-end;">
        <set-query
          ref="setQuery"
          :proj_code="proj_code"
          :object_code="object_code"
          :page_code="page_code"
          :is-bycode="true"
          @getQueryData="getQueryData"
        />
        <el-input id="search" v-model="text" prefix-icon="el-icon-search" placeholder="请输入内容" class="search-input" @keyup.enter.native="schfilter" />
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="datas"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selectMultiple"
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in headers"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="item.data_format && ['image','file', 'html'].indexOf(item.data_format) != -1">
            <span class="dlink" v-html="scope.row[scope.column.property]" />
          </div>
          <div v-else>
            {{ scope.row[scope.column.property] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!selectMultiple" fixed="right" align="right">
        <template slot-scope="scope">
          <el-button type="text" @click="choose(scope.row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="page_size"
      :layout="layout"
      :total="pagination.total"
      :current-page="pagination.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="footer">
      <div class="choose-msg">
        当前选择：
        <span v-for="(item, index) in chooseItems" :key="index">{{ item.label }}</span>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="submit">
          确定
        </el-button>
        <el-button @click="close">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: {
    selectMultiple: {
      type: Boolean,
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
    },
    option: {
      type: Object,
      default: () => {}
    },
    select2Items: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      datas: [],
      pageSize: 10,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      layout: 'sizes, prev, pager, next',
      chooseItems: this.select2Items
    }
  },
  watch: {
    select2Items: {
      handler(val) {
        this.chooseItems = val
      }
    }
  },
  mounted() {
    this.datas = this.items
  },
  methods: {
    operateData() {
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, this.filters, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.datas = response.payload.items
          this.pagination = response.payload.pagination
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    handleSelectionChange(val) {
      this.chooseItems = []
      val.forEach(item => {
        this.chooseItems.push({
          label: item[this.option.label],
          value: item[this.option.value]
        })
      })
    },
    choose(row) {
      // 单选
      this.chooseItems = [
        {
          label: row[this.option.label],
          value: row[this.option.value]
        }
      ]
    },
    submit() {
      this.$emit('getChoose', this.chooseItems)
    },
    close() {
      this.$emit('isShow')
    },
    getQueryData(params) {
      const queryparam = []
      params.forEach(item => {
        queryparam.push(Object.values(item).join(''))
      })
      this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pagination.page, this.page_size, true, queryparam, true).then(response => {
        this.loading = true
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.datas = response.payload.items
          this.pagination = response.payload.pagination
          this.loading = false
          this.$refs.setQuery.handleReset()
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
  .footer {
    display: flex;
    margin-top: 25px;
    .choose-msg {
      flex: 1;
      span + span::before {
        content: ',';
        margin-left: 2px;
        margin-right: 5px;
      }
    }
  }
}
</style>
