<template>
  <div class="space-y-8">
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
      <h2 class="text-3xl font-bold mb-2">AI 工具聚合</h2>
      <p class="text-blue-100">精选全球最强 AI 生产力工具，助你效率倍增。</p>
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
import { Presentation, FileText, Globe, Palette } from 'lucide-vue-next'

const categories = [
  {
    title: 'PPT / 演示文稿',
    icon: Presentation,
    tools: [
      { name: 'Gamma', url: 'https://gamma.app', description: '一键生成精美 PPT、文档和网页，支持高度自定义。', tag: '推荐' },
      { name: 'Tome', url: 'https://tome.app', description: 'AI 驱动的讲故事工具，快速创建沉浸式演示文稿。' },
      { name: 'Beautiful.ai', url: 'https://www.beautiful.ai', description: '智能排版设计，让你的 PPT 瞬间变专业。' },
    ]
  },
  {
    title: '论文 / 写作辅助',
    icon: FileText,
    tools: [
      { name: 'ChatGPT', url: 'https://chat.openai.com', description: '最强大的通用 AI 助手，辅助写作、润色、翻译。', tag: '必备' },
      { name: 'Claude', url: 'https://claude.ai', description: '擅长长文本分析和写作，逻辑性强，更具人性化。' },
      { name: 'Notion AI', url: 'https://www.notion.so', description: '直接在笔记中集成 AI 写作，无缝工作流体验。' },
    ]
  },
  {
    title: '网站 / UI 生成',
    icon: Globe,
    tools: [
      { name: 'v0.dev', url: 'https://v0.dev', description: 'Vercel 出品，用自然语言生成 React/Tailwind 代码。', tag: '开发' },
      { name: 'Framer AI', url: 'https://www.framer.com', description: '输入提示词，瞬间生成高保真设计图并发布为网站。' },
      { name: 'Dora AI', url: 'https://www.dora.run', description: '专注于生成 3D 动画效果的酷炫网站。' },
    ]
  },
  {
    title: '绘画 / 设计',
    icon: Palette,
    tools: [
      { name: 'Midjourney', url: 'https://www.midjourney.com', description: '目前画质最强的 AI 绘画工具，艺术感极佳。', tag: '付费' },
      { name: 'Stable Diffusion', url: 'https://stability.ai', description: '开源强大的绘画模型，可本地部署，控制力强。' },
      { name: 'Canva', url: 'https://www.canva.com', description: '集成 AI 绘画与设计工具，小白也能做设计。' },
    ]
  }
]
</script>
