<template>
  <div class="space-y-10">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 opacity-10 pointer-events-none">
        <Wrench class="w-64 h-64 -mr-16 -mt-16" />
      </div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Left: Title & Desc -->
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-2xl md:text-4xl font-bold mb-4 leading-tight">{{ $t('home.heroTitle') }}</h1>
          <p class="text-blue-100 text-base leading-relaxed">
            {{ $t('home.heroDesc') }}
          </p>
        </div>

        <!-- Right: Support Button -->
        <div class="flex-shrink-0">
          <button 
            @click="isSupportOpen = true"
            class="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-bold group"
          >
            <Heart class="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span>{{ $t('support.title') }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <SupportModal :isOpen="isSupportOpen" @close="isSupportOpen = false" />

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
            :key="tool.name" 
            :to="{ path: tool.path, query: tool.query }"
            class="group bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <!-- Decorative gradient blob -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <!-- New Badge -->
            <div v-if="tool.new" class="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10">NEW</div>

            <div class="relative flex items-start gap-4">
              <div :class="`p-3 rounded-xl ${tool.color} text-white shadow-md group-hover:scale-105 transition-transform duration-300`">
                <component :is="tool.icon" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{{ tool.name }}</h3>
                <p class="text-sm text-slate-600 leading-relaxed">{{ tool.description }}</p>
              </div>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="tag in tool.tags" :key="tag" class="px-2 py-1 bg-slate-50 text-xs text-slate-500 rounded-md border border-slate-100">
                {{ tag }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-slate-500">
      <SearchX class="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <p class="text-lg">{{ $t('home.noResult', { query: searchQuery }) }}</p>
      <button @click="searchQuery = ''" class="mt-4 text-blue-600 hover:underline">{{ $t('home.clearSearch') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearch } from '../composables/useSearch'
import SupportModal from '../components/SupportModal.vue'
import { 
  Clock, Code2, Image, Scale, Bot, 
  Wrench, SearchX, Terminal, Palette, Coffee,
  FileJson, Hash, Link, Replace, Type, KeyRound, 
  FileType, Minimize2, Edit3, GitCompare, Stamp, QrCode,
  FileText, FileSpreadsheet, Presentation, File,
  Heart
} from 'lucide-vue-next'

interface Tool {
  name: string
  description: string
  path: string
  query?: Record<string, string>
  icon: any
  color: string
  tags: string[]
  new?: boolean
}

interface Category {
  title: string
  icon: any
  tools: Tool[]
}

const { t } = useI18n()
const { searchQuery } = useSearch()
const isSupportOpen = ref(false)

// Tool Data with Categories
const categories = computed<Category[]>(() => [
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
        name: t('home.tools.json.name'), 
        description: t('home.tools.json.desc'), 
        path: '/dev-tools',
        query: { tool: 'json' },
        icon: FileJson,
        color: 'bg-orange-500',
        tags: ['JSON', 'Format', 'Minify']
      },
      { 
        name: t('home.tools.text.name'), 
        description: t('home.tools.text.desc'), 
        path: '/dev-tools',
        query: { tool: 'text' },
        icon: Type,
        color: 'bg-slate-500',
        tags: ['Word Count', 'Case', 'Stats'],
        new: true
      },
      { 
        name: t('home.tools.base64.name'), 
        description: t('home.tools.base64.desc'), 
        path: '/dev-tools',
        query: { tool: 'base64' },
        icon: Code2,
        color: 'bg-blue-500',
        tags: ['Base64', 'Encode', 'Decode']
      },
      { 
        name: t('home.tools.url.name'), 
        description: t('home.tools.url.desc'), 
        path: '/dev-tools',
        query: { tool: 'url' },
        icon: Link,
        color: 'bg-cyan-500',
        tags: ['URL', 'Encode', 'Decode']
      },
      { 
        name: t('home.tools.hash.name'), 
        description: t('home.tools.hash.desc'), 
        path: '/dev-tools',
        query: { tool: 'hash' },
        icon: Hash,
        color: 'bg-indigo-500',
        tags: ['MD5', 'SHA', 'Hash']
      },
      { 
        name: t('home.tools.regex.name'), 
        description: t('home.tools.regex.desc'), 
        path: '/dev-tools',
        query: { tool: 'regex' },
        icon: Replace,
        color: 'bg-yellow-500',
        tags: ['Regex', 'Test', 'Match']
      },
      { 
        name: t('home.tools.diff.name'), 
        description: t('home.tools.diff.desc'), 
        path: '/dev-tools',
         query: { tool: 'diff' },
         icon: GitCompare,
         color: 'bg-slate-600',
         tags: ['Diff', 'Compare', 'Text'],
        new: true
      },
      { 
        name: t('home.tools.generator.name'), 
        description: t('home.tools.generator.desc'), 
        path: '/dev-tools',
        query: { tool: 'generator' },
        icon: KeyRound,
        color: 'bg-green-600',
        tags: ['UUID', 'Password', 'Random'],
        new: true
      },
      { 
        name: t('home.tools.qr.name'), 
        description: t('home.tools.qr.desc'), 
        path: '/dev-tools',
        query: { tool: 'qr' },
        icon: QrCode,
        color: 'bg-gray-800',
        tags: ['QR Code', 'Generator', 'Image'],
        new: true
      },
    ]
  },
  {
    title: t('home.categories.design'),
    icon: Palette,
    tools: [
      { 
        name: t('home.tools.imageConvert.name'), 
        description: t('home.tools.imageConvert.desc'), 
        path: '/image-tools',
        query: { tool: 'convert' },
        icon: FileType,
        color: 'bg-blue-500',
        tags: ['Convert', 'PNG', 'JPG']
      },
      { 
        name: t('home.tools.imageEditor.name'), 
        description: t('home.tools.imageEditor.desc'), 
        path: '/image-tools',
        query: { tool: 'editor' },
        icon: Edit3,
        color: 'bg-purple-600',
        tags: ['Edit', 'Rotate', 'Filter'],
        new: true
      },
      { 
        name: t('home.tools.watermark.name'), 
        description: t('home.tools.watermark.desc'), 
        path: '/image-tools',
        query: { tool: 'watermark' },
        icon: Stamp,
        color: 'bg-cyan-600',
        tags: ['Watermark', 'Protect', 'Copyright'],
        new: true
      },
      { 
        name: t('home.tools.imageCompress.name'), 
        description: t('home.tools.imageCompress.desc'), 
        path: '/image-tools',
        query: { tool: 'compress' },
        icon: Minimize2,
        color: 'bg-pink-500',
        tags: ['Compress', 'Size', 'Reduce']
      },
      { 
        name: t('home.tools.color.name'), 
        description: t('home.tools.color.desc'), 
        path: '/image-tools',
        query: { tool: 'color' },
        icon: Palette,
        color: 'bg-indigo-600',
        tags: ['Color', 'Convert', 'Picker'],
        new: true
      },
      { 
        name: t('home.tools.idPhoto.name'), 
        description: t('home.tools.idPhoto.desc'), 
        path: '/image-tools',
        query: { tool: 'idphoto' },
        icon: Image,
        color: 'bg-rose-500',
        tags: ['ID Photo', 'Background', 'Passport']
      },
      { 
        name: t('home.tools.aiTools.name'), 
        description: t('home.tools.aiTools.desc'), 
        path: '/ai-tools',
        icon: Bot,
        color: 'bg-violet-500',
        tags: ['ChatGPT', 'Midjourney', 'AI']
      },
    ]
  },
  {
    title: t('home.categories.doc'),
    icon: FileText,
    tools: [
      {
        name: t('docTools.pdf.title'),
        description: t('docTools.pdf.sort'),
        path: '/doc-tools',
        query: { tab: 'pdf' },
        icon: File,
        color: 'bg-red-500',
        tags: ['PDF', 'Merge', 'Sort', 'Rotate']
      },
      {
        name: t('docTools.excel.title'),
        description: t('docTools.excel.extractImages'),
        path: '/doc-tools',
        query: { tab: 'excel' },
        icon: FileSpreadsheet,
        color: 'bg-green-600',
        tags: ['Excel', 'Images', 'Convert']
      },
      {
        name: t('docTools.ppt.title'),
        description: t('docTools.ppt.extractImages'),
        path: '/doc-tools',
        query: { tab: 'ppt' },
        icon: Presentation,
        color: 'bg-orange-500',
        tags: ['PPT', 'Images', 'Extract']
      },
      {
        name: t('docTools.word.title'),
        description: t('docTools.word.extractImages'),
        path: '/doc-tools',
        query: { tab: 'word' },
        icon: FileText,
        color: 'bg-blue-600',
        tags: ['Word', 'Images', 'Extract']
      }
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
