// import Cookies from 'js-cookie'

const state = {
  device: 'desktop',
  search: true
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  CLICK_SEARCH: (state, search) => {
    state.search = search
  }
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  clickSearch({ commit }, search) {
    commit('CLICK_SEARCH', search)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
