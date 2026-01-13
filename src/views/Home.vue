<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
        v-for="tool in tools" 
        :key="tool.path" 
        :to="tool.path"
        class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow group"
      >
        <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
          <component :is="tool.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tool.name }}</h3>
        <p class="text-sm text-gray-500">{{ tool.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, FileJson, Image, Bot, MoreHorizontal } from 'lucide-vue-next'

const tools = [
  { 
    name: '时间戳转换', 
    description: 'Unix 时间戳与日期时间相互转换，支持多种格式。', 
    path: '/timestamp',
    icon: Clock
  },
  { 
    name: 'JSON/文本格式化', 
    description: 'JSON 美化、压缩、校验，以及普通文本处理。', 
    path: '/json-format',
    icon: FileJson
  },
  { 
    name: '证件照换底', 
    description: '快速更换证件照背景颜色，支持红/蓝/白底。', 
    path: '/id-photo',
    icon: Image
  },
  { 
    name: 'AI 聚合站', 
    description: '精选 AI 工具集合，覆盖 PPT、写作、绘画等。', 
    path: '/ai-tools',
    icon: Bot
  },
  { 
    name: '其他常用工具', 
    description: '二维码生成、单位换算、颜色提取等日常小工具。', 
    path: '/other-tools',
    icon: MoreHorizontal
  },
]
</script>
