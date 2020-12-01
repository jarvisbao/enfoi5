<template>
  <div>
    <el-form ref="form" :model="menu" :rules="rules" label-width="150px">
      <el-form-item label="菜单显示名称" prop="label">
        <el-input id="menuLabel" v-model="menu.label" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="menu_code">
        <el-input id="menuCode" v-model="menu.menu_code" />
      </el-form-item>
      <el-form-item label="路由" prop="uri">
        <el-input id="menuUri" v-model="menu.uri" />
        <div v-if="device === 'mobile'" class="tips">
          <p>1. 九宫格菜单展示， 路由为/grid</p>
          <p>2. 数据展示， 请填写以/data或/dataByCode为开头的带参数的完整链接</p>
          <p>3. 数据编辑， 请填写以/data/update为开头的带参数的完整链接</p>
        </div>
      </el-form-item>
      <el-form-item label="序号" prop="number">
        <el-input id="menuNum" v-model.number="menu.number" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <!-- <el-input v-model="menu.icon"/> -->
        <i v-if="showIcon" :class="menu.icon" class="menu-icon" />
        <span class="choose-icon" @click="chooseIcon">选择</span>
        <span v-if="showIcon" class="delete-icon" @click="deleteIcon">删除</span>
      </el-form-item>
      <el-form-item v-if="isDisabled" label="父菜单" prop="parent">
        <el-cascader
          ref="cascader"
          id="menuParent"
          v-model="parent"
          :show-all-levels="true"
          :props="prop"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item v-else label="父菜单" prop="parent">
        <el-input v-model="parent" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即添加
        </el-button>
        <el-button id="cancel" plain @click="resetForm('form')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" title="选择图标" width="60%" append-to-body>
      <div class="icon-box">
        <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
        <transition name="tab">
          <keep-alive>
            <component :is="currentTab" :icon="menu.icon" @show="isShow" @icon="icon($event)" />
          </keep-alive>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTab from '@/components/commonTab'
import { instance as Vue } from '@/life-cycle'
const EventBus = Vue.$Utils.EventBus
export default {
  components: {
    CommonTab
  },
  props: {
    isDisabled: {
      type: Boolean,
      required: true
    },
    parentMenu: {
      type: String,
      default: ''
    },
    device: {
      type: String,
      default: undefined
    },
    showType: {
      type: Number,
      default: 0
    }
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!Number.isInteger(value)) {
        callback(new Error('序号必须为数字值'))
      } else {
        callback()
      }
    }
    const _that = this
    return {
      menu: {
        menu_code: '',
        label: '',
        parent: null,
        uri: '',
        number: '',
        icon: null,
        addon: null
      },
      parent: this.parentMenu,
      // prop: { value: 'namespace', label: 'title', children: 'children' },
      prop: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.level === 0) {
            _that.$Apis.menu.menu_list(undefined, undefined, undefined, undefined, undefined, _that.device).then(response => {
              if (response.code === _that.$Utils.Constlib.ERROR_CODE_OK) {
                setTimeout(() => {
                  const nodes = response.payload.items
                    .map(item => ({
                      value: item.menu_code,
                      label: item.label,
                      menu_code: item.menu_code,
                      menu_id: item.menu_id
                    }))
                  resolve(nodes)
                }, 1000)
              } else {
                resolve([])
              }
            })
          }
          if (node.value) {
            _that.$Apis.menu.menu_list(node.data.menu_code, undefined, undefined, undefined, undefined, _that.device).then(response => {
              if (response.code === _that.$Utils.Constlib.ERROR_CODE_OK) {
                setTimeout(() => {
                  const nodes = response.payload.items
                    .map(item => ({
                      value: item.menu_code,
                      label: item.label,
                      menu_code: item.menu_code,
                      menu_id: item.menu_id
                    }))
                  resolve(nodes)
                }, 1000)
              } else {
                resolve([])
              }
            })
          }
        }
      },
      rules: {
        menu_code: { required: true, message: '请输入菜单代码', trigger: 'blur' },
        label: { required: true, message: '请输入菜单显示名称', trigger: 'blur' },
        number: { validator: checkNumber, trigger: 'blur' }
      },
      showIcon: false,
      loading: false,
      dialogVisible: false,
      currentTab: 'alifontIcon',
      textList: [
        {
          name: 'iconfont',
          label: 'alifontIcon'
        },
        {
          name: 'element',
          label: 'elementIcon'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var parent = null
          if ('menu_code' in this.$route.query) {
            parent = this.$route.query.menu_code
          } else {
            if (this.parent != null) {
              parent = this.parent[this.parent.length - 1]
            }
          }
          var menu_code = this.menu.menu_code
          var label = this.menu.label
          var uri = this.menu.uri
          var icon = this.menu.icon
          var number = this.menu.number
          this.loading = true
          const selected_menu_id = this.$refs.cascader.getCheckedNodes().length > 0 ? this.$refs.cascader.getCheckedNodes()[0].data.menu_id : null // 获取级联选择器选择值的menu_id

          this.$Apis.menu.menu_create(label, menu_code, uri, icon, number, parent, this.device).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  if (this.showType === 0) {
                    this.$emit('refresh')
                  } else {
                    EventBus.$emit('add-refresh', {
                      icon: icon,
                      label: label,
                      menu_id: response.payload,
                      menu_code: menu_code,
                      parent_id: selected_menu_id,
                      number: number,
                      uri: uri,
                      meta: {
                        icon: icon,
                        title: label
                      }
                    }) // 刷新树形数据
                  }
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          // this.$alert('error submit', '提示', {
          //   confirmButtonText: '确定'
          // })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    },
    chooseIcon() {
      this.dialogVisible = !this.dialogVisible
    },
    deleteIcon() {
      this.menu.icon = null
      this.showIcon = false
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    icon($event) {
      this.menu.icon = $event
      this.showIcon = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
