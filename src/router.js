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
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/category/:categoryId',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ './views/Category.vue')
    },
    {
      path: '/category/:categoryId/heatmap',
      name: 'category-heatmap',
      component: () => import(/* webpackChunkName: "category-heatmap" */ './views/CategoryHeatmap.vue')
    },
    {
      path: '/category/:categoryId/:itemId',
      name: 'category-item',
      component: () => import(/* webpackChunkName: "category" */ './views/Category.vue')
    }
  ]
})

export default router
