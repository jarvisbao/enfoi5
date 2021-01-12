<template>
  <div class="app-container">
    <el-form ref="form" :model="operate" :rules="rules" label-width="170px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="名称" prop="operate_name">
            <el-input id="operateName" v-model="operate.operate_name" />
          </el-form-item>
          <el-form-item label="编码" prop="operate_code">
            <el-input id="operateCode" v-model="operate.operate_code" :disabled="true" />
          </el-form-item>
          <el-form-item label="图标">
            <div style="display: flex; align-items: center;">
              <div>
                <i v-if="operate.icon" :class="operate.icon" :style="{color: operate.btn_color || '#409eff'}" class="menu-icon" />
                <span class="choose-icon" style="padding: 7px 10px" @click="chooseIcon">选择图标</span>
                <span v-if="operate.icon" class="delete-icon" style="padding: 7px 10px" @click="deleteIcon">删除</span>
              </div>
              <el-color-picker v-model="operate.btn_color" size="small" />
            </div>
          </el-form-item>
          <el-form-item label="类型" prop="operate_type">
            <el-select id="operateType" v-model="operate.operate_type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="tips">
              1.批量处理：修改某个字段为指定值；应用场景：审核；<br>
              2.批量修改：修改某个字段为录入值（值从界面录入）；应用场景：批量修改客户经理；<br>
              3.个性修改：单一对象部分要素修改，即针对单个对象在一个页面上显示并修改指定的某些属性值，同时可能只读查看其他某些属性值；<br>
              4.定制操作POST：自定义一个uri，向该uri发送post请求，传入参数param=base64(data)，data格式{"object_id":object_id,"page_id":page_id,"mtd_id":mtd_id,"id":id}；<br>
              5.定制操作GET：自定义一个uri，向该uri发送get请求（默认在新窗口中打开），传入参数param=base64(data)，data格式{"object_id":object_id,"page_id":page_id,"mtd_id":mtd_id,"id":id}；<br>
              6.定制批量操作POST：自定义一个uri，向该uri发送post请求，传入参数param=base64(data)，data格式{"object_id":object_id,"page_id":page_id,"ids":ids,"mtd_id":mtd_id}；<br>
              7.定制批量操作GET：自定义一个uri，向该uri发送get请求（默认在新窗口中打开），传入参数param=base64(data)，data格式{"object_id":object_id,"page_id":page_id,"ids":ids,"mtd_id":mtd_id}；<br>
              8.类“新建”操作：自定义一个URL，点击跳转到该URL，若打开页面方式为无则传入参数 {"r_objectid": object_id, "r_pntfk":pntfk,"r_pntid":pntid,"r_pnt_clsname":pnt_clsname}；<br>
              9.文件导入操作：自定义一个uri，向该uri发送post请求，传入参数param=base64(data)，data格式{"object_id":object_id,"mtd_id":mtd_id,"content":content,"filename":filename}；<br>
            </div>
          </el-form-item>
          <template v-if="operate.operate_type===1">
            <el-form-item label="修改属性">
              <el-checkbox-group v-model="operate.edit_prop">
                <template v-for="(item, index) in fields">
                  <el-checkbox v-if="!item.is_object&&!item.is_primary&&!item.is_property" :id="'eidtProp'+index" :key="item.label" :label="item.prop">
                    {{ item.label }}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <template>
              <el-form-item label="设置值">
                <el-input id="editVal" v-model="operate.editval" />
              </el-form-item>
            </template>
            <!-- <el-form-item v-if="operate.operate_type!==1" label="查看属性">
              <el-checkbox-group v-model="operate.view_prop">
                <template v-for="(item, index) in fields">
                  <el-checkbox v-if="!item.is_object&&!item.is_primary&&!item.is_property" :id="'viewProp'+index" :key="item.label" :label="item.prop">
                    {{ item.label }}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item> -->
          </template>
          <template v-if="operate.operate_type===3 || operate.operate_type===2">
            <el-form-item label="表单设计">
              <div class="form-design-btn" @click="formDesign">
                自定义表单
              </div>
            </el-form-item>
          </template>
          <template v-if="operate.operate_type===4||operate.operate_type===5||operate.operate_type===6||operate.operate_type===7||operate.operate_type===8||operate.operate_type===9">
            <el-form-item label="URL地址" prop="uri">
              <el-input id="operateUrl" v-model="operate.uri" />
              <div class="tips">
                url地址以 http:// 或 / 开头
              </div>
            </el-form-item>
          </template>
          <el-form-item v-if="operate.operate_type===5||operate.operate_type===7||operate.operate_type===8" label="页面打开方式">
            <el-select id="openType" v-model="operate.uriopentype" placeholder="请选择">
              <template v-if="operate.operate_type===8">
                <el-option value="0" label="无" />
                <el-option value="1" label="新页面打开" />
                <el-option value="2" label="本页面打开" />
                <el-option value="3" label="在Module框中打开" />
              </template>
              <template v-else>
                <el-option value="0" label="新页面打开" />
                <el-option value="1" label="本页面打开" />
                <el-option value="2" label="在Module框中打开" />
              </template>
            </el-select>
            <div v-if="operate.operate_type===8" class="tips">
              如果是用于发送接口修改数据的请选择 无
            </div>
          </el-form-item>
          <template v-if="operate.operate_type===3">
            <el-form-item label="重定义接口URI" prop="uri">
              <el-input id="operateUrl" v-model="operate.uri" />
              <div class="tips">url地址以 http:// 或 / 开头, 并传入参数data，data格式{"object_id":object_id,"page_id":page_id,"ids":ids,"mtd_code":mtd_code}；</div>
            </el-form-item>
            <el-form-item label="打开方式">
              <el-select id="openType" v-model="operate.uriopentype" placeholder="请选择">
                <el-option value="0" label="新页面打开" />
                <el-option value="1" label="本页面打开" />
                <el-option value="2" label="在Module框中打开" />
              </el-select>
            </el-form-item>
          </template>
          <template v-if="operate.operate_type===9">
            <el-form-item label="文件导入起始行">
              <el-input v-model="operate.start_rows_input" type="number" min="0" @input="operate.start_rows_input=operate.start_rows_input.replace(/[^\d]/g, '')" />
            </el-form-item>
            <el-form-item label="文件导入列名">
              <el-input v-model="operate.cols_name_input" />
              <div class="tips">多个列名用管道符“|”隔开</div>
            </el-form-item>
            <!-- <el-form-item label="文件导入脚本操作">
              <python-codemirror :prop_code="operate.import_py" :placeholder="code_placeholder" :code-mode="mode" param-code="appendscript" @get_code="get_code($event)"/>
              <div class="tips">可用变量：clsDefine,param,dbFrame,dbbusi,ctx,result(导入结果返回的json数据)。retval返回错误提示。</div>
            </el-form-item> -->
          </template>
          <template v-if="operate.operate_type!==8">
            <el-form-item label="本操作适用条件">
              <el-input id="application" v-model="operate.apply_condition" placeholder="row." />
              <div class="tips">
                当数据满足此javascript表达式条件（空的话，认为true），才允许本操作。
              </div>
            </el-form-item>
          </template>
          <el-form-item label="确认执行操作的提示信息">
            <el-input id="confirmMsg" v-model="operate.confirm_msg" />
            <div class="tips">
              点击此操作按钮，弹出来的确认框里的提示信息。
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input id="summary" v-model="operate.summary" />
          </el-form-item>
          <el-form-item label="注入JavaScript代码">
            <python-codemirror v-if="codemirror" :prop_code="operate.append_script" :placeholder="code_placeholder" :code-mode="mode" param-code="append_script" @get_code="get_code($event)" />
            <div class="tips">
              注意注入的JS脚本中声明的函数名等内容的命名要够具体以避免函数重名
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="扩展脚本" name="second">
          <el-form-item label="新建后(点击保存后更新数据库前)脚本：" prop="pyafternew">
            <python-codemirror :prop_code="operate.pyafternew" :placeholder="code_placeholder" :code-mode="python_mode" param-code="pyafternew" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: fields, primary_key
            </div>
          </el-form-item>
          <el-form-item label="新建后(点击保存后更新数据库后)脚本：" prop="pyafternew2">
            <python-codemirror :prop_code="operate.pyafternew2" :placeholder="code_placeholder" :code-mode="python_mode" param-code="pyafternew2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
          <el-form-item label="编辑后(点击保存后更新数据库前)脚本：" prop="pyafteredit">
            <python-codemirror :prop_code="operate.pyafteredit" :placeholder="code_placeholder" :code-mode="python_mode" param-code="pyafteredit" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: fields, primary_key
            </div>
          </el-form-item>
          <el-form-item label="编辑后(点击保存后更新数据库后)脚本：" prop="pyafteredit2">
            <python-codemirror :prop_code="operate.pyafteredit2" :placeholder="code_placeholder" :code-mode="python_mode" param-code="pyafteredit2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-form-item>
          <el-button id="submit" :loading="loading" type="danger" @click="submitForm('form')">
            立即修改
          </el-button>
          <el-button id="cancel" plain @click="resetForm('form')">
            返回
          </el-button>
        </el-form-item>
      </el-tabs>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" destroy-on-close title="自定义表单" width="90%" class="form-design">
      <fm-making-form
        ref="makingform"
        :design-fields="fields"
        style="height: 500px;"
        clearable
        preview
        generate-json
        upload
      />
      <span slot="footer" class="dialog-footer">
        <el-button id="fm-submit" type="primary" @click="getjsonData">确 定</el-button>
        <el-button id="fm-cancel" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-if="dialogVisibleIcon" :visible.sync="dialogVisibleIcon" title="选择图标" width="60%" append-to-body>
      <div class="icon-box">
        <common-tab :text-list="textList" :current-tab="currentTab" @toggle="toggleTab($event)" />
        <transition name="tab">
          <keep-alive>
            <component :is="currentTab" :icon="operate.icon" @show="isShow" @icon="icon($event)" />
          </keep-alive>
        </transition>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'
