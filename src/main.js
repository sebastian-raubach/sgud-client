import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import mixin from '@/mixin/mixin'
import api from '@/mixin/api'
import store from './store'
import router from './router'

let axiosDefaults = require('axios/lib/defaults')

Vue.use(BootstrapVue)
Vue.mixin(mixin)
Vue.mixin(api)

// Set base URL
var baseUrl = 'http://localhost:8080/sgud/v1.0.0/api/'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

axiosDefaults.baseURL = baseUrl

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
