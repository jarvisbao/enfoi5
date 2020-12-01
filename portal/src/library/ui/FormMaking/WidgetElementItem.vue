<template>
  <span>
    <template v-if="element.type == 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
        :show-password="element.options.showPassword"
      >
        <template v-if="element.options.unit" slot="append">{{ element.options.unit }}</template>
      </el-input>
    </template>

    <template v-if="element.type == 'textarea'">
      <el-input
        v-model="element.options.defaultValue"
        :rows="5"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
        :placeholder="element.options.placeholder"
        type="textarea"
      />
    </template>

    <template v-if="element.type == 'number'">
      <div class="fm-nuit-box">
        <el-input-number
          v-model="element.options.defaultValue"
          :disabled="element.options.disabled"
          :controls-position="element.options.controlsPosition"
          :style="{width: isTable ? '100%' : element.options.width}"
        />
        <span v-if="element.options.unit" class="fm-unit">{{ element.options.unit }}</span>
      </div>
    </template>

    <template v-if="element.type == 'radio'">
      <el-radio-group
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-radio
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type == 'checkbox'">
      <el-checkbox-group
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-checkbox
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type == 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrow-control="element.options.arrowControl"
        :style="{width: isTable ? '100%' : element.options.width}"
      />
    </template>

    <template v-if="element.type == 'date'">
      <el-date-picker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :default-value="element.options.defaultValue"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{width: isTable ? '100%' : element.options.width}"
      />
    </template>

    <template v-if="element.type == 'rate'">
      <el-rate
        v-model="element.options.defaultValue"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf"
        :show-score="element.options.showScore"
      />
    </template>

    <template v-if="element.type == 'color'">
      <el-color-picker
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :show-alpha="element.options.showAlpha"
      />
    </template>

    <template v-if="element.type == 'select'">
      <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: isTable ? '100%' : element.options.width}"
      >
        <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value" />
      </el-select>
    </template>

    <template v-if="element.type=='switch'">
      <el-switch
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
      />
    </template>

    <template v-if="element.type=='slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :format-tooltip="formatTooltip"
        :style="{width: isTable ? '100%' : element.options.width}"
      />
    </template>

    <template v-if="element.type=='imgupload'">
      <fm-upload
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :style="{'width': isTable ? '100%' : element.options.width}"
        :width="element.options.size.width"
        :height="element.options.size.height"
        token="xxx"
        domain="xxx"
      />
    </template>

    <template v-if="element.type == 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: isTable ? '100%' : element.options.width}"
        :options="element.options.remoteOptions"
      />
    </template>

    <template v-if="element.type == 'editor'">
      <vue-editor
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width, cursor: element.options.disabled ? 'no-drop' : '', backgroundColor: element.options.disabled ? '#F5F7FA' : ''}"
        :editor-toolbar="element.options.customToolbar"
        :disabled="element.options.disabled"
        class="fm-editor"
      />
    </template>

    <template v-if="element.type=='blank'">
      <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
    </template>

    <template v-if="element.type == 'component'">
      <component :is="element.options.isQuote ? element.options.name : `component-${element.key}`" :key="key" v-model="element.options.defaultValue" />
    </template>

    <template v-if="element.type == 'custom'">
      <component v-if="element.component" :is="element.component.name" v-model="element.options.defaultValue" />
      <component v-else :is="element.el" v-model="element.options.defaultValue" />
    </template>

    <template v-if="element.type == 'text'">
      <span>{{ element.options.defaultValue }}</span>
    </template>

    <template v-if="element.type == 'html'">
      <span v-html="element.options.defaultValue" />
    </template>

    <template v-if="element.type == 'fileupload'">
      <el-upload
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
        :limit="element.options.limit"
        action="https://jsonplaceholder.typicode.com/posts/"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div v-if="element.options.tip" slot="tip" class="el-upload__tip">{{ element.options.tip }}</div>
      </el-upload>
    </template>

    <template v-if="element.type == 'money'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      />
    </template>

    <template v-if="element.type == 'carousel'">
      <el-carousel
        :height="element.options.height"
        :trigger="element.options.trigger"
        :arrow="element.options.arrow"
        :direction="element.options.direction"
      />
    </template>

    <template v-if="element.type == 'select2'">
      <el-button type="primary">选择</el-button>
    </template>
  </span>
</template>

<script>
import FmUpload from './Upload'
import { VueEditor } from 'vue2-editor'
import Vue from 'vue'

export default {
  components: {
    FmUpload,
    VueEditor
  },
  props: ['element', 'isTable'],
  data() {
    return {
      key: new Date().getTime()
    }
  },
  watch: {
    'element.options.template': function(val) {
      Vue.component(`component-${this.element.key}`, {
        props: ['dataModel'],
        template: `<span>${val}</span>`
      })

      this.key = new Date().getTime()
      // 如果不是在主应用中打开表单设计器，需先把要注册的信息传入子应用后再注册
      if (this.$actions) {
        const data = {
          name: `component-${this.element.key}`,
          component: `<span>${val}</span>`,
          props: ['dataModel']
        }
        this.$actions.setGlobalState({
          rsgComponent: data
        })
      }
    },
    'element.options.type': function(val) {
      if (val === 'dates') {
        this.element.options.defaultValue = null
      } else {
        this.element.options.defaultValue = new Date()
      }
    }
  },
  created() {
    if (this.element.type === 'component' && !this.element.options.isQuote) {
      Vue.component(`component-${this.element.key}`, {
        template: `<span>${this.element.options.template}</span>`,
        props: ['dataModel']
      })
      // 如果不是在主应用中打开表单设计器，需先把要注册的信息传入子应用后再注册
      if (this.$actions) {
        const data = {
          name: `component-${this.element.key}`,
          component: `<span>${this.element.options.template}</span>`,
          props: ['dataModel']
        }
        this.$actions.setGlobalState({
          rsgComponent: data
        })
      }
    }
  },
  methods: {
    formatTooltip(val) {
      return val + this.element.options.unit
    }
  }
}
</script>
