<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="flex gap-2">
        <button 
          @click="mode = 'json'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="mode === 'json' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
        >
          JSON 工具
        </button>
        <button 
          @click="mode = 'text'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="mode === 'text' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
        >
          文本工具
        </button>
      </div>
    </div>

    <div v-if="mode === 'json'" class="flex-1 flex gap-4 min-h-0">
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700">输入 JSON</label>
          <div class="flex gap-2">
            <button @click="formatJson" class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">格式化</button>
            <button @click="minifyJson" class="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100">压缩</button>
            <button @click="clear" class="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">清空</button>
          </div>
        </div>
        <textarea 
          v-model="inputContent"
          class="flex-1 w-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder='{"key": "value"}'
        ></textarea>
      </div>

      <div class="flex-1 flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700">结果</label>
          <button @click="copyResult" class="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">复制结果</button>
        </div>
        <div class="flex-1 relative">
          <textarea 
            readonly
            :value="outputContent"
            class="w-full h-full p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-800 resize-none"
          ></textarea>
          <div v-if="error" class="absolute bottom-4 left-4 right-4 p-2 bg-red-100 text-red-700 text-xs rounded border border-red-200">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col gap-4">
      <div class="flex gap-2 flex-wrap">
        <button @click="textToUpper" class="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50">转大写</button>
        <button @click="textToLower" class="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50">转小写</button>
        <button @click="textReverse" class="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50">文本翻转</button>
        <button @click="removeSpaces" class="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50">去除空格</button>
        <button @click="copyInput" class="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded text-sm hover:bg-green-100 ml-auto">复制文本</button>
      </div>
      <textarea 
        v-model="textContent"
        class="flex-1 w-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="输入文本..."
      ></textarea>
      <div class="flex justify-between text-xs text-gray-500">
        <span>字符数: {{ textContent.length }}</span>
        <span>行数: {{ textContent.split('\n').length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const mode = ref<'json' | 'text'>('json')
const inputContent = ref('')
const outputContent = ref('')
const error = ref('')
const textContent = ref('')

// JSON Logic
const formatJson = () => {
  try {
    error.value = ''
    if (!inputContent.value.trim()) {
      outputContent.value = ''
      return
    }
    const parsed = JSON.parse(inputContent.value)
    outputContent.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = 'Invalid JSON: ' + e.message
    outputContent.value = ''
  }
}

const minifyJson = () => {
  try {
    error.value = ''
    if (!inputContent.value.trim()) {
      outputContent.value = ''
      return
    }
    const parsed = JSON.parse(inputContent.value)
    outputContent.value = JSON.stringify(parsed)
  } catch (e: any) {
    error.value = 'Invalid JSON: ' + e.message
    outputContent.value = ''
  }
}

const clear = () => {
  inputContent.value = ''
  outputContent.value = ''
  error.value = ''
}

const copyResult = () => {
  if (outputContent.value) {
    navigator.clipboard.writeText(outputContent.value)
  }
}

// Auto-format on paste or typing pause could be added, but manual trigger is safer for large files.
// Let's add a watcher to clear error on input change
watch(inputContent, () => {
  if (error.value) error.value = ''
})

// Text Logic
const textToUpper = () => textContent.value = textContent.value.toUpperCase()
const textToLower = () => textContent.value = textContent.value.toLowerCase()
const textReverse = () => textContent.value = textContent.value.split('').reverse().join('')
const removeSpaces = () => textContent.value = textContent.value.replace(/\s+/g, '')
const copyInput = () => navigator.clipboard.writeText(textContent.value)

</script>
