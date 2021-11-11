import { post } from ".";
/**
 * @param {object} user
 * @returns {{ name, sex, _class, number }}
 */
const getStudentInfo = async (user) => {
    const res = await post('sm/singleinfo',{ selectedStudent: user.IDNumber });
    if(res){
        const { name, sex, _class, number } = res.data.student.basic;
        return { name, sex, _class, number };
    }
}
/**
 * @param {number} currentPage
 * @param {number} pageSize
 * @returns {any}
 */
const getNotice = async (currentPage = 1, pageSize = 4) => {
    const res = await post('sm/notice/myNotice',{ currentPage, pageSize });
    return res.data.data;
}
/**
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {string} status
 * @param {string} identity
 * @returns {any}
 */
const getStatsList = async (currentPage = 1, pageSize = 4, status = 'submit', identity = 'student') => {
    const res = await post('sm/StatsList',{ currentPage, pageSize, status, identity });
    if(res.status === 0){
        return res;
    }else
    {
        return Promise.reject(new Error('stats list fetch fail'));
    }
}
/**
 * @param {number} id
 * @returns {any}
 */
const getNotificationById = async (id)=>{
    const res = await post('sm/notice/one',{id});
    if(res.status === 0){
        return res;
    }else{
        return Promise.reject(new Error('notification fetch fail'));
    }
}
/**
 * @param {number} id
 * @returns {any}
 */
const getStats = async (id)=>{
    const res = await post("sm/getStats",{id});
    if(res.status === 0){
        return res;
    }else{
        return Promise.reject(new Error('stats fetch fail'));
    }
}
/**
 * @param {number} id
 * @returns {any}
 */
const getStatsDetail = async (id)=>{
    const res = await post("sm/statsDetail",{id});
    if(res.status === 0 && res.data){
        return res;
    }else{
        return Promise.reject(new Error('stats fetch fail'));
    }
}

/**
 *
 * @param {object} header
 * @param {object} data
 * @param {number} id
 * @param {any} status
 * @returns {boolean}
 */
const fillStats = async (header,data,id,status) => {
    let postData = {};
    postData.header = JSON.stringify(header);
    postData.data = JSON.stringify(data);
    postData.id = id;
    postData.status = status;
    const res = await post('sm/fillStats',postData);
    if(res && res.status === 0){
        return true;
    }else{
        return false
    }
}

const getCarousel = async () => {
    const res = await post('sm/index/carousel');
    if(res.status === 0){
        return res;
    }else
    {
        return Promise.reject(new Error('carousel items fetch fail'));
    }
}

const getInstructorWork = async () => {
  const res = await post('sm/index/work');
  if(res.status === 0){
    return res;
  }else{
    return Promise.reject(new Error('instructor work fetch fail'))
  }
}

export {
  getStudentInfo,
  getNotice,
  getNotificationById,
  getStatsList,
  getCarousel,
  getInstructorWork,
  getStats,
  getStatsDetail,
  fillStats
}
