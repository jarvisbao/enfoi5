<template>
  <div class="app-container widget-container">
    <el-form ref="form" :model="widget" :rules="rules" label-width="150px">
      <el-form-item label="标题" prop="wdgt_title">
        <el-input id="wdgtTitle" v-model="widget.wdgt_title" />
      </el-form-item>
      <el-form-item label="标题栏">
        <div class="title-property">
          <el-color-picker id="color" v-model="widget.wdgt_color" :predefine="predefineColors" size="medium" />
          <i v-if="showIcon" :class="widget.wdgt_icon" class="menu-icon" />
          <span class="choose-icon" @click="chooseIcon">选择图标</span>
          <span v-if="showIcon" class="delete-icon" @click="deleteIcon">删除</span>
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
          <!-- <el-radio label="内联式"/>
          <el-radio label="饼图"/>
          <el-radio label="折线或柱形图"/> -->
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
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="图标">
              <el-input v-model="widgetList.icon.field" placeholder="判定字段"/>

              <el-row v-for="(item, index) in widgetList.icon.values" :key="index" style="margin-top: 5px;">
                <el-col :span="21" class="wdgt-row">
                  <el-input v-model="item.value" placeholder="值"/>
                  <i :class="item.icon" class="menu-icon"/>
                  <span class="choose-icon" @click="chooseWdgtListIcon(index)">选择图标</span>
                  <span class="delete-icon" @click="deleteWdgtListIcon(index)">删除</span>
                </el-col>
                <el-col :span="2" :offset="1" class="wdgt-row-icon">
                  <i class="el-icon-circle-plus-outline add-icon" @click="addIcon"/>
                  <span v-if="index>=1" @click="removeIcon(item)"><i class="el-icon-remove-outline"/></span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色">
              <el-input v-model="widgetList.color.field" placeholder="判定字段"/>
              <el-row v-for="(item, index) in widgetList.color.values" :key="index" style="margin-top: 5px;">
                <el-col :span="21" class="wdgt-row">
                  <el-input v-model="item.value" placeholder="值"/>
                  <el-color-picker v-model="item.color"/>
                </el-col>
                <el-col :span="2" :offset="1" class="wdgt-row-icon">
                  <i class="el-icon-circle-plus-outline add-icon" @click="addColor"/>
                  <span v-if="index>=1" @click="removeColor(item)"><i class="el-icon-remove-outline"/></span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-form-item label="条件表达式">
          <el-input v-model="widgetList.filter"/>
          <div class="tips">JavaScript表达式，使用item['属性名']引用属性值，可使用变量：login_user_code(当前登录用户编号)、login_user_name(当前登录用户名)、login_full_name(当前登录用户姓名)</div>
        </el-form-item> -->
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
      <template v-if="widget.wdgt_type==='饼图'">
        <el-form-item label="边框与标题栏">
          <el-radio-group v-model="widgetPie.border" size="medium">
            <el-radio label="obvious">
              明显的标题栏和边框
            </el-radio>
            <el-radio label="obscure">
              不明显的标题栏
            </el-radio>
            <!-- <el-radio label="none">无边框和标题栏</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="饼数据和选项">
          <el-button size="small" @click="addData">
            添加
          </el-button>
          <el-table
            v-loading="loading"
            :data="widgetPie.items"
            tooltip-effect="dark"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="pie_prop"
              label="取值域"
              width="220"
            />
            <el-table-column
              prop="pie_series"
              label="系列字段"
              width="220"
            />
            <el-table-column
              prop="pie_value"
              label="值字段"
            />
            <el-table-column
              prop="pie_mode"
              label="显示图例"
            />
            <el-table-column
              prop="pie_num"
              label="显示数值"
            >
              <template slot-scope="scope">
                {{ scope.row.pie_num }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pie_percent"
              label="显示比例"
            >
              <template slot-scope="scope">
                {{ scope.row.pie_num }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pie_back"
              label="显示背影"
            >
              <template slot-scope="scope">
                {{ scope.row.pie_num }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pie_type"
              label="饼图类型"
            />
            <el-table-column
              align="left"
            >
              <template slot-scope="scope">
                <i class="el-icon-edit" @click="update(scope.row)" />
                <i class="el-icon-delete" @click="remove(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="widgetPie.describe" type="textarea" />
        </el-form-item>
      </template>
      <template v-if="widget.wdgt_type==='折线或柱形图'">
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
        <el-form-item label="饼数据和选项">
          <el-radio-group v-model="widgetChart.prop">
            <el-radio label="折线图" />
            <el-radio label="柱形图" />
          </el-radio-group>
          <el-row>
            <el-col :span="6">
              <el-input v-model="widgetChart.serie" placeholder="系列字段" />
            </el-col>
            <el-col :span="6" :offset="3">
              <el-input v-model="widgetChart.x" placeholder="x轴字段" />
            </el-col>
            <el-col :span="6" :offset="3">
              <el-input v-model="widgetChart.y" placeholder="y轴字段" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="widgetChart.describe" type="textarea" />
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
    <el-dialog v-if="dialogVisibleIcon" :visible.sync="dialogVisibleIcon" title="选择图标" width="60%" append-to-body>
      <icon :index="index" :icon="widgetList.icon.values[index].icon" @icon="WdgtListIcon($event)" @index="inconIndex($event)" @show="isIconShow" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CommonTab from '@/components/commonTab'
import icon from './components/icon'

export default {
  components: {
    CommonTab,
    icon
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
      widgetPie: {
        border: 'obvious',
        describe: null,
        items: [
          {
            pie_prop: 'area',
            pie_series: '系列字段',
            pie_value: '值字段',
            pie_mode: 'yes',
            pie_num: true,
            pie_percent: false,
            pie_back: true,
            pie_type: 'pie'
          }
        ]
      },
      widgetChart: {
        border: 'obvious',
        prop: null,
        serie: null,
        x: null,
        y: null,
        describe: null
      },
      predefineColors: ['#FDA38E', '#4B8DF8', '#C25AEE', '#F77F54', '#58C437'],
      loading: false,
      showIcon: false,
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
      isCreate: false
    }
  },
  computed: {
    ...mapGetters([
      'openid'
    ])
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
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
            case '饼图':
              this.widget.content_config = this.widgetPie
              break
            case '折线或柱形图':
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
      this.showIcon = false
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    icon($event) {
      this.widget.wdgt_icon = $event
      this.showIcon = true
    },
    chooseWdgtListIcon(index) {
      this.index = index
      this.dialogVisibleIcon = !this.dialogVisibleIcon
    },
    WdgtListIcon($event) {
      this.listIcon = $event
      this.showIcon = true
    },
    inconIndex($event) {
      this.widgetList.icon.values[$event].icon = this.listIcon
    },
    deleteWdgtListIcon(index) {
      this.widgetList.icon.values[index].icon = null
      this.showIcon = false
    },
    isIconShow() {
      this.dialogVisibleIcon = !this.dialogVisibleIcon
    },
    addData() {
      this.dialogVisiblePie = !this.dialogVisiblePie
      this.isCreate = true
      this.dialogTitle = '饼图设置'
    },
    update(row) {
      this.dialogVisiblePie = !this.dialogVisiblePie
      this.isCreate = false
      this.dialogTitle = '更新饼图设置'
    },
    remove() {},
    isShowPie() {
      this.dialogVisiblePie = !this.dialogVisiblePie
    },
    addIcon() {
      this.widgetList.icon.values.push({
        value: null,
        icon: ''
      })
    },
    removeIcon(item) {
      var index = this.widgetList.icon.values.indexOf(item)
      if (index !== -1) {
        this.widgetList.icon.values.splice(index, 1)
      }
    },
    addColor() {
      this.widgetList.color.values.push({
        value: null,
        color: ''
      })
    },
    removeColor(item) {
      var index = this.widgetList.color.values.indexOf(item)
      if (index !== -1) {
        this.widgetList.color.values.splice(index, 1)
      }
    },
    wdgtTypeChange(val) {
      if (val === '磁贴式' && this.widget.wdgt_color === null) {
        this.widget.wdgt_color = '#4B8DF8'
      }
    }
  }
}
</script>

