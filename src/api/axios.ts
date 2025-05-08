// 封装 axios 做一些公共的配置，以及错误统一处理
import axios from 'axios'
// import { ElMessage } from 'element-plus';

// axios.defaults.baseURL = "http://localhost:3000";//设置请求的根路径
// axios.defaults.headers.post["Content-Type"] = "application/json";//设置响应头

// 请求拦截器
// axios.interceptors.request.use(req => {
//   let token = localStorage.getItem('Admin-Token');
//   let clientId = localStorage.getItem('Clientid');
//   if (token && clientId && req.headers) {
//     req.headers.Authorization = token
//     req.headers['Clientid'] = clientId
//   }
//   return req
// })

// 响应拦截器
// axios.interceptors.response.use(res => {
//   if (res.status !== 200) { // 程序性错误
//     ElMessage.error('服务器异常')
//     return Promise.reject(res)
//   } else {

//     if (res.data.code === 401) { // 没有登录
//       ElMessage.error(res.data.msg)
//       return Promise.reject(res)
//     }

//     if (res.data.code !== 200) { // 业务错误
//       ElMessage.error(res.data.msg)
//       return Promise.reject(res)
//     }

//     return res.data
//   }
// }, err => {
//   console.error('响应拦截器出错', err)
//   return Promise.reject(err)
// })

export default axios