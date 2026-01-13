<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
        <h3 class="text-xl font-bold flex items-center gap-2">
          <Heart class="w-6 h-6 text-pink-400" />
          {{ $t('support.title') }}
        </h3>
        <button @click="close" class="text-white/80 hover:text-white transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-6 space-y-8">
        <!-- Donation Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Wallet class="w-5 h-5 text-blue-600" />
            {{ $t('support.donate') }}
          </h4>
          <p class="text-sm text-gray-500">{{ $t('support.donateDesc') }}</p>
          
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center gap-4">
            <!-- QR Code -->
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="USDT Address QR" class="w-32 h-32 rounded-lg shadow-sm" />
            
            <!-- Address -->
            <div class="w-full">
              <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
                <code class="flex-1 text-xs text-gray-600 break-all font-mono">{{ address }}</code>
                <button 
                  @click="copyAddress" 
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors relative group"
                  :title="$t('support.copy')"
                >
                  <Copy v-if="!copied" class="w-4 h-4" />
                  <Check v-else class="w-4 h-4 text-green-500" />
                  
                  <!-- Tooltip -->
                  <span v-if="copied" class="absolute -top-8 right-0 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ $t('support.copied') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Section -->
        <div class="space-y-4 pt-6 border-t border-gray-100">
          <h4 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Code2 class="w-5 h-5 text-indigo-600" />
            {{ $t('support.customDev') }}
          </h4>
          <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p class="text-sm text-indigo-800 mb-2">{{ $t('support.emailDesc') }}</p>
            <a 
              :href="`mailto:${email}`" 
              class="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
            >
              <Mail class="w-4 h-4" />
              {{ email }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Heart, X, Wallet, Copy, Check, Code2, Mail } from 'lucide-vue-next'
import QRCode from 'qrcode'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const address = '0x0df2be856d69c9a20dbe68a90cb052a8397da736'
const email = 'teckrocktop@gmail.com'
const qrDataUrl = ref('')
const copied = ref(false)

const close = () => {
  emit('close')
}

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(address)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

// Generate QR Code on mount or when opened
onMounted(async () => {
  try {
    qrDataUrl.value = await QRCode.toDataURL(address, { 
      width: 200, 
      margin: 1,
      color: {
        dark: '#4F46E5',
        light: '#F9FAFB'
      }
    })
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
