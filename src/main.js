// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
'use strict';
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './theme/theme.scss'
import './assets/icon/iconfont.css'
import axios from './api/index'
import ECharts from 'vue-echarts';
import {store} from './store/index';
import {ws} from './webSocket';
import AsyncComputed from 'vue-async-computed';
import VueUeditorWrap from 'vue-ueditor-wrap';
import * as qiniu from 'qiniu-js';
var fundebug = require("fundebug-javascript");
fundebug.apikey = "03deb2cc310c7555da012425c25da4628227c80bb4aa098e5cab3b2c1fd3ab2f";

Vue.component('chart', ECharts);
Vue.component('echarts',ECharts);
Vue.component('UeditorWrap',VueUeditorWrap);//全局注册ueditor组件
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qiniu = qiniu;
Vue.prototype.$webSocket = ws;
Vue.use(AsyncComputed);

function formatComponentName(vm) {
  if (vm.$root === vm) return "root";

  var name = vm._isVue
      ? (vm.$options && vm.$options.name) ||
        (vm.$options && vm.$options._componentTag)
      : vm.name;
  return (
      (name ? "component <" + name + ">" : "anonymous component") +
      (vm._isVue && vm.$options && vm.$options.__file
          ? " at " + (vm.$options && vm.$options.__file)
          : "")
  );
}

Vue.config.errorHandler = function(err, vm, info) {
  if (vm) {
      var componentName = formatComponentName(vm);
      var propsData = vm.$options && vm.$options.propsData;
      fundebug.notifyError(err, {
          metaData: {
              componentName: componentName,
              propsData: propsData,
              info: info
          }
      });
  } else {
      fundebug.notifyError(err);
  }
};

let vue = new Vue({
  el: '#app',
  router,
  axios,
  store,
  qiniu,
  template: '<App/>',
  components: { App },
});

export default vue
