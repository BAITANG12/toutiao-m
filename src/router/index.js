import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/index.vue'

Vue.use(VueRouter)

// 路由规则
const routes = [
  { path: '/login', component: Login, name: 'login' }
]

const router = new VueRouter({
  routes
})

export default router
