<template>
  <div class="space-y-8">
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
      <h2 class="text-3xl font-bold mb-2">{{ $t('aiTools.title') }}</h2>
      <p class="text-blue-100">{{ $t('aiTools.desc') }}</p>
    </div>

    <div v-for="category in categories" :key="category.title" class="space-y-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <component :is="category.icon" class="w-6 h-6 text-blue-600" />
        {{ category.title }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <a 
          v-for="tool in category.tools" 
          :key="tool.name" 
          :href="tool.url"
          target="_blank"
          class="group block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {{ tool.name[0] }}
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full" v-if="tool.tag">{{ tool.tag }}</span>
          </div>
          <h4 class="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{{ tool.name }}</h4>
          <p class="text-sm text-gray-500 line-clamp-2">{{ tool.description }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Presentation, FileText, Globe, Palette } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const categories = computed(() => [
  {
    title: t('aiTools.categories.ppt'),
    icon: Presentation,
    tools: [
      { name: 'Gamma', url: 'https://gamma.app', description: t('aiTools.tools.gamma'), tag: t('aiTools.tags.recommend') },
      { name: 'Tome', url: 'https://tome.app', description: t('aiTools.tools.tome') },
      { name: 'Beautiful.ai', url: 'https://www.beautiful.ai', description: t('aiTools.tools.beautiful') },
    ]
  },
  {
    title: t('aiTools.categories.writing'),
    icon: FileText,
    tools: [
      { name: 'ChatGPT', url: 'https://chat.openai.com', description: t('aiTools.tools.chatgpt'), tag: t('aiTools.tags.must') },
      { name: 'Claude', url: 'https://claude.ai', description: t('aiTools.tools.claude') },
      { name: 'Notion AI', url: 'https://www.notion.so', description: t('aiTools.tools.notion') },
    ]
  },
  {
    title: t('aiTools.categories.web'),
    icon: Globe,
    tools: [
      { name: 'v0.dev', url: 'https://v0.dev', description: t('aiTools.tools.v0'), tag: t('aiTools.tags.dev') },
      { name: 'Framer AI', url: 'https://www.framer.com', description: t('aiTools.tools.framer') },
      { name: 'Dora AI', url: 'https://www.dora.run', description: t('aiTools.tools.dora') },
    ]
  },
  {
    title: t('aiTools.categories.art'),
    icon: Palette,
    tools: [
      { name: 'Midjourney', url: 'https://www.midjourney.com', description: t('aiTools.tools.midjourney'), tag: t('aiTools.tags.paid') },
      { name: 'Stable Diffusion', url: 'https://stability.ai', description: t('aiTools.tools.stable') },
      { name: 'Canva', url: 'https://www.canva.com', description: t('aiTools.tools.canva') },
    ]
  }
])
</script>
