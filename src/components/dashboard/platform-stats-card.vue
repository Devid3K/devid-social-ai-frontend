<template>
  <n-card class="h-full">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <PlatformIcon :platform="platform" show-label />
        </div>
        <div class="space-y-2">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Followers</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(followers) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Views</p>
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ formatNumber(views) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">
              ฿{{ formatNumber(revenue) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { Platform } from '@/enums'
import PlatformIcon from '@/components/common/platform-icon.vue'

defineProps<{
  platform: Platform
  followers: number
  views: number
  revenue: number
}>()

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
</script>
