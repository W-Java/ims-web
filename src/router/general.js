// 通用页面路由
export default [
    {
        path: 'index',
        name: 'index',
        component: resolve => require(['@/components/page/general/Index'], resolve)
    },
    {
        path: '*',
        component: resolve => require(['@/components/page/404'], resolve)
    },
    {
        path: 'user',
        name: 'user',
        component: resolve => require(['@/components/page/general/User'], resolve)
    },
    {
        path: 'accountset',
        name: 'accountset',
        component: resolve => require(['@/components/page/general//AccountSet'], resolve)
    },

    {
        path: 'systemmessages',
        name: 'systemMessages',
        component: resolve => require(['@/components/page/general/systemMessages'], resolve)
    },
    {
        path: '',
        redirect: { name: 'index' }
    },
]