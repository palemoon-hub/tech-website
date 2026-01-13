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

    <!-- Excel to JSON -->
    <div v-if="currentTab === 'json'" class="space-y-6">
      <div v-if="!file" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors cursor-pointer" @click="triggerFileInput">
        <div class="space-y-1 text-center">
          <FileSpreadsheet class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <span class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
              {{ t('docTools.excel.upload') }}
            </span>
          </div>
          <p class="text-xs text-gray-500">XLSX, XLS, CSV up to 10MB</p>
        </div>
      </div>
      <input type="file" ref="fileInput" class="hidden" accept=".xlsx,.xls,.csv" @change="handleFileUpload" />

      <div v-if="file" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">{{ file.name }}</h3>
          <button @click="clearFile" class="text-sm text-red-600 hover:text-red-500">{{ t('docTools.pdf.delete') }}</button>
        </div>

        <div v-if="jsonData" class="space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="text-md font-medium text-gray-700">Preview (First 5 rows)</h4>
            <button @click="downloadJson" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Download JSON
            </button>
          </div>
          <pre class="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">{{ JSON.stringify(jsonData.slice(0, 5), null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Other tabs placeholders -->
    <div v-else class="text-center py-12 text-gray-500">
      <div class="bg-white rounded-lg p-6 text-center">
        <FileSpreadsheet class="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('docTools.excel.title') }}</h3>
        <p class="text-gray-500 mb-6">
          Feature coming soon...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileSpreadsheet } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { t } = useI18n()

const currentTab = ref('json')
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const jsonData = ref<any[] | null>(null)

const tabs = computed(() => [
  { id: 'json', name: t('docTools.excel.toJson') },
  { id: 'images', name: t('docTools.excel.extractImages') },
  { id: 'fix', name: t('docTools.excel.fixCsv') },
  { id: 'convert', name: t('docTools.excel.convert') },
])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    const data = await target.files[0].arrayBuffer()
    const workbook = XLSX.read(data)
    const firstSheetName = workbook.SheetNames[0]
    if (firstSheetName) {
      const worksheet = workbook.Sheets[firstSheetName]
      if (worksheet) {
        jsonData.value = XLSX.utils.sheet_to_json(worksheet)
      }
    }
  }
}

const clearFile = () => {
  file.value = null
  jsonData.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const downloadJson = () => {
  if (!jsonData.value || !file.value) return
  const blob = new Blob([JSON.stringify(jsonData.value, null, 2)], { type: 'application/json' })
  saveAs(blob, `${file.value.name.split('.')[0]}.json`)
}
</script>
