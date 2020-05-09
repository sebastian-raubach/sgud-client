import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

var name = process.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'sgud-' + window.location.pathname
}

const storeState = {
  state: {
    baseUrl: null
  },
  getters: {
    baseUrl: (state) => state.baseUrl
  },
  mutations: {
    ON_BASE_URL_CHANGED_MUTATION: function (state, newBaseUrl) {
      state.baseUrl = newBaseUrl
    }
  },
  actions: {
    ON_BASE_URL_CHANGED: function ({ commit }, baseUrl) {
      commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)
    }
  },
  plugins: [
    createPersistedState({
      key: name
    })
  ]
}

const store = new Vuex.Store(storeState)

export default store