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
      
      <!-- 1. JSON (Existing) -->
      <div v-if="currentTool === 'json'" class="h-full flex gap-4">
        <!-- Reusing previous JSON logic simply -->
        <div class="flex-1 flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.json.input') }}</label>
            <div class="flex gap-2">
              <button @click="jsonFormat" class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">{{ $t('devTools.json.format') }}</button>
              <button @click="jsonMinify" class="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">{{ $t('devTools.json.minify') }}</button>
            </div>
          </div>
          <textarea v-model="jsonInput" class="flex-1 w-full p-4 font-mono text-sm border border-gray-300 rounded-lg resize-none"></textarea>
        </div>
        <div class="flex-1 flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">{{ $t('devTools.json.result') }}</label>
          <textarea readonly :value="jsonOutput" class="flex-1 w-full p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg resize-none text-gray-800"></textarea>
        </div>
      </div>

      <!-- 2. Base64 -->
      <div v-if="currentTool === 'base64'" class="h-full flex flex-col gap-4">
        <div class="flex gap-2">
          <button @click="b64Encode" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{{ $t('devTools.base64.encode') }}</button>
          <button @click="b64Decode" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">{{ $t('devTools.base64.decode') }}</button>
        </div>
        <div class="grid grid-cols-2 gap-4 flex-1">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.base64.input') }}</label>
            <textarea v-model="b64Input" class="flex-1 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.base64.output') }}</label>
            <textarea readonly :value="b64Output" class="flex-1 p-4 bg-gray-50 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
        </div>
      </div>

      <!-- 3. URL Encode -->
      <div v-if="currentTool === 'url'" class="h-full flex flex-col gap-4">
        <div class="flex gap-2">
          <button @click="urlEncode" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{{ $t('devTools.url.encode') }}</button>
          <button @click="urlDecode" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">{{ $t('devTools.url.decode') }}</button>
        </div>
        <div class="grid grid-cols-2 gap-4 flex-1">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.url.input') }}</label>
            <textarea v-model="urlInput" class="flex-1 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.url.output') }}</label>
            <textarea readonly :value="urlOutput" class="flex-1 p-4 bg-gray-50 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
        </div>
      </div>

      <!-- 4. Hash/Crypto -->
      <div v-if="currentTool === 'hash'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">{{ $t('devTools.hash.input') }}</label>
            <textarea v-model="hashInput" class="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(algo, name) in hashes" :key="name" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-gray-700 uppercase">{{ name }}</span>
              <button @click="copyHash(algo)" class="text-xs text-blue-600 hover:text-blue-800">{{ $t('devTools.hash.copy') }}</button>
            </div>
            <div class="text-xs font-mono text-gray-500 break-all bg-gray-50 p-2 rounded">{{ algo || '...' }}</div>
          </div>
        </div>
      </div>

      <!-- 5. Regex -->
      <div v-if="currentTool === 'regex'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex gap-4 items-center">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('devTools.regex.pattern') }}</label>
              <input v-model="regexPattern" type="text" placeholder="/pattern/g" class="w-full p-2 border border-gray-300 rounded-lg font-mono" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('devTools.regex.flags') }}</label>
              <input v-model="regexFlags" type="text" placeholder="gim" class="w-full p-2 border border-gray-300 rounded-lg font-mono" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('devTools.regex.text') }}</label>
            <textarea v-model="regexText" class="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"></textarea>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
          <h3 class="font-medium text-gray-900 mb-4">{{ $t('devTools.regex.result') }}</h3>
          <div class="space-y-2 max-h-64 overflow-auto">
            <div v-if="regexMatches.length === 0" class="text-gray-400 italic">{{ $t('devTools.regex.noMatch') }}</div>
            <div v-for="(match, idx) in regexMatches" :key="idx" class="p-2 bg-green-50 text-green-800 border border-green-200 rounded text-sm font-mono">
              Match {{ idx + 1 }}: {{ match }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'
import { FileJson, Hash, Link, Code2, Replace } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentTool = ref('json')

const tools = computed(() => [
  { id: 'json', name: t('devTools.nav.json'), icon: FileJson },
  { id: 'base64', name: t('devTools.nav.base64'), icon: Code2 },
  { id: 'url', name: t('devTools.nav.url'), icon: Link },
  { id: 'hash', name: t('devTools.nav.hash'), icon: Hash },
  { id: 'regex', name: t('devTools.nav.regex'), icon: Replace },
])

// JSON
const jsonInput = ref('')
const jsonOutput = ref('')
const jsonFormat = () => { try { jsonOutput.value = JSON.stringify(JSON.parse(jsonInput.value), null, 2) } catch(e:any) { jsonOutput.value = e.message } }
const jsonMinify = () => { try { jsonOutput.value = JSON.stringify(JSON.parse(jsonInput.value)) } catch(e:any) { jsonOutput.value = e.message } }

// Base64
const b64Input = ref('')
const b64Output = ref('')
const b64Encode = () => b64Output.value = btoa(unescape(encodeURIComponent(b64Input.value)))
const b64Decode = () => { try { b64Output.value = decodeURIComponent(escape(atob(b64Input.value))) } catch(e) { b64Output.value = 'Invalid Base64' } }

// URL
const urlInput = ref('')
const urlOutput = ref('')
const urlEncode = () => urlOutput.value = encodeURIComponent(urlInput.value)
const urlDecode = () => urlOutput.value = decodeURIComponent(urlInput.value)

// Hash
const hashInput = ref('')
const hashes = computed(() => ({
  md5: CryptoJS.MD5(hashInput.value).toString(),
  sha1: CryptoJS.SHA1(hashInput.value).toString(),
  sha256: CryptoJS.SHA256(hashInput.value).toString(),
  sha512: CryptoJS.SHA512(hashInput.value).toString(),
}))
const copyHash = (text: string) => navigator.clipboard.writeText(text)

// Regex
const regexPattern = ref('')
const regexFlags = ref('g')
const regexText = ref('')
const regexMatches = computed(() => {
  if (!regexPattern.value) return []
  try {
    const re = new RegExp(regexPattern.value, regexFlags.value)
    return regexText.value.match(re) || []
  } catch (e) {
    return []
  }
})
</script>
