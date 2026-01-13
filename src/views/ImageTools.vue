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
          <h3 class="font-medium text-gray-900 mb-4">{{ $t('imageTools.convert.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" @change="handleConvertFile" />
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">{{ $t('imageTools.convert.upload') }}</span>
              </div>
              <div v-if="convertSource" class="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle class="w-4 h-4" />
                {{ $t('imageTools.convert.selected', { name: convertSource.name }) }}
              </div>
            </div>

            <div class="space-y-4 flex flex-col justify-center">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('imageTools.convert.target') }}</label>
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
                {{ $t('imageTools.convert.start') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Image Editor -->
      <div v-if="currentTool === 'editor'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900">{{ $t('imageTools.editor.title') }}</h3>
            <button 
              @click="downloadEdited" 
              :disabled="!editorSource"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Download class="w-4 h-4" /> {{ $t('imageTools.editor.download') }}
            </button>
          </div>

          <div class="flex-1 flex gap-6 min-h-0">
            <!-- Canvas Area -->
            <div class="flex-1 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden group">
              <div v-if="!editorSource" class="text-center">
                <label class="cursor-pointer flex flex-col items-center p-8">
                  <Upload class="w-12 h-12 text-gray-400 mb-4" />
                  <span class="text-gray-500 font-medium">{{ $t('imageTools.editor.upload') }}</span>
                  <input type="file" class="hidden" accept="image/*" @change="handleEditorFile" />
                </label>
              </div>
              <div v-else class="relative max-w-full max-h-full p-4">
                <img :src="editorPreviewUrl!" :style="editorStyle" class="max-w-full max-h-[60vh] object-contain transition-all duration-300" />
                
                <button @click="editorSource = null" class="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Controls -->
            <div class="w-72 flex flex-col gap-6 overflow-y-auto pr-2">
              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <RotateCw class="w-4 h-4" /> Transform
                </h4>
                <div class="grid grid-cols-2 gap-2">
                  <button @click="rotate(-90)" class="p-2 border border-gray-200 rounded hover:bg-gray-50 flex justify-center" :title="$t('imageTools.editor.rotateLeft')">
                    <RotateCcw class="w-4 h-4" />
                  </button>
                  <button @click="rotate(90)" class="p-2 border border-gray-200 rounded hover:bg-gray-50 flex justify-center" :title="$t('imageTools.editor.rotateRight')">
                    <RotateCw class="w-4 h-4" />
                  </button>
                  <button @click="flip('h')" class="p-2 border border-gray-200 rounded hover:bg-gray-50 flex justify-center" :title="$t('imageTools.editor.flipH')">
                    <MoveHorizontal class="w-4 h-4" />
                  </button>
                  <button @click="flip('v')" class="p-2 border border-gray-200 rounded hover:bg-gray-50 flex justify-center" :title="$t('imageTools.editor.flipV')">
                    <MoveVertical class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Sun class="w-4 h-4" /> {{ $t('imageTools.editor.adjust') }}
                </h4>
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs mb-1 text-gray-500">
                      <span>{{ $t('imageTools.editor.brightness') }}</span>
                      <span>{{ editorState.brightness }}%</span>
                    </div>
                    <input type="range" v-model.number="editorState.brightness" min="0" max="200" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1 text-gray-500">
                      <span>{{ $t('imageTools.editor.contrast') }}</span>
                      <span>{{ editorState.contrast }}%</span>
                    </div>
                    <input type="range" v-model.number="editorState.contrast" min="0" max="200" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Moon class="w-4 h-4" /> {{ $t('imageTools.editor.filters') }}
                </h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="editorState.grayscale" class="rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ $t('imageTools.editor.grayscale') }}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="editorState.invert" class="rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-sm text-gray-700">{{ $t('imageTools.editor.invert') }}</span>
                  </label>
                </div>
              </div>

              <button @click="resetEditor" class="mt-auto w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
                <RefreshCcw class="w-4 h-4" /> {{ $t('imageTools.editor.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Watermark Tool -->
      <div v-if="currentTool === 'watermark'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900">{{ $t('imageTools.watermark.title') }}</h3>
            <button 
              @click="downloadWatermark" 
              :disabled="!watermarkPreviewUrl"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Download class="w-4 h-4" /> {{ $t('imageTools.watermark.download') }}
            </button>
          </div>

          <div class="flex-1 flex gap-6 min-h-0">
            <!-- Preview Area -->
            <div class="flex-1 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden group">
              <div v-if="!watermarkSource" class="text-center">
                <label class="cursor-pointer flex flex-col items-center p-8">
                  <Upload class="w-12 h-12 text-gray-400 mb-4" />
                  <span class="text-gray-500 font-medium">{{ $t('imageTools.watermark.upload') }}</span>
                  <input type="file" class="hidden" accept="image/*" @change="handleWatermarkFile" />
                </label>
              </div>
              <div v-else class="relative max-w-full max-h-full p-4">
                <img :src="watermarkPreviewUrl || watermarkSource" class="max-w-full max-h-[60vh] object-contain" />
                <button @click="watermarkSource = null; watermarkPreviewUrl = null" class="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Controls -->
            <div class="w-72 flex flex-col gap-6 overflow-y-auto pr-2">
              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900">{{ $t('imageTools.watermark.settings') }}</h4>
                
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('imageTools.watermark.text') }}</label>
                  <input v-model="watermarkText" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('imageTools.watermark.size') }} ({{ watermarkSize }}px)</label>
                  <input v-model.number="watermarkSize" type="range" min="12" max="100" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('imageTools.watermark.color') }}</label>
                  <div class="flex gap-2">
                    <input v-model="watermarkColor" type="color" class="h-8 w-full rounded cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('imageTools.watermark.opacity') }} ({{ watermarkOpacity }}%)</label>
                  <input v-model.number="watermarkOpacity" type="range" min="0" max="100" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('imageTools.watermark.position') }}</label>
                  <select v-model="watermarkPos" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="tile">{{ $t('imageTools.watermark.pos.tile') }}</option>
                    <option value="tl">{{ $t('imageTools.watermark.pos.tl') }}</option>
                    <option value="tm">{{ $t('imageTools.watermark.pos.tm') }}</option>
                    <option value="tr">{{ $t('imageTools.watermark.pos.tr') }}</option>
                    <option value="ml">{{ $t('imageTools.watermark.pos.ml') }}</option>
                    <option value="mm">{{ $t('imageTools.watermark.pos.center') }}</option>
                    <option value="mr">{{ $t('imageTools.watermark.pos.mr') }}</option>
                    <option value="bl">{{ $t('imageTools.watermark.pos.bl') }}</option>
                    <option value="bm">{{ $t('imageTools.watermark.pos.bm') }}</option>
                    <option value="br">{{ $t('imageTools.watermark.pos.br') }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. ID Photo (Refactored) -->
      <div v-if="currentTool === 'idphoto'" class="h-full flex flex-col md:flex-row gap-6">
        <!-- Reuse previous IdPhoto Logic -->
        <div class="w-full md:w-80 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div>
            <h3 class="font-medium text-gray-900 mb-4">{{ $t('imageTools.idphoto.uploadTitle') }}</h3>
            <label class="block w-full cursor-pointer">
              <div class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">{{ $t('imageTools.idphoto.uploadDesc') }}</span>
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleIdFileChange" />
            </label>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-4">{{ $t('imageTools.idphoto.bgTitle') }}</h3>
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
            <Download class="w-4 h-4" /> {{ $t('imageTools.idphoto.download') }}
          </button>
        </div>
        <div class="flex-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-8 overflow-hidden relative min-h-[400px]">
          <div v-if="idImageUrl" class="relative shadow-2xl transition-colors duration-300" :style="{ backgroundColor: selectedIdColor }">
            <img :src="idImageUrl" class="max-h-[60vh] object-contain block" alt="Preview" />
          </div>
          <div v-else class="text-center text-gray-400">
            <Image class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{{ $t('imageTools.idphoto.preview') }}</p>
          </div>
        </div>
      </div>

      <!-- 5. Image Compression -->
      <div v-if="currentTool === 'compress'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="font-medium text-gray-900 mb-4">{{ $t('imageTools.compress.title') }}</h3>
          <div class="space-y-6">
            <div class="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" @change="handleCompressFile" />
              <div v-if="!compressSource" class="flex flex-col items-center">
                <Upload class="w-8 h-8 text-gray-400 mb-2" />
                <span class="text-sm text-gray-500">{{ $t('imageTools.compress.upload') }}</span>
              </div>
              <div v-else class="flex flex-col items-center text-green-600">
                <CheckCircle class="w-8 h-8 mb-2" />
                <span>{{ compressSource.name }} ({{ formatSize(compressSource.size) }})</span>
              </div>
            </div>

            <div v-if="compressSource" class="space-y-4">
              <div>
                <label class="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>{{ $t('imageTools.compress.quality') }}</span>
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
                  {{ $t('imageTools.compress.start') }}
                </button>
              </div>

              <div v-if="compressedResult" class="p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium text-green-800">{{ $t('imageTools.compress.done') }}</div>
                  <div class="text-xs text-green-600">
                    {{ formatSize(compressSource.size) }} -> {{ formatSize(compressedResult.size) }} 
                    <span class="font-bold">(-{{ Math.round((1 - compressedResult.size / compressSource.size) * 100) }}%)</span>
                  </div>
                </div>
                <button @click="downloadCompressed" class="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 text-sm">
                  {{ $t('imageTools.compress.download') }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Image, FileType, Upload, Download, CheckCircle, Minimize2, Edit3, RotateCcw, RotateCw, MoveHorizontal, MoveVertical, RefreshCcw, Sun, Moon, Stamp } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const currentTool = ref('convert')

const tools = computed(() => [
  { id: 'convert', name: t('imageTools.nav.convert'), icon: FileType },
  { id: 'editor', name: t('imageTools.nav.editor'), icon: Edit3 },
  { id: 'watermark', name: t('imageTools.nav.watermark'), icon: Stamp },
  { id: 'idphoto', name: t('imageTools.nav.idphoto'), icon: Image },
  { id: 'compress', name: t('imageTools.nav.compress'), icon: Minimize2 },
])

onMounted(() => {
  if (route.query.tool && tools.value.some(t => t.id === route.query.tool)) {
    currentTool.value = route.query.tool as string
  }
})

watch(currentTool, (newTool) => {
  router.replace({ query: { ...route.query, tool: newTool } })
})

watch(() => route.query.tool, (newTool) => {
  if (newTool && tools.value.some(t => t.id === newTool)) {
    currentTool.value = newTool as string
  }
})

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

// --- Image Editor Logic ---
const editorSource = ref<string | null>(null)
const editorPreviewUrl = ref<string | null>(null)
const editorState = ref({
  rotate: 0,
  flipH: 1,
  flipV: 1,
  brightness: 100,
  contrast: 100,
  grayscale: false,
  invert: false
})

const handleEditorFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editorSource.value = e.target?.result as string
      editorPreviewUrl.value = e.target?.result as string
      resetEditor()
    }
    reader.readAsDataURL(file)
  }
}

