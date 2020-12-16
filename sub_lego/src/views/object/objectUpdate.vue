<template>
  <div class="app-container">
    <common-title v-if="objView" />
    <el-form ref="objectForm" :model="object" :rules="rules" :disabled="objView" label-width="170px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="对象名称" prop="object_name">
            <el-input id="objectName" v-model="object.object_name" />
          </el-form-item>
          <el-form-item label="对象代码" prop="object_code">
            <el-input id="objectCode" v-model="object.object_code" :disabled="true" />
          </el-form-item>
          <el-form-item placeholder="请选择" label="关联的业务类" prop="biz_code">
            <!-- <el-cascader
              v-model="biz_id_up"
              :options="options"
              :props="props"
              filterable
              @change="getFields"
              @active-item-change="handleItemChange"/> -->
            <div class="ganged-select">
              <el-select
                id="projCodialogVisiblede"
                v-model="object.proj_code"
                v-loadmore="loadMore"
                :remote-method="remoteMethod"
                :loading="searchLoading"
                :class="{selectW: ischildShow }"
                filterable
                remote
                placeholder="请选择"
                class="select"
                @change="handleChange"
                @focus="handleFoucus"
              >
                <el-option
                  v-for="item in projItem"
                  :key="item.proj_code"
                  :label="item.proj_name"
                  :value="item.proj_code"
                />
              </el-select>
              <el-select
                v-if="ischildShow"
                id="bizCode"
                v-model="object.biz_code"
                v-loadmore="loadMore"
                :remote-method="remoteMethod"
                :loading="searchLoading"
                :class="{selectW: ischildShow }"
                filterable
                remote
                placeholder="请选择"
                class="select"
                @change="getFields"
                @focus="handleChildFoucus"
              >
                <el-option
                  v-for="item in classItem"
                  :key="item.biz_code"
                  :label="item.biz_name"
                  :value="item.biz_code"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="页面显示字段" prop="fields">
            <!-- <el-select id="pageFields" v-model="object.fields" multiple filterable clearable placeholder="请先选择业务类">
              <el-option
                v-for="item in fields"
                :key="item.prop"
                :label="item.label"
                :value="item.prop"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
              </el-option>
            </el-select> -->
            <el-transfer
              id="pageFields"
              v-model="object.fields"
              :data="fields"
              :props="{ key: 'prop', label: 'label' }"
              :titles="['备选字段', '已选字段']"
              :render-content="renderFunc"
              filterable
              filter-placeholder="请输入搜索内容"
              target-order="push"
              @right-check-change="rightCheck">
              <el-button slot="right-footer" :disabled="upDisable" size="mini" @click="upData" style="margin-left: 15px;">
                上移
              </el-button>
              <el-button slot="right-footer" :disabled="downDisable" size="mini" @click="downData">
                下移
              </el-button>
            </el-transfer>
          </el-form-item>
          <el-form-item label="额外返回字段" prop="ext_fields">
            <el-select id="pageExtFields" v-model="object.ext_fields" multiple filterable clearable placeholder="请先选择业务类">
              <el-option
                v-for="item in fields"
                :key="item.prop"
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
            <el-col :span="4">
              <el-form-item label="允许导出">
                <el-switch v-model="object.can_export" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="排序字段" prop="orderby">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-select id="orderby" v-model="object.orderby" clearable filterable placeholder="请先选择业务类">
                  <el-option
                    v-for="item in fields"
                    v-if="!item.is_object"
                    :key="item.prop"
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
            <el-row :gutter="10">
              <el-col :span="6">
                <el-select id="field" v-model="field" clearable filterable placeholder="请先选择业务类">
                  <el-option
                    v-for="item in fields"
                    v-if="!item.is_object"
                    :key="item.prop"
                    :label="item.label"
                    :value="item.prop"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select id="operator" v-model="operator" clearable placeholder="请选择">
                  <el-option
                    v-for="item in operators"
                    :key="item.operator"
                    :label="item.label"
                    :value="item.operator"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.operator }}</span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-input id="pyValue" v-model="value" placeholder="python变量使用#python变量#,表内部字段使用@字段名@" />
              </el-col>
              <el-col :span="3">
                <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline" @click="add_to_query" /></span>
              </el-col>
            </el-row>
            <div v-for="(item,index) in object.queryparam" :key="index" class="text item">
              <el-row :gutter="10">
                <el-col :span="20">
                  {{ field_label[item.field] ? field_label[item.field] + '(' + item.field + ')' : item.field }} {{ item.operator }} {{ item.value }}
                </el-col>
                <el-col :span="3">
                  <i class="el-icon-delete" @click="remove_query(index)" />
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item v-if="singles.length >= 1" label="单条操作">
            <el-checkbox-group v-model="single_methods">
              <template v-for="(element, index) in singles">
                <el-checkbox :id="'single'+index" :key="element.name" :label="element.label">
                  {{ element.name }}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="others.length >= 1" label="其他操作">
            <el-checkbox-group v-model="other_methods">
              <template v-for="(element, index) in others">
                <el-checkbox :id="'other'+index" :key="element.name" :label="element.label">
                  {{ element.name }}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="启用暂存脚本">
            <el-switch v-model="object.save_noscript" />
            <div class="tips">
              启动后该对象的扩展脚本功能不启用
            </div>
          </el-form-item>
          <el-form-item label="删除操作适用条件" prop="delete_applycondition">
            <el-input id="application" v-model="object.delete_applycondition" placeholder="row." />
            <div class="tips">
              当数据满足此javascript表达式条件（空的话，认为true），才允许删除
            </div>
          </el-form-item>
          <el-form-item label="有权修改此对象定义角色">
            <el-select
              id="auth"
              v-model="object.auth_developers"
              v-loadmore="loadMore"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              filterable
              remote
              multiple
              clearable
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in roles"
                v-if="['superadmin','lego_admin'].indexOf(item.role_code) == -1"
                :key="item.role_code"
                :label="item.role_name"
                :value="item.role_code"
              >
                <span style="float: left">{{ item.role_name }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.category }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据访问开放角色">
            <el-select
              id="authRole"
              v-model="object.authopenrole"
              v-loadmore="loadMore"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              filterable
              remote
              multiple
              clearable
              @visible-change="openRoleChange"
            >
              <el-option
                v-for="item in openRoles"
                :key="item.role_code"
                :label="item.role_name"
                :value="item.role_code"
              >
                <span style="float: left">{{ item.role_name }}</span>
                <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.category }}</span>
              </el-option>
            </el-select>
            <div class="tips">
              这些角色的人可以访问本对象的所有数据，不受数据过滤的影响
            </div>
          </el-form-item>
          <el-form-item label="数据权限控制">
            <div style="display: flex; align-items: center;">
              <el-switch v-model="object.enabledataauth" />
              <el-select id="pageFields" v-model="authcols" multiple filterable clearable placeholder="请先选择业务类" style="margin: 0 10px;">
                <el-option
                  v-for="item in fields"
                  v-if="!item.is_object || item.format.split('.').length === 1"
                  :key="item.prop"
                  :label="item.label"
                  :value="item.prop"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
                </el-option>
              </el-select>
              <el-select id="pageFields" v-model="object.authlevel">
                <el-option
                  v-for="item in authlevels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="显示变动记录">
            <div style="display: flex; align-items: center;">
              <el-switch v-model="object.enable_record" />
              <el-select id="pageFields" v-model="history_fields" multiple filterable clearable placeholder="请先选择业务类" style="margin: 0 10px;">
                <el-option
                  v-for="item in fields"
                  v-if="!item.is_object || item.format.split('.').length === 1"
                  :key="item.prop"
                  :label="item.label"
                  :value="item.prop"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; margin-right: 15px; color: #8492a6;">{{ item.prop }}</span>
                </el-option>
              </el-select>
              <div class="tips">
                只能显示本表字段,不选则显示所有字段的变动记录
              </div>
            </div>
          </el-form-item>
          <el-form-item label="对象用途描述">
            <el-input id="description" v-model="object.description" />
          </el-form-item>
        </el-tab-pane>
        <!-- 结果:results -->
        <el-tab-pane :lazy="true" :disabled="object.save_noscript?true:false" :class="{'is-disabled': object.save_noscript}" label="扩展脚本" name="second">
          <!-- <el-form-item label="新建前(新建界面出现前)脚本：" prop="pybeforenew">
              <python-codemirror :prop_code="pybeforenew" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
            </el-form-item> -->
          <el-form-item label="新建后(点击保存后更新数据库前)脚本：" prop="pyafternew">
            <python-codemirror :prop_code="object.pyafternew" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafternew" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: fields, primary_key
            </div>
          </el-form-item>
          <el-form-item label="新建后(点击保存后更新数据库后)脚本：" prop="pyafternew2">
            <python-codemirror :prop_code="object.pyafternew2" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafternew2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
          <el-form-item label="编辑/查看界面出现前(数据已查询出来，已转换为业务字段后)脚本：" prop="pybefore">
            <python-codemirror :prop_code="object.pybefore" :placeholder="code_placeholder" :code-mode="mode" param-code="pybefore" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
          <el-form-item label="编辑后(点击保存后更新数据库前)脚本：" prop="pyafteredit">
            <python-codemirror :prop_code="object.pyafteredit" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafteredit" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: fields, primary_key
            </div>
          </el-form-item>
          <el-form-item label="编辑后(点击保存后更新数据库后)脚本：" prop="pyafteredit2">
            <python-codemirror :prop_code="object.pyafteredit2" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafteredit2" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
          <el-form-item label="删除前(执行数据删除动作前)脚本：" prop="pybeforedel">
            <python-codemirror :prop_code="object.pybeforedel" :placeholder="code_placeholder" :code-mode="mode" param-code="pybeforedel" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
          <el-form-item label="删除后(执行数据删除动作后)脚本：" prop="pyafterdel">
            <python-codemirror :prop_code="object.pyafterdel" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafterdel" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: primary_value, obj
            </div>
          </el-form-item>
          <el-form-item label="查询前(数据库查询前)脚本：" prop="pybeforelist">
            <python-codemirror :prop_code="object.pybeforelist" :placeholder="code_placeholder" :code-mode="mode" param-code="pybeforelist" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: filters,text
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
      <el-form-item v-if="!objView">
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('objectForm')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('objectForm')">
          返回
        </el-button>
      </el-form-item>
    </el-form>
    <el-button v-if="objView" plain style="margin-left: 170px;" @click="resetForm('objectForm')">
      返回
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" destroy-on-close title="自定义表单" width="80%" class="form-design">
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
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'
import CommonTitle from '@/components/CommonTitle'
import { instance as Vue } from '@/life-cycle'
const isJSON = Vue.$Utils.validate.isJSON

