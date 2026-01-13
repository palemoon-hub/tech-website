<template>
  <div class="space-y-6">
    <!-- Tabs -->
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

    <!-- Upload Area (Shared) -->
    <div v-if="!file" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors cursor-pointer" @click="triggerFileInput">
      <div class="space-y-1 text-center">
        <FileSpreadsheet class="mx-auto h-12 w-12 text-gray-400" />
        <div class="flex text-sm text-gray-600">
          <span class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
            {{ t('docTools.excel.upload') }}
          </span>
        </div>
        <p class="text-xs text-gray-500" v-if="currentTab === 'images'">XLSX only</p>
        <p class="text-xs text-gray-500" v-else>XLSX, XLS, CSV up to 10MB</p>
      </div>
    </div>
    <input type="file" ref="fileInput" class="hidden" :accept="currentTab === 'images' ? '.xlsx' : '.xlsx,.xls,.csv,.txt'" @change="handleFileUpload" />

    <!-- File Header (Shared) -->
    <div v-if="file" class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div class="flex items-center space-x-3">
        <FileSpreadsheet class="h-6 w-6 text-green-600" />
        <div>
          <h3 class="text-sm font-medium text-gray-900">{{ file.name }}</h3>
          <p class="text-xs text-gray-500">{{ (file.size / 1024).toFixed(1) }} KB</p>
        </div>
      </div>
      <button @click="clearFile" class="text-sm text-red-600 hover:text-red-500 font-medium">{{ t('docTools.pdf.delete') }}</button>
    </div>

    <!-- Loading State -->
    <div v-if="isProcessing" class="text-center py-12 text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
      {{ t('docTools.pdf.processing') }}
    </div>

    <!-- Content Areas -->
    <div v-else-if="file" class="space-y-6">
      
      <!-- 1. JSON Tab -->
      <div v-if="currentTab === 'json'" class="space-y-4">
        <!-- Encoding Selector (Only for CSV/TXT) -->
        <div v-if="file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.txt')" class="flex items-center space-x-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <span class="text-sm text-yellow-800 font-medium">Encoding:</span>
          <select v-model="encoding" @change="processSpreadsheet(file!)" class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            <option v-for="enc in encodings" :key="enc.value" :value="enc.value">{{ enc.label }}</option>
          </select>
          <span class="text-xs text-yellow-600">Select encoding if characters are garbled.</span>
        </div>

        <div v-if="jsonData" class="space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="text-md font-medium text-gray-700">Preview (First 5 rows)</h4>
            <button @click="downloadJson" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <FileCode class="w-4 h-4 mr-2" />
              Download JSON
            </button>
          </div>
          <pre class="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs border border-gray-200">{{ JSON.stringify(jsonData.slice(0, 5), null, 2) }}</pre>
        </div>
      </div>

      <!-- 2. Images Tab -->
      <div v-else-if="currentTab === 'images'" class="space-y-4">
        <div v-if="images.length > 0">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ images.length }} Images Found</h3>
            <button @click="downloadAllImages" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              <Download class="w-4 h-4 mr-2" />
              Download All (.zip)
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div v-for="(img, index) in images" :key="index" class="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="aspect-square flex items-center justify-center relative p-2">
                <img :src="img.url" class="max-w-full max-h-full object-contain" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <button @click="downloadImage(img)" class="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700">
                     <Download class="w-5 h-5" />
                   </button>
                </div>
              </div>
              <div class="p-2 text-xs text-gray-500 truncate text-center border-t border-gray-100 bg-gray-50">{{ img.name }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <ImageIcon class="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>No images found in this Excel file.</p>
        </div>
      </div>

      <!-- 3. Fix CSV Tab -->
      <div v-else-if="currentTab === 'fix'" class="space-y-6">
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Original Encoding</label>
              <select v-model="encoding" @change="processSpreadsheet(file!)" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                <option v-for="enc in encodings" :key="enc.value" :value="enc.value">{{ enc.label }}</option>
              </select>
            </div>
            <button @click="downloadFixedCsv" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <RefreshCw class="w-4 h-4 mr-2" />
              Download as UTF-8 CSV
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preview (First 1000 chars)</label>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono text-xs overflow-auto max-h-64 whitespace-pre-wrap">
              {{ csvContent.slice(0, 1000) || 'No text content available to preview.' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Convert Tab -->
      <div v-else-if="currentTab === 'convert'" class="space-y-6">
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Convert {{ file.name }} to...</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <button @click="convertTo('xlsx')" class="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
              <FileSpreadsheet class="w-10 h-10 text-gray-400 group-hover:text-green-600 mb-3" />
              <span class="font-medium text-gray-900">XLSX</span>
            </button>
            
            <button @click="convertTo('csv')" class="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
              <FileSpreadsheet class="w-10 h-10 text-gray-400 group-hover:text-green-600 mb-3" />
              <span class="font-medium text-gray-900">CSV (UTF-8)</span>
            </button>
            
            <button @click="convertTo('html')" class="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
              <FileCode class="w-10 h-10 text-gray-400 group-hover:text-green-600 mb-3" />
              <span class="font-medium text-gray-900">HTML Table</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileSpreadsheet, Download, RefreshCw, FileCode, Image as ImageIcon } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const { t } = useI18n()

const currentTab = ref('json')
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const jsonData = ref<any[] | null>(null)
const encoding = ref('UTF-8')
const isProcessing = ref(false)

// Image Extraction
const images = ref<Array<{ name: string, url: string, blob: Blob }>>([])

// Fix CSV / Convert
const csvContent = ref<string>('')
const workbook = ref<XLSX.WorkBook | null>(null)

const tabs = computed(() => [
  { id: 'json', name: t('docTools.excel.toJson') },
  { id: 'images', name: t('docTools.excel.extractImages') },
  { id: 'fix', name: t('docTools.excel.fixCsv') },
  { id: 'convert', name: t('docTools.excel.convert') },
])

const encodings = [
  { value: 'UTF-8', label: 'UTF-8 (Default)' },
  { value: 'GBK', label: 'GBK / GB18030 (Chinese)' },
  { value: 'Big5', label: 'Big5 (Traditional Chinese)' },
  { value: 'Shift_JIS', label: 'Shift_JIS (Japanese)' },
  { value: 'Windows-1252', label: 'Windows-1252 (Western)' },
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  file.value = target.files[0]
  isProcessing.value = true
  jsonData.value = null
  images.value = []
  csvContent.value = ''
  workbook.value = null

  try {
    if (currentTab.value === 'images') {
      await processImages(target.files[0])
    } else {
      await processSpreadsheet(target.files[0])
    }
  } catch (error) {
    console.error('Error processing file:', error)
    alert('Failed to process file. Please check if the format is valid.')
  } finally {
    isProcessing.value = false
  }
}

const processSpreadsheet = async (f: File) => {
  // If CSV/Text and encoding is not UTF-8 (or we want to be safe), read as text
  const isCsv = f.name.toLowerCase().endsWith('.csv') || f.name.toLowerCase().endsWith('.txt')
  
  if (isCsv) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      csvContent.value = text // For preview in Fix CSV
      const wb = XLSX.read(text, { type: 'string' })
      workbook.value = wb
      
      const firstSheetName = wb.SheetNames[0]
      if (firstSheetName) {
        const worksheet = wb.Sheets[firstSheetName]
        if (worksheet) {
          jsonData.value = XLSX.utils.sheet_to_json(worksheet)
        }
      }
    }
    reader.readAsText(f, encoding.value)
  } else {
    // Binary formats (XLSX, XLS)
    const data = await f.arrayBuffer()
    const wb = XLSX.read(data)
    workbook.value = wb
    
    const firstSheetName = wb.SheetNames[0]
    if (firstSheetName) {
      const worksheet = wb.Sheets[firstSheetName]
      if (worksheet) {
        jsonData.value = XLSX.utils.sheet_to_json(worksheet)
      }
    }
  }
}

