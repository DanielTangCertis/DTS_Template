import { createRouter, createWebHistory , type RouteRecordRaw } from 'vue-router'
import { HomeItem } from './modules/home'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/page1',
    component: () => import('@/views/home/index.vue'),
    children: HomeItem
  },

  {
    // 匹配所有路径  vue2使用*   vue3使用/:pathMatch(.*)*或/:pathMatch(.*)或/:catchAll(.*)
    path: '/:pathMatch(.*)',
    component: () => import('@/views/404/index.vue')
  }
]

const router = createRouter({
  //@ts-ignore
  history: createWebHistory(),
  routes
})

export default router
