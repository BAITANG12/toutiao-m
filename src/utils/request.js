import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index.js'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
    // 请求根路径
    baseURL: 'http://www.liulongbin.top:8000'
})
// 请求拦截器
instance.interceptors.request.use(
    config => {
        const tokenStr = store.state.tokenInfo.token
        if (tokenStr) {
            config.headers.Authorization = `Bearer ${tokenStr}`
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)
// 响应拦截器（注意：响应拦截器也应该绑定给 instance 实例）
instance.interceptors.response.use(
    response => {
        // 隐藏 loading 效果
        Toast.clear()
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance