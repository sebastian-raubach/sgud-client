import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import mixin from '@/mixin/mixin'
import api from '@/mixin/api'
import store from './store'
import router from './router'

import '@mdi/font/css/materialdesignicons.min.css'

const axiosDefaults = require('axios/lib/defaults')

Vue.use(BootstrapVue)
Vue.mixin(mixin)
Vue.mixin(api)

// Set base URL
let baseUrl = './'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

axiosDefaults.baseURL = baseUrl

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
