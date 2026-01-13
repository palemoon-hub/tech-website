<template>
  <div class="space-y-10">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 opacity-10 pointer-events-none">
        <Wrench class="w-64 h-64 -mr-16 -mt-16" />
      </div>
      
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ $t('home.heroTitle') }}</h1>
        <p class="text-blue-100 text-lg mb-8 leading-relaxed">
          {{ $t('home.heroDesc') }}
        </p>
        
        <!-- Search Bar -->
        <div class="relative max-w-lg group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg" 
            :placeholder="$t('home.searchPlaceholder')" 
          />
        </div>
      </div>
    </div>

    <!-- Tool Sections -->
    <div v-if="filteredCategories.length > 0" class="space-y-8">
      <div v-for="category in filteredCategories" :key="category.title" class="space-y-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <component :is="category.icon" class="w-6 h-6 text-blue-600" />
          {{ category.title }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link 
            v-for="tool in category.tools" 
            :key="tool.path" 
            :to="tool.path"
            class="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <!-- Decorative gradient blob -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative flex items-start gap-4">
              <div :class="`p-3 rounded-xl ${tool.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`">
                <component :is="tool.icon" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{{ tool.name }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ tool.description }}</p>
              </div>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="tag in tool.tags" :key="tag" class="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded-md border border-gray-100">
                {{ tag }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <SearchX class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <p class="text-lg">{{ $t('home.noResult', { query: searchQuery }) }}</p>
      <button @click="searchQuery = ''" class="mt-4 text-blue-600 hover:underline">{{ $t('home.clearSearch') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Clock, Code2, Image, Scale, Bot, MoreHorizontal, 
  Wrench, Search, SearchX, Terminal, Palette, Coffee 
} from 'lucide-vue-next'

const { t } = useI18n()
const searchQuery = ref('')

// Tool Data with Categories
const categories = computed(() => [
  {
    title: t('home.categories.dev'),
    icon: Terminal,
    tools: [
      { 
        name: t('home.tools.timestamp.name'), 
        description: t('home.tools.timestamp.desc'), 
        path: '/timestamp',
        icon: Clock,
        color: 'bg-emerald-500',
        tags: ['Date', 'Unix', 'Time']
      },
      { 
        name: t('home.tools.devTools.name'), 
        description: t('home.tools.devTools.desc'), 
        path: '/dev-tools',
        icon: Code2,
        color: 'bg-blue-600',
        tags: ['JSON', 'Base64', 'Regex', 'Hash']
      },
    ]
  },
  {
    title: t('home.categories.design'),
    icon: Palette,
    tools: [
      { 
        name: t('home.tools.imageTools.name'), 
        description: t('home.tools.imageTools.desc'), 
        path: '/image-tools',
        icon: Image,
        color: 'bg-purple-500',
        tags: ['Convert', 'Compress', 'ID Photo']
      },
      { 
        name: t('home.tools.aiTools.name'), 
        description: t('home.tools.aiTools.desc'), 
        path: '/ai-tools',
        icon: Bot,
        color: 'bg-indigo-500',
        tags: ['ChatGPT', 'Midjourney', 'AI']
      },
    ]
  },
  {
    title: t('home.categories.life'),
    icon: Coffee,
    tools: [
      { 
        name: t('home.tools.unitConverter.name'), 
        description: t('home.tools.unitConverter.desc'), 
        path: '/unit-converter',
        icon: Scale,
        color: 'bg-orange-500',
        tags: ['Metric', 'Imperial', 'Data']
      },
      { 
        name: t('home.tools.otherTools.name'), 
        description: t('home.tools.otherTools.desc'), 
        path: '/other-tools',
        icon: MoreHorizontal,
        color: 'bg-pink-500',
        tags: ['QRCode', 'Color', 'Utility']
      },
    ]
  }
])

// Search Logic
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  
  return categories.value.map(cat => {
    const matchingTools = cat.tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
    return { ...cat, tools: matchingTools }
  }).filter(cat => cat.tools.length > 0)
})
</script>