import CommonTab from '@/components/commonTab'

export default {
  components: {
    pythonCodemirror,
    CommonTab
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
      loading: false,
      operate: {
        uri: ''
      },
      typeOptions: [
        {
          value: 1,
          label: '批量处理'
        },
        {
          value: 2,
          label: '批量修改'
        },
        {
          value: 3,
          label: '个性修改'
        },
        {
          value: 4,
          label: '定制操作POST'
        },
        {
          value: 5,
          label: '定制操作GET'
        },
        {
          value: 6,
          label: '定制批量操作POST'
        },
        {
          value: 7,
          label: '定制批量操作GET'
        },
        {
          value: 8,
          label: '类“新建”操作'
        },
        {
          value: 9,
          label: '文件导入操作'
        }
        // {
        //   value: '10',
        //   label: '固定过滤策略'
        // }
      ],
      Dinterface: [],
      fields: [],
      rules: {
        operate_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        operate_code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        operate_type: { required: true, message: '请选择类型', trigger: 'change' },
        uri: { validator: validateUrl, trigger: 'blur' }
      },
      activeName: 'first',
      code_placeholder: '',
      mode: 'javascript',
      python_mode: 'python',
      codemirror: false,
      dialogVisible: false,
      // showIcon: false,
      dialogVisibleIcon: false,
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
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    get_mtd_id() {
      if ('mtd_id' in this.$route.query) {
        const mtd_id = this.$route.query.mtd_id
        return mtd_id
      } else {
        return null
      }
    },
    fetchData() {
      const mtd_id = this.get_mtd_id()
      this.$Apis.object.method_info(mtd_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.operate = response.payload
          this.operate.pyafternew = response.payload.pyafternew ? response.payload.pyafternew : ''
          this.operate.pyafternew2 = response.payload.pyafternew2 ? response.payload.pyafternew2 : ''
          this.operate.pyafteredit = response.payload.pyafteredit ? response.payload.pyafteredit : ''
          this.operate.pyafteredit2 = response.payload.pyafteredit2 ? response.payload.pyafteredit2 : ''
          this.codemirror = true
          this.$Apis.object.get_headers(response.payload.object_id, true).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.fields = response.payload
            }
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const mtd_id = this.get_mtd_id()
          const operate_name = this.operate.operate_name
          const operate_type = this.operate.operate_type
          if (operate_type !== 3 && operate_type !== 2) {
            this.operate.design_form = null
          }
          const edit_prop = this.operate.edit_prop
          const view_prop = this.operate.view_prop
          const editval = this.operate.editval
          const apply_condition = this.operate.apply_condition
          const confirm_msg = this.operate.confirm_msg
          const uri = this.operate.uri
          const uriopentype = this.operate.uriopentype
          const summary = this.operate.summary
          const start_rows_input = this.operate.start_rows_input
          const cols_name_input = this.operate.cols_name_input
          const import_py = this.operate.import_py
          const append_script = this.operate.append_script
          const pyafternew = this.operate.pyafternew
          const pyafternew2 = this.operate.pyafternew2
          const pyafteredit = this.operate.pyafteredit
          const pyafteredit2 = this.operate.pyafteredit2
          const icon = this.operate.icon
          const btn_color = this.operate.btn_color
          let design_form = JSON.parse(this.operate.design_form)
          if (design_form) {
            design_form.config.id = this.operate.proj_code + '-' + this.operate.object_code
          }
          design_form = JSON.stringify(design_form)
          this.$Apis.object.method_edit(mtd_id, operate_name, operate_type, edit_prop, view_prop, editval,
            apply_condition, confirm_msg, uri, uriopentype, summary, start_rows_input, cols_name_input, import_py,
            append_script, pyafternew, pyafternew2, pyafteredit, pyafteredit2, design_form, icon, btn_color).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('更新成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm()
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$router.go(-1)
    },
    get_code($event) {
      for (var key in $event) {
        eval('this.operate[key] = $event[key]')
      }
    },
    formDesign() {
      if (this.operate.design_form) {
        setTimeout(() => {
          this.$refs.makingform.setJSON(JSON.parse(this.operate.design_form))
        }, 500)
      }
      this.dialogVisible = !this.dialogVisible
    },
    getjsonData() {
      this.dialogVisible = !this.dialogVisible
      this.operate.design_form = JSON.stringify(this.$refs.makingform.getJSON())
    },
    chooseIcon() {
      this.dialogVisibleIcon = !this.dialogVisibleIcon
    },
    deleteIcon() {
      this.operate.icon = null
      // this.showIcon = false
    },
    toggleTab($event) {
      this.currentTab = $event
    },
    isShow() {
      this.dialogVisibleIcon = !this.dialogVisibleIcon
    },
    icon($event) {
      this.operate.icon = $event
      // this.showIcon = true
    }
  }
}
</script>
<style lang="scss" scoped>
.form-design /deep/ .el-form{
  width: 100%;
}
.form-design-btn {
  width: 100px;
  color: #409eff;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  cursor: pointer;
  line-height: 35px;
  text-align: center;
}
.form-design {
  .tips {
    margin: -25px 0 15px 0;
    font-size: 14px;
    span {
      margin: 0 4px;
      color: #666;
    }
  }
  .dialog-footer {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

