<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6 text-center">
      <Presentation class="mx-auto h-12 w-12 text-orange-500 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('docTools.ppt.title') }}</h3>
      <p class="text-gray-500 mb-6">
        Features: {{ t('docTools.ppt.extractImages') }}
      </p>
      <div class="text-sm text-gray-400">Implementation in progress...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Presentation } from 'lucide-vue-next'

const { t } = useI18n()
</script>
