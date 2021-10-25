import Vue from 'vue'
import Vuex from 'vuex'

import { getItem, setItem } from '@/utils/storage.js'
import { getUserInfoAPI, getUserProfileAPI } from '@/api/user.js'
Vue.use(Vuex)

// const TOKEN_KEY = 'TOUTIAO_USER'

// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}
const stateStr = localStorage.getItem('state')
if (stateStr) {
  // 加载本地的数据
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  state: initState,
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, data) {
      // 把提交过来的 data 对象，作为 tokenInfo 的值
      state.tokenInfo = data

      // 测试 state 中是否有数据
      // console.log(state)

      //为了防止数据丢失，备份数据到本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.tokenInfo))
      // setItem(TOKEN_KEY, state.tokenInfo)

      this.commit('saveStateToStorage')
    },
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 1. 把用户信息转存到 state 中
      state.userInfo = payload
      // 2. 将最新的 state 对象持久化存储到本地
      this.commit('saveStateToStorage')
    },

    // 清空 vuex 和本地的数据
    cleanState(state) {
      // 1. 清空 vuex 中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 2. 将清空后的 state 存储到本地
      this.commit('saveStateToStorage')
    },
    // 更新 userProfile 的方法
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    },

  },
  actions: {
    // 初始化用户的基本信息
    async initUserInfo(ctx) {
      // 调用 API 接口
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserInfo', res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile(ctx) {
      // 调用 API 接口
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        // TODO：把请求到的数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  modules: {
  }
})
