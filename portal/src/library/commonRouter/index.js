export default [
  {
    path: '/data',
    name: 'data',
    sub_component: true,
    children: [
      {
        path: '',
        name: 'data',
        component: () => import('@/library/ui/pageData/pagedata'),
        props: (route) => ({
          object_id: route.query.object_id,
          page_id: route.query.page_id,
          pntfk: route.query.pntfk,
          pntid: route.query.pntid,
          pnt_clsname: route.query.pnt_clsname,
          filters: route.query.filters
        }),
        meta: { title: '界面数据', isBack: true }
      },
      {
        path: '/dataByCode',
        name: 'dataByCode',
        component: () => import('@/library/ui/pageData/pageDataByCode'),
        props: (route) => ({
          object_code: route.query.object_code,
          proj_code: route.query.proj_code,
          page_code: route.query.page_code,
          pntfk: route.query.pntfk,
          pntid: route.query.pntid,
          pnt_clsname: route.query.pnt_clsname,
          filters: route.query.filters
        }),
        meta: { title: '界面数据', isBack: true }
      },
      {
        path: 'create',
        name: 'data_create',
        component: () => import('@/library/ui/pageData/pageDataCreate'),
        meta: { title: '创建界面数据', isBack: true }
      },
      {
        path: 'update',
        name: 'data_update',
        component: () => import('@/library/ui/pageData/page_object_update'),
        meta: { title: '更新界面数据', isBack: true }
      },
      {
        path: 'info',
        name: 'data_info',
        component: () => import('@/library/ui/pageData/page_object_update'),
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
  }
]
