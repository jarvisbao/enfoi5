<template>
  <el-scrollbar v-loading="loadingData" wrap-class="scrollbar-wrapper" class="infinite-list-wrapper">
    <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="10" class="user-list-card clearfix">
      <el-checkbox-group v-model="checkList" class="card-box" @change="handleCheckedChange">
        <div v-for="(item, index) in cardItems" :key="index" class="card-item">
          <el-checkbox :label="item.openid" />
          <div class="photo">
            <div class="img">
              <img :src="item.imageUrl">
            </div>
            <div class="btn-list">
              <i v-if="updatePermission && item._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-edit" @click="user_update(item)" />
              <i v-if="item._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-view" @click="user_info(item)" />
              <i v-if="removePermission && item._status === $Utils.Constlib.BaseStatusEnum.available" class="el-icon-delete" @click="user_delete(item)" />
              <span v-if="removePermission && item._status === $Utils.Constlib.BaseStatusEnum.deleted" class="assignments-btn" @click="active_user(item)">激活</span>
            </div>
          </div>
          <div class="card-info">
            <ul class="clearfix">
              <li v-for="(value, item, index) in item" v-if="item=='nickname'||item=='birthday'||item=='full_name'||item=='gender'" :key="index" :class="item">
                <label>{{ item | toChina }}:</label> <span>{{ value | sex_convert }}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <p v-if="loading" class="infinite-tips">
      加载中...
    </p>
    <p v-if="noMore" class="infinite-tips">
      没有更多了
    </p>
  </el-scrollbar>
</template>
<script>
export default {
  filters: {
    toChina(str) {
      if (str === 'nickname') {
        return '昵称'
      }
      if (str === 'gender') {
        return '性别'
      }
      if (str === 'birthday') {
        return '生日'
      }
      if (str === 'full_name') {
        return '姓名'
      }
    },
    sex_convert(str) {
      if (str === 'male') {
        return '男'
      } else if (str === 'female') {
        return '女'
      } else {
        return str
      }
    }
  },
  props: {
    openids: {
      type: Array,
      default() {
        return []
      }
    },
    updatePermission: {
      type: Boolean,
      default: false
    },
    removePermission: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default() {
        return {}
      }
    },
    page_size: {
      type: Number,
      default: 10
    },
    text: {
      type: String,
      default: ''
    },
    cardRefresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cardItems: [],
      checkList: this.openids,
      cardPagination: {
        total: 10,
        page: 1
      },
      pageCount: 0,
      loading: false,
      loadingData: false,
      status: 'all'
    }
  },
  computed: {
    noMore() {
      return this.cardPagination.page >= this.pageCount
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    cardRefresh: {
      handler(val) {
      }
    }
  },
  created() {
    this.pageCount = this.pagination.pages
    this.fetchData()
  },
  methods: {
    search() {
      this.cardItems = []
      this.loadingData = true
      this.loading = true
      // this.noMore = false
      this.cardPagination.page = 1
      this.get_datalist(this.cardPagination.page)
    },
    user_update(item) {
      this.$emit('user_update', item.openid)
    },
    user_info(item) {
      this.$emit('user_crad_info', [item.openid, item.full_name])
    },
    user_delete(item) {
      this.$emit('user_delete', item.openid)
    },
    handleCheckedChange(val) {
      this.$emit('user_card_deletes', this.checkList)
    },
    active_user(item) {
      this.$emit('active_user', item.openid)
    },
    fetchData() {
      // if (this.pagination.page > 1) {
      //   this.cardItems = []
      //   this.loadingData = true
      //   this.loading = true
      //   for (var i = 1; i <= this.pagination.page; i++) {
      //     this.get_datalist(i)
      //   }
      // }
      this.get_datalist(this.cardPagination.page)
    },
    get_datalist(page_index) {
      this.$Apis.user.user_list(this.text, true, page_index, 12, this.status).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          response.payload.items.forEach(item => {
            item.imageUrl = require('@/assets/images/user_default.png')
            if (item.head_id) {
              this.$Apis.attachment.download_attachment_by_id(item.head_id).then((response) => {
                if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                  item.imageUrl = response.payload.content
                }
              })
            }
          })
          this.pageCount = response.payload.pagination.pages
          this.cardItems = this.cardItems.concat(response.payload.items)
          this.loading = false
          this.loadingData = false
        }
      })
    },
    loadMore() {
      this.get_datalist(this.cardPagination.page)
    },
    load() {
      this.loading = true
      setTimeout(() => {
        this.cardPagination.page += 1
        this.loadMore()
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
.infinite-list-wrapper {
  height: calc(100vh - 250px);
  & /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.user-list-card {
  min-height: calc(100vh - 220px);
  .card-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .card-item {
    position: relative;
    display: flex;
    width: 32%;
    height: 137px;
    margin: 10px 1.3% 10px 0;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    overflow: hidden;
    .photo {
      position: relative;
      width: 140px;
      background: #fbfbfb;
      .img {
        width: 135px;
        height: 135px;
        border-radius: 3px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          margin: 0 auto;
        }
      }
    }
    .card-info {
      flex: 1;
      padding: 5px 10px 0;
      li {
        display: flex;
        padding: 7px 0;
        color: #666;
        font-size: 14px;
        &.first_name,
        &.last_name,
        &.openid,
        &.props,
        &.head_id,
        &.imageUrl {
          display: none;
        }
        label {
          display: block;
          min-width: 45px;
          margin-right: 8px;
        }
        span {
          display: block;
          overflow: hidden;
          max-height: 32px;
          word-break: break-all;
        }
      }
    }
    .btn-list {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 135px;
      height: 26px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 0 0 3px 3px;
      display: flex;
      align-items: center;
      line-height: 23px;
    }
    [class*=' el-icon-'],
    [class^='el-icon-'] {
      margin: 0 8px;
      font-size: 18px;
      cursor: pointer;
      color: #fff;
      &:hover {
        color: #f84c5d;
      }
    }
    .el-checkbox {
      position: absolute;
      right: 0;
      top: 5px;
      z-index: 999;
    }
  }
  & /deep/ .el-checkbox__label {
    font-size: 0;
  }
}
.infinite-tips {
  text-align: center;
}
</style>
