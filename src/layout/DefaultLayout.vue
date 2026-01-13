<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-2 flex-shrink-0 cursor-pointer" @click="router.push('/')">
          <div class="bg-blue-600 p-1.5 rounded-lg">
            <Wrench class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-xl font-bold text-gray-800 hidden sm:block">Teckrock Tools</h1>
        </div>

        <!-- Right Side Container -->
        <div class="flex items-center gap-4 flex-1 justify-end">
          
          <!-- Search Bar -->
          <div class="relative group w-full max-w-xs transition-all duration-300 focus-within:max-w-md hidden sm:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="block w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
              :placeholder="$t('home.searchPlaceholder')" 
              @focus="handleSearchFocus"
            />
          </div>

          <!-- Navigation Items (Desktop) -->
          <nav class="hidden lg:flex items-center gap-1">
            <router-link 
              v-for="item in navItems" 
              :key="item.path" 
              :to="item.path"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              :class="route.path === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Divider -->
          <div class="h-6 w-px bg-gray-200 hidden lg:block"></div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button 
              @click="toggleLanguage" 
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              :title="locale === 'en' ? 'Switch to Chinese' : 'Switch to English'"
            >
              <Globe class="w-5 h-5" />
            </button>
            
            <button 
              @click="isSupportOpen = true"
              class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-medium whitespace-nowrap"
            >
              <Heart class="w-4 h-4 fill-current" />
              <span class="hidden sm:inline">{{ $t('support.title') }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search (Visible only on small screens) -->
    <div class="sm:hidden px-4 py-3 bg-white border-b border-gray-200">
      <div class="relative group w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          class="block w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
          :placeholder="$t('home.searchPlaceholder')" 
          @focus="handleSearchFocus"
        />
      </div>
    </div>
    
    <!-- Mobile Nav (Horizontal Scroll) -->
    <div class="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
      <nav class="flex items-center gap-1 px-4 py-2 min-w-max">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="route.path === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <SupportModal :is-open="isSupportOpen" @close="isSupportOpen = false" />

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Teckrock Tools. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SupportModal from '../components/SupportModal.vue'
import { useSearch } from '../composables/useSearch'
import { 
  LayoutDashboard, 
  Clock, 
  Code2, 
  Image, 
  Scale,
  Bot, 
  MoreHorizontal,
  Wrench,
  Globe,
  Heart,
  Search
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const isSupportOpen = ref(false)
const { searchQuery } = useSearch()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const handleSearchFocus = () => {
  if (route.path !== '/') {
    router.push('/')
  }
}

// Watch search query to redirect to home if typing
watch(searchQuery, (newVal) => {
  if (newVal && route.path !== '/') {
    router.push('/')
  }
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
