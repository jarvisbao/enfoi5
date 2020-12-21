import MakingForm from './FormMaking/Container.vue'
import GenerateForm from './FormMaking/GenerateForm.vue'
import PageData from './pageData/pagedata.vue'
import AlifontIcon from './iconChoose/alifontIcon.vue'
import ElementIcon from './iconChoose/elementIcon.vue'
import exportData from './pageData/components/exportData'
import methodBatchEdit from './pageData/components/methodBatchEdit'
import setQuery from './pageData/components/setQuery'
import topOtherMethods from './pageData/components/topOtherMethods'
import tableList from './pageData/components/tableList'
import portalWidget from './portalWidget/index'

import '@/library/styles/form-making-cover.scss'
import '@/library/styles/form-making-index.scss'
import '@/library/styles/form-making-editor.scss'

const components = [
  MakingForm,
  GenerateForm,
  PageData,
  AlifontIcon,
  ElementIcon,
  exportData,
  methodBatchEdit,
  setQuery,
  topOtherMethods,
  tableList,
  portalWidget
]

components.forEach((component) => {
  component.install = function(Vue) {
    Vue.component(component.name, (resolve) => {
      resolve(component)
    })
  }
})
export default components

