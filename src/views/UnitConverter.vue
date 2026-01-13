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
          <label class="block text-sm font-medium text-gray-700">{{ $t('unitConverter.inputLabel') }}</label>
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
          <label class="block text-sm font-medium text-gray-700">{{ $t('unitConverter.resultLabel') }}</label>
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
        <strong class="block mb-1">{{ $t('unitConverter.common.title') }}</strong>
        1 km = 1000 m<br>
        1 m = 100 cm<br>
        1 inch = 2.54 cm
      </div>
      <div class="bg-green-50 p-4 rounded-lg border border-green-100 text-sm text-green-800">
        <strong class="block mb-1">{{ $t('unitConverter.common.dataTitle') }}</strong>
        1 KB = 1024 B<br>
        1 MB = 1024 KB<br>
        1 GB = 1024 MB
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-purple-800">
        <strong class="block mb-1">{{ $t('unitConverter.common.tempTitle') }}</strong>
        C = (F - 32) * 5/9<br>
        F = C * 9/5 + 32
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const categories = computed(() => [
  { id: 'length', name: t('unitConverter.categories.length') },
  { id: 'area', name: t('unitConverter.categories.area') },
  { id: 'weight', name: t('unitConverter.categories.weight') },
  { id: 'volume', name: t('unitConverter.categories.volume') },
  { id: 'temperature', name: t('unitConverter.categories.temperature') },
  { id: 'data', name: t('unitConverter.categories.data') },
])

const currentCategory = ref('length')
const inputValue = ref<number | ''>(1)

// Unit Definitions & Conversion Logic
// Base unit for conversion (e.g., meters for length, grams for weight)
const units = computed<Record<string, { label: string; value: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]>>(() => ({
  length: [
    { label: t('unitConverter.units.km'), value: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: t('unitConverter.units.m'), value: 'm', toBase: v => v, fromBase: v => v },
    { label: t('unitConverter.units.cm'), value: 'cm', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
    { label: t('unitConverter.units.mm'), value: 'mm', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: t('unitConverter.units.mi'), value: 'mi', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    { label: t('unitConverter.units.yd'), value: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: t('unitConverter.units.ft'), value: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: t('unitConverter.units.in'), value: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  ],
  area: [
    { label: t('unitConverter.units.km2'), value: 'km2', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: t('unitConverter.units.m2'), value: 'm2', toBase: v => v, fromBase: v => v },
    { label: t('unitConverter.units.cm2'), value: 'cm2', toBase: v => v * 0.0001, fromBase: v => v / 0.0001 },
    { label: t('unitConverter.units.ha'), value: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
    { label: t('unitConverter.units.mu'), value: 'mu', toBase: v => v * 666.667, fromBase: v => v / 666.667 },
    { label: t('unitConverter.units.mi2'), value: 'mi2', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    { label: t('unitConverter.units.ac'), value: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  ],
  weight: [
    { label: t('unitConverter.units.t'), value: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: t('unitConverter.units.kg'), value: 'kg', toBase: v => v, fromBase: v => v },
    { label: t('unitConverter.units.g'), value: 'g', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: t('unitConverter.units.mg'), value: 'mg', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
    { label: t('unitConverter.units.lb'), value: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: t('unitConverter.units.oz'), value: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  volume: [
    { label: t('unitConverter.units.m3'), value: 'm3', toBase: v => v, fromBase: v => v },
    { label: t('unitConverter.units.l'), value: 'l', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: t('unitConverter.units.ml'), value: 'ml', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
    { label: t('unitConverter.units.gal'), value: 'gal', toBase: v => v * 0.00378541, fromBase: v => v / 0.00378541 },
  ],
  temperature: [
    { label: t('unitConverter.units.c'), value: 'c', toBase: v => v, fromBase: v => v },
    { label: t('unitConverter.units.f'), value: 'f', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    { label: t('unitConverter.units.k'), value: 'k', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  data: [
    { label: t('unitConverter.units.tb'), value: 'tb', toBase: v => v * 1024 * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024 * 1024) },
    { label: t('unitConverter.units.gb'), value: 'gb', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
    { label: t('unitConverter.units.mb'), value: 'mb', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
    { label: t('unitConverter.units.kb'), value: 'kb', toBase: v => v * 1024, fromBase: v => v / 1024 },
    { label: t('unitConverter.units.byte'), value: 'b', toBase: v => v, fromBase: v => v },
  ]
}))

const currentUnits = computed(() => units.value[currentCategory.value] || [])
const inputUnit = ref('')
const outputUnit = ref('')

// Initialize units when category changes
watch(currentCategory, (newVal) => {
  const list = units.value[newVal]
  if (list && list.length >= 2) {
    inputUnit.value = list[0]!.value
    outputUnit.value = list[1]!.value
  } else if (list && list.length === 1) {
    inputUnit.value = list[0]!.value
    outputUnit.value = list[0]!.value
  }
}, { immediate: true })

const outputValue = computed(() => {
  if (inputValue.value === '' || inputValue.value === null) return '---'
  
  const unitList = currentUnits.value
  const from = unitList.find((u: any) => u.value === inputUnit.value)
  const to = unitList.find((u: any) => u.value === outputUnit.value)
  
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
