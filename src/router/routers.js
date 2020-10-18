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
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '资讯管理',
      notCache: true,
      notCache: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'drag',
        name: 'drag',
        meta: {
        },
        children: [
          {
            path: 'drag_list_page',
            name: 'drag_list_page',
            meta: {
              icon: 'ios-infinite',
              title: '审核发布',
              notCache: true
            },
            component: () => import('@/view/components/drag-list/drag-list.vue')
          },
          {
            path: 'addArticle',
            name: 'addArticle',
            meta: {
              hideInMenu: true,
              title: '发布文章',
              notCache: true
            },
            component: () => import('@/view/components/drag-list/addArticle.vue')
          }
        ],
        component: parentView
      },
      {
        path: 'count',
        name: 'count',
        meta: {
          hideInBread: true
        },
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
            path: '/',
            name: '/',
            meta: {
              icon: 'md-trending-up',
              title: '查看发布内容',
              hideInMenu: true,
              access: null,
              notCache: true
            },
            children: [
              {
                path: 'acldetails',
                name: 'acldetails',
                meta: {
                  icon: 'md-trending-up',
                  title: '详情',
                  hideInMenu: true,
                  access: null,
                  notCache: true
                },
                component: () => import('@/view/components/count-to/aclDetails.vue')
              },
              {
                path: 'countdetails',
                name: 'countdetails',
                meta: {
                  icon: 'md-trending-up',
                  title: '查看发布内容',
                  hideInMenu: true,
                  access: null,
                  notCache: true
                },
                component: () => import('@/view/components/count-to/countDetails.vue')
              }
            ],
            component: parentView
          }
        ],
        component: parentView
      },
      {
        path: 'addcolumn',
        name: 'addcolumn',
        meta: {
          icon: 'ios-infinite',
          title: '添加修改栏目',
          notCache: true
        },
        component: () => import('@/view/components/drag-list/addColumn.vue')
      }
    ]
  },
  {
    path: '/update',
    name: 'update',
    meta: {
      icon: 'md-cloud-upload',
      title: '积分管理中心',
      notCache: true,
      notCache: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'update_table_page',
        name: 'update_table_page',
        meta: {
          icon: 'ios-document',
          title: '规则设置',
          notCache: true
        },
        component: () => import('@/view/update/update-table.vue')
      },
      {
        path: 'getIntegral',
        name: 'getIntegral',
        meta: {
          icon: 'md-clipboard',
          title: '积分获取',
          notCache: true
        },
        component: () => import('@/view/update/getIntegral.vue')
      },
      {
        path: 'getIntegralChange',
        name: 'getIntegralChange',
        meta: {
          icon: 'md-clipboard',
          title: '积分变更',
          notCache: true
        },
        component: () => import('@/view/update/getIntegralChange.vue')
      },
      {
        path: 'getIntegralDetailed',
        name: 'getIntegralDetailed',
        meta: {
          icon: 'md-clipboard',
          title: '会员积分明细',
          notCache: true
        },
        component: () => import('@/view/update/getIntegralDetailed.vue')
      },
      {
        path: 'shop',
        name: 'shop',
        meta: {
          icon: 'md-clipboard',
          title: '商城管理',
          notCache: true
        },
        children: [
          {
            path: 'shoppingManger',
            name: 'shoppingManger',
            meta: {
              icon: 'md-clipboard',
              title: '商城管理',
              notCache: true
            },
            component: () => import('@/view/update/shoppingManger.vue')
          },
          {
            path: 'shoppingAdd',
            name: 'shoppingAdd',
            meta: {
              title: '添加商品',
              hideInMenu: true,
              notCache: true
            },
            component: () => import('@/view/update/shoppingAdd.vue')
          }
        ],
        component: parentView
      },
      {
        path: 'order',
        name: 'order',
        meta: {
          icon: 'md-clipboard',
          title: '订单管理',
          notCache: true
        },
        children: [
          {
            path: 'ordermanage',
            name: 'ordermanage',
            meta: {
              icon: 'md-clipboard',
              title: '订单管理',
              notCache: true
            },
            component: () => import('@/view/update/orderManage.vue')
          },
          {
            path: 'orderdetails',
            name: 'orderdetails',
            meta: {
              icon: 'md-clipboard',
              title: '订单详情',
              hideInMenu: true,
              notCache: true
            },
            component: () => import('@/view/update/orderdetails.vue')
          },
        ],
        component: parentView
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: '客服管理',
      notCache: true,
      notCache: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'customerservice',
        name: 'customerservice',
        meta: {
          icon: 'md-add',
          title: '客服列表',
          notCache: true
        },
        component: () => import('@/view/excel/customerService.vue')
      },
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '消息管理',
          notCache: true
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'commentmanage',
        name: 'commentManage',
        meta: {
          icon: 'md-download',
          title: '评论管理',
          notCache: true
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'md-download',
          title: '用户反馈',
          notCache: true
        },
        children: [
          {
            path: 'userfeedback',
            name: 'userfeedback',
            meta: {
              icon: 'md-download',
              title: '用户反馈',
              notCache: true
            },
            component: () => import('@/view/excel/userFeedback.vue')
          },
          {
            path: 'userfeeddetails',
            name: 'userfeeddetails',
            meta: {
              icon: 'md-download',
              title: '反馈详情',
              hideInMenu: true,
              notCache: true
            },
            component: () => import('@/view/excel/userfeeddetails.vue')
          },
        ],
        component: parentView
      },
      {
        path: 'reportlist',
        name: 'reportlist',
        meta: {
          icon: 'md-download',
          title: '举报列表',
          notCache: true
        },
        component: () => import('@/view/excel/reportlist.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      icon: 'ios-stats',
      title: '帮助管理',
      notCache: true,
      notCache: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'helplist',
        name: 'helplist',
        meta: {
          icon: 'md-add',
          title: '帮助列表'
        },
        component: () => import('@/view/help/helpList.vue')
      },
      {
        path: 'problem',
        name: 'problem',
        meta: {
          icon: 'md-add',
          title: '问题分类列表'
        },
        component: () => import('@/view/help/problemList.vue')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      icon: 'md-contact',
      notCache: true,
      hideInBread: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'md-contact',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/directive',
    name: 'directive',
    meta: {
      icon: 'md-contact',
      notCache: true,
      hideInBread: true,
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'directive_page',
        name: 'directive_page',
        meta: {
          icon: 'ios-navigate',
          title: '系统设置',
          notCache: true
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      notCache: true,
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
    path: 'drag_list_page',
    name: 'drag_list_page',
    meta: {
      icon: 'ios-infinite',
      title: '我的资讯',
      notCache: true,
      hideInMenu: true
    },
    component: () => import('@/view/components/drag-list/drag-list.vue')
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
