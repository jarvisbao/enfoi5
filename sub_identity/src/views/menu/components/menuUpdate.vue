<template>
  <div>
    <el-form ref="form" :model="menu" :rules="rules" label-width="150px">
      <el-form-item label="菜单显示名称" prop="label">
        <el-input id="menuLabel" v-model="menu.label" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="menu_code">
        <el-input v-model="menu.menu_code" :disabled="true" />
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
        <!-- <el-input v-model="menu.icon"/> -->
        <i v-if="showIcon" :class="menu.icon" class="menu-icon" />
        <span class="choose-icon" @click="chooseIcon">选择</span>
        <span v-if="showIcon" class="delete-icon" @click="deleteIcon">删除</span>
      </el-form-item>
      <el-form-item v-if="device === 'mobile'" label="底部标签栏">
        <el-switch v-model="menu.tabbar" />
        <div class="tips">
          开启则显示在移动端底部标签栏中
        </div>
      </el-form-item>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即修改
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
    menu: {
      type: Object,
      default() {
        return {}
      }
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
    return {
      prop: { value: 'namespace', label: 'title', children: 'children' },
      rules: {
        menu_code: {
          required: true,
          message: '请输入菜单代码',
          trigger: 'blur'
        },
        label: {
          required: true,
          message: '请输入菜单显示名称',
          trigger: 'blur'
        },
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
    if (this.menu.icon) {
      this.showIcon = true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var menu_id = this.menu.menu_id
          var text = this.menu.label
          var url = this.menu.uri
          var icon = this.menu.icon
          var number = this.menu.number
          const tabbar = this.menu.tabbar ? this.menu.tabbar : false
          this.loading = true
          this.$Apis.menu.menu_updata(menu_id, text, url, number, icon, tabbar).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
                  if (this.showType === 0) {
                    this.$emit('refresh')
                  } else {
                    EventBus.$emit('refreshTree', menu_id) // 刷新树形数据
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
