<template>
  <el-row
    v-if="show"
    :class="{
      [element.options.customClass]: element.options.customClass?true: false
    }"
    :ref="element.model"
    :gutter="element.options.gutter || 0"
    :justify="element.options.justify"
    :align="element.options.align"
    :id="colId + '-' + element.model"
    :type="element.options.flex ? 'flex' : ''"
  >
    <el-col
      v-for="(item, index) in element.columns"
      :key="index"
      :xs="item.options ? (element.options.responsive ? item.options.xs || 0 : item.options.span || 0) : (element.options.responsive ? item.xs || 0 : item.span || 0)"
      :sm="item.options ? (element.options.responsive ? item.options.sm || 0 : item.options.span || 0) : (element.options.responsive ? item.sm || 0 : item.span || 0)"
      :md="item.options ? (element.options.responsive ? item.options.md || 0 : item.options.span || 0) : (element.options.responsive ? item.md || 0 : item.span || 0)"
      :lg="item.options ? (element.options.responsive ? item.options.lg || 0 : item.options.span || 0) : (element.options.responsive ? item.lg || 0 : item.span || 0)"
      :xl="item.options ? (element.options.responsive ? item.options.xl || 0 : item.options.span || 0) : (element.options.responsive ? item.xl || 0 : item.span || 0)"
      :offset="item.options ? item.options.offset : 0"
      :push="item.options ? item.options.push : 0"
      :pull="item.options ? item.options.pull : 0"
    >
      <template v-for="col in item.list">
        <generate-col-item
          v-if="col.type == 'grid'"
          :key="col.key"
          :model.sync="dataModels"
          :rules="rules"
          :element="col"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :form-id="colId"
          :design-fields="designFields"
          :helpers="helpers"
          :form-value="formValue"
          @input-change="onInputChange"
        >
          <template v-for="blank in blanks" v-slot:[blank.name]="scope">
            <slot :name="blank.name" :model="scope.model" />
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="col.type == 'tabs'"
          :key="col.key"
          :model.sync="dataModels"
          :rules="rules"
          :element="col"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :form-id="colId"
          :design-fields="designFields"
          :helpers="helpers"
          :form-value="formValue"
          @input-change="onInputChange"
        >
          <template v-for="blank in blanks" v-slot:[blank.name]="scope">
            <slot :name="blank.name" :model="scope.model" />
          </template>
        </generate-tab-item>

        <generate-report
          v-else-if="col.type == 'report'"
          :key="col.key"
          :model.sync="dataModels"
          :rules="rules"
          :element="col"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :form-id="colId"
          :design-fields="designFields"
          :helpers="helpers"
          :form-value="formValue"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-form-item
          v-else
          :key="col.key"
          :models.sync="dataModels"
          :rules="rules"
          :widget="col"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :form-id="colId"
          :design-fields="designFields"
          :helpers="helpers"
          :form-value="formValue"
          @input-change="onInputChange"
        >
          <template v-for="blank in blanks" v-slot:[blank.name]="scope">
            <slot :name="blank.name" :model="scope.model" />
          </template>
        </generate-form-item>
      </template>
    </el-col>
  </el-row>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
import GenerateTabItem from './GenerateTabItem'
import GenerateReport from './GenerateReport'
import Vue from 'vue'
import elementIcon from '../iconChoose/elementIcon'

export default {
  name: 'GenerateColItem',
  components: {
    GenerateFormItem,
    GenerateTabItem,
    GenerateReport
  },
  props: ['element', 'model', 'rules', 'remote', 'blanks', 'display', 'edit', 'formId', 'designFields', 'helpers', 'formValue'],
  data() {
    return {
      dataModels: this.model,
      show: this.display[this.element.model],
      colId: this.formId ? this.formId : ''
    }
  },
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.dataModels = this.model
      }
    },
    dataModels: {
      deep: true,
      handler(val) {
        this.$emit('update:model', val)
      }
    }
  },
  mounted() {
    Object.assign(this.helpers.itemRefs, this.$refs)
    this.helpers.itemNameModels[this.element.model] = this.element.name
    this.helpers.itemInstances[this.element.model] = this
  },
  destroyed() {
  },
  methods: {
    onInputChange(value, field) {
      this.$emit('input-change', value, field)
    }
  }
}
</script>
