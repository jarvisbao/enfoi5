import pageFooter from './pageFooter.vue'
import GenerateFormMobile from './FormMakingMobile/GenerateFormMobile.vue'
import pageDataMobile from './pageDataMobile/pageData'
import pageDataMobileByCode from './pageDataMobile/pageDataByCode'
// import PageData from './pageData/pagedata.vue'
import AlifontIcon from './iconChoose/alifontIcon.vue'
import ElementIcon from './iconChoose/elementIcon.vue'
// import exportData from './pageData/components/exportData'
import methodBatchEdit from './pageDataMobile/components/methodBatchEdit'
// import setQuery from './pageData/components/setQuery'
import portalWidget from './portalWidget/index'
import recall from './moduleForm/recall'
import countersignVote from './moduleForm/countersignVote'
import countersignResult from './moduleForm/countersignResult'
import backToNode from './moduleForm/backToNode'
import userSelect from './moduleForm/userSelect'

import '@/library/styles/form-making-cover.scss'
import '@/library/styles/form-making-index.scss'
import '@/library/styles/form-making-editor.scss'

const components = [
  pageFooter,
  // PageData,
  AlifontIcon,
  ElementIcon,
  // exportData,
  methodBatchEdit,
  // setQuery,
  portalWidget,
  recall,
  countersignVote,
  countersignResult,
  backToNode,
  userSelect,
  GenerateFormMobile,
  pageDataMobile,
  pageDataMobileByCode,
]

components.forEach((component) => {
  component.install = function(Vue) {
    Vue.component(component.name, (resolve) => {
      resolve(component)
    })
  }
})
export default components
