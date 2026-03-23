<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">วิเคราะห์เทรนด์</h1>
        <p class="text-sm text-slate-400 mt-1">วิเคราะห์ keyword กับ AI เพื่อหาเทรนด์ที่มีศักยภาพ viral</p>
      </div>
      <AiThinkingAnimation v-if="trendStore.analyzing" label="AI กำลังวิเคราะห์..." />
    </div>

    <n-alert v-if="trendStore.error" type="error" closable @close="trendStore.error = null">
      {{ trendStore.error }}
    </n-alert>

    <!-- Analyze form -->
    <n-card title="วิเคราะห์หัวข้อ">
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <n-input
            v-model:value="topic"
            placeholder="ใส่หัวข้อ เช่น สกินแคร์, ลดน้ำหนัก, คาเฟ่"
            class="flex-1"
            size="large"
          />
          <n-select
            v-model:value="selectedPlatforms"
            :options="platformOptions"
            placeholder="แพลตฟอร์ม"
            multiple
            class="w-60"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-3 items-end">
          <n-select
            v-model:value="timeframe"
            :options="timeframeOptions"
            placeholder="ช่วงเวลา"
            class="w-40"
          />
          <n-button
            type="primary"
            :loading="trendStore.analyzing"
            :disabled="!topic"
            size="large"
            @click="handleAnalyze"
          >
            {{ trendStore.analyzing ? 'กำลังวิเคราะห์...' : 'วิเคราะห์เทรนด์' }}
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- Analysis Result -->
    <template v-if="analysis">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Viral Score Meter -->
        <ViralPotentialMeter :score="analysis.viralScore" />

        <!-- Star Rating + Summary -->
        <n-card title="สรุปผลวิเคราะห์" class="sm:col-span-1 lg:col-span-3">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex gap-1">
              <span
                v-for="i in 5"
                :key="i"
                class="text-xl"
              >{{ i <= Math.round(analysis.starRating) ? '⭐' : '☆' }}</span>
            </div>
            <span class="text-sm text-gray-500">{{ analysis.starRating }}/5</span>
          </div>
          <p class="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {{ analysis.analysis }}
          </p>
        </n-card>
      </div>

      <!-- Insights -->
      <n-card v-if="analysis.insights.length" title="Insights">
        <div class="space-y-2">
          <div
            v-for="(insight, i) in analysis.insights"
            :key="i"
            class="flex items-start gap-2"
          >
            <span class="text-rose-400 mt-0.5">💡</span>
            <p class="text-sm text-gray-700">{{ insight }}</p>
          </div>
        </div>
      </n-card>

      <!-- Related Queries + Trend Data -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Hashtags -->
        <HashtagSuggestionList :hashtags="analysis.hashtags" />

        <!-- Related Queries -->
        <n-card title="คำค้นที่เกี่ยวข้อง">
          <div v-if="analysis.relatedQueries.length === 0" class="text-center py-4 text-gray-400 text-sm">
            ไม่มีข้อมูลคำค้นที่เกี่ยวข้อง
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <n-tag
              v-for="q in analysis.relatedQueries"
              :key="q"
              size="medium"
              class="cursor-pointer"
              @click="searchRelated(q)"
            >
              {{ q }}
            </n-tag>
          </div>
        </n-card>
      </div>

      <!-- Google Trends Chart -->
      <n-card v-if="analysis.trendData.length" title="Google Trends">
        <div class="h-48 flex items-end gap-1">
          <div
            v-for="(d, i) in analysis.trendData.slice(-30)"
            :key="i"
            class="flex-1 bg-indigo-500 dark:bg-indigo-400 rounded-t transition-all duration-300 min-w-1"
            :style="{ height: `${Math.max(d.value, 2)}%` }"
            :title="`${d.date}: ${d.value}`"
          />
        </div>
        <p class="text-xs text-gray-400 mt-2 text-center">
          ข้อมูลจาก Google Trends — ค่าสูงสุด = 100
        </p>
      </n-card>
    </template>

    <!-- Trending Hashtags (always visible) -->
    <n-card title="Hashtag มาแรง">
      <template #header-extra>
        <n-button size="small" @click="trendStore.fetchHashtags()">
          รีเฟรช
        </n-button>
      </template>
      <LoadingSpinner v-if="trendStore.loading && !trendStore.hashtags.length" size="small" />
      <div v-else-if="trendStore.hashtags.length === 0" class="text-center py-4 text-gray-400 text-sm">
        ยังไม่มีข้อมูล — กดรีเฟรชเพื่อโหลด
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b dark:border-gray-700">
              <th class="py-2 px-2">Hashtag</th>
              <th class="py-2 px-2 text-right">ยอดวิว</th>
              <th class="py-2 px-2 text-right">วิดีโอ</th>
              <th class="py-2 px-2 text-center">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h in trendStore.hashtags.slice(0, 15)"
              :key="h.tag"
              class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="py-2 px-2 font-medium text-rose-400 dark:text-rose-300">
                #{{ h.tag }}
              </td>
              <td class="py-2 px-2 text-right text-gray-500">
                {{ formatNumber(h.viewCount) }}
              </td>
              <td class="py-2 px-2 text-right text-gray-500">
                {{ formatNumber(h.videoCount) }}
              </td>
              <td class="py-2 px-2 text-center">
                <n-tag :type="trendTagType(h.trend)" size="small">
                  {{ trendLabel(h.trend) }}
                </n-tag>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </n-card>

    <!-- TikTok Products -->
    <n-card title="สินค้า TikTok Shop มาแรง">
      <template #header-extra>
        <n-button size="small" @click="trendStore.fetchTikTokProducts()">
          โหลดข้อมูล
        </n-button>
      </template>
      <div v-if="trendStore.tiktokProducts.length === 0" class="text-center py-4 text-gray-400 text-sm">
        กดปุ่ม "โหลดข้อมูล" เพื่อดูสินค้าที่กำลังเทรนด์
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <n-card
          v-for="p in trendStore.tiktokProducts"
          :key="p.id"
          size="small"
          hoverable
        >
          <div class="space-y-1">
            <p class="font-medium text-sm text-gray-900">{{ p.name }}</p>
            <div class="flex items-center gap-2">
              <n-tag size="small">{{ p.category }}</n-tag>
              <ViralScoreBadge :score="p.trendScore" />
            </div>
            <div class="grid grid-cols-2 gap-1 text-xs text-gray-500 mt-2">
              <span>ยอดขาย: {{ formatNumber(p.salesVolume) }}</span>
              <span>คอมมิชชั่น: {{ p.commissionRate }}%</span>
              <span>วิดีโอ: {{ formatNumber(p.videoCount) }}</span>
            </div>
          </div>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTrendStore } from '@/stores/trend'
