import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'
import Home from '../views/Home.vue'
import i18n from '../i18n'

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
        path: 'doc-tools',
        name: 'DocTools',
        component: () => import('../views/DocTools.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const t = i18n.global.t
  const title = to.meta.title as string
  
  if (title) {
    document.title = title
  } else if (to.name) {
    const appTitle = t('app.title')
    const nameMap: Record<string, string> = {
      'Home': t('nav.dashboard'),
      'Timestamp': t('nav.timestamp'),
      'DevTools': t('nav.devTools'),
      'ImageTools': t('nav.imageTools'),
      'UnitConverter': t('nav.unitConverter'),
      'AiTools': t('nav.aiTools'),
      'DocTools': t('nav.docTools'),
    }
    const pageTitle = nameMap[to.name as string]
    document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle
  }
  next()
})

export default router
