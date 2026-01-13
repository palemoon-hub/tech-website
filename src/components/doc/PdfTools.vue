<template>
  <div class="space-y-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Page Manager (Sort, Delete, Rotate) -->
    <div v-if="currentTab === 'manage'" class="space-y-6">
      <div v-if="!pdfFile" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors cursor-pointer" @click="triggerFileInput">
        <div class="space-y-1 text-center">
          <File class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <span class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              {{ t('docTools.pdf.upload') }}
            </span>
          </div>
          <p class="text-xs text-gray-500">PDF up to 50MB</p>
        </div>
      </div>
      <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileUpload" />

      <div v-if="pdfFile" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ pdfFile.name }}</h3>
          <div class="flex space-x-2">
            <button @click="downloadPdf" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {{ t('docTools.pdf.download') }}
            </button>
            <button @click="clearFile" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {{ t('docTools.pdf.delete') }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="(page, index) in pages" :key="page.id" class="relative group bg-gray-50 p-2 rounded-lg border border-gray-200 hover:border-blue-500 transition-all">
            <div class="aspect-[1/1.4] bg-white shadow-sm flex items-center justify-center overflow-hidden relative">
              <!-- Preview would go here, using a placeholder for now -->
              <div class="text-xs text-gray-400">{{ t('docTools.pdf.page', { page: index + 1 }) }}</div>
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            </div>
            
            <div class="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="rotatePage(index)" class="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600" :title="t('docTools.pdf.rotate')">
                <RotateCw class="w-4 h-4" />
              </button>
              <button @click="deletePage(index)" class="p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-600" :title="t('docTools.pdf.delete')">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="movePage(index, -1)" :disabled="index === 0" class="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600 disabled:opacity-50">
                <ArrowLeft class="w-4 h-4" />
              </button>
              <button @click="movePage(index, 1)" :disabled="index === pages.length - 1" class="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600 disabled:opacity-50">
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Merge Tab -->
    <div v-else-if="currentTab === 'merge'" class="space-y-6">
      <div v-if="mergeFiles.length === 0" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors cursor-pointer" @click="triggerMergeInput">
        <div class="space-y-1 text-center">
          <File class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <span class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              {{ t('docTools.pdf.uploadMultiple') }}
            </span>
          </div>
          <p class="text-xs text-gray-500">Select multiple PDF files</p>
        </div>
      </div>
      <input type="file" ref="mergeInput" class="hidden" accept=".pdf" multiple @change="handleMergeUpload" />

      <div v-if="mergeFiles.length > 0" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ mergeFiles.length }} Files Selected</h3>
          <div class="flex space-x-2">
            <button @click="triggerMergeInput" class="text-sm text-blue-600 hover:text-blue-500">Add more files</button>
            <button @click="mergePdfs" :disabled="isMerging" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {{ isMerging ? t('docTools.pdf.processing') : t('docTools.pdf.merge') }}
            </button>
          </div>
        </div>

        <ul class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <li v-for="(file, index) in mergeFiles" :key="index" class="flex items-center justify-between p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <span class="text-gray-400 font-mono text-sm">{{ index + 1 }}</span>
              <span class="text-sm font-medium text-gray-900">{{ file.name }}</span>
              <span class="text-xs text-gray-500">({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="moveMergeFile(index, -1)" :disabled="index === 0" class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ArrowLeft class="w-4 h-4 rotate-90" />
              </button>
              <button @click="moveMergeFile(index, 1)" :disabled="index === mergeFiles.length - 1" class="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ArrowRight class="w-4 h-4 rotate-90" />
              </button>
              <button @click="removeMergeFile(index)" class="text-red-400 hover:text-red-600">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Text Extraction Tab -->
    <div v-else-if="currentTab === 'text'" class="space-y-6">
      <div v-if="!textFile" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors cursor-pointer" @click="triggerTextInput">
        <div class="space-y-1 text-center">
          <File class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <span class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              {{ t('docTools.pdf.upload') }}
            </span>
          </div>
          <p class="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>
      <input type="file" ref="textInput" class="hidden" accept=".pdf" @change="handleTextUpload" />

      <div v-if="textFile" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ textFile.name }}</h3>
          <button @click="textFile = null; extractedText = ''" class="text-sm text-red-600 hover:text-red-500">{{ t('docTools.pdf.delete') }}</button>
        </div>

        <div v-if="isExtracting" class="text-center py-12 text-gray-500">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {{ t('docTools.pdf.processing') }}
        </div>

        <div v-else-if="extractedText" class="space-y-4">
          <div class="flex justify-end space-x-2">
            <button @click="copyText" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Copy Text
            </button>
            <button @click="downloadText" class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              Download .txt
            </button>
          </div>
          <textarea 
            readonly 
            class="w-full h-96 p-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
            v-model="extractedText"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Other tabs placeholders -->
    <div v-else class="text-center py-12 text-gray-500">
      Feature coming soon...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { File, RotateCw, Trash2, ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { PDFDocument, degrees } from 'pdf-lib'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const { t } = useI18n()

const currentTab = ref('manage')
const fileInput = ref<HTMLInputElement | null>(null)
const pdfFile = ref<File | null>(null)
const pages = ref<Array<{ id: number, rotation: number, originalIndex: number }>>([])
const isProcessing = ref(false)

const tabs = computed(() => [
  { id: 'manage', name: t('docTools.pdf.sort') },
  { id: 'merge', name: t('docTools.pdf.merge') },
  { id: 'text', name: t('docTools.pdf.text') },
  // { id: 'image', name: t('docTools.pdf.image') },
])

// Merge Logic
const mergeInput = ref<HTMLInputElement | null>(null)
const mergeFiles = ref<File[]>([])
const isMerging = ref(false)

const triggerMergeInput = () => mergeInput.value?.click()

const handleMergeUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    mergeFiles.value = [...mergeFiles.value, ...Array.from(target.files)]
  }
}

