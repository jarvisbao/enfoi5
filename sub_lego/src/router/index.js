import Layout from '@/views/layout/Layout'

export const asyncRoutes = []
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/retrieve_password',
    component: () => import('@/views/login/retrievePassword'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    name: 'index',
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/repository',
    name: 'repository',
    component: Layout,
    children: [
      {
        path: '/repository',
        redirect: '/repository/list',
        name: 'repository_list',
        component: () => import('@/views/lego/index'),
        meta: { title: '仓库', icon: '', isBack: false },
        children: [
          {
            path: 'list',
            name: 'repository_list',
            component: () => import('@/views/lego/repository_list'),
            meta: { title: '仓库', icon: '', breadcrumb: false, isBack: false }
          },
          {
            path: 'repository_info',
            name: 'repository_info',
            component: () => import('@/views/lego/repository_info'),
            meta: { title: '仓库信息', isBack: true }
          },
          {
            path: 'info',
            name: 'repo_class_info',
            component: () => import('@/views/lego/class/repo_class_info'),
            meta: { title: '数据类信息', isBack: true }
          },
          {
            path: 'view_info',
            name: 'repo_view_info',
            component: () => import('@/views/lego/view/repo_view_info'),
            props: { is_view: true },
            meta: { title: '视图信息', isBack: true }
          }
        ]
      }
    ]

  },
  {
    path: '/project',
    name: 'project',
    component: Layout,
    children: [
      {
        path: '/project',
        redirect: '/project/list',
        name: 'project_list',
        component: () => import('@/views/project/index'),
        meta: { title: '项目', icon: '', isBack: false },
        children: [
          {
            path: 'list',
            name: 'project_list',
            component: () => import('@/views/project/project_list'),
            meta: { title: '项目', icon: '', breadcrumb: false, isBack: false }
          },
          {
            path: 'bizclass',
            name: 'project_bizclass',
            component: () => import('@/views/project/project_bizclass'),
            meta: { title: '业务类', breadcrumb: false, isBack: true }
          },
          {
            path: 'info',
            name: 'bizclass_info',
            component: () => import('@/views/project/bizclass_info'),
            meta: { title: '业务类信息', isBack: true }
          },
          {
            path: '/object',
            redirect: '/object/list',
            name: 'object',
            component: () => import('@/views/object/index'),
            meta: { title: '对象定义', icon: '', isBack: true, breadcrumb: false },
            children: [
              {
                path: 'list',
                name: 'object_list',
                component: () => import('@/views/object/object_list'),
                meta: { title: '对象列表', icon: '', breadcrumb: false, isBack: true }
              },
              {
                path: 'create',
                name: 'object_create',
                component: () => import('@/views/object/objectCreate'),
                meta: { title: '创建对象', isBack: true }
              },
              {
                path: 'update',
                name: 'object_update',
                component: () => import('@/views/object/objectUpdate'),
                meta: { title: '更新对象', isBack: true }
              },
              {
                path: 'info',
                name: 'object_info',
                props: { objView: true },
                component: () => import('@/views/object/objectUpdate'),
                meta: { title: '查看对象', isBack: true }
              },
              {
                path: '/operate',
                redirect: '/operate/list',
                name: 'operate',
                component: () => import('@/views/object/operate/index'),
                meta: { title: '操作定义', icon: '', isBack: true },
                children: [
                  {
                    path: 'list',
                    name: 'operate',
                    component: () => import('@/views/object/operate/operate_list'),
                    meta: { title: '操作列表', icon: '', breadcrumb: false, isBack: true }
                  },
                  {
                    path: 'create',
                    name: 'operate_create',
                    component: () => import('@/views/object/operate/operateCreate'),
                    meta: { title: '新建操作', isBack: true }
                  },
                  {
                    path: 'update',
                    name: 'operate_update',
                    component: () => import('@/views/object/operate/operateUpdate'),
                    meta: { title: '更新操作', isBack: true }
                  }
                ]
              },
              {
                path: '/page',
                redirect: '/page/list',
                name: 'page',
                component: () => import('@/views/object/page/index'),
                meta: { title: '界面定义', icon: '', isBack: true },
                children: [
                  {
                    path: 'list',
                    name: 'page_list',
                    component: () => import('@/views/object/page/page_list'),
                    meta: { title: '界面列表', icon: '', breadcrumb: false, isBack: true }
                  },
                  {
                    path: 'create',
                    name: 'page_create',
                    component: () => import('@/views/object/page/pageCreate'),
                    meta: { title: '创建界面', isBack: true }
                  },
                  {
                    path: 'update',
                    name: 'page_update',
                    component: () => import('@/views/object/page/pageUpdate'),
                    meta: { title: '更新界面', isBack: true }
                  },
                  {
                    path: 'info',
                    name: 'page_info',
                    component: () => import('@/views/object/page/page_info'),
                    meta: { title: '查看界面', isBack: true }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/user-center',
    component: Layout,
    children: [
      {
        path: '/user-center',
        name: 'user-center',
        component: () => import('@/views/userCenter/index'),
        meta: { title: '个人中心', icon: 'user_center' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
