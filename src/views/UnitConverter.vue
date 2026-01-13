<template>
  <div class="space-y-6">
    <!-- Category Tabs -->
    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="currentCategory = cat.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        :class="currentCategory === cat.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
      >
        <span>{{ cat.name }}</span>
      </button>
    </div>

    <!-- Converter Area -->
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        <!-- Input -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">输入数值</label>
          <input 
            v-model="inputValue" 
            type="number" 
            class="w-full text-2xl p-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
          <select 
            v-model="inputUnit"
            class="w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          >
            <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
              {{ unit.label }} ({{ unit.value }})
            </option>
          </select>
        </div>

        <!-- Arrow -->
        <div class="flex justify-center text-gray-400">
          <div class="p-2 rounded-full bg-gray-50 md:rotate-0 rotate-90">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        <!-- Output -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">转换结果</label>
          <div class="w-full text-2xl p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-medium break-all min-h-[4.5rem] flex items-center">
            {{ outputValue }}
          </div>
          <select 
            v-model="outputUnit"
            class="w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          >
            <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
              {{ unit.label }} ({{ unit.value }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Common Formulas Reference (Optional) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
        <strong class="block mb-1">常用换算</strong>
        1 km = 1000 m<br>
        1 m = 100 cm<br>
        1 inch = 2.54 cm
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-100 text-sm text-green-800">
        <strong class="block mb-1">数据存储</strong>
        1 KB = 1024 B<br>
        1 MB = 1024 KB<br>
        1 GB = 1024 MB
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-purple-800">
        <strong class="block mb-1">温度</strong>
        C = (F - 32) * 5/9<br>
        F = C * 9/5 + 32
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const categories = [
  { id: 'length', name: '长度' },
  { id: 'area', name: '面积' },
  { id: 'weight', name: '重量' },
  { id: 'volume', name: '体积' },
  { id: 'temperature', name: '温度' },
  { id: 'data', name: '数据存储' },
]

const currentCategory = ref('length')
const inputValue = ref<number | ''>(1)

// Unit Definitions & Conversion Logic
// Base unit for conversion (e.g., meters for length, grams for weight)
const units: Record<string, { label: string; value: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: '千米', value: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '米', value: 'm', toBase: v => v, fromBase: v => v },
    { label: '厘米', value: 'cm', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
    { label: '毫米', value: 'mm', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: '英里', value: 'mi', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    { label: '码', value: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: '英尺', value: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: '英寸', value: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  ],
  area: [
    { label: '平方千米', value: 'km2', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: '平方米', value: 'm2', toBase: v => v, fromBase: v => v },
    { label: '平方厘米', value: 'cm2', toBase: v => v * 0.0001, fromBase: v => v / 0.0001 },
    { label: '公顷', value: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
    { label: '亩', value: 'mu', toBase: v => v * 666.667, fromBase: v => v / 666.667 },
    { label: '平方英里', value: 'mi2', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    { label: '英亩', value: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  ],
  weight: [
    { label: '吨', value: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '千克', value: 'kg', toBase: v => v, fromBase: v => v },
    { label: '克', value: 'g', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: '毫克', value: 'mg', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
    { label: '磅', value: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: '盎司', value: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  volume: [
    { label: '立方米', value: 'm3', toBase: v => v, fromBase: v => v },
    { label: '升', value: 'l', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: '毫升', value: 'ml', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
    { label: '加仑(美)', value: 'gal', toBase: v => v * 0.00378541, fromBase: v => v / 0.00378541 },
  ],
  temperature: [
    { label: '摄氏度', value: 'c', toBase: v => v, fromBase: v => v },
    { label: '华氏度', value: 'f', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    { label: '开尔文', value: 'k', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  data: [
    { label: 'TB', value: 'tb', toBase: v => v * 1024 * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024 * 1024) },
    { label: 'GB', value: 'gb', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
    { label: 'MB', value: 'mb', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
    { label: 'KB', value: 'kb', toBase: v => v * 1024, fromBase: v => v / 1024 },
    { label: 'Byte', value: 'b', toBase: v => v, fromBase: v => v },
  ]
}

const currentUnits = computed(() => units[currentCategory.value] || [])
const inputUnit = ref('')
const outputUnit = ref('')

// Initialize units when category changes
watch(currentCategory, (newVal) => {
  const list = units[newVal]
  if (list && list.length >= 2) {
    inputUnit.value = list[0].value
    outputUnit.value = list[1].value
  } else if (list && list.length === 1) {
    inputUnit.value = list[0].value
    outputUnit.value = list[0].value
  }
}, { immediate: true })

const outputValue = computed(() => {
  if (inputValue.value === '' || inputValue.value === null) return '---'
  
  const unitList = currentUnits.value
  const from = unitList.find(u => u.value === inputUnit.value)
  const to = unitList.find(u => u.value === outputUnit.value)
  
  if (!from || !to) return '---'

  const baseValue = from.toBase(Number(inputValue.value))
  const result = to.fromBase(baseValue)

  // Formatting: avoid long floats
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e9) {
    return result.toExponential(4)
  }
  return Math.round(result * 1000000) / 1000000
})
</script>
