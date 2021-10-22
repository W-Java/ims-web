// 学生

// 综测相关路由
const comprehensive = [
    {
        path: 'comprehensiveIndex',
        name: 'comprehensiveIndex',
        component: resolve => require(['@/components/page/student/comprehensive/ComprehensiveIndex'], resolve)
    },
    {
        path: 'ComprehensiveDeclare',
        name: 'ComprehensiveDeclare',
        component: resolve => require(['@/components/page/student/comprehensive/ComprehensiveDeclare'], resolve)
    },
    {
        path: 'cadresAndOthersBonus',
        name: 'cadresAndOthersBonus',
        component: resolve => require(['@/components/page/student/comprehensive/cadresAndOthersBonus'], resolve)
    },
    {
        path: 'comprehensivereviewing',
        name: 'comprehensivereviewing',
        component: resolve => require(['@/components/page/student/comprehensive/ComprehensiveReviewing'], resolve)
    },
    {
        path: 'comprehensiveconfirm',
        name: 'comprehensiveconfirm',
        component: resolve => require(['@/components/page/student/comprehensive/ComprehensiveConfirm'], resolve)
    },
]


export default [
    ...comprehensive,
    {
        path: 'leavemanage',
        name: 'leavemanage',
        component: resolve => require(['@/components/page/student/LeaveManage'], resolve)
    },
    {
        path: 'growingfile',
        name: 'growingfile',
        component: resolve => require(['@/components/page/student/GrowingFile'], resolve)
    },
    {
        path: 'notifications',
        name: 'notifications',
        component: resolve => require(['@/components/page/student/notifications'], resolve)
    },
    {
        path: 'todolist',
        name: 'todoList',
        component: resolve => require(['@/components/page/student/todoList'], resolve)
    },
]