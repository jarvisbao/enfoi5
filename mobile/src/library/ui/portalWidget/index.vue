<template>
  <div class="portal-container">
    <template>
      <widget-generate :data="widgetLayout" />
    </template>
  </div>
</template>
<script>
import widgetGenerate from './components/widgetGenerate'

export default {
  name: 'PortalWidget',
  components: {
    widgetGenerate
  },
  data() {
    return {
      loading: false,
      widgetList: [],
      widgetLayout: {},
      addon: 'portal',
      wdgt_ids: [], // 用来判断当前模块是否设置了widget，为空则表示没有设置主页,
      wdgtIdArry: []
    }
  },
  created() {
    this.addon = 'portal'
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$Apis.widget.widget_list().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.widgetList = response.payload.items
          // 获取用户widget信息，并把wdgt_id暂存到wdgtIdArry数组中
          this.widgetList.forEach(item => {
            this.wdgtIdArry.push(item.wdgt_id)
          })

          this.$store.dispatch('GetInfo').then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              const widgetLayoutAll = response.payload.widgets_json
              if (widgetLayoutAll !== null) {
                widgetLayoutAll.item.forEach(element => {
                  if (element.addon === this.addon) {
                    this.widgetLayout = element
                    element.list.forEach(item => {
                      // 如果当前模块设置了widget，则把wdgt_id添加到wdgt_ids数组中
                      if (JSON.stringify(item.list) !== '[]') {
                        item.list.forEach(subItem => {
                          this.wdgt_ids.push(subItem.wdgt_id)
                        })
                      }
                    })
                  }
                })
                if (this.wdgt_ids.length >= 1) {
                  this.widgetLayout.list.forEach(element => {
                    [...element.list].forEach((item, index) => {
                      if (this.wdgtIdArry.indexOf(item.wdgt_id) === -1) {
                        element.list.splice(index, 1)
                      } else {
                        this.widgetList.forEach((wdgtItem) => {
                          if (item.wdgt_id === wdgtItem.wdgt_id) {
                            for (const k of Object.keys(wdgtItem)) {
                              this.$set(item, k, wdgtItem[k])
                            }
                          }
                        })
                      }
                    })
                  })
                  this.loading = false
                }
              }
            }
          })
        }
      })
    }
  }
}
</script>
