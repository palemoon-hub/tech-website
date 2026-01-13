import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'timestamp',
        name: 'Timestamp',
        component: () => import('../views/Timestamp.vue')
      },
      {
        path: 'dev-tools',
        name: 'DevTools',
        component: () => import('../views/DevTools.vue')
      },
      {
        path: 'image-tools',
        name: 'ImageTools',
        component: () => import('../views/ImageTools.vue')
      },
      {
        path: 'unit-converter',
        name: 'UnitConverter',
        component: () => import('../views/UnitConverter.vue')
      },
      {
        path: 'ai-tools',
        name: 'AiTools',
        component: () => import('../views/AiTools.vue')
      },
      {
        path: 'other-tools',
        name: 'OtherTools',
        component: () => import('../views/OtherTools.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