export default {
  components: {
    pythonCodemirror,
    CommonTitle
  },
  props: {
    objView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateJson = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isJSON(value)) {
        callback(new Error('请输入正确的json格式!'))
      } else {
        callback()
      }
    }
    return {
      biz_id_up: [],
      rules: {
        object_name: [{ required: true, message: '请输入对象名称', trigger: 'blur' }],
        object_code: [{ required: true, message: '请输入对象代码', trigger: 'blur' }],
        biz_id: [{ required: true, message: '请选择业务类', trigger: 'change' }],
        props: [{ validator: validateJson, trigger: 'blur' }]
      },
      loading: false,
      props: {
        label: 'label',
        value: 'id',
        children: 'bizclass'
      },
      object: {
        object_name: null,
        object_code: null,
        fields: [],
        ext_fields: null,
        props: null,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_export: false,
        design_form: null,
        pyafternew: '',
        pyafternew2: '',
        pybefore: '',
        pyafteredit: '',
        pyafteredit2: '',
        pybeforedel: '',
        pyafterdel: '',
        pybeforelist: '',
        pyafterlist: '',
        delete_applycondition: '',
        save_noscript: false,
        queryparam: [],
        biz_code: null,
        proj_code: null,
        enabledataauth: false,
        authlevel: null,
        enable_record: false
      },
      field_label: {},
      old_object_code: null,
      authcols: [],
      history_fields: [],
      single_methods: [], // 单条操作
      other_methods: [], // 其他操作
      options: [],
      object_code: null,
      proj_code: null,
      fields: [],
      dialogVisible: false,
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
      field: null,
      operator: null,
      value: null,
      operators: [
        {
          label: '等于',
          operator: '=='
        },
        {
          label: '不等于',
          operator: '!='
        },
        {
          label: '大于',
          operator: '>'
        },
        {
          label: '大于等于',
          operator: '>='
        },
        {
          label: '小于',
          operator: '<'
        },
        {
          label: '小于等于',
          operator: '<='
        },
        {
          label: '类似',
          operator: '.like'
        },
        {
          label: '区间',
          operator: '.in_'
        }
      ],
      biz_name: null,
      proj_id: null,
      projItem: [],
      classItem: [],
      ischildShow: false,
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      searchLoading: false,
      childText: null,
      childPagination: 1,
      childPageCount: 1,
      isFocus: false,
      isChildFocus: false,
      isRoleFocus: false,
      roleText: null,
      rolePagination: 1,
      rolePageCount: 1,
      openRoles: [],
      isOpenRoleFocus: false,
      openRolePagination: 1,
      openRolePageCount: 1,
      authlevels: [
        {
          label: '仅自己',
          value: 'personal'
        },
        {
          label: '本部门共享',
          value: 'org'
        },
        {
          label: '所有子级部门',
          value: 'sub_org'
        }
      ],
      upDisable: false,
      downDisable: false,
      tempSelectionKeys: []
    }
  },
  created() {
    this.fetchData()
    this.get_object_code()
    this.get_proj_code()
  },
  mounted() {
    // this.getList()
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
    get_biz_name() {
      if ('name' in this.$route.query) {
        this.biz_name = this.$route.query.name
        return this.biz_name
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      this.get_object_code()
      this.get_proj_code()
      this.get_biz_name()
      this.$Apis.object.object_info(this.proj_code, this.object_code).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.object = response.payload
          this.object.pyafternew = response.payload.pyafternew ? response.payload.pyafternew : ''
          this.object.pyafternew2 = response.payload.pyafternew2 ? response.payload.pyafternew2 : ''
          this.object.pybefore = response.payload.pybefore ? response.payload.pybefore : ''
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
          this.old_object_code = response.payload.object_code
          this.object.props = JSON.stringify(this.object.props)
          this.single_methods = response.payload.single_methods === null || !response.payload.single_methods ? [] : response.payload.single_methods
          this.other_methods = response.payload.other_methods === null || !response.payload.other_methods ? [] : response.payload.other_methods
          this.history_fields = response.payload.history_fields === null || !response.payload.history_fields ? [] : response.payload.history_fields
          this.authcols = response.payload.authcols === null || !response.payload.authcols ? [] : response.payload.authcols
          this.$Apis.project.project_info(this.object.proj_code).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.projItem.push({
                proj_name: response.payload.proj_name,
                proj_code: response.payload.proj_code
              })
            }
          })
          this.ischildShow = true
          this.classItem.push({
            biz_name: this.biz_name,
            biz_code: this.object.biz_code
          })
          this.object.auth_developers.forEach(item => {
            this.$Apis.role.role_info(item).then(response => {
              this.roles.push({
                role_name: response.payload.name,
                role_code: response.payload.role_code
              })
            })
          })
          this.object.authopenrole.forEach(item => {
            this.$Apis.role.role_info(item).then(response => {
              this.openRoles.push({
                role_name: response.payload.name,
                role_code: response.payload.role_code
              })
            })
          })
          this.getFields()
          this.getMethods(this.object.object_id)
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
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
    handleFoucus() {
      this.isFocus = true
      this.isChildFocus = false
      this.isRoleFocus = false
      this.isOpenRoleFocus = false
      this.projItem = []
      this.pagination.page = 1
      this.getList()
    },
    handleChildFoucus() {
      this.isFocus = false
      this.isChildFocus = true
      this.isRoleFocus = false
      this.isOpenRoleFocus = false
      this.classItem = []
      this.childPagination = 1
      this.getChildList()
    },
    visibleChange(val) {
      if (val) {
        this.isFocus = false
        this.isChildFocus = false
        this.isRoleFocus = true
        this.isOpenRoleFocus = false
        this.roles = []
        this.rolePagination = 1
        this.getRoleList()
      }
    },
    openRoleChange(val) {
      if (val) {
        this.isFocus = false
        this.isChildFocus = false
        this.isRoleFocus = false
        this.isOpenRoleFocus = true
        this.openRoles = []
        this.openRolePagination = 1
        this.getOpenRoleList()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const proj_code = this.proj_code
          const old_object_code = this.old_object_code
          const object_name = this.object.object_name
          const object_code = this.object.object_code
          const biz_code = this.object.biz_code
          const biz_proj_code = this.object.proj_code
          const fields = this.object.fields
          const ext_fields = this.object.ext_fields
          const can_create = this.object.can_create
          const can_update = this.object.can_update
          const can_delete = this.object.can_delete
          const can_view = this.object.can_view
          const can_export = this.object.can_export
          let design_form = JSON.parse(this.object.design_form)
          design_form.config.id = proj_code + '-' + object_code
          design_form = JSON.stringify(design_form)
          const description = this.object.description
          const authopenrole = this.object.authopenrole
          const auth_developers = this.object.auth_developers
          const pyafternew = this.object.pyafternew
          const pyafternew2 = this.object.pyafternew2
          const pybefore = this.object.pybefore
          const pyafteredit = this.object.pyafteredit
          const pyafteredit2 = this.object.pyafteredit2
          const pybeforedel = this.object.pybeforedel
          const pyafterdel = this.object.pyafterdel
          const pybeforelist = this.object.pybeforelist
          const pyafterlist = this.object.pyafterlist
          const save_noscript = this.object.save_noscript
          const delete_applycondition = this.object.delete_applycondition
          const single_methods = this.single_methods
          const other_methods = this.other_methods
          const queryparam = this.object.queryparam
          const enabledataauth = this.object.enabledataauth
          const authcols = this.authcols
          const history_fields = this.history_fields
          const authlevel = this.object.authlevel
          const enable_record = this.object.enable_record
          var orderby = this.object.orderby
          if (this.desc) {
            orderby = '-' + orderby
          }
          let props = this.object.props
          if (props && props !== 'null') {
            props = JSON.parse(this.object.props)
          } else if (props === 'null' || !props) {
            props = {}
          }
          this.$Apis.object.object_edit(proj_code, old_object_code, biz_code, biz_proj_code, object_name, fields, ext_fields, props, can_create, can_update, can_delete, can_view, can_export,
            design_form, orderby, description, authopenrole, auth_developers, pyafternew,
            pyafternew2,
            pybefore,
            pyafteredit,
            pyafteredit2,
            pybeforedel,
            pyafterdel,
            pybeforelist,
            pyafterlist,
            save_noscript,
            delete_applycondition,
            queryparam,
            single_methods,
            other_methods,
            enabledataauth,
            authcols,
            authlevel,
            enable_record,
            history_fields).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('修改成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('pageForm')
                  this.$emit('refresh')
                }
              })
            } else {
              this.$alert(response.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$router.go(-1)
    },
    getFields() {
      const proj_code = this.object.proj_code
      const biz_code = this.object.biz_code
      this.field_label = {}
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
    formDesign() {
      if (this.object.design_form) {
        setTimeout(() => {
          this.$refs.makingform.setJSON(JSON.parse(this.object.design_form))
        }, 500)
      }
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
    },
    add_to_query() {
      if (this.field && this.operator && this.value) {
        let value = this.value
        if (this.operator === '.in_' && value.indexOf(',') !== -1) {
          const arr = value.split(',')
          for (var i in arr) {
            arr[i] = "'" + arr[i] + "'"
          }
          value = '[' + arr.join(',') + ']'
        }
        // if (this.operator !== '.in_' || (!value.startsWith('(') && !value.startsWith('['))) {
        //   value = "'" + value + "'"
        // }
        if (this.operator === '.in_' || this.operator === '.like') {
          value = '(' + value + ')'
        }
        this.object.queryparam.push({ operator: this.operator, field: this.field, value: value })
      }
    },
    remove_query(index) {
      this.object.queryparam.splice(index, 1)
    },
    handleChange(val) {
      this.proj_code = val
      this.childPagination = 1
      this.ischildShow = false
      this.classItem = []
      this.text = null
      this.object.biz_code = null
      this.$Apis.bizclass.bizclass_list(this.proj_code, this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          if (_res.length > 0) {
            this.ischildShow = true
            this.classItem = [...this.classItem, ..._res]
            this.childPageCount = response.payload.pagination.pages // 总页数
          }
        }
      })
    },
    loadMore() {
      if (this.isFocus) {
        this.pagination.page++
        if (this.pagination.page <= this.pageCount) {
          this.getList()
        }
      }
      if (this.isChildFocus) {
        this.childPagination++
        if (this.childPagination <= this.childPageCount) {
          this.getChildList()
        }
      }
      if (this.isRoleFocus) {
        this.rolePagination++
        if (this.rolePagination <= this.rolePageCount) {
          this.getRoleList()
        }
      }
      if (this.isOpenRoleFocus) {
        this.openRolePagination++
        if (this.openRolePagination <= this.openRolePageCount) {
          this.getOpenRoleList()
        }
      }
    },
    getList() {
      // 这里是接口请求数据, 带分页条件
      this.$Apis.project.project_list(this.text, this.pagination.page, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.projItem = [...this.projItem, ..._res]
          this.pageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getChildList() {
      this.$Apis.bizclass.bizclass_list(this.object.proj_code, this.text, this.childPagination, this.page_size, true).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.classItem = [...this.classItem, ..._res]
          this.childPageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getRoleList() {
      this.$Apis.role.role_list(null, this.roleText, true, this.rolePagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.roles = [...this.roles, ..._res]
          this.rolePageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    getOpenRoleList() {
      this.$Apis.role.role_list(null, this.roleText, true, this.openRolePagination, this.page_size).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          const _res = response.payload.items
          this.openRoles = [...this.openRoles, ..._res]
          this.openRolePageCount = response.payload.pagination.pages // 总页数
          this.searchLoading = false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        if (this.isFocus) {
          this.text = query
          this.pagination.page = 0
          this.projItem = []
        }
        if (this.isChildFocus) {
          this.childText = query
          this.childPagination = 0
          this.classItem = []
        }
        if (this.isRoleFocus) {
          this.roleText = query
          this.rolePagination = 0
          this.roles = []
        }
        if (this.isOpenRoleFocus) {
          this.roleText = query
          this.openRolePagination = 0
          this.openRoles = []
        }
        this.searchLoading = true
        setTimeout(() => {
          this.loadMore()
        }, 200)
      } else {
        if (this.isFocus) {
          this.projItem = []
          this.text = null
          this.pagination.page = 1
          this.getList()
        }
        if (this.isChildFocus) {
          this.classItem = []
          this.childText = null
          this.childPagination = 1
          this.getChildList()
        }
        if (this.isRoleFocus) {
          this.roles = []
          this.roleText = null
          this.rolePagination = 1
          this.getRoleList()
        }
        if (this.isOpenRoleFocus) {
          this.openRoles = []
          this.roleText = null
          this.openRolePagination = 1
          this.getOpenRoleList()
        }
      }
    },
    rightCheck(selectionKeys, changeKeys) {
      this.tempSelectionKeys = selectionKeys
      if(this.tempSelectionKeys.length > 0){
        this.upDisable = false
        this.downDisable = false
      }else{
        this.upDisable = true
        this.downDisable = true
      }
    },
    upData(){
      this.downDisable = false
      if(this.tempSelectionKeys.length > 1){
        this.$message({
          type: 'warning',
          message: '仅支持单选调顺序'
        });
        return
      }
      let indexNum = 0
      for(let i = 0; i < this.tempSelectionKeys.length; i++){
        indexNum = this.object.fields.indexOf(this.tempSelectionKeys[i])

        if(indexNum > 0){
          this.object.fields.splice(indexNum - 1, 0, this.tempSelectionKeys[i])
          this.object.fields.splice(indexNum + 1, 1)
        }
        if (indexNum === 1) {
          this.upDisable = true
        }
      }
    },
    downData(){
      this.upDisable = false
      if(this.tempSelectionKeys.length > 1){
        this.$message({
          type: 'warning',
          message: '仅支持单选调顺序'
        });
        return
      }
      let indexNum = 0
      for(let i = 0; i < this.tempSelectionKeys.length; i++){
        indexNum = this.object.fields.indexOf(this.tempSelectionKeys[i])
        if(indexNum > -1 && indexNum !== this.object.fields.length - 1){
          this.object.fields.splice(indexNum + 2, 0, this.tempSelectionKeys[i])
          this.object.fields.splice(indexNum, 1)
        }
        if (indexNum === this.object.fields.length - 2) {
          this.downDisable = true
        }
      }
    },
    renderFunc(h, option) {
      return <span title={option.prop}>{option.label}</span>
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
/deep/ .el-transfer-panel__list.is-filterable {
  padding-bottom: 40px;
}
</style>
