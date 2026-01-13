<template>
  <div class="space-y-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          {{ t('docTools.word.extractImages') }}
        </button>
      </nav>
    </div>

    <!-- Image Extraction -->
    <div class="space-y-6">
      <div v-if="!file" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors cursor-pointer" @click="triggerFileInput">
        <div class="space-y-1 text-center">
          <FileText class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <span class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              {{ t('docTools.word.upload') }}
            </span>
          </div>
          <p class="text-xs text-gray-500">Word (.docx) up to 50MB</p>
        </div>
      </div>
      <input type="file" ref="fileInput" class="hidden" accept=".docx" @change="handleFileUpload" />

      <div v-if="file" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ file.name }}</h3>
          <button @click="downloadAll" v-if="images.length > 0" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {{ t('docTools.pdf.download') }} All
          </button>
          <button @click="clearFile" class="text-sm text-red-600 hover:text-red-500">{{ t('docTools.pdf.delete') }}</button>
        </div>
      </div>

      <div v-if="isProcessing" class="text-center py-12 text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        {{ t('docTools.pdf.processing') }}
      </div>

      <div v-else-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="(img, index) in images" :key="index" class="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div class="aspect-square bg-white flex items-center justify-center relative">
            <img :src="img.url" class="max-w-full max-h-full object-contain" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <button @click="downloadImage(img)" class="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700">
                 <Download class="w-5 h-5" />
               </button>
            </div>
          </div>
          <div class="p-2 text-xs text-gray-500 truncate text-center">{{ img.name }}</div>
        </div>
      </div>
      
      <div v-else-if="file" class="text-center py-8 text-gray-500">
        No images found in this document.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileText, Download } from 'lucide-vue-next'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const images = ref<Array<{ name: string, url: string, blob: Blob }>>([])
const isProcessing = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    isProcessing.value = true
    images.value = []
    
    try {
      const zip = await JSZip.loadAsync(target.files[0])
      const imageFiles: { name: string, path: string }[] = []
      
      zip.forEach((relativePath) => {
        if (relativePath.startsWith('word/media/')) {
          imageFiles.push({ name: relativePath.split('/').pop() || 'image', path: relativePath })
        }
      })
      
      for (const img of imageFiles) {
        const blob = await zip.file(img.path)?.async('blob')
        if (blob) {
          const url = URL.createObjectURL(blob)
          images.value.push({ name: img.name, url, blob })
        }
      }
    } catch (error) {
      console.error('Error parsing Word file:', error)
      alert('Failed to parse Word file')
    } finally {
      isProcessing.value = false
    }
  }
}

const clearFile = () => {
  file.value = null
  images.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const downloadImage = (img: { name: string, blob: Blob }) => {
  saveAs(img.blob, img.name)
}

const downloadAll = async () => {
  if (images.value.length === 0) return
  
  const zip = new JSZip()
  images.value.forEach(img => {
    zip.file(img.name, img.blob)
  })
  
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${file.value?.name.replace('.docx', '')}_images.zip`)
}
</script>
