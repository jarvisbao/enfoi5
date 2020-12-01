export default [
  {
    path: '/data',
    sub_component: true,
    children: [
      {
        path: '',
        name: 'data',
        component: () => import('@/library/ui/pageDataMobile/pageData'),
        props: (route) => (route.query),
        meta: { title: '界面数据', isBack: true }
      },
      {
        path: '/dataByCode',
        name: 'dataByCode',
        component: () => import('@/library/ui/pageDataMobile/pageDataByCode'),
        props: (route) => (route.query),
        meta: { title: '界面数据', isBack: true }
      }
    ]
  },
  {
    path: '/data/create',
    sub_component: true,
    children: [
      {
        path: '',
        name: 'data_create',
        component: () => import('@/library/ui/pageDataMobile/pageDataCreate'),
        meta: { title: '创建界面数据', isBack: true }
      }
    ]
  },
  {
    path: '/data/update',
    sub_component: true,
    children: [
      {
        path: '',
        name: 'data_update',
        component: () => import('@/library/ui/pageDataMobile/page_object_update'),
        meta: { title: '更新界面数据', isBack: true }
      }
    ]
  },
  {
    path: '/data/info',
    sub_component: true,
    children: [
      {
        path: '',
        name: 'data_info',
        component: () => import('@/library/ui/pageDataMobile/page_object_update'),
        props: { edit: false },
        meta: { title: '查看界面数据', isBack: true }
      }
    ]
  },
  {
    path: '/404',
    sub_component: true,
    children: [
      { path: '/404', component: () => import('@/library/ui/404'), hidden: true, alias: '/404' }
    ]
  },
  {
    path: '/401',
    sub_component: true,
    children: [
      { path: '/401', component: () => import('@/library/ui/401'), hidden: true, alias: '/401' }
    ]
  },
  {
    path: '/grid',
    sub_component: true,
    children: [
      {
        path: '/grid',
        name: 'grid',
        component: () => import('@/library/grid/index')
      }
    ]
  }
]