const editorStyle = computed(() => {
  return {
    transform: `rotate(${editorState.value.rotate}deg) scale(${editorState.value.flipH}, ${editorState.value.flipV})`,
    filter: `brightness(${editorState.value.brightness}%) contrast(${editorState.value.contrast}%) grayscale(${editorState.value.grayscale ? 100 : 0}%) invert(${editorState.value.invert ? 100 : 0}%)`
  }
})

const rotate = (deg: number) => editorState.value.rotate += deg
const flip = (dir: 'h' | 'v') => {
  if (dir === 'h') editorState.value.flipH *= -1
  else editorState.value.flipV *= -1
}
const resetEditor = () => {
  editorState.value = { rotate: 0, flipH: 1, flipV: 1, brightness: 100, contrast: 100, grayscale: false, invert: false }
}

const downloadEdited = () => {
  if (!editorSource.value) return
  
  const img = document.createElement('img')
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate dimensions based on rotation
    const rot = (editorState.value.rotate % 360 + 360) % 360
    if (rot === 90 || rot === 270) {
      canvas.width = img.height
      canvas.height = img.width
    } else {
      canvas.width = img.width
      canvas.height = img.height
    }

    // Apply filters
    ctx.filter = `brightness(${editorState.value.brightness}%) contrast(${editorState.value.contrast}%) grayscale(${editorState.value.grayscale ? 100 : 0}%) invert(${editorState.value.invert ? 100 : 0}%)`

    // Apply transforms
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(editorState.value.rotate * Math.PI / 180)
    ctx.scale(editorState.value.flipH, editorState.value.flipV)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)

    const link = document.createElement('a')
    link.download = 'edited-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  img.src = editorSource.value
}

