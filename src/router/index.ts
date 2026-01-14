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
      },
      {
        path: 'horoscope',
        name: 'Horoscope',
        component: () => import('../views/Horoscope.vue')
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
  const routeName = to.name as string
  
  // Mapping from Route Name to Locale Key in "meta" section
  const metaKeyMap: Record<string, string> = {
    'Home': 'home',
    'Timestamp': 'timestamp',
    'DevTools': 'devTools',
    'ImageTools': 'imageTools',
    'UnitConverter': 'unitConverter',
    'AiTools': 'aiTools',
    'DocTools': 'docTools',
    'Horoscope': 'horoscope'
  }
  
  const metaKey = metaKeyMap[routeName]
  
  if (metaKey) {
    const pageTitle = t(`meta.${metaKey}.title`)
    const pageDesc = t(`meta.${metaKey}.description`)
    const pageKeywords = t(`meta.${metaKey}.keywords`)
    
    // Set Title
    document.title = pageTitle
    
    // Set Description
    let descMeta = document.querySelector('meta[name="description"]')
    if (!descMeta) {
      descMeta = document.createElement('meta')
      descMeta.setAttribute('name', 'description')
      document.head.appendChild(descMeta)
    }
    descMeta.setAttribute('content', pageDesc)
    
    // Set Keywords
    let keywordsMeta = document.querySelector('meta[name="keywords"]')
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta')
      keywordsMeta.setAttribute('name', 'keywords')
      document.head.appendChild(keywordsMeta)
    }
    keywordsMeta.setAttribute('content', pageKeywords)

    // Set OG Tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector)
      if (element) {
        element.setAttribute('content', content)
      }
    }
    
    updateMetaTag('meta[property="og:title"]', pageTitle)
    updateMetaTag('meta[property="og:description"]', pageDesc)
    
  } else {
    // Fallback
    const appTitle = t('app.title')
    document.title = appTitle
  }
  
  next()
})

export default router
