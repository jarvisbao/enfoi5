<template>
  <div class="app-container">
    <el-form ref="pageForm" :model="page" :rules="rules" label-width="170px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="页面名称" prop="page_name">
            <el-input id="pageName" v-model="page.page_name" />
          </el-form-item>
          <el-form-item label="页面代码" prop="page_code">
            <el-input id="pageCode" v-model="page.page_code" />
          </el-form-item>
          <el-form-item label="页面显示字段" prop="fields">
            <el-transfer
              id="pageFields"
              v-model="page.fields"
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
            <el-select id="pageExtFields" v-model="page.ext_fields" multiple clearable filterable>
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
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item label="允许新建">
                <el-switch v-model="page.can_create" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许编辑">
                <el-switch v-model="page.can_update" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许删除">
                <el-switch v-model="page.can_delete" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许查看">
                <el-switch v-model="page.can_view" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="允许导出">
                <el-switch v-model="page.can_export" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="排序字段" prop="orderby">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-select id="orderby" v-model="page.orderby" clearable filterable>
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
                <el-select id="field" v-model="field" clearable filterable>
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
            <div v-for="(item,index) in page.queryparam" :key="index" class="text item">
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
          <el-form-item label="用途描述">
            <el-input id="description" v-model="page.description" />
          </el-form-item>
        </el-tab-pane>
        <!-- 结果:results -->
        <el-tab-pane :lazy="true" :disabled="page.save_noscript?true:false" :class="{'is-disabled': page.save_noscript}" label="扩展脚本" name="second">
          <!-- <el-form-item label="查看前(查看数据时数据查询出来后未做任何处理前)脚本：" prop="pybeforeview">
            <python-codemirror :prop_code="pybeforeview" :placeholder="code_placeholder" :code-mode="mode" @get_code="get_code($event)"/>
          </el-form-item> -->
          <el-form-item label="查询前(数据库查询前)脚本：" prop="pybeforelist">
            <python-codemirror :prop_code="page.pybeforelist" :placeholder="code_placeholder" :code-mode="mode" param-code="pybeforelist" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: filters,text
            </div>
          </el-form-item>
          <el-form-item label="查询后(数据查询出来后列表界面出现前)脚本：" prop="pyafterlist">
            <python-codemirror :prop_code="page.pyafterlist" :placeholder="code_placeholder" :code-mode="mode" param-code="pyafterlist" @get_code="get_code($event)" />
            <div class="tips">
              可用变量: results
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button id="submit" :loading="loading" type="danger" @click="submitForm('pageForm')">
          立即修改
        </el-button>
        <el-button id="cancel" plain @click="resetForm('pageForm')">
          返回
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import pythonCodemirror from '@/components/pythonCodemirror'
import { instance as Vue } from '@/life-cycle'
const isJSON = Vue.$Utils.validate.isJSON

export default {
  components: {
    pythonCodemirror
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
      rules: {
        page_name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
        page_code: [{ required: true, message: '请输入页面代码', trigger: 'blur' }],
        props: [{ validator: validateJson, trigger: 'blur' }]
      },
      loading: false,
      page: {
        page_name: null,
        page_code: null,
        fields: [],
        ext_fields: null,
        props: null,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_export: false,
        pybeforelist: '',
        pyafterlist: '',
        queryparam: []
      },
      single_methods: [], // 单条操作
      other_methods: [], // 其他操作
      options: [],
      fields: [],
      dialogVisible: false,
      mode: 'python',
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
      field_label: {},
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
      text: null,
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      pageCount: 1,
      searchLoading: false,
      page_id: null,
      upDisable: false,
      downDisable: false,
      tempSelectionKeys: []
    }
  },
  created() {
    this.get_page_id()
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    get_page_id() {
      if ('page_id' in this.$route.query) {
        this.page_id = this.$route.query.page_id
        return this.page_id
      } else {
        return null
      }
    },
    fetchData() {
      this.loading = true
      this.$Apis.object.page_info(this.page_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.page = response.payload
          this.page.pybeforelist = response.payload.pybeforelist ? response.payload.pybeforelist : ''
          this.page.pyafterlist = response.payload.pyafterlist ? response.payload.pyafterlist : ''
          this.desc = false
          if (this.page.orderby && this.page.orderby.startsWith('-')) {
            this.desc = true
            this.page.orderby = this.page.orderby.slice(1)
          }
          if (!this.page.queryparam) {
            this.page.queryparam = []
          }
          this.page.props = JSON.stringify(this.page.props)
          this.single_methods = response.payload.single_methods === null || !response.payload.single_methods ? [] : response.payload.single_methods
          this.other_methods = response.payload.other_methods === null || !response.payload.other_methods ? [] : response.payload.other_methods
          this.getFields(this.page.object_id)
          this.getMethods(this.page.object_id)
          this.loading = false
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const page_id = this.page_id
          const page_name = this.page.page_name
          const page_code = this.page.page_code
          const fields = this.page.fields
          const ext_fields = this.page.ext_fields
          const can_create = this.page.can_create
          const can_update = this.page.can_update
          const can_delete = this.page.can_delete
          const can_view = this.page.can_view
          const can_export = this.page.can_export
          const description = this.page.description
          const pybeforelist = this.page.pybeforelist
          const pyafterlist = this.page.pyafterlist
          const single_methods = this.single_methods
          const other_methods = this.other_methods
          const queryparam = this.page.queryparam
          var orderby = this.page.orderby
          if (this.desc) {
            orderby = '-' + orderby
          }
          let props = this.page.props
          if (props && props !== 'null') {
            props = JSON.parse(this.page.props)
          } else if (props === 'null' || !props) {
            props = {}
          }
          this.$Apis.object.page_edit(page_id, page_code, page_name, fields, ext_fields, props, can_create, can_update, can_delete, can_view, can_export,
            orderby, description,
            pybeforelist,
            pyafterlist,
            single_methods,
            other_methods,
            queryparam).then(response => {
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
    getFields(object_id) {
      this.field_label = {}
      this.$Apis.object.get_headers(object_id, true).then(response => {
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
    get_code($event) {
      for (var key in $event) {
        eval('this.page[key] = $event[key]')
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
        this.page.queryparam.push({ operator: this.operator, field: this.field, value: value })
      }
    },
    remove_query(index) {
      this.page.queryparam.splice(index, 1)
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
        indexNum = this.page.fields.indexOf(this.tempSelectionKeys[i])

        if(indexNum > 0){
          this.page.fields.splice(indexNum - 1, 0, this.tempSelectionKeys[i])
          this.page.fields.splice(indexNum + 1, 1)
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
        indexNum = this.page.fields.indexOf(this.tempSelectionKeys[i])
        if(indexNum > -1 && indexNum !== this.page.fields.length - 1){
          this.page.fields.splice(indexNum + 2, 0, this.tempSelectionKeys[i])
          this.page.fields.splice(indexNum, 1)
        }
        if (indexNum === this.page.fields.length - 2) {
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
