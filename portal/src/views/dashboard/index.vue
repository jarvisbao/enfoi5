<template>
  <div class="widget-container">
    <el-container>
      <el-aside width="380px" class="widget-aside">
        <template v-if="showItems">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <draggable
              :list="widgetItem"
              v-bind="{ group: 'people', sort: false, ghostClass: 'ghost' }"
              tag="ul"
              class="widget-list"
            >
              <template v-for="(item, index) in widgetItem">
                <li v-if="item.content_config && JSON.parse(item.content_config).border" :id="'wdgt_' + item.wdgt_id" :key="index" :style="{borderColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}" :class="{hasColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}">
                  <div :style="{background: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:'', borderColor: JSON.parse(item.content_config).border==='obvious'?item.wdgt_color:''}" class="title">
                    <span><i v-if="item.wdgt_icon" :class="item.wdgt_icon" />{{ item.wdgt_title }}</span>
                    <div class="tools-bar">
                      <i v-if="updatePermission" :id="'edit'+item.wdgt_id" class="el-icon-edit" @click="updateWdgt(item.wdgt_id)" />
                      <i v-if="removePermission" :id="'remove'+item.wdgt_id" class="el-icon-delete" @click="removeWdgt(item.wdgt_id)" />
                    </div>
                  </div>
                  <div class="desc">
                    {{ item.wdgt_summary }}
                  </div>
                </li>
                <li v-else :id="'wdgt_' + item.wdgt_id" :key="index" :style="{borderColor: item.wdgt_color?item.wdgt_color:''}" :class="{hasColor: item.wdgt_color?item.wdgt_color:''}">
                  <div :style="{background: item.wdgt_color?item.wdgt_color:'', borderColor: item.wdgt_color?item.wdgt_color:''}" class="title">
                    <span><i v-if="item.wdgt_icon" :class="item.wdgt_icon" />{{ item.wdgt_title }}</span>
                    <div class="tools-bar">
                      <i v-if="updatePermission" :id="'edit'+item.wdgt_id" class="el-icon-edit" @click="updateWdgt(item.wdgt_id)" />
                      <i v-if="removePermission" :id="'remove'+item.wdgt_id" class="el-icon-delete" @click="removeWdgt(item.wdgt_id, item.wdgt_type)" />
                    </div>
                  </div>
                  <div class="desc">
                    {{ item.wdgt_summary }}
                  </div>
                </li>
              </template>
            </draggable>
          </el-scrollbar>
        </template>
      </el-aside>
      <el-container>
        <div style="width: 100%; position: relative;">
          <div class="action-btn">
            <el-button id="create" v-permission="['ns://create_wdget@identity.wdget']" type="primary" size="mini" @click="handlerAdd">
              新建
            </el-button>
            <el-button id="save" type="primary" plain size="mini" @click="handlerSave">
              保存
            </el-button>
            <el-button id="back" plain size="mini" @click="handlerBack">
              返回
            </el-button>
          </div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item in activeTabs" :key="item.name" :label="item.name" :name="item.name">
              <widget-content :col-span="colSpan" :widget-layout="handleWidget" :select="widgetSelect" :basic="widgetItem" @changeColSpan="changeColSpan($event)" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { widget_list, widget_remove } from '@/library/api/widget'
import { user_update } from '@/library/api/user'
import widgetContent from './widgetContent'
import checkPermission from '@/library/js/permission'
import { mapGetters } from 'vuex'

