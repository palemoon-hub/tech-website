<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ t('horoscope.title') }}</h1>
      <p class="text-lg text-gray-600">{{ t('horoscope.subtitle') }}</p>
    </div>

    <!-- Zodiac Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="sign in signs"
        :key="sign.key"
        @click="selectSign(sign)"
        class="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col items-center gap-3 text-center"
        :class="{ 'ring-2 ring-purple-500 ring-offset-2': selectedSign?.key === sign.key }"
      >
        <div class="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
          {{ sign.icon }}
        </div>
        <div>
          <h3 class="font-bold text-gray-900">{{ t(`horoscope.signs.${sign.key}`) }}</h3>
          <p class="text-xs text-gray-500">{{ t(`horoscope.dates.${sign.key}`) }}</p>
        </div>
      </button>
    </div>

    <!-- Fortune Display -->
    <div v-if="selectedSign && fortune" class="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
        <div class="flex items-center gap-4">
          <div class="text-4xl">{{ selectedSign.icon }}</div>
          <div>
            <h2 class="text-2xl font-bold">{{ t(`horoscope.signs.${selectedSign.key}`) }}</h2>
            <p class="text-purple-100">{{ currentDate }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 md:p-8 space-y-8">
        <!-- Scores -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(score, key) in fortune.scores" :key="key" class="bg-gray-50 p-4 rounded-xl text-center">
            <div class="text-sm text-gray-500 mb-1">{{ t(`horoscope.fields.${key}`) }}</div>
            <div class="flex justify-center gap-1">
              <Star 
                v-for="i in 5" 
                :key="i" 
                class="w-4 h-4" 
                :class="i <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
              />
            </div>
          </div>
        </div>

        <!-- Lucky Items -->
        <div class="flex flex-wrap gap-4 justify-center">
          <div class="px-6 py-3 bg-pink-50 rounded-full flex items-center gap-2 border border-pink-100">
            <span class="text-pink-500 font-medium">{{ t('horoscope.fields.luckyColor') }}:</span>
            <span class="text-gray-800">{{ fortune.luckyColor }}</span>
          </div>
          <div class="px-6 py-3 bg-blue-50 rounded-full flex items-center gap-2 border border-blue-100">
            <span class="text-blue-500 font-medium">{{ t('horoscope.fields.luckyNumber') }}:</span>
            <span class="text-gray-800">{{ fortune.luckyNumber }}</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-purple-500" />
            {{ t('horoscope.fields.summary') }}
          </h3>
          <p class="text-gray-600 leading-relaxed bg-purple-50/50 p-4 rounded-xl">
            {{ fortune.summary }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Star, Sparkles } from 'lucide-vue-next'

const { t, tm, locale } = useI18n()

interface Sign {
  key: string
  icon: string
}

const signs: Sign[] = [
  { key: 'aries', icon: '♈' },
  { key: 'taurus', icon: '♉' },
  { key: 'gemini', icon: '♊' },
  { key: 'cancer', icon: '♋' },
  { key: 'leo', icon: '♌' },
  { key: 'virgo', icon: '♍' },
  { key: 'libra', icon: '♎' },
  { key: 'scorpio', icon: '♏' },
  { key: 'sagittarius', icon: '♐' },
  { key: 'capricorn', icon: '♑' },
  { key: 'aquarius', icon: '♒' },
  { key: 'pisces', icon: '♓' }
]

const selectedSign = ref<Sign | null>(null)

const currentDate = computed(() => {
  return new Date().toLocaleDateString(locale.value, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Mock fortune generation based on date + sign
const fortune = computed(() => {
  if (!selectedSign.value) return null
  
  // Simple hash function for consistent daily results
  const dateStr = new Date().toISOString().split('T')[0]
  const seedStr = `${dateStr}-${selectedSign.value.key}`
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i)
    seed |= 0
  }
  
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const scores = {
    overall: Math.floor(rand() * 2) + 4, // 4-5 stars
    love: Math.floor(rand() * 3) + 3,    // 3-5 stars
    work: Math.floor(rand() * 3) + 3,
    money: Math.floor(rand() * 3) + 3,
    health: Math.floor(rand() * 3) + 3
  }

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Gold', 'Silver']
  const luckyColor = colors[Math.floor(rand() * colors.length)]
  const luckyNumber = Math.floor(rand() * 99) + 1

  const summaries = tm('horoscope.summaries') as string[]
  const summary = summaries[Math.floor(rand() * summaries.length)]

  return {
    scores,
    luckyColor,
    luckyNumber,
    summary
  }
})

const selectSign = (sign: Sign) => {
  selectedSign.value = sign
  // Scroll to fortune section on mobile
  if (window.innerWidth < 768) {
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }, 100)
  }
}
</script>