// --- Watermark Logic ---
const watermarkSource = ref<string | null>(null)
const watermarkPreviewUrl = ref<string | null>(null)
const watermarkText = ref('TechRock Tools')
const watermarkSize = ref(24)
const watermarkColor = ref('#ffffff')
const watermarkOpacity = ref(50)
const watermarkPos = ref('br') // tl, tm, tr, ml, mm, mr, bl, bm, br, tile

const handleWatermarkFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      watermarkSource.value = e.target?.result as string
      renderWatermark()
    }
    reader.readAsDataURL(file)
  }
}

watch([watermarkText, watermarkSize, watermarkColor, watermarkOpacity, watermarkPos], () => {
  if (watermarkSource.value) renderWatermark()
})

const renderWatermark = () => {
  if (!watermarkSource.value) return
  const img = document.createElement('img')
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(img, 0, 0)
    
    ctx.font = `${watermarkSize.value}px sans-serif`
    ctx.fillStyle = watermarkColor.value
    ctx.globalAlpha = watermarkOpacity.value / 100
    
    const text = watermarkText.value
    const metrics = ctx.measureText(text)
    const textW = metrics.width
    const textH = watermarkSize.value // Approximate height
    
    const padding = 20
    let x = 0
    let y = 0
    
    if (watermarkPos.value === 'tile') {
      ctx.rotate(-45 * Math.PI / 180)
      for (let i = -canvas.width; i < canvas.width * 2; i += textW + 100) {
        for (let j = -canvas.height; j < canvas.height * 2; j += textH + 100) {
          ctx.fillText(text, i, j)
        }
      }
    } else {
      // Simple positioning
      switch(watermarkPos.value) {
        case 'tl': x = padding; y = textH + padding; break;
        case 'tm': x = (canvas.width - textW) / 2; y = textH + padding; break;
        case 'tr': x = canvas.width - textW - padding; y = textH + padding; break;
        case 'ml': x = padding; y = (canvas.height + textH) / 2; break;
        case 'mm': x = (canvas.width - textW) / 2; y = (canvas.height + textH) / 2; break;
        case 'mr': x = canvas.width - textW - padding; y = (canvas.height + textH) / 2; break;
        case 'bl': x = padding; y = canvas.height - padding; break;
        case 'bm': x = (canvas.width - textW) / 2; y = canvas.height - padding; break;
        case 'br': x = canvas.width - textW - padding; y = canvas.height - padding; break;
      }
      ctx.fillText(text, x, y)
    }
    
    watermarkPreviewUrl.value = canvas.toDataURL()
  }
  img.src = watermarkSource.value
}

const downloadWatermark = () => {
  if (watermarkPreviewUrl.value) {
    const link = document.createElement('a')
    link.download = 'watermarked-image.png'
    link.href = watermarkPreviewUrl.value
    link.click()
  }
}

// --- ID Photo Logic ---
const idImageUrl = ref<string | null>(null)
const selectedIdColor = ref('#ffffff')
const idColors = computed(() => [
  { name: t('imageTools.idphoto.colors.white'), value: '#ffffff' },
  { name: t('imageTools.idphoto.colors.blue'), value: '#438edb' },
  { name: t('imageTools.idphoto.colors.red'), value: '#d9001b' },
  { name: t('imageTools.idphoto.colors.gray'), value: '#808080' },
])

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
