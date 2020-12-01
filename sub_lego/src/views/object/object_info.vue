<template>
  <div class="app-container">
    <common-title />
    <el-form ref="objectForm" :model="object" :rules="rules" :disabled="true" label-width="170px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="对象名称" prop="object_name">
            <el-input v-model="object.object_name" />
          </el-form-item>
          <el-form-item label="对象代码" prop="object_code">
            <el-input v-model="object.object_code" />
          </el-form-item>
          <el-form-item placeholder="请选择" label="关联的业务类" prop="biz_id">
            <el-cascader
              v-model="biz_id_up"
              :options="options"
              :props="props"
              filterable
              @change="getFields"
              @active-item-change="handleItemChange"
            />
          </el-form-item>
          <el-form-item label="页面显示字段" prop="fields">
            <el-select v-model="object.fields" multiple clearable placeholder="请先选择业务类">
              <el-option
                v-for="item in fields"
                :key="item.label"
                :label="item.label"
                :value="item.prop"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="额外返回字段" prop="ext_fields">
            <el-select v-model="object.ext_fields" multiple clearable placeholder="请先选择业务类">
              <el-option
                v-for="item in fields"
                :key="item.label"
                :label="item.label"
                :value="item.prop"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单设计" prop="design_form">
            <div class="form-design-btn" @click="formDesign">
              自定义表单
            </div>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item label="允许新建">
                <el-switch v-model="object.can_create" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许编辑">
                <el-switch v-model="object.can_update" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许删除">
                <el-switch v-model="object.can_delete" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许查看">
                <el-switch v-model="object.can_view" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="排序字段" prop="orderby">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-select v-model="object.orderby" clearable placeholder="请先选择业务类">
                  <el-option
                    v-for="item in fields"
                    v-if="!item.is_object"
                    :key="item.label"
                    :label="item.label"
                    :value="item.prop"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <label style="color:#666; padding-right:15px;">倒序</label>
                <el-switch v-model="desc" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="数据过滤">
            <div v-for="(item,index) in object.queryparam" :key="index" class="text item">
              <el-row :gutter="10">
                <el-col :span="20">
                  {{ field_label[item.field] || item.field }} {{ item.operator }} {{ item.value }}
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <template v-if="JSON.stringify(methodsItems)!=='[]'">
            <el-form-item label="单条操作">
              <el-checkbox-group v-model="single_methods">
                <template v-for="element in singles">
                  <el-checkbox :key="element.name" :label="element.label">
                    {{ element.name }}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="其他操作">
              <el-checkbox-group v-model="other_methods">
                <template v-for="element in others">
                  <el-checkbox :key="element.name" :label="element.label">
                    {{ element.name }}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <el-form-item label="启用暂存脚本">
            <el-switch v-model="object.save_noscript" />
            <div class="tips">
              启动后该对象的扩展脚本功能不启用
            </div>
          </el-form-item>
          <!--          <el-form-item label="启用对象变动记录">-->
          <!--            <el-switch v-model="page.enable_record"/>-->
          <!--            <div class="tips">启动后，在对象增、删、改时，会自动记录属性值变化（同时需要启用属性的“变动记录”设置）。启用时会自动启用属性的“变动记录”设置</div>-->
          <!--          </el-form-item>-->
          <el-form-item label="删除操作适用条件：" prop="delete_applycondition">
            <el-input v-model="object.delete_applycondition" />
            <div class="tips">
              当数据满足此javascript表达式条件（空的话，认为true），才允许删除
            </div>
          </el-form-item>
          <!-- <el-form-item label="数据访问权限控制">
          <el-switch v-model="object.enabledataauth" @change="enabledataauth"/>
        </el-form-item>
        <template v-if="is_control">
          <el-form-item label="权限判定字段">
            <el-input v-model="object.authcols"/>
          </el-form-item>
          <el-form-item label="权限控制级别">
            <el-input v-model="object.authlevel"/>
          </el-form-item>
          <el-form-item label="属性的代码" prop="authcode" class="is-required">
            <python-codemirror :prop_code="authcode" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
            <span v-if="validateCode" class="validate-tips">请输入属性的代码</span>
          </el-form-item>
        </template>
        <el-form-item label="数据访问开放角色">
          <el-select v-model="object.authopenrole" multiple clearable>
            <el-option
              v-for="item in roles"
              :key="item.role_id"
              :label="item.name"
              :value="item.role_id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.role_code }}</span>
            </el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="有权修改此对象定义角色">
            <el-select v-model="object.auth_developers" multiple clearable>
              <el-option
                v-for="item in roles"
                v-if="['superadmin','lego_admin'].indexOf(item.role_code) == -1"
                :key="item.role_code"
                :label="item.role_name"
                :value="item.role_code"
              >
                <span style="float: left">{{ item.role_name }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.role_code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="对象创建人">
      <el-input v-model="object.inputman"/>
    </el-form-item> -->
          <el-form-item label="对象用途描述">
            <el-input v-model="object.description" />
          </el-form-item>
        <!-- <el-form-item label="页面属性" prop="props">
      <el-input v-model="page.props" type="textarea"/>
      <div class="tips">请填写json格式的数据</div>
    </el-form-item> -->
        </el-tab-pane>
        <!-- 结果:results -->
        <el-tab-pane :lazy="true" :disabled="object.save_noscript?true:false" :class="{'is-disabled': object.save_noscript}" label="扩展脚本" name="second">
          <!-- <el-form-item label="新建前(新建界面出现前)脚本：" prop="pybeforenew">
            <python-codemirror :prop_code="pybeforenew" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
          </el-form-item> -->
          <el-form-item label="新建后(点击保存后更新数据库前)脚本：" prop="pyafternew">
            <python-codemirror :prop_code="object.pyafternew" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafternew" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: fields
            </div>
          </el-form-item>
          <el-form-item label="新建后(点击保存后更新数据库后)脚本：" prop="pyafternew2">
            <python-codemirror :prop_code="object.pyafternew2" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafternew2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
          <!-- <el-form-item label="编辑界面出现前(数据已查询出来，还未做任何格式化等处理)脚本：" prop="pybeforeedit0">
          <python-codemirror :prop_code="pybeforeedit0" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
        </el-form-item> -->
          <!-- <el-form-item label="编辑界面出现前(数据已查询出来，已按属性类型做了格式化等处理)脚本：" prop="pybeforeedit">
          <python-codemirror :prop_code="pybeforeedit" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
        </el-form-item> -->
          <el-form-item label="编辑后(点击保存后更新数据库前)脚本：" prop="pyafteredit">
            <python-codemirror :prop_code="object.pyafteredit" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafteredit" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: filters,fields
            </div>
          </el-form-item>
          <el-form-item label="编辑后(点击保存后更新数据库后)脚本：" prop="pyafteredit2">
            <python-codemirror :prop_code="object.pyafteredit2" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafteredit2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
          <el-form-item label="删除前(执行数据删除动作前)脚本：" prop="pybeforedel">
            <python-codemirror :prop_code="object.pybeforedel" :placeholder="code_placeholder" :code-mode="mode" param-code="pybeforedel" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: filters
            </div>
          </el-form-item>
          <el-form-item label="删除后(执行数据删除动作后)脚本：" prop="pyafterdel">
            <python-codemirror :prop_code="object.pyafterdel" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafterdel" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
          <!-- <el-form-item label="查看前(查看数据时数据查询出来后未做任何处理前)脚本：" prop="pybeforeview">
          <python-codemirror :prop_code="pybeforeview" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
        </el-form-item> -->
          <el-form-item label="查询前(数据查询出来未做任何处理前)脚本：" prop="pybeforelist">
            <python-codemirror :prop_code="object.pybeforelist" :placeholder="code_placeholder" :code-mode="mode" param-code="pybeforelist" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results,filters,page_index,page_size,page,text
            </div>
          </el-form-item>
          <el-form-item label="查询后(数据查询出来后列表界面出现前)脚本：" prop="pyafterlist">
            <python-codemirror :prop_code="object.pyafterlist" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafterlist" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-button plain style="margin-left: 170px;" @click="resetForm('objectForm')">
      返回
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" title="自定义表单" width="80%" class="form-design">
      <div class="tips">
        根据所列出的字段自定义表单：
        <span v-for="(item, index) in designFields" :key="index">
          {{ item.label }} ({{ item.prop }})
        </span>
      </div>
      <fm-making-form
        ref="makingform"
        :design-fields="designFields"
        style="height: 500px;"
        clearable
        preview
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getjsonData">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'
import CommonTitle from '@/components/CommonTitle'

export default {
  components: {
    pythonCodemirror,
    CommonTitle
  },
  data() {
    return {
      biz_id_up: [],
      rules: {
        object_name: [{ required: true, message: '请输入对象名称', trigger: 'blur' }],
        object_code: [{ required: true, message: '请输入对象代码', trigger: 'blur' }],
        biz_id: [{ required: true, message: '请选择业务类', trigger: 'change' }]
      },
      loading: false,
      props: {
        label: 'label',
        value: 'id',
        children: 'bizclass'
      },
      field_label: {},
      object: {},
      single_methods: [], // 单条操作
      other_methods: [], // 其他操作
      options: [],
      object_code: null,
      proj_code: null,
      fields: [],
      dialogVisible: false,
      designFields: [],
      is_control: false,
      mode: 'python',
      roles: [],
      validateCode: false,
      activeName: 'first',
      code_placeholder: '',
      singles: [],
      others: [],
      methodsItems: [],
      desc: false,
      field: null
    }
  },
  created() {
    this.fetchData()
    this.getOptions()
    this.get_role_list()
  },
  methods: {
    get_object_code() {
      if ('object_code' in this.$route.query) {
        this.object_code = this.$route.query.object_code
        return this.object_code
      } else {
        return null
      }
    },
    get_proj_code() {
      if ('proj_code' in this.$route.query) {
        this.proj_code = this.$route.query.proj_code
        return this.proj_code
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      this.get_object_code()
      this.get_proj_code()
      this.$Apis.object.object_info(this.proj_code, this.object_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.object = response.payload
          this.object.pyafternew = response.payload.pyafternew ? response.payload.pyafternew : ''
          this.object.pyafternew2 = response.payload.pyafternew2 ? response.payload.pyafternew2 : ''
          this.object.pyafteredit = response.payload.pyafteredit ? response.payload.pyafteredit : ''
          this.object.pyafteredit2 = response.payload.pyafteredit2 ? response.payload.pyafteredit2 : ''
          this.object.pybeforedel = response.payload.pybeforedel ? response.payload.pybeforedel : ''
          this.object.pyafterdel = response.payload.pyafterdel ? response.payload.pyafterdel : ''
          this.object.pybeforelist = response.payload.pybeforelist ? response.payload.pybeforelist : ''
          this.object.pyafterlist = response.payload.pyafterlist ? response.payload.pyafterlist : ''
          this.desc = false
          if (this.object.orderby && this.object.orderby.startsWith('-')) {
            this.desc = true
            this.object.orderby = this.object.orderby.slice(1)
          }
          if (!this.object.queryparam) {
            this.object.queryparam = []
          }
          this.object.props = JSON.stringify(this.object.props)
          this.single_methods = response.payload.single_methods === null || !response.payload.single_methods ? [] : response.payload.single_methods
          this.other_methods = response.payload.other_methods === null || !response.payload.other_methods ? [] : response.payload.other_methods
          this.$Apis.bizclass.bizclass_info(this.object.biz_id).then(response => {
            const data = response.payload
            this.handleItemChange([data.proj_code])
            this.biz_id_up.push(data.proj_code, data.biz_code)
            this.$Apis.bizdata.bizdata_get_headers(data.proj_code, data.biz_code).then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                this.fields = response.payload
              }
            })
          })
          this.getMethods(this.object.object_id)
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    get_role_list() {
      this.$Apis.role.role_list().then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.roles = response.payload.items
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.loading = false
            }
          })
        }
      })
    },
    getMethods(object_id) {
      this.$Apis.object.method_list_by_id(object_id).then(response => {
        this.loading = false
        this.methodsItems = response.payload.items
        this.methodsItems.forEach(element => {
          if (element.operate_type === 3 || element.operate_type === 4 || element.operate_type === 5) {
            this.singles.push({
              label: element.mtd_id,
              name: element.operate_name
            })
          } else {
            this.others.push({
              label: element.mtd_id,
              name: element.operate_name
            })
          }
        })
      })
    },
    resetForm(formName) {
      this.$router.go(-1)
    },
    handleItemChange($event) {
      var proj_code = $event[0]
      this.$Apis.bizclass.bizclass_list(proj_code).then(response => {
        let arr = []
        response.payload.items.forEach(item => {
          arr.push({
            label: item.biz_name,
            id: item.biz_code
          })
        })
        if (JSON.stringify(arr) === '[]') {
          arr = ''
        }
        this.options.forEach(item => {
          if (item.id === proj_code) {
            item.bizclass = arr
          }
        })
      })
    },
    getFields() {
      const proj_code = this.biz_id_up[0]
      const biz_code = this.biz_id_up[this.biz_id_up.length - 1]
      this.$Apis.bizdata.bizdata_get_headers(proj_code, biz_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.fields = response.payload
          this.fields.forEach(field => {
            this.field_label[field.prop] = field.label
          })
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    getOptions() {
      this.$Apis.project.project_list().then(response => {
        response.payload.items.forEach(item => {
          this.options.push({
            label: item.proj_name,
            id: item.proj_code,
            bizclass: []
          })
        })
      })
    },
    formDesign() {
      this.designFields = []
      if (this.object.design_form) {
        setTimeout(() => {
          this.$refs.makingform.setJSON(JSON.parse(this.object.design_form))
        }, 500)
      }
      this.fields.forEach(item => {
        if (!item['is_property']) {
          this.designFields.push(item)
        }
      })
      this.dialogVisible = !this.dialogVisible
    },
    getjsonData() {
      this.dialogVisible = !this.dialogVisible
      this.object.design_form = JSON.stringify(this.$refs.makingform.getJSON())
    },
    cancle() {
      this.dialogVisible = !this.dialogVisible
    },
    enabledataauth(val) {
      if (val) {
        this.is_control = true
      } else {
        this.is_control = false
      }
    },
    get_code($event) {
      for (var key in $event) {
        eval('this.object[key] = $event[key]')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-design /deep/ .el-form,
.el-cascader {
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
.CodeMirror-placeholder {
  color: #c0c4d6 !important;
}
.el-form {
  width: 100%;
  & /deep/ .el-tabs__content {
    width: 80%;
  }
  & /deep/ .el-tabs__item.is-disabled {
    opacity: 0.4;
    cursor: no-drop;
  }
}
</style>
