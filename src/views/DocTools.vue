<template>
  <div class="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-12rem)]">
    <!-- Sidebar Navigation -->
    <div class="w-full md:w-64 flex-shrink-0">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 px-2">{{ t('nav.docTools') }}</h2>
        <nav class="space-y-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="activeTab = item.id"
            :class="[
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                activeTab === item.id ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500',
                'flex-shrink-0 -ml-1 mr-3 h-5 w-5'
              ]"
            />
            <span class="truncate">{{ item.name }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-full p-6">
        <transition name="fade" mode="out-in">
          <component :is="activeComponent" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { 
  File, 
  FileSpreadsheet, 
  Presentation, 
  FileText 
} from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const PdfTools = defineAsyncComponent(() => import('../components/doc/PdfTools.vue'))
const ExcelTools = defineAsyncComponent(() => import('../components/doc/ExcelTools.vue'))
const PptTools = defineAsyncComponent(() => import('../components/doc/PptTools.vue'))
const WordTools = defineAsyncComponent(() => import('../components/doc/WordTools.vue'))

const activeTab = ref('pdf')

const navItems = computed(() => [
  { id: 'pdf', name: t('docTools.nav.pdf'), icon: File },
  { id: 'excel', name: t('docTools.nav.excel'), icon: FileSpreadsheet },
  { id: 'ppt', name: t('docTools.nav.ppt'), icon: Presentation },
  { id: 'word', name: t('docTools.nav.word'), icon: FileText },
])

const activeComponent = computed(() => {
  switch (activeTab.value) {
    case 'pdf': return PdfTools
    case 'excel': return ExcelTools
    case 'ppt': return PptTools
    case 'word': return WordTools
    default: return PdfTools
  }
})

onMounted(() => {
  if (route.query.tab && typeof route.query.tab === 'string') {
    if (navItems.value.some(item => item.id === route.query.tab)) {
      activeTab.value = route.query.tab
    }
  }
})
</script>
