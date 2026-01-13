<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-100">
        <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wrench class="w-6 h-6 text-blue-600" />
          Teckrock Tools
        </h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
          active-class="bg-blue-50 text-blue-600 font-medium"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
        v1.1.0
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
        <h2 class="text-lg font-medium text-gray-800">{{ currentRouteName }}</h2>
        <button @click="toggleLanguage" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
          <Globe class="w-5 h-5" />
          <span class="text-sm font-medium">{{ locale === 'en' ? 'En' : '中' }}</span>
        </button>
      </header>
      
      <div class="flex-1 overflow-auto p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  LayoutDashboard, 
  Clock, 
  Code2, 
  Image, 
  Scale,
  Bot, 
  MoreHorizontal,
  Wrench,
  Globe
} from 'lucide-vue-next'

const route = useRoute()
const { t, locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const currentRouteName = computed(() => {
  const item = navItems.value.find(i => i.path === route.path)
  return item ? item.name : t('app.dashboard')
})

const navItems = computed(() => [
  { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
  { name: t('nav.timestamp'), path: '/timestamp', icon: Clock },
  { name: t('nav.devTools'), path: '/dev-tools', icon: Code2 },
  { name: t('nav.imageTools'), path: '/image-tools', icon: Image },
  { name: t('nav.unitConverter'), path: '/unit-converter', icon: Scale },
  { name: t('nav.aiTools'), path: '/ai-tools', icon: Bot },
  { name: t('nav.otherTools'), path: '/other-tools', icon: MoreHorizontal },
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
