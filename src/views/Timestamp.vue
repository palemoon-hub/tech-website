<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-semibold mb-2">当前时间</h2>
      <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div class="text-4xl font-mono text-blue-600 font-bold tracking-wider">
          {{ currentTimestamp }}
        </div>
        <div class="text-lg text-gray-600 font-mono">
          {{ formattedCurrentTime }}
        </div>
        <button 
          @click="togglePause"
          class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          :class="{ 'text-red-600 border-red-200 bg-red-50': isPaused }"
        >
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </div>
    </div>

    <!-- Converter -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Timestamp to Date -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRightLeft class="w-4 h-4 text-gray-400" />
          时间戳转日期
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">时间戳 (ms/s)</label>
            <div class="flex gap-2">
              <input 
                v-model="inputTimestamp" 
                type="text" 
                placeholder="输入时间戳"
                class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
              />
              <select v-model="timestampUnit" class="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="ms">毫秒 (ms)</option>
                <option value="s">秒 (s)</option>
              </select>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div class="text-xs text-gray-500 mb-1">转换结果</div>
            <div class="font-mono text-gray-900 break-all">
              {{ convertedDate || '等待输入...' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Date to Timestamp -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRightLeft class="w-4 h-4 text-gray-400" />
          日期转时间戳
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期时间</label>
            <input 
              v-model="inputDate" 
              type="datetime-local" 
              step="1"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div class="text-xs text-gray-500 mb-1">转换结果 (毫秒 / 秒)</div>
            <div class="font-mono text-gray-900 flex gap-4">
              <div>
                <span class="text-gray-400 text-xs mr-1">ms:</span>
                {{ convertedTimestampMs || '---' }}
              </div>
              <div>
                <span class="text-gray-400 text-xs mr-1">s:</span>
                {{ convertedTimestampS || '---' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format, fromUnixTime, isValid } from 'date-fns'
import { ArrowRightLeft } from 'lucide-vue-next'

// Current Time Logic
const now = ref(new Date())
const isPaused = ref(false)
let timer: any

const currentTimestamp = computed(() => now.value.getTime())
const formattedCurrentTime = computed(() => format(now.value, 'yyyy-MM-dd HH:mm:ss'))

const togglePause = () => {
  isPaused.value = !isPaused.value
}

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value) {
      now.value = new Date()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Timestamp to Date Logic
const inputTimestamp = ref('')
const timestampUnit = ref('ms')

const convertedDate = computed(() => {
  if (!inputTimestamp.value) return ''
  
  let ts = parseInt(inputTimestamp.value)
  if (isNaN(ts)) return '无效的时间戳'

  if (timestampUnit.value === 's') {
    ts = ts * 1000
  }

  const date = new Date(ts)
  if (!isValid(date)) return '无效的时间戳'

  return format(date, 'yyyy-MM-dd HH:mm:ss')
})

// Date to Timestamp Logic
const inputDate = ref(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))

const convertedTimestampMs = computed(() => {
  if (!inputDate.value) return ''
  const date = new Date(inputDate.value)
  if (!isValid(date)) return ''
  return date.getTime()
})

const convertedTimestampS = computed(() => {
  const ms = convertedTimestampMs.value
  return ms ? Math.floor(Number(ms) / 1000) : ''
})
</script>
