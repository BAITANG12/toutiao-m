import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/index.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Search from '@/views/Search/Search.vue'
import SearchResult from '@/views/SearchResult/SearchResult.vue'
Vue.use(VueRouter)

// 路由规则
const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/', component: Main,
    children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      { path: '', component: Home, name: 'home' },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  // 搜索组件的路由规则
  { path: '/search', component: Search, name: 'search' },
  // 搜索结果页
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true }
]

const router = new VueRouter({
  routes
})

export default router
