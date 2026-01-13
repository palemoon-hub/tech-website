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
        component: () => import('../views/OtherTools.vue'),
        meta: { title: '日常工具 - TechRock Tools' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = title
  } else if (to.name) {
    // Fallback for routes without explicit title
    const nameMap: Record<string, string> = {
      'Home': '仪表盘 - TechRock Tools',
      'Timestamp': '时间戳工具 - TechRock Tools',
      'DevTools': '开发工具箱 - TechRock Tools',
      'ImageTools': '图片工具箱 - TechRock Tools',
      'UnitConverter': '单位换算 - TechRock Tools',
      'AiTools': 'AI 聚合站 - TechRock Tools',
    }
    document.title = nameMap[to.name as string] || 'TechRock Tools'
  }
  next()
})

export default router
