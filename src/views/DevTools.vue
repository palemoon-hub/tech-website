<template>
  <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
    <!-- Sidebar Navigation -->
    <aside class="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div class="p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 class="font-semibold text-gray-900 flex items-center gap-2">
          <Terminal class="w-4 h-4 text-blue-600" />
          {{ $t('home.categories.dev') }}
        </h2>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <button 
          v-for="tool in tools" 
          :key="tool.id"
          @click="currentTool = tool.id"
          class="w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-left group"
          :class="currentTool === tool.id ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="tool.icon" class="w-4 h-4" :class="currentTool === tool.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
          {{ tool.name }}
        </button>
      </div>
    </aside>

    <!-- Content Area -->
    <main class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-w-0">
      <div class="p-6 h-full overflow-auto">
      
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

      <!-- 2. Diff -->
      <div v-if="currentTool === 'diff'" class="h-full flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.diff.original') }}</label>
            <textarea v-model="diffOld" class="flex-1 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm whitespace-pre" :placeholder="$t('devTools.diff.originalPlaceholder')"></textarea>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">{{ $t('devTools.diff.modified') }}</label>
            <textarea v-model="diffNew" class="flex-1 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm whitespace-pre" :placeholder="$t('devTools.diff.modifiedPlaceholder')"></textarea>
          </div>
        </div>
        <div class="h-1/3 bg-white border border-gray-200 rounded-lg overflow-auto p-4 font-mono text-sm">
          <div v-if="diffResult.length === 0" class="text-gray-400 text-center mt-4">{{ $t('devTools.diff.noChanges') }}</div>
          <div v-for="(part, index) in diffResult" :key="index"
            :class="{
              'bg-green-100 text-green-800': part.added,
              'bg-red-100 text-red-800': part.removed,
              'text-gray-600': !part.added && !part.removed
            }"
            class="whitespace-pre-wrap break-all"
          >
            {{ part.value }}
          </div>
        </div>
      </div>

      <!-- 3. Base64 -->
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

      <!-- 6. Text Utilities -->
      <div v-if="currentTool === 'text'" class="h-full flex flex-col gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900">{{ $t('devTools.text.input') }}</h3>
            <div class="flex gap-2">
               <button @click="textInput = ''" class="text-xs text-gray-500 hover:text-gray-700">{{ $t('devTools.text.clear') }}</button>
            </div>
          </div>
          <textarea v-model="textInput" class="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm mb-4" :placeholder="$t('devTools.text.input')"></textarea>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ textStats.chars }}</div>
              <div class="text-xs text-blue-600 uppercase tracking-wider">{{ $t('devTools.text.chars') }}</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
              <div class="text-2xl font-bold text-green-600">{{ textStats.words }}</div>
              <div class="text-xs text-green-600 uppercase tracking-wider">{{ $t('devTools.text.words') }}</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ textStats.lines }}</div>
              <div class="text-xs text-purple-600 uppercase tracking-wider">{{ $t('devTools.text.lines') }}</div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('devTools.text.convert') }}</label>
            <div class="flex flex-wrap gap-2">
              <button @click="convertCase('upper')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">{{ $t('devTools.text.upper') }}</button>
              <button @click="convertCase('lower')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">{{ $t('devTools.text.lower') }}</button>
              <button @click="convertCase('camel')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">{{ $t('devTools.text.camel') }}</button>
              <button @click="convertCase('snake')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">{{ $t('devTools.text.snake') }}</button>
              <button @click="convertCase('kebab')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">{{ $t('devTools.text.kebab') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Generators -->
      <div v-if="currentTool === 'generator'" class="h-full flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- UUID -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Hash class="w-4 h-4 text-blue-500" /> {{ $t('devTools.generator.uuid') }}
            </h3>
            <div class="flex gap-2 mb-4">
              <input type="text" readonly :value="uuidResult" class="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-600" placeholder="UUID v4">
              <button @click="copyUuid" class="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                <Link class="w-4 h-4" />
              </button>
            </div>
            <button @click="genUuid" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {{ $t('devTools.generator.generate') }}
            </button>
          </div>

          <!-- Password -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <KeyRound class="w-4 h-4 text-green-500" /> {{ $t('devTools.generator.password') }}
            </h3>
            
            <div class="mb-4 space-y-3">
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{{ $t('devTools.generator.length') }}</span>
                  <span>{{ pwdLength }}</span>
                </div>
                <input type="range" v-model.number="pwdLength" min="6" max="64" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" v-model="pwdOptions.upper" class="rounded text-green-600 focus:ring-green-500"> {{ $t('devTools.generator.uppercase') }}
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" v-model="pwdOptions.lower" class="rounded text-green-600 focus:ring-green-500"> {{ $t('devTools.generator.lowercase') }}
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" v-model="pwdOptions.number" class="rounded text-green-600 focus:ring-green-500"> {{ $t('devTools.generator.numbers') }}
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" v-model="pwdOptions.symbol" class="rounded text-green-600 focus:ring-green-500"> {{ $t('devTools.generator.symbols') }}
                </label>
              </div>
            </div>

            <div class="flex gap-2 mb-4">
              <input type="text" readonly :value="pwdResult" class="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-600" placeholder="...">
              <button @click="copyPwd" class="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                <Link class="w-4 h-4" />
              </button>
            </div>
            
            <button @click="genPassword" class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              {{ $t('devTools.generator.generate') }}
            </button>
          </div>
        </div>
      </div>

    </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'
import * as Diff from 'diff'
import { FileJson, Hash, Link, Code2, Replace, Type, KeyRound, GitCompare, Terminal } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const currentTool = ref('json')

const tools = computed(() => [
  { id: 'json', name: t('devTools.nav.json'), icon: FileJson },
  { id: 'diff', name: t('devTools.nav.diff'), icon: GitCompare },
  { id: 'base64', name: t('devTools.nav.base64'), icon: Code2 },
  { id: 'url', name: t('devTools.nav.url'), icon: Link },
  { id: 'hash', name: t('devTools.nav.hash'), icon: Hash },
  { id: 'regex', name: t('devTools.nav.regex'), icon: Replace },
  { id: 'text', name: t('devTools.nav.text'), icon: Type },
  { id: 'generator', name: t('devTools.nav.generator'), icon: KeyRound },
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

// JSON
const jsonInput = ref('')
const jsonOutput = ref('')
const jsonFormat = () => { try { jsonOutput.value = JSON.stringify(JSON.parse(jsonInput.value), null, 2) } catch(e:any) { jsonOutput.value = e.message } }
const jsonMinify = () => { try { jsonOutput.value = JSON.stringify(JSON.parse(jsonInput.value)) } catch(e:any) { jsonOutput.value = e.message } }

// Diff
const diffOld = ref('')
const diffNew = ref('')
const diffResult = computed(() => {
  if (!diffOld.value && !diffNew.value) return []
  return Diff.diffLines(diffOld.value, diffNew.value)
})

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

// Text Utilities
const textInput = ref('')
const textStats = computed(() => {
  const text = textInput.value
  return {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0
  }
})

const convertCase = (type: 'upper' | 'lower' | 'camel' | 'snake' | 'kebab') => {
  const text = textInput.value
  switch (type) {
    case 'upper':
      textInput.value = text.toUpperCase()
      break
    case 'lower':
      textInput.value = text.toLowerCase()
      break
    case 'camel':
      textInput.value = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      break
    case 'snake':
      textInput.value = text.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/\s+/g, '_')
      break
    case 'kebab':
      textInput.value = text.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '').replace(/\s+/g, '-')
      break
  }
}

// Generators
const uuidResult = ref('')
const genUuid = () => {
  uuidResult.value = crypto.randomUUID()
}
const copyUuid = () => {
  navigator.clipboard.writeText(uuidResult.value)
}

const pwdLength = ref(16)
const pwdOptions = ref({
  upper: true,
  lower: true,
  number: true,
  symbol: true
})
const pwdResult = ref('')
const genPassword = () => {
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
  let charset = ''
  if (pwdOptions.value.upper) charset += chars.upper
  if (pwdOptions.value.lower) charset += chars.lower
  if (pwdOptions.value.number) charset += chars.number
  if (pwdOptions.value.symbol) charset += chars.symbol
  
  if (!charset) return
  
  let pwd = ''
  const array = new Uint32Array(pwdLength.value)
  crypto.getRandomValues(array)
  for (let i = 0; i < pwdLength.value; i++) {
    const val = array[i]
    if (val !== undefined) {
      const charIndex = val % charset.length
      pwd += charset.charAt(charIndex)
    }
  }
  pwdResult.value = pwd
}
const copyPwd = () => {
  navigator.clipboard.writeText(pwdResult.value)
}
</script>