export default {
  components: {
    Draggable,
    widgetContent
  },
  data() {
    return {
      widgetList: [],
      basicComponents: [],
      widgetLayout: {
        item: [
        ],
        tool_config: []
      },
      widgetSelect: null,
      colSpan: '两列',
      // value: false,
      widgetItem: [],
      newWidgetItem: [],
      userinfo: {},
      wdgtIdArry: [],
      showItems: false,
      activeName: process.env.VUE_APP_NAME,
      activeTabs: [],
      handleWidget: {},
      updatePermission: false,
      removePermission: false
    }
  },
  computed: {
    ...mapGetters([
      'appconfig'
    ])
  },
  watch: {
    widgetLayout: {
      deep: true,
      handler: function(val) {
      }
    }
    // widgetList: {
    //   deep: true,
    //   handler(val) {
    //   }
    // }
  },
  created() {
    this.get_name()
    this.fetchData()
    this.updatePermission = checkPermission(['ns://update_wdget@identity.wdget'])
    this.removePermission = checkPermission(['ns://remove_wdget@identity.wdget'])
  },
  methods: {
    checkPermission,
    get_name() {
      if ('name' in this.$route.query) {
        this.activeName = this.$route.query.name
      }
    },
    initialData() {
      this.handleWidget.list.forEach(item => {
        item.list.forEach(item => {
          this.newWidgetItem.push(item)
        })
      })
      this.showItems = true
      this.widgetItem = [...this.basicComponents].filter(x => [...this.newWidgetItem].every(y => y.wdgt_id !== x.wdgt_id))
      if (this.handleWidget.list.length === 2) {
        this.colSpan = '两列'
      } else {
        this.colSpan = '三列'
      }
    },
    fetchData() {
      this.activeTabs = this.appconfig
      this.activeTabs.forEach(element => {
        this.widgetLayout.item.push({
          addon: element.name,
          list: [
            { span: 12,
              list: []
            },
            { span: 12,
              list: []
            }
          ]
        })
      })

      widget_list().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.widgetList = response.payload.items
          this.basicComponents = response.payload.items
          // 获取用户widget信息，并把wdgt_id暂存到wdgtIdArry数组中
          this.widgetList.forEach(item => {
            this.wdgtIdArry.push(item.wdgt_id)
          })
        }

        this.$store.dispatch('GetInfo').then(response => {
          this.userinfo = response.payload
          if (this.userinfo.widgets_json && this.userinfo.widgets_json !== null) {
            this.widgetLayout = JSON.parse(JSON.stringify(this.userinfo.widgets_json))
            // 根据wdgt_id获取具体的widget信息
            this.widgetLayout.item.forEach(element => {
              element.list.forEach(item => {
                item.list.forEach((subItem, index) => {
                  if (this.wdgtIdArry.indexOf(subItem.wdgt_id) === -1) {
                    item.list.splice(index, 1)
                  } else {
                    this.widgetList.forEach((wdgtItem) => {
                      if (subItem.wdgt_id === wdgtItem.wdgt_id) {
                        for (const k of Object.keys(wdgtItem)) {
                          this.$set(subItem, k, wdgtItem[k])
                        }
                      }
                    })
                  }
                })
              })
            })
          }
          this.handleObj()

          this.initialData()
        })
      })
    },
    handleObj() {
      this.widgetLayout.item.forEach(element => {
        if (element.addon === this.activeName) {
          this.handleWidget = element
        }
      })
      if (this.handleWidget.list.length > 0) {
        this.widgetSelect = this.handleWidget.list[0]
      }
    },
    changeColSpan($event) {
      if ($event === '三列') {
        this.handleWidget.list.push({
          span: 12,
          list: []
        })
        this.handleWidget.list.forEach(item => {
          item.span = 8
        })
      } else {
        var index = this.handleWidget.list.length - 1
        // 最后一列里的数据循环添加到左侧列表中
        this.handleWidget.list[index].list.forEach(item => {
          this.widgetItem.push(item)
        })
        this.handleWidget.list.splice(index, 1)
        this.handleWidget.list.forEach(item => {
          item.span = 12
        })
      }
    },
    handlerAdd() {
      this.$router.push({ name: 'widget_create' })
    },
    handlerSave() {
      let widgets_json = JSON.parse(JSON.stringify(this.widgetLayout))
      const allIds = []
      widgets_json.item.forEach(element => {
        element.list.forEach(item => {
          item.list.forEach(subItem => {
            const wdgt_id = subItem.wdgt_id
            allIds.push(wdgt_id)
            if (subItem.wdgt_id) {
              for (const k of Object.keys(subItem)) {
                this.$delete(subItem, k)
              }
            }
            this.$set(subItem, 'wdgt_id', wdgt_id)
          })
        })
      })
      const openid = this.userinfo.openid
      const gender = this.userinfo.gender
      const birthday = this.userinfo.birthday
      const last_name = this.userinfo.last_name
      const first_name = this.userinfo.first_name
      const props = this.userinfo.props
      const head_id = this.userinfo.head_id
      // 如果allIds为空数组，则说明主页为空
      if (JSON.stringify(allIds) === '[]') {
        widgets_json = null
      }
      user_update(openid, gender, birthday, last_name, first_name, props, head_id, widgets_json).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$alert('更新成功!', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.fetchData()
              // 返回到第一个选项卡，并重新获取左侧列表
              this.activeName = this.activeTabs[0].name
              this.widgetLayout.item.forEach(element => {
                if (element.addon === this.activeName) {
                  this.handleWidget = element
                }
              })
              this.newWidgetItem = []
              this.initialData()
            }
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    handlerBack() {
      this.$router.go(-1)
    },
    updateWdgt(wdgt_id) {
      this.$router.push({ name: 'widget_edit', query: { wdgt_id: wdgt_id }})
    },
    removeWdgt(wdgt_id, wdgt_type) {
      if (wdgt_type === '0' || wdgt_type === '1') {
        this.$confirm('系统定义的Widget不可删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).catch(() => {})
      } else {
        this.$confirm('确定要删除这个Widget吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          widget_remove(wdgt_id).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$router.go(0)
            } else {
              alert(response.message)
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }).catch(() => {
        })
      }
    },
    handleClick(tab) {
      this.widgetLayout.item.forEach(element => {
        if (element.addon === tab.name) {
          this.handleWidget = element
        }
      })
      this.newWidgetItem = []
      this.initialData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
