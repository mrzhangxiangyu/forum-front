import axios from 'axios'
import { setUserLogin, setUserId, getUserId } from '@/utils/auth'
axios.defaults.baseURL = window.$api.baseURL // 换域名是在static/config.js的给换一下
axios.defaults.headers.post['Content-Type'] = 'application/json'
const state = {
  nickname: '',
  userId: null,
  avatar: ''
}

const mutations = {
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  saveUser({ commit }, info) {
    setUserLogin(1)
    setUserId(info.userId)
    commit('SET_NICKNAME', info.nickname)
    commit('SET_USERID', info.userId)
    commit('SET_AVATAR', info.avatar)
  },
  logout({ commit }) {
    setUserLogin(0)
    setUserId('')
    commit('SET_NICKNAME', '')
    commit('SET_USERID', '')
    commit('SET_AVATAR', '')
  },
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'user',
        method: 'get',
        params: {
          userId: getUserId()
        }
      }).then(ret => {
        if (ret.data.meta.status) {
          commit('SET_NICKNAME', ret.data.data.nickname)
          commit('SET_USERID', ret.data.data.userId)
          commit('SET_AVATAR', ret.data.data.avatar)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

