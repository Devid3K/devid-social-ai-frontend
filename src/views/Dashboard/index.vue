<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
      <n-button size="small" @click="refreshAll" :loading="dashboardStore.loading">
        รีเฟรช
      </n-button>
    </div>

    <n-alert v-if="dashboardStore.error" type="error" closable @close="dashboardStore.error = null">
      {{ dashboardStore.error }}
    </n-alert>

    <!-- Overview stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="dashboardStore.loading && !dashboardStore.hasData">
        <n-card v-for="i in 4" :key="i">
          <n-skeleton text :repeat="3" />
        </n-card>
      </template>
      <template v-else>
        <n-card class="border-l-4 border-blue-500">
          <n-statistic label="ผู้ติดตามทั้งหมด" :value="dashboardStore.totalFollowers" tabular-nums>
            <template #prefix>
              <span class="text-blue-500 text-lg mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </span>
            </template>
            <template #suffix>
              <n-tag v-if="dashboardStore.overview?.totalFollowersGrowth" :type="dashboardStore.overview.totalFollowersGrowth >= 0 ? 'success' : 'error'" size="small" round>
                {{ dashboardStore.overview.totalFollowersGrowth >= 0 ? '+' : '' }}{{ dashboardStore.overview.totalFollowersGrowth.toFixed(1) }}%
              </n-tag>
            </template>
          </n-statistic>
        </n-card>

        <n-card class="border-l-4 border-purple-500">
          <n-statistic label="ยอดเข้าชมทั้งหมด" :value="dashboardStore.totalViews" tabular-nums>
            <template #prefix>
              <span class="text-rose-400 text-lg mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </span>
            </template>
            <template #suffix>
              <n-tag v-if="dashboardStore.overview?.totalViewsGrowth" :type="dashboardStore.overview.totalViewsGrowth >= 0 ? 'success' : 'error'" size="small" round>
                {{ dashboardStore.overview.totalViewsGrowth >= 0 ? '+' : '' }}{{ dashboardStore.overview.totalViewsGrowth.toFixed(1) }}%
              </n-tag>
            </template>
          </n-statistic>
        </n-card>

        <n-card class="border-l-4 border-green-500">
          <n-statistic label="รายได้ทั้งหมด" tabular-nums>
            <template #default>
              {{ formatCurrency(dashboardStore.totalRevenue) }}
            </template>
            <template #prefix>
              <span class="text-green-500 text-lg mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
              </span>
            </template>
            <template #suffix>
              <n-tag v-if="dashboardStore.overview?.totalRevenueGrowth" :type="dashboardStore.overview.totalRevenueGrowth >= 0 ? 'success' : 'error'" size="small" round>
                {{ dashboardStore.overview.totalRevenueGrowth >= 0 ? '+' : '' }}{{ dashboardStore.overview.totalRevenueGrowth.toFixed(1) }}%
              </n-tag>
            </template>
          </n-statistic>
        </n-card>

        <n-card class="border-l-4 border-orange-500">
          <n-statistic label="อัตราการมีส่วนร่วม" tabular-nums>
            <template #default>
              {{ dashboardStore.avgEngagement.toFixed(2) }}%
            </template>
            <template #prefix>
              <span class="text-orange-500 text-lg mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              </span>
            </template>
          </n-statistic>
        </n-card>
      </template>
    </div>

    <!-- Platform stat cards -->
    <div v-if="dashboardStore.platformStats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PlatformStatsCard
        v-for="stat in dashboardStore.platformStats"
        :key="stat.platform"
        :platform="stat.platform"
        :followers="stat.followers"
        :views="stat.views"
        :revenue="stat.revenue"
      />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <FollowerGrowthChart :data="dashboardStore.growthData" />
      <RevenueChart :data="dashboardStore.revenueData" />
    </div>

    <!-- AI suggestions + comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PlatformComparisonTable
        :data="dashboardStore.platformComparison.length > 0 ? dashboardStore.platformComparison : dashboardStore.platformStats"
        :loading="dashboardStore.loading"
      />
      <AiSuggestionPanel
        :suggestions="dashboardStore.aiSuggestions"
        :loading="dashboardStore.loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatCurrency } from '@/utils/format'
import PlatformStatsCard from '@/components/dashboard/platform-stats-card.vue'
import FollowerGrowthChart from '@/components/dashboard/follower-growth-chart.vue'
import RevenueChart from '@/components/dashboard/revenue-chart.vue'
import AiSuggestionPanel from '@/components/dashboard/ai-suggestion-panel.vue'
import PlatformComparisonTable from '@/components/dashboard/platform-comparison-table.vue'

const dashboardStore = useDashboardStore()

async function refreshAll() {
  await Promise.all([
    dashboardStore.fetchOverview(),
    dashboardStore.fetchGrowth(),
    dashboardStore.fetchRevenue(),
    dashboardStore.fetchAiSuggestions(),
    dashboardStore.fetchPlatformComparison(),
  ])
}

onMounted(() => {
  refreshAll()
})
</script>
