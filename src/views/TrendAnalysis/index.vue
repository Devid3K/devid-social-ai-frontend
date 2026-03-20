<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Trend Analysis</h1>

    <n-alert v-if="trendStore.error" type="error" :title="trendStore.error" closable />

    <!-- Analyze form -->
    <n-card title="Analyze a Topic">
      <div class="flex flex-col sm:flex-row gap-3">
        <n-input
          v-model:value="topic"
          placeholder="Enter topic (e.g. skincare, fitness)"
          class="flex-1"
        />
        <n-select
          v-model:value="platform"
          :options="platformOptions"
          placeholder="Platform"
          class="w-40"
        />
        <n-button
          type="primary"
          :loading="trendStore.loading"
          :disabled="!topic || !platform"
          @click="handleAnalyze"
        >
          Analyze
        </n-button>
      </div>
      <div v-if="analysisResult" class="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ JSON.stringify(analysisResult, null, 2) }}</pre>
      </div>
    </n-card>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Viral potential -->
      <ViralPotentialMeter v-if="viralScore != null" :score="viralScore" />

      <!-- Trend chart -->
      <div class="sm:col-span-2 lg:col-span-3">
        <TrendChart :data="trendStore.list" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Hashtags -->
      <HashtagSuggestionList :hashtags="hashtagNames" />

      <!-- Radar -->
      <PlatformTrendRadar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTrendStore } from '@/stores/trend'
import { Platform } from '@/enums'
import TrendChart from '@/components/trend/trend-chart.vue'
import ViralPotentialMeter from '@/components/trend/viral-potential-meter.vue'
import HashtagSuggestionList from '@/components/trend/hashtag-suggestion-list.vue'
import PlatformTrendRadar from '@/components/trend/platform-trend-radar.vue'

const trendStore = useTrendStore()
const topic = ref('')
const platform = ref<Platform | null>(null)
const analysisResult = ref<unknown>(null)
const viralScore = ref<number | null>(null)

const platformOptions = Object.values(Platform).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}))

const hashtagNames = computed(() =>
  trendStore.hashtags.map((h: any) => h.tag ?? h.name ?? h)
)

onMounted(() => {
  trendStore.fetch()
})

async function handleAnalyze() {
  if (!topic.value || !platform.value) return
  const result = await trendStore.analyzeTrend({ topic: topic.value, platform: platform.value })
  analysisResult.value = result
  viralScore.value = (result as any)?.viralScore ?? null
}
</script>
