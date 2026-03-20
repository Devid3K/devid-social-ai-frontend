<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

    <n-alert v-if="dashboardStore.error" type="error" :title="dashboardStore.error" closable />

    <!-- Platform stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="dashboardStore.loading && !dashboardStore.hasData">
        <n-card v-for="i in 4" :key="i">
          <n-skeleton text :repeat="3" />
        </n-card>
      </template>
      <template v-else-if="platformStats.length > 0">
        <PlatformStatsCard
          v-for="stat in platformStats"
          :key="stat.platform"
          :platform="stat.platform"
          :followers="stat.followers"
          :views="stat.views"
          :revenue="stat.revenue"
        />
      </template>
      <template v-else>
        <n-card v-for="i in 4" :key="i" class="flex items-center justify-center h-32">
          <span class="text-gray-400 text-sm">No data</span>
        </n-card>
      </template>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <FollowerGrowthChart :data="dashboardStore.growthData" />
      <RevenueChart :data="dashboardStore.revenueData" />
    </div>

    <!-- AI suggestions + comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AiSuggestionPanel
        :suggestions="dashboardStore.aiSuggestions"
        :loading="dashboardStore.loading"
      />
      <PlatformComparisonTable :data="platformStats" :loading="dashboardStore.loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { Platform } from '@/enums'
import PlatformStatsCard from '@/components/dashboard/platform-stats-card.vue'
import FollowerGrowthChart from '@/components/dashboard/follower-growth-chart.vue'
import RevenueChart from '@/components/dashboard/revenue-chart.vue'
import AiSuggestionPanel from '@/components/dashboard/ai-suggestion-panel.vue'
import PlatformComparisonTable from '@/components/dashboard/platform-comparison-table.vue'

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchOverview(),
    dashboardStore.fetchGrowth(),
    dashboardStore.fetchRevenue(),
    dashboardStore.fetchAiSuggestions(),
  ])
})

const platformStats = computed(() => {
  const overview = dashboardStore.overview as any
  if (!overview?.platforms) return []
  return overview.platforms.map((p: any) => ({
    platform: p.platform as Platform,
    followers: p.followers ?? 0,
    views: p.views ?? 0,
    revenue: p.revenue ?? 0,
  }))
})
</script>
