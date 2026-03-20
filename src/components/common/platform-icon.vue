<template>
  <div class="flex items-center gap-1.5">
    <span
      class="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold flex-shrink-0"
      :style="{ backgroundColor: platformColor }"
    >
      {{ platformInitial }}
    </span>
    <span v-if="showLabel" class="text-sm font-medium" :style="{ color: platformColor }">
      {{ platformLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Platform } from '@/enums'

const props = withDefaults(
  defineProps<{
    platform: Platform
    showLabel?: boolean
  }>(),
  { showLabel: false }
)

const platformConfig: Record<Platform, { color: string; label: string; initial: string }> = {
  [Platform.TIKTOK]: { color: '#010101', label: 'TikTok', initial: 'T' },
  [Platform.FACEBOOK]: { color: '#1877F2', label: 'Facebook', initial: 'F' },
  [Platform.INSTAGRAM]: { color: '#E1306C', label: 'Instagram', initial: 'I' },
  [Platform.YOUTUBE]: { color: '#FF0000', label: 'YouTube', initial: 'Y' },
}

const platformColor = computed(() => platformConfig[props.platform]?.color ?? '#6366f1')
const platformLabel = computed(() => platformConfig[props.platform]?.label ?? props.platform)
const platformInitial = computed(() => platformConfig[props.platform]?.initial ?? '?')
</script>
