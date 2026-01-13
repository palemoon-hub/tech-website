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
        path: 'json-format',
        name: 'JsonFormat',
        component: () => import('../views/JsonFormat.vue')
      },
      {
        path: 'id-photo',
        name: 'IdPhoto',
        component: () => import('../views/IdPhoto.vue')
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
