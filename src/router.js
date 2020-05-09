import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/cagegory/:categoryId',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ './views/Category.vue')
    }
  ]
})

export default router
