import Vue from 'vue'
import Router from 'vue-router'
import VueAnalytics from 'vue-analytics'
import student from './student'
import instructor from './instructor'
import general from './general'

const router = new Router({
  routes: [
    //登录路由
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/page/login/Login'], resolve),
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem('user') !== null) {
          next({ name: 'index' });
        }
        next();
      }
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: resolve => require(['@/components/page/login/ResetPwd'], resolve),
    },
    {
      path: '/console',
      component: resolve => require(['@/components/page/Console'], resolve),
      beforeEnter: (to, from, next) => {
        if (sessionStorage.getItem('user') === null) {
          next({ name: 'login', query: { redirect: to.fullPath } });
        }
        else {
          next();
        }
      },
      //子路由在三个js文件中，解构导入
      children: [
        ...student,
        ...instructor,
        ...general,
      ]
    },
    {
      path: '*',
      component: resolve => require(['@/components/page/404'], resolve),
    },

  ]
})
Vue.use(VueAnalytics, {
  id: 'UA-126824460-2',
  router
})
Vue.use(Router)

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
//push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

export default router
