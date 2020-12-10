<template>
  <div class="app-container">
    <div class="header">
      <van-nav-bar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      >
        <template slot="right">
          <span @click="submit">确定</span>
        </template>
      </van-nav-bar>
    </div>
    <div class="list-box">
      <van-empty v-if="items.length < 1" description="没有更多了" />
      <van-list
        v-else
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-checkbox-group ref="checkboxGroup" v-model="mutilSelect">
          <div v-for="(item, index) in items" :key="index" class="list-item" @click="choose(item, index)">
            <div style="display: flex; padding: 10px 12px; align-items: center;">
              <van-checkbox ref="selectMutil" v-if="selectMultiple" :name="item" icon-size="16px" class="mutil-btn" />
              <div class="list">
                <div v-for="(sub, i) in headers" :key="i" class="item">
                  <label>{{ sub.label }}:</label>
                  <div>{{ item[sub.prop] }}</div>
                </div>
              </div>
              <van-icon v-if="!selectMultiple && singleSelect==item[option.value]" name="success" color="#ff5514" size="20" />
            </div>
          </div>
        </van-checkbox-group>
      </van-list>
    </div>
    <div v-if="selectMultiple" style="height: 50px;">
      <div class="check-all-box">
        <div :class="{'check-all': isCheckAll}" class="check-btn" @click="selectAll" />
        <div class="right-btn">
          <van-button type="primary" size="small" round @click="submit">确定</van-button>
        </div>
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
    title: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      filters: [],
      text: null,
      page_size: 10,
      pageIndex: 2,
      chooseItems: this.select2Items,
      singleSelect: null,
      mutilSelect: this.select2Items,
      isCheckAll: false
    }
  },
  watch: {
    select2Items: {
      handler(val) {
        this.mutilSelect = val
        this.chooseItems = val
        if (!this.selectMultiple) {
          if (val.length > 0) {
            this.singleSelect = val[0][this.option.value]
          } else {
            this.singleSelect = null
          }
        }
      }
    }
  },
  created() {
    if (!this.selectMultiple && this.select2Items.length > 0) {
      this.singleSelect = this.select2Items[0][this.option.value]
    }
  },
  methods: {
    onLoad() {
      if (this.pagination.page < this.pagination.pages) {
        this.loading = true
        this.$Apis.object.data_list_by_code(this.proj_code, this.object_code, this.page_code, this.text, this.pageIndex, this.page_size, true, this.filters, true).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            if (response.payload.items.length === 0) {
              this.finished = true
            }
            this.items = [...this.items, ...response.payload.items]
            if (this.pageIndex < this.pagination.pages) {
              this.pageIndex += 1
            }
            this.loading = false
          } else {
            this.finished = true
          }
        })
      }
      if (this.pageIndex >= this.pagination.pages) {
        this.finished = true
      }
    },
    onClickLeft() {
      this.$emit('isShow')
    },
    selectAll() {
      if (this.mutilSelect.length === this.items.length) {
        this.$refs.checkboxGroup.toggleAll(false)
        this.isCheckAll = false
      } else {
        this.$refs.checkboxGroup.toggleAll(true)
        this.isCheckAll = true
      }
    },
    choose(item, index) {
      if (this.selectMultiple) {
        this.$refs.selectMutil[index].toggle()
      } else {
        this.singleSelect = item[this.option.value]
        this.chooseItems = [item]
      }
    },
    submit() {
      if (this.selectMultiple) {
        this.chooseItems = this.mutilSelect
      }
      this.$emit('getChoose', this.chooseItems)
    },
    close() {
      this.$emit('isShow')
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: #fff;
}
.list-box {
  padding-top: 46px;
  max-height: calc(100vh - 46px);
  overflow-y: auto;
}
</style>
