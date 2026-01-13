<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col gap-6">
    <!-- Tools Navigation -->
    <div class="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
      <button 
        v-for="tool in tools" 
        :key="tool.id"
        @click="currentTool = tool.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
        :class="currentTool === tool.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
      >
        <component :is="tool.icon" class="w-4 h-4" />
        {{ tool.name }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="flex-1 min-h-0 overflow-auto">
      
      <!-- 1. Image Converter -->
      <div v-if="currentTool === 'convert'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="font-medium text-gray-900 mb-4">格式转换</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" @change="handleConvertFile" />
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">点击上传图片 (JPG/PNG/WEBP/GIF)</span>
              </div>
              <div v-if="convertSource" class="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle class="w-4 h-4" />
                已选择: {{ convertSource.name }}
              </div>
            </div>

            <div class="space-y-4 flex flex-col justify-center">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
                <select v-model="targetFormat" class="w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="image/jpeg">JPG / JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                  <option value="image/bmp">BMP</option>
                </select>
              </div>
              <button 
                @click="processConversion" 
                :disabled="!convertSource"
                class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                开始转换并下载
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ID Photo (Refactored) -->
      <div v-if="currentTool === 'idphoto'" class="h-full flex flex-col md:flex-row gap-6">
        <!-- Reuse previous IdPhoto Logic -->
        <div class="w-full md:w-80 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div>
            <h3 class="font-medium text-gray-900 mb-4">上传照片</h3>
            <label class="block w-full cursor-pointer">
              <div class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">点击上传或拖拽</span>
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleIdFileChange" />
            </label>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-4">选择底色</h3>
            <div class="grid grid-cols-4 gap-3">
              <button 
                v-for="color in idColors" 
                :key="color.value"
                @click="selectedIdColor = color.value"
                class="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
                :class="selectedIdColor === color.value ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              ></button>
              <div class="relative w-10 h-10">
                <input type="color" v-model="selectedIdColor" class="w-10 h-10 rounded-full border-0 p-0 overflow-hidden cursor-pointer" />
              </div>
            </div>
          </div>
          <button 
            @click="downloadIdImage"
            :disabled="!idImageUrl"
            class="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download class="w-4 h-4" /> 保存图片
          </button>
        </div>
        <div class="flex-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-8 overflow-hidden relative min-h-[400px]">
          <div v-if="idImageUrl" class="relative shadow-2xl transition-colors duration-300" :style="{ backgroundColor: selectedIdColor }">
            <img :src="idImageUrl" class="max-h-[60vh] object-contain block" alt="Preview" />
          </div>
          <div v-else class="text-center text-gray-400">
            <Image class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>预览区域</p>
          </div>
        </div>
      </div>

      <!-- 3. Image Compression -->
      <div v-if="currentTool === 'compress'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="font-medium text-gray-900 mb-4">图片压缩</h3>
          <div class="space-y-6">
            <div class="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" @change="handleCompressFile" />
              <div v-if="!compressSource" class="flex flex-col items-center">
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">上传图片</span>
              </div>
              <div v-else class="flex flex-col items-center text-green-600">
                <CheckCircle class="w-8 h-8 mb-2" />
                <span>{{ compressSource.name }} ({{ formatSize(compressSource.size) }})</span>
              </div>
            </div>

            <div v-if="compressSource" class="space-y-4">
              <div>
                <label class="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>压缩质量</span>
                  <span>{{ compressQuality }}%</span>
                </label>
                <input 
                  type="range" 
                  v-model.number="compressQuality" 
                  min="1" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div class="flex gap-4">
                <button @click="processCompression" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  开始压缩
                </button>
              </div>

              <div v-if="compressedResult" class="p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium text-green-800">压缩完成</div>
                  <div class="text-xs text-green-600">
                    {{ formatSize(compressSource.size) }} -> {{ formatSize(compressedResult.size) }} 
                    <span class="font-bold">(-{{ Math.round((1 - compressedResult.size / compressSource.size) * 100) }}%)</span>
                  </div>
                </div>
                <button @click="downloadCompressed" class="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 text-sm">
                  下载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Image, FileType, Upload, Download, CheckCircle, Minimize2 } from 'lucide-vue-next'

const currentTool = ref('convert')

const tools = [
  { id: 'convert', name: '格式转换', icon: FileType },
  { id: 'idphoto', name: '证件照换底', icon: Image },
  { id: 'compress', name: '图片压缩', icon: Minimize2 },
]

// --- Format Converter Logic ---
const convertSource = ref<File | null>(null)
const targetFormat = ref('image/jpeg')

const handleConvertFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) convertSource.value = file
}

const processConversion = () => {
  if (!convertSource.value) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Fill white background for JPEGs (transparency fix)
        if (targetFormat.value === 'image/jpeg' || targetFormat.value === 'image/bmp') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0)
        
        const dataUrl = canvas.toDataURL(targetFormat.value, 0.9)
        const link = document.createElement('a')
        const ext = targetFormat.value.split('/')[1]
        link.download = `converted.${ext}`
        link.href = dataUrl
        link.click()
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(convertSource.value)
}

// --- ID Photo Logic ---
const idImageUrl = ref<string | null>(null)
const selectedIdColor = ref('#ffffff')
const idColors = [
  { name: '白底', value: '#ffffff' },
  { name: '蓝底', value: '#438edb' },
  { name: '红底', value: '#d9001b' },
  { name: '灰底', value: '#808080' },
]

const handleIdFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => idImageUrl.value = e.target?.result as string
    reader.readAsDataURL(file)
  }
}

const downloadIdImage = () => {
  if (!idImageUrl.value) return
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = document.createElement('img')
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    if (ctx) {
      ctx.fillStyle = selectedIdColor.value
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = 'id-photo-edited.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }
  img.src = idImageUrl.value
}

// --- Compression Logic ---
const compressSource = ref<File | null>(null)
const compressQuality = ref(80)
const compressedResult = ref<{ blob: Blob; size: number; url: string } | null>(null)

const handleCompressFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    compressSource.value = file
    compressedResult.value = null
  }
}

const processCompression = () => {
  if (!compressSource.value) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#FFFFFF' // Handle transparent backgrounds
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            compressedResult.value = {
              blob,
              size: blob.size,
              url: URL.createObjectURL(blob)
            }
          }
        }, 'image/jpeg', compressQuality.value / 100)
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(compressSource.value)
}

const downloadCompressed = () => {
  if (compressedResult.value) {
    const link = document.createElement('a')
    link.download = `compressed-${compressQuality.value}.jpg`
    link.href = compressedResult.value.url
    link.click()
  }
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
