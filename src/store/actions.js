import axios from '../api/index';

export default {
    //获取专业选项的接口
    majoroptions(context, { data }) {
        return axios.post('sm/majoroptions', data);
    },

    //获取班级选项的接口
    classoptions(context, { data }) {
        return axios.post('/sm/classoptions', data);
    },

    // 获取一个学生的信息
    singleinfo(context, { data }) {
        return axios.post('/sm/singleinfo', data);
    },

    //查询勤工助学信息
    parttimeinfo(context, { data }) {
        return axios.post('sm/parttimeinfo', data);
    },
}