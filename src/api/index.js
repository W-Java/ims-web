import axios from 'axios'
import ElementUI from 'element-ui'
import Router from '../router'
// import QS from 'qs';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https:' + process.env.API_ROOT;
}

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => {
    if (response.headers['content-type'].indexOf('application/json') >= 0 && response.data.status !== 0) {
      //登录失败不进行弹窗显示
      if (response.data.status !== 666) {
        ElementUI.Message.warning(response.data.message);
      }
      if (response.data.status === 401 || response.data.status === 403) {
        sessionStorage.removeItem('user');
        Router.push({ name: 'login', query: { redirect: Router.currentRoute.fullPath } });
      }
    }
    return response;
  },
  error => {
    ElementUI.Message.error(error.message + ' : ' + error.request.responseURL);
    if (error.response.status === 401 || error.response.status === 403) {
      sessionStorage.removeItem('user');
      Router.push({ name: 'login', query: { redirect: Router.currentRoute.fullPath } });
    }
    return Promise.reject(error);
  }
);

//RESTful API封装

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/**
* post方法，对应post请求
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    // axios.post(url, QS.stringify(params))
    axios.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}


/**
* deletefn
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function deletefn(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}


export default axios;
