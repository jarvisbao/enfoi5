import pageFooter from './pageFooter.vue'
import GenerateFormMobile from './FormMakingMobile/GenerateFormMobile.vue'
import pageDataMobile from './pageDataMobile/pageData'
import pageDataMobileByCode from './pageDataMobile/pageDataByCode'
// import exportData from './pageData/components/exportData'
import methodBatchEdit from './pageDataMobile/components/methodBatchEdit'
// import setQuery from './pageData/components/setQuery'
import portalWidget from './portalWidget/index'
import overlayLoading from './overlayLoading'
import pageNavBar from './pageDataMobile/components/navBar'
import topOtherMethods from './pageDataMobile/components/topOtherMethods'
import tableList from './pageDataMobile/components/tableList'

import '@/library/styles/form-making-cover.scss'
import '@/library/styles/form-making-index.scss'
import '@/library/styles/form-making-editor.scss'

const components = [
  pageFooter,
  // exportData,
  methodBatchEdit,
  // setQuery,
  portalWidget,
  GenerateFormMobile,
  pageDataMobile,
  pageDataMobileByCode,
  overlayLoading,
  pageNavBar,
  topOtherMethods,
  tableList
]

components.forEach((component) => {
  component.install = function(Vue) {
    Vue.component(component.name, (resolve) => {
      resolve(component)
    })
  }
})
export default components
