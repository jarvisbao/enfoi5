<template>
  <div class="widget-design">
    <el-form ref="form" :model="widget" :rules="rules" label-width="150px">
      <el-form-item label="标题" prop="wdgt_title">
        <el-input id="wdgtTitle" v-model="widget.wdgt_title" />
      </el-form-item>
      <el-form-item label="标题栏">
        <div class="title-property">
          <el-color-picker id="color" v-model="widget.wdgt_color" :predefine="predefineColors" size="medium" />
          <i v-if="widget.wdgt_icon" :class="widget.wdgt_icon" class="menu-icon" />
          <span class="choose-icon" @click="chooseIcon">选择图标</span>
          <span v-if="widget.wdgt_icon" class="delete-icon" @click="deleteIcon">删除</span>
        </div>
      </el-form-item>
      <el-form-item label="内容url" prop="content_url">
        <el-input id="contentUrl" v-model="widget.content_url" />
      </el-form-item>
      <el-form-item label="数据">
        <el-input id="contentProp" v-model="widget.content_prop" placeholder="response." />
      </el-form-item>
      <!-- <el-form-item label="适配APP内容url">
        <el-input v-model="widget.mob_content_url"/>
        <div class="tips">为了使配置的报表能够在APP上显示</div>
      </el-form-item> -->
      <el-form-item label="更多url" prop="more_url">
        <el-input id="moreUrl" v-model="widget.more_url" />
        <div class="tips">
          url地址以 http:// 或 / 开头
        </div>
      </el-form-item>
      <el-form-item label="描述">
        <el-input id="summary" v-model="widget.wdgt_summary" type="textarea" />
      </el-form-item>
      <el-form-item label="类型" prop="wdgt_type">
        <el-radio-group v-model="widget.wdgt_type" @change="wdgtTypeChange">
          <el-radio id="type0" label="条目式" />
          <el-radio id="type1" label="占比式" />
          <el-radio id="type2" label="嵌入式" />
          <el-radio id="type3" label="磁贴式" />
          <el-radio id="type4" label="图表"/>
        </el-radio-group>
      </el-form-item>
      <div class="type-title">
        <span>{{ widget.wdgt_type }}属性</span>
      </div>
      <template v-if="widget.wdgt_type==='条目式'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetList.border" size="medium">
            <el-radio id="lb0" label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio id="lb1" label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input id="listTitle" v-model="widgetList.title" />
              <div class="tips">
                条目标题所显示内容
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示个数">
              <el-input-number id="listNum" v-model="widgetList.shownumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-input id="listLabel" v-model="widgetList.label" />
              <div class="tips">
                条目标签所显示内容
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签名">
              <el-input id="sign" v-model="widgetList.sign" />
              <div class="tips">
                条目签名所显示内容
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="链接">
              <el-input id="link" v-model="widgetList.link" />
              <div class="tips">
                点击条目打开的链接
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="链接打开方式">
              <el-select id="openType" v-model="widgetList.linkopentype" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主键字段">
          <el-input id="listKey" v-model="widgetList.key" />
          <div class="tips">
            点击条目打开链接时，在链接后面添加主键字段的值作为参数
          </div>
        </el-form-item>
      </template>
      <template v-if="widget.wdgt_type==='占比式'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetPercent.border" size="medium">
            <el-radio id="pb0" label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio id="pb1" label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input id="pTitle" v-model="widgetPercent.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色">
              <el-color-picker id="pColor" v-model="widgetPercent.color" size="medium" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分母名称">
              <el-input id="denominator" v-model="widgetPercent.denominator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段">
              <el-input id="denField" v-model="widgetPercent.den_field" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分子名称">
              <el-input id="numerator" v-model="widgetPercent.numerator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段">
              <el-input id="numField" v-model="widgetPercent.num_field" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="widget.wdgt_type==='嵌入式'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetInset.border" size="medium">
            <el-radio id="ib0" label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio id="ib1" label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input id="describe" v-model="widgetInset.describe" type="textarea" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="窗口高度">
              <el-input-number id="height" v-model="widgetInset.height" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适应APP窗口高度">
              <el-input-number id="appHeight" v-model="widgetInset.app_height" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="widget.wdgt_type==='磁贴式'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="属性值1域">
              <el-input id="prop" v-model="widgetPaste.prop" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input id="pasteTitle" v-model="widgetPaste.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="属性值2域">
              <el-input id="prop2" v-model="widgetPaste.prop2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input id="pasteTitle2" v-model="widgetPaste.title2" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="widget.wdgt_type==='内联式'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetInline.border" size="medium">
            <el-radio id="ilb0" label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio id="ilb1" label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input id="desc" v-model="widgetInline.describe" type="textarea" />
        </el-form-item>
      </template>
      <template v-if="widget.wdgt_type==='图表'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetChart.border" size="medium">
            <el-radio label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图表类型">
          <el-radio-group v-model="widgetChart.prop" size="medium">
            <el-radio label="line">折线图</el-radio>
            <el-radio label="histogram">柱状图</el-radio>
            <el-radio label="pie">饼图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :class="{'is-error': errorMsg}" label="维度" required>
          <el-input v-model="widgetChart.dimension" @blur="handleBlur" />
          <div v-if="errorMsg" class="el-form-item__error">请输入维度</div>
          <div class="tips">数据的属性，必填且唯一，一般指显示在X轴上的数据</div>
        </el-form-item>
        <el-form-item label="指标">
          <div v-for="(item, index) in widgetChart.metrics" :key="index" class="charts-box">
            <div class="charts-box_prop">
              <el-input v-model="item.value" placeholder="显示值" />
              <el-input v-model="item.label" placeholder="别名" />
            </div>
            <i class="el-icon-circle-plus-outline" @click="addMetrics" />
            <i v-if="widgetChart.metrics.length > 1" class="el-icon-remove-outline" @click="removeMetrics(index)" />
          </div>
          <div class="tips">量化衡量标准</div>
        </el-form-item>
        <el-form-item label="实时监控">
          <div style="display: flex;">
            <el-checkbox v-model="widgetChart.timer" />
            <el-input v-model="widgetChart.interval" :disabled="!widgetChart.timer" placeholder="时间间隔,以毫秒为单位" style="margin-left: 15px;" />
          </div>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
          立即创建
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
            <component :is="currentTab" :icon="widget.wdgt_icon" @show="isShow" @icon="icon($event)" />
          </keep-alive>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WidgetCreate',
  components: {
    CommonTab: () => import('../commonTab')
  },
  data() {
    var validateUrl = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!/^(\/?https?:|\/)/.test(value)) {
        callback(new Error('url地址必须以 http:// 或 / 开头!'))
      } else {
        callback()
      }
    }
    return {
      widget: {
        wdgt_title: null,
        wdgt_color: null,
        wdgt_icon: null,
        app_code: null,
        content_url: null,
        content_prop: null,
        mob_content_url: null,
        more_url: null,
        wdgt_summary: null,
        wdgt_type: '条目式',
        content_config: null
      },
      rules: {
        wdgt_title: { required: true, message: '请输入标题', trigger: 'blur' },
        content_url: { required: true, message: '请输入内容url', trigger: 'blur' },
        wdgt_type: { required: true, message: '请选择类型', trigger: 'change' },
        more_url: { validator: validateUrl, trigger: 'blur' }
      },
      typeOptions: [
        {
          label: '在本页面打开',
          value: 0
        },
        {
          label: '在新页面打开',
          value: 1
        }
      ],
      widgetList: {
        border: 'obvious',
        title: null,
        shownumber: 10,
        label: null,
        sign: null,
        link: null,
        linkopentype: null,
        key: null,
        icon: {
          field: null,
          values: [
            {
              value: null,
              icon: ''
            }
          ]
        },
        color: {
          field: null,
          values: [
            {
              value: null,
              color: null
            }
          ]
        },
        filter: null
      },
      widgetPercent: {
        border: 'obvious',
        title: null,
        color: null,
        denominator: null,
        den_field: null,
        numerator: null,
        num_field: null
      },
      widgetInset: {
        border: 'obvious',
        describe: null,
        height: '',
        app_height: ''
      },
      widgetPaste: {
        prop: null,
        title: null,
        prop2: null,
        title2: null
      },
      widgetInline: {
        border: 'obvious',
        describe: null
      },
      widgetChart: {
        border: 'obvious',
        prop: null,
        dimension: null, // 维度，单个值
        metrics: [ // 指标
          {
            label: null,
            value: null
          }
        ],
        timer: false,
        interval: null
      },
      predefineColors: ['#FDA38E', '#4B8DF8', '#C25AEE', '#F77F54', '#58C437'],
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
      ],
      dialogVisibleIcon: false,
      index: 0,
      listIcon: '',
      dialogVisiblePie: false,
      dialogTitle: '',
      isCreate: false,
      errorMsg: false
    }
  },
  computed: {
    ...mapGetters([
      'openid'
    ])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.widget.wdgt_type === '图表' && !this.widgetChart.dimension) {
          this.errorMsg = true
          return false
        } else {
          this.errorMsg = false
        }
        if (valid) {
          switch (this.widget.wdgt_type) {
            case '条目式':
              this.widget.content_config = this.widgetList
              break
            case '占比式':
              this.widget.content_config = this.widgetPercent
              break
            case '嵌入式':
              this.widget.content_config = this.widgetInset
              break
            case '磁贴式':
              this.widget.content_config = this.widgetPaste
              break
            case '内联式':
              this.widget.content_config = this.widgetInline
              break
            case '图表':
              this.widget.content_config = this.widgetChart
          }
          const wdgt_title = this.widget.wdgt_title
          const wdgt_color = this.widget.wdgt_color
          const wdgt_icon = this.widget.wdgt_icon
          const wdgt_type = this.widget.wdgt_type
          const app_code = this.widget.app_code
          const content_url = this.widget.content_url
          const content_prop = this.widget.content_prop
          const content_config = JSON.stringify(this.widget.content_config)
          const more_url = this.widget.more_url
          const wdgt_summary = this.widget.wdgt_summary
          const mob_content_url = this.widget.mob_content_url
          this.loading = true
          this.$Apis.widget.widget_create(this.openid, wdgt_title, wdgt_color, wdgt_icon, wdgt_type, app_code, content_url, content_prop, content_config, more_url, wdgt_summary, mob_content_url).then(response => {
            this.loading = false
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
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
      // this.$refs[formName].resetFields()
      this.$router.go(-1)
    },
    chooseIcon() {
      this.index = ''
      this.dialogVisible = !this.dialogVisible
    },
    deleteIcon() {
      this.widget.wdgt_icon = null
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    icon($event) {
      this.widget.wdgt_icon = $event
    },
    wdgtTypeChange(val) {
      if (val === '磁贴式' && this.widget.wdgt_color === null) {
        this.widget.wdgt_color = '#4B8DF8'
      }
    },
    addMetrics() {
      this.widgetChart.metrics.push({
        label: null,
        value: null
      })
    },
    removeMetrics(index) {
      this.widgetChart.metrics.splice(index, 1)
    },
    handleBlur(event) {
      const _val = event.target.value
      if (!_val) {
        this.errorMsg = true
      } else {
        this.errorMsg = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.charts-box {
  display: flex;
  align-items: center;
  & + .charts-box {
    margin-top: 15px;
  }
  &_prop {
    display: flex;
    justify-content: space-between;
    flex: 1;
    margin-right: 15px;
    .el-input {
      width: 48%;
    }
  }
  i {
    font-size: 22px;
    color: #797979;
    cursor: pointer;
    margin-left: 5px;
    &:hover {
      color: #5cb6ff;
    }
  }
}
</style>
