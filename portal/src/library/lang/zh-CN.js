import fmZh from './fm-zh'

export default {
  enfo: {
    actions: {
      create: '新建',
      export: '导出',
      save: '保存',
      back: '返回'
    },
    layout: {
      column: {
        two: '两列',
        three: '三列'
      },
      msg: '设置左右区域的宽度，列数加起来总数为24',
      label: '栅格占据的列数'
    },
    errorMessage: {
      widget: {
        title: '请输入标题',
        url: '请输入内容url'
      }
    },
    // formMaking 语言设置
    ...fmZh
  }
}
