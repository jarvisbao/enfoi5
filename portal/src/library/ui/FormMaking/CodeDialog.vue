<template>
  <cus-dialog
    :visible="templateVisible"
    @on-close="templateVisible = false"
    ref="templateDialog"
    :width="width"
    form
    :title="title"
    @on-submit="handleSubmit"
  >
    <code-editor :height="codeHeight" :mode="mode" v-model="templ" />
  </cus-dialog>
</template>

<script>
import CusDialog from './CusDialog'
import CodeEditor from './CodeEditor'

export default {
  components: {
    CusDialog,
    CodeEditor
  },
  props: {
    mode: {
      type: String,
      default: 'xml'
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '900px'
    },
    codeHeight: {
      type: String,
      default: '460px'
    }
  },
  data() {
    return {
      templateVisible: false,
      templ: ''
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('on-confirm', this.templ)
    },

    open(val) {
      this.templ = val

      this.templateVisible = true
    },

    close() {
      this.templateVisible = false
    }
  }
}
</script>