import type { TrendAnalysisResult } from '@/types/trend.d'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'
import ViralPotentialMeter from '@/components/trend/viral-potential-meter.vue'
import HashtagSuggestionList from '@/components/trend/hashtag-suggestion-list.vue'
import ViralScoreBadge from '@/components/common/viral-score-badge.vue'

const trendStore = useTrendStore()

const topic = ref('')
const selectedPlatforms = ref<string[]>(['tiktok'])
const timeframe = ref('7d')
const analysis = ref<TrendAnalysisResult | null>(null)

const platformOptions = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Facebook', value: 'facebook' },
]

const timeframeOptions = [
  { label: '24 ชั่วโมง', value: '24h' },
  { label: '7 วัน', value: '7d' },
  { label: '30 วัน', value: '30d' },
  { label: '90 วัน', value: '90d' },
]

onMounted(() => {
  trendStore.fetchHashtags()
})

async function handleAnalyze() {
  if (!topic.value) return
  const result = await trendStore.analyzeTrend({
    topic: topic.value,
    platforms: selectedPlatforms.value,
    timeframe: timeframe.value as any,
    region: 'TH',
  })
  analysis.value = result
}

function searchRelated(query: string) {
  topic.value = query
  handleAnalyze()
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function trendTagType(trend: string) {
  if (trend === 'rising') return 'success'
  if (trend === 'falling') return 'error'
  return 'default'
}

function trendLabel(trend: string) {
  const map: Record<string, string> = { rising: 'มาแรง', stable: 'คงที่', falling: 'ลดลง' }
  return map[trend] ?? trend
}
</script>
