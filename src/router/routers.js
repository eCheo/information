import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // {
  //   path: '/join',
  //   name: 'join',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   }
  // },
  // {
  //   path: '/message',
  //   name: 'message',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'message_page',
  //       name: 'message_page',
  //       meta: {
  //         icon: 'md-notifications',
  //         title: '消息中心'
  //       },
  //       component: () => import('@/view/single-page/message/index.vue')
  //     }
  //   ]
  // },
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '资讯管理'
    },
    component: Main,
    children: [
      {
        path: 'count_to_page',
        name: 'count_to_page',
        meta: {
          icon: 'md-trending-up',
          title: '审核创作者领域标签'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      },
      {
        path: 'drag',
        name: 'drag',
        meta: {
          hideInBread: true
        },
        children: [
          {
            path: 'drag_list_page',
            name: 'drag_list_page',
            meta: {
              icon: 'ios-infinite',
              title: '审核发布'
            },
            component: () => import('@/view/components/drag-list/drag-list.vue')
          },
          {
            path: 'addArticle',
            name: 'addArticle',
            meta: {
              hideInMenu: true,
              title: '发布文章'
            },
            component: () => import('@/view/components/drag-list/addArticle.vue')
          }
        ],
        component: parentView
      }
    ]
  },
  {
    path: '/update',
    name: 'update',
    meta: {
      icon: 'md-cloud-upload',
      title: '积分管理中心'
    },
    component: Main,
    children: [
      {
        path: 'update_table_page',
        name: 'update_table_page',
        meta: {
          icon: 'ios-document',
          title: '规则设置'
        },
        component: () => import('@/view/update/update-table.vue')
      },
      {
        path: 'getIntegral',
        name: 'getIntegral',
        meta: {
          icon: 'md-clipboard',
          title: '积分获取'
        },
        component: () => import('@/view/update/getIntegral.vue')
      },
      {
        path: 'getIntegralChange',
        name: 'getIntegralChange',
        meta: {
          icon: 'md-clipboard',
          title: '积分变更'
        },
        component: () => import('@/view/update/getIntegralChange.vue')
      },
      {
        path: 'getIntegralDetailed',
        name: 'getIntegralDetailed',
        meta: {
          icon: 'md-clipboard',
          title: '会员积分明细'
        },
        component: () => import('@/view/update/getIntegralDetailed.vue')
      },
      {
        path: 'shop',
        name: 'shop',
        meta: {
          icon: 'md-clipboard',
          title: ''
        },
        children: [
          {
            path: 'shoppingManger',
            name: 'shoppingManger',
            meta: {
              icon: 'md-clipboard',
              title: '商城管理'
            },
            component: () => import('@/view/update/shoppingManger.vue')
          },
          {
            path: 'shoppingAdd',
            name: 'shoppingAdd',
            meta: {
              title: '添加商品',
              hideInMenu: true
            },
            component: () => import('@/view/update/shoppingAdd.vue')
          }
        ],
        component: parentView
      },
      {
        path: 'ordermanage',
        name: 'ordermanage',
        meta: {
          icon: 'md-clipboard',
          title: '订单管理',
          showAlways: true
        },
        children: [
          {
            path: 'orderdetails',
            name: 'orderdetails',
            meta: {
              icon: 'md-clipboard',
              title: '订单详情'
            },
            component: () => import('@/view/update/orderdetails.vue')
          },
        ],
        component: () => import('@/view/update/orderManage.vue')
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: '客服管理'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '消息管理'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'commentmanage',
        name: 'commentManage',
        meta: {
          icon: 'md-download',
          title: '评论管理'
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '用户反馈'
        }
        // component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '举报列表'
        }
        // component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/tools_methods',
    name: 'tools_methods',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'tools_methods_page',
        name: 'tools_methods_page',
        meta: {
          icon: 'ios-hammer',
          title: '工具方法',
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/tools-methods/tools-methods.vue')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/directive',
    name: 'directive',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'directive_page',
        name: 'directive_page',
        meta: {
          icon: 'ios-navigate',
          title: '指令'
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
