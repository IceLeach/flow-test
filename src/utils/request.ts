import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: 'http://60.12.212.225:8188',
});

request.interceptors.request.use(config => {
  // // 添加token
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config;
}, error => {
  console.log('request error', error)
  return Promise.reject(error);
});

request.interceptors.response.use(response => {
  return response.data;
}, error => {
  console.log('response error', error)
  if (error.response) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, data } = error.response;
    const errorText = data.message ?? '服务器发生错误';
    message.error(errorText)
  } else {
    // message.error('请求无响应');
  }
  return Promise.reject(error);
});

export default request;
