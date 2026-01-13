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
import { Clock, Code2, Image, Scale, Bot, MoreHorizontal } from 'lucide-vue-next'

const tools = [
  { 
    name: '时间戳工具', 
    description: 'Unix 时间戳与日期时间相互转换。', 
    path: '/timestamp',
    icon: Clock
  },
  { 
    name: '开发工具箱', 
    description: 'JSON、Base64、URL 编解码、正则测试、哈希计算。', 
    path: '/dev-tools',
    icon: Code2
  },
  { 
    name: '图片工具箱', 
    description: '格式转换、图片压缩、证件照换底。', 
    path: '/image-tools',
    icon: Image
  },
  { 
    name: '单位换算', 
    description: '长度、面积、重量、体积、温度、数据存储换算。', 
    path: '/unit-converter',
    icon: Scale
  },
  { 
    name: 'AI 聚合站', 
    description: '精选 AI 工具集合，覆盖 PPT、写作、绘画等。', 
    path: '/ai-tools',
    icon: Bot
  },
  { 
    name: '日常工具', 
    description: '二维码生成、颜色转换等日常小工具。', 
    path: '/other-tools',
    icon: MoreHorizontal
  },
]
</script>
