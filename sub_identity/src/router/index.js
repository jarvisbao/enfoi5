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
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'user_list',
        component: () => import('@/views/user/user_list'),
        meta: { title: '用户列表', isBack: false }
      },
      {
        path: 'info',
        name: 'user_info',
        component: () => import('@/views/user/user_info'),
        meta: { title: '用户信息', isBack: true }
      }
    ]
  },

  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'role',
    meta: { title: '角色管理', icon: 'role' },
    children: [
      {
        path: 'list',
        name: 'role_list',
        component: () => import('@/views/role/role_list'),
        meta: { title: '角色列表', isBack: false }
      },
      {
        path: 'info',
        name: 'role_info',
        component: () => import('@/views/role/role_info'),
        meta: { title: '角色信息', isBack: true }
      }
    ]
  },

  {
    path: '/organize',
    component: Layout,
    redirect: '/organize/list',
    name: 'organize',
    meta: { title: '组织机构管理', icon: 'organize' },
    children: [
      {
        path: 'list',
        name: 'organize_list',
        component: () => import('@/views/organize/organize_list'),
        meta: { title: '机构列表', isBack: false }
      },
      {
        path: 'info',
        name: 'organize_info',
        component: () => import('@/views/organize/organize_info'),
        meta: { title: '机构信息', isBack: true }
      },
      {
        path: 'group_info',
        name: 'organize_group_info',
        component: () => import('@/views/organize/organize_group_info'),
        meta: { title: '机构群组信息', isBack: true }
      },
      {
        path: 'position/members',
        name: 'position_members',
        component: () => import('@/views/organize/orgPositionMembers'),
        meta: { title: '职位授权列表', isBack: true }
      }
    ]
  },

  {
    path: '/group',
    component: Layout,
    redirect: '/group/list',
    name: 'group',
    meta: { title: '群组管理', icon: 'group' },
    children: [
      {
        path: 'list',
        name: 'group_list',
        component: () => import('@/views/group/group_list'),
        meta: { title: '群组列表', isBack: false }
      },
      {
        path: 'info',
        name: 'group_info',
        component: () => import('@/views/group/group_info'),
        meta: { title: '群组信息', isBack: true }
      }
    ]
  },

  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/list',
    name: 'resource',
    meta: { title: '资源', icon: 'resource' },
    children: [
      {
        path: 'list',
        name: 'resource_list',
        component: () => import('@/views/resource/resource_list'),
        meta: { title: '资源列表', isBack: false }
      },
      {
        path: 'assignments/list',
        name: 'assignments_list',
        component: () => import('@/views/resource/assignments_list'),
        meta: { title: '授权列表', isBack: true }
      },
      {
        path: 'info',
        name: 'resource_info',
        component: () => import('@/views/resource/resource_info'),
        meta: { title: '资源信息', isBack: true }
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    component: Layout,
    redirect: '/menu/list',
    meta: { title: '菜单管理', isBack: false },
    children: [
      {
        path: 'list',
        name: 'menu_list',
        component: () => import('@/views/menu/menu_list'),
        meta: { title: '菜单列表', isBack: false }
      },
      {
        path: 'info',
        name: 'menu_info',
        component: () => import('@/views/menu/menu_info'),
        meta: { title: '菜单信息', isBack: true }
      },
      {
        path: 'list/mobile',
        name: 'mobile_menu_list',
        component: () => import('@/views/menu/menu_list'),
        meta: { title: '手机菜单列表', isBack: false },
        props: {
          device: 'mobile'
        }
      },
      {
        path: 'info/mobile',
        name: 'mobile_menu_info',
        component: () => import('@/views/menu/menu_info'),
        meta: { title: '手机菜单信息', isBack: true },
        props: {
          device: 'mobile'
        }
      }
    ]
  },
  {
    path: '/wdget',
    name: 'wdget',
    component: Layout,
    redirect: '/wdget/list',
    meta: { title: '部件管理', isBack: false },
    children: [
      {
        path: 'list',
        name: 'widget_list',
        component: () => import('@/views/homepage/widgetList'),
        meta: { title: '部件列表', isBack: false }
      },
      {
        path: 'create',
        name: 'widget_create',
        component: () => import('@/views/homepage/widgetCreate'),
        meta: { title: '新建部件', isBack: true }
      },
      {
        path: 'edit',
        name: 'widget_edit',
        component: () => import('@/views/homepage/widgetUpdate'),
        meta: { title: '更新部件', isBack: true }
      }
    ]
  },
  {
    path: '/switch',
    name: 'switch',
    component: Layout,
    children: [
      {
        path: '/switch',
        redirect: '/switchs',
        name: 'switch_list',
        component: () => import('@/views/switch/index'),
        meta: { title: 'switch', icon: '', isBack: false },
        children: [
          {
            path: '/switchs',
            name: 'switchs',
            component: () => import('@/views/switch/switch_vlan'),
            meta: { title: 'switch', breadcrumb: false, isBack: false }
          }
        ]
      }
    ]
  },
  {
    path: '/params',
    name: 'SysParams',
    component: Layout,
    children: [
      {
        path: '/params',
        name: 'SysParams',
        component: () => import('@/views/SysParam/SysParams'),
        meta: { title: '平台参数', icon: '', isBack: false }
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
  {
    path: '/mobile_menu',
    name: 'mobile',
    component: Layout,
    redirect: '/mobile_menu/list',
    children: [
      {
        path: 'list',
        name: 'mobile_menu_list',
        component: () => import('@/views/mobileMenu'),
        meta: { title: '移动端菜单' }
      },
      {
        path: 'sublist',
        name: 'mobile_submenu_list',
        component: () => import('@/views/mobileMenu'),
        props: { isSub: true },
        meta: { title: '子菜单', isBack: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