const removeMergeFile = (index: number) => {
  mergeFiles.value.splice(index, 1)
}

const moveMergeFile = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < mergeFiles.value.length) {
    const file = mergeFiles.value[index]
    if (file) {
      mergeFiles.value.splice(index, 1)
      mergeFiles.value.splice(newIndex, 0, file)
    }
  }
}

const mergePdfs = async () => {
  if (mergeFiles.value.length < 2) return
  isMerging.value = true
  
  try {
    const mergedDoc = await PDFDocument.create()
    
    for (const file of mergeFiles.value) {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())
      copiedPages.forEach((page) => mergedDoc.addPage(page))
    }
    
    const pdfBytes = await mergedDoc.save()
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
    saveAs(blob, `merged_document.pdf`)
  } catch (error) {
    console.error('Merge error:', error)
    alert('Failed to merge PDFs')
  } finally {
    isMerging.value = false
  }
}

// Text Extraction Logic
const textInput = ref<HTMLInputElement | null>(null)
const textFile = ref<File | null>(null)
const extractedText = ref('')
const isExtracting = ref(false)

const triggerTextInput = () => textInput.value?.click()

const handleTextUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    textFile.value = target.files[0]
    extractedText.value = ''
    isExtracting.value = true
    
    try {
      const arrayBuffer = await target.files[0].arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        fullText += `--- Page ${i} ---\n${pageText}\n\n`
      }
      
      extractedText.value = fullText
    } catch (error) {
      console.error('Text extraction error:', error)
      alert('Failed to extract text')
    } finally {
      isExtracting.value = false
    }
  }
}

const copyText = () => {
  navigator.clipboard.writeText(extractedText.value)
  alert('Text copied to clipboard')
}

const downloadText = () => {
  const blob = new Blob([extractedText.value], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `${textFile.value?.name.replace('.pdf', '')}_text.txt`)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    pdfFile.value = target.files[0]
    isProcessing.value = true
    
    try {
      const arrayBuffer = await target.files[0].arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()
      
      pages.value = Array.from({ length: pageCount }, (_, i) => ({
        id: i,
        rotation: 0,
        originalIndex: i
      }))
    } catch (error) {
      console.error('Error loading PDF:', error)
      alert('Failed to load PDF file')
    } finally {
      isProcessing.value = false
    }
  }
}

const clearFile = () => {
  pdfFile.value = null
  pages.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const rotatePage = (index: number) => {
  if (pages.value[index]) {
    pages.value[index].rotation = (pages.value[index].rotation + 90) % 360
  }
}

const deletePage = (index: number) => {
  pages.value.splice(index, 1)
}

const movePage = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < pages.value.length) {
    const page = pages.value[index]
    if (page) {
      pages.value.splice(index, 1)
      pages.value.splice(newIndex, 0, page)
    }
  }
}

const downloadPdf = async () => {
  if (!pdfFile.value || pages.value.length === 0) return
  
  isProcessing.value = true
  try {
    const arrayBuffer = await pdfFile.value.arrayBuffer()
    const srcDoc = await PDFDocument.load(arrayBuffer)
    const newDoc = await PDFDocument.create()
    
    const pageIndices = pages.value.map(p => p.originalIndex)
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices)
    
    copiedPages.forEach((page, idx) => {
      const pageInfo = pages.value[idx]
      if (pageInfo) {
        const rotation = pageInfo.rotation
        if (rotation !== 0) {
          page.setRotation(degrees(page.getRotation().angle + rotation))
        }
        newDoc.addPage(page)
      }
    })
    
    const pdfBytes = await newDoc.save()
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
    saveAs(blob, `edited_${pdfFile.value.name}`)
    
  } catch (error) {
    console.error('Error saving PDF:', error)
    alert('Failed to save PDF')
  } finally {
    isProcessing.value = false
  }
}
</script>
