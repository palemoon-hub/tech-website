<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
    <!-- Controls -->
    <div class="w-full md:w-80 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
      <div>
        <h3 class="font-medium text-gray-900 mb-4">1. 上传照片</h3>
        <label class="block w-full cursor-pointer">
          <div class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload class="w-8 h-8 text-gray-400 mb-2" />
            <span class="text-sm text-gray-500">点击上传或拖拽</span>
          </div>
          <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
        </label>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-4">2. 选择底色</h3>
        <div class="grid grid-cols-4 gap-3">
          <button 
            v-for="color in colors" 
            :key="color.value"
            @click="selectedColor = color.value"
            class="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
            :class="selectedColor === color.value ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'"
            :style="{ backgroundColor: color.value }"
            :title="color.name"
          ></button>
          <div class="relative w-10 h-10">
            <input 
              type="color" 
              v-model="selectedColor"
              class="w-10 h-10 rounded-full border-0 p-0 overflow-hidden cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-900 mb-4">3. 下载</h3>
        <button 
          @click="downloadImage"
          :disabled="!imageUrl"
          class="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Download class="w-4 h-4" />
          保存图片
        </button>
      </div>

      <div class="p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg border border-yellow-200">
        注意：本工具仅演示底色更换功能。请上传已抠图的透明背景 PNG 图片以获得最佳效果。
      </div>
    </div>

    <!-- Preview -->
    <div class="flex-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-8 overflow-hidden relative">
      <div 
        v-if="imageUrl"
        class="relative shadow-2xl transition-colors duration-300"
        :style="{ backgroundColor: selectedColor }"
      >
        <img :src="imageUrl" class="max-h-[60vh] object-contain block" alt="Preview" />
      </div>
      <div v-else class="text-center text-gray-400">
        <Image class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>预览区域</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Download, Image } from 'lucide-vue-next'

const imageUrl = ref<string | null>(null)
const selectedColor = ref('#ffffff')

const colors = [
  { name: '白底', value: '#ffffff' },
  { name: '蓝底', value: '#438edb' },
  { name: '红底', value: '#d9001b' },
  { name: '灰底', value: '#808080' },
]

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const downloadImage = () => {
  if (!imageUrl.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = document.createElement('img')
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    
    if (ctx) {
      // Draw background
      ctx.fillStyle = selectedColor.value
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // Draw image
      ctx.drawImage(img, 0, 0)
      
      const link = document.createElement('a')
      link.download = 'id-photo-edited.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }
  img.src = imageUrl.value
}
</script>
