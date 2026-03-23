<template>
  <n-card
    class="h-full"
    :style="{ borderLeft: `4px solid ${platformColor}` }"
  >
    <div class="flex items-start gap-3">
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: platformColor + '1A' }"
      >
        <PlatformIcon :platform="platform" :style="{ color: platformColor }" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-300 mb-2">
          {{ getPlatformLabel(platform) }}
        </p>
        <div class="space-y-2">
          <n-statistic label="ผู้ติดตาม" :value="formatNumber(followers)" tabular-nums />
          <n-statistic label="ยอดเข้าชม" :value="formatNumber(views)" tabular-nums />
          <div>
            <p class="text-xs text-gray-500">รายได้</p>
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">
              {{ formatCurrency(revenue) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Platform } from '@/enums'
import { getPlatformLabel, getPlatformColor } from '@/utils/platform'
import { formatNumber, formatCurrency } from '@/utils/format'
import PlatformIcon from '@/components/common/platform-icon.vue'

const props = defineProps<{
  platform: Platform
  followers: number
  views: number
  revenue: number
}>()

const platformColor = computed(() => getPlatformColor(props.platform))
</script>
