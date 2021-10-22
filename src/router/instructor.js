// 班长及辅导员
export default [
    // 学生信息
    {
        path: 'mystudent',
        name: 'mystudent',
        component: resolve => require(['@/components/page/instructor/studentInfo/MyStudent'], resolve)
    },
    {
        path: 'studentinfo',
        name: 'studentinfo',
        component: resolve => require(['@/components/page/instructor/studentInfo/StudentInfo'], resolve),
    },
    {
        path: 'minority',
        name: 'minority',
        component: resolve => require(['@/components/page/instructor/studentInfo/Minority'], resolve)
    },
    {
        path: 'singleinfo',
        name: 'singleinfo',
        component: resolve => require(['@/components/page/instructor/studentInfo/SingleInfo'], resolve)
    },
    {
        path: 'singleinfochange',
        name: 'singleinfochange',
        component: resolve => require(['@/components/page/instructor/studentInfo/SingleInfoChange'], resolve)
    },
    // 日常管理
    {
        path: 'mywork',
        name: 'mywork',
        component: resolve => require(['@/components/page/instructor/daily/MyWork'], resolve)
    },
    {
        path: 'leaveinfo',
        name: 'leaveinfo',
        component: resolve => require(['@/components/page/instructor/daily/leaveInfo'], resolve)
    },
    {
        path: 'completework',
        name: 'completework',
        component: resolve => require(['@/components/page/instructor/daily/CompleteWork'], resolve)
    },
    {
        path: 'notificationmanagement',
        name: 'notificationmanagement',
        component: resolve => require(['@/components/page/instructor/daily/NotificationManagement'], resolve)
    },
    {
        path: 'onework',
        name: 'onework',
        component: resolve => require(['@/components/page/instructor/daily/OneWork'], resolve)
    },
    // 学生成绩
    {
        path: 'comprehensive',
        name: 'comprehensive',
        component: resolve => require(['@/components/page/instructor/studentScore/Comprehensive'], resolve)
    },
    {
        path: 'startcomp',
        name: 'startcomp',
        component: resolve => require(['@/components/page/instructor/studentScore/StartComp'], resolve)
    },
    {
        path: 'onemajor',
        name: 'onemajor',
        component: resolve => require(['@/components/page/instructor/studentScore/OneMajor'], resolve)
    },
    {
        path: 'comprehensiveevaluate',
        name: 'comprehensiveevaluate',
        component: resolve => require(['@/components/page/instructor/studentScore/ComprehensiveEvaluate'], resolve)
    },
    {
        path: 'comprehensiveverify',
        name: 'comprehensiveverify',
        component: resolve => require(['@/components/page/instructor/studentScore/ComprehensiveVerify'], resolve)
    },
    {
        path: 'studentgrades',
        name: 'studentgrades',
        component: resolve => require(['@/components/page/instructor/studentScore/StudentGrades'], resolve)
    },
    {
        path: 'failsituation',
        name: 'failsituation',
        component: resolve => require(['@/components/page/instructor/studentScore/FailSituation'], resolve)
    },
    {
        path: 'moralaudit',
        name: 'moralaudit',
        component: resolve => require(['@/components/page/instructor/studentScore/moralAudit'], resolve)
    },
    {
        path: 'scholarshipsetting',
        name: 'scholarshipsetting',
        component: resolve => require(['@/components/page/instructor/studentScore/ScholarshipSetting'], resolve)
    },
    // 课外研学
    {
        path: 'contest',
        name: 'contest',
        component: resolve => require(['@/components/page/instructor/extraStudy/Contest'], resolve)
    },
    {
        path: 'innovation',
        name: 'innovation',
        component: resolve => require(['@/components/page/instructor/extraStudy/Innovation'], resolve)
    },
    {
        path: 'paperpatent',
        name: 'paperpatent',
        component: resolve => require(['@/components/page/instructor/extraStudy/PaperPatent'], resolve)
    },
    {
        path: 'socialpractice',
        name: 'socialpractice',
        component: resolve => require(['@/components/page/instructor/extraStudy/SocialPractice'], resolve)
    },
    {
        path: 'ExtraStudyAudit',
        name: 'ExtraStudyAudit',
        component: resolve => require(['@/components/page/instructor/extraStudy/ExtraStudyAudit'], resolve)
    },
    // 奖勤助贷
    {
        path: 'scholarship',
        name: 'scholarship',
        component: resolve => require(['@/components/page/instructor/money/Scholarship'], resolve)
    },
    {
        path: 'stipend',
        name: 'stipend',
        component: resolve => require(['@/components/page/instructor/money/Stipend'], resolve)
    },
    {
        path: 'studentloan',
        name: 'studentloan',
        component: resolve => require(['@/components/page/instructor/money/StudentLoan'], resolve)
    },
    {
        path: 'parttime',
        name: 'parttime',
        component: resolve => require(['@/components/page/instructor/money/PartTime'], resolve)
    },
    // 信息统计
    //新建统计
    {
        path: 'newcount',
        name: 'newcount',
        component: resolve => require(['@/components/page/instructor/statistics/NewCount'], resolve)
    },
    //已有统计列表
    {
        path: 'countlist',
        name: 'countlist',
        component: resolve => require(['@/components/page/instructor/statistics/CountList'], resolve)
    },
]