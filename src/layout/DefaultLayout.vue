<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-100">
        <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wrench class="w-6 h-6 text-blue-600" />
          DevTools Pro
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
        v1.0.0
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
        <h2 class="text-lg font-medium text-gray-800">{{ currentRouteName }}</h2>
        <!-- Future: User profile or Theme toggle -->
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
import { 
  LayoutDashboard, 
  Clock, 
  FileJson, 
  Image, 
  Bot, 
  MoreHorizontal,
  Wrench
} from 'lucide-vue-next'

const route = useRoute()

const currentRouteName = computed(() => {
  const item = navItems.find(i => i.path === route.path)
  return item ? item.name : 'Dashboard'
})

const navItems = [
  { name: '仪表盘', path: '/', icon: LayoutDashboard },
  { name: '时间戳转换', path: '/timestamp', icon: Clock },
  { name: '格式化工具', path: '/json-format', icon: FileJson },
  { name: '证件照换底', path: '/id-photo', icon: Image },
  { name: 'AI 聚合站', path: '/ai-tools', icon: Bot },
  { name: '常用工具', path: '/other-tools', icon: MoreHorizontal },
]
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
