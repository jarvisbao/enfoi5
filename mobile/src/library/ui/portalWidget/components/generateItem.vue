<template>
  <div>
    <div v-if="element.wdgt_type==='磁贴式'" :id="'wdgt_' + element.wdgt_id" class="widget-item wdgt-paste">
      <div class="content">
        <template v-for="(item, index) in element.contentUrlData">
          <div :key="index" class="paste-con">
            <div>
              {{ JSON.parse(element.content_config).title }}：{{ item[JSON.parse(element.content_config).prop] }}
            </div>
            <div>
              {{ JSON.parse(element.content_config).title2 }}：{{ item[JSON.parse(element.content_config).prop2] }}
            </div>
          </div>
        </template>
        <i v-if="element.wdgt_icon" :class="element.wdgt_icon" />
      </div>
      <!-- <div v-if="element.more_url" class="more-link">
        <app-link :id="'more'+element.wdgt_id" :to="element.more_url">
          查看更多<i class="el-icon-d-arrow-right" />
        </app-link>
      </div> -->
    </div>
    <div v-else-if="element.wdgt_type==='条目式'||element.wdgt_type==='占比式'" :id="'wdgt_' + element.wdgt_id" class="widget-item">
      <div class="title-bar">
        <div class="name">
          {{ element.wdgt_title }}
        </div>
        <!-- <div class="tools">
          <van-icon name="replay" />
          <i v-if="element.wdgt_type==='条目式'||element.wdgt_type==='占比式'" :id="'refresh'+element.wdgt_id" class="el-icon-refresh" @click="handleRefresh(element.wdgt_id)" />
          <app-link v-if="element.more_url" :id="'more'+element.wdgt_id" :to="element.more_url">
            <i class="icon-gengduo" />
          </app-link>
        </div> -->
      </div>
      <div class="content">
        <template v-if="element.wdgt_type==='条目式'">
          <van-loading v-if="loading" color="#1989fa" style="text-align: center;" />
          <div class="wdgt-list">
            <van-cell v-for="(item, index) in element.contentUrlData" :key="index" :url="item.mtd_link" is-link class="title-elli">
              <template #title>
                <div class="title">
                  {{ item[JSON.parse(element.content_config).title] }}
                </div>
                <div class="tips">
                  <span>{{ item[JSON.parse(element.content_config).label] }}</span>
                  <span class="border-left">{{ item[JSON.parse(element.content_config).sign] }}</span>
                </div>
              </template>
            </van-cell>
          </div>
        </template>
        <template v-if="element.wdgt_type==='占比式'">
          <van-loading v-if="loading" color="#1989fa" style="text-align: center;" />
          <template v-for="(item, index) in element.contentUrlData">
            <div :key="index" class="wdgt-percent">
              <div>
                <van-circle
                  :model="parseInt((item[JSON.parse(element.content_config).num_field]/item[JSON.parse(element.content_config).den_field])*100)"
                  :rate="parseInt((item[JSON.parse(element.content_config).num_field]/item[JSON.parse(element.content_config).den_field])*100)"
                  :text="parseInt((item[JSON.parse(element.content_config).num_field]/item[JSON.parse(element.content_config).den_field])*100)"
                  size="70px"
                  layer-color="#ebedf0"
                />
              </div>
              <div class="percent-con">
                <div>{{ JSON.parse(element.content_config).numerator }}： {{ item[JSON.parse(element.content_config).num_field] }}</div>
                <div>{{ JSON.parse(element.content_config).denominator }}： {{ item[JSON.parse(element.content_config).den_field] }}</div>
              </div>
            </div>
          </template>
        </template>
        <!-- <template v-if="element.wdgt_type==='嵌入式'">
          <div class="wdgt_inset">
            <iframe :height="JSON.parse(element.content_config).height" :src="element.content_url" frameborder="0" width="100%" />
          </div>
        </template> -->
      </div>
    </div>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" title="添加常用工具" width="45%" append-to-body>
      <add-tool :data="toolList" @show="isShow($event)" />
    </el-dialog>
  </div>
</template>
<script>
import addTool from './addTool'

export default {
  components: {
    addTool
  },
  props: {
    el: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      element: this.el,
      shownumber: 10,
      dialogVisible: false,
      wdgtElement: {},
      lastMenu: [],
      wdgtItems: [],
      loading: false,
      toolList: []
    }
  },
  computed: {
    contentUrlData() {
      return this.fetchData()
    }
  },
  created() {
    this.fetchData()
    if (this.element.wdgt_type === '1') {
      this.$Apis.widget.get_menuaccess().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.lastMenu = response.payload
        }
      })
    }
    if (this.element.wdgt_type === '0') {
      this.$store.dispatch('GetInfo').then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.userinfo = response.payload
          this.toolList = this.userinfo.widgets_json.tool_config
        }
      })
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      if (this.element.content_url) {
        this.$set(this.element, 'contentUrlData', [])
        if (this.element.wdgt_type === '条目式') {
          const content_config = JSON.parse(this.element.content_config)
          if (!content_config.shownumber) {
            this.shownumber = 10
          } else {
            this.shownumber = content_config.shownumber
          }
          this.$Utils.request.get(this.element.content_url + '?page=on&page_index=1&page_size=' + this.shownumber).then(response => {
            if (this.element.content_prop) {
              const data = eval(this.element.content_prop)
              if (Array.isArray(data)) {
                this.element.contentUrlData = data
              } else {
                this.element.contentUrlData.push(data)
              }
              const mainkey = content_config.key ? content_config.key.replace(/\s/g, '').split('||') : []
              this.element.contentUrlData.forEach(item => {
                const _result = []
                mainkey.forEach(m => {
                  _result.push(m + '=' + item[m])
                  this.$set(item, 'mtd_link', content_config.link.split('?')[0] + '?' + _result.join('&'))
                })
              })
            }
            this.loading = false
          })
        }
        if (this.element.wdgt_type === '占比式' || this.element.wdgt_type === '磁贴式') {
          this.$Utils.request.get(this.element.content_url).then(response => {
            if (this.element.content_prop) {
              const data = eval(this.element.content_prop)
              if (Array.isArray(data)) {
                this.element.contentUrlData = data
              } else {
                this.element.contentUrlData.push(data)
              }
              this.loading = false
            }
          })
        }
      }
    },
    addTool() {
      this.dialogVisible = !this.dialogVisible
    },
    isShow($event) {
      this.toolList = $event
      this.dialogVisible = !this.dialogVisible
    },
    handleRefresh(wdgt_id) {
      this.loading = true
      if (this.element.wdgt_type === '条目式') {
        if (!JSON.parse(this.element.content_config).shownumber) {
          this.shownumber = 10
        } else {
          this.shownumber = JSON.parse(this.element.content_config).shownumber
        }
        this.$Utils.request.get(this.element.content_url + '?page=on&page_index=1&page_size=' + this.shownumber).then(response => {
          if (this.element.content_prop) {
            const data = eval(this.element.content_prop)
            if (Array.isArray(data)) {
              this.element.contentUrlData = data
            } else {
              this.element.contentUrlData = []
              this.element.contentUrlData.push(data)
            }
            this.loading = false
          }
        })
      }
      if (this.element.wdgt_type === '占比式') {
        this.$Utils.request.get(this.element.content_url).then(response => {
          if (this.element.content_prop) {
            const data = eval(this.element.content_prop)
            if (Array.isArray(data)) {
              this.element.contentUrlData = data
            } else {
              this.element.contentUrlData = []
              this.element.contentUrlData.push(data)
            }
            this.loading = false
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.widget-item {
  padding-bottom: 0;
}
</style>