const processImages = async (f: File) => {
  if (!f.name.toLowerCase().endsWith('.xlsx')) {
    alert('Image extraction only supports .xlsx files')
    return
  }

  const zip = await JSZip.loadAsync(f)
  const imageFiles: { name: string, path: string }[] = []
  
  zip.forEach((relativePath) => {
    if (relativePath.startsWith('xl/media/')) {
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
}

const clearFile = () => {
  file.value = null
  jsonData.value = null
  images.value = []
  csvContent.value = ''
  workbook.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const downloadJson = () => {
  if (!jsonData.value || !file.value) return
  const blob = new Blob([JSON.stringify(jsonData.value, null, 2)], { type: 'application/json' })
  saveAs(blob, `${file.value.name.split('.')[0]}.json`)
}

const downloadImage = (img: { name: string, blob: Blob }) => {
  saveAs(img.blob, img.name)
}

const downloadAllImages = async () => {
  if (images.value.length === 0) return
  const zip = new JSZip()
  images.value.forEach(img => {
    zip.file(img.name, img.blob)
  })
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${file.value?.name.split('.')[0]}_images.zip`)
}

const downloadFixedCsv = () => {
  if (!workbook.value || !file.value) return
  const sheetName = workbook.value.SheetNames[0]
  if (!sheetName) return
  const worksheet = workbook.value.Sheets[sheetName]
  if (!worksheet) return
  
  const csv = XLSX.utils.sheet_to_csv(worksheet)
  // Add BOM for UTF-8 compatibility in Excel
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `${file.value.name.split('.')[0]}_utf8.csv`)
}

const convertTo = (format: 'xlsx' | 'csv' | 'html') => {
  if (!workbook.value || !file.value) return
  const sheetName = workbook.value.SheetNames[0]
  if (!sheetName) return
  const worksheet = workbook.value.Sheets[sheetName]
  if (!worksheet) return
  
  const fileName = file.value.name.split('.')[0]
  
  if (format === 'xlsx') {
    XLSX.writeFile(workbook.value, `${fileName}.xlsx`)
  } else if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `${fileName}.csv`)
  } else if (format === 'html') {
    const html = XLSX.utils.sheet_to_html(worksheet)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    saveAs(blob, `${fileName}.html`)
  }
}
</script>
