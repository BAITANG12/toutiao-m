import Vue from 'vue'
import Vuex from 'vuex'

import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    tokenInfo: getItem(TOKEN_KEY)

  },
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, data) {
      // 把提交过来的 data 对象，作为 tokenInfo 的值
      state.tokenInfo = data

      // 测试 state 中是否有数据
      // console.log(state)

      //为了防止数据丢失，备份数据到本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.tokenInfo))
      setItem(TOKEN_KEY, state.tokenInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
