<template>
  <div>
    <el-form ref="form" :model="classColumn" :rules="rules" label-width="130px">
      <el-form-item label="栏目名" prop="column_name">
        <el-input id="colName" v-model="classColumn.column_name" />
      </el-form-item>
      <el-form-item label="栏目类型" prop="column_type">
        <el-select id="colType" v-model="classColumn.column_type" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="栏目的类型参数" prop="column_type_args">
        <el-input id="colArgs" v-model="classColumn.column_type_args" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="主键">
            <el-switch v-model="props.primary_key" @change="handleChange" />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="是否为空">
            <el-switch v-model="props.nullable" />
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="默认值">
            <el-input id="default" v-model="props.default" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="栏目的属性" prop="column_props">
        <el-input id="colProps" v-model="classColumn.column_props" type="textarea" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-form-item label="列表显示转换" prop="data_convert">
        <el-input id="convert" v-model="classColumn.data_convert" type="textarea" />
        <div class="tips">
          请填写json格式的数据
        </div>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="列表显示格式化" prop="data_format">
            <el-select id="format" v-model="classColumn.data_format" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in format_func"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="列表显示数据后缀" prop="suffix_letter">
            <el-input id="suffix" v-model="classColumn.suffix_letter" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否启用懒加载" prop="suffix_letter">
        <el-switch v-model="classColumn.deferred" :disabled="props.primary_key" />
      </el-form-item>
      <el-form-item label="栏目描述">
        <el-input id="colComment" v-model="classColumn.column_comment" type="textarea" />
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
  </div>
</template>
<script>
import { instance as Vue } from '@/life-cycle'
const isJSON = Vue.$Utils.validate.isJSON

export default {
  props: {
    repo_name: {
      type: String,
      default: ''
    },
    class_name: {
      type: String,
      default: ''
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
      classColumn: {
        column_name: null,
        column_type: null,
        column_type_args: null,
        column_props: null,
        column_comment: null,
        data_convert: null,
        data_format: null,
        suffix_letter: null,
        deferred: false
      },
      options: [
        {
          value: 'Integer',
          label: 'Integer'
        },
        {
          value: 'String',
          label: 'String'
        },
        {
          value: 'Float',
          label: 'Float'
        },
        {
          value: 'DECIMAL',
          label: 'DECIMAL'
        },
        {
          value: 'Boolean',
          label: 'Boolean'
        },
        {
          value: 'Date',
          label: 'Date'
        },
        {
          value: 'DateTime',
          label: 'DateTime'
        },
        {
          value: 'Time',
          label: 'Time'
        },
        {
          value: 'Enum',
          label: 'Enum'
        },
        {
          value: 'Text',
          label: 'Text'
        },
        {
          value: 'JSONType',
          label: 'JSONType'
        },
        {
          value: 'Unicode',
          label: 'Unicode'
        }
      ],
      format_func: [
        {
          value: 'money',
          label: 'money'
        },
        {
          value: 'file',
          label: 'file'
        },
        {
          value: 'image',
          label: 'image'
        },
        {
          value: 'html',
          label: 'html'
        }
      ],
      rules: {
        column_name: [{ required: true, message: '请输入栏目名', trigger: 'blur' }],
        column_type: [{ required: true, message: '请选择栏目类型', trigger: 'change' }],
        column_type_args: [{ validator: validateJson, trigger: 'blur' }],
        column_props: [{ validator: validateJson, trigger: 'blur' }],
        data_convert: [{ validator: validateJson, trigger: 'blur' }]
      },
      loading: false,
      props: {
        primary_key: false,
        nullable: true,
        default: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      if (this.props.default === '') {
        this.$delete(this.props, 'default')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const repo_name = this.repo_name
          const class_name = this.class_name
          const column_name = this.classColumn.column_name
          const column_type = this.classColumn.column_type
          var column_type_args = this.classColumn.column_type_args
          var column_props = this.classColumn.column_props
          const column_comment = this.classColumn.column_comment
          var data_convert = this.classColumn.data_convert
          const data_format = this.classColumn.data_format
          const suffix_letter = this.classColumn.suffix_letter
          const deferred = this.classColumn.deferred
          if (column_type_args && column_type_args !== 'null') {
            column_type_args = JSON.parse(this.classColumn.column_type_args)
          } else if (column_type_args === 'null' || !column_type_args) {
            column_type_args = {}
          }
          if (column_props && column_props !== 'null') {
            column_props = JSON.parse(this.classColumn.column_props)
            column_props = { ...column_props, ...this.props }
          } else if (column_props === 'null' || !column_props) {
            column_props = { ...this.props }
          }
          if (data_convert && data_convert !== 'null') {
            data_convert = JSON.parse(this.classColumn.data_convert)
          } else if (data_convert === 'null' || !data_convert) {
            data_convert = {}
          }
          this.$Apis.class.column_create(repo_name, class_name, column_name, column_type, column_type_args, column_props, column_comment, data_convert, data_format, suffix_letter, deferred).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.loading = false
              this.$alert('新建成功!', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm('form')
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
      this.$refs[formName].resetFields()
      this.$emit('show', false)
    },
    handleChange(val) {
      if (val) {
        this.classColumn.deferred = false
      }
    }
  }
}
</script>
