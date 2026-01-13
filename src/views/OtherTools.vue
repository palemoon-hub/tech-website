<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- QR Code Generator -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
        <QrCode class="w-4 h-4 text-gray-400" />
        {{ $t('otherTools.qr.title') }}
      </h3>
      <div class="space-y-4">
        <textarea 
          v-model="qrText" 
          :placeholder="$t('otherTools.qr.placeholder')"
          class="w-full p-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24 resize-none"
        ></textarea>
        <div class="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[200px] items-center">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="w-48 h-48" />
          <span v-else class="text-gray-400 text-sm">{{ $t('otherTools.qr.waiting') }}</span>
        </div>
        <button 
          @click="downloadQr"
          :disabled="!qrDataUrl"
          class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ $t('otherTools.qr.download') }}
        </button>
      </div>
    </div>

    <!-- Color Converter -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Palette class="w-4 h-4 text-gray-400" />
        {{ $t('otherTools.color.title') }}
      </h3>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('otherTools.color.select') }}</label>
          <div class="flex gap-4 items-center">
            <input 
              type="color" 
              v-model="colorHex" 
              class="w-16 h-16 p-0 border-0 rounded-lg cursor-pointer overflow-hidden"
            />
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-12 text-xs font-medium text-gray-500">HEX</span>
                <input 
                  v-model="colorHex" 
                  type="text" 
                  class="flex-1 rounded border-gray-300 py-1 text-sm font-mono uppercase"
                  maxlength="7"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="w-12 text-xs font-medium text-gray-500">RGB</span>
                <input 
                  :value="colorRgb" 
                  readonly
                  type="text" 
                  class="flex-1 rounded border-gray-300 py-1 text-sm font-mono bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div class="text-xs text-gray-500 mb-2">{{ $t('otherTools.color.preview') }}</div>
          <div 
            class="h-20 rounded-lg shadow-inner transition-colors"
            :style="{ backgroundColor: colorHex }"
          ></div>
        </div>

        <!-- Screen Color Picker -->
        <div class="pt-4 border-t border-gray-100">
          <button 
            @click="pickColor" 
            class="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
          >
            <Pipette class="w-4 h-4" />
            {{ $t('otherTools.color.pickScreen') }}
          </button>
          <p v-if="pickerError" class="text-xs text-red-500 mt-2 text-center">{{ pickerError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import QRCode from 'qrcode'
import { QrCode, Palette } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// QR Code Logic
const qrText = ref('')
const qrDataUrl = ref('')

watch(qrText, async (newVal) => {
  if (!newVal.trim()) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(newVal, { width: 400, margin: 2 })
  } catch (err) {
    console.error(err)
  }
}, { immediate: true })

const downloadQr = () => {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrDataUrl.value
  link.click()
}

// Color Logic
const colorHex = ref('#3b82f6')
const pickerError = ref('')

const colorRgb = computed(() => {
  const hex = colorHex.value.replace('#', '')
  if (hex.length !== 6) return 'Invalid'
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
})

const pickColor = async () => {
  if (!('EyeDropper' in window)) {
    pickerError.value = t('otherTools.color.notSupported')
    return
  }

  try {
    const eyeDropper = new (window as any).EyeDropper()
    const result = await eyeDropper.open()
    colorHex.value = result.sRGBHex
    pickerError.value = ''
  } catch (e) {
    // User cancelled or error
    console.log(e)
  }
}
</script>
