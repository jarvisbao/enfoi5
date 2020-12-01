<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <ul class="icon-list">
        <li v-for="(icon, index) in icons" :key="index" :class="{on: current === icon}" @click="get_class(icon)">
          <i :class="icon" /><span>{{ icon }}</span>
        </li>
      </ul>
    </el-scrollbar>
    <div style="margin: 10px 0 0 0;text-align: right;">
      <el-button type="danger" @click="submitForm()">
        确定
      </el-button>
      <el-button plain @click="resetForm">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ElementIcon',
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icons: [
        'el-icon-edit', 'el-icon-delete', 'el-icon-setting', 'el-icon-phone', 'el-icon-phone-outline', 'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on',
        'el-icon-star-off', 'el-icon-warning', 'el-icon-question', 'el-icon-info', 'el-icon-remove', 'el-icon-circle-plus', 'el-icon-success', 'el-icon-error',
        'el-icon-zoom-in', 'el-icon-zoom-out', 'el-icon-remove-outline', 'el-icon-circle-plus-outline', 'el-icon-circle-check', 'el-icon-circle-close', 'el-icon-minus',
        'el-icon-plus', 'el-icon-check', 'el-icon-close', 'el-icon-picture', 'el-icon-picture-outline', 'el-icon-upload', 'el-icon-upload2', 'el-icon-download',
        'el-icon-bell', 'el-icon-menu', 'el-icon-share', 'el-icon-d-caret', 'el-icon-caret-left', 'el-icon-caret-right', 'el-icon-caret-bottom', 'el-icon-caret-top',
        'el-icon-arrow-left', 'el-icon-arrow-right', 'el-icon-arrow-down', 'el-icon-arrow-up', 'el-icon-d-arrow-left', 'el-icon-d-arrow-right', 'el-icon-refresh',
        'el-icon-sort', 'el-icon-sort-up', 'el-icon-sort-down', 'el-icon-rank', 'el-icon-loading', 'el-icon-view', 'el-icon-date', 'el-icon-edit', 'el-icon-edit-outline',
        'el-icon-tickets', 'el-icon-document', 'el-icon-printer', 'el-icon-search', 'el-icon-sold-out', 'el-icon-news', 'el-icon-message', 'el-icon-time',
        'el-icon-location', 'el-icon-location-outline', 'el-icon-service', 'el-icon-mobile-phone', 'el-icon-s-goods', 'el-icon-goods', 'el-icon-s-help', 'el-icon-help',
        'el-icon-camera-solid', 'el-icon-camera', 'el-icon-video-camera', 'el-icon-message-solid', 'el-icon-s-cooperation', 'el-icon-s-order', 'el-icon-s-operation',
        'el-icon-s-promotion', 'el-icon-s-shop', 'el-icon-s-comment', 'el-icon-s-custom', 'el-icon-s-opportunity', 'el-icon-folder', 'el-icon-folder-opened', 'el-icon-folder-add',
        'el-icon-folder-remove', 'el-icon-document-copy', 'el-icon-printer', 'el-icon-paperclip', 'el-icon-monitor', 'el-icon-umbrella', 'el-icon-reading', 'el-icon-suitcase',
        'el-icon-suitcase-1', 'el-icon-collection', 'el-icon-office-building', 'el-icon-school', 'el-icon-table-lamp', 'el-icon-discount', 'el-icon-connection', 'el-icon-chat-dot-round',
        'el-icon-chat-dot-square', 'el-icon-odometer', 'el-icon-alarm-clock'
      ],
      current: this.icon
    }
  },
  methods: {
    get_class(icon) {
      this.current = icon
    },
    submitForm() {
      this.$emit('icon', this.current)
      this.resetForm()
    },
    resetForm() {
      this.$emit('show', false)
    }
  }
}
</script>
